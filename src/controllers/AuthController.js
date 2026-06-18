const authService = require("../services/AuthService");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
};

const register = asyncHandler(async (req, res) => {
  const { name, email, password, phone } = req.body;
  const user = await authService.register({ name, email, password, phone });
  
  return res
    .status(201)
    .json(new ApiResponse(201, user, "Registration successful. Please verify your email."));
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const { user, accessToken, refreshToken } = await authService.login(email, password);

  return res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .json(
      new ApiResponse(
        200,
        { user, accessToken, refreshToken },
        "Login successful"
      )
    );
});

const logout = asyncHandler(async (req, res) => {
  const user = req.user;
  user.refreshToken = undefined;
  await user.save();

  return res
    .status(200)
    .clearCookie("accessToken", cookieOptions)
    .clearCookie("refreshToken", cookieOptions)
    .json(new ApiResponse(200, {}, "Logout successful"));
});

const refresh = asyncHandler(async (req, res) => {
  const token = req.cookies?.refreshToken || req.body.refreshToken;
  const { accessToken, refreshToken: newRefreshToken } = await authService.refreshToken(token);

  return res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", newRefreshToken, cookieOptions)
    .json(
      new ApiResponse(
        200,
        { accessToken, refreshToken: newRefreshToken },
        "Token refreshed successfully"
      )
    );
});

const verifyEmail = asyncHandler(async (req, res) => {
  const { token } = req.query;
  await authService.verifyEmail(token);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Email verified successfully"));
});

const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  await authService.forgotPassword(email);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password reset email sent"));
});

const resetPassword = asyncHandler(async (req, res) => {
  const { token, password } = req.body;
  await authService.resetPassword(token, password);

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password reset successfully"));
});

module.exports = {
  register,
  login,
  logout,
  refresh,
  verifyEmail,
  forgotPassword,
  resetPassword,
};

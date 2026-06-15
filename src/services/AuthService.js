const crypto = require("crypto");
const userRepository = require("../repositories/UserRepository");
const ApiError = require("../utils/ApiError");
const emailService = require("./EmailService");

class AuthService {
  async register({ name, email, password, phone }) {
    const existing = await userRepository.findByEmail(email);
    if (existing) {
      throw new ApiError(400, "Account already registered under this email");
    }

    const verificationToken = crypto.randomBytes(32).toString("hex");

    const user = await userRepository.create({
      name,
      email,
      password,
      phone,
      verificationToken,
    });

    // Send verification email
    await emailService.sendVerificationEmail(email, verificationToken);

    return user;
  }

  async login(email, password) {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw new ApiError(401, "Invalid credentials profile");
    }

    if (user.isBlocked) {
      throw new ApiError(403, "Account access suspended. Consult support.");
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new ApiError(401, "Invalid credentials password");
    }

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save();

    return { user, accessToken, refreshToken };
  }

  async refreshToken(token) {
    if (!token) {
      throw new ApiError(401, "Token required");
    }

    const user = await userRepository.findByRefreshToken(token);
    if (!user) {
      throw new ApiError(403, "Invalid refresh session token");
    }

    const accessToken = user.generateAccessToken();
    const newRefreshToken = user.generateRefreshToken();

    user.refreshToken = newRefreshToken;
    await user.save();

    return { accessToken, refreshToken: newRefreshToken };
  }

  async verifyEmail(token) {
    const user = await userRepository.findOne({ verificationToken: token });
    if (!user) {
      throw new ApiError(400, "Invalid verification token details");
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();
    return true;
  }

  async forgotPassword(email) {
    const user = await userRepository.findByEmail(email);
    if (!user) {
      throw new ApiError(404, "User profile not found");
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpire = Date.now() + 3600000; // 1 hour expiration
    await user.save();

    await emailService.sendResetPasswordEmail(email, resetToken);
    return true;
  }

  async resetPassword(token, newPassword) {
    const user = await userRepository.findOne({
      resetPasswordToken: token,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      throw new ApiError(400, "Reset token invalid or expired");
    }

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();
    return true;
  }
}

module.exports = new AuthService();

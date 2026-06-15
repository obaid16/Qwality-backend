const jwt = require("jsonwebtoken");
const userRepository = require("../repositories/UserRepository");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");

const verifyJWT = asyncHandler(async (req, res, next) => {
  const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
  
  if (!token) {
    throw new ApiError(401, "Unauthorized request. Token is missing.");
  }

  try {
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await userRepository.findById(decodedToken._id);

    if (!user) {
      throw new ApiError(401, "Invalid Access Token. User not found.");
    }

    if (user.isBlocked) {
      throw new ApiError(403, "Your account has been suspended.");
    }

    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid Access Token");
  }
});

const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      throw new ApiError(403, `User role '${req.user?.role}' is not authorized to access this resource`);
    }
    next();
  };
};

module.exports = {
  verifyJWT,
  authorizeRoles,
};

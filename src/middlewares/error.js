const ApiError = require("../utils/ApiError");

const errorHandler = (err, req, res, next) => {
  let error = err;

  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || error.name === "ValidationError" ? 400 : 500;
    const message = error.message || "Internal Server Error";
    error = new ApiError(statusCode, message, error.errors || [], err.stack);
  }

  const response = {
    success: false,
    message: error.message,
    errors: error.errors,
    ...(process.env.NODE_ENV === "development" && { stack: error.stack }),
  };

  // Log error in development or production for debugging
  if (!error.statusCode || error.statusCode >= 500) {
    console.error("Backend Error Handler caught:", err);
  } else {
    console.warn(`[Client Error] ${error.statusCode} - ${error.message} (Path: ${req.method} ${req.originalUrl})`);
  }

  res.status(error.statusCode || 500).json(response);
};

module.exports = errorHandler;

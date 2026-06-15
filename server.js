require("dotenv").config({ override: true });
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");
const morgan = require("morgan");

const errorHandler = require("./src/middlewares/error");
const ApiError = require("./src/utils/ApiError");

const app = express();

// Security Middlewares
app.use(helmet());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    credentials: true,
  })
);

// Standard parsers
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());

// Request logger in dev
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

// Global Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === "production" ? 100 : 10000, // Limit each IP to 100 requests per windowMs in production, 10000 in dev
  message: {
    success: false,
    message: "Too many requests from this IP, please try again after 15 minutes",
  },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/api", limiter);

// Basic Health Check Route
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Quality Caps backend API running smoothly",
    timestamp: new Date(),
  });
});

// Routes Placeholder (will import routes/index.js next)
const apiRoutes = require("./src/routes");
app.use("/api/v1", apiRoutes);

// Catch-all 404 Route
app.use("*", (req, res, next) => {
  next(new ApiError(404, `Route ${req.originalUrl} not found`));
});

// Global Error Handler
app.use(errorHandler);

const connectDB = require("./src/config/db");

const PORT = process.env.PORT || 8000;

// Connect DB and Start Server
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server executing in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("MongoDB connection failed !!! ", err);
  });

module.exports = app; // Trigger nodemon restart (port 5000)

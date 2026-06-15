const express = require("express");
const router = express.Router();
const {
  register,
  login,
  logout,
  refresh,
  verifyEmail,
  forgotPassword,
  resetPassword,
} = require("../controllers/AuthController");
const {
  registerValidator,
  loginValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
} = require("../validators/authValidator");
const { verifyJWT } = require("../middlewares/auth");

router.post("/register", registerValidator, register);
router.post("/login", loginValidator, login);
router.post("/logout", verifyJWT, logout);
router.post("/refresh-token", refresh);
router.get("/verify-email", verifyEmail);
router.post("/forgot-password", forgotPasswordValidator, forgotPassword);
router.post("/reset-password", resetPasswordValidator, resetPassword);

module.exports = router;

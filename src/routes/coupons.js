const express = require("express");
const router = express.Router();
const {
  validateCoupon,
  createCoupon,
  getAllCoupons,
  deleteCoupon,
} = require("../controllers/CouponController");
const { createCouponValidator } = require("../validators/couponValidator");
const { verifyJWT, authorizeRoles } = require("../middlewares/auth");

// Customer/Admin validation check
router.post("/validate", verifyJWT, validateCoupon);

// Admin-only management
router.post("/", verifyJWT, authorizeRoles("admin"), createCouponValidator, createCoupon);
router.get("/", verifyJWT, authorizeRoles("admin"), getAllCoupons);
router.delete("/:id", verifyJWT, authorizeRoles("admin"), deleteCoupon);

module.exports = router;

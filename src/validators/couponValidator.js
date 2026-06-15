const { body } = require("express-validator");
const validate = require("./validate");

const createCouponValidator = [
  body("code")
    .trim()
    .notEmpty()
    .withMessage("Coupon code is required")
    .toUpperCase(),
  body("discountType")
    .isIn(["percentage", "flat"])
    .withMessage("Discount type must be either percentage or flat"),
  body("discountValue")
    .isFloat({ min: 0 })
    .withMessage("Discount value must be a positive number"),
  body("expiryDate")
    .isISO8601()
    .withMessage("Expiry date must be a valid ISO8601 date format"),
  body("minOrderAmount")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Minimum order amount must be a positive number"),
  body("maxDiscountAmount")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Maximum discount amount must be a positive number"),
  body("usageLimit")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Usage limit must be a non-negative integer"),
  validate,
];

module.exports = {
  createCouponValidator,
};

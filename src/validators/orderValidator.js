const { body } = require("express-validator");
const validate = require("./validate");

const placeOrderValidator = [
  body("items")
    .isArray({ min: 1 })
    .withMessage("Items must be a non-empty array"),
  body("items.*.product")
    .isMongoId()
    .withMessage("Product ID must be a valid Mongo ID"),
  body("items.*.quantity")
    .isInt({ min: 1 })
    .withMessage("Quantity must be a positive integer"),
  body("shippingAddress")
    .notEmpty()
    .withMessage("Shipping address is required"),
  body("shippingAddress.name")
    .trim()
    .notEmpty()
    .withMessage("Shipping name is required"),
  body("shippingAddress.street")
    .trim()
    .notEmpty()
    .withMessage("Shipping street is required"),
  body("shippingAddress.city")
    .trim()
    .notEmpty()
    .withMessage("Shipping city is required"),
  body("shippingAddress.state")
    .trim()
    .notEmpty()
    .withMessage("Shipping state is required"),
  body("shippingAddress.zip")
    .trim()
    .notEmpty()
    .withMessage("Shipping ZIP is required"),
  body("shippingAddress.country")
    .trim()
    .notEmpty()
    .withMessage("Shipping country is required"),
  body("paymentMethod")
    .isIn(["cod", "razorpay"])
    .withMessage("Payment method must be either cod or razorpay"),
  validate,
];

module.exports = {
  placeOrderValidator,
};

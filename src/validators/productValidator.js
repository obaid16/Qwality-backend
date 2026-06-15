const { body } = require("express-validator");
const validate = require("./validate");

const createProductValidator = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Product name is required"),
  body("description")
    .trim()
    .notEmpty()
    .withMessage("Product description is required"),
  body("category")
    .isMongoId()
    .withMessage("Valid category ID is required"),
  body("sku")
    .trim()
    .notEmpty()
    .withMessage("Product SKU is required"),
  body("price")
    .isFloat({ min: 0 })
    .withMessage("Price must be a positive number"),
  body("salePrice")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Sale price must be a positive number"),
  body("stock")
    .isInt({ min: 0 })
    .withMessage("Stock must be a non-negative integer"),
  body("images")
    .isArray({ min: 1 })
    .withMessage("At least one product image is required"),
  validate,
];

const updateProductValidator = [
  body("name")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Product name cannot be empty"),
  body("description")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Product description cannot be empty"),
  body("category")
    .optional()
    .isMongoId()
    .withMessage("Valid category ID is required"),
  body("sku")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Product SKU cannot be empty"),
  body("price")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Price must be a positive number"),
  body("salePrice")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Sale price must be a positive number"),
  body("stock")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Stock must be a non-negative integer"),
  validate,
];

module.exports = {
  createProductValidator,
  updateProductValidator,
};

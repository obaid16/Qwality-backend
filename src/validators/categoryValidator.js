const { body } = require("express-validator");
const validate = require("./validate");

const createCategoryValidator = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Category name is required"),
  body("parentCategory")
    .optional({ nullable: true })
    .isMongoId()
    .withMessage("Valid parentCategory ID is required if provided"),
  body("image")
    .optional()
    .trim(),
  validate,
];

module.exports = {
  createCategoryValidator,
};

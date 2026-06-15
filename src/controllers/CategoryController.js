const categoryService = require("../services/CategoryService");
const categoryRepository = require("../repositories/CategoryRepository");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");

const createCategory = asyncHandler(async (req, res) => {
  const category = await categoryService.createCategory(req.body);
  return res
    .status(201)
    .json(new ApiResponse(201, category, "Category created successfully"));
});

const getCategoriesTree = asyncHandler(async (req, res) => {
  const tree = await categoryService.getCategoriesTree();
  return res
    .status(200)
    .json(new ApiResponse(200, tree, "Category hierarchy tree fetched successfully"));
});

const getAllCategories = asyncHandler(async (req, res) => {
  const categories = await categoryRepository.model.find({});
  return res
    .status(200)
    .json(new ApiResponse(200, categories, "All categories fetched successfully"));
});

const getCategoryById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const category = await categoryRepository.findById(id);
  if (!category) {
    throw new ApiError(404, "Category not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, category, "Category details fetched successfully"));
});

const getCategoryBySlug = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const category = await categoryRepository.findBySlug(slug);
  if (!category) {
    throw new ApiError(404, "Category not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, category, "Category details fetched successfully"));
});

const deleteCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  // Check if subcategories exist
  const subcategories = await categoryRepository.findChildren(id);
  if (subcategories.length > 0) {
    throw new ApiError(400, "Cannot delete category that has subcategories");
  }

  const category = await categoryRepository.deleteById(id);
  if (!category) {
    throw new ApiError(404, "Category not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Category deleted successfully"));
});

module.exports = {
  createCategory,
  getCategoriesTree,
  getAllCategories,
  getCategoryById,
  getCategoryBySlug,
  deleteCategory,
};

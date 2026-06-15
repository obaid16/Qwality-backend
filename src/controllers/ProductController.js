const productService = require("../services/ProductService");
const productRepository = require("../repositories/ProductRepository");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");

const createProduct = asyncHandler(async (req, res) => {
  const product = await productService.createProduct(req.body);
  return res
    .status(201)
    .json(new ApiResponse(201, product, "Product created successfully"));
});

const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const product = await productService.updateProduct(id, req.body);
  return res
    .status(200)
    .json(new ApiResponse(200, product, "Product updated successfully"));
});

const getProducts = asyncHandler(async (req, res) => {
  const { page, limit, sort, category, search, minPrice, maxPrice, isFeatured } = req.query;
  const filters = { category, search, minPrice, maxPrice, isFeatured };
  
  // parse sort parameter (e.g., sort=price,-createdAt)
  let sortOption = { createdAt: -1 };
  if (sort) {
    sortOption = {};
    sort.split(",").forEach((field) => {
      if (field.startsWith("-")) {
        sortOption[field.substring(1)] = -1;
      } else {
        sortOption[field] = 1;
      }
    });
  }

  const options = {
    page: page ? Number(page) : 1,
    limit: limit ? Number(limit) : 10,
    sort: sortOption,
    populate: "category",
  };

  const result = await productService.getProducts(filters, options);
  return res
    .status(200)
    .json(new ApiResponse(200, result, "Products fetched successfully"));
});

const getProductById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const product = await productService.getProductById(id);
  return res
    .status(200)
    .json(new ApiResponse(200, product, "Product details fetched successfully"));
});

const getProductBySlug = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const product = await productRepository.findOne({ slug, isDeleted: false }, "category");
  if (!product) {
    throw new ApiError(404, "Product not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, product, "Product details fetched successfully"));
});

const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await productService.deleteProduct(id);
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Product deleted successfully"));
});

const bulkDeleteProducts = asyncHandler(async (req, res) => {
  const { ids } = req.body;
  await productService.bulkDelete(ids);
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Products deleted in bulk successfully"));
});

const bulkUpdateProducts = asyncHandler(async (req, res) => {
  const { ids, updateData } = req.body;
  const result = await productService.bulkUpdate(ids, updateData);
  return res
    .status(200)
    .json(new ApiResponse(200, result, "Products updated in bulk successfully"));
});

module.exports = {
  createProduct,
  updateProduct,
  getProducts,
  getProductById,
  getProductBySlug,
  deleteProduct,
  bulkDeleteProducts,
  bulkUpdateProducts,
};

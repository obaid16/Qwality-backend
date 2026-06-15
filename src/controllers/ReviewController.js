const mongoose = require("mongoose");
const Review = require("../models/Review");
const Product = require("../models/Product");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");

const createReview = asyncHandler(async (req, res) => {
  const { productId, rating, title, comment } = req.body;
  const userId = req.user._id;

  if (!productId || !rating || !comment) {
    throw new ApiError(400, "Product ID, rating (1-5), and comment are required");
  }

  // Check if product exists
  const product = await Product.findById(productId);
  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  // Check if user already reviewed
  const existingReview = await Review.findOne({ user: userId, product: productId });
  if (existingReview) {
    throw new ApiError(400, "You have already reviewed this product");
  }

  const review = await Review.create({
    user: userId,
    product: productId,
    rating: Number(rating),
    title,
    comment,
  });

  // Calculate and update average rating / review count
  const metrics = await Review.aggregate([
    { $match: { product: new mongoose.Types.ObjectId(productId) } },
    {
      $group: {
        _id: null,
        averageRating: { $avg: "$rating" },
        totalReviews: { $sum: 1 },
      },
    },
  ]);

  if (metrics.length > 0) {
    product.rating = Number(metrics[0].averageRating.toFixed(1));
    product.reviewCount = metrics[0].totalReviews;
    await product.save();
  }

  return res
    .status(201)
    .json(new ApiResponse(201, review, "Review added successfully"));
});

const getProductReviews = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const { page = 1, limit = 10 } = req.query;

  const skip = (Number(page) - 1) * Number(limit);

  const reviews = await Review.find({ product: productId })
    .populate("user", "name")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit));

  const total = await Review.countDocuments({ product: productId });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        {
          items: reviews,
          total,
          page: Number(page),
          limit: Number(limit),
          totalPages: Math.ceil(total / Number(limit)),
        },
        "Reviews fetched successfully"
      )
    );
});

module.exports = {
  createReview,
  getProductReviews,
};

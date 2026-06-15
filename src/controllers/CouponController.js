const couponService = require("../services/CouponService");
const couponRepository = require("../repositories/CouponRepository");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");

const validateCoupon = asyncHandler(async (req, res) => {
  const { code, orderAmount } = req.body;
  if (!code) {
    throw new ApiError(400, "Coupon code is required");
  }
  const coupon = await couponService.validateCoupon(code, Number(orderAmount || 0));
  return res
    .status(200)
    .json(new ApiResponse(200, coupon, "Coupon is valid and active"));
});

const createCoupon = asyncHandler(async (req, res) => {
  const coupon = await couponRepository.create(req.body);
  return res
    .status(201)
    .json(new ApiResponse(201, coupon, "Coupon created successfully"));
});

const getAllCoupons = asyncHandler(async (req, res) => {
  const coupons = await couponRepository.model.find({});
  return res
    .status(200)
    .json(new ApiResponse(200, coupons, "All coupons fetched successfully"));
});

const deleteCoupon = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const coupon = await couponRepository.deleteById(id);
  if (!coupon) {
    throw new ApiError(404, "Coupon not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Coupon deleted successfully"));
});

module.exports = {
  validateCoupon,
  createCoupon,
  getAllCoupons,
  deleteCoupon,
};

const paymentService = require("../services/PaymentService");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");

const createOrder = asyncHandler(async (req, res) => {
  const { amount } = req.body;
  if (!amount || Number(amount) <= 0) {
    throw new ApiError(400, "Valid payment amount is required");
  }

  const razorpayOrder = await paymentService.createRazorpayOrder(Number(amount));
  return res
    .status(200)
    .json(new ApiResponse(200, razorpayOrder, "Razorpay order created successfully"));
});

module.exports = {
  createOrder,
};

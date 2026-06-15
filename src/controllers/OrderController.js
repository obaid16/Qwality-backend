const orderService = require("../services/OrderService");
const orderRepository = require("../repositories/OrderRepository");
const userRepository = require("../repositories/UserRepository");
const productRepository = require("../repositories/ProductRepository");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");

const placeOrder = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const order = await orderService.placeOrder(userId, req.body);
  return res
    .status(201)
    .json(new ApiResponse(201, order, "Order placed successfully"));
});

const getMyOrders = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { page, limit } = req.query;
  const options = {
    page: page ? Number(page) : 1,
    limit: limit ? Number(limit) : 10,
    sort: { createdAt: -1 },
  };
  const orders = await orderRepository.find({ user: userId }, options);
  return res
    .status(200)
    .json(new ApiResponse(200, orders, "User orders fetched successfully"));
});

const getOrderById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const order = await orderRepository.findById(id, "user items.product");
  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  // Authorize: customer can only fetch their own, admin can fetch any
  if (req.user.role !== "admin" && order.user._id.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Not authorized to view this order");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, order, "Order details fetched successfully"));
});

const getAllOrders = asyncHandler(async (req, res) => {
  const { page, limit, status } = req.query;
  const query = {};
  if (status) {
    query.status = status;
  }
  const options = {
    page: page ? Number(page) : 1,
    limit: limit ? Number(limit) : 10,
    sort: { createdAt: -1 },
    populate: "user",
  };
  const result = await orderRepository.find(query, options);
  return res
    .status(200)
    .json(new ApiResponse(200, result, "All orders fetched successfully"));
});

const updateOrderStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status, comment } = req.body;
  const order = await orderService.updateOrderStatus(id, status, comment);
  return res
    .status(200)
    .json(new ApiResponse(200, order, `Order status updated to ${status}`));
});

const getDashboardMetrics = asyncHandler(async (req, res) => {
  const revenueMetrics = await orderRepository.getRevenueMetrics();
  const monthlyRevenue = await orderRepository.getMonthlyRevenue();
  const topSelling = await orderRepository.getTopSellingProducts();
  
  const totalCustomers = await userRepository.model.countDocuments({ role: "customer" });
  const totalProducts = await productRepository.model.countDocuments({ isDeleted: false });

  const metrics = {
    totalRevenue: revenueMetrics.totalRevenue,
    totalOrders: revenueMetrics.totalOrders,
    monthlyRevenue,
    topSelling,
    totalCustomers,
    totalProducts,
  };

  return res
    .status(200)
    .json(new ApiResponse(200, metrics, "Dashboard metrics calculated successfully"));
});

module.exports = {
  placeOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  getDashboardMetrics,
};

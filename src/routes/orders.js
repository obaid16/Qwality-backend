const express = require("express");
const router = express.Router();
const {
  placeOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  getDashboardMetrics,
} = require("../controllers/OrderController");
const { placeOrderValidator } = require("../validators/orderValidator");
const { verifyJWT, authorizeRoles } = require("../middlewares/auth");

// Secured Customer & Admin routes
router.post("/", verifyJWT, placeOrderValidator, placeOrder);
router.get("/my-orders", verifyJWT, getMyOrders);
router.get("/:id", verifyJWT, getOrderById);

// Admin-only routes
router.get("/", verifyJWT, authorizeRoles("admin"), getAllOrders);
router.put("/:id/status", verifyJWT, authorizeRoles("admin"), updateOrderStatus);
router.get("/admin/dashboard-metrics", verifyJWT, authorizeRoles("admin"), getDashboardMetrics);

module.exports = router;

const express = require("express");
const router = express.Router();
const {
  createProduct,
  updateProduct,
  getProducts,
  getProductById,
  getProductBySlug,
  deleteProduct,
  bulkDeleteProducts,
  bulkUpdateProducts,
} = require("../controllers/ProductController");
const {
  createProductValidator,
  updateProductValidator,
} = require("../validators/productValidator");
const { verifyJWT, authorizeRoles } = require("../middlewares/auth");

// Public routes
router.get("/", getProducts);
router.get("/:id", getProductById);
router.get("/slug/:slug", getProductBySlug);

// Admin-only routes
router.post("/", verifyJWT, authorizeRoles("admin"), createProductValidator, createProduct);
router.put("/:id", verifyJWT, authorizeRoles("admin"), updateProductValidator, updateProduct);
router.delete("/:id", verifyJWT, authorizeRoles("admin"), deleteProduct);
router.post("/bulk-delete", verifyJWT, authorizeRoles("admin"), bulkDeleteProducts);
router.post("/bulk-update", verifyJWT, authorizeRoles("admin"), bulkUpdateProducts);

module.exports = router;

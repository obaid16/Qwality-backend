const express = require("express");
const router = Router = express.Router();
const {
  createCategory,
  getCategoriesTree,
  getAllCategories,
  getCategoryById,
  getCategoryBySlug,
  deleteCategory,
} = require("../controllers/CategoryController");
const { createCategoryValidator } = require("../validators/categoryValidator");
const { verifyJWT, authorizeRoles } = require("../middlewares/auth");

// Public routes
router.get("/tree", getCategoriesTree);
router.get("/", getAllCategories);
router.get("/:id", getCategoryById);
router.get("/slug/:slug", getCategoryBySlug);

// Admin-only routes
router.post("/", verifyJWT, authorizeRoles("admin"), createCategoryValidator, createCategory);
router.delete("/:id", verifyJWT, authorizeRoles("admin"), deleteCategory);

module.exports = router;

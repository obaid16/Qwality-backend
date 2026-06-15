const express = require("express");
const router = express.Router();
const {
  getProfile,
  updateProfile,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
  getAllUsers,
  toggleUserBlock,
  deleteUser,
} = require("../controllers/UserController");
const { verifyJWT, authorizeRoles } = require("../middlewares/auth");

// Secured user profile routes
router.get("/profile", verifyJWT, getProfile);
router.put("/profile", verifyJWT, updateProfile);

// Address book routes
router.post("/addresses", verifyJWT, addAddress);
router.put("/addresses/:addressId", verifyJWT, updateAddress);
router.delete("/addresses/:addressId", verifyJWT, deleteAddress);
router.patch("/addresses/:addressId/default", verifyJWT, setDefaultAddress);

// Admin-only user management
router.get("/", verifyJWT, authorizeRoles("admin"), getAllUsers);
router.put("/:id/block", verifyJWT, authorizeRoles("admin"), toggleUserBlock);
router.delete("/:id", verifyJWT, authorizeRoles("admin"), deleteUser);

module.exports = router;

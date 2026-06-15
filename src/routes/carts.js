const express = require("express");
const router = express.Router();
const {
  getCart,
  addToCart,
  updateQuantity,
  removeFromCart,
} = require("../controllers/CartController");
const { verifyJWT } = require("../middlewares/auth");

router.get("/", verifyJWT, getCart);
router.post("/add", verifyJWT, addToCart);
router.put("/update", verifyJWT, updateQuantity);
router.post("/remove", verifyJWT, removeFromCart);

module.exports = router;

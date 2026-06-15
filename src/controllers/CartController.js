const cartService = require("../services/CartService");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");

const getCart = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const cart = await cartService.getCart(userId);
  await cart.populate("items.product");
  return res
    .status(200)
    .json(new ApiResponse(200, cart, "Cart fetched successfully"));
});

const addToCart = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const cart = await cartService.addToCart(userId, req.body);
  return res
    .status(200)
    .json(new ApiResponse(200, cart, "Product added to cart"));
});

const updateQuantity = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const cart = await cartService.updateQuantity(userId, req.body);
  return res
    .status(200)
    .json(new ApiResponse(200, cart, "Cart item quantity updated"));
});

const removeFromCart = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const cart = await cartService.removeFromCart(userId, req.body);
  return res
    .status(200)
    .json(new ApiResponse(200, cart, "Product removed from cart"));
});

const clearCart = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const cart = await cartService.clearCart(userId);
  return res
    .status(200)
    .json(new ApiResponse(200, cart, "Cart cleared successfully"));
});

module.exports = {
  getCart,
  addToCart,
  updateQuantity,
  removeFromCart,
  clearCart,
};

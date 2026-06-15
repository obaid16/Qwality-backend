const wishlistService = require("../services/WishlistService");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");

const getWishlist = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const wishlist = await wishlistService.getWishlist(userId);
  await wishlist.populate("products");
  return res
    .status(200)
    .json(new ApiResponse(200, wishlist, "Wishlist fetched successfully"));
});

const toggleWishlist = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { productId } = req.body;
  const wishlist = await wishlistService.toggleWishlist(userId, productId);
  return res
    .status(200)
    .json(new ApiResponse(200, wishlist, "Wishlist updated successfully"));
});

module.exports = {
  getWishlist,
  toggleWishlist,
};

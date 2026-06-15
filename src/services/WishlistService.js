const wishlistRepository = require("../repositories/WishlistRepository");

class WishlistService {
  async getWishlist(userId) {
    let wishlist = await wishlistRepository.findByUserId(userId);
    if (!wishlist) {
      wishlist = await wishlistRepository.create({ user: userId, products: [] });
    }
    return wishlist;
  }

  async toggleWishlist(userId, productId) {
    const wishlist = await this.getWishlist(userId);
    const index = wishlist.products.findIndex((p) => {
      if (!p) return false;
      const pId = p._id ? p._id.toString() : p.toString();
      return pId === productId;
    });

    if (index > -1) {
      wishlist.products.splice(index, 1);
    } else {
      wishlist.products.push(productId);
    }

    await wishlist.save();
    return await wishlist.populate("products");
  }
}

module.exports = new WishlistService();

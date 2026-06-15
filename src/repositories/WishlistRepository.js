const BaseRepository = require("./BaseRepository");
const Wishlist = require("../models/Wishlist");

class WishlistRepository extends BaseRepository {
  constructor() {
    super(Wishlist);
  }

  async findByUserId(userId) {
    return await this.model.findOne({ user: userId }).populate("products");
  }
}

module.exports = new WishlistRepository();

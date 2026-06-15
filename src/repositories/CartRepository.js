const BaseRepository = require("./BaseRepository");
const Cart = require("../models/Cart");

class CartRepository extends BaseRepository {
  constructor() {
    super(Cart);
  }

  async findByUserId(userId) {
    return await this.model.findOne({ user: userId }).populate("items.product");
  }
}

module.exports = new CartRepository();

const cartRepository = require("../repositories/CartRepository");
const ApiError = require("../utils/ApiError");

class CartService {
  async getCart(userId) {
    let cart = await cartRepository.findByUserId(userId);
    if (!cart) {
      cart = await cartRepository.create({ user: userId, items: [] });
    } else {
      // Merge duplicates if they exist in the database (e.g. from previous bugs)
      let hasDuplicates = false;
      const seen = new Set();
      for (const item of cart.items) {
        if (!item.product) continue;
        const prodId = item.product._id ? item.product._id.toString() : item.product.toString();
        const key = `${prodId}-${item.color || "Default"}-${item.size || "Adjustable"}`;
        if (seen.has(key)) {
          hasDuplicates = true;
          break;
        }
        seen.add(key);
      }

      if (hasDuplicates) {
        const mergedItems = [];
        for (const item of cart.items) {
          if (!item.product) continue;
          const prodId = item.product._id ? item.product._id.toString() : item.product.toString();
          const existing = mergedItems.find(
            (m) => {
              const mProdId = m.product._id ? m.product._id.toString() : m.product.toString();
              return (
                mProdId === prodId &&
                (m.color || "Default") === (item.color || "Default") &&
                (m.size || "Adjustable") === (item.size || "Adjustable")
              );
            }
          );
          if (existing) {
            existing.quantity += item.quantity;
          } else {
            mergedItems.push(item);
          }
        }
        cart.items = mergedItems;
        await cart.save();
      }
    }
    return cart;
  }

  async addToCart(userId, { productId, quantity, color, size }) {
    const cart = await this.getCart(userId);
    const existingIndex = cart.items.findIndex((item) => {
      if (!item.product) return false;
      const itemProdId = item.product._id ? item.product._id.toString() : item.product.toString();
      return (
        itemProdId === productId &&
        (item.color || "Default") === (color || "Default") &&
        (item.size || "Adjustable") === (size || "Adjustable")
      );
    });

    if (existingIndex > -1) {
      cart.items[existingIndex].quantity += Number(quantity);
    } else {
      cart.items.push({
        product: productId,
        quantity: Number(quantity),
        color: color || "Default",
        size: size || "Adjustable",
      });
    }

    await cart.save();
    return await cart.populate("items.product");
  }

  async updateQuantity(userId, { productId, color, size, quantity }) {
    const cart = await this.getCart(userId);
    const index = cart.items.findIndex((item) => {
      if (!item.product) return false;
      const itemProdId = item.product._id ? item.product._id.toString() : item.product.toString();
      return (
        itemProdId === productId &&
        (item.color || "Default") === (color || "Default") &&
        (item.size || "Adjustable") === (size || "Adjustable")
      );
    });

    if (index === -1) {
      throw new ApiError(404, "Cart item not found");
    }

    if (Number(quantity) <= 0) {
      cart.items.splice(index, 1);
    } else {
      cart.items[index].quantity = Number(quantity);
    }

    await cart.save();
    return await cart.populate("items.product");
  }

  async removeFromCart(userId, { productId, color, size }) {
    const cart = await this.getCart(userId);
    cart.items = cart.items.filter((item) => {
      if (!item.product) return false;
      const itemProdId = item.product._id ? item.product._id.toString() : item.product.toString();
      return !(
        itemProdId === productId &&
        (item.color || "Default") === (color || "Default") &&
        (item.size || "Adjustable") === (size || "Adjustable")
      );
    });
    await cart.save();
    return await cart.populate("items.product");
  }
}

module.exports = new CartService();

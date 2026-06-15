/**
 * Clear Demo Data Script — Qwality Caps
 * Deletes all products, categories, orders, coupons, reviews, carts, wishlists, FAQs, and banners.
 * Deletes all non-admin users.
 * Run: node scripts/clear-demo-data.js
 */

require("dotenv").config({ path: "./.env" });
const mongoose = require("mongoose");

async function clearData() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✓ Connected to MongoDB:", process.env.MONGODB_URI);

    // Import models
    const Product = require("../src/models/Product");
    const Category = require("../src/models/Category");
    const Order = require("../src/models/Order");
    const Coupon = require("../src/models/Coupon");
    const Cart = require("../src/models/Cart");
    const Wishlist = require("../src/models/Wishlist");
    const Review = require("../src/models/Review");
    const Banner = require("../src/models/Banner");
    const FAQ = require("../src/models/FAQ");
    const User = require("../src/models/User");

    console.log("Clearing collections...");
    
    const productDel = await Product.deleteMany({});
    console.log(`✓ Deleted ${productDel.deletedCount} products.`);

    const categoryDel = await Category.deleteMany({});
    console.log(`✓ Deleted ${categoryDel.deletedCount} categories.`);

    const orderDel = await Order.deleteMany({});
    console.log(`✓ Deleted ${orderDel.deletedCount} orders.`);

    const couponDel = await Coupon.deleteMany({});
    console.log(`✓ Deleted ${couponDel.deletedCount} coupons.`);

    const cartDel = await Cart.deleteMany({});
    console.log(`✓ Deleted ${cartDel.deletedCount} carts.`);

    const wishlistDel = await Wishlist.deleteMany({});
    console.log(`✓ Deleted ${wishlistDel.deletedCount} wishlists.`);

    const reviewDel = await Review.deleteMany({});
    console.log(`✓ Deleted ${reviewDel.deletedCount} reviews.`);

    const bannerDel = await Banner.deleteMany({});
    console.log(`✓ Deleted ${bannerDel.deletedCount} banners.`);

    const faqDel = await FAQ.deleteMany({});
    console.log(`✓ Deleted ${faqDel.deletedCount} FAQs.`);

    // Delete all users except admins
    const userDel = await User.deleteMany({ role: { $ne: "admin" } });
    console.log(`✓ Deleted ${userDel.deletedCount} non-admin users.`);

    // Count remaining admins
    const adminCount = await User.countDocuments({ role: "admin" });
    console.log(`ℹ Remaining admin accounts: ${adminCount}`);

    console.log("\n✓ Database cleared successfully! Ready for manual testing.");

  } catch (error) {
    console.error("✗ Clear failed:", error.message);
  } finally {
    await mongoose.disconnect();
    console.log("✓ Disconnected from MongoDB");
  }
}

clearData();

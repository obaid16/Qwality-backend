const express = require("express");
const router = express.Router();

const authRoutes = require("./auth");
const productRoutes = require("./products");
const categoryRoutes = require("./categories");
const orderRoutes = require("./orders");
const userRoutes = require("./users");
const couponRoutes = require("./coupons");
const cartRoutes = require("./carts");
const wishlistRoutes = require("./wishlists");
const cmsRoutes = require("./cms");
const reviewRoutes = require("./reviews");
const paymentRoutes = require("./payments");
const uploadRoutes = require("./upload");

router.use("/auth", authRoutes);
router.use("/products", productRoutes);
router.use("/categories", categoryRoutes);
router.use("/orders", orderRoutes);
router.use("/users", userRoutes);
router.use("/coupons", couponRoutes);
router.use("/carts", cartRoutes);
router.use("/wishlists", wishlistRoutes);
router.use("/cms", cmsRoutes);
router.use("/reviews", reviewRoutes);
router.use("/payments", paymentRoutes);
router.use("/upload", uploadRoutes);

module.exports = router;

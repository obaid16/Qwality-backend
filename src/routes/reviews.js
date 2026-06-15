const express = require("express");
const router = express.Router();
const {
  createReview,
  getProductReviews,
} = require("../controllers/ReviewController");
const { verifyJWT } = require("../middlewares/auth");

router.post("/", verifyJWT, createReview);
router.get("/product/:productId", getProductReviews);

module.exports = router;

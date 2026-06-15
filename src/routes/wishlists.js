const express = require("express");
const router = express.Router();
const {
  getWishlist,
  toggleWishlist,
} = require("../controllers/WishlistController");
const { verifyJWT } = require("../middlewares/auth");

router.get("/", verifyJWT, getWishlist);
router.post("/toggle", verifyJWT, toggleWishlist);

module.exports = router;

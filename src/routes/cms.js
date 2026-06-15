const express = require("express");
const router = express.Router();
const {
  getBanners,
  createBanner,
  getFAQs,
  createFAQ,
} = require("../controllers/CmsController");
const { verifyJWT, authorizeRoles } = require("../middlewares/auth");

// Public endpoints
router.get("/banners", getBanners);
router.get("/faqs", getFAQs);

// Admin endpoints
router.post("/banners", verifyJWT, authorizeRoles("admin"), createBanner);
router.post("/faqs", verifyJWT, authorizeRoles("admin"), createFAQ);

module.exports = router;

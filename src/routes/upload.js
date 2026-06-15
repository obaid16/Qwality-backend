const express = require("express");
const router = express.Router();
const multer = require("multer");
const { uploadImage } = require("../controllers/UploadController");
const { verifyJWT, authorizeRoles } = require("../middlewares/auth");

// Configure multer to use memory storage
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // Limit size to 5MB
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"), false);
    }
  },
});

// Admin-only upload route
router.post(
  "/",
  verifyJWT,
  authorizeRoles("admin"),
  upload.single("image"),
  uploadImage
);

module.exports = router;

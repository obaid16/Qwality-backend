const cloudinary = require("../config/cloudinary");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");

const uploadImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new ApiError(400, "No image file provided");
  }

  const uploadToCloudinary = (fileBuffer) => {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "qwality-caps",
          resource_type: "auto",
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      );
      stream.end(fileBuffer);
    });
  };

  try {
    const result = await uploadToCloudinary(req.file.buffer);
    return res
      .status(200)
      .json(new ApiResponse(200, { url: result.secure_url }, "Image uploaded successfully"));
  } catch (error) {
    throw new ApiError(500, error.message || "Failed to upload image to Cloudinary");
  }
});

module.exports = {
  uploadImage,
};

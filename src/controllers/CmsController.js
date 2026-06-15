const cmsService = require("../services/CmsService");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");

const getBanners = asyncHandler(async (req, res) => {
  const banners = await cmsService.getBanners();
  return res
    .status(200)
    .json(new ApiResponse(200, banners, "Banners fetched successfully"));
});

const createBanner = asyncHandler(async (req, res) => {
  const banner = await cmsService.createBanner(req.body);
  return res
    .status(201)
    .json(new ApiResponse(201, banner, "Banner created successfully"));
});

const getFAQs = asyncHandler(async (req, res) => {
  const faqs = await cmsService.getFAQs();
  return res
    .status(200)
    .json(new ApiResponse(200, faqs, "FAQs fetched successfully"));
});

const createFAQ = asyncHandler(async (req, res) => {
  const faq = await cmsService.createFAQ(req.body);
  return res
    .status(201)
    .json(new ApiResponse(201, faq, "FAQ created successfully"));
});

module.exports = {
  getBanners,
  createBanner,
  getFAQs,
  createFAQ,
};

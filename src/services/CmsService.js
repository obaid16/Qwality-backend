const Banner = require("../models/Banner");
const FAQ = require("../models/FAQ");

class CmsService {
  async getBanners() {
    return await Banner.find({ active: true });
  }

  async createBanner(data) {
    return await Banner.create(data);
  }

  async getFAQs() {
    return await FAQ.find({ active: true });
  }

  async createFAQ(data) {
    return await FAQ.create(data);
  }
}

module.exports = new CmsService();

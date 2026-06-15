const couponRepository = require("../repositories/CouponRepository");
const ApiError = require("../utils/ApiError");

class CouponService {
  async validateCoupon(code, orderAmount) {
    const coupon = await couponRepository.findByCode(code);
    if (!coupon) {
      throw new ApiError(404, "Invalid coupon code");
    }

    if (coupon.expiryDate < new Date()) {
      throw new ApiError(400, "Coupon has expired");
    }

    if (coupon.usageCount >= coupon.usageLimit && coupon.usageLimit > 0) {
      throw new ApiError(400, "Coupon usage limits exceeded");
    }

    if (orderAmount < coupon.minOrderAmount) {
      throw new ApiError(400, `Minimum purchase amount of $${coupon.minOrderAmount} required`);
    }

    return coupon;
  }
}

module.exports = new CouponService();

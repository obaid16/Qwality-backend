const BaseRepository = require("./BaseRepository");
const Coupon = require("../models/Coupon");

class CouponRepository extends BaseRepository {
  constructor() {
    super(Coupon);
  }

  async findByCode(code) {
    return await this.model.findOne({ code, active: true });
  }
}

module.exports = new CouponRepository();

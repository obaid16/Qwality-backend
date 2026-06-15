const BaseRepository = require("./BaseRepository");
const User = require("../models/User");

class UserRepository extends BaseRepository {
  constructor() {
    super(User);
  }

  async findByEmail(email) {
    return await this.model.findOne({ email });
  }

  async findByRefreshToken(refreshToken) {
    return await this.model.findOne({ refreshToken });
  }
}

module.exports = new UserRepository();

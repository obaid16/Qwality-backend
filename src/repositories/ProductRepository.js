const BaseRepository = require("./BaseRepository");
const Product = require("../models/Product");

class ProductRepository extends BaseRepository {
  constructor() {
    super(Product);
  }

  // Override standard query to exclude soft-deleted items by default
  async find(query = {}, options = {}) {
    const activeQuery = { isDeleted: false, ...query };
    return await super.find(activeQuery, options);
  }

  async findById(id, populate = "") {
    return await this.model.findOne({ _id: id, isDeleted: false }).populate(populate);
  }

  async softDelete(id) {
    return await this.model.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
  }

  async bulkDelete(ids) {
    return await this.model.updateMany({ _id: { $in: ids } }, { isDeleted: true });
  }

  async bulkUpdate(ids, updateData) {
    return await this.model.updateMany({ _id: { $in: ids } }, updateData);
  }
}

module.exports = new ProductRepository();

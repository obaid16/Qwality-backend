const BaseRepository = require("./BaseRepository");
const Category = require("../models/Category");

class CategoryRepository extends BaseRepository {
  constructor() {
    super(Category);
  }

  async findBySlug(slug) {
    return await this.model.findOne({ slug });
  }

  async findChildren(parentId) {
    return await this.model.find({ parentCategory: parentId });
  }
}

module.exports = new CategoryRepository();

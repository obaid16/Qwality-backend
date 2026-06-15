class BaseRepository {
  constructor(model) {
    this.model = model;
  }

  async create(data) {
    return await this.model.create(data);
  }

  async findById(id, populate = "") {
    return await this.model.findById(id).populate(populate);
  }

  async findOne(query, populate = "") {
    return await this.model.findOne(query).populate(populate);
  }

  async find(query = {}, options = {}) {
    const { page = 1, limit = 10, sort = { createdAt: -1 }, populate = "" } = options;
    const skip = (page - 1) * limit;

    const items = await this.model
      .find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .populate(populate);

    const total = await this.model.countDocuments(query);

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async updateById(id, data) {
    return await this.model.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  }

  async updateOne(query, data) {
    return await this.model.findOneAndUpdate(query, data, { new: true, runValidators: true });
  }

  async deleteById(id) {
    return await this.model.findByIdAndDelete(id);
  }
}

module.exports = BaseRepository;

const categoryRepository = require("../repositories/CategoryRepository");
const ApiError = require("../utils/ApiError");

class CategoryService {
  generateSlug(name) {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
  }

  async createCategory({ name, parentCategory, image }) {
    const slug = this.generateSlug(name);
    const existing = await categoryRepository.findOne({ slug });
    if (existing) {
      throw new ApiError(400, "Category already exists under this name");
    }

    if (parentCategory) {
      const parent = await categoryRepository.findById(parentCategory);
      if (!parent) {
        throw new ApiError(404, "Parent category not found");
      }
    }

    return await categoryRepository.create({
      name,
      slug,
      parentCategory: parentCategory || null,
      image,
    });
  }

  async getCategoriesTree() {
    const categories = await categoryRepository.model.find({});
    // Construct nested category tree structure
    const map = {};
    const roots = [];

    categories.forEach((cat) => {
      map[cat._id] = { ...cat.toObject(), children: [] };
    });

    categories.forEach((cat) => {
      if (cat.parentCategory) {
        if (map[cat.parentCategory]) {
          map[cat.parentCategory].children.push(map[cat._id]);
        }
      } else {
        roots.push(map[cat._id]);
      }
    });

    return roots;
  }
}

module.exports = new CategoryService();

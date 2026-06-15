const productRepository = require("../repositories/ProductRepository");
const ApiError = require("../utils/ApiError");

class ProductService {
  generateSlug(name) {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
  }

  async createProduct(productData) {
    const slug = this.generateSlug(productData.name);
    // Check slug uniqueness
    const existing = await productRepository.findOne({ slug });
    const finalSlug = existing ? `${slug}-${Date.now().toString().slice(-4)}` : slug;

    return await productRepository.create({
      ...productData,
      slug: finalSlug,
    });
  }

  async updateProduct(id, productData) {
    const update = { ...productData };
    if (productData.name) {
      const slug = this.generateSlug(productData.name);
      // Check if another product already uses this slug
      const existing = await productRepository.findOne({
        slug,
        _id: { $ne: id },
      });
      update.slug = existing ? `${slug}-${Date.now().toString().slice(-4)}` : slug;
    }
    const product = await productRepository.updateById(id, update);
    if (!product) {
      throw new ApiError(404, "Product not found or soft-deleted");
    }
    return product;
  }

  async getProducts(filters, options) {
    const query = {};

    if (filters.search) {
      query.$text = { $search: filters.search };
    }

    if (filters.category) {
      query.category = filters.category;
    }

    if (filters.minPrice || filters.maxPrice) {
      const min = filters.minPrice ? Number(filters.minPrice) : 0;
      const max = filters.maxPrice ? Number(filters.maxPrice) : Infinity;

      query.$or = [
        {
          salePrice: { $gt: 0, $gte: min, ...(max !== Infinity && { $lte: max }) }
        },
        {
          $or: [
            { salePrice: { $exists: false } },
            { salePrice: 0 },
            { salePrice: null }
          ],
          price: { $gte: min, ...(max !== Infinity && { $lte: max }) }
        }
      ];
    }

    if (filters.isFeatured !== undefined) {
      query.isFeatured = filters.isFeatured === "true";
    }

    return await productRepository.find(query, options);
  }

  async getProductById(id) {
    const product = await productRepository.findById(id, "category");
    if (!product) {
      throw new ApiError(404, "Product not found");
    }
    return product;
  }

  async deleteProduct(id) {
    const product = await productRepository.softDelete(id);
    if (!product) {
      throw new ApiError(404, "Product not found");
    }
    return product;
  }

  async bulkDelete(ids) {
    if (!Array.isArray(ids) || ids.length === 0) {
      throw new ApiError(400, "Ids array required for bulk operation");
    }
    return await productRepository.bulkDelete(ids);
  }

  async bulkUpdate(ids, updateData) {
    if (!Array.isArray(ids) || ids.length === 0) {
      throw new ApiError(400, "Ids array required for bulk operation");
    }
    return await productRepository.bulkUpdate(ids, updateData);
  }
}

module.exports = new ProductService();

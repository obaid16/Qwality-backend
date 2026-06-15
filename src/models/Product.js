const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      index: true,
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Category is required"],
    },
    subcategory: {
      type: String,
      trim: true,
    },
    sku: {
      type: String,
      required: [true, "SKU is required"],
      unique: true,
      trim: true,
      index: true,
    },
    stock: {
      type: Number,
      required: [true, "Stock level is required"],
      default: 0,
    },
    price: {
      type: Number,
      required: [true, "Base price is required"],
      min: [0, "Price must be positive"],
    },
    salePrice: {
      type: Number,
      default: 0,
      min: [0, "Sale price must be positive"],
    },
    images: [
      {
        type: String,
        required: true,
      },
    ],
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    variants: [
      {
        name: { type: String, required: true }, // e.g., "Size", "Color"
        value: { type: String, required: true }, // e.g., "S/M", "Navy & Gold"
        priceAdjustment: { type: Number, default: 0 },
        stock: { type: Number, default: 0 },
      },
    ],
    isFeatured: {
      type: Boolean,
      default: false,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  { timestamps: true }
);

// Indexes for text search
productSchema.index({ name: "text", description: "text" });

const Product = mongoose.model("Product", productSchema);

module.exports = Product;

require("dotenv").config({ path: "../../.env" }); // Support running from src/utils/ or root
const mongoose = require("mongoose");
const User = require("../models/User");
const Category = require("../models/Category");
const Product = require("../models/Product");

const categoriesData = [
  { name: "Classic Snapbacks", slug: "classic-snapbacks", image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?q=80&w=600&auto=format&fit=crop" },
  { name: "Luxury Dad Hats", slug: "luxury-dad-hats", image: "https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?q=80&w=600&auto=format&fit=crop" },
  { name: "Athletic Caps", slug: "athletic-caps", image: "https://images.unsplash.com/photo-1575428652377-a2d80e2277fc?q=80&w=600&auto=format&fit=crop" },
];

const seedDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/qwality-caps";
    console.log("Connecting to MongoDB at:", mongoUri);
    await mongoose.connect(mongoUri);
    console.log("Database connection successful.");

    // 1. Seed Admin User
    const adminEmail = "admin@qualitycaps.com";
    const existingAdmin = await User.findOne({ email: adminEmail });
    if (!existingAdmin) {
      console.log("Seeding Admin User...");
      await User.create({
        name: "Quality Caps Admin",
        email: adminEmail,
        password: "AdminPassword123!", // Will be hashed automatically by user pre-save hook
        role: "admin",
        phone: "1234567890",
        isVerified: true,
      });
      console.log("Admin User seeded: admin@qualitycaps.com / AdminPassword123!");
    } else {
      console.log("Admin User already exists.");
    }

    // 2. Seed Parent Category (if not exists)
    let parentCategory = await Category.findOne({ slug: "premium-caps" });
    if (!parentCategory) {
      console.log("Seeding Parent Category...");
      parentCategory = await Category.create({
        name: "Premium Caps",
        slug: "premium-caps",
        parentCategory: null,
        image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=600&auto=format&fit=crop",
      });
    }

    // 3. Seed Subcategories
    const subCategories = [];
    for (const cat of categoriesData) {
      let category = await Category.findOne({ slug: cat.slug });
      if (!category) {
        console.log(`Seeding Category: ${cat.name}...`);
        category = await Category.create({
          name: cat.name,
          slug: cat.slug,
          parentCategory: parentCategory._id,
          image: cat.image,
        });
      }
      subCategories.push(category);
    }

    // 4. Seed Products
    const existingProductsCount = await Product.countDocuments({ isDeleted: false });
    if (existingProductsCount === 0) {
      console.log("Seeding Products...");
      
      const snapbacksCategory = subCategories.find(c => c.slug === "classic-snapbacks") || parentCategory;
      const dadHatsCategory = subCategories.find(c => c.slug === "luxury-dad-hats") || parentCategory;
      const athleticCategory = subCategories.find(c => c.slug === "athletic-caps") || parentCategory;

      const productsData = [
        {
          name: "Navy Gold Snapback",
          slug: "navy-gold-snapback",
          description: "Elevate your streetwear with our Navy & Gold Snapback. Featuring handcrafted golden stitching and structured navy cotton panels, this premium cap is the perfect accessory for everyday luxury.",
          category: snapbacksCategory._id,
          sku: "QCP-NVYGD-01",
          stock: 120,
          price: 45.0,
          salePrice: 39.99,
          images: [
            "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?q=80&w=600&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?q=80&w=600&auto=format&fit=crop"
          ],
          tags: ["Navy", "Gold", "Snapback", "Classic"],
          variants: [
            { name: "Color", value: "Navy & Gold", priceAdjustment: 0, stock: 120 }
          ],
          isFeatured: true,
          rating: 4.8,
          reviewCount: 15,
        },
        {
          name: "Charcoal Gold Dad Hat",
          slug: "charcoal-gold-dad-hat",
          description: "Unstructured, relaxed, and incredibly comfortable. The Charcoal Gold Dad Hat features soft-washed premium cotton canvas with clean gold emblem details on the front.",
          category: dadHatsCategory._id,
          sku: "QCP-CHGD-02",
          stock: 85,
          price: 42.0,
          salePrice: 0,
          images: [
            "https://images.unsplash.com/photo-1575428652377-a2d80e2277fc?q=80&w=600&auto=format&fit=crop"
          ],
          tags: ["Charcoal", "Dad Hat", "Luxury"],
          variants: [
            { name: "Color", value: "Charcoal & Gold", priceAdjustment: 0, stock: 85 }
          ],
          isFeatured: true,
          rating: 4.9,
          reviewCount: 8,
        },
        {
          name: "Midnight Navy Classic",
          slug: "midnight-navy-classic",
          description: "A timeless masterpiece. The Midnight Navy Classic features a subtle luxury aesthetic with a structured fit, brass buckle strapback closure, and double-stitched eyelets.",
          category: dadHatsCategory._id,
          sku: "QCP-MIDNV-03",
          stock: 150,
          price: 48.0,
          salePrice: 0,
          images: [
            "https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?q=80&w=600&auto=format&fit=crop"
          ],
          tags: ["Navy", "Classic", "Premium"],
          variants: [
            { name: "Color", value: "Midnight Navy", priceAdjustment: 0, stock: 150 }
          ],
          isFeatured: false,
          rating: 4.7,
          reviewCount: 20,
        },
        {
          name: "Golden Eagle Athletic Cap",
          slug: "golden-eagle-athletic-cap",
          description: "Engineered for style and performance. The Golden Eagle Athletic Cap incorporates quick-dry tech sweatbands, laser-perforated back panels for breathing, and lightweight gold accents.",
          category: athleticCategory._id,
          sku: "QCP-GEATH-04",
          stock: 60,
          price: 50.0,
          salePrice: 45.0,
          images: [
            "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=600&auto=format&fit=crop"
          ],
          tags: ["Athletic", "Sport", "Gold", "Performance"],
          variants: [
            { name: "Color", value: "Black & Gold", priceAdjustment: 0, stock: 60 }
          ],
          isFeatured: true,
          rating: 4.6,
          reviewCount: 5,
        }
      ];

      await Product.insertMany(productsData);
      console.log("Initial products seeded successfully.");
    } else {
      console.log("Products already exist, skipping seeding.");
    }

    console.log("Database seeding completed successfully.");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding the database: ", error);
    process.exit(1);
  }
};

seedDB();

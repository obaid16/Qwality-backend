/**
 * Update Images Distinct Script — Qwality Caps
 * Updates categories and products in MongoDB Atlas to use distinct, non-repeating cap images.
 * Run: node scripts/update-images-distinct.js
 */

require("dotenv").config({ path: "./.env" });
const mongoose = require("mongoose");

async function updateDbImages() {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error("MONGODB_URI is not defined in environment variables.");
    }
    
    console.log("Connecting to MongoDB...");
    await mongoose.connect(mongoUri);
    console.log("✓ Connected to MongoDB");

    const Product = require("../src/models/Product");
    const Category = require("../src/models/Category");

    console.log("Updating Categories with distinct cap images...");
    
    await Category.findOneAndUpdate(
      { slug: "premium-caps" },
      { image: "https://images.unsplash.com/photo-1521369909029-2afed882baee?q=80&w=600&auto=format&fit=crop" }
    );
    console.log("✓ Updated Premium Caps Category image.");

    await Category.findOneAndUpdate(
      { slug: "luxury-dad-hats" },
      { image: "https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?q=80&w=600&auto=format&fit=crop" }
    );
    console.log("✓ Updated Luxury Dad Hats Category image.");

    await Category.findOneAndUpdate(
      { slug: "athletic-caps" },
      { image: "https://images.unsplash.com/photo-1575428652377-a2d80e2277fc?q=80&w=600&auto=format&fit=crop" }
    );
    console.log("✓ Updated Athletic Caps Category image.");

    console.log("Updating Products with distinct cap images...");

    await Product.findOneAndUpdate(
      { slug: "golden-eagle-athletic-cap" },
      { 
        images: [
          "https://images.unsplash.com/photo-1556306535-0f09a537f0a3?q=80&w=600&auto=format&fit=crop"
        ] 
      }
    );
    console.log("✓ Updated Golden Eagle Athletic Cap images.");

    await Product.findOneAndUpdate(
      { slug: "charcoal-gold-dad-hat" },
      { 
        images: [
          "https://images.unsplash.com/photo-1575428652377-a2d80e2277fc?q=80&w=600&auto=format&fit=crop"
        ] 
      }
    );
    console.log("✓ Updated Charcoal Gold Dad Hat images.");

    await Product.findOneAndUpdate(
      { slug: "midnight-navy-classic" },
      { 
        images: [
          "https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?q=80&w=600&auto=format&fit=crop"
        ] 
      }
    );
    console.log("✓ Updated Midnight Navy Classic images.");

    await Product.findOneAndUpdate(
      { slug: "navy-gold-snapback" },
      { 
        images: [
          "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?q=80&w=600&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1521369909029-2afed882baee?q=80&w=600&auto=format&fit=crop"
        ] 
      }
    );
    console.log("✓ Updated Navy Gold Snapback images.");

    console.log("\n✓ Database update completed successfully!");

  } catch (error) {
    console.error("✗ Update failed:", error.message);
  } finally {
    await mongoose.disconnect();
    console.log("✓ Disconnected from MongoDB");
  }
}

updateDbImages();

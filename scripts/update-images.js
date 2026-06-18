/**
 * Update Images Script — Qwality Caps
 * Updates categories and products in MongoDB Atlas to use only cap images.
 * Run: node scripts/update-images.js
 */

require("dotenv").config({ path: "./.env" }); // support running from backend root
const mongoose = require("mongoose");

async function updateDbImages() {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error("MONGODB_URI is not defined in environment variables.");
    }
    
    console.log("Connecting to MongoDB...");
    await mongoose.connect(mongoUri);
    console.log("✓ Connected to MongoDB:", mongoUri.split("@")[1] || "Atlas");

    const Product = require("../src/models/Product");
    const Category = require("../src/models/Category");

    console.log("Updating Categories...");
    
    // Update parent category Premium Caps
    const catPremium = await Category.findOneAndUpdate(
      { slug: "premium-caps" },
      { image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?q=80&w=600&auto=format&fit=crop" },
      { new: true }
    );
    if (catPremium) {
      console.log("✓ Updated Premium Caps Category image.");
    }

    // Update Luxury Dad Hats category
    const catDadHats = await Category.findOneAndUpdate(
      { slug: "luxury-dad-hats" },
      { image: "https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?q=80&w=600&auto=format&fit=crop" },
      { new: true }
    );
    if (catDadHats) {
      console.log("✓ Updated Luxury Dad Hats Category image.");
    }

    console.log("Updating Products...");

    // Update Golden Eagle Athletic Cap
    const prodGoldenEagle = await Product.findOneAndUpdate(
      { slug: "golden-eagle-athletic-cap" },
      { 
        images: [
          "https://images.unsplash.com/photo-1575428652377-a2d80e2277fc?q=80&w=600&auto=format&fit=crop"
        ] 
      },
      { new: true }
    );
    if (prodGoldenEagle) {
      console.log("✓ Updated Golden Eagle Athletic Cap images.");
    }

    // Update Midnight Navy Classic
    const prodMidnightNavy = await Product.findOneAndUpdate(
      { slug: "midnight-navy-classic" },
      { 
        images: [
          "https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?q=80&w=600&auto=format&fit=crop"
        ] 
      },
      { new: true }
    );
    if (prodMidnightNavy) {
      console.log("✓ Updated Midnight Navy Classic images.");
    }

    // Update Navy Gold Snapback (make sure both images are caps)
    const prodNavyGold = await Product.findOneAndUpdate(
      { slug: "navy-gold-snapback" },
      { 
        images: [
          "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?q=80&w=600&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?q=80&w=600&auto=format&fit=crop"
        ] 
      },
      { new: true }
    );
    if (prodNavyGold) {
      console.log("✓ Updated Navy Gold Snapback images.");
    }

    console.log("\n✓ Database update completed successfully!");

  } catch (error) {
    console.error("✗ Update failed:", error.message);
  } finally {
    await mongoose.disconnect();
    console.log("✓ Disconnected from MongoDB");
  }
}

updateDbImages();

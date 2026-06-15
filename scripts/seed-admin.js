/**
 * Admin Seed Script — Qwality Caps
 * Creates or fixes the admin user in MongoDB.
 * Run: node scripts/seed-admin.js
 *
 * NOTE: We pass plain-text password and let the User model's
 * pre-save hook hash it — avoids double-hashing.
 */

require("dotenv").config({ path: "./.env" });
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const ADMIN_EMAIL = "admin@qwality.com";
const ADMIN_PASSWORD = "Admin@1234";
const ADMIN_NAME = "Qwality Admin";

async function seedAdmin() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✓ Connected to MongoDB:", process.env.MONGODB_URI);

    // Load model after connection
    const User = require("../src/models/User");

    // Check if admin already exists
    const existing = await User.findOne({ email: ADMIN_EMAIL });

    if (existing) {
      // Force-reset the password using bcryptjs directly (bypass pre-save hook)
      // so we can fix any double-hashing issues from a previous run
      const freshHash = await bcrypt.hash(ADMIN_PASSWORD, 10);
      await User.updateOne(
        { email: ADMIN_EMAIL },
        { $set: { password: freshHash, role: "admin", isVerified: true } }
      );
      console.log(`\n✓ Admin credentials reset successfully!`);
    } else {
      // Create brand new admin — pass plain password, let pre-save hook hash it
      const admin = new User({
        name: ADMIN_NAME,
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,   // plain text — model hook will hash it
        role: "admin",
        isVerified: true,
      });
      await admin.save();
      console.log(`\n✓ Admin user created successfully!`);
    }

    console.log("\n═══════════════════════════════════════");
    console.log("  ADMIN LOGIN CREDENTIALS");
    console.log("═══════════════════════════════════════");
    console.log(`  URL:      http://localhost:3000/auth`);
    console.log(`  Email:    ${ADMIN_EMAIL}`);
    console.log(`  Password: ${ADMIN_PASSWORD}`);
    console.log(`  Panel:    http://localhost:3000/admin`);
    console.log("═══════════════════════════════════════\n");

  } catch (error) {
    console.error("✗ Seed failed:", error.message);
  } finally {
    await mongoose.disconnect();
    console.log("✓ Disconnected from MongoDB");
  }
}

seedAdmin();


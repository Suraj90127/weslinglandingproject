const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);


    console.log("✅ MongoDB Connected:", conn.connection.host);

    // create collections
    await createDefaultCollections();

  } catch (error) {
    console.error("❌ MongoDB Error:", error.message);
    process.exit(1);
  }
};


// Create default collections
const createDefaultCollections = async () => {
  const db = mongoose.connection.db;

  const collections = await db.listCollections().toArray();
  const names = collections.map(c => c.name);

  if (!names.includes("banners")) {
    await db.createCollection("banners");
    console.log("✔ banners collection created");
  }

  if (!names.includes("events")) {
    await db.createCollection("events");
    console.log("✔ events collection created");
  }

  if (!names.includes("players")) {
    await db.createCollection("players");
    console.log("✔ players collection created");
  }

  if (!names.includes("contents")) {
    await db.createCollection("contents");
    console.log("✔ contents collection created");
  }
};

module.exports = connectDB;

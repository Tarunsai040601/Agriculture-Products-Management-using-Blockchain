const mongoose = require("mongoose");
require("dotenv").config({ quiet: true });

const connectionDatabase = async () => {
  const url = process.env.DATABASEURL;

  if (!url) {
    throw new Error("DATABASEURL is missing in environment variables");
  }

  try {
    console.log(`Connecting to MongoDB: ${process.env.DATABASENAME || "unknown"}`);
    await mongoose.connect(url, {
      dbName: process.env.DATABASENAME,
      serverSelectionTimeoutMS: 10000,
    });
    console.log(
      `Database connected successfully to: ${process.env.DATABASENAME}`,
    );
  } catch (error) {
    console.log(
      `Database connection failed for: ${process.env.DATABASENAME || "unknown"}`,
    );
    throw error;
  }
};

module.exports = connectionDatabase;
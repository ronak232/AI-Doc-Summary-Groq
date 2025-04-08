import mongoose from "mongoose";
import * as dotenv from "dotenv";
dotenv.config();

async function connectDB() {
  try {
    await mongoose.connect(process.env.mongo_uri || 8000, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 40000,
    });
  } catch (error) {
    process.exit(1);
  }
}
export { connectDB };

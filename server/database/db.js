import mongoose from "mongoose";
import * as dotenv from "dotenv";
dotenv.config();

const connectDB = async () => {
  try {
    const connect = await mongoose.connect(process.env.mongo_uri, {
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 40000,
    });
    console.log("Connected db", connect.connection.host);
  } catch (error) {
    console.error("DB not connected");
  }
};

connectDB();

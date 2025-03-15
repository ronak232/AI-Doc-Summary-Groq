import mongoose from "mongoose";
import * as dotenv from "dotenv";
dotenv.config();

const connect = await mongoose.connect(process.env.mongo_uri || 8000, {
  serverSelectionTimeoutMS: 30000,
  socketTimeoutMS: 40000,
  driverInfo: { name: "langchainjs" },
});
const collection = connect.connection.db("").collection("chat-memory");

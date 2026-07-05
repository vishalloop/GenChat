import mongoose from "mongoose";
import { config } from "./config";

export async function connectToDB() {
  if (mongoose.connection.readyState >= 1) return;
  try {
    await mongoose.connect(config.MONGO_URI);
    console.log("MongoDB connected.");
  } catch (err) {
    console.error("MongoDB connection failed:", err);
    throw err;
  }
}
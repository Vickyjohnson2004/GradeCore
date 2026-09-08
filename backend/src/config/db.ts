import mongoose from "mongoose";
import { env } from "./env.js";

export async function connectDatabase() {
  try {
    if (mongoose.connection.readyState === 1) return mongoose.connection;
    return await mongoose.connect(env.MONGODB_URI, {
      serverSelectionTimeoutMS: 8000,
      maxPoolSize: 10,
    });
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error;
  }
}

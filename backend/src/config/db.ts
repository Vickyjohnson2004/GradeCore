import mongoose from "mongoose";
import { env } from "./env.js";
export async function connectDatabase() {
  try {
    await mongoose.connect(env.MONGODB_URI);
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error;
  }
}

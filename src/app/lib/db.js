import mongoose from "mongoose";

const MONGODB_URI = "mongodb://localhost:27017/nextAuth";
if (!MONGODB_URI) throw new Error("MONGODB_URI not defined in .env.local");

let cached = global._mongoose || { conn: null, promise: null };

export async function connectDB() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI).then((mongoose) => {
      console.log("✅ MongoDB Connected");
      return mongoose;
    });
  }
  cached.conn = await cached.promise;
  global._mongoose = cached;
  return cached.conn;
}

import mongoose from "mongoose";

const MONGODB_URI = "mongodb+srv://agraharishivam6388:V1LPNYYPfyOpp5MH@blogs.uohgexh.mongodb.net/blogs?retryWrites=true&w=majority&appName=blogs";
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

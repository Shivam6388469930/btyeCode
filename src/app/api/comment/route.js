import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/db";
import Comment from "@/app/models/comment";

// POST: Create a new comment
export async function POST(req) {
  await connectDB();

  try {
    const { text, name, email, product_id } = await req.json();

    // Validate required fields
    if (!text?.trim()) {
      return NextResponse.json({ message: "Comment text is required" }, { status: 400 });
    }

    if (text.trim().length > 500) {
      return NextResponse.json({ message: "Comment too long (max 500 chars)" }, { status: 400 });
    }

    if (!name || !email || !product_id) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    // Check if the user has already commented on this product
    // const existingComment = await Comment.findOne({ product_id, email });
    // if (existingComment) {
    //   return NextResponse.json({ message: "You have already commented on this product." }, { status: 400 });
    // }

    // Create and save the new comment
    const newComment = await Comment.create({
      product_id,
      text: text.trim(),
      name,
      email,
    });

    return NextResponse.json({ message: "Comment added", comment: newComment }, { status: 201 });
  } catch (err) {
    console.error("Error in POST /api/comment:", err);
    return NextResponse.json({ message: "Server error", error: err.message }, { status: 500 });
  }
}

// GET: Fetch comments (optionally by product_id)
export async function GET(req) {
  await connectDB();

  try {
    const { searchParams } = new URL(req.url);
    const product_id = searchParams.get("product_id");
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "20", 10);
    const skip = (page - 1) * limit;

    const query = product_id ? { product_id } : {};

    const comments = await Comment.find(query)
      .sort({ createdAt: -1 }) // newest first
      .skip(skip)
      .limit(limit);

    return NextResponse.json({ comments }, { status: 200 });
  } catch (err) {
    console.error("Error in GET /api/comment:", err);
    return NextResponse.json({ message: "Failed to fetch comments", error: err.message }, { status: 500 });
  }
}

import { connectDB } from "@/app/lib/db";
import Article from "@/app/models/article";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const userEmail = searchParams.get("userEmail");

    if (!userEmail) {
      return NextResponse.json(
        { message: "Missing userEmail in query parameters." },
        { status: 400 }
      );
    }

    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    const articles = await Article.find({ userEmail })
      .sort({ createdAt: -1 }) // Newest first
      .skip(skip)
      .limit(limit);

    const total = await Article.countDocuments({ userEmail });

    return NextResponse.json(
      {
        message: "✅ Articles fetched successfully",
        total,
        page,
        articles,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET ARTICLES ERROR:", error);
    return NextResponse.json(
      { message: "❌ Server Error", error: error.message },
      { status: 500 }
    );
  }
}
// Edit

export async function PUT(req, { params }) {
  try {
    await connectDB();

    const { id } = params; // Get article ID from URL
    const { title, content } = await req.json(); // Extract the new data from the request body

    if (!title || !content) {
      return NextResponse.json(
        { message: "Title and content are required." },
        { status: 400 }
      );
    }

    // Find and update the article by ID
    const updatedArticle = await Article.findByIdAndUpdate(
      id,
      { title, content },
      { new: true } // Return the updated document
    );

    if (!updatedArticle) {
      return NextResponse.json(
        { message: "Article not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Article updated successfully", article: updatedArticle },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating article:", error);
    return NextResponse.json(
      { message: "Error updating article", error: error.message },
      { status: 500 }
    );
  }
}
// delete
export async function DELETE(req, { params }) {
  try {
    await connectDB();

    const { id } = params; // Get article ID from URL

    // Find and delete the article by ID
    const deletedArticle = await Article.findByIdAndDelete(id);

    if (!deletedArticle) {
      return NextResponse.json(
        { message: "Article not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Article deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting article:", error);
    return NextResponse.json(
      { message: "Error deleting article", error: error.message },
      { status: 500 }
    );
  }
}

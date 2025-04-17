import { connectDB } from "@/app/lib/db";
import Article from "@/app/models/article";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    // URL से query params को प्राप्त करना
    const url = new URL(req.url);
    const id = url.searchParams.get("id");  // `id` को query params से प्राप्त करें

    if (!id) {
      return NextResponse.json(
        { message: "❌ ID is required" },
        { status: 400 }
      );
    }

    await connectDB();

    // ID से Article खोजें
    const article = await Article.findById(id);

    if (!article) {
      return NextResponse.json(
        { message: "❌ Article not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: "✅ Article fetched successfully",
        article,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET ARTICLE ERROR:", error);
    return NextResponse.json(
      { message: "❌ Server Error", error: error.message },
      { status: 500 }
    );
  }
}

import { connectDB } from "@/app/lib/db";
import Article from "@/app/models/article";
import { NextResponse } from "next/server";
import cloudinary from "@/app/lib/cloudinary";

// POST: Create an article with image upload
export async function POST(req) {
  try {
    await connectDB();

    const formData = await req.formData();
    const userEmail = formData.get("userEmail");
    const title = formData.get("title");
    const description = formData.get("description");
    const imageFile = formData.get("image");

    if (!userEmail || !title || !description || !imageFile) {
      return NextResponse.json(
        { message: "Please fill all the fields!" },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await imageFile.arrayBuffer());

    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { folder: "article_img" },
        (err, result) => {
          if (err) reject(err);
          else resolve(result);
        }
      ).end(buffer);
    });

    const newArticle = await Article.create({
      userEmail,
      title,
      description,
      image: uploadResult.secure_url,
    });

    return NextResponse.json(
      {
        message: "✅ Article created successfully",
        article: newArticle,
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("UPLOAD ERROR:", error);
    return NextResponse.json(
      { message: "❌ Server Error", error: error.message },
      { status: 500 }
    );
  }
}

// GET: Retrieve articles by userEmail (with optional pagination)

export async function GET(req) {
  try {
    await connectDB();

    const articles = await Article.find({ });

    return NextResponse.json(
      {
        message: "✅ Articles fetched successfully",
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


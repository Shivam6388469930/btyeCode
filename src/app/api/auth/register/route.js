import { connectDB } from "@/app/lib/db";
import cloudinary from "@/app/lib/cloudinary";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import User from "@/app/models/user";

export async function POST(req) {
  try {
    await connectDB();

    const formData = await req.formData();
    const userName = formData.get("userName");
    const email = formData.get("email");
    const password = formData.get("password");
    const imageFile = formData.get("image");

    if (!userName || !email || !password || !imageFile) {
      return NextResponse.json({ message: "All fields are required" }, { status: 400 });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return NextResponse.json({ message: "Email already in use" }, { status: 409 });
    }

    // Upload image to Cloudinary
    const buffer = Buffer.from(await imageFile.arrayBuffer());

    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { folder: "user_avatars" },
        (err, result) => {
          if (err) reject(err);
          else resolve(result);
        }
      ).end(buffer);
    });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      userName: userName.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      image: uploadResult.secure_url, // store Cloudinary image URL
    });

    return NextResponse.json({ message: "User registered successfully", userId: newUser._id }, { status: 201 });

  } catch (error) {
    return NextResponse.json({ message: "Server error", error: error.message }, { status: 500 });
  }
}

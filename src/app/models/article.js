// models/article.js
import mongoose from "mongoose";

const articleSchema = new mongoose.Schema(
  {
    userEmail:{type:String,required:true},
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Article || mongoose.model("Article", articleSchema);

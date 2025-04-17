import mongoose from "mongoose";

// Define the comment schema
const commentSchema = new mongoose.Schema(
  {
    product_id: {
      type: String,
      required: true, // The product_id is mandatory and it is a string (you can change it to ObjectId if using MongoDB references).
    },
    text: { 
      type: String, 
      required: true, // The text of the comment is mandatory.
      trim: true, // Automatically trims whitespace from the start and end of the comment.
      maxlength: 500, // Maximum length of comment text (optional, if you want to limit comment size).
    },
    name: {
      type: String,
      required: true, // The name of the user posting the comment.
      trim: true, // Automatically trims whitespace from the name.
    },
    email: {
      type: String,
      required: true, // The email of the user posting the comment.
      lowercase: true, // Automatically converts email to lowercase.
   // Email validation regex.
    },
  },
  { timestamps: true } // Automatically adds `createdAt` and `updatedAt` fields to the document.
);

// Create the Comment model based on the schema
export default mongoose.models.Comment || mongoose.model("Comment", commentSchema);

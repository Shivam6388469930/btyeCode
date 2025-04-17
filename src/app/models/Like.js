import mongoose from "mongoose";

const LikeSchema = new mongoose.Schema({
  productId: {
    type: String,
    required: true,
  },
  userid: {
    type: String,
    required: true,
  },
  reaction: {
    type: String,
    enum: ["like", "dislike"], // Only like or dislike
    required: true,
  },
});

const Like = mongoose.models.Like || mongoose.model("Like", LikeSchema);

export default Like;



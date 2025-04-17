import { connectDB } from "@/app/lib/db";
import Like from "@/app/models/Like";

// GET method to fetch total likes/dislikes and user's action
export async function GET(req) {
  await connectDB();

  const { searchParams } = new URL(req.url);
  const productId = searchParams.get("productId");
  const userId = searchParams.get("userId");

  if (!productId) {
    return new Response(
      JSON.stringify({ success: false, message: "productId is required" }),
      { status: 400 }
    );
  }

  try {
    const allLikes = await Like.find({ productId });

    const likes = allLikes.filter((rec) => rec.reaction === "like").length;
    const dislikes = allLikes.filter((rec) => rec.reaction === "dislike").length;

    let userAction = null;
    if (userId) {
      const userReaction = allLikes.find((rec) => rec.userid === userId);
      if (userReaction) {
        userAction = userReaction.reaction;
      }
    }

    return new Response(
      JSON.stringify({ success: true, data: { likes, dislikes, userAction } }),
      { status: 200 }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ success: false, message: "Server error", error: err.message }),
      { status: 500 }
    );
  }
}

// POST method to store a like or dislike
// export async function POST(req) {
//   await connectDB();
//   const body = await req.json();

//   const { productId, reaction, userid } = body;

//   if (!productId || !userid || !["like", "dislike"].includes(reaction)) {
//     return new Response(
//       JSON.stringify({ success: false, message: "Invalid input" }),
//       { status: 400 }
//     );
//   }

//   try {
//     const existing = await Like.findOne({ productId, userid });

//     if (existing) {
//       return new Response(
//         JSON.stringify({ success: false, message: "You already reacted." }),
//         { status: 400 }
//       );
//     }

//     const newReaction = new Like({
//       productId,
//       userid,
//       reaction, // Save the reaction as 'like' or 'dislike'
//     });

//     await newReaction.save();

//     return new Response(
//       JSON.stringify({ success: true, data: newReaction }),
//       { status: 200 }
//     );
//   } catch (error) {
//     return new Response(
     
//       JSON.stringify({ success: false, message: "Server error", error: error.message }),
//       console.error("Error in POST /api/like:", error.message),

//       { status: 500 }
//     );
//   }
// }

export async function POST(req) {
  await connectDB();
  const body = await req.json();

  const { productId, reaction, userid } = body;

  if (!productId || !userid || !["like", "dislike"].includes(reaction)) {
    return new Response(
      JSON.stringify({ success: false, message: "Invalid input" }),
      { status: 400 }
    );
  }

  try {
    const existing = await Like.findOne({ productId, userid });

    if (reaction === "like") {
      if (existing) {
        return new Response(
          JSON.stringify({ success: false, message: "You already liked this." }),
          { status: 400 }
        );
      }

      const newReaction = new Like({ productId, userid, reaction });
      await newReaction.save();

      return new Response(
        JSON.stringify({ success: true, data: newReaction }),
        { status: 200 }
      );
    }

    if (reaction === "dislike") {
      if (existing) {
        await Like.deleteOne({ productId, userid });

        return new Response(
          JSON.stringify({ success: true, message: "Disliked (removed like)" }),
          { status: 200 }
        );
      } else {
        return new Response(
          JSON.stringify({ success: false, message: "No like found to remove." }),
          { status: 400 }
        );
      }
    }

  } catch (error) {
    console.error("Error in POST /api/like:", error);
    return new Response(
      JSON.stringify({ success: false, message: "Server error", error: error.message }),
      { status: 500 }
    );
  }
}

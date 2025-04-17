"use client"; // Must be first

import { Suspense } from "react"; // ✅ Added
import { useSearchParams } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import Image from "next/image";

const fetchBlogById = async (id) => {
  try {
    const res = await fetch(`/api/article_detail?id=${id}`);
    const data = await res.json();
    return data.article;
  } catch (error) {
    console.error("Error fetching article by ID:", error);
    return null;
  }
};

const BlogPageContent = () => {
  const searchParams = useSearchParams();
  const blogId = searchParams.get("id");

  const [blog, setBlog] = useState(null);
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [userAction, setUserAction] = useState(null);
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!blogId) return;

    const load = async () => {
      setLoading(true);
      const blogData = await fetchBlogById(blogId);
      setBlog(blogData);

      const userId = localStorage.getItem("userEmail");
      if (userId) await fetchReactions(blogId);

      setLoading(false);
    };

    load();
  }, [blogId]);

  const fetchReactions = async (id) => {
    const userId = localStorage.getItem("userEmail");
    if (!userId) return;

    try {
      const res1 = await fetch(`/api/comment?product_id=${id}`);
      const commentData = await res1.json();
      if (res1.ok) setComments(commentData.comments || []);

      const res2 = await fetch(`/api/like?productId=${id}&userId=${userId}`);
      const likeData = await res2.json();
      if (res2.ok) {
        setLikes(likeData.data?.likes || 0);
        setDislikes(likeData.data?.dislikes || 0);
        setUserAction(likeData.data?.userAction || null);
      }
    } catch (error) {
      console.error("Error fetching reactions:", error);
    }
  };

  const handleReact = async (reaction) => {
    const userId = localStorage.getItem("userEmail");
    if (!userId) return alert("Login required");

    try {
      const res = await fetch("/api/like", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: blogId, reaction, userid: userId }),
      });

      const data = await res.json();
      if (res.ok) {
        setUserAction(reaction === "like" ? "like" : null);
        await fetchReactions(blogId);
      } else {
        alert(data.message || "Failed to react.");
      }
    } catch (error) {
      console.error("Reaction error:", error);
    }
  };

  const handleSend = useCallback(async () => {
    const trimmed = comment.trim();
    if (!trimmed) return;

    const name = localStorage.getItem("userName");
    const email = localStorage.getItem("userEmail");
    if (!name || !email) return alert("Login required");

    setLoading(true);
    try {
      const res = await fetch("/api/comment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product_id: blogId, text: trimmed, name, email }),
      });

      const data = await res.json();
      if (res.ok) {
        setComments((prev) => [data.comment, ...prev]);
        setComment("");
      } else {
        alert(data.message || "Failed to post comment.");
      }
    } catch (error) {
      console.error("Error posting comment:", error);
    } finally {
      setLoading(false);
    }
  }, [comment, blogId]);

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!blog) return <p className="text-center mt-10 text-red-500">Blog not found.</p>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">{blog.title}</h1>
      <Image
        src={blog.image}
        alt={blog.title}
        width={800}
        height={400}
        className="w-full rounded-lg mb-4"
        onError={(e) => (e.target.src = "https://via.placeholder.com/800x400")}
      />
      <p className="text-gray-700 mb-6">{blog.description}</p>

      {/* Like/Dislike */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => handleReact("like")}
          disabled={userAction === "like"}
          className={`px-4 py-2 rounded text-white ${
            userAction === "like" ? "bg-green-800" : "bg-green-600 hover:bg-green-700"
          }`}
        >
          👍 {likes}
        </button>

        <button
          onClick={() => handleReact("dislike")}
          disabled={!userAction}
          className={`px-4 py-2 rounded text-white ${
            userAction ? "bg-red-600 hover:bg-red-700" : "bg-red-400 cursor-not-allowed"
          }`}
        >
          👎 {dislikes}
        </button>
      </div>

      {/* Comment box */}
      <div className="mb-6">
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Write your comment..."
          className="w-full p-3 border rounded-lg mb-2"
        />
        <button
          onClick={handleSend}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? "Sending..." : "Post Comment"}
        </button>
      </div>

      {/* Comment List */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Comments</h2>
        {comments.length === 0 ? (
          <p className="text-gray-500">No comments yet.</p>
        ) : (
          <ul className="space-y-4">
            {comments.map((c) => (
              <li key={c._id} className="bg-gray-100 p-4 rounded flex items-start gap-4">
                <div className="bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center text-lg font-semibold">
                  {c.name?.[0]?.toUpperCase() || "U"}
                </div>
                <div>
                  <p className="font-bold">{c.name}</p>
                  <p className="text-gray-800">{c.text}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

const Page = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BlogPageContent />
    </Suspense>
  );
};

export default Page;

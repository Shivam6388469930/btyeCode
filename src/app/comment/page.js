"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";

// This component ensures that `useSearchParams` is only used on the client side
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

    const fetchBlog = async () => {
      try {
        const response = await axios.get(`/api/blog?id=${blogId}`);
        setBlog(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching blog:", err);
        setLoading(false);
      }
    };

    const fetchLikesDislikes = async () => {
      try {
        const response = await axios.get(`/api/like?id=${blogId}`);
        setLikes(response.data.likes || 0);
        setDislikes(response.data.dislikes || 0);
      } catch (err) {
        console.error("Error fetching likes/dislikes:", err);
      }
    };

    const fetchComments = async () => {
      try {
        const response = await axios.get(`/api/comment?id=${blogId}`);
        setComments(response.data || []);
      } catch (err) {
        console.error("Error fetching comments:", err);
      }
    };

    fetchBlog();
    fetchLikesDislikes();
    fetchComments();
  }, [blogId]);

  const handleLike = async () => {
    try {
      await axios.post("/api/like", {
        blogId,
        action: "like",
      });
      setUserAction("like");
      setLikes((prev) => prev + 1);
    } catch (err) {
      console.error("Error liking:", err);
    }
  };

  const handleDislike = async () => {
    try {
      await axios.post("/api/like", {
        blogId,
        action: "dislike",
      });
      setUserAction("dislike");
      setDislikes((prev) => prev + 1);
    } catch (err) {
      console.error("Error disliking:", err);
    }
  };

  const handleComment = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !comment.trim()) return;

    try {
      await axios.post("/api/comment", {
        blogId,
        name: user.name,
        email: user.email,
        comment,
      });

      setComments((prev) => [
        ...prev,
        {
          name: user.name,
          email: user.email,
          comment,
        },
      ]);
      setComment("");
    } catch (err) {
      console.error("Error posting comment:", err);
    }
  };

  if (loading) return <div>Loading...</div>;

  if (!blog) return <div>Blog not found</div>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">{blog.title}</h1>
      <p className="text-gray-700 mb-4">{blog.content}</p>

      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={handleLike}
          disabled={userAction === "like"}
          className={`px-4 py-2 rounded ${
            userAction === "like" ? "bg-green-500 text-white" : "bg-gray-200"
          }`}
        >
          👍 {likes}
        </button>

        <button
          onClick={handleDislike}
          disabled={userAction === "dislike"}
          className={`px-4 py-2 rounded ${
            userAction === "dislike" ? "bg-red-500 text-white" : "bg-gray-200"
          }`}
        >
          👎 {dislikes}
        </button>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Add a Comment</h2>
        <textarea
          className="w-full p-2 border rounded mb-2"
          rows="4"
          placeholder="Write your comment..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <button
          onClick={handleComment}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Submit Comment
        </button>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">Comments</h2>
        {comments.length === 0 ? (
          <p className="text-gray-500">No comments yet.</p>
        ) : (
          <ul className="space-y-4">
            {comments.map((c, index) => (
              <li key={index} className="border p-3 rounded">
                <div className="flex items-center gap-2 mb-1">
                  <div className="bg-gray-400 text-white w-6 h-6 flex items-center justify-center rounded-full text-sm">
                    {c.name[0].toUpperCase()}
                  </div>
                  <span className="font-medium">{c.name}</span>
                  <span className="text-sm text-gray-500">({c.email})</span>
                </div>
                <p>{c.comment}</p>
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

"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function Page() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    document.getElementById("title")?.focus();
  }, []);

  useEffect(() => {
    const timer = message && setTimeout(() => setMessage(""), 4000);
    return () => clearTimeout(timer);
  }, [message]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setMessage("❌ Image must be less than 5MB.");
        return;
      }
      setImage(file);
      setPreview(URL.createObjectURL(file));
      setMessage(""); // Clear previous error
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setImage(null);
    setPreview(null);
    setIsSuccess(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;
    setLoading(true);
    setMessage("");
    setIsSuccess(false);

    const userEmail = localStorage.getItem("userEmail");

    if (!userEmail) {
      setMessage("❌ User not logged in.");
      setLoading(false);
      return;
    }

    const trimmedTitle = title.trim();
    const trimmedDescription = description.trim();

    if (!trimmedTitle || !trimmedDescription || !image) {
      setMessage("❌ Please fill in all fields.");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("userEmail", userEmail);
    formData.append("title", trimmedTitle);
    formData.append("description", trimmedDescription);
    formData.append("image", image);

    try {
      const res = await fetch("/api/new_article", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Upload failed");

      setMessage("✅ Article created successfully!");
      setIsSuccess(true);
      resetForm();

      setTimeout(() => setIsSuccess(false), 3000);
    } catch (err) {
      setMessage(`❌ ${err.message}`);
      setIsSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto space-y-4 p-6 border rounded-md shadow mt-36"
    >
      <h2 className="text-2xl font-semibold text-center">Create Article</h2>

      <div>
        <label htmlFor="title" className="block font-medium mb-1">
          Title
        </label>
        <input
          id="title"
          type="text"
          placeholder="Enter title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>

      <div>
        <label htmlFor="description" className="block font-medium mb-1">
          Description
        </label>
        <textarea
          id="description"
          placeholder="Enter description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>

      <div>
        <label htmlFor="image" className="block font-medium mb-1">
          Upload Image
        </label>
        <input
          id="image"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="w-full"
        />
      </div>

      {preview && (
        <div className="relative w-full h-48 border rounded overflow-hidden">
          <Image
            src={preview}
            alt="Preview"
            fill
            className="object-cover rounded"
            onError={() => setPreview("/fallback.jpg")}
            unoptimized // Required for local preview URLs like blob:
          />
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className={`w-full px-4 py-2 rounded text-white ${
          loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {loading ? "Uploading..." : "Submit"}
      </button>

      {message && (
        <p
          className={`text-center text-sm mt-2 ${
            isSuccess ? "text-green-600" : "text-red-600"
          }`}
        >
          {message}
        </p>
      )}
    </form>
  );
}

"use client";

import { useState } from "react";
import Image from "next/image";

export default function RegisterPage() {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  async function handleRegister(e) {
    e.preventDefault();

    if (!userName || !email || !password || !image) {
      setMessage("All fields including image are required!");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const formData = new FormData();
      formData.append("userName", userName);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("image", image);

      const res = await fetch("/api/auth/register", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      setMessage(data.message);

      if (res.ok) {
        setUserName("");
        setEmail("");
        setPassword("");
        setImage(null);
        setPreview(null);
        localStorage.setItem("Image", data.image); // image URL from server
        window.location.href = "/login";
      }
    } catch (err) {
      setMessage("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex justify-center items-center h-[80vh]">
      <div className="max-w-md mx-auto mt-10 min-h-[50vh] w-1/3 bg-white border border-gray-300 shadow-2xl rounded-xl p-4 gap-8">
        <h2 className="text-2xl font-bold mb-4 text-center">Register</h2>
        <form onSubmit={handleRegister} className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="Username"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="p-2 border rounded"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="p-2 border rounded"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-2 border rounded"
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="p-2 border rounded"
          />
          {preview && (
            <div className="w-full h-40">
              <Image
                src={preview}
                alt="Preview"
                width={160}
                height={160}
                className="w-full h-full object-cover rounded"
              />
            </div>
          )}
          <button
            type="submit"
            className="p-2 my-3 bg-blue-500 text-white rounded hover:bg-blue-600"
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
        {message && <p className="mt-3 text-center text-red-500">{message}</p>}
      </div>
    </div>
  );
}

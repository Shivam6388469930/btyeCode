"use client";
import React, { useState } from "react"; // Added useState import

export default function Page() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState(""); // Added status for feedback
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Sending...");
    
    const formData = { email };

    const response = await fetch("/api/suscribe", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();
    if (response.ok) {
      setStatus("✅ Thank you for subscribing!");
      setEmail(""); // Reset email input after successful submission
    } else {
      setStatus("❌ Failed to send email. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-800">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-emerald-400 to-blue-500 text-white py-16 px-6 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">About ByteCode</h1>
        <p className="text-lg md:text-xl max-w-3xl mx-auto">
          Where ideas meet innovation. We believe in the power of stories and knowledge to shape a better digital world.
        </p>
      </section>

      {/* Mission */}
      <section className="py-16 px-6 text-center max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
        <p className="text-lg text-gray-600">
          ByteCode was founded with the goal of simplifying tech knowledge and empowering readers through practical,
          insightful, and well-crafted content. Whether you are a beginner or a pro, we are here to help you grow.
        </p>
      </section>

      {/* Share Ideas */}
      <section className=" px-6 text-center max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-6">Share Your Ideas</h2>
        <p className="text-lg text-gray-600">
          Have a cool tech idea or article concept? We&#39;d love to hear from you!
        </p>
      </section>

      {/* Team Intro */}
      <section className="py-16 px-6 bg-gray-50">
        <h2 className="text-3xl font-bold text-center mb-10">Meet the Team</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 max-w-6xl mx-auto">
          {["Kundan", "Anjali", "Ravi"].map((name, idx) => (
            <div
              key={idx}
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all text-center"
            >
              <div className="w-24 h-24 mx-auto rounded-full bg-emerald-300 flex items-center justify-center text-white text-2xl font-bold mb-4">
                {name[0]}
              </div>
              <h3 className="text-xl font-semibold">{name}</h3>
              <p className="text-sm text-gray-500">Content Creator</p>
              <p className="mt-2 text-gray-600 text-sm">
                Passionate about sharing tech knowledge and building a smarter future.
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6 mb-5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-center">
        <h2 className="text-3xl font-bold mb-4">Join Our Community</h2>
        <p className="mb-6 text-lg">Get the latest articles, news, and tech tips directly in your inbox.</p>
        <input
          type="email"
          placeholder="Enter your email"
          className="p-3 rounded w-full max-w-sm mb-4 text-gray-800"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <br />
        <button className="bg-white text-purple-700 font-semibold px-6 py-3 rounded hover:bg-gray-200 transition-all" onClick={handleSubmit}>
          Subscribe Now
        </button>

        {/* Status Feedback */}
        {status && <p className="mt-4 text-lg">{status}</p>}
      </section>
    </div>
  );
}

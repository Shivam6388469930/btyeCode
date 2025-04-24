'use client'

import React, { useState } from 'react'

const Footer = () => {
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
      setEmail("");
    } else {
      setStatus("❌ Failed to send email. Please try again.");
    }
  };

  return (
    <div className="w-full z-30 bg-gray-100 text-gray-800 px-4 sm:px-6 lg:px-12 py-10">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-10 border-t-2 border-gray-400">

        {/* Left Column */}
        <div className="md:w-1/3 w-full">
          <h3 className="text-2xl font-bold mb-2">
            <span className="text-emerald-300">Byte</span>Code
          </h3>
          <p className="text-sm mb-4">
            Where ideas meet innovation. Dive into a world of insightful articles written by passionate thinkers and industry experts.
          </p>
          <div>
            <h4 className="font-semibold mb-2">Stay Updated</h4>
            <input
              type="email"
              placeholder="Enter your email"
              className="text-base p-2 w-full border border-gray-300 rounded mb-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button
              className="w-full bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition"
              onClick={handleSubmit}
            >
              Subscribe
            </button>
            {status && <p className="mt-2 text-sm">{status}</p>}
          </div>
        </div>

        {/* Middle Column */}
        <div className="md:w-1/4 w-full">
          <h3 className="text-xl font-bold mb-2">Explore</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-emerald-500 transition">All Articles</a></li>
            <li><a href="#" className="hover:text-emerald-500 transition">Topics</a></li>
            <li><a href="#" className="hover:text-emerald-500 transition">Authors</a></li>
            <li><a href="#" className="hover:text-emerald-500 transition">Podcasts</a></li>
          </ul>
        </div>

        {/* Right Column */}
        <div className="md:w-1/4 w-full">
          <h3 className="text-xl font-bold mb-2">Legal</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-emerald-500 transition">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-emerald-500 transition">Terms Of Service</a></li>
            <li><a href="#" className="hover:text-emerald-500 transition">Cookie Policy</a></li>
            <li><a href="#" className="hover:text-emerald-500 transition">Licenses</a></li>
          </ul>
        </div>

      </div>
    </div>
  );
};

export default Footer;

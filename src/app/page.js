"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

const Page = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await fetch("/api/new_article"); // 👈 make sure this is correct!
        const data = await res.json();
        setArticles(data.articles);
      } catch (error) {
        console.error("Failed to fetch articles:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  const handleread = (article) => {
    localStorage.setItem("cardTitle", article.title);
    localStorage.setItem("cardDes", article.description);
    localStorage.setItem("cardImage", article.image);
    window.location.href = "/comment";
  };

  return (
    <div className="pb-5">
      {/* Hero Section */ }
      <div
        className="relative w-full h-[300px] md:h-[400px] lg:h-[500px] flex items-center justify-center bg-center bg-cover"
        style={{ backgroundImage: "url('/bblog.webp')" }}
      >
        <div className="absolute inset-0 bg-black opacity-60"></div>
        <div className="relative text-center z-10 text-white">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-4xl md:text-5xl font-bold"
          >
            Welcome to Our Website
          </motion.h1>
          <p className="mt-2 text-lg md:text-xl">Discover amazing features and offers!</p>
          <button className="mt-4 px-6 py-2 bg-white text-blue-600 font-semibold rounded-full hover:bg-gray-200 transition">
            Get Started
          </button>
        </div>
      </div>

      {/* Blog Section */ }
      <section className="flex flex-col items-center p-6 bg-gray-100 mt-4">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-emerald-700 text-4xl md:text-5xl font-bold opacity-80"
        >
          Welcome to My Blog
        </motion.h1>
      </section>

      {/* Cards Grid */ }
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl w-full mx-auto p-6">
        {loading ? (
          <p className="text-center col-span-3">Loading articles...</p>
        ) : articles.length === 0 ? (
          <p className="text-center col-span-3">No articles found.</p>
        ) : (
          articles.map((article, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut", delay: index * 0.1 }}
              className="bg-white p-6 rounded-2xl shadow-lg hover:scale-105 transition-transform"
            >
              <Image
                src={article.image}
                alt={article.title}
                width={500}
                height={300}
                className="w-full h-40 object-cover rounded-lg"
                onError={() => setPreview("/fallback.jpg")} // Optional fallback
              />
              <h2 className="text-lg font-semibold text-gray-900 mt-4">{article.title}</h2>
              <p className="text-gray-600 mt-2">
                {article.description.length > 200
                  ? article.description.slice(0, 200) + "..."
                  : article.description}
              </p>
              <button
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                onClick={() => handleread(article)}
              >
                Read More
              </button>
            </motion.div>
          ))
        )}
      </div>

      {/* See All Articles Button */ }
      <div className="flex justify-center">
        <a href="/articles">
          <button className="mt-4 px-4 py-2 text-center bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
            See All Articles
          </button>
        </a>
      </div>
    </div>
  );
};

export default Page;

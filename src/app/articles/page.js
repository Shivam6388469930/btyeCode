"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";

const Page = () => {
  const [allArticles, setAllArticles] = useState([]);
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [totalPages, setTotalPages] = useState(1);

  const router = useRouter();

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await fetch("/api/new_article");
        const data = await res.json();
        setAllArticles(data.articles || []);
      } catch (error) {
        console.error("Failed to fetch articles:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, []);

  const updateVisibleArticles = useCallback(
    (page = 1, query = "") => {
      const filtered = allArticles.filter(
        (card) =>
          card.title.toLowerCase().includes(query.toLowerCase()) ||
          card.description.toLowerCase().includes(query.toLowerCase())
      );

      setTotalPages(Math.ceil(filtered.length / 10));
      const paginated = filtered.slice((page - 1) * 10, page * 10);
      setCards(paginated);
    },
    [allArticles]
  );

  useEffect(() => {
    updateVisibleArticles(currentPage, searchQuery);
  }, [currentPage, searchQuery, updateVisibleArticles]);

  const handleRead = useCallback(
    (card) => {
      const encodedId = encodeURIComponent(card._id);
      router.push(`/comment?id=${encodedId}`);
    },
    [router]
  );

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handlePagination = (direction) => {
    if (direction === "next" && currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    } else if (direction === "prev" && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setCurrentPage(1);
  };

  return (
    <main>
      <div
        className="relative w-full h-[300px] md:h-[400px] flex items-center justify-center bg-center bg-cover"
        style={{ backgroundImage: "url('/bblog.webp')" }}
      />

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-4xl md:text-5xl font-bold text-center my-6"
      >
        All Articles
      </motion.h1>

      <div className="flex justify-center mb-6">
        <input
          type="text"
          className="border p-2 rounded-lg"
          placeholder="Search articles..."
          value={searchQuery}
          onChange={handleSearch}
        />
        {searchQuery && (
          <button
            onClick={handleClearSearch}
            className="ml-2 px-4 py-2 bg-gray-300 rounded-lg"
          >
            Clear
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : cards.length === 0 ? (
        <div className="text-center text-gray-600">No articles found.</div>
      ) : (
        <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl w-full mx-auto p-6">
          {cards.map((card, index) => (
            <motion.article
              key={card._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut", delay: index * 0.05 }}
              className="bg-white p-6 rounded-2xl shadow-lg hover:scale-105 transition-transform"
            >
              <div className="relative w-full h-40">
                <Image
                  src={card.image || "https://via.placeholder.com/300x200"}
                  alt={card.title}
                  fill
                  className="object-cover rounded-lg"
                  sizes="(max-width: 768px) 100vw, 33vw"
                  priority={index < 6} // Optimize LCP for first few images
                />
              </div>
              <h2 className="text-lg font-semibold text-gray-900 mt-4">
                {card.title}
              </h2>
              <p className="text-gray-600 mt-2">
                {card.description.length > 100
                  ? card.description.slice(0, 100) + "..."
                  : card.description}
              </p>
              <button
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                onClick={() => handleRead(card)}
              >
                Read More
              </button>
            </motion.article>
          ))}
        </section>
      )}

      <div className="flex justify-center mt-6 items-center gap-4 mb-7">
        <button
          onClick={() => handlePagination("prev")}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-200 rounded-lg text-gray-700"
        >
          Previous
        </button>
        <p className="text-gray-700">
          Page {currentPage} of {totalPages}
        </p>
        <button
          onClick={() => handlePagination("next")}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-200 rounded-lg text-gray-700"
        >
          Next
        </button>
      </div>
    </main>
  );
};

export default Page;

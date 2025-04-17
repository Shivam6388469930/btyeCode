"use client";

import { useEffect, useState } from "react";

export default function Page() {
  const [articles, setArticles] = useState([]);
  const [views, setViews] = useState(1500); // Placeholder
  const [comments, setComments] = useState(12); // Placeholder

  // Fetch articles from the real API
  useEffect(() => {
    const fetchArticles = async () => {
      const userEmail = localStorage.getItem("userEmail");
      if (!userEmail) return;

      try {
        const res = await fetch(`/api/admin_detail?userEmail=${userEmail}`);
        const data = await res.json();

        if (res.ok) {
          setArticles(data.articles || []); // Update with real data
        } else {
          console.error("Failed to fetch articles:", data.message);
        }
      } catch (error) {
        console.error("Error fetching articles:", error);
      }
    };

    fetchArticles();
  }, []);

  const cards = [
    { name: "Total Articles", number: articles.length, growth: "+6 From Last Month" },
    { name: "Total Comments", number: comments, growth: "+4 From Last Month" },
    { name: "Total Views", number: views, growth: "+200 From Last Month" },
  ];

  return (
    <div className="p-4 w-full mb-5">
      <div className="p-4 border-2 border-gray-200 rounded-lg">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between mb-3 gap-3">
          <div>
            <h3 className="text-lg font-semibold">Blog Dashboard</h3>
            <p className="text-gray-500">Manage your content and analytics</p>
          </div>
          <a href="/new_article">
            <button className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 w-full sm:w-auto">
              New +
            </button>
          </a>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {cards.map((card, index) => (
            <div
              key={index}
              className="p-5 bg-gray-200 rounded-xl shadow-md hover:scale-105 transition-transform"
            >
              <p className="text-xl font-semibold">{card.name}</p>
              <p>{card.number}</p>
              <p className="text-green-600">{card.growth}</p>
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="mt-6 overflow-x-auto">
          <table className="w-full bg-white border border-gray-200 rounded-lg shadow-md">
            <thead className="bg-gray-800 text-white">
              <tr>
                {["Title", "Status", "Comments", "Date", "Actions"].map((head) => (
                  <th key={head} className="py-3 px-4 sm:px-6 text-left text-sm">
                    {head}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {articles.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-4 text-gray-500">
                    No articles found.
                  </td>
                </tr>
              ) : (
                articles.map((article) => (
                  <tr key={article._id} className="border-b text-sm">
                    <td className="py-3 px-4 sm:px-6">{article.title}</td>
                    <td className="py-3 px-4 sm:px-6 text-green-600">Published</td>
                    <td className="py-3 px-4 sm:px-6">--</td>
                    <td className="py-3 px-4 sm:px-6">
                      {new Date(article.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 sm:px-6">
                      <button className="text-blue-500 hover:underline">Edit</button> |{" "}
                      <button className="text-red-500 hover:underline">Delete</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

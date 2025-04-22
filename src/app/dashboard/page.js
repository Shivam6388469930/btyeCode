"use client";

import { useEffect, useState } from "react";

export default function Page() {
  const [articles, setArticles] = useState([]);
  const [views, setViews] = useState(1500); // Placeholder for views
  const [comments, setComments] = useState(12); // Placeholder for comments

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [currentArticle, setCurrentArticle] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchArticles = async () => {
      const userEmail = localStorage.getItem("userEmail");
      if (!userEmail) return;

      try {
        const res = await fetch(`/api/admin_detail?userEmail=${userEmail}`);
        const contentType = res.headers.get("content-type");

        if (contentType && contentType.includes("application/json")) {
          const data = await res.json();
          if (res.ok) {
            setArticles(data.articles || []);
            setViews(data.totalViews || 1500);  // Fetch total views from the API
            setComments(data.totalComments || 12);  // Fetch total comments from the API
            setError(null);
          } else {
            setError(`Failed to fetch articles: ${data.message || "Unknown error"}`);
          }
        } else {
          const text = await res.text();
          setError("Unexpected response from server.");
        }
      } catch (error) {
        setError(`Error fetching articles: ${error.message}`);
      }
    };

    fetchArticles();
  }, []);

  const handleEdit = (article) => {
    setCurrentArticle(article);
    setEditModalOpen(true);
  };

  const handleDelete = (article) => {
    setCurrentArticle(article);
    setDeleteModalOpen(true);
  };

  const handleSaveEdit = async () => {
    setLoading(true); // Set loading state to true when saving
    const updatedArticle = {
      title: currentArticle.title,
      description: currentArticle.description, // Changed from 'content' to 'description'
    };

    try {
      const res = await fetch(`/api/admin_detail/?id=${currentArticle._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedArticle),
      });

      const data = await res.json();

      if (res.ok) {
        setArticles((prev) =>
          prev.map((article) =>
            article._id === currentArticle._id ? data.article : article
          )
        );
        setEditModalOpen(false);
        setError(null);
      } else {
        setError(`Update failed: ${data.message || "Unknown error"}`);
      }
    } catch (error) {
      setError(`Error updating article: ${error.message}`);
    } finally {
      setLoading(false); // Reset loading state after operation
    }
  };

  const handleConfirmDelete = async () => {
    setLoading(true); // Set loading state to true when starting deletion

    try {
      const res = await fetch(`/api/admin_detail/?id=${currentArticle._id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();

      if (res.ok) {
        setArticles((prev) =>
          prev.filter((article) => article._id !== currentArticle._id)
        );
        setDeleteModalOpen(false);
        setError(null);
      } else {
        setError(`Delete failed: ${data.message || "Unknown error"}`);
      }
    } catch (error) {
      setError(`Error deleting article: ${error.message}`);
    } finally {
      setLoading(false); // Reset loading state after operation
    }
  };

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
                      <button
                        onClick={() => handleEdit(article)}
                        className="text-blue-500 hover:underline"
                      >
                        Edit
                      </button>{" "}
                      |{" "}
                      <button
                        onClick={() => handleDelete(article)}
                        className="text-red-500 hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-500 text-white p-2 rounded mt-4">
          {error}
        </div>
      )}

      {/* Edit Modal */}
      {editModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-md w-1/3">
            <h3 className="text-lg font-semibold mb-4">Edit Article</h3>
            <input
              type="text"
              value={currentArticle.title}
              onChange={(e) =>
                setCurrentArticle((prev) => ({ ...prev, title: e.target.value }))
              }
              className="w-full p-2 border border-gray-300 rounded mb-3"
              placeholder="Title"
            />
            <textarea
              value={currentArticle.description} // Changed from 'content' to 'description'
              onChange={(e) =>
                setCurrentArticle((prev) => ({ ...prev, description: e.target.value }))
              }
              className="w-full p-2 border border-gray-300 rounded mb-3"
              placeholder="Description"
              rows="4"
            ></textarea>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setEditModalOpen(false)}
                className="px-4 py-2 bg-gray-400 text-white rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-md w-1/3">
            <h3 className="text-lg font-semibold mb-4">Confirm Deletion</h3>
            <p>Are you sure you want to delete this article?</p>
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setDeleteModalOpen(false)}
                className="px-4 py-2 bg-gray-400 text-white rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded"
                disabled={loading}
              >
                {loading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

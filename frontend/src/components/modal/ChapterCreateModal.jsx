import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import api from "../../utils/axios";

const ChapterCreateModal = ({ storyId, onClose, onCreated, chapters = [] }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [suggestedNo, setSuggestedNo] = useState(1);

  useEffect(() => {
    const existingNumbers = chapters.map((ch) => ch.chapter_no);
    let i = 1;
    while (existingNumbers.includes(i)) i++;
    setSuggestedNo(i);
  }, [chapters]);

  const handleCreate = async () => {
    if (!title.trim()) return setError("Chapter title is required.");
    setError("");
    setLoading(true);

    try {
      await api.post(`core/stories/${storyId}/chapters/`, {
        title,
        content,
        story: storyId,
        chapter_no: suggestedNo,
        order: chapters.length + 1,
      });

      onClose();
      onCreated(); 
    } catch (err) {
      console.error(err);
      const data = err.response?.data;
      const errMsg =
        data?.title?.[0] ||
        data?.story?.[0] ||
        data?.chapter_no?.[0] ||
        "Failed to create chapter.";
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center backdrop-blur-sm px-4">
      <div className="bg-white w-full max-w-2xl rounded-xl shadow-xl p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
        >
          <X className="h-5 w-5" />
        </button>

        <h2 className="text-2xl font-semibold mb-2 text-gray-800">
          Create New Chapter
        </h2>
        <p className="text-sm text-gray-500 mb-4">
          This will be saved as Chapter {suggestedNo}
        </p>

        {error && (
          <div className="bg-red-100 text-red-600 px-4 py-2 rounded mb-4 text-sm font-medium">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <input
            type="text"
            autoFocus
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            placeholder="Chapter title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <textarea
            rows="8"
            className="w-full border border-gray-300 rounded-md px-4 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            placeholder="Start writing your chapter content..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-md transition disabled:opacity-60"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:opacity-60"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Chapter"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChapterCreateModal;

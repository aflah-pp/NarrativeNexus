import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiSave, FiX } from "react-icons/fi";
import { Loader2 } from "lucide-react"; 
import api from "../../utils/axios";

const StoryCreateModal = ({ onClose, onCreated }) => {
  const [formData, setFormData] = useState({
    title: "",
    genre: "",
    status: "",
    synopsis: "",
    tags: [],
    cover_image: null,
  });

  const [tagInput, setTagInput] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); 

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, cover_image: file }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleTagKeyDown = (e) => {
    if (["Enter", ","].includes(e.key) && tagInput.trim()) {
      e.preventDefault();
      const newTag = tagInput.trim().replace(/[/[\]]/g, "");
      if (
        newTag.length &&
        !formData.tags.includes(newTag) &&
        formData.tags.length < 10
      ) {
        setFormData((prev) => ({
          ...prev,
          tags: [...prev.tags, newTag],
        }));
      }
      setTagInput("");
    }
  };

  const handleTagRemove = (index) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true); 

    try {
      const payload = new FormData();
      payload.append("title", formData.title);
      payload.append("genre", formData.genre);
      payload.append("status", formData.status);
      payload.append("synopsis", formData.synopsis);
      formData.tags.forEach((tag) => payload.append("tags", tag));
      if (formData.cover_image) {
        payload.append("cover_image", formData.cover_image);
      }

      const res = await api.post("core/stories/", payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const newStory = res.data;

      if (newStory.cover_image_url) {
        setImagePreview(newStory.cover_image_url);
      }

      if (onCreated) onCreated(newStory);
      onClose();
    } catch (err) {
      console.error("Story creation failed:", err);
      setError(
        err.response?.data?.detail ||
          "Something went wrong while creating the story."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{
          duration: 0.3,
          type: "spring",
          stiffness: 300,
          damping: 20,
        }}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">Create Story</h2>
          <motion.button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-800"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            disabled={loading} 
          >
            <FiX className="w-6 h-6" />
          </motion.button>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
            maxLength={100}
            disabled={loading}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            placeholder="Title"
          />

          {/* Genre & Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select
              name="genre"
              value={formData.genre}
              onChange={handleInputChange}
              required
              disabled={loading}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            >
              <option value="">Select Genre</option>
              <option value="Fantasy">Fantasy</option>
              <option value="Scifi">Sci-fi</option>
              <option value="Mystery">Mystery</option>
              <option value="Romance">Romance</option>
              <option value="Horror">Horror</option>
              <option value="Other">Other</option>
            </select>

            <select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              required
              disabled={loading}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            >
              <option value="">Select Status</option>
              <option value="Completed">Completed</option>
              <option value="Ongoing">Ongoing</option>
              <option value="Hiatus">Hiatus</option>
              <option value="Draft">Draft</option>
            </select>
          </div>

          {/* Synopsis */}
          <textarea
            name="synopsis"
            value={formData.synopsis}
            onChange={handleInputChange}
            rows="4"
            required
            maxLength={300}
            disabled={loading}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            placeholder="Write your story synopsis..."
          />

          {/* Tags */}
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleTagKeyDown}
            disabled={loading}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
            placeholder="Enter tag and press Enter or comma"
          />

          {/* Tag list */}
          <div className="mt-2 flex flex-wrap gap-2">
            <AnimatePresence>
              {formData.tags.map((tag, index) => (
                <motion.div
                  key={index}
                  className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                >
                  <span>{tag}</span>
                  <button
                    type="button"
                    onClick={() => handleTagRemove(index)}
                    disabled={loading}
                    className="ml-1 text-blue-500 hover:text-red-500"
                  >
                    &times;
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Image Upload */}
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={loading}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          />
          {imagePreview && (
            <motion.img
              src={imagePreview}
              alt="Preview"
              className="mt-2 w-32 h-32 object-cover rounded-md"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            />
          )}

          {/* Submit Button */}
          <motion.button
            type="submit"
            className="flex items-center justify-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={loading || formData.tags.length > 10}
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <FiSave className="w-4 h-4" />
                <span>Create Story</span>
              </>
            )}
          </motion.button>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default StoryCreateModal;

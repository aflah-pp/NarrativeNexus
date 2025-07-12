import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiSave, FiTrash2, FiX } from "react-icons/fi";
import { Loader2 } from "lucide-react"; 

const StoryEditModal = ({
  formData,
  error,
  imagePreview,
  handleInputChange,
  handleTagKeyDown,
  handleTagRemove,
  handleFileChange,
  handleSubmit,
  handleDelete,
  onClose,
  loading,
  isSaving,
  isDeleting,
}) => {
  return (
    <motion.div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
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
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">Edit Story</h2>
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

        {/* Error message */}
        {error && (
          <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              required
              maxLength={100}
              disabled={loading}
            />
          </div>

          {/* Genre & Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Genre
              </label>
              <select
                name="genre"
                value={formData.genre}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                required
                disabled={loading}
              >
                <option value="Fantasy">Fantasy</option>
                <option value="Scifi">Sci-fi</option>
                <option value="Mystery">Mystery</option>
                <option value="Romance">Romance</option>
                <option value="Horror">Horror</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                required
                disabled={loading}
              >
                <option value="Completed">Completed</option>
                <option value="Ongoing">Ongoing</option>
                <option value="Hiatus">Hiatus</option>
                <option value="Draft">Draft</option>
              </select>
            </div>
          </div>

          {/* Synopsis */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Synopsis
            </label>
            <textarea
              name="synopsis"
              value={formData.synopsis}
              onChange={handleInputChange}
              rows="6"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              required
              maxLength={300}
              disabled={loading}
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tags (Enter or comma, max 10)
            </label>
            <input
              type="text"
              name="tags"
              placeholder="Add tags and press Enter or comma"
              onKeyDown={handleTagKeyDown}
              disabled={loading}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
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
                      className="ml-1 text-blue-500 hover:text-red-500"
                      disabled={loading}
                    >
                      &times;
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cover Image (Optional)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              disabled={loading}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
            {imagePreview && (
              <div className="mt-2">
                <p className="text-sm text-gray-600">Current Image:</p>
                <motion.img
                  src={imagePreview}
                  alt="Cover Preview"
                  className="mt-2 w-32 h-32 object-cover rounded-lg"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-4">
            {/* Save Button */}
            <motion.button
              type="submit"
              disabled={isSaving || formData.tags.length > 10}
              className="flex items-center justify-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <FiSave className="w-4 h-4" />
                  <span>Save Changes</span>
                </>
              )}
            </motion.button>

            {/* Delete Button */}
            <motion.button
              type="button"
              onClick={handleDelete}
              disabled={isDeleting}
              className="flex items-center justify-center space-x-2 bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition disabled:opacity-50"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Deleting...</span>
                </>
              ) : (
                <>
                  <FiTrash2 className="w-4 h-4" />
                  <span>Delete Story</span>
                </>
              )}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default StoryEditModal;

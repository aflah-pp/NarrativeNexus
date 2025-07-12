import {
  FiUser,
  FiStar,
  FiBook,
  FiPlay,
  FiBookmark,
  FiShare2,
  FiEdit,
  FiArrowLeft,
} from "react-icons/fi";
import { motion } from "framer-motion";

const StoryHeader = ({
  story,
  chapters,
  imagePreview,
  navigate,
  setIsEditing,
}) => {
  return (
    <>
      <div className="flex items-center justify-between mb-6 text-sm text-gray-600">
        <motion.button
          onClick={() => navigate("/write")}
          className="flex items-center space-x-1 hover:text-blue-600 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FiArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </motion.button>

        <motion.button
          onClick={() => setIsEditing((prev) => !prev)}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FiEdit className="w-4 h-4" />
          <span>Edit Story</span>
        </motion.button>
      </div>

      <motion.div
        className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl overflow-hidden mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col lg:flex-row">
          <div className="lg:w-2/3 p-8 lg:p-12 text-white">
            <div className="flex items-center space-x-2 mb-4">
              <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium">
                {story.genre}
              </span>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  story.status === "Completed"
                    ? "bg-green-500/20 border border-green-400"
                    : "bg-orange-500/20 border border-orange-400"
                }`}
              >
                {story.status}
              </span>
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold mb-4">
              {story.title}
            </h1>
            <div className="flex items-center space-x-6 mb-6 text-white/80">
              <div className="flex items-center space-x-2">
                <FiUser className="w-4 h-4" />
                <span>{story.author}</span>
              </div>
              <div className="flex items-center space-x-2">
                <FiBook className="w-4 h-4" />
                <span>{chapters.length} chapters</span>
              </div>
            </div>
            
          </div>

          <div className="lg:w-1/3 p-8 lg:p-12 flex items-center justify-center">
            {imagePreview && (
              <motion.img
                src={imagePreview}
                alt={story.title}
                className="w-full max-w-xs rounded-xl shadow-2xl"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              />
            )}
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default StoryHeader;

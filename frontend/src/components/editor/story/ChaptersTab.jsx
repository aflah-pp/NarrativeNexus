import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { FiBook, FiCalendar, FiPlus } from "react-icons/fi";
import ChapterCreateModal from "../../modal/ChapterCreateModal";
import api from "../../../utils/axios";

const ChaptersTab = () => {
  const navigate = useNavigate();
  const { storyId } = useParams();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [chapters, setChapters] = useState([]);

  const fetchChapters = async () => {
    try {
      const res = await api.get(`/core/stories/${storyId}/chapters/`);
      setChapters(res.data);
    } catch (err) {
      console.error("Failed to fetch chapters", err);
    }
  };

  useEffect(() => {
    fetchChapters();
  }, [storyId]);

  return (
    <motion.div
      key="chapters"
      className="bg-white rounded-xl shadow-sm border border-gray-200"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="p-6 border-b border-gray-200 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Chapters</h2>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
        >
          <FiPlus className="w-4 h-4" />
          <span>Create New</span>
        </button>
      </div>

      {chapters.length === 0 ? (
        <div className="p-8 text-center text-gray-500">
          <FiBook className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p>No chapters available yet</p>
        </div>
      ) : (
        <div className="divide-y divide-gray-200">
          {chapters
            .filter((chapter) => chapter?.chapter_no && chapter?.id)
            .map((chapter) => (
              <motion.div
                key={chapter.id}
                onClick={() =>
                  navigate(`/write/${storyId}/chapters/${chapter.chapter_no}`)
                }
                className="p-6 hover:bg-gray-50 cursor-pointer transition-colors group"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-sm font-medium">
                        Chapter {chapter.chapter_no}
                      </span>
                      <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {chapter.title}
                      </h3>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <FiCalendar className="w-3 h-3" />
                        <span>
                          {new Date(chapter.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <FiBook className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                </div>
              </motion.div>
            ))}
        </div>
      )}

      {showCreateModal && (
        <ChapterCreateModal
          storyId={storyId}
          onClose={() => setShowCreateModal(false)}
          onCreated={fetchChapters}
          chapters={chapters}
        />
      )}
    </motion.div>
  );
};

export default ChaptersTab;

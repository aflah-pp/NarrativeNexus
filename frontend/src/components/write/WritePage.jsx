import React, { useEffect, useState } from "react";
import { Plus, Loader2, PenTool } from "lucide-react";
import api from "../../utils/axios";
import { motion } from "framer-motion";
import { useAuthUser } from "../../context/AuthUserContext";
import StoryCreateModal from "../modal/StoryCreateModal";
import Navbar from "../layout/NavBar";

const WritePage = () => {
  const [stories, setStories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState("grid");
  const { authUser } = useAuthUser();

  const fetchStories = async () => {
    if (!authUser?.username) return;
    setLoading(true);
    try {
      const res = await api.get(`/core/${authUser.username}/stories/`);
      setStories(res.data);
    } catch (err) {
      console.error("Failed to fetch user stories:", err);
      setStories([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStories();
  }, [authUser?.username]);

  const handleStoryCreated = (newStory) => {
    setStories((prev) => [newStory, ...prev]);
    setShowModal(false);
  };

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 mt-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
                Your Stories
              </h1>
              <p className="text-gray-600 text-base mt-2">
                Create and manage your stories
              </p>
            </div>

            <div className="flex items-center gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={openModal}
                className="flex items-center gap-2 px-5 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 hover:shadow-md transition-all duration-300"
              >
                <Plus className="w-5 h-5" />
                <span>Create New Story</span>
              </motion.button>

              {/* View Toggle */}
              <div className="flex items-center gap-1 ml-3">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-md ${
                    viewMode === "grid"
                      ? "bg-purple-600 text-white"
                      : "bg-gray-200 text-gray-700"
                  }`}
                  title="Grid View"
                >
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zm8 0a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2h-2zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zm8 0a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2h-2z" />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-md ${
                    viewMode === "list"
                      ? "bg-purple-600 text-white"
                      : "bg-gray-200 text-gray-700"
                  }`}
                  title="List View"
                >
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      d="M4 6h12M4 10h12M4 14h12"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Stories Section */}
          {loading ? (
            <div className="text-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-purple-600 mx-auto mb-4" />
              <p className="text-gray-600 text-base font-medium">
                Loading your stories...
              </p>
            </div>
          ) : stories.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <PenTool className="w-10 h-10 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                No Stories Yet
              </h3>
              <p className="text-gray-600 text-base max-w-md mx-auto">
                You haven't created any stories yet. Start your writing journey!
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={openModal}
                className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 hover:shadow-md transition-all duration-300"
              >
                <PenTool className="w-5 h-5" />
                <span>Create Your First Story</span>
              </motion.button>
            </div>
          ) : (
            <div
              className={`${
                viewMode === "grid"
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                  : "flex flex-col gap-4"
              }`}
            >
              {stories.map((story, index) => (
                <motion.div
                  key={story.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  onClick={() => (window.location.href = `/write/${story.id}`)}
                  className={`cursor-pointer bg-white rounded-xl shadow-md border border-gray-200 ${
                    viewMode === "grid"
                      ? "p-5 hover:shadow-lg hover:scale-105"
                      : "p-4 hover:border-purple-500"
                  } transition-all duration-300 group flex ${
                    viewMode === "list" ? "items-start gap-4" : "flex-col"
                  }`}
                >
                  {story.cover_image_url && (
                    <img
                      loading="lazy"
                      src={story.cover_image_url}
                      alt={story.title}
                      className={`${
                        viewMode === "grid"
                          ? "w-full h-48 object-cover rounded-lg mb-4"
                          : "w-24 h-24 object-cover rounded-md"
                      }`}
                    />
                  )}
                  <div className="flex-1">
                    <h2 className="text-lg font-semibold text-gray-900 group-hover:text-purple-600 transition-colors duration-300 truncate">
                      {story.title}
                    </h2>
                    <p className="text-sm text-gray-600 font-medium mt-1">
                      {story.genre}
                    </p>
                    <p className="text-sm text-gray-600 mt-2 line-clamp-3">
                      {story.synopsis}
                    </p>
                    <div className="mt-3 text-xs text-gray-500">
                      created: {new Date(story.updated_at).toLocaleString()}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {showModal && (
            <StoryCreateModal
              onClose={closeModal}
              onCreated={handleStoryCreated}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default WritePage;

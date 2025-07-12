import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FiArrowLeft,
  FiUser,
  FiStar,
  FiBook,
  FiPlay,
  FiBookmark,
  FiShare2,
  FiCalendar,
  FiClock,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../utils/axios";
import { toast } from "react-toastify";

function StoryDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [story, setStory] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [isBookmarked, setIsBookmarked] = useState(true);
  const [likes, setLikes] = useState(0);
  const [newComment, setNewComment] = useState("");
  const [isCommentSubmitting, setIsCommentSubmitting] = useState(false);
  const [userId, setUserId] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    const fetchUserId = async () => {
      try {
        const res = await api.get("users/me/");
        setUserId(res.data.id);
      } catch (err) {
        console.error("Failed to fetch user:", err);
      }
    };
    fetchUserId();
  }, []);

  useEffect(() => {
    setLoading(true);
    setError(null);
    api
      .get(`core/stories/${id}/`)
      .then((res) => {
        const data = res.data;
        setStory(data);
        setChapters(data.chapters || []);
        setComments(data.comments || []);
        setIsBookmarked(data.bookmarks?.includes(userId));
        setLikes(data.likes_count || 0);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to load story details. Please try again later.");
        setLoading(false);
        console.error(err);
      });
  }, [id, userId]);

  const toggleBookmark = async () => {
    if (!userId) {
      setShowLoginModal(true);
      return;
    }

    try {
      const response = await api.post(`core/stories/${id}/bookmark/`);

      if (response.status === 200 || response.status === 201) {
        const { action } = response.data;
        const isNowBookmarked = action === "bookmarked";

        setIsBookmarked(isNowBookmarked);
        console.log("Bookmark toggled:", isNowBookmarked);

        if (isNowBookmarked) {
          toast.success("📌 Bookmarked the story!");
        } else {
          toast.success("🔓 Removed bookmark.");
        }
      }
    } catch (err) {
      console.error("Bookmark toggle error:", err);
      toast.error("❌ Failed to update bookmark. Please try again.");
    }
  };

  const toggleLike = async () => {
    if (!userId) {
      setShowLoginModal(true);
      return;
    }

    try {
      const response = await api.post(`core/stories/${id}/like/`);

      if (response.status === 200 || response.status === 201) {
        const updatedLikes = response.data.likes_count;
        const action = response.data.action; 

        setLikes(updatedLikes);
        console.log("Like toggled:", action, "Total Likes:", updatedLikes);

        if (action === "liked") {
          toast.success("❤️ You liked this story!");
        } else {
          toast.success("💔 You removed your like.");
        }
      }
    } catch (err) {
      console.error("Like toggle error:", err);
      toast.error("❌ Failed to update like. Please try again.");
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: story?.title || "Check out this story",
      text: story?.synopsis || "You might love this story!",
      url: window.location.href,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
        console.log("Story shared successfully");
      } else {
        await navigator.clipboard.writeText(shareData.url);
      }
    } catch (err) {
      console.error("Share failed:", err);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    setIsCommentSubmitting(true);
    try {
      const response = await api.post(`core/stories/${id}/comments/`, {
        content: newComment,
      });
      if (response.status === 201) {
        setComments((prev) => [response.data, ...prev]);
        setNewComment("");
      }
    } catch (err) {
      setError("Failed to post comment. Please try again.");
      console.error(err);
    } finally {
      setIsCommentSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading story…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => navigate("/explore")}
            className="flex items-center space-x-2 bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
          >
            <FiArrowLeft className="w-4 h-4" />
            <span>Back to Explore</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {/* Back nav */}
      <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
        <motion.button
          onClick={() => navigate("/explore")}
          className="flex items-center space-x-1 hover:text-purple-600 transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FiArrowLeft className="w-4 h-4" />
          <span>Back</span>
        </motion.button>
        <span>/</span>
        <span className="text-gray-900">{story.title}</span>
      </nav>

      {/* Header */}
      <motion.div
        className="bg-gradient-to-r from-purple-600 to-indigo-700 rounded-2xl overflow-hidden mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col lg:flex-row">
          <div className="lg:w-2/3 p-8 lg:p-12 text-white">
            <div className="flex items-center space-x-2 mb-4">
              <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium">
                {story.genre || "Unknown"}
              </span>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  story.status === "Completed"
                    ? "bg-green-500/20 border border-green-400"
                    : "bg-orange-500/20 border border-orange-400"
                }`}
              >
                {story.status || "Unknown"}
              </span>
            </div>

            <h1 className="text-3xl lg:text-4xl font-bold mb-4">
              {story.title}
            </h1>

            <div className="flex items-center space-x-6 mb-6 text-white/80">
              <div className="flex items-center space-x-2">
                <FiUser className="w-4 h-4" />
                <span>{story.author || "Anonymous"}</span>
              </div>
              <div className="flex items-center space-x-2">
                <FiBook className="w-4 h-4" />
                <span>{chapters.length} chapters</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 mb-6">
              <motion.button
                onClick={() =>
                  chapters.length > 0 &&
                  navigate(`/explore/${id}/chapters/${chapters[0].chapter_no}`)
                }
                className="flex items-center space-x-2 bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FiPlay className="w-4 h-4" />
                <span>Start Reading</span>
              </motion.button>
              <motion.button
                onClick={toggleBookmark}
                className={`flex items-center space-x-2 ${
                  isBookmarked
                    ? "bg-green-600 text-white"
                    : "bg-white/10 text-white border border-white/20"
                } px-6 py-3 rounded-lg font-semibold hover:bg-white/20 transition-colors`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FiBookmark className="w-4 h-4" />
                <span>{isBookmarked ? "Bookmarked" : "Bookmark"}</span>
              </motion.button>
              <motion.button
                onClick={handleShare}
                className="flex items-center space-x-2 bg-white/10 border border-white/20 text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/20 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FiShare2 className="w-4 h-4" />
                <span>Share</span>
              </motion.button>
              <motion.button
                onClick={toggleLike}
                className="flex items-center space-x-2 bg-white/10 border border-white/20 text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/20 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FiStar className="w-4 h-4 text-yellow-400 fill-current" />
                <span>Like ({likes})</span>
              </motion.button>
            </div>
          </div>

          <div className="lg:w-1/3 p-8 lg:p-12 flex items-center justify-center">
            <motion.img
              src={
                story.cover_image_url && story.cover_image_url !== null
                  ? story.cover_image_url
                  : "/placeholder-image.jpg"
              }
              srcSet={
                story.cover_image_url
                  ? `${story.cover_image_url} 600w, ${story.cover_image_url}-300w.jpg 300w`
                  : "/placeholder-image.jpg 600w, /placeholder-image-300w.jpg 300w"
              }
              sizes="(max-width: 640px) 300px, 600px"
              alt={story.title}
              width={300} 
              height={450} 
              className="w-full max-w-xs rounded-xl shadow-2xl"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <motion.div
        className="border-b border-gray-200 mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <nav className="flex space-x-8">
          {["overview", "chapters", "comments"].map((tab) => (
            <motion.button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab
                  ? "border-purple-500 text-purple-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } transition-colors`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
              {tab === "chapters" && ` (${chapters.length})`}
              {tab === "comments" && ` (${comments.length})`}
            </motion.button>
          ))}
        </nav>
      </motion.div>

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <motion.div
          className="grid lg:grid-cols-3 gap-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Synopsis
              </h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {story.synopsis || "No synopsis available."}
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Tags</h2>
              <div className="flex flex-wrap gap-2">
                <AnimatePresence>
                  {Array.isArray(story.tags) && story.tags.length > 0 ? (
                    story.tags.map((tag, index) => (
                      <motion.span
                        key={index}
                        className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.2, delay: index * 0.05 }}
                      >
                        {tag}
                      </motion.span>
                    ))
                  ) : (
                    <span className="text-gray-500">No tags available.</span>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Story Stats
              </h2>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Chapters</span>
                  <span className="font-semibold">{chapters.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Bookmark Status</span>
                  <div className="flex items-center space-x-1">
                    {(isBookmarked && (
                      <span className="font-semibold text-green-500">
                        True{" "}
                      </span>
                    )) || (
                      <span className="font-semibold text-grey-400">
                        False{" "}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status</span>
                  <span
                    className={`font-semibold ${
                      story.status === "Completed"
                        ? "text-green-600"
                        : "text-orange-600"
                    }`}
                  >
                    {story.status || "Unknown"}
                  </span>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Publication Info
              </h2>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <FiCalendar className="w-4 h-4 text-gray-400" />
                  <div>
                    <div className="text-sm text-gray-600">Published</div>
                    <div className="font-medium">
                      {story.created_at
                        ? new Date(story.created_at).toLocaleDateString()
                        : "Unknown"}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <FiClock className="w-4 h-4 text-gray-400" />
                  <div>
                    <div className="text-sm text-gray-600">Last Updated</div>
                    <div className="font-medium">
                      {story.updated_at
                        ? new Date(story.updated_at).toLocaleDateString()
                        : "Unknown"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Chapters Tab */}
      {activeTab === "chapters" && (
        <motion.div
          className="bg-white rounded-xl shadow-sm border border-gray-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Chapters</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {chapters.length > 0 ? (
              chapters.map((chapter, index) => (
                <motion.div
                  key={chapter.id}
                  onClick={() =>
                    navigate(`/explore/${id}/chapters/${chapter.chapter_no}`)
                  }
                  className="p-6 hover:bg-gray-50 cursor-pointer transition-colors group"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded text-sm font-medium">
                          Chapter {chapter.chapter_no}
                        </span>
                        <h3 className="font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">
                          {chapter.title || "Untitled"}
                        </h3>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <FiCalendar className="w-3 h-3" />
                          <span>
                            {chapter.created_at
                              ? new Date(
                                  chapter.created_at
                                ).toLocaleDateString()
                              : "Unknown"}
                          </span>
                        </div>
                      </div>
                    </div>
                    <FiPlay className="w-5 h-5 text-gray-400 group-hover:text-purple-600 transition-colors" />
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="p-6 text-gray-500">No chapters available.</div>
            )}
          </div>
        </motion.div>
      )}

      {/* Comments Tab */}
      {activeTab === "comments" && (
        <motion.div
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Comments</h2>
          <div className="flex flex-col space-y-2 mb-6">
            <textarea
              rows="3"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              disabled={isCommentSubmitting}
            />
            <motion.button
              onClick={handleAddComment}
              className={`self-end bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors ${
                isCommentSubmitting ? "opacity-50 cursor-not-allowed" : ""
              }`}
              whileHover={{ scale: isCommentSubmitting ? 1 : 1.05 }}
              whileTap={{ scale: isCommentSubmitting ? 1 : 0.95 }}
              disabled={isCommentSubmitting}
            >
              {isCommentSubmitting ? "Posting..." : "Post Comment"}
            </motion.button>
          </div>
          <div className="space-y-4">
            {comments.length > 0 ? (
              comments.map((comment, index) => (
                <motion.div
                  key={comment.id}
                  className="border border-gray-200 rounded-lg p-4 bg-gray-50"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <div className="text-sm text-gray-600 mb-1">
                    {comment.user || "Anonymous"} •{" "}
                    {comment.created_at ? comment.created_at : "Unknown"}
                  </div>
                  <p className="text-gray-800">{comment.content}</p>
                </motion.div>
              ))
            ) : (
              <p className="text-gray-500">No comments yet.</p>
            )}
          </div>
        </motion.div>
      )}

      <AnimatePresence>
        {showLoginModal && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-xl shadow-lg p-6 max-w-sm w-full text-center"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Login Required
              </h3>
              <p className="text-gray-600 mb-6">You need to log in.</p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => setShowLoginModal(false)}
                  className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={() => navigate("/login")}
                  className="px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700"
                >
                  Go to Login
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default StoryDetail;

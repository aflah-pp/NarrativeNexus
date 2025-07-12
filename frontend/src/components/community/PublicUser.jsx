import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Loader2,
  User2,
  Mail,
  Calendar,
  BookOpen,
  MessageCircle,
  UserPlus,
  UserMinus,
} from "lucide-react";
import api from "../../utils/axios";
import { useAuthUser } from "../../context/AuthUserContext";
import UserListModal from "../modal/UserList";
import CreationCard from "../modal/CreationCard";
import Navbar from "../layout/NavBar";

const PublicUser = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [stories, setStories] = useState([]);
  const [storiesLoading, setStoriesLoading] = useState(false);
  const [followActionLoading, setFollowActionLoading] = useState(false);

  // Modal states
  const [modal, setModal] = useState({ open: false, title: "", users: [] });

  const { follow, unfollow, getFollowers, getFollowing } = useAuthUser();

  // Fetch user data
  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/users/explore/${id}/`);
        setUser(res.data);
        setIsFollowing(res.data.is_following);
      } catch (err) {
        console.error("Error fetching user:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id]);

  // Fetch user stories
  useEffect(() => {
    const loadStories = async () => {
      if (!user?.username) return;

      setStoriesLoading(true);
      try {
        const res = await api.get(`/core/${user.username}/stories/`);
        setStories(res.data);
      } catch (err) {
        console.error("Failed to fetch user stories:", err);
        setStories([]);
      } finally {
        setStoriesLoading(false);
      }
    };

    loadStories();
  }, [user?.username]);

  const handleFollow = async () => {
    setFollowActionLoading(true);
    try {
      const success = await follow(user.username);
      if (success) {
        setIsFollowing(true);
        setUser((prev) => ({
          ...prev,
          followers_count: prev.followers_count + 1,
        }));
      }
    } catch (err) {
      console.error("Error following user:", err);
    } finally {
      setFollowActionLoading(false);
    }
  };

  const handleUnfollow = async () => {
    setFollowActionLoading(true);
    try {
      const success = await unfollow(user.username);
      if (success) {
        setIsFollowing(false);
        setUser((prev) => ({
          ...prev,
          followers_count: prev.followers_count - 1,
        }));
      }
    } catch (err) {
      console.error("Error unfollowing user:", err);
    } finally {
      setFollowActionLoading(false);
    }
  };

  const openModal = async (type) => {
    try {
      const getList = type === "followers" ? getFollowers : getFollowing;
      const users = await getList(user.username);
      setModal({
        open: true,
        title: type === "followers" ? "Followers" : "Following",
        users,
      });
    } catch (err) {
      console.error(`Failed to fetch ${type}:`, err);
    }
  };

  const closeModal = () => {
    setModal({ ...modal, open: false });
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-purple-600 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">Loading profile...</p>
          </div>
        </div>
      </>
    );
  }

  if (!user) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-600 text-lg">User not found</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50">
        <div className="container mx-auto px-4 py-8 mt-14 lg:py-12">
          <div className="space-y-12">
            {/* Profile Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="w-full max-w-4xl mx-auto"
            >
              <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 lg:p-12">
                <div className="flex flex-col lg:flex-row lg:items-start gap-8">
                  {/* Profile Image */}
                  <div className="flex-shrink-0">
                    <div className="w-32 h-32 lg:w-40 lg:h-40 rounded-full overflow-hidden border-4 border-gray-100 shadow-lg bg-gradient-to-br from-gray-100 to-gray-200">
                      <img
                        loading="lazy"
                        src={
                          user.profile_image_url &&
                          user.profile_image_url !== "null"
                            ? user.profile_image_url
                            : "/default-avathar.png"
                        }
                        alt={user.username}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  {/* User Info Section */}
                  <div className="flex-1">
                    {/* Name and Username */}
                    <div className="mb-6">
                      <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                        {user.first_name && user.last_name
                          ? `${user.first_name} ${user.last_name}`
                          : user.username}
                      </h1>
                      <p className="text-xl text-gray-600">@{user.username}</p>
                    </div>

                    {/* Bio */}
                    <div className="mb-8">
                      {user.bio ? (
                        <p className="text-gray-700 leading-relaxed text-lg max-w-2xl">
                          {user.bio}
                        </p>
                      ) : (
                        <p className="text-gray-400 italic text-lg">
                          This user hasn't written a bio yet.
                        </p>
                      )}
                    </div>

                    {/* User Details */}
                    <div className="flex flex-wrap gap-6 text-gray-600 mb-8">
                      {(user.first_name || user.last_name) && (
                        <div className="flex items-center gap-2">
                          <User2 size={18} className="text-purple-500" />
                          <span>
                            {user.first_name} {user.last_name}
                          </span>
                        </div>
                      )}
                      {user.email && (
                        <div className="flex items-center gap-2">
                          <Mail size={18} className="text-purple-500" />
                          <span className="break-all">{user.email}</span>
                        </div>
                      )}
                      {user.date_joined && (
                        <div className="flex items-center gap-2">
                          <Calendar size={18} className="text-purple-500" />
                          <span>
                            Joined{" "}
                            {new Date(user.date_joined).toLocaleDateString(
                              "en-US",
                              {
                                month: "long",
                                year: "numeric",
                              }
                            )}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Stats and Action Buttons */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                      {/* Stats */}
                      <div className="flex gap-8">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          onClick={() => openModal("followers")}
                          className="text-center group"
                        >
                          <div className="text-2xl font-bold text-gray-900 group-hover:text-purple-600 transition-colors">
                            {user.followers_count || 0}
                          </div>
                          <div className="text-sm text-gray-600 group-hover:text-purple-600 transition-colors">
                            Followers
                          </div>
                        </motion.button>

                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          onClick={() => openModal("following")}
                          className="text-center group"
                        >
                          <div className="text-2xl font-bold text-gray-900 group-hover:text-purple-600 transition-colors">
                            {user.following_count || 0}
                          </div>
                          <div className="text-sm text-gray-600 group-hover:text-purple-600 transition-colors">
                            Following
                          </div>
                        </motion.button>

                        {user.stories_count !== undefined && (
                          <div className="text-center">
                            <div className="text-2xl font-bold text-gray-900">
                              {user.stories_count}
                            </div>
                            <div className="text-sm text-gray-600">Stories</div>
                          </div>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-3">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={isFollowing ? handleUnfollow : handleFollow}
                          disabled={followActionLoading}
                          className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed ${
                            isFollowing
                              ? "bg-gray-100 hover:bg-gray-200 text-gray-700"
                              : "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
                          }`}
                        >
                          {followActionLoading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : isFollowing ? (
                            <UserMinus size={18} />
                          ) : (
                            <UserPlus size={18} />
                          )}
                          <span>{isFollowing ? "Unfollow" : "Follow"}</span>
                        </motion.button>

                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="flex items-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-2xl font-medium transition-all duration-300"
                        >
                          <MessageCircle size={18} />
                          <span>Message</span>
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Stories Section */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="max-w-4xl mx-auto"
            >
              <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
                {/* Section Header */}
                <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-8 py-6">
                  <div className="flex items-center gap-3">
                    <BookOpen className="w-6 h-6 text-white" />
                    <h2 className="text-2xl font-bold text-white">
                      {user.username}'s Stories
                    </h2>
                    <span className="px-3 py-1 bg-white/20 rounded-full text-white text-sm font-medium">
                      {stories.length}
                    </span>
                  </div>
                </div>

                {/* Stories Content */}
                <div className="p-8">
                  {storiesLoading ? (
                    <div className="text-center py-12">
                      <Loader2 className="w-8 h-8 animate-spin text-purple-600 mx-auto mb-4" />
                      <p className="text-gray-600">Loading stories...</p>
                    </div>
                  ) : stories.length === 0 ? (
                    <div className="text-center py-16">
                      <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <BookOpen className="w-12 h-12 text-purple-500" />
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        No Stories Yet
                      </h3>
                      <p className="text-gray-600 max-w-md mx-auto">
                        {user.username} hasn't published any stories yet. Check
                        back later for new content!
                      </p>
                    </div>
                  ) : (
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                      {stories.map((story, index) => (
                        <motion.div
                          key={story.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: index * 0.1 }}
                        >
                          <CreationCard story={story} />
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Modal for Followers / Following */}
        <UserListModal
          open={modal.open}
          onClose={closeModal}
          title={modal.title}
          users={modal.users}
        />
      </div>
    </>
  );
};

export default PublicUser;

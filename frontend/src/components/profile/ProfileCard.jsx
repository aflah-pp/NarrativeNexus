import { useState } from "react";
import { motion } from "framer-motion";
import { Settings, User2, Mail, Calendar } from "lucide-react";
import UserListModal from "../modal/UserList";

const ProfileCard = ({
  authUser,
  following,
  followers,
  refreshAuthUser,
  onEdit,
}) => {
  const [modal, setModal] = useState({ open: false, title: "", users: [] });

  const openModal = async (type) => {
    try {
      const getList = type === "followers" ? followers : following;
      const users = await getList(authUser.username);
      setModal({
        open: true,
        title: type === "followers" ? "Followers" : "Following",
        users,
      });
    } catch (err) {
      console.error(`Failed to fetch ${type}:`, err);
    }
  };

  const closeModal = async () => {
    setModal({ ...modal, open: false });
    await refreshAuthUser();
  };

  if (!authUser) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="w-full max-w-4xl mx-auto mt-14"
    >
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 lg:p-12">
        <div className="flex flex-col lg:flex-row lg:items-start gap-8">
          {/* Profile Image */}
          <div className="flex-shrink-0">
            <motion.div whileHover={{ scale: 1.02 }} className="relative">
              <div className="w-32 h-32 lg:w-40 lg:h-40 rounded-full overflow-hidden border-4 border-gray-100 shadow-lg bg-gradient-to-br from-gray-100 to-gray-200">
                <img
                  loading="lazy"
                  src={
                    authUser.profile_image_url &&
                    authUser.profile_image_url !== "null"
                      ? authUser.profile_image_url
                      : "/default-avathar.png"
                  }
                  alt={authUser.username}
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>
          </div>

          {/* User Info Section */}
          <div className="flex-1">
            {/* Name and Username */}
            <div className="mb-6">
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                {authUser.first_name && authUser.last_name
                  ? `${authUser.first_name} ${authUser.last_name}`
                  : authUser.username}
              </h1>
              <p className="text-xl text-gray-600">@{authUser.username}</p>
            </div>

            {/* User Details */}
            <div className="flex flex-wrap gap-6 text-gray-600 mb-8">
              {(authUser.first_name || authUser.last_name) && (
                <div className="flex items-center gap-2">
                  <User2 size={18} className="text-purple-500" />
                  <span>
                    {authUser.first_name} {authUser.last_name}
                  </span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Mail size={18} className="text-purple-500" />
                <span className="break-all">{authUser.email}</span>
              </div>
            </div>

            {/* Bio */}
            <div className="mb-5">
              {authUser.bio ? (
                <p className="text-gray-700 leading-relaxed text-lg max-w-2xl">
                  {authUser.bio}
                </p>
              ) : (
                <p className="text-gray-400 italic text-lg">
                  This user hasn't written a bio yet.
                </p>
              )}
            </div>

            {/* Stats and Edit Button */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
              {/* Stats */}
              <div className="flex gap-8">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={() => openModal("followers")}
                  className="text-center group"
                >
                  <div className="text-2xl font-bold text-gray-900 group-hover:text-purple-600 transition-colors">
                    {authUser.followers_count || 0}
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
                    {authUser.following_count || 0}
                  </div>
                  <div className="text-sm text-gray-600 group-hover:text-purple-600 transition-colors">
                    Following
                  </div>
                </motion.button>

                {authUser.stories_count !== undefined && (
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">
                      {authUser.stories_count}
                    </div>
                    <div className="text-sm text-gray-600">Stories</div>
                  </div>
                )}
              </div>

              {/* Edit Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onEdit}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-2xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <Settings size={18} />
                <span>Edit Profile</span>
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal for Followers / Following */}
      <UserListModal
        open={modal.open}
        onClose={closeModal}
        title={modal.title}
        users={modal.users}
      />
    </motion.div>
  );
};

export default ProfileCard;

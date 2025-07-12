// components/UserListModal.jsx
import React from "react";
import { X } from "lucide-react";

const UserListModal = ({ open, onClose, title, users }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm transition-all">
      <div className="relative w-[95%] max-w-md max-h-[80vh] bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User List */}
        <div className="overflow-y-auto flex-1 px-5 py-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
          {users.length === 0 ? (
            <p className="text-center text-sm text-gray-500">No users found.</p>
          ) : (
            users.map((user) => (
              <div
                key={user.id}
                className="flex items-center gap-4 hover:bg-blue-200 p-2 rounded-lg transition"
              >
                <img loading="lazy"
                  src={
                    user.profile_image_url && user.profile_image_url !== "null"
                      ? user.profile_image_url
                      : "/default-avathar.png"
                  }
                  alt={user.username}
                  className="w-12 h-12 rounded-full object-cover border border-gray-200 shadow-sm"
                />
                <div>
                  <p className="font-medium text-gray-800">@{user.username}</p>
                  <p className="text-xs text-gray-500">
                    {user.first_name} {user.last_name}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default UserListModal;

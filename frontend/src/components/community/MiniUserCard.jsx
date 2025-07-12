import React from "react";
import { Link } from "react-router-dom";
import { User2 } from "lucide-react";

const MiniUserCard = ({ users }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {users.length > 0 ? (
        users.map((user) => (
          <Link
            key={user.id}
            to={`/community/${user.id}`}
            className="bg-white rounded-xl shadow-md border border-gray-200 p-5 hover:shadow-lg hover:scale-105 transition-all duration-300 group"
          >
            <div className="flex flex-col items-center space-y-3">
              <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-purple-100 shadow-sm group-hover:border-purple-300 transition-all duration-300">
                <img
                  loading="lazy"
                  src={
                    user.profile_image_url && user.profile_image_url !== "null"
                      ? user.profile_image_url
                      : "/default-avathar.png"
                  }
                  alt={user.username}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="text-center">
                <p className="text-base font-semibold text-gray-900 group-hover:text-purple-600 transition-colors duration-300 flex items-center justify-center gap-1">
                  <User2 className="w-4 h-4 text-purple-600" />@{user.username}
                </p>
                <p className="text-sm text-gray-600 line-clamp-1">
                  {user.first_name} {user.last_name}
                </p>
              </div>
            </div>
          </Link>
        ))
      ) : (
        <div className="col-span-full text-center py-12">
          <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <User2 className="w-10 h-10 text-purple-600" />
          </div>
          <p className="text-gray-600 text-base font-medium">No users found</p>
        </div>
      )}
    </div>
  );
};

export default MiniUserCard;

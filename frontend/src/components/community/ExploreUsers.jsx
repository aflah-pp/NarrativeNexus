import React, { useEffect, useState } from "react";
import api from "../../utils/axios";
import MiniUserCard from "./MiniUserCard";
import Navbar from "../layout/NavBar";
import { Search } from "lucide-react";

const ExploreUsers = () => {
  const [allUsers, setAllUsers] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);

  const filteredUsers = query.trim()
    ? allUsers.filter((user) => {
        const fullName = `${user.first_name} ${user.last_name}`.toLowerCase();
        const username = user.username.toLowerCase();
        const q = query.toLowerCase();
        return fullName.includes(q) || username.includes(q);
      })
    : allUsers;

  useEffect(() => {
    let isMounted = true;
    const fetchUsers = async () => {
      try {
        const { data } = await api.get("users/explore/");
        if (isMounted) setAllUsers(data);
      } catch (err) {
        console.error("Error loading users:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchUsers();
    return () => (isMounted = false);
  }, []);

  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 mt-14">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-8 tracking-tight">
          Explore Our Community
        </h1>

        {/* Search Input */}
        <div className="relative max-w-md mx-auto mb-10">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search users..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 text-gray-900 text-base placeholder-gray-500"
            aria-label="Search users"
          />
        </div>

        {/* Filtered Users */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg font-medium">Loading users...</p>
          </div>
        ) : (
          <MiniUserCard users={filteredUsers} />
        )}
      </div>
    </>
  );
};

export default ExploreUsers;

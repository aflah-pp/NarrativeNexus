import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  BookOpen,
  PenTool,
  Users,
  Bell,
  User,
  LogOut,
  ChevronDown,
  MessageCircle,
  Files,
} from "lucide-react";
import NotificationModal from "../modal/NotificationModal";
import { useAuthUser } from "../../context/AuthUserContext";
import api from "../../utils/axios";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { authUser, logout, loading } = useAuthUser();
  const [showModal, setShowModal] = useState(false);
  const [unread, setUnread] = useState(0);
  const nav = useNavigate();

  const fetchUnreadCount = async () => {
    try {
      const res = await api.get("core/notifications/");
      setUnread(res.data.unread_count || 0);
    } catch (err) {
      console.error("Notification fetch error:", err);
    }
  };

  useEffect(() => {
    if (!authUser || loading) return;

    fetchUnreadCount();
    const token = localStorage.getItem("access");
    const socketUrl = `${import.meta.env.VITE_NOTIFICATION_SOCKET_URL}?token=${token}`;
    const socket = new WebSocket(socketUrl);

    socket.onmessage = () => fetchUnreadCount();

    // return () => socket.close(); 
  }, [authUser, loading]);

  const handleLogout = async () => {
    await logout();
    nav("/");
    setIsMenuOpen(false);
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2 group">
              <BookOpen className="h-8 w-8 text-purple-600 group-hover:text-purple-700 transition-colors duration-300" />
              <span className="text-2xl font-bold text-gray-900 group-hover:text-purple-700 transition-colors duration-300">
                NarrativeNexus
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center space-x-6">
              <Link to="/explore" className="flex items-center space-x-1 text-gray-600 hover:text-purple-600 font-medium transition">
                <BookOpen className="h-5 w-5" />
                <span>Explore</span>
              </Link>
              <Link to="/write" className="flex items-center space-x-1 text-gray-600 hover:text-purple-600 font-medium transition">
                <PenTool className="h-5 w-5" />
                <span>Write</span>
              </Link>

              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen((prev) => !prev)}
                  className="flex items-center space-x-1 text-gray-600 hover:text-purple-600 font-medium transition"
                >
                  <Users className="h-5 w-5" />
                  <span>Community</span>
                  <ChevronDown className="h-4 w-4" />
                </button>

                {isDropdownOpen && (
                  <div className="absolute mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                    <Link to="/community" onClick={() => setIsDropdownOpen(false)} className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-purple-50">
                      <Users className="h-4 w-4 mr-2 text-purple-500" />
                      Explore Users
                    </Link>
                    <Link to="/chat" onClick={() => setIsDropdownOpen(false)} className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-purple-50">
                      <MessageCircle className="h-4 w-4 mr-2 text-purple-500" />
                      Chat Room
                    </Link>
                  </div>
                )}
              </div>

              <Link to="/doc" className="flex items-center space-x-1 text-gray-600 hover:text-purple-600 font-medium transition">
                <Files className="h-5 w-5" />
                <span>Project Doc</span>
              </Link>
            </div>

            {/* Right Nav */}
            <div className="hidden md:flex items-center space-x-3">
              {/* 🔔 Notification (Desktop Only if logged in) */}
              {!loading && authUser && (
                <button
                  onClick={() => setShowModal(true)}
                  className="relative text-gray-600 hover:text-purple-600 transition"
                  aria-label="Notifications"
                >
                  <Bell className="h-6 w-6" />
                  {unread > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                      {unread}
                    </span>
                  )}
                </button>
              )}

              {!loading && authUser ? (
                <>
                  <Link to="/profile" className="flex items-center px-3 py-1 border border-purple-200 text-purple-700 hover:bg-purple-50 rounded-full text-sm transition-all whitespace-nowrap overflow-hidden">
                    <User className="h-4 w-4 mr-2" />
                    <span className="truncate max-w-[8rem]">{authUser.username}</span>
                  </Link>
                  <button onClick={handleLogout} className="flex items-center px-3 py-1 bg-red-500 text-white hover:bg-red-600 rounded-full text-sm transition-all">
                    <LogOut className="h-4 w-4 mr-2" />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login">
                    <button className="px-3 py-1 border border-gray-300 text-gray-700 hover:bg-gray-100 rounded-full text-sm font-medium transition">
                      Sign In
                    </button>
                  </Link>
                  <Link to="/register">
                    <button className="px-3 py-1 bg-purple-600 text-white hover:bg-purple-700 rounded-full text-sm font-medium transition">
                      Sign Up
                    </button>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu + Bell */}
            <div className="md:hidden flex items-center space-x-3">
              {/* 🔔 Mobile Bell (if logged in) */}
              {!loading && authUser && (
                <button
                  onClick={() => setShowModal(true)}
                  className="relative text-gray-600 hover:text-purple-600 transition"
                  aria-label="Notifications"
                >
                  <Bell className="h-6 w-6" />
                  {unread > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                      {unread}
                    </span>
                  )}
                </button>
              )}

              {/* Burger Menu */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 text-gray-600 hover:text-purple-600 transition"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 bg-white">
            <div className="flex flex-col space-y-3 px-4">
              <Link to="/explore" onClick={() => setIsMenuOpen(false)} className="flex items-center text-gray-600 hover:text-purple-600">
                <BookOpen className="h-5 w-5 mr-2" /> Explore
              </Link>
              <Link to="/write" onClick={() => setIsMenuOpen(false)} className="flex items-center text-gray-600 hover:text-purple-600">
                <PenTool className="h-5 w-5 mr-2" /> Write
              </Link>
              <Link to="/community" onClick={() => setIsMenuOpen(false)} className="flex items-center text-gray-600 hover:text-purple-600">
                <Users className="h-5 w-5 mr-2" /> Explore Users
              </Link>
              <Link to="/chat" onClick={() => setIsMenuOpen(false)} className="flex items-center text-gray-600 hover:text-purple-600">
                <MessageCircle className="h-5 w-5 mr-2" /> Chat Room
              </Link>
              <Link to="/doc" onClick={() => setIsMenuOpen(false)} className="flex items-center text-gray-600 hover:text-purple-600">
                <Files className="h-5 w-5 mr-2" /> Project Doc
              </Link>

              <div className="pt-4 border-t">
                {!loading && authUser ? (
                  <>
                    <Link to="/profile" onClick={() => setIsMenuOpen(false)} className="flex items-center px-3 py-2 border border-purple-200 text-purple-700 hover:bg-purple-50 rounded-lg">
                      <User className="h-5 w-5 mr-2" /> {authUser.username}
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center px-3 py-2 bg-red-500 text-white hover:bg-red-600 rounded-lg mt-2"
                    >
                      <LogOut className="h-5 w-5 mr-2" /> Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                      <button className="w-full px-3 py-2 border border-gray-300 text-gray-700 hover:bg-gray-100 rounded-lg text-sm font-medium mt-2">
                        Sign In
                      </button>
                    </Link>
                    <Link to="/register" onClick={() => setIsMenuOpen(false)}>
                      <button className="w-full px-3 py-2 bg-purple-600 text-white hover:bg-purple-700 rounded-lg text-sm font-medium mt-2">
                        Sign Up
                      </button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* 🔔 Notification Modal */}
      {showModal && (
        <NotificationModal
          onClose={() => setShowModal(false)}
          updateUnread={() => setUnread(0)}
        />
      )}
    </>
  );
};

export default Navbar;

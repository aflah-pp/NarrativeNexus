import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../utils/axios";

const AuthUserContext = createContext();

export const useAuthUser = () => useContext(AuthUserContext);

export const AuthUserProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🧠 Fetch user if token exists (on mount + when token changes)
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("access");
      if (!token) {
        setAuthUser(null);
        setLoading(false);
        return;
      }

      try {
        const res = await api.get("/users/me/");
        setAuthUser(res.data);
      } catch (err) {
        console.error("Failed to fetch auth user:", err);
        setAuthUser(null);
      } finally {
        setLoading(false);
      }
    };

    // Listen for login/logout from other tabs (or initial mount)
    const handleStorageChange = () => {
      const access = localStorage.getItem("access");
      if (access) {
        fetchUser();
      } else {
        setAuthUser(null);
      }
    };

    fetchUser(); // Initial fetch on mount
    window.addEventListener("storage", handleStorageChange); 

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  // 🧠 Public method to manually refresh user
  const refreshAuthUser = async () => {
    const token = localStorage.getItem("access");
    if (!token) {
      setAuthUser(null);
      return;
    }

    try {
      const res = await api.get("/users/me/");
      setAuthUser(res.data);
    } catch (err) {
      console.error("refreshAuthUser failed:", err);
      setAuthUser(null);
    }
  };

  const follow = async (username) => {
    try {
      await api.post(`/users/follow/${username}/`);
      return true;
    } catch (err) {
      console.error("Follow error:", err);
      return false;
    }
  };

  const unfollow = async (username) => {
    try {
      await api.post(`/users/unfollow/${username}/`);
      return true;
    } catch (err) {
      console.error("Unfollow error:", err);
      return false;
    }
  };

  const getFollowers = async (username) => {
    try {
      const res = await api.get(`/users/followers/${username}/`);
      return res.data;
    } catch (err) {
      console.error("Get followers error:", err);
      return [];
    }
  };

  const getFollowing = async (username) => {
    try {
      const res = await api.get(`/users/following/${username}/`);
      return res.data;
    } catch (err) {
      console.error("Get following error:", err);
      return [];
    }
  };

  const logout = async () => {
    try {
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
      setAuthUser(null);
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <AuthUserContext.Provider
      value={{
        authUser,
        loading,
        follow,
        unfollow,
        getFollowers,
        getFollowing,
        refreshAuthUser,
        logout,
      }}
    >
      {children}
    </AuthUserContext.Provider>
  );
};

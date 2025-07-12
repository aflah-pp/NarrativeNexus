import React, { useState, useEffect, useMemo } from "react";
import {
  FiSearch,
  FiFilter,
  FiChevronDown,
  FiGrid,
  FiList,
  FiTrendingUp,
  FiBook,
  FiClock,
  FiStar,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import api from "../../utils/axios";
import NavBar from "../layout/NavBar";

function StoryFeed() {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [sortBy, setSortBy] = useState("title");
  const [showFilters, setShowFilters] = useState(false);
  const navigate = useNavigate();

  // Fetch stories once
  useEffect(() => {
    api
      .get("core/stories/")
      .then((res) => {
        setStories(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching stories:", err);
        setLoading(false);
      });
  }, []);

  // Unique genres
  const genres = useMemo(() => {
    const uniqueGenres = Array.from(
      new Set(stories.map((story) => story.genre))
    );
    return ["All", ...uniqueGenres];
  }, [stories]);

  const statuses = ["All", "Ongoing", "Completed", "Hiatus"];

  // Filter & sort logic
  const filteredAndSortedStories = useMemo(() => {
    let filtered = stories.filter((story) => {
      const matchesSearch =
        searchQuery === "" ||
        story.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesGenre =
        selectedGenre === "All" || story.genre === selectedGenre;
      const matchesStatus =
        selectedStatus === "All" || story.status === selectedStatus;

      return matchesSearch && matchesGenre && matchesStatus;
    });

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case "title":
          return a.title.localeCompare(b.title);
        case "updated":
          return (
            new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
          );
        case "chapters":
          return b.chapters.length - a.chapters.length;
        default:
          return 0;
      }
    });
  }, [stories, searchQuery, selectedGenre, selectedStatus, sortBy]);

  // Handle search action
  const handleSearch = () => {
    setSearchQuery(searchTerm.trim());
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  if (loading) {
    return (
      <>
        <NavBar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg font-medium">
              Loading stories...
            </p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <NavBar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 mt-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-2 tracking-tight">
            Explore Stories
          </h1>
          <p className="text-gray-600 text-base">
            Discover captivating stories across all genres
          </p>
        </div>

        {/* Search + Filters */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search stories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 text-gray-900 text-base placeholder-gray-500"
                aria-label="Search stories"
              />
              <button
                onClick={handleSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-purple-600 transition-colors duration-300"
                aria-label="Search"
              >
                <FiSearch className="w-5 h-5" />
              </button>
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-all duration-300 font-medium"
            >
              <FiFilter className="w-5 h-5" />
              <span>Filters</span>
              <FiChevronDown
                className={`w-5 h-5 transition-transform duration-300 ${
                  showFilters ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* View Mode Toggle */}
            <div className="flex border border-gray-300 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode("grid")}
                className={`px-4 py-3 font-medium transition-colors duration-300 ${
                  viewMode === "grid"
                    ? "bg-purple-600 text-white"
                    : "bg-white text-gray-600 hover:bg-gray-50"
                }`}
                aria-label="Grid view"
              >
                <FiGrid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`px-4 py-3 font-medium transition-colors duration-300 ${
                  viewMode === "list"
                    ? "bg-purple-600 text-white"
                    : "bg-white text-gray-600 hover:bg-gray-50"
                }`}
                aria-label="List view"
              >
                <FiList className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="grid md:grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-200">
              {/* Genre */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Genre
                </label>
                <select
                  value={selectedGenre}
                  onChange={(e) => setSelectedGenre(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 text-gray-900 text-base"
                >
                  {genres.map((genre) => (
                    <option key={genre} value={genre}>
                      {genre}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 text-gray-900 text-base"
                >
                  {statuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Sort by
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 text-gray-900 text-base"
                >
                  <option value="title">Title</option>
                  <option value="updated">Last Updated</option>
                  <option value="chapters">Chapter Count</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Result Count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-600 text-base font-medium">
            {filteredAndSortedStories.length}{" "}
            {filteredAndSortedStories.length === 1 ? "story" : "stories"} found
          </p>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <FiTrendingUp className="w-4 h-4 text-purple-600" />
            <span>Sorted by {sortBy}</span>
          </div>
        </div>

        {/* Story Cards */}
        {filteredAndSortedStories.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FiBook className="w-10 h-10 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              No stories found
            </h3>
            <p className="text-gray-600 text-base max-w-md mx-auto">
              Try adjusting your search or filter criteria
            </p>
          </div>
        ) : (
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                : "space-y-4"
            }
          >
            {filteredAndSortedStories.map((story) => (
              <StoryCard
                key={story.id}
                story={story}
                viewMode={viewMode}
                onClick={() => navigate(`/explore/${story.id}`)}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}

function StoryCard({ story, viewMode, onClick }) {
  const fallbackImage = "/placeholder-image.jpg";
  const coverImage = story.cover_image_url || fallbackImage;
  const displayTags = story.tags?.slice(0, 5) || [];

  if (viewMode === "list") {
    return (
      <div
        onClick={onClick}
        className="bg-white rounded-xl shadow-md border border-gray-200 p-6 hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer group"
      >
        <div className="flex gap-4">
          <img
            loading="lazy"
            src={coverImage}
            alt={story.title}
            className="w-20 h-28 object-cover rounded-lg flex-shrink-0 group-hover:scale-110 transition-transform duration-300"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-purple-600 transition-colors duration-300 truncate">
                  {story.title}
                </h3>
                <p className="text-sm text-gray-500">@{story.author}</p>
              </div>
              <div className="flex items-center space-x-1 text-yellow-500 ml-2">
                <FiStar className="w-4 h-4 fill-current" />
                <span className="text-sm font-medium text-gray-700">
                  {story.likes_count}
                </span>
              </div>
            </div>
            <p className="text-gray-600 text-sm mb-3 line-clamp-2">
              {story.synopsis}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-2">
              {displayTags.map((tag, idx) => (
                <span
                  key={idx}
                  className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full text-xs font-medium"
                >
                  #{tag}
                </span>
              ))}
            </div>

            <div className="flex items-center justify-between text-xs text-gray-600">
              <div className="flex items-center space-x-2">
                <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full font-medium">
                  {story.genre}
                </span>
                <span
                  className={`px-2 py-1 rounded-full font-medium ${
                    story.status === "Completed"
                      ? "bg-green-100 text-green-700"
                      : story.status === "Ongoing"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-orange-100 text-orange-700"
                  }`}
                >
                  {story.status}
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <FiClock className="w-4 h-4" />
                <span>{new Date(story.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Grid view
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer group"
    >
      <div className="relative">
        <img
          loading="lazy"
          src={coverImage}
          alt={story.title}
          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center space-x-1">
          <FiStar className="w-4 h-4 text-yellow-500 fill-current" />
          <span className="text-xs font-medium text-gray-700">
            {story.likes_count}
          </span>
        </div>
        <div className="absolute bottom-3 left-3">
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              story.status === "Completed"
                ? "bg-green-500/90 text-white"
                : story.status === "Ongoing"
                ? "bg-blue-500/90 text-white"
                : "bg-orange-500/90 text-white"
            }`}
          >
            {story.status}
          </span>
        </div>
      </div>
      <div className="p-5">
        <h3 className="text-base font-semibold text-gray-900 mb-1 group-hover:text-purple-600 transition-colors duration-300 line-clamp-1">
          {story.title}
        </h3>
        <p className="text-sm text-gray-500 mb-2">@{story.author}</p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-3">
          {displayTags.map((tag, idx) => (
            <span
              key={idx}
              className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full text-xs font-medium"
            >
              #{tag}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs font-medium">
            {story.genre}
          </span>
          <div className="flex items-center space-x-1 text-gray-600 text-xs">
            <FiBook className="w-4 h-4" />
            <span>{story.chapters_count}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StoryFeed;

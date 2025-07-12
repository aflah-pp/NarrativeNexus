import React from "react";
import {
  ArrowLeft,
  Edit3,
  Trash2,
  Save,
  X,
  Settings,
  Clock,
  Calendar,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const ChapterHeader = ({
  chapter,
  isEditing,
  editTitle,
  setEditTitle,
  isAuthor,
  readingTime,
  showSettings,
  setShowSettings,
  setIsEditing,
  handleSave,
  handleCancel,
  handleDelete,
  storyId,
}) => {
  const nav = useNavigate();

  const handleBack = () => {
    nav(`/write/${storyId}`);
  };

  return (
    <div className="sticky top-0 z-30 bg-white border-b border-gray-200 backdrop-blur-md bg-opacity-90">
      <div className="max-w-4xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Left Section */}
          <div className="flex items-center space-x-4">
            <button
              onClick={handleBack}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
              title="Back to story"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>

            {!isEditing ? (
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Chapter {chapter.chapter_no}: {chapter.title}
                </h1>
                <p className="text-sm text-gray-500 mt-1 flex items-center space-x-4">
                  <span className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{readingTime} min read</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {new Date(chapter.updated_at).toLocaleDateString()}
                    </span>
                  </span>
                </p>
              </div>
            ) : (
              <input
                type="text"
                className="text-xl font-bold bg-transparent border-b-2 border-blue-500 focus:outline-none focus:border-purple-500 transition-colors duration-200 px-2 py-1"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                placeholder="Chapter title..."
              />
            )}
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
              title="Reading settings"
            >
              <Settings className="h-5 w-5" />
            </button>

            {isAuthor && !isEditing && (
              <button
                className="p-2 rounded-full hover:bg-blue-50 text-blue-600 hover:text-blue-700 transition-colors duration-200"
                onClick={() => setIsEditing(true)}
                title="Edit Chapter"
              >
                <Edit3 className="h-5 w-5" />
              </button>
            )}

            {isEditing && (
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleSave}
                  className="p-2 rounded-full bg-green-500 text-white hover:bg-green-600 transition-colors duration-200"
                  title="Save changes"
                >
                  <Save className="h-5 w-5" />
                </button>
                <button
                  onClick={handleCancel}
                  className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
                  title="Cancel"
                >
                  <X className="h-5 w-5" />
                </button>
                <button
                  onClick={handleDelete}
                  className="p-2 rounded-full text-red-600 hover:bg-red-50 transition-colors duration-200"
                  title="Delete chapter"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChapterHeader;

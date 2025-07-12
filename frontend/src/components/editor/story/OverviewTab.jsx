import React from "react";
import { FiStar, FiCalendar, FiClock } from "react-icons/fi";

const OverviewTab = ({ story, chapters }) => {
  return (
    <div className="grid lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Synopsis</h2>
          <p className="text-gray-700 leading-relaxed whitespace-pre-line">
            {story.synopsis}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Tags</h2>
          <div className="flex flex-wrap gap-2">
            {story.tags.map((tag, index) => (
              <span
                key={index}
                className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Story Stats</h2>
          <div className="space-y-4 text-gray-600">
            <div className="flex justify-between">
              <span>Chapters</span>
              <span className="font-semibold">{chapters.length}</span>
            </div>
            <div className="flex justify-between">
              <span>Status</span>
              <span
                className={`font-semibold ${
                  story.status === "Completed" ? "text-green-600" : "text-orange-600"
                }`}
              >
                {story.status}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Publication Info</h2>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <FiCalendar className="w-4 h-4 text-gray-400" />
              <div>
                <div className="text-sm text-gray-600">Published</div>
                <div className="font-medium">
                  {new Date(story.created_at).toLocaleDateString()}
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <FiClock className="w-4 h-4 text-gray-400" />
              <div>
                <div className="text-sm text-gray-600">Last Updated</div>
                <div className="font-medium">
                  {new Date(story.updated_at).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewTab;

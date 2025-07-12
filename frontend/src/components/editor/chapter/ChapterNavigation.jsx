import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Book } from 'lucide-react';

const ChapterNavigation = ({
  prevChapter,
  nextChapter,
  currentIndex,
  chaptersList,
  story,
  theme
}) => {
  const navigate = useNavigate();

  return (
    <div className={`border-t transition-colors duration-300 ${
      theme === 'dark' ? 'border-gray-700 bg-gray-900' : 'border-gray-200 bg-white'
    }`}>
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="flex justify-between items-center">
          {/* Prev Button */}
          <button
            onClick={() => {
              if (prevChapter) {
                navigate(`/write/${story?.id}/chapters/${prevChapter.chapter_no}`);
              }
            }}
            disabled={!prevChapter}
            className={`flex items-center space-x-3 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
              prevChapter 
                ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 shadow-lg hover:shadow-xl" 
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            <ChevronLeft className="h-5 w-5" />
            <div className="text-left">
              <div className="text-sm opacity-80">Previous</div>
              <div className="font-bold truncate w-32">{prevChapter?.title || "No previous chapter"}</div>
            </div>
          </button>

          {/* Chapter Info */}
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 text-gray-500 mb-2">
              <Book className="h-5 w-5" />
              <span className="font-medium">
                Chapter {currentIndex + 1} of {chaptersList.length}
              </span>
            </div>
            <div className="text-sm text-gray-400 truncate">{story?.title}</div>
          </div>

          {/* Next Button */}
          <button
            onClick={() => {
              if (nextChapter) {
                navigate(`/write/${story?.id}/chapters/${nextChapter.chapter_no}`);
              }
            }}
            disabled={!nextChapter}
            className={`flex items-center space-x-3 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
              nextChapter 
                ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 shadow-lg hover:shadow-xl" 
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            <div className="text-right">
              <div className="text-sm opacity-80">Next</div>
              <div className="font-bold truncate w-32">{nextChapter?.title || "No next chapter"}</div>
            </div>
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChapterNavigation;

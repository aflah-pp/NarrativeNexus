import { useEffect, useState } from "react";
import api from "../../utils/axios";
import { useParams, useNavigate } from "react-router-dom";
import {
  FiArrowLeft,
  FiSettings,
  FiBookmark,
  FiShare2,
  FiType,
  FiChevronLeft,
  FiChevronRight,
  FiBook,
} from "react-icons/fi";

function ChapterReader() {
  const { storyId, chapterNo } = useParams();
  const navigate = useNavigate();

  const [chapter, setChapter] = useState(null);
  const [chaptersList, setChaptersList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fontSize, setFontSize] = useState(16);
  const [showSettings, setShowSettings] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);

  useEffect(() => {
    Promise.all([
      api.get(`core/stories/${storyId}/chapters/${chapterNo}/`),
      api.get(`core/stories/${storyId}/chapters/`),
    ])
      .then(([chapterRes, chaptersRes]) => {
        setChapter(chapterRes.data);
        const sorted = chaptersRes.data.sort(
          (a, b) => a.chapter_no - b.chapter_no
        );
        setChaptersList(sorted);
        setLoading(false);
      })
      .catch(console.error);
  }, [storyId, chapterNo]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;
      setReadingProgress(Math.min(100, Math.max(0, progress)));
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleShare = () => {
    const shareData = {
      title: chapter.title || "chapter",
      url: window.location.href,
    };

    if (navigator.share) {
      navigator.share(shareData).catch(console.error);
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading chapter…</p>
        </div>
      </div>
    );
  }

  if (!chapter) return <div>Chapter not found</div>;

  const currentIndex = chaptersList.findIndex(
    (c) => c.chapter_no === parseInt(chapterNo)
  );
  const prevChapter = chaptersList[currentIndex - 1];
  const nextChapter = chaptersList[currentIndex + 1];

  return (
    <div className="min-h-screen bg-white text-gray-900 transition-colors duration-300">
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <div className="h-1 bg-gray-200">
          <div
            className="h-full bg-blue-600 transition-all duration-300"
            style={{ width: `${readingProgress}%` }}
          />
        </div>
      </div>

      {/* Header */}
      <header className="sticky top-1 z-40 border-b bg-white/90 backdrop-blur-md border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          {/* Left Section */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigate(`/explore/${storyId}`)}
              className="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition"
            >
              <FiArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline text-sm">Back to Story</span>
            </button>
            <div className="hidden md:block">
              <h1 className="text-base font-semibold">
                Chapter {chapter.chapter_no}: {chapter.title}
              </h1>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition"
              aria-label="Font Settings"
            >
              <FiSettings className="w-5 h-5" />
            </button>
            <button
            onClick={handleShare}
              className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition"
              aria-label="Share"
            >
              <FiShare2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Font Settings Panel */}
        {showSettings && (
          <div className="border-t bg-white border-gray-200">
            <div className="max-w-4xl mx-auto px-4 py-4 flex items-center space-x-4">
              <FiType className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium">Font Size</span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setFontSize(Math.max(12, fontSize - 2))}
                  className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
                >
                  -
                </button>
                <span className="text-sm w-8 text-center">{fontSize}</span>
                <button
                  onClick={() => setFontSize(Math.min(30, fontSize + 2))}
                  className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Mobile Chapter Info */}
      <div className="md:hidden px-4 py-4">
        <h1 className="font-semibold text-lg mb-1">
          Chapter {chapter.chapter_no}: {chapter.title}
        </h1>
        <div className="flex items-center text-sm text-gray-500 space-x-2">
          <span>{chapter.word_count?.toLocaleString()} words</span>
          <span>•</span>
          <span>{chapter.reading_time} min read</span>
        </div>
      </div>

      {/* Chapter Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
  <div
    className="bg-white  border border-gray-200  rounded-lg shadow-md overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600"
    style={{
      maxHeight: "70vh", 
      padding: "2rem",
    }}
  >
    <article
      className="prose prose-base sm:prose-lg max-w-none  transition-colors duration-300"
      style={{
        fontSize: `${fontSize}px`,
        lineHeight: 1.75,
        letterSpacing: "0.02em",
        wordBreak: "break-word",
      }}
    >
      <div className="whitespace-pre-wrap leading-relaxed tracking-wide">
        {chapter.content}
      </div>
    </article>
  </div>
</main>


      {/* Navigation Buttons */}
      <div className="border-t border-gray-200 mt-12">
        <div className="max-w-4xl mx-auto px-4 py-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <button
            onClick={() =>
              prevChapter &&
              navigate(`/explore/${storyId}/chapters/${prevChapter.chapter_no}`)
            }
            disabled={!prevChapter}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all ${
              prevChapter
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            <FiChevronLeft className="w-4 h-4" />
            <span>Previous Chapter</span>
          </button>

          <div className="flex items-center text-sm text-gray-500 space-x-2">
            <FiBook className="w-4 h-4" />
            <span>
              Chapter {currentIndex + 1} of {chaptersList.length}
            </span>
          </div>

          <button
            onClick={() =>
              nextChapter &&
              navigate(`/explore/${storyId}/chapters/${nextChapter.chapter_no}`)
            }
            disabled={!nextChapter}
            className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-medium transition-all ${
              nextChapter
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            <span>Next Chapter</span>
            <FiChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChapterReader;

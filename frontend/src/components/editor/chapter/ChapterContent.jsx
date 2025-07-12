import React from "react";

function ChapterContent({
  isEditing,
  chapter,
  editContent,
  setEditContent,
  fontSize,
  handleTogglePublish,
}) {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {!isEditing ? (
        <>
          <article
            className="prose prose-lg max-w-none whitespace-pre-wrap text-gray-900 bg-white p-6 rounded-lg shadow-sm border border-gray-200 transition-all"
            style={{
              fontSize: `${fontSize}px`,
              lineHeight: 1.8,
            }}
          >
            {chapter?.content || (
              <p className="text-gray-400 italic">No content available for this chapter yet.</p>
            )}
          </article>

          <div className="mt-6 flex justify-end">
            <button
              onClick={handleTogglePublish}
              className={`px-5 py-2.5 rounded-md text-sm font-semibold shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                chapter?.is_published
                  ? "bg-yellow-500 hover:bg-yellow-600 text-white focus:ring-yellow-300"
                  : "bg-green-600 hover:bg-green-700 text-white focus:ring-green-300"
              }`}
            >
              {chapter?.is_published ? "Unpublish Chapter" : "Publish Chapter"}
            </button>
          </div>
        </>
      ) : (
        <div className="bg-white border border-gray-300 rounded-lg shadow-sm">
          <textarea
            className="w-full min-h-[400px] p-5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 placeholder:text-gray-400 resize-none transition-all"
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            style={{ fontSize: `${fontSize}px`, lineHeight: 1.8 }}
            placeholder="Start writing your chapter here..."
          />
        </div>
      )}
    </div>
  );
}

export default ChapterContent;

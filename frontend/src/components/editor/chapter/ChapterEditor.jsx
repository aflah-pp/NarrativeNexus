import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useChapterData } from "../../../hooks/useChapterData";
import ChapterHeader from "./ChapterHeader";
import ReadingSettings from "./ReadingSettings";
import ChapterNavigation from "./ChapterNavigation";
import ChapterContent from "./ChapterContent";
import api from "../../../utils/axios";
import { toast } from "react-toastify";

function ChapterEditor() {
  const { storyId, chapterNo } = useParams();

  const {
    chapter,
    setChapter,
    chaptersList,
    story,
    isAuthor,
    loading,
    readingTime,
  } = useChapterData(storyId, chapterNo);

  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [error, setError] = useState(null);
  const [fontSize, setFontSize] = useState(18);
  const [showSettings, setShowSettings] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (chapter) {
      setEditTitle(chapter.title || "");
      setEditContent(chapter.content || "");
    }
  }, [chapter]);

  const handleSave = async () => {
    try {
      const res = await api.put(
        `core/stories/${storyId}/chapters/${chapter?.chapter_no}/`,
        {
          title: editTitle,
          content: editContent,
          chapter_no: chapter.chapter_no,
        }
      );
      setChapter(res.data);
      setIsEditing(false);
      setError(null);
      toast.success("Chapter Changed.")
    } catch (err) {
      console.error("Save failed", err);
      const nonField = err.response?.data?.non_field_errors?.[0];
      setError(nonField || "Failed to save chapter");
    }
  };

  const handleTogglePublish = async () => {
    try {
      const res = await api.put(
        `core/stories/${storyId}/chapters/${chapter?.chapter_no}/`,
        {
          title: chapter.title,
          content: chapter.content,
          chapter_no: chapter.chapter_no,
          is_published: !chapter?.is_published,
        }
      );
      setChapter(res.data);
      toast.success("Chapter Published.")
    } catch (err) {
      console.error("Error", err);
      toast.alert("Failed to update publish status.");
    }
  };

  const handleCancel = () => {
    setEditTitle(chapter.title);
    setEditContent(chapter.content);
    setIsEditing(false);
    setError(null);
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this chapter?"))
      return;
    try {
      await api.delete(
        `core/stories/${storyId}/chapters/${chapter?.chapter_no}/`
      );
      toast.success("Chapter Deleted.")

      const currentIndex = chaptersList.findIndex(
        (c) => c.chapter_no === parseInt(chapterNo)
      );
      const prev = chaptersList[currentIndex - 1];
      const next = chaptersList[currentIndex + 1];

      if (prev) {
        navigate(`/write/${storyId}/chapters/${prev.chapter_no}`);
      } else if (next) {
        navigate(`/write/${storyId}/chapters/${next.chapter_no}`);
      } else {
        navigate(`/write/${storyId}`);
      }
    } catch (err) {
      console.error("Delete failed", err);
      toast.alert("Failed to delete chapter");
    }
  };

  const currentIndex = chaptersList.findIndex(
    (c) => c.chapter_no === parseInt(chapterNo)
  );
  const prevChapter = chaptersList[currentIndex - 1];
  const nextChapter = chaptersList[currentIndex + 1];

  if (loading) return <div className="text-center py-10">Loading chapter…</div>;
  if (!chapter)
    return <div className="text-center py-10">Chapter not found</div>;
  if (error)
    return <div className="text-center py-4 text-red-500">{error}</div>;

  return (
    <div className="min-h-screen">
      <ChapterHeader
        chapter={chapter}
        storyId={storyId}
        isEditing={isEditing}
        editTitle={editTitle}
        setEditTitle={setEditTitle}
        isAuthor={isAuthor}
        readingTime={readingTime}
        showSettings={showSettings}
        setShowSettings={setShowSettings}
        setIsEditing={setIsEditing}
        handleSave={handleSave}
        handleCancel={handleCancel}
        handleDelete={handleDelete}
      />

      <ReadingSettings
        fontSize={fontSize}
        setFontSize={setFontSize}
        isVisible={showSettings}
      />

      <ChapterContent
        isEditing={isEditing}
        chapter={chapter}
        editContent={editContent}
        setEditContent={setEditContent}
        fontSize={fontSize}
        handleTogglePublish={handleTogglePublish}
      />

      <ChapterNavigation
        prevChapter={prevChapter}
        nextChapter={nextChapter}
        currentIndex={currentIndex}
        chaptersList={chaptersList}
        story={story}
      />
    </div>
  );
}

export default ChapterEditor;

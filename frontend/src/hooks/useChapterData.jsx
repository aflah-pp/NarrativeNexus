import { useState, useEffect } from 'react';
import api from '../utils/axios';

export const useChapterData = (storyId, chapterNo) => {
  const [chapter, setChapter] = useState(null);
  const [chaptersList, setChaptersList] = useState([]);
  const [story, setStory] = useState(null);
  const [isAuthor, setIsAuthor] = useState(false);
  const [loading, setLoading] = useState(true);
  const [readingTime, setReadingTime] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [storyRes, chapterRes, chaptersRes, userRes] = await Promise.all([
          api.get(`core/stories/${storyId}/`),
          api.get(`core/stories/${storyId}/chapters/${chapterNo}/`),
          api.get(`core/stories/${storyId}/chapters/`),
          api.get("users/me/"),
        ]);

        setStory(storyRes.data);
        setChapter(chapterRes.data);
        setChaptersList(chaptersRes.data.sort((a, b) => a.chapter_no - b.chapter_no));

        if (storyRes.data.author === userRes.data.username) {
          setIsAuthor(true);
        }

        // Calculate reading time 
        const wordCount = chapterRes.data.content.split(' ').length;
        setReadingTime(Math.ceil(wordCount / 200));
      } catch (err) {
        console.error("Fetch failed", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [storyId, chapterNo]);

  return {
    chapter,
    setChapter,
    chaptersList,
    story,
    isAuthor,
    loading,
    readingTime
  };
};
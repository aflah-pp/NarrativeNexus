import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import StoryHeader from "./StoryHeader";
import TabNav from "./TabNav";
import OverviewTab from "./OverviewTab";
import ChaptersTab from "./ChaptersTab";
import StoryEditModal from "../../modal/StoryEditModal";
import api from "../../../utils/axios";
import { toast } from "react-toastify";

function StoryEdit() {
  const { storyId } = useParams();
  const navigate = useNavigate();

  const [story, setStory] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    genre: "",
    status: "",
    synopsis: "",
    tags: [],
    cover_image: null,
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    api
      .get(`core/stories/${storyId}/`)
      .then(async (res) => {
        setStory(res.data);
        setFormData({
          title: res.data.title,
          genre: res.data.genre,
          status: res.data.status,
          synopsis: res.data.synopsis,
          tags: res.data.tags || [],
          cover_image: null,
        });
        setImagePreview(res.data.cover_image_url);

        const userRes = await api.get("users/me/");
        if (res.data.author !== userRes.data.username) {
          setError("You are not the author of this story.");
          return;
        }

        const chapterRes = await api.get(`core/stories/${storyId}/chapters/`);
        setChapters(chapterRes.data);
      })
      .catch(() => setError("Failed to load story"))
      .finally(() => setLoading(false));
  }, [storyId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({ ...prev, cover_image: file }));
    if (file) setImagePreview(URL.createObjectURL(file));
  };

  const handleTagKeyDown = (e) => {
    const key = e.key;
    const value = e.target.value;

    if ((key === "Enter" || key === ",") && value.trim()) {
      e.preventDefault();

      const newTag = value
        .trim()
        .toLowerCase()
        .replace(/[/[\]]/g, "");
      if (
        newTag.length > 0 &&
        !formData.tags.includes(newTag) &&
        formData.tags.length < 10
      ) {
        setFormData((prev) => ({
          ...prev,
          tags: [...prev.tags, newTag],
        }));
      }

      e.target.value = "";
    }
  };

  const handleTagRemove = (indexToRemove) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== indexToRemove),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    if (formData.tags.length > 10) {
      setError("A story cannot have more than 10 tags.");
      setIsSaving(false);
      return;
    }

    const data = new FormData();
    data.append("title", formData.title);
    data.append("genre", formData.genre);
    data.append("status", formData.status);
    data.append("synopsis", formData.synopsis);
    formData.tags.forEach((tag) => data.append("tags[]", tag));
    if (formData.cover_image) data.append("cover_image", formData.cover_image);

    try {
      await api.put(`core/stories/${storyId}/`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const updated = await api.get(`core/stories/${storyId}/`);
      setStory(updated.data);
      setImagePreview(updated.data.cover_image_url);
      setIsEditing(false);
      toast.success("Story updated!");
    } catch (err) {
      const errMsg =
        err.response?.data?.cover_image?.[0] ||
        err.response?.data?.tags?.[0] ||
        "Failed to update story";
      setError(errMsg);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this story?")) return;

    setIsDeleting(true);
    setError(null);

    try {
      await api.delete(`core/stories/${storyId}/`);
      navigate("/write");
      toast.success("Story Deleted");
    } catch {
      setError("Delete failed");
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading story...</p>
        </div>
      </div>
    );
  if (!story) return <div className="text-center p-10">Story not found</div>;

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-red-600 font-semibold">{error}</p>
          <button
            onClick={() => navigate("/write")}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Back to Explore
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <StoryHeader
        story={story}
        chapters={chapters}
        imagePreview={imagePreview}
        navigate={navigate}
        setIsEditing={setIsEditing}
        isEditing={isEditing}
      />

      <TabNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        chapterCount={chapters.length}
      />

      {activeTab === "overview" && (
        <OverviewTab story={story} chapters={chapters} />
      )}
      {activeTab === "chapters" && (
        <ChaptersTab
          chapters={chapters}
          storyId={storyId}
          navigate={navigate}
        />
      )}

      {isEditing && (
        <StoryEditModal
          formData={formData}
          setFormData={setFormData}
          imagePreview={imagePreview}
          handleFileChange={handleFileChange}
          handleInputChange={handleInputChange}
          handleTagKeyDown={handleTagKeyDown}
          handleTagRemove={handleTagRemove}
          isSaving={isSaving}
          isDeleting={isDeleting}
          handleSubmit={handleSubmit}
          handleDelete={handleDelete}
          onClose={() => setIsEditing(false)}
          error={error}
        />
      )}
    </div>
  );
}

export default StoryEdit;

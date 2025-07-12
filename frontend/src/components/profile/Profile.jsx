import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useAuthUser } from "../../context/AuthUserContext"
import ProfileCard from "../profile/ProfileCard"
import EditProfile from "../profile/EditProfile"
import CreationCard from "../modal/CreationCard"
import { useLocation, useNavigate } from "react-router-dom"
import Navbar from "../layout/NavBar"
import { BookOpen, PenTool, Loader2, Plus } from "lucide-react"
import api from "../../utils/axios"

const Profile = () => {
  const { authUser, loading, refreshAuthUser, getFollowers, getFollowing } = useAuthUser()

  const [editing, setEditing] = useState(false)
  const [pageLoading, setPageLoading] = useState(true)
  const [stories, setStories] = useState([])
  const [storiesLoading, setStoriesLoading] = useState(false)

  const location = useLocation()
  const navigate = useNavigate()

  // Load user data
  useEffect(() => {
    const loadUser = async () => {
      setPageLoading(true)
      await refreshAuthUser()
    }

    loadUser()
  }, [location.pathname])

  // Load stories once username is available
  useEffect(() => {
    const loadStories = async () => {
      if (!authUser?.username) return

      setStoriesLoading(true)
      try {
        const res = await api.get(`/core/${authUser.username}/stories/`)
        setStories(res.data)
      } catch (err) {
        console.error("Failed to fetch user stories:", err)
        setStories([])
      } finally {
        setStoriesLoading(false)
        setPageLoading(false)
      }
    }

    loadStories()
  }, [authUser?.username])

  const handleUpdate = async () => {
    try {
      await refreshAuthUser()
      setEditing(false)
    } catch (error) {
      console.error("Failed to refresh user:", error)
    }
  }

  const handleWriteStory = () => {
    // Navigate to write story page 
    navigate("/write")
  }

  if (loading || pageLoading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-purple-600 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">Loading your profile...</p>
          </div>
        </div>
      </>
    )
  }

  if (!authUser) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-600 text-lg">Unable to load profile</p>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50">
        <div className="container mx-auto px-4 py-8 lg:py-12">
          <div className="space-y-12">
            {/* Profile Section */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              {!editing ? (
                <ProfileCard
                  authUser={authUser}
                  following={getFollowing}
                  followers={getFollowers}
                  onEdit={() => setEditing(true)}
                  refreshAuthUser={refreshAuthUser}
                />
              ) : (
                <EditProfile user={authUser} onCancel={() => setEditing(false)} onSave={handleUpdate} />
              )}
            </motion.div>

            {/* Stories Section */}
            {!editing && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="max-w-4xl mx-auto"
              >
                <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
                  {/* Section Header */}
                  <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-8 py-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <BookOpen className="w-6 h-6 text-white" />
                        <h2 className="text-2xl font-bold text-white">My Stories</h2>
                        <span className="px-3 py-1 bg-white/20 rounded-full text-white text-sm font-medium">
                          {stories.length}
                        </span>
                      </div>

                      {/* Write Story Button */}
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleWriteStory}
                        className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white hover:bg-white/20 transition-all duration-300 font-medium"
                      >
                        <Plus className="w-5 h-5" />
                        <span className="hidden sm:inline">Write Story</span>
                      </motion.button>
                    </div>
                  </div>

                  {/* Stories Content */}
                  <div className="p-8">
                    {storiesLoading ? (
                      <div className="text-center py-12">
                        <Loader2 className="w-8 h-8 animate-spin text-purple-600 mx-auto mb-4" />
                        <p className="text-gray-600">Loading your stories...</p>
                      </div>
                    ) : stories.length === 0 ? (
                      <div className="text-center py-16">
                        <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                          <PenTool className="w-12 h-12 text-purple-500" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No Stories Yet</h3>
                        <p className="text-gray-600 mb-6 max-w-md mx-auto">
                          You haven't written any stories yet. Start your writing journey and share your creativity with
                          the world!
                        </p>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={handleWriteStory}
                          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-2xl font-medium hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                        >
                          <PenTool className="w-5 h-5" />
                          Write Your First Story
                        </motion.button>
                      </div>
                    ) : (
                      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {stories.map((story, index) => (
                          <motion.div
                            key={story.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: index * 0.1 }}
                          >
                            <CreationCard story={story} />
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default Profile

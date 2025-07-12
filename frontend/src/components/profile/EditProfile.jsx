import { useState } from "react"
import { motion } from "framer-motion"
import api from "../../utils/axios"
import {
  Loader2, X, Save, ImagePlus, User, FileText, Camera, ArrowLeft, Mail
} from "lucide-react"
import { toast } from "react-toastify"

const EditProfile = ({ user, onCancel, onSave }) => {
  const [formData, setFormData] = useState({
    first_name: user.first_name || "",
    last_name: user.last_name || "",
    email: user.email || "",
    bio: user.bio || "",
    profile_image: null,
  })

  const [preview, setPreview] = useState(user.profile_image_url || null)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({ ...prev, profile_image: "Image must be less than 5MB" }))
        return
      }

      setFormData((prev) => ({ ...prev, profile_image: file }))
      setPreview(URL.createObjectURL(file))
      setErrors((prev) => ({ ...prev, profile_image: "" }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    if (formData.bio && formData.bio.length > 500) {
      newErrors.bio = "Bio must be less than 500 characters"
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    setLoading(true)
    const payload = new FormData()
    Object.entries(formData).forEach(([key, val]) => {
      if (val) payload.append(key, val)
    })

    try {
      const res = await api.patch("users/me/", payload, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      setPreview(res.data.profile_image_url || null) 
      onSave(res.data) //  Save updated user data
      toast.success("Profile Updated")
    } catch (err) {
      console.error("Update error:", err)
      setErrors({ submit: "Failed to update profile. Please try again." })
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setPreview(user.profile_image_url || null)
    onCancel()
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-4xl mx-auto mt-16"
    >
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="px-8 py-6 border-b border-gray-100">
          <div className="flex items-center gap-4">
            <button
              onClick={handleCancel}
              className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-xl transition-all duration-300"
            >
              <ArrowLeft size={18} />
              <span className="hidden sm:inline">Back</span>
            </button>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Edit Profile</h2>
              <p className="text-gray-600">Update your information</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 lg:p-12">
          {errors.submit && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm"
            >
              {errors.submit}
            </motion.div>
          )}

          <div className="flex flex-col lg:flex-row gap-12">
            {/* Profile Image Section */}
            <div className="lg:w-1/3 space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Photo</h3>
              <div className="flex flex-col items-center space-y-4">
                <div className="relative group">
                  <div className="w-32 h-32 lg:w-40 lg:h-40 rounded-full overflow-hidden border-4 border-gray-100 shadow-lg bg-gradient-to-br from-gray-100 to-gray-200">
                    {preview ? (
                      <img
                        src={preview}
                        alt="Profile preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <User className="w-12 h-12 text-gray-400" />
                      </div>
                    )}
                  </div>

                  <label className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer">
                    <div className="text-center text-white">
                      <Camera className="w-6 h-6 mx-auto mb-1" />
                      <span className="text-xs font-medium">Change</span>
                    </div>
                    <input type="file" hidden accept="image/*" onChange={handleImageChange} />
                  </label>
                </div>

                {errors.profile_image && <p className="text-red-500 text-sm">{errors.profile_image}</p>}

                <label className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl cursor-pointer transition-all duration-300">
                  <ImagePlus className="w-4 h-4" />
                  <span className="text-sm font-medium">Upload Photo</span>
                  <input type="file" hidden accept="image/*" onChange={handleImageChange} />
                </label>
              </div>
            </div>

            {/* Form Fields */}
            <div className="lg:w-2/3 space-y-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Personal Information</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                <div className="space-y-2">
                  <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                    <User className="w-4 h-4 text-purple-500" />
                    <span>First Name</span>
                  </label>
                  <input
                    name="first_name"
                    placeholder="Enter your first name"
                    value={formData.first_name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 bg-gray-50 focus:bg-white text-gray-900"
                  />
                </div>

                <div className="space-y-2">
                  <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                    <User className="w-4 h-4 text-purple-500" />
                    <span>Last Name</span>
                  </label>
                  <input
                    name="last_name"
                    placeholder="Enter your last name"
                    value={formData.last_name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 bg-gray-50 focus:bg-white text-gray-900"
                  />
                </div>
              </div>

              <div className="space-y-2 mb-6">
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                  <Mail className="w-4 h-4 text-purple-500" />
                  <span>Email</span>
                </label>
                <input
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 bg-gray-50 focus:bg-white text-gray-900"
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
                  <FileText className="w-4 h-4 text-purple-500" />
                  <span>Bio</span>
                </label>
                <textarea
                  name="bio"
                  rows={4}
                  placeholder="Tell us about yourself..."
                  value={formData.bio}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 bg-gray-50 focus:bg-white resize-none text-gray-900 ${
                    errors.bio ? "border-red-300" : "border-gray-200"
                  }`}
                />
                <div className="flex justify-between items-center">
                  <p className={`text-xs ${formData.bio.length > 450 ? "text-red-500" : "text-gray-500"}`}>
                    {formData.bio.length}/500 characters
                  </p>
                  {errors.bio && <p className="text-red-500 text-xs">{errors.bio}</p>}
                </div>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-8 mt-8 border-t border-gray-100">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={handleCancel}
              className="flex items-center justify-center space-x-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-all duration-300 font-medium"
            >
              <X className="w-4 h-4" />
              <span>Cancel</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl transition-all duration-300 shadow-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </>
              )}
            </motion.button>
          </div>
        </form>
      </div>
    </motion.div>
  )
}

export default EditProfile

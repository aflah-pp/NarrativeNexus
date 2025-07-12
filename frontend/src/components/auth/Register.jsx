import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuthUser } from "../../context/AuthUserContext";
import api from "../../utils/axios";
import { toast } from "react-toastify";
import { Loader2 } from "lucide-react"; // 👈 Spinner icon

const inputFields = [
  { name: "username", placeholder: "Username" },
  { name: "email", type: "email", placeholder: "Email" },
  { name: "first_name", placeholder: "First Name" },
  { name: "last_name", placeholder: "Last Name" },
  { name: "password", type: "password", placeholder: "Password" },
  { name: "password2", type: "password", placeholder: "Confirm Password" },
];

function Register() {
  const navigate = useNavigate();
  const { refreshAuthUser } = useAuthUser();

  const [formData, setFormData] = useState({
    username: "",
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    password2: "",
    bio: "",
  });

  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (formData.password !== formData.password2) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      const payload = new FormData();
      Object.entries(formData).forEach(([key, val]) =>
        payload.append(key, val)
      );
      if (profileImage) {
        payload.append("profile_image", profileImage);
      }

      const res = await api.post("users/register/", payload);

      if (res.data.access && res.data.refresh) {
        localStorage.setItem("access", res.data.access);
        localStorage.setItem("refresh", res.data.refresh);
        setSuccess("Registered successfully!");
        await refreshAuthUser();
        navigate("/");
        toast.success("Register Success.");
      } else {
        setError("No token received from server.");
      }
    } catch (err) {
      console.error("Registration error:", err);
      const msg =
        err.response?.data && typeof err.response.data === "object"
          ? Object.entries(err.response.data)
              .map(
                ([field, messages]) =>
                  `${field}: ${
                    Array.isArray(messages) ? messages.join(", ") : messages
                  }`
              )
              .join("\n")
          : "Something went wrong.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 p-6">
      <div className="w-full max-w-4xl bg-white shadow-2xl rounded-3xl p-10 space-y-8">
        <h1 className="text-5xl font-extrabold text-center text-purple-700">
          Create Account
        </h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-xl whitespace-pre-wrap">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-6 py-4 rounded-xl">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {inputFields.map(({ name, type = "text", placeholder }) => (
              <input
                key={name}
                type={type}
                name={name}
                placeholder={placeholder}
                value={formData[name]}
                onChange={handleChange}
                disabled={loading}
                required={[
                  "username",
                  "email",
                  "password",
                  "password2",
                ].includes(name)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            {/* Profile Image */}
            <div className="flex flex-col items-center gap-4">
              <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-purple-300 shadow">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400 text-sm">
                    No Image
                  </div>
                )}
              </div>
              <label className="cursor-pointer text-sm text-purple-600 font-medium bg-blue-50 hover:bg-blue-100 transition px-4 py-2 rounded-xl border border-blue-200 shadow-sm">
                Upload Photo
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  hidden
                  disabled={loading}
                />
              </label>
            </div>

            {/* Bio */}
            <div className="md:col-span-2">
              <textarea
                name="bio"
                placeholder="Short bio..."
                value={formData.bio}
                onChange={handleChange}
                rows={4}
                disabled={loading}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 text-lg font-bold text-white bg-purple-600 rounded-xl shadow-md hover:bg-purple-700 transition duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin w-5 h-5" />
                Registering...
              </>
            ) : (
              "Register"
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-indigo-600 hover:text-indigo-500 font-medium"
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Register;

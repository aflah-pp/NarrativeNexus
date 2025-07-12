import React from "react";
import Navbar from "../layout/NavBar";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const Privacy = () => {
  const navigate = useNavigate();
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-16 px-4 sm:px-6 lg:px-8 mt-14 max-w-4xl mx-auto">
        <h1 className="text-4xl font-extrabold text-center mb-10">
          Privacy Policy
        </h1>
        <section className="space-y-6 text-gray-700 text-base leading-relaxed">
          <p>
            <strong>Information We Collect:</strong> When you sign up, we
            collect your email address, username, and password to create your
            account. Additionally, any content you create — including stories,
            chapters, comments, bookmarks, and ratings — is stored as part of
            your profile. We may also collect technical information like your IP
            address, browser type, device data, and usage patterns to help
            improve our platform and protect against abuse.
          </p>

          <p>
            <strong>How We Use Your Information:</strong> We use your data to
            provide a personalized writing and reading experience. This includes
            saving your drafts, syncing your dashboard, recommending content,
            and sending important updates like notifications and publishing
            alerts. Your data helps us enhance user experience, fix bugs, and
            introduce new features tailored to your needs.
          </p>

          <p>
            <strong>Data Sharing & Disclosure:</strong> We value your privacy.
            We do not sell, trade, or rent your personal information to third
            parties. In some cases, we may share information with trusted
            service providers (such as cloud storage or analytics platforms)
            solely to improve functionality. If required by law, we may disclose
            limited user data to comply with legal obligations or defend the
            rights and safety of our platform and users.
          </p>

          <p>
            <strong>Your Rights & Controls:</strong> You have full control over
            your account and content. You can edit or delete your stories
            anytime from your dashboard. If you wish to delete your account or
            request a copy of your data, simply contact our support team. We’ll
            process requests within a reasonable timeframe and confirm via
            email.
          </p>

          <p>
            <strong>Security Measures:</strong> We take your security seriously.
            We implement industry-standard encryption, secure login protocols,
            and regular vulnerability checks to protect your account and data.
            While no system is 100% immune to threats, we are committed to
            maintaining a safe and secure environment for all users.
          </p>

          <p>
            <strong>Updates to This Policy:</strong> This policy may be updated
            from time to time to reflect changes in our features or legal
            requirements. We’ll notify you about major updates through email or
            in-app notifications.
          </p>
        </section>
        <div className="text-center mt-10">
          <button
            onClick={() => navigate("/")}
            className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-all duration-300"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Privacy;

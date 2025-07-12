import React from "react";
import Navbar from "../layout/NavBar";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const Terms = () => {
  const navigate = useNavigate();
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white mt-14 py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <h1 className="text-4xl font-extrabold text-center mb-10">
          Terms of Service
        </h1>
        <section className="space-y-6 text-gray-700 text-base leading-relaxed">
          <p>
            <strong>Acceptance of Terms:</strong> By accessing or using
            NarrativeNexus, you confirm that you have read, understood, and
            agree to be bound by these Terms of Service. These terms apply to
            all users of the platform, including readers, authors, and
            collaborators. If you do not agree to these terms, please refrain
            from using the service.
          </p>

          <p>
            <strong>Account Responsibility:</strong> You are responsible for
            maintaining the confidentiality of your account and password. Any
            activity that occurs under your account is your responsibility.
            Please notify us immediately of any unauthorized use of your
            account.
          </p>

          <p>
            <strong>Content Ownership & Rights:</strong> As a creator, you
            retain full ownership and copyright of your stories, chapters, and
            original content. By uploading content, you grant NarrativeNexus a
            non-exclusive license to host, display, and distribute it through
            our platform for the purpose of sharing with readers and enabling
            platform features.
          </p>

          <p>
            <strong>Community Guidelines & Code of Conduct:</strong> We’re
            building a respectful and creative space. Any form of harassment,
            hate speech, plagiarism, or abuse will result in immediate action,
            including content removal or account suspension. Please be kind and
            credit others where it's due.
          </p>

          <p>
            <strong>Prohibited Activities:</strong> You agree not to misuse the
            platform for illegal activities, spam, data scraping, uploading
            malware, or manipulating view/rating systems. Violating these terms
            may lead to legal consequences and permanent account bans.
          </p>

          <p>
            <strong>Termination of Service:</strong> NarrativeNexus reserves the
            right to suspend or terminate your access at any time if you violate
            these terms or engage in behavior that harms the community or the
            platform.
          </p>

          <p>
            <strong>Modifications to Terms:</strong> We may revise or update
            these Terms of Service at any time. If significant changes are made,
            we will notify users via email or platform alerts. Continued use
            after changes means you accept the revised terms.
          </p>

          <p>
            <strong>Contact:</strong> For any questions about these terms or
            your rights, you can reach out to our support team via the contact
            page.
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

export default Terms;

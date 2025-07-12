import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../layout/NavBar";
import { ArrowLeft } from "lucide-react";

const writerFAQs = [
  {
    q: "How do I start writing?",
    a: "Click 'Start Writing' on the homepage or 'Writing' in the navigation bar. Sign up or log in, then begin a new story from your dashboard.",
  },
  {
    q: "Can I edit my story after publishing?",
    a: "Yes, you can edit your story, synopsis, tags, and chapters anytime from the writing dashboard.",
  },
  {
    q: "How many tags can I use?",
    a: "You can add up to 10 relevant tags per story to help readers discover your content more easily.",
  },
  {
    q: "Can I upload a custom cover image?",
    a: "Absolutely. Upload your own cover image (JPG or PNG) while creating or editing your story.",
  },
  {
    q: "Can I publish chapters one by one?",
    a: "Yes! You can write chapters as drafts and publish them individually whenever you're ready.",
  },
  {
    q: "Where can I edit my stories or chapters?",
    a: "You can only edit your stories and chapters from the Writing page — not from the Explore page. Just click on the story you want to edit, and you’ll be taken to its editor. Inside, you can also click on any chapter to view and edit it directly.",
  },
];


const readerFAQs = [
  {
    q: "How can I bookmark a story?",
    a: "Just click the bookmark icon on any story or chapter. You’ll find all your bookmarks in your profile.",
  },
  {
    q: "Can I like or review stories?",
    a: "Yes, you can leave a like and add comments under each story or chapter.",
  },
  {
    q: "Is reading free?",
    a: "Yes — reading is completely free. All stories are accessible without subscriptions or payments.",
  },
  {
    q: "Will I get notified when a new chapter is out?",
    a: "If you bookmark a story, you’ll automatically get notified when new chapters are published.",
  },
  {
    q: "Can I follow my favorite authors?",
    a: "Yes, you can follow your favorite authors to get updates when they publish new stories.",
  },
];


const FAQ = () => {
  const navigate = useNavigate();

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 pt-20 pb-24 px-4 sm:px-6 lg:px-8 mt-14">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h1 className="text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-lg text-gray-600">Everything you need to know about using the platform</p>
        </div>

        <section className="max-w-4xl mx-auto mb-16">
          <h2 className="text-2xl font-bold text-purple-700 mb-6">For Writers</h2>
          <div className="space-y-6">
            {writerFAQs.map((item, i) => (
              <div key={i} className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{item.q}</h3>
                <p className="text-gray-700 text-base">{item.a}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="max-w-4xl mx-auto mb-16">
          <h2 className="text-2xl font-bold text-indigo-700 mb-6">For Readers</h2>
          <div className="space-y-6">
            {readerFAQs.map((item, i) => (
              <div key={i} className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{item.q}</h3>
                <p className="text-gray-700 text-base">{item.a}</p>
              </div>
            ))}
          </div>
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

export default FAQ;

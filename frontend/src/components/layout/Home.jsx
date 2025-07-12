import React from "react";
import { Link } from "react-router-dom";
import {
  BookOpen,
  PenTool,
  Users,
  Star,
  MessageSquareQuote,
  Sparkles,
  Mail,Instagram,Twitter,Github
} from "lucide-react";
import Navbar from "./NavBar";

const HomePage = () => {
  return (
    <>
      <Navbar />
      <div className="min-h-screen">
        {/* Hero Section */}
        <section
          id="hero"
          className="mt-16 bg-gradient-to-br from-purple-700 via-indigo-800 to-blue-900 text-white"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
            <div className="text-center">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight tracking-tight">
                Where Stories Come{" "}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-200 to-blue-300">
                  Alive
                </span>
              </h1>
              <p className="text-lg sm:text-xl lg:text-2xl text-purple-100 mb-10 max-w-3xl mx-auto font-light leading-relaxed">
                Write. Read. Connect — all in one place for modern storytellers.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/explore"
                  className="bg-white text-purple-800 px-8 py-3 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl hover:bg-purple-50 transition-all duration-300 ease-in-out flex items-center justify-center group"
                >
                  <BookOpen className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
                  Start Reading
                </Link>
                <Link
                  to="/write"
                  className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold text-lg hover:bg-white hover:text-purple-800 transition-all duration-300 ease-in-out flex items-center justify-center group"
                >
                  <PenTool className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
                  Start Writing
                </Link>
                <Link
                  to="/doc"
                  className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold text-lg hover:bg-white hover:text-purple-800 transition-all duration-300 ease-in-out flex items-center justify-center group"
                >
                  <Sparkles className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
                  See Docs
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section
          id="features"
          className="py-20 bg-gray-50"
          aria-label="Key Features Section"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">
                Everything You Need to Tell Your Story
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto font-light">
                From powerful writing tools to an inspiring community,
                NarrativeNexus helps you bring your vision to life.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: <PenTool className="h-8 w-8 text-purple-600" />,
                  title: "Write & Publish",
                  desc: "Craft beautiful stories using our rich editor. Publish in drafts or episodes—your flow, your pace.",
                },
                {
                  icon: <Users className="h-8 w-8 text-purple-600" />,
                  title: "Connect with Community",
                  desc: "Meet fellow users of our community and exchange feedback in real-time chat .",
                },
                {
                  icon: <BookOpen className="h-8 w-8 text-purple-600" />,
                  title: "Discover & Read",
                  desc: "Find your next favorite binge. Genres galore, personalized for your taste.",
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="text-center p-8 bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 group"
                >
                  <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 transform group-hover:scale-105 transition-transform">
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it Works Section */}
        <section className="py-20 bg-white" id="how-it-works">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-8">
              How It Works
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 text-left">
              {[
                {
                  step: "1. Create Account",
                  desc: "Sign up and personalize your profile.",
                },
                {
                  step: "2. Start Writing",
                  desc: "Begin a new story or resume your drafts.",
                },
                {
                  step: "3. Share & Grow",
                  desc: "Publish chapters and gain readers, likes, and feedback.",
                },
                {
                  step: "4. Explore & Connect",
                  desc: "Find other writers, follow them, and collaborate.",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="p-8 border rounded-xl hover:shadow-md transition"
                >
                  <h4 className="text-xl font-semibold mb-2">{item.step}</h4>
                  <p className="text-gray-600 text-sm">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-gray-50" id="stats">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-12 text-center">
              {[
                {
                  icon: (
                    <BookOpen className="h-8 w-8 text-purple-600 mr-3 group-hover:scale-110 transition-transform" />
                  ),
                  value: "10K+",
                  label: "Stories Published",
                },
                {
                  icon: (
                    <Users className="h-8 w-8 text-purple-600 mr-3 group-hover:scale-110 transition-transform" />
                  ),
                  value: "5K+",
                  label: "Active Writers",
                },
                {
                  icon: (
                    <Star className="h-8 w-8 text-purple-600 mr-3 group-hover:scale-110 transition-transform" />
                  ),
                  value: "50K+",
                  label: "Monthly Readers",
                },
              ].map((item, idx) => (
                <div key={idx} className="group">
                  <div className="flex items-center justify-center mb-3">
                    {item.icon}
                    <span className="text-4xl font-extrabold text-gray-900">
                      {item.value}
                    </span>
                  </div>
                  <p className="text-lg text-gray-600 font-medium">
                    {item.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 bg-white" id="testimonials">
          <div className="max-w-4xl mx-auto text-center px-4">
            <MessageSquareQuote className="w-12 h-12 mx-auto text-purple-500 mb-4" />
            <p className="text-xl italic text-gray-700 mb-6">
              "NarrativeNexus reignited my love for writing. I found an
              audience, collaborators, and a creative space I never knew I
              needed."
            </p>
            <p className="font-semibold text-gray-800">
              — Aanya V., Fantasy Author
            </p>
          </div>
        </section>

        {/* Final CTA Section */}
        <section
          className="py-20 bg-gradient-to-r from-purple-600 to-indigo-600 text-white"
          id="cta"
        >
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-4xl font-extrabold mb-4 tracking-tight">
              Ready to Share Your Story?
            </h2>
            <p className="text-lg text-purple-100 mb-8 font-light">
              Join thousands of storytellers creating, connecting, and
              captivating audiences daily.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/explore"
                className="bg-white text-purple-800 px-8 py-3 rounded-lg font-semibold text-lg shadow-lg hover:shadow-xl hover:bg-purple-100 transition-all duration-300 ease-in-out"
              >
                Explore Stories
              </Link>
              <Link
                to="/community"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold text-lg hover:bg-white hover:text-purple-800 transition-all duration-300 ease-in-out"
              >
                Join Our Creative Community
              </Link>
            </div>
          </div>
        </section>
        {/* Contact Section */}
        <section className="py-20 bg-gray-50" id="contact">
          <div className="max-w-4xl mx-auto text-center px-4">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Get in Touch
            </h2>
            <p className="text-gray-600 mb-8">
              Have questions, feedback, or ideas? Reach out to the
              NarrativeNexus team anytime.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-purple-700 text-lg font-medium">
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5" />
                support@narrativenexus.com
              </div>
              <div className="flex items-center gap-2">
                <Instagram className="w-5 h-5" />
                @narrative.nexus
              </div>
              <div className="flex items-center gap-2">
                <Twitter className="w-5 h-5" />
                @narrativenexus
              </div>
            </div>
          </div>
        </section>

        {/* Newsletter Section */}
        <section
          className="py-20 bg-gradient-to-br from-purple-700 to-indigo-800 text-white"
          id="newsletter"
        >
          <div className="max-w-3xl mx-auto text-center px-4">
            <h2 className="text-3xl font-bold mb-4">📬 Stay in the Loop</h2>
            <p className="text-purple-100 mb-6">
              Subscribe for exclusive tips, platform updates, and story prompts
              delivered straight to your inbox.
            </p>
            <form className="flex flex-col sm:flex-row gap-4 justify-center">
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full sm:w-auto px-4 py-3 rounded-lg bg-purple-200 text-gray-800"
              />
              <button
                type="submit"
                className="bg-white text-purple-800 px-6 py-3 rounded-lg font-semibold hover:bg-purple-100 transition"
              >
                Subscribe
              </button>
            </form>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-gray-300 py-12">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              <div>
                <h4 className="text-lg font-semibold text-white mb-4">
                  NarrativeNexus
                </h4>
                <p className="text-sm text-gray-400">
                  Empowering writers and readers around the world to connect
                  through stories.
                </p>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-white mb-4">
                  Platform
                </h4>
                <ul className="space-y-2 text-sm">
                  <li>
                    <Link to="/write" className="hover:underline">
                      Write a Story
                    </Link>
                  </li>
                  <li>
                    <Link to="/explore" className="hover:underline">
                      Explore Stories
                    </Link>
                  </li>
                  <li>
                    <Link to="/community" className="hover:underline">
                      Community
                    </Link>
                  </li>
                  <li>
                    <Link to="/doc" className="hover:underline">
                      Docs
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-white mb-4">
                  Resources
                </h4>
                <ul className="space-y-2 text-sm">
                  <li>
                    <Link to="/faq" className="hover:underline">
                      FAQ
                    </Link>
                  </li>
                  <li>
                    <Link to="/terms" className="hover:underline">
                      Terms of Service
                    </Link>
                  </li>
                  <li>
                    <Link to="/privacy" className="hover:underline">
                      Privacy Policy
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-white mb-4">
                  Follow Us
                </h4>
                <div className="flex gap-4">
                  <a href="https://github.com" target="_blank" rel="noreferrer">
                    <Github className="w-5 h-5 hover:text-white" />
                  </a>
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Instagram className="w-5 h-5 hover:text-white" />
                  </a>
                  <a
                    href="https://twitter.com"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Twitter className="w-5 h-5 hover:text-white" />
                  </a>
                </div>
              </div>
            </div>

            <div className="mt-10 text-center text-xs text-gray-500">
              © {new Date().getFullYear()} NarrativeNexus. All rights reserved.
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default HomePage;

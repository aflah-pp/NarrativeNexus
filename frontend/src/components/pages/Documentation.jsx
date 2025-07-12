import NavBar from "../layout/NavBar"
import { BookOpen, Server, Code, GitBranch, FileCode } from "lucide-react";

const Documentation = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-100 py-12 px-6 lg:px-24 text-gray-800">
      <NavBar />
      <div className="max-w-6xl mx-auto mt-18 space-y-12">
        {/* Header */}
        <header className="text-center">
          <h1 className="text-4xl font-extrabold mb-4 text-purple-700">
            📘 NarrativeNexus - Project Documentation
          </h1>
          <p className="text-lg text-gray-600">
            A full-stack authoring + reading platform powered by React & Django
          </p>
        </header>

        {/* Frontend & Backend Overview */}
        <section className="grid lg:grid-cols-2 gap-10">
          {/* Frontend */}
          <div className="bg-white p-6 rounded-2xl shadow-md">
            <h2 className="text-2xl font-semibold flex items-center gap-2 mb-4">
              <BookOpen /> Frontend (React + Vite)
            </h2>
            <ul className="list-disc list-inside text-sm leading-6">
              <li>📁 <code>components/</code> – feature-based split (auth, chat, editor, etc.)</li>
              <li>📁 <code>context/</code> – global state (Auth)</li>
              <li>📁 <code>hooks/</code> – reusable logic (e.g. `chapterData`)</li>
              <li>📁 <code>routes/</code> – PRotected Route</li>
              <li>📁 <code>utils/axios.js</code> – API wrapper with token injection</li>
              <li>🎨 TailwindCSS + Lucide Icons for sleek UI</li>
              <li>⚡ Real-time chat & notifications via WebSockets</li>
            </ul>
          </div>

          {/* Backend */}
          <div className="bg-white p-6 rounded-2xl shadow-md">
            <h2 className="text-2xl font-semibold flex items-center gap-2 mb-4">
              <Server /> Backend (Django + Channels)
            </h2>
            <ul className="list-disc list-inside text-sm leading-6">
              <li>📁 <code>chat/</code> – WebSocket powered messaging</li>
              <li>📁 <code>stories/</code> – story CRUD, chapters, bookmarks, Likes, Notifications</li>
              <li>📁 <code>users/</code> – custom auth, profiles, follow system</li>
              <li>📁 <code>media/</code> – file uploads (cover, profile, chapters)</li>
              <li>🔐 JWT-based authentication</li>
              <li>📡 Notifications via Django Signals + Channels</li>
            </ul>
          </div>
        </section>

        {/* Project Structure */}
        <section className="bg-white p-6 rounded-2xl shadow-md">
          <h2 className="text-2xl font-semibold flex items-center gap-2 mb-4">
            <Code /> Project Structure Summary
          </h2>

          <p className="mb-2 font-bold">📦 frontend/</p>
          <pre className="bg-gray-100 text-xs p-4 rounded overflow-x-auto">
{`├── public/
│   └── assets/
│       ├── react.svg
│       └── vite.svg
├── src/
│   ├── components/
│   │   ├── auth/
│   │   ├── chat/
│   │   ├── community/
│   │   ├── editor/
│   │   ├── feed/
│   │   ├── follow/
│   │   ├── layout/
│   │   ├── modal/
│   │   ├── profile/
│   │   └── write/
│   ├── context/
│   ├── hooks/
│   ├── routes/
│   ├── utils/
│   └── App.jsx | main.jsx | index.css`}
          </pre>

          <p className="mt-4 font-bold">🖥 backend/</p>
          <pre className="bg-gray-100 text-xs p-4 rounded overflow-x-auto">
{`├── backend/
│   ├── settings.py
│   ├── urls.py
│   ├── asgi.py 
|   | wsgi.py
├── chat/
├── stories/
├── users/
├── media/
├── db.sqlite3
└── manage.py`}
          </pre>
        </section>

        {/* Key Features */}
        <section className="bg-white p-6 rounded-2xl shadow-md">
          <h2 className="text-2xl font-semibold flex items-center gap-2 mb-4">
            <GitBranch /> Features Overview
          </h2>
          <ul className="list-disc list-inside text-sm leading-6">
            <li>✍️ Write + edit stories and chapters (rich editor)</li>
            <li>📖 Reader mode with customizable view</li>
            <li>❤️ Like, 📌 Bookmark, 👍 Like chapters</li>
            <li>🔔 Get notified on chapter publish & Follows</li>
            <li>💬 Real-time global messaging between users</li>
            <li>📁 Upload cover images, profile pics</li>
            <li>👥 Follow users, view profiles, explore users</li>
          </ul>
        </section>

        {/* 🔍 Important Code Highlights */}
        <section className="bg-white p-6 rounded-2xl shadow-md">
          <h2 className="text-2xl font-semibold flex items-center gap-2 mb-4">
            <FileCode /> Important Code Highlights
          </h2>
          <ul className="list-disc list-inside text-sm leading-6">
            <li>
              <code>src/utils/axios.js</code> – Axios instance with token auto-injection for secure API calls.
            </li>
            <li>
              <code>src/context/AuthContext.jsx</code> – Manages user login state and auth token across the app.
            </li>
            <li>
              <code>src/hooks/usechatData.js</code> – Utility hook for chats.
            </li>
            <li>
              <code>src/components/editor/ChapterEditor.jsx</code> – Rich text editor for chapter content with save/publish logic.
            </li>
            <li>
              <code>stories/views.py</code> – Backend logic for story & chapter CRUD, publish status, and notifications.
            </li>
            <li>
              <code>chat/consumers.py</code> – WebSocket consumer handling real-time messages.
            </li>
            <li>
              <code>stories/signals.py</code> – Django signals to trigger notifications (e.g., on follow or publish).
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default Documentation;

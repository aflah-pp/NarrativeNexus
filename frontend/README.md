# 💜 NarrativeNexus — Frontend

Welcome to the frontend of **NarrativeNexus**, a vibrant storytelling platform where creators write, edit, share, and collaborate on stories in real-time.

Built with:
- ⚛️ React (via Vite)
- 🎨 TailwindCSS
- 🧠 Framer Motion
- 🔐 JWT Auth
- 📡 Axios for API calls
- 🔄 Real-time features (chat, notifications) via WebSockets (Django Channels)

---

## ⚙️ Project Setup

### 🚀 Getting Started

```bash
# Clone the repo
git clone https://github.com/your-username/narrativenexus.git
cd narrativenexus/frontend

# Install dependencies
npm install

# Run the dev server
npm run dev
```

Open your browser at [http://localhost:5173](http://localhost:5173)

---

## 🧱 Project Structure

```
src/
├── components/
│   ├── auth/               # Login/Register
│   ├── chat/               # Group chat for collaborators
│   ├── community/          # Public users, explorer, mini-cards
│   ├── editor/             # Full story + chapter editing
│   │   ├── chapter/        # Chapter editor, content, settings
│   │   └── story/          # Overview, header, tab navigation
│   ├── feed/               # Story feed and chapter reader
│   ├── layout/             # NavBar and Home layout
│   ├── modal/              # All modal components (create/edit/view)
│   ├── pages/              # Docs, FAQ, Terms, Privacy
│   ├── profile/            # Profile + editing
│   └── write/              # Write page (story/chapters)
├── context/                # Global Auth context
├── hooks/                  # Custom React hooks
├── routes/                 # Route protection logic
├── utils/                  # Axios config, helpers
├── App.jsx                 # Root app component
├── index.css               # Global Tailwind styles
└── main.jsx                # Entry point
```

---

## 🧠 React + Vite Notes

This frontend is powered by [Vite](https://vitejs.dev/) for ultra-fast builds and HMR.

Two official React plugins are available:

- [`@vitejs/plugin-react`](https://github.com/vitejs/vite-plugin-react) — uses **Babel** for Fast Refresh
- [`@vitejs/plugin-react-swc`](https://github.com/vitejs/vite-plugin-react-swc) — uses **SWC** for Fast Refresh

We recommend using **SWC** for faster builds in larger projects.

---

## 🧼 ESLint Configuration

This project includes basic ESLint rules for React + JSX.

### Want type-aware rules?
If you're building a production app, switch to TypeScript and use [`typescript-eslint`](https://typescript-eslint.io).

➡️ Check out this [Vite + TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for best practices.

---


## 📦 Build for Production

```bash
npm run build
```

Outputs to `dist/` — ready to deploy to Netlify, Vercel, or your backend server.


---

## 💬 Community & Contribution

If you're interested in contributing, open an issue or start a discussion.

Made with 💜

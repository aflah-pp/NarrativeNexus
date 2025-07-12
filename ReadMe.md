# 📖 Narrative Nexus

A collaborative storytelling platform built with **Django REST Framework** and **React**.

## 🚀 Features

- ✍️ **Story & Chapter Editor** — Clean UI for writing and publishing.
- 📖 **Reader Mode** — Public view with likes, bookmarks, and comments.
- 🔔 **Real-Time Notifications** — Instant alerts for new content.
- 👥 **Community** — Follow users, explore profiles, discover stories.
- 🔒 **JWT Auth** — Secure login and protected routes.
- ⚙️ **RESTful API** — Structured backend with clean permissions.

## 🧱 Tech Stack

| Layer      | Technology                            |
|------------|---------------------------------------|
| Frontend   | React.js, React Router DOM            |
| Styling    | Tailwind CSS, Framer Motion           |
| Backend    | Django, Django REST Framework         |
| Auth       | JWT (`djangorestframework-simplejwt`) |
| Media      | Cloudinary                            |
| Real-Time  | Redis (Upstash)                       |
| Database   | PostgreSQL                            |

## 📁 Project Structure
```
NarrativeNexus/
├── backend/
│   ├── backend/          # Django config
│   ├── stories/         # Story models, views,serializers
│   ├── users/           # Auth, profiles, follow logic
│   ├── chat/           # Live chat 
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/  # UI components
│   │   ├── context/     # React Context
│   │   ├── hooks/       # Custom hooks
│   │   ├── routes/      # Route handling
│   │   ├── utils/       # API helpers
│   │   └── App.jsx      # Main app
│   └── vite.config.js

```


## ⚙️ Setup

### 🔐 Environment Variables

#### Frontend `.env`
```env
VITE_BASE_URL=https://your-backend-url
VITE_NOTIFICATION_SOCKET_URL=wss://your-redis-server
VITE_GLOBAL_CHAT_SOCKET=wss://your-redis-server
```

Backend `.env`
```env

SECRET_KEY=your-secret-key
DEBUG=True / False
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
REDIS_URL=rediss://default:password@your.upstash.io
DATABASE_URL = <Your DB Url>
```

🛠 Backend
```bash

cd backend

python -m venv env

source env/bin/activate #env\scripts\activate in Win

pip install -r requirements.txt

python manage.py migrate

python manage.py runserver
```

🧑‍💻 Frontend

```bash
cd frontend
npm install
npm run dev

```
📄 License
MIT © 2025 Aflah
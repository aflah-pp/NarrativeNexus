import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProtectedRoutes from "./routes/ProtectedRoutes";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import Profile from "./components/profile/Profile";
import ExploreUsers from "./components/community/ExploreUsers";
import PublicUser from "./components/community/PublicUser";
import { AuthUserProvider } from "./context/AuthUserContext";
import ChapterReader from "./components/feed/ChapterReader";
import StoryDetail from "./components/feed/StoryDetail";
import StoryFeed from "./components/feed/StoryFeed";
import HomePage from "./components/layout/Home";
import StoryEdit from "./components/editor/story/StoryEdit";
import ChapterEditor from "./components/editor/chapter/ChapterEditor";
import WritePage from "./components/write/WritePage";
import GroupChat from "./components/chat/GroupChat";
import Page404 from "./components/pages/Page404";
import DocumentationPage from "./components/pages/Documentation";
import FAQ from "./components/pages/FAQ";
import Terms from "./components/pages/Terms";
import Privacy from "./components/pages/Privacy";

function App() {
  return (
    <AuthUserProvider>
      <BrowserRouter>
        <ToastContainer />
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<Page404 />} />
          <Route path="/doc" element={<DocumentationPage />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />

          {/*Story And Chapter Routes*/}
          <Route path="/" element={<HomePage />} />
          <Route path="/explore" element={<StoryFeed />} />
          <Route path="/explore/:id" element={<StoryDetail />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoutes />}>
            <Route path="/profile" element={<Profile />} />
            <Route path="/community" element={<ExploreUsers />} />
            <Route path="/community/:id" element={<PublicUser />} />
            <Route path="/chat/" element={<GroupChat />} />
            <Route path="/write" element={<WritePage />} />
            <Route path="/write/:storyId" element={<StoryEdit />} />
            <Route
              path="/write/:storyId/chapters/:chapterNo"
              element={<ChapterEditor />}
            />
            <Route
              path="/explore/:storyId/chapters/:chapterNo"
              element={<ChapterReader />}
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthUserProvider>
  );
}

export default App;

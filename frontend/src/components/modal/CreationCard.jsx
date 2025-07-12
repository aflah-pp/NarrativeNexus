import React from "react";
import { Link } from "react-router-dom";
import { useAuthUser } from "../../context/AuthUserContext";

const CreationCard = ({ story }) => {
  const { authUser } = useAuthUser();

  // Check if the current user is the author
  const isAuthor = authUser?.username === story.author?.username;

  const targetLink = isAuthor ? `/write/${story.id}` : `/explore/${story.id}`;

  return (
    <Link to={targetLink} className="block">
      <div className="bg-white rounded-2xl shadow-md p-4 hover:shadow-lg transition">
        <h2 className="text-xl font-semibold text-purple-700 mb-1">{story.title}</h2>
        <p className="text-sm text-gray-600 line-clamp-2">{story.description}</p>
        <div className="mt-2 text-xs text-gray-400">{story.genre} · {story.status}</div>
      </div>
    </Link>
  );
};

export default CreationCard;

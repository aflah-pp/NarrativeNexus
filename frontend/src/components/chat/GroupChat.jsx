import React, { useEffect, useState, useRef } from "react";
import api from "../../utils/axios";
import { useAuthUser } from "../../context/AuthUserContext";
import { Send, Loader2 } from "lucide-react";
import Navbar from "../layout/NavBar";

const GroupChat = () => {
  const { authUser, loading } = useAuthUser();
  const roomName = "global";
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false); 
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [onlineCount, setOnlineCount] = useState(0);
  const [typingUser, setTypingUser] = useState(null);

  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Fetch message history once
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await api.get("chat/messages/");
        setMessages(res.data);
      } catch (err) {
        console.error("Failed to fetch chat history:", err);
      }
    };
    fetchHistory();
  }, []);

  // WebSocket connection setup
  useEffect(() => {
    if (loading) return;

    const token = localStorage.getItem("access");
    if (!authUser || !token) return;

    const socketUrl = `${
      import.meta.env.VITE_GLOBAL_CHAT_SOCKET
    }?token=${token}`;
    const socket = new WebSocket(socketUrl);
    socketRef.current = socket;

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === "typing") {
        if (data.typing && data.user !== authUser.username) {
          setTypingUser(data.user);
          clearTimeout(typingTimeoutRef.current);
          typingTimeoutRef.current = setTimeout(() => {
            setTypingUser(null);
          }, 1000);
        }
        return;
      }

      if (data.message || data.content) {
        setMessages((prev) => {
          const isDuplicate = prev.some(
            (msg) =>
              (msg.id && data.id && msg.id === data.id) ||
              (
                msg.user === data.user &&
                (msg.content || msg.message) === (data.content || data.message) &&
                msg.timestamp === data.timestamp
              )
          );
          if (isDuplicate) return prev;
          return [...prev, data];
        });
      }

      if (data.online_users) setOnlineUsers(data.online_users);
      if (data.online_count) setOnlineCount(data.online_count);
    };

    socket.onerror = (err) => {
      // console.warn("WebSocket error:", err);
    };

    return () => {
      // socket.close(); // optional cleanup
    };
  }, [authUser, loading]);

  // Auto-scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    const socket = socketRef.current;
    if (socket && socket.readyState === WebSocket.OPEN && message.trim()) {
      setSending(true);
      socket.send(JSON.stringify({ message }));
      socket.send(JSON.stringify({ typing: false }));
      setMessage("");

      // simulate delay for better UX
      setTimeout(() => setSending(false), 300);
    }
  };

  const handleTyping = (value) => {
    setMessage(value);
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({ typing: true }));
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && message.trim()) {
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-7xl mx-auto bg-white">
      <Navbar />

      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b mt-16 border-gray-200 bg-white">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">#{roomName}</h2>
          <p className="text-sm text-gray-500">🟢 {onlineCount} online</p>
        </div>
        <div className="flex -space-x-2">
          {onlineUsers.slice(0, 5).map((username, index) => (
            <div
              key={index}
              title={username}
              className="w-9 h-9 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-semibold border border-white"
            >
              {username?.charAt(0).toUpperCase()}
            </div>
          ))}
          {onlineUsers.length > 5 && (
            <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium">
              +{onlineUsers.length - 5}
            </div>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 sm:p-6 overflow-y-auto bg-gray-50">
        {messages.map((msg, index) => {
          const isSelf = msg.user === authUser?.username;
          const isSystem = msg.user === "system" || msg.user === "moderator";
          const displayMsg = msg.content || msg.message;

          if (isSystem) {
            return (
              <div key={index} className="flex justify-center mb-4">
                <span className="text-xs text-gray-500 italic">
                  {displayMsg || `${msg.user} update`}
                </span>
              </div>
            );
          }

          return (
            <div
              key={index}
              className={`flex items-end mb-4 gap-2 ${
                isSelf ? "justify-end" : "justify-start"
              }`}
            >
              {!isSelf && (
                <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-semibold shadow">
                  {msg.user?.charAt(0).toUpperCase()}
                </div>
              )}
              <div
                className={`relative max-w-[75%] sm:max-w-sm px-4 py-3 rounded-2xl shadow-md text-sm whitespace-pre-line break-words ${
                  isSelf
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-900 border border-gray-200"
                }`}
              >
                <p className="text-xs font-semibold opacity-70 mb-1">
                  {msg.user}
                </p>
                <p>{displayMsg}</p>
              </div>
            </div>
          );
        })}

        {typingUser && (
          <div className="text-sm italic text-gray-500 px-4 mb-4">
            {typingUser} is typing...
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-6 border-t border-gray-200 bg-white">
        <div className="flex items-center space-x-3">
          <input
            type="text"
            value={message}
            onChange={(e) => handleTyping(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={sending}
            className="flex-grow px-5 py-3 bg-gray-100 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400 text-base transition-all duration-200 disabled:opacity-50"
            placeholder="Message..."
          />
          <button
            onClick={sendMessage}
            disabled={!message.trim() || sending}
            className="p-3 text-blue-500 hover:text-blue-600 disabled:text-gray-400 transition-colors duration-200 flex items-center justify-center"
            aria-label="Send message"
          >
            {sending ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GroupChat;

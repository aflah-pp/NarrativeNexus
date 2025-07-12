import React, { useEffect, useState } from "react";
import api from "../../utils/axios";
import { X } from "lucide-react";
import { format, isToday, isYesterday } from "date-fns";

const NotificationModal = ({ onClose, updateUnread }) => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await api.get("core/notifications/");
      setNotifications(res.data.notifications);
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    }
  };

  const markAsRead = async (id) => {
    try {
      await api.post(`core/notifications/${id}/read/`);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
      );
      if (updateUnread) updateUnread(); // update unread badge count in Navbar
    } catch (err) {
      console.error("Failed to mark as read:", err);
    }
  };

  const groupByDate = (notifications) => {
    const groups = {};

    notifications.forEach((n) => {
      const date = new Date(n.created_at);
      let label = format(date, "dd MMM yyyy");

      if (isToday(date)) label = "Today";
      else if (isYesterday(date)) label = "Yesterday";

      if (!groups[label]) groups[label] = [];
      groups[label].push(n);
    });

    return groups;
  };

  const sortedNotifications = [...notifications].sort((a) =>
    a.is_read ? 1 : -1
  );

  const grouped = groupByDate(sortedNotifications);

  useEffect(() => {
    fetchNotifications();
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-3xl p-8 rounded-2xl shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-3xl font-bold text-gray-800 mb-6">Notifications</h2>

        {notifications.length === 0 ? (
          <p className="text-gray-500 text-center py-16">
            No notifications yet.
          </p>
        ) : (
          <div className="space-y-6 max-h-[32rem] overflow-y-auto pr-2">
            {Object.entries(grouped).map(([dateLabel, items]) => (
              <div key={dateLabel}>
                <h3 className="text-sm font-semibold text-gray-500 mb-2 px-2">
                  {dateLabel}
                </h3>
                <ul className="space-y-3">
                  {items.map((notification) => (
                    <li
                      key={notification.id}
                      className={`p-4 rounded-xl border transition ${
                        notification.is_read
                          ? "bg-white border-gray-200"
                          : "bg-blue-50 border-blue-200"
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <div className="flex-1">
                          <a
                            href={notification.url}
                            onClick={onClose}
                            className="text-sm text-blue-600 font-medium hover:underline"
                          >
                            {notification.message}
                          </a>
                        </div>

                        <div className="flex-shrink-0 flex gap-2">
                          <a
                            href={notification.url}
                            onClick={onClose}
                            className="inline-flex items-center px-3 py-1 text-xs font-medium text-blue-600 border border-blue-500 rounded-full hover:bg-blue-100 transition"
                          >
                            View
                          </a>

                          {!notification.is_read && (
                            <button
                              onClick={() => markAsRead(notification.id)}
                              className="inline-flex items-center px-3 py-1 text-xs font-medium text-blue-600 border border-blue-500 rounded-full hover:bg-blue-100 transition"
                            >
                              Mark as read
                            </button>
                          )}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationModal;

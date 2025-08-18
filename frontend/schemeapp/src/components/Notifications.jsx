// Notifications.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Dropdown, Badge, ListGroup, Spinner, CloseButton } from "react-bootstrap";
import { Bell } from "react-bootstrap-icons";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch user-specific notifications
  useEffect(() => {
    async function fetchNotifications() {
      try {
        const res = await axios.get(`http://localhost:8000/api/notifications/`, {
          withCredentials: true,
        });
        setNotifications(res.data);
      } catch (err) {
        console.error("Error fetching notifications:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchNotifications();
  }, []);

  // Mark notification as read
  const markAsRead = async (id) => {
    try {
      await axios.patch(
        `http://localhost:8000/api/notifications/?notificationId=${id}`,
        { is_readed: true },
        { withCredentials: true }
      );
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_readed: true } : n))
      );
    } catch (err) {
      console.error("Error marking notification as read:", err);
    }
  };

  // Delete notification
  const deleteNotification = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/api/notifications/?notificationId=${id}`, {
        withCredentials: true, // if cookie-based auth
      });
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    } catch (err) {
      console.error("Error deleting notification:", err);
    }
  };

  const unreadCount = notifications.filter((n) => !n.is_readed).length;

  return (
    <Dropdown align="end">
      <Dropdown.Toggle
        variant="dark"
        id="notification-dropdown"
        style={{ background: "transparent", border: "none", padding: 0 }}
      >
        <Bell size={22} color="white" />
        {unreadCount > 0 && (
          <Badge
            bg="danger"
            pill
            style={{ position: "relative", top: -10, left: -5 }}
          >
            {unreadCount}
          </Badge>
        )}
      </Dropdown.Toggle>

      <Dropdown.Menu style={{ width: "320px" }}>
        <Dropdown.Header>Notifications</Dropdown.Header>
        {loading ? (
          <div className="text-center p-3">
            <Spinner animation="border" size="sm" /> Loading...
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center p-3">No notifications</div>
        ) : (
          <ListGroup variant="flush">
            {notifications.map((n) => (
              <ListGroup.Item
                key={n.id}
                style={{
                  backgroundColor: n.is_readed ? "#0d1318ff" : "#061d30ff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div
                  style={{ flex: 1, cursor: "pointer" }}
                  onClick={() => markAsRead(n.id)}
                  
                >

                 <p className="text-white"> {n.message}</p>
                  <small className="d-block text-text-white-50">
                    {new Date(n.added_at).toLocaleString()}
                  </small>
                </div>
                <CloseButton className="btn-danger"
                  onClick={() => deleteNotification(n.id)}
                  
                  style={{ marginLeft: "10px", color:"red" }}
                />
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Dropdown.Menu>
    </Dropdown>
  );
}

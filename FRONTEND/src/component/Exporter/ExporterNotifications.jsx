import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const ExporterNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    if (!user.userId) return;
    setIsLoading(true);
    axios
      .get(`http://localhost:8082/PureFoods/api/exporter/notifications?userId=${user.userId}`, {
        timeout: 5000,
      })
      .then((response) => {
        if (response.data.status === 200) {
          // Lọc chỉ các thông báo liên quan đến xuất hàng, xác nhận, và hủy
          const filteredNotifications = (response.data.notifications || []).filter(
            (notification) =>
              notification.title.includes("Yêu cầu xuất hàng") ||
              notification.title.includes("Cập nhật trạng thái") ||
              notification.title.includes("Đơn hàng bị hủy")
          );
          setNotifications(filteredNotifications);
        } else {
          toast.error(response.data.message || "Lấy thông báo thất bại!");
        }
      })
      .catch((err) => {
        console.error("Lỗi khi lấy thông báo:", err);
        toast.error("Không thể tải thông báo! Kiểm tra mạng.");
      })
      .finally(() => setIsLoading(false));
  }, [user.userId]);

  return (
    <div className="dashboard-notifications">
      <div className="title">
        <h2>Thông báo</h2>
        <span className="title-leaf">
          <svg className="icon-width bg-gray">
            <use href="/assets/svg/leaf.svg#leaf"></use>
          </svg>
        </span>
      </div>
      <div className="dashboard-bg-box">
        {isLoading ? (
          <div className="text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Đang tải...</span>
            </div>
          </div>
        ) : notifications.length > 0 ? (
          <ul>
            {notifications.map((notification, index) => (
              <li key={index}>
                <h5>{notification.title}</h5>
                <p>{notification.content}</p>
                <small>
                  {new Date(notification.createdAt).toLocaleString("vi-VN")}
                </small>
              </li>
            ))}
          </ul>
        ) : (
          <p>Không có thông báo nào về xuất hàng, xác nhận hoặc hủy đơn hàng.</p>
        )}
      </div>
    </div>
  );
};

export default ExporterNotifications;
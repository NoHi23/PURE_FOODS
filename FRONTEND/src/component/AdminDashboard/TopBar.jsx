import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios';

const TopBar = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [history, setHistory] = useState([]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    toast.success("Logout successfully!");
    navigate("/login");
  };
  useEffect(() => {
    if (!user) return;

    const fetchAllNotifications = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:8082/PureFoods/api/notifications/${user.userId}`
        );

        setNotifications(data.filter((n) => !n.isRead));
        setHistory(data.filter((n) => n.isRead));
      } catch (err) {
        console.error("Error loading notifications:", err);
      }
    };

    fetchAllNotifications();
  }, [user?.userId]);

  const handleMarkRead = async (notiId) => {
    const id = Number(notiId);

    setNotifications((prev) => prev.filter((n) => n.id !== id));

    try {
      await axios.put(
        `http://localhost:8082/PureFoods/api/notifications/${id}/read`
      );

      setHistory((prev) => {
        const justRead = notifications.find((n) => n.id === id);
        return justRead ? [...prev, { ...justRead, isRead: true }] : prev;
      });
    } catch (err) {
      toast.error("Không thể đánh dấu đã đọc");
      setNotifications((prev) => {
        const justRead = history.find((h) => h.id === id);
        return justRead ? [...prev, justRead] : prev;
      });
    }
  };

  const loadAllNotifications = async () => {
    try {
      const { data } = await axios.get(
        `http://localhost:8082/PureFoods/api/notifications/read/${user.userId}`
      );
      setHistory(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      const { data } = await axios.put(
        `http://localhost:8082/PureFoods/api/notifications/mark-all-read/${user.userId}`
      );

      setHistory((h) => [
        ...notifications.map((n) => ({ ...n, isRead: true })),
        ...h,
      ]);
      setNotifications([]);
    } catch (err) {
      console.error("Lỗi mark‑all‑read:", err);
      toast.error("Không thể cập nhật thông báo.");
    }
  };

  return (
    <div>
      <div className="page-header">
        <div className="header-wrapper m-0">

          <form className="form-inline search-full" action="javascript:void(0)" method="get">
            <div className="form-group w-100">
              <div className="Typeahead Typeahead--twitterUsers">
                <div className="u-posRelative">
                  <input className="demo-input Typeahead-input form-control-plaintext w-100" type="text"
                    placeholder="Search Fastkart .." name="q" title="" autofocus />
                  <i className="close-search" data-feather="x"></i>
                  <div className="spinner-border Typeahead-spinner" role="status">
                    <span className="sr-only">Loading...</span>
                  </div>
                </div>
                <div className="Typeahead-menu"></div>
              </div>
            </div>
          </form>
          <div className="nav-right col-6 pull-right right-header p-0">
            <ul className="nav-menus">
              <li>
                <span className="header-search">
                  <i className="ri-search-line"></i>
                </span>
              </li>
              <li className="onhover-dropdown">
                <div className="notification-box" onClick={loadAllNotifications}>
                  <i className="ri-notification-line"></i>
                  {notifications.length > 0 &&
                    <span className="badge rounded-pill badge-theme">{notifications.length}</span>
                  }
                </div>
                <ul className="notification-dropdown onhover-show-div">
                  <li>
                    <i className="ri-notification-line"></i>
                    <h6 className="f-18 mb-0">Notitications</h6>
                  </li>
                  {notifications.map(n => (
                    <li key={n.id} onClick={() => handleMarkRead(n.id)}>
                      <p>
                        <i className="fa fa-circle me-2 font-primary"></i>
                        {n.title} – {n.content}
                        <span className="pull-right">
                          {new Date(n.createdAt).toLocaleString()}
                        </span>
                      </p>
                    </li>
                  ))}
                  {history.map(h => (
                    <li key={h.id}>
                      <p style={{ opacity: .6 }}>
                        <i className="fa fa-circle me-2 font-secondary"></i>
                        {h.title} – {h.content}
                        <span className="pull-right">
                          {new Date(h.createdAt).toLocaleString()}
                        </span>
                      </p>
                    </li>
                  ))}
                  {notifications.length === 0 && history.length === 0 && (
                    <li><p>No notification.</p></li>
                  )}
                  <li>
                    <a className="btn btn-primary" onClick={handleMarkAllRead}>
                      Check all notification
                    </a>
                  </li>
                </ul>
              </li>

              <li>
                <div className="mode">
                  <i className="ri-moon-line"></i>
                </div>
              </li>
              <li className="profile-nav onhover-dropdown pe-0 me-0">
                <div className="media profile-media">
                  <img className="user-profile rounded-circle" src="iconAVT.png" alt="" />
                  <div className="user-name-hide media-body">
                    <span>{user.fullName}</span>
                    <p className="mb-0 font-roboto">Admin<i className="middle ri-arrow-down-s-line"></i></p>
                  </div>
                </div>
                <ul className="profile-dropdown onhover-show-div">
                  <li>
                    <a href="all-users.html">
                      <i data-feather="users"></i>
                      <span>Users</span>
                    </a>
                  </li>
                  <li>
                    <a href="order-list.html">
                      <i data-feather="archive"></i>
                      <span>Orders</span>
                    </a>
                  </li>
                  <li>
                    <a href="support-ticket.html">
                      <i data-feather="phone"></i>
                      <span>Spports Tickets</span>
                    </a>
                  </li>
                  <li>
                    <a href="profile-setting.html">
                      <i data-feather="settings"></i>
                      <span>Settings</span>
                    </a>
                  </li>
                  <li>
                    <a onClick={handleLogout}>
                      <i data-feather="log-out"></i>
                      <span>Log out</span>
                    </a>

                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TopBar

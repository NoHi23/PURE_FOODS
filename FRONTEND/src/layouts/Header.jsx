import { useNavigate } from 'react-router-dom';
import { FiSearch, FiShoppingCart } from 'react-icons/fi';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useEffect, useState } from 'react';
import './Header.css'
export default function Header() {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();
  const userId = user?.userId;

  const handleLogout = () => {
    localStorage.removeItem("user");
    toast.success("Logout successfully!");
    navigate("/login");
  };

  const cartCount = 0;


  const [notifications, setNotifications] = useState([]);
  const [history, setHistory] = useState([]);


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
  }, [userId]);

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
        `http://localhost:8082/PureFoods/api/notifications/read/${userId}`
      );
      setHistory(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      const { data } = await axios.put(
        `http://localhost:8082/PureFoods/api/notifications/mark-all-read/${userId}`
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
    <header className="pb-md-4 pb-0">
      <div className="header-top">
        <div className="container-fluid-lg">
          <div className="row">
            <div className="col-xxl-3 d-xxl-block d-none">
              <div className="top-left-header">
                <i className="iconly-Location icli text-white"></i>
                <span className="text-white">1418 Riverwood Drive, CA 96052, US</span>
              </div>
            </div>

            <div className="col-xxl-6 col-lg-9 d-lg-block d-none">
              <div className="header-offer">
                <div className="notification-slider">
                  <div className="timer-notification">
                    <h6>
                      <strong className="me-1">Chào mừng bạn đến với PURE FOOD!</strong>
                      Tặng các ưu đãi mới vào ngày cuối tuần.
                      <strong className="ms-1">Mã giảm giá mới: Fast024</strong>
                    </h6>
                  </div>
                  <div className="timer-notification">
                    <h6>
                      Một thứ gì đó bạn yêu thích có thể đang được bán{" "}
                      <a href="/shop-left-sidebar" className="text-white">
                        Mua ngay!
                      </a>
                    </h6>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-3">
              <ul className="about-list right-nav-about">
                <li className="right-nav-list">
                  <div className="dropdown theme-form-select">
                    <button
                      className="btn dropdown-toggle"
                      type="button"
                      id="select-language"
                      data-bs-toggle="dropdown"
                    >
                      <img
                        src="/assets/images/country/united-states.png"
                        className="img-fluid blur-up lazyload"
                        alt=""
                      />
                      <span>English</span>
                    </button>
                    <ul className="dropdown-menu dropdown-menu-end">
                      <li>
                        <a className="dropdown-item" href="#">
                          <img
                            src="/assets/images/country/united-kingdom.png"
                            className="img-fluid blur-up lazyload"
                            alt=""
                          />
                          <span>English</span>
                        </a>
                      </li>
                      <li>
                        <a className="dropdown-item" href="#">
                          <img
                            src="/assets/images/country/germany.png"
                            className="img-fluid blur-up lazyload"
                            alt=""
                          />
                          <span>Germany</span>
                        </a>
                      </li>
                      <li>
                        <a className="dropdown-item" href="#">
                          <img
                            src="/assets/images/country/turkish.png"
                            className="img-fluid blur-up lazyload"
                            alt=""
                          />
                          <span>Turki</span>
                        </a>
                      </li>
                    </ul>
                  </div>
                </li>
                <li className="right-nav-list">
                  <div className="dropdown theme-form-select">
                    <button
                      className="btn dropdown-toggle"
                      type="button"
                      id="select-dollar"
                      data-bs-toggle="dropdown"
                    >
                      <span>USD</span>
                    </button>
                    <ul className="dropdown-menu dropdown-menu-end sm-dropdown-menu">
                      <li>
                        <a className="dropdown-item" href="#">
                          AUD
                        </a>
                      </li>
                      <li>
                        <a className="dropdown-item" href="#">
                          EUR
                        </a>
                      </li>
                      <li>
                        <a className="dropdown-item" href="#">
                          CNY
                        </a>
                      </li>
                    </ul>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="top-nav top-header sticky-header">
        <div className="container-fluid-lg">
          <div className="row">
            <div className="col-12">
              <div className="navbar-top">
                <button
                  className="navbar-toggler d-xl-none d-inline navbar-menu-button"
                  type="button"
                  data-bs-toggle="offcanvas"
                  data-bs-target="#primaryMenu"
                >
                  <span className="navbar-toggler-icon">
                    <i className="fa-solid fa-bars"></i>
                  </span>
                </button>
                <a href="/" className="web-logo nav-logo">
                  <img src="../assets/images/logo/1.png" className="img-fluid blur-up lazyload" alt="" />
                </a>

                <div className="middle-box">
                  <div className="search-box">
                    <div className="input-group">
                      <input type="search" className="form-control" placeholder="Nhập thứ bạn muốn tìm kiếm" />
                      <button className="btn" type="button" id="button-addon2">
                        <FiSearch />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="rightside-box">
                  <div className="search-full">
                    <div className="input-group">
                      <span className="input-group-text">
                        <i data-feather="search" className="font-light"></i>
                      </span>
                      <input type="text" className="form-control search-type" placeholder="Search here.." />
                      <span className="input-group-text close-search">
                        <i data-feather="x" className="font-light"></i>
                      </span>
                    </div>
                  </div>
                  <ul className="right-side-menu">
                    <li className="right-side">
                      <div className="delivery-login-box">
                        <div className="delivery-icon">
                          <div className="search-box">
                            <i data-feather="search"></i>
                          </div>
                        </div>
                      </div>
                    </li>

                    <li className="right-side">
                      <div className="onhover-dropdown header-badge">
                        <button type="button" className="btn p-0 position-relative header-wishlist">
                          <FiShoppingCart size={20} />
                          <span className="position-absolute top-0 start-100 translate-middle badge"> {cartCount ?? 0}
                            <span className="visually-hidden">unread messages</span>
                          </span>
                        </button>

                        <div className="onhover-div">
                          <ul className="cart-list">
                            <li className="product-box-contain">
                              <div className="drop-cart">
                                <a href="product-left-thumbnail.html" className="drop-image">
                                  <img src="../assets/images/vegetable/product/1.png"
                                    className="blur-up lazyload" alt="" />
                                </a>

                                <div className="drop-contain">
                                  <a href="product-left-thumbnail.html">
                                    <h5>Fantasy Crunchy Choco Chip Cookies</h5>
                                  </a>
                                  <h6><span>1 x</span> $80.58</h6>
                                  <button className="close-button close_button">
                                    <i className="fa-solid fa-xmark"></i>
                                  </button>
                                </div>
                              </div>
                            </li>

                            <li className="product-box-contain">
                              <div className="drop-cart">
                                <a href="product-left-thumbnail.html" className="drop-image">
                                  <img src="../assets/images/vegetable/product/2.png"
                                    className="blur-up lazyload" alt="" />
                                </a>

                                <div className="drop-contain">
                                  <a href="product-left-thumbnail.html">
                                    <h5>Peanut Butter Bite Premium Butter Cookies 600 g
                                    </h5>
                                  </a>
                                  <h6><span>1 x</span> $25.68</h6>
                                  <button className="close-button close_button">
                                    <i className="fa-solid fa-xmark"></i>
                                  </button>
                                </div>
                              </div>
                            </li>
                          </ul>

                          <div className="price-box">
                            <h5>Total :</h5>
                            <h4 className="theme-color fw-bold">$106.58</h4>
                          </div>

                          <div className="button-group">
                            <a href="/cart-detail" className="btn btn-sm cart-button">View Cart</a>
                            <a href="checkout.html" className="btn btn-sm cart-button theme-bg-color
                                                    text-white">Checkout</a>
                          </div>
                        </div>
                      </div>
                    </li>
                    <li className="right-side">
                      <div className="onhover-dropdown header-badge">

                        <li data-bs-placement="top"
                          title="Wishlist">
                          <a href="wishlist.html" className="notifi-wishlist">
                            <i data-feather="heart"></i>
                            <span className="position-absolute top-0 start-100 translate-middle badge"> {cartCount ?? 0}
                              <span className="visually-hidden">unread messages</span>
                            </span>
                          </a>

                        </li>

                        <div className="onhover-div">
                          <ul className="cart-list">
                            <li className="product-box-contain">
                              <div className="drop-cart">
                                <a href="product-left-thumbnail.html" className="drop-image">
                                  <img src="../assets/images/vegetable/product/1.png"
                                    className="blur-up lazyload" alt="" />
                                </a>

                                <div className="drop-contain">
                                  <a href="product-left-thumbnail.html">
                                    <h5>Fantasy Crunchy Choco Chip Cookies</h5>
                                  </a>
                                  <h6><span>1 x</span> $80.58</h6>
                                  <button className="close-button close_button">
                                    <i className="fa-solid fa-xmark"></i>
                                  </button>
                                </div>
                              </div>
                            </li>

                            <li className="product-box-contain">
                              <div className="drop-cart">
                                <a href="product-left-thumbnail.html" className="drop-image">
                                  <img src="../assets/images/vegetable/product/2.png"
                                    className="blur-up lazyload" alt="" />
                                </a>

                                <div className="drop-contain">
                                  <a href="product-left-thumbnail.html">
                                    <h5>Peanut Butter Bite Premium Butter Cookies 600 g
                                    </h5>
                                  </a>
                                  <h6><span>1 x</span> $25.68</h6>
                                  <button className="close-button close_button">
                                    <i className="fa-solid fa-xmark"></i>
                                  </button>
                                </div>
                              </div>
                            </li>
                          </ul>

                          <div className="price-box">
                            <h5>Total :</h5>
                            <h4 className="theme-color fw-bold">$106.58</h4>
                          </div>

                          <div className="button-group">
                            <a href="/cart-detail" className="btn btn-sm cart-button">View Cart</a>
                            <a href="checkout.html" className="btn btn-sm cart-button theme-bg-color
                                                    text-white">Checkout</a>
                          </div>
                        </div>
                      </div>
                    </li>

                    <li className="right-side">
                      <li className="onhover-dropdown">
                        <div className="notification-box" onClick={loadAllNotifications}>
                          <i className="ri-notification-line fs-5"></i>
                          {notifications.length > 0 &&
                            <span className="badge rounded-pill badge-theme">{notifications.length}</span>
                          }
                        </div>
                        <ul className="notification-dropdown onhover-show-div">
                          <li>
                            <i className="ri-notification-line"></i>
                            <h6 className="f-18 mb-0" style={{ marginLeft: "5px" }}>Notitications</h6>
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
                    </li>

                    <li className="right-side onhover-dropdown">
                      <div className="delivery-login-box">
                        <div className="delivery-icon d-flex" style={{ alignItems: "center" }}>
                          <i data-feather="user"></i>
                          <div style={{ marginLeft: "3px" }}>
                            <h6>Hello,</h6>
                            <h5>{user?.fullName || "My Account"}</h5>
                          </div>
                        </div>
                        <div className="delivery-detail">

                        </div>
                      </div>
                      <div className="onhover-div onhover-div-login" style={{ width: "130%" }}>
                        <ul className="user-box-name">
                          {user ? (
                            <>
                              <li className="product-box-contain">
                                <a href="/customer-profile-update">Profile Setting</a>
                              </li>

                              <li className="product-box-contain">
                                <a href="#" onClick={handleLogout}>
                                  Logout
                                </a>
                              </li>
                              <li className="product-box-contain">
                                <a href="/forgot">Forgot Password</a>
                              </li>
                            </>
                          ) : (
                            <>
                              <li className="product-box-contain">
                                <a href="/login">Log In</a>
                              </li>
                              <li className="product-box-contain">
                                <a href="/signup">Register</a>
                              </li>
                            </>
                          )}
                        </ul>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
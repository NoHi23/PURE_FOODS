import React, { useEffect, useState } from 'react'
import MyCouponsPageLayout from '../../layouts/MyCouponsPageLayout'
import axios from 'axios';
import './Notification.css'
import { toast } from 'react-toastify';

const Notitications = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.userId;


  const [notifications, setNotifications] = useState([]);
  const [history, setHistory] = useState([]);


  useEffect(() => {
    if (!userId) return;

    const fetchAllNotifications = async () => {
      try {
        const { data } = await axios.get(`http://localhost:8082/PureFoods/api/notifications/${userId}`);
        setNotifications(data.filter(n => !n.isRead));
        setHistory(data.filter(n => n.isRead));
      } catch (err) {
        console.error("Error loading notifications:", err);
      }
    };

    fetchAllNotifications();
  }, [userId]);

  const handleMarkRead = async (notiId) => {
    const id = Number(notiId);
    setNotifications(prev => prev.filter(n => n.id !== id));

    try {
      await axios.put(`http://localhost:8082/PureFoods/api/notifications/${id}/read`);
      const justRead = notifications.find(n => n.id === id);
      if (justRead) {
        setHistory(prev => [...prev, { ...justRead, isRead: true }]);
      }
    } catch (err) {
      toast.error("Không thể đánh dấu đã đọc");
      const justRead = history.find(h => h.id === id);
      if (justRead) {
        setNotifications(prev => [...prev, justRead]);
      }
    }
  };

  const loadAllNotifications = async () => {
    try {
      const { data } = await axios.get(`http://localhost:8082/PureFoods/api/notifications/read/${userId}`);
      setHistory(data);
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <MyCouponsPageLayout>
      <div>
        <div className="mobile-menu d-md-none d-block mobile-cart">
          <ul>
            <li className="active">
              <a href="index.html">
                <i className="iconly-Home icli"></i>
                <span>Home</span>
              </a>
            </li>

            <li className="mobile-category">
              <a href="javascript:void(0)">
                <i className="iconly-Category icli js-link"></i>
                <span>Category</span>
              </a>
            </li>

            <li>
              <a href="search.html" className="search-box">
                <i className="iconly-Search icli"></i>
                <span>Search</span>
              </a>
            </li>

            <li>
              <a href="wishlist.html" className="notifi-wishlist">
                <i className="iconly-Heart icli"></i>
                <span>My Wish</span>
              </a>
            </li>

            <li>
              <a href="cart.html">
                <i className="iconly-Bag-2 icli fly-cate"></i>
                <span>Cart</span>
              </a>
            </li>
          </ul>
        </div>
        {/*mobile fix menu end  */}

        {/*Breadcrumb Section Start  */}
        <section className="breadcrumb-section pt-0">
          <div className="container-fluid-lg">
            <div className="row">
              <div className="col-12">
                <div className="breadcrumb-contain">
                  <h2 className="mb-2">Compare</h2>
                  <nav>
                    <ol className="breadcrumb mb-0">
                      <li className="breadcrumb-item">
                        <a href="/">
                          <i className="fa-solid fa-house"></i>
                        </a>
                      </li>
                      <li className="breadcrumb-item">Shop</li>
                      <li className="breadcrumb-item active">Compare</li>
                    </ol>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/*Breadcrumb Section End  */}

        {/*Compare Section Start  */}
        <section className="compare-section section-b-space">
          <div className="container-fluid-lg">
            <div className="row">
              <div className="col-12">
                {/* New Notifications */}
                <div className="card shadow p-3 mb-4">
                  <h4 className="mb-3">New Notifications</h4>
                  {notifications.length === 0 ? (
                    <p className="text-muted">No new notifications.</p>
                  ) : (
                    <ul className="list-group">
                      {notifications.map((noti) => (
                        <li
                          key={noti.id}
                          className="list-group-item d-flex justify-content-between align-items-center"
                        >
                          <div>
                            <strong>{noti.title}</strong>
                            <p className="mb-0">{noti.content}</p>
                          </div>
                          <button
                            className="btn btn-sm btn-outline-success"
                            onClick={() => handleMarkRead(noti.id)}
                          >
                            Mark as Read
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Notification History */}
                <div className="card shadow p-3">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <h4>Notification History</h4>
                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={loadAllNotifications}
                    >
                      Reload
                    </button>
                  </div>
                  {history.length === 0 ? (
                    <p className="text-muted">No read notifications yet.</p>
                  ) : (
                    <ul className="list-group">
                      {history.map((noti) => (
                        <li key={noti.id} className="list-group-item">
                          <strong>{noti.title}</strong>
                          <p className="mb-0">{noti.content}</p>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/*Compare Section End  */}


        {/*Location Modal Start  */}
        <div className="modal location-modal fade theme-modal" id="locationModal" tabindex="-1">
          <div className="modal-dialog modal-dialog-centered modal-fullscreen-sm-down">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">Choose your Delivery Location</h5>
                <p className="mt-1 text-content">Enter your address and we will specify the offer for your area.</p>
                <button type="button" className="btn-close" data-bs-dismiss="modal">
                  <i className="fa-solid fa-xmark"></i>
                </button>
              </div>
              <div className="modal-body">
                <div className="location-list">
                  <div className="search-input">
                    <input type="search" className="form-control" placeholder="Search Your Area" />
                    <i className="fa-solid fa-magnifying-glass"></i>
                  </div>

                  <div className="disabled-box">
                    <h6>Select a Location</h6>
                  </div>

                  <ul className="location-select custom-height">
                    <li>
                      <a href="javascript:void(0)">
                        <h6>Alabama</h6>
                        <span>Min: $130</span>
                      </a>
                    </li>

                    <li>
                      <a href="javascript:void(0)">
                        <h6>Arizona</h6>
                        <span>Min: $150</span>
                      </a>
                    </li>

                    <li>
                      <a href="javascript:void(0)">
                        <h6>California</h6>
                        <span>Min: $110</span>
                      </a>
                    </li>

                    <li>
                      <a href="javascript:void(0)">
                        <h6>Colorado</h6>
                        <span>Min: $140</span>
                      </a>
                    </li>

                    <li>
                      <a href="javascript:void(0)">
                        <h6>Florida</h6>
                        <span>Min: $160</span>
                      </a>
                    </li>

                    <li>
                      <a href="javascript:void(0)">
                        <h6>Georgia</h6>
                        <span>Min: $120</span>
                      </a>
                    </li>

                    <li>
                      <a href="javascript:void(0)">
                        <h6>Kansas</h6>
                        <span>Min: $170</span>
                      </a>
                    </li>

                    <li>
                      <a href="javascript:void(0)">
                        <h6>Minnesota</h6>
                        <span>Min: $120</span>
                      </a>
                    </li>

                    <li>
                      <a href="javascript:void(0)">
                        <h6>New York</h6>
                        <span>Min: $110</span>
                      </a>
                    </li>

                    <li>
                      <a href="javascript:void(0)">
                        <h6>Washington</h6>
                        <span>Min: $130</span>
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/*Location Modal End  */}

        {/*Deal Box Modal Start  */}
        <div className="modal fade theme-modal deal-modal" id="deal-box" tabindex="-1">
          <div className="modal-dialog modal-dialog-centered modal-fullscreen-sm-down">
            <div className="modal-content">
              <div className="modal-header">
                <div>
                  <h5 className="modal-title w-100" id="deal_today">Deal Today</h5>
                  <p className="mt-1 text-content">Recommended deals for you.</p>
                </div>
                <button type="button" className="btn-close" data-bs-dismiss="modal">
                  <i className="fa-solid fa-xmark"></i>
                </button>
              </div>
              <div className="modal-body">
                <div className="deal-offer-box">
                  <ul className="deal-offer-list">
                    <li className="list-1">
                      <div className="deal-offer-contain">
                        <a href="shop-left-sidebar.html" className="deal-image">
                          <img src="../assets/images/vegetable/product/10.png" className="blur-up lazyload"
                            alt="" />
                        </a>

                        <a href="shop-left-sidebar.html" className="deal-contain">
                          <h5>Blended Instant Coffee 50 g Buy 1 Get 1 Free</h5>
                          <h6>$52.57 <del>57.62</del> <span>500 G</span></h6>
                        </a>
                      </div>
                    </li>

                    <li className="list-2">
                      <div className="deal-offer-contain">
                        <a href="shop-left-sidebar.html" className="deal-image">
                          <img src="../assets/images/vegetable/product/11.png" className="blur-up lazyload"
                            alt="" />
                        </a>

                        <a href="shop-left-sidebar.html" className="deal-contain">
                          <h5>Blended Instant Coffee 50 g Buy 1 Get 1 Free</h5>
                          <h6>$52.57 <del>57.62</del> <span>500 G</span></h6>
                        </a>
                      </div>
                    </li>

                    <li className="list-3">
                      <div className="deal-offer-contain">
                        <a href="shop-left-sidebar.html" className="deal-image">
                          <img src="../assets/images/vegetable/product/12.png" className="blur-up lazyload"
                            alt="" />
                        </a>

                        <a href="shop-left-sidebar.html" className="deal-contain">
                          <h5>Blended Instant Coffee 50 g Buy 1 Get 1 Free</h5>
                          <h6>$52.57 <del>57.62</del> <span>500 G</span></h6>
                        </a>
                      </div>
                    </li>

                    <li className="list-1">
                      <div className="deal-offer-contain">
                        <a href="shop-left-sidebar.html" className="deal-image">
                          <img src="../assets/images/vegetable/product/13.png" className="blur-up lazyload"
                            alt="" />
                        </a>

                        <a href="shop-left-sidebar.html" className="deal-contain">
                          <h5>Blended Instant Coffee 50 g Buy 1 Get 1 Free</h5>
                          <h6>$52.57 <del>57.62</del> <span>500 G</span></h6>
                        </a>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/*Deal Box Modal End  */}

        {/*Tap to top and theme setting button start  */}
        <div className="theme-option">


          <div className="back-to-top">
            <a id="back-to-top" href="#">
              <i className="fas fa-chevron-up"></i>
            </a>
          </div>
        </div>
        <div className="bg-overlay"></div>

      </div>
    </MyCouponsPageLayout>
  )
}

export default Notitications

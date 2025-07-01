import React from 'react'
import SidebarEffect from '../SidebarEffect/SidebarEffect.jsx'
import { Link } from 'react-router-dom'

const SideBar = () => {
  return (
    <div>
      <div className="sidebar-wrapper">
        <div id="sidebarEffect"></div>
        <SidebarEffect />
        <div>
          <div className="logo-wrapper logo-wrapper-center">
            <Link to={'/admin-dashboard'}>
              <img className="img-fluid for-white" src="../back-end/assets/images/logo/full-white.png" alt="logo" />
            </Link>
            <div className="back-btn">
              <i className="fa fa-angle-left"></i>
            </div>
            <div className="toggle-sidebar">
              <i className="ri-apps-line status_toggle middle sidebar-toggle"></i>
            </div>
          </div>
          <div className="logo-icon-wrapper">
            <Link to={'/admin-dashboard'}>
              <img className="img-fluid main-logo main-white" src="../back-end/assets/images/logo/logo.png" alt="logo" />
              <img className="img-fluid main-logo main-dark" src="../back-end/assets/images/logo/logo-white.png"
                alt="logo" />
            </Link>
          </div>
          <nav className="sidebar-main">
            <div className="left-arrow" id="left-arrow">
              <i data-feather="arrow-left"></i>
            </div>

            <div id="sidebar-menu">
              <ul className="sidebar-links" id="simple-bar">
                <li className="back-btn"></li>

                <li className="sidebar-list">
                  <Link to={'/admin-dashboard'} className="sidebar-link sidebar-title link-nav">
                    <i className="ri-home-line"></i>
                    <span>Dashboard</span>
                  </Link>
                </li>

                <li className="sidebar-list">
                  <a className="linear-icon-link sidebar-link sidebar-title" href="javascript:void(0)">
                    <i className="ri-store-3-line"></i>
                    <span>Product</span>
                  </a>
                  <ul className="sidebar-submenu">
                    <li>
                      <Link to={'/admin-product'}>Products</Link>
                    </li>

                    <li>
                      <Link to={'/admin-add-new-product'}>Add New Products</Link>
                    </li>
                  </ul>
                </li>

                <li className="sidebar-list">
                  <a className="linear-icon-link sidebar-link sidebar-title" href="javascript:void(0)">
                    <i className="ri-list-check-2"></i>
                    <span>Category</span>
                  </a>
                  <ul className="sidebar-submenu">
                    <li>
                      <Link to={'/admin-category'}>Category List</Link>
                    </li>

                    <li>
                      <a href='/admin-add-new-category'>Add New Category</a>
                    </li>
                  </ul>
                </li>

                <li className="sidebar-list">
                  <a className="linear-icon-link sidebar-link sidebar-title" href="javascript:void(0)">
                    <i className="ri-list-check-2"></i>
                    <span>Supplier</span>
                  </a>
                  <ul className="sidebar-submenu">
                    <li>
                      <Link to={'/admin-supplier'}>Supplier List</Link>
                    </li>

                    <li>
                      <a href='/admin-add-new-supplier'>Add New Supplier</a>
                    </li>
                  </ul>
                </li>

                <li className="sidebar-list">
                  <a className="sidebar-link sidebar-title" href="javascript:void(0)">
                    <i className="ri-user-3-line"></i>
                    <span>Users</span>
                  </a>
                  <ul className="sidebar-submenu">
                    <li>
                      <Link to={"/all-user"}>All users</Link>
                    </li>
                    <li>
                      <a href="add-new-user.html">Add new user</a>
                    </li>
                  </ul>
                </li>

                <li className="sidebar-list">
                  <a className="sidebar-link sidebar-title" href="javascript:void(0)">
                    <i className="ri-user-3-line"></i>
                    <span>Roles</span>
                  </a>
                  <ul className="sidebar-submenu">
                    <li>
                      <a href="role.html">All roles</a>
                    </li>
                    <li>
                      <a href="create-role.html">Create Role</a>
                    </li>
                  </ul>
                </li>

                <li className="sidebar-list">
                  <a className="sidebar-link sidebar-title link-nav" href="media.html">
                    <i className="ri-price-tag-3-line"></i>
                    <span>Media</span>
                  </a>
                </li>

                <li className="sidebar-list">
                  <a className="sidebar-link sidebar-title" href="javascript:void(0)">
                    <i className="ri-archive-line"></i>
                    <span>Orders</span>
                  </a>
                  <ul className="sidebar-submenu">
                    <li>
                      <a href="order-list.html">Order List</a>
                    </li>
                    <li>
                      <a href="order-detail.html">Order Detail</a>
                    </li>
                    <li>
                      <a href="order-tracking.html">Order Tracking</a>
                    </li>
                  </ul>
                </li>

                <li className="sidebar-list">
                  <a className="linear-icon-link sidebar-link sidebar-title" href="javascript:void(0)">
                    <i className="ri-focus-3-line"></i>
                    <span>Localization</span>
                  </a>
                  <ul className="sidebar-submenu">
                    <li>
                      <a href="translation.html">Translation</a>
                    </li>

                    <li>
                      <a href="currency-rates.html">Currency Rates</a>
                    </li>
                  </ul>
                </li>

                <li className="sidebar-list">
                  <a className="linear-icon-link sidebar-link sidebar-title" href="javascript:void(0)">
                    <i className="ri-price-tag-3-line"></i>
                    <span>Coupons</span>
                  </a>
                  <ul className="sidebar-submenu">
                    <li>
                      <a href="coupon-list.html">Coupon List</a>
                    </li>

                    <li>
                      <a href="create-coupon.html">Create Coupon</a>
                    </li>
                  </ul>
                </li>

                <li className="sidebar-list">
                  <a className="sidebar-link sidebar-title link-nav" href="taxes.html">
                    <i className="ri-price-tag-3-line"></i>
                    <span>Tax</span>
                  </a>
                </li>

                <li className="sidebar-list">
                  <a className="sidebar-link sidebar-title link-nav" href="product-review.html">
                    <i className="ri-star-line"></i>
                    <span>Product Review</span>
                  </a>
                </li>

                <li className="sidebar-list">
                  <a className="sidebar-link sidebar-title link-nav" href="support-ticket.html">
                    <i className="ri-phone-line"></i>
                    <span>Support Ticket</span>
                  </a>
                </li>

                <li className="sidebar-list">
                  <a className="linear-icon-link sidebar-link sidebar-title" href="javascript:void(0)">
                    <i className="ri-settings-line"></i>
                    <span>Settings</span>
                  </a>
                  <ul className="sidebar-submenu">
                    <li>
                      <a href="profile-setting.html">Profile Setting</a>
                    </li>
                  </ul>
                </li>

                <li className="sidebar-list">
                  <a className="sidebar-link sidebar-title link-nav" href="reports.html">
                    <i className="ri-file-chart-line"></i>
                    <span>Reports</span>
                  </a>
                </li>

                <li className="sidebar-list">
                  <a className="sidebar-link sidebar-title link-nav" href="list-page.html">
                    <i className="ri-list-check"></i>
                    <span>List Page</span>
                  </a>
                </li>
              </ul>
            </div>

            <div className="right-arrow" id="right-arrow">
              <i data-feather="arrow-right"></i>
            </div>
          </nav>
        </div>
      </div>
    </div>
  )
}

export default SideBar

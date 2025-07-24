import React from 'react'
import SidebarEffect from '../SidebarEffect/SidebarEffect.jsx'
import { Link } from 'react-router-dom'

const SideBar = () => {
  return (
    <div>
      <div className="sidebar-wrapper">
        <nav className="sidebar-main" style={{ position: "relative" }}>
          <SidebarEffect />
          <div id="sidebarEffect" style={{
            position: "absolute",
            inset: 0,
            zIndex: 0,
            pointerEvents: "none"
          }}></div>
          <div className='logoSide'>
            <div className="logo-wrapper logo-wrapper-center">
              <Link to={'/admin-dashboard'}>
                <img className="img-fluid for-white" src="/assets/images/logo/1.png" alt="logo" />
              </Link>
            </div>
            <div className="logo-icon-wrapper">
              <Link to={'/admin-dashboard'}>
                <img className="img-fluid main-logo main-white" src="/assets/images/logo/1.png" alt="logo" />
                <img className="img-fluid main-logo main-dark" src="/assets/images/logo/1.png"
                  alt="logo" />
              </Link>
            </div>
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
                    <Link to={"/add-new-user"}>Add new user</Link>
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
                    <Link to={'/all-role'}>All roles</Link>
                  </li>
                  <li>
                    <Link to={"/add-new-role"}>Create Role</Link>
                  </li>
                </ul>
              </li>




              <li className="sidebar-list">
                <a className="sidebar-link sidebar-title" href="javascript:void(0)">
                  <i className="ri-archive-line"></i>
                  <span>Orders</span>
                </a>
                <ul className="sidebar-submenu">
                  <li>
                    <Link to={'/admin-order'}>Order List</Link>
                  </li>
                </ul>
              </li>
              <li className="sidebar-list">
                <a className="linear-icon-link sidebar-link sidebar-title" href="javascript:void(0)">
                  <i className="ri-price-tag-3-line"></i>
                  <span>Coupon</span>
                </a>
                <ul className="sidebar-submenu">
                  <li>
                    <Link to={'/admin-coupons'}>Coupon List</Link>
                  </li>
                  <li>
                    <Link to={'/admin-add-new-coupons'}>Add New Coupon</Link>
                  </li>
                </ul>
              </li>
              <li className="sidebar-list">
                <a className="linear-icon-link sidebar-link sidebar-title" href="javascript:void(0)">
                  <i className="ri-price-tag-3-line"></i>
                  <span>Tax</span>
                </a>
                <ul className="sidebar-submenu">
                  <li>
                    <Link to={'/admin-taxes'}>Tax List</Link>
                  </li>
                  <li>
                    <Link to={'/admin-add-new-tax'}>Add New Tax</Link>
                  </li>
                </ul>
              </li>
              <li className="sidebar-list">
                <a className="linear-icon-link sidebar-link sidebar-title" href="javascript:void(0)">
                  <i className="ri-file-text-line"></i>
                  <span>Blog</span>
                </a>
                <ul className="sidebar-submenu">
                  <li>
                    <Link to={'/admin-blog'}>Blog List</Link>
                  </li>
                  <li>
                    <Link to={'/admin-add-new-blog'}>Add New Blog</Link>
                  </li>
                </ul>
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


            </ul>
          </div>

          <div className="right-arrow" id="right-arrow">
            <i data-feather="arrow-right"></i>
          </div>
        </nav>
      </div>
    </div>
  )
}

export default SideBar

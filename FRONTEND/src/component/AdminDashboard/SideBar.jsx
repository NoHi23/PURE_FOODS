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
                  <span>Sản phẩm</span>
                </a>
                <ul className="sidebar-submenu">
                  <li>
                    <Link to={'/admin-product'}>Danh sách sản phẩm</Link>
                  </li>

                  <li>
                    <Link to={'/admin-add-new-product'}>Thêm sản phẩm mới</Link>
                  </li>
                </ul>
              </li>

              <li className="sidebar-list">
                <a className="linear-icon-link sidebar-link sidebar-title" href="javascript:void(0)">
                  <i className="ri-list-check-2"></i>
                  <span>Loại sản phẩm</span>
                </a>
                <ul className="sidebar-submenu">
                  <li>
                    <Link to={'/admin-category'}>Danh sách loại sản phẩm</Link>
                  </li>

                  <li>
                    <a href='/admin-add-new-category'>Thêm mới loại sản phẩm</a>
                  </li>
                </ul>
              </li>

              <li className="sidebar-list">
                <a className="linear-icon-link sidebar-link sidebar-title" href="javascript:void(0)">
                  <i className="ri-list-check-2"></i>
                  <span>Nhà cung cấp</span>
                </a>
                <ul className="sidebar-submenu">
                  <li>
                    <Link to={'/admin-supplier'}>Danh sách nhà cung cấp</Link>
                  </li>

                  <li>
                    <a href='/admin-add-new-supplier'>Thêm mới nhà cung cấp</a>
                  </li>
                </ul>
              </li>

              <li className="sidebar-list">
                <a className="sidebar-link sidebar-title" href="javascript:void(0)">
                  <i className="ri-user-3-line"></i>
                  <span>Người dùng</span>
                </a>
                <ul className="sidebar-submenu">
                  <li>
                    <Link to={"/all-user"}>Danh sách người dùng</Link>
                  </li>
                  <li>
                    <Link to={"/add-new-user"}>Thêm mới người dùng</Link>
                  </li>
                </ul>
              </li>

              <li className="sidebar-list">
                <a className="sidebar-link sidebar-title" href="javascript:void(0)">
                  <i className="ri-user-3-line"></i>
                  <span>Vai trò</span>
                </a>
                <ul className="sidebar-submenu">
                  <li>
                    <Link to={'/all-role'}>Danh sách vai trò</Link>
                  </li>
                  <li>
                    <Link to={"/add-new-role"}>Tạo mới vai trò</Link>
                  </li>
                </ul>
              </li>




              <li className="sidebar-list">
                <a className="sidebar-link sidebar-title" href="javascript:void(0)">
                  <i className="ri-archive-line"></i>
                  <span>Đơn hàng</span>
                </a>
                <ul className="sidebar-submenu">
                  <li>
                    <Link to={'/admin-order'}>Danh sách đơn hàng</Link>
                  </li>
                </ul>
              </li>
              <li className="sidebar-list">
                <a className="linear-icon-link sidebar-link sidebar-title" href="javascript:void(0)">
                  <i className="ri-price-tag-3-line"></i>
                  <span>Mã giảm giá</span>
                </a>
                <ul className="sidebar-submenu">
                  <li>
                    <Link to={'/admin-coupons'}>Danh sách mã giảm giá</Link>
                  </li>
                  <li>
                    <Link to={'/admin-add-new-coupons'}>Thêm mới mã giảm giá</Link>
                  </li>
                </ul>
              </li>
              <li className="sidebar-list">
                <a className="linear-icon-link sidebar-link sidebar-title" href="javascript:void(0)">
                  <i className="ri-price-tag-3-line"></i>
                  <span>Thuế</span>
                </a>
                <ul className="sidebar-submenu">
                  <li>
                    <Link to={'/admin-taxes'}>Danh sách thuế</Link>
                  </li>
                  <li>
                    <Link to={'/admin-add-new-tax'}>Thêm mới thuế</Link>
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
                    <Link to={'/admin-blog'}>Danh sách Blog</Link>
                  </li>
                  <li>
                    <Link to={'/admin-add-new-blog'}>Thêm mới Blog</Link>
                  </li>
                </ul>
              </li>

              <li className="sidebar-list">
  <Link to="/admin-product-review" className="sidebar-link sidebar-title link-nav">
    <i className="ri-star-line"></i>
    <span>Product Review</span>
  </Link>
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
                  <span>Báo cáo</span>
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

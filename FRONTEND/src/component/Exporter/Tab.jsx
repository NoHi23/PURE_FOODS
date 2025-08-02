import React from "react";
import { Home, ShoppingBag, Package, User, Settings, Truck } from 'react-feather';  // Import icons từ react-feather (install: npm i react-feather)
// Loại bỏ import Bell vì tab "Thông báo" đã ẩn

const Tab = ({ user }) => {
  return (
    <div className="col-xxl-3 col-lg-4">
      <div className="dashboard-left-sidebar">
        <div className="profile-box">
          <div className="cover-image">
            <img
              src="/assets/images/inner-page/cover-img.jpg"
              className="img-fluid blur-up lazyload"
              alt="Cover"
            />
          </div>
          <div className="profile-contain">
            <div className="profile-image">
              <div className="position-relative">
                <img
                  src="/assets/images/vendor-page/logo.png"
                  className="blur-up lazyload update_img"
                  alt="Logo"
                />
              </div>
            </div>
            <div className="profile-name">
              <h3>{user?.fullName || "Không rõ"}</h3>
              <h6 className="text-content">{user?.email || "Không rõ"}</h6>
            </div>
          </div>
        </div>
        <ul className="nav nav-pills user-nav-pills" id="pills-tab" role="tablist">
          <li className="nav-item" role="presentation">
            <button
              className="nav-link active"
              id="pills-dashboard-tab"
              data-bs-toggle="pill"
              data-bs-target="#pills-dashboard"
              type="button"
              role="tab"
            >
              <Home size={20} />  {/* Sử dụng component icon từ react-feather, size tùy chỉnh */}
              Thông tin tổng quan
            </button>
          </li>
          <li className="nav-item" role="presentation">
            <button
              className="nav-link"
              id="pills-product-tab"
              data-bs-toggle="pill"
              data-bs-target="#pills-product"
              type="button"
              role="tab"
            >
              <ShoppingBag size={20} />
              Quản lý xuất kho
            </button>
          </li>
          <li className="nav-item" role="presentation">
            <button
              className="nav-link"
              id="pills-order-tab"
              data-bs-toggle="pill"
              data-bs-target="#pills-order"
              type="button"
              role="tab"
            >
              <ShoppingBag size={20} />
              Lịch sử xuất kho
            </button>
          </li>
          <li className="nav-item" role="presentation">
            <button
              className="nav-link"
              id="pills-inventory-tab"
              data-bs-toggle="pill"
              data-bs-target="#pills-inventory"
              type="button"
              role="tab"
            >
              <Package size={20} />
              Kho hàng
            </button>
          </li>
          <li className="nav-item" role="presentation">
            <button
              className="nav-link"
              id="pills-profile-tab"
              data-bs-toggle="pill"
              data-bs-target="#pills-profile"
              type="button"
              role="tab"
            >
              <User size={20} />
              Thông tin cá nhân
            </button>
          </li>
          <li className="nav-item" role="presentation">
            <button
              className="nav-link"
              id="pills-security-tab"
              data-bs-toggle="pill"
              data-bs-target="#pills-security"
              type="button"
              role="tab"
            >
              <Settings size={20} />
              Cài đặt
            </button>
          </li>
          {/* Tab "Thông báo" đã bị ẩn bằng cách comment <li> này, không xuất hiện ở menu nhưng chức năng backend (fetch notifications) vẫn giữ nếu component mount ở nơi khác */}
          {/* <li className="nav-item" role="presentation">
            <button
              className="nav-link"
              id="pills-notifications-tab"
              data-bs-toggle="pill"
              data-bs-target="#pills-notifications"
              type="button"
              role="tab"
            >
              <Bell size={20} />
              Thông báo
            </button>
          </li> */}
          <li className="nav-item" role="presentation">
            <button
              className="nav-link"
              id="pills-order-tracking-tab"
              data-bs-toggle="pill"
              data-bs-target="#pills-order-tracking"
              type="button"
              role="tab"
            >
              <Truck size={20} />
              Theo dõi đơn hàng
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Tab;
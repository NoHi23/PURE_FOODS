import React from "react";

const Tab = ({ user }) => {
  return (
    <div className="col-xxl-3 col-lg-4">
      <div className="dashboard-left-sidebar">
        <div className="profile-box">
          <div className="cover-image">
            <img
              src="../assets/images/inner-page/cover-img.jpg"
              className="img-fluid blur-up lazyload"
              alt=""
            />
          </div>

          <div className="profile-contain">
            <div className="profile-image">
              <div className="position-relative">
                <img
                  src="../assets/images/vendor-page/logo.png"
                  className="blur-up lazyload update_img"
                  alt=""
                />
              </div>
            </div>

            <div className="profile-name">
              <h3>{user.fullName}</h3>
              <h6 className="text-content">{user.email}</h6>
            </div>
          </div>
        </div>

        <ul className="nav nav-pills user-nav-pills" id="pills-tab" role="tablist">
          <li className="nav-item" role="presentation">
            <a
              href="#pills-tabContent"
              className="nav-link active"
              id="pills-dashboard-tab"
              data-bs-toggle="pill"
              data-bs-target="#pills-dashboard"
              role="tab"
            >
              <i data-feather="home"></i>
              Thông tin tổng quan
            </a>
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
              <i data-feather="shopping-bag"></i>Quản lý nhập kho
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
              <i data-feather="shopping-bag"></i>Lịch sử nhập kho
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
              <i data-feather="user"></i>
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
              <i data-feather="settings"></i>
              Cài đặt
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Tab;

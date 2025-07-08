import React from "react";

const TraderTab = ({ user }) => {
  return (
    <div className="col-xxl-3 col-lg-4">
      <div className="dashboard-left-sidebar">
        <div className="profile-box">
          <div className="cover-image">
            <img
              src="/assets/images/inner-page/cover-img.jpg"
              className="img-fluid blur-up lazyload"
              alt="cover"
            />
          </div>
          <div className="profile-contain">
            <div className="profile-image">
              <div className="position-relative">
                <img
                  src="/assets/images/vendor-page/logo.png"
                  className="blur-up lazyload update_img"
                  alt="avatar"
                />
              </div>
            </div>
            <div className="profile-name">
              <h3>{user.fullName}</h3>
              <h6 className="text-content">{user.email}</h6>
            </div>
          </div>
        </div>

        <ul className="nav nav-pills user-nav-pills" id="trader-tab" role="tablist">
          <li className="nav-item" role="presentation">
            <button
              className="nav-link active"
              id="trader-overview-tab"
              data-bs-toggle="pill"
              data-bs-target="#trader-overview"
              type="button"
              role="tab"
            >
              🏠 Tổng quan
            </button>
          </li>

          <li className="nav-item" role="presentation">
            <button
              className="nav-link"
              id="trader-import-tab"
              data-bs-toggle="pill"
              data-bs-target="#trader-import"
              type="button"
              role="tab"
            >
              📥 Yêu cầu nhập hàng
            </button>
          </li>

          <li className="nav-item" role="presentation">
            <button
              className="nav-link"
              id="trader-returns-tab"
              data-bs-toggle="pill"
              data-bs-target="#trader-returns"
              type="button"
              role="tab"
            >
              🔁 Đơn trả hàng
            </button>
          </li>

          <li className="nav-item" role="presentation">
            <button
              className="nav-link"
              id="trader-inventory-tab"
              data-bs-toggle="pill"
              data-bs-target="#trader-inventory"
              type="button"
              role="tab"
            >
              🏪 Tồn kho
            </button>
          </li>

          <li className="nav-item" role="presentation">
            <button
              className="nav-link"
              id="trader-reports-tab"
              data-bs-toggle="pill"
              data-bs-target="#trader-reports"
              type="button"
              role="tab"
            >
              📊 Báo cáo
            </button>
          </li>

          <li className="nav-item" role="presentation">
            <button
              className="nav-link"
              id="trader-profile-tab"
              data-bs-toggle="pill"
              data-bs-target="#trader-profile"
              type="button"
              role="tab"
            >
              👤 Hồ sơ
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default TraderTab;

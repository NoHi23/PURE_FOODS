import React from "react";
import ExporterEditProfile from "./ExporterEditProfile";

const ExporterProfile = ({ user }) => {
  if (!user || user.roleID !== 5) {
    return <div className="text-danger">Vui lòng đăng nhập với tài khoản Exporter.</div>;
  }

  const formatDate = (date) => {
    if (!date) return "trống";
    try {
      const parsedDate = new Date(date);
      if (isNaN(parsedDate)) return "trống";
      return parsedDate.toLocaleString("vi-VN", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
    } catch {
      return "trống";
    }
  };

  return (
    <div className="dashboard-profile">
      <div className="title">
        <h2>Thông tin cá nhân</h2>
        <span className="title-leaf">
          <svg className="icon-width bg-gray">
            <use href="../assets/svg/leaf.svg#leaf"></use>
          </svg>
        </span>
      </div>

      <div className="profile-tab dashboard-bg-box">
        <div className="dashboard-title dashboard-flex">
          <h3>Tên hồ sơ</h3>
          <button
            className="btn btn-sm theme-bg-color text-white"
            data-bs-toggle="modal"
            data-bs-target="#edit-profile"
          >
            Chỉnh sửa
          </button>
        </div>

        <ul>
          <li>
            <h5>Tên công ty :</h5>
            <h5 style={{ color: "green", fontSize: "18px", fontWeight: "bold" }}>PURE_FOODS</h5>
          </li>
          <li>
            <h5>Họ và tên :</h5>
            <h5 style={{ fontSize: "18px", fontWeight: "bold" }}>{user.fullName || "Không xác định"}</h5>
          </li>
          <li>
            <h5>Địa chỉ Email :</h5>
            <h5 style={{ fontSize: "18px", fontWeight: "bold" }}>{user.email || "Không xác định"}</h5>
          </li>
          <li>
            <h5>Số điện thoại :</h5>
            <h5 style={{ fontSize: "18px", fontWeight: "bold" }}>{user.phone || "Không xác định"}</h5>
          </li>
          <li>
            <h5>Địa chỉ :</h5>
            <h5 style={{ fontSize: "18px", fontWeight: "bold" }}>{user.address || "Không xác định"}</h5>
          </li>
          <li>
            <h5>Chức vụ :</h5>
            <h5 style={{ fontSize: "18px", fontWeight: "bold" }}>
              {user.roleID === 5 ? "Người xuất hàng" : "Không xác định"}
            </h5>
          </li>
          <li>
            <h5>Tài khoản được tạo :</h5>
            <h5 style={{ fontSize: "18px", fontWeight: "bold" }}>{formatDate(user.createdAt)}</h5>
          </li>
          <li>
            <h5>Trạng thái :</h5>
            {user.status === 0 && (
              <h5 style={{ color: "green", fontSize: "18px", fontWeight: "bold" }}>Đang hoạt động</h5>
            )}
            {user.status === 1 && (
              <h5 style={{ color: "red", fontSize: "18px", fontWeight: "bold" }}>Bị cấm</h5>
            )}
            {![0, 1].includes(user.status) && (
              <h5 style={{ fontSize: "18px", fontWeight: "bold" }}>Không xác định</h5>
            )}
          </li>
        </ul>
      </div>
      <ExporterEditProfile />
    </div>
  );
};

export default ExporterProfile;
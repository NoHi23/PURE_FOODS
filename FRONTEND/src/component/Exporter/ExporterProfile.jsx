import React from "react";
import ExporterEditProfile from "./ExporterEditProfile";

const ExporterProfile = ({ user }) => {
  console.log("ExporterProfile rendered, user:", user);
  if (!user) return <div>Vui lòng đăng nhập để xem thông tin cá nhân!</div>;

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
          <button className="btn btn-sm theme-bg-color text-white" data-bs-toggle="modal" data-bs-target="#edit-profile" disabled>
            Chỉnh sửa
          </button>
        </div>
        <ul>
          <li><h5>Họ và tên :</h5><h5 style={{ fontSize: "18px", fontWeight: "bold" }}>{user.fullName}</h5></li>
          <li><h5>Địa chỉ Email :</h5><h5 style={{ fontSize: "18px", fontWeight: "bold" }}>{user.email}</h5></li>
          <li><h5>Số điện thoại :</h5><h5 style={{ fontSize: "18px", fontWeight: "bold" }}>{user.phone}</h5></li>
          <li><h5>Địa chỉ :</h5><h5 style={{ fontSize: "18px", fontWeight: "bold" }}>{user.address}</h5></li>
          <li><h5>Chức vụ :</h5><h5 style={{ fontSize: "18px", fontWeight: "bold" }}>Người xuất hàng</h5></li>
          <li><h5>Tài khoản được tạo :</h5><h5 style={{ fontSize: "18px", fontWeight: "bold" }}>{new Date(user.createdAt).toLocaleString("vi-VN")}</h5></li>
          <li><h5>Trạng thái :</h5>{user.status === 0 ? <h5 style={{ color: "green", fontSize: "18px", fontWeight: "bold" }}>Đang hoạt động</h5> : <h5 style={{ color: "red", fontSize: "18px", fontWeight: "bold" }}>Bị cấm</h5>}</li>
        </ul>
      </div>
      <ExporterEditProfile />
    </div>
  );
};

export default ExporterProfile;
import React from "react";
import ImporterEditProfile from "./ImporterEditProfile";

const ImporterProfile = ({ user }) => {
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
            <h5 style={{color:"green", fontSize:"18px", fontWeight:"bold"}}>PURE_FOODS</h5>
          </li>

          <li>
            <h5>Họ và tên :</h5>
            <h5 style={{fontSize:"18px", fontWeight:"bold"}}>{user.fullName}</h5>
          </li>
          <li>
            <h5>Địa chỉ Email :</h5>
            <h5 style={{fontSize:"18px", fontWeight:"bold"}}>{user.email}</h5>
          </li>
          <li>
            <h5>Số điện thoại :</h5>
            <h5 style={{fontSize:"18px", fontWeight:"bold"}}>{user.phone}</h5>
          </li>
          <li>
            <h5>Địa chỉ :</h5>
            <h5 style={{fontSize:"18px", fontWeight:"bold"}}>{user.address}</h5>
          </li>
          <li>
            <h5>Chức vụ :</h5>
            <h5 style={{fontSize:"18px", fontWeight:"bold"}}>
              {{
                1: "Admin",
                2: "Khách hàng",
                3: "Người buôn hàng (Nhà cung cấp)",
                4: "Người nhập hàng (Làm việc tại kho hàng)",
                5: "Người xuất hàng",
                6: "Người vận chuyển",
              }[user.roleID] || "Không xác định"}
            </h5>
          </li>
          <li>
            <h5>Tài khoản được tạo :</h5>
            <h5 style={{fontSize:"18px", fontWeight:"bold"}}>
              {user.createdAt
                ? new Date(
                    user.createdAt.toString().length === 10 ? user.createdAt * 1000 : user.createdAt
                  ).toLocaleString("vi-VN", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                  })
                : "trống"}
            </h5>
          </li>
          <li>
            <h5>Trạng thái :</h5>
            {user.status === 0 && <h5 style={{ color: "green", fontSize:"18px", fontWeight:"bold" }}>Đang hoạt động</h5>}
            {user.status === 1 && <h5 style={{ color: "red", fontSize:"18px", fontWeight:"bold" }}>Bị cấm</h5>}
            {![0, 1].includes(user.status) && <h5 style={{ fontSize:"18px", fontWeight:"bold" }}>Không xác định</h5>}
          </li>
          <li>
            <h5>Lần đổi mật khẩu gần nhất :</h5>
            <h5 style={{ color: "orange", fontSize:"18px", fontWeight:"bold" }}>
              {user.tokenExpiry
                ? new Date(
                    user.tokenExpiry.toString().length === 10 ? user.tokenExpiry * 1000 : user.tokenExpiry
                  ).toLocaleString("vi-VN", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                  })
                : "trống"}
            </h5>
          </li>
        </ul>
      </div>
      <ImporterEditProfile />
    </div>
  );
};

export default ImporterProfile;

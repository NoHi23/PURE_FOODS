import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const TraderEditProfile = () => {
  const storedUser = JSON.parse(localStorage.getItem("user"));

  const [formData, setFormData] = useState({
    userId: storedUser?.userId || 0,
    fullName: storedUser?.fullName || "",
    email: storedUser?.email || "",
    phone: storedUser?.phone || "",
    address: storedUser?.address || "",
  });

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordVerified, setPasswordVerified] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleVerifyOldPassword = async () => {
    try {
      const res = await axios.post("http://localhost:8082/PureFoods/api/users/verify-password", {
        userId: formData.userId,
        password: oldPassword,
      });
      if (res.data.verified) {
        setPasswordVerified(true);
        setMessage("✅ Mật khẩu cũ chính xác. Nhập mật khẩu mới bên dưới.");
      } else {
        setMessage("❌ Mật khẩu cũ không đúng.");
      }
    } catch (err) {
      setMessage("❌ Xác thực thất bại.");
    }
  };

  const handleSave = async () => {
    try {
      let finalData = { ...formData };
      // Nếu người dùng không điền gì vào ô mật khẩu, thì ta giữ lại mật khẩu cũ từ localStorage (thay vì gửi null hoặc chuỗi rỗng làm hỏng backend)
      if (!formData.password || formData.password.trim() === "") {
        finalData.password = storedUser.password;
      }
      const res = await axios.put("http://localhost:8082/PureFoods/api/users/profile/update", finalData);
      const updatedUser = res.data.user;
      // Update lại localStorage để phản ánh sự thay đổi
      localStorage.setItem("user", JSON.stringify(updatedUser));
      
      let timerInterval;
      Swal.fire({
        title: "✅ Cập nhật thành công!",
        text: "Thông tin đã được lưu.",
        icon: "success",
        timer: 3000,
        showConfirmButton: true,
        confirmButtonText: "OK",
        didOpen: () => {
          timerInterval = setTimeout(() => {
            window.location.reload();
          }, 3000);
        },
        willClose: () => {
          clearTimeout(timerInterval);
          window.location.reload();
        },
      });
    } catch (err) {
      Swal.fire({
        title: "❌ Cập nhật thất bại",
        text: err.response?.data?.message || err.message,
        icon: "error",
        confirmButtonText: "Thử lại",
      });
    }
  };

  return (
    <div className="modal fade theme-modal" id="edit-profile" tabIndex="-1">
      <div className="modal-dialog modal-dialog-centered modal-fullscreen-sm-down">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Chỉnh sửa thông tin cá nhân</h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal">
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>
          <div className="modal-body">
            <div className="row g-4">
              {/* Các field cũ */}
              <div className="col-xxl-12">
                <div className="form-floating theme-form-floating">
                  <input
                    type="text"
                    className="form-control"
                    id="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                  />
                  <label htmlFor="fullName">Họ và tên</label>
                </div>
              </div>
              <div className="col-xxl-6">
                <div className="form-floating theme-form-floating">
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                  <label htmlFor="email">Email</label>
                </div>
              </div>
              <div className="col-xxl-6">
                <div className="form-floating theme-form-floating">
                  <input
                    type="tel"
                    className="form-control"
                    id="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    maxLength="10"
                  />
                  <label htmlFor="phone">Số điện thoại</label>
                </div>
              </div>
              <div className="col-12">
                <div className="form-floating theme-form-floating">
                  <input
                    type="text"
                    className="form-control"
                    id="address"
                    value={formData.address}
                    onChange={handleChange}
                  />
                  <label htmlFor="address">Địa chỉ</label>
                </div>
              </div>

              {/* Xác thực mật khẩu cũ */}
              {!passwordVerified && (
                <>
                  <div className="col-12">
                    <div className="form-floating theme-form-floating">
                      <input
                        type="password"
                        className="form-control"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                        placeholder="Nhập mật khẩu cũ"
                      />
                      <label>Nhập mật khẩu cũ</label>
                    </div>
                  </div>
                  <div className="col-12">
                    <button className="btn btn-primary btn-sm" type="button" onClick={handleVerifyOldPassword}>
                      Xác thực mật khẩu cũ
                    </button>
                  </div>
                </>
              )}

              {/* Nhập mật khẩu mới nếu đã xác thực */}
              {passwordVerified && (
                <>
                  <div className="col-12">
                    <div className="form-floating theme-form-floating">
                      <input
                        type="password"
                        className="form-control"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Mật khẩu mới"
                      />
                      <label>Mật khẩu mới</label>
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="form-floating theme-form-floating">
                      <input
                        type="password"
                        className="form-control"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Xác nhận mật khẩu"
                      />
                      <label>Xác nhận mật khẩu mới</label>
                    </div>
                  </div>
                </>
              )}

              {/* Hiện thông báo nếu có */}
              {message && (
                <div className="col-12">
                  <div className="alert alert-info">{message}</div>
                </div>
              )}
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-animation btn-md fw-bold" data-bs-dismiss="modal">
              Huỷ bỏ
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="btn theme-bg-color btn-md fw-bold text-light"
              data-bs-dismiss="modal"
            >
              Lưu thay đổi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TraderEditProfile;

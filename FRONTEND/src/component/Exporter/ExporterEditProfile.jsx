import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const ExporterEditProfile = () => {
  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");

  const [formData, setFormData] = useState({
    userId: storedUser.userId || 0,
    fullName: storedUser.fullName || "",
    email: storedUser.email || "",
    phone: storedUser.phone || "",
    address: storedUser.address || "",
  });
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordVerified, setPasswordVerified] = useState(false);
  const [message, setMessage] = useState("");

  if (!storedUser || storedUser.roleID !== 5) {
    return <div className="text-danger">Vui lòng đăng nhập với tài khoản Exporter.</div>;
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleVerifyOldPassword = async () => {
    if (!oldPassword) {
      setMessage("Vui lòng nhập mật khẩu cũ.");
      return;
    }
    try {
      const res = await axios.post(
        "http://localhost:8082/PureFoods/api/users/verify-password",
        { userId: formData.userId, password: oldPassword },
        { headers: { Authorization: `Bearer ${storedUser.token}` } }
      );
      if (res.data.status === 200 && res.data.verified) {
        setPasswordVerified(true);
        setMessage("✅ Mật khẩu cũ chính xác. Nhập mật khẩu mới bên dưới.");
      } else {
        setMessage("❌ Mật khẩu cũ không đúng.");
      }
    } catch (err) {
      setMessage("❌ Xác thực thất bại: " + (err.response?.data?.message || err.message));
    }
  };

  const handleSave = async () => {
    if (passwordVerified && newPassword !== confirmPassword) {
      Swal.fire({
        title: "Lỗi",
        text: "Mật khẩu mới và xác nhận mật khẩu không khớp.",
        icon: "error",
        confirmButtonText: "Thử lại",
      });
      return;
    }

    try {
      const finalData = { ...formData };
      if (passwordVerified && newPassword) {
        finalData.password = newPassword;
      }
      const res = await axios.put(
        "http://localhost:8082/PureFoods/api/users/profile/update",
        finalData,
        { headers: { Authorization: `Bearer ${storedUser.token}` } }
      );
      if (res.data.status === 200) {
        const updatedUser = res.data.user;
        localStorage.setItem("user", JSON.stringify(updatedUser));
        Swal.fire({
          title: "Cập nhật thành công!",
          text: "Thông tin đã được lưu.",
          icon: "success",
          confirmButtonText: "OK",
        }).then(() => window.location.reload());
      } else {
        Swal.fire({
          title: "Cập nhật thất bại",
          text: res.data.message || "Có lỗi xảy ra khi cập nhật.",
          icon: "error",
          confirmButtonText: "Thử lại",
        });
      }
    } catch (err) {
      Swal.fire({
        title: "Cập nhật thất bại",
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
              <div className="col-12">
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
              <div className="col-12">
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
              <div className="col-12">
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
                    <button
                      className="btn btn-primary btn-sm"
                      type="button"
                      onClick={handleVerifyOldPassword}
                    >
                      Xác thực mật khẩu cũ
                    </button>
                  </div>
                </>
              )}

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

              {message && (
                <div className="col-12">
                  <div className="alert alert-info">{message}</div>
                </div>
              )}
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-animation btn-md fw-bold" data-bs-dismiss="modal">
              Hủy bỏ
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="btn theme-bg-color btn-md fw-bold text-light"
            >
              Lưu thay đổi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExporterEditProfile;
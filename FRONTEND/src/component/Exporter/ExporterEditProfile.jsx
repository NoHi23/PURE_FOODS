// ExporterEditProfile.jsx (No changes needed)
import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

const ExporterEditProfile = () => {
  const storedUser = JSON.parse(localStorage.getItem("user")) || {};
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
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleVerifyOldPassword = async () => {
    if (!oldPassword) {
      setMessage("❌ Vui lòng nhập mật khẩu cũ.");
      return;
    }
    setIsLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:8082/PureFoods/api/users/verify-password",
        {
          userId: formData.userId,
          password: oldPassword,
        },
        { timeout: 5000 }
      );
      if (res.data.verified) {
        setPasswordVerified(true);
        setMessage("✅ Mật khẩu cũ chính xác. Nhập mật khẩu mới bên dưới.");
      } else {
        setMessage("❌ Mật khẩu cũ không đúng.");
      }
    } catch (err) {
      setMessage("❌ Xác thực thất bại.");
      toast.error(
        err.response?.data?.message || "Lỗi khi xác thực mật khẩu! Kiểm tra kết nối mạng."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (passwordVerified && newPassword !== confirmPassword) {
      setMessage("❌ Mật khẩu mới và xác nhận mật khẩu không khớp.");
      return;
    }
    if (!formData.fullName || !formData.email) {
      setMessage("❌ Vui lòng điền đầy đủ họ tên và email.");
      return;
    }

    setIsLoading(true);
    try {
      const finalData = { ...formData, password: newPassword || undefined };
      const res = await axios.put(
        "http://localhost:8082/PureFoods/api/users/profile/update",
        finalData,
        { timeout: 5000 }
      );
      const updatedUser = res.data.user;
      localStorage.setItem("user", JSON.stringify(updatedUser));
      Swal.fire({
        icon: "success",
        title: "✅ Cập nhật thành công!",
        text: "Thông tin đã được lưu.",
        timer: 3000,
        showConfirmButton: true,
        confirmButtonText: "OK",
      }).then(() => window.location.reload());
    } catch (err) {
      Swal.fire({
        title: "❌ Cập nhật thất bại",
        text: err.response?.data?.message || "Lỗi mạng hoặc server.",
        icon: "error",
        confirmButtonText: "Thử lại",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="modal fade theme-modal" id="edit-profile" tabIndex="-1">
      <div className="modal-dialog modal-dialog-centered modal-fullscreen-sm-down">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Chỉnh sửa thông tin cá nhân</h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              disabled={isLoading}
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>
          <div className="modal-body">
            {isLoading && (
              <div className="text-center">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Đang tải...</span>
                </div>
              </div>
            )}
            <div className="row g-4">
              <div className="col-xxl-12">
                <div className="form-floating theme-form-floating">
                  <input
                    type="text"
                    className="form-control"
                    id="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    disabled={isLoading}
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
                    disabled={isLoading}
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
                    disabled={isLoading}
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
                    disabled={isLoading}
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
                        disabled={isLoading}
                      />
                      <label>Nhập mật khẩu cũ</label>
                    </div>
                  </div>
                  <div className="col-12">
                    <button
                      className="btn btn-primary btn-sm"
                      type="button"
                      onClick={handleVerifyOldPassword}
                      disabled={isLoading}
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
                        disabled={isLoading}
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
                        disabled={isLoading}
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
            <button
              type="button"
              className="btn btn-animation btn-md fw-bold"
              data-bs-dismiss="modal"
              disabled={isLoading}
            >
              Hủy bỏ
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="btn theme-bg-color btn-md fw-bold text-light"
              disabled={isLoading}
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
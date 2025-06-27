import React, { useState } from "react";
import axios from "axios";

const ImporterEditProfile = () => {
  const storedUser = JSON.parse(localStorage.getItem("user"));

  const [formData, setFormData] = useState({
    userId: storedUser?.userId || 0,
    fullName: storedUser?.fullName || "",
    email: storedUser?.email || "",
    phone: storedUser?.phone || "",
    address: storedUser?.address || "",
    password: storedUser?.password || "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const res = await axios.put("http://localhost:8082/PureFoods/api/users/profile/update", formData);
      const updatedUser = res.data.user;

      // Update lại localStorage để phản ánh sự thay đổi
      localStorage.setItem("user", JSON.stringify(updatedUser));
      window.location.reload();
    } catch (err) {
      alert("Cập nhật thất bại: " + err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="modal fade theme-modal" id="edit-profile" tabIndex="-1">
      <div className="modal-dialog modal-dialog-centered modal-fullscreen-sm-down">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="exampleModalLabel3">
              Chỉnh sửa thông tin cá nhân
            </h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal">
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>
          <div className="modal-body">
            <div className="row g-4">
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
              <div className="col-12">
                <div className="form-floating theme-form-floating">
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <label htmlFor="password">Mật khẩu</label>
                </div>
              </div>
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

export default ImporterEditProfile;
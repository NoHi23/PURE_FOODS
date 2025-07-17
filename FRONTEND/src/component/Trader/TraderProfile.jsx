import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const TraderProfile = ({ user }) => {
  const [formData, setFormData] = useState({ ...user });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleUpdate = async () => {
    try {
      const res = await axios.put("http://localhost:8082/PureFoods/api/users/profile/update", formData);
      const updatedUser = res.data.user;

      localStorage.setItem("user", JSON.stringify(updatedUser));
      toast.success("Cập nhật thành công!");
      window.location.reload();
    } catch (err) {
      toast.error("Cập nhật thất bại");
    }
  };

  return (
    <div>
      <h4 className="mb-4">👤 Hồ sơ cá nhân</h4>
      <div className="row g-3">
        <div className="col-md-6">
          <label>Họ và tên</label>
          <input id="fullName" value={formData.fullName} onChange={handleChange} className="form-control" />
        </div>
        <div className="col-md-6">
          <label>Email</label>
          <input id="email" value={formData.email} onChange={handleChange} className="form-control" />
        </div>
        <div className="col-md-6">
          <label>Số điện thoại</label>
          <input id="phone" value={formData.phone} onChange={handleChange} className="form-control" />
        </div>
        <div className="col-md-6">
          <label>Địa chỉ</label>
          <input id="address" value={formData.address} onChange={handleChange} className="form-control" />
        </div>
        <div className="col-md-6">
          <label>Mật khẩu</label>
          <input type="password" id="password" value={formData.password} onChange={handleChange} className="form-control" />
        </div>
        <div className="col-12">
          <button onClick={handleUpdate} className="btn btn-primary mt-3">
            💾 Lưu thay đổi
          </button>
        </div>
      </div>
    </div>
  );
};

export default TraderProfile;

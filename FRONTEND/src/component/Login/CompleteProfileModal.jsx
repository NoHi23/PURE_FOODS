import React, { useState } from "react";
import axios from "axios";
import "./modal.css"; // tuỳ bạn muốn style

const CompleteProfileModal = ({ onClose }) => {
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem("user"));
    try {
      const res = await axios.put("http://localhost:8082/PureFoods/api/users/update-profile", {
        userId: user.userId,
        phone,
        address,
        email: user.email,
        fullName: user.fullName,
        password: user.password
      });
      user.phone = phone;
      user.address = address;
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.removeItem("needUpdateInfo");
      onClose();
    } catch (err) {
      alert("Cập nhật thất bại!");
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-box">
        <h4>Bổ sung thông tin tài khoản</h4>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Số điện thoại"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Địa chỉ"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
          <button type="submit" className="btn btn-primary">Cập nhật</button>
          <button type="button" className="btn btn-secondary" onClick={onClose}>Đóng</button>
        </form>
      </div>
    </div>
  );
};

export default CompleteProfileModal;

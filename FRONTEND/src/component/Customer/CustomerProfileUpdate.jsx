import React, { useEffect, useState } from "react";
import axios from "axios";
import './CustomerProfileUpdate.css';
import { useNavigate } from "react-router-dom";
import CartLayout from "../../layouts/CartLayout";
import { FiEye, FiEyeOff } from "react-icons/fi";

const CustomerProfileUpdate = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("user"));
    if (!currentUser) {
      navigate("/login");
    } else {
      setUser({
        userId: currentUser.userId,
        fullName: currentUser.fullName || "",
        email: currentUser.email || "",
        password: currentUser.password || "",
        phone: currentUser.phone || "",
        address: currentUser.address || "",
      });
    }
  }, [navigate]);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put("http://localhost:8082/PureFoods/api/users/profile/update", user);
      setMessage("✅ Cập nhật thông tin thành công!");
      localStorage.setItem("user", JSON.stringify(res.data.user));
    } catch (err) {
      setMessage("❌ Cập nhật thất bại. Vui lòng thử lại.");
    }
  };

  if (!user) return null;

  return (
    <CartLayout>
      <section className="user-dashboard-section section-b-space">
        <div className="container d-flex justify-content-center">
          <div className="profile-form-wrapper col-12 col-md-10 col-lg-8 col-xl-6">
            <div className="dashboard-right-sidebar">
              <div className="title text-center">
                <h2>Chỉnh sửa hồ sơ khách hàng</h2>
              </div>

              {message && <div className="alert alert-info mt-3">{message}</div>}

              <form onSubmit={handleSubmit} className="row g-4 mt-2">
                <div className="col-12">
                  <div className="form-floating theme-form-floating">
                    <input
                      type="text"
                      className="form-control"
                      name="fullName"
                      value={user.fullName}
                      onChange={handleChange}
                      required
                    />
                    <label>Họ và tên</label>
                  </div>
                </div>

                <div className="col-12">
                  <div className="form-floating theme-form-floating">
                    <input
                      type="email"
                      className="form-control"
                      name="email"
                      value={user.email}
                      onChange={handleChange}
                      required
                    />
                    <label>Email</label>
                  </div>
                </div>

                <div className="col-12">
                  <div className="form-floating theme-form-floating position-relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      className="form-control"
                      name="password"
                      value={user.password}
                      onChange={handleChange}
                      required
                    />
                    <label>Mật khẩu</label>
                    <span
                      className="password-toggle"
                      onClick={togglePasswordVisibility}
                    >
                      {showPassword ? <FiEyeOff /> : <FiEye />}
                    </span>
                  </div>
                </div>

                <div className="col-12">
                  <div className="form-floating theme-form-floating">
                    <input
                      type="text"
                      className="form-control"
                      name="phone"
                      value={user.phone}
                      onChange={handleChange}
                    />
                    <label>Số điện thoại</label>
                  </div>
                </div>

                <div className="col-12">
                  <div className="form-floating theme-form-floating">
                    <input
                      type="text"
                      className="form-control"
                      name="address"
                      value={user.address}
                      onChange={handleChange}
                    />
                    <label>Địa chỉ</label>
                  </div>
                </div>

                <div className="col-12 text-center">
                  <button type="submit" className="btn theme-bg-color btn-md fw-bold text-light">
                    Lưu thay đổi
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </CartLayout>
  );
};

export default CustomerProfileUpdate;

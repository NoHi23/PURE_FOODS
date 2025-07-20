import React, { useEffect, useState } from "react";
import axios from "axios";
import './CustomerProfileUpdate.css';
import { useNavigate } from "react-router-dom";
import CartLayout from "../../layouts/CartLayout";
import { FiEye, FiEyeOff } from "react-icons/fi";

const CustomerProfileUpdate = () => {

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordVerified, setPasswordVerified] = useState(false); // đã xác thực mật khẩu cũ

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

  const handleVerifyOldPassword = async () => {
    try {
      const res = await axios.post("http://localhost:8082/PureFoods/api/users/verify-password", {
        userId: user.userId,
        password: oldPassword,
      });
      if (res.data.verified) {
        setPasswordVerified(true);
        setMessage("✅ Mật khẩu cũ chính xác. Vui lòng nhập mật khẩu mới.");
      } else {
        setMessage("❌ Mật khẩu cũ không đúng.");
      }
    } catch (err) {
      setMessage("❌ Xác thực mật khẩu thất bại. Thử lại sau.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Kiểm tra các trường không được để trống
    if (!user.fullName || !user.email || !user.phone || !user.address || !newPassword || !confirmPassword) {
      setMessage("❌ Vui lòng điền đầy đủ tất cả các trường.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage("❌ Mật khẩu mới và xác nhận không khớp.");
      return;
    }

    try {
      const updatedData = {
        ...user,
        password: newPassword
      };
      const res = await axios.put("http://localhost:8082/PureFoods/api/users/profile/update", updatedData);
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


                {!passwordVerified ? (
                  <>
                    <div className="col-12">
                      <div className="form-floating theme-form-floating position-relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          className="form-control"
                          name="oldPassword"
                          value={oldPassword}
                          onChange={(e) => setOldPassword(e.target.value)}
                          required
                        />
                        <label>Nhập mật khẩu cũ</label>
                        <span
                          className="password-toggle"
                          onClick={togglePasswordVisibility}
                        >
                          {showPassword ? <FiEyeOff /> : <FiEye />}
                        </span>
                      </div>
                    </div>
                    <div className="col-12 text-center">
                      <button
                        type="button"
                        className="btn btn-outline-primary btn-sm"
                        onClick={handleVerifyOldPassword}
                      >
                        Xác thực mật khẩu cũ
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="col-12">
                      <div className="form-floating theme-form-floating position-relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          className="form-control"
                          name="newPassword"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          required
                        />
                        <label>Mật khẩu mới</label>
                        <span
                          className="password-toggle"
                          onClick={togglePasswordVisibility}
                        >
                          {showPassword ? <FiEyeOff /> : <FiEye />}
                        </span>
                      </div>
                    </div>

                    <div className="col-12">
                      <div className="form-floating theme-form-floating position-relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          className="form-control"
                          name="confirmPassword"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          required
                        />
                        <label>Xác nhận mật khẩu mới</label>
                        <span
                          className="password-toggle"
                          onClick={togglePasswordVisibility}
                        >
                          {showPassword ? <FiEyeOff /> : <FiEye />}
                        </span>
                      </div>
                    </div>
                  </>
                )}


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

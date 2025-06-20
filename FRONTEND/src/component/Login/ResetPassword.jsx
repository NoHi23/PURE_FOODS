import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const ResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const token = location.state?.token || '';
  const email = location.state?.email || '';

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');

  const handleReset = async (e) => {
    e.preventDefault();
    if (password !== confirm) {
      toast.warning("Mật khẩu xác nhận không khớp.");
      return;
    }

    try {
      const res = await axios.post("http://localhost:8082/PureFoods/api/users/reset-password", {
        token,
        newPassword: password,
      });

      if (res.data.status === 200) {
        toast.success("Đặt lại mật khẩu thành công!");
        navigate('/login');
      } else {
        toast.error("Mã xác thực không hợp lệ hoặc đã hết hạn.");
      }
    } catch (err) {
      toast.error("Có lỗi khi đặt lại mật khẩu.");
    }
  };

  return (
    <section className="log-in-section section-b-space">
      <a href="#" className="logo-login">
        <img src="assets/images/logo/1.png" className="img-fluid" alt="logo" />
      </a>
      <div className="container w-100">
        <div className="row">
          <div className="col-xl-5 col-lg-6 me-auto">
            <div className="log-in-box">
              <div className="log-in-title">
                <h3 className="text-content">Reset Your Password</h3>
                <h5 className="text-content">
                  Email: <span>{email}</span>
                </h5>
              </div>

              <form className="row g-4" onSubmit={handleReset}>
                <div className="col-12">
                  <div className="form-floating theme-form-floating log-in-form">
                    <input
                      type="password"
                      className="form-control"
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="New Password"
                      required
                    />
                    <label htmlFor="password">New Password</label>
                  </div>
                </div>

                <div className="col-12">
                  <div className="form-floating theme-form-floating log-in-form">
                    <input
                      type="password"
                      className="form-control"
                      id="confirm"
                      value={confirm}
                      onChange={(e) => setConfirm(e.target.value)}
                      placeholder="Confirm Password"
                      required
                    />
                    <label htmlFor="confirm">Confirm Password</label>
                  </div>
                </div>

                <div className="col-12">
                  <button type="submit" className="btn btn-animation w-100 justify-content-center">
                    Reset Password
                  </button>
                </div>
              </form>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ResetPassword;

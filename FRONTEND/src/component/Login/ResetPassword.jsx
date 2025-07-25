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
      const errorMessage =
        err.response && err.response.data && err.response.data.message
          ? err.response.data.message
          : "ERROR";
      toast.error(errorMessage);
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
                <h3 className="text-content">Đặt lại mật khẩu của bạn</h3>
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
                      placeholder="Mật khẩu mới"
                      required
                    />
                    <label htmlFor="password">Mật khẩu mới</label>
                  </div>
                </div>

                <div className="col-12">
                  <div className="form-floating theme-form-floating log-in-form">
                    <input
                      type="password"
                      className={`form-control ${confirm
                        ? confirm === password
                          ? "is-valid"
                          : "is-invalid"
                        : ""
                        }`}
                      name="confirm"
                      id="confirm"
                      value={confirm}
                      onChange={(e) => setConfirm(e.target.value)}
                      placeholder="Xác nhận mật khẩu"
                      required
                    />
                    {confirm && confirm !== password && (
                      <p className="text-danger mt-1">Mật khẩu xác nhận không khớp</p>
                    )}
                    {confirm && confirm === password && (
                      <p className="text-success mt-1">Mật khẩu xác nhận trùng khớp</p>
                    )}
                    <label htmlFor="confirm">Xác nhận mật khẩu</label>
                  </div>
                </div>

                <div className="col-12">
                  <button type="submit" className="btn btn-animation w-100 justify-content-center">
                    Đặt lại mật khẩu
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

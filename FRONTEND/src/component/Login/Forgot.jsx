import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Forgot = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate()
  const handleForgotPassword = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:8082/PureFoods/api/users/forgot-password", {
        email: email
      });

      if (res.data.status === 200) {
        toast.success(" Mã đặt lại mật khẩu đã được gửi đến email của bạn.");
        navigate('/verify-otp', { state: { email: email } });

      } else {
        toast.error("Gửi thất bại: " + res.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.warn(" Đã xảy ra lỗi khi gửi email.");
    }
  };


  return (
    <div>
      <section class="log-in-section section-b-space">
        <a href="" class="logo-login"><img src="assets/images/logo/1.png" class="img-fluid" /></a>
        <div class="container w-100">
          <div class="row">

            <div class="col-xl-5 col-lg-6 me-auto">
              <div class="log-in-box">
                <div class="log-in-title">
                  <h3>Welcome To Pure Food</h3>
                  <h4>Log In Your Account</h4>
                </div>

                <div class="input-box">
                  <form class="row g-4" onSubmit={handleForgotPassword}>
                    <div class="col-12">
                      <div class="form-floating theme-form-floating log-in-form">
                        <input type="email" class="form-control" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="Email Address" />
                        <label for="email">Email Address</label>
                      </div>
                    </div>

                    <div class="col-12">
                      <button type="submit" class="btn btn-animation w-100 justify-content-center">Send
                        link</button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Forgot

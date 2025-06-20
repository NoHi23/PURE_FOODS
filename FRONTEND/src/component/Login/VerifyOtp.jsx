import React, { useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

const OtpVerify = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const initialEmail = location.state?.email || '';
  const [email, setEmail] = useState(initialEmail);
  const [otp, setOtp] = useState(new Array(6).fill(''));
  const inputRefs = useRef([]);
  const [isDeleting, setIsDeleting] = useState(false);

  const maskEmail = (email) => {
    const [name, domain] = email.split('@');
    const maskedName = name.length <= 3
      ? '*'.repeat(name.length)
      : '*'.repeat(name.length - 3) + name.slice(-3);
    return maskedName + '@' + domain;
  };

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (!/^[0-9]?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (!isDeleting && value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    setIsDeleting(false);
  };


  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace') {
      if (otp[index] === '') {
        if (index > 0) {
          inputRefs.current[index - 1]?.focus();
        }
      } else {
        const newOtp = [...otp];
        newOtp[index] = '';
        setOtp(newOtp);
      }
      setIsDeleting(true);
    } else {
      setIsDeleting(false);
    }
  }

  const handleSubmit = async () => {
    const token = otp.join('');
    if (token.length !== 6) {
      toast.warn("Mã OTP phải đủ 6 chữ số!");
      return;
    }

    try {
      const res = await axios.post("http://localhost:8082/PureFoods/api/users/verify-otp", {
        token: token
      });

      if (res.data.status === 200) {
        toast.success("Mã OTP hợp lệ!");
        navigate('/reset-password', { state: { token, email } });
      } else {
        toast.error("Mã OTP không đúng hoặc hết hạn!");
      }
    } catch (err) {
      toast.error("Mã OTP không đúng hoặc hết hạn!");
    }
  };

  const handleResend = async () => {
    try {
      const res = await axios.post("http://localhost:8082/PureFoods/api/users/forgot-password", {
        email: email
      });

      if (res.data.status === 200) {
        toast.success("Đã gửi lại mã xác nhận đến email.");
      } else {
        toast.error("Gửi lại thất bại: " + res.data.message);
      }
    } catch (err) {
      toast.error("Lỗi khi gửi lại mã xác nhận.");
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
                <h3 className="text-content">
                  Please enter the one time password to verify your account
                </h3>
                <h5 className="text-content">
                  A code has been sent to <span>{maskEmail(email)}</span>
                </h5>
              </div>

              <div
                id="otp"
                className="row d-flex row-cols-6 g-2 flex-row justify-content-center"
              >
                {otp.map((value, index) => (
                  <div key={index}>
                    <input
                      ref={(el) => (inputRefs.current[index] = el)}
                      className="text-center form-control rounded"
                      type="text"
                      maxLength="1"
                      value={value}
                      onChange={(e) => handleChange(e, index)}
                      onKeyDown={(e) => handleKeyDown(e, index)}

                    />
                  </div>
                ))}
              </div>

              <div className="send-box pt-4">
                <h5>
                  Didn't get the code?{' '}
                  <a href="" className="theme-color fw-bold" onClick={(e) => { e.preventDefault(); handleResend() }}>
                    Resend It
                  </a>
                </h5>
              </div>

              <button
                className="btn btn-animation w-100 mt-3"
                type="button"
                onClick={handleSubmit}
              >
                Validate
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OtpVerify;

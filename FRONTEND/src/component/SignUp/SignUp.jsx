import axios from 'axios';
import React, { useState } from 'react'

const SignUp = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    phone: '',
    address: ''
  });
  const [agree, setAgree] = useState(false);

  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
     if (!agree) {
      alert("Bạn phải chấp nhận điều khoản và chính sách bảo mật.");
      return;
    }

    try {
      const res = await axios.post('http://localhost:8082/PureFoods/api/users/register', formData);
      setMessage(res.data.message || "Đăng ký thành công!");
    } catch (error) {
      setMessage(error.response?.data?.message || "Đăng ký thất bại!");
    }
  };
  return (
    <div>
      <section className="log-in-section section-b-space">
        <a href="" className="logo-login">
          <img src="assets/images/logo/1.png" className="img-fluid" alt="logo" />
        </a>
        <div className="container w-100">
          <div className="row">
            <div className="col-xl-5 col-lg-6 me-auto">
              <div className="log-in-box">
                <div className="log-in-title">
                  <h3>Welcome To Fastkart</h3>
                  <h4>Sign Up Your Account</h4>
                </div>

                <div className="input-box">
                  <form className="row g-4" onSubmit={handleSubmit}>
                    <div className="col-12">
                      <div className="form-floating theme-form-floating log-in-form">
                        <input
                          type="text"
                          name="fullName"
                          className="form-control"
                          placeholder="Full Name"
                          onChange={handleChange}
                        />
                        <label>Full Name</label>
                      </div>
                    </div>

                    <div className="col-12">
                      <div className="form-floating theme-form-floating log-in-form">
                        <input
                          type="email"
                          name="email"
                          className="form-control"
                          placeholder="Email Address"
                          onChange={handleChange}
                        />
                        <label>Email Address</label>
                      </div>
                    </div>

                    <div className="col-12">
                      <div className="form-floating theme-form-floating log-in-form">
                        <input
                          type="password"
                          name="password"
                          className="form-control"
                          placeholder="Password"
                          onChange={handleChange}
                        />
                        <label>Password</label>
                      </div>
                    </div>

                    <div className="col-12">
                      <div className="form-floating theme-form-floating log-in-form">
                        <input
                          type="text"
                          name="phone"
                          className="form-control"
                          placeholder="Phone"
                          onChange={handleChange}
                        />
                        <label>Phone</label>
                      </div>
                    </div>

                    <div className="col-12">
                      <div className="form-floating theme-form-floating log-in-form">
                        <input
                          type="text"
                          name="address"
                          className="form-control"
                          placeholder="Address"
                          onChange={handleChange}
                        />
                        <label>Address</label>
                      </div>
                    </div>

                    <div className="col-12">
                    <div className="form-check ps-0 m-0 remember-box">
                      <input
                        className="checkbox_animated check-box"
                        type="checkbox"
                        id="terms"
                        checked={agree}
                        onChange={(e) => setAgree(e.target.checked)}
                      />
                      <label className="form-check-label" htmlFor="terms">
                        I accept the terms and privacy policy.
                      </label>
                    </div>
                  </div>

                    <div className="col-12">
                      <button type="submit" className="btn btn-animation w-100 justify-content-center">
                        Sign Up
                      </button>
                      <h5 className="new-page mt-3 text-center">
                        Already have an account? <a href="/login">Sign In</a>
                      </h5>
                    </div>
                  </form>
                  {message && <p className="text-center mt-3">{message}</p>}
                </div>

                <div className="other-log-in"><h6>or</h6></div>

                <div className="log-in-button">
                  <ul>
                    <li>
                      <a href="https://www.google.com/" className="btn google-button w-100">
                        <img src="../assets/images/inner-page/google.png" alt="" /> Sign up with Google
                      </a>
                    </li>
                    <li>
                      <a href="https://www.facebook.com/" className="btn google-button w-100">
                        <img src="../assets/images/inner-page/facebook.png" alt="" /> Sign up with Facebook
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default SignUp

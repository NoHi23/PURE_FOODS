import React, { useState } from 'react'
import axios from 'axios';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const navigate = useNavigate();
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:8082/PureFoods/api/users/login', {
        email,
        password
      }, { withCredentials: true });

      const { message, user, status } = response.data;

      if (status === 200) {
        alert(message);

        if (remember) {
          Cookies.set('user', JSON.stringify(user), { expires: 1 / 144 }); // expires sau 10 phút
        } else {
          Cookies.remove('user');
        }

        // window.location.href = '/';
        if (user.roleID === 0) {
          navigate("/admin");
        } else if (user.roleID === 1) {
          navigate("/customer");
        } else if (user.roleID === 2) {
          navigate("/wholesaler");
        } else if (user.roleID === 3) {
          navigate("/importer");
        } else if (user.roleID === 4) {
          navigate("/exporter");
        } else {
          alert("Unknown role!");
        }

      } else {
        alert(message);
      }
    } catch (err) {
      alert("Đăng nhập thất bại!");
    }
  };

  return (
    <>
      <section className="log-in-section section-b-space">
        <a href="" className="logo-login"><img src="assets/images/logo/1.png" className="img-fluid" alt="Logo" /></a>
        <div className="container w-100">
          <div className="row">
            <div className="col-xl-5 col-lg-6 me-auto">
              <div className="log-in-box">
                <div className="log-in-title">
                  <h3>Welcome To Fastkart</h3>
                  <h4>Log In Your Account</h4>
                </div>
                <div className="input-box">
                  <form className="row g-4" onSubmit={handleLogin}>
                    <div className="col-12">
                      <div className="form-floating theme-form-floating log-in-form">
                        <input type="email" className="form-control" id="email" placeholder="Email Address"
                          value={email} onChange={(e) => setEmail(e.target.value)} required />
                        <label htmlFor="email">Email Address</label>
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="form-floating theme-form-floating log-in-form">
                        <input type="password" className="form-control" id="password" placeholder="Password"
                          value={password} onChange={(e) => setPassword(e.target.value)} required />
                        <label htmlFor="password">Password</label>
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="forgot-box">
                        <div className="form-check ps-0 m-0 remember-box">
                          <input className="checkbox_animated check-box" type="checkbox"
                            id="flexCheckDefault" checked={remember}
                            onChange={(e) => setRemember(e.target.checked)} />
                          <label className="form-check-label" htmlFor="flexCheckDefault">Remember me</label>
                        </div>
                        <a href="forgot.html" className="forgot-password">Forgot Password?</a>
                      </div>
                    </div>
                    <div className="col-12">
                      <button type="submit" className="btn btn-animation w-100 justify-content-center">Log In</button>
                      <h5 className="new-page mt-3 text-center">Don't have an account ? <a href="/signup">Create an account</a></h5>
                    </div>
                  </form>
                </div>
                <div className="other-log-in"><h6>or</h6></div>
                <div className="log-in-button">
                  <ul>
                    <li>
                      <a href="https://www.google.com/" className="btn google-button w-100">
                        <img src="../assets/images/inner-page/google.png" alt="" /> Log In with Google
                      </a>
                    </li>
                    <li>
                      <a href="https://www.facebook.com/" className="btn google-button w-100">
                        <img src="../assets/images/inner-page/facebook.png" alt="" /> Log In with Facebook
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default LoginPage

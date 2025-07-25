import axios from 'axios';
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const GOOGLE_CLIENT_ID = '602510909514-3anvf6bogbdlpectj2r72qicjp7fa21a.apps.googleusercontent.com';

const SignUp = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    confirm: "",
  });
  const navigate = useNavigate();

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
      toast.warn("Bạn phải chấp nhận điều khoản và chính sách bảo mật.");
      return;
    }

    try {
      const res = await axios.post('http://localhost:8082/PureFoods/api/users/register', formData);
      toast.success(res.data.message || "Đăng ký thành công!");
      navigate('/login')
    } catch (err) {
      const errorMessage =
        err.response && err.response.data && err.response.data.message
          ? err.response.data.message
          : "ERROR";
      toast.error(errorMessage);
    }
  };



  useEffect(() => {
    if (window.google) {
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: (res) => {
          console.log("Google login response", res);
          console.log("Token:", res.credential);
          handleGoogleResponse(res);
        },
      });
      window.google.accounts.id.renderButton(document.getElementById("googleSignInDiv"), {
        theme: "outline",
        size: "large",
        width: "100%",
      });
    }
  }, []);

  const handleGoogleResponse = async (response) => {
    try {
      const res = await axios.post(
        "http://localhost:8082/PureFoods/api/users/google",
        {
          token: response.credential,
        },
        { withCredentials: true }
      );

      const user = res.data;
      toast.success("Welcome " + user.fullName);

      console.log("Google Response:", response);
      localStorage.setItem("user", JSON.stringify(user));

      

      // Chuyển hướng theo role
      if (user.roleID === 1) {
        navigate("/admin-dashboard");
      } else if (user.roleID === 2) {
        navigate("/"); // customer khách hàng
      } else if (user.roleID === 3) {
        navigate("/wholesaler"); // trader
      } else if (user.roleID === 4) {
        navigate("/importer"); // người nhập hàng
      } else if (user.roleID === 5) {
        navigate("/exporter");
      } else if (user.roleID === 6) {
        navigate("/shipper");
      } else {
        toast.warn("Unknown role!");
      }
    } catch (error) {
      const errorMessage =
        error.response && error.response.data && error.response.data.message
          ? error.response.data.message
          : "Google login failed!";
      toast.error(errorMessage);
    }
  };
  useEffect(() => {
    if (!window.FB) {
      const script = document.createElement("script");
      script.src = "https://connect.facebook.net/en_US/sdk.js";
      script.async = true;
      script.defer = true;
      script.crossOrigin = "anonymous";
      script.onload = () => {
        window.FB.init({
          appId: "1056124739222943",
          cookie: true,
          xfbml: true,
          version: "v20.0",
        });
      };
      document.body.appendChild(script);
    } else {
      window.FB.init({
        appId: "1056124739222943",
        cookie: true,
        xfbml: true,
        version: "v20.0",
      });
    }

    return () => {
      const script = document.querySelector('script[src="https://connect.facebook.net/en_US/sdk.js"]');
      if (script) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const handleFacebookLogin = () => {
    window.FB.login(
      function (response) {
        if (response.authResponse) {
          const accessToken = response.authResponse.accessToken;

          window.FB.api("/me", { fields: "name,email" }, function (userInfo) {
            console.log("User info:", userInfo);

            axios.post('http://localhost:8082/PureFoods/api/users/facebook', {
              accessToken: accessToken
            }).then(res => {
              const user = res.data.user;
              toast.success("Welcome " + user.fullName);

              localStorage.setItem('user', JSON.stringify(user));

              if (user.roleID === 1) navigate("/admin-dashboard");
              else if (user.roleID === 2) navigate("/");
              else if (user.roleID === 3) navigate("/wholesaler");
              else if (user.roleID === 4) navigate("/importer");
              else if (user.roleID === 5) navigate("/exporter");
              else if (user.roleID === 6) navigate("/shipper");

            }).catch(err => {
              const errorMessage =
                err.response && err.response.data && err.response.data.message
                  ? err.response.data.message
                  : "Facebook login failed";
              toast.error(errorMessage);
            });
          });
        } else {
          toast.error("Người dùng đã hủy đăng nhập hoặc không xác thực đầy đủ.");
        }
      }, { scope: 'public_profile,email' });
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
                  <h3>Chào mừng đến với Clean Food Shop</h3>
                  <h4>Đăng ký Tài Khoản của bạn</h4>
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
                          required
                        />
                        <label>Họ và Tên</label>
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
                          required
                        />
                        <label>Email</label>
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
                          required
                        />
                        <label>Mật khẩu</label>
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="form-floating theme-form-floating log-in-form">
                        <input
                          type="password"
                          className={`form-control ${formData.confirm
                            ? formData.confirm === formData.password
                              ? "is-valid"
                              : "is-invalid"
                            : ""
                            }`} name="confirm"
                          value={formData.confirm}
                          onChange={handleChange}
                        />
                        {formData.confirm && formData.confirm !== formData.password && (
                          <p className="text-danger mt-1">Mật khẩu xác nhận không khớp</p>
                        )}
                        {formData.confirm && formData.confirm === formData.password && (
                          <p className="text-success mt-1">Mật khẩu xác nhận trùng khớp</p>
                        )}
                        <label>Xác nhận mật khẩu</label>
                      </div>
                    </div>

                    <div className="col-12">
                      <div className="form-floating theme-form-floating log-in-form">
                        <input
                          type="text"
                          name="phone"
                          className="form-control"
                          placeholder="Số điện thoại"
                          onChange={handleChange}
                          required
                        />
                        <label>Số điện thoại</label>
                      </div>
                    </div>

                    <div className="col-12">
                      <div className="form-floating theme-form-floating log-in-form">
                        <input
                          type="text"
                          name="Địa chỉ"
                          className="form-control"
                          placeholder="Address"
                          onChange={handleChange}
                          required
                        />
                        <label>Địa chỉ</label>
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
                          Tôi chấp nhận các điều khoản và chính sách bảo mật.
                        </label>
                      </div>
                    </div>

                    <div className="col-12">
                      <button type="submit" className="btn btn-animation w-100 justify-content-center">
                        Đăng Ký
                      </button>
                      <h5 className="new-page mt-3 text-center">
                        Bạn đã có tài khoản? <a href="/login">Đăng Nhập</a>
                      </h5>
                    </div>
                  </form>
                  {message && <p className="text-center mt-3">{message}</p>}
                </div>

                <div className="other-log-in"><h6>hoặc</h6></div>

                <div className="log-in-button">
                  <ul>
                    <li>
                      <div id="googleSignInDiv">
                        <a className="btn google-button w-100">
                          <img src="../assets/images/inner-page/google.png" alt="" /> Sign up with Google
                        </a>
                      </div>
                    </li>
                    <li>
                      <div onClick={handleFacebookLogin}>
                        <a className="btn google-button w-100">
                          <img src="../assets/images/inner-page/facebook.png" alt="" /> Log In with Facebook
                        </a>
                      </div>
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

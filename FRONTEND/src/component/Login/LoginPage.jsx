import React, { useEffect, useState } from 'react'
import axios from 'axios';
import Cookies from 'js-cookie';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
const GOOGLE_CLIENT_ID = '602510909514-3anvf6bogbdlpectj2r72qicjp7fa21a.apps.googleusercontent.com';


const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const navigate = useNavigate();

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
      window.google.accounts.id.renderButton(
        document.getElementById('googleSignInDiv'),
        { theme: 'outline', size: 'large', width: '100%' }
      );
      
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:8082/PureFoods/api/users/login', {
        email,
        password
      }, { withCredentials: true });

      const { message, user, status } = response.data;

      if (status === 200) {
        toast.success(message)

        if (remember) {
          Cookies.set('user', JSON.stringify(user), { expires: 1 / 144 }); // expires sau 10 phút
        } else {
          Cookies.remove('user');
        }

        if (user.roleID === 1) {
          navigate("/admin-dashboard");
        } else if (user.roleID === 2) {
          navigate("/");
        } else if (user.roleID === 3) {
          navigate("/wholesaler");
        } else if (user.roleID === 4) {
          navigate("/importer");
        } else if (user.roleID === 5) {
          navigate("/exporter");
        } else {
          toast.warn("Unknown role!");
        }

      } else {
        toast.error(message);
      }
    } catch (err) {
      toast.error("Sai tài khoản hoặc mật khẩu!");
    }
  };


  const handleGoogleResponse = async (response) => {
    try {
      const res = await axios.post('http://localhost:8082/PureFoods/api/users/google', {
        token: response.credential
      }, { withCredentials: true });

      const user = res.data;
      toast.success('Welcome ' + user.fullName);

      console.log("Google Response:", response);

      if (remember) {
        Cookies.set('user', JSON.stringify(user), { expires: 1 / 144 });
      } else {
        Cookies.remove('user');
      }

      // Chuyển hướng theo role
      if (user.roleID === 1) {
        navigate("/admin-dashboard");
      } else if (user.roleID === 2) {
        navigate("/");
      } else if (user.roleID === 3) {
        navigate("/wholesaler");
      } else if (user.roleID === 4) {
        navigate("/importer");
      } else if (user.roleID === 5) {
        navigate("/exporter");
      } else {
        toast.warn("Unknown role!");
      }

    } catch (error) {
      toast.error("Google login failed!");
      console.error(error);
    }
  };
  useEffect(() => {
    if (!window.FB) {
      const script = document.createElement('script');
      script.src = "https://connect.facebook.net/en_US/sdk.js";
      script.async = true;
      script.defer = true;
      script.crossOrigin = "anonymous";
      script.onload = () => {
        window.FB.init({
          appId: '1056124739222943',
          cookie: true,
          xfbml: true,
          version: 'v20.0'
        });
      };
      document.body.appendChild(script);
    } else {
      window.FB.init({
        appId: '1056124739222943',
        cookie: true,
        xfbml: true,
        version: 'v20.0'
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
    window.FB.login(function (response) {
      if (response.authResponse) {
        const accessToken = response.authResponse.accessToken;

        window.FB.api('/me', { fields: 'name,email' }, function (userInfo) {
          console.log('User info:', userInfo);

          axios.post('http://localhost:8082/PureFoods/api/users/facebook', {
            accessToken: accessToken
          }).then(res => {
            const user = res.data.user;
            toast.success("Welcome " + user.fullName);

            if (user.roleID === 1) navigate("/admin-dashboard");
            else if (user.roleID === 2) navigate("/");
            else if (user.roleID === 3) navigate("/wholesaler");
            else if (user.roleID === 4) navigate("/importer");
            else if (user.roleID === 5) navigate("/exporter");

          }).catch(err => {
            console.error("Facebook login failed", err);
            toast.error("Facebook login failed");
          });
        });
      } else {
        toast.error("User cancelled login or did not fully authorize.");
      }
    }, { scope: 'public_profile,email' });
  };

  return (
    <>
      <section className="log-in-section section-b-space">
        <a href="" className="logo-login"><img src="/assets/images/logo/1.png" className="img-fluid" alt="Logo" /></a>
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
                        <Link to={'/forgot'} className="forgot-password">Forgot Password?</Link>
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
                      <div id="googleSignInDiv" >
                        <a className="btn google-button w-100">
                          <img src="../assets/images/inner-page/google.png" alt="" /> Log In with Google
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
    </>
  )
}

export default LoginPage

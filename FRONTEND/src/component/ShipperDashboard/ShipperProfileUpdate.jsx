import React, { useEffect, useState } from "react";
import axios from "axios";
import './ShipperProfileUpdate.css';
import { useNavigate } from "react-router-dom";
import CartLayout from "../../layouts/CartLayout";
import { FiEye, FiEyeOff } from "react-icons/fi";
import TopBar from '../ShipperDashboard/ShipperTopBar';
import SideBar from '../ShipperDashboard/ShipperSideBar';
const ShipperProfileUpdate = () => {

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

    useEffect(() => {
        const sidebarLinks = document.querySelectorAll('.sidebar-link');
        const handleClick = (e) => {
            const nextEl = e.currentTarget.nextElementSibling;
            if (nextEl && nextEl.classList.contains('sidebar-submenu')) {
                e.preventDefault();
                nextEl.classList.toggle('show');
            }
        };
        sidebarLinks.forEach(link => {
            link.addEventListener('click', handleClick);
        });
        return () => {
            sidebarLinks.forEach(link => {
                link.removeEventListener('click', handleClick);
            });
        };
    }, []);

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
        <div className="page-wrapper compact-wrapper" id="pageWrapper">
            <TopBar />
            <div className="page-body-wrapper">
                <SideBar />
                <div className="page-body">
                    <div className="container-fluid">
                        <div className="row justify-content-center">
                            <div className="col-lg-8 col-xl-6">
                                <div className="card">
                                    <div className="card-body">
                                        <h5 className="text-center mb-4">Chỉnh sửa hồ sơ</h5>

                                        {message && <div className="alert alert-info">{message}</div>}

                                        <form onSubmit={handleSubmit} className="row g-3">
                                            {/* Họ tên */}
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

                                            {/* Email */}
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

                                            {/* Đổi mật khẩu */}
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
                                                            <span className="password-toggle" onClick={togglePasswordVisibility}>
                                                                {showPassword ? <FiEyeOff /> : <FiEye />}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="col-12 text-center">
                                                        <button type="button" className="btn btn-outline-primary btn-sm" onClick={handleVerifyOldPassword}>
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
                                                            <span className="password-toggle" onClick={togglePasswordVisibility}>
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
                                                            <span className="password-toggle" onClick={togglePasswordVisibility}>
                                                                {showPassword ? <FiEyeOff /> : <FiEye />}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </>
                                            )}

                                            {/* SĐT */}
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

                                            {/* Địa chỉ */}
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

                                            {/* Submit */}
                                            <div className="col-12 text-center">
                                                <button type="submit" className="btn btn-primary">
                                                    Lưu thay đổi
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <footer className="footer">
                        <div className="row">
                            <div className="col-md-12 footer-copyright text-center">
                                <p className="mb-0">Copyright 2025 © Clean Food Shop theme by pixelstrap</p>
                            </div>
                        </div>
                    </footer>
                </div>
            </div>
        </div>
    );
};

export default ShipperProfileUpdate;

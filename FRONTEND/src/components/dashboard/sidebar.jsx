import { Link } from "react-router-dom";
const Sidebar = () => {
    return (
        <>
            <div className="sidebar-wrapper">
                {/* <div id="sidebarEffect"></div> */}
                <div>
                    <div className="logo-wrapper logo-wrapper-center">
                        <a href="index.html" data-bs-original-title="" title="">
                            <img className="img-fluid for-white" src="assets/images/logo/full-white.png" alt="logo" />
                        </a>
                        <div className="back-btn">
                            <i className="fa fa-angle-left"></i>
                        </div>
                        <div className="toggle-sidebar">
                            <i className="ri-apps-line status_toggle middle sidebar-toggle"></i>
                        </div>
                    </div>
                    <div className="logo-icon-wrapper">
                        <a href="index.html">
                            <img className="img-fluid main-logo main-white" src="assets/images/logo/logo.png" alt="logo" />
                            <img className="img-fluid main-logo main-dark" src="assets/images/logo/logo-white.png"
                                alt="logo" />
                        </a>
                    </div>
                    <nav className="sidebar-main">
                        <div className="left-arrow" id="left-arrow">
                            <i data-feather="arrow-left"></i>
                        </div>

                        <div id="sidebar-menu">
                            <ul className="sidebar-links" id="simple-bar">
                                <li className="sidebar-list">
                                    <Link className="sidebar-link sidebar-title link-nav" to="/dashboard">
                                        <i className="ri-home-line"></i>
                                        <span>Dashboard</span>
                                    </Link>
                                </li>
                                <li className="sidebar-list">
                                    <Link className="sidebar-link sidebar-title link-nav" to="/create-request">
                                        <i className="ri-store-3-line"></i>
                                        <span>Tạo yêu cầu xuất</span>
                                    </Link>
                                </li>
                                <li className="sidebar-list">
                                    <Link className="sidebar-link sidebar-title link-nav" to="/request-list">
                                        <i className="ri-list-check-2"></i>
                                        <span>Danh sách yêu cầu</span>
                                    </Link>
                                </li>
                                <li className="sidebar-list">
                                    <Link className="sidebar-link sidebar-title link-nav" to="/inventory-check">
                                        <i className="ri-list-settings-line"></i>
                                        <span>Kiểm tra tồn kho</span>
                                    </Link>
                                </li>
                                <li className="sidebar-list">
                                    <Link className="sidebar-link sidebar-title link-nav" to="/confirm-order">
                                        <i className="ri-user-3-line"></i>
                                        <span>Xác nhận đơn hàng</span>
                                    </Link>
                                </li>
                                <li className="sidebar-list">
                                    <Link className="sidebar-link sidebar-title link-nav" to="/reject-order">
                                        <i className="ri-user-3-line"></i>
                                        <span>Từ chối đơn hàng</span>
                                    </Link>
                                </li>
                                <li className="sidebar-list">
                                    <Link className="sidebar-link sidebar-title link-nav" to="/payment-check">
                                        <i className="ri-price-tag-3-line"></i>
                                        <span>Kiểm tra thanh toán</span>
                                    </Link>
                                </li>
                                <li className="sidebar-list">
                                    <Link className="sidebar-link sidebar-title link-nav" to="/request-payment">
                                        <i className="ri-price-tag-3-line"></i>
                                        <span>Yêu cầu thanh toán</span>
                                    </Link>
                                </li>
                                <li className="sidebar-list">
                                    <Link className="sidebar-link sidebar-title link-nav" to="/prepare-delivery">
                                        <i className="ri-archive-line"></i>
                                        <span>Chuẩn bị giao hàng</span>
                                    </Link>
                                </li>
                                <li className="sidebar-list">
                                    <Link className="sidebar-link sidebar-title link-nav" to="/update-delivery">
                                        <i className="ri-focus-3-line"></i>
                                        <span>Cập nhật giao hàng</span>
                                    </Link>
                                </li>
                                <li className="sidebar-list">
                                    <Link className="sidebar-link sidebar-title link-nav" to="/confirm-delivery">
                                        <i className="ri-focus-3-line"></i>
                                        <span>Xác nhận giao hàng</span>
                                    </Link>
                                </li>
                                <li className="sidebar-list">
                                    <Link className="sidebar-link sidebar-title link-nav" to="/notification">
                                        <i className="ri-file-chart-line"></i>
                                        <span>Thông báo</span>
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        <div className="right-arrow" id="right-arrow">
                            <i data-feather="arrow-right"></i>
                        </div>
                    </nav>
                </div>
            </div>
        </>
    );
}

export default Sidebar;
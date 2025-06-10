import { NavLink } from "react-router-dom";
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
                            <ul className="sidebar-links space-y-2" id="simple-bar">
                                <li className="sidebar-list">
                                    <NavLink
                                        to="/dashboard"
                                        className={({ isActive }) =>
                                            `flex items-center px-4 py-2 rounded transition-all duration-150 hover:bg-green-800 ${isActive ? "border-l-4 border-white bg-green-800 font-bold" : ""
                                            }`
                                        }
                                    >
                                        <i className="ri-home-line mr-3"></i>
                                        <span>Dashboard</span>
                                    </NavLink>
                                </li>
                   
                                <li className="sidebar-list">
                                    <NavLink
                                        to="/exportShipment"
                                        className={({ isActive }) =>
                                            `flex items-center px-4 py-2 rounded transition-all duration-150 hover:bg-green-800 ${isActive ? "border-l-4 border-white bg-green-800 font-bold" : ""
                                            }`
                                        }
                                    >
                                        <i className="ri-user-line mr-3"></i>
                                        <span>Export</span>
                                    </NavLink>
                                </li>
                                <li className="sidebar-list">
                                    <NavLink
                                        to="/inventory-management"
                                        className={({ isActive }) =>
                                            `flex items-center px-4 py-2 rounded transition-all duration-150 hover:bg-green-800 ${isActive ? "border-l-4 border-white bg-green-800 font-bold" : ""
                                            }`
                                        }
                                    >
                                        <i className="ri-bar-chart-line mr-3"></i>
                                        <span>Inventory</span>
                                    </NavLink>
                                </li>
                                             <li className="sidebar-list">
                                    <NavLink
                                        to="/delivery-management"
                                        className={({ isActive }) =>
                                            `flex items-center px-4 py-2 rounded transition-all duration-150 hover:bg-green-800 ${isActive ? "border-l-4 border-white bg-green-800 font-bold" : ""
                                            }`
                                        }
                                    >
                                        <i className="ri-shopping-cart-line mr-3"></i>
                                        <span>Delivery</span>
                                    </NavLink>
                                </li>
                                <li className="sidebar-list">
                                    <NavLink
                                        to="/dashboard/settings"
                                        className={({ isActive }) =>
                                            `flex items-center px-4 py-2 rounded transition-all duration-150 hover:bg-green-800 ${isActive ? "border-l-4 border-white bg-green-800 font-bold" : ""
                                            }`
                                        }
                                    >
                                        <i className="ri-settings-line mr-3"></i>
                                        <span>Settings</span>
                                    </NavLink>
                                </li>
                                <li className="sidebar-list">
                                    <NavLink
                                        to="/dashboard/help"
                                        className={({ isActive }) =>
                                            `flex items-center px-4 py-2 rounded transition-all duration-150 hover:bg-green-800 ${isActive ? "border-l-4 border-white bg-green-800 font-bold" : ""
                                            }`
                                        }
                                    >
                                        <i className="ri-question-line mr-3"></i>
                                        <span>Help</span>
                                    </NavLink>
                                </li>
                                <li className="sidebar-list">
                                    <NavLink
                                        to="/dashboard/logout"
                                        className={({ isActive }) =>
                                            `flex items-center px-4 py-2 rounded transition-all duration-150 hover:bg-green-800 ${isActive ? "border-l-4 border-white bg-green-800 font-bold" : ""
                                            }`
                                        }
                                    >
                                        <i className="ri-logout-box-line mr-3"></i>
                                        <span>Logout</span>
                                    </NavLink>
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
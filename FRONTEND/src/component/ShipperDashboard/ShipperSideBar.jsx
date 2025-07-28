import React from 'react'
import SidebarEffect from '../SidebarEffect/SidebarEffect.jsx'
import { Link } from 'react-router-dom'

const SideBar = () => {
    return (
        <div>
            <div className="sidebar-wrapper">
                <nav className="sidebar-main" style={{ position: "relative" }}>
                    <SidebarEffect />
                    <div id="sidebarEffect" style={{
                        position: "absolute",
                        inset: 0,
                        zIndex: 0,
                        pointerEvents: "none"
                    }}></div>
                    <div className='logoSide'>
                        <div className="logo-wrapper logo-wrapper-center">
                            <Link to={'/shipper-dashboard'}>
                                <img className="img-fluid for-white" src="/assets/images/logo/1.png" alt="logo" />
                            </Link>
                        </div>
                        <div className="logo-icon-wrapper">
                            <Link to={'/shipper-dashboard'}>
                                <img className="img-fluid main-logo main-white" src="/assets/images/logo/1.png" alt="logo" />
                                <img className="img-fluid main-logo main-dark" src="/assets/images/logo/1.png"
                                    alt="logo" />
                            </Link>
                        </div>
                    </div>

                    <div id="sidebar-menu">
                        <ul className="sidebar-links" id="simple-bar">
                            <li className="back-btn"></li>

                            <li className="sidebar-list">
                                <Link to={'/shipper-dashboard'} className="sidebar-link sidebar-title link-nav">
                                    <i className="ri-home-line"></i>
                                    <span>Dashboard</span>
                                </Link>
                            </li>

                            <li className="sidebar-list">
                                <a className="sidebar-link sidebar-title" href="javascript:void(0)">
                                    <i className="ri-archive-line"></i>
                                    <span>Đơn hàng</span>
                                </a>
                                <ul className="sidebar-submenu">
                                    <li>
                                        <Link to={'/shipper-order'}>Danh sách đơn hàng</Link>
                                    </li>
                                </ul>
                            </li>

                            <li className="sidebar-list">
                                <a className="linear-icon-link sidebar-link sidebar-title" href="javascript:void(0)">
                                    <i className="ri-settings-line"></i>
                                    <span>Settings</span>
                                </a>
                                <ul className="sidebar-submenu">
                                    <li>
                                        <Link to={'/shipper-profile-update'}>Profile Setting</Link>
                                    </li>
                                </ul>
                            </li>

                            <li className="sidebar-list">
                                <a className="sidebar-link sidebar-title link-nav" href="reports.html">
                                    <i className="ri-file-chart-line"></i>
                                    <span>Báo cáo</span>
                                </a>
                            </li>
                        </ul>
                    </div>
                    <div className="right-arrow" id="right-arrow">
                        <i data-feather="arrow-right"></i>
                    </div>
                </nav>
            </div>
        </div>
    )
}

export default SideBar

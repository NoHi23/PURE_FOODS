const Sidebar = () => {
    return (
        <>
      <div className="sidebar-wrapper">
                <div id="sidebarEffect"></div>
                <div>
                    <div className="logo-wrapper logo-wrapper-center">
                        <a href="index.html" data-bs-original-title="" title="">
                            <img className="img-fluid for-white" src="assets/images/logo/full-white.png" alt="logo"/>
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
                            <img className="img-fluid main-logo main-white" src="assets/images/logo/logo.png" alt="logo"/>
                            <img className="img-fluid main-logo main-dark" src="assets/images/logo/logo-white.png"
                                alt="logo"/>
                        </a>
                    </div>
                    <nav className="sidebar-main">
                        <div className="left-arrow" id="left-arrow">
                            <i data-feather="arrow-left"></i>
                        </div>

                        <div id="sidebar-menu">
                            <ul className="sidebar-links" id="simple-bar">
                                <li className="back-btn"></li>

                                <li className="sidebar-list">
                                    <a className="sidebar-link sidebar-title link-nav" href="index.html">
                                        <i className="ri-home-line"></i>
                                        <span>Dashboard</span>
                                    </a>
                                </li>

                                <li className="sidebar-list">
                                    <a className="linear-icon-link sidebar-link sidebar-title" href="javascript:void(0)">
                                        <i className="ri-store-3-line"></i>
                                        <span>Product</span>
                                    </a>
                                    <ul className="sidebar-submenu">
                                        <li>
                                            <a href="products.html">Prodcts</a>
                                        </li>

                                        <li>
                                            <a href="add-new-product.html">Add New Products</a>
                                        </li>
                                    </ul>
                                </li>

                                <li className="sidebar-list">
                                    <a className="linear-icon-link sidebar-link sidebar-title" href="javascript:void(0)">
                                        <i className="ri-list-check-2"></i>
                                        <span>Category</span>
                                    </a>
                                    <ul className="sidebar-submenu">
                                        <li>
                                            <a href="category.html">Category List</a>
                                        </li>

                                        <li>
                                            <a href="add-new-category.html">Add New Category</a>
                                        </li>
                                    </ul>
                                </li>

                                <li className="sidebar-list">
                                    <a className="linear-icon-link sidebar-link sidebar-title" href="javascript:void(0)">
                                        <i className="ri-list-settings-line"></i>
                                        <span>Attributes</span>
                                    </a>
                                    <ul className="sidebar-submenu">
                                        <li>
                                            <a href="attributes.html">Attributes</a>
                                        </li>

                                        <li>
                                            <a href="add-new-attributes.html">Add Attributes</a>
                                        </li>
                                    </ul>
                                </li>

                                <li className="sidebar-list">
                                    <a className="sidebar-link sidebar-title" href="javascript:void(0)">
                                        <i className="ri-user-3-line"></i>
                                        <span>Users</span>
                                    </a>
                                    <ul className="sidebar-submenu">
                                        <li>
                                            <a href="all-users.html">All users</a>
                                        </li>
                                        <li>
                                            <a href="add-new-user.html">Add new user</a>
                                        </li>
                                    </ul>
                                </li>

                                <li className="sidebar-list">
                                    <a className="sidebar-link sidebar-title" href="javascript:void(0)">
                                        <i className="ri-user-3-line"></i>
                                        <span>Roles</span>
                                    </a>
                                    <ul className="sidebar-submenu">
                                        <li>
                                            <a href="role.html">All roles</a>
                                        </li>
                                        <li>
                                            <a href="create-role.html">Create Role</a>
                                        </li>
                                    </ul>
                                </li>

                                <li className="sidebar-list">
                                    <a className="sidebar-link sidebar-title link-nav" href="media.html">
                                        <i className="ri-price-tag-3-line"></i>
                                        <span>Media</span>
                                    </a>
                                </li>

                                <li className="sidebar-list">
                                    <a className="sidebar-link sidebar-title" href="javascript:void(0)">
                                        <i className="ri-archive-line"></i>
                                        <span>Orders</span>
                                    </a>
                                    <ul className="sidebar-submenu">
                                        <li>
                                            <a href="order-list.html">Order List</a>
                                        </li>
                                        <li>
                                            <a href="order-detail.html">Order Detail</a>
                                        </li>
                                        <li>
                                            <a href="order-tracking.html">Order Tracking</a>
                                        </li>
                                    </ul>
                                </li>

                                <li className="sidebar-list">
                                    <a className="linear-icon-link sidebar-link sidebar-title" href="javascript:void(0)">
                                        <i className="ri-focus-3-line"></i>
                                        <span>Localization</span>
                                    </a>
                                    <ul className="sidebar-submenu">
                                        <li>
                                            <a href="translation.html">Translation</a>
                                        </li>

                                        <li>
                                            <a href="currency-rates.html">Currency Rates</a>
                                        </li>
                                    </ul>
                                </li>

                                <li className="sidebar-list">
                                    <a className="linear-icon-link sidebar-link sidebar-title" href="javascript:void(0)">
                                        <i className="ri-price-tag-3-line"></i>
                                        <span>Coupons</span>
                                    </a>
                                    <ul className="sidebar-submenu">
                                        <li>
                                            <a href="coupon-list.html">Coupon List</a>
                                        </li>

                                        <li>
                                            <a href="create-coupon.html">Create Coupon</a>
                                        </li>
                                    </ul>
                                </li>

                                <li className="sidebar-list">
                                    <a className="sidebar-link sidebar-title link-nav" href="taxes.html">
                                        <i className="ri-price-tag-3-line"></i>
                                        <span>Tax</span>
                                    </a>
                                </li>

                                <li className="sidebar-list">
                                    <a className="sidebar-link sidebar-title link-nav" href="product-review.html">
                                        <i className="ri-star-line"></i>
                                        <span>Product Review</span>
                                    </a>
                                </li>

                                <li className="sidebar-list">
                                    <a className="sidebar-link sidebar-title link-nav" href="support-ticket.html">
                                        <i className="ri-phone-line"></i>
                                        <span>Support Ticket</span>
                                    </a>
                                </li>

                                <li className="sidebar-list">
                                    <a className="linear-icon-link sidebar-link sidebar-title" href="javascript:void(0)">
                                        <i className="ri-settings-line"></i>
                                        <span>Settings</span>
                                    </a>
                                    <ul className="sidebar-submenu">
                                        <li>
                                            <a href="profile-setting.html">Profile Setting</a>
                                        </li>
                                    </ul>
                                </li>

                                <li className="sidebar-list">
                                    <a className="sidebar-link sidebar-title link-nav" href="reports.html">
                                        <i className="ri-file-chart-line"></i>
                                        <span>Reports</span>
                                    </a>
                                </li>

                                <li className="sidebar-list">
                                    <a className="sidebar-link sidebar-title link-nav" href="list-page.html">
                                        <i className="ri-list-check"></i>
                                        <span>List Page</span>
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
        </>
    );
    }

export default Sidebar;
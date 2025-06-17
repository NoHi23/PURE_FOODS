import axios from 'axios';
import React, { useEffect, useState } from 'react'
import './Product.css'
import './jquery.dataTables.js'
import './custom-data-table.js'
import $ from 'jquery';
import 'datatables.net'; 

const Product = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8082/PureFoods/api/product/getAll")
      .then(res => { setProducts(res.data.listProduct) })
  }, []);

 useEffect(() => {
    // Chờ DOM hiển thị xong
    if (products.length > 0) {
      const table = $('#table_id').DataTable({
        paging: false,
        ordering: false,
        info: false,
        destroy: true, // Thêm cái này để tránh lỗi khi gọi lại
        responsive: true,
      });

      return () => {
        table.destroy(); // cleanup khi component unmount hoặc re-render
      };
    }
  }, [products]);

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
  return (
    <div>
      {/* tap on top start*/}
      <div className="tap-top">
        <span className="lnr lnr-chevron-up"></span>
      </div>
      {/* tap on tap end*/}

      {/* page-wrapper Start*/}
      <div className="page-wrapper compact-wrapper" id="pageWrapper">
        {/* Page Header Start*/}
        <div className="page-header">
          <div className="header-wrapper m-0">
            <div className="header-logo-wrapper p-0">
              <div className="logo-wrapper">
                <a href="index.html">
                  <img className="img-fluid main-logo" src="/back-end/assets/images/logo/1.png" alt="logo" />
                  <img className="img-fluid white-logo" src="/back-end/assets/images/logo/1-white.png" alt="logo" />
                </a>
              </div>
              <div className="toggle-sidebar">
                <i className="status_toggle middle sidebar-toggle" data-feather="align-center"></i>
                <a href="index.html">
                  <img src="/back-end/assets/images/logo/1.png" className="img-fluid" alt="" />
                </a>
              </div>
            </div>
            <form className="form-inline search-full" action="javascript:void(0)" method="get">
              <div className="form-group w-100">
                <div className="Typeahead Typeahead--twitterUsers">
                  <div className="u-posRelative">
                    <input className="demo-input Typeahead-input form-control-plaintext w-100" type="text"
                      placeholder="Search Fastkart .." name="q" title="" autofocus />
                    <i className="close-search" data-feather="x"></i>
                    <div className="spinner-border Typeahead-spinner" role="status">
                      <span className="sr-only">Loading...</span>
                    </div>
                  </div>
                  <div className="Typeahead-menu"></div>
                </div>
              </div>
            </form>
            <div className="nav-right col-6 pull-right right-header p-0">
              <ul className="nav-menus">
                <li>
                  <span className="header-search">
                    <i className="ri-search-line"></i>
                  </span>
                </li>
                <li className="onhover-dropdown">
                  <div className="notification-box">
                    <i className="ri-notification-line"></i>
                    <span className="badge rounded-pill badge-theme">4</span>
                  </div>
                  <ul className="notification-dropdown onhover-show-div">
                    <li>
                      <i className="ri-notification-line"></i>
                      <h6 className="f-18 mb-0">Notitications</h6>
                    </li>
                    <li>
                      <p>
                        <i className="fa fa-circle me-2 font-primary"></i>Delivery processing <span
                          className="pull-right">10 min.</span>
                      </p>
                    </li>
                    <li>
                      <p>
                        <i className="fa fa-circle me-2 font-success"></i>Order Complete<span
                          className="pull-right">1 hr</span>
                      </p>
                    </li>
                    <li>
                      <p>
                        <i className="fa fa-circle me-2 font-info"></i>Tickets Generated<span
                          className="pull-right">3 hr</span>
                      </p>
                    </li>
                    <li>
                      <p>
                        <i className="fa fa-circle me-2 font-danger"></i>Delivery Complete<span
                          className="pull-right">6 hr</span>
                      </p>
                    </li>
                    <li>
                      <a className="btn btn-primary" href="javascript:void(0)">Check all notification</a>
                    </li>
                  </ul>
                </li>

                <li>
                  <div className="mode">
                    <i className="ri-moon-line"></i>
                  </div>
                </li>
                <li className="profile-nav onhover-dropdown pe-0 me-0">
                  <div className="media profile-media">
                    <img className="user-profile rounded-circle" src="/back-end/assets/images/users/4.jpg" alt="" />
                    <div className="user-name-hide media-body">
                      <span>Emay Walter</span>
                      <p className="mb-0 font-roboto">Admin<i className="middle ri-arrow-down-s-line"></i></p>
                    </div>
                  </div>
                  <ul className="profile-dropdown onhover-show-div">
                    <li>
                      <a href="all-users.html">
                        <i data-feather="users"></i>
                        <span>Users</span>
                      </a>
                    </li>
                    <li>
                      <a href="order-list.html">
                        <i data-feather="archive"></i>
                        <span>Orders</span>
                      </a>
                    </li>
                    <li>
                      <a href="support-ticket.html">
                        <i data-feather="phone"></i>
                        <span>Spports Tickets</span>
                      </a>
                    </li>
                    <li>
                      <a href="profile-setting.html">
                        <i data-feather="settings"></i>
                        <span>Settings</span>
                      </a>
                    </li>
                    <li>
                      <a data-bs-toggle="modal" data-bs-target="#staticBackdrop"
                        href="javascript:void(0)">
                        <i data-feather="log-out"></i>
                        <span>Log out</span>
                      </a>
                    </li>
                  </ul>
                </li>
              </ul>
            </div>
          </div>
        </div>
        {/* Page Header Ends*/}

        {/* Page Body Start*/}
        <div className="page-body-wrapper">
          {/* Page Sidebar Start*/}
          <div className="sidebar-wrapper">
            <div id="sidebarEffect"></div>
            <div>
              <div className="logo-wrapper logo-wrapper-center">
                <a href="index.html" data-bs-original-title="" title="">
                  <img className="img-fluid for-white" src="/back-end/assets/images/logo/full-white.png" alt="logo" />
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
                  <img className="img-fluid main-logo main-white" src="/back-end/assets/images/logo/1-white.png" alt="logo" />
                  <img className="img-fluid main-logo main-dark" src="/back-end/assets/images/logo/logo-white.png"
                    alt="logo" />
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
          {/* Page Sidebar Ends*/}

          {/* Container-fluid starts*/}
          <div className="page-body">
            <div className="container-fluid">
              <div className="row">
                <div className="col-sm-12">
                  <div className="card card-table">
                    <div className="card-body">
                      <div class="title-header option-title d-sm-flex d-block">
                        <h5>Products List</h5>
                        <div class="right-options">
                          <ul>
                            <li>
                              <a href="javascript:void(0)">import</a>
                            </li>
                            <li>
                              <a href="javascript:void(0)">Export</a>
                            </li>
                            <li>
                              <a class="btn btn-solid" href="add-new-product.html">Add Product</a>
                            </li>
                          </ul>
                        </div>
                      </div>
                      <div>
                        <div className="table-responsive">
                          <table className="table all-package theme-table table-product" id="table_id">
                            <thead>
                              <tr>
                                <th>Product Image</th>
                                <th>Product Name</th>
                                <th>Category</th>
                                <th>Supplier</th>
                                <th>Current Qty</th>
                                <th>Price</th>
                                <th>Status</th>
                                <th>Option</th>
                              </tr>
                            </thead>
                            <tbody>
                              {products?.map((p, i) => (
                                <tr key={i}>
                                  <td>
                                    <div className="table-image">
                                      <img src={p.imageURL} className="img-fluid"
                                        alt="" />
                                    </div>
                                  </td>

                                  <td>{p.productName}</td>

                                  <td>{p.categoryId}</td>

                                  <td>{p.supplierId}</td>
                                  <td>{p.stockQuantity}</td>
                                  <td className="td-price">${p.price}</td>

                                  <td className={p.status === 1 ? "status-danger" : "status-success"}>
                                    <span>{p.status === 1 ? "Pending" : "Approved"}</span>
                                  </td>
                                  <td>
                                    <ul>
                                      <li>
                                        <a href="order-detail.html">
                                          <i className="ri-eye-line"></i>
                                        </a>
                                      </li>

                                      <li>
                                        <a href="javascript:void(0)">
                                          <i className="ri-pencil-line"></i>
                                        </a>
                                      </li>

                                      <li>
                                        <a href="javascript:void(0)" data-bs-toggle="modal"
                                          data-bs-target="#exampleModalToggle">
                                          <i className="ri-delete-bin-line"></i>
                                        </a>
                                      </li>
                                    </ul>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Container-fluid Ends*/}

            <div className="container-fluid">
              {/* footer start*/}
              <footer className="footer">
                <div className="row">
                  <div className="col-md-12 footer-copyright text-center">
                    <p className="mb-0">Copyright 2022 © Fastkart theme by pixelstrap</p>
                  </div>
                </div>
              </footer>
            </div>
          </div>
        </div>
      </div>
      {/* page-wrapper End*/}

      {/* Modal Start */}
      <div className="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1">
        <div className="modal-dialog  modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body">
              <h5 className="modal-title" id="staticBackdropLabel">Logging Out</h5>
              <p>Are you sure you want to log out?</p>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              <div className="button-box">
                <button type="button" className="btn btn--no" data-bs-dismiss="modal">No</button>
                <button type="button" onclick="location.href = 'login.html';"
                  className="btn  btn--yes btn-primary">Yes</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="modal fade theme-modal remove-coupon" id="exampleModalToggle" aria-hidden="true" tabindex="-1">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header d-block text-center">
              <h5 className="modal-title w-100" id="exampleModalLabel22">Are You Sure ?</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close">
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-body">
              <div className="remove-box">
                <p>The permission for the use/group, preview is inherited from the object, object will create a
                  new permission for this object</p>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-animation btn-md fw-bold" data-bs-dismiss="modal">No</button>
              <button type="button" className="btn btn-animation btn-md fw-bold" data-bs-target="#exampleModalToggle2"
                data-bs-toggle="modal" data-bs-dismiss="modal">Yes</button>
            </div>
          </div>
        </div>
      </div>

      <div className="modal fade theme-modal remove-coupon" id="exampleModalToggle2" aria-hidden="true" tabindex="-1">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title text-center" id="exampleModalLabel12">Done!</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close">
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-body">
              <div className="remove-box text-center">
                <div className="wrapper">
                  <svg className="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                    <circle className="checkmark__circle" cx="26" cy="26" r="25" fill="none" />
                    <path className="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
                  </svg>
                </div>
                <h4 className="text-content">It's Removed.</h4>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-primary" data-bs-toggle="modal" data-bs-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Product

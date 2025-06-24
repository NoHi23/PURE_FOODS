import React, { useState, useEffect } from "react";
import ImporterLayout from "../../layouts/ImporterLayout";
import axios from "axios";
import ImporterProduct from "./ImporterProduct";
import ImporterSetting from "./ImporterSetting";
import ImporterProfile from "./ImporterProfile";
import ImporterInventoryLog from "./ImporterInventoryLog";

const ImporterDashboard = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    axios
      .get("http://localhost:8082/PureFoods/api/product/getAll")
      .then((res) => {
        const data = res.data.listProduct || [];
        setProducts(data);
      })
      .catch((err) => {
        console.error("Lỗi khi lấy dữ liệu sản phẩm:", err);
      });
  }, []);

  return (
    <ImporterLayout>
      <div>
        <section className="user-dashboard-section section-b-space">
          <div className="container-fluid-lg">
            <div className="row">
              <div className="col-xxl-3 col-lg-4">
                <div className="dashboard-left-sidebar">
                  <div className="profile-box">
                    <div className="cover-image">
                      <img
                        src="../assets/images/inner-page/cover-img.jpg"
                        className="img-fluid blur-up lazyload"
                        alt=""
                      />
                    </div>

                    <div className="profile-contain">
                      <div className="profile-image">
                        <div className="position-relative">
                          <img
                            src="../assets/images/vendor-page/logo.png"
                            className="blur-up lazyload update_img"
                            alt=""
                          />
                        </div>
                      </div>

                      <div className="profile-name">
                        <h3>{user.fullName}</h3>
                        <h6 className="text-content">{user.email}</h6>
                      </div>
                    </div>
                  </div>

                  <ul className="nav nav-pills user-nav-pills" id="pills-tab" role="tablist">
                    <li className="nav-item" role="presentation">
                      <a
                        href="#pills-tabContent"
                        className="nav-link active"
                        id="pills-dashboard-tab"
                        data-bs-toggle="pill"
                        data-bs-target="#pills-dashboard"
                        role="tab"
                      >
                        <i data-feather="home"></i>
                        Thông tin tổng quan
                      </a>
                    </li>

                    <li className="nav-item" role="presentation">
                      <button
                        className="nav-link"
                        id="pills-product-tab"
                        data-bs-toggle="pill"
                        data-bs-target="#pills-product"
                        type="button"
                        role="tab"
                      >
                        <i data-feather="shopping-bag"></i>Quản lý nhập kho
                      </button>
                    </li>

                    <li className="nav-item" role="presentation">
                      <button
                        className="nav-link"
                        id="pills-order-tab"
                        data-bs-toggle="pill"
                        data-bs-target="#pills-order"
                        type="button"
                        role="tab"
                      >
                        <i data-feather="shopping-bag"></i>Lịch sử nhập kho
                      </button>
                    </li>

                    <li className="nav-item" role="presentation">
                      <button
                        className="nav-link"
                        id="pills-profile-tab"
                        data-bs-toggle="pill"
                        data-bs-target="#pills-profile"
                        type="button"
                        role="tab"
                      >
                        <i data-feather="user"></i>
                        Thông tin cá nhân
                      </button>
                    </li>

                    <li className="nav-item" role="presentation">
                      <button
                        className="nav-link"
                        id="pills-security-tab"
                        data-bs-toggle="pill"
                        data-bs-target="#pills-security"
                        type="button"
                        role="tab"
                      >
                        <i data-feather="settings"></i>
                        Cài đặt
                      </button>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="col-xxl-9 col-lg-8">
                <div className="dashboard-right-sidebar">
                  <div className="tab-content" id="pills-tabContent">
                    <div className="tab-pane fade show active" id="pills-dashboard" role="tabpanel">
                      <div className="dashboard-home">
                        <div className="title">
                          <h2>Trang quản lý Nhập Hàng</h2>
                          <span className="title-leaf">
                            <svg className="icon-width bg-gray">
                              <use href="../assets/svg/leaf.svg#leaf"></use>
                            </svg>
                          </span>
                        </div>

                        <div className="dashboard-user-name">
                          <p className="text-content">
                            Tại đây, bạn có thể xem nhanh hoạt động nhập hàng gần đây và cập nhật thông tin tài khoản.
                            Chọn liên kết bên dưới để xem hoặc chỉnh sửa thông tin.
                          </p>
                        </div>

                        <div className="total-box">
                          <div className="row g-sm-4 g-3">
                            <div className="col-xxl-4 col-lg-6 col-md-4 col-sm-6">
                              <div className="total-contain">
                                <img src="../assets/images/svg/order.svg" className="img-1 blur-up lazyload" alt="" />
                                <img src="../assets/images/svg/order.svg" className="blur-up lazyload" alt="" />
                                <div className="total-detail">
                                  <h5>Tổng sản phẩm</h5>
                                  <h3>25</h3>
                                </div>
                              </div>
                            </div>

                            <div className="col-xxl-4 col-lg-6 col-md-4 col-sm-6">
                              <div className="total-contain">
                                <img src="../assets/images/svg/pending.svg" className="img-1 blur-up lazyload" alt="" />
                                <img src="../assets/images/svg/pending.svg" className="blur-up lazyload" alt="" />
                                <div className="total-detail">
                                  <h5>Tổng bán ra</h5>
                                  <h3>12550</h3>
                                </div>
                              </div>
                            </div>

                            <div className="col-xxl-4 col-lg-6 col-md-4 col-sm-6">
                              <div className="total-contain">
                                <img
                                  src="../assets/images/svg/wishlist.svg"
                                  className="img-1 blur-up lazyload"
                                  alt=""
                                />
                                <img src="../assets/images/svg/wishlist.svg" className="blur-up lazyload" alt="" />
                                <div className="total-detail">
                                  <h5>Đơn chờ xử lý</h5>
                                  <h3>36</h3>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="row g-4">
                          <div className="col-xxl-6">
                            <div className="table-responsive dashboard-bg-box">
                              <div className="dashboard-title mb-4">
                                <h3>Sản phẩm thịnh hành</h3>
                              </div>

                              <table className="table product-table">
                                <thead>
                                  <tr>
                                    <th scope="col">Images</th>
                                    <th scope="col">Product Name</th>
                                    <th scope="col">Price</th>
                                    <th scope="col">Sales</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr>
                                    <td className="product-image">
                                      <img
                                        src="../assets/images/vegetable/product/1.png"
                                        className="img-fluid"
                                        alt=""
                                      />
                                    </td>
                                    <td>
                                      <h6>Fantasy Crunchy Choco Chip Cookies</h6>
                                    </td>
                                    <td>
                                      <h6>$25.69</h6>
                                    </td>
                                    <td>
                                      <h6>152</h6>
                                    </td>
                                  </tr>

                                  <tr>
                                    <td className="product-image">
                                      <img
                                        src="../assets/images/vegetable/product/2.png"
                                        className="img-fluid"
                                        alt=""
                                      />
                                    </td>
                                    <td>
                                      <h6>Peanut Butter Bite Premium Butter Cookies 600 g</h6>
                                    </td>
                                    <td>
                                      <h6>$35.36</h6>
                                    </td>
                                    <td>
                                      <h6>34</h6>
                                    </td>
                                  </tr>

                                  <tr>
                                    <td className="product-image">
                                      <img
                                        src="../assets/images/vegetable/product/3.png"
                                        className="img-fluid"
                                        alt=""
                                      />
                                    </td>
                                    <td>
                                      <h6>Yumitos Chilli Sprinkled Potato Chips 100 g</h6>
                                    </td>
                                    <td>
                                      <h6>$78.55</h6>
                                    </td>
                                    <td>
                                      <h6>78</h6>
                                    </td>
                                  </tr>

                                  <tr>
                                    <td className="product-image">
                                      <img
                                        src="../assets/images/vegetable/product/4.png"
                                        className="img-fluid"
                                        alt=""
                                      />
                                    </td>
                                    <td>
                                      <h6>healthy Long Life Toned Milk 1 L</h6>
                                    </td>
                                    <td>
                                      <h6>$32.98</h6>
                                    </td>
                                    <td>
                                      <h6>135</h6>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>

                          <div className="col-xxl-6">
                            <div className="order-tab dashboard-bg-box">
                              <div className="dashboard-title mb-4">
                                <h3>Đơn hàng gần đây</h3>
                              </div>

                              <div className="table-responsive">
                                <table className="table order-table">
                                  <thead>
                                    <tr>
                                      <th scope="col">Order ID</th>
                                      <th scope="col">Product Name</th>
                                      <th scope="col">Status</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    <tr>
                                      <td className="product-image">#254834</td>
                                      <td>
                                        <h6>Choco Chip Cookies</h6>
                                      </td>
                                      <td>
                                        <label className="success">Shipped</label>
                                      </td>
                                    </tr>

                                    <tr>
                                      <td className="product-image">#355678</td>
                                      <td>
                                        <h6>Premium Butter Cookies</h6>
                                      </td>
                                      <td>
                                        <label className="danger">Pending</label>
                                      </td>
                                    </tr>

                                    <tr>
                                      <td className="product-image">#647536</td>
                                      <td>
                                        <h6>Sprinkled Potato Chips</h6>
                                      </td>
                                      <td>
                                        <label className="success">Shipped</label>
                                      </td>
                                    </tr>

                                    <tr>
                                      <td className="product-image">#125689</td>
                                      <td>
                                        <h6>Milk 1 L</h6>
                                      </td>
                                      <td>
                                        <label className="danger">Pending</label>
                                      </td>
                                    </tr>

                                    <tr>
                                      <td className="product-image">#215487</td>
                                      <td>
                                        <h6>Raw Mutton Leg</h6>
                                      </td>
                                      <td>
                                        <label className="danger">Pending</label>
                                      </td>
                                    </tr>

                                    <tr>
                                      <td className="product-image">#365474</td>
                                      <td>
                                        <h6>Instant Coffee</h6>
                                      </td>
                                      <td>
                                        <label className="success">Shipped</label>
                                      </td>
                                    </tr>

                                    <tr>
                                      <td className="product-image">#368415</td>
                                      <td>
                                        <h6>Jowar Stick and Jowar Chips</h6>
                                      </td>
                                      <td>
                                        <label className="danger">Pending</label>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* Thanh sidebar quản lý nhập kho bên trái */}
                    <div className="tab-pane fade" id="pills-product" role="tabpanel">
                      <ImporterProduct
                        products={products}
                        setProducts={setProducts}
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                      />
                    </div>

                    {/* Thanh tab Lịch sử nhập kho */}
                    <div className="tab-pane fade" id="pills-order" role="tabpanel">
                      <ImporterInventoryLog
                        products={products}
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                      />
                    </div>

                    {/* Thanh sidebar bên trái, thông tin cá nhân */}
                    <div className="tab-pane fade" id="pills-profile" role="tabpanel">
                      <ImporterProfile user={user} />
                    </div>
                    {/* hết thông tin cá nhân */}

                    {/* Thanh Tab phần Cài đặt (setting) */}
                    <div className="tab-pane fade" id="pills-security" role="tabpanel">
                      <ImporterSetting />
                    </div>
                    {/* Hết setting (cài đặt) */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </ImporterLayout>
  );
};

export default ImporterDashboard;

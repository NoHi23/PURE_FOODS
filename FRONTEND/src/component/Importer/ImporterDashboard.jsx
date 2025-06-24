import React, { useState, useEffect } from "react";
import ImporterLayout from "../../layouts/ImporterLayout";
import Pagination from "../../layouts/Pagination";
import axios from "axios";

const ImporterDashboard = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [products, setProducts] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 7; //mỗi trang chỉ  chứa 7 món

  const totalPages = Math.ceil(products.length / productsPerPage);

  // Cắt mảng để hiển thị theo trang
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

  useEffect(() => {
    axios
      .get("http://localhost:8082/PureFoods/api/product/getAll")
      .then((res) => {
        const data = res.data.listProduct || [];
        setProducts(data);
        console.log("xem có hiện không:", data);
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
                <button className="btn left-dashboard-show btn-animation btn-md fw-bold d-block mb-4 d-lg-none">
                  Show Menu
                </button>
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
                    {/* Thanh sidebar các sản phẩm bên trái */}
                    <div className="tab-pane fade" id="pills-product" role="tabpanel">
                      <div className="product-tab">
                        <div className="title">
                          <h2>Tất cả sản phẩm</h2>
                          <span className="title-leaf">
                            <svg className="icon-width bg-gray">
                              <use href="../assets/svg/leaf.svg#leaf"></use>
                            </svg>
                          </span>
                        </div>

                        <div className="table-responsive dashboard-bg-box">
                          <table className="table product-table">
                            <thead>
                              <tr>
                                <th scope="col">Ảnh</th>
                                <th scope="col">Tên sản phẩm</th>
                                <th scope="col">Giá</th>
                                <th scope="col">Số lượng</th>
                                <th scope="col">Đã bán</th>
                                <th scope="col">Hành động</th>
                              </tr>
                            </thead>
                            <tbody>
                              {currentProducts.length > 0 ? (
                                currentProducts.map((product, index) => (
                                  <tr key={index}>
                                    <td className="product-image">
                                      <img
                                        src={`http://localhost:8082/PureFoods/images/${product.imageURL}`}
                                        className="img-fluid"
                                        alt={product.productName}
                                      />
                                    </td>
                                    <td>
                                      <h6>{product.productName || "Không xác định"}</h6>
                                    </td>
                                    <td>
                                      <h6 className="theme-color fw-bold">
                                        {product.price ? `$${product.price}` : "Không xác định"}
                                      </h6>
                                    </td>
                                    <td>
                                      <h6>{product.stockQuantity || "0"}</h6>
                                    </td>
                                    <td>
                                      <h6>Chưa có</h6> {/* Giả định chưa có trường "đã bán" trong API */}
                                    </td>
                                    <td className="edit-delete">
                                      <i
                                        className="edit"
                                        style={{
                                          cursor: "pointer",
                                          backgroundColor: "#e0f7fa",
                                          border: "1px solid #00acc1",
                                          padding: "4px 8px",
                                          borderRadius: "4px",
                                          color: "#007c91",
                                          fontWeight: "500",
                                        }}
                                      >
                                        Sửa ✏️
                                      </i>
                                      <i
                                        className="delete"
                                        style={{
                                          cursor: "pointer",
                                          marginLeft: "10px",
                                          backgroundColor: "#ffebee",
                                          border: "1px solid #e53935",
                                          padding: "4px 8px",
                                          borderRadius: "4px",
                                          color: "#c62828",
                                          fontWeight: "500",
                                        }}
                                      >
                                        Xoá 🗑️
                                      </i>
                                    </td>
                                  </tr>
                                ))
                              ) : (
                                <tr>
                                  <td colSpan="6" className="text-center">
                                    Không có sản phẩm nào.
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                          {/* Thanh phân trang */}
                          <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={(page) => setCurrentPage(page)}
                          />
                          {/* Hết phân trang */}
                        </div>
                      </div>
                    </div>

                    <div className="tab-pane fade" id="pills-order" role="tabpanel">
                      <div className="dashboard-order">
                        <div className="title">
                          <h2>Tất cả đơn hàng</h2>
                          <span className="title-leaf title-leaf-gray">
                            <svg className="icon-width bg-gray">
                              <use href="../assets/svg/leaf.svg#leaf"></use>
                            </svg>
                          </span>
                        </div>

                        <div className="order-tab dashboard-bg-box">
                          <div className="table-responsive">
                            <table className="table order-table">
                              <thead>
                                <tr>
                                  <th scope="col">Mã đơn hàng</th>
                                  <th scope="col">Tên sản phẩm</th>
                                  <th scope="col">Trạng thái</th>
                                  <th scope="col">Giá</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td className="product-image">#254834</td>
                                  <td>
                                    <h6>Fantasy Crunchy Choco Chip Cookies</h6>
                                  </td>
                                  <td>
                                    <label className="success">Shipped</label>
                                  </td>
                                  <td>
                                    <h6>$25.69</h6>
                                  </td>
                                </tr>

                                <tr>
                                  <td className="product-image">#355678</td>
                                  <td>
                                    <h6>Peanut Butter Bite Premium Butter Cookies 600 g</h6>
                                  </td>
                                  <td>
                                    <label className="danger">Pending</label>
                                  </td>
                                  <td>
                                    <h6>$25.69</h6>
                                  </td>
                                </tr>

                                <tr>
                                  <td className="product-image">#647536</td>
                                  <td>
                                    <h6>Yumitos Chilli Sprinkled Potato Chips 100 g</h6>
                                  </td>
                                  <td>
                                    <label className="success">Shipped</label>
                                  </td>
                                  <td>
                                    <h6>$25.69</h6>
                                  </td>
                                </tr>

                                <tr>
                                  <td className="product-image">#125689</td>
                                  <td>
                                    <h6>healthy Long Life Toned Milk 1 L</h6>
                                  </td>
                                  <td>
                                    <label className="danger">Pending</label>
                                  </td>
                                  <td>
                                    <h6>$25.69</h6>
                                  </td>
                                </tr>

                                <tr>
                                  <td className="product-image">#215487</td>
                                  <td>
                                    <h6>Raw Mutton Leg, Packaging 5 Kg</h6>
                                  </td>
                                  <td>
                                    <label className="danger">Pending</label>
                                  </td>
                                  <td>
                                    <h6>$25.69</h6>
                                  </td>
                                </tr>

                                <tr>
                                  <td className="product-image">#365474</td>
                                  <td>
                                    <h6>Cold Brew Coffee Instant Coffee 50 g</h6>
                                  </td>
                                  <td>
                                    <label className="success">Shipped</label>
                                  </td>
                                  <td>
                                    <h6>$25.69</h6>
                                  </td>
                                </tr>

                                <tr>
                                  <td className="product-image">#368415</td>
                                  <td>
                                    <h6>SnackAmor Combo Pack of Jowar Stick and Jowar Chips</h6>
                                  </td>
                                  <td>
                                    <label className="danger">Pending</label>
                                  </td>
                                  <td>
                                    <h6>$25.69</h6>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                          <nav className="custom-pagination">
                            <ul className="pagination justify-content-center">
                              <li className="page-item disabled">
                                <a className="page-link" href="javascript:void(0)" tabIndex="-1">
                                  <i className="fa-solid fa-angles-left"></i>
                                </a>
                              </li>
                              <li className="page-item active">
                                <a className="page-link" href="javascript:void(0)">
                                  1
                                </a>
                              </li>
                              <li className="page-item">
                                <a className="page-link" href="javascript:void(0)">
                                  2
                                </a>
                              </li>
                              <li className="page-item">
                                <a className="page-link" href="javascript:void(0)">
                                  3
                                </a>
                              </li>
                              <li className="page-item">
                                <a className="page-link" href="javascript:void(0)">
                                  <i className="fa-solid fa-angles-right"></i>
                                </a>
                              </li>
                            </ul>
                          </nav>
                        </div>
                      </div>
                    </div>
                    {/* Thanh sidebar bên trái, thông tin cá nhân */}
                    <div className="tab-pane fade" id="pills-profile" role="tabpanel">
                      <div className="dashboard-profile">
                        <div className="title">
                          <h2>Thông tin cá nhân</h2>
                          <span className="title-leaf">
                            <svg className="icon-width bg-gray">
                              <use href="../assets/svg/leaf.svg#leaf"></use>
                            </svg>
                          </span>
                        </div>

                        <div className="profile-tab dashboard-bg-box">
                          <div className="dashboard-title dashboard-flex">
                            <h3>Tên hồ sơ</h3>
                            <button
                              className="btn btn-sm theme-bg-color text-white"
                              data-bs-toggle="modal"
                              data-bs-target="#edit-profile"
                            >
                              Chỉnh sửa
                            </button>
                          </div>

                          <ul>
                            <li>
                              <h5>Tên công ty :</h5>
                              <h5>PURE_FOODS</h5>
                            </li>
                            <li>
                              <h5>Họ và tên :</h5>
                              <h5>{user.fullName}</h5>
                            </li>
                            <li>
                              <h5>Địa chỉ Email :</h5>
                              <h5>{user.email}</h5>
                            </li>
                            <li>
                              <h5>Số điện thoại :</h5>
                              <h5>{user.phone}</h5>
                            </li>
                            <li>
                              <h5>Địa chỉ :</h5>
                              <h5>{user.address}</h5>
                            </li>
                            <li>
                              <h5>Tài khoản được tạo lúc :</h5>
                              <h5>
                                {new Date(user.createdAt).toLocaleString("vi-VN", {
                                  year: "numeric",
                                  month: "2-digit",
                                  day: "2-digit",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  second: "2-digit",
                                })}
                              </h5>
                            </li>
                            <li>
                              <h5>Trạng thái :</h5>
                              {user.status === 1 && <h5 style={{ color: "green", margin: 0 }}>Đang hoạt động</h5>}
                              {user.status === 2 && <h5 style={{ color: "red", margin: 0 }}>Bị cấm</h5>}
                              {![1, 2].includes(user.status) && <h5 style={{ margin: 0 }}>Không xác định</h5>}
                            </li>
                            <li>
                              <h5>Thiết lập lại token :</h5>
                              <h5>{user.resetToken ?? "trống"}</h5>
                            </li>
                            <li>
                              <h5>Token hết hạn :</h5>
                              <h5>{user.tokenExpiry ?? "trống"}</h5>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="tab-pane fade" id="pills-security" role="tabpanel">
                      <div className="dashboard-privacy">
                        <div className="title">
                          <h2>Cài đặt</h2>
                          <span className="title-leaf">
                            <svg className="icon-width bg-gray">
                              <use href="../assets/svg/leaf.svg#leaf"></use>
                            </svg>
                          </span>
                        </div>

                        <div className="dashboard-bg-box">
                          <div className="dashboard-title mb-4">
                            <h3>Thông báo</h3>
                          </div>

                          <div className="privacy-box">
                            <div className="form-check custom-form-check custom-form-check-2 d-flex align-items-center">
                              <input
                                className="form-check-input"
                                type="radio"
                                id="desktop"
                                name="desktop"
                                defaultChecked
                              />
                              <label className="form-check-label ms-2" htmlFor="desktop">
                                Hiện thông báo lên màn hình chính
                              </label>
                            </div>
                          </div>

                          <div className="privacy-box">
                            <div className="form-check custom-form-check custom-form-check-2 d-flex align-items-center">
                              <input className="form-check-input" type="radio" id="enable" name="desktop" />
                              <label className="form-check-label ms-2" htmlFor="enable">
                                Bật thông báo
                              </label>
                            </div>
                          </div>

                          <div className="privacy-box">
                            <div className="form-check custom-form-check custom-form-check-2 d-flex align-items-center">
                              <input className="form-check-input" type="radio" id="activity" name="desktop" />
                              <label className="form-check-label ms-2" htmlFor="activity">
                                Nhận thông báo cho các hoạt động của tôi
                              </label>
                            </div>
                          </div>

                          <div className="privacy-box">
                            <div className="form-check custom-form-check custom-form-check-2 d-flex align-items-center">
                              <input className="form-check-input" type="radio" id="dnd" name="desktop" />
                              <label className="form-check-label ms-2" htmlFor="dnd">
                                Không làm phiền (DND)
                              </label>
                            </div>
                          </div>

                          <button className="btn theme-bg-color btn-md fw-bold mt-4 text-white">Lưu thay đổi</button>
                        </div>

                        <div className="dashboard-bg-box">
                          <div className="dashboard-title mb-4">
                            <h3>Vô hiệu hoá tài khoản</h3>
                          </div>
                          <div className="privacy-box">
                            <div className="form-check custom-form-check custom-form-check-2 d-flex align-items-center">
                              <input className="form-check-input" type="radio" id="concern" name="concern" />
                              <label className="form-check-label ms-2" htmlFor="concern">
                                Tôi có mối lo ngại về quyền riêng tư
                              </label>
                            </div>
                          </div>
                          <div className="privacy-box">
                            <div className="form-check custom-form-check custom-form-check-2 d-flex align-items-center">
                              <input className="form-check-input" type="radio" id="temporary" name="concern" />
                              <label className="form-check-label ms-2" htmlFor="temporary">
                                Đây chỉ là tạm thời
                              </label>
                            </div>
                          </div>
                          <div className="privacy-box">
                            <div className="form-check custom-form-check custom-form-check-2 d-flex align-items-center">
                              <input className="form-check-input" type="radio" id="other" name="concern" />
                              <label className="form-check-label ms-2" htmlFor="other">
                                Lý do khác
                              </label>
                            </div>
                          </div>

                          <button style={{ backgroundColor: "#FFE57F" }} className="btn btn-md fw-bold mt-4 text-black">
                            Vô hiệu hoá tài khoản
                          </button>
                        </div>

                        <div className="dashboard-bg-box">
                          <div className="dashboard-title mb-4">
                            <h3>Xoá tài khoản</h3>
                          </div>
                          <div className="privacy-box">
                            <div className="form-check custom-form-check custom-form-check-2 d-flex align-items-center">
                              <input className="form-check-input" type="radio" id="usable" name="usable" />
                              <label className="form-check-label ms-2" htmlFor="usable">
                                Không còn sử dụng nữa
                              </label>
                            </div>
                          </div>
                          <div className="privacy-box">
                            <div className="form-check custom-form-check custom-form-check-2 d-flex align-items-center">
                              <input className="form-check-input" type="radio" id="account" name="usable" />
                              <label className="form-check-label ms-2" htmlFor="account">
                                Muốn chuyển sang tài khoản khác
                              </label>
                            </div>
                          </div>
                          <div className="privacy-box">
                            <div className="form-check custom-form-check custom-form-check-2 d-flex align-items-center">
                              <input className="form-check-input" type="radio" id="other-2" name="usable" />
                              <label className="form-check-label ms-2" htmlFor="other-2">
                                Lý do khác
                              </label>
                            </div>
                          </div>

                          <button style={{ backgroundColor: "red" }} className="btn btn-md fw-bold mt-4 text-white">
                            Xoá tài khoản của tôi
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* <!-- User Dashboard Section End -->  

    <!-- Add address modal box start --> */}
        <div className="modal fade theme-modal" id="add-address" tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered modal-fullscreen-sm-down">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">
                  Add a new address
                </h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal">
                  <i className="fa-solid fa-xmark"></i>
                </button>
              </div>
              <div className="modal-body">
                <form>
                  <div className="form-floating mb-4 theme-form-floating">
                    <input type="text" className="form-control" id="fname" placeholder="Enter First Name" />
                    <label htmlFor="fname">First Name</label>
                  </div>
                </form>

                <form>
                  <div className="form-floating mb-4 theme-form-floating">
                    <input type="text" className="form-control" id="lname" placeholder="Enter Last Name" />
                    <label htmlFor="lname">Last Name</label>
                  </div>
                </form>

                <form>
                  <div className="form-floating mb-4 theme-form-floating">
                    <input type="email" className="form-control" id="email" placeholder="Enter Email Address" />
                    <label htmlFor="email">Email Address</label>
                  </div>
                </form>

                <form>
                  <div className="form-floating mb-4 theme-form-floating">
                    <textarea
                      className="form-control"
                      placeholder="Leave a comment here"
                      id="address"
                      style={{ height: "100px" }}
                    ></textarea>
                    <label htmlFor="address">Enter Address</label>
                  </div>
                </form>

                <form>
                  <div className="form-floating mb-4 theme-form-floating">
                    <input type="email" className="form-control" id="pin" placeholder="Enter Pin Code" />
                    <label htmlFor="pin">Pin Code</label>
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary btn-md" data-bs-dismiss="modal">
                  Close
                </button>
                <button type="button" className="btn theme-bg-color btn-md text-white" data-bs-dismiss="modal">
                  Save changes
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* <!-- Add address modal box end -->

    <!-- Location Modal Start --> */}
        <div className="modal location-modal fade theme-modal" id="locationModal" tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered modal-fullscreen-sm-down">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel1">
                  Choose your Delivery Location
                </h5>
                <p className="mt-1 text-content">Enter your address and we will specify the offer for your area.</p>
                <button type="button" className="btn-close" data-bs-dismiss="modal">
                  <i className="fa-solid fa-xmark"></i>
                </button>
              </div>
              <div className="modal-body">
                <div className="location-list">
                  <div className="search-input">
                    <input type="search" className="form-control" placeholder="Search Your Area" />
                    <i className="fa-solid fa-magnifying-glass"></i>
                  </div>

                  <div className="disabled-box">
                    <h6>Select a Location</h6>
                  </div>

                  <ul className="location-select custom-height">
                    <li>
                      <a href="javascript:void(0)">
                        <h6>Alabama</h6>
                        <span>Min: $130</span>
                      </a>
                    </li>

                    <li>
                      <a href="javascript:void(0)">
                        <h6>Arizona</h6>
                        <span>Min: $150</span>
                      </a>
                    </li>

                    <li>
                      <a href="javascript:void(0)">
                        <h6>California</h6>
                        <span>Min: $110</span>
                      </a>
                    </li>

                    <li>
                      <a href="javascript:void(0)">
                        <h6>Colorado</h6>
                        <span>Min: $140</span>
                      </a>
                    </li>

                    <li>
                      <a href="javascript:void(0)">
                        <h6>Florida</h6>
                        <span>Min: $160</span>
                      </a>
                    </li>

                    <li>
                      <a href="javascript:void(0)">
                        <h6>Georgia</h6>
                        <span>Min: $120</span>
                      </a>
                    </li>

                    <li>
                      <a href="javascript:void(0)">
                        <h6>Kansas</h6>
                        <span>Min: $170</span>
                      </a>
                    </li>

                    <li>
                      <a href="javascript:void(0)">
                        <h6>Minnesota</h6>
                        <span>Min: $120</span>
                      </a>
                    </li>

                    <li>
                      <a href="javascript:void(0)">
                        <h6>New York</h6>
                        <span>Min: $110</span>
                      </a>
                    </li>

                    <li>
                      <a href="javascript:void(0)">
                        <h6>Washington</h6>
                        <span>Min: $130</span>
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* <!-- Location Modal End -->

    <!-- Edit Profile Start --> */}
        <div className="modal fade theme-modal" id="editProfile" tabIndex="-1">
          <div className="modal-dialog modal-lg modal-dialog-centered modal-fullscreen-sm-down">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel2">
                  Edit Profile
                </h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal">
                  <i className="fa-solid fa-xmark"></i>
                </button>
              </div>
              <div className="modal-body">
                <div className="row g-4">
                  <div className="col-xxl-12">
                    <form>
                      <div className="form-floating theme-form-floating">
                        <input type="text" className="form-control" id="pname" defaultValue="Jack Jennas" />
                        <label htmlFor="pname">Full Name</label>
                      </div>
                    </form>
                  </div>

                  <div className="col-xxl-6">
                    <form>
                      <div className="form-floating theme-form-floating">
                        <input type="email" className="form-control" id="email1" defaultValue="vicki.pope@gmail.com" />
                        <label htmlFor="email1">Email address</label>
                      </div>
                    </form>
                  </div>

                  <div className="col-xxl-6">
                    <form>
                      <div className="form-floating theme-form-floating">
                        <input
                          className="form-control"
                          type="tel"
                          defaultValue="4567891234"
                          name="mobile"
                          id="mobile"
                          maxLength="10"
                          onInput={(e) => {
                            const maxLength = 10;
                            if (e.target.value.length > maxLength) {
                              e.target.value = e.target.value.slice(0, maxLength);
                            }
                          }}
                        />
                        <label htmlFor="mobile">Email address</label>
                      </div>
                    </form>
                  </div>

                  <div className="col-12">
                    <form>
                      <div className="form-floating theme-form-floating">
                        <input
                          type="text"
                          className="form-control"
                          id="address1"
                          defaultValue="8424 James Lane South San Francisco"
                        />
                        <label htmlFor="address1">Add Address</label>
                      </div>
                    </form>
                  </div>

                  <div className="col-12">
                    <form>
                      <div className="form-floating theme-form-floating">
                        <input type="text" className="form-control" id="address2" defaultValue="CA 94080" />
                        <label htmlFor="address2">Add Address 2</label>
                      </div>
                    </form>
                  </div>

                  <div className="col-xxl-4">
                    <form>
                      <div className="form-floating theme-form-floating">
                        <select className="form-select" id="floatingSelect1" defaultValue="">
                          <option value="" disabled>
                            Choose Your Country
                          </option>
                          <option value="kingdom">United Kingdom</option>
                          <option value="states">United States</option>
                          <option value="fra">France</option>
                          <option value="china">China</option>
                          <option value="spain">Spain</option>
                          <option value="italy">Italy</option>
                          <option value="turkey">Turkey</option>
                          <option value="germany">Germany</option>
                          <option value="russian">Russian Federation</option>
                          <option value="malay">Malaysia</option>
                          <option value="mexico">Mexico</option>
                          <option value="austria">Austria</option>
                          <option value="hong">Hong Kong SAR, China</option>
                          <option value="ukraine">Ukraine</option>
                          <option value="thailand">Thailand</option>
                          <option value="saudi">Saudi Arabia</option>
                          <option value="canada">Canada</option>
                          <option value="singa">Singapore</option>
                        </select>
                        <label htmlFor="floatingSelect">Country</label>
                      </div>
                    </form>
                  </div>

                  <div className="col-xxl-4">
                    <form>
                      <div className="form-floating theme-form-floating">
                        <select className="form-select" id="floatingSelect" defaultValue="">
                          <option value="">Choose Your City</option>
                          <option value="kingdom">India</option>
                          <option value="states">Canada</option>
                          <option value="fra">Dubai</option>
                          <option value="china">Los Angeles</option>
                          <option value="spain">Thailand</option>
                        </select>
                        <label htmlFor="floatingSelect">City</label>
                      </div>
                    </form>
                  </div>

                  <div className="col-xxl-4">
                    <form>
                      <div className="form-floating theme-form-floating">
                        <input type="text" className="form-control" id="address3" defaultValue="94080" />
                        <label htmlFor="address3">Pin Code</label>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-animation btn-md fw-bold" data-bs-dismiss="modal">
                  Close
                </button>
                <button type="button" data-bs-dismiss="modal" className="btn theme-bg-color btn-md fw-bold text-light">
                  Save changes
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* <!-- Edit Profile End -->

    <!-- Edit Card Start --> */}
        <div className="modal fade theme-modal" id="editCard" tabIndex="-1">
          <div className="modal-dialog modal-lg modal-dialog-centered modal-fullscreen-sm-down">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel8">
                  Edit Card
                </h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal">
                  <i className="fa-solid fa-xmark"></i>
                </button>
              </div>
              <div className="modal-body">
                <div className="row g-4">
                  <div className="col-xxl-6">
                    <form>
                      <div className="form-floating theme-form-floating">
                        <input type="text" className="form-control" id="finame" defaultValue="Mark" />
                        <label htmlFor="finame">First Name</label>
                      </div>
                    </form>
                  </div>

                  <div className="col-xxl-6">
                    <form>
                      <div className="form-floating theme-form-floating">
                        <input type="text" className="form-control" id="laname" defaultValue="Jecno" />
                        <label htmlFor="laname">Last Name</label>
                      </div>
                    </form>
                  </div>

                  <div className="col-xxl-4">
                    <form>
                      <div className="form-floating theme-form-floating">
                        <select className="form-select" id="floatingSelect12" defaultValue="">
                          <option value="">Card Type</option>
                          <option value="kingdom">Visa Card</option>
                          <option value="states">MasterCard Card</option>
                          <option value="fra">RuPay Card</option>
                          <option value="china">Contactless Card</option>
                          <option value="spain">Maestro Card</option>
                        </select>
                        <label htmlFor="floatingSelect12">Card Type</label>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-animation btn-md fw-bold" data-bs-dismiss="modal">
                  Cancel
                </button>
                <button type="button" className="btn theme-bg-color btn-md fw-bold text-light">
                  Update Card
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* <!-- Edit Card End --> */}

        {/* <!-- Remove Profile Modal Start --> */}
        <div className="modal fade theme-modal remove-profile" id="removeProfile" tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered modal-fullscreen-sm-down">
            <div className="modal-content">
              <div className="modal-header d-block text-center">
                <h5 className="modal-title w-100" id="exampleModalLabel22">
                  Are You Sure ?
                </h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal">
                  <i className="fa-solid fa-xmark"></i>
                </button>
              </div>
              <div className="modal-body">
                <div className="remove-box">
                  <p>
                    The permission for the use/group, preview is inherited from the object, object will create a new
                    permission for this object
                  </p>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-animation btn-md fw-bold" data-bs-dismiss="modal">
                  No
                </button>
                <button
                  type="button"
                  className="btn theme-bg-color btn-md fw-bold text-light"
                  data-bs-target="#removeAddress"
                  data-bs-toggle="modal"
                >
                  Yes
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="modal fade theme-modal remove-profile" id="removeAddress" tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered modal-fullscreen-sm-down">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title text-center" id="exampleModalLabel12">
                  Done!
                </h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal">
                  <i className="fa-solid fa-xmark"></i>
                </button>
              </div>
              <div className="modal-body">
                <div className="remove-box text-center">
                  <h4 className="text-content">It's Removed.</h4>
                </div>
              </div>
              <div className="modal-footer pt-0">
                <button type="button" className="btn theme-bg-color btn-md fw-bold text-light" data-bs-dismiss="modal">
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* <!-- Remove Profile Modal End --> */}

        {/* <!-- Edit Profile Modal Start --> */}
        <div className="modal fade theme-modal" id="edit-profile" tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered modal-fullscreen-sm-down">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel3">
                  Edit Your Profile
                </h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal">
                  <i className="fa-solid fa-xmark"></i>
                </button>
              </div>
              <div className="modal-body">
                <form>
                  <div className="mb-3">
                    <label htmlFor="companyName" className="form-label">
                      Company Name
                    </label>
                    <input type="text" className="form-control" id="companyName" defaultValue="Grocery Store" />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="emailAddress" className="form-label">
                      Email Address
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      id="emailAddress"
                      defaultValue="joshuadbass@rhyta.com"
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="country" className="form-label">
                      Country / Region
                    </label>
                    <input type="text" className="form-control" id="country" defaultValue="107 Veltri Drive" />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="established" className="form-label">
                      Year Established
                    </label>
                    <input type="email" className="form-control" id="established" defaultValue="2022" />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="employees" className="form-label">
                      Total Employees
                    </label>
                    <input type="text" className="form-control" id="employees" defaultValue="154 - 360 People" />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="category" className="form-label">
                      Category
                    </label>
                    <input type="email" className="form-control" id="category" defaultValue="Grocery" />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="street" className="form-label">
                      Street Address
                    </label>
                    <input type="text" className="form-control" id="street" defaultValue="234 High St" />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="city" className="form-label">
                      City / State
                    </label>
                    <input type="email" className="form-control" id="city" defaultValue="107 Veltri Drive" />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="zip" className="form-label">
                      Zip
                    </label>
                    <input type="text" className="form-control" id="zip" defaultValue="B23 6SN" />
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-animation btn-md fw-bold" data-bs-dismiss="modal">
                  Cancel
                </button>
                <button type="button" className="btn theme-bg-color btn-md fw-bold text-light" data-bs-dismiss="modal">
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* end */}
      </div>
    </ImporterLayout>
  );
};

export default ImporterDashboard;

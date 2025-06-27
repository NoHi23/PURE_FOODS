import React, { useState, useEffect } from "react";
import ImporterLayout from "../../layouts/ImporterLayout";
import axios from "axios";
import Tab from "./Tab";
import ImporterProduct from "./ImporterProduct";
import ImporterSetting from "./ImporterSetting";
import ImporterProfile from "./ImporterProfile";
import ImporterInventoryLog from "./ImporterInventoryLog";

const ImporterDashboard = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [products, setProducts] = useState([]);
  const [logs, setLogs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [countProduct, setCountProduct] = useState(0);
  const [countSupplier, setCountSupplier] = useState(0);
  const [supplierList, setSupplierList] = useState([]);

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
    axios
      .get("http://localhost:8082/PureFoods/api/supplier/getAll")
      .then((res) => {
        if (res.data && res.data.suppliers) {
          setSupplierList(res.data.suppliers);
        }
      })
      .catch((err) => console.error("Lỗi khi load supplier:", err));
    axios
      .get("http://localhost:8082/PureFoods/api/product/count")
      .then((res) => {
        if (res.data && res.data.countProduct !== undefined) {
          setCountProduct(res.data.countProduct);
        }
      })
      .catch((err) => {
        console.error("Lỗi khi lấy số lượng sản phẩm:", err);
      });
    axios
      .get("http://localhost:8082/PureFoods/api/supplier/count")
      .then((res) => {
        if (res.data && res.data.countSupplier !== undefined) {
          console.log("Đếm Supplier lần 1:", res.data.countSupplier);
          setCountSupplier(res.data.countSupplier);
          console.log("Đếm Supplier sau khi setCountSupplier:", res.data.countSupplier);
        }
      })
      .catch((err) => {
        console.error("Lỗi khi lấy số lượng sản phẩm:", err);
      });
  }, []);

  return (
    <ImporterLayout>
      <div>
        <section className="user-dashboard-section section-b-space">
          <div className="container-fluid-lg">
            <div className="row">
              {/* Thanh điều hướng bên trái */}
              <Tab user={user} />
              {/* Kết thúc thanh điều hướng bên trái */}

              <div className="col-xxl-9 col-lg-8">
                <div className="dashboard-right-sidebar">
                  <div className="tab-content" id="pills-tabContent">
                    {/* Phần tổng quan dashboard */}
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
                                  <h5>Tổng sản phẩm tồn kho</h5>
                                  <h3>{countProduct}</h3>
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
                          <div className="col-xxl-12 mb-4">
                            <div className="table-responsive dashboard-bg-box">
                              <div className="dashboard-title mb-4 d-flex align-items-center gap-2">
                                <h3>
                                  Đang hợp tác với <span className="text-danger fw-bold">{countSupplier}</span> nhà cung
                                  cấp
                                  <i className="fa-solid fa-arrow-down ms-2 text-muted"></i>
                                </h3>
                              </div>
                              <table className="table order-table">
                                <thead>
                                  <tr>
                                    <th scope="col">Tên Công Ty</th>
                                    <th scope="col">Liên Hệ</th>
                                    <th scope="col">Điện thoại</th>
                                    <th scope="col">Email</th>
                                    <th scope="col">Địa chỉ</th>
                                    <th scope="col">Chứng chỉ</th>
                                    <th scope="col">Trạng thái</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {supplierList.map((supplier, index) => (
                                    <tr key={index}>
                                      <td>{supplier.supplierName}</td>
                                      <td>{supplier.contactName}</td>
                                      <td>{supplier.phone}</td>
                                      <td>{supplier.email}</td>
                                      <td>{supplier.address}</td>
                                      <td>
                                        {supplier.organicCertification ? (
                                          supplier.organicCertification
                                        ) : (
                                          <span className="text-danger">Chưa có</span>
                                        )}
                                      </td>
                                      <td>
                                        <label className={supplier.status === 1 ? "success" : "danger"}>
                                          {supplier.status === 1 ? "Hợp tác" : "Dừng"}
                                        </label>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>

                          <div className="col-xxl-12 mb-4">
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
                        setLogs={setLogs}
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

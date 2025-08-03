import React, { useState, useEffect } from "react";
import ExporterLayout from "../../layouts/ExporterLayout";
import axios from "axios";
import Tab from "./Tab";
import ExporterProduct from "./ExporterProduct";
import ExporterInventoryLog from "./ExporterInventoryLog";
import ExporterProfile from "./ExporterProfile";
import ExporterSetting from "./ExporterSetting";

const ExporterDashboard = () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [products, setProducts] = useState([]);
  const [logs, setLogs] = useState([]);
  const [recentLogs, setRecentLogs] = useState([]);
  const [pendingCount, setPendingCount] = useState(0);
  const [rejectedCount, setRejectedCount] = useState(0);
  const [finishedCount, setFinishedCount] = useState(0);
  const [deliveringCount, setDeliveringCount] = useState(0); // Thêm trạng thái đang giao hàng
  const [productMap, setProductMap] = useState({});
  const [userMap, setUserMap] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [countProduct, setCountProduct] = useState(0);
  const [countSupplier, setCountSupplier] = useState(0);
  const [supplierList, setSupplierList] = useState([]);

  useEffect(() => {
    const headers = { Authorization: `Bearer ${user.token}` };

    // Lấy danh sách sản phẩm
    axios
      .get("http://localhost:8082/PureFoods/api/product/getAll", { headers })
      .then((res) => {
        setProducts(res.data.listProduct || []);
      })
      .catch((err) => {
        console.error("Lỗi khi lấy dữ liệu sản phẩm:", err);
      });

    // Lấy danh sách nhà cung cấp
    axios
      .get("http://localhost:8082/PureFoods/api/supplier/getAll", { headers })
      .then((res) => {
        setSupplierList(res.data.suppliers || []);
      })
      .catch((err) => console.error("Lỗi khi load supplier:", err));

    // Lấy số lượng sản phẩm
    axios
      .get("http://localhost:8082/PureFoods/api/product/count", { headers })
      .then((res) => {
        setCountProduct(res.data.countProduct || 0);
      })
      .catch((err) => {
        console.error("Lỗi khi lấy số lượng sản phẩm:", err);
      });

    // Lấy số lượng nhà cung cấp
    axios
      .get("http://localhost:8082/PureFoods/api/supplier/count", { headers })
      .then((res) => {
        setCountSupplier(res.data.countSupplier || 0);
      })
      .catch((err) => {
        console.error("Lỗi khi lấy số lượng nhà cung cấp:", err);
      });

    // Lấy dữ liệu đơn hàng và logs
    Promise.all([
      axios.get("http://localhost:8082/PureFoods/api/exporter/requests", { headers }),
      axios.get("http://localhost:8082/PureFoods/api/exporter/history", { headers }),
      axios.get("http://localhost:8082/PureFoods/api/product/getAll", { headers }),
      axios.get("http://localhost:8082/PureFoods/api/users/getAll", { headers }),
    ])
      .then(([requestsRes, logRes, productRes, userRes]) => {
        const requests = requestsRes.data.requests || [];
        setPendingCount(requests.filter((r) => r.statusID === 1).length);
        setFinishedCount(requests.filter((r) => r.statusID === 3).length);
        setDeliveringCount(requests.filter((r) => r.statusID === 4).length); // Thêm trạng thái 4
        setRejectedCount(requests.filter((r) => r.statusID === 5).length);

        const logs = logRes.data.history || [];
        setRecentLogs(logs.slice(-10).reverse());
        setLogs(logs);

        const productMapTemp = {};
        productRes.data.listProduct?.forEach((p) => {
          productMapTemp[p.productId] = p.productName;
        });
        setProductMap(productMapTemp);

        const userMapTemp = {};
        userRes.data.userList?.forEach((u) => {
          userMapTemp[u.userId] = u.fullName;
        });
        setUserMap(userMapTemp);
      })
      .catch((err) => {
        console.error("Lỗi khi lấy dữ liệu:", err);
      });
  }, []);

  if (!user || user.roleID !== 5) {
    return <div className="text-danger">Vui lòng đăng nhập với tài khoản Exporter.</div>;
  }

  return (
    <ExporterLayout>
      <section className="user-dashboard-section section-b-space">
        <div className="container-fluid-lg">
          <div className="row">
            <Tab user={user} />
            <div className="col-xxl-9 col-lg-8">
              <div className="dashboard-right-sidebar">
                <div className="tab-content" id="pills-tabContent">
                  <div className="tab-pane fade show active" id="pills-dashboard" role="tabpanel">
                    <div className="dashboard-home">
                      <div className="title">
                        <h2>Trang quản lý Xuất Hàng</h2>
                        <span className="title-leaf">
                          <svg className="icon-width bg-gray">
                            <use href="../assets/svg/leaf.svg#leaf"></use>
                          </svg>
                        </span>
                      </div>
                      <div className="dashboard-user-name">
                        <p
                          className="text-content"
                          style={{ color: "#0da385", fontFamily: "Inconsolata, monospace" }}
                        >
                          Tại đây, bạn có thể theo dõi toàn bộ hoạt động xuất hàng mới nhất, quản lý sản phẩm trong
                          kho, và kiểm tra nhanh các thay đổi liên quan đến toàn bộ hoạt động kho bãi.
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
                          <div className="col-xxl-5 col-lg-6 col-md-4 col-sm-6">
                            <div className="total-contain">
                              <img src="../assets/images/svg/wishlist.svg" className="img-1 blur-up lazyload" alt="" />
                              <img src="../assets/images/svg/wishlist.svg" className="blur-up lazyload" alt="" />
                              <div className="total-detail">
                                <h5>Đơn chưa hoàn thành</h5>
                                <h3>
                                  <span style={{ color: "#fbb03b", fontWeight: "bold" }}>
                                    {pendingCount} chờ xử lý
                                  </span>{" "}
                                  /{" "}
                                  <span style={{ color: "#ff4d4f", fontWeight: "bold" }}>
                                    {rejectedCount} đã hủy
                                  </span>{" "}
                                  /{" "}
                                  <span style={{ color: "#007bff", fontWeight: "bold" }}>
                                    {deliveringCount} đang giao
                                  </span>
                                </h3>
                              </div>
                            </div>
                          </div>
                          <div className="col-xxl-3 col-lg-6 col-md-4 col-sm-6">
                            <div className="total-contain">
                              <img src="../assets/images/svg/pending.svg" className="img-1 blur-up lazyload" alt="" />
                              <img src="../assets/images/svg/pending.svg" className="blur-up lazyload" alt="" />
                              <div className="total-detail">
                                <h5>Tổng xuất kho</h5>
                                <h3>{finishedCount}</h3>
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
                              <h3>10 Đơn xuất hàng gần đây</h3>
                              <p style={{ color: "#f98050", marginTop: "5px", fontFamily: "Inconsolata, monospace" }}>
                                (*)Truy cập vào lịch sử xuất hàng để xem toàn bộ lịch sử giao dịch.
                              </p>
                            </div>
                            <div className="table-responsive">
                              <table className="table order-table">
                                <thead>
                                  <tr>
                                    <th scope="col">ID</th>
                                    <th scope="col">Sản phẩm</th>
                                    <th scope="col">Người xuất</th>
                                    <th scope="col">Số lượng</th>
                                    <th scope="col">Trạng thái</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {recentLogs.length > 0 ? (
                                    recentLogs.map((log, index) => {
                                      const statusText =
                                        log.status === 1
                                          ? "Đang chờ xử lý"
                                          : log.status === 2
                                          ? "Đang xử lý"
                                          : log.status === 3
                                          ? "Hoàn thành"
                                          : log.status === 4
                                          ? "Đang giao hàng"
                                          : log.status === 5
                                          ? "Đã hủy"
                                          : "Không rõ";
                                      const statusClass =
                                        log.status === 1
                                          ? "warning"
                                          : log.status === 2
                                          ? "info"
                                          : log.status === 3
                                          ? "success"
                                          : log.status === 4
                                          ? "primary"
                                          : log.status === 5
                                          ? "danger"
                                          : "unknown";

                                      return (
                                        <tr key={index}>
                                          <td>#{log.logId}</td>
                                          <td>
                                            <h6>{productMap[log.productId] || "Không rõ"}</h6>
                                          </td>
                                          <td>
                                            <h6>{userMap[log.userId] || "Không rõ"}</h6>
                                          </td>
                                          <td>
                                            <h6>{log.quantityChange || "không rõ"}</h6>
                                          </td>
                                          <td>
                                            <label className={statusClass}>{statusText}</label>
                                          </td>
                                        </tr>
                                      );
                                    })
                                  ) : (
                                    <tr>
                                      <td colSpan="5" className="text-center">
                                        Không có đơn xuất hàng nào gần đây.
                                      </td>
                                    </tr>
                                  )}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="tab-pane fade" id="pills-product" role="tabpanel">
                    <ExporterProduct
                      setProducts={setProducts}
                      currentPage={currentPage}
                      setCurrentPage={setCurrentPage}
                    />
                  </div>
                  <div className="tab-pane fade" id="pills-order" role="tabpanel">
                    <ExporterInventoryLog
                      currentPage={currentPage}
                      setCurrentPage={setCurrentPage}
                      setRequests={setLogs}
                    />
                  </div>
                  <div className="tab-pane fade" id="pills-profile" role="tabpanel">
                    <ExporterProfile user={user} />
                  </div>
                  <div className="tab-pane fade" id="pills-security" role="tabpanel">
                    <ExporterSetting />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </ExporterLayout>
  );
};

export default ExporterDashboard;
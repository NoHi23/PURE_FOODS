import React, { useState, useEffect } from "react";
import ExporterLayout from '../../layouts/ExporterLayout';
import Tab from "./Tab";
import ExporterProduct from "./ExporterProduct";
import ExporterSetting from "./ExporterSetting";
import ExporterProfile from "./ExporterProfile";
import ExporterInventoryLog from "./ExporterInventoryLog";
import axios from "axios";
import { toast } from "react-toastify";
import { FiSearch } from "react-icons/fi";
import CreateOrder from "./CreateOrder";

const ExporterDashboard = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [orders, setOrders] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [pendingCount, setPendingCount] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const [productMap, setProductMap] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1); // Thêm state cho pagination nếu cần

  useEffect(() => {
    if (!user) {
      toast.error("Vui lòng đăng nhập!");
      return;
    }
    const fetchData = async () => {
      const exporterId = user?.userID || 1;
      try {
        const [ordersRes, transactionsRes, productsRes] = await Promise.all([
          axios.get(`http://localhost:8082/PureFoods/api/exporter/orders/${exporterId}?page=0&size=10`),
          axios.get(`http://localhost:8082/PureFoods/api/exporter/transactions/${exporterId}?page=0&size=10`),
          axios.get(`http://localhost:8082/PureFoods/api/product/getAll`),
        ]);
        setOrders(ordersRes.data || []);
        setTransactions(transactionsRes.data || []);
        const pending = (ordersRes.data || []).filter((o) => o.statusID === 6 || o.statusID === 7).length;
        const completed = (ordersRes.data || []).filter((o) => o.statusID === 3).length;
        setPendingCount(pending);
        setCompletedCount(completed);
        const productMapTemp = {};
        productsRes.data.listProduct?.forEach((p) => {
          productMapTemp[p.productId] = p.productName;
        });
        setProductMap(productMapTemp);
      } catch (err) {
        toast.error("Lỗi khi lấy dữ liệu: " + (err.response?.data?.message || err.message));
      }
    };
    fetchData();
  }, [user]);

  const handleSearch = async () => {
    try {
      const res = await axios.get(`http://localhost:8082/PureFoods/api/exporter/search?keyword=${searchTerm}&page=0&size=10`);
      setOrders(res.data || []);
      toast.success("Tìm kiếm đơn hàng thành công!");
    } catch (err) {
      toast.error("Lỗi tìm kiếm: " + (err.response?.data?.message || err.message));
    }
  };

  if (!user) return <div>Vui lòng đăng nhập để xem dashboard!</div>;

  return (
    <ExporterLayout>
      <section className="user-dashboard-section section-b-space">
        <div className="container-fluid-lg">
          <div className="row">
            <Tab user={user} />
            <div className="col-xxl-9 col-lg-8">
              <div className="dashboard-right-sidebar">
                <div className="tab-content" id="pills-tabContent">
                  <div className="tab-pane fade show active" id="pills-dashboard" role="tabpanel" aria-labelledby="pills-dashboard-tab">
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
                        <p style={{ color: "#0da385", fontFamily: "Inconsolata, monospace" }}>
                          Theo dõi toàn bộ hoạt động xuất hàng, quản lý đơn hàng và kiểm tra giao dịch.
                        </p>
                      </div>

                      <div className="total-box">
                        <div className="row g-sm-4 g-3">
                          <div className="col-xxl-4 col-lg-6 col-md-4 col-sm-6">
                            <div className="total-contain">
                              <img src="../assets/images/svg/order.svg" className="img-1 blur-up lazyload" alt="" />
                              <div className="total-detail">
                                <h5>Tổng đơn hàng</h5>
                                <h3>{orders.length}</h3>
                              </div>
                            </div>
                          </div>
                          <div className="col-xxl-5 col-lg-6 col-md-4 col-sm-6">
                            <div className="total-contain">
                              <img src="../assets/images/svg/wishlist.svg" className="img-1 blur-up lazyload" alt="" />
                              <div className="total-detail">
                                <h5>Đơn đang xử lý</h5>
                                <h3><span style={{ color: "#fbb03b", fontWeight: "bold" }}>{pendingCount}</span></h3>
                              </div>
                            </div>
                          </div>
                          <div className="col-xxl-3 col-lg-6 col-md-4 col-sm-6">
                            <div className="total-contain">
                              <img src="../assets/images/svg/pending.svg" className="img-1 blur-up lazyload" alt="" />
                              <div className="total-detail">
                                <h5>Đơn đã hoàn thành</h5>
                                <h3>{completedCount}</h3>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="row g-4">
                        <div className="col-12 mb-4">
                          <div className="position-relative mb-4">
                            <input
                              type="text"
                              className="form-control pe-5"
                              placeholder="Tìm kiếm đơn hàng..."
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <FiSearch
                              style={{ position: "absolute", right: "15px", top: "50%", transform: "translateY(-50%)", color: "#aaa" }}
                              size={18}
                              onClick={handleSearch}
                            />
                          </div>
                        </div>
                        <div className="col-12 mb-4">
                          <div className="order-tab dashboard-bg-box">
                            <div className="dashboard-title mb-4">
                              <h3>10 Giao dịch gần đây</h3>
                              <p style={{ color: "#f98050", fontFamily: "Inconsolata, monospace" }}>
                                (*)Xem lịch sử xuất hàng để kiểm tra chi tiết giao dịch.
                              </p>
                            </div>
                            <div className="table-responsive">
                              <table className="table order-table">
                                <thead>
                                  <tr>
                                    <th scope="col">ID</th>
                                    <th scope="col">Sản phẩm</th>
                                    <th scope="col">Số lượng</th>
                                    <th scope="col">Thời gian</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {transactions.length > 0 ? (
                                    transactions.slice(0, 10).map((t, index) => (
                                      <tr key={index}>
                                        <td>#{t.transactionId}</td>
                                        <td><h6>{productMap[t.productId] || "Không rõ"}</h6></td>
                                        <td><h6>{t.quantity}</h6></td>
                                        <td><h6>{new Date(t.transactionDate).toLocaleString("vi-VN")}</h6></td>
                                      </tr>
                                    ))
                                  ) : (
                                    <tr>
                                      <td colSpan="4" className="text-center">Không có giao dịch nào.</td>
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
                  <div className="tab-pane fade" id="pills-product" role="tabpanel" aria-labelledby="pills-product-tab">
                    <ExporterProduct currentPage={currentPage} setCurrentPage={setCurrentPage} productMap={productMap} />
                  </div>
                  <div className="tab-pane fade" id="pills-order" role="tabpanel" aria-labelledby="pills-order-tab">
                    <ExporterInventoryLog currentPage={currentPage} setCurrentPage={setCurrentPage} />
                  </div>
                  <div className="tab-pane fade" id="pills-profile" role="tabpanel" aria-labelledby="pills-profile-tab">
                    <ExporterProfile user={user} />
                  </div>
                  <div className="tab-pane fade" id="pills-security" role="tabpanel" aria-labelledby="pills-security-tab">
                    <ExporterSetting />
                  </div>
                  <div className="tab-pane fade" id="pills-create-order" role="tabpanel" aria-labelledby="pills-create-order-tab">
                    <CreateOrder setOrders={setOrders} />
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
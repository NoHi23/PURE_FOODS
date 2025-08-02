import React, { useState, useEffect } from "react";
import ExporterLayout from "../../layouts/ExporterLayout";
import axios from "axios";
import Tab from "./Tab";
import ExporterProduct from "./ExporterProduct";
import ExporterInventoryLog from "./ExporterInventoryLog";
import ExporterProfile from "./ExporterProfile";
import ExporterSetting from "./ExporterSetting";
import ExporterInventory from "./ExporterInventory";
import ExporterNotifications from "./ExporterNotifications";
import ExporterOrderTracking from "./ExporterOrderTracking";
import { toast } from "react-toastify";

const ExporterDashboard = () => {
  const user = JSON.parse(localStorage.getItem("user") || {});
  const [orders, setOrders] = useState([]);  // Chỉ set pending + processing
  const [recentOrders, setRecentOrders] = useState([]);
  const [waitingCount, setWaitingCount] = useState(0);
  const [processingCount, setProcessingCount] = useState(0);
  const [successCount, setSuccessCount] = useState(0);
  const [canceledCount, setCanceledCount] = useState(0);
  const [productMap, setProductMap] = useState({});
  const [userMap, setUserMap] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!user?.userId) {
      toast.error("Vui lòng đăng nhập để truy cập dashboard!");
      window.location.href = "/login";
      return;
    }

    setIsLoading(true);
    Promise.all([
      axios.get("http://localhost:8082/PureFoods/api/exporter/export-requests", { timeout: 5000 }),
      axios.get("http://localhost:8082/PureFoods/api/exporter/export-history", {
        params: { filterType: "success" },
        timeout: 5000,
      }),
      axios.get("http://localhost:8082/PureFoods/api/exporter/export-history", {
        params: { filterType: "cancelled" },
        timeout: 5000,
      }),
      axios.get("http://localhost:8082/PureFoods/api/product/getAll", { timeout: 5000 }),
      axios.get("http://localhost:8082/PureFoods/api/users/getAll", { timeout: 5000 }),
    ])
      .then(([exportRequestsRes, successRes, cancelledRes, productRes, userRes]) => {
        const exportRequests = exportRequestsRes.data.orders || [];  // Chỉ pending + processing
        const successOrders = successRes.data.orders || [];
        const cancelledOrders = cancelledRes.data.orders || [];
        setOrders(exportRequests);  // Chỉ set pending + processing, tổng = exportRequests.length, nếu hết thì 0
        const pendingRecentOrders = exportRequests
          .filter(order => [1, 2].includes(order.statusID))
          .sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate))
          .slice(0, 10);
        setRecentOrders(pendingRecentOrders);
        setWaitingCount(exportRequests.filter((order) => order.statusID === 1).length);
        setProcessingCount(exportRequests.filter((order) => order.statusID === 2).length);
        setSuccessCount(successOrders.length);  // Từ successRes riêng
        setCanceledCount(cancelledOrders.length);  // Từ cancelledRes riêng
        const productMapTemp = {};
        (productRes.data.listProduct || []).forEach((p) => {
          productMapTemp[p.productId] = p.productName;
        });
        setProductMap(productMapTemp);
        const userMapTemp = {};
        (userRes.data.userList || []).forEach((u) => {
          userMapTemp[u.userId] = u.fullName;
        });
        setUserMap(userMapTemp);
      })
      .catch((err) => {
        console.error("Lỗi khi lấy dữ liệu:", err);
        toast.error("Không thể tải dữ liệu! Kiểm tra mạng.");
      })
      .finally(() => setIsLoading(false));
  }, [user?.userId]);

  // useEffect để recalculate counts khi orders thay đổi (chỉ pending + processing)
  useEffect(() => {
    setWaitingCount(orders.filter((order) => order.statusID === 1).length);
    setProcessingCount(orders.filter((order) => order.statusID === 2).length);
    // successCount và canceledCount không thay đổi ở đây, vì chúng từ fetch riêng
    const pendingRecentOrders = orders
      .filter(order => [1, 2].includes(order.statusID))
      .sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate))
      .slice(0, 10);
    setRecentOrders(pendingRecentOrders);
  }, [orders]);

  return (
    <ExporterLayout>
      {isLoading ? (
        <div className="text-center mt-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Đang tải...</span>
          </div>
        </div>
      ) : (
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
                              <use href="/assets/svg/leaf.svg#leaf"></use>
                            </svg>
                          </span>
                        </div>
                        <div className="dashboard-user-name">
                          <p
                            className="text-content"
                            style={{ color: "#0da385", fontFamily: "Inconsolata, monospace" }}
                          >
                            Quản lý các yêu cầu xuất hàng, xác nhận đơn hàng, kiểm tra tồn kho, và theo dõi
                            trạng thái đơn hàng. Dashboard này giúp bạn tối ưu hóa quy trình xuất kho và đưa ra
                            quyết định nhanh chóng.
                          </p>
                        </div>
                        <div className="total-box">
                          <div className="row g-sm-4 g-3">
                            <div className="col-xxl-4 col-lg-6 col-md-4 col-sm-6">
                              <div className="total-contain">
                                <img
                                  src="/assets/images/svg/order.svg"
                                  className="img-1 blur-up lazyload"
                                  alt="Order"
                                />
                                <div className="total-detail">
                                  <h5>Tổng yêu cầu xuất hàng</h5>
                                  <h3>{orders.length}</h3>  {/* Tổng chỉ pending + processing, nếu hết thì 0 */}
                                </div>
                              </div>
                            </div>
                            <div className="col-xxl-5 col-lg-6 col-md-4 col-sm-6">
                              <div className="total-contain">
                                <img
                                  src="/assets/images/svg/wishlist.svg"
                                  className="img-1 blur-up lazyload"
                                  alt="Wishlist"
                                />
                                <div className="total-detail">
                                  <h5>Trạng thái đơn hàng</h5>
                                  <h3>
                                    <span style={{ color: "#fbb03b", fontWeight: "bold" }}>
                                      {waitingCount} chờ xử lý
                                    </span>{" "}
                                    /{" "}
                                    <span style={{ color: "#17a2b8", fontWeight: "bold" }}>
                                      {processingCount} đang xử lý
                                    </span>{" "}
                                    /{" "}
                                    <span style={{ color: "#28a745", fontWeight: "bold" }}>
                                      {successCount} thành công
                                    </span>{" "}
                                    /{" "}
                                    <span style={{ color: "#ff4d4f", fontWeight: "bold" }}>
                                      {canceledCount} hủy
                                    </span>
                                  </h3>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="order-tab dashboard-bg-box">
                          <div className="dashboard-title mb-4">
                            <h3>10 Yêu cầu xuất hàng gần đây</h3>
                            <p
                              style={{
                                color: "#f98050",
                                marginTop: "5px",
                                fontFamily: "Inconsolata, monospace",
                              }}
                            >
                              (*) Truy cập vào lịch sử xuất kho để xem toàn bộ lịch sử yêu cầu xuất hàng.
                            </p>
                          </div>
                          <div className="table-responsive">
                            <table className="table order-table">
                              <thead>
                                <tr>
                                  <th scope="col">ID Đơn hàng</th>
                                  <th scope="col">Khách hàng</th>
                                  <th scope="col">Sản phẩm</th>
                                  <th scope="col">Số lượng</th>
                                  <th scope="col">Trạng thái</th>
                                </tr>
                              </thead>
                              <tbody>
                                {recentOrders.length > 0 ? (
                                  recentOrders.map((order, index) => (
                                    <tr key={index}>
                                      <td>#{order?.orderID}</td>
                                      <td>
                                        <h6>{order?.customerName || "Không rõ"}</h6>
                                      </td>
                                      <td>
                                        <h6>
                                          {order?.orderDetails
                                            ?.map((detail) => productMap[detail.productID] || "Không rõ")
                                            .join(", ") || "Không rõ"}
                                        </h6>
                                      </td>
                                      <td>
                                        <h6>
                                          {order?.orderDetails?.reduce(
                                            (sum, detail) => sum + (detail.quantity || 0),
                                            0
                                          ) || 0}
                                        </h6>
                                      </td>
                                      <td>
                                        <label className={order?.statusID === 1 ? "warning" : "info"}>
                                          {order?.statusID === 1 ? "Chờ xử lý" : "Đang xử lý"}
                                        </label>
                                      </td>
                                    </tr>
                                  ))
                                ) : (
                                  <tr>
                                    <td colSpan="5" className="text-center">
                                      Không có yêu cầu xuất hàng gần đây.
                                    </td>
                                  </tr>
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="tab-pane fade" id="pills-product" role="tabpanel">
                      <ExporterProduct
                        orders={orders}
                        setOrders={setOrders}
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                      />
                    </div>
                    <div className="tab-pane fade" id="pills-order" role="tabpanel">
                      <ExporterInventoryLog
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                      />
                    </div>
                    <div className="tab-pane fade" id="pills-inventory" role="tabpanel">
                      <ExporterInventory
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                      />
                    </div>
                    <div className="tab-pane fade" id="pills-profile" role="tabpanel">
                      <ExporterProfile user={user} />
                    </div>
                    <div className="tab-pane fade" id="pills-security" role="tabpanel">
                      <ExporterSetting />
                    </div>
                    <div className="tab-pane fade" id="pills-notifications" role="tabpanel">
                      <ExporterNotifications />
                    </div>
                    <div className="tab-pane fade" id="pills-order-tracking" role="tabpanel">
                      <ExporterOrderTracking
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </ExporterLayout>
  );
};

export default ExporterDashboard;
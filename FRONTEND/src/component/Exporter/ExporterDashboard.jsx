import React, { useState, useEffect } from "react";
import ExporterLayout from "../../layouts/ExporterLayout";
import Tab from "./Tab";
import ExporterProduct from "./ExporterProduct";
import ExporterSetting from "./ExporterSetting";
import ExporterProfile from "./ExporterProfile";
import ExporterInventoryLog from "./ExporterInventoryLog";
import CreateOrder from "./CreateOrder";
import DriverManagement from "./DriverManagement";
import axios from "axios";
import { toast } from "react-toastify";
import { FiSearch } from "react-icons/fi";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ExporterDashboard = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [orders, setOrders] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [pendingCount, setPendingCount] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const [productMap, setProductMap] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [reportData, setReportData] = useState({ labels: [], datasets: [] });
  const [deliveryReport, setDeliveryReport] = useState({ labels: [], datasets: [] });
  const [statusList, setStatusList] = useState([]);

useEffect(() => {
  if (!user) {
    toast.error("Vui lòng đăng nhập!");
    return;
  }

  const fetchData = async () => {
    const exporterId = user?.userID || 1;

    try {
      const [
        ordersRes,
        transactionsRes,
        productsRes,
        notificationsRes,
        statusRes
      ] = await Promise.all([
        axios.get(`http://localhost:8082/PureFoods/api/exporters`),
        axios.get(`http://localhost:8082/PureFoods/api/inventoryLogs`, {
          params: { userId: exporterId }
        }),
        axios.get(`http://localhost:8082/PureFoods/api/product/getAll`),
        axios.get(`http://localhost:8082/PureFoods/api/notifications/${exporterId}`),
        axios.get(`http://localhost:8082/PureFoods/api/orderStatuses`)
      ]);

      const orders = ordersRes.data || [];
      if (orders.length === 0) {
        toast.warning("Không có dữ liệu đơn hàng để hiển thị.");
        setOrders([]);
        setReportData({ labels: [], datasets: [] });
        setDeliveryReport({ labels: [], datasets: [] });
        return;
      }

      setOrders(orders);
      setTransactions(transactionsRes.data || []);
      setNotifications(notificationsRes.data || []);
      setStatusList(statusRes.data || []);

      const pending = orders.filter((o) => o.statusId === 1 || o.statusId === 2).length;
      const completed = orders.filter((o) => o.statusId === 3).length;
      setPendingCount(pending);
      setCompletedCount(completed);

      const productMapTemp = {};
      productsRes.data?.listProduct?.forEach((p) => {
        productMapTemp[p.productId] = p.productName;
      });
      setProductMap(productMapTemp);

      const report = orders.reduce((acc, o) => {
        const date = new Date(o.orderDate).toLocaleDateString("vi-VN");
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      }, {});
      setReportData({
        labels: Object.keys(report),
        datasets: [
          {
            label: "Số lượng đơn hàng",
            data: Object.values(report),
            backgroundColor: "#0da385"
          }
        ]
      });

      const deliveryStats = orders.reduce(
        (acc, o) => {
          const date = new Date(o.orderDate).toLocaleDateString("vi-VN");
          if (o.statusId === 3) acc.success[date] = (acc.success[date] || 0) + 1;
          if (o.delayReason) acc.delayed[date] = (acc.delayed[date] || 0) + 1;
          return acc;
        },
        { success: {}, delayed: {} }
      );
      setDeliveryReport({
        labels: Object.keys(deliveryStats.success),
        datasets: [
          {
            label: "Giao thành công",
            data: Object.values(deliveryStats.success),
            backgroundColor: "#0da385"
          },
          {
            label: "Giao chậm trễ",
            data: Object.values(deliveryStats.delayed),
            backgroundColor: "#ff5733"
          }
        ]
      });

    } catch (err) {
      console.error("Lỗi khi lấy dữ liệu:", err);
      setReportData({ labels: [], datasets: [] });
      setDeliveryReport({ labels: [], datasets: [] });
      toast.error("Lỗi khi lấy dữ liệu: " + (err.response?.data?.message || err.message));
    }
  };

  fetchData();
}, [user]);
 const handleSearch = async () => {
  if (!searchTerm.trim()) {
    toast.error("Vui lòng nhập từ khóa tìm kiếm!");
    return;
  }
  try {
    const res = await axios.get(`http://localhost:8082/PureFoods/api/exporters/search`, {
      params: { keyword: searchTerm },
    });
    setOrders(res.data || []);
    toast.success("Tìm kiếm đơn hàng thành công!");
  } catch (err) {
    const message = err.response?.status === 404 ? "Không tìm thấy đơn hàng!" : err.response?.data || err.message;
    toast.error("Lỗi tìm kiếm: " + message);
  }
};
 const handleUpdateStatus = async (exporterId, statusId) => {
  if (!exporterId || !statusId || statusId < 1 || statusId > 5) {
    toast.error("Mã đơn hàng hoặc trạng thái không hợp lệ!");
    return;
  }
  try {
    await axios.put(`http://localhost:8082/PureFoods/api/exporters/updateStatus/${exporterId}`, null, {
      params: { statusId },
    });
    setOrders((prev) => prev.map((o) => (o.exporterId === exporterId ? { ...o, statusId } : o)));
    toast.success("Cập nhật trạng thái thành công!");
  } catch (err) {
    const message = err.response?.status === 404 ? "Đơn hàng không tồn tại!" : err.response?.data || err.message;
    toast.error("Cập nhật trạng thái thất bại: " + message);
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
                        <p className="text-content" style={{ color: "#0da385", fontFamily: "Inconsolata, monospace" }}>
                          Tại đây, bạn có thể theo dõi toàn bộ hoạt động xuất hàng mới nhất, quản lý đơn hàng và kiểm tra giao dịch. Dashboard này là trung tâm quản trị giúp bạn tối ưu hoá quy trình xuất hàng, nắm bắt dữ liệu kịp thời và đưa ra quyết định nhanh chóng hơn bao giờ hết. Chọn các liên kết bên trái để xem hoặc chỉnh sửa thông tin.
                        </p>
                      </div>

                      <div className="total-box">
                        <div className="row g-sm-4 g-3">
                          <div className="col-xxl-4 col-lg-6 col-md-4 col-sm-6">
                            <div className="total-contain">
                              <img src="../assets/images/svg/order.svg" className="img-1 blur-up lazyload" alt="" />
                              <img src="../assets/images/svg/order.svg" className="blur-up lazyload" alt="" />
                              <div className="total-detail">
                                <h5>Tổng đơn hàng</h5>
                                <h3>{orders.length}</h3>
                              </div>
                            </div>
                          </div>
                          <div className="col-xxl-4 col-lg-6 col-md-4 col-sm-6">
                            <div className="total-contain">
                              <img src="../assets/images/svg/wishlist.svg" className="img-1 blur-up lazyload" alt="" />
                              <img src="../assets/images/svg/wishlist.svg" className="blur-up lazyload" alt="" />
                              <div className="total-detail">
                                <h5>Đơn đang xử lý</h5>
                                <h3>
                                  <span style={{ color: "#fbb03b", fontWeight: "bold" }}>{pendingCount}</span>
                                </h3>
                              </div>
                            </div>
                          </div>
                          <div className="col-xxl-4 col-lg-6 col-md-4 col-sm-6">
                            <div className="total-contain">
                              <img src="../assets/images/svg/pending.svg" className="img-1 blur-up lazyload" alt="" />
                              <img src="../assets/images/svg/pending.svg" className="blur-up lazyload" alt="" />
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
                              style={{ position: "absolute", right: "15px", top: "50%", transform: "translateY(-50%)", color: "#aaa", cursor: "pointer" }}
                              size={18}
                              onClick={handleSearch}
                            />
                          </div>
                        </div>
                        <div className="col-12 mb-4">
                          <div className="dashboard-bg-box">
                            <div className="dashboard-title mb-4">
                              <h3>Báo cáo đơn hàng</h3>
                            </div>
                            <div id="chart">
                              {reportData.labels.length > 0 && (
                                <Bar
                                  data={reportData}
                                  options={{ responsive: true, plugins: { legend: { position: "top" }, title: { display: true, text: "Số lượng đơn hàng theo ngày" } } }}
                                />
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="col-12 mb-4">
                          <div className="dashboard-bg-box">
                            <div className="dashboard-title mb-4">
                              <h3>Báo cáo hiệu suất giao hàng</h3>
                            </div>
                            <div id="delivery-chart">
                              {deliveryReport.labels.length > 0 && (
                                <Bar
                                  data={deliveryReport}
                                  options={{ responsive: true, plugins: { legend: { position: "top" }, title: { display: true, text: "Hiệu suất giao hàng theo ngày" } } }}
                                />
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="col-12 mb-4">
                          <div className="dashboard-bg-box">
                            <div className="dashboard-title mb-4">
                              <h3>Thông báo</h3>
                              <p style={{ color: "#f98050", marginTop: "5px", fontFamily: "Inconsolata, monospace" }}>
                                (*) Truy cập vào lịch sử xuất hàng để xem toàn bộ lịch sử giao dịch đã được ghi lại trên hệ thống từ trước tới nay!
                              </p>
                            </div>
                            <div className="table-responsive">
                              <table className="table order-table">
                                <thead>
                                  <tr>
                                    <th>Tiêu đề</th>
                                    <th>Nội dung</th>
                                    <th>Thời gian</th>
                                    <th>Trạng thái</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {notifications.length > 0 ? (
                                    notifications.map((n) => (
                                      <tr key={n.id}>
                                        <td>{n.title}</td>
                                        <td>{n.content}</td>
                                        <td>{new Date(n.created_at).toLocaleString("vi-VN")}</td>
                                        <td>{n.is_read ? "Đã đọc" : "Chưa đọc"}</td>
                                      </tr>
                                    ))
                                  ) : (
                                    <tr>
                                      <td colSpan="4" className="text-center">
                                        Không có thông báo
                                      </td>
                                    </tr>
                                  )}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                        <div className="col-12 mb-4">
                          <div className="dashboard-bg-box">
                            <div className="dashboard-title mb-4">
                              <h3>Quản lý trạng thái đơn hàng</h3>
                              <p style={{ color: "#f98050", marginTop: "5px", fontFamily: "Inconsolata, monospace" }}>
                                (*) Cập nhật trạng thái đơn hàng để theo dõi tiến độ xuất hàng.
                              </p>
                            </div>
                            <div className="table-responsive">
                              <table className="table order-table">
                                <thead>
                                  <tr>
                                    <th>Mã đơn</th>
                                    <th>Trạng thái hiện tại</th>
                                    <th>Cập nhật trạng thái</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {orders.length > 0 ? (
                                    orders.map((o) => (
                                      <tr key={o.exporterId}>
                                        <td>#{o.exporterId}</td>
                                        <td>{statusList.find((s) => s.statusId === o.statusId)?.statusName || "Không rõ"}</td>
                                        <td>
                                          <select
                                            onChange={(e) => handleUpdateStatus(o.exporterId, parseInt(e.target.value))}
                                            className="form-control"
                                          >
                                            <option value="">Chọn trạng thái</option>
                                            {statusList.map((s) => (
                                              <option key={s.statusId} value={s.statusId}>
                                                {s.statusName}
                                              </option>
                                            ))}
                                          </select>
                                        </td>
                                      </tr>
                                    ))
                                  ) : (
                                    <tr>
                                      <td colSpan="3" className="text-center">
                                        Không có đơn hàng
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
                    <ExporterProduct currentPage={currentPage} setCurrentPage={setCurrentPage} />
                  </div>
                  <div className="tab-pane fade" id="pills-order" role="tabpanel">
                    <ExporterInventoryLog currentPage={currentPage} setCurrentPage={setCurrentPage} />
                  </div>
                  <div className="tab-pane fade" id="pills-profile" role="tabpanel">
                    <ExporterProfile user={user} />
                  </div>
                  <div className="tab-pane fade" id="pills-security" role="tabpanel">
                    <ExporterSetting />
                  </div>
                  <div className="tab-pane fade" id="pills-create-order" role="tabpanel">
                    <CreateOrder setOrders={setOrders} />
                  </div>
                  <div className="tab-pane fade" id="pills-driver-management" role="tabpanel">
                    <DriverManagement currentPage={currentPage} setCurrentPage={setCurrentPage} />
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
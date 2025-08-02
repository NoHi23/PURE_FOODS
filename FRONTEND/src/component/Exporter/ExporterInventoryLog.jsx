import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiSearch, FiRefreshCw } from "react-icons/fi";
import Pagination from "../../layouts/Pagination";
import FilterStatusLog from "./FilterStatusLog";  // Import component lọc (giữ nguyên)
import Swal from "sweetalert2";
import { toast } from "react-toastify";

const ExporterInventoryLog = ({ currentPage, setCurrentPage }) => {  // Loại bỏ prop orders, setOrders để tránh update parent state
  const [products, setProducts] = useState({});
  const [users, setUsers] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [isLoading, setIsLoading] = useState(false);
  const [localOrders, setLocalOrders] = useState([]);  // Thêm local state để lưu orders, không update parent

  // Hàm fetch lịch sử xuất kho, sửa để setLocalOrders thay vì setOrders, thêm console.log để debug response
  const fetchExportHistory = async () => {
    setIsLoading(true);
    let filterType = null;
    if (selectedStatus === "shipped") filterType = "shipped"; // statusID=3 (thành công)
    else if (selectedStatus === "cancelled") filterType = "cancelled"; // statusID=5 (hủy)
    // all thì filterType=null để hiện tất cả
    try {
      const response = await axios.get("http://localhost:8082/PureFoods/api/exporter/export-history", {
        params: { filterType },
        timeout: 5000,
      });
      console.log("API Response:", response.data);  // Thêm log để kiểm tra dữ liệu trả về từ backend
      if (response.data.status === 200) {
        setLocalOrders(response.data.orders || []);
        toast.success("Lấy lịch sử xuất kho thành công!");
      } else {
        toast.error(response.data.message || "Lấy lịch sử xuất kho thất bại!");
        setLocalOrders([]);  // Reset nếu lỗi
      }
    } catch (err) {
      console.error("Lỗi khi lấy lịch sử xuất kho:", err);  // Log lỗi chi tiết
      toast.error("Không thể tải lịch sử xuất kho! Kiểm tra mạng hoặc backend.");
      setLocalOrders([]);  // Reset nếu lỗi
    } finally {
      setIsLoading(false);
    }
  };

  // useEffect để load dữ liệu ban đầu, giữ nguyên nhưng setLocalOrders
  useEffect(() => {
    setIsLoading(true);
    Promise.all([
      axios.get("http://localhost:8082/PureFoods/api/product/getAll", { timeout: 5000 }),
      axios.get("http://localhost:8082/PureFoods/api/users/getAll", { timeout: 5000 }),
    ])
      .then(([productRes, userRes]) => {
        const productMap = {};
        (productRes.data.listProduct || []).forEach((p) => {
          productMap[p.productId] = { name: p.productName, imageURL: p.imageURL };
        });
        setProducts(productMap);

        const userMap = {};
        (userRes.data.userList || []).forEach((u) => {
          userMap[u.userId] = u.fullName;
        });
        setUsers(userMap);
      })
      .catch((err) => {
        console.error("Lỗi khi lấy dữ liệu sản phẩm/người dùng:", err);
        if (err.code === 'ECONNABORTED') {
          toast.error("Timeout khi lấy dữ liệu sản phẩm/người dùng! Kiểm tra server.");
        } else if (err.response) {
          toast.error(`Lỗi server: ${err.response.data.message || 'Không xác định'}`);
        } else {
          toast.error("Không thể tải dữ liệu sản phẩm/người dùng! Kiểm tra mạng.");
        }
      })
      .finally(() => setIsLoading(false));

    fetchExportHistory();
  }, [selectedStatus]);

  // Hàm refresh, giữ nguyên nhưng gọi fetchExportHistory (bây giờ dùng localOrders)
  const handleRefresh = async () => {
    fetchExportHistory();
  };

  // Lọc orders dựa trên search và status (giữ nguyên: lọc client-side cho statusID chính xác)
  const filteredOrders = localOrders.filter((order) => {  // Sử dụng localOrders thay vì orders
    // Thêm lọc statusID theo selectedStatus (chỉ statusID=3 cho shipped, không hiển thị khác)
    let statusMatch = true;
    if (selectedStatus === "shipped") {
      statusMatch = order.statusID === 3; // Chỉ hiển thị statusID=3, loại bỏ các đơn khác (như 4)
    } else if (selectedStatus === "cancelled") {
      statusMatch = order.statusID === 5; // Chỉ statusID=5 cho cancelled
    }
    // Đối với "all", statusMatch luôn true

    if (!statusMatch) return false; // Nếu không khớp status, bỏ qua order

    // Phần lọc search giữ nguyên
    const customerName = order?.customerName?.toLowerCase() || "";
    const orderId = order?.orderID?.toString() || "";
    const createdAt = order?.orderDate
      ? new Date(order.orderDate).toLocaleString("vi-VN").toLowerCase()
      : "";
    const statusText = order?.statusName?.toLowerCase() || "";
    const productNames = order?.orderDetails
      ?.map((detail) => detail.productName?.toLowerCase() || "")
      .join(" ");
    return (
      customerName.includes(searchTerm.toLowerCase()) ||
      orderId.includes(searchTerm) ||
      createdAt.includes(searchTerm.toLowerCase()) ||
      statusText.includes(searchTerm.toLowerCase()) ||
      productNames.includes(searchTerm.toLowerCase())
    );
  });

  // Pagination, giữ nguyên
  const ordersPerPage = 7;
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
  const indexOfLast = currentPage * ordersPerPage;
  const indexOfFirst = indexOfLast - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirst, indexOfLast);

  // JSX render, giữ nguyên (sử dụng currentOrders từ local)
  return (
    <div className="dashboard-order">
      {isLoading && (
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Đang tải...</span>
          </div>
        </div>
      )}
      <div className="title">
        <h2>Lịch sử xuất kho</h2>
        <span className="title-leaf title-leaf-gray">
          <svg className="icon-width bg-gray">
            <use href="/assets/svg/leaf.svg#leaf"></use>
          </svg>
        </span>
      </div>
      <div className="position-relative mb-4">
        <input
          type="text"
          className="form-control my-3 mb-5"
          placeholder="Tìm kiếm yêu cầu xuất kho..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
        />
        <FiSearch
          style={{
            position: "absolute",
            right: "15px",
            top: "50%",
            transform: "translateY(-50%)",
            color: "#aaa",
            pointerEvents: "none",
          }}
          size={18}
        />
      </div>
      <div className="d-flex justify-content-between align-items-center mb-4 gap-3 flex-wrap">
        <button
          className="btn fw-bold text-white d-flex justify-content-center align-items-center"
          onClick={handleRefresh}
          disabled={isLoading}
          style={{
            backgroundColor: "#007bff",
            border: "1px solid #007bff",
            transition: "all 0.3s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#0056b3";
            e.currentTarget.style.borderColor = "#0056b3";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "#007bff";
            e.currentTarget.style.borderColor = "#007bff";
          }}
        >
          <FiRefreshCw className={`me-2 ${isLoading ? "fa-spin" : ""}`} />
          {isLoading ? "Đang làm mới..." : "Làm mới dữ liệu"}
        </button>
      </div>
      <div className="mt-4 mb-4 border p-3 rounded" style={{ backgroundColor: "#c9daebff" }}>
        <p className="mb-4 fw-bold" style={{ fontSize: "19px", color: "blue" }}>
          📦 Lọc trạng thái:
        </p>
        <FilterStatusLog
          selectedStatus={selectedStatus}
          setSelectedStatus={(value) => {
            setSelectedStatus(value);
            setCurrentPage(1);
          }}
        />
      </div>
      <div className="order-tab dashboard-bg-box">
        <div className="table-responsive">
          <table className="table order-table">
            <thead>
              <tr>
                <th scope="col">ID Đơn hàng</th>
                <th scope="col">Khách hàng</th>
                <th scope="col">Sản phẩm</th>
                <th scope="col">Số lượng</th>
                <th scope="col">Thời gian</th>
                <th scope="col">Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {currentOrders.length > 0 ? (
                currentOrders.map((order, index) => (
                  <tr key={index}>
                    <td>#{order?.orderID}</td>
                    <td>
                      <h6>{order?.customerName || "Không rõ"}</h6>
                    </td>
                    <td>
                      <h6>
                        {order?.orderDetails?.map((detail) => detail.productName || "Không rõ").join(", ") ||
                          "Không rõ"}
                      </h6>
                    </td>
                    <td>
                      <h6>
                        {order?.orderDetails?.reduce((sum, detail) => sum + (detail.quantity || 0), 0) || 0}
                      </h6>
                    </td>
                    <td>
                      <h6>
                        {order?.orderDate
                          ? new Date(order.orderDate).toLocaleString("vi-VN", {
                              year: "numeric",
                              month: "2-digit",
                              day: "2-digit",
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "Chưa có"}
                      </h6>
                    </td>
                    <td>
                      <label
                        className={
                          order?.statusID === 3
                            ? "success"
                            : order?.statusID === 4
                            ? "success"
                            : order?.statusID === 5
                            ? "danger"
                            : "warning"
                        }
                      >
                        {order?.statusName || "Chưa xác định"}
                      </label>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center">
                    Không có lịch sử xuất kho.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      </div>
    </div>
  );
};

export default ExporterInventoryLog;
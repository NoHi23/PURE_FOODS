import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiSearch, FiRefreshCw } from "react-icons/fi";
import Pagination from "../../layouts/Pagination";
import FilterStatusTracking from "./FilterStatus";  // Import component lọc mới
import { toast } from "react-toastify";

const ExporterOrderTracking = ({ currentPage, setCurrentPage }) => {
  const [localOrders, setLocalOrders] = useState([]);  // Local state để lưu orders, tránh update parent
  const [products, setProducts] = useState({});
  const [users, setUsers] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [isLoading, setIsLoading] = useState(false);

  // Hàm fetch đơn hàng, sửa filterType để khớp với các trạng thái đầy đủ, setLocalOrders
  const fetchOrderTracking = async () => {
    setIsLoading(true);
    let filterType = null;
    if (selectedStatus === "pending") filterType = "pending"; // statusID=1
    else if (selectedStatus === "processing") filterType = "processing"; // statusID=2
    else if (selectedStatus === "shipped") filterType = "shipped"; // statusID=3
    else if (selectedStatus === "delivered") filterType = "delivered"; // statusID=4
    else if (selectedStatus === "cancelled") filterType = "cancelled"; // statusID=5
    // all thì filterType=null để hiện tất cả
    try {
      const response = await axios.get("http://localhost:8082/PureFoods/api/exporter/order-tracking", {
        params: { filterType },
        timeout: 5000,
      });
      console.log("API Response:", response.data);  // Log để debug dữ liệu backend
      if (response.data.status === 200) {
        setLocalOrders(response.data.orders || []);
        toast.success("Lấy danh sách đơn hàng xuất kho thành công!");
      } else {
        toast.error(response.data.message || "Lấy danh sách đơn hàng thất bại!");
        setLocalOrders([]);  // Reset nếu lỗi
      }
    } catch (err) {
      console.error("Lỗi khi lấy danh sách đơn hàng:", err);
      toast.error("Không thể tải danh sách đơn hàng! Kiểm tra mạng.");
      setLocalOrders([]);  // Reset nếu lỗi
    } finally {
      setIsLoading(false);
    }
  };

  // useEffect load dữ liệu ban đầu, giữ nguyên nhưng dùng fetchOrderTracking và setLocalOrders
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
          userMap[u.userId] = u;  // Sửa: Lưu toàn bộ user object để kiểm tra roleID và status
        });
        setUsers(userMap);
      })
      .catch((err) => {
        console.error("Lỗi khi lấy dữ liệu:", err);
        toast.error("Không thể tải dữ liệu! Kiểm tra mạng.");
      })
      .finally(() => setIsLoading(false));

    fetchOrderTracking();
  }, [selectedStatus]);

  // Hàm refresh, giữ nguyên
  const handleRefresh = () => {
    fetchOrderTracking();
  };

  // Lọc orders dựa trên search và status (thêm lọc client-side để đảm bảo đúng statusID cho từng vị trí)
  const filteredOrders = localOrders.filter((order) => {
    // Thêm lọc customer: chỉ roleID==2 && status==0
    const customer = users[order.customerID];
    if (!customer || customer.roleID !== 2 || customer.status !== 0) return false;

    // Lọc statusID nghiêm ngặt theo selectedStatus, chỉ hiển thị đúng vị trí
    let statusMatch = true;
    if (selectedStatus === "pending") {
      statusMatch = order.statusID === 1;  // Chỉ chờ xử lý
    } else if (selectedStatus === "processing") {
      statusMatch = order.statusID === 2;  // Chỉ đang xử lý
    } else if (selectedStatus === "shipped") {
      statusMatch = order.statusID === 3;  // Chỉ đã giao hàng
    } else if (selectedStatus === "delivered") {
      statusMatch = order.statusID === 4;  // Chỉ đã giao
    } else if (selectedStatus === "cancelled") {
      statusMatch = order.statusID === 5;  // Chỉ đã hủy
    }
    // Đối với "all", statusMatch luôn true

    if (!statusMatch) return false; // Bỏ qua nếu không khớp

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

  // JSX render, thay FilterStatus bằng FilterStatusTracking, sử dụng currentOrders từ local
  return (
    <div className="order-tracking-tab">
      {isLoading && (
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Đang tải...</span>
          </div>
        </div>
      )}
      <div className="title">
        <h2>Theo dõi đơn hàng xuất kho</h2>
        <span className="title-leaf">
          <svg className="icon-width bg-gray">
            <use href="/assets/svg/leaf.svg#leaf"></use>
          </svg>
        </span>
      </div>
      <div className="position-relative mb-4">
        <input
          type="text"
          className="form-control pe-5"
          placeholder="Tìm kiếm đơn hàng..."
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
          className="btn btn-md fw-bold text-white d-flex align-items-center"
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
          <FiRefreshCw className={`me-1 ${isLoading ? "fa-spin" : ""}`} />
          {isLoading ? "Đang làm mới..." : "Làm mới"}
        </button>
        <div className="mt-4 mb-4 border p-3 rounded" style={{ backgroundColor: "#c9daebff" }}>
          <p className="mb-4 fw-bold" style={{ fontSize: "19px", color: "blue" }}>
            📦 Lọc trạng thái:
          </p>
          <FilterStatusTracking
            selectedStatus={selectedStatus}
            setSelectedStatus={(value) => {
              setSelectedStatus(value);
              setCurrentPage(1);
            }}
          />
        </div>
      </div>
      <div className="table-responsive dashboard-bg-box">
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
                        order?.statusID === 1
                          ? "warning"
                          : order?.statusID === 2
                          ? "info"
                          : order?.statusID === 3
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
                  Không có đơn hàng xuất kho nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      </div>
    </div>
  );
};

export default ExporterOrderTracking;
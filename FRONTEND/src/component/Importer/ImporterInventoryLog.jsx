import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiSearch } from "react-icons/fi";
import Pagination from "../../layouts/Pagination";

const ImporterInventoryLog = ({ currentPage, setCurrentPage, setLogs }) => {
  const [logs, setLocalLogs] = useState([]);
  const [products, setProducts] = useState({});
  const [users, setUsers] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  // Lọc dữ liệu real-time
  const filteredLogs = logs.filter((log) => {
    const productName = products[log.productId]?.name?.toLowerCase() || "";
    const userName = users[log.userId]?.toLowerCase() || "";
    const quantity = log.quantityChange?.toString() || "";
    const reason = log.reason?.toLowerCase() || "";
    const createdAt = log.createdAt ? new Date(log.createdAt).toLocaleString("vi-VN").toLowerCase() : "";
    const statusText = log.status === 0 ? "đang xử lý" : log.status === 1 ? "hoàn thành" : "từ chối";

    return (
      productName.includes(searchTerm.toLowerCase()) ||
      userName.includes(searchTerm.toLowerCase()) ||
      quantity.includes(searchTerm) ||
      reason.includes(searchTerm.toLowerCase()) ||
      createdAt.includes(searchTerm.toLowerCase()) ||
      statusText.includes(searchTerm.toLowerCase())
    );
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [logsRes, productsRes, usersRes] = await Promise.all([
          axios.get("http://localhost:8082/PureFoods/api/inventory-logs/getAll"),
          axios.get("http://localhost:8082/PureFoods/api/product/getAll"),
          axios.get("http://localhost:8082/PureFoods/api/users/getAll"),
        ]);

        const logData = logsRes.data.logs || [];
        setLocalLogs(logData);
        if (setLogs) setLogs(logData);

        const productData = productsRes.data.listProduct || [];
        const productMap = {};
        productData.forEach((p) => {
          productMap[p.productId] = { name: p.productName, imageURL: p.imageURL };
        });
        setProducts(productMap);

        const userData = usersRes.data.userList || [];
        const userMap = {};
        userData.forEach((u) => {
          userMap[u.userId] = u.fullName;
        });
        setUsers(userMap);
      } catch (err) {
        console.error("Lỗi khi lấy dữ liệu:", err);
      }
    };
    fetchData();
  }, [setLogs]);

  const logsPerPage = 7;
  const totalPages = Math.ceil(filteredLogs.length / logsPerPage);
  const indexOfLast = currentPage * logsPerPage;
  const indexOfFirst = indexOfLast - logsPerPage;
  const currentLogs = filteredLogs.slice(indexOfFirst, indexOfLast);

  return (
    <div className="dashboard-order">
      <div className="title">
        <h2>Lịch sử các đơn nhập hàng</h2>
        <span className="title-leaf title-leaf-gray">
          <svg className="icon-width bg-gray">
            <use href="../assets/svg/leaf.svg#leaf"></use>
          </svg>
        </span>
      </div>
      <div className="position-relative mb-4">
        <input
          type="text"
          className="form-control my-3 mb-5"
          placeholder="Nhập bất cứ thứ gì để tìm kiếm..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1); // Reset về trang 1 mỗi khi search
          }}
        />
        <FiSearch
          style={{
            position: "absolute",
            right: "15px",
            top: "50%",
            transform: "translateY(-50%)",
            color: "#aaa",
            pointerEvents: "none", // để icon không ảnh hưởng đến việc gõ
          }}
          size={18}
        />
      </div>

      <div className="order-tab dashboard-bg-box">
        <div className="table-responsive">
          <table className="table order-table">
            <thead>
              <tr>
                <th scope="col">Ảnh</th>
                <th scope="col">Sản phẩm</th>
                <th scope="col">Người nhập</th>
                <th scope="col">Số lượng</th>
                <th scope="col">Lý do</th>
                <th scope="col">Thời gian</th>
                <th scope="col">Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {currentLogs.length > 0 ? (
                currentLogs.map((log, index) => (
                  <tr key={index}>
                    <td>
                      <img
                        src={
                          products[log.productId]?.imageURL ||
                          "https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg"
                        }
                        alt={products[log.productId]?.name || "Chưa xác định"}
                        style={{
                          width: "80px",
                          height: "80px",
                          objectFit: "cover",
                          border: "1px solid #ccc",
                          backgroundColor: "#eee",
                        }}
                        onError={(e) => {
                          e.target.src = "https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg";
                        }}
                      />
                    </td>
                    <td>
                      <h6>{products[log.productId]?.name || "Chưa xác định"}</h6>
                    </td>
                    <td>
                      <h6>{users[log.userId] || `Người nhập: ${log.userId}`}</h6>
                    </td>
                    <td>
                      <h6>{log.quantityChange || 0}</h6>
                    </td>
                    <td>
                      <h6>{log.reason || "Không có lý do"}</h6>
                    </td>
                    <td>
                      <h6>
                        {log.createdAt
                          ? new Date(log.createdAt).toLocaleString("vi-VN", {
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
                      <label className={log.status === 0 ? "warning" : log.status === 1 ? "success" : "danger"}>
                        {log.status === 0 ? "Đang xử lý" : log.status === 1 ? "Hoàn thành" : "Từ chối"}
                      </label>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center">
                    Không có lịch sử nhập hàng.
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

export default ImporterInventoryLog;

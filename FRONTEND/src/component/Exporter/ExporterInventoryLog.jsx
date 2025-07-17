import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiSearch } from "react-icons/fi";
import Pagination from "../../layouts/Pagination";
import { toast } from "react-toastify";

const ExporterInventoryLog = ({ currentPage, setCurrentPage }) => {
  const [transactions, setTransactions] = useState([]);
  const [productMap, setProductMap] = useState({});
  const [userMap, setUserMap] = useState({});
  const [orderMap, setOrderMap] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

  const filteredTransactions = transactions.filter((t) =>
    (productMap[t.productID]?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
    (userMap[t.userId]?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
    t.quantity?.toString().includes(searchTerm) ||
    (orderMap[t.orderID] ? new Date(orderMap[t.orderID]).toLocaleString("vi-VN").toLowerCase() : "").includes(searchTerm.toLowerCase())
  );

  const transactionsPerPage = 7;
  const totalPages = Math.ceil(filteredTransactions.length / transactionsPerPage);
  const indexOfLast = currentPage * transactionsPerPage;
  const indexOfFirst = indexOfLast - transactionsPerPage;
  const currentTransactions = filteredTransactions.slice(indexOfFirst, indexOfLast);

  useEffect(() => {
    const fetchData = async () => {
      const exporterId = JSON.parse(localStorage.getItem("user"))?.userID || 1;
      try {
        const [transactionsRes, productsRes, usersRes, ordersRes] = await Promise.all([
          axios.get(`http://localhost:8082/PureFoods/api/exporter/transactions/${exporterId}?page=0&size=10`),
          axios.get(`http://localhost:8082/PureFoods/api/product/getAll`),
          axios.get(`http://localhost:8082/PureFoods/api/users/getAll`),
          axios.get(`http://localhost:8082/PureFoods/api/exporter/orders/${exporterId}?page=0&size=10`),
        ]);
        setTransactions(transactionsRes.data || []);
        const productMapTemp = {};
        productsRes.data.listProduct?.forEach((p) => {
          productMapTemp[p.productId] = p.productName;
        });
        setProductMap(productMapTemp);
        const userMapTemp = {};
        usersRes.data.userList?.forEach((u) => {
          userMapTemp[u.userId] = u.fullName;
        });
        setUserMap(userMapTemp);
        const orderMapTemp = {};
        ordersRes.data?.forEach((o) => {
          orderMapTemp[o.orderID] = o.orderDate;
        });
        setOrderMap(orderMapTemp);
      } catch (err) {
        toast.error("Lỗi khi lấy dữ liệu: " + (err.response?.data?.message || err.message));
      }
    };
    fetchData();
  }, []);

  return (
    <div className="dashboard-order">
      <div className="title">
        <h2>Lịch sử xuất hàng</h2>
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
          placeholder="Tìm kiếm giao dịch..."
          value={searchTerm}
          onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
        />
        <FiSearch style={{ position: "absolute", right: "15px", top: "50%", transform: "translateY(-50%)", color: "#aaa", pointerEvents: "none" }} size={18} />
      </div>
      <div className="order-tab dashboard-bg-box">
        <div className="table-responsive">
          <table className="table order-table">
            <thead>
              <tr>
                <th scope="col">Sản phẩm</th>
                <th scope="col">Người xuất</th>
                <th scope="col">Số lượng</th>
                <th scope="col">Thời gian</th>
              </tr>
            </thead>
            <tbody>
              {currentTransactions.length > 0 ? (
                currentTransactions.map((t) => (
                  <tr key={t.orderDetailID}>
                    <td><h6>{productMap[t.productID] || "Không rõ"}</h6></td>
                    <td><h6>{userMap[t.userId] || "Không rõ"}</h6></td>
                    <td><h6>{t.quantity}</h6></td>
                    <td><h6>{orderMap[t.orderID] ? new Date(orderMap[t.orderID]).toLocaleString("vi-VN") : "Không rõ"}</h6></td>
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
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      </div>
    </div>
  );
};

export default ExporterInventoryLog;

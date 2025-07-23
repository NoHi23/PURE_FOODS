import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiSearch } from "react-icons/fi";
import { Modal, Button } from "react-bootstrap";
import Pagination from "../../layouts/Pagination";
import FilterStatus from './FilterStatus';
import Swal from "sweetalert2";
import { toast } from "react-toastify";

const ExporterInventoryLog = ({ currentPage, setCurrentPage }) => {
  const [transactions, setTransactions] = useState([]);
  const [productMap, setProductMap] = useState({});
  const [userMap, setUserMap] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [archivedPage, setArchivedPage] = useState(1);
  const [showArchivedModal, setShowArchivedModal] = useState(false);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [selectedReturnLogs, setSelectedReturnLogs] = useState([]);

  const archivedTransactions = transactions.filter((t) => t.status === 3);

  const filteredTransactions = transactions
    .filter((t) => t.status !== 3)
    .filter((t) => {
      const matchStatus = selectedStatus === "all" ? true : t.status === parseInt(selectedStatus);
      const productName = productMap[t.productId]?.toLowerCase() || "";
      const userName = userMap[t.userId]?.toLowerCase() || "";
      const quantity = t.quantityChange?.toString() || "";
      const reason = t.reason?.toLowerCase() || "";
      const createdAt = t.createdAt ? new Date(t.createdAt).toLocaleString("vi-VN").toLowerCase() : "";
      const statusText = t.status === 0 ? "đang xử lý" : t.status === 1 ? "hoàn thành" : "từ chối";

      return (
        matchStatus &&
        (productName.includes(searchTerm.toLowerCase()) ||
         userName.includes(searchTerm.toLowerCase()) ||
         quantity.includes(searchTerm) ||
         reason.includes(searchTerm.toLowerCase()) ||
         createdAt.includes(searchTerm.toLowerCase()) ||
         statusText.includes(searchTerm.toLowerCase()))
      );
    });

  useEffect(() => {
    const fetchData = async () => {
      const exporterId = JSON.parse(localStorage.getItem("user"))?.userID || 1;
      try {
        const [transactionsRes, productsRes, usersRes] = await Promise.all([
          axios.get(`http://localhost:8082/PureFoods/api/inventoryLogs`, { params: { userId: exporterId } }),
          axios.get(`http://localhost:8082/PureFoods/api/products`),
          axios.get(`http://localhost:8082/PureFoods/api/users/getAll`),
        ]);
        const sortedTransactions = [...(transactionsRes.data || [])].sort((a, b) => {
          if (a.status !== b.status) return a.status - b.status;
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
        setTransactions(sortedTransactions);
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
      } catch (err) {
        toast.error("Lỗi khi lấy dữ liệu: " + (err.response?.data?.message || err.message));
      }
    };
    fetchData();
  }, []);

  const transactionsPerPage = 7;
  const totalPages = Math.ceil(filteredTransactions.length / transactionsPerPage);
  const indexOfLast = currentPage * transactionsPerPage;
  const indexOfFirst = indexOfLast - transactionsPerPage;
  const currentTransactions = filteredTransactions.slice(indexOfFirst, indexOfLast);

  const archivedTotalPages = Math.ceil(archivedTransactions.length / transactionsPerPage);
  const indexOfLastArchived = archivedPage * transactionsPerPage;
  const indexOfFirstArchived = indexOfLastArchived - transactionsPerPage;
  const currentArchivedTransactions = archivedTransactions.slice(indexOfFirstArchived, indexOfLastArchived);

  const handleArchive = async (logId) => {
    try {
      await axios.post(`http://localhost:8082/PureFoods/api/inventoryLogs/archive`, { logId });
      setTransactions((prev) => prev.map((t) => (t.logId === logId ? { ...t, status: 3 } : t)));
      toast.success("Lưu trữ giao dịch thành công!");
    } catch (err) {
      toast.error("Lưu trữ thất bại: " + (err.response?.data?.message || err.message));
    }
  };

 const handleReturn = async () => {
  if (selectedReturnLogs.length === 0) {
    toast.error("Vui lòng chọn ít nhất một đơn hàng để trả!");
    return;
  }
  const exporterId = JSON.parse(localStorage.getItem("user"))?.userID || 1;
  try {
    for (let logId of selectedReturnLogs) {
      const log = transactions.find((t) => t.logId === logId);
      if (log && log.status === 1) {
        await axios.put(`http://localhost:8082/PureFoods/api/exporters/return/${log.orderId}`, null, {
          params: { returnReason: `Trả hàng cho log #${logId}` },
        });
        await axios.put(`http://localhost:8082/PureFoods/api/exporters/updateStock/${exporterId}`, null, {
          params: {
            productId: log.productId,
            quantity: log.quantityChange,
            action: "update",
          },
        });
        await axios.post(`http://localhost:8082/PureFoods/api/inventoryLogs`, {
          productId: log.productId,
          userId: exporterId,
          quantityChange: log.quantityChange,
          reason: `Trả hàng cho log #${logId}`,
        });
      }
    }
    setTransactions((prev) =>
      prev.map((t) =>
        selectedReturnLogs.includes(t.logId) ? { ...t, status: 5, reason: `Trả hàng cho log #${t.logId}` } : t
      )
    );
    Swal.fire({
      icon: "success",
      title: "Đã gửi yêu cầu trả hàng",
      text: "Các đơn được chọn đã được gửi thành công!",
      confirmButtonColor: "#3085d6",
      confirmButtonText: "OK",
    });
    setSelectedReturnLogs([]);
    setShowReturnModal(false);
  } catch (err) {
    toast.error("Yêu cầu trả hàng thất bại: " + (err.response?.data || err.message));
  }
};

  return (
    <div className="dashboard-order">
      <div className="title">
        <h2>Lịch sử xuất/trả hàng</h2>
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
            setCurrentPage(1);
          }}
        />
        <FiSearch
          style={{ position: "absolute", right: "15px", top: "50%", transform: "translateY(-50%)", color: "#aaa", pointerEvents: "none" }}
          size={18}
        />
      </div>
      <div className="d-flex justify-content-between mb-4">
        <button
          className="btn"
          style={{
            backgroundColor: "#f40766ff",
            color: "white",
            fontWeight: "bold",
            transition: "0.2s",
            borderRadius: "8px",
            padding: "10px 18px",
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = "#fdb344ff";
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = "#f40766ff";
          }}
          onClick={() => setShowReturnModal(true)}
        >
          🔁 Yêu cầu trả hàng
        </button>
        <button
          className="btn"
          style={{
            backgroundColor: "#00b894",
            color: "white",
            fontWeight: "bold",
            transition: "0.2s",
            borderRadius: "8px",
            padding: "10px 18px",
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = "#019875";
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = "#00b894";
          }}
          onClick={() => setShowArchivedModal(true)}
        >
          🗃️ Xem các đơn đã lưu trữ
        </button>
      </div>
      <div className="mt-4 mb-4 border p-3 rounded" style={{ backgroundColor: "#c9daebff" }}>
        <p className="mb-4 fw-bold" style={{ fontSize: "19px", color: "blue" }}>
          📦 Lọc trạng thái:
        </p>
        <FilterStatus
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
                <th scope="col">Ảnh</th>
                <th scope="col">Sản phẩm</th>
                <th scope="col">Người thực hiện</th>
                <th scope="col">Số lượng thay đổi</th>
                <th scope="col">Lý do</th>
                <th scope="col">Thời gian</th>
                <th scope="col">Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {currentTransactions.length > 0 ? (
                currentTransactions.map((t) => (
                  <tr key={t.logId}>
                    <td>
                      <img
                        src={productMap[t.productId] ? `http://localhost:8082/PureFoods/images/${productMap[t.productId]}.jpg` : "https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg"}
                        alt={productMap[t.productId]}
                        style={{ width: "80px", height: "80px", objectFit: "cover", border: "1px solid #ccc", backgroundColor: "#eee" }}
                        onError={(e) => { e.target.src = "https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg"; }}
                      />
                    </td>
                    <td>
                      <h6>{productMap[t.productId] || "Không rõ"}</h6>
                    </td>
                    <td>
                      <h6>{userMap[t.userId] || "Không rõ"}</h6>
                    </td>
                    <td>
                      <h6>{t.quantityChange}</h6>
                    </td>
                    <td>
                      <h6>{t.reason || "Không rõ"}</h6>
                    </td>
                    <td>
                      <h6>{new Date(t.createdAt).toLocaleString("vi-VN", { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" })}</h6>
                    </td>
                    <td>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "start" }}>
                        <label className={t.status === 0 ? "warning" : t.status === 1 ? "success" : "danger"}>
                          {t.status === 0 ? "Đang xử lý" : t.status === 1 ? "Hoàn thành" : "Từ chối"}
                        </label>
                        {t.status === 1 && (
                          <button
                            className="btn btn-sm mt-1"
                            style={{
                              backgroundColor: "blue",
                              color: "white",
                              fontSize: "12px",
                              padding: "2px 6px",
                              fontWeight: "bold",
                            }}
                            onMouseEnter={(e) => (e.target.style.backgroundColor = "#bf903aff")}
                            onMouseLeave={(e) => (e.target.style.backgroundColor = "blue")}
                            onClick={() => handleArchive(t.logId)}
                          >
                            📦 Lưu trữ
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center">
                    Không có giao dịch nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      </div>

      <Modal show={showArchivedModal} onHide={() => setShowArchivedModal(false)} size="xl" centered>
        <Modal.Header closeButton>
          <Modal.Title>🗃️ Danh sách các đơn đã lưu trữ</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p style={{ fontSize: "19px", color: "blue", margin: "20px 20px" }}>
            Các đơn hàng <span style={{ color: "green", fontWeight: "bold" }}>ĐÃ HOÀN THÀNH</span> sẽ được lưu trữ ở dưới đây.
            <i className="fa-solid fa-arrow-down ms-2 text-muted"></i>
          </p>
          {currentArchivedTransactions.length === 0 ? (
            <p>Chưa có đơn nào được lưu trữ.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>Ảnh</th>
                    <th>Sản phẩm</th>
                    <th>Người thực hiện</th>
                    <th>Số lượng</th>
                    <th>Lý do</th>
                    <th>Thời gian</th>
                  </tr>
                </thead>
                <tbody>
                  {currentArchivedTransactions.map((t) => (
                    <tr key={t.logId}>
                      <td>
                        <img
                          src={productMap[t.productId] ? `http://localhost:8082/PureFoods/images/${productMap[t.productId]}.jpg` : "https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg"}
                          alt={productMap[t.productId]}
                          style={{ width: "60px", height: "60px", objectFit: "cover", border: "1px solid #ccc" }}
                          onError={(e) => { e.target.src = "https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg"; }}
                        />
                      </td>
                      <td>{productMap[t.productId] || "Không rõ"}</td>
                      <td>{userMap[t.userId] || "Không rõ"}</td>
                      <td>{t.quantityChange}</td>
                      <td>{t.reason || "Không rõ"}</td>
                      <td>{new Date(t.createdAt).toLocaleString("vi-VN", { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" })}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => { setArchivedPage(1); setShowArchivedModal(false); }}>
            Đóng
          </Button>
        </Modal.Footer>
        <Pagination currentPage={archivedPage} totalPages={archivedTotalPages} onPageChange={(page) => setArchivedPage(page)} />
      </Modal>

      <Modal show={showReturnModal} onHide={() => setShowReturnModal(false)} size="xl" centered>
        <Modal.Header closeButton>
          <Modal.Title>🔁 Yêu cầu trả hàng</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="text-primary fw-bold mb-3">
            Tích chọn các đơn hàng cần trả. Chỉ có thể trả các đơn hàng có trạng thái **đã hoàn thành**.
          </p>
          <div className="table-responsive">
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>Chọn</th>
                  <th>Ảnh</th>
                  <th>Sản phẩm</th>
                  <th>Người thực hiện</th>
                  <th>Số lượng</th>
                  <th>Lý do</th>
                  <th>Thời gian</th>
                </tr>
              </thead>
              <tbody>
                {transactions
                  .filter((t) => t.status === 1)
                  .map((t) => (
                    <tr key={t.logId}>
                      <td>
                        <input
                          type="checkbox"
                          style={{ width: "20px", height: "20px" }}
                          checked={selectedReturnLogs.includes(t.logId)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedReturnLogs([...selectedReturnLogs, t.logId]);
                            } else {
                              setSelectedReturnLogs(selectedReturnLogs.filter((id) => id !== t.logId));
                            }
                          }}
                        />
                      </td>
                      <td>
                        <img
                          src={productMap[t.productId] ? `http://localhost:8082/PureFoods/images/${productMap[t.productId]}.jpg` : "https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg"}
                          alt={productMap[t.productId]}
                          style={{ width: "60px", height: "60px", objectFit: "cover", border: "1px solid #ccc" }}
                          onError={(e) => { e.target.src = "https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg"; }}
                        />
                      </td>
                      <td>{productMap[t.productId] || "Không rõ"}</td>
                      <td>{userMap[t.userId] || "Không rõ"}</td>
                      <td>{t.quantityChange}</td>
                      <td>{t.reason || "Không rõ"}</td>
                      <td>{new Date(t.createdAt).toLocaleString("vi-VN", { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" })}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="warning" onClick={() => setShowReturnModal(false)}>
            Đóng
          </Button>
          <Button
            variant="primary"
            onClick={handleReturn}
          >
            ✅ Xác nhận trả hàng
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ExporterInventoryLog;
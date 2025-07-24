import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiSearch, FiRefreshCw, FiCornerUpLeft } from "react-icons/fi";
import { Modal, Button } from "react-bootstrap";
import Pagination from "../../layouts/Pagination";
import FilterStatus from "./FilterStatus";
import Swal from "sweetalert2";

const ImporterInventoryLog = ({ currentPage, setCurrentPage, setLogs }) => {
  const [logs, setLocalLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState({});
  const [users, setUsers] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [archivedPage, setArchivedPage] = useState(1);
  const [showArchivedModal, setShowArchivedModal] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [selectedReturnLogs, setSelectedReturnLogs] = useState([]);
  const [returnReasons, setReturnReasons] = useState({});

  const archivedLogs = logs.filter((log) => log.status === 3);

  // Lọc dữ liệu real-time
  const filteredLogs = logs
    .filter((log) => log.status !== 3) // vẫn loại bỏ đơn đã lưu trữ
    .filter((log) => {
      // 👉 Lọc theo trạng thái nếu có chọn
      const matchStatus = selectedStatus === "all" ? true : log.status === selectedStatus;

      const productName = products[log.productId]?.name?.toLowerCase() || "";
      const userName = users[log.userId]?.toLowerCase() || "";
      const quantity = log.quantityChange?.toString() || "";
      const reason = log.reason?.toLowerCase() || "";
      const createdAt = log.createdAt ? new Date(log.createdAt).toLocaleString("vi-VN").toLowerCase() : "";
      const statusText = log.status === 0 ? "đang xử lý" : log.status === 1 ? "hoàn thành" : "từ chối";

      const matchSearch =
        productName.includes(searchTerm.toLowerCase()) ||
        userName.includes(searchTerm.toLowerCase()) ||
        quantity.includes(searchTerm) ||
        reason.includes(searchTerm.toLowerCase()) ||
        createdAt.includes(searchTerm.toLowerCase()) ||
        statusText.includes(searchTerm.toLowerCase());

      return matchStatus && matchSearch;
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
        const sortedLogs = [...logData].sort((a, b) => {
          // Ưu tiên status 5 đầu tiên
          if (a.status === 5 && b.status !== 5) return -1;
          if (a.status !== 5 && b.status === 5) return 1;

          // Sau đó là các status khác theo thứ tự 0 -> 1 -> 2 -> 4 (nếu có)
          if (a.status !== b.status) return a.status - b.status;

          // Nếu cùng status thì sắp theo thời gian mới nhất trước
          const timeA = new Date(a.createdAt).getTime();
          const timeB = new Date(b.createdAt).getTime();
          return timeB - timeA;
        });

        setLocalLogs(sortedLogs);
        if (setLogs) setLogs(sortedLogs);

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

  const handleRefresh = async () => {
    setIsLoading(true);
    try {
      const [logsRes, productsRes, usersRes] = await Promise.all([
        axios.get("http://localhost:8082/PureFoods/api/inventory-logs/getAll"),
        axios.get("http://localhost:8082/PureFoods/api/product/getAll"),
        axios.get("http://localhost:8082/PureFoods/api/users/getAll"),
      ]);

      const logData = logsRes.data.logs || [];
      const sortedLogs = [...logData].sort((a, b) => {
        if (a.status === 5 && b.status !== 5) return -1;
        if (a.status !== 5 && b.status === 5) return 1;
        if (a.status !== b.status) return a.status - b.status;
        return new Date(b.createdAt) - new Date(a.createdAt);
      });

      setLocalLogs(sortedLogs);
      if (setLogs) setLogs(sortedLogs);

      const productMap = {};
      (productsRes.data.listProduct || []).forEach((p) => {
        productMap[p.productId] = { name: p.productName, imageURL: p.imageURL };
      });
      setProducts(productMap);

      const userMap = {};
      (usersRes.data.userList || []).forEach((u) => {
        userMap[u.userId] = u.fullName;
      });
      setUsers(userMap);

      Swal.fire({
        icon: "success",
        title: "Đã làm mới!",
        text: "Dữ liệu đã được cập nhật thành công.",
        confirmButtonText: "OK",
      });
    } catch (err) {
      console.error("Lỗi khi làm mới:", err);
      Swal.fire({
        icon: "error",
        title: "Lỗi!",
        text: "Làm mới thất bại. Vui lòng thử lại.",
        confirmButtonText: "OK",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const logsPerPage = 7;
  const totalPages = Math.ceil(filteredLogs.length / logsPerPage);
  const indexOfLast = currentPage * logsPerPage;
  const indexOfFirst = indexOfLast - logsPerPage;
  const currentLogs = filteredLogs.slice(indexOfFirst, indexOfLast);

  const archivedTotalPages = Math.ceil(archivedLogs.length / logsPerPage);
  const indexOfLastArchived = archivedPage * logsPerPage;
  const indexOfFirstArchived = indexOfLastArchived - logsPerPage;
  const currentArchivedLogs = archivedLogs.slice(indexOfFirstArchived, indexOfLastArchived);

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
          className="btn d-flex align-items-center gap-2"
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
            e.target.style.backgroundColor = "#d63031";
          }}
          onClick={() => setShowReturnModal(true)}
        >
          <FiCornerUpLeft size={20} /> Yêu cầu trả hàng
        </button>

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
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "start" }}>
                        <label
                          className={
                            log.status === 0
                              ? "warning"
                              : log.status === 1
                              ? "success"
                              : log.status === 2
                              ? "danger"
                              : log.status === 5
                              ? "returned"
                              : "unknown"
                          }
                        >
                          {log.status === 0
                            ? "Đang xử lý"
                            : log.status === 1
                            ? "Hoàn thành"
                            : log.status === 5
                            ? "Trả hàng"
                            : log.status === 2
                            ? "Từ chối"
                            : "không rõ"}
                        </label>
                        {log.status === 1 && (
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
                            onClick={async () => {
                              try {
                                await axios.post("http://localhost:8082/PureFoods/api/inventory-logs/archive", {
                                  logId: log.logId,
                                });
                                const updatedLogs = logs.map((l) => (l.logId === log.logId ? { ...l, status: 3 } : l));
                                setLocalLogs(updatedLogs); // cập nhật lại list log
                              } catch (err) {
                                console.error("Lỗi khi lưu trữ:", err);
                              }
                            }}
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
                    Không có lịch sử nhập hàng.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      </div>

      {/* Modal kho lưu trữ */}
      <Modal show={showArchivedModal} onHide={() => setShowArchivedModal(false)} size="xl" centered>
        <Modal.Header closeButton>
          <Modal.Title>🗃️ Danh sách các đơn đã lưu trữ</Modal.Title>
        </Modal.Header>
        <p style={{ fontSize: "19px", color: "blue", margin: "20px 20px" }}>
          Các đơn hàng <span style={{ color: "green", fontWeight: "bold" }}>ĐÃ HOÀN THÀNH</span> sẽ được lưu trữ ở dưới
          đây.
          <i className="fa-solid fa-arrow-down ms-2 text-muted"></i>
        </p>
        <Modal.Body>
          {archivedLogs.length === 0 ? (
            <p>Chưa có đơn nào được lưu trữ.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>Ảnh</th>
                    <th>Sản phẩm</th>
                    <th>Người nhập</th>
                    <th>Số lượng</th>
                    <th>Lý do</th>
                    <th>Thời gian</th>
                  </tr>
                </thead>
                <tbody>
                  {currentArchivedLogs.map((log, index) => (
                    <tr key={index}>
                      <td>
                        <img
                          src={
                            products[log.productId]?.imageURL ||
                            "https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg"
                          }
                          alt="Ảnh"
                          style={{ width: "60px", height: "60px", objectFit: "cover", border: "1px solid #ccc" }}
                        />
                      </td>
                      <td>{products[log.productId]?.name || "Không rõ"}</td>
                      <td>{users[log.userId] || log.userId}</td>
                      <td>{log.quantityChange}</td>
                      <td>{log.reason || "Không có lý do"}</td>
                      <td>
                        {new Date(log.createdAt).toLocaleString("vi-VN", {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="primary"
            onClick={() => {
              setArchivedPage(1);
              setShowArchivedModal(false);
            }}
          >
            Đóng
          </Button>
        </Modal.Footer>

        <Pagination
          currentPage={archivedPage}
          totalPages={archivedTotalPages}
          onPageChange={(page) => setArchivedPage(page)}
        />
      </Modal>

      {/* Modal yêu cầu trả hàng */}
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
                  <th>Người nhập</th>
                  <th>Số lượng</th>
                  <th>Lý do</th>
                  <th>Thời gian</th>
                </tr>
              </thead>
              <tbody>
                {logs
                  .filter((log) => log.status === 1)
                  .map((log) => (
                    <tr key={log.logId}>
                      <td>
                        <input
                          type="checkbox"
                          style={{ width: "20px", height: "20px" }}
                          checked={selectedReturnLogs.includes(log.logId)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedReturnLogs([...selectedReturnLogs, log.logId]);
                            } else {
                              setSelectedReturnLogs(selectedReturnLogs.filter((id) => id !== log.logId));
                            }
                          }}
                        />
                      </td>
                      <td>
                        <img
                          src={
                            products[log.productId]?.imageURL ||
                            "https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg"
                          }
                          alt="Ảnh"
                          style={{ width: "60px", height: "60px", objectFit: "cover", border: "1px solid #ccc" }}
                        />
                      </td>
                      <td>{products[log.productId]?.name || "Không rõ"}</td>
                      <td>{users[log.userId] || log.userId}</td>
                      <td>{log.quantityChange}</td>
                      <td>
                        <input
                          type="text"
                          className="form-control"
                          required
                          placeholder="Nhập lý do trả hàng"
                          value={returnReasons[log.logId] || ""}
                          onChange={(e) => setReturnReasons({ ...returnReasons, [log.logId]: e.target.value })}
                          disabled={!selectedReturnLogs.includes(log.logId)}
                        />
                      </td>

                      <td>
                        {new Date(log.createdAt).toLocaleString("vi-VN", {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
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
            onClick={async () => {
              for (let logId of selectedReturnLogs) {
                const log = logs.find((l) => l.logId === logId);
                if (log) {
                  try {
                    await axios.post("http://localhost:8082/PureFoods/api/inventory-logs/return-order", {
                      productId: log.productId,
                      userId: log.userId,
                      quantityChange: log.quantityChange,
                      reason: returnReasons[log.logId] || "Không có lý do",
                    });
                  } catch (err) {
                    console.error("Lỗi khi gửi yêu cầu trả hàng:", err);
                  }
                }
              }
              Swal.fire({
                icon: "success",
                title: "Đã gửi yêu cầu trả hàng",
                text: "Các đơn được chọn đã được gửi thành công!",
                confirmButtonColor: "#3085d6",
                confirmButtonText: "OK",
              });

              setSelectedReturnLogs([]);
              setShowReturnModal(false);
              setReturnReasons({});
            }}
          >
            ✅ Xác nhận trả hàng
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ImporterInventoryLog;

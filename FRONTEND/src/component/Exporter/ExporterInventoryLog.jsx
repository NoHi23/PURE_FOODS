import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiSearch, FiRefreshCw } from "react-icons/fi";
import { Modal, Button } from "react-bootstrap";
import Pagination from "../../layouts/Pagination";
import FilterStatus from "./FilterStatus";
import Swal from "sweetalert2";

const ExporterInventoryLog = ({ currentPage, setCurrentPage, setRequests }) => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [logs, setLocalLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState({});
  const [users, setUsers] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [archivedPage, setArchivedPage] = useState(1);
  const [showArchivedModal, setShowArchivedModal] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("all");

  useEffect(() => {
    if (!user || user.roleID !== 5) return;
    const fetchData = async () => {
      try {
        const headers = { Authorization: `Bearer ${user.token}` };
        const [logsRes, productsRes, usersRes] = await Promise.all([
          axios.get("http://localhost:8082/PureFoods/api/exporter/history?productId=0&orderId=0", { headers }),
          axios.get("http://localhost:8082/PureFoods/api/product/getAll", { headers }),
          axios.get("http://localhost:8082/PureFoods/api/users/getAll", { headers }),
        ]);

        if (logsRes.data.status === 200) {
          const logData = logsRes.data.history || [];
          const sortedLogs = [...logData].sort((a, b) => {
            if (a.status !== b.status) return a.status - b.status;
            return new Date(b.createdAt) - new Date(a.createdAt);
          });

          setLocalLogs(sortedLogs);
          if (setRequests) setRequests(sortedLogs);
        } else {
          Swal.fire({
            icon: "error",
            title: "Lỗi!",
            text: logsRes.data.message || "Lỗi khi tải lịch sử xuất hàng",
            confirmButtonText: "OK",
          });
        }

        if (productsRes.data.status === 200) {
          const productData = productsRes.data.listProduct || [];
          const productMap = {};
          productData.forEach((p) => {
            productMap[p.productId] = { name: p.productName };
          });
          setProducts(productMap);
        } else {
          Swal.fire({
            icon: "error",
            title: "Lỗi!",
            text: productsRes.data.message || "Lỗi khi tải danh sách sản phẩm",
            confirmButtonText: "OK",
          });
        }

        if (usersRes.data.status === 200) {
          const userData = usersRes.data.userList || [];
          const userMap = {};
          userData.forEach((u) => {
            userMap[u.userId] = u.fullName;
          });
          setUsers(userMap);
        } else {
          Swal.fire({
            icon: "error",
            title: "Lỗi!",
            text: usersRes.data.message || "Lỗi khi tải danh sách người dùng",
            confirmButtonText: "OK",
          });
        }
      } catch (err) {
        Swal.fire({
          icon: "error",
          title: "Lỗi!",
          text: "Không thể tải dữ liệu: " + (err.response?.data?.message || err.message),
          confirmButtonText: "OK",
        });
      }
    };
    fetchData();
  }, [setRequests]);

  if (!user || user.roleID !== 5) {
    return <div className="text-danger">Vui lòng đăng nhập với tài khoản Exporter.</div>;
  }

  const archivedLogs = logs.filter((log) => log.status === 3);

  const filteredLogs = logs
    .filter((log) => log.status !== 3)
    .filter((log) => {
      const matchStatus = selectedStatus === "all" ? true : log.status === parseInt(selectedStatus);
      const productName = products[log.productId]?.name?.toLowerCase() || "";
      const userName = users[log.userId]?.toLowerCase() || "";
      const quantity = log.quantityChange?.toString() || "";
      const reason = log.reason?.toLowerCase() || "";
      const createdAt = log.createdAt ? new Date(log.createdAt).toLocaleString("vi-VN").toLowerCase() : "";
      const statusText =
        log.status === 1
          ? "đang chờ xử lý"
          : log.status === 2
          ? "đang xử lý"
          : log.status === 3
          ? "hoàn thành"
          : log.status === 4
          ? "đang giao hàng"
          : log.status === 5
          ? "đã hủy"
          : "không rõ";

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

  const handleRefresh = async () => {
    setIsLoading(true);
    try {
      const headers = { Authorization: `Bearer ${user.token}` };
      const [logsRes, productsRes, usersRes] = await Promise.all([
        axios.get("http://localhost:8082/PureFoods/api/exporter/history?productId=0&orderId=0", { headers }),
        axios.get("http://localhost:8082/PureFoods/api/product/getAll", { headers }),
        axios.get("http://localhost:8082/PureFoods/api/users/getAll", { headers }),
      ]);

      if (logsRes.data.status === 200) {
        const logData = logsRes.data.history || [];
        const sortedLogs = [...logData].sort((a, b) => {
          if (a.status !== b.status) return a.status - b.status;
          return new Date(b.createdAt) - new Date(a.createdAt);
        });

        setLocalLogs(sortedLogs);
        if (setRequests) setRequests(sortedLogs);
      } else {
        throw new Error(logsRes.data.message || "Lỗi tải lịch sử");
      }

      if (productsRes.data.status === 200) {
        const productMap = {};
        (productsRes.data.listProduct || []).forEach((p) => {
          productMap[p.productId] = { name: p.productName };
        });
        setProducts(productMap);
      } else {
        throw new Error(productsRes.data.message || "Lỗi tải sản phẩm");
      }

      if (usersRes.data.status === 200) {
        const userMap = {};
        (usersRes.data.userList || []).forEach((u) => {
          userMap[u.userId] = u.fullName;
        });
        setUsers(userMap);
      } else {
        throw new Error(usersRes.data.message || "Lỗi tải người dùng");
      }

      Swal.fire({
        icon: "success",
        title: "Đã làm mới!",
        text: "Dữ liệu đã được cập nhật thành công.",
        confirmButtonText: "OK",
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Lỗi!",
        text: "Làm mới thất bại: " + (err.response?.data?.message || err.message),
        confirmButtonText: "OK",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmOrder = async (orderId) => {
    try {
      const res = await axios.put(
        `http://localhost:8082/PureFoods/api/exporter/requests/${orderId}/confirm`,
        {},
        { params: { exporterId: user.userId }, headers: { Authorization: `Bearer ${user.token}` } }
      );
      if (res.data.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Thành công!",
          text: res.data.message || "Xác nhận đơn hàng thành công.",
          confirmButtonText: "OK",
        });
        handleRefresh();
      } else {
        throw new Error(res.data.message || "Xác nhận thất bại");
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Lỗi!",
        text: err.response?.data?.message || "Xác nhận thất bại.",
        confirmButtonText: "OK",
      });
    }
  };

  const handleRejectOrder = async (orderId) => {
    const { value: rejectReason } = await Swal.fire({
      title: "Lý do từ chối",
      input: "text",
      inputPlaceholder: "Nhập lý do từ chối...",
      showCancelButton: true,
      confirmButtonText: "Từ chối",
      cancelButtonText: "Hủy",
    });

    if (rejectReason) {
      try {
        const res = await axios.put(
          `http://localhost:8082/PureFoods/api/exporter/requests/${orderId}/reject`,
          rejectReason,
          { params: { exporterId: user.userId }, headers: { Authorization: `Bearer ${user.token}` } }
        );
        if (res.data.status === 200) {
          Swal.fire({
            icon: "success",
            title: "Thành công!",
            text: res.data.message || "Từ chối đơn hàng thành công.",
            confirmButtonText: "OK",
          });
          handleRefresh();
        } else {
          throw new Error(res.data.message || "Từ chối thất bại");
        }
      } catch (err) {
        Swal.fire({
          icon: "error",
          title: "Lỗi!",
          text: err.response?.data?.message || "Từ chối thất bại.",
          confirmButtonText: "OK",
        });
      }
    }
  };

  const handleCancelOrder = async (orderId) => {
    const { value: cancelReason } = await Swal.fire({
      title: "Lý do hủy",
      input: "text",
      inputPlaceholder: "Nhập lý do hủy...",
      showCancelButton: true,
      confirmButtonText: "Hủy đơn",
      cancelButtonText: "Thoát",
    });

    if (cancelReason) {
      try {
        const res = await axios.put(
          `http://localhost:8082/PureFoods/api/exporter/requests/${orderId}/cancel`,
          cancelReason,
          { params: { exporterId: user.userId }, headers: { Authorization: `Bearer ${user.token}` } }
        );
        if (res.data.status === 200) {
          Swal.fire({
            icon: "success",
            title: "Thành công!",
            text: res.data.message || "Hủy đơn hàng thành công.",
            confirmButtonText: "OK",
          });
          handleRefresh();
        } else {
          throw new Error(res.data.message || "Hủy thất bại");
        }
      } catch (err) {
        Swal.fire({
          icon: "error",
          title: "Lỗi!",
          text: err.response?.data?.message || "Hủy thất bại.",
          confirmButtonText: "OK",
        });
      }
    }
  };

  const handleArchiveOrder = async (logId) => {
    try {
      const res = await axios.post(
        "http://localhost:8082/PureFoods/api/exporter/inventory-logs/archive",
        { logId },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      if (res.data.status === 200) {
        const updatedLogs = logs.map((l) => (l.logId === logId ? { ...l, status: 3 } : l));
        setLocalLogs(updatedLogs);
        Swal.fire({
          icon: "success",
          title: "Thành công!",
          text: res.data.message || "Lưu trữ đơn hàng thành công.",
          confirmButtonText: "OK",
        });
      } else {
        throw new Error(res.data.message || "Lưu trữ thất bại");
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Lỗi!",
        text: err.response?.data?.message || "Lưu trữ thất bại.",
        confirmButtonText: "OK",
      });
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
        <h2>Lịch sử các đơn xuất hàng</h2>
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
                <th scope="col">Sản phẩm</th>
                <th scope="col">Người xuất</th>
                <th scope="col">Số lượng</th>
                <th scope="col">Lý do</th>
                <th scope="col">Thời gian</th>
                <th scope="col">Trạng thái</th>
                <th scope="col">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {currentLogs.length > 0 ? (
                currentLogs.map((log, index) => {
                  const orderId = log.reason.match(/Xác nhận đơn hàng: (\d+)/)?.[1] || log.reason.match(/Hủy đơn hàng: (\d+)/)?.[1] || log.reason.match(/Từ chối đơn hàng: (\d+)/)?.[1] || null;
                  return (
                    <tr key={index}>
                      <td>
                        <h6>{products[log.productId]?.name || "Chưa xác định"}</h6>
                      </td>
                      <td>
                        <h6>{users[log.userId] || `Người xuất: ${log.userId}`}</h6>
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
                        <label
                          className={
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
                              : "unknown"
                          }
                        >
                          {log.status === 1
                            ? "Đang chờ xử lý"
                            : log.status === 2
                            ? "Đang xử lý"
                            : log.status === 3
                            ? "Hoàn thành"
                            : log.status === 4
                            ? "Đang giao hàng"
                            : log.status === 5
                            ? "Đã hủy"
                            : "Không rõ"}
                        </label>
                      </td>
                      <td>
                        <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                          {log.status === 1 && orderId && (
                            <>
                              <button
                                className="btn btn-sm"
                                style={{
                                  backgroundColor: "green",
                                  color: "white",
                                  fontSize: "12px",
                                  padding: "2px 6px",
                                  fontWeight: "bold",
                                }}
                                onMouseEnter={(e) => (e.target.style.backgroundColor = "#006400")}
                                onMouseLeave={(e) => (e.target.style.backgroundColor = "green")}
                                onClick={() => handleConfirmOrder(orderId)}
                              >
                                ✅ Xác nhận
                              </button>
                              <button
                                className="btn btn-sm"
                                style={{
                                  backgroundColor: "red",
                                  color: "white",
                                  fontSize: "12px",
                                  padding: "2px 6px",
                                  fontWeight: "bold",
                                }}
                                onMouseEnter={(e) => (e.target.style.backgroundColor = "#8b0000")}
                                onMouseLeave={(e) => (e.target.style.backgroundColor = "red")}
                                onClick={() => handleRejectOrder(orderId)}
                              >
                                ❌ Từ chối
                              </button>
                              <button
                                className="btn btn-sm"
                                style={{
                                  backgroundColor: "orange",
                                  color: "white",
                                  fontSize: "12px",
                                  padding: "2px 6px",
                                  fontWeight: "bold",
                                }}
                                onMouseEnter={(e) => (e.target.style.backgroundColor = "#ff8c00")}
                                onMouseLeave={(e) => (e.target.style.backgroundColor = "orange")}
                                onClick={() => handleCancelOrder(orderId)}
                              >
                                🗑️ Hủy
                              </button>
                            </>
                          )}
                          {log.status === 2 && (
                            <button
                              className="btn btn-sm"
                              style={{
                                backgroundColor: "blue",
                                color: "white",
                                fontSize: "12px",
                                padding: "2px 6px",
                                fontWeight: "bold",
                              }}
                              onMouseEnter={(e) => (e.target.style.backgroundColor = "#00008b")}
                              onMouseLeave={(e) => (e.target.style.backgroundColor = "blue")}
                              onClick={() => handleArchiveOrder(log.logId)}
                            >
                              📦 Lưu trữ
                            </button>
                          )}
                          {log.status === 5 && (
                            <span className="text-muted">Không có hành động</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="7" className="text-center">
                    Không có lịch sử xuất hàng.
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
        <p style={{ fontSize: "19px", color: "blue", margin: "20px 20px" }}>
          Các đơn hàng <span style={{ color: "green", fontWeight: "bold" }}>HOÀN THÀNH</span> sẽ được lưu trữ ở dưới
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
                    <th>Sản phẩm</th>
                    <th>Người xuất</th>
                    <th>Số lượng</th>
                    <th>Lý do</th>
                    <th>Thời gian</th>
                  </tr>
                </thead>
                <tbody>
                  {currentArchivedLogs.map((log, index) => (
                    <tr key={index}>
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
          <Pagination
            currentPage={archivedPage}
            totalPages={archivedTotalPages}
            onPageChange={(page) => setArchivedPage(page)}
          />
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ExporterInventoryLog;
import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const TraderReturnRequests = ({ traderId }) => {
  const [pendingLogs, setPendingLogs] = useState([]);
  const [processedLogs, setProcessedLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imageLoading, setImageLoading] = useState({});
  const [activeTab, setActiveTab] = useState("pending");

  const [searchTerm, setSearchTerm] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [logsPerPage] = useState(5);

  const fetchProductDetails = async (productId) => {
    try {
      const mappingRes = await axios.get(
        `http://localhost:8082/PureFoods/api/trader-product-mapping/by-product/${productId}`,
        { withCredentials: true }
      );

      if (!mappingRes.data?.traderProductId) {
        throw new Error("Không tìm thấy traderProductId");
      }
      const traderProductId = mappingRes.data.traderProductId;

      const stockRes = await axios.get(
        `http://localhost:8082/PureFoods/api/trader/inventory?userId=${traderId}`,
        { withCredentials: true }
      );

      if (!stockRes.data?.data) {
        throw new Error("Không tìm thấy dữ liệu kho hàng");
      }

      const product = stockRes.data.data.find(
        (item) => item.traderProductId === traderProductId
      );
      return product
        ? {
            productName: product.productName,
            imageURL: product.imageURL || "https://via.placeholder.com/50",
          }
        : { productName: "Không xác định", imageURL: "https://via.placeholder.com/50" };
    } catch (error) {
      console.error(`Lỗi khi lấy chi tiết sản phẩm ${productId}:`, error);
      return { productName: "Không xác định", imageURL: "https://via.placeholder.com/50" };
    }
  };

  const updateLogsWithDetails = async (logs, setLogs) => {
    if (!Array.isArray(logs)) {
      console.warn("Logs is not an array:", logs);
      setLogs([]);
      return;
    }

    const newImageLoading = {};
    logs.forEach((log) => (newImageLoading[log.logId] = true));
    setImageLoading((prev) => ({ ...prev, ...newImageLoading }));

    const updated = await Promise.all(
      logs.map(async (log) => {
        const { productName, imageURL } = await fetchProductDetails(log.productId);
        return { ...log, productName, imageURL };
      })
    );

    setLogs(updated);
    setImageLoading((prev) => {
      const newState = { ...prev };
      updated.forEach((log) => (newState[log.logId] = false));
      return newState;
    });
  };

  const fetchReturnRequests = async () => {
    try {
      const pendingRes = await axios.get(
        `http://localhost:8082/PureFoods/api/trader/inventory/return-requests?userId=${traderId}`,
        { withCredentials: true }
      );
      console.log("Pending Response:", pendingRes.data);
      const rawPending = Array.isArray(pendingRes.data.logs)
        ? pendingRes.data.logs
        : [];

      const acceptedRes = await axios.get(
        `http://localhost:8082/PureFoods/api/trader/inventory/return-history?userId=${traderId}&status=6`,
        { withCredentials: true }
      );
      console.log("Accepted Response:", acceptedRes.data);
      const rejectedRes = await axios.get(
        `http://localhost:8082/PureFoods/api/trader/inventory/return-history?userId=${traderId}&status=7`,
        { withCredentials: true }
      );
      console.log("Rejected Response:", rejectedRes.data);

      const acceptedLogs = Array.isArray(acceptedRes.data.logs)
        ? acceptedRes.data.logs
        : [];
      const rejectedLogs = Array.isArray(rejectedRes.data.logs)
        ? rejectedRes.data.logs
        : [];
      const combinedProcessed = [...acceptedLogs, ...rejectedLogs].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      await updateLogsWithDetails(rawPending, setPendingLogs);
      await updateLogsWithDetails(combinedProcessed, setProcessedLogs);
    } catch (error) {
      console.error("Lỗi tải đơn trả hàng:", error);
      toast.error("Lỗi tải đơn trả hàng: " + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async (logId) => {
    try {
      await axios.post(
        `http://localhost:8082/PureFoods/api/trader/inventory/confirm-return?userId=${traderId}&logId=${logId}`,
        null,
        { withCredentials: true }
      );
      toast.success("✅ Đã chấp nhận đơn trả hàng.");
      fetchReturnRequests();
    } catch (err) {
      toast.error("❌ Lỗi xác nhận: " + (err.response?.data?.message || "Không xác định"));
    }
  };

  const handleReject = async (logId) => {
    const reason = prompt("Nhập lý do từ chối:");
    if (reason === null) {
      toast.warn("Hủy từ chối đơn trả hàng.");
      return;
    }
    if (!reason.trim()) {
      toast.warn("Vui lòng nhập lý do từ chối hợp lệ.");
      return;
    }
    try {
      await axios.post(
        `http://localhost:8082/PureFoods/api/trader/inventory/reject-return?userId=${traderId}&logId=${logId}&reason=${encodeURIComponent(reason.trim())}`,
        null,
        { withCredentials: true }
      );
      toast.success("🚫 Đã từ chối đơn trả hàng.");
      fetchReturnRequests();
    } catch (err) {
      toast.error("❌ Lỗi từ chối: " + (err.response?.data?.message || "Không xác định"));
    }
  };

  const handleExportExcel = () => {
    const exportData = filteredLogs.map((log, i) => ({
      STT: i + 1,
      "Tên sản phẩm": log.productName,
      "Số lượng": log.quantityChange,
      "Lý do": log.reason,
      "Thời gian": new Date(log.createdAt).toLocaleString(),
      "Trạng thái":
        log.status === 6
          ? "Đã chấp nhận"
          : log.status === 7
          ? "Đã từ chối"
          : "Đang chờ",
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const colWidths = [
      { wch: 5 },
      { wch: 30 },
      { wch: 10 },
      { wch: 50 },
      { wch: 20 },
      { wch: 15 },
    ];
    worksheet["!cols"] = colWidths;

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Yêu cầu trả hàng");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const fileName = `yeu_cau_tra_hang_${activeTab}_${new Date().toISOString()}.xlsx`;
    saveAs(new Blob([excelBuffer]), fileName);
  };

  useEffect(() => {
    if (!traderId) {
      toast.error("❌ Không tìm thấy traderId.");
      setLoading(false);
      return;
    }
    fetchReturnRequests();
  }, [traderId]);

  const logsToShow = activeTab === "pending" ? pendingLogs : processedLogs;

  const filteredLogs = logsToShow.filter((log) => {
    const nameMatch = log.productName?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false;
    const date = log.createdAt ? new Date(log.createdAt) : null;
    const from = dateFrom ? new Date(dateFrom) : null;
    const to = dateTo ? new Date(dateTo) : null;

    const dateMatch =
      date &&
      (!from || date >= from) &&
      (!to || date <= new Date(to.getTime() + 86400000));

    return nameMatch && dateMatch;
  });

  const indexOfLastLog = currentPage * logsPerPage;
  const indexOfFirstLog = indexOfLastLog - logsPerPage;
  const currentLogs = filteredLogs.slice(indexOfFirstLog, indexOfLastLog);
  const totalPages = Math.ceil(filteredLogs.length / logsPerPage);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) return <div className="text-center my-4">⏳ Đang tải dữ liệu...</div>;

  return (
    <div className="container mt-4">
      <h4 className="mb-4">📦 Yêu cầu trả hàng</h4>

      {/* Tabs */}
      <ul className="nav nav-tabs">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "pending" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("pending");
              setCurrentPage(1);
            }}
          >
            Đang chờ xử lý
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "processed" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("processed");
              setCurrentPage(1);
            }}
          >
            Đã xử lý
          </button>
        </li>
      </ul>

      {/* Filter */}
      <div className="row mt-3 mb-3">
        <div className="col-md-4">
          <input
            type="text"
            className="form-control"
            placeholder="🔍 Tìm theo tên sản phẩm..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
        <div className="col-md-3">
          <input
            type="date"
            className="form-control"
            value={dateFrom}
            onChange={(e) => {
              setDateFrom(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
        <div className="col-md-3">
          <input
            type="date"
            className="form-control"
            value={dateTo}
            onChange={(e) => {
              setDateTo(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
        <div className="col-md-2 text-end">
          <button className="btn btn-outline-success w-100" onClick={handleExportExcel}>
            📤 Xuất Excel
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="table-responsive">
        <table className="table table-hover table-bordered align-middle">
          <thead className="table-light">
            <tr>
              <th>#</th>
              <th>Hình ảnh</th>
              <th>Tên sản phẩm</th>
              <th>Số lượng</th>
              <th>Lý do</th>
              <th>Thời gian</th>
              <th>{activeTab === "pending" ? "Thao tác" : "Trạng thái"}</th>
            </tr>
          </thead>
          <tbody>
            {currentLogs.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center text-muted">
                  Không có đơn trả hàng.
                </td>
              </tr>
            ) : (
              currentLogs.map((log, index) => (
                <tr key={log.logId}>
                  <td>{indexOfFirstLog + index + 1}</td>
                  <td className="text-center">
                    {imageLoading[log.logId] ? (
                      <span className="text-muted">Đang tải...</span>
                    ) : (
                      <img
                        src={log.imageURL}
                        alt={log.productName}
                        className="rounded"
                        style={{ width: "50px", height: "50px", objectFit: "cover" }}
                      />
                    )}
                  </td>
                  <td>{log.productName}</td>
                  <td>{log.quantityChange}</td>
                  <td>{log.reason}</td>
                  <td>{new Date(log.createdAt).toLocaleString()}</td>
                  <td>
                    {activeTab === "pending" ? (
                      <div className="d-flex gap-2">
                        <button
                          className="btn btn-sm btn-success"
                          onClick={() => handleConfirm(log.logId)}
                        >
                          ✅ Chấp nhận
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleReject(log.logId)}
                        >
                          ❌ Từ chối
                        </button>
                      </div>
                    ) : (
                      <span
                        className={`badge ${
                          log.status === 6 ? "bg-success" : "bg-danger"
                        }`}
                      >
                        {log.status === 6 ? "Đã chấp nhận" : "Đã từ chối"}
                      </span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {filteredLogs.length > 0 && (
        <nav className="mt-4">
          <ul className="pagination justify-content-center">
            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
              <button
                onClick={() => paginate(currentPage - 1)}
                className="page-link"
              >
                Previous
              </button>
            </li>
            {Array.from({ length: totalPages }, (_, i) => (
              <li
                key={i}
                className={`page-item ${currentPage === i + 1 ? "active" : ""}`}
              >
                <button onClick={() => paginate(i + 1)} className="page-link">
                  {i + 1}
                </button>
              </li>
            ))}
            <li
              className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}
            >
              <button
                onClick={() => paginate(currentPage + 1)}
                className="page-link"
              >
                Next
              </button>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
};

export default TraderReturnRequests;
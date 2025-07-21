import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const TraderImportRequests = ({ traderId }) => {
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
      const traderProductId = mappingRes.data.traderProductId;

      const stockRes = await axios.get(
        `http://localhost:8082/PureFoods/api/trader/inventory?userId=${traderId}`,
        { withCredentials: true }
      );

      const product = stockRes.data.data.find(
        (item) => item.traderProductId === traderProductId
      );
      return product
        ? { productName: product.productName, imageURL: product.imageURL }
        : { productName: "Không xác định", imageURL: null };
    } catch {
      return { productName: "Không xác định", imageURL: null };
    }
  };

  const updateLogsWithDetails = async (logs, setLogs) => {
    const updated = await Promise.all(
      logs.map(async (log) => {
        setImageLoading((prev) => ({ ...prev, [log.logId]: true }));
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

  const fetchImportRequests = async () => {
    try {
      const pendingRes = await axios.get(
        `http://localhost:8082/PureFoods/api/trader/inventory/pending-requests?userId=${traderId}`,
        { withCredentials: true }
      );
      const rawPending = pendingRes.data.requests;

      const processedRes = await axios.get(
        `http://localhost:8082/PureFoods/api/trader/inventory/history?userId=${traderId}&status=1`,
        { withCredentials: true }
      );
      const rejectedRes = await axios.get(
        `http://localhost:8082/PureFoods/api/trader/inventory/history?userId=${traderId}&status=2`,
        { withCredentials: true }
      );
      const combinedProcessed = [...processedRes.data.logs, ...rejectedRes.data.logs].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      await updateLogsWithDetails(rawPending, setPendingLogs);
      await updateLogsWithDetails(combinedProcessed, setProcessedLogs);
    } catch (error) {
      console.error("Lỗi tải danh sách yêu cầu nhập hàng:", error);
      toast.error("Lỗi tải danh sách yêu cầu nhập hàng.");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async (logId) => {
    try {
      await axios.post(
        `http://localhost:8082/PureFoods/api/trader/inventory/confirm-shipping?userId=${traderId}&logId=${logId}`,
        null,
        { withCredentials: true }
      );
      toast.success("✅ Đã xác nhận đơn nhập.");
      fetchImportRequests();
    } catch (err) {
      toast.error("❌ Lỗi xác nhận: " + (err.response?.data?.message || "Không xác định"));
    }
  };

  const handleReject = async (logId) => {
    const reason = prompt("Nhập lý do từ chối:");
    if (!reason) return toast.warn("Vui lòng nhập lý do từ chối.");
    try {
      await axios.post(
        `http://localhost:8082/PureFoods/api/trader/inventory/reject-shipping?userId=${traderId}&logId=${logId}&reason=${encodeURIComponent(reason)}`,
        null,
        { withCredentials: true }
      );
      toast.success("🚫 Đã từ chối đơn nhập.");
      fetchImportRequests();
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
        log.status === 1
          ? "Đã xác nhận"
          : log.status === 2
          ? "Đã từ chối"
          : "Đang chờ",
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Yêu cầu nhập hàng");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const fileName = `yeu_cau_nhap_hang_${activeTab}_${new Date().toISOString()}.xlsx`;
    saveAs(new Blob([excelBuffer]), fileName);
  };

  useEffect(() => {
    fetchImportRequests();
  }, [traderId]);

  const logsToShow = activeTab === "pending" ? pendingLogs : processedLogs;

  const filteredLogs = logsToShow.filter((log) => {
    const nameMatch = log.productName?.toLowerCase().includes(searchTerm.toLowerCase());
    const date = new Date(log.createdAt);
    const from = dateFrom ? new Date(dateFrom) : null;
    const to = dateTo ? new Date(dateTo) : null;

    const dateMatch =
      (!from || date >= from) &&
      (!to || date <= new Date(to.getTime() + 86400000));

    return nameMatch && dateMatch;
  });

  const indexOfLastLog = currentPage * logsPerPage;
  const indexOfFirstLog = indexOfLastLog - logsPerPage;
  const currentLogs = filteredLogs.slice(indexOfFirstLog, indexOfLastLog);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) return <div className="text-center my-4">⏳ Đang tải dữ liệu...</div>;

  return (
    <div className="container mt-4">
      <h4 className="mb-4">🛒 Yêu cầu nhập hàng</h4>

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
            Đang chờ xác nhận
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
                  Không có yêu cầu nào.
                </td>
              </tr>
            ) : (
              currentLogs.map((log, index) => (
                <tr key={log.logId}>
                  <td>{indexOfFirstLog + index + 1}</td>
                  <td className="text-center">
                    {imageLoading[log.logId] ? (
                      <span className="text-muted">Đang tải...</span>
                    ) : log.imageURL ? (
                      <img
                        src={log.imageURL}
                        alt={log.productName}
                        className="rounded"
                        style={{ width: "50px", height: "50px", objectFit: "cover" }}
                        onError={(e) => {
                          e.target.src = "https://via.placeholder.com/50";
                        }}
                      />
                    ) : (
                      <span className="text-muted">Không có</span>
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
                          ✅ Xác nhận
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
                          log.status === 1 ? "bg-success" : "bg-danger"
                        }`}
                      >
                        {log.status === 1 ? "Đã xác nhận" : "Đã từ chối"}
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
      <nav className="mt-4">
        <ul className="pagination justify-content-center">
          {Array.from({ length: Math.ceil(filteredLogs.length / logsPerPage) }, (_, i) => (
            <li key={i} className={`page-item ${currentPage === i + 1 ? "active" : ""}`}>
              <button onClick={() => paginate(i + 1)} className="page-link">
                {i + 1}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default TraderImportRequests;

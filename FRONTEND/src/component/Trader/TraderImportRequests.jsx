import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Pagination from "../TraderLayout/Pagination";

const TraderImportRequests = ({ traderId }) => {
  const [pendingLogs, setPendingLogs] = useState([]);
  const [processedLogs, setProcessedLogs] = useState([]);
  const [productMap, setProductMap] = useState({});
  const [activeTab, setActiveTab] = useState("pending");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchPendingLogs();
    fetchProcessedLogs();
    fetchProducts();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

  const fetchPendingLogs = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8082/PureFoods/api/trader/inventory/pending-requests?userId=${traderId}`
      );
      const logs = res.data?.requests || [];
      // Gắn tên sản phẩm từ productMap
      const updatedLogs = logs.map((log) => ({
        ...log,
        productName: productMap[log.productId]?.name || "Tên không xác định",
      }));
      setPendingLogs(updatedLogs);
    } catch (error) {
      toast.error("Lỗi khi tải yêu cầu đang chờ: " + (error.response?.data?.message || error.message));
    }
  };

  const fetchProcessedLogs = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8082/PureFoods/api/trader/inventory/all-logs?userId=${traderId}`
      );
      const processed = res.data?.logs?.filter((log) => log.status === 1 || log.status === 2) || [];
      // Gắn tên sản phẩm từ productMap
      const updatedLogs = processed.map((log) => ({
        ...log,
        productName: productMap[log.productId]?.name || "Tên không xác định",
      }));
      setProcessedLogs(updatedLogs);
    } catch (error) {
      toast.error("Lỗi khi tải lịch sử đơn hàng: " + (error.response?.data?.message || error.message));
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8082/PureFoods/api/trader/inventory?userId=${traderId}`
      );
      const map = {};
      res.data?.data.forEach((p) => {
        map[p.traderProductId] = {
          name: p.productName,
          image: p.imageURL || "/assets/images/product-image-placeholder.png",
        };
      });
      setProductMap(map);
    } catch (error) {
      toast.error("Lỗi khi tải danh sách sản phẩm: " + (error.response?.data?.message || error.message));
    }
  };

  const handleConfirm = async (logId) => {
    try {
      await axios.post(
        `http://localhost:8082/PureFoods/api/trader/inventory/confirm-shipping?userId=${traderId}&logId=${logId}`
      );
      toast.success("✅ Đã xác nhận giao hàng");
      await fetchPendingLogs();
      await fetchProcessedLogs();
    } catch (error) {
      toast.error("❌ Lỗi khi xác nhận: " + (error.response?.data?.message || error.message));
    }
  };

  const handleReject = async (logId) => {
    try {
      await axios.post(
        `http://localhost:8082/PureFoods/api/trader/inventory/reject-shipping?userId=${traderId}&logId=${logId}`
      );
      toast.success("❌ Đã từ chối yêu cầu");
      await fetchPendingLogs();
      await fetchProcessedLogs();
    } catch (error) {
      toast.error("❌ Lỗi khi từ chối: " + (error.response?.data?.message || error.message));
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 0:
        return <span className="badge bg-warning text-dark">⏳ Đang xử lý</span>;
      case 1:
        return <span className="badge bg-success">✅ Đã giao</span>;
      case 2:
        return <span className="badge bg-danger">❌ Đã từ chối</span>;
      default:
        return <span className="badge bg-secondary">Không xác định</span>;
    }
  };

  const renderCard = (log) => {
    const product = productMap[log.productId] || {};

    return (
      <div className="col-12" key={log.logId}>
        <div className="card p-3 shadow-sm d-flex flex-row align-items-center gap-3">
          <img
            src={product.image || "/assets/images/product-image-placeholder.png"}
            alt={log.productName || "Sản phẩm"}
            width={80}
            height={80}
            className="rounded"
            onError={(e) => {
              e.target.src = "/assets/images/product-image-placeholder.png";
            }}
          />
          <div className="flex-grow-1">
            <h6 className="mb-1">
              <strong>{log.productName || "Tên không xác định"}</strong> –{" "}
              {log.quantityChange} đơn vị
            </h6>
            <p className="text-muted small mb-1">
              Người gửi: <strong>{log.userName || "Importer"}</strong> | Lý do:{" "}
              {log.reason} | Ngày: {new Date(log.createdAt).toLocaleString("vi-VN")}
            </p>
            <div>{getStatusLabel(log.status)}</div>
          </div>
          {log.status === 0 && (
            <div className="d-flex flex-column gap-2 text-end">
              <button
                className="btn btn-success btn-sm"
                onClick={() => handleConfirm(log.logId)}
              >
                <i className="bi bi-truck"></i> Giao hàng
              </button>
              <button
                className="btn btn-outline-danger btn-sm"
                onClick={() => handleReject(log.logId)}
              >
                <i className="bi bi-x-circle"></i> Từ chối
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Tách dữ liệu theo tab
  const dataToRender = activeTab === "pending" ? pendingLogs : processedLogs;
  const totalPages = Math.ceil(dataToRender.length / itemsPerPage);
  const paginatedLogs = dataToRender.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div>
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "pending" ? "active" : ""}`}
            onClick={() => setActiveTab("pending")}
          >
            📥 Yêu cầu mới
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "processed" ? "active" : ""}`}
            onClick={() => setActiveTab("processed")}
          >
            📦 Đã xử lý
          </button>
        </li>
      </ul>

      {paginatedLogs.length === 0 ? (
        <p className="text-muted">Không có dữ liệu.</p>
      ) : (
        <>
          <div className="row g-3 mb-3">{paginatedLogs.map(renderCard)}</div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </>
      )}
    </div>
  );
};

export default TraderImportRequests;
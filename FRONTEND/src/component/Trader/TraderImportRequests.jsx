import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
// Thay đổi phần import Pagination
import Pagination from "../TraderLayout/Pagination";


const TraderImportRequests = ({ traderId }) => {
  const [pendingLogs, setPendingLogs] = useState([]);
  const [processedLogs, setProcessedLogs] = useState([]);
  const [productMap, setProductMap] = useState({});

  // Phân trang
  const [currentPagePending, setCurrentPagePending] = useState(1);
  const [currentPageProcessed, setCurrentPageProcessed] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchPendingLogs();
    fetchProcessedLogs();
    fetchProducts();
  }, []);

  const fetchPendingLogs = async () => {
    try {
      const res = await axios.get("http://localhost:8082/PureFoods/api/trader/import-requests");
      setPendingLogs(res.data?.logs || []);
    } catch {
      toast.error("Lỗi khi tải yêu cầu đang chờ");
    }
  };

  const fetchProcessedLogs = async () => {
    try {
      const res = await axios.get("http://localhost:8082/PureFoods/api/trader/import-history");
      setProcessedLogs(res.data?.logs || []);
    } catch {
      toast.error("Lỗi khi tải lịch sử đơn hàng");
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:8082/PureFoods/api/product/getAll");
      const map = {};
      res.data?.listProduct.forEach(p => {
        map[p.productId] = {
          name: p.productName,
          image: p.imageURL
        };
      });
      setProductMap(map);
    } catch {
      toast.error("Lỗi khi tải danh sách sản phẩm");
    }
  };

  const handleConfirm = async (logId) => {
    try {
      await axios.post("http://localhost:8082/PureFoods/api/trader/confirm-shipping", {
        logId,
        userId: traderId
      });
      toast.success("✅ Đã xác nhận giao hàng");
      await fetchPendingLogs();
      await fetchProcessedLogs();
    } catch {
      toast.error("❌ Lỗi khi xác nhận");
    }
  };

  const handleReject = async (logId) => {
    try {
      await axios.post("http://localhost:8082/PureFoods/api/trader/reject", { logId });
      toast.success("❌ Đã từ chối yêu cầu");
      await fetchPendingLogs();
      await fetchProcessedLogs();
    } catch {
      toast.error("❌ Lỗi khi từ chối");
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 0: return <span className="badge bg-warning">⏳ Đang xử lý</span>;
      case 1: return <span className="badge bg-success">✅ Đã giao</span>;
      case 2: return <span className="badge bg-danger">❌ Đã từ chối</span>;
      default: return <span className="badge bg-secondary">Không xác định</span>;
    }
  };

  const renderCard = (log) => {
    const product = productMap[log.productId] || {};
    return (
      <div className="col-md-12" key={log.logId}>
        <div className="card shadow-sm p-3 d-flex flex-row align-items-center">
          <img
            src={product.image || "/assets/images/product-image-placeholder.png"}
            alt="img"
            width={80}
            height={80}
            className="me-3"
            onError={(e) => { e.target.src = "/assets/images/product-image-placeholder.png"; }}
          />
          <div className="flex-grow-1">
            <h6 className="mb-1">
              <strong>{product.name || "Tên sản phẩm"}</strong> – {log.quantityChange} đơn vị
            </h6>
            <div className="text-muted small">
              Người gửi: <strong>{log.userName || "Importer"}</strong> &nbsp;|&nbsp;
              Lý do: {log.reason} &nbsp;|&nbsp;
              Ngày: {new Date(log.createdAt).toLocaleString("vi-VN")}
            </div>
          </div>
          <div className="text-end">
            <div className="mb-2">{getStatusLabel(log.status)}</div>
            {log.status === 0 && (
              <div className="d-flex gap-2">
                <button className="btn btn-success btn-sm" onClick={() => handleConfirm(log.logId)}>✅ Giao hàng</button>
                <button className="btn btn-outline-danger btn-sm" onClick={() => handleReject(log.logId)}>❌ Từ chối</button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Phân trang pending
  const totalPagesPending = Math.ceil(pendingLogs.length / itemsPerPage);
  const paginatedPendingLogs = pendingLogs.slice(
    (currentPagePending - 1) * itemsPerPage,
    currentPagePending * itemsPerPage
  );

  // Phân trang processed
  const totalPagesProcessed = Math.ceil(processedLogs.length / itemsPerPage);
  const paginatedProcessedLogs = processedLogs.slice(
    (currentPageProcessed - 1) * itemsPerPage,
    currentPageProcessed * itemsPerPage
  );

  return (
    <div>
      <h4 className="mb-3">📥 Yêu cầu nhập hàng mới (đang chờ)</h4>
      {pendingLogs.length === 0 ? (
        <p className="text-muted">Không có yêu cầu mới.</p>
      ) : (
        <>
          <div className="row g-3 mb-3">
            {paginatedPendingLogs.map(renderCard)}
          </div>
          <Pagination
            currentPage={currentPagePending}
            totalPages={totalPagesPending}
            onPageChange={setCurrentPagePending}
          />
        </>
      )}

      <h5 className="mb-3 mt-5">📦 Lịch sử xử lý đơn nhập</h5>
      {processedLogs.length === 0 ? (
        <p className="text-muted">Chưa có lịch sử đơn hàng đã xử lý.</p>
      ) : (
        <>
          <div className="row g-3 mb-3">
            {paginatedProcessedLogs.map(renderCard)}
          </div>
          <Pagination
            currentPage={currentPageProcessed}
            totalPages={totalPagesProcessed}
            onPageChange={setCurrentPageProcessed}
          />
        </>
      )}
    </div>
  );
};

export default TraderImportRequests;

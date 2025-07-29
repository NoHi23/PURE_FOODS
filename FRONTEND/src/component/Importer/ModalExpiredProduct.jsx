import React, { useEffect, useState } from "react";
import Pagination from "../../layouts/Pagination";

const formatTimeDiff = (ms) => {
  const totalSeconds = Math.floor(ms / 1000);
  const days = Math.floor(totalSeconds / (3600 * 24));
  const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return `${days} ngày ${hours} giờ ${minutes} phút ${seconds} giây`;
};

const ModalExpiredProduct = ({ expiredProducts, onClose }) => {
  const [timeDiffs, setTimeDiffs] = useState({});
  const [today, setToday] = useState(new Date());

  // 🆕 Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 5;
  const totalPages = Math.ceil(expiredProducts.length / productsPerPage);

  // 🌀 Scroll về đầu modal khi mở
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // ⏱️ Cập nhật thời gian hết hạn
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setToday(now);
      const newDiffs = {};
      expiredProducts.forEach((p) => {
        const expiredDate = new Date(p.expirationDate);
        const diff = now - expiredDate;
        if (diff > 0) newDiffs[p.productId] = formatTimeDiff(diff);
      });
      setTimeDiffs(newDiffs);
    }, 1000);

    return () => clearInterval(interval);
  }, [expiredProducts]);

  // 🧮 Chia sản phẩm theo trang
  const startIndex = (currentPage - 1) * productsPerPage;
  const paginatedProducts = expiredProducts.slice(startIndex, startIndex + productsPerPage);

  return (
    <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.4)" }}>
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Danh sách sản phẩm đã hết hạn ({expiredProducts.length} sản phẩm)</h5>
            <button className="btn-close" onClick={onClose}></button>
          </div>

          <div className="modal-body" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <p style={{ fontStyle: "italic", color: "#555" }}>
              📅 Hôm nay là: <strong>{today.toLocaleDateString("vi-VN")}</strong>
            </p>

            {paginatedProducts.map((p) => {
              const expiredDate = new Date(p.expirationDate);
              const diffTime = today - expiredDate;
              const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

              const borderColor = diffDays > 7 ? "#f44336" : "#ddd";
              const bgColor = diffDays > 7 ? "#fff1f1" : "#fff";

              return (
                <div
                  key={p.productId}
                  style={{
                    border: `1px solid ${borderColor}`,
                    borderRadius: "8px",
                    padding: "12px 16px",
                    backgroundColor: bgColor,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                  }}
                >
                  <h6 style={{ marginBottom: 6 }}>
                    🧊 <strong>{p.productName}</strong> (ID: {p.productId})
                  </h6>
                  <p style={{ margin: 0 }}>📆 Hết hạn ngày: {expiredDate.toLocaleDateString("vi-VN")}</p>
                  <p style={{ margin: 0, color: "#555" }}>📅 Hôm nay là: {today.toLocaleDateString("vi-VN")}</p>
                  <p style={{ margin: 0, color: "red", fontWeight: "bold" }}>
                    ⏳ Đã hết hạn được: {timeDiffs[p.productId] || "..."}
                  </p>
                </div>
              );
            })}

            {/* 🧭 Pagination */}
            {totalPages > 0 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => setCurrentPage(page)}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalExpiredProduct;

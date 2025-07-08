import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const TraderReturnRequests = ({ traderId }) => {
  const [returns, setReturns] = useState([]);

  useEffect(() => {
    fetchReturns();
  }, []);

  const fetchReturns = () => {
    axios
      .get("http://localhost:8082/PureFoods/api/trader/returns/pending")
      .then((res) => setReturns(res.data.logs || []))
      .catch(() => toast.error("Lỗi khi tải đơn trả hàng"));
  };

  const handleConfirmReturn = (logId) => {
    axios
      .post("http://localhost:8082/PureFoods/api/trader/returns/confirm", { logId })
      .then(() => {
        toast.success("Xác nhận trả hàng thành công");
        fetchReturns();
      })
      .catch(() => toast.error("Lỗi khi xác nhận trả hàng"));
  };

  return (
    <div>
      <h4 className="mb-4">🔁 Danh sách đơn trả hàng</h4>

      {returns.length === 0 ? (
        <p className="text-muted">Không có đơn trả hàng nào đang chờ xử lý.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered align-middle">
            <thead className="table-light">
              <tr>
                <th>Mã log</th>
                <th>Mã sản phẩm</th>
                <th>Số lượng</th>
                <th>Lý do</th>
                <th>Ngày tạo</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {returns.map((r) => (
                <tr key={r.logId}>
                  <td>{r.logId}</td>
                  <td>{r.productId}</td>
                  <td>{r.quantityChange}</td>
                  <td>{r.reason}</td>
                  <td>{new Date(r.createdAt).toLocaleString("vi-VN")}</td>
                  <td>
                    <button className="btn btn-success btn-sm" onClick={() => handleConfirmReturn(r.logId)}>
                      ✅ Đã nhận hàng
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TraderReturnRequests;

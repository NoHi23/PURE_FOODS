import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const TraderInventoryLog = ({ traderId, refreshKey }) => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    if (!traderId) return;

    const fetchLogs = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8082/PureFoods/api/trader/inventory/${traderId}`
        );
        setLogs(res.data?.data || []);
      } catch (error) {
        toast.error("Lỗi khi tải log tồn kho");
      }
    };

    fetchLogs();
  }, [traderId, refreshKey]); // 👈 Bổ sung refreshKey vào dependency array

  return (
    <div>
      <h4 className="mb-4">📦 Tồn kho hiện tại</h4>
      {logs.length === 0 ? (
        <p className="text-muted">Chưa có hàng tồn kho.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered align-middle">
            <thead className="table-light">
              <tr>
                <th>Mã sản phẩm</th>
                <th>Tên sản phẩm</th>
                <th>Số lượng còn lại</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((item) => (
                <tr key={item.productId}>
                  <td>{item.productId}</td>
                  <td>{item.productName}</td>
                  <td>{item.quantityInStock}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default TraderInventoryLog;

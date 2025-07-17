import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const TraderOverview = ({ user }) => {
  const [inventory, setInventory] = useState([]);
  const [stats, setStats] = useState({
    totalOrders: 0,
    confirmedOrders: 0,
    rejectedOrders: 0,
    returnedOrders: 0,
    totalQuantitySupplied: 0,
  });

  const fetchInventory = useCallback(async () => {
    try {
      const res = await axios.get(
        `http://localhost:8082/PureFoods/api/trader/inventory/${user.userId}`
      );
      setInventory(res.data?.data || []);
    } catch (err) {
      toast.error("❌ Lỗi khi tải tồn kho");
    }
  }, [user.userId]);

  const fetchStats = useCallback(async () => {
    try {
      const res = await axios.get(
        `http://localhost:8082/PureFoods/api/trader/dashboard-summary/${user.userId}`
      );
      setStats(res.data || {});
    } catch (err) {
      toast.error("❌ Lỗi khi tải thống kê");
    }
  }, [user.userId]);

  useEffect(() => {
    fetchInventory();
    fetchStats();
  }, [fetchInventory, fetchStats]);

  const totalStock = inventory.reduce((sum, item) => sum + item.quantityInStock, 0);

  const renderCard = (title, value, color) => (
    <div className="col-md-4" key={title}>
      <div className={`card border-start border-${color} border-4 shadow-sm p-3`}>
        <h6 className="text-muted">{title}</h6>
        <h4>{value ?? 0}</h4>
      </div>
    </div>
  );

  return (
    <div className="overview-cards row g-3">
      {renderCard("Tổng đơn nhận", stats.totalOrders, "primary")}
      {renderCard("Đã giao", stats.confirmedOrders, "success")}
      {renderCard("Từ chối", stats.rejectedOrders, "danger")}
      {renderCard("Đơn trả hàng", stats.returnedOrders, "warning")}
      {renderCard("Tổng đã cung cấp", stats.totalQuantitySupplied, "info")}
      {renderCard("Tồn kho hiện tại", totalStock, "dark")}
    </div>
  );
};

export default TraderOverview;

import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";

const TraderOverview = ({ user }) => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    confirmedOrders: 0,
    rejectedOrders: 0,
    returnedOrders: 0,
    totalQuantitySupplied: 0,
    currentStock: 0,
  });

  // ✅ Dùng useCallback để tránh ESLint warning
  const fetchDashboardStats = useCallback(async () => {
    try {
      const res = await axios.get(`http://localhost:8082/PureFoods/api/trader/dashboard-summary/${user.userId}`);
      setStats(res.data || {});
    } catch (err) {
      console.error("Lỗi khi lấy thống kê tổng quan:", err);
    }
  }, [user.userId]);

  useEffect(() => {
    fetchDashboardStats();
  }, [fetchDashboardStats]);

  return (
    <div className="overview-cards row g-3">
      <div className="col-md-4">
        <div className="card border-start border-primary border-4 shadow-sm p-3">
          <h6 className="text-muted">Tổng đơn nhận</h6>
          <h4>{stats.totalOrders}</h4>
        </div>
      </div>

      <div className="col-md-4">
        <div className="card border-start border-success border-4 shadow-sm p-3">
          <h6 className="text-muted">Đã giao</h6>
          <h4>{stats.confirmedOrders}</h4>
        </div>
      </div>

      <div className="col-md-4">
        <div className="card border-start border-danger border-4 shadow-sm p-3">
          <h6 className="text-muted">Từ chối</h6>
          <h4>{stats.rejectedOrders}</h4>
        </div>
      </div>

      <div className="col-md-4">
        <div className="card border-start border-warning border-4 shadow-sm p-3">
          <h6 className="text-muted">Đơn trả hàng</h6>
          <h4>{stats.returnedOrders}</h4>
        </div>
      </div>

      <div className="col-md-4">
        <div className="card border-start border-info border-4 shadow-sm p-3">
          <h6 className="text-muted">Tổng số lượng đã cung cấp</h6>
          <h4>{stats.totalQuantitySupplied}</h4>
        </div>
      </div>

      <div className="col-md-4">
        <div className="card border-start border-dark border-4 shadow-sm p-3">
          <h6 className="text-muted">Tồn kho hiện tại</h6>
          <h4>{stats.currentStock}</h4>
        </div>
      </div>
    </div>
  );
};

export default TraderOverview;

import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { toast } from "react-toastify";
import PropTypes from "prop-types";
import Pagination from "../TraderLayout/Pagination";

const TraderReport = ({ traderId }) => {
  const [summary, setSummary] = useState(null);
  const [byProduct, setByProduct] = useState([]);
  const [monthly, setMonthly] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(byProduct.length / itemsPerPage);
  const paginatedByProduct = useMemo(
    () =>
      byProduct.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
      ),
    [byProduct, currentPage]
  );

  // Reset currentPage when byProduct changes
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    } else if (byProduct.length === 0 && currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [byProduct, currentPage, totalPages]);

  useEffect(() => {
    if (!traderId) {
      setError("Vui lòng đăng nhập để xem báo cáo");
      setLoading(false);
      return;
    }

    const source = axios.CancelToken.source();

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const [summaryRes, productRes, monthlyRes] = await Promise.all([
          axios.get(
            `http://localhost:8082/PureFoods/api/trader/inventory/report-summary?userId=${traderId}`,
            { cancelToken: source.token, withCredentials: true }
          ),
          axios.get(
            `http://localhost:8082/PureFoods/api/trader/inventory/report-by-product?userId=${traderId}`,
            { cancelToken: source.token, withCredentials: true }
          ),
          axios.get(
            `http://localhost:8082/PureFoods/api/trader/inventory/report-monthly?userId=${traderId}`,
            { cancelToken: source.token, withCredentials: true }
          ),
        ]);

        // Log responses for debugging
        console.log("Summary Response:", JSON.stringify(summaryRes.data, null, 2));
        console.log("Product Response:", JSON.stringify(productRes.data, null, 2));
        console.log("Monthly Response:", JSON.stringify(monthlyRes.data, null, 2));

        // Validate response structure
        if (!summaryRes.data?.data) {
          throw new Error("Dữ liệu tổng quan không hợp lệ hoặc rỗng");
        }
        if (!Array.isArray(productRes.data?.data)) {
          throw new Error("Dữ liệu sản phẩm không phải là mảng hoặc rỗng");
        }
        if (!Array.isArray(monthlyRes.data?.data)) {
          throw new Error("Dữ liệu tháng không phải là mảng hoặc rỗng");
        }

        // Transform summary to match expected field names
        setSummary({
          totalOrders: summaryRes.data.data.totalOrders || 0,
          confirmedOrders: summaryRes.data.data.confirmedOrders || 0,
          rejectedOrders: summaryRes.data.data.rejectedOrders || 0,
          returnedOrders: summaryRes.data.data.returnedOrders || 0,
          totalQuantitySupplied: summaryRes.data.data.totalShippedQuantity || 0,
          currentStock: summaryRes.data.data.currentStock || 0,
        });

        // Transform byProduct to match expected field names
        setByProduct(
          productRes.data.data.map((item) => ({
            productId: item.productId,
            productName: item.productName,
            totalExported: item.quantity || 0,
          }))
        );

        // Use monthly data as-is since it's already in the correct format
        setMonthly(
          monthlyRes.data.data.map((item) => ({
            month: item.month,
            quantity: Number(item.quantity) || 0,
          }))
        );
      } catch (err) {
        if (axios.isCancel(err)) return;
        const errorMessage =
          err.response?.data?.message || err.message || "Không thể tải dữ liệu báo cáo";
        setError(errorMessage);
        toast.error(errorMessage);
        console.error("API Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    return () => source.cancel();
  }, [traderId]);

  if (loading) {
    return <div className="text-center" aria-live="polite">⏳ Đang tải dữ liệu...</div>;
  }

  if (error) {
    return <div className="text-danger text-center" aria-live="assertive">{error}</div>;
  }

  return (
    <div className="container mt-4">
      <h4 className="mb-4">📊 Thống kê và Báo cáo</h4>

      {/* Tổng quan */}
      <div className="row g-4 mb-4">
        <ReportCard
          title="🧾 Tổng đơn hàng"
          value={summary?.totalOrders ?? 0}
          color="primary"
        />
        <ReportCard
          title="✅ Đơn đã giao"
          value={summary?.confirmedOrders ?? 0}
          color="success"
        />
        <ReportCard
          title="❌ Đơn từ chối"
          value={summary?.rejectedOrders ?? 0}
          color="danger"
        />
        <ReportCard
          title="↩️ Đơn trả về"
          value={summary?.returnedOrders ?? 0}
          color="warning"
        />
        <ReportCard
          title="📦 Số lượng đã giao"
          value={summary?.totalQuantitySupplied ?? 0}
          color="info"
        />
        <ReportCard
          title="🏬 Tồn kho hiện tại"
          value={summary?.currentStock ?? 0}
          color="secondary"
        />
      </div>

      {/* Biểu đồ theo tháng */}
      <div className="mb-5">
        <h5 className="mb-3">📈 Thống kê theo tháng</h5>
        {monthly.length === 0 ? (
          <p className="text-muted" aria-live="polite">Không có dữ liệu.</p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthly}>
              <XAxis dataKey="month" aria-label="Tháng" />
              <YAxis aria-label="Số lượng đã giao" />
              <Tooltip />
              <Legend />
              <Bar dataKey="quantity" fill="#0da385" name="Số lượng đã giao" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Thống kê theo sản phẩm */}
      <div>
        <h5 className="mb-3">📦 Thống kê theo sản phẩm</h5>
        {byProduct.length === 0 ? (
          <p className="text-muted" aria-live="polite">Không có dữ liệu.</p>
        ) : (
          <>
            <div className="table-responsive">
              <table className="table table-bordered table-striped" aria-label="Bảng thống kê sản phẩm">
                <thead className="table-light">
                  <tr>
                    <th scope="col">Mã sản phẩm</th>
                    <th scope="col">Tên sản phẩm</th>
                    <th scope="col">Tổng SL đã giao</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedByProduct.map((item) => (
                    <tr key={item.productId}>
                      <td>{item.productId ?? "N/A"}</td>
                      <td>{item.productName ?? "Không xác định"}</td>
                      <td>{item.totalExported ?? 0}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                aria-label="Phân trang thống kê sản phẩm"
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

const ReportCard = ({ title, value, color }) => (
  <div className="col-md-4">
    <div className={`card text-white bg-${color} shadow-sm`} aria-label={`${title}: ${value}`}>
      <div className="card-body text-center">
        <h6 className="card-title">{title}</h6>
        <h3 className="card-text">{value ?? 0}</h3>
      </div>
    </div>
  </div>
);

TraderReport.propTypes = {
  traderId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

ReportCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.number,
  color: PropTypes.string.isRequired,
};

export default TraderReport;
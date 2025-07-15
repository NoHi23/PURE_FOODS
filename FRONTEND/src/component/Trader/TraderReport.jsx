import React, { useEffect, useState } from "react";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { toast } from "react-toastify";
import Pagination from "../TraderLayout/Pagination"; // đảm bảo đúng path

const TraderReport = ({ traderId }) => {
  const [summary, setSummary] = useState({});
  const [byProduct, setByProduct] = useState([]);
  const [monthly, setMonthly] = useState([]);

  // Phân trang cho bảng thống kê theo sản phẩm
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(byProduct.length / itemsPerPage);
  const paginatedByProduct = byProduct.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    if (!traderId) return;

    const fetchSummary = async () => {
      try {
        const res = await axios.get(`http://localhost:8082/PureFoods/api/trader/report/summary/${traderId}`);
        setSummary(res.data);
      } catch (err) {
        toast.error("Không thể tải thống kê tổng quan");
      }
    };

    const fetchByProduct = async () => {
      try {
        const res = await axios.get(`http://localhost:8082/PureFoods/api/trader/report/by-product/${traderId}`);
        setByProduct(res.data?.data || []);
      } catch (err) {
        toast.error("Không thể tải thống kê theo sản phẩm");
      }
    };

    const fetchMonthly = async () => {
      try {
        const res = await axios.get(`http://localhost:8082/PureFoods/api/trader/report/monthly/${traderId}`);
        const transformed = Object.entries(res.data?.data || {}).map(([month, quantity]) => ({
          month,
          quantity,
        }));
        setMonthly(transformed);
      } catch (err) {
        toast.error("Không thể tải thống kê theo tháng");
      }
    };

    fetchSummary();
    fetchByProduct();
    fetchMonthly();
  }, [traderId]);

  return (
    <div>
      <h4 className="mb-4">📊 Thống kê và Báo cáo</h4>

      {/* Thống kê tổng quan */}
      <div className="row g-4 mb-4">
        <ReportCard title="Tổng đơn hàng" value={summary.totalOrders} color="primary" />
        <ReportCard title="Đơn đã giao" value={summary.confirmedOrders} color="success" />
        <ReportCard title="Đơn bị từ chối" value={summary.rejectedOrders} color="danger" />
        <ReportCard title="Số lượng đã giao" value={summary.totalQuantitySupplied} color="info" />
        <ReportCard title="Tồn kho hiện tại" value={summary.currentStock} color="secondary" />
      </div>

      {/* Biểu đồ theo tháng */}
      <div className="mb-5">
        <h5 className="mb-3">📈 Thống kê theo tháng</h5>
        {monthly.length === 0 ? (
          <p className="text-muted">Không có dữ liệu.</p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthly}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="quantity" fill="#0da385" name="Số lượng đã giao" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Bảng tổng hợp theo sản phẩm */}
      <div>
        <h5 className="mb-3">📦 Thống kê theo sản phẩm</h5>
        {byProduct.length === 0 ? (
          <p className="text-muted">Không có dữ liệu.</p>
        ) : (
          <>
            <div className="table-responsive">
              <table className="table table-bordered table-striped">
                <thead className="table-light">
                  <tr>
                    <th>Mã sản phẩm</th>
                    <th>Tên sản phẩm</th>
                    <th>Tổng SL đã giao</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedByProduct.map((item) => (
                    <tr key={item.productId}>
                      <td>{item.productId}</td>
                      <td>{item.productName}</td>
                      <td>{item.totalExported}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </>
        )}
      </div>
    </div>
  );
};

const ReportCard = ({ title, value, color }) => (
  <div className="col-md-4">
    <div className={`card text-white bg-${color} shadow-sm`}>
      <div className="card-body text-center">
        <h6 className="card-title">{title}</h6>
        <h3 className="card-text">{value ?? 0}</h3>
      </div>
    </div>
  </div>
);

export default TraderReport;

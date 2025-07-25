import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SideBar from './SideBar';
import TopBar from './TopBar';
import './ProductReview.css'; // Assuming you have a CSS file for styling

const ProductReview = () => {
  const [reviews, setReviews] = useState([]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [avgRatings, setAvgRatings] = useState([]);
  const [selectedReview, setSelectedReview] = useState(null);

  useEffect(() => {
    fetchReviews();
    fetchAverageRatings();
  }, [filterStatus]);

  useEffect(() => {
    const sidebarLinks = document.querySelectorAll('.sidebar-link');

    const handleClick = (e) => {
      const nextEl = e.currentTarget.nextElementSibling;
      if (nextEl && nextEl.classList.contains('sidebar-submenu')) {
        e.preventDefault();
        nextEl.classList.toggle('show');
      }
    };

    sidebarLinks.forEach(link => {
      link.addEventListener('click', handleClick);
    });

    return () => {
      sidebarLinks.forEach(link => {
        link.removeEventListener('click', handleClick);
      });
    };
  }, []);
  const fetchReviews = async () => {
    try {
      let res;
      if (filterStatus === 'all') {
        res = await axios.get('http://localhost:8082/PureFoods/api/review/admin/all');
      } else {
        res = await axios.get(`http://localhost:8082/PureFoods/api/review/admin/filter?status=${filterStatus}`);
      }
      setReviews(res.data);
    } catch (err) {
      console.error("Error fetching reviews:", err);
    }
  };

  const fetchAverageRatings = async () => {
    try {
      const res = await axios.get('http://localhost:8082/PureFoods/api/review/average/all');
      setAvgRatings(res.data);
    } catch (err) {
      console.error("Error fetching averages:", err);
    }
  };

  const toggleStatus = async (reviewId, currentStatus) => {
    try {
      await axios.put(`http://localhost:8082/PureFoods/api/review/admin/status`, null, {
        params: { reviewId, status: currentStatus === 1 ? 0 : 1 }
      });
      fetchReviews();
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  const deleteReview = async (reviewId) => {
    try {
      await axios.delete(`http://localhost:8082/PureFoods/api/review/admin/delete?reviewId=${reviewId}`);
      fetchReviews();
    } catch (err) {
      console.error("Error deleting review:", err);
    }
  };

  return (
    <div className="page-wrapper compact-wrapper" id="pageWrapper">
      <TopBar />
      <div className="page-body-wrapper">
        <SideBar />
        <div className="page-body">
          <div className="container">
            <h2 className="page-title">Quản lý đánh giá sản phẩm</h2>

            <div className="filter-section">
              <label>Lọc theo trạng thái: </label>
              <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
                <option value="all">Tất cả</option>
                <option value="1">Hiển thị</option>
                <option value="0">Đã ẩn</option>
              </select>
            </div>

            <div className="table-wrapper">
              <table className="review-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Sản phẩm</th>
                    <th>Người mua</th>
                    <th>Sao</th>
                    <th>Bình luận</th>
                    <th>Trạng thái</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {reviews.map((r, i) => (
                    <tr key={r.reviewId}>
                      <td>{i + 1}</td>
                      <td>{r.productName}</td>
                      <td>{r.customerName}</td>
                      <td>{r.rating}</td>
                      <td>{r.comment}</td>
                      <td className={r.status === 1 ? "status-active" : "status-inactive"}>
                        {r.status === 1 ? "Hiển thị" : "Đã ẩn"}
                      </td>
                      <td>
                        <button className="btn-toggle" onClick={() => toggleStatus(r.reviewId, r.status)}>Đổi trạng thái</button>
                        <button className="btn-delete" onClick={() => deleteReview(r.reviewId)}>Xoá</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h3 className="avg-title">📊 Số sao trung bình theo sản phẩm</h3>
            <div className="table-wrapper">
              <table className="review-table">
                <thead>
                  <tr>
                    <th>ID Sản phẩm</th>
                    <th>Tên sản phẩm</th>
                    <th>Số sao TB</th>
                  </tr>
                </thead>
                <tbody>
                  {avgRatings.map((p, i) => (
                    <tr key={i}>
                      <td>{p.productId}</td>
                      <td>{p.productName}</td>
                      <td>{p.rating}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductReview;

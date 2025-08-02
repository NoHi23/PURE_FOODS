import React, { useEffect, useState } from 'react';
import axios from 'axios';
import $ from 'jquery';
import 'datatables.net';
import TopBar from '../AdminDashboard/TopBar';
import SideBar from '../AdminDashboard/SideBar';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as bootstrap from 'bootstrap';

const Coupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  const [editCoupon, setEditCoupon] = useState({
    promotionID: '',
    promotionCode: '',
    description: '',
    discountType: 'Percentage',
    discountValue: '',
    startDate: '',
    endDate: '',
    minOrderAmount: '',
    status: 1,
  });
  const [couponToDelete, setCouponToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCoupons = coupons.slice(startIndex, endIndex);
  const totalPages = Math.ceil(coupons.length / itemsPerPage);

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const res = await axios.get('http://localhost:8082/PureFoods/api/promotion/getAll');
        setCoupons(res.data.promotionList || []);
      } catch (err) {
        toast.error('Không thể tải danh sách mã giảm giá!');
        console.error('Fetch error:', err);
      }
    };
    fetchCoupons();
  }, []);

  useEffect(() => {
    const tableId = '#coupon_table';
    if (coupons.length > 0) {
      if ($.fn.DataTable.isDataTable(tableId)) {
        $(tableId).DataTable().destroy();
      }
      $(tableId).DataTable({
        paging: false,
        ordering: false,
        info: false,
        responsive: true,
      });
    }
  }, [coupons]);

  useEffect(() => {
    const sidebarLinks = document.querySelectorAll('.sidebar-link');
    const handleClick = (e) => {
      const nextEl = e.currentTarget.nextElementSibling;
      if (nextEl?.classList.contains('sidebar-submenu')) {
        e.preventDefault();
        nextEl.classList.toggle('show');
      }
    };
    sidebarLinks.forEach(link => link.addEventListener('click', handleClick));
    return () => sidebarLinks.forEach(link => link.removeEventListener('click', handleClick));
  }, []);

  const handleView = (coupon) => {
    setSelectedCoupon(coupon);
    new bootstrap.Modal(document.getElementById('viewModal')).show();
  };

  const handleEdit = (coupon) => {
    setEditCoupon({
      promotionID: coupon.promotionID,
      promotionCode: coupon.promotionCode,
      description: coupon.description || '',
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      startDate: coupon.startDate ? new Date(coupon.startDate).toISOString().split('T')[0] : '',
      endDate: coupon.endDate ? new Date(coupon.endDate).toISOString().split('T')[0] : '',
      minOrderAmount: coupon.minOrderAmount || '',
      status: coupon.status,
    });
    new bootstrap.Modal(document.getElementById('editModal')).show();
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditCoupon(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (checked ? 1 : 0) : value,
    }));
  };

  const handleUpdateCoupon = async (e) => {
    e.preventDefault();
    if (!editCoupon.promotionCode || !editCoupon.description || !editCoupon.discountValue || !editCoupon.startDate || !editCoupon.endDate) {
      toast.error('Vui lòng nhập đầy đủ thông tin bắt buộc!');
      return;
    }
    const payload = {
      promotionCode: editCoupon.promotionCode,
      description: editCoupon.description,
      discountType: editCoupon.discountType,
      discountValue: parseFloat(editCoupon.discountValue) || 0,
      startDate: editCoupon.startDate,
      endDate: editCoupon.endDate,
      minOrderAmount: parseFloat(editCoupon.minOrderAmount) || null,
      status: editCoupon.status,
    };
    try {
      await axios({
        method: 'put',
        url: `http://localhost:8082/PureFoods/api/promotion/update/${editCoupon.promotionID}`,
        data: payload,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });
      setCoupons(coupons.map(c => c.promotionID === editCoupon.promotionID ? { ...c, ...payload } : c));
      bootstrap.Modal.getInstance(document.getElementById('editModal')).hide();
      toast.success('Cập nhật mã giảm giá thành công!');
    } catch (putErr) {
      if (putErr.response?.status === 405) {
        console.warn('PUT method not supported, falling back to POST...');
        try {
          await axios({
            method: 'post',
            url: `http://localhost:8082/PureFoods/api/promotion/update/${editCoupon.promotionID}`,
            data: payload,
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
          });
          setCoupons(coupons.map(c => c.promotionID === editCoupon.promotionID ? { ...c, ...payload } : c));
          bootstrap.Modal.getInstance(document.getElementById('editModal')).hide();
          toast.success('Cập nhật mã giảm giá thành công (POST fallback)!');
        } catch (postErr) {
          const errorMessage = postErr.response?.data?.message || 'Lỗi khi cập nhật mã giảm giá!';
          toast.error(errorMessage);
          console.error('POST fallback error:', postErr);
        }
      } else {
        const errorMessage = putErr.response?.data?.message || 'Lỗi khi cập nhật mã giảm giá!';
        toast.error(errorMessage);
        console.error('PUT error:', putErr);
      }
    }
  };

  const handleDelete = async () => {
    if (!couponToDelete) return;
    try {
      await axios.delete(`http://localhost:8082/PureFoods/api/promotion/delete/${couponToDelete.promotionID}`, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });
      setCoupons(coupons.filter(c => c.promotionID !== couponToDelete.promotionID));
      bootstrap.Modal.getInstance(document.getElementById('deleteModal')).hide();
      toast.success('Xóa mã giảm giá thành công!');
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Lỗi khi xóa mã giảm giá!';
      toast.error(errorMessage);
      console.error('Delete error:', err);
    }
  };

  return (
    <div className="page-wrapper compact-wrapper">
      <TopBar />
      <div className="page-body-wrapper">
        <SideBar />
        <div className="page-body">
          <div className="container-fluid">
            <div className="card card-table">
              <div className="card-body">
                <div className="title-header option-title d-flex justify-content-between align-items-center">
                  <h5>Danh sách mã giảm giá</h5>
                  <Link to="/admin-add-new-coupons" className="btn btn-theme d-flex align-items-center">
                    <i data-feather="plus"></i>Thêm mới mã giảm giá
                  </Link>
                </div>
                <div className="table-responsive">
                  <table className="table theme-table" id="coupon_table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Mã</th>
                        <th>Mô tả</th>
                        <th>Loại</th>
                        <th>Giá trị</th>
                        <th>Bắt đầu</th>
                        <th>Kết thúc</th>
                        <th>Đơn tối thiểu</th>
                        <th>Trạng thái</th>
                        <th>Tùy chọn</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentCoupons.map((c, i) => (
                        <tr key={i}>
                          <td className="text-center">#00{c.promotionID}</td>
                          <td>{c.promotionCode}</td>
                          <td>{c.description || '-'}</td>
                          <td>{c.discountType}</td>
                          <td>{c.discountValue}</td>
                          <td>{new Date(c.startDate).toLocaleDateString('vi-VN')}</td>
                          <td>{new Date(c.endDate).toLocaleDateString('vi-VN')}</td>
                          <td>{c.minOrderAmount || '-'}</td>
                          <td className={c.status === 1 ? 'status-success' : 'status-danger'}>
                            {c.status === 1 ? 'Hoạt động' : 'Không hoạt động'}
                          </td>
                          <td>
                            <ul className="d-flex gap-2 list-unstyled">
                              <li><a href="#" onClick={(e) => { e.preventDefault(); handleView(c); }}><i className="ri-eye-line"></i></a></li>
                              <li><a href="#" onClick={(e) => { e.preventDefault(); handleEdit(c); }}><i className="ri-pencil-line"></i></a></li>
                              <li><a href="#" data-bs-toggle="modal" data-bs-target="#deleteModal" onClick={() => setCouponToDelete(c)}><i className="ri-delete-bin-line"></i></a></li>
                            </ul>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="pagination-container d-flex justify-content-center mt-3">
                    <nav>
                      <ul className="pagination">
                        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                          <button className="page-link" onClick={() => setCurrentPage(currentPage - 1)}>Previous</button>
                        </li>
                        {[...Array(totalPages)].map((_, i) => (
                          <li key={i} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                            <button className="page-link" onClick={() => setCurrentPage(i + 1)}>{i + 1}</button>
                          </li>
                        ))}
                        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                          <button className="page-link" onClick={() => setCurrentPage(currentPage + 1)}>Next</button>
                        </li>
                      </ul>
                    </nav>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <footer className="footer container-fluid">
            <div className="row">
              <div className="col-md-12 footer-copyright text-center">
                <p className="mb-0">Copyright 2025 © Clean Food Shop theme by pixelstrap</p>
              </div>
            </div>
          </footer>
        </div>
      </div>

      <div className="modal fade" id="viewModal" tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Chi tiết mã giảm giá</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body">
              {selectedCoupon && (
                <>
                  <p><strong>ID:</strong> {selectedCoupon.promotionID}</p>
                  <p><strong>Mã:</strong> {selectedCoupon.promotionCode}</p>
                  <p><strong>Mô tả:</strong> {selectedCoupon.description || '-'}</p>
                  <p><strong>Loại:</strong> {selectedCoupon.discountType}</p>
                  <p><strong>Giá trị:</strong> {selectedCoupon.discountValue}</p>
                  <p><strong>Ngày bắt đầu:</strong> {new Date(selectedCoupon.startDate).toLocaleDateString('vi-VN')}</p>
                  <p><strong>Ngày kết thúc:</strong> {new Date(selectedCoupon.endDate).toLocaleDateString('vi-VN')}</p>
                  <p><strong>Đơn tối thiểu:</strong> {selectedCoupon.minOrderAmount || '-'}</p>
                  <p><strong>Trạng thái:</strong> {selectedCoupon.status === 1 ? 'Hoạt động' : 'Không hoạt động'}</p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="modal fade" id="editModal" tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Cập nhật mã giảm giá</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleUpdateCoupon}>
                <div className="mb-3">
                  <label className="form-label" htmlFor="promotionCode">Mã giảm giá</label>
                  <input id="promotionCode" type="text" className="form-control" name="promotionCode" value={editCoupon.promotionCode} onChange={handleInputChange} required />
                </div>
                <div className="mb-3">
                  <label className="form-label" htmlFor="description">Mô tả</label>
                  <input id="description" type="text" className="form-control" name="description" value={editCoupon.description} onChange={handleInputChange} required />
                </div>
                <div className="mb-3">
                  <label className="form-label" htmlFor="discountType">Loại giảm giá</label>
                  <select id="discountType" className="form-control" name="discountType" value={editCoupon.discountType} onChange={handleInputChange}>
                    <option value="Percentage">Phần trăm</option>
                    <option value="Fixed">Cố định</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label" htmlFor="discountValue">Giá trị giảm</label>
                  <input id="discountValue" type="number" step="0.01" className="form-control" name="discountValue" value={editCoupon.discountValue} onChange={handleInputChange} required />
                </div>
                <div className="mb-3">
                  <label className="form-label" htmlFor="startDate">Ngày bắt đầu</label>
                  <input id="startDate" type="date" className="form-control" name="startDate" value={editCoupon.startDate} onChange={handleInputChange} required />
                </div>
                <div className="mb-3">
                  <label className="form-label" htmlFor="endDate">Ngày kết thúc</label>
                  <input id="endDate" type="date" className="form-control" name="endDate" value={editCoupon.endDate} onChange={handleInputChange} required />
                </div>
                <div className="mb-3">
                  <label className="form-label" htmlFor="minOrderAmount">Đơn tối thiểu</label>
                  <input id="minOrderAmount" type="number" step="0.01" className="form-control" name="minOrderAmount" value={editCoupon.minOrderAmount} onChange={handleInputChange} />
                </div>
                <div className="mb-3">
                  <label className="form-label" htmlFor="status">Trạng thái</label>
                  <select id="status" className="form-control" name="status" value={editCoupon.status} onChange={handleInputChange}>
                    <option value="0">Không hoạt động</option>
                    <option value="1">Hoạt động</option>
                  </select>
                </div>
                <div className="text-end">
                  <button type="button" className="btn btn-secondary me-2" data-bs-dismiss="modal">Hủy</button>
                  <button type="submit" className="btn btn-animation">Lưu thay đổi</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div className="modal fade theme-modal" id="deleteModal" tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header text-center">
              <h5 className="modal-title w-100">Xác nhận xóa</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal">
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-body">
              <p>Bạn có chắc chắn muốn xóa mã giảm giá này?</p>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-animation btn-md fw-bold" data-bs-dismiss="modal">Hủy</button>
              <button type="button" className="btn btn-animation btn-md fw-bold" data-bs-dismiss="modal" onClick={handleDelete}>Xóa</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Coupons;
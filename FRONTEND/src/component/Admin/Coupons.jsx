import React, { useEffect, useState } from 'react';
import './Coupons.css';
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
    discountType: 'Percentage',
    discountValue: '',
    startDate: '',
    endDate: '',
    minOrderAmount: '',
    status: 0,
  });
  const [couponToDelete, setCouponToDelete] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get('http://localhost:8082/PureFoods/api/promotion/getAll')
      .then((res) => {
        const couponList = res.data.promotionList || [];
        setCoupons(couponList);
      })
      .catch(() => setCoupons([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const sidebarLinks = document.querySelectorAll('.sidebar-link');
    const handleClick = (e) => {
      const nextEl = e.currentTarget.nextElementSibling;
      if (nextEl && nextEl.classList.contains('sidebar-submenu')) {
        e.preventDefault();
        nextEl.classList.toggle('show');
      }
    };
    sidebarLinks.forEach((link) => link.addEventListener('click', handleClick));
    return () => sidebarLinks.forEach((link) => link.removeEventListener('click', handleClick));
  }, []);

  useEffect(() => {
    if (coupons.length > 0) {
      const table = $('#coupon_table').DataTable({
        paging: false,
        ordering: false,
        info: false,
        destroy: true,
        responsive: true,
      });
      return () => table.destroy();
    }
  }, [coupons]);

  const handleView = (coupon) => {
    setSelectedCoupon(coupon);
    new bootstrap.Modal(document.getElementById('viewModal')).show();
  };

  const handleEdit = (coupon) => {
    setSelectedCoupon(coupon);
    setEditCoupon({
      promotionID: coupon.promotionID,
      promotionCode: coupon.promotionCode,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      startDate: coupon.startDate.split('T')[0],
      endDate: coupon.endDate.split('T')[0],
      minOrderAmount: coupon.minOrderAmount || '',
      status: coupon.status,
    });
    new bootstrap.Modal(document.getElementById('editModal')).show();
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditCoupon((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (checked ? 1 : 0) : value,
    }));
  };

  const handleUpdateCoupon = async (e) => {
    e.preventDefault();
    if (!editCoupon.promotionCode || !editCoupon.discountValue || !editCoupon.startDate || !editCoupon.endDate) {
      toast.error('Vui lòng nhập đầy đủ (Mã, Giá trị giảm, Ngày bắt đầu, Ngày kết thúc)');
      return;
    }
    try {
      const payload = {
        promotionCode: editCoupon.promotionCode,
        discountType: editCoupon.discountType,
        discountValue: parseFloat(editCoupon.discountValue) || 0,
        startDate: new Date(editCoupon.startDate).toISOString().split('T')[0],
        endDate: new Date(editCoupon.endDate).toISOString().split('T')[0],
        minOrderAmount: parseFloat(editCoupon.minOrderAmount) || null,
        status: editCoupon.status,
      };
      const res = await axios.put(
        `http://localhost:8082/PureFoods/api/promotion/update/${editCoupon.promotionID}`,
        payload
      );
      if (res.data.status === 200) {
        await axios
          .get('http://localhost:8082/PureFoods/api/promotion/getAll')
          .then((res) => setCoupons(res.data.promotionList || []));
        bootstrap.Modal.getInstance(document.getElementById('editModal')).hide();
        toast.success(res.data.message || 'Cập nhật mã giảm giá thành công!');
      } else {
        toast.warning(res.data.message || 'Cập nhật mã giảm giá thất bại!');
      }
    } catch (err) {
      const errorMessage =
        err.response && err.response.data && err.response.data.message
          ? err.response.data.message
          : 'Lỗi khi gọi API';
      toast.error(errorMessage);
    }
  };

  const confirmDelete = (coupon) => {
    setCouponToDelete(coupon);
    new bootstrap.Modal(document.getElementById('deleteModal')).show();
  };

  const handleDelete = async () => {
    try {
      const res = await axios.delete(
        `http://localhost:8082/PureFoods/api/promotion/delete/${couponToDelete.promotionID}`
      );
      if (res.data.status === 200) {
        await axios
          .get('http://localhost:8082/PureFoods/api/promotion/getAll')
          .then((res) => setCoupons(res.data.promotionList || []));
        bootstrap.Modal.getInstance(document.getElementById('deleteModal')).hide();
        toast.success(res.data.message || 'Xóa mã giảm giá thành công!');
      } else {
        toast.warning(res.data.message || 'Xóa mã giảm giá thất bại!');
      }
    } catch (err) {
      const errorMessage =
        err.response && err.response.data && err.response.data.message
          ? err.response.data.message
          : 'Lỗi khi gọi API';
      toast.error(errorMessage);
    }
  };

  return (
    <div>
      <div className="tap-top">
        <span className="lnr lnr-chevron-up"></span>
      </div>
      <div className="page-wrapper compact-wrapper" id="pageWrapper">
        <TopBar />
        <div className="page-body-wrapper">
          <SideBar />
          <div className="page-body">
            <div className="container-fluid">
              <div className="row">
                <div className="col-12">
                  <div className="row">
                    <div className="col-sm-12">
                      <div className="card">
                        <div className="card-body">
                          <div className="title-header option-title d-flex justify-content-between align-items-center">
                            <h5>Coupon List</h5>
                            <div>
                              <Link to="/admin-add-new-coupons" className="btn btn-animation">
                                Add New Coupon
                              </Link>
                            </div>

                          </div>
                          {loading ? (
                            <p>Loading...</p>
                          ) : coupons.length === 0 ? (
                            <p>Không có mã giảm giá nào để hiển thị.</p>
                          ) : (
                            <div className="table-responsive">
                              <table className="table theme-table" id="coupon_table">
                                <thead>
                                  <tr>
                                    <th>ID</th>
                                    <th>Code</th>
                                    <th>Discount Type</th>
                                    <th>Discount Value</th>
                                    <th>Start Date</th>
                                    <th>End Date</th>
                                    <th>Min Order</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {coupons.map((c, i) => (
                                    <tr key={i}>
                                      <td>{c.promotionID}</td>
                                      <td>{c.promotionCode}</td>
                                      <td>{c.discountType}</td>
                                      <td>{c.discountValue}</td>
                                      <td>{new Date(c.startDate).toLocaleDateString()}</td>
                                      <td>{new Date(c.endDate).toLocaleDateString()}</td>
                                      <td>{c.minOrderAmount || '-'}</td>
                                      <td className={c.status === 1 ? 'status-success' : 'status-danger'}>
                                        {c.status === 1 ? 'Active' : 'Inactive'}
                                      </td>
                                      <td>
                                        <ul className="table-action-icons">
                                          <li>
                                            <a
                                              href="#"
                                              onClick={(e) => {
                                                e.preventDefault();
                                                handleView(c);
                                              }}
                                            >
                                              <i className="ri-eye-line"></i>
                                            </a>
                                          </li>
                                          <li>
                                            <a
                                              href="#"
                                              onClick={(e) => {
                                                e.preventDefault();
                                                handleEdit(c);
                                              }}
                                            >
                                              <i className="ri-pencil-line"></i>
                                            </a>
                                          </li>
                                          <li>
                                            <a
                                              href="#"
                                              onClick={(e) => {
                                                e.preventDefault();
                                                confirmDelete(c);
                                              }}
                                            >
                                              <i className="ri-delete-bin-line"></i>
                                            </a>
                                          </li>
                                        </ul>
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          )}
                          <div className="modal fade" id="viewModal" tabIndex="-1">
                            <div className="modal-dialog modal-dialog-centered">
                              <div className="modal-content">
                                <div className="modal-header">
                                  <h5 className="modal-title">Coupon Detail</h5>
                                  <button
                                    type="button"
                                    className="btn-close"
                                    data-bs-dismiss="modal"
                                    aria-label="Close"
                                  ></button>
                                </div>
                                <div className="modal-body">
                                  {selectedCoupon && (
                                    <>
                                      <p>
                                        <strong>ID:</strong> {selectedCoupon.promotionID}
                                      </p>
                                      <p>
                                        <strong>Code:</strong> {selectedCoupon.promotionCode}
                                      </p>
                                      <p>
                                        <strong>Discount Type:</strong> {selectedCoupon.discountType}
                                      </p>
                                      <p>
                                        <strong>Discount Value:</strong> {selectedCoupon.discountValue}
                                      </p>
                                      <p>
                                        <strong>Start Date:</strong>{' '}
                                        {new Date(selectedCoupon.startDate).toLocaleDateString()}
                                      </p>
                                      <p>
                                        <strong>End Date:</strong>{' '}
                                        {new Date(selectedCoupon.endDate).toLocaleDateString()}
                                      </p>
                                      <p>
                                        <strong>Min Order Amount:</strong> {selectedCoupon.minOrderAmount || '-'}
                                      </p>
                                      <p>
                                        <strong>Status:</strong>{' '}
                                        {selectedCoupon.status === 1 ? 'Active' : 'Inactive'}
                                      </p>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="modal fade" id="editModal" tabIndex="-1">
                            <div className="modal-dialog modal-dialog-centered">
                              <div className="modal-content">
                                <div className="modal-header">
                                  <h5 className="modal-title">Edit Coupon</h5>
                                  <button
                                    type="button"
                                    className="btn-close"
                                    data-bs-dismiss="modal"
                                    aria-label="Close"
                                  ></button>
                                </div>
                                <div className="modal-body">
                                  <form onSubmit={handleUpdateCoupon}>
                                    <div className="mb-4 row align-items-center">
                                      <label className="col-lg-2 col-md-3 mb-0">Code</label>
                                      <div className="col-md-9 col-lg-10">
                                        <input
                                          type="text"
                                          className="form-control"
                                          name="promotionCode"
                                          value={editCoupon.promotionCode}
                                          onChange={handleInputChange}
                                          required
                                        />
                                      </div>
                                    </div>
                                    <div className="mb-4 row align-items-center">
                                      <label className="col-lg-2 col-md-3 mb-0">Discount Type</label>
                                      <div className="col-md-9 col-lg-10">
                                        <select
                                          className="form-control"
                                          name="discountType"
                                          value={editCoupon.discountType}
                                          onChange={handleInputChange}
                                        >
                                          <option value="Percentage">Percentage</option>
                                          <option value="Fixed">Fixed</option>
                                        </select>
                                      </div>
                                    </div>
                                    <div className="mb-4 row align-items-center">
                                      <label className="col-lg-2 col-md-3 mb-0">Discount Value</label>
                                      <div className="col-md-9 col-lg-10">
                                        <input
                                          type="number"
                                          step="0.01"
                                          className="form-control"
                                          name="discountValue"
                                          value={editCoupon.discountValue}
                                          onChange={handleInputChange}
                                          required
                                        />
                                      </div>
                                    </div>
                                    <div className="mb-4 row align-items-center">
                                      <label className="col-lg-2 col-md-3 mb-0">Start Date</label>
                                      <div className="col-md-9 col-lg-10">
                                        <input
                                          type="date"
                                          className="form-control"
                                          name="startDate"
                                          value={editCoupon.startDate}
                                          onChange={handleInputChange}
                                          required
                                        />
                                      </div>
                                    </div>
                                    <div className="mb-4 row align-items-center">
                                      <label className="col-lg-2 col-md-3 mb-0">End Date</label>
                                      <div className="col-md-9 col-lg-10">
                                        <input
                                          type="date"
                                          className="form-control"
                                          name="endDate"
                                          value={editCoupon.endDate}
                                          onChange={handleInputChange}
                                          required
                                        />
                                      </div>
                                    </div>
                                    <div className="mb-4 row align-items-center">
                                      <label className="col-lg-2 col-md-3 mb-0">Min Order Amount</label>
                                      <div className="col-md-9 col-lg-10">
                                        <input
                                          type="number"
                                          step="0.01"
                                          className="form-control"
                                          name="minOrderAmount"
                                          value={editCoupon.minOrderAmount}
                                          onChange={handleInputChange}
                                        />
                                      </div>
                                    </div>
                                    <div className="mb-4 row align-items-center">
                                      <label className="col-lg-2 col-md-3 mb-0">Active</label>
                                      <div className="col-md-9 col-lg-10 d-flex align-items-center">
                                        <label className="switch">
                                          <input
                                            type="checkbox"
                                            name="status"
                                            checked={editCoupon.status === 1}
                                            onChange={handleInputChange}
                                          />
                                          <span className="switch-state"></span>
                                        </label>
                                      </div>
                                    </div>
                                    <div className="card-submit-button">
                                      <button
                                        type="button"
                                        className="btn btn-secondary"
                                        data-bs-dismiss="modal"
                                      >
                                        Cancel
                                      </button>
                                      <button type="submit" className="btn btn-animation ms-auto">
                                        Save Changes
                                      </button>
                                    </div>
                                  </form>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="modal fade" id="deleteModal" tabIndex="-1">
                            <div className="modal-dialog modal-dialog-centered">
                              <div className="modal-content">
                                <div className="modal-header text-center">
                                  <h5 className="modal-title w-100">Confirm Delete</h5>
                                  <button
                                    type="button"
                                    className="btn-close"
                                    data-bs-dismiss="modal"
                                    aria-label="Close"
                                  ></button>
                                </div>
                                <div className="modal-body text-center">
                                  <p>Are you sure you want to delete this coupon?</p>
                                  <button className="btn btn-danger m-2" onClick={handleDelete}>
                                    Yes
                                  </button>
                                  <button
                                    className="btn btn-secondary m-2"
                                    data-bs-dismiss="modal"
                                  >
                                    No
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="container-fluid">
              <footer className="footer">
                <div className="row">
                  <div className="col-md-12 footer-copyright text-center">
                    <p className="mb-0">Copyright 2025 © Fastkart Theme</p>
                  </div>
                </div>
              </footer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Coupons;
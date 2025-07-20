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
    description: '',
    discountType: 'Percentage',
    discountValue: '',
    startDate: '',
    endDate: '',
    minOrderAmount: '',
    status: 1,
  });
  const [couponToDelete, setCouponToDelete] = useState(null);

  const fetchCoupons = async () => {
    try {
      const res = await axios.get('http://localhost:8082/PureFoods/api/promotion/getAll');
      const list = Array.isArray(res.data) ? res.data : res.data.listPromotion || [];
      setCoupons(list);
    } catch (err) {
      console.error('Error fetching coupons:', err);
      toast.error("Lỗi khi tải danh sách mã giảm giá!");
    }
  };

  useEffect(() => {
    fetchCoupons();
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
    sidebarLinks.forEach(link => link.addEventListener('click', handleClick));
    return () => sidebarLinks.forEach(link => link.removeEventListener('click', handleClick));
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
      description: coupon.description || '',
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      startDate: coupon.startDate ? new Date(coupon.startDate).toISOString().split('T')[0] : '',
      endDate: coupon.endDate ? new Date(coupon.endDate).toISOString().split('T')[0] : '',
      minOrderAmount: coupon.minOrderAmount || '',
      status: coupon.status
    });
    new bootstrap.Modal(document.getElementById('editModal')).show();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditCoupon(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdateCoupon = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...editCoupon,
        discountValue: parseFloat(editCoupon.discountValue) || 0,
        minOrderAmount: parseFloat(editCoupon.minOrderAmount) || null,
        startDate: new Date(editCoupon.startDate).toISOString().split('T')[0],
        endDate: new Date(editCoupon.endDate).toISOString().split('T')[0],
        description: editCoupon.description || null
      };
      const res = await axios.put(
        `http://localhost:8082/PureFoods/api/promotion/update/${editCoupon.promotionID}`,
        payload
      );
      if (res.data.status === 200) {
        await fetchCoupons(); // Refresh the coupon list
        bootstrap.Modal.getInstance(document.getElementById('editModal')).hide();
        toast.success('Cập nhật mã giảm giá thành công!');
      } else {
        toast.error(res.data.message || 'Lỗi cập nhật!');
      }
    } catch (err) {
      console.error('Update error:', err);
      toast.error('Lỗi khi gọi API!');
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
        await fetchCoupons();
        bootstrap.Modal.getInstance(document.getElementById('deleteModal')).hide();
        toast.success('Đã xóa mã giảm giá!');
      } else {
        toast.error(res.data.message || 'Xóa thất bại!');
      }
    } catch (err) {
      console.error('Delete error:', err);
      toast.error('Lỗi khi gọi API!');
    }
  };

  return (
    <div className="page-wrapper compact-wrapper" id="pageWrapper">
      <TopBar />
      <div className="page-body-wrapper">
        <SideBar />
        <div className="page-body">
          <div className="container-fluid">
            <div className="row">
              <div className="col-sm-12">
                <div className="card card-table">
                  <div className="card-body">
                    <div className="title-header option-title d-sm-flex d-block">
                      <h5>Coupon List</h5>
                      <div className="right-options">
                        <ul>
                          <li>
                            <Link to="/admin-add-new-coupons" className="btn btn-solid">
                              Add Coupon
                            </Link>
                          </li>
                        </ul>
                      </div>
                    </div>

                    <div className="table-responsive">
                      <table className="table theme-table" id="coupon_table">
                        <thead>
                          <tr>
                            <th>ID</th>
                            <th>Code</th>
                            <th>Description</th>
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
                              <td>{c.description || '-'}</td>
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
                                    <a href="#" onClick={(e) => { e.preventDefault(); handleView(c); }}>
                                      <i className="ri-eye-line"></i>
                                    </a>
                                  </li>
                                  <li>
                                    <a href="#" onClick={(e) => { e.preventDefault(); handleEdit(c); }}>
                                      <i className="ri-pencil-line"></i>
                                    </a>
                                  </li>
                                  <li>
                                    <a href="#" onClick={(e) => { e.preventDefault(); confirmDelete(c); }}>
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

                    {/* VIEW MODAL */}
                    <div className="modal fade" id="viewModal" tabIndex="-1">
                      <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                          <div className="modal-header">
                            <h5 className="modal-title">Coupon Detail</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                          </div>
                          <div className="modal-body">
                            {selectedCoupon && (
                              <>
                                <p><strong>ID:</strong> {selectedCoupon.promotionID}</p>
                                <p><strong>Code:</strong> {selectedCoupon.promotionCode}</p>
                                <p><strong>Description:</strong> {selectedCoupon.description || '-'}</p>
                                <p><strong>Discount Type:</strong> {selectedCoupon.discountType}</p>
                                <p><strong>Discount Value:</strong> {selectedCoupon.discountValue}</p>
                                <p><strong>Start Date:</strong> {new Date(selectedCoupon.startDate).toLocaleDateString()}</p>
                                <p><strong>End Date:</strong> {new Date(selectedCoupon.endDate).toLocaleDateString()}</p>
                                <p><strong>Min Order Amount:</strong> {selectedCoupon.minOrderAmount || '-'}</p>
                                <p><strong>Status:</strong> {selectedCoupon.status === 1 ? 'Active' : 'Inactive'}</p>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* EDIT MODAL */}
                    <div className="modal fade" id="editModal" tabIndex="-1">
                      <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                          <div className="modal-header">
                            <h5 className="modal-title">Edit Coupon</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                          </div>
                          <div className="modal-body">
                            <form onSubmit={handleUpdateCoupon}>
                              <div className="mb-3">
                                <label className="form-label">Code</label>
                                <input
                                  type="text"
                                  className="form-control"
                                  name="promotionCode"
                                  value={editCoupon.promotionCode}
                                  onChange={handleInputChange}
                                  required
                                />
                              </div>
                              <div className="mb-3">
                                <label className="form-label">Description</label>
                                <textarea
                                  className="form-control"
                                  name="description"
                                  value={editCoupon.description}
                                  onChange={handleInputChange}
                                />
                              </div>
                              <div className="mb-3">
                                <label className="form-label">Discount Type</label>
                                <select
                                  name="discountType"
                                  className="form-control"
                                  value={editCoupon.discountType}
                                  onChange={handleInputChange}
                                >
                                  <option value="Percentage">Percentage</option>
                                  <option value="Fixed">Fixed</option>
                                </select>
                              </div>
                              <div className="mb-3">
                                <label className="form-label">Discount Value</label>
                                <input
                                  type="number"
                                  step="0.01"
                                  min="0"
                                  className="form-control"
                                  name="discountValue"
                                  value={editCoupon.discountValue}
                                  onChange={handleInputChange}
                                  required
                                />
                              </div>
                              <div className="mb-3">
                                <label className="form-label">Start Date</label>
                                <input
                                  type="date"
                                  className="form-control"
                                  name="startDate"
                                  value={editCoupon.startDate}
                                  onChange={handleInputChange}
                                  required
                                />
                              </div>
                              <div className="mb-3">
                                <label className="form-label">End Date</label>
                                <input
                                  type="date"
                                  className="form-control"
                                  name="endDate"
                                  value={editCoupon.endDate}
                                  onChange={handleInputChange}
                                  required
                                />
                              </div>
                              <div className="mb-3">
                                <label className="form-label">Min Order Amount</label>
                                <input
                                  type="number"
                                  step="0.01"
                                  min="0"
                                  className="form-control"
                                  name="minOrderAmount"
                                  value={editCoupon.minOrderAmount}
                                  onChange={handleInputChange}
                                />
                              </div>
                              <div className="mb-3">
                                <label className="form-label">Status</label>
                                <select
                                  name="status"
                                  className="form-control"
                                  value={editCoupon.status}
                                  onChange={handleInputChange}
                                >
                                  <option value={1}>Active</option>
                                  <option value={0}>Inactive</option>
                                </select>
                              </div>
                              <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                                  Cancel
                                </button>
                                <button type="submit" className="btn btn-primary">
                                  Save Changes
                                </button>
                              </div>
                            </form>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* DELETE MODAL */}
                    <div className="modal fade" id="deleteModal" tabIndex="-1">
                      <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                          <div className="modal-header text-center">
                            <h5 className="modal-title w-100">Confirm Delete</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                          </div>
                          <div className="modal-body text-center">
                            <p>Are you sure you want to delete this coupon?</p>
                            <button className="btn btn-danger m-2" onClick={handleDelete}>
                              Yes
                            </button>
                            <button className="btn btn-secondary m-2" data-bs-dismiss="modal">
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
  );
};

export default Coupons;
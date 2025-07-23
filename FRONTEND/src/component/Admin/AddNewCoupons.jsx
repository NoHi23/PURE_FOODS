import React, { useEffect, useState } from 'react';
import './AddNewCoupons.css';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import TopBar from '../AdminDashboard/TopBar';
import SideBar from '../AdminDashboard/SideBar';

const AddNewCoupons = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    promotionCode: '',
    description: '',
    discountType: 'Percentage',
    discountValue: '',
    startDate: '',
    endDate: '',
    minOrderAmount: '',
    status: 0,
  });

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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (checked ? 1 : 0) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.promotionCode || !form.description || !form.discountValue || !form.startDate || !form.endDate) {
      toast.error('Vui lòng nhập đầy đủ (Mã, Mô tả, Giá trị giảm, Ngày bắt đầu, Ngày kết thúc)');
      return;
    }

    try {
      const payload = {
        promotionCode: form.promotionCode,
        description: form.description,
        discountType: form.discountType,
        discountValue: parseFloat(form.discountValue) || 0,
        startDate: new Date(form.startDate).toISOString().split('T')[0],
        endDate: new Date(form.endDate).toISOString().split('T')[0],
        minOrderAmount: parseFloat(form.minOrderAmount) || null,
        status: form.status,
      };
      const res = await axios.post('http://localhost:8082/PureFoods/api/promotion/create', payload);
      if (res.data.status === 200) {
        toast.success(res.data.message || 'Thêm mã giảm giá thành công!');
        setForm({
          promotionCode: '',
          description: '',
          discountType: 'Percentage',
          discountValue: '',
          startDate: '',
          endDate: '',
          minOrderAmount: '',
          status: 0,
        });
        navigate('/admin-coupons');
      } else {
        toast.warning(res.data.message || 'Có lỗi xảy ra');
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
                    <div className="col-sm-8 m-auto">
                      <div className="card">
                        <div className="card-body">
                          <div className="title-header option-title">
                            <h5>Add New Coupon</h5>
                          </div>
                          <form className="theme-form theme-form-2 mega-form" onSubmit={handleSubmit}>
                            <div className="mb-4 row align-items-center">
                              <label className="col-lg-2 col-md-3 mb-0">Coupon Code</label>
                              <div className="col-md-9 col-lg-10">
                                <input
                                  className="form-control"
                                  type="text"
                                  name="promotionCode"
                                  value={form.promotionCode}
                                  onChange={handleChange}
                                  required
                                />
                              </div>
                            </div>
                            <div className="mb-4 row align-items-center">
                              <label className="col-lg-2 col-md-3 mb-0">Description</label>
                              <div className="col-md-9 col-lg-10">
                                <input
                                  className="form-control"
                                  type="text"
                                  name="description"
                                  value={form.description}
                                  onChange={handleChange}
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
                                  value={form.discountType}
                                  onChange={handleChange}
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
                                  className="form-control"
                                  type="number"
                                  step="0.01"
                                  min="0"
                                  name="discountValue"
                                  value={form.discountValue}
                                  onChange={handleChange}
                                  required
                                />
                              </div>
                            </div>
                            <div className="mb-4 row align-items-center">
                              <label className="col-lg-2 col-md-3 mb-0">Start Date</label>
                              <div className="col-md-9 col-lg-10">
                                <input
                                  className="form-control"
                                  type="date"
                                  name="startDate"
                                  value={form.startDate}
                                  onChange={handleChange}
                                  required
                                />
                              </div>
                            </div>
                            <div className="mb-4 row align-items-center">
                              <label className="col-lg-2 col-md-3 mb-0">End Date</label>
                              <div className="col-md-9 col-lg-10">
                                <input
                                  className="form-control"
                                  type="date"
                                  name="endDate"
                                  value={form.endDate}
                                  onChange={handleChange}
                                  required
                                />
                              </div>
                            </div>
                            <div className="mb-4 row align-items-center">
                              <label className="col-lg-2 col-md-3 mb-0">Min Order Amount</label>
                              <div className="col-md-9 col-lg-10">
                                <input
                                  className="form-control"
                                  type="number"
                                  step="0.01"
                                  min="0"
                                  name="minOrderAmount"
                                  value={form.minOrderAmount}
                                  onChange={handleChange}
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
                                    checked={form.status === 1}
                                    onChange={(e) =>
                                      setForm({
                                        ...form,
                                        status: e.target.checked ? 1 : 0,
                                      })
                                    }
                                  />
                                  <span className="switch-state"></span>
                                </label>
                              </div>
                            </div>
                            <div className="card-submit-button">
                              <button className="btn btn-animation ms-auto" type="submit">
                                Submit
                              </button>
                            </div>
                          </form>
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

export default AddNewCoupons;
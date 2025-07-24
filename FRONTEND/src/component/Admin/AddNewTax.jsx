import React, { useEffect, useState } from 'react';
import './AddNewTax.css';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import TopBar from '../AdminDashboard/TopBar';
import SideBar from '../AdminDashboard/SideBar';

const AddNewTax = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    taxName: '',
    taxRate: '',
    description: '',
    effectiveDate: '',
    status: 1, // Default to active (1)
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
    sidebarLinks.forEach(link => link.addEventListener('click', handleClick));
    return () => sidebarLinks.forEach(link => link.removeEventListener('click', handleClick));
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (checked ? 1 : 0) : value, // Checked = active (1), unchecked = inactive (0)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.taxName || !form.taxRate || !form.effectiveDate) {
      toast.error("Vui lòng nhập đầy đủ (Tên thuế, Tỷ lệ thuế, Ngày hiệu lực)");
      return;
    }

    try {
      const payload = {
        taxName: form.taxName,
        taxRate: parseFloat(form.taxRate) || 0,
        description: form.description || null,
        effectiveDate: new Date(form.effectiveDate).toISOString().split('T')[0],
        status: form.status,
      };
      const res = await axios.post('http://localhost:8082/PureFoods/api/tax/create', payload);
      if (res.data.status === 200) {
        toast.success(res.data.message || "Thêm thuế thành công!");
        setForm({
          taxName: '',
          taxRate: '',
          description: '',
          effectiveDate: '',
          status: 1, // Reset to active
        });
        navigate('/admin-taxes');
      } else {
        toast.warning(res.data.message || "Có lỗi xảy ra");
      }
    } catch (err) {
      const errorMessage =
        err.response && err.response.data && err.response.data.message
          ? err.response.data.message
          : "Lỗi khi gọi API";
      toast.error(errorMessage);
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
              <div className="col-12">
                <div className="row">
                  <div className="col-sm-8 m-auto">
                    <div className="card">
                      <div className="card-body">
                        <div className="title-header option-title">
                          <h5>Add New Tax</h5>
                        </div>
                        <form className="theme-form theme-form-2 mega-form" onSubmit={handleSubmit}>
                          <div className="mb-4 row align-items-center">
                            <label className="col-lg-2 col-md-3 mb-0">Tax Name</label>
                            <div className="col-md-9 col-lg-10">
                              <input
                                className="form-control"
                                type="text"
                                name="taxName"
                                value={form.taxName}
                                onChange={handleChange}
                                required
                              />
                            </div>
                          </div>
                          <div className="mb-4 row align-items-center">
                            <label className="col-lg-2 col-md-3 mb-0">Tax Rate (%)</label>
                            <div className="col-md-9 col-lg-10">
                              <input
                                className="form-control"
                                type="number"
                                step="0.01"
                                min="0"
                                name="taxRate"
                                value={form.taxRate}
                                onChange={handleChange}
                                required
                              />
                            </div>
                          </div>
                          <div className="mb-4 row align-items-center">
                            <label className="col-lg-2 col-md-3 mb-0">Description</label>
                            <div className="col-md-9 col-lg-10">
                              <textarea
                                className="form-control"
                                rows="3"
                                name="description"
                                value={form.description}
                                onChange={handleChange}
                              />
                            </div>
                          </div>
                          <div className="mb-4 row align-items-center">
                            <label className="col-lg-2 col-md-3 mb-0">Effective Date</label>
                            <div className="col-md-9 col-lg-10">
                              <input
                                className="form-control"
                                type="date"
                                name="effectiveDate"
                                value={form.effectiveDate}
                                onChange={handleChange}
                                required
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
                                  checked={form.status === 1} // Active when checked
                                  onChange={handleChange}
                                />
                                <span className="switch-state"></span>
                              </label>
                            </div>
                          </div>
                          <div className="card-submit-button">
                            <button className="btn btn-animation ms-auto" type="submit">Submit</button>
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
                  <p className="mb-0">Copyright 2025 © Clean Food Shop theme by pixelstrap</p>
                </div>
              </div>
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddNewTax;
import React, { useState, useEffect } from 'react';
import TopBar from '../AdminDashboard/TopBar';
import SideBar from '../AdminDashboard/SideBar';
import './AddNewSupplier.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const AddNewSupplier = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    supplierName: '',
    contactName: '',
    phone: '',
    email: '',
    address: '',
    organicCertification: '',
    certificationExpiry: '',
    status: 1,
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
    return () => {
      sidebarLinks.forEach((link) => link.removeEventListener('click', handleClick));
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleCheckboxChange = (e) => {
    setForm({ ...form, status: e.target.checked ? 1 : 0 });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8082/PureFoods/api/supplier/create", form);
      toast.success("Thêm nhà cung cấp thành công!");
      //navigate('/admin-supplier');
    } catch (error) {
      toast.error("Lỗi khi thêm nhà cung cấp!");
      console.error(error);
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
              <div className="col-12 col-md-10 offset-md-1">
                <div className="card">
                  <div className="card-header">
                    <h5>Add New Supplier</h5>
                  </div>
                  <div className="card-body">
                    <form onSubmit={handleSubmit} className="theme-form">
                      <div className="mb-3">
                        <label className="form-label">SupplierName</label>
                        <input type="text" className="form-control" name="supplierName" value={form.supplierName} onChange={handleChange} required />
                      </div>

                      <div className="mb-3">
                        <label className="form-label">ContactName</label>
                        <input type="text" className="form-control" name="contactName" value={form.contactName} onChange={handleChange} />
                      </div>

                      <div className="mb-3">
                        <label className="form-label">Phone</label>
                        <input type="text" className="form-control" name="phone" value={form.phone} onChange={handleChange} />
                      </div>

                      <div className="mb-3">
                        <label className="form-label">Email</label>
                        <input type="email" className="form-control" name="email" value={form.email} onChange={handleChange} />
                      </div>

                      <div className="mb-3">
                        <label className="form-label">Address</label>
                        <textarea className="form-control" name="address" rows="2" value={form.address} onChange={handleChange}></textarea>
                      </div>

                      <div className="mb-3">
                        <label className="form-label">OrganicCertification</label>
                        <input type="text" className="form-control" name="organicCertification" value={form.organicCertification} onChange={handleChange} />
                      </div>

                      <div className="mb-3">
                        <label className="form-label">CertificationExpiry</label>
                        <input type="date" className="form-control" name="certificationExpiry" value={form.certificationExpiry} onChange={handleChange} />
                      </div>

                      

                      <div className="card-submit-button">
                        <button className="btn btn-primary" type="submit">Lưu</button>
                        <button className="btn btn-secondary ms-2" type="button" onClick={() => navigate('/admin-supplier')}>Hủy</button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="container-fluid">
            <footer className="footer">
              <div className="row">
                <div className="col-md-12 footer-copyright text-center">
                  <p className="mb-0">© 2022 Fastkart Theme</p>
                </div>
              </div>
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddNewSupplier;

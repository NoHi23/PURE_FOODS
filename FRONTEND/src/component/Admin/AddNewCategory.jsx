import React, { useEffect, useState } from 'react';
import TopBar from '../AdminDashboard/TopBar';
import SideBar from '../AdminDashboard/SideBar';
import './AddNewCategory.css';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const AddNewCategory = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    categoryName: '',
    categoryDescription: '',
    isOrganic: 0,
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
    sidebarLinks.forEach(link => link.addEventListener('click', handleClick));
    return () => sidebarLinks.forEach(link => link.removeEventListener('click', handleClick));
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? (checked ? 1 : 0) : value;
    setForm({ ...form, [name]: newValue });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`http://localhost:8082/PureFoods/api/category/create`, form);
      if (res.status === 200 || res.data.status === 200) {
        toast.success("Thêm danh mục thành công!");
        window.dispatchEvent(new Event('categoryUpdated')); // Thông báo cập nhật
        setForm({ categoryName: '', categoryDescription: '', isOrganic: 0, status: 1 });
        //navigate('/admin-category');
      } else {
        toast.error(res.data.message || "Có lỗi xảy ra");
      }
    } catch (err) {
      console.error(err);
      toast.error("Lỗi khi gọi API");
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
              <div className="col-sm-8 m-auto">
                <div className="card">
                  <div className="card-body">
                    <div className="card-header-2">
                      <h5>Add New Category</h5>
                    </div>
                    <form className="theme-form theme-form-2 mega-form" onSubmit={handleSubmit}>
                      <div className="mb-4 row align-items-center">
                        <label className="form-label-title col-sm-3 mb-0">Category Name</label>
                        <div className="col-sm-9">
                          <input
                            className="form-control"
                            type="text"
                            name="categoryName"
                            placeholder="Category Name"
                            value={form.categoryName}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </div>
                      <div className="mb-4 row align-items-center">
                        <label className="form-label-title col-sm-3 mb-0">Description</label>
                        <div className="col-sm-9">
                          <textarea
                            className="form-control"
                            rows="3"
                            name="categoryDescription"
                            value={form.categoryDescription}
                            onChange={handleChange}
                          ></textarea>
                        </div>
                      </div>
                      <div className="mb-4 row align-items-center">
                        <label className="form-label-title col-sm-3 mb-0">Is Organic</label>
                        <div className="col-sm-9">
                          <input
                            type="checkbox"
                            name="isOrganic"
                            checked={form.isOrganic === 1}
                            onChange={handleChange}
                          /> Yes
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
          <div className="container-fluid">
            <footer className="footer">
              <div className="row">
                <div className="col-md-12 footer-copyright text-center">
                  <p className="mb-0">Copyright 2022 © Fastkart Theme</p>
                </div>
              </div>
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddNewCategory;
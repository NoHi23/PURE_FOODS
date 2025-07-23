import React, { useEffect, useState } from 'react';
import './AddNewBlog.css';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import TopBar from '../AdminDashboard/TopBar';
import SideBar from '../AdminDashboard/SideBar';

const AddNewBlog = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    content: '',
    userID: 1,
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
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (checked ? 1 : 0) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title || !form.content || !form.userID) {
      toast.error("Vui lòng nhập đầy đủ (Tiêu đề, Nội dung, Tác giả)");
      return;
    }

    try {
      const payload = {
        title: form.title,
        content: form.content,
        userID: parseInt(form.userID),
        status: form.status,
      };
      const res = await axios.post('http://localhost:8082/PureFoods/api/blog/create', payload);
      if (res.status === 200) {
        toast.success(res.data.message || "Thêm bài viết thành công!");
        setForm({
          title: '',
          content: '',
          userID: 1,
          status: 1,
        });
        navigate('/admin-blog');
      } else {
        toast.warning(res.data.message || "Thêm bài viết thất bại!");
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Lỗi khi gọi API";
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
                          <h5>Add New Blog</h5>
                        </div>
                        <form className="theme-form theme-form-2 mega-form" onSubmit={handleSubmit}>
                          <div className="mb-4 row align-items-center">
                            <label className="col-lg-2 col-md-3 mb-0">Title</label>
                            <div className="col-md-9 col-lg-10">
                              <input
                                className="form-control"
                                type="text"
                                name="title"
                                value={form.title}
                                onChange={handleChange}
                                required
                              />
                            </div>
                          </div>
                          <div className="mb-4 row align-items-center">
                            <label className="col-lg-2 col-md-3 mb-0">Content</label>
                            <div className="col-md-9 col-lg-10">
                              <textarea
                                className="form-control"
                                rows="5"
                                name="content"
                                value={form.content}
                                onChange={handleChange}
                                required
                              />
                            </div>
                          </div>
                          <div className="mb-4 row align-items-center">
                            <label className="col-lg-2 col-md-3 mb-0">Author ID</label>
                            <div className="col-md-9 col-lg-10">
                              <input
                                className="form-control"
                                type="number"
                                name="userID"
                                value={form.userID}
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
                                  checked={form.status === 1}
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

export default AddNewBlog;
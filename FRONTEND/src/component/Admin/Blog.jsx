import React, { useEffect, useState } from 'react';
import './Blog.css';
import axios from 'axios';
import $ from 'jquery';
import 'datatables.net';
import TopBar from '../AdminDashboard/TopBar';
import SideBar from '../AdminDashboard/SideBar';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as bootstrap from 'bootstrap';

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [editBlog, setEditBlog] = useState({
    blogID: '',
    title: '',
    content: '',
    userID: 1,
    status: 1,
  });
  const [blogToDelete, setBlogToDelete] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:8082/PureFoods/api/blog/getAll");
      console.log("API Response:", res.data); // Debug log to inspect the response
      let blogList = [];
      if (Array.isArray(res.data.blogList)) {
        blogList = res.data.blogList;
      } else if (Array.isArray(res.data.listBlog)) {
        blogList = res.data.listBlog;
      } else if (Array.isArray(res.data)) {
        blogList = res.data;
      }
      setBlogs(blogList);
    } catch (err) {
      console.error("Fetch Error:", err);
      toast.error("Lỗi khi tải danh sách bài viết!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
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
    if (blogs.length > 0) {
      const table = $('#blog_table').DataTable({
        paging: false,
        ordering: false,
        info: false,
        destroy: true,
        responsive: true,
      });
      return () => table.destroy();
    }
  }, [blogs]);

  const handleView = (blog) => {
    setSelectedBlog(blog);
    new bootstrap.Modal(document.getElementById("viewModal")).show();
  };

  const handleEdit = (blog) => {
    setSelectedBlog(blog);
    setEditBlog({
      blogID: blog.blogID,
      title: blog.title,
      content: blog.content,
      userID: blog.userID,
      status: blog.status,
    });
    new bootstrap.Modal(document.getElementById("editModal")).show();
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditBlog(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (checked ? 1 : 0) : value,
    }));
  };

  const handleUpdateBlog = async () => {
    try {
      const res = await axios.put(`http://localhost:8082/PureFoods/api/blog/update/${editBlog.blogID}`, editBlog);
      if (res.status === 200) {
        fetchBlogs();
        bootstrap.Modal.getInstance(document.getElementById("editModal")).hide();
        toast.success(res.data.message || "Cập nhật bài viết thành công!");
      } else {
        toast.warning(res.data.message || "Cập nhật thất bại!");
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Lỗi khi gọi API";
      toast.error(errorMessage);
    }
  };

  const confirmDelete = (blog) => {
    setBlogToDelete(blog);
    new bootstrap.Modal(document.getElementById("deleteModal")).show();
  };

  const handleDelete = async () => {
    try {
      const res = await axios.delete(`http://localhost:8082/PureFoods/api/blog/delete/${blogToDelete.blogID}`);
      if (res.status === 200) {
        fetchBlogs();
        bootstrap.Modal.getInstance(document.getElementById("deleteModal")).hide();
        toast.success(res.data.message || "Xóa bài viết thành công!");
      } else {
        toast.warning(res.data.message || "Xóa thất bại!");
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
                <div className="card">
                  <div className="card-body">
                    <div className="title-header option-title d-sm-flex d-block">
                      <h5>Danh sách Blog</h5>
                      <div className="right-options">
                        <ul>
                          <li>
                            <Link to="/admin-add-new-blog" className="btn btn-animation">Thêm mới Blog</Link>
                          </li>
                        </ul>
                      </div>
                    </div>
                    {loading ? (
                      <p>Đang tải...</p>
                    ) : blogs.length === 0 ? (
                      <p>Không có bài viết nào để hiển thị.</p>
                    ) : (
                      <div className="table-responsive">
                        <table className="table theme-table" id="blog_table">
                          <thead>
                            <tr>
                              <th>ID</th>
                              <th>Tiêu đề</th>
                              <th>ID tác giả</th>
                              <th>Ngày tạo</th>
                              <th>Trạng thái</th>
                              <th>Tùy chọn</th>
                            </tr>
                          </thead>
                          <tbody>
                            {Array.isArray(blogs) ? (
                              blogs.map((b, i) => (
                                <tr key={i}>
                                  <td>{b.blogID}</td>
                                  <td>{b.title}</td>
                                  <td>{b.userID}</td>
                                  <td>{new Date(b.createdAt).toLocaleDateString()}</td>
                                  <td className={b.status === 1 ? 'status-success' : 'status-danger'}>
                                    {b.status === 1 ? 'Hoạt động' : 'Không hoạt động'}
                                  </td>
                                  <td>
                                    <ul className="table-action-icons">
                                      <li>
                                        <button className="icon-button" onClick={() => handleView(b)}>
                                          <i className="ri-eye-line"></i>
                                        </button>
                                      </li>
                                      <li>
                                        <button className="icon-button" onClick={() => handleEdit(b)}>
                                          <i className="ri-pencil-line"></i>
                                        </button>
                                      </li>
                                      <li>
                                        <button className="icon-button" onClick={() => confirmDelete(b)}>
                                          <i className="ri-delete-bin-line"></i>
                                        </button>
                                      </li>
                                    </ul>
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan="6">Dữ liệu không hợp lệ</td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    )}
                    <div className="modal fade" id="viewModal" tabIndex="-1">
                      <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                          <div className="modal-header">
                            <h5 className="modal-title">Chi tiết blog</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                          </div>
                          <div className="modal-body">
                            {selectedBlog && (
                              <>
                                <p><strong>ID:</strong> {selectedBlog.blogID}</p>
                                <p><strong>Tiêu đề:</strong> {selectedBlog.title}</p>
                                <p><strong>Nội dung:</strong> {selectedBlog.content}</p>
                                <p><strong>ID tác giả:</strong> {selectedBlog.userID}</p>
                                <p><strong>Ngày tạo:</strong> {new Date(selectedBlog.createdAt).toLocaleDateString()}</p>
                                <p><strong>Trạng thái:</strong> {selectedBlog.status === 1 ? 'Hoạt động' : 'Không hoạt động'}</p>
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
                            <h5 className="modal-title">Chỉnh sửa Blog</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                          </div>
                          <div className="modal-body">
                            <form onSubmit={(e) => { e.preventDefault(); handleUpdateBlog(); }}>
                              <div className="mb-4 row align-items-center">
                                <label className="col-lg-2 col-md-3 mb-0">Tiêu đề</label>
                                <div className="col-md-9 col-lg-10">
                                  <input
                                    type="text"
                                    className="form-control"
                                    name="title"
                                    value={editBlog.title}
                                    onChange={handleInputChange}
                                    required
                                  />
                                </div>
                              </div>
                              <div className="mb-4 row align-items-center">
                                <label className="col-lg-2 col-md-3 mb-0">Nội dung</label>
                                <div className="col-md-9 col-lg-10">
                                  <textarea
                                    className="form-control"
                                    name="content"
                                    rows="5"
                                    value={editBlog.content}
                                    onChange={handleInputChange}
                                    required
                                  />
                                </div>
                              </div>
                              <div className="mb-4 row align-items-center">
                                <label className="col-lg-2 col-md-3 mb-0">ID tác giả</label>
                                <div className="col-md-9 col-lg-10">
                                  <input
                                    type="number"
                                    className="form-control"
                                    name="userID"
                                    value={editBlog.userID}
                                    onChange={handleInputChange}
                                    required
                                  />
                                </div>
                              </div>
                              <div className="mb-4 row align-items-center">
                                <label className="col-lg-2 col-md-3 mb-0">Hoạt động</label>
                                <div className="col-md-9 col-lg-10 d-flex align-items-center">
                                  <label className="switch">
                                    <input
                                      type="checkbox"
                                      name="status"
                                      checked={editBlog.status === 1}
                                      onChange={handleInputChange}
                                    />
                                    <span className="switch-state"></span>
                                  </label>
                                </div>
                              </div>
                              <div className="card-submit-button">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Hủy</button>
                                <button type="submit" className="btn btn-animation ms-auto">Lưu thay đổi</button>
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
                            <h5 className="modal-title w-100">Xác nhận xóa</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                          </div>
                          <div className="modal-body text-center">
                            <p>Bạn có chắc chắn muốn xóa Blog này?</p>
                            <button className="btn btn-danger m-2" onClick={handleDelete}>Xóa</button>
                            <button className="btn btn-secondary m-2" data-bs-dismiss="modal">Hủy</button>
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

export default Blog;
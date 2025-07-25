
import React, { useEffect, useState } from 'react';
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
  const [editForm, setEditForm] = useState({
    blogID: '',
    title: '',
    content: '',
    userID: 1,
    status: 1,
  });
  const [blogToDelete, setBlogToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentBlogs = blogs.slice(startIndex, endIndex);
  const totalPages = Math.ceil(blogs.length / itemsPerPage);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await axios.get("http://localhost:8082/PureFoods/api/blog/getAll");
        setBlogs(res.data.blogList || []);
      } catch (err) {
        toast.error("Không thể tải danh sách bài viết!");
        console.error("Fetch error:", err);
      }
    };
    fetchBlogs();
  }, []);

  useEffect(() => {
    const tableId = '#blog_table';
    if (blogs.length > 0) {
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
  }, [blogs]);

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

  const handleView = (blog) => {
    setSelectedBlog(blog);
    new bootstrap.Modal(document.getElementById('viewModal')).show();
  };

  const handleEditClick = (blog) => {
    setEditForm({
      blogID: blog.blogID || '',
      title: blog.title || '',
      content: blog.content || '',
      userID: blog.userID || 1,
      status: blog.status !== undefined ? blog.status : 1,
    });
    new bootstrap.Modal(document.getElementById('editModal')).show();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdateBlog = async (e) => {
    e.preventDefault();
    if (!editForm.title || !editForm.content || !editForm.userID) {
      toast.error("Vui lòng nhập đầy đủ thông tin!");
      return;
    }
    const payload = {
      title: editForm.title,
      content: editForm.content,
      userID: parseInt(editForm.userID),
      status: parseInt(editForm.status),
    };
    try {
      await axios.put(`http://localhost:8082/PureFoods/api/blog/update/${editForm.blogID}`, payload, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });
      setBlogs(blogs.map(b => b.blogID === editForm.blogID ? { ...b, ...payload } : b));
      bootstrap.Modal.getInstance(document.getElementById('editModal')).hide();
      toast.success("Cập nhật bài viết thành công!");
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Lỗi khi cập nhật bài viết!";
      toast.error(errorMessage);
      console.error("Update error:", err);
    }
  };

  const handleDeleteBlog = async () => {
    if (!blogToDelete) return;
    try {
      await axios.delete(`http://localhost:8082/PureFoods/api/blog/delete/${blogToDelete.blogID}`, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });
      setBlogs(blogs.filter(b => b.blogID !== blogToDelete.blogID));
      toast.success("Xóa bài viết thành công!");
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Lỗi khi xóa bài viết!";
      toast.error(errorMessage);
      console.error("Delete error:", err);
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
                <div className="title-header option-title">
                  <h5>Danh sách bài viết</h5>
                  <Link to="/admin-add-new-blog" className="btn btn-theme d-flex align-items-center">
                    <i data-feather="plus"></i>Thêm mới bài viết
                  </Link>
                </div>
                <div className="table-responsive">
                  <table className="table all-package theme-table" id="blog_table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Tiêu đề</th>
                        <th>Tác giả</th>
                        <th>Ngày tạo</th>
                        <th>Trạng thái</th>
                        <th>Tùy chọn</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentBlogs.map((b, i) => (
                        <tr key={i}>
                          <td className="text-center">#00{b.blogID}</td>
                          <td>{b.title || 'N/A'}</td>
                          <td>{b.userID || 'N/A'}</td>
                          <td>{b.createdAt ? new Date(b.createdAt).toLocaleDateString('vi-VN') : 'N/A'}</td>
                          <td className={b.status === 1 ? "status-success" : "status-danger"}>
                            {b.status === 1 ? "Hoạt động" : "Không hoạt động"}
                          </td>
                          <td>
                            <ul className="d-flex gap-2 list-unstyled">
                              <li><a href="#" onClick={(e) => { e.preventDefault(); handleView(b); }}><i className="ri-eye-line"></i></a></li>
                              <li><a href="#" onClick={() => handleEditClick(b)}><i className="ri-pencil-line"></i></a></li>
                              <li><a href="#" data-bs-toggle="modal" data-bs-target="#deleteModal" onClick={() => setBlogToDelete(b)}><i className="ri-delete-bin-line"></i></a></li>
                            </ul>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="pagination-container d-flex justify-content-center mt-3">
                    <nav>
                      <ul className="pagination">
                        <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                          <button className="page-link" onClick={() => setCurrentPage(currentPage - 1)}>Previous</button>
                        </li>
                        {[...Array(totalPages)].map((_, i) => (
                          <li key={i} className={`page-item ${currentPage === i + 1 ? "active" : ""}`}>
                            <button className="page-link" onClick={() => setCurrentPage(i + 1)}>{i + 1}</button>
                          </li>
                        ))}
                        <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
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
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" style={{ fontWeight: 600 }}>Chi tiết bài viết</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body">
              {selectedBlog && (
                <div className="row">
                  <div className="col-md-12">
                    <h4 style={{ fontWeight: 700 }}>Tiêu đề: {selectedBlog.title || 'N/A'}</h4>
                    <p><strong>ID:</strong> {selectedBlog.blogID || 'N/A'}</p>
                    <p><strong>Nội dung:</strong> {selectedBlog.content || 'N/A'}</p>
                    <p><strong>Tác giả:</strong> {selectedBlog.userID || 'N/A'}</p>
                    <p><strong>Ngày tạo:</strong> {selectedBlog.createdAt ? new Date(selectedBlog.createdAt).toLocaleDateString('vi-VN') : 'N/A'}</p>
                    <p><strong>Trạng thái:</strong> {selectedBlog.status === 1 ? "Hoạt động" : "Không hoạt động"}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="modal fade" id="editModal" tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Chỉnh sửa bài viết</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleUpdateBlog}>
                <div className="mb-3">
                  <label className="form-label" htmlFor="title">Tiêu đề</label>
                  <input id="title" type="text" className="form-control" name="title" value={editForm.title} onChange={handleInputChange} required />
                </div>
                <div className="mb-3">
                  <label className="form-label" htmlFor="content">Nội dung</label>
                  <textarea id="content" className="form-control" rows="5" name="content" value={editForm.content} onChange={handleInputChange} required />
                </div>
                <div className="mb-3">
                  <label className="form-label" htmlFor="userID">ID tác giả</label>
                  <input id="userID" type="number" className="form-control" name="userID" value={editForm.userID} onChange={handleInputChange} required min="1" />
                </div>
                <div className="mb-3">
                  <label className="form-label" htmlFor="status">Trạng thái</label>
                  <select id="status" className="form-control" name="status" value={editForm.status} onChange={handleInputChange}>
                    <option value="0">Không hoạt động</option>
                    <option value="1">Hoạt động</option>
                  </select>
                </div>
                <div className="text-end">
                  <button type="button" className="btn btn-secondary me-2" data-bs-dismiss="modal">Đóng</button>
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
              <h5 className="modal-title w-100">Bạn đã chắc chắn chưa?</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal">
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-body">
              <p>Bạn sẽ xóa bài viết này khỏi hệ thống. Hành động này không thể hoàn tác.</p>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-animation btn-md fw-bold" data-bs-dismiss="modal">Hủy</button>
              <button type="button" className="btn btn-animation btn-md fw-bold" data-bs-dismiss="modal" onClick={handleDeleteBlog}>Xóa</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blog;

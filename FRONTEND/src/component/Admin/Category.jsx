import React, { useEffect, useState } from 'react';
import './Category.css';
import axios from 'axios';
import TopBar from '../AdminDashboard/TopBar';
import SideBar from '../AdminDashboard/SideBar';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const Category = () => {
  const [categories, setCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCategories = categories.slice(startIndex, endIndex);
  const totalPages = Math.ceil(categories.length / itemsPerPage);

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [editCategory, setEditCategory] = useState({
    categoryName: '',
    categoryDescription: '',
    isOrganic: 0,
    status: 1
  });
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    fetchCategories();
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

    sidebarLinks.forEach(link => {
      link.addEventListener('click', handleClick);
    });

    return () => {
      sidebarLinks.forEach(link => {
        link.removeEventListener('click', handleClick);
      });
    };
  }, []);

  const fetchCategories = () => {
    axios.get("http://localhost:8082/PureFoods/api/category/getAll")
      .then(res => {
        const list = res.data.listCategory || res.data;
        setCategories(list);
      })
      .catch(err => console.error(err));
  };

  const handleView = (category) => {
    setSelectedCategory(category);
    setShowViewModal(true);
  };

  const handleEdit = (category) => {
    setSelectedCategory(category);
    setEditCategory({ ...category });
    setShowEditModal(true);
  };

  const confirmDelete = (category) => {
    setCategoryToDelete(category);
    setShowDeleteModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? (checked ? 1 : 0) : value;
    setEditCategory(prev => ({ ...prev, [name]: val }));
  };

  const checkCategoryNameExists = async (name, excludeID = null) => {
    try {
      const res = await axios.get(`http://localhost:8082/PureFoods/api/category/searchByName`, {
        params: { name: name.trim() }
      });
      if (res.data && (!excludeID || res.data.categoryID !== excludeID)) {
        return true;
      }
      return false;
    } catch (err) {
      if (err.response && err.response.status === 404) return false;
      toast.error("Lỗi khi kiểm tra tên danh mục");
      return true;
    }
  };

  const handleUpdateCategory = async () => {
    const trimmedName = editCategory.categoryName.trim();
    const trimmedDesc = editCategory.categoryDescription.trim();

    if (!trimmedName) {
      toast.warn("Tên danh mục không được để trống!");
      return;
    }

    if (trimmedDesc.length < 5) {
      toast.warn("Mô tả phải có ít nhất 5 ký tự!");
      return;
    }

    const isDuplicate = await checkCategoryNameExists(trimmedName, editCategory.categoryID);
    if (isDuplicate) {
      toast.error("Tên danh mục đã tồn tại!");
      return;
    }

    try {
      await axios.put(`http://localhost:8082/PureFoods/api/category/update/${editCategory.categoryID}`, {
        ...editCategory,
        categoryName: trimmedName,
        categoryDescription: trimmedDesc
      });

      // Cập nhật trực tiếp danh sách
      setCategories(prev => prev.map(c =>
        c.categoryID === editCategory.categoryID ? { ...editCategory, categoryName: trimmedName, categoryDescription: trimmedDesc } : c
      ));

      setShowEditModal(false);
      toast.success("Cập nhật thành công!");
    } catch (err) {
      toast.error("Lỗi cập nhật!");
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:8082/PureFoods/api/category/delete/${categoryToDelete.categoryID}`);

      setCategories(prev => prev.filter(c => c.categoryID !== categoryToDelete.categoryID));
      setShowDeleteModal(false);
      toast.success("Đã xoá danh mục!");

      // Giảm trang nếu đang ở cuối mà bị rỗng
      if ((currentPage - 1) * itemsPerPage >= categories.length - 1) {
        setCurrentPage(prev => Math.max(prev - 1, 1));
      }
    } catch (err) {
      toast.error("Xoá thất bại!");
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
                      <h5>Danh sách loại sản phẩm</h5>
                      <div className="right-options">
                        <ul>
                          <li>
                            <Link to="/admin-add-new-category" className="btn btn-solid">Thêm mới loại sản phẩm</Link>
                          </li>
                        </ul>
                      </div>
                    </div>

                    <div className="table-responsive">
                      <table className="table theme-table">
                        <thead>
                          <tr>
                            <th>ID</th>
                            <th>Tên</th>
                            <th>Mô tả</th>
                            <th>Là hữu cơ</th>
                            <th>Tùy chọn</th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentCategories.map((c, i) => (
                            <tr key={i}>
                              <td>{c.categoryID}</td>
                              <td>{c.categoryName}</td>
                              <td>{c.categoryDescription}</td>
                              <td>{c.isOrganic === 1 ? "Yes" : "No"}</td>
                              <td>
                                <ul className="table-action-icons">
                                  <li><a href="#" onClick={(e) => { e.preventDefault(); handleView(c); }}><i className="ri-eye-line"></i></a></li>
                                  <li><a href="#" onClick={(e) => { e.preventDefault(); handleEdit(c); }}><i className="ri-pencil-line"></i></a></li>
                                  <li><a href="#" onClick={(e) => { e.preventDefault(); confirmDelete(c); }}><i className="ri-delete-bin-line"></i></a></li>
                                </ul>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>

                      {/* Pagination */}
                      <div className="pagination-container d-flex justify-content-center mt-3">
                        <nav>
                          <ul className="pagination">
                            <li className={`page-item ${currentPage === 1 && "disabled"}`}>
                              <button className="page-link" onClick={() => setCurrentPage(currentPage - 1)}>Previous</button>
                            </li>
                            {[...Array(totalPages)].map((_, index) => (
                              <li key={index} className={`page-item ${currentPage === index + 1 && "active"}`}>
                                <button className="page-link" onClick={() => setCurrentPage(index + 1)}>{index + 1}</button>
                              </li>
                            ))}
                            <li className={`page-item ${currentPage === totalPages && "disabled"}`}>
                              <button className="page-link" onClick={() => setCurrentPage(currentPage + 1)}>Next</button>
                            </li>
                          </ul>
                        </nav>
                      </div>
                    </div>

                    {/* View Modal */}
                    {showViewModal && selectedCategory && (
                      <div className="modal fade show d-block" tabIndex="-1">
                        <div className="modal-dialog modal-dialog-centered">
                          <div className="modal-content">
                            <div className="modal-header">
                              <h5 className="modal-title">Chi tiết loại sản phẩm</h5>
                              <button type="button" className="btn-close" onClick={() => setShowViewModal(false)}></button>
                            </div>
                            <div className="modal-body">
                              <p><strong>ID:</strong> {selectedCategory.categoryID}</p>
                              <p><strong>Tên:</strong> {selectedCategory.categoryName}</p>
                              <p><strong>Mô tả:</strong> {selectedCategory.categoryDescription}</p>
                              <p><strong>Là hữu cơ:</strong> {selectedCategory.isOrganic === 1 ? "Yes" : "No"}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Edit Modal */}
                    {showEditModal && (
                      <div className="modal fade show d-block" tabIndex="-1">
                        <div className="modal-dialog modal-dialog-centered">
                          <div className="modal-content">
                            <div className="modal-header">
                              <h5 className="modal-title">Chỉnh sửa loại sản phẩm</h5>
                              <button type="button" className="btn-close" onClick={() => setShowEditModal(false)}></button>
                            </div>
                            <div className="modal-body">
                              <form>
                                <div className="mb-3">
                                  <label className="form-label">Tên</label>
                                  <input type="text" className="form-control" name="categoryName" value={editCategory.categoryName} onChange={handleInputChange} />
                                </div>
                                <div className="mb-3">
                                  <label className="form-label">Mô tả</label>
                                  <textarea className="form-control" name="categoryDescription" value={editCategory.categoryDescription} onChange={handleInputChange}></textarea>
                                </div>
                                <div className="mb-3 form-check">
                                  <input type="checkbox" className="form-check-input" name="isOrganic" checked={editCategory.isOrganic === 1} onChange={handleInputChange} />
                                  <label className="form-check-label">Là hữu cơ</label>
                                </div>
                              </form>
                            </div>
                            <div className="modal-footer">
                              <button className="btn btn-secondary" onClick={() => setShowEditModal(false)}>Hủy</button>
                              <button className="btn btn-primary" onClick={handleUpdateCategory}>Lưu lại</button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Delete Modal */}
                    {showDeleteModal && (
                      <div className="modal fade show d-block" tabIndex="-1">
                        <div className="modal-dialog modal-dialog-centered">
                          <div className="modal-content">
                            <div className="modal-header text-center">
                              <h5 className="modal-title w-100">Xác nhận xóa</h5>
                              <button type="button" className="btn-close" onClick={() => setShowDeleteModal(false)}></button>
                            </div>
                            <div className="modal-body text-center">
                              <p>Bạn có chắc chắn muốn xóa loại sản phẩm này?</p>
                              <button className="btn btn-danger m-2" onClick={handleDelete}>Xóa</button>
                              <button className="btn btn-secondary m-2" onClick={() => setShowDeleteModal(false)}>Hủy bỏ</button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

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

export default Category;

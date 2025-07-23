import React, { useEffect, useState } from 'react';
import './Category.css';
import axios from 'axios';
import $ from 'jquery';
import 'datatables.net';
import TopBar from '../AdminDashboard/TopBar';
import SideBar from '../AdminDashboard/SideBar';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as bootstrap from 'bootstrap';

const Category = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [editCategory, setEditCategory] = useState({
    categoryName: '',
    categoryDescription: '',
    isOrganic: 0,
    status: 1
  });
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  const fetchCategories = () => {
    axios.get("http://localhost:8082/PureFoods/api/category/getAll")
      .then(res => {
        const list = res.data.listCategory || res.data; // handle both structures
        setCategories(list);
      })
      .catch(err => console.error(err));
  };

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

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (categories.length > 0) {
      const table = $('#category_table').DataTable({
        paging: false,
        ordering: false,
        info: false,
        destroy: true,
        responsive: true,
      });
      return () => {
        table.destroy();
      };
    }
  }, [categories]);

  const handleView = (category) => {
    setSelectedCategory(category);
    new bootstrap.Modal(document.getElementById("viewModal")).show();
  };

  const handleEdit = (category) => {
    setSelectedCategory(category);
    setEditCategory({ ...category });
    new bootstrap.Modal(document.getElementById("editModal")).show();
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? (checked ? 1 : 0) : value;
    setEditCategory(prev => ({ ...prev, [name]: val }));
  };

  const handleUpdateCategory = async () => {
    try {
      await axios.put(`http://localhost:8082/PureFoods/api/category/update/${editCategory.categoryID}`, editCategory);
      fetchCategories();
      bootstrap.Modal.getInstance(document.getElementById("editModal")).hide();
      toast.success("Cập nhật thành công!");
    } catch (err) {
      toast.error("Lỗi cập nhật!");
    }
  };

  const confirmDelete = (category) => {
    setCategoryToDelete(category);
    new bootstrap.Modal(document.getElementById("deleteModal")).show();
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:8082/PureFoods/api/category/delete/${categoryToDelete.categoryID}`);
      fetchCategories();
      bootstrap.Modal.getInstance(document.getElementById("deleteModal")).hide();
      toast.success("Đã xoá danh mục!");
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
                      <h5>Category List</h5>
                      <div className="right-options">
                        <ul>
                          <li>
                            <Link to="/admin-add-new-category" className="btn btn-solid">Add Category</Link>
                          </li>
                        </ul>
                      </div>
                    </div>

                    <div className="table-responsive">
                      <table className="table theme-table" id="category_table">
                        <thead>
                          <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Description</th>
                            <th>Organic</th>                         
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {categories.map((c, i) => (
                            <tr key={i}>
                              <td>{c.categoryID}</td>
                              <td>{c.categoryName}</td>
                              <td>{c.categoryDescription}</td>
                              <td>{c.isOrganic === 1 ? "Yes" : "No"}</td>                             
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
                            <h5 className="modal-title">Category Detail</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                          </div>
                          <div className="modal-body">
                            {selectedCategory && (
                              <>
                                <p><strong>ID:</strong> {selectedCategory.categoryID}</p>
                                <p><strong>Name:</strong> {selectedCategory.categoryName}</p>
                                <p><strong>Description:</strong> {selectedCategory.categoryDescription}</p>
                                <p><strong>Organic:</strong> {selectedCategory.isOrganic === 1 ? "Yes" : "No"}</p>                               
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
                            <h5 className="modal-title">Edit Category</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                          </div>
                          <div className="modal-body">
                            <form>
                              <div className="mb-3">
                                <label className="form-label">Name</label>
                                <input type="text" className="form-control" name="categoryName" value={editCategory.categoryName} onChange={handleInputChange} />
                              </div>
                              <div className="mb-3">
                                <label className="form-label">Description</label>
                                <textarea className="form-control" name="categoryDescription" value={editCategory.categoryDescription} onChange={handleInputChange}></textarea>
                              </div>
                              <div className="mb-3">
                                <label className="form-label">Is Organic</label>
                                <input type="checkbox" name="isOrganic" checked={editCategory.isOrganic === 1} onChange={handleInputChange} />
                              </div>                             
                            </form>
                          </div>
                          <div className="modal-footer">
                            <button className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                            <button className="btn btn-primary" onClick={handleUpdateCategory}>Save Changes</button>
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
                            <p>Are you sure you want to delete this category?</p>
                            <button className="btn btn-danger m-2" onClick={handleDelete}>Yes</button>
                            <button className="btn btn-secondary m-2" data-bs-dismiss="modal">No</button>
                          </div>
                        </div>
                      </div>
                    </div>

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
                  <p className="mb-0">Copyright 2022 © Fastkart theme</p>
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

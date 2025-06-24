import React, { useEffect, useState } from 'react';
import './Category.css';
import axios from 'axios';
import $ from 'jquery';
import 'datatables.net';
import TopBar from '../AdminDashboard/TopBar';
import SideBar from '../AdminDashboard/SideBar';
import { Link } from 'react-router-dom';

const Category = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8082/PureFoods/api/category/getAll")
      .then(res => setCategories(res.data))
      .catch(err => console.error(err));
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
                          <li><Link to="/admin-add-category" className="btn btn-solid">Add Category</Link></li>
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
                            <th>Status</th>
                            <th>Options</th>
                          </tr>
                        </thead>
                        <tbody>
                          {categories.map((c, i) => (
                            <tr key={i}>
                              <td>{c.categoryID}</td>
                              <td>{c.categoryName}</td>
                              <td>{c.categoryDescription}</td>
                              <td>{c.isOrganic === 1 ? "Yes" : "No"}</td>
                              <td className={c.status === 1 ? "status-success" : "status-danger"}>
                                <span>{c.status === 1 ? "Active" : "Inactive"}</span>
                              </td>
                              <td>
                                <ul>
                                  <li>
                                    <a href="#"><i className="ri-pencil-line"></i></a>
                                  </li>
                                  <li>
                                    <a href="#" data-bs-toggle="modal" data-bs-target="#deleteModal">
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

      {/* Delete Confirmation Modal */}
      <div className="modal fade" id="deleteModal" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header text-center">
              <h5 className="modal-title w-100">Confirm Delete</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body text-center">
              <p>Are you sure you want to delete this category?</p>
              <button className="btn btn-danger m-2" data-bs-dismiss="modal">Yes</button>
              <button className="btn btn-secondary m-2" data-bs-dismiss="modal">No</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Category;

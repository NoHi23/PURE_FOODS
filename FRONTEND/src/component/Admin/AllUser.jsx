import React, { useEffect, useState } from 'react'
import './jquery.dataTables.js'
import './custom-data-table.js'
import $ from 'jquery';
import 'datatables.net';
import TopBar from '../AdminDashboard/TopBar';
import SideBar from '../AdminDashboard/SideBar';
import axios from 'axios';
import * as bootstrap from 'bootstrap';

const AllUser = () => {
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState(null);

  const handleViewUser = (user) => {
    setSelectedUsers(user);
    const modal = new bootstrap.Modal(document.getElementById('productDetailModal'));
    modal.show();
  };

  useEffect(() => {
    const tableId = '#table_id';

    const initTable = () => {
      if ($.fn.DataTable.isDataTable(tableId)) {
        $(tableId).DataTable().destroy();
      }

      $(tableId).DataTable({
        paging: false,
        ordering: false,
        info: false,
        responsive: true,
      });
    };

    if (users.length > 0) {
      setTimeout(() => initTable(), 100);
    }
  }, [users]);

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
    axios.get("http://localhost:8082/PureFoods/api/users/getAll")
      .then(res => { setUsers(res.data.userList) })
  }, []);

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
                <div className="col-sm-12">
                  <div className="card card-table">
                    <div className="card-body">
                      <div className="title-header option-title">
                        <h5>All Users</h5>
                        <form className="d-inline-flex">
                          <a href="add-new-user.html" className="align-items-center btn btn-theme d-flex">
                            <i data-feather="plus"></i>Add New
                          </a>
                        </form>
                      </div>

                      <div className="table-responsive table-product">
                        <table className="table all-package theme-table" id="table_id">
                          <thead>
                            <tr>
                              <th>User</th>
                              <th>Name</th>
                              <th>Phone</th>
                              <th>Email</th>
                              <th>Address</th>
                              <th>Role</th>
                              <th>Status</th>
                              <th>Option</th>
                            </tr>
                          </thead>

                          <tbody>
                            {users?.map((u, i) => (
                              <tr key={i}>
                                <td>
                                  <div className="table-image">
                                    <img src="/back-end/assets/images/users/1.jpg" className="img-fluid"
                                      alt="" />
                                  </div>
                                </td>

                                <td>
                                  <div className="user-name">
                                    <span>{u.fullName}</span>
                                  </div>
                                </td>

                                <td>{u.phone}</td>

                                <td>{u.email}</td>
                                <td>{u.address}</td>
                                <td>{u.roleID}</td>
                                <td className={u.status === 1 ? "status-danger" : "status-success"}>
                                  <span>{u.status === 1 ? "Private" : "Public"}</span>
                                </td>
                                <td>
                                  <ul>
                                    <li>
                                      <a href="#" onClick={() => handleViewUser(u)}>
                                        <i className="ri-eye-line"></i>
                                      </a>
                                    </li>

                                    <li>
                                      <a href="javascript:void(0)">
                                        <i className="ri-pencil-line"></i>
                                      </a>
                                    </li>

                                    <li>
                                      <a href="javascript:void(0)" data-bs-toggle="modal"
                                        data-bs-target="#exampleModalToggle">
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



            <div className="modal fade" id="productDetailModal" tabIndex="-1" aria-hidden="true">
              <div className="modal-dialog modal-dialog-centered modal-lg">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title" style={{ fontWeight: 600 }}>User Detail</h5>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div className="modal-body">
                    {selectedUsers && (
                      <div>
                        <div className="row">
                          <div className="col-md-4">
                            <img src="/back-end/assets/images/users/1.jpg" className="img-fluid"
                              alt="" />
                          </div>
                          <div className="col-md-8">
                            <h4 style={{ fontWeight: 700 }}>Name: {selectedUsers.fullName}</h4> <br />
                            <p><strong>Email:</strong> {selectedUsers.email}</p>
                            <p><strong>Phone:</strong> {selectedUsers.phone}</p>
                            <p><strong>Role:</strong> {selectedUsers.roleID}</p>
                            <p><strong>Trạng thái:</strong> {selectedUsers.status === 1 ? "Private" : "Public"}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="container-fluid">
              <footer className="footer">
                <div className="row">
                  <div className="col-md-12 footer-copyright text-center">
                    <p className="mb-0">Copyright 2022 © Fastkart theme by pixelstrap</p>
                  </div>
                </div>
              </footer>
            </div>
          </div>
        </div>
        <div className="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1">
          <div className="modal-dialog  modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-body">
                <h5 className="modal-title" id="staticBackdropLabel">Logging Out</h5>
                <p>Are you sure you want to log out?</p>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                <div className="button-box">
                  <button type="button" className="btn btn--no" data-bs-dismiss="modal">No</button>
                  <button type="button" className="btn  btn--yes btn-primary">Yes</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="modal fade theme-modal remove-coupon" id="exampleModalToggle" aria-hidden="true" tabindex="-1">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header d-block text-center">
              <h5 className="modal-title w-100" id="exampleModalLabel22">Are You Sure ?</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close">
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-body">
              <div className="remove-box">
                <p>The permission for the use/group, preview is inherited from the object, object will create a
                  new permission for this object</p>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-animation btn-md fw-bold" data-bs-dismiss="modal">No</button>
              <button type="button" className="btn btn-animation btn-md fw-bold" data-bs-target="#exampleModalToggle2"
                data-bs-toggle="modal" data-bs-dismiss="modal">Yes</button>
            </div>
          </div>
        </div>
      </div>

      <div className="modal fade theme-modal remove-coupon" id="exampleModalToggle2" aria-hidden="true" tabindex="-1">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title text-center" id="exampleModalLabel12">Done!</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close">
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-body">
              <div className="remove-box text-center">
                <div className="wrapper">
                  <svg className="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                    <circle className="checkmark__circle" cx="26" cy="26" r="25" fill="none" />
                    <path className="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
                  </svg>
                </div>
                <h4 className="text-content">It's Removed.</h4>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-primary" data-bs-toggle="modal" data-bs-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AllUser

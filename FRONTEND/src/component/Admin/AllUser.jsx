import React, { useEffect, useState } from 'react'
import './jquery.dataTables.js'
import './custom-data-table.js'
import $ from 'jquery';
import 'datatables.net';
import TopBar from '../AdminDashboard/TopBar';
import SideBar from '../AdminDashboard/SideBar';
import axios from 'axios';
import * as bootstrap from 'bootstrap';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

const AllUser = () => {
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState(null);
  const [editUser, setEditUser] = useState(null);
  const [roleName, setRoleName] = useState({});
  const [role, setRole] = useState([]);
  const [userToDelete, setUserToDelete] = useState(null);

  const [editForm, setEditForm] = useState({
    fullName: '',
    email: '',
    roleID: 0,
    phone: '',
    address: '',
    status: 0
  });
  const handleViewUser = (user) => {
    setSelectedUsers(user);
    const modal = new bootstrap.Modal(document.getElementById('userDetailModal'));
    modal.show();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };

  const handleEditClick = (user) => {
    setEditUser(user);
    setEditForm({
      fullName: user.fullName || '',
      email: user.email || '',
      roleID: user.roleID || '',
      phone: user.phone || '',
      address: user.address || '',
      status: user.status !== undefined ? user.status : 0
    });

    const modal = new bootstrap.Modal(document.getElementById('editUserModal'));
    modal.show();
  };


  const handleUpdateUser = async () => {
    try {
      await axios.put(`http://localhost:8082/PureFoods/api/users/update`, {
        userId: editUser.userId,
        ...editForm
      });

      const res = await axios.get("http://localhost:8082/PureFoods/api/users/getAll");
      setUsers(res.data.userList);

      const modal = bootstrap.Modal.getInstance(document.getElementById('editUserModal'));
      modal.hide();

      toast.success('Update User Successfull!');
    } catch (err) {
      const errorMessage =
        err.response && err.response.data && err.response.data.message
          ? err.response.data.message
          : "ERROR";
      toast.error(errorMessage);
    }
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

  useEffect(() => {
    const fetchRole = async () => {
      const newRoleNames = {};

      const uniqueRoleIds = [...new Set(users.map(u => u.roleID))];

      await Promise.all(uniqueRoleIds.map(async (id) => {
        try {
          const res = await axios.get(`http://localhost:8082/PureFoods/api/role/${id}`);
          newRoleNames[id] = res.data.roleName;
        } catch (err) {
          newRoleNames[id] = 'Không tìm thấy';
        }
      }));

      setRoleName(newRoleNames);
    };

    if (users.length > 0) {
      fetchRole();
    }
  }, [users]);


  useEffect(() => {
    axios.get("http://localhost:8082/PureFoods/api/role/getAll")
      .then(res => setRole(res.data.roleList))
      .catch(() => setRole([]));
  }, []);



  const handleDeleteUser = async () => {
    if (!userToDelete) return;

    try {
      await axios.put('http://localhost:8082/PureFoods/api/users/delete', {
        userId: userToDelete.userId
      });

      const res = await axios.get("http://localhost:8082/PureFoods/api/users/getAll");
      setUsers(res.data.userList);

      toast.success('Block User Successfull!');
    } catch (err) {
      const errorMessage =
        err.response && err.response.data && err.response.data.message
          ? err.response.data.message
          : "ERROR";
      toast.error(errorMessage);
    }
  };

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentUser = users.slice(startIndex, endIndex);
  const totalPages = Math.ceil(users.length / itemsPerPage);

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
                          <Link to={"/add-new-user"} className="align-items-center btn btn-theme d-flex">
                            <i data-feather="plus"></i>Add New
                          </Link>
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
                            {currentUser?.map((u, i) => (
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
                                <td>{roleName[u.roleID]}</td>
                                <td className={u.status === 1 ? "status-danger" : "status-success"}>
                                  <span>{u.status === 1 ? "Private" : "Public"}</span>
                                </td>
                                <td>
                                  <ul>
                                    <li>
                                      <a href="#" onClick={(e) => {
                                        e.preventDefault();
                                        handleViewUser(u)
                                      }}>
                                        <i className="ri-eye-line"></i>
                                      </a>
                                    </li>

                                    <li>
                                      <a href="#" onClick={() => handleEditClick(u)}>
                                        <i className="ri-pencil-line"></i>
                                      </a>
                                    </li>

                                    <li>
                                      <a href="#" data-bs-toggle="modal" data-bs-target="#exampleModalToggle" onClick={() => setUserToDelete(u)}>
                                        <i className="ri-delete-bin-line"></i>
                                      </a>
                                    </li>
                                  </ul>
                                </td>
                              </tr>
                            ))}
                          </tbody>

                        </table>
                        <div className="pagination-container d-flex justify-content-center mt-3">
                          <nav>
                            <ul className="pagination">
                              <li className={`page-item ${currentPage === 1 && "disabled"}`}>
                                <button className="page-link" onClick={() => setCurrentPage(currentPage - 1)}>Previous</button>
                              </li>

                              {[...Array(totalPages)].map((_, index) => (
                                <li key={index} className={`page-item ${currentPage === index + 1 && "active"}`}>
                                  <button className="page-link" onClick={() => setCurrentPage(index + 1)}>
                                    {index + 1}
                                  </button>
                                </li>
                              ))}

                              <li className={`page-item ${currentPage === totalPages && "disabled"}`}>
                                <button className="page-link" onClick={() => setCurrentPage(currentPage + 1)}>Next</button>
                              </li>
                            </ul>
                          </nav>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>



            <div className="modal fade" id="userDetailModal" tabIndex="-1" aria-hidden="true">
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
                            <p><strong>Role:</strong> {roleName[selectedUsers.roleID]}</p>
                            <p><strong>Address:</strong>{selectedUsers.address}</p>
                            <p><strong>Trạng thái:</strong> {selectedUsers.status === 1 ? "Private" : "Public"}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                </div>
              </div>
            </div>

            <div className="modal fade" id="editUserModal" tabIndex="-1">
              <div className="modal-dialog modal-dialog-centered modal-lg">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Update User</h5>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
                  </div>
                  <div className="modal-body">
                    <form>
                      <div className="mb-3">
                        <label className="form-label">FullName</label>
                        <input type="text" className="form-control" name="fullName" value={editForm.fullName} onChange={handleInputChange} />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Email</label>
                        <input type="text" className="form-control" name="email" value={editForm.email} onChange={handleInputChange} min={0} />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Role</label>
                        <select className="form-control" name="roleID" value={editForm.roleID} onChange={handleInputChange}>
                          {role.map(r => (
                            <option key={r.roleID} value={r.roleID}>{r.roleName}</option>
                          ))}
                        </select>
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Phone</label>
                        <input type="number" className="form-control" name="phone" value={editForm.phone} onChange={handleInputChange} min={0} />
                      </div>

                      <div className="mb-3">
                        <label className="form-label">Address</label>
                        <input type="text" className="form-control" name="address" value={editForm.address} onChange={handleInputChange} min={0} />
                      </div>

                      {/* <div className="mb-3">
                              <label className="form-label">Link ảnh</label>
                              <input type="text" className="form-control" name="imageURL" value={editForm.imageURL} onChange={handleInputChange} />
                            </div>
                            {editForm.imageURL && (
                              <div className="mb-3">
                                <label className="form-label">Xem trước ảnh</label>
                                <div>
                                  <img
                                    src={editForm.imageURL}
                                    alt="Preview"
                                    style={{ maxWidth: '100%', maxHeight: '200px', border: '1px solid #ccc' }}
                                    onError={(e) => {
                                      e.target.src = "https://via.placeholder.com/150?text=Image+not+found";
                                    }}
                                  />
                                </div>
                              </div>
                            )} */}
                      <div className="mb-3">
                        <label className="form-label">Trạng thái</label>
                        <select className="form-control" name="status" value={editForm.status} onChange={handleInputChange}>
                          <option value={0}>Public</option>
                          <option value={1}>Private</option>
                        </select>
                      </div>
                    </form>
                  </div>

                  <div className="modal-footer">
                    <button className="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
                    <button className="btn btn-primary" onClick={handleUpdateUser}>Lưu thay đổi</button>
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
              <button
                type="button"
                className="btn btn-animation btn-md fw-bold"
                data-bs-dismiss="modal"
                onClick={handleDeleteUser}
              >
                Yes
              </button>
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

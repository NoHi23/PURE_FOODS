import axios from 'axios';
import React, { useEffect, useState } from 'react'
import TopBar from '../AdminDashboard/TopBar';
import SideBar from '../AdminDashboard/SideBar';
import $ from 'jquery';
import 'datatables.net';
import { Link } from 'react-router-dom';
import * as bootstrap from 'bootstrap';
import { toast } from 'react-toastify';

const AllRole = () => {
  const [role, setRole] = useState([]);

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

    if (role.length > 0) {
      setTimeout(() => initTable(), 100);
    }
  }, [role]);

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
    axios.get("http://localhost:8082/PureFoods/api/role/getAll")
      .then(res => setRole(res.data.roleList))
      .catch(() => setRole([]));
  }, []);



  const [editRole, setEditRole] = useState(null);

  const [editForm, setEditForm] = useState({
    roleName: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };

  const handleEditClick = (role) => {
    setEditRole(role);
    setEditForm({
      roleName: role.roleName || ''
    });

    const modal = new bootstrap.Modal(document.getElementById('editRoleModal'));
    modal.show();
  };


  const handleUpdateRole = async () => {
    try {
      await axios.put(`http://localhost:8082/PureFoods/api/role/update`, {
        roleID: editRole.roleID,
        ...editForm
      });

      const res = await axios.get("http://localhost:8082/PureFoods/api/role/getAll");
      setRole(res.data.roleList);

      const modal = bootstrap.Modal.getInstance(document.getElementById('editRoleModal'));
      modal.hide();

      toast.success('Cập nhật vai trò thành công!');
    } catch (err) {
      const errorMessage =
        err.response && err.response.data && err.response.data.message
          ? err.response.data.message
          : "ERROR";
      toast.error(errorMessage);
    }
  };

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
                        <h5>Danh sách vai trò người dùng</h5>
                        <form className="d-inline-flex">
                          <Link to={"/add-new-role"} className="align-items-center btn btn-theme d-flex">
                            <i data-feather="plus"></i>Thêm mới vai trò
                          </Link>
                        </form>
                      </div>
                      <div>
                        <div className="table-responsive">
                          <table id="table_id" className="table role-table all-package theme-table">
                            <thead>
                              <tr>
                                <th>No</th>
                                <th >Tên</th>
                                <th >Tùy chọn</th>
                              </tr>
                            </thead>

                            <tbody>
                              {role.map((r, i) => (
                                <tr key={i}>
                                  <td>{r.roleID}</td>
                                  <td>{r.roleName}</td>
                                  <td>
                                    <ul>
                                      <li>
                                        <a href="#" onClick={() => handleEditClick(r)}>
                                          <i className="ri-pencil-line"></i>
                                        </a>
                                      </li>

                                      {/* <li>
                                        <a href="javascript:void(0)" data-bs-toggle="modal"
                                          data-bs-target="#exampleModalToggle">
                                          <i className="ri-delete-bin-line"></i>
                                        </a>
                                      </li> */}
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
        <div className="modal fade" id="editRoleModal" tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Cập nhật vai trò người dùng</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
              </div>
              <div className="modal-body">
                <form>
                  <div className="mb-3">
                    <label className="form-label">Tên vai trò</label>
                    <input type="text" className="form-control" name="roleName" value={editForm.roleName} onChange={handleInputChange} />
                  </div>
                </form>
              </div>

              <div className="modal-footer">
                <button className="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
                <button className="btn btn-primary" onClick={handleUpdateRole}>Lưu</button>
              </div>
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

export default AllRole

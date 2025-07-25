import React, { useEffect, useState } from 'react'
import TopBar from '../AdminDashboard/TopBar';
import SideBar from '../AdminDashboard/SideBar';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

const AddNewUser = () => {
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    roleID: 0,
    status: 0,
    confirm: "",
  });
  const nav = useNavigate();
  const [role, setRole] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8082/PureFoods/api/role/getAll")
      .then(res => setRole(res.data.roleList))
      .catch(() => setRole([]));
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


  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.fullName || !form.email || !form.password) {
      toast.error("Vui lòng nhập đầy đủ (họ tên, email, mật khẩu)");
      return;
    }
    if (form.password !== form.confirm) {
      toast.error("Mật khẩu xác nhận không khớp");
      return;
    }

    try {
      const res = await axios.post("http://localhost:8082/PureFoods/api/users/add", {
        fullName: form.fullName,
        email: form.email,
        phone: form.phone,
        address: form.address,
        password: form.password,
        roleID: form.roleID,
        status: form.status,
      });

      if (res.data.status === 200) {
        toast.success(res.data.message);
        setForm({
          fullName: "",
          email: "",
          phone: "",
          address: "",
          password: "",
          confirm: "",
          roleID: 0,
          status: 0,
        });
      } else {
        toast.warning(res.data.message);
      }
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
      {/* tap on top start */}
      <div className="tap-top">
        <span className="lnr lnr-chevron-up"></span>
      </div>
      {/* tap on tap end */}

      {/* page-wrapper Start */}
      <div className="page-wrapper compact-wrapper" id="pageWrapper">
        {/* Page Header Start */}
        <TopBar />
        {/* Page Header End */}

        {/* Page Body Start */}
        <div className="page-body-wrapper">
          {/* Page Sidebar Start*/}
          <SideBar />
          {/* Page Sidebar Ends*/}

          {/* Page Sidebar Start */}
          <div className="page-body">
            {/* New User start */}
            <div className="container-fluid">
              <div className="row">
                <div className="col-12">
                  <div className="row">
                    <div className="col-sm-8 m-auto">
                      <div className="card">
                        <div className="card-body">
                          <div className="title-header option-title">
                            <h5>Add New User</h5>
                          </div>
                          <form className="theme-form theme-form-2 mega-form" onSubmit={handleSubmit}>
                            {/* Họ tên */}
                            <div className="mb-4 row align-items-center">
                              <label className="col-lg-2 col-md-3 mb-0">Full Name</label>
                              <div className="col-md-9 col-lg-10">
                                <input
                                  className="form-control"
                                  name="fullName"
                                  value={form.fullName}
                                  onChange={handleChange}
                                />
                              </div>
                            </div>

                            {/* Email */}
                            <div className="mb-4 row align-items-center">
                              <label className="col-lg-2 col-md-3">Email</label>
                              <div className="col-md-9 col-lg-10">
                                <input
                                  type="email"
                                  className="form-control"
                                  name="email"
                                  value={form.email}
                                  onChange={handleChange}
                                />
                              </div>
                            </div>

                            {/* Phone */}
                            <div className="mb-4 row align-items-center">
                              <label className="col-lg-2 col-md-3">Phone</label>
                              <div className="col-md-9 col-lg-10">
                                <input
                                  className="form-control"
                                  name="phone"
                                  value={form.phone}
                                  onChange={handleChange}
                                />
                              </div>
                            </div>

                            {/* Address */}
                            <div className="mb-4 row align-items-center">
                              <label className="col-lg-2 col-md-3">Address</label>
                              <div className="col-md-9 col-lg-10">
                                <input
                                  className="form-control"
                                  name="address"
                                  value={form.address}
                                  onChange={handleChange}
                                />
                              </div>
                            </div>

                            {/* Password */}
                            <div className="mb-4 row align-items-center">
                              <label className="col-lg-2 col-md-3">Password</label>
                              <div className="col-md-9 col-lg-10">
                                <input
                                  type="password"
                                  className="form-control"
                                  name="password"
                                  value={form.password}
                                  onChange={handleChange}
                                />
                              </div>
                            </div>

                            {/* Confirm */}
                            <div className="mb-4 row align-items-center">
                              <label className="col-lg-2 col-md-3">Confirm</label>
                              <div className="col-md-9 col-lg-10">
                                <input
                                  type="password"
                                  className={`form-control ${form.confirm
                                    ? form.confirm === form.password
                                      ? "is-valid"
                                      : "is-invalid"
                                    : ""
                                    }`} name="confirm"
                                  value={form.confirm}
                                  onChange={handleChange}
                                />
                                {form.confirm && form.confirm !== form.password && (
                                  <p className="text-danger mt-1">Mật khẩu xác nhận không khớp</p>
                                )}
                                {form.confirm && form.confirm === form.password && (
                                  <p className="text-success mt-1">Mật khẩu khớp</p>
                                )}
                              </div>
                            </div>

                            {/* roleID */}
                            <div className="mb-4 row align-items-center">
                              <label className="col-lg-2 col-md-3">Role</label>
                              <div className="col-md-9 col-lg-10">
                                <select
                                  className="form-select"
                                  name="roleID"
                                  value={form.roleID}
                                  onChange={handleChange}
                                >
                                  <option value="">-- Chọn Role --</option>

                                  {role.map(r => (
                                    <option key={r.roleID} value={r.roleID}>{r.roleName}</option>
                                  ))}
                                </select>
                              </div>
                            </div>

                            {/* status */}
                            <div className="mb-4 row align-items-center">
                              <label className="col-lg-2 col-md-3">Active</label>
                              <div className="col-md-9 col-lg-10 d-flex align-items-center">
                                <label className="switch">
                                  <input
                                    type="checkbox"
                                    name="status"
                                    checked={form.status === 0}
                                    onChange={(e) =>
                                      setForm({
                                        ...form,
                                        status: e.target.checked ? 0 : 1,
                                      })
                                    }
                                  />
                                  <span className="switch-state"></span>
                                </label>
                              </div>
                            </div>
                            <div className="card-submit-button">
                              <button className="btn btn-animation ms-auto" type="submit">
                                Submit
                              </button>
                            </div>
                          </form>

                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>


            {/* New User End */}

            {/* footer start */}
            <div className="container-fluid">
              <footer className="footer">
                <div className="row">
                  <div className="col-md-12 footer-copyright text-center">
                    <p className="mb-0">Copyright 2025 © Clean Food Shop theme by pixelstrap</p>
                  </div>
                </div>
              </footer>
            </div>
            {/* footer end */}
          </div >
          {/* Page Sidebar End */}
        </div >
      </div >
      {/* page-wrapper End */}

      {/* Modal Start */}
      <div className="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1">
        <div className="modal-dialog  modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-body">
              <h5 className="modal-title" id="staticBackdropLabel">Logging Out</h5>
              <p>Are you sure you want to log out?</p>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              <div className="button-box">
                <button type="button" className="btn btn--no" data-bs-dismiss="modal">No</button>
                <button type="button" onclick="location.href = 'login.html';"
                  className="btn  btn--yes btn-primary">Yes</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div >
  )
}

export default AddNewUser

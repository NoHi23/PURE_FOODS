import React, { useEffect, useState } from 'react'
import TopBar from '../AdminDashboard/TopBar';
import SideBar from '../AdminDashboard/SideBar';
import axios from 'axios';
import { toast } from 'react-toastify';

const AddNewRole = () => {
  const [form, setForm] = useState({
    roleName: ''
  });


  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.roleName) {
      toast.error("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    try {
      const res = await axios.post("http://localhost:8082/PureFoods/api/role/add", {
        roleName: form.roleName
      });

      if (res.data.status === 200) {
        toast.success(res.data.message);
        setForm({
          roleName: ''
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
    <div>
      {/* tap on top start */}
      <div className="tap-top">
        <span className="lnr lnr-chevron-up"></span>
      </div>
      {/* tap on tap end */}

      {/* page-wrapper start */}
      <div className="page-wrapper compact-wrapper" id="pageWrapper">
        {/* Page Header Start*/}
        <TopBar />
        {/* Page Header Ends*/}

        {/* Page Body start */}
        <div className="page-body-wrapper">
          {/* Page Sidebar Start*/}
          <SideBar />
          {/* Page Sidebar Ends*/}

          <div className="page-body">
            {/* New Product Add Start */}
            <div className="container-fluid">
              <div className="row">
                <div className="col-12">
                  <div className="row">
                    <div className="col-12">
                      <div className="card">
                        <div className="card-body">
                          <div className="card-header-2">
                            <h5>Tạo mới vai trò người dùng</h5>
                          </div>

                          <form className="theme-form theme-form-2 mega-form" onSubmit={handleSubmit}>
                            <div className="mb-4 row align-items-center">
                              <label className="col-lg-2 col-md-3 mb-0">Tên vai trò</label>
                              <div className="col-md-9 col-lg-10">
                                <input
                                  className="form-control"
                                  name="roleName"
                                  value={form.roleName}
                                  onChange={handleChange}
                                />
                              </div>
                            </div>

                            <div className="card-submit-button">
                              <button className="btn btn-animation ms-auto" type="submit">
                                Gửi
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
            {/* New Product Add End */}

            {/* footer Start */}
            <div className="container-fluid">
              <footer className="footer">
                <div className="row">
                  <div className="col-md-12 footer-copyright text-center">
                    <p className="mb-0">Copyright 2025 © Clean Food Shop theme by pixelstrap</p>

                  </div>
                </div>
              </footer>
            </div>
            {/* footer En */}
          </div>
          {/* Container-fluid End */}
        </div>
        {/* Page Body End */}
      </div>
      {/*  page-wrapper End */}

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
    </div>
  )
}

export default AddNewRole

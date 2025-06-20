import axios from 'axios';
import React, { useEffect, useState } from 'react'
import './Product.css'
import './jquery.dataTables.js'
import './custom-data-table.js'
import $ from 'jquery';
import 'datatables.net';
import TopBar from '../AdminDashboard/TopBar.jsx';
import SideBar from '../AdminDashboard/SideBar.jsx';
import { Link } from 'react-router-dom';

const Product = () => {
  const [products, setProducts] = useState([]);
  const [categoryNames, setCategoryNames] = useState({});

  useEffect(() => {
    axios.get("http://localhost:8082/PureFoods/api/product/getAll")
      .then(res => { setProducts(res.data.listProduct) })
  }, []);

  useEffect(() => {
    // Chờ DOM hiển thị xong
    if (products.length > 0) {
      const table = $('#table_id').DataTable({
        paging: false,
        ordering: false,
        info: false,
        destroy: true, // Thêm cái này để tránh lỗi khi gọi lại
        responsive: true,
      });

      return () => {
        table.destroy(); // cleanup khi component unmount hoặc re-render
      };
    }
  }, [products]);

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
    const fetchCategories = async () => {
      const newCategoryNames = {};

      const uniqueCategoryIds = [...new Set(products.map(p => p.categoryId))];
      
      await Promise.all(uniqueCategoryIds.map(async (id) => {
        try {
          const res = await axios.get(`http://localhost:8082/PureFoods/api/category/${id}`);
          newCategoryNames[id] = res.data.categoryName;
        } catch (err) {
          newCategoryNames[id] = 'Không tìm thấy';
        }
      }));

      setCategoryNames(newCategoryNames);
    };

    if (products.length > 0) {
      fetchCategories();
    }
  }, [products]);

  return (
    <div>
      <div className="tap-top">
        <span className="lnr lnr-chevron-up"></span>
      </div>

      <div className="page-wrapper compact-wrapper" id="pageWrapper">
        <TopBar />

        <div className="page-body-wrapper">
          <SideBar />

          {/* Container-fluid starts*/}
          <div className="page-body">
            <div className="container-fluid">
              <div className="row">
                <div className="col-sm-12">
                  <div className="card card-table">
                    <div className="card-body">
                      <div class="title-header option-title d-sm-flex d-block">
                        <h5>Products List</h5>
                        <div class="right-options">
                          <ul>
                            <li>
                              <a href="javascript:void(0)">import</a>
                            </li>
                            <li>
                              <a href="javascript:void(0)">Export</a>
                            </li>
                            <li>
                              <Link to={'/admin-add-new-product'} class="btn btn-solid">Add Product</Link>
                            </li>
                          </ul>
                        </div>
                      </div>
                      <div>
                        <div className="table-responsive">
                          <table className="table all-package theme-table table-product" id="table_id">
                            <thead>
                              <tr>
                                <th>Product Image</th>
                                <th>Product Name</th>
                                <th>Category</th>
                                <th>Supplier</th>
                                <th>Current Qty</th>
                                <th>Price</th>
                                <th>Status</th>
                                <th>Option</th>
                              </tr>
                            </thead>
                            <tbody>
                              {products?.map((p, i) => (
                                <tr key={i}>
                                  <td>
                                    <div className="table-image">
                                      <img src={p.imageURL} className="img-fluid"
                                        alt="" />
                                    </div>
                                  </td>

                                  <td>{p.productName}</td>

                                  <td>{categoryNames[p.categoryId] || 'Đang tải...'}</td>

                                  <td>{p.supplierId}</td>
                                  <td>{p.stockQuantity}</td>
                                  <td className="td-price">${p.price}</td>

                                  <td className={p.status === 1 ? "status-danger" : "status-success"}>
                                    <span>{p.status === 1 ? "Pending" : "Approved"}</span>
                                  </td>
                                  <td>
                                    <ul>
                                      <li>
                                        <a href="order-detail.html">
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
            </div>
            {/* Container-fluid Ends*/}

            <div className="container-fluid">
              {/* footer start*/}
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
      </div>
      {/* page-wrapper End*/}

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

export default Product

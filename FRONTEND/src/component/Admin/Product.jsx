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
import ProductActions from '../../ProductActions.jsx';
import * as bootstrap from 'bootstrap';
import { toast } from 'react-toastify';

const Product = () => {
  const [products, setProducts] = useState([]);
  const [categoryNames, setCategoryNames] = useState({});
  const [suppliersName, setSuppliersName] = useState({});
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [editProduct, setEditProduct] = useState(null);
  const [editForm, setEditForm] = useState({
    productName: '',
    categoryId: 0,
    supplierId: 0,
    price: '',
    stockQuantity: '',
    description: '',
    imageURL: '',
    status: 0
  });
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [productToDelete, setProductToDelete] = useState(null);

  const handleEditClick = (product) => {
    setEditProduct(product);
    setEditForm({
      productId: product.productId,
      productName: product.productName || '',
      categoryId: product.categoryId || '',
      supplierId: product.supplierId || '',
      price: product.price || '',
      stockQuantity: product.stockQuantity || '',
      description: product.description || '',
      imageURL: product.imageURL || '',
      status: product.status !== undefined ? product.status : 0
    });

    const modal = new bootstrap.Modal(document.getElementById('editProductModal'));
    modal.show();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };

  const handleViewProduct = (product) => {
    setSelectedProduct(product);
    const modal = new bootstrap.Modal(document.getElementById('productDetailModal'));
    modal.show();
  };


  const handleUpdateProduct = async () => {
    try {
      await axios.put(`http://localhost:8082/PureFoods/api/product/update`, {
        productId: editProduct.productId,
        ...editForm,
        lastUpdatedBy: 1
      });

      const res = await axios.get("http://localhost:8082/PureFoods/api/product/getAll");
      setProducts(res.data.listProduct);

      const modal = bootstrap.Modal.getInstance(document.getElementById('editProductModal'));
      modal.hide();

      toast.success("Cập nhật sản phẩm thành công!");
    } catch (error) {
      toast.error("Lỗi khi cập nhật sản phẩm");
    }
  };


  useEffect(() => {
    axios.get("http://localhost:8082/PureFoods/api/product/getAll")
      .then(res => { setProducts(res.data.listProduct) })
  }, []);

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

    if (products.length > 0) {
      setTimeout(() => initTable(), 100); // đợi DOM vững hơn
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


  useEffect(() => {
    const fetchSuppliers = async () => {
      const newSuppliersNames = {};

      const uniqueSuppliersIds = [...new Set(products.map(p => p.supplierId))];

      await Promise.all(uniqueSuppliersIds.map(async (id) => {
        try {
          const res = await axios.get(`http://localhost:8082/PureFoods/api/supplier/${id}`);
          newSuppliersNames[id] = res.data.supplierName;
        } catch (err) {
          newSuppliersNames[id] = 'Không tìm thấy';
        }
      }));

      setSuppliersName(newSuppliersNames);
    };

    if (products.length > 0) {
      fetchSuppliers();
    }
  }, [products]);

  useEffect(() => {
    axios.get("http://localhost:8082/PureFoods/api/category/getAll")
      .then(res => setCategories(res.data))
      .catch(() => setCategories([]));

    axios.get("http://localhost:8082/PureFoods/api/supplier/getAll")
      .then(res => setSuppliers(res.data))
      .catch(() => setSuppliers([]));
  }, []);


  const handleDeleteProduct = async () => {
    if (!productToDelete) return;

    try {
      await axios.delete('http://localhost:8082/PureFoods/api/product/delete', {
        data: { productId: productToDelete.productId }
      });

      const res = await axios.get("http://localhost:8082/PureFoods/api/product/getAll");
      setProducts(res.data.listProduct);

      toast.success("Xóa sản phẩm thành công!");
    } catch (error) {
      toast.error("Xóa sản phẩm thất bại!");
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
                            <li className="mt-5" >
                              <ProductActions setProducts={setProducts} products={products} />
                            </li>
                            <li>
                              <Link to={'/admin-add-new-product'} className="btn btn-solid">Add Product</Link>
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

                                  <td>{suppliersName[p.supplierId] || 'Đang tải...'}</td>
                                  <td>{p.stockQuantity}</td>
                                  <td className="td-price">${p.price}</td>

                                  <td className={p.status === 1 ? "status-danger" : "status-success"}>
                                    <span>{p.status === 1 ? "Private" : "Public"}</span>
                                  </td>
                                  <td>
                                    <ul>
                                      <li>
                                        <a href="#" onClick={() => handleViewProduct(p)}>
                                          <i className="ri-eye-line"></i>
                                        </a>

                                      </li>

                                      <li>
                                        <a href="#" onClick={() => handleEditClick(p)}>
                                          <i className="ri-pencil-line"></i>
                                        </a>
                                      </li>

                                      <li>
                                        <a href="javascript:void(0)" data-bs-toggle="modal"
                                          data-bs-target="#exampleModalToggle">
                                          <a href="#" data-bs-toggle="modal" data-bs-target="#exampleModalToggle" onClick={() => setProductToDelete(p)}>
                                            <i className="ri-delete-bin-line"></i>
                                          </a>
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
            <div className="modal fade" id="productDetailModal" tabIndex="-1" aria-hidden="true">
              <div className="modal-dialog modal-dialog-centered modal-lg">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title" style={{ fontWeight: 600 }}>Product Detail</h5>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>
                  <div className="modal-body">
                    {selectedProduct && (
                      <div>
                        <div className="row">
                          <div className="col-md-4">
                            <img src={selectedProduct.imageURL} className="img-fluid" alt="Product" />
                          </div>
                          <div className="col-md-8">
                            <h4 style={{ fontWeight: 700 }}>Product Name: {selectedProduct.productName}</h4>
                            <p><strong>Category:</strong> {categoryNames[selectedProduct.categoryId]}</p>
                            <p><strong>Supplier:</strong> {suppliersName[selectedProduct.supplierId]}</p>
                            <p><strong>Stock Quantity:</strong> {selectedProduct.stockQuantity}</p>
                            <p><strong>Price:</strong> ${selectedProduct.price}</p>
                            <p><strong>Description:</strong> {selectedProduct.description}</p>
                            <p><strong>Trạng thái:</strong> {selectedProduct.status === 1 ? "Private" : "Public"}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="modal fade" id="editProductModal" tabIndex="-1">
              <div className="modal-dialog modal-dialog-centered modal-lg">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Chỉnh sửa sản phẩm</h5>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
                  </div>
                  <div className="modal-body">
                    <form>
                      <div className="mb-3">
                        <label className="form-label">Tên sản phẩm</label>
                        <input type="text" className="form-control" name="productName" value={editForm.productName} onChange={handleInputChange} />
                      </div>

                      <div className="mb-3">
                        <label className="form-label">Loại</label>
                        <select className="form-control" name="categoryId" value={editForm.categoryId} onChange={handleInputChange}>
                          {categories.map(c => (
                            <option key={c.categoryID} value={c.categoryID}>{c.categoryName}</option>
                          ))}
                        </select>
                      </div>

                      <div className="mb-3">
                        <label className="form-label">Nhà cung cấp</label>
                        <select className="form-control" name="supplierId" value={editForm.supplierId} onChange={handleInputChange}>
                          {suppliers.map(s => (
                            <option key={s.supplierId} value={s.supplierId}>{s.supplierName}</option>
                          ))}
                        </select>
                      </div>

                      <div className="mb-3">
                        <label className="form-label">Giá</label>
                        <input type="number" className="form-control" name="price" value={editForm.price} onChange={handleInputChange} min={0} />
                      </div>

                      <div className="mb-3">
                        <label className="form-label">Số lượng</label>
                        <input type="number" className="form-control" name="stockQuantity" value={editForm.stockQuantity} onChange={handleInputChange} min={0} />
                      </div>

                      <div className="mb-3">
                        <label className="form-label">Mô tả</label>
                        <textarea className="form-control" name="description" rows={3} value={editForm.description} onChange={handleInputChange} />
                      </div>

                      <div className="mb-3">
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
                      )}
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
                    <button className="btn btn-primary" onClick={handleUpdateProduct}>Lưu thay đổi</button>
                  </div>
                </div>
              </div>
            </div>


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
              <button
                type="button"
                className="btn btn-animation btn-md fw-bold"
                data-bs-dismiss="modal"
                onClick={handleDeleteProduct}
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

export default Product

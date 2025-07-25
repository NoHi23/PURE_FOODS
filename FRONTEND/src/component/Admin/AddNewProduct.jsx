
import React, { useEffect, useState } from 'react'
import TopBar from '../AdminDashboard/TopBar'
import SideBar from '../AdminDashboard/SideBar'
import './AddNewProduct.css'
import axios from 'axios'
import { toast } from 'react-toastify'
const AddNewProduct = () => {
  const [product, setProduct] = useState([]);
  const [form, setForm] = useState({
    productName: "",
    categoryId: 0,
    supplierId: 0,
    price: 0,
    discountPercent: 0,
    stockQuantity: 0,
    description: "",
    imageURL: "",
    galleryImages: [""],
    status: 0,
    lastUpdatedBy: 1
  });

  const handleGalleryChange = (idx, value) => {
    setForm(prev => {
      const list = [...prev.galleryImages];
      list[idx] = value;
      return { ...prev, galleryImages: list };
    });
  };

  const addGalleryField = () =>
    setForm(prev => ({ ...prev, galleryImages: [...prev.galleryImages, ""] }));

  const removeGalleryField = (idx) => {
    setForm(prev => {
      const list = [...prev.galleryImages];
      list.splice(idx, 1);
      return { ...prev, galleryImages: list };
    });
  };

  const salePrice =
    (form.price || 0) * (1 - (form.discountPercent || 0) / 100);
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
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
    const { name, value } = e.target;
    const newValue = ['categoryId', 'supplierId', 'price', 'stockQuantity'].includes(name)
      ? parseInt(value)
      : value;
    setForm({ ...form, [name]: newValue });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:8082/PureFoods/api/product/add', form);
      if (res.data.status === 200) {
        toast.success("Thêm sản phẩm thành công!");
        setForm({
          productName: "",
          categoryId: 0,
          supplierId: 0,
          price: 0,
          discountPercent: 0,
          stockQuantity: 0,
          description: "",
          imageURL: "",
          status: 0,
          lastUpdatedBy: 1
        });
      } else {
        toast.error(res.data.message || "Có lỗi xảy ra");
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
    axios.get("http://localhost:8082/PureFoods/api/category/getAll")
      .then(res => setCategories(res.data))
      .catch(() => setCategories([]));

    axios.get("http://localhost:8082/PureFoods/api/supplier/getAll")
      .then(res => setSuppliers(res.data.suppliers))
      .catch(() => setSuppliers([]));
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
                <div className="col-12">
                  <div className="row">
                    <div className="col-sm-8 m-auto">
                      <div className="card">
                        <div className="card-body">
                          <div className="card-header-2">
                            <h5>Product Information</h5>
                          </div>

                          <form className="theme-form theme-form-2 mega-form" onSubmit={handleSubmit}>
                            <div className="mb-4 row align-items-center">
                              <label className="form-label-title col-sm-3 mb-0">Product
                                Name</label>
                              <div className="col-sm-9">
                                <input className="form-control" type="text"
                                  placeholder="Product Name"
                                  name="productName"
                                  value={form.productName}
                                  onChange={handleChange} />
                              </div>
                            </div>

                            <div className="mb-4 row align-items-center">
                              <label className="col-sm-3 col-form-label form-label-title">Category
                                Name</label>
                              <div className="col-sm-9">
                                <select className="js-example-basic-single w-100"
                                  value={form.categoryId}
                                  onChange={handleChange}
                                  name="categoryId">
                                  <option value="">-- Chọn loại --</option>
                                  {categories.map(c => (
                                    <option key={c.categoryID} value={c.categoryID}>{c.categoryName}</option>
                                  ))}
                                </select>
                              </div>
                            </div>

                            <div className="mb-4 row align-items-center">
                              <label
                                className="col-sm-3 col-form-label form-label-title">Supplier Name</label>
                              <div className="col-sm-9">
                                <select className="js-example-basic-single w-100"
                                  name="supplierId"
                                  value={form.supplierId}
                                  onChange={handleChange}>
                                  <option value="">-- Chọn nhà cung cấp --</option>
                                  {suppliers.map(s => (
                                    <option key={s.supplierID} value={s.supplierID}>{s.supplierName}</option>
                                  ))}
                                </select>
                              </div>
                            </div>

                            <div className="mb-4 row align-items-center">
                              <label className="form-label-title col-sm-3 mb-0">Price</label>
                              <div className="col-sm-9">
                                <input className="form-control" type="number"
                                  placeholder="Price"
                                  name="price"
                                  value={form.price}
                                  onChange={handleChange} min={0} />
                              </div>
                            </div>
                            <div className="mb-4 row align-items-center">
                              <label className="form-label-title col-sm-3 mb-0"> Discount: </label>
                              <div className="col-sm-9">
                                <label className="form-label">
                                  {form.discountPercent || 0}%
                                </label>
                                <input className="form-range" type="range"
                                  placeholder="Price"
                                  name="discountPercent"
                                  min={0}
                                  max={100}
                                  step={1}
                                  value={form.discountPercent || 0}
                                  onChange={handleChange} />
                              </div>
                            </div>

                            <div className="mb-4 row align-items-center">
                              <label className="form-label-title col-sm-3 mb-0"> Price After Discount: </label>
                              <div className="col-sm-9">
                                <label className="form-label">
                                  &nbsp;
                                  {salePrice.toLocaleString("en-US", {
                                    style: "currency",
                                    currency: "USD",
                                    minimumFractionDigits: 0,
                                  })}
                                </label>
                              </div>
                            </div>
                            <div className="mb-4 row align-items-center">
                              <label className="form-label-title col-sm-3 mb-0">Stock Quantity</label>
                              <div className="col-sm-9">
                                <input className="form-control" type="number"
                                  placeholder="Stock Quantity"
                                  name="stockQuantity"
                                  value={form.stockQuantity}
                                  onChange={handleChange} min={0} />
                              </div>
                            </div>
                            <div className="mb-4 row">
                              <label className="form-label-title col-sm-3 mb-0">Description</label>
                              <div className="col-sm-9">
                                <textarea className="form-control" rows="3" name="description" value={form.description} onChange={handleChange}></textarea>
                              </div>
                            </div>
                            <div className="mb-3">
                              <label className="form-label">Avatar URL</label>
                              <input type="text" className="form-control" name="imageURL" value={form.imageURL} onChange={handleChange} />
                            </div>
                            {form.imageURL && (
                              <div className="mb-3">
                                <label className="form-label">Preview image</label>
                                <div>
                                  <img
                                    src={form.imageURL}
                                    alt="Preview"
                                    style={{ maxWidth: '100%', maxHeight: '200px', border: '1px solid #ccc' }}
                                    onError={(e) => {
                                      e.target.src = "https://via.placeholder.com/150?text=Image+not+found";
                                    }}
                                  />
                                </div>
                              </div>
                            )}
                            <label className="form-label">Image URL</label>

                            {form.galleryImages?.map((url, idx) => (
                              <div key={idx} className="d-flex mb-2 align-items-center">

                                <input
                                  type="text"
                                  className="form-control"
                                  placeholder={`Link ảnh #${idx + 1}`}
                                  value={url}
                                  onChange={e => handleGalleryChange(idx, e.target.value)}
                                />

                                {form.galleryImages.length > 1 && (
                                  <button
                                    type="button"
                                    className="btn btn-sm btn-danger ms-2"
                                    onClick={() => removeGalleryField(idx)}
                                  >
                                    −
                                  </button>
                                )}
                                {idx === form.galleryImages.length - 1 && (
                                  <button
                                    type="button"
                                    className="btn btn-sm btn-success ms-2"
                                    onClick={addGalleryField}
                                  >
                                    +
                                  </button>
                                )}
                              </div>
                            ))}
                            {form.galleryImages?.some(url => url.trim() !== "") && (
                              <div className="mb-3">
                                <label className="form-label">Preview gallery</label>

                                <div className="d-flex flex-wrap gap-2">
                                  {form.galleryImages.map((url, idx) =>
                                    url.trim() ? (
                                      <img
                                        key={idx}
                                        src={url}
                                        alt={`gallery - ${idx + 1}`}
                                        style={{
                                          width: 120,
                                          height: 120,
                                          objectFit: "cover",
                                          border: "1px solid #ccc",
                                          borderRadius: 4
                                        }}
                                        onError={e => {
                                          e.target.src =
                                            "https://via.placeholder.com/120?text=404";
                                        }}
                                      />
                                    ) : null
                                  )}
                                </div>
                              </div>
                            )}
                            <div className="mb-4 row align-items-center">
                              <label className="col-sm-3 col-form-label form-label-title">Status</label>
                              <div className="col-sm-9">
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
                              <button className="btn btn-animation ms-auto" type="submit">Submit</button>
                            </div>
                          </form>

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
                    <p className="mb-0">Copyright 2022 © Fastkart theme by pixelstrap</p>
                  </div>
                </div>
              </footer>
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

export default AddNewProduct
import React, { useEffect, useState } from 'react';
import './Supplier.css';
import axios from 'axios';
import $ from 'jquery';
import 'datatables.net';
import TopBar from '../AdminDashboard/TopBar';
import SideBar from '../AdminDashboard/SideBar';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as bootstrap from 'bootstrap';

const Supplier = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentSuppliers = suppliers.slice(startIndex, endIndex);
  const totalPages = Math.ceil(suppliers.length / itemsPerPage);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [editSupplier, setEditSupplier] = useState({
    supplierName: '',
    contactName: '',
    phone: '',
    email: '',
    organicCertification: '',
    certificationExpiry: '',
    status: 1
  });
  const [supplierToDelete, setSupplierToDelete] = useState(null);

  const fetchSuppliers = () => {
    axios.get("http://localhost:8082/PureFoods/api/supplier/getAll")
      .then(res => setSuppliers(res.data.suppliers))
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
    fetchSuppliers();
  }, []);

  useEffect(() => {
    if (suppliers.length > 0) {
      const table = $('#supplier_table').DataTable({
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
  }, [suppliers]);

  const handleView = (supplier) => {
    setSelectedSupplier(supplier);
    new bootstrap.Modal(document.getElementById("viewModal")).show();
  };

  const handleEdit = (supplier) => {
    let formattedDate = '';

    if (supplier.certificationExpiry) {
      try {
        const date = new Date(supplier.certificationExpiry);
        const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000); // Bù trừ UTC+7
        formattedDate = local.toISOString().split('T')[0];
      } catch (e) {
        console.error("Invalid date:", supplier.certificationExpiry);
      }
    }

    setSelectedSupplier(supplier);
    setEditSupplier({
      supplierId: supplier.supplierId,
      ...supplier,
      certificationExpiry: formattedDate
    });

    new bootstrap.Modal(document.getElementById("editModal")).show();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditSupplier(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdateSupplier = async () => {
    const trimmedName = editSupplier.supplierName.trim();
    const trimmedPhone = editSupplier.phone.trim();
    const trimmedEmail = editSupplier.email.trim();

    // Validate: Không được để trống
    if (!trimmedName || !trimmedPhone || !trimmedEmail) {
      toast.error("Vui lòng nhập đầy đủ Tên, Số điện thoại và Email.");
      return;
    }

    // Validate: Email đúng định dạng
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      toast.error("Email không hợp lệ.");
      return;
    }

    // Validate: Phone là số
    const phoneRegex = /^[0-9]+$/;
    if (!phoneRegex.test(trimmedPhone)) {
      toast.error("Số điện thoại chỉ được chứa số.");
      return;
    }

    try {
      // Kiểm tra trùng tên nếu người dùng thay đổi
      if (trimmedName !== selectedSupplier.supplierName.trim()) {
        try {
          const res = await axios.get("http://localhost:8082/PureFoods/api/supplier/searchByName", {
            params: { name: trimmedName }
          });

          if (res.status === 200 && res.data.supplierId !== selectedSupplier.supplierId) {
            toast.error("Tên nhà cung cấp đã tồn tại!");
            return;
          }
        } catch (error) {
          if (error.response && error.response.status !== 404) {
            toast.error("Lỗi khi kiểm tra tên nhà cung cấp!");
            console.error(error);
            return;
          }
          // 404 là OK → không trùng
        }
      }

      const dataToSend = {
        ...editSupplier,
        certificationExpiry: editSupplier.certificationExpiry === '' ? null : editSupplier.certificationExpiry
      };

      await axios.put(`http://localhost:8082/PureFoods/api/supplier/update/${editSupplier.supplierId}`, dataToSend);

      fetchSuppliers();
      bootstrap.Modal.getInstance(document.getElementById("editModal")).hide();
      toast.success("Cập nhật thành công!");
    } catch (err) {
      console.error("Update error:", err.response?.data || err.message);
      toast.error("Lỗi cập nhật!");
    }
  };


  const confirmDelete = (supplier) => {
    setSupplierToDelete(supplier);
    new bootstrap.Modal(document.getElementById("deleteModal")).show();
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:8082/PureFoods/api/supplier/delete/${supplierToDelete.supplierId}`);
      fetchSuppliers();
      bootstrap.Modal.getInstance(document.getElementById("deleteModal")).hide();
      toast.success("Đã xoá nhà cung cấp!");
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
                      <h5>Supplier List</h5>
                      <div className="right-options">
                        <ul>
                          <li>
                            <Link to="/admin-add-new-supplier" className="btn btn-solid">Add Supplier</Link>
                          </li>
                        </ul>
                      </div>
                    </div>

                    <div className="table-responsive">
                      <table className="table theme-table" id="supplier_table">
                        <thead>
                          <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Contact</th>
                            <th>Phone</th>
                            <th>Email</th>
                            <th>Address</th>
                            <th>Organic Cert</th>
                            <th>Expiry</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentSuppliers.map((s, i) => (
                            <tr key={i}>
                              <td>{s.supplierId}</td>
                              <td>{s.supplierName}</td>
                              <td>{s.contactName}</td>
                              <td>{s.phone}</td>
                              <td>{s.email}</td>
                              <td>{s.address}</td>
                              <td>{s.organicCertification}</td>
                              <td>{s.certificationExpiry ? new Date(s.certificationExpiry).toLocaleDateString('en-CA') : 'N/A'}</td>
                              <td>
                                <ul className="table-action-icons">
                                  <li>
                                    <a href="#" onClick={(e) => { e.preventDefault(); handleView(s); }}>
                                      <i className="ri-eye-line"></i>
                                    </a>
                                  </li>
                                  <li>
                                    <a href="#" onClick={(e) => { e.preventDefault(); handleEdit(s); }}>
                                      <i className="ri-pencil-line"></i>
                                    </a>
                                  </li>
                                  <li>
                                    <a href="#" onClick={(e) => { e.preventDefault(); confirmDelete(s); }}>
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

                    {/* View Modal */}
                    <div className="modal fade" id="viewModal" tabIndex="-1">
                      <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                          <div className="modal-header">
                            <h5 className="modal-title">Supplier Detail</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                          </div>
                          <div className="modal-body">
                            {selectedSupplier && (
                              <>
                                <p><strong>ID:</strong> {selectedSupplier.supplierId}</p>
                                <p><strong>Name:</strong> {selectedSupplier.supplierName}</p>
                                <p><strong>Contact:</strong> {selectedSupplier.contactName}</p>
                                <p><strong>Phone:</strong> {selectedSupplier.phone}</p>
                                <p><strong>Email:</strong> {selectedSupplier.email}</p>
                                <p><strong>Address:</strong> {selectedSupplier.address}</p>
                                <p><strong>Organic Cert:</strong> {selectedSupplier.organicCertification}</p>
                                <p><strong>Expiry:</strong> {selectedSupplier.certificationExpiry ? new Date(selectedSupplier.certificationExpiry).toLocaleDateString('en-CA') : 'N/A'}</p>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Edit Modal */}
                    <div className="modal fade" id="editModal" tabIndex="-1">
                      <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                          <div className="modal-header">
                            <h5 className="modal-title">Edit Supplier</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                          </div>
                          <div className="modal-body">
                            <form>
                              <label><strong>Name:</strong></label>
                              <input type="text" className="form-control mb-2" placeholder="Name" name="supplierName" value={editSupplier.supplierName} onChange={handleInputChange} />

                              <label><strong>Contact:</strong></label>
                              <input type="text" className="form-control mb-2" placeholder="Contact" name="contactName" value={editSupplier.contactName} onChange={handleInputChange} />

                              <label><strong>Phone:</strong></label>
                              <input type="text" className="form-control mb-2" placeholder="Phone" name="phone" value={editSupplier.phone} onChange={handleInputChange} />

                              <label><strong>Email:</strong></label>
                              <input type="email" className="form-control mb-2" placeholder="Email" name="email" value={editSupplier.email} onChange={handleInputChange} />

                              <label><strong>Address:</strong></label>
                              <input type="text" className="form-control mb-2" placeholder="Address" name="address" value={editSupplier.address} onChange={handleInputChange} />

                              <label><strong>Organic Cert:</strong></label>
                              <input type="text" className="form-control mb-2" placeholder="Organic Cert" name="organicCertification" value={editSupplier.organicCertification} onChange={handleInputChange} />

                              <label><strong>Certification Expiry:</strong></label>
                              <input type="date" className="form-control mb-2" name="certificationExpiry" value={editSupplier.certificationExpiry} onChange={handleInputChange} />
                            </form>
                          </div>
                          <div className="modal-footer">
                            <button className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                            <button className="btn btn-primary" onClick={handleUpdateSupplier}>Save Changes</button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Delete Modal */}
                    <div className="modal fade" id="deleteModal" tabIndex="-1">
                      <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                          <div className="modal-header text-center">
                            <h5 className="modal-title w-100">Confirm Delete</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                          </div>
                          <div className="modal-body text-center">
                            <p>Are you sure you want to delete this supplier?</p>
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

export default Supplier;

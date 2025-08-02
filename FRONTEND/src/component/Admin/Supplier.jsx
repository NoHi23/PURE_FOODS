import React, { useEffect, useState } from 'react';
import './Supplier.css';
import axios from 'axios';
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
    address: '',
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
    fetchSuppliers();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditSupplier(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdateSupplier = async () => {
    const trimmedName = editSupplier.supplierName?.trim() || '';
    const trimmedContact = editSupplier.contactName?.trim() || '';
    const trimmedPhone = editSupplier.phone?.trim() || '';
    const trimmedEmail = editSupplier.email?.trim() || '';
    const trimmedAddress = editSupplier.address?.trim() || '';
    const trimmedCertification = editSupplier.organicCertification?.trim() || '';
    const certificationExpiry = editSupplier.certificationExpiry;

    if (!trimmedName || !trimmedContact || !trimmedPhone || !trimmedEmail || !trimmedAddress || !trimmedCertification || !certificationExpiry) {
      toast.error("Vui lòng nhập đầy đủ tất cả các trường bắt buộc.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      toast.error("Email không đúng định dạng.");
      return;
    }

    const phoneRegex = /^\d+$/;
    if (!phoneRegex.test(trimmedPhone)) {
      toast.error("Số điện thoại chỉ được chứa số.");
      return;
    }

    const today = new Date().toISOString().split("T")[0];
    if (certificationExpiry < today) {
      toast.error("Certification Expiry phải lớn hơn hoặc bằng ngày hiện tại.");
      return;
    }

    try {
      if (trimmedName !== selectedSupplier?.supplierName?.trim()) {
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
            return;
          }
        }
      }

      await axios.put(`http://localhost:8082/PureFoods/api/supplier/update/${editSupplier.supplierId}`, editSupplier);
      fetchSuppliers();
      const editModalEl = document.getElementById("editModal");
      const modalInstance = bootstrap.Modal.getInstance(editModalEl);
      if (!modalInstance) {
        modalInstance = new bootstrap.Modal(editModalEl);
      }
      modalInstance.hide();
      document.querySelectorAll('.modal-backdrop').forEach(backdrop => backdrop.remove());
      document.body.classList.remove('modal-open');
      document.body.style = '';
      toast.success("Cập nhật thành công!");
    } catch (err) {
      toast.error("Lỗi cập nhật!");
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

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:8082/PureFoods/api/supplier/delete/${supplierToDelete.supplierId}`);
      fetchSuppliers();
      const modal = bootstrap.Modal.getInstance(document.getElementById("deleteModal"));
      modal.hide();

      // Dọn dẹp backdrop còn sót
      document.querySelectorAll('.modal-backdrop').forEach(el => el.remove());
      document.body.classList.remove('modal-open');
      document.body.style = '';
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
                      <h5>Danh sách nhà cung cấp</h5>
                      <div className="right-options">
                        <ul>
                          <li>
                            <Link to="/admin-add-new-supplier" className="btn btn-solid">Thêm mới nhà cung cấp</Link>
                          </li>
                        </ul>
                      </div>
                    </div>

                    <div className="table-responsive">
                      <table className="table theme-table">
                        <thead>
                          <tr>
                            <th>ID</th>
                            <th>Tên</th>
                            <th>Liên hệ</th>
                            <th>Số điện thoại</th>
                            <th>Email</th>
                            <th>Địa chỉ</th>
                            <th>Hữu cơ</th>
                            <th>Hạn</th>
                            <th>Hành động</th>
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
                                    <a href="#" onClick={() => setSelectedSupplier(s)}>
                                      <i className="ri-eye-line" data-bs-toggle="modal" data-bs-target="#viewModal"></i>
                                    </a>
                                  </li>
                                  <li>
                                    <a href="#" onClick={(e) => {
                                      e.preventDefault();
                                      setEditSupplier(s);
                                      setSelectedSupplier(s);
                                    }}>
                                      <i className="ri-pencil-line" data-bs-toggle="modal" data-bs-target="#editModal"></i>
                                    </a>
                                  </li>
                                  <li>
                                    <a href="#" onClick={(e) => {
                                      e.preventDefault();
                                      setSupplierToDelete(s);
                                      const deleteModalEl = document.getElementById("deleteModal");
                                      const modal = bootstrap.Modal.getOrCreateInstance(deleteModalEl);
                                      modal.show();
                                    }}>
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
                                <button className="page-link" onClick={() => setCurrentPage(index + 1)}>{index + 1}</button>
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

          {/* Modal View */}
          <div className="modal fade" id="viewModal" tabIndex="-1">
            <div className="modal-dialog modal-lg">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Chi tiết nhà cung cấp</h5>
                  <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div className="modal-body">
                  {selectedSupplier && (
                    <div>
                      <p><strong>ID:</strong> {selectedSupplier.supplierId}</p>
                      <p><strong>Tên:</strong> {selectedSupplier.supplierName}</p>
                      <p><strong>Liên hệ:</strong> {selectedSupplier.contactName}</p>
                      <p><strong>SĐT:</strong> {selectedSupplier.phone}</p>
                      <p><strong>Email:</strong> {selectedSupplier.email}</p>
                      <p><strong>Địa chỉ:</strong> {selectedSupplier.address}</p>
                      <p><strong>Hữu cơ:</strong> {selectedSupplier.organicCertification}</p>
                      <p><strong>Ngày hết hạn:</strong> {selectedSupplier.certificationExpiry}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Modal Edit */}
          <div className="modal fade" id="editModal" tabIndex="-1">
            <div className="modal-dialog modal-lg">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Chỉnh sửa nhà cung cấp</h5>
                  <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div className="modal-body">
                  <div className="form-group mb-2">
                    <label>Tên</label>
                    <input type="text" className="form-control" name="supplierName" value={editSupplier.supplierName} onChange={handleInputChange} />
                  </div>
                  <div className="form-group mb-2">
                    <label>Liên hệ</label>
                    <input type="text" className="form-control" name="contactName" value={editSupplier.contactName} onChange={handleInputChange} />
                  </div>
                  <div className="form-group mb-2">
                    <label>SĐT</label>
                    <input type="text" className="form-control" name="phone" value={editSupplier.phone} onChange={handleInputChange} />
                  </div>
                  <div className="form-group mb-2">
                    <label>Email</label>
                    <input type="text" className="form-control" name="email" value={editSupplier.email} onChange={handleInputChange} />
                  </div>
                  <div className="form-group mb-2">
                    <label>Địa chỉ</label>
                    <input type="text" className="form-control" name="address" value={editSupplier.address} onChange={handleInputChange} />
                  </div>
                  <div className="form-group mb-2">
                    <label>Hữu cơ</label>
                    <select className="form-control" name="organicCertification" value={editSupplier.organicCertification} onChange={handleInputChange}>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>
                  <div className="form-group mb-2">
                    <label>Ngày hết hạn</label>
                    <input type="date" className="form-control" name="certificationExpiry" value={editSupplier.certificationExpiry || ''} onChange={handleInputChange} />
                  </div>
                </div>
                <div className="modal-footer">
                  <button className="btn btn-primary" onClick={handleUpdateSupplier}>Lưu</button>
                  <button className="btn btn-secondary" data-bs-dismiss="modal">Huỷ</button>
                </div>
              </div>
            </div>
          </div>

          {/* Modal Delete */}
          <div className="modal fade" id="deleteModal" tabIndex="-1">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Xoá nhà cung cấp</h5>
                  <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div className="modal-body">
                  <p>Bạn có chắc chắn muốn xoá nhà cung cấp <strong>{supplierToDelete?.supplierName}</strong> không?</p>
                </div>
                <div className="modal-footer">
                  <button className="btn btn-danger" onClick={handleDelete}>Xoá</button>
                  <button className="btn btn-secondary" data-bs-dismiss="modal">Huỷ</button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Supplier;

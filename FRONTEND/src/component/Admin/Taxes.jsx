import React, { useEffect, useState } from 'react';
import './Taxes.css';
import axios from 'axios';
import $ from 'jquery';
import 'datatables.net';
import TopBar from '../AdminDashboard/TopBar';
import SideBar from '../AdminDashboard/SideBar';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as bootstrap from 'bootstrap';

const Taxes = () => {
  const [taxes, setTaxes] = useState([]);
  const [selectedTax, setSelectedTax] = useState(null);
  const [editTax, setEditTax] = useState({
    taxID: '',
    taxName: '',
    taxRate: '',
    description: '',
    effectiveDate: '',
    status: 1, // Default to Active
  });
  const [taxToDelete, setTaxToDelete] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchTaxes = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:8082/PureFoods/api/tax/getAll");
      console.log("API Response:", res.data); // Debug: Log phản hồi API
      const taxList = res.data.taxList || res.data.listTax || []; // Hỗ trợ cả taxList và listTax
      setTaxes(taxList);
    } catch (err) {
      console.error("Fetch Error:", err);
      toast.error("Lỗi khi tải danh sách thuế!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTaxes();
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
    sidebarLinks.forEach(link => link.addEventListener('click', handleClick));
    return () => sidebarLinks.forEach(link => link.removeEventListener('click', handleClick));
  }, []);

  useEffect(() => {
    if (taxes.length > 0) {
      const table = $('#tax_table').DataTable({
        paging: false,
        ordering: false,
        info: false,
        destroy: true,
        responsive: true,
      });
      return () => table.destroy();
    }
  }, [taxes]);

  const handleView = (tax) => {
    setSelectedTax(tax);
    new bootstrap.Modal(document.getElementById("viewModal")).show();
  };

  const handleEdit = (tax) => {
    setSelectedTax(tax);
    setEditTax({
      taxID: tax.taxID,
      taxName: tax.taxName,
      taxRate: tax.taxRate,
      description: tax.description || '',
      effectiveDate: tax.effectiveDate.split('T')[0],
      status: tax.status,
    });
    new bootstrap.Modal(document.getElementById("editModal")).show();
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditTax(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (checked ? 1 : 0) : value,
    }));
  };

  const handleUpdateTax = async (e) => {
    e.preventDefault();
    if (!editTax.taxName || !editTax.taxRate || !editTax.effectiveDate) {
      toast.error("Vui lòng nhập đầy đủ (Tên thuế, Tỷ lệ thuế, Ngày hiệu lực)");
      return;
    }
    try {
      const payload = {
        taxName: editTax.taxName,
        taxRate: parseFloat(editTax.taxRate) || 0,
        description: editTax.description || null,
        effectiveDate: new Date(editTax.effectiveDate).toISOString().split('T')[0],
        status: editTax.status,
      };
      const res = await axios.put(`http://localhost:8082/PureFoods/api/tax/update/${editTax.taxID}`, payload);
      if (res.status === 200) {
        await fetchTaxes();
        bootstrap.Modal.getInstance(document.getElementById("editModal")).hide();
        toast.success(res.data.message || "Cập nhật thuế thành công!");
      } else {
        toast.warning(res.data.message || "Cập nhật thuế thất bại!");
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Lỗi khi gọi API";
      toast.error(errorMessage);
    }
  };

  const confirmDelete = (tax) => {
    setTaxToDelete(tax);
    new bootstrap.Modal(document.getElementById("deleteModal")).show();
  };

  const handleDelete = async () => {
    try {
      const res = await axios.delete(`http://localhost:8082/PureFoods/api/tax/delete/${taxToDelete.taxID}`);
      if (res.status === 200) {
        await fetchTaxes();
        bootstrap.Modal.getInstance(document.getElementById("deleteModal")).hide();
        toast.success(res.data.message || "Xóa thuế thành công!");
      } else {
        toast.warning(res.data.message || "Xóa thuế thất bại!");
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Lỗi khi gọi API";
      toast.error(errorMessage);
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
              <div className="col-12">
                <div className="card">
                  <div className="card-body">
                    <div className="title-header option-title d-sm-flex d-block">
                      <h5>Danh sách thuế</h5>
                      <div className="right-options">
                        <ul>
                          <li>
                            <Link to="/admin-add-new-tax" className="btn btn-animation">Thêm mới thuế</Link>
                          </li>
                        </ul>
                      </div>
                    </div>
                    {loading ? (
                      <p>Đang tải...</p>
                    ) : taxes.length === 0 ? (
                      <p>Không có thuế nào để hiển thị.</p>
                    ) : (
                      <div className="table-responsive">
                        <table className="table theme-table" id="tax_table">
                          <thead>
                            <tr>
                              <th>ID</th>
                              <th>Tên</th>
                              <th>Thuế suất (%)</th>
                              <th>Mô tả</th>
                              <th>Ngày có hiệu lực</th>
                              <th>Trạng thái</th>
                              <th>Tùy chọn</th>
                            </tr>
                          </thead>
                          <tbody>
                            {taxes.map((t, i) => (
                              <tr key={i}>
                                <td>{t.taxID}</td>
                                <td>{t.taxName}</td>
                                <td>{t.taxRate}</td>
                                <td>{t.description || '-'}</td>
                                <td>{new Date(t.effectiveDate).toLocaleDateString()}</td>
                                <td className={t.status === 1 ? 'status-success' : 'status-danger'}>
                                  {t.status === 1 ? 'Hoạt động' : 'Không hoạt động'}
                                </td>
                                <td>
                                  <ul className="table-action-icons">
                                    <li>
                                      <a href="#" onClick={(e) => { e.preventDefault(); handleView(t); }}>
                                        <i className="ri-eye-line"></i>
                                      </a>
                                    </li>
                                    <li>
                                      <a href="#" onClick={(e) => { e.preventDefault(); handleEdit(t); }}>
                                        <i className="ri-pencil-line"></i>
                                      </a>
                                    </li>
                                    <li>
                                      <a href="#" onClick={(e) => { e.preventDefault(); confirmDelete(t); }}>
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
                    )}
                    <div className="modal fade" id="viewModal" tabIndex="-1">
                      <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                          <div className="modal-header">
                            <h5 className="modal-title">Tax Detail</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                          </div>
                          <div className="modal-body">
                            {selectedTax && (
                              <>
                                <p><strong>ID:</strong> {selectedTax.taxID}</p>
                                <p><strong>Tên:</strong> {selectedTax.taxName}</p>
                                <p><strong>Mức thuế:</strong> {selectedTax.taxRate}%</p>
                                <p><strong>Mô tả:</strong> {selectedTax.description || '-'}</p>
                                <p><strong>Ngày có hiệu lực:</strong> {new Date(selectedTax.effectiveDate).toLocaleDateString()}</p>
                                <p><strong>Trạng thái:</strong> {selectedTax.status === 1 ? 'Hoạt động' : 'Không hoạt động'}</p>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="modal fade" id="editModal" tabIndex="-1">
                      <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                          <div className="modal-header">
                            <h5 className="modal-title">Chỉnh sửa Thuế</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                          </div>
                          <div className="modal-body">
                            <form onSubmit={handleUpdateTax}>
                              <div className="mb-4 row align-items-center">
                                <label className="col-lg-2 col-md-3 mb-0">Tên</label>
                                <div className="col-md-9 col-lg-10">
                                  <input
                                    type="text"
                                    className="form-control"
                                    name="taxName"
                                    value={editTax.taxName}
                                    onChange={handleInputChange}
                                    required
                                  />
                                </div>
                              </div>
                              <div className="mb-4 row align-items-center">
                                <label className="col-lg-2 col-md-3 mb-0">Thuế suất (%)</label>
                                <div className="col-md-9 col-lg-10">
                                  <input
                                    type="number"
                                    step="0.01"
                                    className="form-control"
                                    name="taxRate"
                                    value={editTax.taxRate}
                                    onChange={handleInputChange}
                                    required
                                  />
                                </div>
                              </div>
                              <div className="mb-4 row align-items-center">
                                <label className="col-lg-2 col-md-3 mb-0">Mô tả</label>
                                <div className="col-md-9 col-lg-10">
                                  <textarea
                                    className="form-control"
                                    name="description"
                                    value={editTax.description}
                                    onChange={handleInputChange}
                                  />
                                </div>
                              </div>
                              <div className="mb-4 row align-items-center">
                                <label className="col-lg-2 col-md-3 mb-0">Ngày có hiệu lực</label>
                                <div className="col-md-9 col-lg-10">
                                  <input
                                    type="date"
                                    className="form-control"
                                    name="effectiveDate"
                                    value={editTax.effectiveDate}
                                    onChange={handleInputChange}
                                    required
                                  />
                                </div>
                              </div>
                              <div className="mb-4 row align-items-center">
                                <label className="col-lg-2 col-md-3 mb-0">Hoạt động</label>
                                <div className="col-md-9 col-lg-10 d-flex align-items-center">
                                  <label className="switch">
                                    <input
                                      type="checkbox"
                                      name="status"
                                      checked={editTax.status === 1}
                                      onChange={handleInputChange}
                                    />
                                    <span className="switch-state"></span>
                                  </label>
                                </div>
                              </div>
                              <div className="card-submit-button">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Hủy</button>
                                <button type="submit" className="btn btn-animation ms-auto">Lưu thay đổi</button>
                              </div>
                            </form>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="modal fade" id="deleteModal" tabIndex="-1">
                      <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                          <div className="modal-header text-center">
                            <h5 className="modal-title w-100">Xác nhận xóa</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                          </div>
                          <div className="modal-body text-center">
                            <p>Bạn có chắc chắn muốn xóa thuế này?</p>
                            <button className="btn btn-danger m-2" onClick={handleDelete}>Xóa</button>
                            <button className="btn btn-secondary m-2" data-bs-dismiss="modal">Hủy</button>
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
                  <p className="mb-0">Copyright 2025 © Clean Food Shop theme by pixelstrap</p>
                </div>
              </div>
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Taxes;
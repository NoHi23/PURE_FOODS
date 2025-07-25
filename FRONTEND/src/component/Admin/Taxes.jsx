
import React, { useEffect, useState } from 'react';
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
    status: 1,
  });
  const [taxToDelete, setTaxToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentTaxes = taxes.slice(startIndex, endIndex);
  const totalPages = Math.ceil(taxes.length / itemsPerPage);

  useEffect(() => {
    const fetchTaxes = async () => {
      try {
        const res = await axios.get("http://localhost:8082/PureFoods/api/tax/getAll");
        setTaxes(res.data.taxList || []);
      } catch (err) {
        toast.error("Lỗi khi tải danh sách thuế!");
        console.error("Fetch error:", err);
      }
    };
    fetchTaxes();
  }, []);

  useEffect(() => {
    const tableId = '#tax_table';
    if (taxes.length > 0) {
      if ($.fn.DataTable.isDataTable(tableId)) {
        $(tableId).DataTable().destroy();
      }
      $(tableId).DataTable({
        paging: false,
        ordering: false,
        info: false,
        responsive: true,
      });
    }
  }, [taxes]);

  useEffect(() => {
    const sidebarLinks = document.querySelectorAll('.sidebar-link');
    const handleClick = (e) => {
      const nextEl = e.currentTarget.nextElementSibling;
      if (nextEl?.classList.contains('sidebar-submenu')) {
        e.preventDefault();
        nextEl.classList.toggle('show');
      }
    };
    sidebarLinks.forEach(link => link.addEventListener('click', handleClick));
    return () => sidebarLinks.forEach(link => link.removeEventListener('click', handleClick));
  }, []);

  const handleView = (tax) => {
    setSelectedTax(tax);
    new bootstrap.Modal(document.getElementById('viewModal')).show();
  };

  const handleEditClick = (tax) => {
    setEditTax({
      taxID: tax.taxID,
      taxName: tax.taxName,
      taxRate: tax.taxRate,
      description: tax.description || '',
      effectiveDate: tax.effectiveDate.split('T')[0],
      status: tax.status,
    });
    new bootstrap.Modal(document.getElementById('editModal')).show();
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
      toast.error("Vui lòng nhập đầy đủ thông tin!");
      return;
    }
    const payload = {
      taxID: editTax.taxID,
      taxName: editTax.taxName,
      taxRate: parseFloat(editTax.taxRate),
      description: editTax.description || null,
      effectiveDate: editTax.effectiveDate,
      status: editTax.status,
    };
    try {
      // Try PUT request first
      await axios({
        method: 'put',
        url: `http://localhost:8082/PureFoods/api/tax/update/${editTax.taxID}`,
        data: payload,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });
      setTaxes(taxes.map(t => t.taxID === editTax.taxID ? { ...t, ...payload } : t));
      bootstrap.Modal.getInstance(document.getElementById('editModal')).hide();
      toast.success("Cập nhật thuế thành công!");
    } catch (putErr) {
      if (putErr.response?.status === 405) {
        console.warn("PUT method not supported, falling back to POST...");
        try {
          // Fallback to POST request
          await axios({
            method: 'post',
            url: `http://localhost:8082/PureFoods/api/tax/update/${editTax.taxID}`,
            data: payload,
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
          });
          setTaxes(taxes.map(t => t.taxID === editTax.taxID ? { ...t, ...payload } : t));
          bootstrap.Modal.getInstance(document.getElementById('editModal')).hide();
          toast.success("Cập nhật thuế thành công (POST fallback)!");
        } catch (postErr) {
          const errorMessage = postErr.response?.data?.message || postErr.message || "Lỗi khi cập nhật thuế!";
          toast.error(errorMessage);
          console.error("POST fallback error:", postErr);
        }
      } else {
        const errorMessage = putErr.response?.data?.message || putErr.message || "Lỗi khi cập nhật thuế!";
        toast.error(errorMessage);
        console.error("PUT error:", putErr);
      }
    }
  };

  const handleDeleteTax = async () => {
    if (!taxToDelete) return;
    try {
      await axios.delete(`http://localhost:8082/PureFoods/api/tax/delete/${taxToDelete.taxID}`);
      setTaxes(taxes.filter(t => t.taxID !== taxToDelete.taxID));
      toast.success("Xóa thuế thành công!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Lỗi khi xóa thuế!");
      console.error("Delete error:", err);
    }
  };

  return (
    <div className="page-wrapper compact-wrapper">
      <TopBar />
      <div className="page-body-wrapper">
        <SideBar />
        <div className="page-body">
          <div className="container-fluid">
            <div className="card card-table">
              <div className="card-body">
                <div className="title-header option-title">
                  <h5>Danh sách thuế</h5>
                  <Link to="/admin-add-new-tax" className="btn btn-theme d-flex align-items-center">
                    <i data-feather="plus"></i>Thêm mới thuế
                  </Link>
                </div>
                <div className="table-responsive">
                  <table className="table all-package theme-table" id="tax_table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Tên</th>
                        <th>Thuế suất (%)</th>
                        <th>Mô tả</th>
                        <th>Ngày hiệu lực</th>
                        <th>Trạng thái</th>
                        <th>Tùy chọn</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentTaxes.map((t, i) => (
                        <tr key={i}>
                          <td className="text-center">#00{t.taxID}</td>
                          <td>{t.taxName}</td>
                          <td>{t.taxRate}</td>
                          <td>{t.description || '-'}</td>
                          <td>{new Date(t.effectiveDate).toLocaleDateString()}</td>
                          <td className={t.status === 1 ? "status-success" : "status-danger"}>
                            {t.status === 1 ? "Hoạt động" : "Không hoạt động"}
                          </td>
                          <td>
                            <ul className="d-flex gap-2 list-unstyled">
                              <li><a href="#" onClick={(e) => { e.preventDefault(); handleView(t); }}><i className="ri-eye-line"></i></a></li>
                              <li><a href="#" onClick={() => handleEditClick(t)}><i className="ri-pencil-line"></i></a></li>
                              <li><a href="#" data-bs-toggle="modal" data-bs-target="#deleteModal" onClick={() => setTaxToDelete(t)}><i className="ri-delete-bin-line"></i></a></li>
                            </ul>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="pagination-container d-flex justify-content-center mt-3">
                    <nav>
                      <ul className="pagination">
                        <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                          <button className="page-link" onClick={() => setCurrentPage(currentPage - 1)}>Previous</button>
                        </li>
                        {[...Array(totalPages)].map((_, i) => (
                          <li key={i} className={`page-item ${currentPage === i + 1 ? "active" : ""}`}>
                            <button className="page-link" onClick={() => setCurrentPage(i + 1)}>{i + 1}</button>
                          </li>
                        ))}
                        <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                          <button className="page-link" onClick={() => setCurrentPage(currentPage + 1)}>Next</button>
                        </li>
                      </ul>
                    </nav>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <footer className="footer container-fluid">
            <div className="row">
              <div className="col-md-12 footer-copyright text-center">
                <p className="mb-0">Copyright 2025 © Clean Food Shop theme by pixelstrap</p>
              </div>
            </div>
          </footer>
        </div>
      </div>

      <div className="modal fade" id="viewModal" tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" style={{ fontWeight: 600 }}>Chi tiết thuế</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body">
              {selectedTax && (
                <div className="row">
                  <div className="col-md-8">
                    <h4 style={{ fontWeight: 700 }}>Tên: {selectedTax.taxName}</h4>
                    <p><strong>ID:</strong> {selectedTax.taxID}</p>
                    <p><strong>Mức thuế:</strong> {selectedTax.taxRate}%</p>
                    <p><strong>Mô tả:</strong> {selectedTax.description || '-'}</p>
                    <p><strong>Ngày hiệu lực:</strong> {new Date(selectedTax.effectiveDate).toLocaleDateString()}</p>
                    <p><strong>Trạng thái:</strong> {selectedTax.status === 1 ? "Hoạt động" : "Không hoạt động"}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="modal fade" id="editModal" tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Chỉnh sửa thuế</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleUpdateTax}>
                <div className="mb-3">
                  <label className="form-label">Tên</label>
                  <input type="text" className="form-control" name="taxName" value={editTax.taxName} onChange={handleInputChange} required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Thuế suất (%)</label>
                  <input type="number" step="0.01" className="form-control" name="taxRate" value={editTax.taxRate} onChange={handleInputChange} required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Mô tả</label>
                  <textarea className="form-control" name="description" value={editTax.description} onChange={handleInputChange} />
                </div>
                <div className="mb-3">
                  <label className="form-label">Ngày hiệu lực</label>
                  <input type="date" className="form-control" name="effectiveDate" value={editTax.effectiveDate} onChange={handleInputChange} required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Trạng thái</label>
                  <select className="form-control" name="status" value={editTax.status} onChange={handleInputChange}>
                    <option value={0}>Không hoạt động</option>
                    <option value={1}>Hoạt động</option>
                  </select>
                </div>
                <div className="text-end">
                  <button type="button" className="btn btn-secondary me-2" data-bs-dismiss="modal">Đóng</button>
                  <button type="submit" className="btn btn-animation">Lưu thay đổi</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div className="modal fade theme-modal" id="deleteModal" tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header text-center">
              <h5 className="modal-title w-100">Bạn đã chắc chắn chưa?</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal">
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-body">
              <p>Bạn sẽ xóa thuế này khỏi hệ thống. Hành động này không thể hoàn tác.</p>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-animation btn-md fw-bold" data-bs-dismiss="modal">Hủy</button>
              <button type="button" className="btn btn-animation btn-md fw-bold" data-bs-dismiss="modal" onClick={handleDeleteTax}>Xóa</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Taxes;

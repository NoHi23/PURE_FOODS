import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FiSearch, FiRefreshCw } from "react-icons/fi";
import Pagination from "../../layouts/Pagination";
import * as bootstrap from "bootstrap";

const DriverManagement = ({ currentPage, setCurrentPage }) => {
  const [drivers, setDrivers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [newDriver, setNewDriver] = useState({
    driverName: "",
    vehicleNumber: "",
    phone: "",
    email: "",
    status: 0,
  });
  const [editDriver, setEditDriver] = useState(null);
  const modalRef = useRef(null);

  const filteredDrivers = drivers.filter(
    (d) =>
      d.driverName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.vehicleNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.phone?.includes(searchTerm) ||
      (d.status === 0 ? "đang hoạt động" : "ngừng hoạt động").includes(searchTerm.toLowerCase())
  );

  const driversPerPage = 7;
  const totalPages = Math.ceil(filteredDrivers.length / driversPerPage);
  const indexOfLast = currentPage * driversPerPage;
  const indexOfFirst = indexOfLast - driversPerPage;
  const currentDrivers = filteredDrivers.slice(indexOfFirst, indexOfLast);

  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const response = await axios.get("http://localhost:8082/PureFoods/api/drivers");
        setDrivers(response.data || []);
      } catch (err) {
        toast.error("Lỗi khi lấy danh sách tài xế: " + (err.response?.data?.message || err.message));
      }
    };
    fetchDrivers();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewDriver((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditDriver((prev) => ({ ...prev, [name]: value }));
  };

const validateInput = (driver) => {
    if (!driver.driverName || !driver.vehicleNumber || !driver.phone) {
      toast.error("Vui lòng điền đầy đủ thông tin tài xế!");
      return false;
    }
    if (!/^\d{10}$/.test(driver.phone)) {
      toast.error("Số điện thoại phải có 10 chữ số!");
      return false;
    }
    if (driver.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(driver.email)) {
      toast.error("Email không đúng định dạng!");
      return false;
    }
    return true;
  };

const handleCreateDriver = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    if (!validateInput(newDriver)) {
      setIsLoading(false);
      return;
    }
    try {
      const response = await axios.post("http://localhost:8082/PureFoods/api/drivers", newDriver);
      setDrivers([...drivers, response.data]);
      const modal = bootstrap.Modal.getInstance(modalRef.current);
      modal.hide();
      setNewDriver({ driverName: "", vehicleNumber: "", phone: "", email: "", status: 0 });
      toast.success("Tạo tài xế thành công!");
    } catch (err) {
      toast.error("Tạo tài xế thất bại: " + (err.response?.data || err.message));
    } finally {
      setIsLoading(false);
    }
  };

const handleUpdateDriver = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    if (!validateInput(editDriver)) {
      setIsLoading(false);
      return;
    }
    try {
      const response = await axios.put(`http://localhost:8082/PureFoods/api/drivers/${editDriver.driverId}`, editDriver);
      setDrivers(drivers.map((d) => (d.driverId === editDriver.driverId ? response.data : d)));
      const modal = bootstrap.Modal.getInstance(modalRef.current);
      modal.hide();
      setEditDriver(null);
      toast.success("Cập nhật tài xế thành công!");
    } catch (err) {
      toast.error("Cập nhật tài xế thất bại: " + (err.response?.data || err.message));
    } finally {
      setIsLoading(false);
    }
  };
  const handleDeleteDriver = async (driverId) => {
    if (window.confirm("Bạn có chắc muốn xóa tài xế này?")) {
      try {
        await axios.delete(`http://localhost:8082/PureFoods/api/drivers/${driverId}`);
        setDrivers(drivers.filter((d) => d.driverId !== driverId));
        toast.success("Xóa tài xế thành công!");
      } catch (err) {
        toast.error("Xóa tài xế thất bại: " + (err.response?.data?.message || err.message));
      }
    }
  };

  const handleRefresh = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get("http://localhost:8082/PureFoods/api/drivers");
      setDrivers(response.data || []);
      toast.success("Danh sách tài xế đã được làm mới!");
    } catch (err) {
      toast.error("Làm mới thất bại: " + (err.response?.data?.message || err.message));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="driver-management-tab">
      <div className="title">
        <h2>Quản lý tài xế</h2>
        <span className="title-leaf">
          <svg className="icon-width bg-gray">
            <use href="../assets/svg/leaf.svg#leaf"></use>
          </svg>
        </span>
        <p style={{ color: "#f98050", marginTop: "5px", fontFamily: "Inconsolata, monospace" }}>
          (*) Đảm bảo thông tin tài xế chính xác để quản lý giao hàng hiệu quả.
        </p>
      </div>
      <div className="position-relative mb-4">
        <input
          type="text"
          className="form-control pe-5"
          placeholder="Nhập tên, số điện thoại hoặc thông tin xe..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
        />
        <FiSearch
          style={{
            position: "absolute",
            right: "15px",
            top: "50%",
            transform: "translateY(-50%)",
            color: "#aaa",
            pointerEvents: "none",
          }}
          size={18}
        />
      </div>
      <div className="d-flex justify-content-between mb-4">
        <button
          className="btn theme-bg-color btn-md fw-bold text-white"
          data-bs-toggle="modal"
          data-bs-target="#addDriverModal"
          onClick={() => setNewDriver({ driverName: "", vehicleInfo: "", phone: "", status: 0 })}
        >
          Thêm tài xế
        </button>
        <button
          className="btn btn-md fw-bold text-white d-flex align-items-center"
          onClick={handleRefresh}
          disabled={isLoading}
          style={{
            backgroundColor: "#007bff",
            border: "1px solid #007bff",
            transition: "all 0.3s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#0056b3";
            e.currentTarget.style.borderColor = "#0056b3";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "#007bff";
            e.currentTarget.style.borderColor = "#007bff";
          }}
        >
          <FiRefreshCw className={`me-1 ${isLoading ? "fa-spin" : ""}`} style={{ transition: "transform 0.3s" }} />
          {isLoading ? "Đang làm mới..." : "Làm mới"}
        </button>
      </div>

      <div
        className="modal fade"
        id="addDriverModal"
        tabIndex="-1"
        aria-labelledby="addDriverModalLabel"
        aria-hidden="true"
        ref={modalRef}
      >
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="addDriverModalLabel">
                {editDriver ? "Chỉnh sửa tài xế" : "Thêm tài xế mới"}
              </h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <form onSubmit={editDriver ? handleUpdateDriver : handleCreateDriver}>
                <div className="mb-3">
                  <label className="form-label">Tên tài xế</label>
                  <input
                    type="text"
                    className="form-control"
                    name="driverName"
                    value={editDriver ? editDriver.driverName : newDriver.driverName}
                    onChange={editDriver ? handleEditInputChange : handleInputChange}
                    required
                    disabled={isLoading}
                  />
                </div>
               <div className="mb-3">
    <label className="form-label">Thông tin xe</label>
    <input
      type="text"
      className="form-control"
      name="vehicleNumber"
      value={editDriver ? editDriver.vehicleNumber : newDriver.vehicleNumber}
      onChange={editDriver ? handleEditInputChange : handleInputChange}
      required
      disabled={isLoading}
    />
  </div>
  
  <div className="mb-3">
    <label className="form-label">Email</label>
    <input
      type="email"
      className="form-control"
      name="email"
      value={editDriver ? editDriver.email : newDriver.email}
      onChange={editDriver ? handleEditInputChange : handleInputChange}
      disabled={isLoading}
    />
  </div>
                <div className="mb-3">
                  <label className="form-label">Số điện thoại</label>
                  <input
                    type="tel"
                    className="form-control"
                    name="phone"
                    value={editDriver ? editDriver.phone : newDriver.phone}
                    onChange={editDriver ? handleEditInputChange : handleInputChange}
                    required
                    maxLength="10"
                    disabled={isLoading}
                  />
                </div>
                
                <div className="mb-3">
                  <label className="form-label">Trạng thái</label>
                  <select
                    className="form-control"
                    name="status"
                    value={editDriver ? editDriver.status : newDriver.status}
                    onChange={editDriver ? handleEditInputChange : handleInputChange}
                    disabled={isLoading}
                  >
                    <option value={0}>Đang hoạt động</option>
                    <option value={1}>Ngừng hoạt động</option>
                  </select>
                </div>
                <div className="d-flex justify-content-end gap-2 mt-3">
                  <button
                    type="submit"
                    className="btn theme-bg-color btn-md fw-bold text-white"
                    disabled={isLoading}
                  >
                    {isLoading ? "Đang xử lý..." : editDriver ? "Cập nhật" : "Tạo tài xế"}
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary btn-md fw-bold"
                    data-bs-dismiss="modal"
                    disabled={isLoading}
                  >
                    Hủy
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div className="table-responsive dashboard-bg-box">
        <table className="table product-table">
          <thead>
            <tr>
              <th scope="col">Tên tài xế</th>
              <th scope="col">Thông tin xe</th>
              <th scope="col">Biển số xe</th>
              <th scope="col">Số điện thoại</th>
              <th scope="col">Trạng thái</th>
              <th scope="col">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {currentDrivers.length > 0 ? (
              currentDrivers.map((driver) => (
                <tr key={driver.driverId}>
                  <td>
                    <h6>{driver.driverName}</h6>
                  </td>
                  <td>
                    <h6>{driver.vehicleInfo}</h6>
                  </td>
                  <td><h6>{driver.vehicleNumber}</h6></td>
                  <td>
                    <h6>{driver.phone}</h6>
                  </td>
                  <td>
                    <span
                      className={`badge ${driver.status === 0 ? "bg-success" : "bg-secondary"}`}
                      style={{ fontSize: "0.8rem" }}
                    >
                      {driver.status === 0 ? "Đang hoạt động" : "Ngừng hoạt động"}
                    </span>
                  </td>
                  <td className="edit-delete">
                    <button
                      className="edit"
                      style={{
                        cursor: "pointer",
                        backgroundColor: "#e0f7fa",
                        border: "1px solid #00acc1",
                        padding: "4px 8px",
                        borderRadius: "4px",
                        color: "#007c91",
                        fontWeight: "400",
                      }}
                      onClick={() => {
                        setEditDriver(driver);
                        const modal = new bootstrap.Modal(modalRef.current);
                        modal.show();
                      }}
                    >
                      ✏️
                    </button>
                    <button
                      className="delete ms-2"
                      style={{
                        cursor: "pointer",
                        backgroundColor: "#ffebee",
                        border: "1px solid #e53935",
                        padding: "4px 8px",
                        borderRadius: "4px",
                        color: "#c62828",
                        fontWeight: "400",
                      }}
                      onClick={() => handleDeleteDriver(driver.driverId)}
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center">
                  Không có tài xế nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      </div>
    </div>
  );
};

export default DriverManagement;
import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const ExporterEditProduct = ({ show, onClose, product, onUpdated }) => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [form, setForm] = useState({ ...product });
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);

  useEffect(() => {
    setForm({ ...product });
  }, [product]);

  useEffect(() => {
    const headers = { Authorization: `Bearer ${user.token}` };
    axios
      .get("http://localhost:8082/PureFoods/api/category/getAll", { headers })
      .then((res) => setCategories(res.data.status === 200 ? res.data.listCategory || [] : []))
      .catch(() => setCategories([]));

    axios
      .get("http://localhost:8082/PureFoods/api/supplier/getAll", { headers })
      .then((res) => setSuppliers(res.data.status === 200 ? res.data.suppliers || [] : []))
      .catch(() => setSuppliers([]));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user || user.roleID !== 5) {
      toast.error("Vui lòng đăng nhập với tài khoản Exporter.");
      return;
    }

    const numericFields = ["productId", "categoryId", "supplierId", "stockQuantity", "status", "price"];
    for (const field of numericFields) {
      if (form[field] === undefined || isNaN(form[field])) {
        toast.error(`Trường ${field} phải là số nguyên hoặc số thực hợp lệ!`);
        return;
      }
    }

    try {
      const res = await axios.put(
        "http://localhost:8082/PureFoods/api/product/update",
        { ...form, price: parseFloat(form.price), stockQuantity: parseInt(form.stockQuantity) },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      if (res.data.status === 200) {
        toast.success("Cập nhật sản phẩm thành công!");
        onUpdated();
        onClose();
      } else {
        toast.error(res.data.message || "Có lỗi khi cập nhật");
      }
    } catch (err) {
      toast.error("Lỗi khi cập nhật sản phẩm: " + (err.response?.data?.message || err.message));
    }
  };

  if (!show) return null;

  return (
    <div className="modal show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Chỉnh sửa sản phẩm</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Tên sản phẩm</label>
                <input
                  type="text"
                  className="form-control"
                  name="productName"
                  value={form.productName || ""}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Danh mục</label>
                <select name="categoryId" value={form.categoryId} onChange={handleChange} required className="form-control">
                  <option value="">--Chọn danh mục--</option>
                  {categories.map((c) => (
                    <option key={c.categoryID} value={c.categoryID}>
                      {c.categoryName}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label">Nhà cung cấp</label>
                <select name="supplierId" value={form.supplierId} onChange={handleChange} required className="form-control">
                  <option value="">--Chọn nhà cung cấp--</option>
                  {suppliers.map((s) => (
                    <option key={s.supplierId} value={s.supplierId}>
                      {s.supplierName}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label">Giá</label>
                <input
                  type="number"
                  className="form-control"
                  name="price"
                  value={form.price || 0}
                  onChange={handleChange}
                  required
                  min={0}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Số lượng trong kho</label>
                <input
                  type="number"
                  className="form-control"
                  name="stockQuantity"
                  value={form.stockQuantity || 0}
                  onChange={handleChange}
                  required
                  min={0}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Mô tả</label>
                <textarea
                  className="form-control"
                  name="description"
                  value={form.description || ""}
                  onChange={handleChange}
                ></textarea>
              </div>
              <div className="mb-3">
                <label className="form-label">Ngày thu hoạch</label>
                <input
                  type="date"
                  name="harvestDate"
                  value={form.harvestDate ? new Date(form.harvestDate).toISOString().split('T')[0] : ""}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Ngày hết hạn</label>
                <input
                  type="date"
                  name="expirationDate"
                  value={form.expirationDate ? new Date(form.expirationDate).toISOString().split('T')[0] : ""}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Thông tin dinh dưỡng</label>
                <textarea
                  name="nutritionalInfo"
                  value={form.nutritionalInfo || ""}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Trạng thái</label>
                <select name="status" value={form.status} onChange={handleChange} className="form-control">
                  <option value={0}>Hoạt động (đang bán)</option>
                  <option value={1}>Không hoạt động (ngừng bán)</option>
                </select>
              </div>
              <div className="d-flex justify-content-end">
                <button type="button" className="btn btn-secondary me-2" onClick={onClose}>
                  Hủy
                </button>
                <button type="submit" className="btn btn-primary">
                  Lưu thay đổi
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExporterEditProduct;
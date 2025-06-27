import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const ImporterEditProduct = ({ show, onClose, product, onUpdated }) => {
  const [form, setForm] = useState({ ...product });
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);

  useEffect(() => {
    setForm({ ...product });
  }, [product]);

  useEffect(() => {
    axios
      .get("http://localhost:8082/PureFoods/api/category/getAll")
      .then((res) => setCategories(res.data))
      .catch(() => setCategories([]));

    axios
      .get("http://localhost:8082/PureFoods/api/supplier/getAll")
      .then((res) => setSuppliers(res.data.suppliers || []))
      .catch(() => setSuppliers([]));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put("http://localhost:8082/PureFoods/api/product/update", form);
      if (res.data.status === 200) {
        toast.success("Cập nhật sản phẩm thành công!");
        onUpdated();
        onClose();
      } else {
        toast.error(res.data.message || "Có lỗi khi cập nhật");
      }
    } catch (err) {
      toast.error("Lỗi kết nối khi cập nhật sản phẩm");
    }
  };

  if (!show) return null;

  return (
    <div
      className="modal show d-block"
      tabIndex="-1"
      role="dialog"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
      }}
    >
      <div
        className="modal-dialog modal-lg"
        role="document"
        style={{
          maxWidth: "800px",
          borderRadius: "10px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
          backgroundColor: "#fff",
          padding: "15px",
        }}
      >
        <div
          className="modal-content"
          style={{
            border: "none",
            borderRadius: "10px",
          }}
        >
          <div
            className="modal-header"
            style={{
              borderBottom: "1px solid #e9ecef",
              padding: "15px",
              backgroundColor: "#f8f9fa",
              borderTopLeftRadius: "10px",
              borderTopRightRadius: "10px",
            }}
          >
            <h5
              className="modal-title"
              style={{
                fontSize: "1.5rem",
                fontWeight: "600",
                color: "#333",
              }}
            >
              Chỉnh sửa sản phẩm
            </h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
              style={{
                background: "none",
                border: "none",
                fontSize: "1.5rem",
                color: "#666",
              }}
            ></button>
          </div>
          <div
            className="modal-body"
            style={{
              padding: "20px",
            }}
          >
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label
                  className="form-label"
                  style={{
                    fontWeight: "500",
                    color: "#444",
                    marginBottom: "5px",
                  }}
                >
                  Tên sản phẩm
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="productName"
                  value={form.productName || ""}
                  onChange={handleChange}
                  required
                  style={{
                    borderRadius: "5px",
                    border: "1px solid #ced4da",
                    padding: "8px 12px",
                    fontSize: "1rem",
                  }}
                />
              </div>
              <div className="mb-3">
                <label
                  style={{
                    fontWeight: "500",
                    color: "#444",
                    marginBottom: "5px",
                  }}
                >
                  Danh mục
                </label>
                <select
                  name="categoryId"
                  value={form.categoryId}
                  onChange={handleChange}
                  required
                  style={{
                    width: "100%",
                    borderRadius: "5px",
                    border: "1px solid #ced4da",
                    padding: "8px 12px",
                    fontSize: "1rem",
                    backgroundColor: "#fff",
                  }}
                >
                  <option value="">--Chọn danh mục--</option>
                  {categories.map((c) => (
                    <option key={c.categoryID} value={c.categoryID}>
                      {c.categoryName}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-3">
                <label
                  style={{
                    fontWeight: "500",
                    color: "#444",
                    marginBottom: "5px",
                  }}
                >
                  Nhà cung cấp
                </label>
                <select
                  name="supplierId"
                  value={form.supplierId}
                  onChange={handleChange}
                  required
                  style={{
                    width: "100%",
                    borderRadius: "5px",
                    border: "1px solid #ced4da",
                    padding: "8px 12px",
                    fontSize: "1rem",
                    backgroundColor: "#fff",
                  }}
                >
                  <option value="">--Chọn nhà cung cấp--</option>
                  {suppliers.map((s) => (
                    <option key={s.supplierId} value={s.supplierId}>
                      {s.supplierName}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-3">
                <label
                  className="form-label"
                  style={{
                    fontWeight: "500",
                    color: "#444",
                    marginBottom: "5px",
                  }}
                >
                  Giá
                </label>
                <input
                  type="number"
                  className="form-control"
                  name="price"
                  value={form.price || 0}
                  onChange={handleChange}
                  required
                  min={0}
                  style={{
                    borderRadius: "5px",
                    border: "1px solid #ced4da",
                    padding: "8px 12px",
                    fontSize: "1rem",
                  }}
                />
              </div>
              <div className="mb-3">
                <label
                  className="form-label"
                  style={{
                    fontWeight: "500",
                    color: "#444",
                    marginBottom: "5px",
                  }}
                >
                  Số lượng trong kho
                </label>
                <input
                  type="number"
                  className="form-control"
                  name="stockQuantity"
                  value={form.stockQuantity || 0}
                  onChange={handleChange}
                  required
                  min={0}
                  style={{
                    borderRadius: "5px",
                    border: "1px solid #ced4da",
                    padding: "8px 12px",
                    fontSize: "1rem",
                  }}
                />
              </div>
              <div className="mb-3">
                <label
                  className="form-label"
                  style={{
                    fontWeight: "500",
                    color: "#444",
                    marginBottom: "5px",
                  }}
                >
                  Mô tả
                </label>
                <textarea
                  className="form-control"
                  name="description"
                  value={form.description || ""}
                  onChange={handleChange}
                  style={{
                    borderRadius: "5px",
                    border: "1px solid #ced4da",
                    padding: "8px 12px",
                    fontSize: "1rem",
                    minHeight: "100px",
                  }}
                ></textarea>
              </div>
              <div className="mb-3">
                <label
                  className="form-label"
                  style={{
                    fontWeight: "500",
                    color: "#444",
                    marginBottom: "5px",
                  }}
                >
                  Đường dẫn ảnh
                </label>
                <input
                  type="text"
                  className="form-control"
                  name="imageURL"
                  value={form.imageURL || ""}
                  onChange={handleChange}
                  style={{
                    borderRadius: "5px",
                    border: "1px solid #ced4da",
                    padding: "8px 12px",
                    fontSize: "1rem",
                  }}
                />
              </div>
              {form.imageURL && (
                <div className="mb-3">
                  <img
                    src={form.imageURL}
                    alt="Preview"
                    style={{
                      maxWidth: "100%",
                      maxHeight: "200px",
                      borderRadius: "5px",
                      border: "1px solid #ccc",
                      objectFit: "contain",
                    }}
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/150?text=No+Image";
                    }}
                  />
                </div>
              )}
              <div className="mb-3">
                <label
                  style={{
                    fontWeight: "500",
                    color: "#444",
                    marginBottom: "5px",
                  }}
                >
                  Ngày thu hoạch
                </label>
                <input
                  type="date"
                  name="harvestDate"
                  value={form.harvestDate || ""}
                  onChange={handleChange}
                  style={{
                    width: "100%",
                    borderRadius: "5px",
                    border: "1px solid #ced4da",
                    padding: "8px 12px",
                    fontSize: "1rem",
                  }}
                />
              </div>
              <div className="mb-3">
                <label
                  style={{
                    fontWeight: "500",
                    color: "#444",
                    marginBottom: "5px",
                  }}
                >
                  Ngày hết hạn
                </label>
                <input
                  type="date"
                  name="expirationDate"
                  value={form.expirationDate || ""}
                  onChange={handleChange}
                  style={{
                    width: "100%",
                    borderRadius: "5px",
                    border: "1px solid #ced4da",
                    padding: "8px 12px",
                    fontSize: "1rem",
                  }}
                />
              </div>
              <div className="mb-3">
                <label
                  style={{
                    fontWeight: "500",
                    color: "#444",
                    marginBottom: "5px",
                  }}
                >
                  Thông tin dinh dưỡng
                </label>
                <textarea
                  name="nutritionalInfo"
                  value={form.nutritionalInfo}
                  onChange={handleChange}
                  style={{
                    width: "100%",
                    borderRadius: "5px",
                    border: "1px solid #ced4da",
                    padding: "8px 12px",
                    fontSize: "1rem",
                    minHeight: "100px",
                  }}
                />
              </div>
              <div className="mb-3">
                <label
                  style={{
                    fontWeight: "500",
                    color: "#444",
                    marginBottom: "5px",
                  }}
                >
                  Trạng thái
                </label>
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  style={{
                    width: "100%",
                    borderRadius: "5px",
                    border: "1px solid #ced4da",
                    padding: "8px 12px",
                    fontSize: "1rem",
                    backgroundColor: "#fff",
                  }}
                >
                  <option value={1}>Hoạt động</option>
                  <option value={0}>Không hoạt động</option>
                </select>
              </div>
              <div className="d-flex justify-content-end">
                <button
                  type="button"
                  className="btn btn-secondary me-2"
                  onClick={onClose}
                  style={{
                    padding: "8px 20px",
                    borderRadius: "5px",
                    backgroundColor: "#6c757d",
                    color: "#fff",
                    border: "none",
                    fontSize: "1rem",
                  }}
                >
                  Huỷ
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{
                    padding: "8px 20px",
                    borderRadius: "5px",
                    backgroundColor: "#007bff",
                    color: "#fff",
                    border: "none",
                    fontSize: "1rem",
                  }}
                >
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

export default ImporterEditProduct;

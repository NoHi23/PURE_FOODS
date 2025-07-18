import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const TraderInventoryManager = ({ user }) => {
  const [inventory, setInventory] = useState([]);
  const [newProductName, setNewProductName] = useState("");
  const [price, setPrice] = useState("");
  const [initialStock, setInitialStock] = useState("");
  const [warehouseLocation, setWarehouseLocation] = useState("");
  const [isCreatingNew, setIsCreatingNew] = useState(false);

  const fetchInventory = useCallback(async () => {
    try {
      const res = await axios.get(
        `http://localhost:8082/PureFoods/api/trader/inventory?userId=${user.userId}`
      );
      setInventory(res.data?.data || []);
    } catch (err) {
      toast.error("❌ Lỗi khi tải tồn kho");
    }
  }, [user.userId]);

  useEffect(() => {
    fetchInventory();
  }, [fetchInventory]);

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    if (!newProductName || !price || !initialStock || !warehouseLocation || initialStock <= 0) {
      toast.warning("Vui lòng điền đầy đủ thông tin và số lượng hợp lệ");
      return;
    }

    try {
      await axios.post(
        `http://localhost:8082/PureFoods/api/trader/inventory/create-product?userId=${user.userId}&productName=${encodeURIComponent(newProductName)}&price=${price}&initialStockQuantity=${initialStock}&warehouseLocation=${encodeURIComponent(warehouseLocation)}`
      );
      toast.success("✅ Tạo mặt hàng mới thành công!");
      setNewProductName("");
      setPrice("");
      setInitialStock("");
      setWarehouseLocation("");
      setIsCreatingNew(false);
      fetchInventory(); // Cập nhật danh sách sau khi tạo
    } catch (err) {
      toast.error("❌ Lỗi khi tạo mặt hàng: " + (err.response?.data?.message || ""));
    }
  };

  const totalStock = inventory.reduce((sum, item) => sum + item.currentStockQuantity, 0);

  return (
    <div className="container mt-4">
      <h2>Quản lý kho của Trader</h2>

      {/* Nút chuyển đổi chế độ tạo mặt hàng mới */}
      <button
        className="btn btn-primary mb-3"
        onClick={() => setIsCreatingNew(!isCreatingNew)}
      >
        {isCreatingNew ? "Ẩn form tạo mặt hàng" : "Tạo mặt hàng mới"}
      </button>

      {/* Form tạo mặt hàng mới */}
      {isCreatingNew && (
        <div className="card p-4 mb-4">
          <h4>Thêm mặt hàng mới</h4>
          <form onSubmit={handleCreateProduct}>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Tên sản phẩm</label>
                <input
                  type="text"
                  className="form-control"
                  value={newProductName}
                  onChange={(e) => setNewProductName(e.target.value)}
                  placeholder="Nhập tên sản phẩm"
                  required
                />
              </div>
              <div className="col-md-3">
                <label className="form-label">Giá</label>
                <input
                  type="number"
                  className="form-control"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="Nhập giá"
                  step="0.01"
                  min="0"
                  required
                />
              </div>
              <div className="col-md-3">
                <label className="form-label">Số lượng ban đầu</label>
                <input
                  type="number"
                  className="form-control"
                  value={initialStock}
                  onChange={(e) => setInitialStock(e.target.value)}
                  placeholder="Nhập số lượng"
                  min="1"
                  required
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Địa điểm kho</label>
                <input
                  type="text"
                  className="form-control"
                  value={warehouseLocation}
                  onChange={(e) => setWarehouseLocation(e.target.value)}
                  placeholder="Nhập địa điểm kho"
                  required
                />
              </div>
              <div className="col-md-2 d-flex align-items-end">
                <button type="submit" className="btn btn-success w-100">
                  ✅ Tạo mặt hàng
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Hiển thị tồn kho */}
      <div className="card p-4">
        <h4>Tồn kho hiện tại</h4>
        {inventory.length === 0 ? (
          <p className="text-muted">Chưa có mặt hàng trong kho.</p>
        ) : (
          <div className="table-responsive">
            <table className="table table-bordered align-middle">
              <thead className="table-light">
                <tr>
                  <th>Mã sản phẩm</th>
                  <th>Tên sản phẩm</th>
                  <th>Số lượng còn lại</th>
                </tr>
              </thead>
              <tbody>
                {inventory.map((item) => (
                  <tr key={item.traderProductId}>
                    <td>{item.traderProductId}</td>
                    <td>{item.productName}</td>
                    <td>{item.currentStockQuantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-3">
              <strong>Tổng tồn kho:</strong> {totalStock} đơn vị
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TraderInventoryManager;
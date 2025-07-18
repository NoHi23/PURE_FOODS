import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const TraderInventoryCreate = ({ traderId, onInventoryChange }) => {
  const [products, setProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [quantity, setQuantity] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`http://localhost:8082/PureFoods/api/trader/inventory?userId=${traderId}`);
        setProducts(res.data.data || []); // Sử dụng data từ getCurrentStock
      } catch (error) {
        toast.error("Lỗi khi tải sản phẩm");
      }
    };

    fetchProducts();
  }, [traderId]);

  const handleCreate = async () => {
    if (!selectedProductId || !quantity || quantity <= 0) {
      toast.warning("Vui lòng chọn sản phẩm và nhập số lượng hợp lệ");
      return;
    }

    try {
      await axios.post(`http://localhost:8082/PureFoods/api/trader/inventory/import?userId=${traderId}&productId=${selectedProductId}&quantityChange=${quantity}`);
      toast.success("Nhập kho thành công!");
      setSelectedProductId("");
      setQuantity("");
      if (onInventoryChange) onInventoryChange(); // Callback cập nhật bảng tồn kho
    } catch (error) {
      toast.error("Lỗi khi nhập kho");
    }
  };

  return (
    <div className="card p-4">
      <h4 className="mb-3">➕ Nhập kho mới</h4>

      <div className="row g-3">
        <div className="col-md-6">
          <label className="form-label">Chọn sản phẩm</label>
          <select
            className="form-select"
            value={selectedProductId}
            onChange={(e) => setSelectedProductId(e.target.value)}
          >
            <option value="" disabled>-- Chọn sản phẩm --</option>
            {products.map((p) => (
              <option key={p.traderProductId} value={p.traderProductId}>
                {p.productName}
              </option>
            ))}
          </select>
        </div>

        <div className="col-md-4">
          <label className="form-label">Số lượng</label>
          <input
            type="number"
            className="form-control"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="Nhập số lượng"
            min={1}
          />
        </div>

        <div className="col-md-2 d-flex align-items-end">
          <button className="btn btn-primary w-100" onClick={handleCreate}>
            ✅ Nhập kho
          </button>
        </div>
      </div>
    </div>
  );
};

export default TraderInventoryCreate;
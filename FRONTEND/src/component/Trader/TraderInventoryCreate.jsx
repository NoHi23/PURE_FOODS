import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Pagination from "../TraderLayout/Pagination";

const TraderInventoryCreate = ({ traderId, onInventoryChange }) => {
  const [products, setProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [newProductName, setNewProductName] = useState("");
  const [price, setPrice] = useState("");
  const [initialStock, setInitialStock] = useState("");
  const [warehouseLocation, setWarehouseLocation] = useState("");
  const [imageURL, setImageURL] = useState("");
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("addStock");
  const [editingProduct, setEditingProduct] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
const [itemsPerPage] = useState(5); // Bạn có thể thay đổi số lượng sản phẩm mỗi trang



  useEffect(() => {
    fetchProducts();
  }, [traderId]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `http://localhost:8082/PureFoods/api/trader/inventory?userId=${traderId}`
      );
      setProducts(res.data?.data || []);
    } catch (error) {
      toast.error("Lỗi khi tải sản phẩm: " + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const openModal = (mode, product = null) => {
    setModalMode(mode);
    setShowModal(true);
    if (mode === "updateProduct" && product) {
      setEditingProduct(product);
      setNewProductName(product.productName);
      setPrice(product.price ? product.price.toString() : "");
      setWarehouseLocation(product.warehouseLocation || "");
      setImageURL(product.imageURL || "");
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedProductId("");
    setQuantity("");
    setNewProductName("");
    setPrice("");
    setInitialStock("");
    setWarehouseLocation("");
    setImageURL("");
    setEditingProduct(null);
  };

  const handleCreate = async () => {
    if (loading) return;
    setLoading(true);
    try {
      let response;
      if (modalMode === "addStock") {
        if (!selectedProductId || !quantity || quantity <= 0) {
          toast.warning("Vui lòng nhập số lượng hợp lệ và chọn sản phẩm");
          return;
        }
        response = await axios.post(
          `http://localhost:8082/PureFoods/api/trader/inventory/add-stock?userId=${traderId}&productId=${selectedProductId}&quantityToAdd=${quantity}`
        );
        toast.success("Thêm hàng thành công!");
      } else if (modalMode === "createProduct") {
        if (!newProductName || !price || !initialStock || !warehouseLocation) {
          toast.warning("Vui lòng nhập đầy đủ thông tin sản phẩm mới");
          return;
        }
        response = await axios.post(
          `http://localhost:8082/PureFoods/api/trader/inventory/create-product?userId=${traderId}&productName=${encodeURIComponent(
            newProductName
          )}&price=${price}&initialStockQuantity=${initialStock}&warehouseLocation=${encodeURIComponent(
            warehouseLocation
          )}&imageURL=${encodeURIComponent(imageURL || "")}`
        );
        toast.success("Tạo sản phẩm mới thành công!");
      } else if (modalMode === "updateProduct") {
        if (!editingProduct || !newProductName || !price || !warehouseLocation) {
          toast.warning("Vui lòng nhập đầy đủ thông tin cập nhật");
          return;
        }
        response = await axios.put(
          `http://localhost:8082/PureFoods/api/trader/inventory/update-product?userId=${traderId}&productId=${editingProduct.traderProductId}&productName=${encodeURIComponent(
            newProductName
          )}&price=${price}&warehouseLocation=${encodeURIComponent(warehouseLocation)}&imageURL=${encodeURIComponent(
            imageURL || ""
          )}`
        );
        toast.success("Cập nhật sản phẩm thành công!");
      }

      if (onInventoryChange) onInventoryChange();
      await fetchProducts();
      closeModal();
    } catch (error) {
      toast.error("Lỗi: " + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };
  const handleDeleteProduct = async (traderProductId) => {
  if (!window.confirm("Bạn có chắc muốn xoá sản phẩm này không?")) return;
  setLoading(true);
  try {
    await axios.delete(
      `http://localhost:8082/PureFoods/api/trader/inventory/delete-product?userId=${traderId}&traderProductId=${traderProductId}`
    );
    toast.success("Xoá sản phẩm thành công!");
    await fetchProducts();
    if (onInventoryChange) onInventoryChange();
  } catch (error) {
    toast.error("Lỗi khi xoá sản phẩm: " + (error.response?.data?.message || error.message));
  } finally {
    setLoading(false);
  }
};


  const handleToggleStatus = async (traderProductId, currentStatus) => {
    const newStatus = currentStatus === 0 ? 1 : 0;
    try {
      const response = await axios.put(
        `http://localhost:8082/PureFoods/api/trader/inventory/update-status?userId=${traderId}&traderProductId=${traderProductId}&status=${newStatus}`
      );
      toast.success(response.data.message);
      await fetchProducts();
      if (onInventoryChange) onInventoryChange();
    } catch (error) {
      toast.error("Lỗi khi thay đổi trạng thái: " + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div className="card shadow-sm p-4 bg-white">
      <h4 className="mb-4 fw-bold text-primary">📦 Quản lý kho nhà cung cấp</h4>

      <div className="mb-3">
        <button className="btn btn-primary me-2" onClick={() => openModal("addStock")}>
          ➕ Thêm hàng
        </button>
        <button className="btn btn-success" onClick={() => openModal("createProduct")}>
          🆕 Tạo sản phẩm mới
        </button>
      </div>

      {showModal && (
        <div className="modal d-block" style={{ backgroundColor: "rgba(0,0,0,0.6)" }} onClick={closeModal}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {modalMode === "addStock"
                    ? "➕ Thêm hàng"
                    : modalMode === "createProduct"
                    ? "🆕 Tạo sản phẩm mới"
                    : "✏️ Cập nhật sản phẩm"}
                </h5>
                <button className="btn-close" onClick={closeModal}></button>
              </div>
              <div className="modal-body">
                {modalMode === "addStock" && (
                  <>
                    <label className="form-label">Chọn sản phẩm</label>
                    <select
                      className="form-select mb-3"
                      value={selectedProductId}
                      onChange={(e) => setSelectedProductId(e.target.value)}
                    >
                      <option value="">-- Chọn sản phẩm --</option>
                      {products.map((p) => (
                        <option key={p.traderProductId} value={p.traderProductId}>
                          {p.productName} {p.status === 0 ? "(Inactive)" : "(Active)"}
                        </option>
                      ))}
                    </select>
                    <input
                      className="form-control"
                      type="number"
                      placeholder="Số lượng thêm"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      min={1}
                    />
                  </>
                )}

                {(modalMode === "createProduct" || modalMode === "updateProduct") && (
                  <>
                    <input
                      className="form-control mb-2"
                      type="text"
                      placeholder="Tên sản phẩm"
                      value={newProductName}
                      onChange={(e) => setNewProductName(e.target.value)}
                    />
                    <input
                      className="form-control mb-2"
                      type="number"
                      placeholder="Giá sản phẩm"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      step="0.01"
                    />
                    {modalMode === "createProduct" && (
                      <input
                        className="form-control mb-2"
                        type="number"
                        placeholder="Số lượng ban đầu"
                        value={initialStock}
                        onChange={(e) => setInitialStock(e.target.value)}
                        min={0}
                      />
                    )}
                    <input
                      className="form-control mb-2"
                      type="text"
                      placeholder="Địa điểm kho"
                      value={warehouseLocation}
                      onChange={(e) => setWarehouseLocation(e.target.value)}
                    />
                    <input
                      className="form-control"
                      type="text"
                      placeholder="URL hình ảnh (tùy chọn)"
                      value={imageURL}
                      onChange={(e) => setImageURL(e.target.value)}
                    />
                  </>
                )}
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={closeModal}>
                  Hủy
                </button>
                <button className="btn btn-primary" onClick={handleCreate} disabled={loading}>
                  {modalMode === "addStock"
                    ? "✅ Thêm hàng"
                    : modalMode === "createProduct"
                    ? "✅ Tạo sản phẩm"
                    : "✅ Cập nhật"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <hr />

      <h5 className="mb-3">📋 Danh sách sản phẩm trong kho</h5>
      {loading ? (
        <p>Đang tải dữ liệu...</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered align-middle table-hover">
            <thead className="table-light">
              <tr>
                <th>Mã SP</th>
                <th>Tên</th>
                <th>Hình ảnh</th>
                <th className="text-end">Giá (VNĐ)</th>
                <th className="text-end">Tồn kho</th>
                <th className="text-center">Trạng thái</th>
                <th className="text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody>
  {products.map((item) => (
    <tr key={item.traderProductId}>
      <td>{item.traderProductId}</td>
      <td>{item.productName}</td>
      <td>
        <img
          src={item.imageURL || "/assets/images/product-image-placeholder.png"}
          alt={item.productName}
          width={50}
          height={50}
          className="rounded border"
          onError={(e) => (e.target.src = "/assets/images/product-image-placeholder.png")}
        />
      </td>
      <td className="text-end">
        {item.price !== undefined && item.price !== null && !isNaN(parseFloat(item.price))
          ? parseFloat(item.price).toLocaleString("vi-VN") + " ₫"
          : "Chưa có giá"}
      </td>
      <td className="text-end text-success fw-bold">{item.currentStockQuantity}</td>
      <td className="text-center">
        <select
          className={`form-select form-select-sm w-auto mx-auto ${
            item.status === 1 ? "bg-success text-white" : "bg-secondary text-white"
          }`}
          value={item.status}
          onChange={(e) => handleToggleStatus(item.traderProductId, item.status)}
          disabled={loading}
        >
          <option value={1}>Đang bán</option>
          <option value={0}>Ngừng bán</option>
        </select>
      </td>
      {/* 👇 Thêm cột thao tác */}
      <td className="text-center">
        <button
          className="btn btn-sm btn-warning me-2"
          onClick={() => openModal("updateProduct", item)}
          disabled={loading}
        >
          ✏️ Sửa
        </button>
        <button
          className="btn btn-sm btn-danger"
          onClick={() => handleDeleteProduct(item.traderProductId)}
          disabled={loading}
        >
          🗑️ Xoá
        </button>
      </td>
    </tr>
  ))}
  {products.length === 0 && (
    <tr>
      <td colSpan={7} className="text-center text-muted"> {/* Cập nhật colSpan = 7 */}
        Không có sản phẩm nào trong kho.
      </td>
    </tr>
  )}
</tbody>

          </table>
        </div>
      )}
    </div>
  );
};

export default TraderInventoryCreate;

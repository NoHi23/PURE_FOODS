import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FiSearch, FiRefreshCw } from "react-icons/fi";
import Pagination from "../../layouts/Pagination";
import * as bootstrap from "bootstrap";

const ExporterProduct = ({ currentPage, setCurrentPage }) => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [orders, setOrders] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const modalRef = useRef(null);

  const filteredProducts = products.filter(
    (p) =>
      p.productName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.stockQuantity?.toString().includes(searchTerm) ||
      (p.harvestDate ? new Date(p.harvestDate).toLocaleDateString("vi-VN").toLowerCase() : "").includes(searchTerm.toLowerCase()) ||
      (p.expirationDate ? new Date(p.expirationDate).toLocaleDateString("vi-VN").toLowerCase() : "").includes(searchTerm.toLowerCase()) ||
      (p.status === 0 ? "đang bán" : "ngừng bán").includes(searchTerm.toLowerCase())
  );

  const productsPerPage = 7;
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const indexOfLast = currentPage * productsPerPage;
  const indexOfFirst = indexOfLast - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirst, indexOfLast);

  useEffect(() => {
    const fetchData = async () => {
      const exporterId = JSON.parse(localStorage.getItem("user"))?.userID || 1;
      try {
        const [productsRes, ordersRes] = await Promise.all([
          axios.get(`http://localhost:8082/PureFoods/api/products`),
          axios.get(`http://localhost:8082/PureFoods/api/exporters`),
        ]);
        setProducts(productsRes.data.listProduct || []);
        setOrders(ordersRes.data || []);
      } catch (err) {
        toast.error("Lỗi khi lấy dữ liệu: " + (err.response?.data?.message || err.message));
      }
    };
    fetchData();
  }, []);

  const checkStockAvailability = async (productId, quantity) => {
    try {
      const res = await axios.get(`http://localhost:8082/PureFoods/api/exporters/checkStock/${productId}`, {
        params: { quantity },
      });
      return res.data.available;
    } catch (err) {
      toast.error("Lỗi kiểm tra tồn kho: " + (err.response?.data?.message || err.message));
      return false;
    }
  };

  const handleExport = async (productId, quantity, exporterId) => {
    if (!exporterId) {
      toast.error("Vui lòng chọn một đơn hàng!");
      return;
    }
    const isAvailable = await checkStockAvailability(productId, quantity);
    if (!isAvailable) {
      toast.error("Số lượng tồn kho không đủ!");
      await handleNotifyOutOfStock(productId);
      return;
    }
    const exporterUserId = JSON.parse(localStorage.getItem("user"))?.userID || 1;
    try {
      await axios.post(`http://localhost:8082/PureFoods/api/exporters/prepareShipment/${exporterId}`, null, {
        params: { exporterId: exporterUserId, productId, quantity },
      });
      toast.success("Xuất kho thành công!");
      setProducts((prev) =>
        prev.map((p) => (p.productId === productId ? { ...p, stockQuantity: p.stockQuantity - quantity } : p))
      );
      await axios.post(`http://localhost:8082/PureFoods/api/inventoryLogs`, {
        productId,
        userId: exporterUserId,
        quantityChange: -quantity,
        reason: `Xuất kho cho đơn hàng #${exporterId}`,
      });
    } catch (err) {
      toast.error("Xuất kho thất bại: " + (err.response?.data?.message || err.message));
    }
  };

  const handleManageInventory = async (productId, action, quantity) => {
    const exporterId = JSON.parse(localStorage.getItem("user"))?.userID || 1;
    try {
      await axios.put(`http://localhost:8082/PureFoods/api/exporters/updateStock/${exporterId}`, null, {
        params: { productId, quantity, action },
      });
      if (action === "delete") {
        setProducts((prev) => prev.filter((p) => p.productId !== productId));
        toast.success("Xóa sản phẩm thành công!");
      } else if (action === "update") {
        setProducts((prev) =>
          prev.map((p) => (p.productId === productId ? { ...p, stockQuantity: quantity } : p))
        );
        toast.success("Cập nhật số lượng thành công!");
      }
      await axios.post(`http://localhost:8082/PureFoods/api/inventoryLogs`, {
        productId,
        userId: exporterId,
        quantityChange: action === "delete" ? 0 : quantity,
        reason: action === "delete" ? "Xóa sản phẩm" : "Cập nhật số lượng",
      });
    } catch (err) {
      toast.error(`Thao tác thất bại: ${err.response?.data?.message || err.message}`);
    }
  };

  const handleConfirmOrder = async (exporterId) => {
    try {
      await axios.put(`http://localhost:8082/PureFoods/api/exporters/confirmOrder/${exporterId}`);
      toast.success("Xác nhận đơn hàng thành công!");
      setOrders((prev) => prev.map((o) => (o.exporterId === exporterId ? { ...o, statusId: 3 } : o)));
    } catch (err) {
      toast.error("Xác nhận thất bại: " + (err.response?.data?.message || err.message));
    }
  };

  const handleRejectOrder = async (exporterId, reason) => {
    try {
      await axios.put(`http://localhost:8082/PureFoods/api/exporters/rejectOrder/${exporterId}`, null, {
        params: { reason },
      });
      toast.success("Từ chối đơn hàng thành công!");
      setOrders((prev) => prev.map((o) => (o.exporterId === exporterId ? { ...o, statusId: 5, cancelReason: reason } : o)));
      await axios.post(`http://localhost:8082/PureFoods/api/inventoryLogs`, {
        productId: selectedProduct?.productId,
        userId: JSON.parse(localStorage.getItem("user"))?.userID || 1,
        quantityChange: 0,
        reason: `Từ chối đơn hàng #${exporterId}: ${reason}`,
      });
    } catch (err) {
      toast.error("Từ chối thất bại: " + (err.response?.data?.message || err.message));
    }
  };

  const handleNotifyOutOfStock = async (productId) => {
    try {
      await axios.post(`http://localhost:8082/PureFoods/api/notifications`, {
        user_id: JSON.parse(localStorage.getItem("user"))?.userID || 1,
        title: "Hết hàng",
        content: `Sản phẩm #${productId} đã hết hàng trong kho.`,
      });
      toast.success("Gửi thông báo hết hàng thành công!");
    } catch (err) {
      toast.error("Gửi thông báo thất bại: " + (err.response?.data?.message || err.message));
    }
  };

  const handleViewOrderDetails = async (exporterId) => {
    try {
      const res = await axios.get(`http://localhost:8082/PureFoods/api/exporters/${exporterId}`);
      const modal = new bootstrap.Modal(modalRef.current);
      setSelectedProduct(res.data);
      modal.show();
    } catch (err) {
      toast.error("Lỗi xem chi tiết đơn hàng: " + (err.response?.data?.message || err.message));
    }
  };

  const handleUpdateDeliverySchedule = async (exporterId, estimatedDeliveryDate) => {
    if (!exporterId) {
      toast.error("Mã đơn hàng không hợp lệ!");
      return;
    }
    if (!estimatedDeliveryDate) {
      toast.error("Ngày giao dự kiến không được để trống!");
      return;
    }
    try {
      const dateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/;
      if (!dateRegex.test(estimatedDeliveryDate)) {
        toast.error("Ngày giao dự kiến không đúng định dạng (yyyy-MM-dd'T'HH:mm:ss)!");
        return;
      }
      await axios.put(`http://localhost:8082/PureFoods/api/exporters/updateDelivery/${exporterId}`, null, {
        params: { estimatedDeliveryDate },
      });
      toast.success("Cập nhật lịch trình giao hàng thành công!");
      setOrders((prev) =>
        prev.map((o) => (o.exporterId === exporterId ? { ...o, estimatedDeliveryDate } : o))
      );
    } catch (err) {
      toast.error("Cập nhật lịch trình thất bại: " + (err.response?.data?.message || err.message));
    }
  };

  const handleRefresh = async () => {
    setIsLoading(true);
    try {
      const [productsRes, ordersRes] = await Promise.all([
        axios.get(`http://localhost:8082/PureFoods/api/products`),
        axios.get(`http://localhost:8082/PureFoods/api/exporters`),
      ]);
      setProducts(productsRes.data.listProduct || []);
      setOrders(ordersRes.data || []);
      toast.success("Danh sách sản phẩm đã được làm mới!");
    } catch (err) {
      toast.error("Làm mới thất bại: " + (err.response?.data?.message || err.message));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="product-tab">
      <div className="title">
        <h2>Tất cả sản phẩm trong kho</h2>
        <span className="title-leaf">
          <svg className="icon-width bg-gray">
            <use href="../assets/svg/leaf.svg#leaf"></use>
          </svg>
        </span>
        <p style={{ color: "#f98050", marginTop: "5px", fontFamily: "Inconsolata, monospace" }}>
          (*) Đảm bảo kiểm tra kỹ số lượng tồn kho trước khi xuất hàng. Nếu có sai lệch, thông báo ngay để xử lý.
        </p>
      </div>
      <div className="position-relative mb-4">
        <input
          type="text"
          className="form-control pe-5"
          placeholder="Nhập bất cứ thứ gì để tìm kiếm..."
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
          data-bs-target="#exportProductModal"
          onClick={() => {
            setSelectedProduct(null);
          }}
        >
          Xuất hàng
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
        id="exportProductModal"
        tabIndex="-1"
        aria-labelledby="exportProductModalLabel"
        aria-hidden="true"
        ref={modalRef}
      >
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exportProductModalLabel">
                Xuất hàng
              </h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <form onSubmit={(e) => {
                e.preventDefault();
                if (selectedProduct?.exporterId && selectedProduct?.quantity) {
                  handleExport(selectedProduct.productId, selectedProduct.quantity, selectedProduct.exporterId);
                  const modal = bootstrap.Modal.getInstance(modalRef.current);
                  modal.hide();
                } else {
                  toast.error("Vui lòng chọn đơn hàng và số lượng!");
                }
              }}>
                <div className="mb-3">
                  <label className="form-label">Sản phẩm</label>
                  <select
                    className="form-control"
                    value={selectedProduct?.productId || ""}
                    onChange={(e) => setSelectedProduct({ ...selectedProduct, productId: e.target.value })}
                    required
                    disabled={isLoading}
                  >
                    <option value="">--Chọn sản phẩm--</option>
                    {products.map((p) => (
                      <option key={p.productId} value={p.productId}>
                        {p.productName} (ID: {p.productId})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Đơn hàng</label>
                  <select
                    className="form-control"
                    value={selectedProduct?.exporterId || ""}
                    onChange={(e) => setSelectedProduct({ ...selectedProduct, exporterId: parseInt(e.target.value) })}
                    required
                    disabled={isLoading}
                  >
                    <option value="">--Chọn đơn hàng--</option>
                    {orders.map((o) => (
                      <option key={o.exporterId} value={o.exporterId}>
                        Đơn hàng #{o.exporterId}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Số lượng</label>
                  <input
                    type="number"
                    className="form-control"
                    value={selectedProduct?.quantity || ""}
                    onChange={(e) => setSelectedProduct({ ...selectedProduct, quantity: parseInt(e.target.value) || 0 })}
                    required
                    min="1"
                    disabled={isLoading}
                  />
                </div>
                <div className="d-flex justify-content-end gap-2">
                  <button type="submit" className="btn theme-bg-color btn-md fw-bold text-white" disabled={isLoading}>
                    {isLoading ? "Đang xử lý..." : "Xuất hàng"}
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
              <th scope="col">Ảnh</th>
              <th scope="col">Tên sản phẩm</th>
              <th scope="col">Số lượng</th>
              <th scope="col">Ngày thu hoạch</th>
              <th scope="col">Ngày hết hạn</th>
              <th scope="col">Trạng thái</th>
              <th scope="col">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {currentProducts.length > 0 ? (
              currentProducts.map((product) => (
                <tr key={product.productId}>
                  <td className="product-image">
                    <img
                      src={product.imageURL || "https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg"}
                      alt={product.productName}
                      style={{
                        width: "80px",
                        height: "80px",
                        objectFit: "cover",
                        border: "1px solid #ccc",
                        backgroundColor: "#eee",
                      }}
                      onError={(e) => {
                        e.target.src = "https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg";
                      }}
                    />
                  </td>
                  <td>
                    <h6>{product.productName}</h6>
                  </td>
                  <td>
                    <h6>{product.stockQuantity ?? 0}</h6>
                  </td>
                  <td>
                    <h6>
                      {product.harvestDate ? new Date(product.harvestDate).toLocaleDateString("vi-VN") : "Không rõ"}
                    </h6>
                  </td>
                  <td>
                    <h6>
                      {product.expirationDate
                        ? new Date(product.expirationDate).toLocaleDateString("vi-VN")
                        : "Không rõ"}
                    </h6>
                  </td>
                  <td>
                    <span className={`badge ${product.status === 0 ? "bg-success" : "bg-secondary"}`} style={{ fontSize: "0.8rem" }}>
                      {product.status === 0 ? "Đang bán" : "Ngừng bán"}
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
                        setSelectedProduct({ productId: product.productId, quantity: product.stockQuantity });
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
                      onClick={() => handleManageInventory(product.productId, "delete", 0)}
                    >
                      🗑️
                    </button>
                    <button
                      className="btn btn-sm btn-success mt-2"
                      onClick={() => handleConfirmOrder(product.exporterId)}
                    >
                      Xác nhận
                    </button>
                    {product.stockQuantity === 0 && (
                      <button
                        className="btn btn-sm btn-warning mt-2"
                        onClick={() => handleNotifyOutOfStock(product.productId)}
                      >
                        Thông báo hết hàng
                      </button>
                    )}
                    <button
                      className="btn btn-sm btn-info mt-2"
                      onClick={() => handleViewOrderDetails(product.exporterId)}
                    >
                      Xem chi tiết
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center">
                  Không có sản phẩm nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      </div>
      {selectedProduct && (
        <div className="modal fade show" style={{ display: "block" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Chi tiết đơn hàng #{selectedProduct.exporterId}</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setSelectedProduct(null)}
                ></button>
              </div>
              <div className="modal-body">
                <p><strong>Địa chỉ giao:</strong> {selectedProduct.shippingAddress}</p>
                <p><strong>Trạng thái:</strong> {selectedProduct.statusId}</p>
                <p><strong>Ngày giao dự kiến:</strong> {new Date(selectedProduct.estimatedDeliveryDate).toLocaleString("vi-VN")}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExporterProduct;
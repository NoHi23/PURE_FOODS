import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FiSearch, FiRefreshCw } from "react-icons/fi";
import Pagination from "../../layouts/Pagination";
import ImporterEditProduct from "./ImporterEditProduct";
import ModalExpiredProduct from "./ModalExpiredProduct";
import * as bootstrap from "bootstrap";

const ImporterProduct = ({ setProducts, currentPage, setCurrentPage }) => {
  const [products, setLocalProducts] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showExpiredModal, setShowExpiredModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [newProduct, setNewProduct] = useState({
    productId: "",
    quantityChange: "",
    reason: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const modalRef = useRef(null);

  const filteredProducts = products
    .filter((p) => !p.expired) // ❌ Ẩn sản phẩm đã hết hạn
    .filter((p) => {
      const productName = p.productName?.toLowerCase() || "";
      const price = p.price?.toString() || "";
      const quantity = p.stockQuantity?.toString() || "";
      const harvestDate = p.harvestDate ? new Date(p.harvestDate).toLocaleDateString("vi-VN").toLowerCase() : "";
      const expirationDate = p.expirationDate
        ? new Date(p.expirationDate).toLocaleDateString("vi-VN").toLowerCase()
        : "";

      const statusText = p.status === 0 ? "đang bán" : "ngừng bán";

      return (
        productName.includes(searchTerm.toLowerCase()) ||
        price.includes(searchTerm) ||
        quantity.includes(searchTerm) ||
        harvestDate.includes(searchTerm.toLowerCase()) ||
        expirationDate.includes(searchTerm.toLowerCase()) ||
        statusText.includes(searchTerm.toLowerCase())
      );
    });

  const productsPerPage = 7;
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const indexOfLast = currentPage * productsPerPage;
  const indexOfFirst = indexOfLast - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirst, indexOfLast);

  const fetchProducts = async () => {
    try {
      // Gọi API update status trước
      await axios.put("http://localhost:8082/PureFoods/api/product/auto-update-expired-status");

      // Sau đó mới lấy toàn bộ danh sách
      const [productsRes, suppliersRes, categoriesRes] = await Promise.all([
        axios.get("http://localhost:8082/PureFoods/api/product/getAll"),
        axios.get("http://localhost:8082/PureFoods/api/supplier/getAll"),
        axios.get("http://localhost:8082/PureFoods/api/category/getAll"),
      ]);

      const today = new Date();
      const FIVE_DAYS_MS = 5 * 24 * 60 * 60 * 1000;

      const processedProducts = (productsRes.data.listProduct || []).map((p) => {
        const expiration = new Date(p.expirationDate);
        const isExpiringSoon = expiration - today <= FIVE_DAYS_MS && expiration - today > 0;
        const isExpired = expiration - today <= 0;

        return {
          ...p,
          status: isExpired ? 1 : p.status, // nếu hết hạn → ngừng bán
          expiringSoon: isExpiringSoon,
          expired: isExpired,
        };
      });

      setLocalProducts(processedProducts);
      setProducts(processedProducts);
      setSuppliers(suppliersRes.data.suppliers || []);
      setCategories(categoriesRes.data || []);
    } catch (err) {
      console.error("Lỗi khi lấy dữ liệu:", err);
      setLocalProducts([]);
      setSuppliers([]);
      setCategories([]);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [setProducts]);

  const handleCreateOrder = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Bật trạng thái loading
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const userId = user.userId || null;

      if (!userId) {
        toast.error("Không tìm thấy userId trong localStorage!");
        setIsLoading(false);
        return;
      }

      if (!newProduct.productId || !newProduct.quantityChange || !newProduct.reason) {
        toast.error("Vui lòng điền đầy đủ thông tin bắt buộc!");
        setIsLoading(false);
        return;
      }

      const response = await axios.post("http://localhost:8082/PureFoods/api/inventory-logs/create-order", {
        productId: parseInt(newProduct.productId),
        userId: userId,
        quantityChange: parseInt(newProduct.quantityChange),
        reason: newProduct.reason,
      });

      const createdOrder = response.data.log;
      // Gọi lại API để làm mới danh sách sản phẩm
      await fetchProducts();
      // Đóng modal bằng bootstrap.Modal
      const modal = bootstrap.Modal.getInstance(modalRef.current);
      modal.hide();
      setNewProduct({
        productId: "",
        quantityChange: "",
        reason: "",
      });
      toast.success("Đơn nhập đã được tạo thành công!");
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (err) {
      console.error("Lỗi chi tiết:", err.response?.data);
      toast.error("Tạo đơn nhập thất bại. Vui lòng kiểm tra lại!");
    } finally {
      setIsLoading(false); // Tắt trạng thái loading
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm("Bạn có chắc muốn xóa sản phẩm này?")) {
      try {
        await axios.delete("http://localhost:8082/PureFoods/api/product/delete", {
          data: { productId },
        });
        setLocalProducts((prev) => prev.filter((p) => p.productId !== productId));
        setProducts((prev) => prev.filter((p) => p.productId !== productId));
        toast.success("Xóa sản phẩm thành công!");
      } catch (err) {
        console.error("Lỗi khi xóa sản phẩm:", err);
        toast.error("Xóa sản phẩm thất bại. Vui lòng kiểm tra lại!");
      }
    }
  };

  const handleRefresh = async () => {
    setIsLoading(true);
    try {
      await fetchProducts();
      toast.success("Danh sách sản phẩm đã được làm mới!");
    } catch (err) {
      console.error("Lỗi khi làm mới:", err);
      toast.error("Làm mới thất bại. Vui lòng thử lại!");
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
          (*)Đảm bảo mọi thứ còn nguyên vẹn trước khi lưu kho, mọi sai lệch sẽ ảnh hưởng đến quá trình xử lý sau này!
          Kiểm tra kỹ nếu có vấn đề thì trả hàng lại cho nhà cung cấp.
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
          data-bs-target="#importProductModal"
          onClick={() => {
            setNewProduct({
              productId: "",
              quantityChange: "",
              reason: "",
            });
          }}
        >
          Nhập thêm
        </button>

        <button className="btn btn-warning fw-bold text-white" onClick={() => setShowExpiredModal(true)}>
          🗓️ Sản phẩm hết hạn
        </button>

        <button
          className="btn btn-md fw-bold text-white d-flex align-items-center"
          onClick={handleRefresh}
          disabled={isLoading}
          style={{
            backgroundColor: "#007bff", // Màu blue chính
            border: "1px solid #007bff",
            transition: "all 0.3s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#0056b3"; // Hover blue đậm hơn
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
        id="importProductModal"
        tabIndex="-1"
        aria-labelledby="importProductModalLabel"
        aria-hidden="true"
        ref={modalRef} // Gắn ref vào modal
      >
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="importProductModalLabel">
                Nhập sản phẩm mới
              </h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleCreateOrder}>
                <div className="mb-3">
                  <label className="form-label">Sản phẩm</label>
                  <select
                    name="productId"
                    value={newProduct.productId}
                    onChange={handleInputChange}
                    required
                    className="form-control"
                    disabled={isLoading} // Vô hiệu hóa khi đang loading
                  >
                    <option value="">--Chọn sản phẩm--</option>
                    {products.length > 0 ? (
                      products.map((p) => (
                        <option key={p.productId} value={p.productId}>
                          {p.productName} (ID: {p.productId})
                        </option>
                      ))
                    ) : (
                      <option value="" disabled>
                        Đang tải sản phẩm...
                      </option>
                    )}
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Người nhập</label>
                  <input
                    type="text"
                    className="form-control"
                    value={
                      JSON.parse(localStorage.getItem("user") || "{}").fullName
                        ? `${JSON.parse(localStorage.getItem("user") || "{}").fullName} (ID: ${
                            JSON.parse(localStorage.getItem("user") || "{}").userId
                          })`
                        : ""
                    }
                    disabled
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Số lượng nhập</label>
                  <input
                    type="number"
                    className="form-control"
                    name="quantityChange"
                    value={newProduct.quantityChange}
                    onChange={handleInputChange}
                    required
                    disabled={isLoading} // Vô hiệu hóa khi đang loading
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Lý do nhập kho</label>
                  <input
                    type="text"
                    className="form-control"
                    name="reason"
                    value={newProduct.reason}
                    onChange={handleInputChange}
                    required
                    disabled={isLoading} // Vô hiệu hóa khi đang loading
                  />
                </div>
                <div className="d-flex justify-content-end gap-2 mt-3">
                  <button type="submit" className="btn theme-bg-color btn-md fw-bold text-white" disabled={isLoading}>
                    {isLoading ? "Đang xử lý..." : "Tạo đơn nhập"}
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
              <th scope="col">Tồn kho</th>
              <th scope="col">Ngày thu hoạch</th>
              <th scope="col">Ngày hết hạn</th>
              <th scope="col">Trạng thái</th>
              <th scope="col">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {currentProducts.length > 0 ? (
              currentProducts.map((product, index) => (
                <tr key={index}>
                  <td className="product-image">
                    <img
                      src={product.imageURL}
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
                    <h6>{product.productName || "Không xác định"}</h6>
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
                    {product.expired ? (
                      <span className="badge bg-danger" title="Sản phẩm đã hết hạn">
                        Hết hạn ❌
                      </span>
                    ) : product.expiringSoon ? (
                      <span className="badge bg-warning text-dark" title="Sản phẩm sắp hết hạn">
                        Sắp hết hạn ⏳
                      </span>
                    ) : (
                      <span className={`badge ${product.status === 0 ? "bg-success" : "bg-secondary"}`}>
                        {product.status === 0 ? "Đang bán" : "Ngừng bán"}
                      </span>
                    )}
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
                        setSelectedProduct(product);
                        setShowEditModal(true);
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
                      onClick={() => handleDeleteProduct(product.productId)}
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center">
                  Không có sản phẩm nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        {showEditModal && (
          <ImporterEditProduct
            show={showEditModal}
            onClose={() => setShowEditModal(false)}
            product={selectedProduct}
            onUpdated={fetchProducts}
          />
        )}
      </div>
      {showExpiredModal && (
        <ModalExpiredProduct
          expiredProducts={products.filter((p) => p.expired)}
          onClose={() => setShowExpiredModal(false)}
        />
      )}
    </div>
  );
};

export default ImporterProduct;

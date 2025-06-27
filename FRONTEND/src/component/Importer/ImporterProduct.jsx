import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Pagination from "../../layouts/Pagination";
import ImporterEditProduct from "./ImporterEditProduct";

const ImporterProduct = ({ setProducts, currentPage, setCurrentPage }) => {
  const [products, setLocalProducts] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [newProduct, setNewProduct] = useState({
    productId: null,
    productName: "",
    categoryId: 1,
    supplierId: 1,
    price: "",
    stockQuantity: "",
    description: "",
    imageURL: "",
    harvestDate: "",
    expirationDate: "",
    nutritionalInfo: "",
    status: 1,
  });
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredProducts = products.filter((p) => {
    const productName = p.productName?.toLowerCase() || "";
    const price = p.price?.toString() || "";
    const quantity = p.stockQuantity?.toString() || "";
    const harvestDate = p.harvestDate ? new Date(p.harvestDate).toLocaleDateString("vi-VN").toLowerCase() : "";
    const expirationDate = p.expirationDate ? new Date(p.expirationDate).toLocaleDateString("vi-VN").toLowerCase() : "";

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
      const [productsRes, suppliersRes, categoriesRes] = await Promise.all([
        axios.get("http://localhost:8082/PureFoods/api/product/getAll"),
        axios.get("http://localhost:8082/PureFoods/api/supplier/getAll"),
        axios.get("http://localhost:8082/PureFoods/api/category/getAll"),
      ]);

      setLocalProducts(productsRes.data.listProduct || []);
      setProducts(productsRes.data.listProduct || []);
      setSuppliers(suppliersRes.data.suppliers || []);
      setCategories(categoriesRes.data || []); // Sử dụng res.data trực tiếp vì API trả về mảng
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
    try {
      const response = await axios.post("http://localhost:8082/PureFoods/api/inventory-logs/create-order", {
        ...newProduct,
        userId: 1,
        status: 0,
      });
      const createdOrder = response.data.log;
      setLocalProducts((prev) => [...prev, { ...newProduct, productId: createdOrder.productId }]);
      setProducts((prev) => [...prev, { ...newProduct, productId: createdOrder.productId }]);
      setShowModal(false);
      setNewProduct({
        productId: null,
        productName: "",
        categoryId: 1,
        supplierId: 1,
        price: "",
        stockQuantity: "",
        description: "",
        imageURL: "",
        harvestDate: "",
        expirationDate: "",
        nutritionalInfo: "",
        status: 1,
      });
      toast.success("Đơn nhập đã được tạo thành công!");
    } catch (err) {
      console.error("Lỗi khi tạo đơn nhập:", err);
      toast.error("Tạo đơn nhập thất bại. Vui lòng kiểm tra lại!");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put("http://localhost:8082/PureFoods/api/product/update", newProduct);
      const updatedProduct = response.data.product;
      setLocalProducts((prev) => prev.map((p) => (p.productId === updatedProduct.productId ? updatedProduct : p)));
      setProducts((prev) => prev.map((p) => (p.productId === updatedProduct.productId ? updatedProduct : p)));
      setShowModal(false);
      setNewProduct({
        productId: null,
        productName: "",
        categoryId: 1,
        supplierId: 1,
        price: "",
        stockQuantity: "",
        description: "",
        imageURL: "",
        harvestDate: "",
        expirationDate: "",
        nutritionalInfo: "",
        status: 1,
      });
      toast.success("Cập nhật sản phẩm thành công!");
    } catch (err) {
      console.error("Lỗi khi cập nhật sản phẩm:", err);
      toast.error("Cập nhật sản phẩm thất bại. Vui lòng kiểm tra lại!");
    }
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

  return (
    <div className="product-tab">
      <div className="title">
        <h2>Tất cả sản phẩm trong kho</h2>
        <span className="title-leaf">
          <svg className="icon-width bg-gray">
            <use href="../assets/svg/leaf.svg#leaf"></use>
          </svg>
        </span>
      </div>
      <input
        type="text"
        className="form-control mb-4"
        placeholder="Nhập bất cứ thứ gì để tìm kiếm ....."
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setCurrentPage(1); // Reset trang khi search
        }}
      />
      <button
        className="btn theme-bg-color btn-md fw-bold text-white mb-4"
        data-bs-toggle="modal"
        data-bs-target="#importProductModal"
        onClick={() => {
          setNewProduct({
            productId: null,
            productName: "",
            categoryId: 1,
            supplierId: 1,
            price: "",
            stockQuantity: "",
            description: "",
            imageURL: "",
            harvestDate: "",
            expirationDate: "",
            nutritionalInfo: "",
            status: 1,
          });
        }}
      >
        Nhập thêm
      </button>

      <div
        className="modal fade"
        id="importProductModal"
        tabIndex="-1"
        aria-labelledby="importProductModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="importProductModalLabel">
                {newProduct.productId ? "Cập nhật sản phẩm" : "Nhập sản phẩm mới"}
              </h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <form onSubmit={newProduct.productId ? handleUpdateProduct : handleCreateOrder}>
                <div className="mb-3">
                  <label className="form-label">Tên sản phẩm</label>
                  <input
                    type="text"
                    className="form-control"
                    name="productName"
                    value={newProduct.productName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Thể loại</label>
                  <select
                    name="categoryId"
                    value={newProduct.categoryId}
                    onChange={handleInputChange}
                    required
                    className="form-control"
                  >
                    <option value="">--Chọn thể loại--</option>
                    {categories.length > 0 ? (
                      categories.map((c) => (
                        <option key={c.categoryID} value={c.categoryID}>
                          {c.categoryName}
                        </option>
                      ))
                    ) : (
                      <option value="" disabled>
                        Đang tải danh mục...
                      </option>
                    )}
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label">Nhà cung cấp</label>
                  <select
                    name="supplierId"
                    value={newProduct.supplierId}
                    onChange={handleInputChange}
                    required
                    className="form-control"
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
                  <label className="form-label">Giá</label>
                  <input
                    type="number"
                    step="0.01"
                    className="form-control"
                    name="price"
                    value={newProduct.price}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Số lượng</label>
                  <input
                    type="number"
                    className="form-control"
                    name="stockQuantity"
                    value={newProduct.stockQuantity}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Mô tả</label>
                  <textarea
                    className="form-control"
                    name="description"
                    value={newProduct.description}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">URL ảnh</label>
                  <input
                    type="text"
                    className="form-control"
                    name="imageURL"
                    value={newProduct.imageURL}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Ngày thu hoạch</label>
                  <input
                    type="date"
                    className="form-control"
                    name="harvestDate"
                    value={newProduct.harvestDate}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Ngày hết hạn</label>
                  <input
                    type="date"
                    className="form-control"
                    name="expirationDate"
                    value={newProduct.expirationDate}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Thông tin dinh dưỡng</label>
                  <textarea
                    className="form-control"
                    name="nutritionalInfo"
                    value={newProduct.nutritionalInfo}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Trạng thái</label>
                  <select
                    className="form-control"
                    name="status"
                    value={newProduct.status}
                    onChange={handleInputChange}
                    required
                  >
                    <option value={1}>Hoạt động</option>
                    <option value={0}>Không hoạt động</option>
                  </select>
                </div>
                <div className="d-flex justify-content-end gap-2 mt-3">
                  <button type="submit" className="btn theme-bg-color btn-md fw-bold text-white">
                    {newProduct.productId ? "Cập nhật" : "Tạo đơn nhập"}
                  </button>
                  <button type="button" className="btn btn-secondary btn-md fw-bold" data-bs-dismiss="modal">
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
              <th scope="col">Giá</th>
              <th scope="col">Số lượng</th>
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
                    <h6 className="theme-color fw-bold">{product.price ? `$${product.price}` : "Không xác định"}</h6>
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
                    <span
                      className={`badge ${product.status === 0 ? "bg-success" : "bg-secondary"}`}
                      style={{ fontSize: "0.8rem" }}
                    >
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
    </div>
  );
};

export default ImporterProduct;

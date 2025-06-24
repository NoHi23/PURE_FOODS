// Giữ nguyên phần import
import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Pagination from "../../layouts/Pagination";

const ImporterProduct = ({ setProducts, currentPage, setCurrentPage }) => {
  const [products, setLocalProducts] = useState([]);
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

  const productsPerPage = 7;
  const totalPages = Math.ceil(products.length / productsPerPage);
  const indexOfLast = currentPage * productsPerPage;
  const indexOfFirst = indexOfLast - productsPerPage;
  const currentProducts = products.slice(indexOfFirst, indexOfLast);

  // Fetch danh sách sản phẩm khi mount
  useEffect(() => {
    axios
      .get("http://localhost:8082/PureFoods/api/product/getAll")
      .then((res) => {
        const data = res.data.listProduct || [];
        setLocalProducts(data);
        setProducts(data); // Đồng bộ với state cha
        console.log("xem có hiện ảnh k:", data);
      })
      .catch((err) => {
        console.error("Lỗi khi lấy danh sách sản phẩm:", err);
      });
  }, [setProducts]);

  // Submit form nhập kho
  const handleImportProduct = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8082/PureFoods/api/product/import", newProduct);
      const importedProduct = response.data.product;
      setLocalProducts((prev) => [...prev, importedProduct]);
      setProducts((prev) => [...prev, importedProduct]);
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
      toast.success("Nhập sản phẩm thành công!");
    } catch (err) {
      console.error("Lỗi khi nhập sản phẩm:", err);
      toast.error("Nhập sản phẩm thất bại. Vui lòng kiểm tra lại!");
    }
  };

  // Xử lý nhập liệu
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Xử lý Edit sản phẩm
  const handleEditProduct = (product) => {
    setNewProduct({
      productId: product.productId,
      productName: product.productName,
      categoryId: product.categoryId,
      supplierId: product.supplierId,
      price: product.price,
      stockQuantity: product.stockQuantity,
      description: product.description,
      imageURL: product.imageURL,
      harvestDate: product.harvestDate ? new Date(product.harvestDate).toISOString().split("T")[0] : "",
      expirationDate: product.expirationDate ? new Date(product.expirationDate).toISOString().split("T")[0] : "",
      nutritionalInfo: product.nutritionalInfo,
      status: product.status,
    });
    setShowModal(true);
  };

  // Xử lý Update sản phẩm
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

  // Xử lý Delete sản phẩm
  const handleDeleteProduct = async (productId) => {
  if (window.confirm("Bạn có chắc muốn xóa sản phẩm này?")) {
    try {
      await axios.delete("http://localhost:8082/PureFoods/api/product/delete", {
        data: { productId }, // Gửi productId trong body
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

      {/* Nút mở modal nhập sản phẩm */}
      <button
        className="btn theme-bg-color btn-md fw-bold text-white mb-4"
        data-bs-toggle="modal"
        data-bs-target="#importProductModal"
        onClick={() =>
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
          })
        }
      >
        Nhập thêm
      </button>

      {/* Modal nhập sản phẩm */}
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
              <form onSubmit={newProduct.productId ? handleUpdateProduct : handleImportProduct}>
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
                  <label className="form-label">Danh mục (ID)</label>
                  <input
                    type="number"
                    className="form-control"
                    name="categoryId"
                    value={newProduct.categoryId}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Nhà cung cấp (ID)</label>
                  <input
                    type="number"
                    className="form-control"
                    name="supplierId"
                    value={newProduct.supplierId}
                    onChange={handleInputChange}
                    required
                  />
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
                <button type="submit" className="btn theme-bg-color btn-md fw-bold text-white">
                  {newProduct.productId ? "Cập nhật" : "Nhập sản phẩm"}
                </button>
                <button type="button" className="btn btn-secondary btn-md fw-bold ms-2" data-bs-dismiss="modal">
                  Hủy
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
      {/* Hết modal */}

      {/* Bảng sản phẩm */}
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
                      className={`badge ${product.status === 1 ? "bg-success" : "bg-secondary"}`}
                      style={{ fontSize: "0.8rem" }}
                    >
                      {product.status === 1 ? "Hoạt động" : "Không hoạt động"}
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
                      onClick={() => handleEditProduct(product)}
                    >
                      Sửa ✏️
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
                      Xoá 🗑️
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

        {/* Phân trang */}
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      </div>
    </div>
  );
};

export default ImporterProduct;

import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FiSearch, FiRefreshCw } from "react-icons/fi";
import Pagination from "../../layouts/Pagination";
import ExporterEditProduct from "./ExporterEditProduct";
import CreateOrder from "./CreateOrder";
import Swal from "sweetalert2";

const ExporterProduct = ({ setProducts, currentPage, setCurrentPage }) => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [products, setLocalProducts] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchProducts();
  }, [setProducts]);

  if (!user || user.roleID !== 5) {
    return <div className="text-danger">Vui lòng đăng nhập với tài khoản Exporter.</div>;
  }

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
    setIsLoading(true);
    try {
      const headers = { Authorization: `Bearer ${user.token}` };
      const [productsRes, suppliersRes, categoriesRes] = await Promise.all([
        axios.get("http://localhost:8082/PureFoods/api/product/getAll", { headers }),
        axios.get("http://localhost:8082/PureFoods/api/supplier/getAll", { headers }),
        axios.get("http://localhost:8082/PureFoods/api/category/getAll", { headers }),
      ]);

      if (productsRes.data.status === 200) {
        setLocalProducts(productsRes.data.listProduct || []);
        setProducts(productsRes.data.listProduct || []);
      } else {
        toast.error(productsRes.data.message || "Lỗi khi tải danh sách sản phẩm");
      }

      if (suppliersRes.data.status === 200) {
        setSuppliers(suppliersRes.data.suppliers || []);
      } else {
        toast.error(suppliersRes.data.message || "Lỗi khi tải danh sách nhà cung cấp");
      }

      if (categoriesRes.data.status === 200) {
        setCategories(categoriesRes.data || []);
      } else {
        toast.error(categoriesRes.data.message || "Lỗi khi tải danh sách danh mục");
      }
    } catch (err) {
      toast.error("Lỗi khi tải dữ liệu: " + (err.response?.data?.message || err.message));
      setLocalProducts([]);
      setSuppliers([]);
      setCategories([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProduct = async (productId) => {
    const result = await Swal.fire({
      title: "Xác nhận xóa",
      text: "Bạn có chắc muốn xóa sản phẩm này?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
    });

    if (!result.isConfirmed) return;

    try {
      const res = await axios.delete("http://localhost:8082/PureFoods/api/product/delete", {
        data: { productId },
        headers: { Authorization: `Bearer ${user.token}` },
      });
      if (res.data.status === 200) {
        setLocalProducts((prev) => prev.filter((p) => p.productId !== productId));
        setProducts((prev) => prev.filter((p) => p.productId !== productId));
        toast.success("Xóa sản phẩm thành công!");
      } else {
        toast.error(res.data.message || "Xóa sản phẩm thất bại");
      }
    } catch (err) {
      toast.error("Xóa sản phẩm thất bại: " + (err.response?.data?.message || err.message));
    }
  };

  const handleRefresh = async () => {
    setIsLoading(true);
    try {
      await fetchProducts();
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
          (*)Đảm bảo kiểm tra kỹ số lượng và chất lượng sản phẩm trước khi xuất kho.
        </p>
      </div>
      <div className="position-relative mb-4">
        <input
          type="text"
          className="form-control pe-5"
          placeholder="Tìm kiếm sản phẩm..."
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
        >
          Tạo đơn xuất hàng
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

      <CreateOrder products={products} onOrderCreated={fetchProducts} />

      <div className="table-responsive dashboard-bg-box">
        <table className="table product-table">
          <thead>
            <tr>
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
                <td colSpan="7" className="text-center">
                  Không có sản phẩm nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        {showEditModal && (
          <ExporterEditProduct
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

export default ExporterProduct;
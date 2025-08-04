// ExporterInventory.jsx (No changes needed)
import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiSearch, FiRefreshCw } from "react-icons/fi";
import Pagination from "../../layouts/Pagination";
import { toast } from "react-toastify";

const ExporterInventory = ({ currentPage, setCurrentPage }) => {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const fetchInventory = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get("http://localhost:8082/PureFoods/api/exporter/inventory-products", {
        timeout: 5000,
      });
      if (response.data.status === 200) {
        setProducts(response.data.products || []);
        toast.success("Lấy danh sách sản phẩm trong kho thành công!");
      } else {
        toast.error(response.data.message || "Lấy danh sách sản phẩm thất bại!");
      }
    } catch (err) {
      console.error("Lỗi khi lấy danh sách sản phẩm:", err);
      toast.error("Không thể tải danh sách sản phẩm! Kiểm tra mạng.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const handleRefresh = () => {
    fetchInventory();
  };

  const filteredProducts = products.filter((product) => {
    const productName = product?.productName?.toLowerCase() || "";
    const productId = product?.productId?.toString() || "";
    return productName.includes(searchTerm.toLowerCase()) || productId.includes(searchTerm);
  });

  const productsPerPage = 7;
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const indexOfLast = currentPage * productsPerPage;
  const indexOfFirst = indexOfLast - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirst, indexOfLast);

  return (
    <div className="product-tab">
      {isLoading && (
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Đang tải...</span>
          </div>
        </div>
      )}
      <div className="title">
        <h2>Danh sách sản phẩm trong kho</h2>
        <span className="title-leaf">
          <svg className="icon-width bg-gray">
            <use href="/assets/svg/leaf.svg#leaf"></use>
          </svg>
        </span>
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
          <FiRefreshCw className={`me-1 ${isLoading ? "fa-spin" : ""}`} />
          {isLoading ? "Đang làm mới..." : "Làm mới"}
        </button>
      </div>
      <div className="table-responsive dashboard-bg-box">
        <table className="table order-table">
          <thead>
            <tr>
              <th scope="col">ID Sản phẩm</th>
              <th scope="col">Hình ảnh</th>
              <th scope="col">Tên sản phẩm</th>
              <th scope="col">Số lượng tồn kho</th>
              <th scope="col">Giá</th>
            </tr>
          </thead>
          <tbody>
            {currentProducts.length > 0 ? (
              currentProducts.map((product, index) => (
                <tr key={index}>
                  <td>#{product?.productId}</td>
                  <td>
                    <img
                      src={product?.imageURL || "/assets/images/default-product.jpg"}
                      alt={product?.productName || "Sản phẩm"}
                      className="img-fluid blur-up lazyload"
                      style={{ width: "50px", height: "50px", objectFit: "cover" }}
                    />
                  </td>
                  <td>
                    <h6>{product?.productName || "Không rõ"}</h6>
                  </td>
                  <td>
                    <h6>{product?.stockQuantity || 0}</h6>
                  </td>
                  <td>
                    <h6>${product?.price || 0}</h6>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center">
                  Không có sản phẩm nào trong kho.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      </div>
    </div>
  );
};

export default ExporterInventory;
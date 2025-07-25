import React, { useState, useEffect } from "react";
import axios from "axios";
import { Search } from "react-feather";
import { Dropdown, TabContainer } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Products.css";
import ProductCardGrid from "./ProductCardGrid";
import ProductListItem from "./ProductListItem";
import Pagination from "../../layouts/Pagination";
import ProductDetailModal from "./ProductDetailModal";
import { usePriceFilter } from "./PriceFilterContext";
import { useDiscountFilter } from "./DiscountFilterContext";

const Products = ({ products, isLoading, userId, selectedRatings }) => {
  const { priceRange } = usePriceFilter();
  const { discountRange } = useDiscountFilter();
  const [sortOption, setSortOption] = useState("Phổ biến nhất");
  const [sortedProducts, setSortedProducts] = useState([]);
  const [viewMode, setViewMode] = useState("grid-4"); // Mặc định là grid-4
  const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
  const itemsPerPage = 12; // Số sản phẩm mỗi trang
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    setSortedProducts([...products]);
  }, [products]);

  useEffect(() => {
    // Lọc sản phẩm dựa trên priceRange và discountRange
    let filtered = [...products].filter(
      (product) =>
        product.salePrice >= priceRange[0] &&
        product.salePrice <= priceRange[1] &&
        (product.discountPercent || 0) >= discountRange[0] &&
        (product.discountPercent || 0) <= discountRange[1]
    );
    setSortedProducts(filtered);
    setCurrentPage(1); // Reset về trang 1 khi thay đổi priceRange hoặc discountRange
  }, [priceRange, discountRange, products]);

  const handleSortChange = (option) => {
    setSortOption(option);
    let sorted = [...sortedProducts]; // Lọc dựa trên sản phẩm đã lọc bởi priceRange
    if (option === "Giá: Thấp đến Cao") {
      sorted.sort((a, b) => a.salePrice - b.salePrice);
    } else if (option === "Giá: Cao đến Thấp") {
      sorted.sort((a, b) => b.salePrice - a.salePrice);
    } else if (option === "Rating: Cao đến Thấp") {
      sorted.sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0));
    }
    setSortedProducts(sorted);
    setCurrentPage(1); // Reset về trang 1 sau khi sort
  };

  const handleViewProduct = async (product) => {
    try {
      const res = await axios.get(`http://localhost:8082/PureFoods/api/product/getById/${product.productId}`);
      setSelectedProduct(res.data.product);
      setShowModal(true);
    } catch (error) {
      console.error("Lỗi khi lấy chi tiết sản phẩm:", error);
    }
  };

  const filteredProducts = sortedProducts.filter((product) => {
    const query = searchQuery.trim().toLowerCase();

    // Nếu là số thì lọc theo giá
    if (!isNaN(query) && query !== "") {
      const number = parseFloat(query);
      return product.price.toString().includes(query) || product.salePrice.toString().includes(query);
    }
    // Nếu là chữ thì lọc theo tên sản phẩm
    return product.productName.toLowerCase().includes(query);
  }).filter((product) => {
    // Lọc theo rating (exact match nếu selected, else all)
    const roundedRating = Math.round(product.averageRating || 0);
    return selectedRatings.length === 0 || selectedRatings.includes(roundedRating);
  });

  // Tính toán số trang và phân trang sản phẩm
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  if (isLoading) {
    return (
      <div className="col-lg-10 col-md-9">
        <p>Đang tải sản phẩm...</p>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="col-lg-10 col-md-9">
        <p>Không có sản phẩm nào trong danh mục này.</p>
      </div>
    );
  }

  return (
    <TabContainer>
      <div className="col-custom">
        <div className="show-button">
          {/* Phần filter trên đầu các sản phẩm */}
          <div className="top-filter-menu d-flex justify-content-between align-items-center">
            <div className="category-dropdown d-flex align-items-center gap-4 mb-3">
              <h5 className="text-content fw-bold fs-5">Sắp xếp :</h5>
              <Dropdown>
                <Dropdown.Toggle variant="light" id="dropdownMenuButton1">
                  <span>{sortOption}</span>
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => handleSortChange("Tất cả")}>Tất cả</Dropdown.Item>
                  <Dropdown.Item onClick={() => handleSortChange("Giá: Thấp đến Cao")}>Giá: Thấp đến Cao</Dropdown.Item>
                  <Dropdown.Item onClick={() => handleSortChange("Giá: Cao đến Thấp")}>Giá: Cao đến Thấp</Dropdown.Item>
                  <Dropdown.Item onClick={() => handleSortChange("Rating: Cao đến Thấp")}>Rating: Cao đến Thấp</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
            <div className="grid-option d-none d-md-block">
              <ul className="d-flex gap-2 list-unstyled">
                <li className={`three-grid ${viewMode === "grid-3" ? "active" : ""}`}>
                  <button className="btn p-0" onClick={() => setViewMode("grid-3")}>
                    <img src="../assets/svg/grid-3.svg" alt="Grid 3" />
                  </button>
                </li>
                <li className={`grid-btn ${viewMode === "grid-4" ? "active" : ""}`}>
                  <button className="btn p-0" onClick={() => setViewMode("grid-4")}>
                    <img src="../assets/svg/grid-4.svg" alt="Grid 4" className="d-lg-inline-block d-none" />
                    <img
                      src="../assets/svg/grid.svg"
                      alt="Grid default"
                      className="img-fluid d-lg-none d-inline-block"
                    />
                  </button>
                </li>
                <li className={`list-btn ${viewMode === "list" ? "active" : ""}`}>
                  <button className="btn p-0" onClick={() => setViewMode("list")}>
                    <img src="../assets/svg/list.svg" alt="List view" />
                  </button>
                </li>
              </ul>
            </div>
          </div>
          {/* Hết phần filter trên đầu các sản phẩm */}

          {/* Thanh tìm kiếm */}
          <div className="position-relative mb-3" style={{ width: "80%" }}>
            <input
              type="text"
              className="form-control pe-5"
              placeholder="Enter by name or price..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
            />
            <span
              className="position-absolute"
              style={{
                top: "50%",
                right: "15px",
                transform: "translateY(-50%)",
                color: "#aaa",
                pointerEvents: "none",
              }}
            >
              <Search size={16} />
            </span>
          </div>
          {/* Kết thúc thanh tìm kiếm */}
        </div>
        <div
          className={`product-list-section ${
            viewMode === "grid-3"
              ? "row row-cols-xxl-3 row-cols-xl-3 row-cols-lg-2 row-cols-md-2 row-cols-1 g-sm-4 g-3"
              : viewMode === "grid-4"
              ? "row row-cols-xxl-4 row-cols-xl-3 row-cols-lg-2 row-cols-md-2 row-cols-1 g-sm-4 g-3"
              : ""
          }`}
        >
          {paginatedProducts.map((product) => (
            <div key={product.productId} className={viewMode === "list" ? "" : "col"}>
              {viewMode === "list" ? (
                <ProductListItem product={product} handleViewProduct={handleViewProduct} userId={userId} />
              ) : (
                <ProductCardGrid product={product} handleViewProduct={handleViewProduct} userId={userId}/>
              )}
            </div>
          ))}
        </div>
        <nav className="custom-pagination">
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </nav>
        <ProductDetailModal show={showModal} onHide={() => setShowModal(false)} product={selectedProduct} />
      </div>
    </TabContainer>
  );
};

export default Products;
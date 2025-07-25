import React from "react";
import { Eye, Star } from "react-feather";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const ProductListItem = ({ product, handleViewProduct, userId }) => {
  const navigate = useNavigate();

  const handleAddToCart = () => {
    if (!userId) {
      toast.error("Vui lòng đăng nhập");
      return;
    }

    const cartItem = {
      userID: userId,
      productID: product.productId,
      quantity: 1, // Mặc định là 1, có thể mở rộng với state nếu cần
      priceAfterDiscount: product.salePrice,
      total: product.salePrice * 1,
      imageURL: product.imageURL,
      productName: product.productName,
      originalPrice: product.price,
      discount: product.discountPercent || 0, // Giả định discountPercent có thể null
    };

    axios
      .post("http://localhost:8082/PureFoods/api/cart/create", cartItem)
      .then(() => {
        toast.success("Đã thêm vào giỏ hàng");
        window.dispatchEvent(new Event("cartUpdated"));
      //  navigate("/cart-detail", { state: { fromAddToCart: true } });
      })
      .catch((err) => {
        console.error("❌ Lỗi khi thêm vào giỏ hàng:", err.response?.data || err.message);
        toast.error("Thêm vào giỏ thất bại");
      });
  };

  return (
    <div
      className="product-box-3 border-bottom d-flex align-items-center p-3 w-100"
      style={{
        minHeight: "140px",
        transition: "background-color 0.2s",
        borderRadius: "8px",
      }}
    >
      {/* Ảnh sản phẩm */}
      <div style={{ width: "120px", flexShrink: 0 }}>
        <Link to={`/product/${product.productId}`}>
          <img
            src={product.imageURL || "../assets/images/cake/product/2.png"}
            alt={product.productName}
            className="img-fluid rounded"
            style={{ width: "100%", height: "100px", objectFit: "contain" }}
          />
        </Link>
      </div>

      {/* Thông tin sản phẩm */}
      <div className="px-4 flex-grow-1">
        <Link to={`/product/${product.productId}`}>
          <h5 className="mb-1 fw-bold">{product.productName || "Tên sản phẩm"}</h5>
        </Link>
        <p className="mb-2 text-muted small" style={{ maxWidth: "90%" }}>
          {product.description || "Không có mô tả"}
        </p>
        <div className="d-flex align-items-center gap-2 mb-1">
          <ul className="rating d-flex p-0 m-0" style={{ listStyle: "none" }}>
            {Array(5)
              .fill(0)
              .map((_, i) => (
                <li key={i}>
                  <Star
                    size={14}
                    fill={i < Math.floor(product.rating || 4) ? "#ffc107" : "none"}
                    color={i < Math.floor(product.rating || 4) ? "#ffc107" : "#ccc"}
                  />
                </li>
              ))}
          </ul>
          <span className="text-muted">({product.rating || 4}.0)</span>
        </div>
        <div>
          <span className="theme-color fw-bold me-2">${product.salePrice?.toFixed(2) || "8.02"}</span>
          <del className="text-muted">${product.price?.toFixed(2) || "15.15"}</del>
        </div>
      </div>

      {/* Hành động */}
      <div className="text-end" style={{ width: "140px" }}>
        <button
          className="btn btn-outline-primary btn-sm w-100 mb-2"
          onClick={() => handleViewProduct(product)}
        >
          <Eye size={16} className="me-1" />
          View detail
        </button>
        <button
          className="btn btn-primary btn-sm w-100"
          onClick={handleAddToCart}
        >
          Add To Cart
        </button>
      </div>
    </div>
  );
};

export default ProductListItem;
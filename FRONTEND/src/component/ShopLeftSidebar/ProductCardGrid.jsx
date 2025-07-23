import React from "react";
import { Eye, Star } from "react-feather";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const ProductCardGrid = ({ product, handleViewProduct, userId }) => {
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
        navigate("/cart-detail", { state: { fromAddToCart: true } });
      })
      .catch((err) => {
        console.error("❌ Lỗi khi thêm vào giỏ hàng:", err.response?.data || err.message);
        toast.error("Thêm vào giỏ thất bại");
      });
  };

  return (
    <div className="product-box-3 h-100 text-center border rounded p-3 shadow-sm">
      <div className="product-image mb-3">
        <Link to={`/product/${product.productId}`}>
          <img
            src={product.imageURL || "../assets/images/cake/product/2.png"}
            className="img-fluid blur-up lazyload"
            alt={product.productName}
            style={{ width: "140px", height: "140px", objectFit: "contain" }}
          />
        </Link>
        <ul className="product-option">
          <li data-bs-toggle="tooltip" title="View">
            <a href="#" onClick={(e) => { e.preventDefault(); handleViewProduct(product); }}>
              <Eye size={16} />
            </a>
          </li>
        </ul>
      </div>
      <span className="span-name d-block">vegatable</span>
      <Link to={`/product/${product.productId}`}>
        <h5 className="name">{product.productName || "Fresh Bread and Pastry Flour 200 g"}</h5>
      </Link>
      <div className="product-rating mt-2 d-flex align-items-center justify-content-center">
        <ul className="rating d-flex justify-content-center p-0 m-0" style={{ listStyle: "none" }}>
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
        <span className="text-muted d-block mt-1">({product.rating || 4}.0)</span>
      </div>
      <h5 className="price mt-2">
        <span className="theme-color">${(product.salePrice || 8.02).toFixed(2)}</span>{" "}
        <del>${(product.price || 15.15).toFixed(2)}</del>
      </h5>
      <div className="add-to-cart-box mt-3">
        <button
          className="btn btn-add-cart btn-primary addcart-button w-80 d-flex justify-content-center align-items-center"
          onClick={handleAddToCart}
        >
          Add To Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCardGrid;
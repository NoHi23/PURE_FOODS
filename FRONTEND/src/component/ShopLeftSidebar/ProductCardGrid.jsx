import React from "react";
import { Eye, Heart, Star } from "react-feather";

const ProductCardGrid = ({ product, handleViewProduct }) => {
  return (
    <div className="product-box-3 h-100 text-center border rounded p-3 shadow-sm">
      <div className="product-image mb-3">
        <a href="#" onClick={(e) => { e.preventDefault(); handleViewProduct(product); }}>
          <img
            src={product.imageURL || "../assets/images/cake/product/2.png"}
            className="img-fluid blur-up lazyload"
            alt={product.productName}
            style={{ width: "140px", height: "140px", objectFit: "contain" }}
          />
        </a>
        <ul className="product-option">
          <li data-bs-toggle="tooltip" title="View">
            <a href="#" onClick={(e) => { e.preventDefault(); handleViewProduct(product); }}>
              <Eye size={16} />
            </a>
          </li>
        </ul>
      </div>
      <span className="span-name d-block">vegatable</span>
      <a href="#" onClick={(e) => { e.preventDefault(); handleViewProduct(product); }}>
        <h5 className="name">{product.productName || "Fresh Bread and Pastry Flour 200 g"}</h5>
      </a>
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
        <button className="btn btn-add-cart addcart-button w-80 d-flex justify-content-center align-items-center">
          Add
          <span
            className="add-icon bg-light-gray ms-2 rounded-circle d-flex align-items-center justify-content-center"
            style={{ width: 24, height: 24 }}
          >
            <i className="fa-solid fa-plus" style={{ fontSize: 12 }}></i>
          </span>
        </button>
      </div>
    </div>
  );
};

export default ProductCardGrid;
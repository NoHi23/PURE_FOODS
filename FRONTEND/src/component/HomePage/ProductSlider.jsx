import React, { useEffect } from "react";
import Slider from "react-slick";
import feather from "feather-icons";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const ProductSlider = ({ products, handleViewProduct, toggleWishlist, wishlistMap }) => {

  const settings = {
    dots: true,
    infinite: products?.length > 12,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 4,
    rows: 2,
    onReInit: () => feather.replace(),
    responsive: [
      {
        breakpoint: 1200,
        settings: { slidesToShow: 3, slidesToScroll: 3 },
      },
      {
        breakpoint: 768,
        settings: { slidesToShow: 2, slidesToScroll: 2 },
      },
      {
        breakpoint: 480,
        settings: { slidesToShow: 1, slidesToScroll: 1, rows: 1 },
      },
    ],
  };

  useEffect(() => {
    feather.replace();
  }, [products]);

  if (!products || products.length === 0) {
    return null;
  }

  return (
    <div className="section-b-space">
      <Slider {...settings} className="product-box-slider">
        {products.map((product) => {
          const isWished = Boolean(wishlistMap[product.productId]);

          return (
            <div key={product.productId}>
              <div className="product-box">
                <div className="product-image">
                  <a href="#">
                    <img src={product.imageURL} className="img-fluid blur-up lazyload" alt={product.productName} />
                  </a>
                  <ul className="product-option">
                    <li data-bs-toggle="tooltip" data-bs-placement="top"
                      title="View">
                      <a href="#" onClick={(e) => {
                        e.preventDefault();
                        handleViewProduct(product);
                      }}>
                        <i data-feather="eye"></i>
                      </a>
                    </li>
                    <li data-bs-toggle="tooltip" data-bs-placement="top"
                      title="Compare">
                      <a href="compare.html">
                        <i data-feather="refresh-cw"></i>
                      </a>
                    </li>
                    <li data-bs-toggle="tooltip" data-bs-placement="top"
                      title="Wishlist">
                      <a href="#" onClick={(e) => {
                        e.preventDefault();
                        toggleWishlist(product);
                      }}>
                        <i data-feather="heart" className={isWished ? "fill wishlist-active" : ""}></i>
                      </a>
                    </li>
                  </ul>
                </div>
                <div className="product-detail">
                  <a href="#">
                    <h6 className="name">{product.productName}</h6>
                  </a>
                  <h5 className="sold text-content">
                    <span className="theme-color price">
                      ${product.salePrice != null ? product.salePrice.toFixed(2) : "0.00"}
                    </span>
                    <del>${product.price.toFixed(2)}</del>
                  </h5>


                  <div className="product-rating mt-sm-2 mt-1">
                    <ul className="rating">
                      <li>
                        <i data-feather="star" className="fill"></i>
                      </li>
                      <li>
                        <i data-feather="star" className="fill"></i>
                      </li>
                      <li>
                        <i data-feather="star" className="fill"></i>
                      </li>
                      <li>
                        <i data-feather="star" className="fill"></i>
                      </li>
                      <li>
                        <i data-feather="star"></i>
                      </li>
                    </ul>

                    <h6 className="theme-color">In Stock</h6>
                  </div>
                  <div className="add-to-cart-box">
                    <button className="btn btn-add-cart addcart-button">
                      Add
                      <span className="add-icon">
                        <i className="fa-solid fa-plus"></i>
                      </span>
                    </button>
                    <div className="cart_qty qty-box">
                      <div className="input-group">
                        <button type="button" className="qty-left-minus" data-type="minus" data-field="">
                          <i className="fa fa-minus"></i>
                        </button>
                        <input
                          className="form-control input-number qty-input"
                          type="text"
                          name="quantity"
                          defaultValue="0"
                        />
                        <button type="button" className="qty-right-plus" data-type="plus" data-field="">
                          <i className="fa fa-plus"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </Slider>
    </div>
  );
};

export default ProductSlider;
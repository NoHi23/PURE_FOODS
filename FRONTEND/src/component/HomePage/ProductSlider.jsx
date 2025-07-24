import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import feather from "feather-icons";
import axios from "axios";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useWishlist } from "../../layouts/WishlistContext";

const ProductSlider = ({ products, handleViewProduct, userId }) => {
  const { wishlistMap, setWishlistMap, fetchWishlistCount, refreshWishlist } = useWishlist();
  const [loadingWishlist, setLoadingWishlist] = useState(true);

  const fetchWishlistMap = async () => {
    if (!userId) return;
    try {
      const res = await axios.get(`http://localhost:8082/PureFoods/api/wishlist/${userId}`);
      const map = {};
      res.data.forEach((wl) => {
        map[wl.productId] = wl.wishlistId;
      });
      setWishlistMap(map);
    } catch (error) {
      console.error("Error fetching wishlist map:", error);
    } finally {
      setLoadingWishlist(false);
    }
  };

  useEffect(() => {
    setLoadingWishlist(true);
    fetchWishlistMap();
  }, [userId]);

  useEffect(() => {
    if (!loadingWishlist) {
      setTimeout(() => {
        feather.replace();
      }, 0);
    }
  }, [wishlistMap, loadingWishlist]);

  const toggleWishlist = async (product) => {
    const hasWish = Boolean(wishlistMap[product.productId]);

    try {
      if (hasWish) {
        await axios.put("http://localhost:8082/PureFoods/api/wishlist/delete", {
          wishlistId: wishlistMap[product.productId],
        });
      } else {
        const res = await axios.post("http://localhost:8082/PureFoods/api/wishlist/add", {
          userId,
          productId: product.productId,
        });
      }

      await fetchWishlistCount();
      await refreshWishlist();
      await fetchWishlistMap(); // 👈 cập nhật lại map cho trái tim ❤️

    } catch (err) {
      console.error("Error toggling wishlist:", err);
    }
  };



  const settings = {
    dots: true,
    infinite: products?.length > 12,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 4,
    rows: 2,
    onReInit: () => feather.replace(),
    responsive: [
      { breakpoint: 1200, settings: { slidesToShow: 3, slidesToScroll: 3 } },
      { breakpoint: 768, settings: { slidesToShow: 2, slidesToScroll: 2 } },
      { breakpoint: 480, settings: { slidesToShow: 1, slidesToScroll: 1, rows: 1 } },
    ],
  };

  if (!products || products.length === 0) return null;





  return (
    <div className="section-b-space">
      <Slider {...settings} className="product-box-slider">
        {products.map((product) => {
          const isWished = Boolean(wishlistMap[product.productId]);
          const tooltipText = isWished ? "Remove from Wishlist" : "Add to Wishlist";

          return (
            <div key={product.productId}>
              <div className="product-box">
                <div className="product-image">
                  <a href={`/product/${product.productId}`}>
                    <img
                      src={product.imageURL}
                      className="img-fluid blur-up lazyload"
                      alt={product.productName}
                    />
                  </a>
                  <ul className="product-option">
                    <li data-bs-toggle="tooltip" title="View">
                      <a href="#" onClick={(e) => { e.preventDefault(); handleViewProduct(product); }}>
                        <i data-feather="eye"></i>
                      </a>
                    </li>
                    <li>
                      <a >
                        <i data-feather="refresh-cw"></i>
                      </a>
                    </li>
                    <li data-bs-toggle="tooltip" title={tooltipText}>
                      <a href="#" onClick={(e) => {
                        e.preventDefault();
                        toggleWishlist(product);
                      }}>
                        <i className={`fa${isWished ? 's' : 'r'} fa-heart wishlist-icon ${isWished ? 'text-danger' : ''}`}></i>
                      </a>
                    </li>
                  </ul>
                </div>

                <div >
                  <a href={`/product/${product.productId}`}><h6 className="name">{product.productName}</h6></a>
                  <h5 className="sold text-content">
                    <span className="theme-color price">
                      ${product.salePrice?.toFixed(2) || "0.00"}
                    </span>
                    <del>${product.price.toFixed(2)}</del>
                  </h5>
                  <div className="product-rating mt-sm-2 mt-1">
                    <ul className="rating">
                      {[1, 2, 3, 4].map(i => (
                        <li key={i}><i data-feather="star" className="fill" /></li>
                      ))}
                      <li><i data-feather="star" /></li>
                    </ul>
                    <h6 className="theme-color">
                      {product?.stockQuantity === 0
                        ? 'Out of Stock'
                        : `${product?.stockQuantity} In Stock`}
                    </h6>                  </div>
                  <div className="add-to-cart-box">
                    <button className="btn btn-add-cart addcart-button">
                      Add
                      <span className="add-icon">
                        <i className="fa-solid fa-plus"></i>
                      </span>
                    </button>
                    <div className="cart_qty qty-box">
                      <div className="input-group">
                        <button className="qty-left-minus"><i className="fa fa-minus"></i></button>
                        <input className="form-control input-number qty-input" type="text" defaultValue="0" />
                        <button className="qty-right-plus"><i className="fa fa-plus"></i></button>
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

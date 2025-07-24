import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import feather from "feather-icons";
import axios from "axios";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useWishlist } from "../../layouts/WishlistContext";
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";


const ProductSlider = ({ products, handleViewProduct, userId }) => {
  const { wishlistMap, setWishlistMap, fetchWishlistCount, refreshWishlist } = useWishlist();
  const [loadingWishlist, setLoadingWishlist] = useState(true);
  const [cartQuantities, setCartQuantities] = useState({});
  const navigate = useNavigate();


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


  const handleManualQuantityChange = async (product, value) => {
    const newQty = parseInt(value);

    if (isNaN(newQty) || newQty < 1) {
      toast.warning("Số lượng phải ≥ 1");
      return;
    }

    if (newQty > product.stockQuantity) {
      toast.warning(`Chỉ còn ${product.stockQuantity} sản phẩm trong kho`);
      return;
    }

    try {
      // Lấy giỏ hàng hiện tại để kiểm tra đã có sản phẩm chưa
      const res = await axios.get(`http://localhost:8082/PureFoods/api/cart/user/${userId}`);
      const existingItem = res.data.find(item => item.productID === product.productId);

      const cartItem = {
        userID: userId,
        productID: product.productId,
        quantity: newQty,
        priceAfterDiscount: product.salePrice,
        total: product.salePrice * newQty,
        imageURL: product.imageURL,
        productName: product.productName,
        originalPrice: product.price,
        discount: product.discountPercent,
      };

      if (existingItem) {
        // 🔁 update
        await axios.put(`http://localhost:8082/PureFoods/api/cart/update/${existingItem.cartItemID}`, cartItem);
      } else {
        // 🆕 create
        await axios.post("http://localhost:8082/PureFoods/api/cart/create", cartItem);
      }

      setCartQuantities(prev => ({ ...prev, [product.productId]: newQty }));
      toast.success("Cập nhật giỏ hàng thành công");
      window.dispatchEvent(new Event("cartUpdated"));

    } catch (err) {
      toast.error("Lỗi khi cập nhật giỏ hàng");
      console.error(err);
    }
  };



  const updateQuantity = async (product, delta) => {
    if (!userId) {
      toast.error("Vui lòng đăng nhập");
      return;
    }

    try {
      const res = await axios.get(`http://localhost:8082/PureFoods/api/cart/user/${userId}`);
      const cartItems = res.data;
      const existingItem = cartItems.find(item => item.productID === product.productId);
      const currentQty = existingItem ? existingItem.quantity : 0;
      const newQty = currentQty + delta;

      if (newQty < 1) return;

      if (newQty > product.stockQuantity) {
        toast.warning(`Chỉ còn ${product.stockQuantity - currentQty} sản phẩm trong kho`);
        return;
      }

      const cartItem = {
        userID: userId,
        productID: product.productId,
        quantity: newQty,
        priceAfterDiscount: product.salePrice,
        total: product.salePrice * newQty,
        imageURL: product.imageURL,
        productName: product.productName,
        originalPrice: product.price,
        discount: product.discountPercent,
      };

      if (existingItem) {
        await axios.put(`http://localhost:8082/PureFoods/api/cart/update/${existingItem.cartItemID}`, cartItem);
      } else {
        await axios.post(`http://localhost:8082/PureFoods/api/cart/create`, cartItem);
      }

      setCartQuantities(prev => ({ ...prev, [product.productId]: newQty }));
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (err) {
      toast.error("Cập nhật giỏ hàng thất bại");
      console.error(err);
    }
  };



  const handleAddToCart = async (product) => {
    if (!userId) {
      toast.error("Vui lòng đăng nhập");
      return;
    }

    try {
      const res = await axios.get(`http://localhost:8082/PureFoods/api/cart/user/${userId}`);
      const cartItems = res.data;
      const existingItem = cartItems.find(item => item.productID === product.productId);
      const currentQty = existingItem ? existingItem.quantity : 0;
      const newQty = currentQty + 1;

      if (newQty > product.stockQuantity) {
        toast.warning(`Chỉ còn ${product.stockQuantity - currentQty} sản phẩm trong kho`);
        return;
      }

      const cartItem = {
        userID: userId,
        productID: product.productId,
        quantity: newQty,
        priceAfterDiscount: product.salePrice,
        total: product.salePrice * newQty,
        imageURL: product.imageURL,
        productName: product.productName,
        originalPrice: product.price,
        discount: product.discountPercent,
      };

      if (existingItem) {
        await axios.put(`http://localhost:8082/PureFoods/api/cart/update/${existingItem.cartItemID}`, cartItem);
      } else {
        await axios.post("http://localhost:8082/PureFoods/api/cart/create", cartItem);
      }

      setCartQuantities(prev => ({ ...prev, [product.productId]: newQty }));
      toast.success("Đã thêm vào giỏ hàng");
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (err) {
      toast.error("Thêm vào giỏ hàng thất bại");
      console.error(err);
    }
  };




  useEffect(() => {
    if (!userId) return;
    axios.get(`http://localhost:8082/PureFoods/api/cart/user/${userId}`)
      .then(res => {
        const map = {};
        res.data.forEach(item => {
          map[item.productID] = item.quantity;
        });
        setCartQuantities(map);
      });
  }, [userId]);


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
                    <button
                      className="btn btn-add-cart addcart-button"
                      onClick={() => handleAddToCart(product)}
                    >
                      Add
                      <span className="add-icon">
                        <i className="fa-solid fa-plus"></i>
                      </span>
                    </button>
                    <div className="cart_qty qty-box mt-2">
                      <div className="input-group justify-content-center">
                        <button className="qty-left-minus btn btn-sm btn-light"
                          onClick={() => updateQuantity(product, -1)}>
                          <i className="fa fa-minus"></i>
                        </button>
                        <input
                          className="form-control input-number qty-input text-center"
                          type="number"
                          min="1"
                          max={product.stockQuantity}
                          value={cartQuantities[product.productId] || 1}
                          onChange={(e) => handleManualQuantityChange(product, e.target.value)}
                          style={{ width: "60px" }}
                        />
                        <button className="qty-right-plus btn btn-sm btn-light"
                          onClick={() => updateQuantity(product, 1)}>
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

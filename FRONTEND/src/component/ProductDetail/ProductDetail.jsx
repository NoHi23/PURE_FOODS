import React, { useEffect, useRef, useState } from 'react'

import { useParams } from 'react-router-dom';
import ProductDetailLayout from '../../layouts/ProductDetailLayout'
import axios from 'axios';
import { toast } from 'react-toastify';
import './ProductDetail.css'
import { useWishlist } from '../../layouts/WishlistContext';
import { useNavigate } from 'react-router-dom';
import * as bootstrap from "bootstrap";
import StarRating from "../Rating/StarRating";
import feather from 'feather-icons'; // Install nếu chưa: npm i feather-icons


const ProductDetail = () => {
  const { id } = useParams();
  const [products, setProducts] = useState(null);
  const [avgRating, setAvgRating] = useState(null);
  const [reviewCount, setReviewCount] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [selectedRating, setSelectedRating] = useState(0); // Rating chọn (1-5)
  const [reviewComment, setReviewComment] = useState(''); // Nội dung comment
  const [isSubmitting, setIsSubmitting] = useState(false); // Loading state khi submit
  const [refreshReviews, setRefreshReviews] = useState(0);

  const { wishlistMap, setWishlistMap, fetchWishlistCount, refreshWishlist } = useWishlist();
  const [isWished, setIsWished] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.userId;
  const [selectedImage, setSelectedImage] = useState(null);
  const [cartQuantities, setCartQuantities] = useState({});
  const [quantity, setQuantity] = useState(1);

  const increaseQty = () => {
    if (products && quantity < products.stockQuantity) {
      setQuantity(prev => prev + 1);
    } else {
      toast.warning("Đã đạt số lượng tối đa trong kho");
    }
  };

  const decreaseQty = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const navigate = useNavigate();


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


  const handleAddToCart1 = async (product) => {
    if (!userId) {
      toast.error("Vui lòng đăng nhập");
      return;
    }

    try {
      const res = await axios.get(`http://localhost:8082/PureFoods/api/cart/user/${userId}`);
      const cartItems = res.data;
      const existingItem = cartItems.find(item => item.productID === product.productId);
      const currentQty = existingItem ? existingItem.quantity : 0;
      const totalQty = currentQty + quantity;

      if (totalQty > product.stockQuantity) {
        toast.warning(`Chỉ còn ${product.stockQuantity - currentQty} sản phẩm trong kho`);
        return;
      }

      const cartItem = {
        userID: userId,
        productID: product.productId,
        quantity: totalQty,
        priceAfterDiscount: product.salePrice,
        total: product.salePrice * totalQty,
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

      toast.success("Đã thêm vào giỏ hàng");
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (err) {
      toast.error("Thêm vào giỏ hàng thất bại");
      console.error(err);
    }
  };


  useEffect(() => {
    if (quantity < 1 || isNaN(quantity)) {
      setQuantity(1);
    }
  }, [quantity]);


  useEffect(() => {
    window.scrollTo(0, 0); // Scroll lên đầu
    document.body.style.overflow = 'auto'; // Cho phép cuộn lại nếu bị khoá
  }, []);


  useEffect(() => {
    axios
      .get(`http://localhost:8082/PureFoods/api/product/getById/${id}`)
      .then((res) => {
        if (res.data.product) {
          setProducts(res.data.product);
        } else {
          toast.error("Product not found");
        }
      })
      .catch((err) => {
        console.error(err);
        toast.error("Error loading product");
      });
  }, [id]);

  useEffect(() => {
    if (products?.productId) {
      axios
        .get(`http://localhost:8082/PureFoods/api/review/product?productId=${products.productId}`)
        .then(res => {
          const reviewList = res.data || [];
          setReviews(reviewList);
          setReviewCount(reviewList.length);

          if (reviewList.length > 0) {
            const total = reviewList.reduce((acc, r) => acc + r.rating, 0);
            const avg = total / reviewList.length;
            setAvgRating(Number(avg.toFixed(2)));
          } else {
            setAvgRating(0);
          }
        })
        .catch(err => {
          console.error("❌ Lỗi khi lấy đánh giá:", err);
          setReviews([]);
          setReviewCount(0);
          setAvgRating(0);
        });
    }
  }, [products, refreshReviews]); // Thêm refreshReviews để reload


  const [thumbnailList, setThumbnailList] = useState([]);

  useEffect(() => {
    const fetchThumbnails = async () => {
      if (products?.productId && products?.imageURL) {
        try {
          const response = await axios.get(
            `http://localhost:8082/PureFoods/api/productImage/all/${products.productId}`
          );

          const apiThumbnails = response.data.map((img) => img.imageUrl);

          const thumbnails = [products.imageURL, ...apiThumbnails];

          setThumbnailList(thumbnails);
          setSelectedImage(thumbnails[0]);
        } catch (error) {
          console.error("Lỗi khi lấy ảnh sản phẩm:", error);

          const thumbnails = [
            products.imageURL,
          ];
          setThumbnailList(thumbnails);
          setSelectedImage(thumbnails[0]);
        }
      }
    };

    fetchThumbnails();
  }, [products]);

  const zoomRef = useRef();

  const handleMouseMove = (e) => {
    const { left, top, width, height } = zoomRef.current.getBoundingClientRect();
    const x = ((e.pageX - left - window.scrollX) / width) * 100;
    const y = ((e.pageY - top - window.scrollY) / height) * 100;
    zoomRef.current.style.backgroundPosition = `${x}% ${y}%`;
  };

  const handleMouseEnter = () => {
    zoomRef.current.style.backgroundSize = "200%";
  };

  const handleMouseLeave = () => {
    zoomRef.current.style.backgroundSize = "cover";
  };

  const fetchWishlistStatus = async () => {
    if (!products || !userId) return;
    try {
      const res = await axios.get(`http://localhost:8082/PureFoods/api/wishlist/${userId}`);
      const map = {};
      res.data.forEach((wl) => {
        map[wl.productId] = wl.wishlistId;
      });
      setWishlistMap(map);
      setIsWished(Boolean(map[products.productId]));
    } catch (err) {
      console.error("Wishlist fetch failed", err);
    }
  };

  useEffect(() => {
    fetchWishlistStatus();
  }, [products, userId]);

  const toggleWishlist = async () => {
    try {
      if (isWished) {
        await axios.put("http://localhost:8082/PureFoods/api/wishlist/delete", {
          wishlistId: wishlistMap[products.productId],
        });
      } else {
        await axios.post("http://localhost:8082/PureFoods/api/wishlist/add", {
          userId,
          productId: products.productId,
        });
      }

      await fetchWishlistCount();
      await refreshWishlist();
      await fetchWishlistStatus();
    } catch (err) {
      console.error("Error toggling wishlist:", err);
    }
  };
  useEffect(() => {
    if (products && wishlistMap) {
      setIsWished(Boolean(wishlistMap[products.productId]));
    }
  }, [wishlistMap, products]);

  //end wishlist

  const [isDragging, setIsDragging] = useState(false);

  const carouselRef = useRef();

  useEffect(() => {
    const container = carouselRef.current;
    if (!container) return;

    let isDown = false;
    let startX;
    let scrollLeft;

    const handleMouseDown = (e) => {
      isDown = true;
      startX = e.pageX - container.offsetLeft;
      scrollLeft = container.scrollLeft;
    };

    const handleMouseLeave = () => {
      isDown = false;
    };
    const handleMouseUp = () => {
      isDown = false;
    };
    const handleMouseMove = (e) => {
      if (!isDown) return;
      const x = e.pageX - container.offsetLeft;
      const walk = (x - startX) * 2;
      container.scrollLeft = scrollLeft - walk;
    };

    container.addEventListener("mousedown", handleMouseDown);
    container.addEventListener("mouseleave", handleMouseLeave);
    container.addEventListener("mouseup", handleMouseUp);
    container.addEventListener("mousemove", handleMouseMove);

    return () => {
      container.removeEventListener("mousedown", handleMouseDown);
      container.removeEventListener("mouseleave", handleMouseLeave);
      container.removeEventListener("mouseup", handleMouseUp);
      container.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);


  const [productsRelated, setProductsRelated] = useState([]);

  useEffect(() => {
    axios.get(`http://localhost:8082/PureFoods/api/product/related/${id}`)
      .then(response => {
        setProductsRelated(response.data.relatedProducts);
      })
      .catch(error => {
        console.error("Error fetching related products:", error);
      });
  }, []);

  const [categoryMap, setCategoryMap] = useState({});
  useEffect(() => {
    const fetchAllCategories = async () => {
      const promises = productsRelated.map(async product => {
        const res = await axios.get(`http://localhost:8082/PureFoods/api/category/${product.categoryId}`);
        return { productId: product.productId, category: res.data };
      });

      const results = await Promise.all(promises);
      const map = {};
      results.forEach(r => {
        map[r.productId] = r.category;
      });
      setCategoryMap(map);
    };

    if (productsRelated?.length > 0) {
      fetchAllCategories();
    }
  }, [productsRelated]);


  const handleViewDetail = (productId) => {
    const modalEl = document.getElementById("view");
    if (modalEl && bootstrap.Modal.getInstance(modalEl)) {
      bootstrap.Modal.getInstance(modalEl).hide();
    }

    navigate(`/product/${productId}`);
  };

  const handleViewProduct = (product) => {
    setSelectedProduct(product);
    const modal = new bootstrap.Modal(document.getElementById("view"));
    modal.show();
    console.log("hi: " + product);
  };

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [category, setCategory] = useState(null);
  useEffect(() => {
    const fetchCategory = async () => {
      if (selectedProduct?.categoryId) {
        try {
          const res = await axios.get(`http://localhost:8082/PureFoods/api/category/${selectedProduct.categoryId}`);
          setCategory(res.data);
        } catch (err) {
          console.error("Không thể lấy danh mục:", err);
          setCategory(null);
        }
      }
    };

    fetchCategory();
  }, [selectedProduct]);

  const [supplier, setSupplier] = useState(null);
  useEffect(() => {
    const fetchSuppliers = async () => {
      if (selectedProduct?.supplierId) {
        try {
          const res = await axios.get(`http://localhost:8082/PureFoods/api/supplier/${selectedProduct.supplierId}`);
          setSupplier(res.data);
        } catch (err) {
          console.error("Không thể lấy:", err);
          setSupplier(null);
        }
      }
    };

    fetchSuppliers();
  }, [selectedProduct]);

  const handleSubmitReview = async () => {
    let hasError = false;
    if (selectedRating < 1) {
      toast.warning("Vui lòng chọn rating");
      hasError = true;
    }
    if (reviewComment.trim() === '') {
      toast.warning("Vui lòng viết nội dung");
      hasError = true;
    }
    if (hasError) return;

    setIsSubmitting(true);
    try {
      const reviewData = {
        productId: products.productId,
        customerId: userId,
        rating: selectedRating,
        comment: reviewComment,
      };

      await axios.post('http://localhost:8082/PureFoods/api/review/create', reviewData);
      toast.success("Đánh giá đã được gửi thành công!");

      // Reset form
      setSelectedRating(0);
      setReviewComment('');

      // Đóng modal
      const modalEl = document.getElementById('writereview');
      if (modalEl) {
        bootstrap.Modal.getInstance(modalEl).hide();
      }

      // Reload reviews
      setRefreshReviews(prev => prev + 1);
    } catch (err) {
      toast.error("Gửi đánh giá thất bại");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };
  useEffect(() => {
    feather.replace(); // Re-render icons khi rating change
  }, [selectedRating]);
  return (
    <ProductDetailLayout>
      <div>
        <div className="mobile-menu d-md-none d-block mobile-cart">
          <ul>
            <li className="active">
              <a href="index.html">
                <i className="iconly-Home icli"></i>
                <span>Home</span>
              </a>
            </li>

            <li className="mobile-category">
              <a href="javascript:void(0)">
                <i className="iconly-Category icli js-link"></i>
                <span>Category</span>
              </a>
            </li>

            <li>
              <a href="search.html" className="search-box">
                <i className="iconly-Search icli"></i>
                <span>Search</span>
              </a>
            </li>

            <li>
              <a href="wishlist.html" className="notifi-wishlist">
                <i className="iconly-Heart icli"></i>
                <span>My Wish</span>
              </a>
            </li>

            <li>
              <a href="cart.html">
                <i className="iconly-Bag-2 icli fly-cate"></i>
                <span>Cart</span>
              </a>
            </li>
          </ul>
        </div>
        <section className="breadcrumb-section pt-0">
          <div className="container-fluid-lg">
            <div className="row">
              <div className="col-12">
                <div className="breadcrumb-contain">
                  <h2>{products?.productName}</h2>
                  <nav>
                    <ol className="breadcrumb mb-0">
                      <li className="breadcrumb-item">
                        <a href="/">
                          <i className="fa-solid fa-house"></i>
                        </a>
                      </li>

                      <li className="breadcrumb-item active">{products?.productName}</li>
                    </ol>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="product-section">
          <div className="container-fluid-lg">
            <div className="row">
              <div className="col-xxl-9 col-xl-8 col-lg-7 wow fadeInUp">
                <div className="row g-4">
                  <div className="col-xl-6 wow fadeInUp">
                    <div className="product-left-box">
                      <div className="product-left-box">
                        <div className="row g-sm-4 g-2">
                          <div className="col-12">
                            <div
                              className="zoom-image"
                              ref={zoomRef}
                              style={{ backgroundImage: `url(${selectedImage})` }}
                              onMouseMove={handleMouseMove}
                              onMouseEnter={handleMouseEnter}
                              onMouseLeave={handleMouseLeave}
                            >
                              <img src={selectedImage} alt="" className="main-preview-img" />
                            </div>
                          </div>

                          <div className="col-12">
                            <div className="thumbnail-carousel" ref={carouselRef}>
                              {thumbnailList.map((img, idx) => (
                                <div
                                  className="thumbnail-item"
                                  key={idx}
                                  onClick={(e) => {
                                    setSelectedImage(img);

                                    // 👉 Auto scroll into view (ảnh được chọn sẽ cuộn tới vị trí phù hợp)
                                    e.currentTarget.scrollIntoView({
                                      behavior: "smooth",
                                      inline: "center", // hoặc 'nearest', 'start', 'end'
                                      block: "nearest",
                                    });
                                  }}
                                >
                                  <img
                                    src={img}
                                    alt=""
                                    className={`thumbnail-img ${selectedImage === img ? "active" : ""}`}
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-xl-6 wow fadeInUp">
                    <div className="right-box-contain">
                      <button
                        className="wishlist-button-fixed"
                        title={isWished ? "Remove from Wishlist" : "Add to Wishlist"}
                        onClick={toggleWishlist}
                      >
                        <i className={`fa${isWished ? "s" : "r"} fa-heart`}></i>
                      </button>
                      <h6 className="offer-top">{products?.discountPercent}% Off</h6>
                      <h2 className="name">{products?.productName}</h2>
                      <div className="price-rating">
                        <h3 className="theme-color price">
                          ${products?.salePrice} <del className="text-content">${products?.price}</del>
                        </h3>
                        {avgRating !== null && (
                          <div className="d-flex align-items-center gap-2">
                            <StarRating rating={avgRating} />
                            <span className="text-muted small">
                              {avgRating.toFixed(1)} / 5 ({reviewCount} đánh giá)
                            </span>
                          </div>
                        )}


                      </div>

                      <div className="product-contain">
                        <p className="w-100">{products?.description}</p>
                      </div>

                      {/* <div className="product-package">
                        <div className="product-title">
                          <h4>Weight </h4>
                        </div>

                        <div className="select-package">
                          <select className="form-control form-select">
                            <option selected>Choose Liter</option>
                            <option value="0">5 Liter</option>
                            <option value="1">10 Liter</option>
                            <option value="1">15 Liter</option>
                            <option value="1">25 Liter</option>
                          </select>
                        </div>
                      </div> */}

                      <div
                        className="time deal-timer product-deal-timer mx-md-0 mx-auto"
                        id="clockdiv-1"
                        data-hours="1"
                        data-minutes="2"
                        data-seconds="3"
                      >
                        <div className="product-title">
                          <h4>Nhanh lên! Khuyến mại kết thúc vào</h4>
                        </div>
                        <ul>
                          <li>
                            <div className="counter d-block">
                              <div className="days d-block">
                                <h5></h5>
                              </div>
                              <h6>Ngày</h6>
                            </div>
                          </li>
                          <li>
                            <div className="counter d-block">
                              <div className="hours d-block">
                                <h5></h5>
                              </div>
                              <h6>Giờ</h6>
                            </div>
                          </li>
                          <li>
                            <div className="counter d-block">
                              <div className="minutes d-block">
                                <h5></h5>
                              </div>
                              <h6>Phút</h6>
                            </div>
                          </li>
                          <li>
                            <div className="counter d-block">
                              <div className="seconds d-block">
                                <h5></h5>
                              </div>
                              <h6>Giây</h6>
                            </div>
                          </li>
                        </ul>
                      </div>

                      <div className="note-box product-package">
                        <div className="cart_qty qty-box product-qty m-0">
                          <div className="input-group h-100">
                            <button type="button" className="qty-left-minus" onClick={decreaseQty} min={1}>
                              <i className="fa fa-minus"></i>
                            </button>

                            <input
                              className="form-control input-number qty-input"
                              type="text"
                              name="quantity"
                              value={quantity}
                              readOnly
                            />

                            <button type="button" className="qty-right-plus" onClick={increaseQty}>
                              <i className="fa fa-plus"></i>
                            </button>
                          </div>
                        </div>

                        <button onClick={() => handleAddToCart1(products)} className="btn btn-md bg-dark cart-button text-white w-100">
                          Thêm vào giỏ hàng
                        </button>
                      </div>

                      <div className="payment-option">
                        <div className="product-title">
                          <h4>Thanh toán an toàn được đảm bảo</h4>
                        </div>
                        <ul>
                          <li>
                            <a href="javascript:void(0)">
                              <img src="../assets/images/product/payment/1.svg" className="blur-up lazyload" alt="" />
                            </a>
                          </li>
                          <li>
                            <a href="javascript:void(0)">
                              <img src="../assets/images/product/payment/2.svg" className="blur-up lazyload" alt="" />
                            </a>
                          </li>
                          <li>
                            <a href="javascript:void(0)">
                              <img src="../assets/images/product/payment/3.svg" className="blur-up lazyload" alt="" />
                            </a>
                          </li>
                          <li>
                            <a href="javascript:void(0)">
                              <img src="../assets/images/product/payment/4.svg" className="blur-up lazyload" alt="" />
                            </a>
                          </li>
                          <li>
                            <a href="javascript:void(0)">
                              <img src="../assets/images/product/payment/5.svg" className="blur-up lazyload" alt="" />
                            </a>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-xxl-3 col-xl-4 col-lg-5 d-none d-lg-block wow fadeInUp">
                <div className="right-sidebar-box">
                  <div className="vendor-box">
                    <div className="vendor-contain">
                      <div className="vendor-image">
                        <img src="../../assets/images/logo/1.png" className="blur-up lazyload" alt="" />
                      </div>

                      <div className="vendor-name">
                        <h5 className="fw-500">Clean Food Shop</h5>

                        <div className="product-rating mt-1">
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
                          <span>(9999+ đánh giá)</span>
                        </div>
                      </div>
                    </div>

                    <p className="vendor-detail">
                      Clean Food Shop là một nhà hàng Việt Nam bình dân, phục vụ các món mì và mì ống quốc tế và Việt Nam.
                    </p>

                    <div className="vendor-list">
                      <ul>
                        <li>
                          <div className="address-contact">
                            <i data-feather="map-pin"></i>
                            <h5>
                              Địa chỉ:{" "}
                              <span className="text-content">
                                Khu Giáo dục và Đào tạo - Khu Công nghệ cao Hòa Lạc - Km29 Đại lộ Thăng Long, xã Hòa
                                Lạc, TP. Hà Nội
                              </span>
                            </h5>
                          </div>
                        </li>

                        <li>
                          <div className="address-contact">
                            <i data-feather="headphones"></i>
                            <h5>
                              Liên hệ người bán: <span className="text-content">1900 6789</span>
                            </h5>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="pt-25">
                    <div className="hot-line-number">
                      <h5>Hotline đặt hàng:</h5>
                      <h6>Thứ 2 - Thứ 6: 07:00 sáng - 08:30 tối</h6>
                      <h3>1900 6789</h3>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section>
          <div className="container-fluid-lg">
            <div className="row">
              <div className="col-12">
                <div className="product-section-box m-0">
                  <ul className="nav nav-tabs custom-nav" id="myTab" role="tablist">
                    <li className="nav-item" role="presentation">
                      <button
                        className="nav-link active"
                        id="description-tab"
                        data-bs-toggle="tab"
                        data-bs-target="#description"
                        type="button"
                        role="tab"
                      >
                        Mô tả
                      </button>
                    </li>

                    <li className="nav-item" role="presentation">
                      <button
                        className="nav-link"
                        id="care-tab"
                        data-bs-toggle="tab"
                        data-bs-target="#care"
                        type="button"
                        role="tab"
                      >
                        Hướng dẫn chăm sóc
                      </button>
                    </li>

                    <li className="nav-item" role="presentation">
                      <button
                        className="nav-link"
                        id="review-tab"
                        data-bs-toggle="tab"
                        data-bs-target="#review"
                        type="button"
                        role="tab"
                      >
                        Đánh giá
                      </button>
                    </li>
                  </ul>

                  <div className="tab-pane fade" id="review" role="tabpanel">
                    <div className="review-box">
                      <div className="row">
                        {/* Cột trái: Tổng kết đánh giá */}
                        <div className="col-xl-5">
                          <div className="product-rating-box">
                            <div className="row">
                              <div className="col-xl-12">
                                <div className="product-main-rating d-flex align-items-center gap-2">
                                  {avgRating !== null ? (
                                    <>
                                      <StarRating rating={avgRating} />
                                      <h2>{avgRating.toFixed(1)} / 5</h2>
                                    </>
                                  ) : (
                                    <h2>0.00 / 5 <i data-feather="star"></i></h2>
                                  )}
                                  <h5>({reviewCount} đánh giá)</h5>
                                </div>
                              </div>

                              <div className="col-xl-12">
                                <ul className="product-rating-list">
                                  {[5, 4, 3, 2, 1].map((star) => {
                                    const count = reviews.filter((r) => (r.rating || 0) === star).length;
                                    const percentage = reviewCount > 0 ? (count / reviewCount) * 100 : 0;
                                    return (
                                      <li key={star}>
                                        <div className="rating-product d-flex align-items-center">
                                          <h5 className="me-2">
                                            {star}
                                          </h5>
                                          <i data-feather="star" className="fill me-2"></i> {/* Icon sao cho trực quan */}
                                          <div className="progress flex-grow-1">
                                            <div className="progress-bar" style={{ width: `${percentage}%` }}></div>
                                          </div>
                                          <h5 className="total ms-2">{count}</h5>
                                        </div>
                                      </li>
                                    );
                                  })}
                                </ul>

                                <div className="review-title-2">
                                  <h4 className="fw-bold">Đánh giá sản phẩm</h4>
                                  <p>Hãy để lại cảm nhận của bạn về sản phẩm</p>
                                  <button
                                    className="btn"
                                    type="button"
                                    onClick={() => {
                                      const modal = new bootstrap.Modal(document.getElementById('writereview'));
                                      modal.show();
                                    }}
                                  >
                                    Viết đánh giá
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Cột phải: Danh sách đánh giá */}
                        <div className="col-xl-7">
                          <div className="review-people">
                            <ul className="review-list">
                              {reviews.length === 0 && (
                                <p className="text-muted">Chưa có đánh giá nào cho sản phẩm này.</p>
                              )}
                              {reviews.map((review, index) => {
                                // Helper để format createdAt từ mảng thành Date
                                let formattedDate = "Không xác định thời gian";
                                if (Array.isArray(review.createdAt) && review.createdAt.length >= 6) {
                                  const [year, month, day, hour, min, sec, nano = 0] = review.createdAt;
                                  const millis = Math.floor(nano / 1000000); // Chuyển nano sang milli
                                  const reviewDate = new Date(year, month - 1, day, hour, min, sec, millis); // Tháng trừ 1 (0-based)
                                  if (!isNaN(reviewDate)) {
                                    // Format absolute
                                    const absoluteDate = new Intl.DateTimeFormat("vi-VN", {
                                      year: "numeric",
                                      month: "2-digit",
                                      day: "2-digit",
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    }).format(reviewDate);

                                    // Tính relative time dựa trên current date July 25, 2025 (chi tiết hơn)
                                    const currentDate = new Date(2025, 6, 25); // July là month 6 (0-based)
                                    const timeDiff = currentDate - reviewDate;
                                    const daysAgo = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
                                    const relative = daysAgo > 0 ? `(${daysAgo} ngày trước)` : "(Mới đây)";

                                    formattedDate = `${absoluteDate} ${relative}`;
                                  }
                                }

                                return (
                                  <li key={review.reviewId || index}>
                                    <div className="people-box">
                                      <div>
                                        <div className="people-image people-text">
                                          <img
                                            alt="user"
                                            className="img-fluid"
                                            src="/assets/images/review/default.jpg"
                                          />
                                        </div>
                                      </div>
                                      <div className="people-comment">
                                        <div className="people-name">
                                          <span className="name fw-bold">{review.customerName || "Ẩn danh"}</span>
                                          <div className="date-time">
                                            <h6 className="text-content">{formattedDate}</h6>
                                            <div className="product-rating">
                                              <ul className="rating">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                  <li key={star}>
                                                    <i
                                                      data-feather="star"
                                                      className={(review.rating || 0) >= star ? "fill" : ""}
                                                    ></i>
                                                  </li>
                                                ))}
                                              </ul>
                                            </div>
                                          </div>
                                        </div>
                                        <div className="reply">
                                          <p>{review?.comment || "Không có nội dung đánh giá."}</p>
                                        </div>
                                      </div>
                                    </div>
                                  </li>
                                );
                              })}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>


                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="product-list-section section-b-space">
          <div className="container-fluid-lg">
            <div className="title">
              <h2>Sản phẩm liên quan</h2>
              <span className="title-leaf">
                <svg className="icon-width"></svg>
              </span>
            </div>
            <div className="related-scroll-container">
              {productsRelated?.map(product => (
                <div className="product-box" style={{ minWidth: "250px" }} key={product.productId}>
                  <div className="">
                    <div className="product-header">
                      <div className="product-image">
                        <a href={`/product/${product.productId}`}>
                          <img
                            src={product.imageURL}
                            className="img-fluid blur-up lazyload"
                            alt={product.productName}
                          />
                        </a>

                        <ul className="product-option">
                          <li data-bs-toggle="tooltip" data-bs-placement="top" title="View">
                            <li data-bs-toggle="tooltip" title="View">
                              <a href="#" onClick={(e) => { e.preventDefault(); handleViewProduct(product); }}>
                                <i data-feather="eye"></i>
                              </a>
                            </li>
                          </li>
                          <li data-bs-toggle="tooltip" data-bs-placement="top" title="Compare">
                            <a >
                              <i data-feather="refresh-cw"></i>
                            </a>
                          </li>
                          <li data-bs-toggle="tooltip" data-bs-placement="top" title="Wishlist">
                            <li data-bs-toggle="tooltip" data-bs-placement="top" title="Wishlist">
                              <button onClick={toggleWishlist} className="wishlist-btn" style={{ background: 'none', border: 'none' }}>
                                <i className={`fa${isWished ? 's' : 'r'} fa-heart wishlist-icon ${isWished ? 'text-danger' : ''}`}></i>
                              </button>
                            </li>

                          </li>
                        </ul>
                      </div>
                    </div>

                    <div className="product-footer">
                      <div >
                        <span className="span-name"><span>{categoryMap[product.productId]?.categoryName}</span>
                        </span>
                        <a href={`/product/${product.productId}`}>
                          <h5 className="name">{product.productName}</h5>
                        </a>
                        <div className="product-rating mt-2">
                          <ul className="rating">
                            {[...Array(5)].map((_, i) => (
                              <li key={i}><i data-feather="star" className="fill"></i></li>
                            ))}
                          </ul>
                          <span>(5.0)</span>
                        </div>
                        <h5 className="price">
                          <span className="theme-color">${product.salePrice} <del>${product.price}</del></span>
                        </h5>

                        <div className="add-to-cart-box">
                          <button
                            className="btn btn-add-cart addcart-button"
                            onClick={() => handleAddToCart(product)}
                          >
                            Thêm
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
                </div>
              ))}
            </div>

          </div>
        </section>




        <div className="modal fade theme-modal view-modal" id="view" tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered modal-xl modal-fullscreen-sm-down">
            <div className="modal-content">
              <div className="modal-header p-0">
                <button type="button" className="btn-close" data-bs-dismiss="modal">
                  <i className="fa-solid fa-xmark"></i>
                </button>
              </div>
              <div className="modal-body">
                <div className="row g-sm-4 g-2">
                  <div className="col-lg-6">
                    <div className="slider-image">
                      <img src={selectedProduct?.imageURL} className="img-fluid blur-up lazyload" alt="" />
                    </div>
                  </div>

                  <div className="col-lg-6">
                    <div className="right-sidebar-modal">
                      <h4 className="title-name">{selectedProduct?.productName}</h4>
                      <h4 className="price theme-color ">
                        ${selectedProduct?.salePrice?.toFixed(2)}{" "}
                        <del className="text-muted ">${selectedProduct?.price}</del>
                      </h4>

                      <div className="product-rating">
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
                        <span className="ms-2">8 đánh giá</span>
                        <span className="ms-2 text-danger">6 đã bán trong 16 giờ qua</span>
                      </div>

                      <div className="product-detail">
                        <p>{selectedProduct?.description || "No description available."}</p>
                      </div>

                      <ul className="brand-list">
                        <li>
                          <div className="brand-box">
                            <h5>Tên danh mục:</h5>
                            <h6 className="mb-3">{category?.categoryName || "Đang tải..."}</h6>
                          </div>
                        </li>
                        <li>
                          <div className="brand-box">
                            <h5>Tên nhà cung cấp:</h5>
                            <h6 className="mb-3">{supplier?.supplierName || "Đang tải..."}</h6>
                          </div>
                        </li>
                      </ul>

                      <ul className="brand-list">
                        <li>
                          <div className="brand-box">
                            <h5>Số lượng hàng tồn kho:</h5>
                            <h6 className="mb-3">{selectedProduct?.stockQuantity || "Đang tải..."}</h6>
                          </div>
                        </li>
                        <li>
                          <div className="brand-box">
                            <h5>Tên nhà cung cấp:</h5>
                            <h6 className="mb-3">{supplier?.supplierName || "Đang tải..."}</h6>
                          </div>
                        </li>
                      </ul>


                      <div className="modal-button">
                        <button
                          type="button"
                          className="btn btn-md bg-dark cart-button text-white w-100"
                          onClick={() => handleAddToCart(selectedProduct)}
                        >
                          Thêm vào giỏ hàng
                        </button>
                        <button
                          type="button"
                          className="btn theme-bg-color view-button icon text-white fw-bold btn-md"
                          onClick={() => handleViewDetail(selectedProduct.productId)}
                        >
                          Xem thêm chi tiết
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="modal location-modal fade theme-modal" id="locationModal" tabindex="-1">
          <div className="modal-dialog modal-dialog-centered modal-fullscreen-sm-down">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">
                  Chọn Địa điểm Giao hàng
                </h5>
                <p className="mt-1 text-content">Nhập địa chỉ của bạn và chúng tôi sẽ chỉ định ưu đãi cho khu vực của bạn.</p>
                <button type="button" className="btn-close" data-bs-dismiss="modal">
                  <i className="fa-solid fa-xmark"></i>
                </button>
              </div>
              <div className="modal-body">
                <div className="location-list">
                  <div className="search-input">
                    <input type="search" className="form-control" placeholder="Search Your Area" />
                    <i className="fa-solid fa-magnifying-glass"></i>
                  </div>

                  <div className="disabled-box">
                    <h6>Select a Location</h6>
                  </div>

                  <ul className="location-select custom-height">
                    <li>
                      <a href="javascript:void(0)">
                        <h6>Alabama</h6>
                        <span>Min: $130</span>
                      </a>
                    </li>

                    <li>
                      <a href="javascript:void(0)">
                        <h6>Arizona</h6>
                        <span>Min: $150</span>
                      </a>
                    </li>

                    <li>
                      <a href="javascript:void(0)">
                        <h6>California</h6>
                        <span>Min: $110</span>
                      </a>
                    </li>

                    <li>
                      <a href="javascript:void(0)">
                        <h6>Colorado</h6>
                        <span>Min: $140</span>
                      </a>
                    </li>

                    <li>
                      <a href="javascript:void(0)">
                        <h6>Florida</h6>
                        <span>Min: $160</span>
                      </a>
                    </li>

                    <li>
                      <a href="javascript:void(0)">
                        <h6>Georgia</h6>
                        <span>Min: $120</span>
                      </a>
                    </li>

                    <li>
                      <a href="javascript:void(0)">
                        <h6>Kansas</h6>
                        <span>Min: $170</span>
                      </a>
                    </li>

                    <li>
                      <a href="javascript:void(0)">
                        <h6>Minnesota</h6>
                        <span>Min: $120</span>
                      </a>
                    </li>

                    <li>
                      <a href="javascript:void(0)">
                        <h6>New York</h6>
                        <span>Min: $110</span>
                      </a>
                    </li>

                    <li>
                      <a href="javascript:void(0)">
                        <h6>Washington</h6>
                        <span>Min: $130</span>
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="modal fade theme-modal deal-modal" id="deal-box" tabindex="-1">
          <div className="modal-dialog modal-dialog-centered modal-fullscreen-sm-down">
            <div className="modal-content">
              <div className="modal-header">
                <div>
                  <h5 className="modal-title w-100" id="deal_today">
                    Deal Today
                  </h5>
                  <p className="mt-1 text-content">Recommended deals for you.</p>
                </div>
                <button type="button" className="btn-close" data-bs-dismiss="modal">
                  <i className="fa-solid fa-xmark"></i>
                </button>
              </div>
              <div className="modal-body">
                <div className="deal-offer-box">
                  <ul className="deal-offer-list">
                    <li className="list-1">
                      <div className="deal-offer-contain">
                        <a href="shop-left-sidebar.html" className="deal-image">
                          <img src="../assets/images/vegetable/product/10.png" className="blur-up lazyload" alt="" />
                        </a>

                        <a href="shop-left-sidebar.html" className="deal-contain">
                          <h5>Blended Instant Coffee 50 g Buy 1 Get 1 Free</h5>
                          <h6>
                            $52.57 <del>57.62</del> <span>500 G</span>
                          </h6>
                        </a>
                      </div>
                    </li>

                    <li className="list-2">
                      <div className="deal-offer-contain">
                        <a href="shop-left-sidebar.html" className="deal-image">
                          <img src="../assets/images/vegetable/product/11.png" className="blur-up lazyload" alt="" />
                        </a>

                        <a href="shop-left-sidebar.html" className="deal-contain">
                          <h5>Blended Instant Coffee 50 g Buy 1 Get 1 Free</h5>
                          <h6>
                            $52.57 <del>57.62</del> <span>500 G</span>
                          </h6>
                        </a>
                      </div>
                    </li>

                    <li className="list-3">
                      <div className="deal-offer-contain">
                        <a href="shop-left-sidebar.html" className="deal-image">
                          <img src="../assets/images/vegetable/product/12.png" className="blur-up lazyload" alt="" />
                        </a>

                        <a href="shop-left-sidebar.html" className="deal-contain">
                          <h5>Blended Instant Coffee 50 g Buy 1 Get 1 Free</h5>
                          <h6>
                            $52.57 <del>57.62</del> <span>500 G</span>
                          </h6>
                        </a>
                      </div>
                    </li>

                    <li className="list-1">
                      <div className="deal-offer-contain">
                        <a href="shop-left-sidebar.html" className="deal-image">
                          <img src="../assets/images/vegetable/product/13.png" className="blur-up lazyload" alt="" />
                        </a>

                        <a href="shop-left-sidebar.html" className="deal-contain">
                          <h5>Blended Instant Coffee 50 g Buy 1 Get 1 Free</h5>
                          <h6>
                            $52.57 <del>57.62</del> <span>500 G</span>
                          </h6>
                        </a>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="add-cart-box">
          <div className="add-image">
            <img src="../assets/images/cake/pro/1.jpg" className="img-fluid" alt="" />
          </div>

          <div className="add-contain">
            <h6>Added to Cart</h6>
          </div>
        </div>
        <div className="theme-option theme-option-2">
          <div className="setting-box">
            <button className="btn setting-button">
              <i className="fa-solid fa-gear"></i>
            </button>

            <div className="theme-setting-2">
              <div className="theme-box">
                <ul>
                  <li>
                    <div className="setting-name">
                      <h4>Color</h4>
                    </div>
                    <div className="theme-setting-button color-picker">
                      <form className="form-control">
                        <label for="colorPick" className="form-label mb-0">
                          Theme Color
                        </label>
                        <input
                          type="color"
                          className="form-control form-control-color"
                          id="colorPick"
                          value="#0da487"
                          title="Choose your color"
                        />
                      </form>
                    </div>
                  </li>

                  <li>
                    <div className="setting-name">
                      <h4>Dark</h4>
                    </div>
                    <div className="theme-setting-button">
                      <button className="btn btn-2 outline" id="darkButton">
                        Dark
                      </button>
                      <button className="btn btn-2 unline" id="lightButton">
                        Light
                      </button>
                    </div>
                  </li>

                  <li>
                    <div className="setting-name">
                      <h4>RTL</h4>
                    </div>
                    <div className="theme-setting-button rtl">
                      <button className="btn btn-2 rtl-unline">LTR</button>
                      <button className="btn btn-2 rtl-outline">RTL</button>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="back-to-top">
            <a id="back-to-top" href="#">
              <i className="fas fa-chevron-up"></i>
            </a>
          </div>
        </div>
        <div className="sticky-bottom-cart">
          <div className="container-fluid-lg">
            <div className="row">
              <div className="col-12">
                <div className="cart-content">
                  <div className="product-image">
                    <img src={products?.imageURL} className="img-fluid blur-up lazyload" alt="" />
                    <div className="content">
                      <h5>{products?.productName}</h5>
                      <h6>
                        ${products?.salePrice}
                        <del className="text-danger">${products?.price}</del>
                        <span>{products?.discountPercent}% off</span>
                      </h6>
                    </div>
                  </div>
                  <div className="selection-section">
                    <div className="cart_qty qty-box product-qty m-0">
                      <div className="input-group h-100">
                        <button type="button" className="qty-left-minus" onClick={decreaseQty}>
                          <i className="fa fa-minus"></i>
                        </button>

                        <input
                          className="form-control input-number qty-input"
                          type="text"
                          name="quantity"
                          value={quantity}
                          readOnly
                        />

                        <button type="button" className="qty-right-plus" onClick={increaseQty}>
                          <i className="fa fa-plus"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="add-btn">
                    <a className="btn theme-bg-color text-white wishlist-btn" href="wishlist.html">
                      <i className="fa fa-bookmark"></i> Yêu thích
                    </a>

                    <button type="button" onClick={() => handleAddToCart1(products)} className="btn theme-bg-color text-white">
                      <i className="fas fa-shopping-cart"></i> Add To Cart
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="modal fade theme-modal question-modal" id="writereview" tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h1 className="modal-title fs-5" id="exampleModalLabel">
                  Write a review
                </h1>
                <button type="button" className="btn-close" data-bs-dismiss="modal">
                  <i className="fa-solid fa-xmark"></i>
                </button>
              </div>
              <div className="modal-body pt-0">
                <form className="product-review-form" onSubmit={(e) => e.preventDefault()}>
                  <div className="product-wrapper">
                    <div className="product-image">
                      <img
                        className="img-fluid"
                        alt="Solid Collared Tshirts"
                        src="../assets/images/fashion/product/26.jpg"
                      />
                    </div>
                    <div className="product-content">
                      <h5 className="name">Solid Collared Tshirts</h5>
                      <div className="product-review-rating">
                        <div className="product-rating">
                          <h6 className="price-number">$16.00</h6>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="review-box">
                    <div className="product-review-rating">
                      <label>Rating</label>
                      <div className="product-rating">
                        <ul className="rating">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <li key={star} onClick={() => setSelectedRating(star)} style={{ cursor: 'pointer' }}>
                              <i data-feather="star" style={{ color: selectedRating >= star ? 'gold' : 'gray' }}></i> {/* Dynamic color để hiển thị màu khi ấn */}
                            </li>
                          ))}
                        </ul>
                      </div>
                      {selectedRating < 1 && <small className="text-danger d-block mt-1">Vui lòng chọn rating *</small>} {/* Inline message cho validation */}
                    </div>
                  </div>
                  <div className="review-box">
                    <label htmlFor="content" className="form-label">
                      Nội dung đánh giá *
                    </label>
                    <textarea id="content" rows="3" className="form-control" placeholder="Your Question" value={reviewComment} onChange={(e) => setReviewComment(e.target.value)}></textarea>
                    {reviewComment.trim() === '' && <small className="text-danger d-block mt-1">Vui lòng viết nội dung *</small>}
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-md btn-theme-outline fw-bold" data-bs-dismiss="modal">
                  Close
                </button>
                <button type="button" className="btn btn-md fw-bold text-light theme-bg-color" onClick={handleSubmitReview} disabled={isSubmitting || selectedRating < 1 || reviewComment.trim() === ''}>
                  {isSubmitting ? 'Sending...' : 'Save changes'}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-overlay"></div>
      </div>



    </ProductDetailLayout>
  );
};

export default ProductDetail;
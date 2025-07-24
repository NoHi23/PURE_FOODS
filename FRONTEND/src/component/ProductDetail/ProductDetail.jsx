import React, { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom';
import ProductDetailLayout from '../../layouts/ProductDetailLayout'
import axios from 'axios';
import { toast } from 'react-toastify';
import './ProductDetail.css'
import { useWishlist } from '../../layouts/WishlistContext';
import { useNavigate } from 'react-router-dom';
import * as bootstrap from "bootstrap";


const ProductDetail = () => {
  const { id } = useParams();
  const [products, setProducts] = useState(null)
  const { wishlistMap, setWishlistMap, fetchWishlistCount, refreshWishlist } = useWishlist();
  const [isWished, setIsWished] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.userId;
  const [selectedImage, setSelectedImage] = useState(null);

  const [quantity, setQuantity] = useState(1);
  const increaseQty = () => setQuantity(prev => Math.max(1, prev + 1));
  const decreaseQty = () => setQuantity(prev => Math.max(1, prev - 1));

  const navigate = useNavigate();

  const handleAddToCart = () => {
    if (!userId || !products) {
      toast.error('Vui lòng đăng nhập');
      return;
    }

    const cartItem = {
      userID: userId,
      productID: products.productId,
      quantity: quantity,
      priceAfterDiscount: products.salePrice,
      total: products.salePrice * quantity,
      imageURL: products.imageURL,
      productName: products.productName,
      originalPrice: products.price,
      discount: products.discountPercent
    };

    console.log("🛒 Gửi dữ liệu add to cart:", cartItem);

    if (!userId || !products.productId) {
      toast.error("Thiếu thông tin giỏ hàng!");
      return;
    }

    axios.post('http://localhost:8082/PureFoods/api/cart/create', cartItem)
      .then(() => {
        toast.success('Đã thêm vào giỏ hàng');
        window.dispatchEvent(new Event('cartUpdated'));
        navigate(`/cart-detail`, { state: { fromAddToCart: true } });
      })
      .catch((err) => {
        console.error("❌ Lỗi khi thêm vào giỏ hàng:", err.response?.data || err.message);
        toast.error('Thêm vào giỏ thất bại');
      });
  };


  useEffect(() => {
    if (quantity < 1 || isNaN(quantity)) {
      setQuantity(1);
    }
  }, [quantity]);



  useEffect(() => {
    axios.get(`http://localhost:8082/PureFoods/api/product/getById/${id}`)
      .then(res => {
        if (res.data.product) {
          setProducts(res.data.product);
        } else {
          toast.error("Product not found");
        }
      })
      .catch(err => {
        console.error(err);
        toast.error("Error loading product");
      });
  }, [id]);

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
    zoomRef.current.style.backgroundSize = '200%';
  };

  const handleMouseLeave = () => {
    zoomRef.current.style.backgroundSize = 'cover';
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

    const handleMouseLeave = () => { isDown = false; };
    const handleMouseUp = () => { isDown = false; };
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
                  <h2>Creamy Chocolate Cake</h2>
                  <nav>
                    <ol className="breadcrumb mb-0">
                      <li className="breadcrumb-item">
                        <a href="/">
                          <i className="fa-solid fa-house"></i>
                        </a>
                      </li>

                      <li className="breadcrumb-item active">Creamy Chocolate Cake</li>
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
                                      block: "nearest"
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
                        <i className={`fa${isWished ? 's' : 'r'} fa-heart`}></i>
                      </button>
                      <h6 className="offer-top">{products?.discountPercent}% Off</h6>
                      <h2 className="name">{products?.productName}</h2>
                      <div className="price-rating">
                        <h3 className="theme-color price">${products?.salePrice} <del className="text-content">${products?.price}</del>

                        </h3>
                        <div className="product-rating custom-rate">
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
                          <span className="review">23 Customer Review</span>
                        </div>
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

                      <div className="time deal-timer product-deal-timer mx-md-0 mx-auto" id="clockdiv-1"
                        data-hours="1" data-minutes="2" data-seconds="3">
                        <div className="product-title">
                          <h4>Hurry up! Sales Ends In</h4>
                        </div>
                        <ul>
                          <li>
                            <div className="counter d-block">
                              <div className="days d-block">
                                <h5></h5>
                              </div>
                              <h6>Days</h6>
                            </div>
                          </li>
                          <li>
                            <div className="counter d-block">
                              <div className="hours d-block">
                                <h5></h5>
                              </div>
                              <h6>Hours</h6>
                            </div>
                          </li>
                          <li>
                            <div className="counter d-block">
                              <div className="minutes d-block">
                                <h5></h5>
                              </div>
                              <h6>Min</h6>
                            </div>
                          </li>
                          <li>
                            <div className="counter d-block">
                              <div className="seconds d-block">
                                <h5></h5>
                              </div>
                              <h6>Sec</h6>
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


                        <button onClick={handleAddToCart} className="btn btn-md bg-dark cart-button text-white w-100">
                          Add To Cart
                        </button>

                      </div>





                      <div className="payment-option">
                        <div className="product-title">
                          <h4>Guaranteed Safe Checkout</h4>
                        </div>
                        <ul>
                          <li>
                            <a href="javascript:void(0)">
                              <img src="../assets/images/product/payment/1.svg"
                                className="blur-up lazyload" alt="" />
                            </a>
                          </li>
                          <li>
                            <a href="javascript:void(0)">
                              <img src="../assets/images/product/payment/2.svg"
                                className="blur-up lazyload" alt="" />
                            </a>
                          </li>
                          <li>
                            <a href="javascript:void(0)">
                              <img src="../assets/images/product/payment/3.svg"
                                className="blur-up lazyload" alt="" />
                            </a>
                          </li>
                          <li>
                            <a href="javascript:void(0)">
                              <img src="../assets/images/product/payment/4.svg"
                                className="blur-up lazyload" alt="" />
                            </a>
                          </li>
                          <li>
                            <a href="javascript:void(0)">
                              <img src="../assets/images/product/payment/5.svg"
                                className="blur-up lazyload" alt="" />
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
                        <h5 className="fw-500">Pure Foods</h5>

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
                          <span>(9999+ Reviews)</span>
                        </div>

                      </div>
                    </div>

                    <p className="vendor-detail">Pure Foods is an Vietnamese fast-casual
                      restaurant that offers international and Vietnamese noodle dishes and pasta.</p>

                    <div className="vendor-list">
                      <ul>
                        <li>
                          <div className="address-contact">
                            <i data-feather="map-pin"></i>
                            <h5>Address: <span className="text-content">Khu Giáo dục và Đào tạo - Khu Công nghệ cao Hòa Lạc - Km29 Đại lộ Thăng Long, xã Hòa Lạc, TP. Hà Nội</span></h5>
                          </div>
                        </li>

                        <li>
                          <div className="address-contact">
                            <i data-feather="headphones"></i>
                            <h5>Contact Seller: <span className="text-content">1900 6789</span></h5>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="pt-25">
                    <div className="hot-line-number">
                      <h5>Hotline Order:</h5>
                      <h6>Mon - Fri: 07:00 am - 08:30PM</h6>
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
                      <button className="nav-link active" id="description-tab" data-bs-toggle="tab"
                        data-bs-target="#description" type="button" role="tab">Description</button>
                    </li>

                    <li className="nav-item" role="presentation">
                      <button className="nav-link" id="care-tab" data-bs-toggle="tab" data-bs-target="#care"
                        type="button" role="tab">Care
                        Instructions</button>
                    </li>

                    <li className="nav-item" role="presentation">
                      <button className="nav-link" id="review-tab" data-bs-toggle="tab" data-bs-target="#review"
                        type="button" role="tab">Review</button>
                    </li>
                  </ul>

                  <div className="tab-content custom-tab" id="myTabContent">
                    <div className="tab-pane fade show active" id="description" role="tabpanel">
                      <div className="product-description">
                        <div className="nav-desh">
                          <p>{products?.description}</p>
                        </div>
                      </div>
                    </div>



                    <div className="tab-pane fade" id="care" role="tabpanel">
                      <div className="information-box">
                        <ul>
                          <li>Store clean food in the refrigerator at a temperature between 0°C and 4°C to keep it fresh and prevent bacterial growth.</li>

                          <li>Do not store cooked food together with raw food to avoid cross-contamination.</li>

                          <li>Cooked food should be consumed within 24 hours to ensure safety and quality.</li>

                          <li>Wash your hands thoroughly before handling or eating food.</li>

                          <li>Seal food containers properly after use and store them in a cool, dry place.</li>

                          <li>Do not consume expired food or food that shows signs of spoilage such as mold, off smells, or discoloration.</li>

                          <li>Always wash fruits and vegetables with clean water before consuming or cooking them.</li>
                        </ul>
                      </div>
                    </div>


                    <div className="tab-pane fade" id="review" role="tabpanel">
                      <div className="review-box">
                        <div className="row">
                          <div className="col-xl-5">
                            <div className="product-rating-box">
                              <div className="row">
                                <div className="col-xl-12">
                                  <div className="product-main-rating">
                                    <h2>3.40
                                      <i data-feather="star"></i>
                                    </h2>

                                    <h5>5 Overall Rating</h5>
                                  </div>
                                </div>

                                <div className="col-xl-12">
                                  <ul className="product-rating-list">
                                    <li>
                                      <div className="rating-product">
                                        <h5>5<i data-feather="star"></i></h5>
                                        <div className="progress">
                                          <div className="progress-bar" style={{ width: "40%" }}>
                                          </div>
                                        </div>
                                        <h5 className="total">2</h5>
                                      </div>
                                    </li>
                                    <li>
                                      <div className="rating-product">
                                        <h5>4<i data-feather="star"></i></h5>
                                        <div className="progress">
                                          <div className="progress-bar" style={{ width: "20%" }}>
                                          </div>
                                        </div>
                                        <h5 className="total">1</h5>
                                      </div>
                                    </li>
                                    <li>
                                      <div className="rating-product">
                                        <h5>3<i data-feather="star"></i></h5>
                                        <div className="progress">
                                          <div className="progress-bar" style={{ width: "0%" }}>
                                          </div>
                                        </div>
                                        <h5 className="total">0</h5>
                                      </div>
                                    </li>
                                    <li>
                                      <div className="rating-product">
                                        <h5>2<i data-feather="star"></i></h5>
                                        <div className="progress">
                                          <div className="progress-bar" style={{ width: "20%" }}>
                                          </div>
                                        </div>
                                        <h5 className="total">1</h5>
                                      </div>
                                    </li>
                                    <li>
                                      <div className="rating-product">
                                        <h5>1<i data-feather="star"></i></h5>
                                        <div className="progress">
                                          <div className="progress-bar" style={{ width: "20%" }}>
                                          </div>
                                        </div>
                                        <h5 className="total">1</h5>
                                      </div>
                                    </li>

                                  </ul>

                                  <div className="review-title-2">
                                    <h4 className="fw-bold">Review this product</h4>
                                    <p>Let other customers know what you think</p>
                                    <button className="btn" type="button" data-bs-toggle="modal"
                                      data-bs-target="#writereview">Write a
                                      review</button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="col-xl-7">
                            <div className="review-people">
                              <ul className="review-list">
                                <li>
                                  <div className="people-box">
                                    <div>
                                      <div className="people-image people-text">
                                        <img alt="user" className="img-fluid "
                                          src="../assets/images/review/1.jpg" />
                                      </div>
                                    </div>
                                    <div className="people-comment">
                                      <div className="people-name"><a href="javascript:void(0)"
                                        className="name">Jack Doe</a>
                                        <div className="date-time">
                                          <h6 className="text-content"> 29 Sep 2023
                                            06:40:PM
                                          </h6>
                                          <div className="product-rating">
                                            <ul className="rating">
                                              <li>
                                                <i data-feather="star"
                                                  className="fill"></i>
                                              </li>
                                              <li>
                                                <i data-feather="star"
                                                  className="fill"></i>
                                              </li>
                                              <li>
                                                <i data-feather="star"
                                                  className="fill"></i>
                                              </li>
                                              <li>
                                                <i data-feather="star"
                                                  className="fill"></i>
                                              </li>
                                              <li>
                                                <i data-feather="star"></i>
                                              </li>
                                            </ul>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="reply">
                                        <p>Avoid this product. The quality is
                                          terrible, and
                                          it started falling apart almost
                                          immediately. I
                                          wish I had read more reviews before
                                          buying.
                                          Lesson learned.</p>
                                      </div>
                                    </div>
                                  </div>
                                </li>
                                <li>
                                  <div className="people-box">
                                    <div>
                                      <div className="people-image people-text">
                                        <img alt="user" className="img-fluid "
                                          src="../assets/images/review/2.jpg" />
                                      </div>
                                    </div>
                                    <div className="people-comment">
                                      <div className="people-name"><a href="javascript:void(0)"
                                        className="name">Jessica
                                        Miller</a>
                                        <div className="date-time">
                                          <h6 className="text-content"> 29 Sep 2023
                                            06:34:PM
                                          </h6>
                                          <div className="product-rating">
                                            <div className="product-rating">
                                              <ul className="rating">
                                                <li>
                                                  <i data-feather="star"
                                                    className="fill"></i>
                                                </li>
                                                <li>
                                                  <i data-feather="star"
                                                    className="fill"></i>
                                                </li>
                                                <li>
                                                  <i data-feather="star"
                                                    className="fill"></i>
                                                </li>
                                                <li>
                                                  <i data-feather="star"
                                                    className="fill"></i>
                                                </li>
                                                <li>
                                                  <i data-feather="star"></i>
                                                </li>
                                              </ul>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="reply">
                                        <p>Honestly, I regret buying this item. The
                                          quality
                                          is subpar, and it feels like a waste of
                                          money. I
                                          wouldn't recommend it to anyone.</p>
                                      </div>
                                    </div>
                                  </div>
                                </li>
                                <li>
                                  <div className="people-box">
                                    <div>
                                      <div className="people-image people-text">
                                        <img alt="user" className="img-fluid "
                                          src="../assets/images/review/3.jpg" />
                                      </div>
                                    </div>
                                    <div className="people-comment">
                                      <div className="people-name"><a href="javascript:void(0)"
                                        className="name">Rome Doe</a>
                                        <div className="date-time">
                                          <h6 className="text-content"> 29 Sep 2023
                                            06:18:PM
                                          </h6>
                                          <div className="product-rating">
                                            <ul className="rating">
                                              <li>
                                                <i data-feather="star"
                                                  className="fill"></i>
                                              </li>
                                              <li>
                                                <i data-feather="star"
                                                  className="fill"></i>
                                              </li>
                                              <li>
                                                <i data-feather="star"
                                                  className="fill"></i>
                                              </li>
                                              <li>
                                                <i data-feather="star"
                                                  className="fill"></i>
                                              </li>
                                              <li>
                                                <i data-feather="star"></i>
                                              </li>
                                            </ul>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="reply">
                                        <p>I am extremely satisfied with this
                                          purchase. The
                                          item arrived promptly, and the quality
                                          is
                                          exceptional. It's evident that the
                                          makers paid
                                          attention to detail. Overall, a
                                          fantastic buy!
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </li>
                                <li>
                                  <div className="people-box">
                                    <div>
                                      <div className="people-image people-text">
                                        <img alt="user" className="img-fluid "
                                          src="../assets/images/review/4.jpg" />
                                      </div>
                                    </div>
                                    <div className="people-comment">
                                      <div className="people-name"><a href="javascript:void(0)"
                                        className="name">Sarah
                                        Davis</a>
                                        <div className="date-time">
                                          <h6 className="text-content"> 29 Sep 2023
                                            05:58:PM
                                          </h6>
                                          <div className="product-rating">
                                            <ul className="rating">
                                              <li>
                                                <i data-feather="star"
                                                  className="fill"></i>
                                              </li>
                                              <li>
                                                <i data-feather="star"
                                                  className="fill"></i>
                                              </li>
                                              <li>
                                                <i data-feather="star"
                                                  className="fill"></i>
                                              </li>
                                              <li>
                                                <i data-feather="star"
                                                  className="fill"></i>
                                              </li>
                                              <li>
                                                <i data-feather="star"></i>
                                              </li>
                                            </ul>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="reply">
                                        <p>I am genuinely delighted with this item.
                                          It's a
                                          total winner! The quality is superb, and
                                          it has
                                          added so much convenience to my daily
                                          routine.
                                          Highly satisfied customer!</p>
                                      </div>
                                    </div>
                                  </div>
                                </li>
                                <li>
                                  <div className="people-box">
                                    <div>
                                      <div className="people-image people-text">
                                        <img alt="user" className="img-fluid "
                                          src="../assets/images/review/5.jpg" />
                                      </div>
                                    </div>
                                    <div className="people-comment">
                                      <div className="people-name"><a href="javascript:void(0)"
                                        className="name">John Doe</a>
                                        <div className="date-time">
                                          <h6 className="text-content"> 29 Sep 2023
                                            05:22:PM
                                          </h6>
                                          <div className="product-rating">
                                            <ul className="rating">
                                              <li>
                                                <i data-feather="star"
                                                  className="fill"></i>
                                              </li>
                                              <li>
                                                <i data-feather="star"
                                                  className="fill"></i>
                                              </li>
                                              <li>
                                                <i data-feather="star"
                                                  className="fill"></i>
                                              </li>
                                              <li>
                                                <i data-feather="star"
                                                  className="fill"></i>
                                              </li>
                                              <li>
                                                <i data-feather="star"></i>
                                              </li>
                                            </ul>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="reply">
                                        <p>Very impressed with this purchase. The
                                          item is of
                                          excellent quality, and it has exceeded
                                          my
                                          expectations.</p>
                                      </div>
                                    </div>
                                  </div>
                                </li>
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
          </div>
        </section>
        <section className="product-list-section section-b-space">
          <div className="container-fluid-lg">
            <div className="title">
              <h2>Related Products</h2>
              <span className="title-leaf">
                <svg className="icon-width">
                </svg>
              </span>
            </div>
            <div className="related-scroll-container">
              {productsRelated?.map(product => (
                <div className="product-box-3 wow fadeInUp" style={{ minWidth: "250px" }} key={product.productId}>
                  <div className="product-box-3 wow fadeInUp">
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
                        <h6 className="unit">500 G</h6>
                        <h5 className="price">
                          <span className="theme-color">${product.salePrice} <del>${product.price}</del></span>
                        </h5>
                        <div className="add-to-cart-box bg-white">
                          <button className="btn btn-add-cart addcart-button">
                            Add
                            <span className="add-icon bg-light-gray">
                              <i className="fa-solid fa-plus"></i>
                            </span>
                          </button>
                          <div className="cart_qty qty-box">
                            <div className="input-group bg-white">
                              <button type="button" className="qty-left-minus bg-gray">
                                <i className="fa fa-minus"></i>
                              </button>
                              <input className="form-control input-number qty-input" type="text" value="0" readOnly />
                              <button type="button" className="qty-right-plus bg-gray">
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
                        <span className="ms-2">8 Reviews</span>
                        <span className="ms-2 text-danger">6 sold in last 16 hours</span>
                      </div>

                      <div className="product-detail">
                        <p>{selectedProduct?.description || "No description available."}</p>
                      </div>

                      <ul className="brand-list">
                        <li>
                          <div className="brand-box">
                            <h5>Category Name:</h5>
                            <h6 className="mb-3">{category?.categoryName || "Đang tải..."}</h6>
                          </div>
                        </li>
                        <li>
                          <div className="brand-box">
                            <h5>Supplier Name:</h5>
                            <h6 className="mb-3">{supplier?.supplierName || "Đang tải..."}</h6>
                          </div>
                        </li>
                      </ul>

                      <ul className="brand-list">
                        <li>
                          <div className="brand-box">
                            <h5>Stock Quantity:</h5>
                            <h6 className="mb-3">{selectedProduct?.stockQuantity || "Đang tải..."}</h6>
                          </div>
                        </li>
                        <li>
                          <div className="brand-box">
                            <h5>Supplier Name:</h5>
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
                          Add To Cart
                        </button>
                        <button
                          type="button"
                          className="btn theme-bg-color view-button icon text-white fw-bold btn-md"
                          onClick={() => handleViewDetail(selectedProduct.productId)}
                        >
                          View More Details
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
                <h5 className="modal-title" id="exampleModalLabel">Choose your Delivery Location</h5>
                <p className="mt-1 text-content">Enter your address and we will specify the offer for your area.</p>
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
                  <h5 className="modal-title w-100" id="deal_today">Deal Today</h5>
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
                          <img src="../assets/images/vegetable/product/10.png" className="blur-up lazyload"
                            alt="" />
                        </a>

                        <a href="shop-left-sidebar.html" className="deal-contain">
                          <h5>Blended Instant Coffee 50 g Buy 1 Get 1 Free</h5>
                          <h6>$52.57 <del>57.62</del> <span>500 G</span></h6>
                        </a>
                      </div>
                    </li>

                    <li className="list-2">
                      <div className="deal-offer-contain">
                        <a href="shop-left-sidebar.html" className="deal-image">
                          <img src="../assets/images/vegetable/product/11.png" className="blur-up lazyload"
                            alt="" />
                        </a>

                        <a href="shop-left-sidebar.html" className="deal-contain">
                          <h5>Blended Instant Coffee 50 g Buy 1 Get 1 Free</h5>
                          <h6>$52.57 <del>57.62</del> <span>500 G</span></h6>
                        </a>
                      </div>
                    </li>

                    <li className="list-3">
                      <div className="deal-offer-contain">
                        <a href="shop-left-sidebar.html" className="deal-image">
                          <img src="../assets/images/vegetable/product/12.png" className="blur-up lazyload"
                            alt="" />
                        </a>

                        <a href="shop-left-sidebar.html" className="deal-contain">
                          <h5>Blended Instant Coffee 50 g Buy 1 Get 1 Free</h5>
                          <h6>$52.57 <del>57.62</del> <span>500 G</span></h6>
                        </a>
                      </div>
                    </li>

                    <li className="list-1">
                      <div className="deal-offer-contain">
                        <a href="shop-left-sidebar.html" className="deal-image">
                          <img src="../assets/images/vegetable/product/13.png" className="blur-up lazyload"
                            alt="" />
                        </a>

                        <a href="shop-left-sidebar.html" className="deal-contain">
                          <h5>Blended Instant Coffee 50 g Buy 1 Get 1 Free</h5>
                          <h6>$52.57 <del>57.62</del> <span>500 G</span></h6>
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
                        <label for="colorPick" className="form-label mb-0">Theme Color</label>
                        <input type="color" className="form-control form-control-color" id="colorPick"
                          value="#0da487" title="Choose your color" />
                      </form>
                    </div>
                  </li>

                  <li>
                    <div className="setting-name">
                      <h4>Dark</h4>
                    </div>
                    <div className="theme-setting-button">
                      <button className="btn btn-2 outline" id="darkButton">Dark</button>
                      <button className="btn btn-2 unline" id="lightButton">Light</button>
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
                    <img src={products?.imageURL} className="img-fluid blur-up lazyload"
                      alt="" />
                    <div className="content">
                      <h5>{products?.productName}</h5>
                      <h6>${products?.salePrice}<del className="text-danger">${products?.price}</del><span>{products?.discountPercent}% off</span></h6>
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
                    <a className="btn theme-bg-color text-white wishlist-btn" href="wishlist.html"><i
                      className="fa fa-bookmark"></i> Wishlist</a>

                    <button
                      type="button"
                      onClick={handleAddToCart}
                      className="btn theme-bg-color text-white"
                    >
                      <i className="fas fa-shopping-cart"></i> Add To Cart
                    </button>

                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="modal fade theme-modal question-modal" id="writereview" tabindex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h1 className="modal-title fs-5" id="exampleModalLabel">Write a review</h1>
                <button type="button" className="btn-close" data-bs-dismiss="modal">
                  <i className="fa-solid fa-xmark"></i>
                </button>
              </div>
              <div className="modal-body pt-0">
                <form className="product-review-form">
                  <div className="product-wrapper">
                    <div className="product-image">
                      <img className="img-fluid" alt="Solid Collared Tshirts"
                        src="../assets/images/fashion/product/26.jpg" />
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
                      </div>
                    </div>
                  </div>
                  <div className="review-box">
                    <label for="content" className="form-label">Your Question *</label>
                    <textarea id="content" rows="3" className="form-control" placeholder="Your Question"></textarea>
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-md btn-theme-outline fw-bold"
                  data-bs-dismiss="modal">Close</button>
                <button type="button" className="btn btn-md fw-bold text-light theme-bg-color">Save changes</button>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-overlay"></div>
      </div>



    </ProductDetailLayout>
  )
}

export default ProductDetail

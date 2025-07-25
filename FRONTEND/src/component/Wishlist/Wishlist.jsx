import React, { useEffect, useState } from 'react'
import WishListLayout from '../../layouts/WishlistLayout'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useWishlist } from '../../layouts/WishlistContext';
import feather from 'feather-icons';

const Wishlist = () => {

  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();
  const userId = user?.userId;


  const {
    refreshWishlist,
  } = useWishlist();
  const handleRemove = async (wishlistId) => {
    if (!wishlistId) {
      toast.error("Không tìm thấy wishlistId để xoá");
      return;
    }

    try {
      await axios.put("http://localhost:8082/PureFoods/api/wishlist/delete", {
        wishlistId: wishlistId,
      });

      await refreshWishlist();

    } catch (error) {
      console.error("Lỗi xoá wishlist:", error);
    }
  };

  const [wishlistItems, setWishlistItems] = useState([]);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const res = await axios.get(`http://localhost:8082/PureFoods/api/wishlist/${userId}`);
        const wishlist = res.data;

        const productRequests = wishlist.map(item =>
          axios.get(`http://localhost:8082/PureFoods/api/product/getById/${item.productId}`)
        );

        const productResponses = await Promise.all(productRequests);

        const categoryRequests = productResponses.map(res =>
          axios.get(`http://localhost:8082/PureFoods/api/category/${res.data.product.categoryId}`)
        );

        const categoryResponses = await Promise.all(categoryRequests);


        const combinedWishlist = wishlist.map((item, index) => ({
          ...item,
          ...productResponses[index].data.product,
          categoryName: categoryResponses[index].data.categoryName
        }));


        setWishlistItems(combinedWishlist);
      } catch (error) {
        console.error("Lỗi khi lấy wishlist:", error);
        toast.error("Không thể tải danh sách yêu thích");
      }
    };

    if (userId) {
      fetchWishlist();
    }
  }, [userId, refreshWishlist]);

  useEffect(() => {
    feather.replace();
  }, [wishlistItems]);



  return (
    <WishListLayout>
      <div>
        <div className="mobile-menu d-md-none d-block mobile-cart">
          <ul>
            <li className="active">
              <a href="/">
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
        {/* mobile fix menu end */}

        {/* Breadcrumb Section Start */}
        <section className="breadcrumb-section pt-0">
          <div className="container-fluid-lg">
            <div className="row">
              <div className="col-12">
                <div className="breadcrumb-contain">
                  <h2>Yêu thích</h2>
                  <nav>
                    <ol className="breadcrumb mb-0">
                      <li className="breadcrumb-item">
                        <a href="/">
                          <i className="fa-solid fa-house"></i>
                        </a>
                      </li>
                      <li className="breadcrumb-item active">Yêu thích</li>
                    </ol>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* Breadcrumb Section End */}

        {/* Wishlist Section Start */}
        <section className="wishlist-section section-b-space">
          <div className="container-fluid-lg">
            <div className="row g-sm-3 g-2">


              {wishlistItems.length === 0 ? (
                <div style={{ padding: '10px', textAlign: 'center' }}>
                  <i className="fa fa-heart-broken" style={{ fontSize: '24px', color: '#999' }}></i>
                  <p style={{ margin: '5px 0', color: '#777' }}>Không có sản phẩm yêu thích</p>
                </div>
              ) : (
                wishlistItems.map((item) => (
                  <div className="col-xxl-2 col-lg-3 col-md-4 col-6 product-box-contain" key={item.productId}>
                    <div className="product-box-3 h-100">
                      <div className="product-header">
                        <div className="product-image">
                          <a href={`/product/${item.productId}`}>
                            <img src={item.imageURL} className="img-fluid blur-up lazyload"
                              alt={item.productName} />
                          </a>

                          <div className="product-header-top">
                            <button
                              className="btn wishlist-button close_button"
                              onClick={() => handleRemove(item.wishlistId)}
                            >
                              <i data-feather="x"></i>
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="product-footer">
                        <div className="product-detail">
                          <span className="span-name">{item.categoryName || "Đang tải..."} </span>
                          <a href={`/product/${item.productId}`}>
                            <h5 className="name">{item.productName}</h5>
                          </a>
                          <h5 className="price">
                            <span className="theme-color">${item.salePrice}</span>
                            <del>${item.price}</del>
                          </h5>

                          <div className="add-to-cart-box bg-white mt-2">
                            <button className="btn btn-add-cart addcart-button">Add
                              <span className="add-icon bg-light-gray">
                                <i className="fa-solid fa-plus"></i>
                              </span>
                            </button>
                            <div className="cart_qty qty-box">
                              <div className="input-group bg-white">
                                <button type="button" className="qty-left-minus bg-gray" data-type="minus"
                                  data-field="">
                                  <i className="fa fa-minus"></i>
                                </button>
                                <input className="form-control input-number qty-input" type="text"
                                  name="quantity" value="0" />
                                <button type="button" className="qty-right-plus bg-gray" data-type="plus"
                                  data-field="">
                                  <i className="fa fa-plus"></i>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}

            </div>
          </div>
        </section>
        {/* Wishlist Section End */}

        {/* Footer Section Start */}

        {/* Footer Section End */}

        {/* Location Modal Start */}
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
        {/* Location Modal End */}

        {/* Deal Box Modal Start */}
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
        {/* Deal Box Modal End */}

        {/* Tap to top and theme setting button start */}
        <div className="theme-option">
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
        <div className="bg-overlay"></div>
      </div>
    </WishListLayout >

  )
}

export default Wishlist

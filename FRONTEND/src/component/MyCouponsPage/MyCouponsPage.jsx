import React, { useEffect, useState } from 'react'
import MyCouponsPageLayout from '../../layouts/MyCouponsPageLayout'
import axios from 'axios';
import './MyCouponsPage.css'
const MyCouponsPage = () => {
  const [coupons, setCoupons] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.userId;

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const response = await axios.get(`http://localhost:8082/PureFoods/api/promotion/user/${userId}`);
        const allCoupons = response.data.coupons;

        const today = new Date();

        const validCoupons = allCoupons.filter(coupon => {
          const expiry = new Date(coupon.sta);
          return expiry >= today;
        });

        setCoupons(allCoupons);
      } catch (error) {
        console.error('Lỗi khi gọi API lấy coupon:', error);
      }
    };

    fetchCoupons();
  }, []);

  return (
    <MyCouponsPageLayout>
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
        {/*mobile fix menu end  */}

        {/*Breadcrumb Section Start  */}
        <section className="breadcrumb-section pt-0">
          <div className="container-fluid-lg">
            <div className="row">
              <div className="col-12">
                <div className="breadcrumb-contain">
                  <h2 className="mb-2">Danh sách mã giảm giá</h2>
                  <nav>
                    <ol className="breadcrumb mb-0">
                      <li className="breadcrumb-item">
                        <a href="/">
                          <i className="fa-solid fa-house"></i>
                        </a>
                      </li>
                      <li className="breadcrumb-item active">Danh sách mã giảm giá</li>
                    </ol>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/*Breadcrumb Section End  */}

        {/*Compare Section Start  */}
        <section className="compare-section section-b-space">
          <div className="container-fluid-lg">
            <div className="row">
              <div className="col-12">
                {
                  coupons.length > 0 ? (
                    <div className="row">
                      {coupons.map((coupon, index) => (
                        <div className="col-md-4 mb-4" key={index}>
                          <div className="card shadow border-left-success h-100 py-2">
                            <div className="card-body">
                              <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                                {coupon.description}
                              </div>
                              <div className="h5 mb-2 font-weight-bold text-gray-800">
                                Mã: <span className="badge badge-success">{coupon.promotionCode}</span>
                              </div>
                              <p className="mb-1">
                                Giảm: <strong>{coupon.discountValue}%</strong>
                              </p>
                              <p className="mb-0">
                                Hạn sử dụng: {new Date(coupon.endDate).toLocaleDateString('vi-VN')}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center">
                      <h5 className="text-danger">Không có mã giảm giá còn hạn sử dụng.</h5>
                    </div>
                  )
                }
              </div>
            </div>
          </div>
        </section>
        {/*Compare Section End  */}


        {/*Location Modal Start  */}
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
        {/*Location Modal End  */}

        {/*Deal Box Modal Start  */}
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
        {/*Deal Box Modal End  */}

        {/*Tap to top and theme setting button start  */}
        <div className="theme-option">


          <div className="back-to-top">
            <a id="back-to-top" href="#">
              <i className="fas fa-chevron-up"></i>
            </a>
          </div>
        </div>
        <div className="bg-overlay"></div>

      </div>
    </MyCouponsPageLayout>
  )
}

export default MyCouponsPage

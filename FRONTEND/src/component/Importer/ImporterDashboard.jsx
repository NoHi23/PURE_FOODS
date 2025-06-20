import React, { useState } from "react";
import ImporterLayout from "../../layouts/ImporterLayout";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const ImporterDashboard = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    toast.success("Logout successfully!");
    navigate("/login");
  };

  return (
    <ImporterLayout>
      <div>
        {/* start */}
        <header className="pb-md-4 pb-0">
          <div className="header-top">
            <div className="container-fluid-lg">
              <div className="row">
                <div className="col-xxl-3 d-xxl-block d-none">
                  <div className="top-left-header">
                    <i className="iconly-Location icli text-white"></i>
                    <span className="text-white">1418 Riverwood Drive, CA 96052, US</span>
                  </div>
                </div>

                <div className="col-xxl-6 col-lg-9 d-lg-block d-none">
                  <div className="header-offer">
                    <div className="notification-slider">
                      <div>
                        <div className="timer-notification">
                          <h6>
                            <strong className="me-1">Welcome to Fastkart!</strong>Wrap new offers/gift every single day
                            on Weekends.<strong className="ms-1">New Coupon Code: Fast024</strong>
                          </h6>
                        </div>
                      </div>

                      <div>
                        <div className="timer-notification">
                          <h6>
                            Something you love is now on sale!
                            <a href="shop-left-sidebar.html" className="text-white">
                              Buy Now !
                            </a>
                          </h6>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-lg-3">
                  <ul className="about-list right-nav-about">
                    <li className="right-nav-list">
                      <div className="dropdown theme-form-select">
                        <button
                          className="btn dropdown-toggle"
                          type="button"
                          id="select-language"
                          data-bs-toggle="dropdown"
                        >
                          <img
                            src="../assets/images/country/united-states.png"
                            className="img-fluid blur-up lazyload"
                            alt=""
                          />
                          <span>English</span>
                        </button>
                        <ul className="dropdown-menu dropdown-menu-end">
                          <li>
                            <a className="dropdown-item" href="javascript:void(0)" id="english">
                              <img
                                src="../assets/images/country/united-kingdom.png"
                                className="img-fluid blur-up lazyload"
                                alt=""
                              />
                              <span>English</span>
                            </a>
                          </li>
                          <li>
                            <a className="dropdown-item" href="javascript:void(0)" id="france">
                              <img
                                src="../assets/images/country/germany.png"
                                className="img-fluid blur-up lazyload"
                                alt=""
                              />
                              <span>Germany</span>
                            </a>
                          </li>
                          <li>
                            <a className="dropdown-item" href="javascript:void(0)" id="chinese">
                              <img
                                src="../assets/images/country/turkish.png"
                                className="img-fluid blur-up lazyload"
                                alt=""
                              />
                              <span>Turki</span>
                            </a>
                          </li>
                        </ul>
                      </div>
                    </li>
                    <li className="right-nav-list">
                      <div className="dropdown theme-form-select">
                        <button
                          className="btn dropdown-toggle"
                          type="button"
                          id="select-dollar"
                          data-bs-toggle="dropdown"
                        >
                          <span>USD</span>
                        </button>
                        <ul className="dropdown-menu dropdown-menu-end sm-dropdown-menu">
                          <li>
                            <a className="dropdown-item" id="aud" href="javascript:void(0)">
                              AUD
                            </a>
                          </li>
                          <li>
                            <a className="dropdown-item" id="eur" href="javascript:void(0)">
                              EUR
                            </a>
                          </li>
                          <li>
                            <a className="dropdown-item" id="cny" href="javascript:void(0)">
                              CNY
                            </a>
                          </li>
                        </ul>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="top-nav top-header sticky-header">
            <div className="container-fluid-lg">
              <div className="row">
                <div className="col-12">
                  <div className="navbar-top">
                    <button
                      className="navbar-toggler d-xl-none d-inline navbar-menu-button"
                      type="button"
                      data-bs-toggle="offcanvas"
                      data-bs-target="#primaryMenu"
                    >
                      <span className="navbar-toggler-icon">
                        <i className="fa-solid fa-bars"></i>
                      </span>
                    </button>
                    <a href="index.html" className="web-logo nav-logo">
                      <img src="../assets/images/logo/1.png" className="img-fluid blur-up lazyload" alt="" />
                    </a>

                    <div className="middle-box">
                      <div className="location-box">
                        <button className="btn location-button" data-bs-toggle="modal" data-bs-target="#locationModal">
                          <span className="location-arrow">
                            <i data-feather="map-pin"></i>
                          </span>
                          <span className="locat-name">Your Location</span>
                          <i className="fa-solid fa-angle-down"></i>
                        </button>
                      </div>

                      <div className="search-box">
                        <div className="input-group">
                          <input type="search" className="form-control" placeholder="I'm searching for..." />
                          <button className="btn" type="button" id="button-addon2">
                            <i data-feather="search"></i>
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="rightside-box">
                      <div className="search-full">
                        <div className="input-group">
                          <span className="input-group-text">
                            <i data-feather="search" className="font-light"></i>
                          </span>
                          <input type="text" className="form-control search-type" placeholder="Search here.." />
                          <span className="input-group-text close-search">
                            <i data-feather="x" className="font-light"></i>
                          </span>
                        </div>
                      </div>
                      <ul className="right-side-menu">
                        <li className="right-side">
                          <div className="delivery-login-box">
                            <div className="delivery-icon">
                              <div className="search-box">
                                <i data-feather="search"></i>
                              </div>
                            </div>
                          </div>
                        </li>
                        <li className="right-side">
                          <a href="contact-us.html" className="delivery-login-box">
                            <div className="delivery-icon">
                              <i data-feather="phone-call"></i>
                            </div>
                            <div className="delivery-detail">
                              <h6>24/7 Delivery</h6>
                              <h5>
                                <i className="fa fa-phone" style={{ marginRight: "5px" }}></i>
                                {user?.phone}
                              </h5>
                            </div>
                          </a>
                        </li>
                        <li className="right-side">
                          <a href="wishlist.html" className="btn p-0 position-relative header-wishlist">
                            <i data-feather="heart"></i>
                          </a>
                        </li>
                        <li className="right-side">
                          <div className="onhover-dropdown header-badge">
                            <button type="button" className="btn p-0 position-relative header-wishlist">
                              <i data-feather="shopping-cart"></i>
                              <span className="position-absolute top-0 start-100 translate-middle badge">
                                2<span className="visually-hidden">unread messages</span>
                              </span>
                            </button>

                            <div className="onhover-div">
                              <ul className="cart-list">
                                <li className="product-box-contain">
                                  <div className="drop-cart">
                                    <a href="product-left-thumbnail.html" className="drop-image">
                                      <img
                                        src="../assets/images/vegetable/product/1.png"
                                        className="blur-up lazyload"
                                        alt=""
                                      />
                                    </a>

                                    <div className="drop-contain">
                                      <a href="product-left-thumbnail.html">
                                        <h5>Fantasy Crunchy Choco Chip Cookies</h5>
                                      </a>
                                      <h6>
                                        <span>1 x</span> $80.58
                                      </h6>
                                      <button className="close-button close_button">
                                        <i className="fa-solid fa-xmark"></i>
                                      </button>
                                    </div>
                                  </div>
                                </li>

                                <li className="product-box-contain">
                                  <div className="drop-cart">
                                    <a href="product-left-thumbnail.html" className="drop-image">
                                      <img
                                        src="../assets/images/vegetable/product/2.png"
                                        className="blur-up lazyload"
                                        alt=""
                                      />
                                    </a>

                                    <div className="drop-contain">
                                      <a href="product-left-thumbnail.html">
                                        <h5>Peanut Butter Bite Premium Butter Cookies 600 g</h5>
                                      </a>
                                      <h6>
                                        <span>1 x</span> $25.68
                                      </h6>
                                      <button className="close-button close_button">
                                        <i className="fa-solid fa-xmark"></i>
                                      </button>
                                    </div>
                                  </div>
                                </li>
                              </ul>

                              <div className="price-box">
                                <h5>Total :</h5>
                                <h4 className="theme-color fw-bold">$106.58</h4>
                              </div>

                              <div className="button-group">
                                <a href="cart.html" className="btn btn-sm cart-button">
                                  View Cart
                                </a>
                                <a
                                  href="checkout.html"
                                  className="btn btn-sm cart-button theme-bg-color
                                                    text-white"
                                >
                                  Checkout
                                </a>
                              </div>
                            </div>
                          </div>
                        </li>
                        {/* dropdown của profile ở đây */}
                        <li className="right-side onhover-dropdown">
                          <div className="delivery-login-box">
                            <div className="delivery-icon">
                              <i data-feather="user"></i>
                            </div>
                            <div className="delivery-detail">
                              <h6>Hello,</h6>
                              <h5>{user ? user.fullName : "My Account"}</h5>
                            </div>
                          </div>
                          <div className="onhover-div onhover-div-login">
                            <ul className="user-box-name">
                              {user ? (
                                <>
                                  <li className="product-box-contain">
                                    <a href="#" onClick={handleLogout}>
                                      Logout
                                    </a>
                                  </li>

                                  <li className="product-box-contain">
                                    <a href="/forgot">Forgot Password</a>
                                  </li>
                                </>
                              ) : (
                                <>
                                  <li className="product-box-contain">
                                    <a href="/login">Log In</a>
                                  </li>

                                  <li className="product-box-contain">
                                    <a href="/signup">Register</a>
                                  </li>
                                </>
                              )}
                              {/* Hết dropdown */}
                            </ul>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="container-fluid-lg">
            <div className="row">
              <div className="col-12">
                <div className="header-nav">
                  <div className="header-nav-left">
                    <button className="dropdown-category">
                      <i data-feather="align-left"></i>
                      <span>All Categories</span>
                    </button>

                    <div className="category-dropdown">
                      <div className="category-title">
                        <h5>Categories</h5>
                        <button type="button" className="btn p-0 close-button text-content">
                          <i className="fa-solid fa-xmark"></i>
                        </button>
                      </div>

                      <ul className="category-list">
                        <li className="onhover-category-list">
                          <a href="javascript:void(0)" className="category-name">
                            <img src="../assets/svg/1/vegetable.svg" alt="" />
                            <h6>Vegetables & Fruit</h6>
                            <i className="fa-solid fa-angle-right"></i>
                          </a>

                          <div className="onhover-category-box">
                            <div className="list-1">
                              <div className="category-title-box">
                                <h5>Organic Vegetables</h5>
                              </div>
                              <ul>
                                <li>
                                  <a href="javascript:void(0)">Potato & Tomato</a>
                                </li>
                                <li>
                                  <a href="javascript:void(0)">Cucumber & Capsicum</a>
                                </li>
                                <li>
                                  <a href="javascript:void(0)">Leafy Vegetables</a>
                                </li>
                                <li>
                                  <a href="javascript:void(0)">Root Vegetables</a>
                                </li>
                                <li>
                                  <a href="javascript:void(0)">Beans & Okra</a>
                                </li>
                                <li>
                                  <a href="javascript:void(0)">Cabbage & Cauliflower</a>
                                </li>
                                <li>
                                  <a href="javascript:void(0)">Gourd & Drumstick</a>
                                </li>
                                <li>
                                  <a href="javascript:void(0)">Specialty</a>
                                </li>
                              </ul>
                            </div>

                            <div className="list-2">
                              <div className="category-title-box">
                                <h5>Fresh Fruit</h5>
                              </div>
                              <ul>
                                <li>
                                  <a href="javascript:void(0)">Banana & Papaya</a>
                                </li>
                                <li>
                                  <a href="javascript:void(0)">Kiwi, Citrus Fruit</a>
                                </li>
                                <li>
                                  <a href="javascript:void(0)">Apples & Pomegranate</a>
                                </li>
                                <li>
                                  <a href="javascript:void(0)">Seasonal Fruits</a>
                                </li>
                                <li>
                                  <a href="javascript:void(0)">Mangoes</a>
                                </li>
                                <li>
                                  <a href="javascript:void(0)">Fruit Baskets</a>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </li>

                        <li className="onhover-category-list">
                          <a href="javascript:void(0)" className="category-name">
                            <img src="../assets/svg/1/cup.svg" alt="" />
                            <h6>Beverages</h6>
                            <i className="fa-solid fa-angle-right"></i>
                          </a>

                          <div className="onhover-category-box w-100">
                            <div className="list-1">
                              <div className="category-title-box">
                                <h5>Energy & Soft Drinks</h5>
                              </div>
                              <ul>
                                <li>
                                  <a href="javascript:void(0)">Soda & Cocktail Mix</a>
                                </li>
                                <li>
                                  <a href="javascript:void(0)">Soda & Cocktail Mix</a>
                                </li>
                                <li>
                                  <a href="javascript:void(0)">Sports & Energy Drinks</a>
                                </li>
                                <li>
                                  <a href="javascript:void(0)">Non Alcoholic Drinks</a>
                                </li>
                                <li>
                                  <a href="javascript:void(0)">Packaged Water</a>
                                </li>
                                <li>
                                  <a href="javascript:void(0)">Spring Water</a>
                                </li>
                                <li>
                                  <a href="javascript:void(0)">Flavoured Water</a>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </li>

                        <li className="onhover-category-list">
                          <a href="javascript:void(0)" className="category-name">
                            <img src="../assets/svg/1/meats.svg" alt="" />
                            <h6>Meats & Seafood</h6>
                            <i className="fa-solid fa-angle-right"></i>
                          </a>

                          <div className="onhover-category-box">
                            <div className="list-1">
                              <div className="category-title-box">
                                <h5>Meat</h5>
                              </div>
                              <ul>
                                <li>
                                  <a href="javascript:void(0)">Fresh Meat</a>
                                </li>
                                <li>
                                  <a href="javascript:void(0)">Frozen Meat</a>
                                </li>
                                <li>
                                  <a href="javascript:void(0)">Marinated Meat</a>
                                </li>
                                <li>
                                  <a href="javascript:void(0)">Fresh & Frozen Meat</a>
                                </li>
                              </ul>
                            </div>

                            <div className="list-2">
                              <div className="category-title-box">
                                <h5>Seafood</h5>
                              </div>
                              <ul>
                                <li>
                                  <a href="javascript:void(0)">Fresh Water Fish</a>
                                </li>
                                <li>
                                  <a href="javascript:void(0)">Dry Fish</a>
                                </li>
                                <li>
                                  <a href="javascript:void(0)">Frozen Fish & Seafood</a>
                                </li>
                                <li>
                                  <a href="javascript:void(0)">Marine Water Fish</a>
                                </li>
                                <li>
                                  <a href="javascript:void(0)">Canned Seafood</a>
                                </li>
                                <li>
                                  <a href="javascript:void(0)">Prawans & Shrimps</a>
                                </li>
                                <li>
                                  <a href="javascript:void(0)">Other Seafood</a>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </li>

                        <li className="onhover-category-list">
                          <a href="javascript:void(0)" className="category-name">
                            <img src="../assets/svg/1/breakfast.svg" alt="" />
                            <h6>Breakfast & Dairy</h6>
                            <i className="fa-solid fa-angle-right"></i>
                          </a>

                          <div className="onhover-category-box">
                            <div className="list-1">
                              <div className="category-title-box">
                                <h5>Breakfast Cereals</h5>
                              </div>
                              <ul>
                                <li>
                                  <a href="javascript:void(0)">Oats & Porridge</a>
                                </li>
                                <li>
                                  <a href="javascript:void(0)">Kids Cereal</a>
                                </li>
                                <li>
                                  <a href="javascript:void(0)">Muesli</a>
                                </li>
                                <li>
                                  <a href="javascript:void(0)">Flakes</a>
                                </li>
                                <li>
                                  <a href="javascript:void(0)">Granola & Cereal Bars</a>
                                </li>
                                <li>
                                  <a href="javascript:void(0)">Instant Noodles</a>
                                </li>
                                <li>
                                  <a href="javascript:void(0)">Pasta & Macaroni</a>
                                </li>
                                <li>
                                  <a href="javascript:void(0)">Frozen Non-Veg Snacks</a>
                                </li>
                              </ul>
                            </div>

                            <div className="list-2">
                              <div className="category-title-box">
                                <h5>Dairy</h5>
                              </div>
                              <ul>
                                <li>
                                  <a href="javascript:void(0)">Milk</a>
                                </li>
                                <li>
                                  <a href="javascript:void(0)">Curd</a>
                                </li>
                                <li>
                                  <a href="javascript:void(0)">Paneer, Tofu & Cream</a>
                                </li>
                                <li>
                                  <a href="javascript:void(0)">Butter & Margarine</a>
                                </li>
                                <li>
                                  <a href="javascript:void(0)">Condensed, Powdered Milk</a>
                                </li>
                                <li>
                                  <a href="javascript:void(0)">Buttermilk & Lassi</a>
                                </li>
                                <li>
                                  <a href="javascript:void(0)">Yogurt & Shrikhand</a>
                                </li>
                                <li>
                                  <a href="javascript:void(0)">Flavoured, Soya Milk</a>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </li>

                        <li className="onhover-category-list">
                          <a href="javascript:void(0)" className="category-name">
                            <img src="../assets/svg/1/frozen.svg" alt="" />
                            <h6>Frozen Foods</h6>
                            <i className="fa-solid fa-angle-right"></i>
                          </a>

                          <div className="onhover-category-box w-100">
                            <div className="list-1">
                              <div className="category-title-box">
                                <h5>Noodle, Pasta</h5>
                              </div>
                              <ul>
                                <li>
                                  <a href="javascript:void(0)">Instant Noodles</a>
                                </li>
                                <li>
                                  <a href="javascript:void(0)">Hakka Noodles</a>
                                </li>
                                <li>
                                  <a href="javascript:void(0)">Cup Noodles</a>
                                </li>
                                <li>
                                  <a href="javascript:void(0)">Vermicelli</a>
                                </li>
                                <li>
                                  <a href="javascript:void(0)">Instant Pasta</a>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </li>

                        <li className="onhover-category-list">
                          <a href="javascript:void(0)" className="category-name">
                            <img src="../assets/svg/1/biscuit.svg" alt="" />
                            <h6>Biscuits & Snacks</h6>
                            <i className="fa-solid fa-angle-right"></i>
                          </a>

                          <div className="onhover-category-box">
                            <div className="list-1">
                              <div className="category-title-box">
                                <h5>Biscuits & Cookies</h5>
                              </div>
                              <ul>
                                <li>
                                  <a href="javascript:void(0)">Salted Biscuits</a>
                                </li>
                                <li>
                                  <a href="javascript:void(0)">Marie, Health, Digestive</a>
                                </li>
                                <li>
                                  <a href="javascript:void(0)">Cream Biscuits & Wafers</a>
                                </li>
                                <li>
                                  <a href="javascript:void(0)">Glucose & Milk Biscuits</a>
                                </li>
                                <li>
                                  <a href="javascript:void(0)">Cookies</a>
                                </li>
                              </ul>
                            </div>

                            <div className="list-2">
                              <div className="category-title-box">
                                <h5>Bakery Snacks</h5>
                              </div>
                              <ul>
                                <li>
                                  <a href="javascript:void(0)">Bread Sticks & Lavash</a>
                                </li>
                                <li>
                                  <a href="javascript:void(0)">Cheese & Garlic Bread</a>
                                </li>
                                <li>
                                  <a href="javascript:void(0)">Puffs, Patties, Sandwiches</a>
                                </li>
                                <li>
                                  <a href="javascript:void(0)">Breadcrumbs & Croutons</a>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </li>

                        <li className="onhover-category-list">
                          <a href="javascript:void(0)" className="category-name">
                            <img src="../assets/svg/1/grocery.svg" alt="" />
                            <h6>Grocery & Staples</h6>
                            <i className="fa-solid fa-angle-right"></i>
                          </a>

                          <div className="onhover-category-box">
                            <div className="list-1">
                              <div className="category-title-box">
                                <h5>Grocery</h5>
                              </div>
                              <ul>
                                <li>
                                  <a href="javascript:void(0)">Lemon, Ginger & Garlic</a>
                                </li>
                                <li>
                                  <a href="javascript:void(0)">Indian & Exotic Herbs</a>
                                </li>
                                <li>
                                  <a href="javascript:void(0)">Organic Vegetables</a>
                                </li>
                                <li>
                                  <a href="javascript:void(0)">Organic Fruits</a>
                                </li>
                              </ul>
                            </div>

                            <div className="list-2">
                              <div className="category-title-box">
                                <h5>Organic Staples</h5>
                              </div>
                              <ul>
                                <li>
                                  <a href="javascript:void(0)">Organic Dry Fruits</a>
                                </li>
                                <li>
                                  <a href="javascript:void(0)">Organic Dals & Pulses</a>
                                </li>
                                <li>
                                  <a href="javascript:void(0)">Organic Millet & Flours</a>
                                </li>
                                <li>
                                  <a href="javascript:void(0)">Organic Sugar, Jaggery</a>
                                </li>
                                <li>
                                  <a href="javascript:void(0)">Organic Masalas & Spices</a>
                                </li>
                                <li>
                                  <a href="javascript:void(0)">Organic Rice, Other Rice</a>
                                </li>
                                <li>
                                  <a href="javascript:void(0)">Organic Flours</a>
                                </li>
                                <li>
                                  <a href="javascript:void(0)">Organic Edible Oil, Ghee</a>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="header-nav-middle">
                    <div className="main-nav navbar navbar-expand-xl navbar-light navbar-sticky">
                      <div className="offcanvas offcanvas-collapse order-xl-2" id="primaryMenu">
                        <div className="offcanvas-header navbar-shadow">
                          <h5>Menu</h5>
                          <button className="btn-close lead" type="button" data-bs-dismiss="offcanvas"></button>
                        </div>
                        <div className="offcanvas-body">
                          <ul className="navbar-nav">
                            <li className="nav-item dropdown">
                              <a
                                className="nav-link dropdown-toggle"
                                href="javascript:void(0)"
                                data-bs-toggle="dropdown"
                              >
                                Home
                              </a>

                              <ul className="dropdown-menu">
                                <li>
                                  <a className="dropdown-item" href="index.html">
                                    Kartshop
                                  </a>
                                </li>
                                <li>
                                  <a className="dropdown-item" href="index-2.html">
                                    Sweetshop
                                  </a>
                                </li>
                                <li>
                                  <a className="dropdown-item" href="index-3.html">
                                    Organic
                                  </a>
                                </li>
                                <li>
                                  <a className="dropdown-item" href="index-4.html">
                                    Supershop
                                  </a>
                                </li>
                                <li>
                                  <a className="dropdown-item" href="index-5.html">
                                    classNameic shop
                                  </a>
                                </li>
                                <li>
                                  <a className="dropdown-item" href="index-6.html">
                                    Furniture
                                  </a>
                                </li>
                                <li>
                                  <a className="dropdown-item" href="index-7.html">
                                    Search Oriented
                                  </a>
                                </li>
                                <li>
                                  <a className="dropdown-item" href="index-8.html">
                                    Category Focus
                                  </a>
                                </li>
                                <li>
                                  <a className="dropdown-item" href="index-9.html">
                                    Fashion
                                  </a>
                                </li>
                                <li>
                                  <a className="dropdown-item" href="index-10.html">
                                    Book
                                  </a>
                                </li>
                                <li>
                                  <a className="dropdown-item" href="index-11.html">
                                    Digital
                                  </a>
                                </li>
                              </ul>
                            </li>

                            <li className="nav-item dropdown">
                              <a
                                className="nav-link dropdown-toggle"
                                href="javascript:void(0)"
                                data-bs-toggle="dropdown"
                              >
                                Shop
                              </a>

                              <ul className="dropdown-menu">
                                <li>
                                  <a className="dropdown-item" href="shop-category-slider.html">
                                    Shop Category Slider
                                  </a>
                                </li>
                                <li>
                                  <a className="dropdown-item" href="shop-category.html">
                                    Shop Category Sidebar
                                  </a>
                                </li>
                                <li>
                                  <a className="dropdown-item" href="shop-banner.html">
                                    Shop Banner
                                  </a>
                                </li>
                                <li>
                                  <a className="dropdown-item" href="shop-left-sidebar.html">
                                    Shop Left Sidebar
                                  </a>
                                </li>
                                <li>
                                  <a className="dropdown-item" href="shop-list.html">
                                    Shop List
                                  </a>
                                </li>
                                <li>
                                  <a className="dropdown-item" href="shop-right-sidebar.html">
                                    Shop Right Sidebar
                                  </a>
                                </li>
                                <li>
                                  <a className="dropdown-item" href="shop-top-filter.html">
                                    Shop Top Filter
                                  </a>
                                </li>
                              </ul>
                            </li>

                            <li className="nav-item dropdown">
                              <a
                                className="nav-link dropdown-toggle"
                                href="javascript:void(0)"
                                data-bs-toggle="dropdown"
                              >
                                Product
                              </a>

                              <div className="dropdown-menu dropdown-menu-3 dropdown-menu-2">
                                <div className="row">
                                  <div className="col-xl-3">
                                    <div className="dropdown-column m-0">
                                      <h5 className="dropdown-header">Product Pages </h5>
                                      <a className="dropdown-item" href="product-left-thumbnail.html">
                                        Product Thumbnail
                                      </a>
                                      <a className="dropdown-item" href="product-4-image.html">
                                        Product Images
                                      </a>
                                      <a className="dropdown-item" href="product-slider.html">
                                        Product Slider
                                      </a>
                                      <a className="dropdown-item" href="product-sticky.html">
                                        Product Sticky
                                      </a>
                                      <a className="dropdown-item" href="product-accordion.html">
                                        Product Accordion
                                      </a>
                                      <a className="dropdown-item" href="product-circle.html">
                                        Product Tab
                                      </a>
                                      <a className="dropdown-item" href="product-digital.html">
                                        Product Digital
                                      </a>

                                      <h5 className="custom-mt dropdown-header">Product Features</h5>
                                      <a className="dropdown-item" href="product-circle.html">
                                        Bundle (Cross Sale)
                                      </a>
                                      <a className="dropdown-item" href="product-left-thumbnail.html">
                                        Hot Stock Progress <label className="menu-label">New</label>
                                      </a>
                                      <a className="dropdown-item" href="product-sold-out.html">
                                        SOLD OUT
                                      </a>
                                      <a className="dropdown-item" href="product-circle.html">
                                        Sale Countdown
                                      </a>
                                    </div>
                                  </div>
                                  <div className="col-xl-3">
                                    <div className="dropdown-column m-0">
                                      <h5 className="dropdown-header">Product Variants Style </h5>
                                      <a className="dropdown-item" href="product-rectangle.html">
                                        Variant Rectangle
                                      </a>
                                      <a className="dropdown-item" href="product-circle.html">
                                        Variant Circle <label className="menu-label">New</label>
                                      </a>
                                      <a className="dropdown-item" href="product-color-image.html">
                                        Variant Image Swatch
                                      </a>
                                      <a className="dropdown-item" href="product-color.html">
                                        Variant Color
                                      </a>
                                      <a className="dropdown-item" href="product-radio.html">
                                        Variant Radio Button
                                      </a>
                                      <a className="dropdown-item" href="product-dropdown.html">
                                        Variant Dropdown
                                      </a>
                                      <h5 className="custom-mt dropdown-header">Product Features</h5>
                                      <a className="dropdown-item" href="product-left-thumbnail.html">
                                        Sticky Checkout
                                      </a>
                                      <a className="dropdown-item" href="product-dynamic.html">
                                        Dynamic Checkout
                                      </a>
                                      <a className="dropdown-item" href="product-sticky.html">
                                        Secure Checkout
                                      </a>
                                      <a className="dropdown-item" href="product-bundle.html">
                                        Active Product view
                                      </a>
                                      <a className="dropdown-item" href="product-bundle.html">
                                        Active Last Orders
                                      </a>
                                    </div>
                                  </div>
                                  <div className="col-xl-3">
                                    <div className="dropdown-column m-0">
                                      <h5 className="dropdown-header">Product Features </h5>
                                      <a className="dropdown-item" href="product-image.html">
                                        Product Simple
                                      </a>
                                      <a className="dropdown-item" href="product-rectangle.html">
                                        Product classNameified <label className="menu-label">New</label>
                                      </a>
                                      <a className="dropdown-item" href="product-size-chart.html">
                                        Size Chart <label className="menu-label">New</label>
                                      </a>
                                      <a className="dropdown-item" href="product-size-chart.html">
                                        Delivery & Return
                                      </a>
                                      <a className="dropdown-item" href="product-size-chart.html">
                                        Product Review
                                      </a>
                                      <a className="dropdown-item" href="product-expert.html">
                                        Ask an Expert
                                      </a>
                                      <h5 className="custom-mt dropdown-header">Product Features</h5>
                                      <a className="dropdown-item" href="product-bottom-thumbnail.html">
                                        Product Tags
                                      </a>
                                      <a className="dropdown-item" href="product-image.html">
                                        Store Information
                                      </a>
                                      <a className="dropdown-item" href="product-image.html">
                                        Social Share <label className="menu-label warning-label">Hot</label>
                                      </a>
                                      <a className="dropdown-item" href="product-left-thumbnail.html">
                                        Related Products
                                        <label className="menu-label warning-label">Hot</label>
                                      </a>
                                      <a className="dropdown-item" href="product-right-thumbnail.html">
                                        Wishlist & Compare
                                      </a>
                                    </div>
                                  </div>
                                  <div className="col-xl-3 d-xl-block d-none">
                                    <div className="dropdown-column m-0">
                                      <div className="menu-img-banner">
                                        <a className="text-title" href="product-circle.html">
                                          <img src="../assets/images/mega-menu.png" alt="banner" />
                                        </a>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </li>

                            <li className="nav-item dropdown dropdown-mega">
                              <a
                                className="nav-link dropdown-toggle ps-xl-2 ps-0"
                                href="javascript:void(0)"
                                data-bs-toggle="dropdown"
                              >
                                Mega Menu
                              </a>

                              <div className="dropdown-menu dropdown-menu-2">
                                <div className="row">
                                  <div className="dropdown-column col-xl-3">
                                    <h5 className="dropdown-header">Daily Vegetables</h5>
                                    <a className="dropdown-item" href="shop-left-sidebar.html">
                                      Beans & Brinjals
                                    </a>

                                    <a className="dropdown-item" href="shop-left-sidebar.html">
                                      Broccoli & Cauliflower
                                    </a>

                                    <a href="shop-left-sidebar.html" className="dropdown-item">
                                      Chilies, Garlic
                                    </a>

                                    <a className="dropdown-item" href="shop-left-sidebar.html">
                                      Vegetables & Salads
                                    </a>

                                    <a className="dropdown-item" href="shop-left-sidebar.html">
                                      Gourd, Cucumber
                                    </a>

                                    <a className="dropdown-item" href="shop-left-sidebar.html">
                                      Herbs & Sprouts
                                    </a>

                                    <a href="demo-personal-portfolio.html" className="dropdown-item">
                                      Lettuce & Leafy
                                    </a>
                                  </div>

                                  <div className="dropdown-column col-xl-3">
                                    <h5 className="dropdown-header">Baby Tender</h5>
                                    <a className="dropdown-item" href="shop-left-sidebar.html">
                                      Beans & Brinjals
                                    </a>

                                    <a className="dropdown-item" href="shop-left-sidebar.html">
                                      Broccoli & Cauliflower
                                    </a>

                                    <a className="dropdown-item" href="shop-left-sidebar.html">
                                      Chilies, Garlic
                                    </a>

                                    <a className="dropdown-item" href="shop-left-sidebar.html">
                                      Vegetables & Salads
                                    </a>

                                    <a className="dropdown-item" href="shop-left-sidebar.html">
                                      Gourd, Cucumber
                                    </a>

                                    <a className="dropdown-item" href="shop-left-sidebar.html">
                                      Potatoes & Tomatoes
                                    </a>

                                    <a href="shop-left-sidebar.html" className="dropdown-item">
                                      Peas & Corn
                                    </a>
                                  </div>

                                  <div className="dropdown-column col-xl-3">
                                    <h5 className="dropdown-header">Exotic Vegetables</h5>
                                    <a className="dropdown-item" href="shop-left-sidebar.html">
                                      Asparagus & Artichokes
                                    </a>

                                    <a className="dropdown-item" href="shop-left-sidebar.html">
                                      Avocados & Peppers
                                    </a>

                                    <a className="dropdown-item" href="shop-left-sidebar.html">
                                      Broccoli & Zucchini
                                    </a>

                                    <a className="dropdown-item" href="shop-left-sidebar.html">
                                      Celery, Fennel & Leeks
                                    </a>

                                    <a className="dropdown-item" href="shop-left-sidebar.html">
                                      Chilies & Lime
                                    </a>
                                  </div>

                                  <div className="dropdown-column dropdown-column-img col-3"></div>
                                </div>
                              </div>
                            </li>

                            <li className="nav-item dropdown">
                              <a
                                className="nav-link dropdown-toggle"
                                href="javascript:void(0)"
                                data-bs-toggle="dropdown"
                              >
                                Blog
                              </a>
                              <ul className="dropdown-menu">
                                <li>
                                  <a className="dropdown-item" href="blog-detail.html">
                                    Blog Detail
                                  </a>
                                </li>
                                <li>
                                  <a className="dropdown-item" href="blog-grid.html">
                                    Blog Grid
                                  </a>
                                </li>
                                <li>
                                  <a className="dropdown-item" href="blog-list.html">
                                    Blog List
                                  </a>
                                </li>
                              </ul>
                            </li>

                            <li className="nav-item dropdown new-nav-item">
                              <a
                                className="nav-link dropdown-toggle"
                                href="javascript:void(0)"
                                data-bs-toggle="dropdown"
                              >
                                Pages <label className="new-dropdown">New</label>
                              </a>
                              <ul className="dropdown-menu">
                                <li className="sub-dropdown-hover">
                                  <a className="dropdown-item" href="javascript:void(0)">
                                    Email Template{" "}
                                    <span className="new-text">
                                      <i className="fa-solid fa-bolt-lightning"></i>
                                    </span>
                                  </a>
                                  <ul className="sub-menu">
                                    <li>
                                      <a href="../email-templete/abandonment-email.html">Abandonment</a>
                                    </li>
                                    <li>
                                      <a href="../email-templete/offer-template.html">Offer Template</a>
                                    </li>
                                    <li>
                                      <a href="../email-templete/order-success.html">Order Success</a>
                                    </li>
                                    <li>
                                      <a href="../email-templete/reset-password.html">Reset Password</a>
                                    </li>
                                    <li>
                                      <a href="../email-templete/welcome.html">Welcome template</a>
                                    </li>
                                  </ul>
                                </li>
                                <li className="sub-dropdown-hover">
                                  <a className="dropdown-item" href="javascript:void(0)">
                                    Invoice Template{" "}
                                    <span className="new-text">
                                      <i className="fa-solid fa-bolt-lightning"></i>
                                    </span>
                                  </a>
                                  <ul className="sub-menu">
                                    <li>
                                      <a href="../invoice/invoice-1.html">Invoice 1</a>
                                    </li>

                                    <li>
                                      <a href="../invoice/invoice-2.html">Invoice 2</a>
                                    </li>

                                    <li>
                                      <a href="../invoice/invoice-3.html">Invoice 3</a>
                                    </li>
                                  </ul>
                                </li>
                                <li>
                                  <a className="dropdown-item" href="404.html">
                                    404
                                  </a>
                                </li>
                                <li>
                                  <a className="dropdown-item" href="about-us.html">
                                    About Us
                                  </a>
                                </li>
                                <li>
                                  <a className="dropdown-item" href="cart.html">
                                    Cart
                                  </a>
                                </li>
                                <li>
                                  <a className="dropdown-item" href="contact-us.html">
                                    Contact
                                  </a>
                                </li>
                                <li>
                                  <a className="dropdown-item" href="checkout.html">
                                    Checkout
                                  </a>
                                </li>
                                <li>
                                  <a className="dropdown-item" href="coming-soon.html">
                                    Coming Soon
                                  </a>
                                </li>
                                <li>
                                  <a className="dropdown-item" href="compare.html">
                                    Compare
                                  </a>
                                </li>
                                <li>
                                  <a className="dropdown-item" href="faq.html">
                                    Faq
                                  </a>
                                </li>
                                <li>
                                  <a className="dropdown-item" href="order-success.html">
                                    Order Success
                                  </a>
                                </li>
                                <li>
                                  <a className="dropdown-item" href="order-tracking.html">
                                    Order Tracking
                                  </a>
                                </li>
                                <li>
                                  <a className="dropdown-item" href="otp.html">
                                    OTP
                                  </a>
                                </li>
                                <li>
                                  <a className="dropdown-item" href="search.html">
                                    Search
                                  </a>
                                </li>
                                <li>
                                  <a className="dropdown-item" href="user-dashboard.html">
                                    User Dashboard
                                  </a>
                                </li>
                                <li>
                                  <a className="dropdown-item" href="wishlist.html">
                                    Wishlist
                                  </a>
                                </li>
                              </ul>
                            </li>

                            <li className="nav-item dropdown">
                              <a
                                className="nav-link dropdown-toggle"
                                href="javascript:void(0)"
                                data-bs-toggle="dropdown"
                              >
                                Seller
                              </a>
                              <ul className="dropdown-menu">
                                <li>
                                  <a className="dropdown-item" href="seller-become.html">
                                    Become a Seller
                                  </a>
                                </li>
                                <li>
                                  <a className="dropdown-item" href="seller-dashboard.html">
                                    Seller Dashboard
                                  </a>
                                </li>
                                <li>
                                  <a className="dropdown-item" href="seller-detail.html">
                                    Seller Detail
                                  </a>
                                </li>
                                <li>
                                  <a className="dropdown-item" href="seller-detail-2.html">
                                    Seller Detail 2
                                  </a>
                                </li>
                                <li>
                                  <a className="dropdown-item" href="seller-grid.html">
                                    Seller Grid
                                  </a>
                                </li>
                                <li>
                                  <a className="dropdown-item" href="seller-grid-2.html">
                                    Seller Grid 2
                                  </a>
                                </li>
                              </ul>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="header-nav-right">
                    <button className="btn deal-button" data-bs-toggle="modal" data-bs-target="#deal-box">
                      <i data-feather="zap"></i>
                      <span>Deal Today</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>
        {/* <!-- Header End -->

    <!-- mobile fix menu start --> */}
        <div className="mobile-menu d-md-none d-block mobile-cart">
          <ul>
            <li>
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
        {/* <!-- mobile fix menu end -->

    <!-- Breadcrumb Section Start --> */}
        <section className="breadcrumb-section pt-0">
          <div className="container-fluid-lg">
            <div className="row">
              <div className="col-12">
                <div className="breadcrumb-contain">
                  <h2>User Dashboard</h2>
                  <nav>
                    <ol className="breadcrumb mb-0">
                      <li className="breadcrumb-item">
                        <a href="index.html">
                          <i className="fa-solid fa-house"></i>
                        </a>
                      </li>
                      <li className="breadcrumb-item active">User Dashboard</li>
                    </ol>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* <!-- Breadcrumb Section End -->

    <!-- User Dashboard Section Start --> */}
        <section className="user-dashboard-section section-b-space">
          <div className="container-fluid-lg">
            <div className="row">
              <div className="col-xxl-3 col-lg-4">
                <div className="dashboard-left-sidebar">
                  <div className="close-button d-flex d-lg-none">
                    <button className="close-sidebar">
                      <i className="fa-solid fa-xmark"></i>
                    </button>
                  </div>
                  <div className="profile-box">
                    <div className="cover-image">
                      <img
                        src="../assets/images/inner-page/cover-img.jpg"
                        className="img-fluid blur-up lazyload"
                        alt=""
                      />
                    </div>

                    <div className="profile-contain">
                      <div className="profile-image">
                        <div className="position-relative">
                          <img
                            src="../assets/images/vendor-page/logo.png"
                            className="blur-up lazyload update_img"
                            alt=""
                          />
                        </div>
                      </div>

                      <div className="profile-name">
                        <h3>Joshua D. Bass</h3>
                        <h6 className="text-content">joshuadbass@rhyta.com</h6>
                      </div>
                    </div>
                  </div>

                  <ul className="nav nav-pills user-nav-pills" id="pills-tab" role="tablist">
                    <li className="nav-item" role="presentation">
                      <a
                        href="#pills-tabContent"
                        className="nav-link active"
                        id="pills-dashboard-tab"
                        data-bs-toggle="pill"
                        data-bs-target="#pills-dashboard"
                        role="tab"
                      >
                        <i data-feather="home"></i>
                        DashBoard
                      </a>
                    </li>

                    <li className="nav-item" role="presentation">
                      <button
                        className="nav-link"
                        id="pills-product-tab"
                        data-bs-toggle="pill"
                        data-bs-target="#pills-product"
                        type="button"
                        role="tab"
                      >
                        <i data-feather="shopping-bag"></i>Products
                      </button>
                    </li>

                    <li className="nav-item" role="presentation">
                      <button
                        className="nav-link"
                        id="pills-order-tab"
                        data-bs-toggle="pill"
                        data-bs-target="#pills-order"
                        type="button"
                        role="tab"
                      >
                        <i data-feather="shopping-bag"></i>Order
                      </button>
                    </li>

                    <li className="nav-item" role="presentation">
                      <button
                        className="nav-link"
                        id="pills-profile-tab"
                        data-bs-toggle="pill"
                        data-bs-target="#pills-profile"
                        type="button"
                        role="tab"
                      >
                        <i data-feather="user"></i>
                        Profile
                      </button>
                    </li>

                    <li className="nav-item" role="presentation">
                      <button
                        className="nav-link"
                        id="pills-security-tab"
                        data-bs-toggle="pill"
                        data-bs-target="#pills-security"
                        type="button"
                        role="tab"
                      >
                        <i data-feather="settings"></i>
                        Setting
                      </button>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="col-xxl-9 col-lg-8">
                <button className="btn left-dashboard-show btn-animation btn-md fw-bold d-block mb-4 d-lg-none">
                  Show Menu
                </button>
                <div className="dashboard-right-sidebar">
                  <div className="tab-content" id="pills-tabContent">
                    <div className="tab-pane fade show active" id="pills-dashboard" role="tabpanel">
                      <div className="dashboard-home">
                        <div className="title">
                          <h2>My Dashboard</h2>
                          <span className="title-leaf">
                            <svg className="icon-width bg-gray">
                              <use href="../assets/svg/leaf.svg#leaf"></use>
                            </svg>
                          </span>
                        </div>

                        <div className="dashboard-user-name">
                          <h6 className="text-content">
                            Hello, <b className="text-title">Vicki E. Pope</b>
                          </h6>
                          <p className="text-content">
                            From your My Account Dashboard you have the ability to view a snapshot of your recent
                            account activity and update your account information. Select a link below to view or edit
                            information.
                          </p>
                        </div>

                        <div className="total-box">
                          <div className="row g-sm-4 g-3">
                            <div className="col-xxl-4 col-lg-6 col-md-4 col-sm-6">
                              <div className="total-contain">
                                <img src="../assets/images/svg/order.svg" className="img-1 blur-up lazyload" alt="" />
                                <img src="../assets/images/svg/order.svg" className="blur-up lazyload" alt="" />
                                <div className="total-detail">
                                  <h5>Total Products</h5>
                                  <h3>25</h3>
                                </div>
                              </div>
                            </div>

                            <div className="col-xxl-4 col-lg-6 col-md-4 col-sm-6">
                              <div className="total-contain">
                                <img src="../assets/images/svg/pending.svg" className="img-1 blur-up lazyload" alt="" />
                                <img src="../assets/images/svg/pending.svg" className="blur-up lazyload" alt="" />
                                <div className="total-detail">
                                  <h5>Total Sales</h5>
                                  <h3>12550</h3>
                                </div>
                              </div>
                            </div>

                            <div className="col-xxl-4 col-lg-6 col-md-4 col-sm-6">
                              <div className="total-contain">
                                <img
                                  src="../assets/images/svg/wishlist.svg"
                                  className="img-1 blur-up lazyload"
                                  alt=""
                                />
                                <img src="../assets/images/svg/wishlist.svg" className="blur-up lazyload" alt="" />
                                <div className="total-detail">
                                  <h5>Order Pending</h5>
                                  <h3>36</h3>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="row g-4">
                          <div className="col-xxl-6">
                            <div className="dashboard-bg-box">
                              <div id="chart"></div>
                            </div>
                          </div>

                          <div className="col-xxl-6">
                            <div className="dashboard-bg-box">
                              <div id="sale"></div>
                            </div>
                          </div>

                          <div className="col-xxl-6">
                            <div className="table-responsive dashboard-bg-box">
                              <div className="dashboard-title mb-4">
                                <h3>Trending Products</h3>
                              </div>

                              <table className="table product-table">
                                <thead>
                                  <tr>
                                    <th scope="col">Images</th>
                                    <th scope="col">Product Name</th>
                                    <th scope="col">Price</th>
                                    <th scope="col">Sales</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr>
                                    <td className="product-image">
                                      <img
                                        src="../assets/images/vegetable/product/1.png"
                                        className="img-fluid"
                                        alt=""
                                      />
                                    </td>
                                    <td>
                                      <h6>Fantasy Crunchy Choco Chip Cookies</h6>
                                    </td>
                                    <td>
                                      <h6>$25.69</h6>
                                    </td>
                                    <td>
                                      <h6>152</h6>
                                    </td>
                                  </tr>

                                  <tr>
                                    <td className="product-image">
                                      <img
                                        src="../assets/images/vegetable/product/2.png"
                                        className="img-fluid"
                                        alt=""
                                      />
                                    </td>
                                    <td>
                                      <h6>Peanut Butter Bite Premium Butter Cookies 600 g</h6>
                                    </td>
                                    <td>
                                      <h6>$35.36</h6>
                                    </td>
                                    <td>
                                      <h6>34</h6>
                                    </td>
                                  </tr>

                                  <tr>
                                    <td className="product-image">
                                      <img
                                        src="../assets/images/vegetable/product/3.png"
                                        className="img-fluid"
                                        alt=""
                                      />
                                    </td>
                                    <td>
                                      <h6>Yumitos Chilli Sprinkled Potato Chips 100 g</h6>
                                    </td>
                                    <td>
                                      <h6>$78.55</h6>
                                    </td>
                                    <td>
                                      <h6>78</h6>
                                    </td>
                                  </tr>

                                  <tr>
                                    <td className="product-image">
                                      <img
                                        src="../assets/images/vegetable/product/4.png"
                                        className="img-fluid"
                                        alt=""
                                      />
                                    </td>
                                    <td>
                                      <h6>healthy Long Life Toned Milk 1 L</h6>
                                    </td>
                                    <td>
                                      <h6>$32.98</h6>
                                    </td>
                                    <td>
                                      <h6>135</h6>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>

                          <div className="col-xxl-6">
                            <div className="order-tab dashboard-bg-box">
                              <div className="dashboard-title mb-4">
                                <h3>Recent Order</h3>
                              </div>

                              <div className="table-responsive">
                                <table className="table order-table">
                                  <thead>
                                    <tr>
                                      <th scope="col">Order ID</th>
                                      <th scope="col">Product Name</th>
                                      <th scope="col">Status</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    <tr>
                                      <td className="product-image">#254834</td>
                                      <td>
                                        <h6>Choco Chip Cookies</h6>
                                      </td>
                                      <td>
                                        <label className="success">Shipped</label>
                                      </td>
                                    </tr>

                                    <tr>
                                      <td className="product-image">#355678</td>
                                      <td>
                                        <h6>Premium Butter Cookies</h6>
                                      </td>
                                      <td>
                                        <label className="danger">Pending</label>
                                      </td>
                                    </tr>

                                    <tr>
                                      <td className="product-image">#647536</td>
                                      <td>
                                        <h6>Sprinkled Potato Chips</h6>
                                      </td>
                                      <td>
                                        <label className="success">Shipped</label>
                                      </td>
                                    </tr>

                                    <tr>
                                      <td className="product-image">#125689</td>
                                      <td>
                                        <h6>Milk 1 L</h6>
                                      </td>
                                      <td>
                                        <label className="danger">Pending</label>
                                      </td>
                                    </tr>

                                    <tr>
                                      <td className="product-image">#215487</td>
                                      <td>
                                        <h6>Raw Mutton Leg</h6>
                                      </td>
                                      <td>
                                        <label className="danger">Pending</label>
                                      </td>
                                    </tr>

                                    <tr>
                                      <td className="product-image">#365474</td>
                                      <td>
                                        <h6>Instant Coffee</h6>
                                      </td>
                                      <td>
                                        <label className="success">Shipped</label>
                                      </td>
                                    </tr>

                                    <tr>
                                      <td className="product-image">#368415</td>
                                      <td>
                                        <h6>Jowar Stick and Jowar Chips</h6>
                                      </td>
                                      <td>
                                        <label className="danger">Pending</label>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="tab-pane fade" id="pills-product" role="tabpanel">
                      <div className="product-tab">
                        <div className="title">
                          <h2>All Product</h2>
                          <span className="title-leaf">
                            <svg className="icon-width bg-gray">
                              <use href="../assets/svg/leaf.svg#leaf"></use>
                            </svg>
                          </span>
                        </div>

                        <div className="table-responsive dashboard-bg-box">
                          <table className="table product-table">
                            <thead>
                              <tr>
                                <th scope="col">Images</th>
                                <th scope="col">Product Name</th>
                                <th scope="col">Price</th>
                                <th scope="col">Stock</th>
                                <th scope="col">Sales</th>
                                <th scope="col">Edit / Delete</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td className="product-image">
                                  <img src="../assets/images/vegetable/product/1.png" className="img-fluid" alt="" />
                                </td>
                                <td>
                                  <h6>Fantasy Crunchy Choco Chip Cookies</h6>
                                </td>
                                <td>
                                  <h6 className="theme-color fw-bold">$25.69</h6>
                                </td>
                                <td>
                                  <h6>63</h6>
                                </td>
                                <td>
                                  <h6>152</h6>
                                </td>
                                <td className="edit-delete">
                                  <i data-feather="edit" className="edit"></i>
                                  <i data-feather="trash-2" className="delete"></i>
                                </td>
                              </tr>

                              <tr>
                                <td className="product-image">
                                  <img src="../assets/images/vegetable/product/2.png" className="img-fluid" alt="" />
                                </td>
                                <td>
                                  <h6>Peanut Butter Bite Premium Butter Cookies 600 g</h6>
                                </td>
                                <td>
                                  <h6 className="theme-color fw-bold">$35.36</h6>
                                </td>
                                <td>
                                  <h6>14</h6>
                                </td>
                                <td>
                                  <h6>34</h6>
                                </td>
                                <td className="edit-delete">
                                  <i data-feather="edit" className="edit"></i>
                                  <i data-feather="trash-2" className="delete"></i>
                                </td>
                              </tr>

                              <tr>
                                <td className="product-image">
                                  <img src="../assets/images/vegetable/product/3.png" className="img-fluid" alt="" />
                                </td>
                                <td>
                                  <h6>Yumitos Chilli Sprinkled Potato Chips 100 g</h6>
                                </td>
                                <td>
                                  <h6 className="theme-color fw-bold">$78.55</h6>
                                </td>
                                <td>
                                  <h6>55</h6>
                                </td>
                                <td>
                                  <h6>78</h6>
                                </td>
                                <td className="edit-delete">
                                  <i data-feather="edit" className="edit"></i>
                                  <i data-feather="trash-2" className="delete"></i>
                                </td>
                              </tr>
                              <tr>
                                <td className="product-image">
                                  <img src="../assets/images/vegetable/product/4.png" className="img-fluid" alt="" />
                                </td>
                                <td>
                                  <h6>healthy Long Life Toned Milk 1 L</h6>
                                </td>
                                <td>
                                  <h6 className="theme-color fw-bold">$32.98</h6>
                                </td>
                                <td>
                                  <h6>69</h6>
                                </td>
                                <td>
                                  <h6>135</h6>
                                </td>
                                <td className="edit-delete">
                                  <i data-feather="edit" className="edit"></i>
                                  <i data-feather="trash-2" className="delete"></i>
                                </td>
                              </tr>
                              <tr>
                                <td className="product-image">
                                  <img src="../assets/images/vegetable/product/5.png" className="img-fluid" alt="" />
                                </td>
                                <td>
                                  <h6>Raw Mutton Leg, Packaging 5 Kg</h6>
                                </td>
                                <td>
                                  <h6 className="theme-color fw-bold">$36.98</h6>
                                </td>
                                <td>
                                  <h6>35</h6>
                                </td>
                                <td>
                                  <h6>154</h6>
                                </td>
                                <td className="edit-delete">
                                  <i data-feather="edit" className="edit"></i>
                                  <i data-feather="trash-2" className="delete"></i>
                                </td>
                              </tr>
                              <tr>
                                <td className="product-image">
                                  <img src="../assets/images/vegetable/product/6.png" className="img-fluid" alt="" />
                                </td>
                                <td>
                                  <h6>Cold Brew Coffee Instant Coffee 50 g</h6>
                                </td>
                                <td>
                                  <h6 className="theme-color fw-bold">$36.58</h6>
                                </td>
                                <td>
                                  <h6>69</h6>
                                </td>
                                <td>
                                  <h6>168</h6>
                                </td>
                                <td className="edit-delete">
                                  <i data-feather="edit" className="edit"></i>
                                  <i data-feather="trash-2" className="delete"></i>
                                </td>
                              </tr>
                              <tr>
                                <td className="product-image">
                                  <img src="../assets/images/vegetable/product/7.png" className="img-fluid" alt="" />
                                </td>
                                <td>
                                  <h6>SnackAmor Combo Pack of Jowar Stick and Jowar Chips</h6>
                                </td>
                                <td>
                                  <h6 className="theme-color fw-bold">$25.69</h6>
                                </td>
                                <td>
                                  <h6>63</h6>
                                </td>
                                <td>
                                  <h6>152</h6>
                                </td>
                                <td className="edit-delete">
                                  <i data-feather="edit" className="edit"></i>
                                  <i data-feather="trash-2" className="delete"></i>
                                </td>
                              </tr>
                            </tbody>
                          </table>

                          <nav className="custom-pagination">
                            <ul className="pagination justify-content-center">
                              <li className="page-item disabled">
                                <a className="page-link" href="javascript:void(0)" tabIndex="-1">
                                  <i className="fa-solid fa-angles-left"></i>
                                </a>
                              </li>
                              <li className="page-item active">
                                <a className="page-link" href="javascript:void(0)">
                                  1
                                </a>
                              </li>
                              <li className="page-item">
                                <a className="page-link" href="javascript:void(0)">
                                  2
                                </a>
                              </li>
                              <li className="page-item">
                                <a className="page-link" href="javascript:void(0)">
                                  3
                                </a>
                              </li>
                              <li className="page-item">
                                <a className="page-link" href="javascript:void(0)">
                                  <i className="fa-solid fa-angles-right"></i>
                                </a>
                              </li>
                            </ul>
                          </nav>
                        </div>
                      </div>
                    </div>

                    <div className="tab-pane fade" id="pills-order" role="tabpanel">
                      <div className="dashboard-order">
                        <div className="title">
                          <h2>All Order</h2>
                          <span className="title-leaf title-leaf-gray">
                            <svg className="icon-width bg-gray">
                              <use href="../assets/svg/leaf.svg#leaf"></use>
                            </svg>
                          </span>
                        </div>

                        <div className="order-tab dashboard-bg-box">
                          <div className="table-responsive">
                            <table className="table order-table">
                              <thead>
                                <tr>
                                  <th scope="col">Order ID</th>
                                  <th scope="col">Product Name</th>
                                  <th scope="col">Status</th>
                                  <th scope="col">Price</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td className="product-image">#254834</td>
                                  <td>
                                    <h6>Fantasy Crunchy Choco Chip Cookies</h6>
                                  </td>
                                  <td>
                                    <label className="success">Shipped</label>
                                  </td>
                                  <td>
                                    <h6>$25.69</h6>
                                  </td>
                                </tr>

                                <tr>
                                  <td className="product-image">#355678</td>
                                  <td>
                                    <h6>Peanut Butter Bite Premium Butter Cookies 600 g</h6>
                                  </td>
                                  <td>
                                    <label className="danger">Pending</label>
                                  </td>
                                  <td>
                                    <h6>$25.69</h6>
                                  </td>
                                </tr>

                                <tr>
                                  <td className="product-image">#647536</td>
                                  <td>
                                    <h6>Yumitos Chilli Sprinkled Potato Chips 100 g</h6>
                                  </td>
                                  <td>
                                    <label className="success">Shipped</label>
                                  </td>
                                  <td>
                                    <h6>$25.69</h6>
                                  </td>
                                </tr>

                                <tr>
                                  <td className="product-image">#125689</td>
                                  <td>
                                    <h6>healthy Long Life Toned Milk 1 L</h6>
                                  </td>
                                  <td>
                                    <label className="danger">Pending</label>
                                  </td>
                                  <td>
                                    <h6>$25.69</h6>
                                  </td>
                                </tr>

                                <tr>
                                  <td className="product-image">#215487</td>
                                  <td>
                                    <h6>Raw Mutton Leg, Packaging 5 Kg</h6>
                                  </td>
                                  <td>
                                    <label className="danger">Pending</label>
                                  </td>
                                  <td>
                                    <h6>$25.69</h6>
                                  </td>
                                </tr>

                                <tr>
                                  <td className="product-image">#365474</td>
                                  <td>
                                    <h6>Cold Brew Coffee Instant Coffee 50 g</h6>
                                  </td>
                                  <td>
                                    <label className="success">Shipped</label>
                                  </td>
                                  <td>
                                    <h6>$25.69</h6>
                                  </td>
                                </tr>

                                <tr>
                                  <td className="product-image">#368415</td>
                                  <td>
                                    <h6>SnackAmor Combo Pack of Jowar Stick and Jowar Chips</h6>
                                  </td>
                                  <td>
                                    <label className="danger">Pending</label>
                                  </td>
                                  <td>
                                    <h6>$25.69</h6>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                          <nav className="custom-pagination">
                            <ul className="pagination justify-content-center">
                              <li className="page-item disabled">
                                <a className="page-link" href="javascript:void(0)" tabIndex="-1">
                                  <i className="fa-solid fa-angles-left"></i>
                                </a>
                              </li>
                              <li className="page-item active">
                                <a className="page-link" href="javascript:void(0)">
                                  1
                                </a>
                              </li>
                              <li className="page-item">
                                <a className="page-link" href="javascript:void(0)">
                                  2
                                </a>
                              </li>
                              <li className="page-item">
                                <a className="page-link" href="javascript:void(0)">
                                  3
                                </a>
                              </li>
                              <li className="page-item">
                                <a className="page-link" href="javascript:void(0)">
                                  <i className="fa-solid fa-angles-right"></i>
                                </a>
                              </li>
                            </ul>
                          </nav>
                        </div>
                      </div>
                    </div>

                    <div className="tab-pane fade" id="pills-profile" role="tabpanel">
                      <div className="dashboard-profile">
                        <div className="title">
                          <h2>My Profile</h2>
                          <span className="title-leaf">
                            <svg className="icon-width bg-gray">
                              <use href="../assets/svg/leaf.svg#leaf"></use>
                            </svg>
                          </span>
                        </div>

                        <div className="profile-tab dashboard-bg-box">
                          <div className="dashboard-title dashboard-flex">
                            <h3>Profile Name</h3>
                            <button
                              className="btn btn-sm theme-bg-color text-white"
                              data-bs-toggle="modal"
                              data-bs-target="#edit-profile"
                            >
                              Edit Profile
                            </button>
                          </div>

                          <ul>
                            <li>
                              <h5>Company Name :</h5>
                              <h5>Grocery Store</h5>
                            </li>
                            <li>
                              <h5>Email Address :</h5>
                              <h5>joshuadbass@rhyta.com</h5>
                            </li>
                            <li>
                              <h5>Country / Region :</h5>
                              <h5>107 Veltri Drive</h5>
                            </li>

                            <li>
                              <h5>Year Established :</h5>
                              <h5>2022</h5>
                            </li>

                            <li>
                              <h5>Total Employees :</h5>
                              <h5>154 - 360 People</h5>
                            </li>
                            <li>
                              <h5>Category :</h5>
                              <h5>Grocery</h5>
                            </li>

                            <li>
                              <h5>Street Address :</h5>
                              <h5>234 High St</h5>
                            </li>

                            <li>
                              <h5>City / State :</h5>
                              <h5>107 Veltri Drive</h5>
                            </li>

                            <li>
                              <h5>Zip :</h5>
                              <h5>B23 6SN</h5>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="tab-pane fade" id="pills-security" role="tabpanel">
                      <div className="dashboard-privacy">
                        <div className="title">
                          <h2>My Setting</h2>
                          <span className="title-leaf">
                            <svg className="icon-width bg-gray">
                              <use href="../assets/svg/leaf.svg#leaf"></use>
                            </svg>
                          </span>
                        </div>

                        <div className="dashboard-bg-box">
                          <div className="dashboard-title mb-4">
                            <h3>Notifications</h3>
                          </div>

                          <div className="privacy-box">
                            <div className="form-check custom-form-check custom-form-check-2 d-flex align-items-center">
                              <input
                                className="form-check-input"
                                type="radio"
                                id="desktop"
                                name="desktop"
                                defaultChecked
                              />
                              <label className="form-check-label ms-2" htmlFor="desktop">
                                Show Desktop Notifications
                              </label>
                            </div>
                          </div>

                          <div className="privacy-box">
                            <div className="form-check custom-form-check custom-form-check-2 d-flex align-items-center">
                              <input className="form-check-input" type="radio" id="enable" name="desktop" />
                              <label className="form-check-label ms-2" htmlFor="enable">
                                Enable Notifications
                              </label>
                            </div>
                          </div>

                          <div className="privacy-box">
                            <div className="form-check custom-form-check custom-form-check-2 d-flex align-items-center">
                              <input className="form-check-input" type="radio" id="activity" name="desktop" />
                              <label className="form-check-label ms-2" htmlFor="activity">
                                Get notification for my own activity
                              </label>
                            </div>
                          </div>

                          <div className="privacy-box">
                            <div className="form-check custom-form-check custom-form-check-2 d-flex align-items-center">
                              <input className="form-check-input" type="radio" id="dnd" name="desktop" />
                              <label className="form-check-label ms-2" htmlFor="dnd">
                                DND
                              </label>
                            </div>
                          </div>

                          <button className="btn theme-bg-color btn-md fw-bold mt-4 text-white">Save Changes</button>
                        </div>

                        <div className="dashboard-bg-box">
                          <div className="dashboard-title mb-4">
                            <h3>Deactivate Account</h3>
                          </div>
                          <div className="privacy-box">
                            <div className="form-check custom-form-check custom-form-check-2 d-flex align-items-center">
                              <input className="form-check-input" type="radio" id="concern" name="concern" />
                              <label className="form-check-label ms-2" htmlFor="concern">
                                I have a privacy concern
                              </label>
                            </div>
                          </div>
                          <div className="privacy-box">
                            <div className="form-check custom-form-check custom-form-check-2 d-flex align-items-center">
                              <input className="form-check-input" type="radio" id="temporary" name="concern" />
                              <label className="form-check-label ms-2" htmlFor="temporary">
                                This is temporary
                              </label>
                            </div>
                          </div>
                          <div className="privacy-box">
                            <div className="form-check custom-form-check custom-form-check-2 d-flex align-items-center">
                              <input className="form-check-input" type="radio" id="other" name="concern" />
                              <label className="form-check-label ms-2" htmlFor="other">
                                other
                              </label>
                            </div>
                          </div>

                          <button className="btn theme-bg-color btn-md fw-bold mt-4 text-white">
                            Deactivate Account
                          </button>
                        </div>

                        <div className="dashboard-bg-box">
                          <div className="dashboard-title mb-4">
                            <h3>Delete Account</h3>
                          </div>
                          <div className="privacy-box">
                            <div className="form-check custom-form-check custom-form-check-2 d-flex align-items-center">
                              <input className="form-check-input" type="radio" id="usable" name="usable" />
                              <label className="form-check-label ms-2" htmlFor="usable">
                                No longer usable
                              </label>
                            </div>
                          </div>
                          <div className="privacy-box">
                            <div className="form-check custom-form-check custom-form-check-2 d-flex align-items-center">
                              <input className="form-check-input" type="radio" id="account" name="usable" />
                              <label className="form-check-label ms-2" htmlFor="account">
                                Want to switch on other account
                              </label>
                            </div>
                          </div>
                          <div className="privacy-box">
                            <div className="form-check custom-form-check custom-form-check-2 d-flex align-items-center">
                              <input className="form-check-input" type="radio" id="other-2" name="usable" />
                              <label className="form-check-label ms-2" htmlFor="other-2">
                                Other
                              </label>
                            </div>
                          </div>

                          <button className="btn theme-bg-color btn-md fw-bold mt-4 text-white">
                            Delete My Account
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* <!-- User Dashboard Section End -->

    <!-- Footer Section Start --> */}
        <footer className="section-t-space">
          <div className="container-fluid-lg">
            <div className="service-section">
              <div className="row g-3">
                <div className="col-12">
                  <div className="service-contain">
                    <div className="service-box">
                      <div className="service-image">
                        <img src="../assets/svg/product.svg" className="blur-up lazyload" alt="" />
                      </div>

                      <div className="service-detail">
                        <h5>Every Fresh Products</h5>
                      </div>
                    </div>

                    <div className="service-box">
                      <div className="service-image">
                        <img src="../assets/svg/delivery.svg" className="blur-up lazyload" alt="" />
                      </div>

                      <div className="service-detail">
                        <h5>Free Delivery For Order Over $50</h5>
                      </div>
                    </div>

                    <div className="service-box">
                      <div className="service-image">
                        <img src="../assets/svg/discount.svg" className="blur-up lazyload" alt="" />
                      </div>

                      <div className="service-detail">
                        <h5>Daily Mega Discounts</h5>
                      </div>
                    </div>

                    <div className="service-box">
                      <div className="service-image">
                        <img src="../assets/svg/market.svg" className="blur-up lazyload" alt="" />
                      </div>

                      <div className="service-detail">
                        <h5>Best Price On The Market</h5>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="main-footer section-b-space section-t-space">
              <div className="row g-md-4 g-3">
                <div className="col-xl-3 col-lg-4 col-sm-6">
                  <div className="footer-logo">
                    <div className="theme-logo">
                      <a href="index.html">
                        <img src="../assets/images/logo/1.png" className="blur-up lazyload" alt="" />
                      </a>
                    </div>

                    <div className="footer-logo-contain">
                      <p>
                        We are a friendly bar serving a variety of cocktails, wines and beers. Our bar is a perfect
                        place for a couple.
                      </p>

                      <ul className="address">
                        <li>
                          <i data-feather="home"></i>
                          <a href="javascript:void(0)">1418 Riverwood Drive, CA 96052, US</a>
                        </li>
                        <li>
                          <i data-feather="mail"></i>
                          <a href="javascript:void(0)">support@fastkart.com</a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="col-xl-2 col-lg-3 col-md-4 col-sm-6">
                  <div className="footer-title">
                    <h4>Categories</h4>
                  </div>

                  <div className="footer-contain">
                    <ul>
                      <li>
                        <a href="shop-left-sidebar.html" className="text-content">
                          Vegetables & Fruit
                        </a>
                      </li>
                      <li>
                        <a href="shop-left-sidebar.html" className="text-content">
                          Beverages
                        </a>
                      </li>
                      <li>
                        <a href="shop-left-sidebar.html" className="text-content">
                          Meats & Seafood
                        </a>
                      </li>
                      <li>
                        <a href="shop-left-sidebar.html" className="text-content">
                          Frozen Foods
                        </a>
                      </li>
                      <li>
                        <a href="shop-left-sidebar.html" className="text-content">
                          Biscuits & Snacks
                        </a>
                      </li>
                      <li>
                        <a href="shop-left-sidebar.html" className="text-content">
                          Grocery & Staples
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="col-xl col-lg-2 col-sm-3">
                  <div className="footer-title">
                    <h4>Useful Links</h4>
                  </div>

                  <div className="footer-contain">
                    <ul>
                      <li>
                        <a href="index.html" className="text-content">
                          Home
                        </a>
                      </li>
                      <li>
                        <a href="shop-left-sidebar.html" className="text-content">
                          Shop
                        </a>
                      </li>
                      <li>
                        <a href="about-us.html" className="text-content">
                          About Us
                        </a>
                      </li>
                      <li>
                        <a href="blog-list.html" className="text-content">
                          Blog
                        </a>
                      </li>
                      <li>
                        <a href="contact-us.html" className="text-content">
                          Contact Us
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="col-xl-2 col-sm-3">
                  <div className="footer-title">
                    <h4>Help Center</h4>
                  </div>

                  <div className="footer-contain">
                    <ul>
                      <li>
                        <a href="order-success.html" className="text-content">
                          Your Order
                        </a>
                      </li>
                      <li>
                        <a href="user-dashboard.html" className="text-content">
                          Your Account
                        </a>
                      </li>
                      <li>
                        <a href="order-tracking.html" className="text-content">
                          Track Order
                        </a>
                      </li>
                      <li>
                        <a href="wishlist.html" className="text-content">
                          Your Wishlist
                        </a>
                      </li>
                      <li>
                        <a href="search.html" className="text-content">
                          Search
                        </a>
                      </li>
                      <li>
                        <a href="faq.html" className="text-content">
                          FAQ
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="col-xl-3 col-lg-4 col-sm-6">
                  <div className="footer-title">
                    <h4>Contact Us</h4>
                  </div>

                  <div className="footer-contact">
                    <ul>
                      <li>
                        <div className="footer-number">
                          <i data-feather="phone"></i>
                          <div className="contact-number">
                            <h6 className="text-content">Hotline 24/7 :</h6>
                            <h5>+91 888 104 2340</h5>
                          </div>
                        </div>
                      </li>

                      <li>
                        <div className="footer-number">
                          <i data-feather="mail"></i>
                          <div className="contact-number">
                            <h6 className="text-content">Email Address :</h6>
                            <h5>fastkart@hotmail.com</h5>
                          </div>
                        </div>
                      </li>

                      <li className="social-app">
                        <h5 className="mb-2 text-content">Download App :</h5>
                        <ul>
                          <li className="mb-0">
                            <a href="https://play.google.com/store/apps" target="_blank">
                              <img src="../assets/images/playstore.svg" className="blur-up lazyload" alt="" />
                            </a>
                          </li>
                          <li className="mb-0">
                            <a href="https://www.apple.com/in/app-store/" target="_blank">
                              <img src="../assets/images/appstore.svg" className="blur-up lazyload" alt="" />
                            </a>
                          </li>
                        </ul>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="sub-footer section-small-space">
              <div className="reserve">
                <h6 className="text-content">©2022 Fastkart All rights reserved</h6>
              </div>

              <div className="payment">
                <img src="../assets/images/payment/1.png" className="blur-up lazyload" alt="" />
              </div>

              <div className="social-link">
                <h6 className="text-content">Stay connected :</h6>
                <ul>
                  <li>
                    <a href="https://www.facebook.com/" target="_blank">
                      <i className="fa-brands fa-facebook-f"></i>
                    </a>
                  </li>
                  <li>
                    <a href="https://twitter.com/" target="_blank">
                      <i className="fa-brands fa-twitter"></i>
                    </a>
                  </li>
                  <li>
                    <a href="https://www.instagram.com/" target="_blank">
                      <i className="fa-brands fa-instagram"></i>
                    </a>
                  </li>
                  <li>
                    <a href="https://in.pinterest.com/" target="_blank">
                      <i className="fa-brands fa-pinterest-p"></i>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </footer>
        {/* <!-- Footer Section End -->

    <!-- Deal Box Modal Start --> */}
        <div className="modal fade theme-modal deal-modal" id="deal-box" tabIndex="-1">
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
        {/* <!-- Deal Box Modal End -->

    <!-- Tap to top and theme setting button start --> */}
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
                        <label htmlFor="colorPick" className="form-label mb-0">
                          Theme Color
                        </label>
                        <input
                          type="color"
                          className="form-control form-control-color"
                          id="colorPick"
                          defaultValue="#0da487"
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
        {/* <!-- Tap to top and theme setting button end -->

    <!-- Bg overlay Start --> */}
        <div className="bg-overlay"></div>
        {/* <!-- Bg overlay End -->

    <!-- Add address modal box start --> */}
        <div className="modal fade theme-modal" id="add-address" tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered modal-fullscreen-sm-down">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">
                  Add a new address
                </h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal">
                  <i className="fa-solid fa-xmark"></i>
                </button>
              </div>
              <div className="modal-body">
                <form>
                  <div className="form-floating mb-4 theme-form-floating">
                    <input type="text" className="form-control" id="fname" placeholder="Enter First Name" />
                    <label htmlFor="fname">First Name</label>
                  </div>
                </form>

                <form>
                  <div className="form-floating mb-4 theme-form-floating">
                    <input type="text" className="form-control" id="lname" placeholder="Enter Last Name" />
                    <label htmlFor="lname">Last Name</label>
                  </div>
                </form>

                <form>
                  <div className="form-floating mb-4 theme-form-floating">
                    <input type="email" className="form-control" id="email" placeholder="Enter Email Address" />
                    <label htmlFor="email">Email Address</label>
                  </div>
                </form>

                <form>
                  <div className="form-floating mb-4 theme-form-floating">
                    <textarea
                      className="form-control"
                      placeholder="Leave a comment here"
                      id="address"
                      style={{ height: "100px" }}
                    ></textarea>
                    <label htmlFor="address">Enter Address</label>
                  </div>
                </form>

                <form>
                  <div className="form-floating mb-4 theme-form-floating">
                    <input type="email" className="form-control" id="pin" placeholder="Enter Pin Code" />
                    <label htmlFor="pin">Pin Code</label>
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary btn-md" data-bs-dismiss="modal">
                  Close
                </button>
                <button type="button" className="btn theme-bg-color btn-md text-white" data-bs-dismiss="modal">
                  Save changes
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* <!-- Add address modal box end -->

    <!-- Location Modal Start --> */}
        <div className="modal location-modal fade theme-modal" id="locationModal" tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered modal-fullscreen-sm-down">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel1">
                  Choose your Delivery Location
                </h5>
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
        {/* <!-- Location Modal End -->

    <!-- Edit Profile Start --> */}
        <div className="modal fade theme-modal" id="editProfile" tabIndex="-1">
          <div className="modal-dialog modal-lg modal-dialog-centered modal-fullscreen-sm-down">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel2">
                  Edit Profile
                </h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal">
                  <i className="fa-solid fa-xmark"></i>
                </button>
              </div>
              <div className="modal-body">
                <div className="row g-4">
                  <div className="col-xxl-12">
                    <form>
                      <div className="form-floating theme-form-floating">
                        <input type="text" className="form-control" id="pname" defaultValue="Jack Jennas" />
                        <label htmlFor="pname">Full Name</label>
                      </div>
                    </form>
                  </div>

                  <div className="col-xxl-6">
                    <form>
                      <div className="form-floating theme-form-floating">
                        <input type="email" className="form-control" id="email1" defaultValue="vicki.pope@gmail.com" />
                        <label htmlFor="email1">Email address</label>
                      </div>
                    </form>
                  </div>

                  <div className="col-xxl-6">
                    <form>
                      <div className="form-floating theme-form-floating">
                        <input
                          className="form-control"
                          type="tel"
                          defaultValue="4567891234"
                          name="mobile"
                          id="mobile"
                          maxLength="10"
                          onInput={(e) => {
                            const maxLength = 10;
                            if (e.target.value.length > maxLength) {
                              e.target.value = e.target.value.slice(0, maxLength);
                            }
                          }}
                        />
                        <label htmlFor="mobile">Email address</label>
                      </div>
                    </form>
                  </div>

                  <div className="col-12">
                    <form>
                      <div className="form-floating theme-form-floating">
                        <input
                          type="text"
                          className="form-control"
                          id="address1"
                          defaultValue="8424 James Lane South San Francisco"
                        />
                        <label htmlFor="address1">Add Address</label>
                      </div>
                    </form>
                  </div>

                  <div className="col-12">
                    <form>
                      <div className="form-floating theme-form-floating">
                        <input type="text" className="form-control" id="address2" defaultValue="CA 94080" />
                        <label htmlFor="address2">Add Address 2</label>
                      </div>
                    </form>
                  </div>

                  <div className="col-xxl-4">
                    <form>
                      <div className="form-floating theme-form-floating">
                        <select className="form-select" id="floatingSelect1" defaultValue="">
                          <option value="" disabled>
                            Choose Your Country
                          </option>
                          <option value="kingdom">United Kingdom</option>
                          <option value="states">United States</option>
                          <option value="fra">France</option>
                          <option value="china">China</option>
                          <option value="spain">Spain</option>
                          <option value="italy">Italy</option>
                          <option value="turkey">Turkey</option>
                          <option value="germany">Germany</option>
                          <option value="russian">Russian Federation</option>
                          <option value="malay">Malaysia</option>
                          <option value="mexico">Mexico</option>
                          <option value="austria">Austria</option>
                          <option value="hong">Hong Kong SAR, China</option>
                          <option value="ukraine">Ukraine</option>
                          <option value="thailand">Thailand</option>
                          <option value="saudi">Saudi Arabia</option>
                          <option value="canada">Canada</option>
                          <option value="singa">Singapore</option>
                        </select>
                        <label htmlFor="floatingSelect">Country</label>
                      </div>
                    </form>
                  </div>

                  <div className="col-xxl-4">
                    <form>
                      <div className="form-floating theme-form-floating">
                        <select className="form-select" id="floatingSelect" defaultValue="">
                          <option value="">Choose Your City</option>
                          <option value="kingdom">India</option>
                          <option value="states">Canada</option>
                          <option value="fra">Dubai</option>
                          <option value="china">Los Angeles</option>
                          <option value="spain">Thailand</option>
                        </select>
                        <label htmlFor="floatingSelect">City</label>
                      </div>
                    </form>
                  </div>

                  <div className="col-xxl-4">
                    <form>
                      <div className="form-floating theme-form-floating">
                        <input type="text" className="form-control" id="address3" defaultValue="94080" />
                        <label htmlFor="address3">Pin Code</label>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-animation btn-md fw-bold" data-bs-dismiss="modal">
                  Close
                </button>
                <button type="button" data-bs-dismiss="modal" className="btn theme-bg-color btn-md fw-bold text-light">
                  Save changes
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* <!-- Edit Profile End -->

    <!-- Edit Card Start --> */}
        <div className="modal fade theme-modal" id="editCard" tabIndex="-1">
          <div className="modal-dialog modal-lg modal-dialog-centered modal-fullscreen-sm-down">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel8">
                  Edit Card
                </h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal">
                  <i className="fa-solid fa-xmark"></i>
                </button>
              </div>
              <div className="modal-body">
                <div className="row g-4">
                  <div className="col-xxl-6">
                    <form>
                      <div className="form-floating theme-form-floating">
                        <input type="text" className="form-control" id="finame" defaultValue="Mark" />
                        <label htmlFor="finame">First Name</label>
                      </div>
                    </form>
                  </div>

                  <div className="col-xxl-6">
                    <form>
                      <div className="form-floating theme-form-floating">
                        <input type="text" className="form-control" id="laname" defaultValue="Jecno" />
                        <label htmlFor="laname">Last Name</label>
                      </div>
                    </form>
                  </div>

                  <div className="col-xxl-4">
                    <form>
                      <div className="form-floating theme-form-floating">
                        <select className="form-select" id="floatingSelect12" defaultValue="">
                          <option value="">Card Type</option>
                          <option value="kingdom">Visa Card</option>
                          <option value="states">MasterCard Card</option>
                          <option value="fra">RuPay Card</option>
                          <option value="china">Contactless Card</option>
                          <option value="spain">Maestro Card</option>
                        </select>
                        <label htmlFor="floatingSelect12">Card Type</label>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-animation btn-md fw-bold" data-bs-dismiss="modal">
                  Cancel
                </button>
                <button type="button" className="btn theme-bg-color btn-md fw-bold text-light">
                  Update Card
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* <!-- Edit Card End --> */}

        {/* <!-- Remove Profile Modal Start --> */}
        <div className="modal fade theme-modal remove-profile" id="removeProfile" tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered modal-fullscreen-sm-down">
            <div className="modal-content">
              <div className="modal-header d-block text-center">
                <h5 className="modal-title w-100" id="exampleModalLabel22">
                  Are You Sure ?
                </h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal">
                  <i className="fa-solid fa-xmark"></i>
                </button>
              </div>
              <div className="modal-body">
                <div className="remove-box">
                  <p>
                    The permission for the use/group, preview is inherited from the object, object will create a new
                    permission for this object
                  </p>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-animation btn-md fw-bold" data-bs-dismiss="modal">
                  No
                </button>
                <button
                  type="button"
                  className="btn theme-bg-color btn-md fw-bold text-light"
                  data-bs-target="#removeAddress"
                  data-bs-toggle="modal"
                >
                  Yes
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="modal fade theme-modal remove-profile" id="removeAddress" tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered modal-fullscreen-sm-down">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title text-center" id="exampleModalLabel12">
                  Done!
                </h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal">
                  <i className="fa-solid fa-xmark"></i>
                </button>
              </div>
              <div className="modal-body">
                <div className="remove-box text-center">
                  <h4 className="text-content">It's Removed.</h4>
                </div>
              </div>
              <div className="modal-footer pt-0">
                <button type="button" className="btn theme-bg-color btn-md fw-bold text-light" data-bs-dismiss="modal">
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* <!-- Remove Profile Modal End --> */}

        {/* <!-- Edit Profile Modal Start --> */}
        <div className="modal fade theme-modal" id="edit-profile" tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered modal-fullscreen-sm-down">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel3">
                  Edit Your Profile
                </h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal">
                  <i className="fa-solid fa-xmark"></i>
                </button>
              </div>
              <div className="modal-body">
                <form>
                  <div className="mb-3">
                    <label htmlFor="companyName" className="form-label">
                      Company Name
                    </label>
                    <input type="text" className="form-control" id="companyName" defaultValue="Grocery Store" />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="emailAddress" className="form-label">
                      Email Address
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      id="emailAddress"
                      defaultValue="joshuadbass@rhyta.com"
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="country" className="form-label">
                      Country / Region
                    </label>
                    <input type="text" className="form-control" id="country" defaultValue="107 Veltri Drive" />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="established" className="form-label">
                      Year Established
                    </label>
                    <input type="email" className="form-control" id="established" defaultValue="2022" />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="employees" className="form-label">
                      Total Employees
                    </label>
                    <input type="text" className="form-control" id="employees" defaultValue="154 - 360 People" />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="category" className="form-label">
                      Category
                    </label>
                    <input type="email" className="form-control" id="category" defaultValue="Grocery" />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="street" className="form-label">
                      Street Address
                    </label>
                    <input type="text" className="form-control" id="street" defaultValue="234 High St" />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="city" className="form-label">
                      City / State
                    </label>
                    <input type="email" className="form-control" id="city" defaultValue="107 Veltri Drive" />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="zip" className="form-label">
                      Zip
                    </label>
                    <input type="text" className="form-control" id="zip" defaultValue="B23 6SN" />
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-animation btn-md fw-bold" data-bs-dismiss="modal">
                  Cancel
                </button>
                <button type="button" className="btn theme-bg-color btn-md fw-bold text-light" data-bs-dismiss="modal">
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* end */}
      </div>
    </ImporterLayout>
  );
};

export default ImporterDashboard;

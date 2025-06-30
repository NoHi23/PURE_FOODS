import React, { useEffect, useState } from "react";
import HomepageLayout from "../../layouts/HomepageLayout";
import axios from "axios";
import * as bootstrap from 'bootstrap';

const getOrUpdateExpiryTime = () => {
  let expiry = localStorage.getItem('countdownExpiry');
  const now = new Date().getTime();

  if (!expiry || now >= Number(expiry)) {
    const newExpiry = now + 15 * 24 * 60 * 60 * 1000; // 15 ngày
    localStorage.setItem('countdownExpiry', newExpiry);
    expiry = newExpiry;
  }

  const remaining = Math.floor((Number(expiry) - now) / 1000); // giây
  return remaining > 0 ? remaining : 0;
};
const HomePage = () => {
  const [dealProduct, setDealProduct] = useState([]);
  const [saveProduct, setSaveProduct] = useState([]);

  const [timeLeft, setTimeLeft] = useState(getOrUpdateExpiryTime());
  const [timeObj, setTimeObj] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        let newTime = prev - 1;
        if (newTime <= 0) {
          newTime = getOrUpdateExpiryTime(); // Reset lại 15 ngày nếu hết giờ
        }

        const d = Math.floor(newTime / (3600 * 24));
        const h = Math.floor((newTime % (3600 * 24)) / 3600);
        const m = Math.floor((newTime % 3600) / 60);
        const s = newTime % 60;

        setTimeObj({ days: d, hours: h, minutes: m, seconds: s });
        return newTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);
  useEffect(() => {
    axios.get('http://localhost:8082/PureFoods/api/product/top-discount')
      .then((res) => setDealProduct(res.data))

    axios.get('http://localhost:8082/PureFoods/api/product/top-save')
      .then((res) => setSaveProduct(res.data))
  }, [])
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleViewProduct = (product) => {
    setSelectedProduct(product);
    const modal = new bootstrap.Modal(document.getElementById('view'));
    modal.show();
    console.log("hi: " + product);


  };


  return (
    <HomepageLayout>
      <div>
        <div className="bg-effect">
          <header className="pb-md-4 pb-0">
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
          <section className="home-section pt-2">
            <div className="container-fluid-lg">
              <div className="row g-4">
                <div className="col-xl-8 ratio_65">
                  <div className="home-contain h-100">
                    <div className="h-100">
                      <img src="../assets/images/vegetable/banner/1.jpg" className="bg-img blur-up lazyload" alt="" />
                    </div>
                    <div className="home-detail p-center-left w-75">
                      <div>
                        <h6>
                          Exclusive offer <span>30% Off</span>
                        </h6>
                        <h1 className="text-uppercase">
                          Stay home & delivered your <span className="daily">Daily Needs</span>
                        </h1>
                        <p className="w-75 d-none d-sm-block">
                          Vegetables contain many vitamins and minerals that are good for your health.
                        </p>
                        <button
                          onClick={() => {
                            window.location.href = "shop-left-sidebar.html";
                          }}
                          className="btn btn-animation mt-xxl-4 mt-2 home-button mend-auto"
                        >
                          Shop Now <i className="fa-solid fa-right-long icon"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-xl-4 ratio_65">
                  <div className="row g-4">
                    <div className="col-xl-12 col-md-6">
                      <div className="home-contain">
                        <img src="../assets/images/vegetable/banner/2.jpg" className="bg-img blur-up lazyload" alt="" />
                        <div className="home-detail p-center-left home-p-sm w-75">
                          <div>
                            <h2 className="mt-0 text-danger">
                              45% <span className="discount text-title">OFF</span>
                            </h2>
                            <h3 className="theme-color">Nut Collection</h3>
                            <p className="w-75">We deliver organic vegetables & fruits</p>
                            <a href="shop-left-sidebar.html" className="shop-button">
                              Shop Now <i className="fa-solid fa-right-long"></i>
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="col-xl-12 col-md-6">
                      <div className="home-contain">
                        <img src="../assets/images/vegetable/banner/3.jpg" className="bg-img blur-up lazyload" alt="" />
                        <div className="home-detail p-center-left home-p-sm w-75">
                          <div>
                            <h3 className="mt-0 theme-color fw-bold">Healthy Food</h3>
                            <h4 className="text-danger">Organic Market</h4>
                            <p className="organic">Start your daily shopping with some Organic food</p>
                            <a href="shop-left-sidebar.html" className="shop-button">
                              Shop Now <i className="fa-solid fa-right-long"></i>
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          <section className="banner-section ratio_60 wow fadeInUp">
            <div className="container-fluid-lg">
              <div className="banner-slider">
                <div>
                  <div className="banner-contain hover-effect">
                    <img src="../assets/images/vegetable/banner/4.jpg" className="bg-img blur-up lazyload" alt="" />
                    <div className="banner-details">
                      <div className="banner-box">
                        <h6 className="text-danger">5% OFF</h6>
                        <h5>Hot Deals on New Items</h5>
                        <h6 className="text-content">Daily Essentials Eggs & Dairy</h6>
                      </div>
                      <a href="shop-left-sidebar.html" className="banner-button text-white">
                        Shop Now <i className="fa-solid fa-right-long ms-2"></i>
                      </a>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="banner-contain hover-effect">
                    <img src="../assets/images/vegetable/banner/5.jpg" className="bg-img blur-up lazyload" alt="" />
                    <div className="banner-details">
                      <div className="banner-box">
                        <h6 className="text-danger">5% OFF</h6>
                        <h5>Buy More & Save More</h5>
                        <h6 className="text-content">Fresh Vegetables</h6>
                      </div>
                      <a href="shop-left-sidebar.html" className="banner-button text-white">
                        Shop Now <i className="fa-solid fa-right-long ms-2"></i>
                      </a>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="banner-contain hover-effect">
                    <img src="../assets/images/vegetable/banner/6.jpg" className="bg-img blur-up lazyload" alt="" />
                    <div className="banner-details">
                      <div className="banner-box">
                        <h6 className="text-danger">5% OFF</h6>
                        <h5>Organic Meat Prepared</h5>
                        <h6 className="text-content">Delivered to Your Home</h6>
                      </div>
                      <a href="shop-left-sidebar.html" className="banner-button text-white">
                        Shop Now <i className="fa-solid fa-right-long ms-2"></i>
                      </a>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="banner-contain hover-effect">
                    <img src="../assets/images/vegetable/banner/7.jpg" className="bg-img blur-up lazyload" alt="" />
                    <div className="banner-details">
                      <div className="banner-box">
                        <h6 className="text-danger">5% OFF</h6>
                        <h5>Buy More & Save More</h5>
                        <h6 className="text-content">Nuts & Snacks</h6>
                      </div>
                      <a href="shop-left-sidebar.html" className="banner-button text-white">
                        Shop Now <i className="fa-solid fa-right-long ms-2"></i>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          <section className="product-section">
            <div className="container-fluid-lg">
              <div className="row g-sm-4 g-3">
                <div className="col-xxl-3 col-xl-4 d-none d-xl-block">
                  <div className="p-sticky">
                    <div className="category-menu">
                      <h3>Category</h3>
                      <ul>
                        <li>
                          <div className="category-list">
                            <img src="../assets/svg/1/vegetable.svg" className="blur-up lazyload" alt="" />
                            <h5>
                              <a href="shop-left-sidebar.html">Vegetables & Fruit</a>
                            </h5>
                          </div>
                        </li>
                        <li>
                          <div className="category-list">
                            <img src="../assets/svg/1/cup.svg" className="blur-up lazyload" alt="" />
                            <h5>
                              <a href="shop-left-sidebar.html">Beverages</a>
                            </h5>
                          </div>
                        </li>
                        <li>
                          <div className="category-list">
                            <img src="../assets/svg/1/meats.svg" className="blur-up lazyload" alt="" />
                            <h5>
                              <a href="shop-left-sidebar.html">Meats & Seafood</a>
                            </h5>
                          </div>
                        </li>
                        <li>
                          <div className="category-list">
                            <img src="../assets/svg/1/breakfast.svg" className="blur-up lazyload" alt="" />
                            <h5>
                              <a href="shop-left-sidebar.html">Breakfast & Dairy</a>
                            </h5>
                          </div>
                        </li>
                        <li>
                          <div className="category-list">
                            <img src="../assets/svg/1/frozen.svg" className="blur-up lazyload" alt="" />
                            <h5>
                              <a href="shop-left-sidebar.html">Frozen Foods</a>
                            </h5>
                          </div>
                        </li>
                        <li>
                          <div className="category-list">
                            <img src="../assets/svg/1/biscuit.svg" className="blur-up lazyload" alt="" />
                            <h5>
                              <a href="shop-left-sidebar.html">Biscuits & Snacks</a>
                            </h5>
                          </div>
                        </li>
                        <li>
                          <div className="category-list">
                            <img src="../assets/svg/1/grocery.svg" className="blur-up lazyload" alt="" />
                            <h5>
                              <a href="shop-left-sidebar.html">Grocery & Staples</a>
                            </h5>
                          </div>
                        </li>
                        <li>
                          <div className="category-list">
                            <img src="../assets/svg/1/drink.svg" className="blur-up lazyload" alt="" />
                            <h5>
                              <a href="shop-left-sidebar.html">Wines & Alcohol Drinks</a>
                            </h5>
                          </div>
                        </li>
                        <li>
                          <div className="category-list">
                            <img src="../assets/svg/1/milk.svg" className="blur-up lazyload" alt="" />
                            <h5>
                              <a href="shop-left-sidebar.html">Milk & Dairies</a>
                            </h5>
                          </div>
                        </li>
                        <li className="pb-30">
                          <div className="category-list">
                            <img src="../assets/svg/1/pet.svg" className="blur-up lazyload" alt="" />
                            <h5>
                              <a href="shop-left-sidebar.html">Pet Foods</a>
                            </h5>
                          </div>
                        </li>
                      </ul>

                      <ul className="value-list">
                        <li>
                          <div className="category-list">
                            <h5 className="ms-0 text-title">
                              <a href="shop-left-sidebar.html">Value of the Day</a>
                            </h5>
                          </div>
                        </li>
                        <li>
                          <div className="category-list">
                            <h5 className="ms-0 text-title">
                              <a href="shop-left-sidebar.html">Top 50 Offers</a>
                            </h5>
                          </div>
                        </li>
                        <li className="mb-0">
                          <div className="category-list">
                            <h5 className="ms-0 text-title">
                              <a href="shop-left-sidebar.html">New Arrivals</a>
                            </h5>
                          </div>
                        </li>
                      </ul>
                    </div>

                    <div className="ratio_156 section-t-space">
                      <div className="home-contain hover-effect">
                        <img src="../assets/images/vegetable/banner/8.jpg" className="bg-img blur-up lazyload" alt="" />
                        <div className="home-detail p-top-left home-p-medium">
                          <div>
                            <h6 className="text-yellow home-banner">Seafood</h6>
                            <h3 className="text-uppercase fw-normal">
                              <span className="theme-color fw-bold">Freshes</span> Products
                            </h3>
                            <h3 className="fw-light">every hour</h3>
                            <button
                              onClick={() => {
                                window.location.href = "shop-left-sidebar.html";
                              }}
                              className="btn btn-animation btn-md mend-auto"
                            >
                              Shop Now <i className="fa-solid fa-arrow-right icon"></i>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="ratio_medium section-t-space">
                      <div className="home-contain hover-effect">
                        <img
                          src="../assets/images/vegetable/banner/11.jpg"
                          className="img-fluid blur-up lazyload"
                          alt=""
                        />
                        <div className="home-detail p-top-left home-p-medium">
                          <div>
                            <h4 className="text-yellow text-exo home-banner">Organic</h4>
                            <h2 className="text-uppercase fw-normal mb-0 text-russo theme-color">fresh</h2>
                            <h2 className="text-uppercase fw-normal text-title">Vegetables</h2>
                            <p className="mb-3">Super Offer to 50% Off</p>
                            <button
                              onClick={() => {
                                window.location.href = "shop-left-sidebar.html";
                              }}
                              className="btn btn-animation btn-md mend-auto"
                            >
                              Shop Now <i className="fa-solid fa-arrow-right icon"></i>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="section-t-space">
                      <div className="category-menu">
                        <h3>Trending Products</h3>

                        <ul className="product-list border-0 p-0 d-block">
                          <li>
                            <div className="offer-product">
                              <a href="product-left-thumbnail.html" className="offer-image">
                                <img
                                  src="../assets/images/vegetable/product/23.png"
                                  className="blur-up lazyload"
                                  alt=""
                                />
                              </a>

                              <div className="offer-detail">
                                <div>
                                  <a href="product-left-thumbnail.html" className="text-title">
                                    <h6 className="name">Meatigo Premium Goat Curry</h6>
                                  </a>
                                  <span>450 G</span>
                                  <h6 className="price theme-color">$ 70.00</h6>
                                </div>
                              </div>
                            </div>
                          </li>

                          <li>
                            <div className="offer-product">
                              <a href="product-left-thumbnail.html" className="offer-image">
                                <img
                                  src="../assets/images/vegetable/product/24.png"
                                  className="blur-up lazyload"
                                  alt=""
                                />
                              </a>

                              <div className="offer-detail">
                                <div>
                                  <a href="product-left-thumbnail.html" className="text-title">
                                    <h6 className="name">Dates Medjoul Premium Imported</h6>
                                  </a>
                                  <span>450 G</span>
                                  <h6 className="price theme-color">$ 40.00</h6>
                                </div>
                              </div>
                            </div>
                          </li>

                          <li>
                            <div className="offer-product">
                              <a href="product-left-thumbnail.html" className="offer-image">
                                <img
                                  src="../assets/images/vegetable/product/25.png"
                                  className="blur-up lazyload"
                                  alt=""
                                />
                              </a>

                              <div className="offer-detail">
                                <div>
                                  <a href="product-left-thumbnail.html" className="text-title">
                                    <h6 className="name">Good Life Walnut Kernels</h6>
                                  </a>
                                  <span>200 G</span>
                                  <h6 className="price theme-color">$ 52.00</h6>
                                </div>
                              </div>
                            </div>
                          </li>

                          <li className="mb-0">
                            <div className="offer-product">
                              <a href="product-left-thumbnail.html" className="offer-image">
                                <img
                                  src="../assets/images/vegetable/product/26.png"
                                  className="blur-up lazyload"
                                  alt=""
                                />
                              </a>

                              <div className="offer-detail">
                                <div>
                                  <a href="product-left-thumbnail.html" className="text-title">
                                    <h6 className="name">Apple Red Premium Imported</h6>
                                  </a>
                                  <span>1 KG</span>
                                  <h6 className="price theme-color">$ 80.00</h6>
                                </div>
                              </div>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </div>

                    <div className="section-t-space">
                      <div className="category-menu">
                        <h3>Customer Comment</h3>

                        <div className="review-box">
                          <div className="review-contain">
                            <h5 className="w-75">We Care About Our Customer Experience</h5>
                            <p>
                              In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to
                              demonstrate the visual form of a document or a typeface without relying on meaningful
                              content.
                            </p>
                          </div>

                          <div className="review-profile">
                            <div className="review-image">
                              <img
                                src="../assets/images/vegetable/review/1.jpg"
                                className="img-fluid blur-up lazyload"
                                alt=""
                              />
                            </div>
                            <div className="review-detail">
                              <h5>Tina Mcdonnale</h5>
                              <h6>Sale Manager</h6>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-xxl-9 col-xl-8">
                  <div className="title title-flex">
                    <div>
                      <h2>Top Save Today</h2>
                      <span className="title-leaf">
                        <svg className="icon-width">
                          <use href="../assets/svg/leaf.svg#leaf" />
                        </svg>
                      </span>
                      <p>Don't miss this opportunity at a special discount just for this week.</p>
                    </div>
                    <div className="timing-box">
                      <div className="timing">
                        <i data-feather="clock"></i>
                        <h6 className="name">Expires in :</h6>
                        <div className="time" id="clockdiv-1">
                          <ul>
                            <li>
                              <div className="counter">
                                <div className="days">
                                  <h6>{timeObj.days}d</h6>
                                </div>
                              </div>
                            </li>
                            <li>
                              <div className="counter">
                                <div className="hours">
                                  <h6>{timeObj.hours.toString().padStart(2, '0')}h</h6>
                                </div>
                              </div>
                            </li>
                            <li>
                              <div className="counter">
                                <div className="minutes">
                                  <h6>{timeObj.minutes.toString().padStart(2, '0')}m</h6>
                                </div>
                              </div>
                            </li>
                            <li>
                              <div className="counter">
                                <div className="seconds">
                                  <h6>{timeObj.seconds.toString().padStart(2, '0')}s</h6>
                                </div>
                              </div>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="section-b-space">
                    <div className="product-border border-row overflow-hidden">
                      <div className="product-box-slider no-arrow">
                        <div>
                          <div className="row m-0">
                            <div className="col-12 px-0">
                              <div className="product-box">
                                <div className="product-image">
                                  <a href="product-left-thumbnail.html">
                                    <img src={saveProduct?.[0]?.imageURL}
                                      className="img-fluid blur-up lazyload" alt="" />
                                  </a>
                                  <ul className="product-option">
                                    <li data-bs-toggle="tooltip" data-bs-placement="top"
                                      title="View">
                                      <a href="#" onClick={(e) => {
                                        e.preventDefault();
                                        handleViewProduct(saveProduct?.[0]);
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
                                      <a href="wishlist.html" className="notifi-wishlist">
                                        <i data-feather="heart"></i>
                                      </a>
                                    </li>
                                  </ul>
                                </div>
                                <div className="product-detail">
                                  <a href="product-left-thumbnail.html">
                                    <h6 className="name">{saveProduct?.[0]?.productName}</h6>
                                  </a>

                                  <h5 className="sold text-content">
                                    <span className="theme-color price">${saveProduct?.[0]?.salePrice != null ? saveProduct?.[0]?.salePrice.toFixed(2) : '0.00'}</span>
                                    <del>${saveProduct?.[0]?.price}</del>
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
                                    <button className="btn btn-add-cart addcart-button">Add
                                      <span className="add-icon">
                                        <i className="fa-solid fa-plus"></i>
                                      </span>
                                    </button>
                                    <div className="cart_qty qty-box">
                                      <div className="input-group">
                                        <button type="button" className="qty-left-minus"
                                          data-type="minus" data-field="">
                                          <i className="fa fa-minus"></i>
                                        </button>
                                        <input className="form-control input-number qty-input"
                                          type="text" name="quantity" value="0" />
                                        <button type="button" className="qty-right-plus"
                                          data-type="plus" data-field="">
                                          <i className="fa fa-plus"></i>
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>


                            <div className="col-12 px-0">
                              <div className="product-box">
                                <div className="product-image">
                                  <a href="product-left-thumbnail.html">
                                    <img src={saveProduct?.[1]?.imageURL}
                                      className="img-fluid blur-up lazyload" alt="" />
                                  </a>
                                  <ul className="product-option">
                                    <li data-bs-toggle="tooltip" data-bs-placement="top"
                                      title="View">
                                      <a href="#" onClick={(e) => {
                                        e.preventDefault();
                                        handleViewProduct(saveProduct?.[1]);
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
                                      <a href="wishlist.html" className="notifi-wishlist">
                                        <i data-feather="heart"></i>
                                      </a>
                                    </li>
                                  </ul>
                                </div>
                                <div className="product-detail">
                                  <a href="product-left-thumbnail.html">
                                    <h6 className="name">{saveProduct?.[1]?.productName}</h6>
                                  </a>

                                  <h5 className="sold text-content">
                                    <span className="theme-color price">${saveProduct?.[1]?.salePrice != null ? saveProduct?.[1]?.salePrice.toFixed(2) : '0.00'}</span>
                                    <del>${saveProduct?.[1]?.price}</del>
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
                                    <button className="btn btn-add-cart addcart-button">Add
                                      <span className="add-icon">
                                        <i className="fa-solid fa-plus"></i>
                                      </span>
                                    </button>
                                    <div className="cart_qty qty-box">
                                      <div className="input-group">
                                        <button type="button" className="qty-left-minus"
                                          data-type="minus" data-field="">
                                          <i className="fa fa-minus"></i>
                                        </button>
                                        <input className="form-control input-number qty-input"
                                          type="text" name="quantity" value="0" />
                                        <button type="button" className="qty-right-plus"
                                          data-type="plus" data-field="">
                                          <i className="fa fa-plus"></i>
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div>
                          <div className="row m-0">
                            <div className="col-12 px-0">
                              <div className="product-box">
                                <div className="product-image">
                                  <a href="product-left-thumbnail.html">
                                    <img src={saveProduct?.[2]?.imageURL}
                                      className="img-fluid blur-up lazyload" alt="" />
                                  </a>
                                  <ul className="product-option">
                                    <li data-bs-toggle="tooltip" data-bs-placement="top"
                                      title="View">
                                       <a href="#" onClick={(e) => {
                                        e.preventDefault();
                                        handleViewProduct(saveProduct?.[2]);
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
                                      <a href="wishlist.html" className="notifi-wishlist">
                                        <i data-feather="heart"></i>
                                      </a>
                                    </li>
                                  </ul>
                                </div>
                                <div className="product-detail">
                                  <a href="product-left-thumbnail.html">
                                    <h6 className="name">{saveProduct?.[2]?.productName}
                                    </h6>
                                  </a>

                                  <h5 className="sold text-content">
                                    <span className="theme-color price">${saveProduct?.[2]?.salePrice != null ? saveProduct?.[2]?.salePrice.toFixed(2) : '0.00'}</span>
                                    <del>${saveProduct?.[2]?.price}</del>
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
                                    <button className="btn btn-add-cart addcart-button">Add
                                      <span className="add-icon">
                                        <i className="fa-solid fa-plus"></i>
                                      </span>
                                    </button>
                                    <div className="cart_qty qty-box">
                                      <div className="input-group">
                                        <button type="button" className="qty-left-minus"
                                          data-type="minus" data-field="">
                                          <i className="fa fa-minus"></i>
                                        </button>
                                        <input className="form-control input-number qty-input"
                                          type="text" name="quantity" value="0" />
                                        <button type="button" className="qty-right-plus"
                                          data-type="plus" data-field="">
                                          <i className="fa fa-plus"></i>
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="col-12 px-0">
                              <div className="product-box">
                                <div className="label-tag">
                                  <span>NEW</span>
                                </div>
                                <div className="product-image">
                                  <a href="product-left-thumbnail.html">
                                    <img src={saveProduct?.[3]?.imageURL}
                                      className="img-fluid blur-up lazyload" alt="" />
                                  </a>
                                  <ul className="product-option">
                                    <li data-bs-toggle="tooltip" data-bs-placement="top"
                                      title="View">
                                      <a href="#" onClick={(e) => {
                                        e.preventDefault();
                                        handleViewProduct(saveProduct?.[3]);
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
                                      <a href="wishlist.html" className="notifi-wishlist">
                                        <i data-feather="heart"></i>
                                      </a>
                                    </li>
                                  </ul>
                                </div>
                                <div className="product-detail">
                                  <a href="product-left-thumbnail.html">
                                    <h6 className="name">{saveProduct?.[3]?.productName}</h6>
                                  </a>

                                  <h5 className="sold text-content">
                                    <span className="theme-color price">${saveProduct?.[3]?.salePrice != null ? saveProduct?.[3]?.salePrice.toFixed(2) : '0.00'}</span>
                                    <del>${saveProduct?.[3]?.price}</del>
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
                                    <button className="btn btn-add-cart addcart-button">Add
                                      <span className="add-icon">
                                        <i className="fa-solid fa-plus"></i>
                                      </span>
                                    </button>
                                    <div className="cart_qty qty-box">
                                      <div className="input-group">
                                        <button type="button" className="qty-left-minus"
                                          data-type="minus" data-field="">
                                          <i className="fa fa-minus"></i>
                                        </button>
                                        <input className="form-control input-number qty-input"
                                          type="text" name="quantity" value="0" />
                                        <button type="button" className="qty-right-plus"
                                          data-type="plus" data-field="">
                                          <i className="fa fa-plus"></i>
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div>
                          <div className="row m-0">
                            <div className="col-12 px-0">
                              <div className="product-box">
                                <div className="product-image">
                                  <a href="product-left-thumbnail.html">
                                    <img src={saveProduct?.[4]?.imageURL}
                                      className="img-fluid blur-up lazyload" alt="" />
                                  </a>
                                  <ul className="product-option">
                                    <li data-bs-toggle="tooltip" data-bs-placement="top"
                                      title="View">
                                     <a href="#" onClick={(e) => {
                                        e.preventDefault();
                                        handleViewProduct(saveProduct?.[4]);
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
                                      <a href="wishlist.html" className="notifi-wishlist">
                                        <i data-feather="heart"></i>
                                      </a>
                                    </li>
                                  </ul>
                                </div>
                                <div className="product-detail">
                                  <a href="product-left-thumbnail.html">
                                    <h6 className="name">{saveProduct?.[4]?.productName}
                                    </h6>
                                  </a>

                                  <h5 className="sold text-content">
                                    <span className="theme-color price">${saveProduct?.[4]?.salePrice != null ? saveProduct?.[4]?.salePrice.toFixed(2) : '0.00'}</span>
                                    <del>${saveProduct?.[4]?.price}</del>
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
                                    <button className="btn btn-add-cart addcart-button">Add
                                      <span className="add-icon">
                                        <i className="fa-solid fa-plus"></i>
                                      </span>
                                    </button>
                                    <div className="cart_qty qty-box">
                                      <div className="input-group">
                                        <button type="button" className="qty-left-minus"
                                          data-type="minus" data-field="">
                                          <i className="fa fa-minus"></i>
                                        </button>
                                        <input className="form-control input-number qty-input"
                                          type="text" name="quantity" value="0" />
                                        <button type="button" className="qty-right-plus"
                                          data-type="plus" data-field="">
                                          <i className="fa fa-plus"></i>
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="col-12 px-0">
                              <div className="product-box">
                                <div className="product-image">
                                  <a href="product-left-thumbnail.html">
                                    <img src={saveProduct?.[5]?.imageURL}
                                      className="img-fluid blur-up lazyload" alt="" />
                                  </a>
                                  <ul className="product-option">
                                    <li data-bs-toggle="tooltip" data-bs-placement="top"
                                      title="View">
                                      <a href="#" onClick={(e) => {
                                        e.preventDefault();
                                        handleViewProduct(saveProduct?.[5]);
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
                                      <a href="wishlist.html" className="notifi-wishlist">
                                        <i data-feather="heart"></i>
                                      </a>
                                    </li>
                                  </ul>
                                </div>
                                <div className="product-detail">
                                  <a href="product-left-thumbnail.html">
                                    <h6 className="name">{saveProduct?.[5]?.productName}</h6>
                                  </a>

                                  <h5 className="sold text-content">
                                    <span className="theme-color price">${saveProduct?.[5]?.salePrice != null ? saveProduct?.[5]?.salePrice.toFixed(2) : '0.00'}</span>
                                    <del>${saveProduct?.[5]?.price}</del>
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
                                    <button className="btn btn-add-cart addcart-button">Add
                                      <span className="add-icon">
                                        <i className="fa-solid fa-plus"></i>
                                      </span>
                                    </button>
                                    <div className="cart_qty qty-box">
                                      <div className="input-group">
                                        <button type="button" className="qty-left-minus"
                                          data-type="minus" data-field="">
                                          <i className="fa fa-minus"></i>
                                        </button>
                                        <input className="form-control input-number qty-input"
                                          type="text" name="quantity" value="0" />
                                        <button type="button" className="qty-right-plus"
                                          data-type="plus" data-field="">
                                          <i className="fa fa-plus"></i>
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div>
                          <div className="row m-0">
                            <div className="col-12 px-0">
                              <div className="product-box">
                                <div className="label-tag">
                                  <span>NEW</span>
                                </div>
                                <div className="product-image">
                                  <a href="product-left-thumbnail.html">
                                    <img src={saveProduct?.[6]?.imageURL}
                                      className="img-fluid blur-up lazyload" alt="" />
                                  </a>
                                  <ul className="product-option">
                                    <li data-bs-toggle="tooltip" data-bs-placement="top"
                                      title="View">
                                      <a href="#" onClick={(e) => {
                                        e.preventDefault();
                                        handleViewProduct(saveProduct?.[6]);
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
                                      <a href="wishlist.html" className="notifi-wishlist">
                                        <i data-feather="heart"></i>
                                      </a>
                                    </li>
                                  </ul>
                                </div>
                                <div className="product-detail">
                                  <a href="product-left-thumbnail.html">
                                    <h6 className="name">{saveProduct?.[6]?.productName}</h6>
                                  </a>

                                  <h5 className="sold text-content">
                                    <span className="theme-color price">${saveProduct?.[6]?.salePrice != null ? saveProduct?.[6]?.salePrice.toFixed(2) : '0.00'}</span>
                                    <del>${saveProduct?.[6]?.price}</del>
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
                                    <button className="btn btn-add-cart addcart-button">Add
                                      <span className="add-icon">
                                        <i className="fa-solid fa-plus"></i>
                                      </span>
                                    </button>
                                    <div className="cart_qty qty-box">
                                      <div className="input-group">
                                        <button type="button" className="qty-left-minus"
                                          data-type="minus" data-field="">
                                          <i className="fa fa-minus"></i>
                                        </button>
                                        <input className="form-control input-number qty-input"
                                          type="text" name="quantity" value="0" />
                                        <button type="button" className="qty-right-plus"
                                          data-type="plus" data-field="">
                                          <i className="fa fa-plus"></i>
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="col-12 px-0">
                              <div className="product-box">
                                <div className="product-image">
                                  <a href="product-left-thumbnail.html">
                                    <img src={saveProduct?.[7]?.imageURL}
                                      className="img-fluid blur-up lazyload" alt="" />
                                  </a>
                                  <ul className="product-option">
                                    <li data-bs-toggle="tooltip" data-bs-placement="top"
                                      title="View">
                                     <a href="#" onClick={(e) => {
                                        e.preventDefault();
                                        handleViewProduct(saveProduct?.[7]);
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
                                      <a href="wishlist.html" className="notifi-wishlist">
                                        <i data-feather="heart"></i>
                                      </a>
                                    </li>
                                  </ul>
                                </div>
                                <div className="product-detail">
                                  <a href="product-left-thumbnail.html">
                                    <h6 className="name">{saveProduct?.[7]?.productName}
                                    </h6>
                                  </a>

                                  <h5 className="sold text-content">
                                    <span className="theme-color price">${saveProduct?.[7]?.salePrice != null ? saveProduct?.[7]?.salePrice.toFixed(2) : '0.00'}</span>
                                    <del>${saveProduct?.[7]?.price}</del>
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
                                    <button className="btn btn-add-cart addcart-button">Add
                                      <span className="add-icon">
                                        <i className="fa-solid fa-plus"></i>
                                      </span>
                                    </button>
                                    <div className="cart_qty qty-box">
                                      <div className="input-group">
                                        <button type="button" className="qty-left-minus"
                                          data-type="minus" data-field="">
                                          <i className="fa fa-minus"></i>
                                        </button>
                                        <input className="form-control input-number qty-input"
                                          type="text" name="quantity" value="0" />
                                        <button type="button" className="qty-right-plus"
                                          data-type="plus" data-field="">
                                          <i className="fa fa-plus"></i>
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div>
                          <div className="row m-0">
                            <div className="col-12 px-0">
                              <div className="product-box">
                                <div className="product-image">
                                  <a href="product-left-thumbnail.html">
                                    <img src={saveProduct?.[8]?.imageURL}
                                      className="img-fluid blur-up lazyload" alt="" />
                                  </a>
                                  <ul className="product-option">
                                    <li data-bs-toggle="tooltip" data-bs-placement="top"
                                      title="View">
                                      <a href="#" onClick={(e) => {
                                        e.preventDefault();
                                        handleViewProduct(saveProduct?.[8]);
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
                                      <a href="wishlist.html" className="notifi-wishlist">
                                        <i data-feather="heart"></i>
                                      </a>
                                    </li>
                                  </ul>
                                </div>
                                <div className="product-detail">
                                  <a href="product-left-thumbnail.html">
                                    <h6 className="name">{saveProduct?.[8]?.productName}</h6>
                                  </a>

                                  <h5 className="sold text-content">
                                    <span className="theme-color price">${saveProduct?.[8]?.salePrice != null ? saveProduct?.[8]?.salePrice.toFixed(2) : '0.00'}</span>
                                    <del>${saveProduct?.[8]?.price}</del>
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
                                    <button className="btn btn-add-cart addcart-button">Add
                                      <span className="add-icon">
                                        <i className="fa-solid fa-plus"></i>
                                      </span>
                                    </button>
                                    <div className="cart_qty qty-box">
                                      <div className="input-group">
                                        <button type="button" className="qty-left-minus"
                                          data-type="minus" data-field="">
                                          <i className="fa fa-minus"></i>
                                        </button>
                                        <input className="form-control input-number qty-input"
                                          type="text" name="quantity" value="0" />
                                        <button type="button" className="qty-right-plus"
                                          data-type="plus" data-field="">
                                          <i className="fa fa-plus"></i>
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="col-12 px-0">
                              <div className="product-box">
                                <div className="product-image">
                                  <a href="product-left-thumbnail.html">
                                    <img src={saveProduct?.[9]?.imageURL}
                                      className="img-fluid blur-up lazyload" alt="" />
                                  </a>
                                  <ul className="product-option">
                                    <li data-bs-toggle="tooltip" data-bs-placement="top"
                                      title="View">
                                      <a href="#" onClick={(e) => {
                                        e.preventDefault();
                                        handleViewProduct(saveProduct?.[9]);
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
                                      <a href="wishlist.html" className="notifi-wishlist">
                                        <i data-feather="heart"></i>
                                      </a>
                                    </li>
                                  </ul>
                                </div>
                                <div className="product-detail">
                                  <a href="product-left-thumbnail.html">
                                    <h6 className="name">{saveProduct?.[9]?.productName}
                                    </h6>
                                  </a>

                                  <h5 className="sold text-content">
                                    <span className="theme-color price">${saveProduct?.[9]?.salePrice != null ? saveProduct?.[9]?.salePrice.toFixed(2) : '0.00'}</span>
                                    <del>${saveProduct?.[9]?.price}</del>
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
                                    <button className="btn btn-add-cart addcart-button">Add
                                      <span className="add-icon">
                                        <i className="fa-solid fa-plus"></i>
                                      </span>
                                    </button>
                                    <div className="cart_qty qty-box">
                                      <div className="input-group">
                                        <button type="button" className="qty-left-minus"
                                          data-type="minus" data-field="">
                                          <i className="fa fa-minus"></i>
                                        </button>
                                        <input className="form-control input-number qty-input"
                                          type="text" name="quantity" value="0" />
                                        <button type="button" className="qty-right-plus"
                                          data-type="plus" data-field="">
                                          <i className="fa fa-plus"></i>
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div>
                          <div className="row m-0">
                            <div className="col-12 px-0">
                              <div className="product-box">
                                <div className="product-image">
                                  <a href="product-left-thumbnail.html">
                                    <img src={saveProduct?.[10]?.imageURL}
                                      className="img-fluid blur-up lazyload" alt="" />
                                  </a>
                                  <ul className="product-option">
                                    <li data-bs-toggle="tooltip" data-bs-placement="top"
                                      title="View">
                                      <a href="#" onClick={(e) => {
                                        e.preventDefault();
                                        handleViewProduct(saveProduct?.[10]);
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
                                      <a href="wishlist.html" className="notifi-wishlist">
                                        <i data-feather="heart"></i>
                                      </a>
                                    </li>
                                  </ul>
                                </div>
                                <div className="product-detail">
                                  <a href="product-left-thumbnail.html">
                                    <h6 className="name">{saveProduct?.[10]?.productName}
                                    </h6>
                                  </a>

                                  <h5 className="sold text-content">
                                    <span className="theme-color price">${saveProduct?.[10]?.salePrice != null ? saveProduct?.[10]?.salePrice.toFixed(2) : '0.00'}</span>
                                    <del>${saveProduct?.[10]?.price}</del>
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
                                    <button className="btn btn-add-cart addcart-button">Add
                                      <span className="add-icon">
                                        <i className="fa-solid fa-plus"></i>
                                      </span>
                                    </button>
                                    <div className="cart_qty qty-box">
                                      <div className="input-group">
                                        <button type="button" className="qty-left-minus"
                                          data-type="minus" data-field="">
                                          <i className="fa fa-minus"></i>
                                        </button>
                                        <input className="form-control input-number qty-input"
                                          type="text" name="quantity" value="0" />
                                        <button type="button" className="qty-right-plus"
                                          data-type="plus" data-field="">
                                          <i className="fa fa-plus"></i>
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="col-12 px-0">
                              <div className="product-box">
                                <div className="product-image">
                                  <a href="product-left-thumbnail.html">
                                    <img src={saveProduct?.[11]?.imageURL}
                                      className="img-fluid blur-up lazyload" alt="" />
                                  </a>
                                  <ul className="product-option">
                                    <li data-bs-toggle="tooltip" data-bs-placement="top"
                                      title="View">
                                      <a href="#" onClick={(e) => {
                                        e.preventDefault();
                                        handleViewProduct(saveProduct?.[11]);
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
                                      <a href="wishlist.html" className="notifi-wishlist">
                                        <i data-feather="heart"></i>
                                      </a>
                                    </li>
                                  </ul>
                                </div>
                                <div className="product-detail">
                                  <a href="product-left-thumbnail.html">
                                    <h6 className="name">{saveProduct?.[11]?.productName}
                                    </h6>
                                  </a>

                                  <h5 className="sold text-content">
                                    <span className="theme-color price">${saveProduct?.[11]?.salePrice != null ? saveProduct?.[11]?.salePrice.toFixed(2) : '0.00'}</span>
                                    <del>${saveProduct?.[11]?.price}</del>
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
                                    <button className="btn btn-add-cart addcart-button">Add
                                      <span className="add-icon">
                                        <i className="fa-solid fa-plus"></i>
                                      </span>
                                    </button>
                                    <div className="cart_qty qty-box">
                                      <div className="input-group">
                                        <button type="button" className="qty-left-minus"
                                          data-type="minus" data-field="">
                                          <i className="fa fa-minus"></i>
                                        </button>
                                        <input className="form-control input-number qty-input"
                                          type="text" name="quantity" value="0" />
                                        <button type="button" className="qty-right-plus"
                                          data-type="plus" data-field="">
                                          <i className="fa fa-plus"></i>
                                        </button>
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
                  </div>

                  <div className="title">
                    <h2>Bowse by Categories</h2>
                    <span className="title-leaf">
                      <svg className="icon-width">
                        <use href="../assets/svg/leaf.svg#leaf" />
                      </svg>
                    </span>
                    <p>Top Categories Of The Week</p>
                  </div>

                  <div className="category-slider-2 product-wrapper no-arrow">
                    <div>
                      <a href="shop-left-sidebar.html" className="category-box category-dark">
                        <div>
                          <img src="../assets/svg/1/vegetable.svg" className="blur-up lazyload" alt="" />
                          <h5>Vegetables & Fruit</h5>
                        </div>
                      </a>
                    </div>

                    <div>
                      <a href="shop-left-sidebar.html" className="category-box category-dark">
                        <div>
                          <img src="../assets/svg/1/cup.svg" className="blur-up lazyload" alt="" />
                          <h5>Beverages</h5>
                        </div>
                      </a>
                    </div>

                    <div>
                      <a href="shop-left-sidebar.html" className="category-box category-dark">
                        <div>
                          <img src="../assets/svg/1/meats.svg" className="blur-up lazyload" alt="" />
                          <h5>Meats & Seafood</h5>
                        </div>
                      </a>
                    </div>

                    <div>
                      <a href="shop-left-sidebar.html" className="category-box category-dark">
                        <div>
                          <img src="../assets/svg/1/breakfast.svg" className="blur-up lazyload" alt="" />
                          <h5>Breakfast</h5>
                        </div>
                      </a>
                    </div>

                    <div>
                      <a href="shop-left-sidebar.html" className="category-box category-dark">
                        <div>
                          <img src="../assets/svg/1/frozen.svg" className="blur-up lazyload" alt="" />
                          <h5>Frozen Foods</h5>
                        </div>
                      </a>
                    </div>

                    <div>
                      <a href="shop-left-sidebar.html" className="category-box category-dark">
                        <div>
                          <img src="../assets/svg/1/milk.svg" className="blur-up lazyload" alt="" />
                          <h5>Milk & Dairies</h5>
                        </div>
                      </a>
                    </div>

                    <div>
                      <a href="shop-left-sidebar.html" className="category-box category-dark">
                        <div>
                          <img src="../assets/svg/1/pet.svg" className="blur-up lazyload" alt="" />
                          <h5>Pet Food</h5>
                        </div>
                      </a>
                    </div>
                  </div>

                  <div className="section-t-space section-b-space">
                    <div className="row g-md-4 g-3">
                      <div className="col-md-6">
                        <div className="banner-contain hover-effect">
                          <img
                            src="../assets/images/vegetable/banner/9.jpg"
                            className="bg-img blur-up lazyload"
                            alt=""
                          />
                          <div className="banner-details p-center-left p-4">
                            <div>
                              <h3 className="text-exo">50% offer</h3>
                              <h4 className="text-russo fw-normal theme-color mb-2">Testy Mushrooms</h4>
                              <button
                                onClick={() => {
                                  window.location.href = "shop-left-sidebar.html";
                                }}
                                className="btn btn-animation btn-sm mend-auto"
                              >
                                Shop Now <i className="fa-solid fa-arrow-right icon"></i>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="banner-contain hover-effect">
                          <img
                            src="../assets/images/vegetable/banner/10.jpg"
                            className="bg-img blur-up lazyload"
                            alt=""
                          />
                          <div className="banner-details p-center-left p-4">
                            <div>
                              <h3 className="text-exo">50% offer</h3>
                              <h4 className="text-russo fw-normal theme-color mb-2">Fresh MEAT</h4>
                              <button
                                onClick={() => {
                                  window.location.href = "shop-left-sidebar.html";
                                }}
                                className="btn btn-animation btn-sm mend-auto"
                              >
                                Shop Now <i className="fa-solid fa-arrow-right icon"></i>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="title d-block">
                    <h2>Food Cupboard</h2>
                    <span className="title-leaf">
                      <svg className="icon-width">
                        <use href="../assets/svg/leaf.svg#leaf" />
                      </svg>
                    </span>
                    <p>A virtual assistant collects the products from your list</p>
                  </div>

                  <div className="product-border overflow-hidden wow fadeInUp">
                    <div className="product-box-slider no-arrow">
                      <div>
                        <div className="row m-0">
                          <div className="col-12 px-0">
                            <div className="product-box">
                              <div className="product-image">
                                <a href="product-left-thumbnail.html">
                                  <img
                                    src="../assets/images/vegetable/product/1.png"
                                    className="img-fluid blur-up lazyload"
                                    alt=""
                                  />
                                </a>
                                <ul className="product-option">
                                  <li data-bs-toggle="tooltip" data-bs-placement="top" title="View">
                                    <a href="#" onClick={(e) => {
                                        e.preventDefault();
                                        handleViewProduct(saveProduct?.[12]);
                                      }}>
                                        <i data-feather="eye"></i>
                                      </a>
                                  </li>

                                  <li data-bs-toggle="tooltip" data-bs-placement="top" title="Compare">
                                    <a href="compare.html">
                                      <i data-feather="refresh-cw"></i>
                                    </a>
                                  </li>

                                  <li data-bs-toggle="tooltip" data-bs-placement="top" title="Wishlist">
                                    <a href="wishlist.html" className="notifi-wishlist">
                                      <i data-feather="heart"></i>
                                    </a>
                                  </li>
                                </ul>
                              </div>
                              <div className="product-detail">
                                <a href="product-left-thumbnail.html">
                                  <h6 className="name h-100">Chocolate Powder</h6>
                                </a>

                                <h5 className="sold text-content">
                                  <span className="theme-color price">$26.69</span>
                                  <del>28.56</del>
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
                        </div>
                      </div>

                      <div>
                        <div className="row m-0">
                          <div className="col-12 px-0">
                            <div className="product-box">
                              <div className="product-image">
                                <a href="product-left-thumbnail.html">
                                  <img
                                    src="../assets/images/vegetable/product/2.png"
                                    className="img-fluid blur-up lazyload"
                                    alt=""
                                  />
                                </a>
                                <ul className="product-option">
                                  <li data-bs-toggle="tooltip" data-bs-placement="top" title="View">
                                    <a href="javascript:void(0)" data-bs-toggle="modal" data-bs-target="#view">
                                      <i data-feather="eye"></i>
                                    </a>
                                  </li>

                                  <li data-bs-toggle="tooltip" data-bs-placement="top" title="Compare">
                                    <a href="compare.html">
                                      <i data-feather="refresh-cw"></i>
                                    </a>
                                  </li>

                                  <li data-bs-toggle="tooltip" data-bs-placement="top" title="Wishlist">
                                    <a href="wishlist.html" className="notifi-wishlist">
                                      <i data-feather="heart"></i>
                                    </a>
                                  </li>
                                </ul>
                              </div>
                              <div className="product-detail">
                                <a href="product-left-thumbnail.html">
                                  <h6 className="name h-100">Sandwich Cookies</h6>
                                </a>

                                <h5 className="sold text-content">
                                  <span className="theme-color price">$26.69</span>
                                  <del>28.56</del>
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
                        </div>
                      </div>

                      <div>
                        <div className="row m-0">
                          <div className="col-12 px-0">
                            <div className="product-box">
                              <div className="product-image">
                                <a href="product-left-thumbnail.html">
                                  <img
                                    src="../assets/images/vegetable/product/3.png"
                                    className="img-fluid blur-up lazyload"
                                    alt=""
                                  />
                                </a>
                                <ul className="product-option">
                                  <li data-bs-toggle="tooltip" data-bs-placement="top" title="View">
                                    <a href="javascript:void(0)" data-bs-toggle="modal" data-bs-target="#view">
                                      <i data-feather="eye"></i>
                                    </a>
                                  </li>

                                  <li data-bs-toggle="tooltip" data-bs-placement="top" title="Compare">
                                    <a href="compare.html">
                                      <i data-feather="refresh-cw"></i>
                                    </a>
                                  </li>

                                  <li data-bs-toggle="tooltip" data-bs-placement="top" title="Wishlist">
                                    <a href="wishlist.html" className="notifi-wishlist">
                                      <i data-feather="heart"></i>
                                    </a>
                                  </li>
                                </ul>
                              </div>
                              <div className="product-detail">
                                <a href="product-left-thumbnail.html">
                                  <h6 className="name h-100">Butter Croissant</h6>
                                </a>

                                <h5 className="sold text-content">
                                  <span className="theme-color price">$26.69</span>
                                  <del>28.56</del>
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
                        </div>
                      </div>

                      <div>
                        <div className="row m-0">
                          <div className="col-12 px-0">
                            <div className="product-box">
                              <div className="product-image">
                                <a href="product-left-thumbnail.html">
                                  <img
                                    src="../assets/images/vegetable/product/4.png"
                                    className="img-fluid blur-up lazyload"
                                    alt=""
                                  />
                                </a>
                                <ul className="product-option">
                                  <li data-bs-toggle="tooltip" data-bs-placement="top" title="View">
                                    <a href="javascript:void(0)" data-bs-toggle="modal" data-bs-target="#view">
                                      <i data-feather="eye"></i>
                                    </a>
                                  </li>

                                  <li data-bs-toggle="tooltip" data-bs-placement="top" title="Compare">
                                    <a href="compare.html">
                                      <i data-feather="refresh-cw"></i>
                                    </a>
                                  </li>

                                  <li data-bs-toggle="tooltip" data-bs-placement="top" title="Wishlist">
                                    <a href="wishlist.html" className="notifi-wishlist">
                                      <i data-feather="heart"></i>
                                    </a>
                                  </li>
                                </ul>
                              </div>
                              <div className="product-detail">
                                <a href="product-left-thumbnail.html">
                                  <h6 className="name h-100">Dark Chocolate</h6>
                                </a>

                                <h5 className="sold text-content">
                                  <span className="theme-color price">$26.69</span>
                                  <del>28.56</del>
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
                        </div>
                      </div>

                      <div>
                        <div className="row m-0">
                          <div className="col-12 px-0">
                            <div className="product-box">
                              <div className="product-image">
                                <a href="product-left-thumbnail.html">
                                  <img
                                    src="../assets/images/vegetable/product/5.png"
                                    className="img-fluid blur-up lazyload"
                                    alt=""
                                  />
                                </a>
                                <ul className="product-option">
                                  <li data-bs-toggle="tooltip" data-bs-placement="top" title="View">
                                    <a href="javascript:void(0)" data-bs-toggle="modal" data-bs-target="#view">
                                      <i data-feather="eye"></i>
                                    </a>
                                  </li>

                                  <li data-bs-toggle="tooltip" data-bs-placement="top" title="Compare">
                                    <a href="compare.html">
                                      <i data-feather="refresh-cw"></i>
                                    </a>
                                  </li>

                                  <li data-bs-toggle="tooltip" data-bs-placement="top" title="Wishlist">
                                    <a href="wishlist.html" className="notifi-wishlist">
                                      <i data-feather="heart"></i>
                                    </a>
                                  </li>
                                </ul>
                              </div>
                              <div className="product-detail">
                                <a href="product-left-thumbnail.html">
                                  <h6 className="name h-100">Mix-sweet-food</h6>
                                </a>

                                <h5 className="sold text-content">
                                  <span className="theme-color price">$26.69</span>
                                  <del>28.56</del>
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
                        </div>
                      </div>

                      <div>
                        <div className="row m-0">
                          <div className="col-12 px-0">
                            <div className="product-box">
                              <div className="product-image">
                                <a href="product-left-thumbnail.html">
                                  <img
                                    src="../assets/images/vegetable/product/4.png"
                                    className="img-fluid blur-up lazyload"
                                    alt=""
                                  />
                                </a>
                                <ul className="product-option">
                                  <li data-bs-toggle="tooltip" data-bs-placement="top" title="View">
                                    <a href="javascript:void(0)" data-bs-toggle="modal" data-bs-target="#view">
                                      <i data-feather="eye"></i>
                                    </a>
                                  </li>

                                  <li data-bs-toggle="tooltip" data-bs-placement="top" title="Compare">
                                    <a href="compare.html">
                                      <i data-feather="refresh-cw"></i>
                                    </a>
                                  </li>

                                  <li data-bs-toggle="tooltip" data-bs-placement="top" title="Wishlist">
                                    <a href="wishlist.html" className="notifi-wishlist">
                                      <i data-feather="heart"></i>
                                    </a>
                                  </li>
                                </ul>
                              </div>
                              <div className="product-detail">
                                <a href="product-left-thumbnail.html">
                                  <h6 className="name h-100">Dark Chocolate</h6>
                                </a>

                                <h5 className="sold text-content">
                                  <span className="theme-color price">$26.69</span>
                                  <del>28.56</del>
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
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="section-t-space">
                    <div className="banner-contain">
                      <img src="../assets/images/vegetable/banner/15.jpg" className="bg-img blur-up lazyload" alt="" />
                      <div className="banner-details p-center p-4 text-white text-center">
                        <div>
                          <h3 className="lh-base fw-bold offer-text">Get $3 Cashback! Min Order of $30</h3>
                          <h6 className="coupon-code">Use Code : GROCERY1920</h6>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="section-t-space section-b-space">
                    <div className="row g-md-4 g-3">
                      <div className="col-xxl-8 col-xl-12 col-md-7">
                        <div className="banner-contain hover-effect">
                          <img
                            src="../assets/images/vegetable/banner/12.jpg"
                            className="bg-img blur-up lazyload"
                            alt=""
                          />
                          <div className="banner-details p-center-left p-4">
                            <div>
                              <h2 className="text-kaushan fw-normal theme-color">Get Ready To</h2>
                              <h3 className="mt-2 mb-3">TAKE ON THE DAY!</h3>
                              <p className="text-content banner-text">
                                In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to
                                demonstrate.
                              </p>
                              <button
                                onClick={() => {
                                  window.location.href = "shop-left-sidebar.html";
                                }}
                                className="btn btn-animation btn-sm mend-auto"
                              >
                                Shop Now <i className="fa-solid fa-arrow-right icon"></i>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="col-xxl-4 col-xl-12 col-md-5">
                        <a href="shop-left-sidebar.html" className="banner-contain hover-effect h-100">
                          <img
                            src="../assets/images/vegetable/banner/13.jpg"
                            className="bg-img blur-up lazyload"
                            alt=""
                          />
                          <div className="banner-details p-center-left p-4 h-100">
                            <div>
                              <h2 className="text-kaushan fw-normal text-danger">20% Off</h2>
                              <h3 className="mt-2 mb-2 theme-color">SUMMRY</h3>
                              <h3 className="fw-normal product-name text-title">Product</h3>
                            </div>
                          </div>
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="title d-block">
                    <div>
                      <h2>Our best Seller</h2>
                      <span className="title-leaf">
                        <svg className="icon-width">
                          <use href="../assets/svg/leaf.svg#leaf" />
                        </svg>
                      </span>
                      <p>A virtual assistant collects the products from your list</p>
                    </div>
                  </div>

                  <div className="best-selling-slider product-wrapper wow fadeInUp">
                    <div>
                      <ul className="product-list">
                        <li>
                          <div className="offer-product">
                            <a href="product-left-thumbnail.html" className="offer-image">
                              <img
                                src="../assets/images/vegetable/product/11.png"
                                className="blur-up lazyload"
                                alt=""
                              />
                            </a>

                            <div className="offer-detail">
                              <div>
                                <a href="product-left-thumbnail.html" className="text-title">
                                  <h6 className="name">Tuffets Whole Wheat Bread</h6>
                                </a>
                                <span>500 G</span>
                                <h6 className="price theme-color">$ 10.00</h6>
                              </div>
                            </div>
                          </div>
                        </li>

                        <li>
                          <div className="offer-product">
                            <a href="product-left-thumbnail.html" className="offer-image">
                              <img
                                src="../assets/images/vegetable/product/12.png"
                                className="blur-up lazyload"
                                alt=""
                              />
                            </a>

                            <div className="offer-detail">
                              <div>
                                <a href="product-left-thumbnail.html" className="text-title">
                                  <h6 className="name">Potato</h6>
                                </a>
                                <span>500 G</span>
                                <h6 className="price theme-color">$ 10.00</h6>
                              </div>
                            </div>
                          </div>
                        </li>

                        <li>
                          <div className="offer-product">
                            <a href="product-left-thumbnail.html" className="offer-image">
                              <img
                                src="../assets/images/vegetable/product/13.png"
                                className="blur-up lazyload"
                                alt=""
                              />
                            </a>

                            <div className="offer-detail">
                              <div>
                                <a href="product-left-thumbnail.html" className="text-title">
                                  <h6 className="name">Green Chilli</h6>
                                </a>
                                <span>200 G</span>
                                <h6 className="price theme-color">$ 10.00</h6>
                              </div>
                            </div>
                          </div>
                        </li>

                        <li>
                          <div className="offer-product">
                            <a href="product-left-thumbnail.html" className="offer-image">
                              <img
                                src="../assets/images/vegetable/product/14.png"
                                className="blur-up lazyload"
                                alt=""
                              />
                            </a>

                            <div className="offer-detail">
                              <div>
                                <a href="product-left-thumbnail.html" className="text-title">
                                  <h6 className="name">Muffets Burger Bun</h6>
                                </a>
                                <span>150 G</span>
                                <h6 className="price theme-color">$ 10.00</h6>
                              </div>
                            </div>
                          </div>
                        </li>
                      </ul>
                    </div>

                    <div>
                      <ul className="product-list">
                        <li>
                          <div className="offer-product">
                            <a href="product-left-thumbnail.html" className="offer-image">
                              <img
                                src="../assets/images/vegetable/product/15.png"
                                className="blur-up lazyload"
                                alt=""
                              />
                            </a>

                            <div className="offer-detail">
                              <div>
                                <a href="product-left-thumbnail.html" className="text-title">
                                  <h6 className="name">Tuffets Britannia Cheezza</h6>
                                </a>
                                <span>500 G</span>
                                <h6 className="price theme-color">$ 10.00</h6>
                              </div>
                            </div>
                          </div>
                        </li>

                        <li>
                          <div className="offer-product">
                            <a href="product-left-thumbnail.html" className="offer-image">
                              <img
                                src="../assets/images/vegetable/product/16.png"
                                className="blur-up lazyload"
                                alt=""
                              />
                            </a>

                            <div className="offer-detail">
                              <div>
                                <a href="product-left-thumbnail.html" className="text-title">
                                  <h6 className="name">Long Life Toned Milk</h6>
                                </a>
                                <span>1 L</span>
                                <h6 className="price theme-color">$ 10.00</h6>
                              </div>
                            </div>
                          </div>
                        </li>

                        <li>
                          <div className="offer-product">
                            <a href="product-left-thumbnail.html" className="offer-image">
                              <img
                                src="../assets/images/vegetable/product/17.png"
                                className="blur-up lazyload"
                                alt=""
                              />
                            </a>

                            <div className="offer-detail">
                              <div>
                                <a href="product-left-thumbnail.html" className="text-title">
                                  <h6 className="name">Organic Tomato</h6>
                                </a>
                                <span>1 KG</span>
                                <h6 className="price theme-color">$ 10.00</h6>
                              </div>
                            </div>
                          </div>
                        </li>

                        <li>
                          <div className="offer-product">
                            <a href="product-left-thumbnail.html" className="offer-image">
                              <img
                                src="../assets/images/vegetable/product/18.png"
                                className="blur-up lazyload"
                                alt=""
                              />
                            </a>

                            <div className="offer-detail">
                              <div>
                                <a href="product-left-thumbnail.html" className="text-title">
                                  <h6 className="name">Organic Jam</h6>
                                </a>
                                <span>150 G</span>
                                <h6 className="price theme-color">$ 10.00</h6>
                              </div>
                            </div>
                          </div>
                        </li>
                      </ul>
                    </div>

                    <div>
                      <ul className="product-list">
                        <li>
                          <div className="offer-product">
                            <a href="product-left-thumbnail.html" className="offer-image">
                              <img
                                src="../assets/images/vegetable/product/19.png"
                                className="blur-up lazyload"
                                alt=""
                              />
                            </a>

                            <div className="offer-detail">
                              <div>
                                <a href="product-left-thumbnail.html" className="text-title">
                                  <h6 className="name">Good Life Refined Sunflower Oil</h6>
                                </a>
                                <span>1 L</span>
                                <h6 className="price theme-color">$ 10.00</h6>
                              </div>
                            </div>
                          </div>
                        </li>

                        <li>
                          <div className="offer-product">
                            <a href="product-left-thumbnail.html" className="offer-image">
                              <img
                                src="../assets/images/vegetable/product/20.png"
                                className="blur-up lazyload"
                                alt=""
                              />
                            </a>

                            <div className="offer-detail">
                              <div>
                                <a href="product-left-thumbnail.html" className="text-title">
                                  <h6 className="name">Good Life Raw Peanuts</h6>
                                </a>
                                <span>500 G</span>
                                <h6 className="price theme-color">$ 10.00</h6>
                              </div>
                            </div>
                          </div>
                        </li>

                        <li>
                          <div className="offer-product">
                            <a href="product-left-thumbnail.html" className="offer-image">
                              <img
                                src="../assets/images/vegetable/product/21.png"
                                className="blur-up lazyload"
                                alt=""
                              />
                            </a>

                            <div className="offer-detail">
                              <div>
                                <a href="product-left-thumbnail.html" className="text-title">
                                  <h6 className="name">TufBest Farms Mong Dal</h6>
                                </a>
                                <span>1 KG</span>
                                <h6 className="price theme-color">$ 10.00</h6>
                              </div>
                            </div>
                          </div>
                        </li>

                        <li>
                          <div className="offer-product">
                            <a href="product-left-thumbnail.html" className="offer-image">
                              <img
                                src="../assets/images/vegetable/product/22.png"
                                className="blur-up lazyload"
                                alt=""
                              />
                            </a>

                            <div className="offer-detail">
                              <div>
                                <a href="product-left-thumbnail.html" className="text-title">
                                  <h6 className="name">Frooti Mango Drink</h6>
                                </a>
                                <span>160 ML</span>
                                <h6 className="price theme-color">$ 10.00</h6>
                              </div>
                            </div>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>

                  <div className="section-t-space">
                    <div className="banner-contain hover-effect">
                      <img src="../assets/images/vegetable/banner/14.jpg" className="bg-img blur-up lazyload" alt="" />
                      <div className="banner-details p-center banner-b-space w-100 text-center">
                        <div>
                          <h6 className="ls-expanded theme-color mb-sm-3 mb-1">SUMMER</h6>
                          <h2 className="banner-title">VEGETABLE</h2>
                          <h5 className="lh-sm mx-auto mt-1 text-content">Save up to 5% OFF</h5>
                          <button
                            onClick={() => {
                              window.location.href = "shop-left-sidebar.html";
                            }}
                            className="btn btn-animation btn-sm mx-auto mt-sm-3 mt-2"
                          >
                            Shop Now <i className="fa-solid fa-arrow-right icon"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="title section-t-space">
                    <h2>Featured Blog</h2>
                    <span className="title-leaf">
                      <svg className="icon-width">
                        <use href="../assets/svg/leaf.svg#leaf" />
                      </svg>
                    </span>
                    <p>A virtual assistant collects the products from your list</p>
                  </div>

                  <div className="slider-3-blog ratio_65 no-arrow product-wrapper">
                    <div>
                      <div className="blog-box">
                        <div className="blog-box-image">
                          <a href="blog-detail.html" className="blog-image">
                            <img
                              src="../assets/images/vegetable/blog/1.jpg"
                              className="bg-img blur-up lazyload"
                              alt=""
                            />
                          </a>
                        </div>

                        <a href="blog-detail.html" className="blog-detail">
                          <h6>20 March, 2022</h6>
                          <h5>Fresh Vegetable Online</h5>
                        </a>
                      </div>
                    </div>

                    <div>
                      <div className="blog-box">
                        <div className="blog-box-image">
                          <a href="blog-detail.html" className="blog-image">
                            <img
                              src="../assets/images/vegetable/blog/2.jpg"
                              className="bg-img blur-up lazyload"
                              alt=""
                            />
                          </a>
                        </div>

                        <a href="blog-detail.html" className="blog-detail">
                          <h6>10 April, 2022</h6>
                          <h5>Fresh Combo Fruit</h5>
                        </a>
                      </div>
                    </div>

                    <div>
                      <div className="blog-box">
                        <div className="blog-box-image">
                          <a href="blog-detail.html" className="blog-image">
                            <img
                              src="../assets/images/vegetable/blog/3.jpg"
                              className="bg-img blur-up lazyload"
                              alt=""
                            />
                          </a>
                        </div>

                        <a href="blog-detail.html" className="blog-detail">
                          <h6>10 April, 2022</h6>
                          <h5>Nuts to Eat for Better Health</h5>
                        </a>
                      </div>
                    </div>

                    <div>
                      <div className="blog-box">
                        <div className="blog-box-image">
                          <a href="blog-detail.html" className="blog-image">
                            <img
                              src="../assets/images/vegetable/blog/1.jpg"
                              className="bg-img blur-up lazyload"
                              alt=""
                            />
                          </a>
                        </div>

                        <a href="blog-detail.html" className="blog-detail">
                          <h6>20 March, 2022</h6>
                          <h5>Fresh Vegetable Online</h5>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          <section className="newsletter-section section-b-space">
            <div className="container-fluid-lg">
              <div className="newsletter-box newsletter-box-2">
                <div className="newsletter-contain py-5">
                  <div className="container-fluid">
                    <div className="row">
                      <div className="col-xxl-4 col-lg-5 col-md-7 col-sm-9 offset-xxl-2 offset-md-1">
                        <div className="newsletter-detail">
                          <h2>Join our newsletter and get...</h2>
                          <h5>$20 discount for your first order</h5>
                          <div className="input-box">
                            <input
                              type="email"
                              className="form-control"
                              id="exampleFormControlInput1"
                              placeholder="Enter Your Email"
                            />
                            <i className="fa-solid fa-envelope arrow"></i>
                            <button className="sub-btn  btn-animation">
                              <span className="d-sm-block d-none">Subscribe</span>
                              <i className="fa-solid fa-arrow-right icon"></i>
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
                        <img
                          src={selectedProduct?.imageURL}
                          className="img-fluid blur-up lazyload"
                          alt=""
                        />
                      </div>
                    </div>

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
                                  <img
                                    src={selectedProduct?.imageURL}
                                    className="img-fluid blur-up lazyload"
                                    alt=""
                                  />
                                </div>
                              </div>

                              <div className="col-lg-6">
                                <div className="right-sidebar-modal">
                                  <h4 className="title-name">{selectedProduct?.productName}</h4>
                                  <h4 className="price">
                                    ${selectedProduct?.salePrice?.toFixed(2)}{" "}
                                    <del className="text-muted">${selectedProduct?.price}</del>
                                  </h4>

                                  <div className="product-rating">
                                    <ul className="rating">
                                      <li><i data-feather="star" className="fill"></i></li>
                                      <li><i data-feather="star" className="fill"></i></li>
                                      <li><i data-feather="star" className="fill"></i></li>
                                      <li><i data-feather="star" className="fill"></i></li>
                                      <li><i data-feather="star"></i></li>
                                    </ul>
                                    <span className="ms-2">8 Reviews</span>
                                    <span className="ms-2 text-danger">6 sold in last 16 hours</span>
                                  </div>

                                  <div className="product-detail">
                                    <h4>Product Details :</h4>
                                    <p>{selectedProduct?.description || "No description available."}</p>
                                  </div>

                                  <ul className="brand-list">
                                    <li>
                                      <div className="brand-box">
                                        <h5>Brand Name:</h5>
                                        <h6>{selectedProduct?.brandName || "N/A"}</h6>
                                      </div>
                                    </li>

                                    <li>
                                      <div className="brand-box">
                                        <h5>Product Code:</h5>
                                        <h6>{selectedProduct?.productId}</h6>
                                      </div>
                                    </li>

                                    <li>
                                      <div className="brand-box">
                                        <h5>Product Type:</h5>
                                        <h6>{selectedProduct?.productType || "N/A"}</h6>
                                      </div>
                                    </li>
                                  </ul>

                                  <div className="select-size">
                                    <h4>Size :</h4>
                                    <select className="form-select select-form-size" defaultValue="">
                                      <option value="">Select Size</option>
                                      <option value="0.5">1/2 KG</option>
                                      <option value="1">1 KG</option>
                                      <option value="1.5">1.5 KG</option>
                                    </select>
                                  </div>

                                  <div className="modal-button">
                                    <button
                                      onClick={() => {
                                        window.location.href = "shop-left-sidebar.html";
                                      }}
                                      className="btn btn-md add-cart-button icon"
                                    >
                                      Add To Cart
                                    </button>
                                    <button
                                      onClick={() => {
                                        window.location.href = "shop-left-sidebar.html";
                                      }}
                                      className="btn theme-bg-color view-button icon text-white fw-bold btn-md"
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
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="modal location-modal fade theme-modal" id="locationModal" tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered modal-fullscreen-sm-down">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="exampleModalLabel">
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
          <div className="cookie-bar-box">
            <div className="cookie-box">
              <div className="cookie-image">
                <img src="../assets/images/cookie-bar.png" className="blur-up lazyload" alt="" />
                <h2>Cookies!</h2>
              </div>

              <div className="cookie-contain">
                <h5 className="text-content">We use cookies to make your experience better</h5>
              </div>
            </div>

            <div className="button-group">
              <button className="btn privacy-button">Privacy Policy</button>
              <button className="btn ok-button">OK</button>
            </div>
          </div>
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
                      {dealProduct?.map((dp, i) => (
                        <li className={`list-${(i % 3) + 1}`} key={i}>
                          <div className="deal-offer-contain">
                            <a href="/" className="deal-image">
                              <img src={dp.imageURL} className="blur-up lazyload" alt="" />
                            </a>

                            <a href="shop-left-sidebar.html" className="deal-contain">
                              <h5>{dp.productName}</h5>
                              <h6>
                                {dp.salePrice.toLocaleString("en-US", {
                                  style: "currency",
                                  currency: "USD",
                                  minimumFractionDigits: 0,
                                })} <del>${dp.price}</del> <span>-{dp.discountPercent}%</span>
                              </h6>
                            </a>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
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
          <div className="bg-overlay"></div>
        </div>
      </div >
    </HomepageLayout >
  );
};

export default HomePage;
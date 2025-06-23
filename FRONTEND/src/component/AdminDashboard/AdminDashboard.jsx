import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './AdminDashboard.css'
import axios from 'axios';
import './script.js'
import './ratio.js'
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import $ from 'jquery';
import 'slick-carousel';
import './sidebar-menu.js'
import './simplebar.js'
import { toast } from 'react-toastify';
import SideBar from './SideBar.jsx';
import TopBar from './TopBar.jsx';
const AdminDashboard = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const [totalProduct, setTotalProduct] = useState(0);
    const [totalUser, setTotalUser] = useState(0);
    const navigate = useNavigate();
    useEffect(() => {
        axios.get('http://localhost:8082/PureFoods/api/product/count')
            .then(res => { setTotalProduct(res.data.countProduct) })
    }, [])

    useEffect(() => {
        axios.get('http://localhost:8082/PureFoods/api/users/count')
            .then(res => { setTotalUser(res.data.totalUser) })
    }, [])


    useEffect(() => {
        const sidebarLinks = document.querySelectorAll('.sidebar-link');

        const handleClick = (e) => {
            const nextEl = e.currentTarget.nextElementSibling;
            if (nextEl && nextEl.classList.contains('sidebar-submenu')) {
                e.preventDefault();
                nextEl.classList.toggle('show');
            }
        };

        sidebarLinks.forEach(link => {
            link.addEventListener('click', handleClick);
        });

        return () => {
            sidebarLinks.forEach(link => {
                link.removeEventListener('click', handleClick);
            });
        };
    }, []);




    return (
        <div>
            <div className="tap-top">
                <span className="lnr lnr-chevron-up"></span>
            </div>
            <div className="page-wrapper compact-wrapper" id="pageWrapper">
                <TopBar/>

                <div className="page-body-wrapper">
                    <SideBar />
                    <div className="page-body">
                        <div className="container-fluid">
                            <div className="row">
                                <div className="col-sm-6 col-xxl-3 col-lg-6">
                                    <div className="main-tiles border-5 border-0  card-hover card o-hidden">
                                        <div className="custome-1-bg b-r-4 card-body">
                                            <div className="media align-items-center static-top-widget">
                                                <div className="media-body p-0">
                                                    <span className="m-0">Total Revenue</span>
                                                    <h4 className="mb-0 counter">$6659
                                                        <span className="badge badge-light-primary grow">
                                                            <i data-feather="trending-up" className='text-dark'></i>8.5%</span>
                                                    </h4>
                                                </div>
                                                <div className="align-self-center text-center">
                                                    <i className="ri-database-2-line"></i>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-sm-6 col-xxl-3 col-lg-6">
                                    <div className="main-tiles border-5 card-hover border-0 card o-hidden">
                                        <div className="custome-2-bg b-r-4 card-body">
                                            <div className="media static-top-widget">
                                                <div className="media-body p-0">
                                                    <span className="m-0">Total Orders</span>
                                                    <h4 className="mb-0 counter">9856
                                                        <span className="badge badge-light-danger grow">
                                                            <i data-feather="trending-down"></i>8.5%</span>
                                                    </h4>
                                                </div>
                                                <div className="align-self-center text-center">
                                                    <i className="ri-shopping-bag-3-line"></i>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-sm-6 col-xxl-3 col-lg-6">
                                    <div className="main-tiles border-5 card-hover border-0  card o-hidden">
                                        <div className="custome-3-bg b-r-4 card-body">
                                            <div className="media static-top-widget">
                                                <div className="media-body p-0">
                                                    <span className="m-0">Total Products</span>
                                                    <h4 className="mb-0 counter">{totalProduct}
                                                        <a href="add-new-product.html" className="badge badge-light-secondary grow">
                                                            ADD NEW</a>
                                                    </h4>
                                                </div>

                                                <div className="align-self-center text-center">
                                                    <i className="ri-chat-3-line"></i>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-sm-6 col-xxl-3 col-lg-6">
                                    <div className="main-tiles border-5 card-hover border-0 card o-hidden">
                                        <div className="custome-4-bg b-r-4 card-body">
                                            <div className="media static-top-widget">
                                                <div className="media-body p-0">
                                                    <span className="m-0">Total Customers</span>
                                                    <h4 className="mb-0 counter">{totalUser}
                                                        <span className="badge badge-light-success grow">
                                                            <i data-feather="trending-down"></i>8.5%</span>
                                                    </h4>
                                                </div>

                                                <div className="align-self-center text-center">
                                                    <i className="ri-user-add-line"></i>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-12">
                                    <div className="card o-hidden card-hover">
                                        <div className="card-header border-0 pb-1">
                                            <div className="card-header-title p-0">
                                                <h4>Category</h4>
                                            </div>
                                        </div>
                                        <div className="card-body p-0">
                                            <div className="category-slider-scroll">
                                                {[
                                                    { src: "vegetable.svg", name: "Vegetables & Fruit" },
                                                    { src: "cup.svg", name: "Beverages" },
                                                    { src: "meats.svg", name: "Meats & Seafood" },
                                                    { src: "breakfast.svg", name: "Breakfast" },
                                                    { src: "frozen.svg", name: "Frozen Foods" },
                                                    { src: "milk.svg", name: "Milk & Dairies" },
                                                    { src: "pet.svg", name: "Pet Food" },
                                                    { src: "vegetable.svg", name: "Vegetables & Fruit" },
                                                    { src: "cup.svg", name: "Beverages" },
                                                    { src: "meats.svg", name: "Meats & Seafood" },
                                                    { src: "breakfast.svg", name: "Breakfast" },
                                                    { src: "frozen.svg", name: "Frozen Foods" },
                                                    { src: "milk.svg", name: "Milk & Dairies" },
                                                    { src: "pet.svg", name: "Pet Food" },
                                                ].map((item, index) => (
                                                    <div className="dashboard-category-wrapper" key={index}>
                                                        <div className="dashboard-category">
                                                            <a href="javascript:void(0)" className="category-image">
                                                                <img
                                                                    src={`../back-end/assets/svg/${item.src}`}
                                                                    className="img-fluid"
                                                                    alt=""
                                                                />
                                                            </a>
                                                            <a href="javascript:void(0)" className="category-name">
                                                                <h6>{item.name}</h6>
                                                            </a>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-xl-6">
                                    <div className="card o-hidden card-hover">
                                        <div className="card-header border-0 pb-1">
                                            <div className="card-header-title">
                                                <h4>Revenue Report</h4>
                                            </div>
                                        </div>
                                        <div className="card-body p-0">
                                            <div id="report-chart"></div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-xl-6 col-md-12">
                                    <div className="card o-hidden card-hover">
                                        <div className="card-header card-header-top card-header--2 px-0 pt-0">
                                            <div className="card-header-title">
                                                <h4>Best Selling Product</h4>
                                            </div>

                                            <div className="best-selling-box d-sm-flex d-none">
                                                <span>Short By:</span>
                                                <div className="dropdown">
                                                    <button className="btn p-0 dropdown-toggle" type="button"
                                                        id="dropdownMenuButton1" data-bs-toggle="dropdown"
                                                        data-bs-auto-close="true">Today</button>
                                                    <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                                                        <li><a className="dropdown-item" href="#">Action</a></li>
                                                        <li><a className="dropdown-item" href="#">Another action</a></li>
                                                        <li><a className="dropdown-item" href="#">Something else here</a></li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="card-body p-0">
                                            <div>
                                                <div className="table-responsive">
                                                    <table className="best-selling-table w-image
                                            w-image
                                            w-image table border-0">
                                                        <tbody>
                                                            <tr>
                                                                <td>
                                                                    <div className="best-product-box">
                                                                        <div className="product-image">
                                                                            <img src="../back-end/assets/images/product/1.png"
                                                                                className="img-fluid" alt="Product" />
                                                                        </div>
                                                                        <div className="product-name">
                                                                            <h5>Aata Buscuit</h5>
                                                                            <h6>26-08-2022</h6>
                                                                        </div>
                                                                    </div>
                                                                </td>

                                                                <td>
                                                                    <div className="product-detail-box">
                                                                        <h6>Price</h6>
                                                                        <h5>$29.00</h5>
                                                                    </div>
                                                                </td>

                                                                <td>
                                                                    <div className="product-detail-box">
                                                                        <h6>Orders</h6>
                                                                        <h5>62</h5>
                                                                    </div>
                                                                </td>

                                                                <td>
                                                                    <div className="product-detail-box">
                                                                        <h6>Stock</h6>
                                                                        <h5>510</h5>
                                                                    </div>
                                                                </td>

                                                                <td>
                                                                    <div className="product-detail-box">
                                                                        <h6>Amount</h6>
                                                                        <h5>$1,798</h5>
                                                                    </div>
                                                                </td>
                                                            </tr>

                                                            <tr>
                                                                <td>
                                                                    <div className="best-product-box">
                                                                        <div className="product-image">
                                                                            <img src="../back-end/assets/images/product/2.png"
                                                                                className="img-fluid" alt="Product" />
                                                                        </div>
                                                                        <div className="product-name">
                                                                            <h5>Aata Buscuit</h5>
                                                                            <h6>26-08-2022</h6>
                                                                        </div>
                                                                    </div>
                                                                </td>

                                                                <td>
                                                                    <div className="product-detail-box">
                                                                        <h6>Price</h6>
                                                                        <h5>$29.00</h5>
                                                                    </div>
                                                                </td>

                                                                <td>
                                                                    <div className="product-detail-box">
                                                                        <h6>Orders</h6>
                                                                        <h5>62</h5>
                                                                    </div>
                                                                </td>

                                                                <td>
                                                                    <div className="product-detail-box">
                                                                        <h6>Stock</h6>
                                                                        <h5>510</h5>
                                                                    </div>
                                                                </td>

                                                                <td>
                                                                    <div className="product-detail-box">
                                                                        <h6>Amount</h6>
                                                                        <h5>$1,798</h5>
                                                                    </div>
                                                                </td>
                                                            </tr>

                                                            <tr>
                                                                <td>
                                                                    <div className="best-product-box">
                                                                        <div className="product-image">
                                                                            <img src="../back-end/assets/images/product/3.png"
                                                                                className="img-fluid" alt="Product" />
                                                                        </div>
                                                                        <div className="product-name">
                                                                            <h5>Aata Buscuit</h5>
                                                                            <h6>26-08-2022</h6>
                                                                        </div>
                                                                    </div>
                                                                </td>

                                                                <td>
                                                                    <div className="product-detail-box">
                                                                        <h6>Price</h6>
                                                                        <h5>$29.00</h5>
                                                                    </div>
                                                                </td>

                                                                <td>
                                                                    <div className="product-detail-box">
                                                                        <h6>Orders</h6>
                                                                        <h5>62</h5>
                                                                    </div>
                                                                </td>

                                                                <td>
                                                                    <div className="product-detail-box">
                                                                        <h6>Stock</h6>
                                                                        <h5>510</h5>
                                                                    </div>
                                                                </td>

                                                                <td>
                                                                    <div className="product-detail-box">
                                                                        <h6>Amount</h6>
                                                                        <h5>$1,798</h5>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-xl-6">
                                    <div className="card o-hidden card-hover">
                                        <div className="card-header card-header-top card-header--2 px-0 pt-0">
                                            <div className="card-header-title">
                                                <h4>Recent Orders</h4>
                                            </div>

                                            <div className="best-selling-box d-sm-flex d-none">
                                                <span>Short By:</span>
                                                <div className="dropdown">
                                                    <button className="btn p-0 dropdown-toggle" type="button"
                                                        id="dropdownMenuButton2" data-bs-toggle="dropdown"
                                                        data-bs-auto-close="true">Today</button>
                                                    <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton2">
                                                        <li><a className="dropdown-item" href="#">Action</a></li>
                                                        <li><a className="dropdown-item" href="#">Another action</a></li>
                                                        <li><a className="dropdown-item" href="#">Something else here</a></li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="card-body p-0">
                                            <div>
                                                <div className="table-responsive">
                                                    <table className="best-selling-table table border-0">
                                                        <tbody>
                                                            <tr>
                                                                <td>
                                                                    <div className="best-product-box">
                                                                        <div className="product-name">
                                                                            <h5>Aata Buscuit</h5>
                                                                            <h6>#64548</h6>
                                                                        </div>
                                                                    </div>
                                                                </td>

                                                                <td>
                                                                    <div className="product-detail-box">
                                                                        <h6>Date Placed</h6>
                                                                        <h5>5/1/22</h5>
                                                                    </div>
                                                                </td>

                                                                <td>
                                                                    <div className="product-detail-box">
                                                                        <h6>Price</h6>
                                                                        <h5>$250.00</h5>
                                                                    </div>
                                                                </td>

                                                                <td>
                                                                    <div className="product-detail-box">
                                                                        <h6>Order Status</h6>
                                                                        <h5>Completed</h5>
                                                                    </div>
                                                                </td>

                                                                <td>
                                                                    <div className="product-detail-box">
                                                                        <h6>Payment</h6>
                                                                        <h5 className="text-danger">Unpaid</h5>
                                                                    </div>
                                                                </td>
                                                            </tr>

                                                            <tr>
                                                                <td>
                                                                    <div className="best-product-box">
                                                                        <div className="product-name">
                                                                            <h5>Aata Buscuit</h5>
                                                                            <h6>26-08-2022</h6>
                                                                        </div>
                                                                    </div>
                                                                </td>


                                                                <td>
                                                                    <div className="product-detail-box">
                                                                        <h6>Date Placed</h6>
                                                                        <h5>5/1/22</h5>
                                                                    </div>
                                                                </td>

                                                                <td>
                                                                    <div className="product-detail-box">
                                                                        <h6>Price</h6>
                                                                        <h5>$250.00</h5>
                                                                    </div>
                                                                </td>

                                                                <td>
                                                                    <div className="product-detail-box">
                                                                        <h6>Order Status</h6>
                                                                        <h5>Completed</h5>
                                                                    </div>
                                                                </td>

                                                                <td>
                                                                    <div className="product-detail-box">
                                                                        <h6>Payment</h6>
                                                                        <h5 className="theme-color">Paid</h5>
                                                                    </div>
                                                                </td>
                                                            </tr>

                                                            <tr>
                                                                <td>
                                                                    <div className="best-product-box">
                                                                        <div className="product-name">
                                                                            <h5>Aata Buscuit</h5>
                                                                            <h6>26-08-2022</h6>
                                                                        </div>
                                                                    </div>
                                                                </td>


                                                                <td>
                                                                    <div className="product-detail-box">
                                                                        <h6>Date Placed</h6>
                                                                        <h5>5/1/22</h5>
                                                                    </div>
                                                                </td>

                                                                <td>
                                                                    <div className="product-detail-box">
                                                                        <h6>Price</h6>
                                                                        <h5>$250.00</h5>
                                                                    </div>
                                                                </td>

                                                                <td>
                                                                    <div className="product-detail-box">
                                                                        <h6>Order Status</h6>
                                                                        <h5>Completed</h5>
                                                                    </div>
                                                                </td>

                                                                <td>
                                                                    <div className="product-detail-box">
                                                                        <h6>Payment</h6>
                                                                        <h5 className="theme-color">Paid</h5>
                                                                    </div>
                                                                </td>
                                                            </tr>

                                                            <tr>
                                                                <td>
                                                                    <div className="best-product-box">
                                                                        <div className="product-name">
                                                                            <h5>Aata Buscuit</h5>
                                                                            <h6>26-08-2022</h6>
                                                                        </div>
                                                                    </div>
                                                                </td>


                                                                <td>
                                                                    <div className="product-detail-box">
                                                                        <h6>Date Placed</h6>
                                                                        <h5>5/1/22</h5>
                                                                    </div>
                                                                </td>

                                                                <td>
                                                                    <div className="product-detail-box">
                                                                        <h6>Price</h6>
                                                                        <h5>$250.00</h5>
                                                                    </div>
                                                                </td>

                                                                <td>
                                                                    <div className="product-detail-box">
                                                                        <h6>Order Status</h6>
                                                                        <h5>Completed</h5>
                                                                    </div>
                                                                </td>

                                                                <td>
                                                                    <div className="product-detail-box">
                                                                        <h6>Payment</h6>
                                                                        <h5 className="theme-color">Paid</h5>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-xl-6">
                                    <div className="card o-hidden card-hover">
                                        <div className="card-header border-0 mb-0">
                                            <div className="card-header-title">
                                                <h4>Earning</h4>
                                            </div>
                                        </div>
                                        <div className="card-body p-0">
                                            <div id="bar-chart-earning"></div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-xxl-4 col-md-6">
                                    <div className="card o-hidden card-hover">
                                        <div className="card-header border-0">
                                            <div className="card-header-title">
                                                <h4>Transactions</h4>
                                            </div>
                                        </div>

                                        <div className="card-body pt-0">
                                            <div>
                                                <div className="table-responsive">
                                                    <table className="user-table transactions-table table border-0">
                                                        <tbody>
                                                            <tr>
                                                                <td>
                                                                    <div className="transactions-icon">
                                                                        <i className="ri-shield-line"></i>
                                                                    </div>
                                                                    <div className="transactions-name">
                                                                        <h6>Wallets</h6>
                                                                        <p>Starbucks</p>
                                                                    </div>
                                                                </td>

                                                                <td className="lost">-$74</td>
                                                            </tr>
                                                            <tr>
                                                                <td className="td-color-1">
                                                                    <div className="transactions-icon">
                                                                        <i className="ri-check-line"></i>
                                                                    </div>
                                                                    <div className="transactions-name">
                                                                        <h6>Bank Transfer</h6>
                                                                        <p>Add Money</p>
                                                                    </div>
                                                                </td>

                                                                <td className="success">+$125</td>
                                                            </tr>
                                                            <tr>
                                                                <td className="td-color-2">
                                                                    <div className="transactions-icon">
                                                                        <i className="ri-exchange-dollar-line"></i>
                                                                    </div>
                                                                    <div className="transactions-name">
                                                                        <h6>Paypal</h6>
                                                                        <p>Add Money</p>
                                                                    </div>
                                                                </td>

                                                                <td className="lost">-$50</td>
                                                            </tr>
                                                            <tr>
                                                                <td className="td-color-3">
                                                                    <div className="transactions-icon">
                                                                        <i className="ri-bank-card-line"></i>
                                                                    </div>
                                                                    <div className="transactions-name">
                                                                        <h6>Mastercard</h6>
                                                                        <p>Ordered Food</p>
                                                                    </div>
                                                                </td>

                                                                <td className="lost">-$40</td>
                                                            </tr>
                                                            <tr>
                                                                <td className="td-color-4 pb-0">
                                                                    <div className="transactions-icon">
                                                                        <i className="ri-bar-chart-grouped-line"></i>
                                                                    </div>
                                                                    <div className="transactions-name">
                                                                        <h6>Transfer</h6>
                                                                        <p>Refund</p>
                                                                    </div>
                                                                </td>

                                                                <td className="success pb-0">+$90</td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-xxl-4 col-md-6">
                                    <div className="h-100">
                                        <div className="card o-hidden card-hover">
                                            <div className="card-header border-0">
                                                <div className="d-flex align-items-center justify-content-between">
                                                    <div className="card-header-title">
                                                        <h4>Visitors</h4>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="card-body pt-0">
                                                <div className="pie-chart">
                                                    <div id="pie-chart-visitors"></div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-xxl-4 col-md-6">
                                    <div className="card o-hidden card-hover">
                                        <div className="card-header border-0">
                                            <div className="card-header-title">
                                                <h4>To Do List</h4>
                                            </div>
                                        </div>

                                        <div className="card-body pt-0">
                                            <ul className="to-do-list">
                                                <li className="to-do-item">
                                                    <div className="form-check user-checkbox">
                                                        <input className="checkbox_animated check-it" type="checkbox" value=""
                                                            id="flexCheckDefault" />
                                                    </div>
                                                    <div className="to-do-list-name">
                                                        <strong>Pick up kids from school</strong>
                                                        <p>8 Hours</p>
                                                    </div>
                                                </li>
                                                <li className="to-do-item">
                                                    <div className="form-check user-checkbox">
                                                        <input className="checkbox_animated check-it" type="checkbox" value=""
                                                            id="flexCheckDefault1" />
                                                    </div>
                                                    <div className="to-do-list-name">
                                                        <strong>Prepare or presentation.</strong>
                                                        <p>8 Hours</p>
                                                    </div>
                                                </li>
                                                <li className="to-do-item">
                                                    <div className="form-check user-checkbox">
                                                        <input className="checkbox_animated check-it" type="checkbox" value=""
                                                            id="flexCheckDefault2" />
                                                    </div>
                                                    <div className="to-do-list-name">
                                                        <strong>Create invoice</strong>
                                                        <p>8 Hours</p>
                                                    </div>
                                                </li>
                                                <li className="to-do-item">
                                                    <div className="form-check user-checkbox">
                                                        <input className="checkbox_animated check-it" type="checkbox" value=""
                                                            id="flexCheckDefault3" />
                                                    </div>
                                                    <div className="to-do-list-name">
                                                        <strong>Meeting with Alisa</strong>
                                                        <p>8 Hours</p>
                                                    </div>
                                                </li>

                                                <li className="to-do-item">
                                                    <form className="row g-2">
                                                        <div className="col-8">
                                                            <input type="text" className="form-control" id="name"
                                                                placeholder="Enter Task Name" />
                                                        </div>
                                                        <div className="col-4">
                                                            <button type="submit" className="btn btn-primary w-100 h-100">Add
                                                                task</button>
                                                        </div>
                                                    </form>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="container-fluid">
                            <footer className="footer">
                                <div className="row">
                                    <div className="col-md-12 footer-copyright text-center">
                                        <p className="mb-0">Copyright 2025 © Fastkart theme by pixelstrap</p>
                                    </div>
                                </div>
                            </footer>
                        </div>
                    </div>

                </div>
            </div>
            <div className="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1">
                <div className="modal-dialog  modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-body">
                            <h5 className="modal-title" id="staticBackdropLabel">Logging Out</h5>
                            <p>Are you sure you want to log out?</p>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            <div className="button-box">
                                <button type="button" className="btn btn--no" data-bs-dismiss="modal">No</button>
                                <Link to={'/login'} type="button"
                                    className="btn  btn--yes btn-primary">Yes</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AdminDashboard

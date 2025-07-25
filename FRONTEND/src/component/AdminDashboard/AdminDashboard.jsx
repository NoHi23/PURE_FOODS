import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './AdminDashboard.css'
import axios from 'axios';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import $ from 'jquery';
import 'slick-carousel';

import { toast } from 'react-toastify';
import SideBar from './SideBar.jsx';
import TopBar from './TopBar.jsx';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart } from 'recharts';

const AdminDashboard = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const [totalProduct, setTotalProduct] = useState(0);
    const [totalUser, setTotalUser] = useState(0);
    const [totalOrder, setTotalOrder] = useState(0);
    const [revenue, setRevenue] = useState(0);
    const navigate = useNavigate();
    const [topSellerProduct, setTopSellerProduct] = useState([]);
    const [recentOrders, setRecentOrders] = useState([]);
    const [customerNames, setCustomerNames] = useState({});

    useEffect(() => {
        Promise.all([
            import('./script.js'),
            import('./ratio.js'),
            import('./sidebar-menu.js'),
            import('./simplebar.js')
        ]).then(() => {
            console.log("All admin scripts loaded.");
        }).catch(err => {
            console.error("Failed to load admin scripts", err);
        });
    }, []);


    useEffect(() => {
        axios.get('http://localhost:8082/PureFoods/api/product/count')
            .then(res => { setTotalProduct(res.data.countProduct) })
    }, [])

    useEffect(() => {
        axios.get('http://localhost:8082/PureFoods/api/users/count')
            .then(res => { setTotalUser(res.data.totalUser) })
    }, [])

    useEffect(() => {
        axios.get('http://localhost:8082/PureFoods/api/orders/count')
            .then(res => { setTotalOrder(res.data.countOrder) })
    }, [])

    useEffect(() => {
        axios.get('http://localhost:8082/PureFoods/api/orders/revenue')
            .then(res => {
                const revenueValue = parseFloat(res.data);
                setRevenue(revenueValue);
            })
            .catch(err => {
                console.error("Lỗi khi gọi API doanh thu:", err);
            });
    }, [])


    useEffect(() => {
        axios.get('http://localhost:8082/PureFoods/api/orders/top5-best-selling')
            .then(res => { setTopSellerProduct(res.data) })
    }, [])

    useEffect(() => {
        axios.get("http://localhost:8082/PureFoods/api/orders/top5-recent-orders")
            .then(res => setRecentOrders(res.data))
            .catch(err => console.error(err));
    }, []);

    useEffect(() => {
        const fetchCustomers = async () => {
            const newCustomerNames = {};

            await Promise.all(recentOrders.map(async (order) => {
                try {
                    const res = await axios.get(`http://localhost:8082/PureFoods/api/users/${order.customerID}`);
                    newCustomerNames[order.customerID] = res.data.user.fullName;
                } catch (err) {
                    console.error(`Error fetching user ${order.customerID}`, err);
                    newCustomerNames[order.customerID] = "Unknown";
                }
            }));

            setCustomerNames(newCustomerNames);
        };

        if (recentOrders.length > 0) {
            fetchCustomers();
        }
    }, [recentOrders]);


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


    const [chartData, setChartData] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:8082/PureFoods/api/orders/revenue/monthly')
            .then((res) => {
                const raw = res.data;
                const months = [
                    'Month 1', 'Month 2', 'Month 3', 'Month 4', 'Month 5', 'Month 6',
                    'Month 7', 'Month 8', 'Month 9', 'Month 10', 'Month 11', 'Month 12'
                ];
                const formatted = months.map((name, index) => ({
                    name,
                    revenue: raw[index + 1] || 0
                }));
                setChartData(formatted);
            });
    }, []);


    return (
        <div>
            <div className="tap-top">
                <span className="lnr lnr-chevron-up"></span>
            </div>
            <div className="page-wrapper compact-wrapper" id="pageWrapper">
                <TopBar />

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
                                                    <h4 className="mb-0 counter">${revenue}
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
                                                    <h4 className="mb-0 counter">{totalOrder}
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
                                                    </h4>
                                                </div>

                                                <div className="align-self-center text-center">
                                                    <i className="ri-user-add-line"></i>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="">
                                    <div className="card o-hidden card-hover">
                                        <div className="card-header border-0 pb-1">
                                            <div className="card-header-title">
                                                <h4 className='text-dark'>Revenue Report</h4>
                                            </div>
                                        </div>
                                        <div className="card-body p-0">
                                            <div style={{ width: '100%', height: 300 }}>
                                                <ResponsiveContainer>
                                                    <BarChart width={800} height={400} data={chartData}>
                                                        <CartesianGrid strokeDasharray="3 3" />
                                                        <XAxis dataKey="name" />
                                                        <YAxis />
                                                        <Tooltip />
                                                        <Bar dataKey="revenue" fill="#82ca9d" />
                                                    </BarChart>
                                                </ResponsiveContainer>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-xl-6 col-md-12">
                                    <div className="card o-hidden card-hover">
                                        <div className="card-header card-header-top card-header--2 px-0 pt-0">
                                            <div className="card-header-title">
                                                <h4 className='text-dark'>Best Selling Product</h4>
                                            </div>


                                        </div>

                                        <div className="card-body p-0">
                                            <div>
                                                <div className="table-responsive">
                                                    <table className="best-selling-table w-image
                                            w-image
                                            w-image table border-0">
                                                        <tbody>
                                                            {topSellerProduct?.map((p, i) => (
                                                                <tr key={i}>
                                                                    <td>
                                                                        <div className="best-product-box">
                                                                            <div className="product-image">
                                                                                <img src={p.product.imageURL}
                                                                                    className="img-fluid" alt="Product" />
                                                                            </div>
                                                                            <div className="product-name">
                                                                                <h5>{p.product.productName}</h5>
                                                                            </div>
                                                                        </div>
                                                                    </td>

                                                                    <td>
                                                                        <div className="product-detail-box">
                                                                            <h6>Price</h6>
                                                                            <div className='d-flex gap-2'>
                                                                                <h5><strong>${p.product.priceAfterDiscount}</strong></h5>
                                                                                <h5><del className='text-danger'>${p.product.price}</del></h5>
                                                                            </div>
                                                                        </div>
                                                                    </td>

                                                                    <td>
                                                                        <div className="product-detail-box">
                                                                            <h6>Orders</h6>
                                                                            <h5>{p.totalQuantity}</h5>
                                                                        </div>
                                                                    </td>

                                                                    <td>
                                                                        <div className="product-detail-box">
                                                                            <h6>Stock</h6>
                                                                            <h5>{p.product.stockQuantity}</h5>
                                                                        </div>
                                                                    </td>

                                                                    <td>
                                                                        <div className="product-detail-box">
                                                                            <h6>Amount</h6>
                                                                            <h5>${p.totalRevenue}</h5>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            ))}
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
                                                <h4 className='text-dark'>Recent Orders</h4>
                                            </div>
                                        </div>

                                        <div className="card-body p-0">
                                            <div>
                                                <div className="table-responsive">
                                                    <table className="best-selling-table table border-0">
                                                        <tbody>
                                                            {recentOrders?.map((o, i) => (
                                                                <tr key={i}>
                                                                    <td>
                                                                        <div className="best-product-box">
                                                                            <div className="product-name">
                                                                                <h5>Order Code</h5>
                                                                                <h6>#1130{o.orderID}</h6>
                                                                            </div>
                                                                        </div>
                                                                    </td>
                                                                    <td>
                                                                        <div className="product-detail-box">
                                                                            <h6>Order By</h6>
                                                                            <h5>{customerNames[o.customerID] || 'Loading...'}</h5>
                                                                        </div>
                                                                    </td>
                                                                    <td>
                                                                        <div className="product-detail-box">
                                                                            <h6>Date Placed</h6>
                                                                            <h5>{new Date(o.orderDate).toLocaleString()}</h5>
                                                                        </div>
                                                                    </td>

                                                                    <td>
                                                                        <div className="product-detail-box">
                                                                            <h6>Price</h6>
                                                                            <h5>${o.totalAmount}</h5>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                        <div className="container-fluid">
                            <footer className="footer">
                                <div className="row">
                                    <div className="col-md-12 footer-copyright text-center">
                                        <p className="mb-0">Copyright 2025 © Clean Food Shop theme by pixelstrap</p>
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

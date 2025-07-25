import React, { useEffect, useState } from 'react';
import axios from 'axios';
import $ from 'jquery';
import 'datatables.net';
import TopBar from '../AdminDashboard/TopBar';
import SideBar from '../AdminDashboard/SideBar';
import './Order.css'
import { toast } from 'react-toastify';
const Order = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [customerNames, setCustomerNames] = useState({});
  const [orderStatuses, setOrderStatuses] = useState({});
  const [orderDetailList, setOrderDetailList] = useState([]);

  const [selectedAddress, setSelectedAddress] = useState('');
  const handleViewMap = (address) => {
    setSelectedAddress(address);
    $('#mapModal').modal('show');
  };

  useEffect(() => {
    axios.get("http://localhost:8082/PureFoods/api/orders/getAll")
      .then(res => setOrders(res.data.orders))
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    if (orders.length > 0) {
      const table = $('#order_table').DataTable({
        paging: false,
        ordering: false,
        info: false,
        destroy: true,
        responsive: true,
      });
      return () => {
        table.destroy();
      };
    }
  }, [orders]);

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

  const getStatusClass = (statusName) => {
    switch (statusName?.toLowerCase()) {
      case 'pending': return 'text-warning';
      case 'processing': return 'text-primary';
      case 'shipped': return 'text-info';
      case 'delivered': return 'text-success';
      case 'cancelled': return 'text-danger';
      default: return 'text-secondary';
    }
  };



  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = orders.slice(startIndex, endIndex);
  const totalPages = Math.ceil(orders.length / itemsPerPage);


  const fetchCustomerName = async (customerID) => {
    if (!customerID || customerNames[customerID]) return;

    try {
      const res = await axios.get(`http://localhost:8082/PureFoods/api/users/${customerID}`);
      const name = res.data.user.fullName;
      setCustomerNames(prev => ({ ...prev, [customerID]: name }));
    } catch (error) {
      console.error(`Error fetching customer ${customerID}`, error);
    }
  };

  useEffect(() => {
    orders.forEach(order => {
      fetchCustomerName(order.customerID);
    });
  }, [orders]);

  const fetchOrderStatus = async (statusID) => {
    if (!statusID || orderStatuses[statusID]) return;

    try {
      const res = await axios.get(`http://localhost:8082/PureFoods/api/order-status/${statusID}`);
      const statusName = res.data.statusName;
      setOrderStatuses(prev => ({ ...prev, [statusID]: statusName }));
    } catch (error) {
      console.error(`Error fetching status ${statusID}`, error);
    }
  };
  useEffect(() => {
    orders.forEach(order => {
      fetchOrderStatus(order.statusID);
    });
  }, [orders]);

  const handleUpdateStatus = async (orderId, newStatusId) => {
    try {
      const res = await axios.put(`http://localhost:8082/PureFoods/api/orders/${orderId}/status`, {
        statusID: newStatusId
      });
      if (res.data.status === 200) {
        toast.success("Cập nhật trạng thái thành công!");

        const updatedOrders = orders.map(order => {
          if (order.orderID === orderId) {
            return { ...order, statusID: newStatusId };
          }
          return order;
        });
        setOrders(updatedOrders);

        fetchOrderStatus(newStatusId);
      }
    } catch (err) {
      console.error("Lỗi khi cập nhật trạng thái", err);
      toast.error("Cập nhật trạng thái thất bại");
    }
  };

  const handleViewDetails = async (orderId) => {
    setSelectedOrder(orderId);

    try {
      const res = await axios.get(`http://localhost:8082/PureFoods/api/order-details/order/${orderId}`);
      const details = res.data;

      const detailWithProducts = await Promise.all(
        details.map(async (detail) => {
          const productRes = await axios.get(`http://localhost:8082/PureFoods/api/product/getById/${detail.productID}`);
          const product = productRes.data.product;

          let categoryName = "Unknown";
          if (product.categoryId) {
            try {
              const catRes = await axios.get(`http://localhost:8082/PureFoods/api/category/${product.categoryId}`);
              categoryName = catRes.data.categoryName;
            } catch (e) {
              console.error("Lỗi lấy category:", e);
            }
          }

          let supplierName = "Unknown";
          if (product.supplierId) {
            try {
              const supRes = await axios.get(`http://localhost:8082/PureFoods/api/supplier/${product.supplierId}`);
              supplierName = supRes.data.supplierName;
            } catch (e) {
              console.error("Lỗi lấy supplier:", e);
            }
          }

          return {
            ...detail,
            product: {
              ...product,
              categoryName,
              supplierName
            }
          };
        })
      );

      setOrderDetailList(detailWithProducts);
      $('#orderDetailModal').modal('show');
    } catch (error) {
      console.error("Lỗi khi lấy chi tiết đơn hàng:", error);
    }
  };

  return (
    <div className="page-wrapper compact-wrapper" id="pageWrapper">
      <TopBar />
      <div className="page-body-wrapper">
        <SideBar />
        <div className="page-body">
          <div className="container-fluid">
            <div className="row">
              <div className="col-sm-12">
                <div className="card card-table">
                  <div className="card-body">
                    <div className="title-header option-title d-sm-flex d-block">
                      <h5>Order List</h5>
                    </div>
                    <div className="table-responsive">
                      <table className="table theme-table" id="order_table">
                        <thead>
                          <tr>
                            <th>Order Code</th>
                            <th>Customer</th>
                            <th>OrderDate</th>
                            <th>Shipping Address</th>
                            <th>Payment</th>
                            <th>Total Amount</th>
                            <th >Status</th>
                            <th>Options</th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentProducts?.map((o, i) => (
                            <tr key={i}>
                              <td>#00{o.orderID}</td>
                              <td>{customerNames[o.customerID] || 'Loading...'}</td>
                              <td>{new Date(o.orderDate).toLocaleDateString()}</td>
                              <td>{o.paymentMethod}</td>
                              <td>{o.shippingAddress}</td>
                              <td>${o.totalAmount}</td>
                              <td  >
                                <select
                                  style={{ width: '105px' }}
                                  value={o.statusID}
                                  className={`form-select form-select-sm ${getStatusClass(orderStatuses[o.statusID])}`}
                                  onChange={(e) => {e.preventDefault(); handleUpdateStatus(o.orderID, parseInt(e.target.value))}}
                                >
                                  <option value={1}>Pending</option>
                                  <option value={2}>Processing</option>
                                  <option value={3}>Shipped</option>
                                  <option value={4}>Delivered</option>
                                  <option value={5}>Cancelled</option>
                                </select>
                              </td>
                              <td>
                                <ul>
                                  <li>
                                    <a href="#" onClick={(e) => { e.preventDefault(); handleViewDetails(o.orderID); }}>
                                      <i className="ri-eye-line"></i>
                                    </a>
                                  </li>

                                  <li>
                                    <a
                                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(o.shippingAddress)}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      title="Xem trên Google Map"
                                    >
                                      <i className="ri-map-pin-line"></i>
                                    </a>
                                  </li>
                                </ul>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      <div className="pagination-container d-flex justify-content-center mt-3">
                        <nav>
                          <ul className="pagination">
                            <li className={`page-item ${currentPage === 1 && "disabled"}`}>
                              <button className="page-link" onClick={() => setCurrentPage(currentPage - 1)}>Previous</button>
                            </li>

                            {[...Array(totalPages)].map((_, index) => (
                              <li key={index} className={`page-item ${currentPage === index + 1 && "active"}`}>
                                <button className="page-link" onClick={() => setCurrentPage(index + 1)}>
                                  {index + 1}
                                </button>
                              </li>
                            ))}

                            <li className={`page-item ${currentPage === totalPages && "disabled"}`}>
                              <button className="page-link" onClick={() => setCurrentPage(currentPage + 1)}>Next</button>
                            </li>
                          </ul>
                        </nav>
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

      <div className="modal fade" id="orderDetailModal" tabIndex="-1" aria-hidden="true" >
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content" style={{ width: "1000px" }}>
            <div className="modal-header">
              <h5 className="modal-title">Order Details - ID: #00{selectedOrder}</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>Product Name</th>
                    <th>Category</th>
                    <th>Supplier</th>
                    <th>Price</th>
                    <th>Discount Persent</th>
                    <th>Price after Sale</th>
                    <th>Quantity</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {orderDetailList.length > 0 ? orderDetailList.map((detail, idx) => (
                    <tr key={idx}>
                      <td>
                        <div className="d-flex align-items-center">
                          <img
                            src={detail.product?.imageURL}
                            alt={detail.product?.productName}
                            style={{ width: '50px', height: '50px', objectFit: 'cover', marginRight: '10px' }}
                          />
                          <span>{detail.product?.productName}</span>
                        </div>
                      </td>
                      <td>{detail.product?.categoryName}</td>
                      <td>{detail.product?.supplierName}</td>
                      <td>${detail.product?.price}</td>
                      <td>${detail.product?.discountPercent}</td>
                      <td>${detail.product?.salePrice}</td>
                      <td>{detail.quantity}</td>
                      <td>${(detail.product?.salePrice * detail.quantity).toFixed(2)}</td>
                    </tr>
                  )) : (
                    <tr><td colSpan="4" className="text-center">No details found.</td></tr>
                  )}
                </tbody>
              </table>

            </div>
          </div>
        </div>
      </div>
      <div className="modal fade" id="deleteModal" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header text-center">
              <h5 className="modal-title w-100">Confirm Delete</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body text-center">
              <p>Are you sure you want to delete this order?</p>
              <button className="btn btn-danger m-2" data-bs-dismiss="modal">Yes</button>
              <button className="btn btn-secondary m-2" data-bs-dismiss="modal">No</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Order;

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import $ from 'jquery';
import 'datatables.net';
import TopBar from '../AdminDashboard/TopBar';
import SideBar from '../AdminDashboard/SideBar';

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderDetails, setOrderDetails] = useState([]);


  const handleViewDetails = (orderId) => {
    setSelectedOrder(orderId);
    
    axios.get(`http://localhost:8082/PureFoods/api/orders/${orderId}`)
      .then(res => {
        setOrderDetails(res.data.order);
        $('#orderDetailModal').modal('show');
      })
      .catch(err => console.error(err));
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

  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'success': return 'status-success';
      case 'pending': return 'status-warning';
      case 'cancel': return 'status-danger';
      default: return '';
    }
  };


  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = orders.slice(startIndex, endIndex);
  const totalPages = Math.ceil(orders.length / itemsPerPage);

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
                            <th>Date</th>
                            <th>Payment</th>
                            <th>Status</th>
                            <th>Amount</th>
                            <th>Options</th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentProducts?.map((o, i) => (
                            <tr key={i}>
                              <td>{o.orderID}</td>
                              <td>{new Date(o.orderDate).toLocaleDateString()}</td>
                              <td>{o.paymentMethod || 'Paypal'}</td>
                              <td className={getStatusClass(o.status)}>{o.status}</td>
                              <td>${o.totalAmount}</td>
                              <td>
                                <ul>
                                  <li>
                                    <a href="#" onClick={(e) => { e.preventDefault(); handleViewDetails(o.orderID); }}>
                                      <i className="ri-eye-line"></i>
                                    </a>
                                  </li>
                                  <li><a href="#"><i className="ri-pencil-line"></i></a></li>
                                  <li><a href="#" data-bs-toggle="modal" data-bs-target="#deleteModal">
                                    <i className="ri-delete-bin-line"></i></a>
                                  </li>
                                  <li><a href="#"><i className="ri-map-pin-line"></i></a></li>
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
                  <p className="mb-0">Copyright 2022 © Fastkart theme</p>
                </div>
              </div>
            </footer>
          </div>
        </div>
      </div>

      <div className="modal fade" id="orderDetailModal" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Order Details - ID: {selectedOrder}</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>Product Name</th>
                    <th>Quantity</th>
                    <th>Unit Price</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {orderDetails.length > 0 ? orderDetails.map((detail, idx) => (
                    <tr key={idx}>
                      <td>dsfd</td>
                      <td>asdf</td>
                      <td>asdf</td>
                      <td>asdf</td>
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

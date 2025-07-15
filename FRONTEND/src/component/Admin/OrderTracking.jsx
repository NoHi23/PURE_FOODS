import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TopBar from '../AdminDashboard/TopBar';
import SideBar from '../AdminDashboard/SideBar';

const OrderTracking = () => {
  const [orderTracking, setOrderTracking] = useState(null);
  const [orderId, setOrderId] = useState(1); // Mặc định

  useEffect(() => {
    axios.get(`http://localhost:8082/PureFoods/api/orders/${orderId}/tracking`)
      .then(res => setOrderTracking(res.data.order))
      .catch(err => console.error('Error fetching order tracking:', err));
  }, [orderId]); // Tùy thuộc vào orderId

  const handleOrderIdChange = (e) => {
    const newOrderId = parseInt(e.target.value, 10);
    if (!isNaN(newOrderId)) setOrderId(newOrderId); // Cập nhật orderId
  };
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
        <TopBar />
        <div className="page-body-wrapper">
          <SideBar />
          <div className="page-body">
            <div className="container-fluid">
              <h1>Order Tracking</h1>
              <div className="mb-3">
                <label>Enter Order ID: </label>
                <input
                  type="number"
                  value={orderId}
                  onChange={handleOrderIdChange}
                  className="form-control"
                  style={{ width: '200px', display: 'inline-block', marginLeft: '10px' }}
                />
              </div>
              {orderTracking ? (
                <div>
                  <p><strong>Order ID:</strong> {orderTracking.orderId}</p>
                  <p><strong>Status:</strong> {orderTracking.statusName}</p>
                  <p><strong>Estimated Delivery Date:</strong> {new Date(orderTracking.estimatedDeliveryDate).toLocaleString()}</p>
                  <p><strong>Driver:</strong> {orderTracking.driverName || 'N/A'}</p>
                  <p><strong>Shipping Address:</strong> {orderTracking.shippingAddress}</p>
                </div>
              ) : (
                <p>Loading...</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;

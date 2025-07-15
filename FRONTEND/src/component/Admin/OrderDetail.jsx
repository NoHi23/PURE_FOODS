import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import TopBar from '../AdminDashboard/TopBar';
import SideBar from '../AdminDashboard/SideBar';

const OrderDetail = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [orderDetails, setOrderDetails] = useState([]);
  const [customer, setCustomer] = useState(null);
  const [statusName, setStatusName] = useState('');
  const [shippingMethod, setShippingMethod] = useState(null);
  const [driver, setDriver] = useState(null);
  const [promotions, setPromotions] = useState([]);
  const [payment, setPayment] = useState(null);
  const [products, setProducts] = useState({}); // Để ánh xạ ProductID với tên sản phẩm

  useEffect(() => {
    const fetchOrderData = async () => {
      try {
        // Lấy thông tin đơn hàng
        const orderRes = await axios.get(`http://localhost:8082/PureFoods/api/orders/${orderId}`);
        setOrder(orderRes.data.order);

        // Lấy chi tiết đơn hàng
        const detailsRes = await axios.get(`http://localhost:8082/PureFoods/api/order-details/order/${orderId}`);
        setOrderDetails(detailsRes.data.orderDetails);

        // Lấy thông tin khách hàng
        const customerRes = await axios.get(`http://localhost:8082/PureFoods/api/users/${orderRes.data.order.customerID}`);
        setCustomer(customerRes.data.user);

        // Lấy tên trạng thái
        const statusRes = await axios.get(`http://localhost:8082/PureFoods/api/order-statuses/${orderRes.data.order.statusID}`);
        setStatusName(statusRes.data.statusName);

        // Lấy thông tin phương thức vận chuyển
        const shippingRes = await axios.get(`http://localhost:8082/PureFoods/api/shipping-methods/${orderRes.data.order.shippingMethodID}`);
        setShippingMethod(shippingRes.data.shippingMethod);

        // Lấy thông tin tài xế (nếu có)
        if (orderRes.data.order.driverID) {
          const driverRes = await axios.get(`http://localhost:8082/PureFoods/api/drivers/${orderRes.data.order.driverID}`);
          setDriver(driverRes.data.driver);
        }

        // Lấy thông tin khuyến mãi
        const promoRes = await axios.get(`http://localhost:8082/PureFoods/api/order-promotions/order/${orderId}`);
        setPromotions(promoRes.data.orderPromotions);

        // Lấy thông tin thanh toán
        const paymentRes = await axios.get(`http://localhost:8082/PureFoods/api/payments/order/${orderId}`);
        setPayment(paymentRes.data.payment);

        // Lấy thông tin sản phẩm để ánh xạ tên sản phẩm
        const uniqueProductIds = [...new Set(detailsRes.data.orderDetails.map(detail => detail.productID))];
        const productPromises = uniqueProductIds.map(id => axios.get(`http://localhost:8082/PureFoods/api/products/${id}`));
        const productResponses = await Promise.all(productPromises);
        const productMap = productResponses.reduce((acc, res) => {
          acc[res.data.product.productID] = res.data.product.productName;
          return acc;
        }, {});
        setProducts(productMap);
      } catch (err) {
        console.error('Error fetching order details:', err);
      }
    };

    fetchOrderData();
  }, [orderId]);
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
              <h1>Order Detail</h1>
              {order ? (
                <div>
                  <h4 style={{ fontWeight: 700 }}>Order ID: {order.orderId}</h4>
                  <p><strong>Customer Name:</strong> {customer ? customer.fullName : 'N/A'}</p>
                  <p><strong>Email:</strong> {customer ? customer.email : 'N/A'}</p>
                  <p><strong>Phone:</strong> {customer ? customer.phone : 'N/A'}</p>
                  <p><strong>Address:</strong> {customer ? customer.address : 'N/A'}</p>
                  <p><strong>Order Date:</strong> {new Date(order.orderDate).toLocaleString()}</p>
                  <p><strong>Total Amount:</strong> ${order.totalAmount.toFixed(2)}</p>
                  <p><strong>Status:</strong> {statusName}</p>
                  <p><strong>Shipping Address:</strong> {order.shippingAddress}</p>
                  <p><strong>Shipping Method:</strong> {shippingMethod ? shippingMethod.methodName : 'N/A'}</p>
                  <p><strong>Shipping Cost:</strong> ${order.shippingCost.toFixed(2)}</p>
                  <p><strong>Distance:</strong> {order.distance} km</p>
                  <p><strong>Discount Amount:</strong> ${order.discountAmount.toFixed(2)}</p>
                  <p><strong>Estimated Delivery Date:</strong> {order.estimatedDeliveryDate ? new Date(order.estimatedDeliveryDate).toLocaleString() : 'N/A'}</p>
                  <p><strong>Driver:</strong> {driver ? driver.driverName : 'N/A'}</p>
                  <p><strong>Return Reason:</strong> {order.returnReason || 'N/A'}</p>
                  <p><strong>Cancel Reason:</strong> {order.cancelReason || 'N/A'}</p>
                  <p><strong>Delay Reason:</strong> {order.delayReason || 'N/A'}</p>

                  <h5>Promotions Applied:</h5>
                  {promotions.length > 0 ? (
                    <ul>
                      {promotions.map((promo, index) => (
                        <li key={index}>
                          Code: {promo.promotionCode}, Discount: ${promo.discountApplied.toFixed(2)}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>No promotions applied.</p>
                  )}

                  <h5>Payment Information:</h5>
                  {payment ? (
                    <div>
                      <p><strong>Payment Method:</strong> {payment.paymentMethod}</p>
                      <p><strong>Amount:</strong> ${payment.amount.toFixed(2)}</p>
                      <p><strong>Status:</strong> {payment.paymentStatus}</p>
                      <p><strong>Payment Date:</strong> {new Date(payment.paymentDate).toLocaleString()}</p>
                      <p><strong>Transaction ID:</strong> {payment.transactionID || 'N/A'}</p>
                    </div>
                  ) : (
                    <p>No payment information available.</p>
                  )}

                  <h5>Order Details:</h5>
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Product ID</th>
                        <th>Product Name</th>
                        <th>Quantity</th>
                        <th>Unit Price</th>
                        <th>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orderDetails.map((detail, index) => (
                        <tr key={index}>
                          <td>{detail.productID}</td>
                          <td>{products[detail.productID] || 'N/A'}</td>
                          <td>{detail.quantity}</td>
                          <td>${detail.unitPrice.toFixed(2)}</td>
                          <td>${(detail.quantity * detail.unitPrice).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
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

export default OrderDetail;
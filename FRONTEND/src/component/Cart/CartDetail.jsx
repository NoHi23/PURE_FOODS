// ... imports như cũ
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './CartDetail.css';
import { useParams, useLocation, Link, Navigate } from 'react-router-dom';
import CartLayout from '../../layouts/CartLayout';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
const CartDetail = () => {
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.userId;
  const [cartItems, setCartItems] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [couponCode, setCouponCode] = useState('');
  const [couponDiscount, setCouponDiscount] = useState(0);
  // const [shippingFee] = useState(6.9); // USD
  const navigate = useNavigate();

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchCart();
    }, 200);
    return () => clearTimeout(timeout);
  }, [userId]);

  useEffect(() => {
    fetchCart();
  }, [location.state?.fromProductDetail]);

  const fetchCart = () => {
    axios.get(`http://localhost:8082/PureFoods/api/cart/user/${userId}`)
      .then(res => {
        setCartItems(res.data);
        const newSubtotal = res.data.reduce((sum, item) => sum + item.total, 0);
        setSubtotal(newSubtotal);
      })
      .catch(err => console.error("❌ Error fetching cart:", err));
  };

  const handleQuantityChange = (item, delta) => {
    const newQty = item.quantity + delta;
    if (newQty < 1) return;

    const updatedItem = {
      ...item,
      quantity: newQty,
      total: newQty * item.priceAfterDiscount
    };

    axios.put(`http://localhost:8082/PureFoods/api/cart/update/${item.cartItemID}`, updatedItem)
      .then(() => fetchCart())
      .catch(err => console.error(err));
  };

  const handleRemove = (cartItemID) => {
    axios.delete(`http://localhost:8082/PureFoods/api/cart/delete/${cartItemID}`)
      .then(() => fetchCart())
      .catch(err => console.error(err));
  };

  const handleApplyCoupon = () => {
    if (!couponCode.trim()) return;
    axios.get(`http://localhost:8082/PureFoods/api/promotion/code/${couponCode}`)
      .then(res => {
        const discountAmount = res.data.promotion.discountValue || 0;
        setCouponDiscount(discountAmount);
      })
      .catch(err => {
        setCouponDiscount(0);
        console.error('Invalid coupon');
      });
  };

  const toUSD = (amount) => {
    return amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
  };

  // const total = subtotal + shippingFee - couponDiscount;
  const total = subtotal - couponDiscount;

  const handleCreateOrder = () => {
    const orderPayload = {
      customerID: userId,
      orderDate: dayjs().toISOString(),
      totalAmount: total,
      statusID: 2, // trạng thái mặc định "Chờ xử lý"
      shippingAddress: user.address,
      shippingMethodID: 2,
      shippingCost: 0.0,
      distance: 0.0,
      discountAmount: couponDiscount,
      status: 1,
      cancelReason: null,
      estimatedDeliveryDate: null,
      driverID: 1,
      returnReason: null,
      paymentMethod: "COD",
      paymentStatus: "Pending" // hoặc null nếu bạn muốn backend xử lý mặc định
    };

    axios.post('http://localhost:8082/PureFoods/api/orders/create', orderPayload)
      .then(res => {
        const orderID = res.data.order.orderID;

        // Thêm từng order detail
        const orderDetailRequests = cartItems.map(item => {
          return axios.post('http://localhost:8082/PureFoods/api/order-details/create', {
            orderID: orderID,
            productID: item.productID,
            quantity: item.quantity,
            unitPrice: item.priceAfterDiscount * item.quantity,
            status: 1 // hoặc trạng thái mặc định
          });
        });

        Promise.all(orderDetailRequests)
          .then(() => {
            toast.success("🛒 Order and details created!");
            navigate(`/checkout/${orderID}`);
          })
          .catch(err => {
            console.error("❌ Error creating order details:", err);
            toast.error("❌ Failed to add order details");
          });

      })
      .catch(err => {
        console.error("❌ Error creating order:", err);
        toast.error("❌ Failed to create order");
      });
  };


  return (
    <CartLayout>
      <section className="cart-section section-b-space">
        <div className="container">
          {cartItems.length === 0 ? (
            <div className="text-center py-5">
              <h3>Your cart is empty</h3>
              <a href="/" className="btn btn-primary mt-3">Continue Shopping</a>
            </div>
          ) : (
            <div className="row g-sm-4 g-3">
              <div className="col-xxl-9">
                <div className="cart-table">
                  <div className="table-responsive">
                    <table className="table all-package theme-table">
                      <thead>
                        <tr >
                          <th className='text-dark'>Product</th>
                          <th className='text-dark'>Price</th>
                          <th className='text-dark'>Quantity</th>
                          <th className='text-dark'>Total</th>
                          <th className='text-dark'>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {cartItems.map((item) => (
                          <tr key={item.cartItemID}>
                            <td>
                              <div className="product-detail">
                                <img
                                  src={item.imageURL || "/placeholder.jpg"}
                                  className="img-fluid rounded-2"
                                  alt={item.productName || "Product"}
                                  style={{ width: "70px", height: "70px", objectFit: "cover" }}
                                />
                                <div className="product-detail-box">
                                  <h6>{item.productName}</h6>
                                  <p className="text-content">Unit: 1 item</p>
                                </div>
                              </div>
                            </td>
                            <td>
                              <p className="theme-color">
                                {toUSD(item.priceAfterDiscount)}
                              </p>
                              {item.discount > 0 && (
                                <span className="text-content text-decoration-line-through">
                                  {toUSD(item.originalPrice)}
                                </span>
                              )}
                            </td>
                            <td>
                              <div className="quantity price-quantity d-flex align-items-center gap-2">
                                <button className="btn btn-sm btn-light" onClick={() => handleQuantityChange(item, -1)}>-</button>
                                <input
                                  type="number"
                                  className="form-control"
                                  value={item.quantity}
                                  readOnly
                                  style={{ width: "60px", textAlign: "center" }}
                                />
                                <button className="btn btn-sm btn-light" onClick={() => handleQuantityChange(item, 1)}>+</button>
                              </div>
                            </td>
                            <td>
                              <h5 className="fw-semibold">
                                {toUSD(item.total)}
                              </h5>
                            </td>
                            <td>
                              <button className="btn btn-sm btn-outline-danger" onClick={() => handleRemove(item.cartItemID)}>
                                Remove 🗑️
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div className="col-xxl-3">
                <div className="summery-box p-sticky">
                  <div className="summery-header">
                    <h3>Order Summary</h3>
                  </div>

                  <div className="cart-coupon">
                    <h5 className="mb-2">Coupon Code</h5>
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                      />
                      <button className="btn btn-sm btn-dark text-white" onClick={handleApplyCoupon}>Apply</button>
                    </div>
                  </div>

                  <div className="summery-contain mt-3">
                    <ul>
                      <li>
                        <h4>Subtotal</h4>
                        <h4 className="price">{toUSD(subtotal)}</h4>
                      </li>
                      {/* <li>
                        <h4>Shipping Fee</h4>
                        <h4 className="price">{toUSD(shippingFee)}</h4>
                      </li> */}
                      <li>
                        <h4>Discount</h4>
                        <h4 className="price">-{toUSD(couponDiscount)}</h4>
                      </li>
                    </ul>
                  </div>

                  <ul className="summery-total">
                    <li className="list-total">
                      <h4>Total</h4>
                      <h4 className="price theme-color">{toUSD(total)}</h4>
                    </li>
                  </ul>

                  <div className="button-group cart-button">
                    <button className="btn btn-animation w-100" onClick={handleCreateOrder}>Proceed to Checkout</button>
                    <a href="/" className="btn btn-light shopping-button w-100 mt-2">
                      Continue Shopping
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </CartLayout>
  );
};

export default CartDetail;

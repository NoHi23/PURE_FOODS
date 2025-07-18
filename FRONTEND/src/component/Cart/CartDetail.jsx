import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './CartDetail.css';
import { useParams } from 'react-router-dom';
import CartLayout from '../../layouts/CartLayout';

const CartDetail = () => {
  const { userId } = useParams();
  const [cartItems, setCartItems] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [couponCode, setCouponCode] = useState('');
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [shippingFee] = useState(6.9);

  useEffect(() => {
    fetchCart();
  }, [userId]);

  const fetchCart = () => {
    axios.get(`http://localhost:8082/PureFoods/api/cart/user/${userId}`)
      .then(res => {
        setCartItems(res.data);
        const newSubtotal = res.data.reduce((sum, item) => sum + item.total, 0);
        setSubtotal(newSubtotal);
      })
      .catch(err => console.error(err));
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
      .then(() => {
        fetchCart();
      })
      .catch(err => console.error(err));
  };

  const handleRemove = (cartItemID) => {
    axios.delete(`http://localhost:8082/PureFoods/api/cart/delete/${cartItemID}`)
      .then(() => {
        fetchCart();
      })
      .catch(err => console.error(err));
  };

  const handleApplyCoupon = () => {
    if (!couponCode.trim()) return;
    axios.get(`http://localhost:8082/PureFoods/api/admin/coupons/code/${couponCode}`)
      .then(res => {
        const discountAmount = res.data.discountAmount || 0;
        setCouponDiscount(discountAmount);
      })
      .catch(err => {
        setCouponDiscount(0);
        console.error('Invalid coupon');
      });
  };

  const total = subtotal + shippingFee - couponDiscount;

  return (
    <CartLayout>
    <section className="cart-section section-b-space">
      <div className="container">
        {cartItems.length === 0 ? (
          <div className="text-center py-5">
            <h3>Giỏ hàng của bạn đang trống</h3>
            <a href="/" className="btn btn-primary mt-3">Tiếp tục mua sắm</a>
          </div>
        ) : (
          <div className="row g-sm-4 g-3">
            <div className="col-xxl-9">
              <div className="cart-table">
                <div className="table-responsive">
                  <table className="table all-package theme-table">
                    <thead>
                      <tr>
                        <th>Sản phẩm</th>
                        <th>Giá</th>
                        <th>Số lượng</th>
                        <th>Tổng</th>
                        <th>Thao tác</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cartItems.map((item) => (
                        <tr key={item.cartItemID}>
                          <td>
                            <div className="product-detail">
                              <img
                                src={item.imageURL}
                                className="img-fluid rounded-2"
                                alt={item.productName}
                                style={{ width: "70px", height: "70px", objectFit: "cover" }}
                              />
                              <div className="product-detail-box">
                                <h6>{item.productName}</h6>
                                <p className="text-content">Đơn vị: 1 sản phẩm</p>
                              </div>
                            </div>
                          </td>
                          <td>
                            <p className="theme-color">
                              {item.priceAfterDiscount.toLocaleString()}₫
                            </p>
                            {item.discount > 0 && (
                              <span className="text-content text-decoration-line-through">
                                {item.originalPrice.toLocaleString()}₫
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
                              {item.total.toLocaleString()}₫
                            </h5>
                          </td>
                          <td>
                            <button className="btn btn-sm btn-outline-danger" onClick={() => handleRemove(item.cartItemID)}>
                              Xóa
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
                  <h3>Tóm tắt đơn hàng</h3>
                </div>

                <div className="cart-coupon">
                  <h5 className="mb-2">Mã giảm giá</h5>
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                    />
                    <button className="btn btn-sm btn-dark" onClick={handleApplyCoupon}>Áp dụng</button>
                  </div>
                </div>

                <div className="summery-contain mt-3">
                  <ul>
                    <li>
                      <h4>Tạm tính</h4>
                      <h4 className="price">{subtotal.toLocaleString()}₫</h4>
                    </li>
                    <li>
                      <h4>Phí vận chuyển</h4>
                      <h4 className="price">{shippingFee.toLocaleString()}₫</h4>
                    </li>
                    <li>
                      <h4>Giảm giá</h4>
                      <h4 className="price">-{couponDiscount.toLocaleString()}₫</h4>
                    </li>
                  </ul>
                </div>

                <ul className="summery-total">
                  <li className="list-total">
                    <h4>Tổng</h4>
                    <h4 className="price theme-color">{total.toLocaleString()}₫</h4>
                  </li>
                </ul>

                <div className="button-group cart-button">
                  <button className="btn btn-animation w-100">Tiến hành thanh toán</button>
                  <button className="btn btn-light shopping-button w-100 mt-2">Tiếp tục mua sắm</button>
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

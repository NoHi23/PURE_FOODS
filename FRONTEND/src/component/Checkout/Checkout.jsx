import React, { useEffect, useState } from 'react'
import CheckoutLayout from '../../layouts/CheckoutLayout'
import axios from 'axios';
import './Checkout.css'
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';

const Checkout = () => {
  const { id } = useParams();

  const user = JSON.parse(localStorage.getItem('user'));
  const [userAddress, setUserAddress] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newAddress, setNewAddress] = useState({
    fullName: '',
    phone: '',
    address: ''
  });
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('COD');



  useEffect(() => {
    axios.get(`http://localhost:8082/PureFoods/api/users/${user?.userId}`)
      .then(res => setUserAddress([res.data.user]))
      .catch(err => console.error(err));
  }, []);


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAddress(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddAddress = () => {
    if (!newAddress.fullName || !newAddress.phone || !newAddress.address) {
      toast.warn("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    setUserAddress(prev => [...prev, newAddress]);
    setNewAddress({ fullName: '', phone: '', address: '' });
    setShowModal(false);
  };
  const handleRemoveAddress = (indexToRemove) => {
    setUserAddress(prev => prev.filter((_, i) => i !== indexToRemove));
  };

  const [customerID, setCustomerID] = useState(null);
  const [totalAmount, setTotalAmount] = useState(0);
  const [shippingMethodID, setShippingMethodID] = useState(null);

  const handlePlaceOrder = async () => {
    const address = userAddress[selectedAddressIndex]?.address;

    if (!address) {
      toast.warn("Vui lòng chọn địa chỉ giao hàng!");
      return;
    }

    try {
      const response = await axios.put(`http://localhost:8082/PureFoods/api/orders/updateOrder/${id}`, {
        customerID: user?.userId,
        totalAmount: totalAmount,
        shippingAddress: address,
        shippingMethodID: 1, // nếu chỉ có 1 shipping method
        paymentMethod: paymentMethod === 'VNPAY' ? 'VNPAY' : 'COD',
        statusID: 1,
        driverID: 1
      });


      console.log("Phản hồi từ backend:", response.data);

      if (response.data.redirectUrl) {
        window.location.href = response.data.redirectUrl;
      } else if (paymentMethod === 'COD') {
        const orderId = response.data.orderID || id; // Lấy từ phản hồi hoặc params
        window.location.href = `http://localhost:3000/order-success/${orderId}`;
        toast.success("Chúc mừng bạn đã đặt hàng thành công!");

      }
    } catch (error) {
      console.error('Lỗi tạo đơn hàng:', error);
      toast.error("Có lỗi xảy ra khi tạo đơn hàng!");
    }
  };


  useEffect(() => {
    axios.get(`http://localhost:8082/PureFoods/api/orders/${id}`)
      .then(res => {
        const order = res.data.order;
        setCustomerID(order.customerID);
        setTotalAmount(order.totalAmount);
        setShippingMethodID(order.shippingMethodID);

      })
      .catch(err => console.error(err));
  }, [id]);


  const [orderDetails, setOrderDetails] = useState([]);
  const [productDetails, setProductDetails] = useState([]);
  const subtotal = orderDetails.reduce((sum, item) => sum + item.unitPrice, 0);
  const discount = subtotal - totalAmount;


  useEffect(() => {
    if (!id) return;

    axios.get(`http://localhost:8082/PureFoods/api/order-details/order/${id}`)
      .then(async res => {
        const details = res.data;
        setOrderDetails(details);

        const productPromises = details.map(detail =>
          axios.get(`http://localhost:8082/PureFoods/api/product/getById/${detail.productID}`)
            .then(res => ({
              ...detail,
              product: res.data
            }))
        );

        const results = await Promise.all(productPromises);
        setProductDetails(results);
      })
      .catch(err => console.error("❌ Lỗi khi lấy order detail:", err));
  }, [id]);


  return (
    <CheckoutLayout>
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
      <section className="breadcrumb-section pt-0">
        <div className="container-fluid-lg">
          <div className="row">
            <div className="col-12">
              <div className="breadcrumb-contain">
                <h2>Thanh toán</h2>
                <nav>
                  <ol className="breadcrumb mb-0">
                    <li className="breadcrumb-item">
                      <a href="/">
                        <i className="fa-solid fa-house"></i>
                      </a>
                    </li>
                    <li className="breadcrumb-item active">Thanh toán</li>
                  </ol>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="checkout-section-2 section-b-space">
        <div className="container-fluid-lg">
          <div className="row g-sm-4 g-3">
            <div className="col-lg-8">
              <div className="left-sidebar-checkout">
                <div className="checkout-detail-box">
                  <ul>
                    <li>
                      <div className="checkout-icon">
                        <lord-icon target=".nav-item" src="https://cdn.lordicon.com/ggihhudh.json"
                          trigger="loop-on-hover"
                          colors="primary:#121331,secondary:#646e78,tertiary:#0baf9a"
                          className="lord-icon">
                        </lord-icon>
                      </div>
                      <div className="checkout-box">
                        <div className="checkout-title">
                          <h4>Địa chỉ giao hàng</h4>
                        </div>

                        <div className="checkout-detail">
                          <div className="row g-4">
                            {userAddress.map((address, index) => (
                              <div className="col-xxl-6 col-lg-12 col-md-6" key={index}>
                                <div className="delivery-address-box">
                                  <div>
                                    <div className="form-check">
                                      <input
                                        className="form-check-input"
                                        type="radio"
                                        name="selectedAddress"
                                        id={`address-${index}`}
                                        checked={selectedAddressIndex === index}
                                        onChange={() => setSelectedAddressIndex(index)}
                                      />                                    </div>
                                    <div className="label">
                                      <label>{index === 0 ? "Nhà" : `Địa chỉ ${index + 1}`}</label>
                                    </div>
                                    <ul className="delivery-address-detail">
                                      <li><h4 className="fw-500">{address.fullName}</h4></li>
                                      <li><p className="text-content"><span className="text-title">Địa chỉ: </span>{address.address}</p></li>
                                      <li><h6 className="text-content mb-0"><span className="text-title">Số điện thoại:</span>{address.phone}</h6></li>
                                    </ul>
                                  </div>
                                  {index !== 0 && (
                                    <div style={{ display: "flex", justifyContent: "end" }}>
                                      <button
                                        className="remove-address-btn-bottom"
                                        onClick={() => handleRemoveAddress(index)}
                                        title="Xóa địa chỉ"
                                      >
                                        <i className="fa-solid fa-trash"></i> Xóa
                                      </button>
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>

                          <button className="btn btn-sm btn-outline-primary mt-3" onClick={() => setShowModal(true)}>
                            + Thêm địa chỉ mới
                          </button>
                        </div>

                      </div>
                    </li>



                    <li>
                      <div className="checkout-icon">
                        <lord-icon target=".nav-item" src="https://cdn.lordicon.com/qmcsqnle.json"
                          trigger="loop-on-hover" colors="primary:#0baf9a,secondary:#0baf9a"
                          className="lord-icon">
                        </lord-icon>
                      </div>
                      <div className="checkout-box">
                        <div className="checkout-title">
                          <h4>Tùy chọn thanh toán</h4>
                        </div>
                        <div className="checkout-detail">
                          <div className="accordion accordion-flush custom-accordion" id="accordionFlushExample">
                            <div className="accordion-item">
                              <div className="accordion-header" id="flush-headingFour">
                                <div className="accordion-button collapsed" data-bs-toggle="collapse" data-bs-target="#flush-collapseFour">
                                  <div className="custom-form-check form-check mb-0">
                                    <label className="form-check-label" htmlFor="cash">
                                      <input
                                        className="form-check-input mt-0"
                                        type="radio"
                                        name="flexRadioDefault"
                                        id="cash"
                                        checked={paymentMethod === 'COD'}
                                        onChange={() => setPaymentMethod('COD')}
                                      />
                                      Thanh toán khi nhận hàng
                                    </label>
                                  </div>
                                </div>
                              </div>
                              <div id="flush-collapseFour" className="accordion-collapse collapse show" data-bs-parent="#accordionFlushExample">
                                <div className="accordion-body">
                                  <p className="cod-review">

                                    Thanh toán kỹ thuật số bằng SMS Pay Link. Tiền mặt có thể không được chấp nhận tại các khu vực bị hạn chế do COVID.
                                    <a href="#">Tìm hiểu thêm.</a>
                                  </p>
                                </div>
                              </div>
                            </div>

                            <div className="accordion-item">
                              <div className="accordion-header" id="flush-headingVnpay">
                                <div className="accordion-button collapsed" data-bs-toggle="collapse" data-bs-target="#flush-collapseVnpay">
                                  <div className="custom-form-check form-check mb-0">
                                    <label className="form-check-label" htmlFor="vnpay">
                                      <input
                                        className="form-check-input mt-0"
                                        type="radio"
                                        name="flexRadioDefault"
                                        id="vnpay"
                                        checked={paymentMethod === 'VNPAY'}
                                        onChange={() => setPaymentMethod('VNPAY')}
                                      />
                                      VNPay (QR / ATM / Banking)
                                    </label>
                                  </div>
                                </div>
                              </div>
                              <div id="flush-collapseVnpay" className="accordion-collapse collapse" data-bs-parent="#accordionFlushExample">
                                <div className="accordion-body">
                                  <p className="cod-review">Sau khi nhấp vào đặt hàng, bạn sẽ được chuyển hướng đến cổng thanh toán VNPay để quét mã QR hoặc thanh toán bằng ATM.</p>
                                </div>
                              </div>
                            </div>


                          </div>
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="col-lg-4">
              <div className="right-side-summery-box">
                <div className="summery-box-2">
                  <div className="summery-header">
                    <h3>Tóm tắt đơn hàng</h3>
                  </div>
                  <ul className="summery-contain" >
                    {productDetails.map((item, idx) => (

                      <li key={idx}>
                        <img src={item.imageURL}
                          className="img-fluid blur-up lazyloaded checkout-image" alt="" />
                        <h4>{item.productName} <span>X {item.quantity}</span></h4>
                        <h4 className="price">${item.unitPrice}</h4>
                      </li>


                    ))}

                  </ul>

                  <ul className="summery-total">
                    <li>
                      <h4>Tổng phụ</h4>
                      <h4 className="price">${subtotal.toFixed(2)}</h4>
                    </li>

                    <li>
                      <h4>Phiếu giảm giá/Mã giảm giá</h4>
                      <h4 className="price">-${(discount > 0 ? discount.toFixed(2) : '0.00')}</h4>
                    </li>

                    <li className="list-total">
                      <h4>Tổng cộng (USD)</h4>
                      <h4 className="price">${totalAmount.toFixed(2)}</h4>
                    </li>
                  </ul>
                </div>

                <div className="checkout-offer">
                  <div className="offer-title">
                    <div className="offer-icon">
                      <img src="../assets/images/inner-page/offer.svg" className="img-fluid" alt="" />
                    </div>
                    <div className="offer-name">
                      <h6>Ưu đãi hiện có</h6>
                    </div>
                  </div>

                  <ul className="offer-detail">
                    <li>
                      <p>Combo: Hạt điều Hoàng gia BB/Hạnh nhân Badam Californian, vị đậm đà 100g...</p>
                    </li>
                    <li>
                      <p>Combo: Hạt điều Hoàng gia Californian, vị đậm đà 100g + Mật ong Hoàng gia BB 500g</p>
                    </li>
                  </ul>
                </div>

                <button className="btn theme-bg-color text-white btn-md w-100 mt-4 fw-bold" onClick={handlePlaceOrder}>Đặt hàng</button>              </div>
            </div>
          </div>
        </div>
      </section>
      <div className="modal location-modal fade theme-modal" id="locationModal" tabindex="-1">
        <div className="modal-dialog modal-dialog-centered modal-fullscreen-sm-down">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">Choose your Delivery Location</h5>
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
      <div className="modal fade theme-modal" id="add-address" tabindex="-1">
        <div className="modal-dialog modal-dialog-centered modal-fullscreen-sm-down">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel1">Add a new address</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal">
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
            <div className="modal-body">
              <form>
                <div className="form-floating mb-4 theme-form-floating">
                  <input type="text" className="form-control" id="fname" placeholder="Enter First Name" />
                  <label for="fname">First Name</label>
                </div>
              </form>

              <form>
                <div className="form-floating mb-4 theme-form-floating">
                  <input type="text" className="form-control" id="lname" placeholder="Enter Last Name" />
                  <label for="lname">Last Name</label>
                </div>
              </form>

              <form>
                <div className="form-floating mb-4 theme-form-floating">
                  <input type="email" className="form-control" id="email" placeholder="Enter Email Address" />
                  <label for="email">Email Address</label>
                </div>
              </form>

              <form>
                <div className="form-floating mb-4 theme-form-floating">
                  <textarea className="form-control" placeholder="Leave a comment here" id="address"
                    style={{ height: "100px" }}></textarea>
                  <label for="address">Enter Address</label>
                </div>
              </form>

              <form>
                <div className="form-floating mb-4 theme-form-floating">
                  <input type="email" className="form-control" id="pin" placeholder="Enter Pin Code" />
                  <label for="pin">Pin Code</label>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary btn-md" data-bs-dismiss="modal">Close</button>
              <button type="button" className="btn theme-bg-color btn-md text-white" data-bs-dismiss="modal">Save
                changes</button>
            </div>
          </div>
        </div>
      </div>
      <div className="modal fade theme-modal deal-modal" id="deal-box" tabindex="-1">
        <div className="modal-dialog modal-dialog-centered modal-fullscreen-sm-down">
          <div className="modal-content">
            <div className="modal-header">
              <div>
                <h5 className="modal-title w-100" id="deal_today">Deal Today</h5>
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
                        <img src="../assets/images/vegetable/product/10.png" className="blur-up lazyload"
                          alt="" />
                      </a>

                      <a href="shop-left-sidebar.html" className="deal-contain">
                        <h5>Blended Instant Coffee 50 g Buy 1 Get 1 Free</h5>
                        <h6>$52.57 <del>57.62</del> <span>500 G</span></h6>
                      </a>
                    </div>
                  </li>

                  <li className="list-2">
                    <div className="deal-offer-contain">
                      <a href="shop-left-sidebar.html" className="deal-image">
                        <img src="../assets/images/vegetable/product/11.png" className="blur-up lazyload"
                          alt="" />
                      </a>

                      <a href="shop-left-sidebar.html" className="deal-contain">
                        <h5>Blended Instant Coffee 50 g Buy 1 Get 1 Free</h5>
                        <h6>$52.57 <del>57.62</del> <span>500 G</span></h6>
                      </a>
                    </div>
                  </li>

                  <li className="list-3">
                    <div className="deal-offer-contain">
                      <a href="shop-left-sidebar.html" className="deal-image">
                        <img src="../assets/images/vegetable/product/12.png" className="blur-up lazyload"
                          alt="" />
                      </a>

                      <a href="shop-left-sidebar.html" className="deal-contain">
                        <h5>Blended Instant Coffee 50 g Buy 1 Get 1 Free</h5>
                        <h6>$52.57 <del>57.62</del> <span>500 G</span></h6>
                      </a>
                    </div>
                  </li>

                  <li className="list-1">
                    <div className="deal-offer-contain">
                      <a href="shop-left-sidebar.html" className="deal-image">
                        <img src="../assets/images/vegetable/product/13.png" className="blur-up lazyload"
                          alt="" />
                      </a>

                      <a href="shop-left-sidebar.html" className="deal-contain">
                        <h5>Blended Instant Coffee 50 g Buy 1 Get 1 Free</h5>
                        <h6>$52.57 <del>57.62</del> <span>500 G</span></h6>
                      </a>
                    </div>
                  </li>
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
                      <label for="colorPick" className="form-label mb-0">Theme Color</label>
                      <input type="color" className="form-control form-control-color" id="colorPick"
                        value="#0da487" title="Choose your color" />
                    </form>
                  </div>
                </li>

                <li>
                  <div className="setting-name">
                    <h4>Dark</h4>
                  </div>
                  <div className="theme-setting-button">
                    <button className="btn btn-2 outline" id="darkButton">Dark</button>
                    <button className="btn btn-2 unline" id="lightButton">Light</button>
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
      <div class="bg-overlay"></div>
      {showModal && (
        <div className="modal-backdrop-custom">
          <div className="modal-dialog-custom">
            <div className="modal-content-custom">
              <div className="modal-header-custom">
                <h5>Thêm địa chỉ giao hàng</h5>
                <button className="btn-close-custom" onClick={() => setShowModal(false)}>
                  &times;
                </button>
              </div>

              <div className="modal-body-custom">
                <div className="form-floating mb-3">
                  <input
                    type="text"
                    name="fullName"
                    value={newAddress.fullName}
                    onChange={handleInputChange}
                    className="form-control"
                    placeholder="Họ tên"
                  />
                  <label>Họ tên</label>
                </div>

                <div className="form-floating mb-3">
                  <input
                    type="text"
                    name="phone"
                    value={newAddress.phone}
                    onChange={handleInputChange}
                    className="form-control"
                    placeholder="Số điện thoại"
                  />
                  <label>Số điện thoại</label>
                </div>

                <div className="form-floating mb-3">
                  <textarea
                    name="address"
                    value={newAddress.address}
                    onChange={handleInputChange}
                    className="form-control"
                    style={{ height: "100px" }}
                    placeholder="Địa chỉ"
                  ></textarea>
                  <label>Địa chỉ</label>
                </div>
              </div>

              <div className="modal-footer-custom">
                <button className="btn btn-sm btn-outline-secondary" onClick={() => setShowModal(false)}>Hủy</button>
                <button className="btn btn-sm btn-primary" onClick={handleAddAddress}>Lưu</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </CheckoutLayout>
  )
}

export default Checkout

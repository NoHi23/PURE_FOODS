import React from "react";

const Footer = ({ user }) => {
  return (
    <footer className="section-t-space">
      <div className="container-fluid-lg">
        {/* Dịch vụ nổi bật */}
        <div className="service-section">
          <div className="row g-3">
            <div className="col-12">
              <div className="service-contain">
                {[
                  { icon: "product.svg", text: "Mỗi sản phẩm rất tươi" },
                  { icon: "delivery.svg", text: "Miễn phí vận chuyển với đơn trên $50" },
                  { icon: "discount.svg", text: "Mã giảm giá lớn mỗi ngày" },
                  { icon: "market.svg", text: "Giá tốt nhất trên thị trường" },
                ].map((item, i) => (
                  <div className="service-box" key={i}>
                    <div className="service-image">
                      <img src={`../assets/svg/${item.icon}`} alt="" className="blur-up lazyload" />
                    </div>
                    <div className="service-detail">
                      <h5>{item.text}</h5>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer chính */}
        <div className="main-footer section-b-space section-t-space">
          <div className="row g-md-4 g-3">
            {/* Logo + giới thiệu */}
            <div className="col-xl-3 col-lg-4 col-sm-6">
              <div className="footer-logo">
                <div className="theme-logo">
                  <a href="/">
                    <img src="../assets/images/logo/1.png" alt="" className="blur-up lazyload" />
                  </a>
                </div>
                <div className="footer-logo-contain">
                  <p>Chúng tôi là cửa hàng thực phẩm sạch... chất lượng và an toàn cho mọi gia đình.</p>
                  <ul className="address">
                    <li>
                      <i data-feather="home"></i>
                      <a href="#">1418 Riverwood Drive, CA 96052, US</a>
                    </li>
                    <li>
                      <i data-feather="mail"></i>
                      <a href="#">supportPureFood@gmail.com</a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Thể loại */}
            <div className="col-xl-2 col-lg-3 col-md-4 col-sm-6">
              <div className="footer-title">
                <h4>Thể loại</h4>
              </div>

              <div className="footer-contain">
                <ul>
                  <li>
                    <a href="shop-left-sidebar.html" className="text-content">
                      Rau củ & trái cây
                    </a>
                  </li>
                  <li>
                    <a href="shop-left-sidebar.html" className="text-content">
                      Đồ uống
                    </a>
                  </li>
                  <li>
                    <a href="shop-left-sidebar.html" className="text-content">
                      Thịt và hải sản
                    </a>
                  </li>
                  <li>
                    <a href="shop-left-sidebar.html" className="text-content">
                      Đồ đông lạnh
                    </a>
                  </li>
                  <li>
                    <a href="shop-left-sidebar.html" className="text-content">
                      Bánh và đồ ăn nhẹ
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            {/* Liên kết hữu ích */}
            <div className="col-xl col-lg-2 col-sm-3">
              <div className="footer-title">
                <h4>Liên kết hữu ích</h4>
              </div>

              <div className="footer-contain">
                <ul>
                  <li>
                    <a href="/" className="text-content">
                      Trang chủ
                    </a>
                  </li>
                  <li>
                    <a href="about-us.html" className="text-content">
                      Về chúng tôi
                    </a>
                  </li>

                  <li>
                    <a href="contact-us.html" className="text-content">
                      Liên hệ
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            {/* Trợ giúp */}
            <div className="col-xl-2 col-sm-3">
              <div className="footer-title">
                <h4>Trung tâm trợ giúp</h4>
              </div>

              <div className="footer-contain">
                <ul>
                  <li>
                    <a href="order-success.html" className="text-content">
                      Đơn hàng của bạn
                    </a>
                  </li>
                  <li>
                    <a href="user-dashboard.html" className="text-content">
                      Tài khoản của bạn
                    </a>
                  </li>
                  <li>
                    <a href="order-tracking.html" className="text-content">
                      Theo dõi đơn hàng
                    </a>
                  </li>
                  <li>
                    <a href="wishlist.html" className="text-content">
                      Danh sách mong muốn
                    </a>
                  </li>
                  <li>
                    <a href="faq.html" className="text-content">
                      Các câu hỏi thường gặp
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            {/* Liên hệ */}
            <div className="col-xl-3 col-lg-4 col-sm-6">
              <div className="footer-title">
                <h4>Liên hệ</h4>
              </div>

              <div className="footer-contact">
                <ul>
                  <li>
                    <div className="footer-number">
                      <i data-feather="phone"></i>
                      <div className="contact-number">
                        <h6 className="text-content">Hotline 24/7 :</h6>
                        <h5>1900 10113</h5>
                      </div>
                    </div>
                  </li>

                  <li>
                    <div className="footer-number">
                      <i data-feather="mail"></i>
                      <div className="contact-number">
                        <h6 className="text-content">Địa chỉ Email :</h6>
                        <h5>supportPureFood@gmail.com</h5>
                      </div>
                    </div>
                  </li>

                  <li className="social-app">
                    <h5 className="mb-2 text-content">Tải ứng dụng tại đây :</h5>
                    <ul>
                      <li className="mb-0">
                        <a href="https://play.google.com/store/apps" target="_blank">
                          <img src="../assets/images/playstore.svg" className="blur-up lazyload" alt="" />
                        </a>
                      </li>
                      <li className="mb-0">
                        <a href="https://www.apple.com/in/app-store/" target="_blank">
                          <img src="../assets/images/appstore.svg" className="blur-up lazyload" alt="" />
                        </a>
                      </li>
                    </ul>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Subfooter */}
        <div className="sub-footer section-small-space">
          <div className="reserve">
            <h6 className="text-content">©2022 PURE_FOODS All rights reserved</h6>
          </div>
          <div className="payment">
            <img src="../assets/images/payment/1.png" alt="" className="blur-up lazyload" />
          </div>
          <div className="social-link">
            <h6 className="text-content">Giữ kết nối với chúng tôi :</h6>
            <ul>
              <li>
                <a href="https://www.facebook.com/" target="_blank">
                  <i className="fa-brands fa-facebook-f"></i>
                </a>
              </li>
              <li>
                <a href="https://twitter.com/" target="_blank">
                  <i className="fa-brands fa-twitter"></i>
                </a>
              </li>
              <li>
                <a href="https://www.instagram.com/" target="_blank">
                  <i className="fa-brands fa-instagram"></i>
                </a>
              </li>
              <li>
                <a href="https://in.pinterest.com/" target="_blank">
                  <i className="fa-brands fa-pinterest-p"></i>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

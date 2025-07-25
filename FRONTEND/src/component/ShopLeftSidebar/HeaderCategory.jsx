import React from "react";
import { FaHome } from "react-icons/fa";
import { Row, Col, Breadcrumb, Container } from "react-bootstrap";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./HeaderCategory.css";

const HeaderCategory = () => {
  const settings = {
    dots: true,
    arrows: true,
    infinite: true,
    autoplay: true,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    cssEase: "ease-in-out",
  };

  return (
    <>
      {/* Breadcrumb section */}
      <section className="bg-light py-2 border-bottom">
        <Container fluid>
          <Row>
            <Col>
              <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 px-4">
                <h4 className="mb-0 fw-bold" style={{ fontSize: "30px", color: "black" }}>
                  Shop Left Sidebar
                </h4>
                <Breadcrumb className="mb-0">
                  <Breadcrumb.Item href="/" className="d-flex align-items-center gap-1">
                    <FaHome style={{ fontSize: "25px", marginRight: "10px" }} />
                    <span style={{ fontSize: "25px" }}>Home</span>
                  </Breadcrumb.Item>
                  <Breadcrumb.Item active style={{ fontSize: "25px" }}>
                    Shop Left Sidebar
                  </Breadcrumb.Item>
                </Breadcrumb>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Carousel */}
      <section className="my-4">
        <Container fluid>
          <Row className="justify-content-center">
            <Col lg={12}>
              <div className="carousel-wrapper">
                <Slider {...settings}>
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i}>
                      <div className="carousel-slide">
                        <img
                          src={`/assets/images/banner${i}.jpg`}
                          alt={`Banner ${i}`}
                          className="carousel-image"
                        />
                        <div className="carousel-caption">
                          <h2 className="mb-1">Healthy, nutritious & Tasty Fruits & Veggies</h2>
                          <h5>Save up to 50%</h5>
                        </div>
                      </div>
                    </div>
                  ))}
                </Slider>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
};

export default HeaderCategory;

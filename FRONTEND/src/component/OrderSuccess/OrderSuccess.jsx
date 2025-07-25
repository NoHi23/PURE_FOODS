import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import OrderSuccessLayout from '../../layouts/OrderSuccessLayout';
import axios from 'axios';
import { toast } from 'react-toastify';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import './OrderSuccess.css';

const OrderSuccess = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [orderDetails, setOrderDetails] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.userId;

  // State cho modal đánh giá
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [existingReview, setExistingReview] = useState(null); // Để preload nếu edit

  const loadOrderDetails = async () => {
    if (!orderId) return;
    try {
      const orderRes = await axios.get(`http://localhost:8082/PureFoods/api/orders/${orderId}`);
      if (orderRes.data.status === 200) {
        setOrder(orderRes.data.order);
      }

      const detailsRes = await axios.get(`http://localhost:8082/PureFoods/api/order-details/order/${orderId}`);
      const details = detailsRes.data;

      const detailsWithProducts = await Promise.all(
        details.map(async (detail) => {
          const productRes = await axios.get(`http://localhost:8082/PureFoods/api/product/getById/${detail.productID}`);
          return { ...detail, product: productRes.data.product };
        })
      );
      setOrderDetails(detailsWithProducts);
    } catch (error) {
      console.error("Lỗi khi tải chi tiết đơn hàng:", error);
      toast.error("Không thể tải chi tiết đơn hàng");
    }
  };

  // Hàm mở modal đánh giá, check hasPurchased và preload review nếu có
  const handleOpenReview = async (productId) => {
    try {
      const hasPurchasedRes = await axios.get(`http://localhost:8082/PureFoods/api/orders/hasPurchased?userId=${userId}&productId=${productId}`);
      if (!hasPurchasedRes.data.hasPurchased) {
        toast.warning("Bạn chưa mua sản phẩm này");
        return;
      }

      // Lấy review hiện tại của user cho product này (nếu có)
      const reviewsRes = await axios.get(`http://localhost:8082/PureFoods/api/review/product?productId=${productId}`);
      const userReview = reviewsRes.data.find(review => review.customerId === userId);
      setExistingReview(userReview || null);
      setRating(userReview?.rating || 0);
      setComment(userReview?.comment || '');
      setSelectedProductId(productId);
      setShowReviewModal(true);
    } catch (error) {
      toast.error("Lỗi khi kiểm tra hoặc tải đánh giá");
    }
  };

  // Hàm submit đánh giá
  const handleSubmitReview = async () => {
    if (rating < 1 || comment.trim() === '') {
      toast.warning("Vui lòng chọn rating và viết comment");
      return;
    }

    try {
      const reviewData = {
        productId: selectedProductId,
        customerId: userId,
        rating,
        comment,
      };

      if (existingReview) {
        reviewData.reviewId = existingReview.reviewId;
        await axios.put('http://localhost:8082/PureFoods/api/review/update', reviewData);
        toast.success("Đánh giá đã được cập nhật!");
      } else {
        await axios.post('http://localhost:8082/PureFoods/api/review/create', reviewData);
        toast.success("Đánh giá đã được gửi!");
      }

      setShowReviewModal(false);
      resetReviewForm();
    } catch (error) {
      toast.error("Gửi đánh giá thất bại");
    }
  };

  // Hàm xóa đánh giá
  const handleDeleteReview = async () => {
    if (!existingReview || !window.confirm("Bạn chắc chắn muốn xóa đánh giá?")) return;
    try {
      await axios.delete(`http://localhost:8082/PureFoods/api/review/delete?productId=${selectedProductId}&customerId=${userId}`);
      toast.success("Đánh giá đã được xóa!");
      setShowReviewModal(false);
      resetReviewForm();
    } catch (error) {
      toast.error("Xóa thất bại");
    }
  };

  const resetReviewForm = () => {
    setRating(0);
    setComment('');
    setExistingReview(null);
    setSelectedProductId(null);
  };

  useEffect(() => {
    loadOrderDetails();
  }, [orderId]);

  return (
    <OrderSuccessLayout>
      <div>
        {/* ... (giữ nguyên phần mobile-menu, breadcrumb, và order success message) */}

        {/* Phần hiển thị sản phẩm với nút đánh giá */}
        <section className="order-details-section pt-4">
          <div className="container-fluid-lg">
            <div className="row">
              <div className="col-12">
                <h3 className="mb-3">Đơn hàng #{orderId} thành công!</h3>
                {orderDetails.length > 0 ? (
                  <div className="product-list">
                    <h4>Sản phẩm trong đơn hàng:</h4>
                    <ul>
                      {orderDetails.map((detail) => (
                        <li key={detail.productID} className="d-flex align-items-center mb-3">
                          <img src={detail.product.imageURL} alt={detail.product.productName} style={{ width: '50px', marginRight: '10px' }} />
                          <div>
                            <h5>{detail.product.productName}</h5>
                            <p>Số lượng: {detail.quantity}</p>
                            <button className="btn btn-primary btn-sm" onClick={() => handleOpenReview(detail.product.productId)}>
                              Đánh giá sản phẩm
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <p>Đang tải chi tiết đơn hàng...</p>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Modal form đánh giá */}
        <Modal show={showReviewModal} onHide={() => setShowReviewModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>{existingReview ? 'Chỉnh sửa đánh giá' : 'Đánh giá sản phẩm'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Rating (1-5 sao)</Form.Label>
                <Form.Control 
                  type="number" 
                  min={1} 
                  max={5} 
                  value={rating} 
                  onChange={(e) => setRating(parseInt(e.target.value))} 
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Comment</Form.Label>
                <Form.Control 
                  as="textarea" 
                  rows={3} 
                  value={comment} 
                  onChange={(e) => setComment(e.target.value)} 
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            {existingReview && (
              <Button variant="danger" onClick={handleDeleteReview}>
                Xóa đánh giá
              </Button>
            )}
            <Button variant="secondary" onClick={() => setShowReviewModal(false)}>
              Đóng
            </Button>
            <Button variant="primary" onClick={handleSubmitReview}>
              Gửi
            </Button>
          </Modal.Footer>
        </Modal>

        <div className="back-to-top">
          {/* ... */}
        </div>
      </div>
      <div className="bg-overlay"></div>
    </OrderSuccessLayout>
  );
};

export default OrderSuccess;
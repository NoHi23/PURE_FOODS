import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const ReviewModal = ({ show, onClose, productId, orderId, customerId }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const handleSubmit = async () => {
    try {
      await axios.post("http://localhost:8082/PureFoods/api/review/create", {
        productId,
        customerId,
        rating,
        comment,
        orderId,
      });
      toast.success("Đánh giá đã được gửi!");
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Lỗi khi gửi đánh giá!");
    }
  };

  if (!show) return null;

  return (
    <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content p-3">
          <div className="modal-header">
            <h5 className="modal-title">Đánh giá sản phẩm</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <div className="mb-3">
              <label className="form-label">Số sao</label>
              <select className="form-select" value={rating} onChange={(e) => setRating(Number(e.target.value))}>
                {[5, 4, 3, 2, 1].map((star) => (
                  <option key={star} value={star}>{star} ⭐</option>
                ))}
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label">Nhận xét</label>
              <textarea
                className="form-control"
                rows="3"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Viết nhận xét..."
              ></textarea>
            </div>
          </div>
          <div className="modal-footer">
            <button onClick={onClose} className="btn btn-secondary">Hủy</button>
            <button onClick={handleSubmit} className="btn btn-primary">Gửi đánh giá</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;

import React, { useState, useEffect } from 'react';
import './SpinWheelPage.css';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FaTimes } from 'react-icons/fa';

const SpinWheelPage = ({ onClose, alreadySpun, onSpinComplete }) => {
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState(null);
  const [wheelItems, setWheelItems] = useState([]);
  const [angle, setAngle] = useState(0);

  const user = JSON.parse(localStorage.getItem('user'));

  const handleSpin = async () => {
    if (spinning) return;
    setSpinning(true);

    try {
      const res = await axios.post(`http://localhost:8082/PureFoods/api/promotion/spin/${user.userId}`);
      const { wheelItems } = res.data;
      setWheelItems(wheelItems || []);

      // Random angle for demonstration
      const randomAngle = 1440 + Math.floor(Math.random() * 360);
      setAngle(randomAngle);

      setTimeout(() => {
        setResult(res.data);
        setSpinning(false);
        onSpinComplete && onSpinComplete();
      }, 3000);
    } catch (err) {
      const status = err?.response?.status || 500;
      const message = err?.response?.data?.message || "Đã xảy ra lỗi";
      setResult({ message, status });
      if (status === 403) toast.warn(message);
      setSpinning(false);
    }
  };

  useEffect(() => {
    if (alreadySpun) {
      toast.success("Chúc mừng bạn đã nhận được mã giảm giá ngày hôm nay!");
    }
  }, [alreadySpun]);

  return (
    <div className="spin-overlay">
      <div className="spin-container">
        <button className="close-icon" onClick={onClose}><FaTimes /></button>

        <div className="wheel-wrapper">
          <div className="pointer"></div>
          <div
            className="wheel"
            style={{ transform: `rotate(${angle}deg)` }}
          >
            
          </div>
        </div>

        {!spinning && !result && (
          <button className="spin-btn" onClick={handleSpin}>🎉 Quay Ngay</button>
        )}

        {result && (
          <div className="result-text">
            <p>{result.message}</p>
            <button className="close-btn" onClick={onClose}>Đóng</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SpinWheelPage;
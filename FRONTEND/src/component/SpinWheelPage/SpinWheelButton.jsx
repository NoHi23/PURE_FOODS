import React, { useState, useEffect } from 'react';
import './SpinWheelButton.css';
import SpinWheelPage from './SpinWheelPage';
import axios from 'axios';
import { toast } from 'react-toastify';

const SpinWheelButton = () => {
  const [showSpin, setShowSpin] = useState(false);
  const [alreadySpun, setAlreadySpun] = useState(false);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const checkSpinStatus = async () => {
      if (user?.userId) {
        try {
          const res = await axios.get(`http://localhost:8082/PureFoods/api/promotion/spin/check/${user.userId}`);
          setAlreadySpun(res.data.alreadySpun);
        } catch (err) {
          console.error("Lỗi kiểm tra trạng thái quay:", err);
        } finally {
          setLoading(false);
        }
      }
    };

    checkSpinStatus();
  }, [user?.userId]);

  if (!user?.userId || loading) return null;

  const handleClick = () => {
    if (alreadySpun) {
      toast.warn("Bạn đã quay vòng hôm nay rồi! Hãy quay lại vào ngày mai.");
    } else {
      setShowSpin(true);
    }
  };

  return (
    <>
      <button className="floating-spin-btn" onClick={handleClick}>
        <i className="fas fa-gift"></i>
      </button>
      {showSpin && (
        <SpinWheelPage
          userId={user.userId}
          alreadySpun={alreadySpun}
          onClose={() => setShowSpin(false)}
          onSpinComplete={() => setAlreadySpun(true)}
        />
      )}
    </>
  );
};

export default SpinWheelButton;
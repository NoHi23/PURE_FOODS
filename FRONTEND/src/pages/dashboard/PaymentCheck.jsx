import React, { useState } from 'react';

const PaymentCheck = () => {
  const [requestId, setRequestId] = useState('');
  const [status, setStatus] = useState('');

  // Fake data for payment status
  const checkPayment = (id) => {
    const fakePayments = { '1': 'PENDING', '2': 'COMPLETED' };
    return fakePayments[id] || 'UNKNOWN';
  };

  const handleCheck = () => {
    const paymentStatus = checkPayment(requestId);
    setStatus(paymentStatus);
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Kiểm Tra Thanh Toán</h2>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">ID Yêu Cầu</label>
        <input
          type="text"
          value={requestId}
          onChange={(e) => setRequestId(e.target.value)}
          className="mt-1 p-2 w-full border rounded-md"
          placeholder="Nhập ID yêu cầu"
        />
      </div>
      <button
        onClick={handleCheck}
        className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
      >
        Kiểm Tra
      </button>
      {status && <p className="mt-4 text-center">Trạng thái: {status}</p>}
    </div>
  );
};

export default PaymentCheck;
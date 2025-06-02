import React, { useState } from 'react';

const RequestPayment = () => {
  const [requestId, setRequestId] = useState('');
  const [message, setMessage] = useState('');

  const handleRequest = () => {
    // Fake logic to request payment
    setMessage(`Yêu cầu thanh toán đã được gửi cho yêu cầu ${requestId}`);
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Yêu Cầu Thanh Toán</h2>
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
        onClick={handleRequest}
        className="w-full bg-yellow-500 text-white p-2 rounded-md hover:bg-yellow-600"
      >
        Gửi Yêu Cầu
      </button>
      {message && <p className="mt-4 text-center">{message}</p>}
    </div>
  );
};

export default RequestPayment;
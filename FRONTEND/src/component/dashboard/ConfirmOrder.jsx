import React, { useState } from 'react';

const ConfirmOrder = () => {
  const [requestId, setRequestId] = useState('');
  const [message, setMessage] = useState('');

  const handleConfirm = () => {
    // Fake logic to confirm order
    setMessage(`Đơn hàng ${requestId} đã được xác nhận!`);
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Xác Nhận Đơn Hàng</h2>
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
        onClick={handleConfirm}
        className="w-full bg-green-500 text-white p-2 rounded-md hover:bg-green-600"
      >
        Xác Nhận
      </button>
      {message && <p className="mt-4 text-center">{message}</p>}
    </div>
  );
};

export default ConfirmOrder;
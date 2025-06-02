import React, { useState } from 'react';

const RejectOrder = () => {
  const [requestId, setRequestId] = useState('');
  const [reason, setReason] = useState('');
  const [message, setMessage] = useState('');

  const handleReject = () => {
    // Fake logic to reject order
    setMessage(`Đơn hàng ${requestId} đã bị từ chối. Lý do: ${reason}`);
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Từ Chối Đơn Hàng</h2>
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
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Lý Do</label>
        <input
          type="text"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="mt-1 p-2 w-full border rounded-md"
          placeholder="Nhập lý do từ chối"
        />
      </div>
      <button
        onClick={handleReject}
        className="w-full bg-red-500 text-white p-2 rounded-md hover:bg-red-600"
      >
        Từ Chối
      </button>
      {message && <p className="mt-4 text-center">{message}</p>}
    </div>
  );
};

export default RejectOrder;
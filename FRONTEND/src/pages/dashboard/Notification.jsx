import React, { useState } from 'react';

const Notification = () => {
  const [requestId, setRequestId] = useState('');
  const [message, setMessage] = useState('');

  const handleNotify = () => {
    // Fake logic to send notification
    setMessage(`Thông báo đã được gửi cho yêu cầu ${requestId}`);
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Gửi Thông Báo Tự Động</h2>
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
        onClick={handleNotify}
        className="w-full bg-purple-500 text-white p-2 rounded-md hover:bg-purple-600"
      >
        Gửi Thông Báo
      </button>
      {message && <p className="mt-4 text-center">{message}</p>}
    </div>
  );
};

export default Notification;
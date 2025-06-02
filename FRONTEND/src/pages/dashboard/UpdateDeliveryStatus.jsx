import React, { useState } from 'react';

const UpdateDeliveryStatus = () => {
  const [requestId, setRequestId] = useState('');
  const [status, setStatus] = useState('IN_PROGRESS');
  const [message, setMessage] = useState('');

  const handleUpdate = () => {
    // Fake logic to update delivery status
    setMessage(`Trạng thái giao hàng cho ${requestId} đã được cập nhật thành ${status}`);
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Cập Nhật Trạng Thái Giao Hàng</h2>
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
        <label className="block text-sm font-medium text-gray-700">Trạng Thái</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="mt-1 p-2 w-full border rounded-md"
        >
          <option value="IN_PROGRESS">Đang Giao</option>
          <option value="SUCCESSFUL">Thành Công</option>
        </select>
      </div>
      <button
        onClick={handleUpdate}
        className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
      >
        Cập Nhật
      </button>
      {message && <p className="mt-4 text-center">{message}</p>}
    </div>
  );
};

export default UpdateDeliveryStatus;
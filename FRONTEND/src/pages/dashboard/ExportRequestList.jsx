import React from 'react';

const ExportRequestList = () => {
  // Fake data
  const exportRequests = [
    { id: 1, customerName: 'Nguyen Van A', productName: 'Laptop', quantity: 2, status: 'PENDING' },
    { id: 2, customerName: 'Tran Thi B', productName: 'Phone', quantity: 1, status: 'CONFIRMED' },
    { id: 3, customerName: 'Le Van C', productName: 'Tablet', quantity: 3, status: 'CANCELED' },
  ];

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Danh Sách Yêu Cầu Xuất Hàng</h2>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border">ID</th>
            <th className="p-2 border">Tên Khách Hàng</th>
            <th className="p-2 border">Sản Phẩm</th>
            <th className="p-2 border">Số Lượng</th>
            <th className="p-2 border">Trạng Thái</th>
          </tr>
        </thead>
        <tbody>
          {exportRequests.map((request) => (
            <tr key={request.id} className="border">
              <td className="p-2">{request.id}</td>
              <td className="p-2">{request.customerName}</td>
              <td className="p-2">{request.productName}</td>
              <td className="p-2">{request.quantity}</td>
              <td className="p-2">{request.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ExportRequestList;
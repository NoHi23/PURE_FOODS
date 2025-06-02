import React, { useState } from 'react';

const ExportRequestForm = () => {
  const [formData, setFormData] = useState({
    customerName: '',
    productName: '',
    quantity: '',
    address: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Submitted:', formData);
    // Fake data submission logic
    alert(`Yêu cầu xuất hàng đã được tạo: ${JSON.stringify(formData)}`);
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Tạo Yêu Cầu Xuất Hàng</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Tên Khách Hàng</label>
          <input
            type="text"
            name="customerName"
            value={formData.customerName}
            onChange={handleChange}
            className="mt-1 p-2 w-full border rounded-md"
            placeholder="Nhập tên khách hàng"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Tên Sản Phẩm</label>
          <input
            type="text"
            name="productName"
            value={formData.productName}
            onChange={handleChange}
            className="mt-1 p-2 w-full border rounded-md"
            placeholder="Nhập tên sản phẩm"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Số Lượng</label>
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            className="mt-1 p-2 w-full border rounded-md"
            placeholder="Nhập số lượng"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Địa Chỉ Giao</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="mt-1 p-2 w-full border rounded-md"
            placeholder="Nhập địa chỉ"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
        >
          Tạo Yêu Cầu
        </button>
      </form>
    </div>
  );
};

export default ExportRequestForm;
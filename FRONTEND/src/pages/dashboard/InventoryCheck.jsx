import React, { useState } from 'react';

const InventoryCheck = () => {
  const [product, setProduct] = useState('');
  const [quantity, setQuantity] = useState(null);

  // Fake data for inventory
  const checkInventory = (productName) => {
    const fakeInventory = {
      Laptop: 10,
      Phone: 5,
      Tablet: 0,
    };
    return fakeInventory[productName] || 0;
  };

  const handleCheck = () => {
    const availableQuantity = checkInventory(product);
    setQuantity(availableQuantity);
    alert(`Số lượng tồn kho cho ${product}: ${availableQuantity}`);
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Kiểm Tra Tồn Kho</h2>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Tên Sản Phẩm</label>
        <input
          type="text"
          value={product}
          onChange={(e) => setProduct(e.target.value)}
          className="mt-1 p-2 w-full border rounded-md"
          placeholder="Nhập tên sản phẩm"
        />
      </div>
      <button
        onClick={handleCheck}
        className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
      >
        Kiểm Tra
      </button>
      {quantity !== null && (
        <p className="mt-4 text-center">Số lượng tồn kho: {quantity}</p>
      )}
    </div>
  );
};

export default InventoryCheck;
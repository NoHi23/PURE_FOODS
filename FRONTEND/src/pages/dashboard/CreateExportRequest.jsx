import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const CreateExportRequest = () => {
  const [form, setForm] = useState({
    userId: "",
    totalAmount: "",
    shippingAddress: "",
    shippingMethodId: "",
    shippingCost: "",
    distance: "",
    discountAmount: "",
    productId: "",
    quantity: "",
    unitPrice: "",
  });
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg("");
    setErrorMsg("");
    try {
      const payload = {
        order: {
          customer: { userId: Number(form.userId) },
          totalAmount: Number(form.totalAmount),
          shippingAddress: form.shippingAddress,
          shippingMethod: { shippingMethodId: Number(form.shippingMethodId) },
          shippingCost: Number(form.shippingCost),
          distance: Number(form.distance),
          discountAmount: Number(form.discountAmount),
        },
        orderDetails: [
          {
            product: { productId: Number(form.productId) },
            quantity: Number(form.quantity),
            unitPrice: Number(form.unitPrice),
          },
        ],
      };
      await axios.post(
        "http://localhost:9999/PureFoods_war/api/export-requests",
        payload
      );
      setSuccessMsg("Tạo yêu cầu xuất kho thành công!");
      setForm({
        userId: "",
        totalAmount: "",
        shippingAddress: "",
        shippingMethodId: "",
        shippingCost: "",
        distance: "",
        discountAmount: "",
        productId: "",
        quantity: "",
        unitPrice: "",
      });
    } catch (err) {
      setErrorMsg("Có lỗi xảy ra khi tạo yêu cầu xuất kho.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-xl mx-auto bg-white rounded-lg shadow p-8">
       <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Tạo Yêu Cầu Xuất Kho</h2>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
          >
            Quay lại
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-medium">Mã khách hàng (userId)</label>
            <input
              type="number"
              name="userId"
              value={form.userId}
              onChange={handleChange}
              className="w-full border rounded p-2"
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Tổng tiền</label>
            <input
              type="number"
              name="totalAmount"
              value={form.totalAmount}
              onChange={handleChange}
              className="w-full border rounded p-2"
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Địa chỉ giao hàng</label>
            <input
              type="text"
              name="shippingAddress"
              value={form.shippingAddress}
              onChange={handleChange}
              className="w-full border rounded p-2"
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Phương thức giao hàng (ID)</label>
            <input
              type="number"
              name="shippingMethodId"
              value={form.shippingMethodId}
              onChange={handleChange}
              className="w-full border rounded p-2"
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Phí giao hàng</label>
            <input
              type="number"
              name="shippingCost"
              value={form.shippingCost}
              onChange={handleChange}
              className="w-full border rounded p-2"
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Khoảng cách (km)</label>
            <input
              type="number"
              name="distance"
              value={form.distance}
              onChange={handleChange}
              className="w-full border rounded p-2"
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Chiết khấu</label>
            <input
              type="number"
              name="discountAmount"
              value={form.discountAmount}
              onChange={handleChange}
              className="w-full border rounded p-2"
              required
            />
          </div>
          <div className="border-t pt-4">
            <label className="block mb-1 font-medium">Sản phẩm (productId)</label>
            <input
              type="number"
              name="productId"
              value={form.productId}
              onChange={handleChange}
              className="w-full border rounded p-2"
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Số lượng</label>
            <input
              type="number"
              name="quantity"
              value={form.quantity}
              onChange={handleChange}
              className="w-full border rounded p-2"
              required
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Đơn giá</label>
            <input
              type="number"
              name="unitPrice"
              value={form.unitPrice}
              onChange={handleChange}
              className="w-full border rounded p-2"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Đang gửi..." : "Tạo Yêu Cầu"}
          </button>
        </form>
        {successMsg && <div className="mt-4 text-green-600">{successMsg}</div>}
        {errorMsg && <div className="mt-4 text-red-600">{errorMsg}</div>}
      </div>
    </div>
  );
};

export default CreateExportRequest;
import React, { useState, useEffect } from "react";
import { FiSearch, FiTruck, FiUserCheck, FiRefreshCw, FiCheckCircle, FiBell } from "react-icons/fi";
import axios from "axios";
import { toast } from "react-toastify";
const DeliveryManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDriverModal, setShowDriverModal] = useState(false);
  const [drivers, setDrivers] = useState([]);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [selectedDriverId, setSelectedDriverId] = useState(null);
  const [showPrepareModal, setShowPrepareModal] = useState(false);
  const [prepareOrderId, setPrepareOrderId] = useState(null);
  const [prepareDate, setPrepareDate] = useState("");
  const [showDelayModal, setShowDelayModal] = useState(false);
const [delayReason, setDelayReason] = useState("");
const [confirmOrderId, setConfirmOrderId] = useState(null);
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get("http://localhost:9999/PureFoods_war/api/export-requests");
         setOrders(res.data.filter(order =>
        ["preparing", "readytoship", "shipped", "delivered"].includes(order.status.trim())
      ));
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const extractOrderId = (id) => {
    if (typeof id === "string" && id.startsWith("ORD")) {
      return parseInt(id.replace("ORD", ""), 10);
    }
    return id;
  };

  const handlePrepare = async (orderId) => {
    try {
      const realId = extractOrderId(orderId);
      await axios.put(`http://localhost:9999/PureFoods_war/api/deliveries/prepare/${realId}`);
      toast.success("Đã chuẩn bị giao hàng thành công!");
      setOrders(orders.filter(order => order.id !== realId)); // Cập nhật danh sách đơn hàng
    }
    catch (error) {
      console.error("Error preparing delivery:", error);
      toast.error("Lỗi khi chuẩn bị giao hàng!");
    }
  };

  const handleAssignDriver = async (orderId) => {
    try {
      const realId = extractOrderId(orderId);
      // Ví dụ: driverId lấy tạm là 1, bạn có thể thay bằng UI chọn tài xế
      await axios.put(`http://localhost:9999/PureFoods_war/api/deliveries/assign-driver/${realId}?driverId=1`);
      toast.success("Tài xế đã được gán thành công!");
      setOrders(orders.filter(order => order.id !== realId)); // Cập nhật danh sách đơn hàng
    }
    catch (error) {
      console.error("Error assigning driver:", error);
      toast.error("Lỗi khi gán tài xế!");
    }
  };

  const handleUpdateStatus = async (orderId) => {
    try {
      const realId = extractOrderId(orderId);
      await axios.put(`http://localhost:9999/PureFoods_war/api/deliveries/update-status/${realId}?status=Delivered`);
      toast.success("Trạng thái giao hàng đã được cập nhật!");
      setOrders(orders.filter(order => order.id !== realId)); // Cập nhật danh sách đơn hàng
    }
    catch (error) {
      console.error("Error updating delivery status:", error);
      toast.error("Lỗi khi cập nhật trạng thái giao hàng!");
    }
  };

  const handleConfirm = async (orderId) => {
  const order = orders.find(o => o.id === orderId);
  if (!order) {
    toast.error("Không tìm thấy đơn hàng!");
    return;
  }
  const orderDate = new Date(order?.estimatedDeliveryDate);
  const now = new Date();
  if (now > orderDate) {
    setConfirmOrderId(orderId);
    setDelayReason("");
    setShowDelayModal(true);
    return;
  }
  if (!window.confirm("Bạn có chắc chắn muốn xác nhận giao hàng này?")) {
    return;
  }
  try {
    const realId = extractOrderId(orderId);
    await axios.put(`http://localhost:9999/PureFoods_war/api/deliveries/confirm/${realId}`);
    toast.success("Đơn hàng đã được xác nhận giao hàng!");
    setOrders(orders.filter(order => order.id !== realId));
  } catch (error) {
    toast.error("Lỗi khi xác nhận giao hàng!");
  }
};

const handleDelayConfirm = async () => {
  if (!delayReason.trim()) {
    toast.error("Vui lòng nhập lý do delay!");
    return;
  }
  try {
    const realId = extractOrderId(confirmOrderId);
    await axios.put(
      `http://localhost:9999/PureFoods_war/api/deliveries/confirm/${realId}`,
      { delayReason }
    );
    toast.success("Đơn hàng đã được xác nhận giao hàng!");
    setOrders(orders.filter(order => order.id !== realId));
    setShowDelayModal(false);
    setDelayReason("");
    setConfirmOrderId(null);
  } catch (error) {
    toast.error("Lỗi khi xác nhận giao hàng!");
  }
};

  const handleNotify = async (orderId) => {
    const realId = extractOrderId(orderId);
    await axios.post(`http://localhost:9999/PureFoods_war/api/deliveries/notify/${realId}`);
    alert("Đã gửi thông báo giao hàng!");
  };
  const openDriverModal = async (orderId) => {
    setSelectedOrderId(orderId);
    setShowDriverModal(true);
    try {
      const res = await axios.get("http://localhost:9999/PureFoods_war/api/drivers");
      setDrivers(res.data.filter(d => d.status === 1));
    } catch (err) {
      toast.error("Không thể tải danh sách tài xế");
    }
  };

  const handleAssignDriverModal = async () => {
    if (!selectedDriverId) {
      toast.error("Vui lòng chọn tài xế!");
      return;
    }
    try {
      const realId = extractOrderId(selectedOrderId);
      await axios.put(`http://localhost:9999/PureFoods_war/api/deliveries/assign-driver/${realId}?driverId=${selectedDriverId}`);
      toast.success("Tài xế đã được gán thành công!");
      setOrders(orders.filter(order => order.id !== realId));
      setShowDriverModal(false);
      setSelectedDriverId(null);
    } catch (err) {
      toast.error("Lỗi khi gán tài xế!");
    }
  };
  const openPrepareModal = (orderId) => {
    setPrepareOrderId(orderId);
    setPrepareDate("");
    setShowPrepareModal(true);
  };

  // Hàm chuẩn bị giao hàng với estimatedDeliveryDate
  const handlePrepareWithDate = async () => {
    if (!prepareDate) {
      toast.error("Vui lòng chọn thời gian giao dự kiến!");
      return;
    }
    try {
      const realId = extractOrderId(prepareOrderId);
      await axios.put(
        `http://localhost:9999/PureFoods_war/api/deliveries/prepare/${realId}`,
        { estimatedDeliveryDate: prepareDate }
      );
      toast.success("Đã chuẩn bị giao hàng thành công!");
      setOrders(orders.filter(order => order.id !== realId));
      setShowPrepareModal(false);
      setPrepareOrderId(null);
      setPrepareDate("");
    } catch (error) {
      toast.error("Lỗi khi chuẩn bị giao hàng!");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-8">Delivery Management</h1>
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estimated Delivery Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">{order.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{order.customerName}</td>
                    <td className="px-6 py-4 whitespace-nowrap">${order.amount.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{order.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {order.estimatedDeliveryDate ? new Date(order.estimatedDeliveryDate).toLocaleString() : "Chưa có"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-2">
                        <button
                          title="Chuẩn bị giao hàng"
                          onClick={() => openPrepareModal(order.id)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <FiTruck className="w-5 h-5" />
                        </button>
                        <button title="Gán tài xế" onClick={() => openDriverModal(order.id)} className="text-green-600 hover:text-green-800">
                          <FiUserCheck className="w-5 h-5" />
                        </button>
                        <button title="Cập nhật trạng thái" onClick={() => handleUpdateStatus(order.id)} className="text-yellow-600 hover:text-yellow-800">
                          <FiRefreshCw className="w-5 h-5" />
                        </button>
                        <button title="Xác nhận giao hàng" onClick={() => handleConfirm(order.id)} className="text-purple-600 hover:text-purple-800">
                          <FiCheckCircle className="w-5 h-5" />
                        </button>
                        <button title="Gửi thông báo" onClick={() => handleNotify(order.id)} className="text-pink-600 hover:text-pink-800">
                          <FiBell className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {showDriverModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Chọn tài xế</h3>
            <select
              className="w-full border rounded p-2 mb-4"
              value={selectedDriverId || ""}
              onChange={e => setSelectedDriverId(e.target.value)}
            >
              <option value="">-- Chọn tài xế --</option>
              {drivers.map(driver => (
                <option key={driver.driverId} value={driver.driverId}>
                  {driver.driverName} - {driver.vehicleInfo}
                </option>
              ))}
            </select>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowDriverModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Hủy
              </button>
              <button
                onClick={handleAssignDriverModal}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
      {showPrepareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Nhập thời gian giao dự kiến</h3>
            <input
              type="datetime-local"
              className="w-full border rounded p-2 mb-4"
              value={prepareDate}
              onChange={e => setPrepareDate(e.target.value)}
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowPrepareModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Hủy
              </button>
              <button
                onClick={handlePrepareWithDate}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
      {showDelayModal && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg p-6 w-full max-w-md">
      <h3 className="text-lg font-semibold mb-4">Nhập lý do delay giao hàng</h3>
      <textarea
        className="w-full border rounded p-2 mb-4"
        rows={3}
        value={delayReason}
        onChange={e => setDelayReason(e.target.value)}
        placeholder="Nhập lý do delay..."
      />
      <div className="flex justify-end space-x-2">
        <button
          onClick={() => setShowDelayModal(false)}
          className="px-4 py-2 text-gray-600 hover:text-gray-800"
        >
          Hủy
        </button>
        <button
          onClick={handleDelayConfirm}
          className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
        >
          Xác nhận
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
};

export default DeliveryManagement;
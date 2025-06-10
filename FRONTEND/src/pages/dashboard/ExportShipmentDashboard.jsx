import React, { useState, useEffect } from "react";
import { FiSearch, FiX, FiCheck, FiEye, FiTruck, FiPackage } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const ExportShipmentDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [orderStatuses, setOrderStatuses] = useState([]);
  const navigate = useNavigate();
  const mockOrders = [
    {
      id: "ORD001",
      customerName: "John Smith",
      amount: 1299.99,
      date: "2024-01-15",
      status: "pending",
      customerDetails: {
        email: "john@example.com",
        phone: "+1 234 567 8900",
        address: "123 Shipping Lane, Export City, 12345"
      },
      shipping: {
        method: "Express",
        estimatedDelivery: "2024-01-20",
        cost: 45.99,
        distance: "234 km"
      },
      driver: {
        name: "Mike Johnson",
        contact: "+1 234 567 8901",
        vehicle: "Truck XL-123"
      }
    },
    {
      id: "ORD002",
      customerName: "Sarah Wilson",
      amount: 2499.99,
      date: "2024-01-14",
      status: "processing",
      customerDetails: {
        email: "sarah@example.com",
        phone: "+1 234 567 8902",
        address: "456 Export Avenue, Ship City, 67890"
      },
      shipping: {
        method: "Standard",
        estimatedDelivery: "2024-01-22",
        cost: 35.99,
        distance: "156 km"
      },
      driver: {
        name: "David Brown",
        contact: "+1 234 567 8903",
        vehicle: "Van XL-456"
      }
    }
  ];

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get('http://localhost:9999/PureFoods_war/api/export-requests');
        setOrders(res.data); // Không cần map lại nữa
        setLoading(false);
      } catch (error) {
        console.error("Error fetching orders:", error);
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);
  useEffect(() => {
    const fetchStatuses = async () => {
      try {
        const res = await axios.get('http://localhost:9999/PureFoods_war/api/order-statuses');
        setOrderStatuses(res.data);
      } catch (error) {
        console.error("Error fetching statuses:", error);
      }
    };
    fetchStatuses();
  }, []);
  const getStatusName = (status) => {
    if (!orderStatuses.length) return status;
    // Chuyển status về dạng viết hoa chữ cái đầu để so sánh
    const normalized = status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
    const found = orderStatuses.find(s => s.statusName.toLowerCase() === normalized.toLowerCase());
    return found ? found.statusName : status;
  };
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "shipped":
        return "bg-purple-100 text-purple-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  const filteredOrders = orders.filter(
    (order) => activeFilter === "all" || order.status === activeFilter
  );

  const handleOrderClick = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };
  const extractOrderId = (id) => {
    if (typeof id === "string" && id.startsWith("ORD")) {
      return parseInt(id.replace("ORD", ""), 10);
    }
    return id;
  };
  const handleCancelOrder = async (orderId) => {
    const realId = extractOrderId(orderId);
    try {
      await axios.put(
        `http://localhost:9999/PureFoods_war/api/export-requests/${realId}/cancel`,
        {},
        { params: { cancelReason } }
      );
      setOrders(
        orders.map((order) =>
          order.id === orderId ? { ...order, status: "cancelled" } : order
        )
      );
      setShowCancelModal(false);
      setCancelReason("");
    } catch (error) {
      alert("Hủy yêu cầu thất bại!");
    }
  };


  const handleMarkReceived = async (orderId) => {
    const realId = extractOrderId(orderId);
    try {
      await axios.post(
        "http://localhost:9999/PureFoods_war/api/export-requests/receive",
        { orderId: realId }
      );
      setOrders(
        orders.map((order) =>
          order.id === orderId ? { ...order, status: "processing" } : order
        )
      );
    } catch (error) {
      alert("Nhận yêu cầu thất bại!");
    }
  };
  const StatusBadge = ({ status }) => {
    const statusColors = {
      pending: "bg-yellow-100 text-yellow-800",
      processing: "bg-blue-100 text-blue-800",
      completed: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800"
    };

    return (
      <span
        className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[status]}`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Export Shipment Management</h1>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search orders..."
                className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <FiSearch className="absolute left-3 top-3 text-gray-400" />
            </div>
            <button
              onClick={() => navigate("/create-request")}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Tạo mới
            </button>
          </div>
        </div>

        <div className="flex space-x-4 mb-6">
          {["all", "pending", "processing", "completed", "cancelled"].map(
            (filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-2 rounded-lg ${activeFilter === filter
                    ? "bg-blue-500 text-white"
                    : "bg-white text-gray-600 hover:bg-gray-50"
                  }`}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </button>
            )
          )}
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">{order.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {order.customerName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      ${order.amount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{order.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                        {getStatusName(order.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleOrderClick(order)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <FiEye className="w-5 h-5" />
                        </button>
                        {order.status === "pending" && (
                          <button
                            onClick={() => {
                              setSelectedOrder(order);
                              setShowCancelModal(true);
                            }}
                            className="text-red-600 hover:text-red-800"
                          >
                            <FiX className="w-5 h-5" />
                          </button>
                        )}
                        {order.status === "pending" && (
                          <button
                            onClick={() => handleMarkReceived(order.id)}
                            className="text-green-600 hover:text-green-800"
                          >
                            <FiCheck className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Order Details Modal */}
        {showModal && selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold">Order Details</h2>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <FiX className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-semibold mb-2">Customer Details</h3>
                      <p>{selectedOrder.customerDetails.email}</p>
                      <p>{selectedOrder.customerDetails.phone}</p>
                      <p>{selectedOrder.customerDetails.address}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">Order Information</h3>
                      <p>Order ID: {selectedOrder.id}</p>
                      <p>Amount: ${selectedOrder.amount.toFixed(2)}</p>
                      <p>Date: {selectedOrder.date}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Shipping Details</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p>Method: {selectedOrder.shipping.method}</p>
                        <p>Cost: ${selectedOrder.shipping.cost}</p>
                      </div>
                      <div>
                        <p>Estimated Delivery: {selectedOrder.shipping.estimatedDelivery}</p>
                        <p>Distance: {selectedOrder.shipping.distance}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Driver Information</h3>
                    <p>Name: {
                    selectedOrder.driver.name ? selectedOrder.driver.name : "N/A"
                      }</p>
                    <p>Contact: {selectedOrder.driver.contact
                      ? selectedOrder.driver.contact : "N/A"
                      }</p>
                    <p>Vehicle: {selectedOrder.driver.vehicle
                      ? selectedOrder.driver.vehicle : "N/A"
                      }</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Cancel Order Modal */}
        {showCancelModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <h3 className="text-lg font-semibold mb-4">Cancel Order</h3>
              <select
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full p-2 border rounded mb-4"
              >
                <option value="">Select a reason</option>
                <option value="customer_request">Customer Request</option>
                <option value="delivery_issues">Delivery Issues</option>
                <option value="stock_unavailable">Stock Unavailable</option>
                <option value="other">Other</option>
              </select>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setShowCancelModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleCancelOrder(selectedOrder.id)}
                  disabled={!cancelReason}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
                >
                  Confirm Cancellation
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExportShipmentDashboard;

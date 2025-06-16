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
        const apiOrders = res.data.map((item) => ({
          id: `ORD${item.orderId.toString().padStart(3, '0')}`,
          customerName: item.customer.fullName,
          amount: item.totalAmount,
          date: new Date(item.orderDate).toISOString().slice(0, 10),
          status: item.status.statusName.toLowerCase(),
          customerDetails: {
            email: item.customer.email,
            phone: item.customer.phone,
            address: item.customer.address,
          },
          shipping: {
            method: item.shippingMethod.methodName,
            estimatedDelivery: new Date(item.estimatedDeliveryDate).toISOString().slice(0, 10),
            cost: item.shippingCost,
            distance: `${item.distance} km`,
          },
          driver: {
            name: item.driver.driverName,
            contact: item.driver.phone,
            vehicle: item.driver.vehicleInfo,
          }
        }));
        setOrders(apiOrders);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching orders:", error);
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const filteredOrders = orders.filter(
    (order) => activeFilter === "all" || order.status === activeFilter
  );

  const handleOrderClick = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const handleCancelOrder = (orderId) => {
    setOrders(
      orders.map((order) =>
        order.id === orderId ? { ...order, status: "cancelled" } : order
      )
    );
    setShowCancelModal(false);
    setCancelReason("");
  };

  const handleMarkReceived = (orderId) => {
    setOrders(
      orders.map((order) =>
        order.id === orderId ? { ...order, status: "completed" } : order
      )
    );
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

 };

export default ExportShipmentDashboard;

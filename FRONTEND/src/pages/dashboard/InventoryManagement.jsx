import React, { useState, useEffect, useMemo } from "react";
import { FiEdit2, FiTrash2, FiAlertCircle, FiCheckCircle, FiXCircle } from "react-icons/fi";
import { toast } from "react-toastify";
import axios from "axios";
const InventoryManagement = () => {
  const [inventory, setInventory] = useState([
    // {
    //   id: "P001",
    //   name: "Laptop Pro X1",
    //   quantity: 15,
    //   threshold: 10,
    //   status: "Active",
    //   price: 1299.99,
    //   supplier: "TechCorp Inc.",
    //   lastUpdated: "2024-01-20"
    // },
    // {
    //   id: "P002",
    //   name: "Wireless Mouse M3",
    //   quantity: 5,
    //   threshold: 20,
    //   status: "Low Stock",
    //   price: 49.99,
    //   supplier: "Peripherals Plus",
    //   lastUpdated: "2024-01-19"
    // },
    // {
    //   id: "P003",
    //   name: "4K Monitor 32\"",
    //   quantity: 0,
    //   threshold: 5,
    //   status: "Out of Stock",
    //   price: 599.99,
    //   supplier: "DisplayTech",
    //   lastUpdated: "2024-01-18"
    // }
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [updateQuantity, setUpdateQuantity] = useState(0);
  const [showNotifyModal, setShowNotifyModal] = useState(false);
const [notifyProductId, setNotifyProductId] = useState(null);
const [notifyMessage, setNotifyMessage] = useState("Hàng cần nhập");
  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const res = await axios.get("http://localhost:9999/PureFoods_war/api/inventory/products/export-request");
        // Flatten data: mỗi sản phẩm là một dòng, kèm orderId và customerName
        const mapped = res.data.flatMap(order =>
          order.products.map(product => ({
            id: `P${product.productId.toString().padStart(3, "0")}`,
            name: product.productName,
            quantity: product.quantity,
            stockQuantity: product.stockQuantity,
            threshold: product.warningThreshold,
            status:
              product.stockQuantity === 0
                ? "Out of Stock"
                : product.stockQuantity <= product.warningThreshold
                  ? "Low Stock"
                  : "Active",
            orderId: order.orderId,
            customerName: order.customerName,
            price: 0,
            supplier: "",
            lastUpdated: "",
            orderDetailStatus: product.orderDetailStatus
          }))
        );
        setInventory(mapped);
      } catch (err) {
        toast.error("Không thể tải dữ liệu tồn kho");
      }
    };
    fetchInventory();
  }, []);
  const filteredInventory = useMemo(() => {
    return inventory.filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [inventory, searchTerm]);

  const handleQuantityUpdate = async (product, newQuantity) => {
    console.log("Updating quantity for product:", product.id, "to", newQuantity);
  if (newQuantity < 0) {
    toast.error("Quantity cannot be negative");
    return;
  }
  try {
    // Gọi API cập nhật tồn kho
    await axios.put(
      `http://localhost:9999/PureFoods_war/api/inventory/update-stock/${product.id.replace("P00", "")}`,
      {},
      { params: { quantity: newQuantity } }
    );
    toast.success("Cập nhật tồn kho thành công!");

    // Sau khi cập nhật, lấy lại danh sách tồn kho mới nhất
    const res = await axios.get("http://localhost:9999/PureFoods_war/api/inventory/products/export-request");
    const mapped = res.data.flatMap(order =>
      order.products.map(item => ({
        id: `P${item.productId.toString().padStart(3, "0")}`,
        name: item.productName,
        quantity: item.quantity,
        stockQuantity: item.stockQuantity,
        threshold: item.warningThreshold,
        status:
          item.stockQuantity === 0
            ? "Out of Stock"
            : item.stockQuantity <= item.warningThreshold
              ? "Low Stock"
              : "Active",
        orderId: order.orderId,
        customerName: order.customerName,
        price: 0,
        supplier: "",
        lastUpdated: "",
        orderDetailStatus: item.orderDetailStatus
      }))
    );
  } catch (err) {
    toast.error("Cập nhật tồn kho thất bại!");
  }
};
// Xác nhận đơn hàng và cập nhật tồn kho
const confirmOrder = async (product) => {
  console.log("product:", product);
  console.log("Confirming order for product:", product.id, "with quantity", product.quantity);
  try {
    // Gọi API cập nhật tồn kho với quantity của đơn hàng
    await axios.put(
      `http://localhost:9999/PureFoods_war/api/inventory/update-stock/${product.id.replace("P00", "")}`,
      {},
      { params: { quantity: product.quantity } }
    );
    toast.success("Cập nhật tồn kho thành công!");

    // Gọi API xác nhận đơn hàng
    await axios.put(`http://localhost:9999/PureFoods_war/api/inventory/confirm-order/${product.orderId}`);
    toast.success("Xác nhận đơn hàng thành công!");

    // Fetch lại dữ liệu tồn kho
    const res = await axios.get("http://localhost:9999/PureFoods_war/api/inventory/products/export-request");
    const mapped = res.data.flatMap(order =>
      order.products.map(item => ({
        id: `P${item.productId.toString().padStart(3, "0")}`,
        name: item.productName,
        quantity: item.quantity,
        stockQuantity: item.stockQuantity,
        threshold: item.warningThreshold,
        status:
          item.stockQuantity === 0
            ? "Out of Stock"
            : item.stockQuantity <= item.warningThreshold
              ? "Low Stock"
              : "Active",
        orderId: order.orderId,
        customerName: order.customerName,
        price: 0,
        supplier: "",
        lastUpdated: "",
        orderDetailStatus: item.orderDetailStatus
      }))
    );
    setInventory(mapped);
  } catch (err) {
    toast.error("Xác nhận đơn hàng hoặc cập nhật tồn kho thất bại!");
  }
};

    // Từ chối đơn hàng
    const rejectOrder = async (orderId, reason) => {
      try {
        await axios.put(`http://localhost:9999/PureFoods_war/api/inventory/reject-order/${orderId}`, {}, {
          params: { reason }
        });
        toast.success("Từ chối đơn hàng thành công!");
      } catch (err) {
        toast.error("Từ chối đơn hàng thất bại!");
      }
    };

    // // Cập nhật tồn kho
    // const updateStock = async (productId, quantity) => {
    //   try {
    //     await axios.put(`http://localhost:9999/PureFoods_war/api/inventory/update-stock/${productId}`, {}, {
    //       params: { quantity }
    //     });
    //     toast.success("Cập nhật tồn kho thành công!");
    //   } catch (err) {
    //     toast.error("Cập nhật tồn kho thất bại!");
    //   }
    // };

    // Thông báo hết hàng
    const notifyOutOfStock = async (productId) => {
      try {
        await axios.post(`http://localhost:9999/PureFoods_war/api/inventory/notify-out-of-stock/${productId}`);
        toast.success("Đã gửi thông báo hết hàng!");
      } catch (err) {
        toast.error("Gửi thông báo thất bại!");
      }
    };

    // // Thông báo yêu cầu nhập hàng cho importer
 const notifyImportRequest = async (orderId, message = "Hàng cần nhập", status = "Sent") => {
  try {
    await axios.post(
      "http://localhost:9999/PureFoods_war/api/notifications/import-request",
      null,
      {
        params: { message, orderId, status }
      }
    );
    toast.success("Đã gửi thông báo nhập hàng!");
  } catch (err) {
    toast.error("Gửi thông báo nhập hàng thất bại!");
  }
};
   const handleOpenNotifyModal = (productId) => {
  setNotifyProductId(productId);
  setNotifyMessage("Hàng cần nhập");
  setShowNotifyModal(true);
};
    const handleConfirmNotify = async () => {
  try {
    await axios.post(
      "http://localhost:9999/PureFoods_war/api/notifications/import-request",
      null,
      {
        params: {
          message: notifyMessage,
          orderId: notifyProductId,
          status: "Sent"
        }
      }
    );
    toast.success("Đã gửi thông báo nhập hàng!");
    setShowNotifyModal(false);
  } catch (err) {
    toast.error("Gửi thông báo nhập hàng thất bại!");
  }
};
  const DetailModal = ({ product }) => {
    if (!product) return null;

    const getStatusColor = (status) => {
      switch (status) {
        case "Active":
          return "text-green-600";
        case "Low Stock":
          return "text-yellow-600";
        case "Out of Stock":
          return "text-red-600";
        default:
          return "text-gray-600";
      }
    };
 
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">{product.name}</h2>
            <button
              onClick={() => setIsModalOpen(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              <FiXCircle size={24} />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-gray-600">Product ID</p>
              <p className="font-semibold">{product.id}</p>
            </div>
            <div>
              <p className="text-gray-600">Current Stock</p>
              <p className="font-semibold">{product.stockQuantity}</p>
            </div>
            <div>
              <p className="text-gray-600">Warning Threshold</p>
              <p className="font-semibold">{product.threshold}</p>
            </div>
            <div>
              <p className="text-gray-600">Status</p>
              <p className={`font-semibold ${getStatusColor(product.status)}`}>
                {product.status}
              </p>
            </div>
            <div>
              <p className="text-gray-600">Price</p>
              <p className="font-semibold">${product.price}</p>
            </div>
            <div>
              <p className="text-gray-600">Supplier</p>
              <p className="font-semibold">{product.supplier}</p>
            </div>
          </div>

          <div className="border-t pt-4">
            <h3 className="text-lg font-semibold mb-3">Update Stock</h3>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setUpdateQuantity(Math.max(0, updateQuantity - 1))}
                className="bg-gray-200 p-2 rounded hover:bg-gray-300"
              >
                -
              </button>
              <input
                type="number"
                value={updateQuantity}
                onChange={(e) => setUpdateQuantity(Math.max(0, parseInt(e.target.value) || 0))}
                className="border rounded p-2 w-20 text-center"
              />
              <button
                onClick={() => setUpdateQuantity(updateQuantity + 1)}
                className="bg-gray-200 p-2 rounded hover:bg-gray-300"
              >
                +
              </button>
              <button
                onClick={() => {
                  handleQuantityUpdate(product, updateQuantity);
                  setIsModalOpen(false);
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Inventory Management System</h1>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search products..."
          className="w-full md:w-1/3 p-2 border rounded"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-100">
               <th className="px-4 py-2 text-left">Order ID</th>
                             <th className="px-4 py-2 text-left">Customer</th>
              <th className="px-4 py-2 text-left">Product ID</th>
              <th className="px-4 py-2 text-left">Product Name</th>
              <th className="px-4 py-2 text-left">Quantity</th>
              <th className="px-4 py-2 text-left">Threshold</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredInventory.map((product) => (
              <tr
                key={`${product.orderId}-${product.id}`}
                className={`border-b ${product.stockQuantity <= product.threshold ? "bg-red-50" : "bg-green-50"} hover:bg-opacity-75 transition-colors duration-200`}
              >
                <td className="px-4 py-2">{product.orderId}</td>
                <td className="px-4 py-2">{product.customerName}</td>
                <td className="px-4 py-2">{product.id}</td>
                <td className="px-4 py-2">{product.name}</td>
                <td className="px-4 py-2">{product.stockQuantity}</td>
                <td className="px-4 py-2">{product.threshold}</td>
                <td className="px-4 py-2">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${product.stockQuantity === 0 ? "bg-red-100 text-red-800" : product.stockQuantity <= product.threshold ? "bg-yellow-100 text-yellow-800" : "bg-green-100 text-green-800"}`}
                  >
                    {product.status}
                  </span>
                </td>
                <td className="px-4 py-2">
                  {/* Edit/Update luôn hiển thị */}
                  {/* <button
                    onClick={() => {
                      setSelectedProduct(product);
                      setUpdateQuantity(product.quantity);
                      setIsModalOpen(true);
                    }}
                    className="text-blue-600 hover:text-blue-800 mr-2"
                    title="Cập nhật tồn kho"
                  >
                    <FiEdit2 size={18} />
                  </button> */}
                  {/* Nếu trạng thái là Active, hiện nút xác nhận đơn hàng */}
                  {product.status === "Active" && (
                    <button
                      onClick={() => confirmOrder(product)}
                      className="text-green-600 hover:text-green-800 mr-2"
                      title="Xác nhận đơn hàng"
                    >
                      <FiCheckCircle size={18} />
                    </button>
                  )}
                  {/* Nếu trạng thái là Out of Stock, hiện nút từ chối và thông báo hết hàng */}
                  {product.status === "Out of Stock" && (
                    <>
                      <button
                        onClick={() => rejectOrder((product.orderId), "Out of stock")}
                        className="text-red-600 hover:text-red-800 mr-2"
                        title="Từ chối đơn hàng"
                      >
                        <FiXCircle size={18} />
                      </button>
                      <button
                        onClick={() => handleOpenNotifyModal(product.orderId)}
                        className="text-yellow-600 hover:text-yellow-800"
                        title="Thông báo hết hàng"
                      >
                        <FiAlertCircle size={18} />
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && <DetailModal product={selectedProduct} />}
      {showNotifyModal && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg p-6 w-full max-w-md">
      <h3 className="text-lg font-semibold mb-4">Nhập nội dung thông báo nhập hàng</h3>
      <textarea
        className="w-full border rounded p-2 mb-4"
        rows={3}
        value={notifyMessage}
        onChange={(e) => setNotifyMessage(e.target.value)}
      />
      <div className="flex justify-end space-x-2">
        <button
          onClick={() => setShowNotifyModal(false)}
          className="px-4 py-2 text-gray-600 hover:text-gray-800"
        >
          Cancel
        </button>
        <button
          onClick={handleConfirmNotify}
          className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
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

export default InventoryManagement;

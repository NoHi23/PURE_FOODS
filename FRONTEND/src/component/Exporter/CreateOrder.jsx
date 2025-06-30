import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const CreateOrder = ({ setOrders }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [newOrder, setNewOrder] = useState({
    customerID: user?.userID || "",
    fullName: user?.fullName || "",
    email: user?.email || "",
    address: user?.address || "",
    productId: "",
    productName: "",
    orderCode: `ORD-${Date.now()}`,
    quantity: 0,
    image: null,
  });
  const [orders, setLocalOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [productMap, setProductMap] = useState({});
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ordersRes, productsRes] = await Promise.all([
          axios.get(`http://localhost:8082/PureFoods/api/exporter/orders/${user?.userID || 1}?page=0&size=10`),
          axios.get(`http://localhost:8082/PureFoods/api/product/getAll`),
        ]);
        setLocalOrders(ordersRes.data || []);
        setProducts(productsRes.data.listProduct || []);

        // Build productMap
        const productMapTemp = {};
        productsRes.data.listProduct?.forEach((p) => {
          productMapTemp[p.productId] = p.productName;
        });
        setProductMap(productMapTemp);
      } catch (err) {
        toast.error("Lỗi khi lấy dữ liệu: " + err.response?.data?.message || err.message);
      }
    };
    fetchData();
  }, [user]);

  const handleCreateOrder = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("customerID", newOrder.customerID);
    formData.append("fullName", newOrder.fullName);
    formData.append("email", newOrder.email);
    formData.append("address", newOrder.address);
    formData.append("productId", newOrder.productId);
    formData.append("productName", newOrder.productName);
    formData.append("orderCode", newOrder.orderCode);
    formData.append("quantity", newOrder.quantity);
    if (newOrder.image) formData.append("image", newOrder.image);

    try {
      const res = await axios.post(`http://localhost:8082/PureFoods/api/exporter/order`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setLocalOrders([...orders, res.data]);
      setOrders((prev) => [...prev, res.data]);
      setNewOrder({
        customerID: user?.userID || "",
        fullName: user?.fullName || "",
        email: user?.email || "",
        address: user?.address || "",
        productId: "",
        productName: "",
        orderCode: `ORD-${Date.now()}`,
        quantity: 0,
        image: null,
      });
      toast.success("Đơn hàng đã được tạo!");
    } catch (err) {
      toast.error("Tạo đơn hàng thất bại: " + err.response?.data?.message || err.message);
    }
  };

  const handleEditOrder = async (orderId) => {
    const orderToEdit = orders.find(o => o.orderID === orderId);
    if (orderToEdit) {
      const formData = new FormData();
      formData.append("customerID", newOrder.customerID || orderToEdit.customerID);
      formData.append("fullName", newOrder.fullName || orderToEdit.fullName);
      formData.append("email", newOrder.email || orderToEdit.email);
      formData.append("address", newOrder.address || orderToEdit.address);
      formData.append("productId", newOrder.productId || orderToEdit.productId);
      formData.append("productName", newOrder.productName || orderToEdit.productName);
      formData.append("orderCode", newOrder.orderCode || orderToEdit.orderCode);
      formData.append("quantity", newOrder.quantity || orderToEdit.quantity);
      if (newOrder.image) formData.append("image", newOrder.image);

      try {
        await axios.put(`http://localhost:8082/PureFoods/api/exporter/order/${orderId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setLocalOrders(orders.map(o => o.orderID === orderId ? { ...o, ...newOrder, image: newOrder.image ? URL.createObjectURL(newOrder.image) : o.image } : o));
        setOrders((prev) => prev.map(o => o.orderID === orderId ? { ...o, ...newOrder, image: newOrder.image ? URL.createObjectURL(newOrder.image) : o.image } : o));
        setNewOrder({
          customerID: user?.userID || "",
          fullName: user?.fullName || "",
          email: user?.email || "",
          address: user?.address || "",
          productId: "",
          productName: "",
          orderCode: `ORD-${Date.now()}`,
          quantity: 0,
          image: null,
        });
        toast.success("Đơn hàng đã được cập nhật!");
      } catch (err) {
        toast.error("Cập nhật đơn hàng thất bại: " + err.response?.data?.message || err.message);
      }
    }
  };

  const handleDeleteOrder = (orderId) => {
    const orderToDelete = orders.find(o => o.orderID === orderId);
    setOrderToDelete(orderToDelete);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (orderToDelete) {
      try {
        await axios.delete(`http://localhost:8082/PureFoods/api/exporter/order/${orderToDelete.orderID}`);
        setLocalOrders(orders.filter(o => o.orderID !== orderToDelete.orderID));
        setOrders((prev) => prev.filter(o => o.orderID !== orderToDelete.orderID));
        setShowDeleteConfirm(false);
        setOrderToDelete(null);
        toast.success("Đơn hàng đã được xóa!");
      } catch (err) {
        toast.error("Xóa đơn hàng thất bại: " + err.response?.data?.message || err.message);
      }
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setOrderToDelete(null);
  };

  return (
    <div className="create-order-tab">
      <div className="title">
        <h2>Quản lý đơn hàng</h2>
        <span className="title-leaf">
          <svg className="icon-width bg-gray">
            <use href="../assets/svg/leaf.svg#leaf"></use>
          </svg>
        </span>
      </div>
      <div className="dashboard-bg-box">
        <h3>Tạo đơn hàng mới</h3>
        <form onSubmit={handleCreateOrder}>
          <div className="mb-3">
            <input type="text" className="form-control" placeholder="Họ và tên" value={newOrder.fullName} onChange={(e) => setNewOrder({ ...newOrder, fullName: e.target.value })} required />
          </div>
          <div className="mb-3">
            <input type="email" className="form-control" placeholder="Email" value={newOrder.email} onChange={(e) => setNewOrder({ ...newOrder, email: e.target.value })} required />
          </div>
          <div className="mb-3">
            <input type="text" className="form-control" placeholder="Địa chỉ" value={newOrder.address} onChange={(e) => setNewOrder({ ...newOrder, address: e.target.value })} required />
          </div>
          <div className="mb-3">
            <select className="form-control" value={newOrder.productId} onChange={(e) => {
              const product = products.find(p => p.productId === parseInt(e.target.value));
              setNewOrder({ ...newOrder, productId: e.target.value, productName: product?.productName || "" });
            }} required>
              <option value="">Chọn sản phẩm</option>
              {products.map(p => <option key={p.productId} value={p.productId}>{p.productName}</option>)}
            </select>
          </div>
          <div className="mb-3">
            <input type="text" className="form-control" placeholder="Mã đơn hàng" value={newOrder.orderCode} onChange={(e) => setNewOrder({ ...newOrder, orderCode: e.target.value })} required />
          </div>
          <div className="mb-3">
            <input type="number" className="form-control" placeholder="Số lượng" value={newOrder.quantity} onChange={(e) => setNewOrder({ ...newOrder, quantity: e.target.value })} required />
          </div>
          <div className="mb-3">
            <input type="file" className="form-control" accept="image/*" onChange={(e) => setNewOrder({ ...newOrder, image: e.target.files[0] })} />
          </div>
          <button type="submit" className="btn theme-bg-color btn-md fw-bold text-white">Tạo đơn</button>
        </form>

        <h3 className="mt-4">Danh sách đơn hàng</h3>
        <div className="table-responsive">
          <table className="table order-table">
            <thead>
              <tr>
                <th scope="col">Mã đơn</th>
                <th scope="col">Họ tên</th>
                <th scope="col">Email</th>
                <th scope="col">Địa chỉ</th>
                <th scope="col">Sản phẩm</th>
                <th scope="col">Số lượng</th>
                <th scope="col">Hình ảnh</th>
                <th scope="col">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {orders.length > 0 ? (
                orders.map((o) => (
                  <tr key={o.orderID}>
                    <td>#{o.orderCode || o.orderID}</td>
                    <td><h6>{o.fullName}</h6></td>
                    <td><h6>{o.email}</h6></td>
                    <td><h6>{o.address}</h6></td>
                    <td><h6>{o.productName || productMap[o.productId] || "Không rõ"}</h6></td>
                    <td><h6>{o.quantity}</h6></td>
                    <td><img src={o.image ? o.image : "/assets/images/no-image.png"} alt="Order" style={{ width: "50px", height: "50px" }} /></td>
                    <td>
                      <button onClick={() => {
                        setNewOrder({
                          customerID: o.customerID,
                          fullName: o.fullName,
                          email: o.email,
                          address: o.address,
                          productId: o.productId,
                          productName: o.productName,
                          orderCode: o.orderCode,
                          quantity: o.quantity,
                          image: null,
                        });
                        handleEditOrder(o.orderID);
                      }} className="btn btn-sm btn-warning me-2">Sửa</button>
                      <button onClick={() => handleDeleteOrder(o.orderID)} className="btn btn-sm btn-danger">Xóa</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center">Không có đơn hàng nào.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showDeleteConfirm && orderToDelete && (
        <div className="modal" tabIndex="-1" style={{ display: "block" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Xác nhận xóa đơn hàng</h5>
                <button type="button" className="btn-close" onClick={cancelDelete}></button>
              </div>
              <div className="modal-body">
                <p>Bạn có chắc chắn muốn xóa đơn hàng sau?</p>
                <ul>
                  <li>Mã đơn: #{orderToDelete.orderCode || orderToDelete.orderID}</li>
                  <li>Họ tên: {orderToDelete.fullName}</li>
                  <li>Email: {orderToDelete.email}</li>
                  <li>Địa chỉ: {orderToDelete.address}</li>
                  <li>Sản phẩm: {orderToDelete.productName || productMap[orderToDelete.productId] || "Không rõ"}</li>
                  <li>Số lượng: {orderToDelete.quantity}</li>
                  <li>Hình ảnh: <img src={orderToDelete.image ? orderToDelete.image : "/assets/images/no-image.png"} alt="Order" style={{ width: "50px", height: "50px" }} /></li>
                </ul>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={cancelDelete}>Hủy</button>
                <button type="button" className="btn btn-danger" onClick={confirmDelete}>Xóa</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateOrder;
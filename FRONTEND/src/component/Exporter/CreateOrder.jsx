import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const CreateOrder = ({ setOrders }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [newOrder, setNewOrder] = useState({
    customerID: user?.userID || "", // Giữ nguyên, required
    shippingAddress: user?.address || "", // Sửa từ address thành shippingAddress để khớp entity Orders
    totalAmount: 0, // Thêm field required, giả sử entity có
    orderDetails: [{ productID: "", quantity: 0, unitPrice: 0 }], // Thêm để handle products, vì order có nhiều product
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
        setLocalOrders(ordersRes.data || []); // Handle empty array
        setProducts(productsRes.data.listProduct || []); // Handle empty

        // Build productMap
        const productMapTemp = {};
        productsRes.data.listProduct?.forEach((p) => {
          productMapTemp[p.productId] = { name: p.productName, price: p.price || 0 }; // Thêm price để tính totalAmount
        });
        setProductMap(productMapTemp);
      } catch (err) {
        toast.error("Lỗi khi lấy dữ liệu: " + (err.response?.data?.message || err.message));
      }
    };
    fetchData();
  }, [user]);

  const handleAddProduct = () => {
    setNewOrder({
      ...newOrder,
      orderDetails: [...newOrder.orderDetails, { productID: "", quantity: 0, unitPrice: 0 }],
    });
  };

  const handleProductChange = (index, field, value) => {
    const updatedDetails = [...newOrder.orderDetails];
    updatedDetails[index][field] = value;
    if (field === "productID") {
      const product = productMap[value];
      updatedDetails[index].unitPrice = product?.price || 0;
    }
    const total = updatedDetails.reduce((sum, d) => sum + d.quantity * d.unitPrice, 0);
    setNewOrder({ ...newOrder, orderDetails: updatedDetails, totalAmount: total });
  };

  const handleCreateOrder = async (e) => {
    e.preventDefault();
    if (newOrder.totalAmount <= 0) {
      toast.error("Vui lòng thêm sản phẩm và số lượng hợp lệ!");
      return;
    }
    try {
      const res = await axios.post(`http://localhost:8082/PureFoods/api/exporter/order`, newOrder); // Gửi JSON thay vì FormData, vì không có image nữa hoặc điều chỉnh nếu cần
      setLocalOrders([...orders, res.data]);
      setOrders((prev) => [...prev, res.data]);
      setNewOrder({
        customerID: user?.userID || "",
        shippingAddress: user?.address || "",
        totalAmount: 0,
        orderDetails: [{ productID: "", quantity: 0, unitPrice: 0 }],
      });
      toast.success("Đơn hàng đã được tạo!");
    } catch (err) {
      toast.error("Tạo đơn hàng thất bại: " + (err.response?.data?.message || err.message));
    }
  };

  const handleEditOrder = async (orderId) => {
    const orderToEdit = orders.find((o) => o.orderID === orderId);
    if (orderToEdit) {
      try {
        const updatedOrder = {
          ...orderToEdit,
          shippingAddress: newOrder.shippingAddress || orderToEdit.shippingAddress,
          totalAmount: newOrder.totalAmount || orderToEdit.totalAmount,
          orderDetails: newOrder.orderDetails.length > 0 ? newOrder.orderDetails : orderToEdit.orderDetails, // Giả sử có orderDetails
        };
        await axios.put(`http://localhost:8082/PureFoods/api/exporter/order/${orderId}`, updatedOrder);
        setLocalOrders(orders.map((o) => (o.orderID === orderId ? updatedOrder : o)));
        setOrders((prev) => prev.map((o) => (o.orderID === orderId ? updatedOrder : o)));
        setNewOrder({
          customerID: user?.userID || "",
          shippingAddress: user?.address || "",
          totalAmount: 0,
          orderDetails: [{ productID: "", quantity: 0, unitPrice: 0 }],
        });
        toast.success("Đơn hàng đã được cập nhật!");
      } catch (err) {
        toast.error("Cập nhật đơn hàng thất bại: " + (err.response?.data?.message || err.message));
      }
    }
  };

  const handleDeleteOrder = (orderId) => {
    const orderToDelete = orders.find((o) => o.orderID === orderId);
    setOrderToDelete(orderToDelete);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (orderToDelete) {
      try {
        await axios.delete(`http://localhost:8082/PureFoods/api/exporter/order/${orderToDelete.orderID}`);
        setLocalOrders(orders.filter((o) => o.orderID !== orderToDelete.orderID));
        setOrders((prev) => prev.filter((o) => o.orderID !== orderToDelete.orderID));
        setShowDeleteConfirm(false);
        setOrderToDelete(null);
        toast.success("Đơn hàng đã được xóa!");
      } catch (err) {
        toast.error("Xóa đơn hàng thất bại: " + (err.response?.data?.message || err.message));
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
            <input type="text" className="form-control" placeholder="Địa chỉ giao hàng" value={newOrder.shippingAddress} onChange={(e) => setNewOrder({ ...newOrder, shippingAddress: e.target.value })} required />
          </div>
          <div className="mb-3">
            <h5>Sản phẩm:</h5>
            {newOrder.orderDetails.map((detail, index) => (
              <div key={index} className="d-flex mb-2">
                <select className="form-control me-2" value={detail.productID} onChange={(e) => handleProductChange(index, "productID", e.target.value)} required>
                  <option value="">Chọn sản phẩm</option>
                  {products.map((p) => <option key={p.productId} value={p.productId}>{p.productName}</option>)}
                </select>
                <input type="number" className="form-control" placeholder="Số lượng" value={detail.quantity} onChange={(e) => handleProductChange(index, "quantity", parseInt(e.target.value))} required />
              </div>
            ))}
            <button type="button" onClick={handleAddProduct} className="btn btn-sm btn-secondary">Thêm sản phẩm</button>
          </div>
          <div className="mb-3">
            <input type="number" className="form-control" placeholder="Tổng tiền" value={newOrder.totalAmount} readOnly />
          </div>
          <button type="submit" className="btn theme-bg-color btn-md fw-bold text-white">Tạo đơn</button>
        </form>

        <h3 className="mt-4">Danh sách đơn hàng</h3>
        <div className="table-responsive">
          <table className="table order-table">
            <thead>
              <tr>
                <th scope="col">Mã đơn</th>
                <th scope="col">Địa chỉ giao</th>
                <th scope="col">Tổng tiền</th>
                <th scope="col">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {orders.length > 0 ? (
                orders.map((o) => (
                  <tr key={o.orderID}>
                    <td>#{o.orderID}</td>
                    <td><h6>{o.shippingAddress}</h6></td>
                    <td><h6>{o.totalAmount}</h6></td>
                    <td>
                      <button onClick={() => {
                        setNewOrder({
                          customerID: o.customerID,
                          shippingAddress: o.shippingAddress,
                          totalAmount: o.totalAmount,
                          orderDetails: o.orderDetails || [{ productID: "", quantity: 0, unitPrice: 0 }],
                        });
                        handleEditOrder(o.orderID);
                      }} className="btn btn-sm btn-warning me-2">Sửa</button>
                      <button onClick={() => handleDeleteOrder(o.orderID)} className="btn btn-sm btn-danger">Xóa</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center">Không có đơn hàng nào.</td>
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
                <p>Bạn có chắc chắn muốn xóa đơn hàng #{orderToDelete.orderID}?</p>
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
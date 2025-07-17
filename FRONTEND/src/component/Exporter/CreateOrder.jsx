import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const CreateOrder = ({ setOrders }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [newOrder, setNewOrder] = useState({
    customerID: "",
    customerName: "",
    phone: "",
    email: "",
    shippingAddress: "",
    items: [{ productId: "", quantity: 0, unitPrice: 0, imageUrl: "" }],
  });
  const [orders, setLocalOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [productMap, setProductMap] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ordersRes, productsRes, customersRes] = await Promise.all([
          axios.get(`http://localhost:8082/PureFoods/api/exporter/orders/${user?.userID || 1}?page=0&size=10`),
          axios.get(`http://localhost:8082/PureFoods/api/product/getAll`),
          axios.get(`http://localhost:8082/PureFoods/api/users/getAll`),
        ]);
        setLocalOrders(ordersRes.data || []);
        setProducts(productsRes.data.listProduct || []);
        setCustomers(customersRes.data.userList?.filter(u => u.roleID !== 5) || []);

        const productMapTemp = {};
        productsRes.data.listProduct?.forEach((p) => {
          productMapTemp[p.productId] = { name: p.productName, price: p.price || 0, imageUrl: p.imageURL || "" };
        });
        setProductMap(productMapTemp);
      } catch (err) {
        toast.error("Lỗi khi lấy dữ liệu: " + (err.response?.data?.message || err.message));
        console.error("Fetch error:", err);
      }
    };
    fetchData();
  }, [user]);

  const handleAddProduct = () => {
    setNewOrder({
      ...newOrder,
      items: [...newOrder.items, { productId: "", quantity: 0, unitPrice: 0, imageUrl: "" }],
    });
  };

  const handleProductChange = (index, field, value) => {
    const updatedItems = [...newOrder.items];
    updatedItems[index][field] = field === "quantity" ? parseInt(value) || 0 : value;
    if (field === "productId") {
      const product = productMap[value];
      updatedItems[index].unitPrice = product?.price || 0;
      updatedItems[index].imageUrl = product?.imageUrl || "";
    }
    const total = updatedItems.reduce((sum, item) => sum + (item.quantity * item.unitPrice || 0), 0);
    setNewOrder({ ...newOrder, items: updatedItems, totalAmount: total });
  };

  const handleInputChange = (e) => {
    setNewOrder({ ...newOrder, [e.target.name]: e.target.value });
  };

  const handleCustomerChange = (e) => {
    const customerId = parseInt(e.target.value);
    const customer = customers.find(c => c.userId === customerId);
    setNewOrder({
      ...newOrder,
      customerID: customerId,
      customerName: customer?.fullName || "",
      phone: customer?.phone || "",
      email: customer?.email || "",
      shippingAddress: customer?.address || "",
    });
  };

  const handleCreateOrder = async (e) => {
    e.preventDefault();
    if (!newOrder.customerID || !newOrder.customerName || !newOrder.phone || !newOrder.email || !newOrder.shippingAddress) {
      toast.error("Vui lòng nhập đầy đủ thông tin khách hàng!");
      return;
    }
    if (newOrder.items.some(item => !item.productId || item.quantity <= 0 || item.unitPrice <= 0)) {
      toast.error("Vui lòng chọn sản phẩm và số lượng hợp lệ!");
      return;
    }
    try {
      console.log("Sending order:", newOrder); // Debug log
      const res = await axios.post(`http://localhost:8082/PureFoods/api/exporter/order`, {
        customerID: parseInt(newOrder.customerID),
        customerName: newOrder.customerName,
        phone: newOrder.phone,
        email: newOrder.email,
        shippingAddress: newOrder.shippingAddress,
        items: newOrder.items.map(item => ({
          productId: parseInt(item.productId),
          imageUrl: item.imageUrl,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
        })),
      }, {
        headers: { "Content-Type": "application/json" },
      });
      console.log("Response:", res.data); // Debug log
      setLocalOrders([...orders, res.data]);
      setOrders((prev) => [...prev, res.data]);
      setNewOrder({
        customerID: "",
        customerName: "",
        phone: "",
        email: "",
        shippingAddress: "",
        items: [{ productId: "", quantity: 0, unitPrice: 0, imageUrl: "" }],
      });
      toast.success("Đơn hàng đã được tạo thành công!");
    } catch (err) {
      console.error("Create order error:", err.response?.data || err); // Debug log
      toast.error("Tạo đơn hàng thất bại: " + (err.response?.data?.message || err.message));
    }
  };

  const handleEditOrder = async (orderId) => {
    const orderToEdit = orders.find((o) => o.orderID === orderId);
    if (orderToEdit) {
      try {
        const updatedOrder = {
          customerID: parseInt(newOrder.customerID) || orderToEdit.customerID,
          customerName: newOrder.customerName || orderToEdit.customerName || "",
          phone: newOrder.phone || orderToEdit.phone || "",
          email: newOrder.email || orderToEdit.email || "",
          shippingAddress: newOrder.shippingAddress || orderToEdit.shippingAddress,
          items: newOrder.items.length > 0 ? newOrder.items.map(item => ({
            productId: parseInt(item.productId),
            imageUrl: item.imageUrl,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
          })) : orderToEdit.orderDetails || [],
        };
        await axios.put(`http://localhost:8082/PureFoods/api/exporter/order/${orderId}`, updatedOrder, {
          headers: { "Content-Type": "application/json" },
        });
        setLocalOrders(orders.map((o) => (o.orderID === orderId ? { ...o, ...updatedOrder } : o)));
        setOrders((prev) => prev.map((o) => (o.orderID === orderId ? { ...o, ...updatedOrder } : o)));
        setNewOrder({
          customerID: "",
          customerName: "",
          phone: "",
          email: "",
          shippingAddress: "",
          items: [{ productId: "", quantity: 0, unitPrice: 0, imageUrl: "" }],
        });
        toast.success("Đơn hàng đã được cập nhật!");
      } catch (err) {
        console.error("Edit order error:", err.response?.data || err); // Debug log
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
        console.error("Delete order error:", err.response?.data || err); // Debug log
        toast.error("Xóa đơn hàng thất bại: " + (err.response?.data?.message || err.message));
      }
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setOrderToDelete(null);
  };

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);

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
            <select
              className="form-control"
              name="customerID"
              value={newOrder.customerID}
              onChange={handleCustomerChange}
              required
            >
              <option value="">Chọn khách hàng</option>
              {customers.map((c) => (
                <option key={c.userId} value={c.userId}>
                  {c.fullName} ({c.email})
                </option>
              ))}
            </select>
          </div>
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              name="customerName"
              placeholder="Tên khách hàng"
              value={newOrder.customerName}
              onChange={handleInputChange}
              required
              readOnly
            />
          </div>
          <div className="mb-3">
            <input
              type="tel"
              className="form-control"
              name="phone"
              placeholder="Số điện thoại"
              value={newOrder.phone}
              onChange={handleInputChange}
              required
              readOnly
            />
          </div>
          <div className="mb-3">
            <input
              type="email"
              className="form-control"
              name="email"
              placeholder="Email"
              value={newOrder.email}
              onChange={handleInputChange}
              required
              readOnly
            />
          </div>
          <div className="mb-3">
            <input
              type="text"
              className="form-control"
              name="shippingAddress"
              placeholder="Địa chỉ giao hàng"
              value={newOrder.shippingAddress}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="mb-3">
            <h5>Sản phẩm:</h5>
            {newOrder.items.map((item, index) => (
              <div key={index} className="d-flex mb-2">
                <select
                  className="form-control me-2"
                  value={item.productId || ""}
                  onChange={(e) => handleProductChange(index, "productId", e.target.value)}
                  required
                >
                  <option value="">Chọn sản phẩm</option>
                  {products.map((p) => (
                    <option key={p.productId} value={p.productId}>{p.productName}</option>
                  ))}
                </select>
                <input
                  type="number"
                  className="form-control"
                  placeholder="Số lượng"
                  value={item.quantity || 0}
                  onChange={(e) => handleProductChange(index, "quantity", parseInt(e.target.value) || 0)}
                  min="1"
                  required
                />
              </div>
            ))}
            <button type="button" onClick={handleAddProduct} className="btn btn-sm btn-secondary">Thêm sản phẩm</button>
          </div>
          <div className="mb-3">
            <input
              type="number"
              className="form-control"
              placeholder="Tổng tiền"
              value={newOrder.totalAmount || 0}
              readOnly
            />
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
                      <button
                        onClick={() => {
                          setNewOrder({
                            customerID: o.customerID?.toString() || "",
                            customerName: o.customerName || "",
                            phone: o.phone || "",
                            email: o.email || "",
                            shippingAddress: o.shippingAddress || "",
                            items: o.orderDetails?.map(d => ({
                              productId: d.productID?.toString() || "",
                              quantity: d.quantity || 0,
                              unitPrice: d.unitPrice?.doubleValue() || 0,
                              imageUrl: productMap[d.productID]?.imageUrl || "",
                            })) || [{ productId: "", quantity: 0, unitPrice: 0, imageUrl: "" }],
                          });
                          handleEditOrder(o.orderID);
                        }}
                        className="btn btn-sm btn-warning me-2"
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() => handleDeleteOrder(o.orderID)}
                        className="btn btn-sm btn-danger"
                      >
                        Xóa
                      </button>
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

import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import * as bootstrap from "bootstrap";

const CreateOrder = ({ setOrders }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [newOrder, setNewOrder] = useState({
    customerId: "",
    customerName: "",
    phone: "",
    email: "",
    shippingAddress: "",
    driverId: "",
    estimatedDeliveryDate: "",
    delayReason: "",
    items: [{ productId: "", quantity: 0 }],
  });
  const [orders, setLocalOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [productMap, setProductMap] = useState({});
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);
  const [cancelReason, setCancelReason] = useState("");
  const [showReturnForm, setShowReturnForm] = useState(false);
  const [returnOrder, setReturnOrder] = useState({
    exporterId: "",
    returnReason: "",
    items: [{ productId: "", quantity: 0 }],
  });
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [newRequest, setNewRequest] = useState({
    customerName: "",
    phone: "",
    email: "",
    shippingAddress: "",
    items: [{ productId: "", quantity: 0 }],
    source: "external",
  });
  const modalRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ordersRes, productsRes, customersRes, driversRes] = await Promise.all([
          axios.get(`http://localhost:8082/PureFoods/api/exporters`),
          axios.get(`http://localhost:8082/PureFoods/api/product/getAll`),
          axios.get(`http://localhost:8082/PureFoods/api/users/getAll`),
          axios.get(`http://localhost:8082/PureFoods/api/drivers`),
        ]);
        setLocalOrders(ordersRes.data || []);
        setProducts(productsRes.data.listProduct || []);
        setCustomers(customersRes.data.userList?.filter((u) => u.roleID !== 5) || []);
        setDrivers(driversRes.data || []);

        const productMapTemp = {};
        productsRes.data.listProduct?.forEach((p) => {
          productMapTemp[p.productId] = { name: p.productName };
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
      items: [...newOrder.items, { productId: "", quantity: 0 }],
    });
  };

  const handleProductChange = (index, field, value) => {
    const updatedItems = [...newOrder.items];
    updatedItems[index][field] = field === "quantity" ? parseInt(value) || 0 : value;
    setNewOrder({ ...newOrder, items: updatedItems });
  };

  const handleReturnProductChange = (index, field, value) => {
    const updatedItems = [...returnOrder.items];
    updatedItems[index][field] = field === "quantity" ? parseInt(value) || 0 : value;
    setReturnOrder({ ...returnOrder, items: updatedItems });
  };

  const handleAddReturnProduct = () => {
    setReturnOrder({
      ...returnOrder,
      items: [...returnOrder.items, { productId: "", quantity: 0 }],
    });
  };

  const handleRequestProductChange = (index, field, value) => {
    const updatedItems = [...newRequest.items];
    updatedItems[index][field] = field === "quantity" ? parseInt(value) || 0 : value;
    setNewRequest({ ...newRequest, items: updatedItems });
  };

  const handleAddRequestProduct = () => {
    setNewRequest({
      ...newRequest,
      items: [...newRequest.items, { productId: "", quantity: 0 }],
    });
  };

  const handleInputChange = (e) => {
    setNewOrder({ ...newOrder, [e.target.name]: e.target.value });
  };

  const handleRequestInputChange = (e) => {
    setNewRequest({ ...newRequest, [e.target.name]: e.target.value });
  };

  const handleCustomerChange = (e) => {
    const customerId = parseInt(e.target.value);
    const customer = customers.find((c) => c.userId === customerId);
    setNewOrder({
      ...newOrder,
      customerId: customerId,
      customerName: customer?.fullName || "",
      phone: customer?.phone || "",
      email: customer?.email || "",
      shippingAddress: customer?.address || "",
    });
  };

  const handleCreateOrder = async (e) => {
    e.preventDefault();
    if (!newOrder.customerId || !newOrder.customerName || !newOrder.phone || !newOrder.email || !newOrder.shippingAddress || !newOrder.driverId) {
      toast.error("Vui lòng nhập đầy đủ thông tin khách hàng và tài xế!");
      return;
    }
    if (newOrder.items.some((item) => !item.productId || item.quantity <= 0)) {
      toast.error("Vui lòng chọn sản phẩm và số lượng hợp lệ!");
      return;
    }
    if (newOrder.estimatedDeliveryDate && !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/.test(newOrder.estimatedDeliveryDate)) {
      toast.error("Ngày giao dự kiến không đúng định dạng (yyyy-MM-dd'T'HH:mm:ss)!");
      return;
    }
    try {
      const res = await axios.post(
        `http://localhost:8082/PureFoods/api/exporters`,
        {
          customerId: parseInt(newOrder.customerId),
          customerName: newOrder.customerName,
          phone: newOrder.phone,
          email: newOrder.email,
          shippingAddress: newOrder.shippingAddress,
          driverId: parseInt(newOrder.driverId),
          estimatedDeliveryDate: newOrder.estimatedDeliveryDate || null,
          statusId: 1,
        },
        { headers: { "Content-Type": "application/json" } }
      );
      setLocalOrders([...orders, res.data]);
      setOrders((prev) => [...prev, res.data]);
      setNewOrder({
        customerId: "",
        customerName: "",
        phone: "",
        email: "",
        shippingAddress: "",
        driverId: "",
        estimatedDeliveryDate: "",
        delayReason: "",
        items: [{ productId: "", quantity: 0 }],
      });
      const modal = bootstrap.Modal.getInstance(modalRef.current);
      modal.hide();
      toast.success("Đơn hàng đã được tạo thành công!");
    } catch (err) {
      toast.error("Tạo đơn hàng thất bại: " + (err.response?.data?.message || err.message));
    }
  };

  const handleEditOrder = async (exporterId, e) => {
    e.preventDefault();
    const orderToEdit = orders.find((o) => o.exporterId === exporterId);
    if (!orderToEdit) {
      toast.error("Đơn hàng không tồn tại!");
      return;
    }
    if (newOrder.estimatedDeliveryDate && !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/.test(newOrder.estimatedDeliveryDate)) {
      toast.error("Ngày giao dự kiến không đúng định dạng (yyyy-MM-dd'T'HH:mm:ss)!");
      return;
    }
    try {
      const updatedOrder = {
        customerId: parseInt(newOrder.customerId) || orderToEdit.customerId,
        customerName: newOrder.customerName || orderToEdit.customerName || "",
        phone: newOrder.phone || orderToEdit.phone || "",
        email: newOrder.email || orderToEdit.email || "",
        shippingAddress: newOrder.shippingAddress || orderToEdit.shippingAddress,
        driverId: parseInt(newOrder.driverId) || orderToEdit.driverId,
        estimatedDeliveryDate: newOrder.estimatedDeliveryDate || orderToEdit.estimatedDeliveryDate || null,
        delayReason: newOrder.delayReason || orderToEdit.delayReason || "",
      };
      await axios.put(`http://localhost:8082/PureFoods/api/exporters/${exporterId}`, updatedOrder, {
        headers: { "Content-Type": "application/json" },
      });
      setLocalOrders(orders.map((o) => (o.exporterId === exporterId ? { ...o, ...updatedOrder } : o)));
      setOrders((prev) => prev.map((o) => (o.exporterId === exporterId ? { ...o, ...updatedOrder } : o)));
      setNewOrder({
        customerId: "",
        customerName: "",
        phone: "",
        email: "",
        shippingAddress: "",
        driverId: "",
        estimatedDeliveryDate: "",
        delayReason: "",
        items: [{ productId: "", quantity: 0 }],
      });
      const modal = bootstrap.Modal.getInstance(modalRef.current);
      modal.hide();
      toast.success("Đơn hàng đã được cập nhật!");
    } catch (err) {
      toast.error("Cập nhật đơn hàng thất bại: " + (err.response?.data?.message || err.message));
    }
  };

  const handleDeleteOrder = async (exporterId, cancelReason) => {
    try {
      await axios.delete(`http://localhost:8082/PureFoods/api/exporters/${exporterId}`, {
        params: { cancelReason },
      });
      setLocalOrders(orders.filter((o) => o.exporterId !== exporterId));
      setOrders((prev) => prev.filter((o) => o.exporterId !== exporterId));
      toast.success("Đơn hàng đã được xóa!");
    } catch (err) {
      toast.error("Xóa đơn hàng thất bại: " + (err.response?.data?.message || err.message));
    }
  };

  const handleConfirmDelivery = async (exporterId) => {
    try {
      await axios.put(`http://localhost:8082/PureFoods/api/exporters/confirmDelivery/${exporterId}`);
      setOrders((prev) => prev.map((o) => (o.exporterId === exporterId ? { ...o, statusId: 3 } : o)));
      toast.success("Xác nhận giao hàng thành công!");
    } catch (err) {
      toast.error("Xác nhận giao hàng thất bại: " + (err.response?.data?.message || err.message));
    }
  };

  const handleNotifyDelivery = async (exporterId, status) => {
    try {
      await axios.post(`http://localhost:8082/PureFoods/api/notifications`, {
        user_id: orders.find((o) => o.exporterId === exporterId)?.customerId,
        title: `Cập nhật giao hàng #${exporterId}`,
        content: status === "delivering" ? "Đơn hàng của bạn đang được giao." : "Đơn hàng của bạn đã giao thành công.",
      });
      toast.success("Gửi thông báo giao hàng thành công!");
    } catch (err) {
      toast.error("Gửi thông báo thất bại: " + (err.response?.data?.message || err.message));
    }
  };

  const handleDriverConfirmDelivery = async (exporterId) => {
    try {
      await axios.put(`http://localhost:8082/PureFoods/api/exporters/driverConfirm/${exporterId}`);
      setOrders((prev) => prev.map((o) => (o.exporterId === exporterId ? { ...o, statusId: 3 } : o)));
      await handleNotifyDelivery(exporterId, "delivered");
      toast.success("Tài xế xác nhận giao hàng thành công!");
    } catch (err) {
      toast.error("Xác nhận giao hàng thất bại: " + (err.response?.data?.message || err.message));
    }
  };

  const handleCreateReturnOrder = async (e) => {
    e.preventDefault();
    if (!returnOrder.exporterId || !returnOrder.returnReason || returnOrder.items.some((item) => !item.productId || item.quantity <= 0)) {
      toast.error("Vui lòng nhập đầy đủ thông tin đơn trả hàng!");
      return;
    }
    try {
      const order = orders.find((o) => o.exporterId === parseInt(returnOrder.exporterId));
      await axios.put(`http://localhost:8082/PureFoods/api/exporters/return/${returnOrder.exporterId}`, null, {
        params: { returnReason: returnOrder.returnReason },
      });
      for (const item of returnOrder.items) {
        await axios.put(`http://localhost:8082/PureFoods/api/exporters/updateStock/${user.userID}`, null, {
          params: { productId: item.productId, quantity: item.quantity, action: "update" },
        });
        await axios.post(`http://localhost:8082/PureFoods/api/inventoryLogs`, {
          productId: item.productId,
          userId: user.userID,
          quantityChange: item.quantity,
          reason: `Trả hàng đơn #${returnOrder.exporterId}: ${returnOrder.returnReason}`,
        });
      }
      setOrders((prev) =>
        prev.map((o) =>
          o.exporterId === parseInt(returnOrder.exporterId) ? { ...o, returnReason: returnOrder.returnReason, statusId: 5 } : o
        )
      );
      setShowReturnForm(false);
      setReturnOrder({ exporterId: "", returnReason: "", items: [{ productId: "", quantity: 0 }] });
      const modal = bootstrap.Modal.getInstance(modalRef.current);
      modal.hide();
      toast.success("Tạo đơn trả hàng thành công!");
    } catch (err) {
      toast.error("Tạo đơn trả hàng thất bại: " + (err.response?.data?.message || err.message));
    }
  };

  const handleCreateRequest = async (e) => {
    e.preventDefault();
    if (!newRequest.customerName || !newRequest.phone || !newRequest.email || !newRequest.shippingAddress || newRequest.items.some((item) => !item.productId || item.quantity <= 0)) {
      toast.error("Vui lòng nhập đầy đủ thông tin yêu cầu!");
      return;
    }
    try {
      const res = await axios.post(
        `http://localhost:8082/PureFoods/api/exporters`,
        {
          customerId: 0,
          customerName: newRequest.customerName,
          phone: newRequest.phone,
          email: newRequest.email,
          shippingAddress: newRequest.shippingAddress,
          driverId: null,
          statusId: 1,
          source: newRequest.source,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      setLocalOrders([...orders, res.data]);
      setOrders((prev) => [...prev, res.data]);
      setNewRequest({
        customerName: "",
        phone: "",
        email: "",
        shippingAddress: "",
        items: [{ productId: "", quantity: 0 }],
        source: "external",
      });
      setShowRequestForm(false);
      const modal = bootstrap.Modal.getInstance(modalRef.current);
      modal.hide();
      toast.success("Nhận yêu cầu xuất hàng thành công!");
    } catch (err) {
      toast.error("Nhận yêu cầu thất bại: " + (err.response?.data?.message || err.message));
    }
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
        <p style={{ color: "#f98050", marginTop: "5px", fontFamily: "Inconsolata, monospace" }}>
          (*) Đảm bảo kiểm tra thông tin đơn hàng và tồn kho trước khi tạo đơn.
        </p>
      </div>
      <div className="dashboard-bg-box">
        <div className="dashboard-title mb-4">
          <h3>Tạo đơn hàng mới</h3>
        </div>
        <div className="d-flex justify-content-between mb-4">
          <button
            className="btn theme-bg-color btn-md fw-bold text-white"
            data-bs-toggle="modal"
            data-bs-target="#createOrderModal"
            onClick={() => setNewOrder({
              customerId: "",
              customerName: "",
              phone: "",
              email: "",
              shippingAddress: "",
              driverId: "",
              estimatedDeliveryDate: "",
              delayReason: "",
              items: [{ productId: "", quantity: 0 }],
            })}
          >
            Tạo đơn hàng
          </button>
          <button
            className="btn btn-sm btn-primary"
            data-bs-toggle="modal"
            data-bs-target="#requestOrderModal"
            onClick={() => setShowRequestForm(true)}
          >
            Nhận yêu cầu xuất hàng
          </button>
        </div>
        <div className="table-responsive">
          <table className="table order-table">
            <thead>
              <tr>
                <th scope="col">Mã đơn</th>
                <th scope="col">Địa chỉ giao</th>
                <th scope="col">Tài xế</th>
                <th scope="col">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {orders.length > 0 ? (
                orders.map((o) => (
                  <tr key={o.exporterId}>
                    <td>#{o.exporterId}</td>
                    <td>
                      <h6>{o.shippingAddress}</h6>
                    </td>
                    <td>
                      <h6>{drivers.find((d) => d.driverId === o.driverId)?.driverName || "Chưa gán"}</h6>
                    </td>
                    <td>
                      <button
                        className="btn btn-sm btn-warning me-2"
                        data-bs-toggle="modal"
                        data-bs-target="#createOrderModal"
                        onClick={() => {
                          setNewOrder({
                            customerId: o.customerId?.toString() || "",
                            customerName: o.customerName || "",
                            phone: o.phone || "",
                            email: o.email || "",
                            shippingAddress: o.shippingAddress || "",
                            driverId: o.driverId?.toString() || "",
                            estimatedDeliveryDate: o.estimatedDeliveryDate || "",
                            delayReason: o.delayReason || "",
                            items: [{ productId: "", quantity: 0 }],
                          });
                        }}
                      >
                        Sửa
                      </button>
                      <button
                        className="btn btn-sm btn-danger me-2"
                        onClick={() => {
                          setOrderToDelete(o);
                          setShowDeleteConfirm(true);
                        }}
                      >
                        Xóa
                      </button>
                      <button
                        className="btn btn-sm btn-success me-2"
                        onClick={() => handleConfirmDelivery(o.exporterId)}
                      >
                        Xác nhận giao
                      </button>
                      <button
                        className="btn btn-sm btn-info me-2"
                        onClick={() => handleNotifyDelivery(o.exporterId, o.statusId === 3 ? "delivered" : "delivering")}
                      >
                        Thông báo giao
                      </button>
                      <button
                        className="btn btn-sm btn-primary me-2"
                        onClick={() => handleDriverConfirmDelivery(o.exporterId)}
                      >
                        Tài xế xác nhận
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center">
                    Không có đơn hàng nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div
        className="modal fade"
        id="createOrderModal"
        tabIndex="-1"
        aria-labelledby="createOrderModalLabel"
        aria-hidden="true"
        ref={modalRef}
      >
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="createOrderModalLabel">
                {newOrder.exporterId ? "Chỉnh sửa đơn hàng" : "Tạo đơn hàng mới"}
              </h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <form onSubmit={newOrder.exporterId ? (e) => handleEditOrder(newOrder.exporterId, e) : handleCreateOrder}>
                <div className="mb-3">
                  <label className="form-label">Khách hàng</label>
                  <select
                    className="form-control"
                    name="customerId"
                    value={newOrder.customerId}
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
                  <label className="form-label">Tên khách hàng</label>
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
                  <label className="form-label">Số điện thoại</label>
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
                  <label className="form-label">Email</label>
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
                  <label className="form-label">Địa chỉ giao hàng</label>
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
                  <label className="form-label">Tài xế</label>
                  <select
                    className="form-control"
                    name="driverId"
                    value={newOrder.driverId}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Chọn tài xế</option>
                    {drivers.map((d) => (
                      <option key={d.driverId} value={d.driverId}>
                        {d.driverName} ({d.vehicleInfo})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Ngày giao dự kiến</label>
                  <input
                    type="datetime-local"
                    className="form-control"
                    name="estimatedDeliveryDate"
                    value={newOrder.estimatedDeliveryDate}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Lý do chậm trễ (nếu có)</label>
                  <input
                    type="text"
                    className="form-control"
                    name="delayReason"
                    placeholder="Lý do chậm trễ (nếu có)"
                    value={newOrder.delayReason}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="d-flex justify-content-end gap-2">
                  <button type="submit" className="btn theme-bg-color btn-md fw-bold text-white">
                    {newOrder.exporterId ? "Cập nhật đơn" : "Tạo đơn"}
                  </button>
                  <button type="button" className="btn btn-secondary btn-md fw-bold" data-bs-dismiss="modal">
                    Hủy
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div
        className="modal fade"
        id="deleteOrderModal"
        tabIndex="-1"
        aria-labelledby="deleteOrderModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="deleteOrderModalLabel">
                Xác nhận xóa đơn hàng
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setOrderToDelete(null);
                }}
              ></button>
            </div>
            <div className="modal-body">
              <p>Bạn có chắc chắn muốn xóa đơn hàng #{orderToDelete?.exporterId}?</p>
              <input
                type="text"
                className="form-control"
                placeholder="Lý do hủy"
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
              />
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setOrderToDelete(null);
                }}
              >
                Hủy
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={() => {
                  handleDeleteOrder(orderToDelete.exporterId, cancelReason);
                  setShowDeleteConfirm(false);
                  setOrderToDelete(null);
                }}
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      </div>

      <div
        className="modal fade"
        id="requestOrderModal"
        tabIndex="-1"
        aria-labelledby="requestOrderModalLabel"
        aria-hidden="true"
        ref={modalRef}
      >
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="requestOrderModalLabel">
                Nhận yêu cầu xuất hàng
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={() => setShowRequestForm(false)}
              ></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleCreateRequest}>
                <div className="mb-3">
                  <label className="form-label">Tên khách hàng</label>
                  <input
                    type="text"
                    className="form-control"
                    name="customerName"
                    placeholder="Tên khách hàng"
                    value={newRequest.customerName}
                    onChange={handleRequestInputChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Số điện thoại</label>
                  <input
                    type="tel"
                    className="form-control"
                    name="phone"
                    placeholder="Số điện thoại"
                    value={newRequest.phone}
                    onChange={handleRequestInputChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    placeholder="Email"
                    value={newRequest.email}
                    onChange={handleRequestInputChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Địa chỉ giao hàng</label>
                  <input
                    type="text"
                    className="form-control"
                    name="shippingAddress"
                    placeholder="Địa chỉ giao hàng"
                    value={newRequest.shippingAddress}
                    onChange={handleRequestInputChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Nguồn</label>
                  <select
                    className="form-control"
                    name="source"
                    value={newRequest.source}
                    onChange={handleRequestInputChange}
                  >
                    <option value="external">Khách hàng bên ngoài</option>
                    <option value="internal">Nội bộ</option>
                  </select>
                </div>
                <div className="d-flex justify-content-end gap-2">
                  <button
                    type="submit"
                    className="btn theme-bg-color btn-md fw-bold text-white"
                  >
                    Nhận yêu cầu
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary btn-md fw-bold"
                    data-bs-dismiss="modal"
                  >
                    Hủy
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateOrder;
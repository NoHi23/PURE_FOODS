import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import * as bootstrap from "bootstrap";

const CreateOrder = ({ products, onOrderCreated }) => {
  const [newExportOrder, setNewExportOrder] = useState({
    orderID: "",
    customerID: "",
    statusID: 1,
    shippingMethodID: "",
    driverID: null,
    shippingAddress: "",
    shippingCost: 0.0,
    totalAmount: 0.0,
    discountAmount: 0.0,
    orderDate: new Date().toISOString().slice(0, 16),
    estimatedDeliveryDate: "",
    orderDetails: [],
  });
  const [customers, setCustomers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const modalRef = useRef(null);

  // Hàm chuyển đổi Date thành định dạng YYYY-MM-DDThh:mm
  const formatDateTimeLocal = (date) => {
    if (!date) return "";
    try {
      let parsedDate;
      if (typeof date === "number") {
        parsedDate = new Date(date);
      } else if (typeof date === "string") {
        parsedDate = new Date(date);
      } else if (date instanceof Date) {
        parsedDate = date;
      } else {
        console.warn("Invalid date type:", typeof date, date);
        return "";
      }

      if (isNaN(parsedDate.getTime())) {
        console.warn("Invalid date value:", date);
        return "";
      }

      return parsedDate.toISOString().slice(0, 16);
    } catch (err) {
      console.warn("Error parsing date:", date, err);
      return "";
    }
  };

  const fetchData = async () => {
    setIsDataLoading(true);
    setErrorMessage("");
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const token = user.token || "";
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const [usersRes, ordersRes] = await Promise.all([
        axios.get("http://localhost:8082/PureFoods/api/users/getAll", { headers }),
        axios.get("http://localhost:8082/PureFoods/api/exporter/requests", { headers }),
      ]);

      console.log("Users API response:", usersRes.data); // Debug
      console.log("Orders API response:", ordersRes.data); // Debug

      // Xử lý danh sách khách hàng
      if (usersRes.data.status === 200 && Array.isArray(usersRes.data.userList)) {
        const customersList = usersRes.data.userList.filter((user) => user.roleID === 2);
        setCustomers(customersList);
        if (customersList.length === 0) {
          setErrorMessage("Không tìm thấy khách hàng nào trong hệ thống. Vui lòng kiểm tra dữ liệu backend.");
        }
      } else {
        throw new Error(usersRes.data.message || "Dữ liệu khách hàng không hợp lệ.");
      }

      // Xử lý danh sách đơn hàng
      if (ordersRes.data.status === 200 && Array.isArray(ordersRes.data.requests)) {
        setOrders(ordersRes.data.requests);
        if (ordersRes.data.requests.length === 0) {
          setErrorMessage((prev) => prev ? prev + " Không tìm thấy đơn hàng nào trong hệ thống." : "Không tìm thấy đơn hàng nào trong hệ thống.");
        }
      } else {
        throw new Error(ordersRes.data.message || "Dữ liệu đơn hàng không hợp lệ.");
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || "Lỗi kết nối máy chủ.";
      setErrorMessage("Không thể tải danh sách khách hàng hoặc đơn hàng: " + errorMsg);
      toast.error("Lỗi khi tải danh sách: " + errorMsg);
      setCustomers([]);
      setOrders([]);
    } finally {
      setIsDataLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCustomerChange = (e) => {
    const customerID = e.target.value;
    setNewExportOrder((prev) => ({
      ...prev,
      customerID,
      orderID: "",
      orderDetails: [],
      statusID: 1,
      shippingMethodID: "",
      driverID: null,
      shippingAddress: "",
      shippingCost: 0.0,
      totalAmount: 0.0,
      discountAmount: 0.0,
      orderDate: new Date().toISOString().slice(0, 16),
      estimatedDeliveryDate: "",
    }));

    if (customerID) {
      const customer = customers.find((c) => c.userId === parseInt(customerID));
      if (customer) {
        setNewExportOrder((prev) => ({
          ...prev,
          shippingAddress: customer.address || "",
        }));
      }
    }
  };

  const handleOrderChange = async (e) => {
    const orderID = e.target.value;
    setNewExportOrder((prev) => ({
      ...prev,
      orderID,
      orderDetails: [],
      statusID: 1,
      shippingMethodID: "",
      driverID: null,
      shippingAddress: prev.shippingAddress,
      shippingCost: 0.0,
      totalAmount: 0.0,
      discountAmount: 0.0,
      orderDate: new Date().toISOString().slice(0, 16),
      estimatedDeliveryDate: "",
    }));

    if (orderID) {
      try {
        setIsLoading(true);
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        const token = user.token || "";
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const res = await axios.get(`http://localhost:8082/PureFoods/api/exporter/requests/${orderID}`, { headers });
        console.log("Order details API response:", res.data); // Debug
        if (res.data.status === 200 && res.data.order) {
          const order = res.data.order;
          setNewExportOrder((prev) => ({
            ...prev,
            customerID: order.customerID?.toString() || prev.customerID,
            statusID: order.statusID || 1,
            shippingMethodID: order.shippingMethodID?.toString() || "",
            driverID: order.driverID || null,
            shippingAddress: order.shippingAddress || prev.shippingAddress,
            shippingCost: order.shippingCost || 0.0,
            totalAmount: order.totalAmount || 0.0,
            discountAmount: order.discountAmount || 0.0,
            orderDate: formatDateTimeLocal(order.orderDate),
            estimatedDeliveryDate: formatDateTimeLocal(order.estimatedDeliveryDate),
            orderDetails: order.orderDetails && Array.isArray(order.orderDetails) ? order.orderDetails.map((detail) => ({
              productID: detail.productID?.toString() || "",
              quantity: detail.quantity || 0,
              unitPrice: detail.unitPrice || 0.0,
              status: detail.status || 1,
              productName: detail.productName || "",
              stockQuantity: detail.stockQuantity || 0,
            })) : [],
          }));
        } else {
          toast.warn(`Đơn hàng #${orderID} không có thông tin chi tiết.`);
          setNewExportOrder((prev) => ({
            ...prev,
            orderDetails: [],
          }));
        }
      } catch (err) {
        const errorMsg = err.response?.data?.message || err.message || "Lỗi tải chi tiết đơn hàng.";
        toast.error(errorMsg);
        setNewExportOrder((prev) => ({
          ...prev,
          orderDetails: [],
        }));
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewExportOrder((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddOrderDetail = () => {
    setNewExportOrder((prev) => ({
      ...prev,
      orderDetails: [
        ...prev.orderDetails,
        {
          productID: "",
          quantity: 1,
          unitPrice: 0.0,
          status: 1,
          productName: "",
          stockQuantity: 0,
        },
      ],
    }));
  };

  const handleOrderDetailChange = (index, field, value) => {
    const updatedDetails = [...newExportOrder.orderDetails];
    updatedDetails[index][field] = value;
    if (field === "productID") {
      const product = products.find((p) => p.productId === parseInt(value));
      if (product) {
        updatedDetails[index].productName = product.productName;
        updatedDetails[index].unitPrice = product.price;
        updatedDetails[index].stockQuantity = product.stockQuantity;
      } else {
        updatedDetails[index].productName = "";
        updatedDetails[index].unitPrice = 0.0;
        updatedDetails[index].stockQuantity = 0;
      }
    }
    setNewExportOrder((prev) => ({
      ...prev,
      orderDetails: updatedDetails,
    }));
  };

  const handleRemoveOrderDetail = (index) => {
    setNewExportOrder((prev) => ({
      ...prev,
      orderDetails: prev.orderDetails.filter((_, i) => i !== index),
    }));
  };

  const handleCreateExportOrder = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const userId = user.userId || null;
      const userToken = user.token || "";

      if (!userId) {
        toast.error("Không tìm thấy userId trong localStorage. Vui lòng kiểm tra dữ liệu người dùng.");
        setIsLoading(false);
        return;
      }

      if (!newExportOrder.orderID) {
        toast.error("Vui lòng chọn một đơn hàng!");
        setIsLoading(false);
        return;
      }
      if (!newExportOrder.customerID || !newExportOrder.statusID || !newExportOrder.shippingMethodID || newExportOrder.orderDetails.length === 0) {
        toast.error("Vui lòng điền đầy đủ customerID, statusID, shippingMethodID và ít nhất một chi tiết đơn hàng!");
        setIsLoading(false);
        return;
      }

      for (const detail of newExportOrder.orderDetails) {
        if (!detail.productID || isNaN(detail.quantity) || isNaN(detail.unitPrice)) {
          toast.error("Dữ liệu chi tiết đơn hàng không hợp lệ!");
          setIsLoading(false);
          return;
        }
      }

      const headers = userToken ? { Authorization: `Bearer ${userToken}` } : {};
      for (const detail of newExportOrder.orderDetails) {
        try {
          const res = await axios.get(
            `http://localhost:8082/PureFoods/api/exporter/inventory/check?productId=${detail.productID}&quantity=${detail.quantity}`,
            { headers }
          );
          if (res.data.status !== 200 || !res.data.available) {
            toast.error(`Không đủ tồn kho cho sản phẩm: ${detail.productName || detail.productID}`);
            setIsLoading(false);
            return;
          }
        } catch (err) {
          toast.error(`Lỗi kiểm tra tồn kho cho sản phẩm ${detail.productName || detail.productID}: ${err.response?.data?.message || err.message}`);
          setIsLoading(false);
          return;
        }
      }

      const payload = {
        orderID: parseInt(newExportOrder.orderID),
        customerID: parseInt(newExportOrder.customerID),
        statusID: parseInt(newExportOrder.statusID),
        shippingMethodID: parseInt(newExportOrder.shippingMethodID),
        driverID: newExportOrder.driverID ? parseInt(newExportOrder.driverID) : null,
        shippingAddress: newExportOrder.shippingAddress || "",
        shippingCost: parseFloat(newExportOrder.shippingCost) || 0.0,
        totalAmount: parseFloat(newExportOrder.totalAmount) || 0.0,
        discountAmount: parseFloat(newExportOrder.discountAmount) || 0.0,
        orderDate: newExportOrder.orderDate || new Date().toISOString(),
        estimatedDeliveryDate: newExportOrder.estimatedDeliveryDate || null,
        orderDetails: newExportOrder.orderDetails.map((detail) => ({
          productID: parseInt(detail.productID),
          quantity: parseInt(detail.quantity),
          unitPrice: parseFloat(detail.unitPrice),
          status: parseInt(detail.status) || 1,
        })),
      };

      console.log("Payload gửi đi:", JSON.stringify(payload, null, 2));
      const response = await axios.post("http://localhost:8082/PureFoods/api/exporter/requests", payload, {
        headers: {
          "Content-Type": "application/json",
          ...headers,
        },
      });
      if (response.data.status === 200) {
        const modal = bootstrap.Modal.getInstance(modalRef.current);
        modal.hide();
        setNewExportOrder({
          orderID: "",
          customerID: "",
          statusID: 1,
          shippingMethodID: "",
          driverID: null,
          shippingAddress: "",
          shippingCost: 0.0,
          totalAmount: 0.0,
          discountAmount: 0.0,
          orderDate: new Date().toISOString().slice(0, 16),
          estimatedDeliveryDate: "",
          orderDetails: [],
        });
        toast.success(response.data.message || "Đơn xuất hàng đã được tạo thành công!");
        if (onOrderCreated) onOrderCreated();
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        toast.error(response.data.message || "Tạo đơn xuất hàng thất bại");
      }
    } catch (err) {
      console.error("Lỗi chi tiết:", err.response?.data || err.message);
      toast.error(`Tạo đơn xuất hàng thất bại: ${err.response?.data?.message || err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="modal fade"
      id="exportProductModal"
      tabIndex="-1"
      aria-labelledby="exportProductModalLabel"
      aria-hidden="true"
      ref={modalRef}
    >
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="exportProductModalLabel">
              Tạo đơn xuất hàng
            </h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div className="modal-body">
            {isDataLoading ? (
              <div className="text-center">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Đang tải...</span>
                </div>
                <p>Đang tải dữ liệu...</p>
              </div>
            ) : errorMessage ? (
              <div className="alert alert-danger">
                {errorMessage}
                <div className="mt-2">
                  <button className="btn btn-primary btn-sm" onClick={fetchData}>
                    Thử lại
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleCreateExportOrder}>
                <div className="mb-3">
                  <label className="form-label">Chọn khách hàng</label>
                  <select
                    name="customerID"
                    value={newExportOrder.customerID}
                    onChange={handleCustomerChange}
                    required
                    className="form-control"
                    disabled={isLoading}
                  >
                    <option value="">--Chọn khách hàng--</option>
                    {customers.length > 0 ? (
                      customers.map((customer) => (
                        <option key={customer.userId} value={customer.userId}>
                          {customer.fullName} ({customer.email})
                        </option>
                      ))
                    ) : (
                      <option value="" disabled>
                        Không có khách hàng nào
                      </option>
                    )}
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Chọn đơn đặt hàng</label>
                  <select
                    name="orderID"
                    value={newExportOrder.orderID}
                    onChange={handleOrderChange}
                    required
                    className="form-control"
                    disabled={isLoading || !newExportOrder.customerID}
                  >
                    <option value="">--Chọn đơn hàng--</option>
                    {orders
                      .filter((order) => order.customerID === parseInt(newExportOrder.customerID))
                      .map((order) => (
                        <option key={order.orderID} value={order.orderID}>
                          Đơn #{order.orderID} - {order.customerName} (
                          {order.orderDate ? new Date(formatDateTimeLocal(order.orderDate)).toLocaleDateString("vi-VN") : "Không rõ"}){" "}
                          {order.statusID === 5 ? `(Đã hủy: ${order.cancelReason || "Không rõ"})` : ""}
                        </option>
                      ))}
                  </select>
                  {!newExportOrder.customerID && (
                    <p className="text-warning mt-2">Vui lòng chọn khách hàng trước để xem danh sách đơn hàng.</p>
                  )}
                  {newExportOrder.customerID &&
                    orders.filter((order) => order.customerID === parseInt(newExportOrder.customerID)).length === 0 && (
                      <p className="text-warning mt-2">Khách hàng này chưa có đơn hàng nào.</p>
                    )}
                </div>
                <div className="mb-3">
                  <label className="form-label">Mã phương thức vận chuyển</label>
                  <input
                    type="text"
                    name="shippingMethodID"
                    value={newExportOrder.shippingMethodID}
                    onChange={handleInputChange}
                    required
                    className="form-control"
                    placeholder="Nhập mã phương thức vận chuyển"
                    disabled={isLoading}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Mã tài xế (không bắt buộc)</label>
                  <input
                    type="text"
                    name="driverID"
                    value={newExportOrder.driverID || ""}
                    onChange={handleInputChange}
                    className="form-control"
                    placeholder="Nhập mã tài xế (nếu có)"
                    disabled={isLoading}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Địa chỉ giao hàng</label>
                  <input
                    type="text"
                    name="shippingAddress"
                    value={newExportOrder.shippingAddress}
                    onChange={handleInputChange}
                    className="form-control"
                    placeholder="Nhập địa chỉ giao hàng"
                    disabled={isLoading}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Chi phí vận chuyển</label>
                  <input
                    type="number"
                    name="shippingCost"
                    value={newExportOrder.shippingCost}
                    onChange={handleInputChange}
                    className="form-control"
                    min="0"
                    placeholder="Nhập chi phí vận chuyển"
                    disabled={isLoading}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Khoảng cách (km)</label>
                  <input
                    type="number"
                    name="distance"
                    value={newExportOrder.distance || ""}
                    onChange={handleInputChange}
                    className="form-control"
                    min="0"
                    placeholder="Nhập khoảng cách (km)"
                    disabled={isLoading}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Tổng số tiền</label>
                  <input
                    type="number"
                    name="totalAmount"
                    value={newExportOrder.totalAmount}
                    onChange={handleInputChange}
                    className="form-control"
                    min="0"
                    placeholder="Nhập tổng số tiền"
                    disabled={isLoading}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Số tiền giảm giá</label>
                  <input
                    type="number"
                    name="discountAmount"
                    value={newExportOrder.discountAmount}
                    onChange={handleInputChange}
                    className="form-control"
                    min="0"
                    placeholder="Nhập số tiền giảm giá"
                    disabled={isLoading}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Ngày đặt hàng</label>
                  <input
                    type="datetime-local"
                    name="orderDate"
                    value={newExportOrder.orderDate || ""}
                    onChange={handleInputChange}
                    className="form-control"
                    disabled={isLoading}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Ngày giao hàng dự kiến</label>
                  <input
                    type="datetime-local"
                    name="estimatedDeliveryDate"
                    value={newExportOrder.estimatedDeliveryDate || ""}
                    onChange={handleInputChange}
                    className="form-control"
                    disabled={isLoading}
                  />
                </div>
                <div className="mb-3">
                  <h6>Chi tiết đơn hàng</h6>
                  <button
                    type="button"
                    className="btn btn-sm btn-primary mb-2"
                    onClick={handleAddOrderDetail}
                    disabled={isLoading}
                  >
                    Thêm sản phẩm
                  </button>
                  {newExportOrder.orderDetails.length > 0 && (
                    <table className="table table-bordered">
                      <thead>
                        <tr>
                          <th>Sản phẩm</th>
                          <th>Số lượng</th>
                          <th>Đơn giá</th>
                          <th>Trạng thái</th>
                          <th>Tồn kho</th>
                          <th>Hành động</th>
                        </tr>
                      </thead>
                      <tbody>
                        {newExportOrder.orderDetails.map((detail, index) => (
                          <tr key={index}>
                            <td>
                              <select
                                value={detail.productID}
                                onChange={(e) => handleOrderDetailChange(index, "productID", e.target.value)}
                                className="form-control"
                                disabled={isLoading}
                              >
                                <option value="">--Chọn sản phẩm--</option>
                                {products.map((product) => (
                                  <option key={product.productId} value={product.productId}>
                                    {product.productName}
                                  </option>
                                ))}
                              </select>
                            </td>
                            <td>
                              <input
                                type="number"
                                value={detail.quantity}
                                onChange={(e) => handleOrderDetailChange(index, "quantity", e.target.value)}
                                className="form-control"
                                min="1"
                                disabled={isLoading}
                              />
                            </td>
                            <td>
                              <input
                                type="number"
                                value={detail.unitPrice}
                                onChange={(e) => handleOrderDetailChange(index, "unitPrice", e.target.value)}
                                className="form-control"
                                min="0"
                                disabled={isLoading}
                              />
                            </td>
                            <td>
                              <select
                                value={detail.status}
                                onChange={(e) => handleOrderDetailChange(index, "status", e.target.value)}
                                className="form-control"
                                disabled={isLoading}
                              >
                                <option value={1}>Đang chờ xử lý</option>
                                <option value={2}>Đang xử lý</option>
                                <option value={3}>Hoàn thành</option>
                                <option value={5}>Đã hủy</option>
                              </select>
                            </td>
                            <td>{detail.stockQuantity ?? "Không rõ"}</td>
                            <td>
                              <button
                                type="button"
                                className="btn btn-sm btn-danger"
                                onClick={() => handleRemoveOrderDetail(index)}
                                disabled={isLoading}
                              >
                                Xóa
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
                {newExportOrder.orderID && (
                  <div className="mb-3">
                    <h6>Thông tin đơn hàng</h6>
                    <p><strong>Mã đơn hàng:</strong> #{newExportOrder.orderID}</p>
                    <p><strong>Khách hàng:</strong> {customers.find((c) => c.userId === parseInt(newExportOrder.customerID))?.fullName || "Không rõ"}</p>
                    <p><strong>Địa chỉ giao hàng:</strong> {newExportOrder.shippingAddress || "Không rõ"}</p>
                    {orders.find((o) => o.orderID === parseInt(newExportOrder.orderID))?.statusID === 5 && (
                      <p><strong>Lý do hủy:</strong> {orders.find((o) => o.orderID === parseInt(newExportOrder.orderID))?.cancelReason || "Không rõ"}</p>
                    )}
                  </div>
                )}
                <div className="d-flex justify-content-end gap-2 mt-3">
                  <button
                    type="submit"
                    className="btn theme-bg-color btn-md fw-bold text-white"
                    disabled={isLoading || !newExportOrder.orderID}
                  >
                    {isLoading ? "Đang xử lý..." : "Tạo đơn xuất"}
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary btn-md fw-bold"
                    data-bs-dismiss="modal"
                    disabled={isLoading}
                  >
                    Hủy
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateOrder;
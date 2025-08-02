import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FiSearch, FiRefreshCw } from "react-icons/fi";
import Pagination from "../../layouts/Pagination";
import * as bootstrap from "bootstrap";
import Swal from "sweetalert2";

const ExporterProduct = ({ orders, setOrders, currentPage, setCurrentPage }) => {
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [newOrder, setNewOrder] = useState({
    exporterDTO: { orderID: null, customerID: "", shippingAddress: "", statusID: 1, shippingMethodID: 1, shippingCost: 0.0, distance: 0.0, totalAmount: 0.0, discountAmount: 0.0 },
    orderDetails: [{ productID: "", quantity: "", unitPrice: "", status: 1 }],
  });
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const modalRef = useRef(null);

  const filteredOrders = orders.filter((order) => {
    if (![1, 2].includes(order.statusID)) return false; // Chỉ lấy Pending và Processing
    const customerName = order?.customerName?.toLowerCase() || "";
    const orderId = order?.orderID?.toString() || "";
    const statusText = order?.statusName?.toLowerCase() || "";
    const createdAt = order?.orderDate
      ? new Date(order.orderDate).toLocaleString("vi-VN").toLowerCase()
      : "";
    return (
      customerName.includes(searchTerm.toLowerCase()) ||
      orderId.includes(searchTerm) ||
      statusText.includes(searchTerm.toLowerCase()) ||
      createdAt.includes(searchTerm.toLowerCase())
    );
  });

  const ordersPerPage = 7;
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
  const indexOfLast = currentPage * ordersPerPage;
  const indexOfFirst = indexOfLast - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirst, indexOfLast);

  useEffect(() => {
    setIsLoading(true);
    Promise.all([
      axios.get("http://localhost:8082/PureFoods/api/product/getAll", { timeout: 5000 }),
      axios.get("http://localhost:8082/PureFoods/api/users/getAll", { timeout: 5000 }),
    ])
      .then(([productRes, userRes]) => {
        const productsData = productRes.data.listProduct || [];
        const customersData = (userRes.data.userList || []).filter((u) => u.roleID === 2);
        setProducts(productsData);
        setCustomers(customersData);
        if (productsData.length === 0) {
          toast.error("Không tìm thấy sản phẩm nào!");
        }
        if (customersData.length === 0) {
          toast.error("Không tìm thấy khách hàng nào!");
        }
      })
      .catch((err) => {
        console.error("Lỗi khi lấy dữ liệu:", err);
        toast.error("Không thể tải danh sách sản phẩm/khách hàng! Kiểm tra mạng.");
      })
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    if (selectedOrder) {
      setNewOrder({
        exporterDTO: {
          orderID: selectedOrder.orderID || null,
          customerID: selectedOrder.customerID?.toString() || "",
          shippingAddress: selectedOrder.shippingAddress || "",
          statusID: selectedOrder.statusID || 1,
          shippingMethodID: selectedOrder.shippingMethodID || 1,
          shippingCost: selectedOrder.shippingCost || 0.0,
          distance: selectedOrder.distance || 0.0,
          totalAmount: selectedOrder.totalAmount || 0.0,
          discountAmount: selectedOrder.discountAmount || 0.0,
        },
        orderDetails: selectedOrder.orderDetails?.length > 0
          ? selectedOrder.orderDetails.map((detail) => ({
              productID: detail.productID?.toString() || "",
              quantity: detail.quantity?.toString() || "",
              unitPrice: detail.unitPrice?.toString() || "",
              status: detail.status || 1,
            }))
          : [{ productID: "", quantity: "", unitPrice: "", status: 1 }],
      });
      const modal = new bootstrap.Modal(modalRef.current);
      modal.show();

      // Reset state when modal is closed
      const modalElement = modalRef.current;
      const handleModalClose = () => {
        setNewOrder({
          exporterDTO: { orderID: null, customerID: "", shippingAddress: "", statusID: 1, shippingMethodID: 1, shippingCost: 0.0, distance: 0.0, totalAmount: 0.0, discountAmount: 0.0 },
          orderDetails: [{ productID: "", quantity: "", unitPrice: "", status: 1 }],
        });
        setSelectedOrder(null);
      };
      modalElement.addEventListener('hidden.bs.modal', handleModalClose);
      return () => modalElement.removeEventListener('hidden.bs.modal', handleModalClose);
    }
  }, [selectedOrder]);

  const checkInventory = async (productId, quantity) => {
    try {
      const res = await axios.get("http://localhost:8082/PureFoods/api/exporter/check-inventory", {
        params: { productId, quantity },
        timeout: 5000,
      });
      return res.data.available;
    } catch (err) {
      console.error("Lỗi khi kiểm tra tồn kho:", err);
      toast.error(`Lỗi kiểm tra tồn kho cho sản phẩm ID ${productId}`);
      return false;
    }
  };

  const handleCreateOrder = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const exporterId = user.userId;
      const roleID = user.roleID;

      if (roleID !== 5) {
        toast.error("Vui lòng đăng nhập với tài khoản Exporter hợp lệ!");
        setIsLoading(false);
        return;
      }

      const { orderID, customerID, shippingAddress } = newOrder.exporterDTO;
      if (!orderID || isNaN(orderID) || orderID <= 0) {
        toast.error("ID đơn hàng không hợp lệ!");
        setIsLoading(false);
        return;
      }
      if (!customerID || isNaN(customerID) || customerID <= 0) {
        toast.error("ID khách hàng không hợp lệ!");
        setIsLoading(false);
        return;
      }
      if (!shippingAddress || shippingAddress.trim() === "") {
        toast.error("Địa chỉ giao hàng không được để trống!");
        setIsLoading(false);
        return;
      }

      if (customers.length === 0 || products.length === 0) {
        toast.error("Danh sách khách hàng hoặc sản phẩm rỗng! Vui lòng làm mới dữ liệu.");
        setIsLoading(false);
        return;
      }

      const customerExists = customers.some((c) => c.userId === parseInt(customerID));
      if (!customerExists) {
        toast.error(`Khách hàng ID ${customerID} không tồn tại!`);
        setIsLoading(false);
        return;
      }

      if (
        !newOrder.orderDetails.every(
          (detail) =>
            detail.productID &&
            !isNaN(detail.productID) &&
            parseInt(detail.productID) > 0 &&
            detail.quantity &&
            !isNaN(detail.quantity) &&
            parseInt(detail.quantity) > 0 &&
            detail.unitPrice &&
            !isNaN(detail.unitPrice) &&
            parseFloat(detail.unitPrice) >= 0 &&
            products.some((p) => p.productId === parseInt(detail.productID))
        )
      ) {
        toast.error(
          "Chi tiết sản phẩm không hợp lệ! Kiểm tra ID sản phẩm, số lượng (>0), và đơn giá (>=0)."
        );
        setIsLoading(false);
        return;
      }

      for (const detail of newOrder.orderDetails) {
        const productId = parseInt(detail.productID);
        const quantity = parseInt(detail.quantity);
        const available = await checkInventory(productId, quantity);
        if (!available) {
          const product = products.find((p) => p.productId === productId);
          toast.error(
            `Sản phẩm ${product?.productName || `ID ${productId}`} không đủ tồn kho!`
          );
          setIsLoading(false);
          return;
        }
      }

      const payload = {
        exporterDTO: {
          orderID: parseInt(orderID),
          customerID: parseInt(customerID),
          shippingAddress: shippingAddress.trim(),
          statusID: 2, // Chuyển sang Processing khi tạo
          shippingMethodID: parseInt(newOrder.exporterDTO.shippingMethodID) || 1,
          shippingCost: parseFloat(newOrder.exporterDTO.shippingCost) || 0.0,
          distance: parseFloat(newOrder.exporterDTO.distance) || 0.0,
          totalAmount: newOrder.orderDetails.reduce(
            (sum, detail) => sum + parseInt(detail.quantity) * parseFloat(detail.unitPrice),
            0
          ),
          discountAmount: parseFloat(newOrder.exporterDTO.discountAmount) || 0.0,
        },
        orderDetails: newOrder.orderDetails.map((detail) => ({
          productID: parseInt(detail.productID),
          quantity: parseInt(detail.quantity),
          unitPrice: parseFloat(detail.unitPrice),
          status: parseInt(detail.status) || 1,
        })),
      };

      const response = await axios.post(
        `http://localhost:8082/PureFoods/api/exporter/export-requests?exporterId=${exporterId}`,
        payload,
        { timeout: 5000 }
      );

      if (response.data.status === 200) {
        toast.success("Tạo yêu cầu xuất hàng thành công!");
        setOrders(
          orders.map((o) =>
            o.orderID === orderID ? { ...o, statusID: 3, statusName: "Đã giao hàng" } : o
          )
        );
        const modal = bootstrap.Modal.getInstance(modalRef.current);
        modal.hide();
        setNewOrder({
          exporterDTO: { orderID: null, customerID: "", shippingAddress: "", statusID: 1, shippingMethodID: 1, shippingCost: 0.0, distance: 0.0, totalAmount: 0.0, discountAmount: 0.0 },
          orderDetails: [{ productID: "", quantity: "", unitPrice: "", status: 1 }],
        });
        setSelectedOrder(null);
      } else {
        toast.error(response.data.message || "Tạo yêu cầu xuất hàng thất bại!");
      }
    } catch (err) {
      console.error("Lỗi khi tạo yêu cầu xuất hàng:", err);
      toast.error(
        err.response?.data?.message || "Tạo yêu cầu xuất hàng thất bại! Vui lòng kiểm tra dữ liệu."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelOrder = async (orderId) => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const exporterId = user.userId;
    if (!exporterId) {
      toast.error("Vui lòng đăng nhập!");
      return;
    }

    const { value: cancelReason } = await Swal.fire({
      title: "Lý do hủy đơn hàng",
      input: "text",
      inputLabel: "Vui lòng nhập lý do hủy",
      inputPlaceholder: "Nhập lý do hủy...",
      showCancelButton: true,
      confirmButtonText: "Xác nhận",
      cancelButtonText: "Hủy",
    });

    if (!cancelReason) return;

    try {
      const response = await axios.delete(
        `http://localhost:8082/PureFoods/api/exporter/cancel-request/${orderId}`,
        {
          params: { exporterId },
          data: { cancelReason },
          timeout: 5000,
        }
      );
      if (response.data.status === 200) {
        toast.success("Hủy yêu cầu xuất hàng thành công!");
        setOrders(
          orders.map((order) =>
            order.orderID === orderId ? { ...order, statusID: 5, statusName: "Đã hủy" } : order
          )
        );
      }
    } catch (err) {
      console.error("Lỗi khi hủy đơn hàng:", err);
      toast.error(err.response?.data?.message || "Hủy đơn hàng thất bại!");
    }
  };

  const handleUpdateStatus = async (orderId, newStatusId) => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const exporterId = user.userId;
    if (!exporterId) {
      toast.error("Vui lòng đăng nhập!");
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:8082/PureFoods/api/exporter/update-status/${orderId}?exporterId=${exporterId}`,
        { statusId: newStatusId },
        { timeout: 5000 }
      );
      if (response.data.status === 200) {
        toast.success("Cập nhật trạng thái đơn hàng thành công!");
        setOrders(
          orders.map((order) =>
            order.orderID === orderId
              ? {
                  ...order,
                  statusID: newStatusId,
                  statusName:
                    newStatusId === 2
                      ? "Đang xử lý"
                      : newStatusId === 3
                      ? "Đã giao hàng"
                      : newStatusId === 4
                      ? "Đã giao"
                      : newStatusId === 5
                      ? "Đã hủy"
                      : order.statusName,
                }
              : order
          )
        );
      } else {
        toast.error(response.data.message || "Cập nhật trạng thái thất bại!");
      }
    } catch (err) {
      console.error("Lỗi khi cập nhật trạng thái:", err);
      toast.error(err.response?.data?.message || "Cập nhật trạng thái thất bại!");
    }
  };

  const handleRefresh = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get("http://localhost:8082/PureFoods/api/exporter/export-requests", {
        timeout: 5000,
      });
      const pendingOrders = (res.data.orders || []).filter((order) => [1, 2].includes(order.statusID));
      if (pendingOrders.length === 0) {
        toast.warn("Không có đơn hàng nào đang chờ xử lý hoặc đang xử lý!");
      } else {
        toast.success("Danh sách yêu cầu xuất hàng đã được làm mới!");
      }
      setOrders(pendingOrders);
    } catch (err) {
      console.error("Lỗi khi làm mới:", err);
      toast.error("Làm mới thất bại! Kiểm tra mạng.");
      setOrders([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    if (name.startsWith("orderDetails")) {
      const [_, field] = name.split(".");
      const updatedDetails = [...newOrder.orderDetails];
      updatedDetails[index] = { ...updatedDetails[index], [field]: value };
      setNewOrder({ ...newOrder, orderDetails: updatedDetails });
    } else {
      setNewOrder({ ...newOrder, exporterDTO: { ...newOrder.exporterDTO, [name]: value } });
    }
  };

  const addOrderDetail = () => {
    setNewOrder({
      ...newOrder,
      orderDetails: [...newOrder.orderDetails, { productID: "", quantity: "", unitPrice: "", status: 1 }],
    });
  };

  const handleOpenCreateModal = (order) => {
    setSelectedOrder(order);
  };

  return (
    <div className="product-tab">
      {isLoading && (
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Đang tải...</span>
          </div>
        </div>
      )}
      <div className="title">
        <h2>Quản lý yêu cầu xuất hàng</h2>
        <span className="title-leaf">
          <svg className="icon-width bg-gray">
            <use href="/assets/svg/leaf.svg#leaf"></use>
          </svg>
        </span>
      </div>
      <div className="position-relative mb-4">
        <input
          type="text"
          className="form-control pe-5"
          placeholder="Tìm kiếm yêu cầu xuất hàng..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
        />
        <FiSearch
          style={{
            position: "absolute",
            right: "15px",
            top: "50%",
            transform: "translateY(-50%)",
            color: "#aaa",
            pointerEvents: "none",
          }}
          size={18}
        />
      </div>
      <div className="d-flex justify-content-between mb-4">
        <button
          className="btn btn-md fw-bold text-white d-flex align-items-center"
          onClick={handleRefresh}
          disabled={isLoading}
          style={{
            backgroundColor: "#007bff",
            border: "1px solid #007bff",
            transition: "all 0.3s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = "#0056b3";
            e.currentTarget.style.borderColor = "#0056b3";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = "#007bff";
            e.currentTarget.style.borderColor = "#007bff";
          }}
        >
          <FiRefreshCw className={`me-1 ${isLoading ? "fa-spin" : ""}`} />
          {isLoading ? "Đang làm mới..." : "Làm mới"}
        </button>
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
                Tạo yêu cầu xuất hàng
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                disabled={isLoading}
              ></button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleCreateOrder}>
                <div className="mb-3">
                  <label className="form-label">ID Đơn hàng</label>
                  <input
                    type="text"
                    name="orderID"
                    value={newOrder.exporterDTO.orderID || ""}
                    className="form-control"
                    disabled
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Khách hàng</label>
                  <select
                    name="customerID"
                    value={newOrder.exporterDTO.customerID}
                    onChange={(e) => handleInputChange(e)}
                    required
                    className="form-control"
                    disabled={isLoading}
                  >
                    <option value="">--Chọn khách hàng--</option>
                    {customers.map((c) => (
                      <option key={c.userId} value={c.userId}>
                        {c.fullName} (ID: {c.userId})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Địa chỉ giao hàng</label>
                  <input
                    type="text"
                    className="form-control"
                    name="shippingAddress"
                    value={newOrder.exporterDTO.shippingAddress}
                    onChange={(e) => handleInputChange(e)}
                    required
                    disabled={isLoading}
                  />
                </div>
                {newOrder.orderDetails.map((detail, index) => (
                  <div key={index} className="mb-3">
                    <h6>Chi tiết sản phẩm {index + 1}</h6>
                    <div className="row">
                      <div className="col-4">
                        <label className="form-label">Sản phẩm</label>
                        <select
                          name={`orderDetails.productID`}
                          value={detail.productID}
                          onChange={(e) => handleInputChange(e, index)}
                          required
                          className="form-control"
                          disabled={isLoading}
                        >
                          <option value="">--Chọn sản phẩm--</option>
                          {products.map((p) => (
                            <option key={p.productId} value={p.productId}>
                              {p.productName} (ID: {p.productId})
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="col-4">
                        <label className="form-label">Số lượng</label>
                        <input
                          type="number"
                          className="form-control"
                          name={`orderDetails.quantity`}
                          value={detail.quantity}
                          onChange={(e) => handleInputChange(e, index)}
                          required
                          min={1}
                          disabled={isLoading}
                        />
                      </div>
                      <div className="col-4">
                        <label className="form-label">Đơn giá</label>
                        <input
                          type="number"
                          className="form-control"
                          name={`orderDetails.unitPrice`}
                          value={detail.unitPrice}
                          onChange={(e) => handleInputChange(e, index)}
                          required
                          min={0}
                          disabled={isLoading}
                        />
                      </div>
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  className="btn btn-secondary btn-sm mb-3"
                  onClick={addOrderDetail}
                  disabled={isLoading}
                >
                  Thêm sản phẩm
                </button>
                <div className="d-flex justify-content-end gap-2">
                  <button
                    type="submit"
                    className="btn theme-bg-color btn-md fw-bold text-white"
                    disabled={isLoading}
                  >
                    {isLoading ? "Đang xử lý..." : "Tạo và xuất hàng"}
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
            </div>
          </div>
        </div>
      </div>
      <div className="table-responsive dashboard-bg-box">
        <table className="table order-table">
          <thead>
            <tr>
              <th scope="col">ID Đơn hàng</th>
              <th scope="col">Khách hàng</th>
              <th scope="col">Sản phẩm</th>
              <th scope="col">Tổng số lượng</th>
              <th scope="col">Tổng tiền</th>
              <th scope="col">Trạng thái</th>
              <th scope="col">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {currentOrders.length > 0 ? (
              currentOrders.map((order, index) => (
                <tr key={index}>
                  <td>#{order?.orderID}</td>
                  <td>
                    <h6>{order?.customerName || "Không rõ"}</h6>
                  </td>
                  <td>
                    <h6>
                      {order?.orderDetails?.map((detail) => detail.productName || "Không rõ").join(", ") ||
                        "Không rõ"}
                    </h6>
                  </td>
                  <td>
                    <h6>
                      {order?.orderDetails?.reduce((sum, detail) => sum + (detail.quantity || 0), 0) || 0}
                    </h6>
                  </td>
                  <td>
                    <h6>${order?.totalAmount || 0}</h6>
                  </td>
                  <td>
                    <label
                      className={order?.statusID === 1 ? "warning" : "info"}
                    >
                      {order?.statusID === 1 ? "Chờ xử lý" : "Đang xử lý"}
                    </label>
                  </td>
                  <td>
                    <button
                      className="btn btn-sm"
                      style={{ backgroundColor: "#28a745", color: "white", marginRight: "5px" }}
                      onClick={() => handleOpenCreateModal(order)}
                      disabled={order?.statusID !== 2 || isLoading}
                    >
                      Tạo xuất hàng
                    </button>
                    <button
                      className="btn btn-sm"
                      style={{ backgroundColor: "#dc3545", color: "white", marginRight: "5px" }}
                      onClick={() => handleCancelOrder(order.orderID)}
                      disabled={![1, 2].includes(order?.statusID) || isLoading}
                    >
                      Hủy
                    </button>
                    {order?.statusID === 1 && (
                      <button
                        className="btn btn-sm"
                        style={{ backgroundColor: "#007bff", color: "white" }}
                        onClick={() => handleUpdateStatus(order.orderID, 2)}
                        disabled={isLoading}
                      >
                        Xác nhận
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center">
                  Không có yêu cầu xuất hàng nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      </div>
    </div>
  );
};

export default ExporterProduct;
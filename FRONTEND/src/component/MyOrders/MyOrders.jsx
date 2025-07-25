import React, { useEffect, useState } from 'react';
import MyCouponsPageLayout from '../../layouts/MyCouponsPageLayout';
import axios from 'axios';
import { toast } from 'react-toastify';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

const MyOrders = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.userId;
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [orders, setOrders] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalOrderId, setModalOrderId] = useState(null);
  const [orderDetails, setOrderDetails] = useState([]);

  const loadOrders = async () => {
    try {
      const res = await axios.get(`http://localhost:8082/PureFoods/api/orders/customer/${userId}`);
      if (res.data.status === 200) {
        setOrders(res.data.orders);
      } else {
        toast.error("Không thể lấy danh sách đơn hàng");
      }
    } catch (error) {
      console.error("Lỗi khi lấy đơn hàng:", error);
      toast.error("Lỗi khi tải đơn hàng");
    }
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString("vi-VN") + " " + date.toLocaleTimeString("vi-VN");
  };

  const openOrderModal = async (orderId) => {
    setModalOrderId(orderId);
    setShowModal(true);

    try {
      const res = await axios.get(`http://localhost:8082/PureFoods/api/order-details/order/${orderId}`);
      const details = res.data;

      const detailWithProducts = await Promise.all(
        details.map(async (detail) => {
          const productRes = await axios.get(`http://localhost:8082/PureFoods/api/product/getById/${detail.productID}`);
          const product = productRes.data.product;

          let categoryName = "Unknown";
          if (product.categoryId) {
            try {
              const catRes = await axios.get(`http://localhost:8082/PureFoods/api/category/${product.categoryId}`);
              categoryName = catRes.data.categoryName;
            } catch (e) {
              console.error("Lỗi lấy category:", e);
            }
          }

          let supplierName = "Unknown";
          if (product.supplierId) {
            try {
              const supRes = await axios.get(`http://localhost:8082/PureFoods/api/supplier/${product.supplierId}`);
              supplierName = supRes.data.supplierName;
            } catch (e) {
              console.error("Lỗi lấy supplier:", e);
            }
          }

          return {
            ...detail,
            product: {
              ...product,
              categoryName,
              supplierName
            }
          };
        })
      );

      setOrderDetails(detailWithProducts);
    } catch (error) {
      console.error("Lỗi khi lấy chi tiết đơn hàng:", error);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setOrderDetails([]);
    setModalOrderId(null);
  };

  useEffect(() => {
    if (userId) loadOrders();
  }, [userId]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOrders = orders.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(orders.length / itemsPerPage);

  const goToPage = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  return (
    <MyCouponsPageLayout>
      <section className="breadcrumb-section pt-0">
        <div className="container-fluid-lg">
          <div className="row">
            <div className="col-12">
              <div className="breadcrumb-contain">
                <h2 className="mb-2">Đơn hàng của tôi</h2>
                <nav>
                  <ol className="breadcrumb mb-0">
                    <li className="breadcrumb-item">
                      <a href="/"><i className="fa-solid fa-house"></i></a>
                    </li>
                    <li className="breadcrumb-item active">Đơn hàng</li>
                  </ol>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-b-space">
        <div className="container-fluid-lg">
          <div className="row">
            <div className="col-12">
              <div className="card shadow p-4">
                <h4 className="mb-4">Danh sách đơn hàng</h4>
                {currentOrders.length === 0 ? (
                  <p className="text-muted">Không có đơn hàng nào</p>
                ) : (
                  <table className="table">
                    <thead>
                      <tr>
                        <th>#ID</th>
                        <th>Ngày đặt</th>
                        <th>Địa chỉ giao</th>
                        <th>Tổng cộng</th>
                        <th>Trạng thái</th>
                        <th>Chi tiết</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentOrders.map((order) => (
                        <tr key={order.orderID}>
                          <td>#00{order.orderID}</td>
                          <td>{formatDate(order.orderDate)}</td>
                          <td>{order.shippingAddress}</td>
                          <td>{(order.totalAmount || 0).toLocaleString()}đ</td>
                          <td>
                            {order.statusID === 1 && <span className="badge bg-warning text-dark">Đơn hàng đang chờ xử lý</span>}
                            {order.statusID === 2 && <span className="badge bg-success">Đơn hàng đang được xử lý</span>}
                            {order.statusID === 3 && <span className="badge bg-primary">Đã giao cho đơn vị vận chuyển</span>}
                            {order.statusID === 4 && <span className="badge bg-success">Giao hàng thành công</span>}
                            {order.statusID === 5 && <span className="badge bg-danger">Đã bị hủy</span>}
                            {!order.statusID && <span className="badge bg-secondary">Không xác định</span>}
                          </td>
                          <td>
                            <button className="btn btn-sm btn-primary" onClick={() => openOrderModal(order.orderID)}>
                              Xem chi tiết
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modal Chi tiết đơn hàng */}
      <Modal show={showModal} onHide={closeModal} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Chi tiết đơn hàng #00{modalOrderId}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {orderDetails.length === 0 ? (
            <p>Không có sản phẩm nào trong đơn này.</p>
          ) : (
            <table className="table table-bordered">
              <thead>
                <tr>
                  <th>Tên sản phẩm</th>
                  <th>Hình ảnh</th>
                  <th>Danh mục</th>
                  <th>Nhà cung cấp</th>
                  <th>Số lượng</th>
                  <th>Giá</th>
                </tr>
              </thead>
              <tbody>
                {orderDetails.map((detail) => (
                  <tr key={detail.id}>
                    <td>{detail.product?.productName || "..."}</td>
                    <td>
                      <img src={detail.product?.imageURL} alt={detail.product?.productName} style={{ width: "60px" }} />
                    </td>
                    <td>{detail.product?.categoryName}</td>
                    <td>{detail.product?.supplierName}</td>
                    <td>{detail.quantity}</td>
                    <td>${detail.product.salePrice}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>
            Đóng
          </Button>
        </Modal.Footer>
      </Modal>
      <div className="d-flex justify-content-center mt-3">
        <nav>
          <ul className="pagination">
            <li className={`page-item ${currentPage === 1 && 'disabled'}`}>
              <button className="page-link" onClick={() => goToPage(currentPage - 1)}>Trước</button>
            </li>
            {[...Array(totalPages)].map((_, index) => (
              <li key={index} className={`page-item ${currentPage === index + 1 && 'active'}`}>
                <button className="page-link" onClick={() => goToPage(index + 1)}>{index + 1}</button>
              </li>
            ))}
            <li className={`page-item ${currentPage === totalPages && 'disabled'}`}>
              <button className="page-link" onClick={() => goToPage(currentPage + 1)}>Sau</button>
            </li>
          </ul>
        </nav>
      </div>
    </MyCouponsPageLayout>
  );
};

export default MyOrders;

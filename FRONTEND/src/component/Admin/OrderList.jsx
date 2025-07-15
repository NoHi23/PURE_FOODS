import React, { useEffect, useState } from 'react';
import './jquery.dataTables.js';
import './custom-data-table.js';
import $ from 'jquery';
import 'datatables.net';
import TopBar from '../AdminDashboard/TopBar';
import SideBar from '../AdminDashboard/SideBar';
import axios from 'axios';
import * as bootstrap from 'bootstrap';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [editOrder, setEditOrder] = useState(null);
  const [statusName, setStatusName] = useState({});
  const [statuses, setStatuses] = useState([]);
  const [orderToDelete, setOrderToDelete] = useState(null);
  const [editForm, setEditForm] = useState({
    customerID: 0,
    orderDate: '',
    totalAmount: 0,
    statusID: 0,
    shippingAddress: '',
    shippingMethodID: 0,
    shippingCost: 0,
    distance: 0,
    discountAmount: 0,
    status: 1,
    estimatedDeliveryDate: '',
    driverID: 0,
    returnReason: ''
  });
  const navigate = useNavigate();

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    navigate(`/admin-order-detail/${order.orderId}`);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };

  const handleEditClick = (order) => {
    setEditOrder(order);
    setEditForm({
      customerID: order.customerID || 0,
      orderDate: order.orderDate || '',
      totalAmount: order.totalAmount || 0,
      statusID: order.statusID || 0,
      shippingAddress: order.shippingAddress || '',
      shippingMethodID: order.shippingMethodID || 0,
      shippingCost: order.shippingCost || 0,
      distance: order.distance || 0,
      discountAmount: order.discountAmount || 0,
      status: order.status !== undefined ? order.status : 1,
      estimatedDeliveryDate: order.estimatedDeliveryDate || '',
      driverID: order.driverID || 0,
      returnReason: order.returnReason || ''
    });
    const modal = new bootstrap.Modal(document.getElementById('editOrderModal'));
    modal.show();
  };

  const handleUpdateOrder = async () => {
    try {
      await axios.put(`http://localhost:8082/PureFoods/api/orders/update`, {
        orderId: editOrder.orderId,
        ...editForm
      });

      const res = await axios.get("http://localhost:8082/PureFoods/api/orders/all");
      setOrders(res.data.orders);

      const modal = bootstrap.Modal.getInstance(document.getElementById('editOrderModal'));
      modal.hide();

      toast.success('Order updated successfully!');
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Server error, please try again later.';
      toast.error(errorMessage);
    }
  };

  useEffect(() => {
    const tableId = '#table_id';

    const initTable = () => {
      if ($.fn.DataTable.isDataTable(tableId)) {
        $(tableId).DataTable().destroy();
      }

      $(tableId).DataTable({
        paging: false,
        ordering: false,
        info: false,
        responsive: true,
      });
    };

    if (orders.length > 0) {
      setTimeout(() => initTable(), 100);
    }
  }, [orders]);

  useEffect(() => {
    const sidebarLinks = document.querySelectorAll('.sidebar-link');

    const handleClick = (e) => {
      const nextEl = e.currentTarget.nextElementSibling;
      if (nextEl && nextEl.classList.contains('sidebar-submenu')) {
        e.preventDefault();
        nextEl.classList.toggle('show');
      }
    };

    sidebarLinks.forEach(link => {
      link.addEventListener('click', handleClick);
    });

    return () => {
      sidebarLinks.forEach(link => {
        link.removeEventListener('click', handleClick);
      });
    };
  }, []);

  useEffect(() => {
    axios.get("http://localhost:8082/PureFoods/api/orders/all")
      .then(res => setOrders(res.data.orders || []))
      .catch(err => {
        const errorMessage = err.response?.data?.message || 'Server error, failed to load orders.';
        toast.error(errorMessage);
      });
  }, []);

  useEffect(() => {
    const fetchStatuses = async () => {
      const newStatusNames = {};

      const uniqueStatusIds = [...new Set(orders.map(o => o.statusID))];

      await Promise.all(uniqueStatusIds.map(async (id) => {
        try {
          const res = await axios.get(`http://localhost:8082/PureFoods/api/order-statuses/${id}`);
          newStatusNames[id] = res.data.statusName;
        } catch (err) {
          newStatusNames[id] = 'Not found';
        }
      }));

      setStatusName(newStatusNames);
    };

    if (orders.length > 0) {
      fetchStatuses();
    }
  }, [orders]);

  useEffect(() => {
    axios.get("http://localhost:8082/PureFoods/api/order-statuses/getAll")
      .then(res => setStatuses(res.data.statusList || []))
      .catch(() => setStatuses([]));
  }, []);

  const handleDeleteOrder = async () => {
    if (!orderToDelete) return;

    try {
      await axios.put('http://localhost:8082/PureFoods/api/orders/delete', {
        orderId: orderToDelete.orderId
      });

      const res = await axios.get("http://localhost:8082/PureFoods/api/orders/all");
      setOrders(res.data.orders);

      toast.success('Order deleted successfully!');
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Server error, please try again later.';
      toast.error(errorMessage);
    }
  };

  return (
    <div>
      <div className="tap-top">
        <span className="lnr lnr-chevron-up"></span>
      </div>
      <div className="page-wrapper compact-wrapper" id="pageWrapper">
        <TopBar />
        <div className="page-body-wrapper">
          <SideBar />
          <div className="page-body">
            <div className="container-fluid">
              <div className="row">
                <div className="col-sm-12">
                  <div className="card card-table">
                    <div className="card-body">
                      <div className="title-header option-title d-flex justify-content-between align-items-center">
                        <h5>All Orders</h5>
                        <div className="d-flex">
                          <Link to={'/admin-order-create'} className="align-items-center btn btn-theme me-2">
                            <i data-feather="plus"></i>Add New
                          </Link>
                        
                        </div>
                      </div>
                      <div className="table-responsive table-product">
                        <table className="table all-package theme-table" id="table_id">
                          <thead>
                            <tr>
                              <th style={{ textAlign: 'center' }}>Order ID</th>
                              <th style={{ textAlign: 'center' }}>Customer ID</th>
                              <th style={{ textAlign: 'center' }}>Order Date</th>
                              <th style={{ textAlign: 'center' }}>Total Amount</th>
                              <th style={{ textAlign: 'center' }}>Status ID</th>
                              <th style={{ textAlign: 'center' }}>Shipping Address</th>
                              <th style={{ textAlign: 'center' }}>Shipping Method ID</th>
                              <th style={{ textAlign: 'center' }}>Shipping Cost</th>
                              <th style={{ textAlign: 'center' }}>Distance</th>
                              <th style={{ textAlign: 'center' }}>Discount Amount</th>
                              <th style={{ textAlign: 'center' }}>Status</th>
                              <th style={{ textAlign: 'center' }}>Estimated Delivery Date</th>
                              <th style={{ textAlign: 'center' }}>Driver ID</th>
                              <th style={{ textAlign: 'center' }}>Return Reason</th>
                              <th style={{ textAlign: 'center' }}>Options</th>
                            </tr>
                          </thead>
                          <tbody>
                            {orders?.map((o, i) => (
                              <tr key={i}>
                                <td style={{ textAlign: 'center' }}>{o.orderId}</td>
                                <td style={{ textAlign: 'center' }}>{o.customerID || 'N/A'}</td>
                                <td style={{ textAlign: 'center' }}>{o.orderDate ? new Date(o.orderDate).toLocaleString() : 'N/A'}</td>
                                <td style={{ textAlign: 'center' }}>{o.totalAmount || 0}</td>
                                <td style={{ textAlign: 'center' }}>{statusName[o.statusID] || o.statusID || 'N/A'}</td>
                                <td style={{ textAlign: 'center' }}>{o.shippingAddress || 'N/A'}</td>
                                <td style={{ textAlign: 'center' }}>{o.shippingMethodID || 'N/A'}</td>
                                <td style={{ textAlign: 'center' }}>{o.shippingCost || 0}</td>
                                <td style={{ textAlign: 'center' }}>{o.distance || 0}</td>
                                <td style={{ textAlign: 'center' }}>{o.discountAmount || 0}</td>
                                <td style={{ textAlign: 'center' }}>{o.status !== undefined ? o.status : 'N/A'}</td>
                                <td style={{ textAlign: 'center' }}>{o.estimatedDeliveryDate ? new Date(o.estimatedDeliveryDate).toLocaleString() : 'N/A'}</td>
                                <td style={{ textAlign: 'center' }}>{o.driverID || 'N/A'}</td>
                                <td style={{ textAlign: 'center' }}>{o.returnReason || 'N/A'}</td>
                                <td style={{ textAlign: 'center' }}>
                                  <ul>
                                    <li>
                                      <a href="#" onClick={(e) => {
                                        e.preventDefault();
                                        handleViewOrder(o);
                                      }}>
                                        <i className="ri-eye-line"></i>
                                      </a>
                                    </li>
                                    <li>
                                      <a href="#" onClick={() => handleEditClick(o)}>
                                        <i className="ri-pencil-line"></i>
                                      </a>
                                    </li>
                                    <li>
                                      <a href="#" data-bs-toggle="modal" data-bs-target="#exampleModalToggle" onClick={() => setOrderToDelete(o)}>
                                        <i className="ri-delete-bin-line"></i>
                                      </a>
                                    </li>
                                  </ul>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal fade" id="editOrderModal" tabIndex="-1">
              <div className="modal-dialog modal-dialog-centered modal-lg">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Update Order</h5>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
                  </div>
                  <div className="modal-body">
                    <form>
                      <div className="mb-3">
                        <label className="form-label">Customer ID</label>
                        <input type="number" className="form-control" name="customerID" value={editForm.customerID} onChange={handleInputChange} min={0} />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Order Date</label>
                        <input type="datetime-local" className="form-control" name="orderDate" value={editForm.orderDate} onChange={handleInputChange} />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Total Amount</label>
                        <input type="number" className="form-control" name="totalAmount" value={editForm.totalAmount} onChange={handleInputChange} step="0.01" min={0} />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Status ID</label>
                        <select className="form-control" name="statusID" value={editForm.statusID} onChange={handleInputChange}>
                          {statuses.map(s => (
                            <option key={s.statusID} value={s.statusID}>{s.statusName}</option>
                          ))}
                        </select>
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Shipping Address</label>
                        <input type="text" className="form-control" name="shippingAddress" value={editForm.shippingAddress} onChange={handleInputChange} />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Shipping Method ID</label>
                        <input type="number" className="form-control" name="shippingMethodID" value={editForm.shippingMethodID} onChange={handleInputChange} min={0} />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Shipping Cost</label>
                        <input type="number" className="form-control" name="shippingCost" value={editForm.shippingCost} onChange={handleInputChange} step="0.01" min={0} />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Distance</label>
                        <input type="number" className="form-control" name="distance" value={editForm.distance} onChange={handleInputChange} step="0.01" min={0} />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Discount Amount</label>
                        <input type="number" className="form-control" name="discountAmount" value={editForm.discountAmount} onChange={handleInputChange} step="0.01" min={0} />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Status</label>
                        <select className="form-control" name="status" value={editForm.status} onChange={handleInputChange}>
                          <option value={1}>Active</option>
                          <option value={0}>Inactive</option>
                        </select>
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Estimated Delivery Date</label>
                        <input type="datetime-local" className="form-control" name="estimatedDeliveryDate" value={editForm.estimatedDeliveryDate} onChange={handleInputChange} />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Driver ID</label>
                        <input type="number" className="form-control" name="driverID" value={editForm.driverID} onChange={handleInputChange} min={0} />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Return Reason</label>
                        <input type="text" className="form-control" name="returnReason" value={editForm.returnReason} onChange={handleInputChange} />
                      </div>
                    </form>
                  </div>
                  <div className="modal-footer">
                    <button className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button className="btn btn-primary" onClick={handleUpdateOrder}>Save Changes</button>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1">
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                  <div className="modal-body">
                    <h5 className="modal-title" id="staticBackdropLabel">Logging Out</h5>
                    <p>Are you sure you want to log out?</p>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    <div className="button-box">
                      <button type="button" className="btn btn--no" data-bs-dismiss="modal">No</button>
                      <button type="button" className="btn btn--yes btn-primary">Yes</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal fade theme-modal remove-coupon" id="exampleModalToggle" aria-hidden="true" tabIndex="-1">
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                  <div className="modal-header d-block text-center">
                    <h5 className="modal-title w-100" id="exampleModalLabel22">Are You Sure?</h5>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close">
                      <i className="fas fa-times"></i>
                    </button>
                  </div>
                  <div className="modal-body">
                    <div className="remove-box">
                      <p>The permission for the use/group, preview is inherited from the object, object will create a new permission for this object</p>
                    </div>
                  </div>
                  <div className="modal-body">
                    <button type="button" className="btn btn-animation btn-md fw-bold" data-bs-dismiss="modal">No</button>
                    <button
                      type="button"
                      className="btn btn-animation btn-md fw-bold"
                      data-bs-dismiss="modal"
                      onClick={handleDeleteOrder}
                    >
                      Yes
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal fade theme-modal remove-coupon" id="exampleModalToggle2" aria-hidden="true" tabIndex="-1">
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title text-center" id="exampleModalLabel12">Done!</h5>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close">
                      <i className="fas fa-times"></i>
                    </button>
                  </div>
                  <div className="modal-body">
                    <div className="remove-box text-center">
                      <div className="wrapper">
                        <svg className="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                          <circle className="checkmark__circle" cx="26" cy="26" r="25" fill="none" />
                          <path className="checkmark__check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
                        </svg>
                      </div>
                      <h4 className="text-content">It's Removed.</h4>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button className="btn btn-primary" data-bs-toggle="modal" data-bs-dismiss="modal">Close</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderList;

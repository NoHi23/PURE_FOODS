import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import * as bootstrap from 'bootstrap';
import TopBar from '../AdminDashboard/TopBar';
import SideBar from '../AdminDashboard/SideBar';
import { Link } from 'react-router-dom';

const OrderCreate = () => {
  const [formData, setFormData] = useState({
    customerID: '',
    orderDate: new Date().toISOString().slice(0, 16),
    totalAmount: 0,
    statusID: '',
    shippingAddress: '', // Đảm bảo khởi tạo với chuỗi rỗng
    shippingMethodID: '',
    shippingCost: 0,
    distance: 0,
    discountAmount: 0,
    estimatedDeliveryDate: '',
    driverID: '',
    returnReason: ''
  });
  const [customers, setCustomers] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [shippingMethods, setShippingMethods] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [customersRes, statusesRes, shippingRes, driversRes] = await Promise.all([
          axios.get('http://localhost:8082/PureFoods/api/users/getAll'),
          axios.get('http://localhost:8082/PureFoods/api/order-statuses/getAll'),
          axios.get('http://localhost:8082/PureFoods/api/shipping-methods/getAll'),
          axios.get('http://localhost:8082/PureFoods/api/drivers/getAll')
        ]);
        setCustomers(customersRes.data.userList);
        setStatuses(statusesRes.data.statusList);
        setShippingMethods(shippingRes.data.shippingMethods);
        setDrivers(driversRes.data.drivers);
      } catch (err) {
        toast.error('Error fetching options: ' + (err.response?.data?.message || 'Server error'));
      }
    };
    fetchOptions();
  }, []);
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' })); // Xóa lỗi khi người dùng nhập
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.customerID) newErrors.customerID = 'Customer ID is required';
    if (!formData.orderDate) newErrors.orderDate = 'Order Date is required';
    if (!formData.totalAmount || formData.totalAmount <= 0) newErrors.totalAmount = 'Total Amount must be greater than 0';
    if (!formData.statusID) newErrors.statusID = 'Status ID is required';
    if (!formData.shippingAddress || formData.shippingAddress.trim() === '') newErrors.shippingAddress = 'Shipping Address is required';
    if (!formData.shippingMethodID) newErrors.shippingMethodID = 'Shipping Method ID is required';
    if (!formData.shippingCost || formData.shippingCost < 0) newErrors.shippingCost = 'Shipping Cost must be non-negative';
    if (!formData.distance || formData.distance < 0) newErrors.distance = 'Distance must be non-negative';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Log dữ liệu trước khi gửi để debug
    console.log('Submitting data:', formData);

    // Đảm bảo các trường không bắt buộc có giá trị mặc định
    const submitData = {
      ...formData,
      cancelReason: formData.cancelReason || '',
      delayReason: formData.delayReason || '',
      status: formData.status || 1 // Giả định trạng thái mặc định là 1 nếu không có
    };

    try {
      await axios.post('http://localhost:8082/PureFoods/api/orders/create', submitData, {
        headers: { 'Content-Type': 'application/json' }
      });
      toast.success('Order created successfully!');
      const modal = bootstrap.Modal.getInstance(document.getElementById('successModal'));
      if (modal) modal.show();
    } catch (err) {
      toast.error('Error creating order: ' + (err.response?.data?.message || 'Server error'));
      console.error('Error details:', err.response); // Debug chi tiết lỗi
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
              <h1>Create New Order</h1>
              <div className="card">
                <div className="card-body">
                  <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <label className="form-label">Customer ID</label>
                      <select className="form-control" name="customerID" value={formData.customerID} onChange={handleInputChange} required>
                        <option value="">Select Customer</option>
                        {customers.map(customer => (
                          <option key={customer.userID} value={customer.userID}>{customer.fullName} ({customer.email})</option>
                        ))}
                      </select>
                      {errors.customerID && <div className="text-danger">{errors.customerID}</div>}
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Order Date</label>
                      <input type="datetime-local" className="form-control" name="orderDate" value={formData.orderDate} onChange={handleInputChange} required />
                      {errors.orderDate && <div className="text-danger">{errors.orderDate}</div>}
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Total Amount</label>
                      <input type="number" className="form-control" name="totalAmount" value={formData.totalAmount} onChange={handleInputChange} step="0.01" min="0" required />
                      {errors.totalAmount && <div className="text-danger">{errors.totalAmount}</div>}
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Status ID</label>
                      <select className="form-control" name="statusID" value={formData.statusID} onChange={handleInputChange} required>
                        <option value="">Select Status</option>
                        {statuses.map(status => (
                          <option key={status.statusID} value={status.statusID}>{status.statusName}</option>
                        ))}
                      </select>
                      {errors.statusID && <div className="text-danger">{errors.statusID}</div>}
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Shipping Address</label>
                      <input type="text" className="form-control" name="shippingAddress" value={formData.shippingAddress} onChange={handleInputChange} required />
                      {errors.shippingAddress && <div className="text-danger">{errors.shippingAddress}</div>}
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Shipping Method ID</label>
                      <select className="form-control" name="shippingMethodID" value={formData.shippingMethodID} onChange={handleInputChange} required>
                        <option value="">Select Shipping Method</option>
                        {shippingMethods.map(method => (
                          <option key={method.shippingMethodID} value={method.shippingMethodID}>{method.methodName}</option>
                        ))}
                      </select>
                      {errors.shippingMethodID && <div className="text-danger">{errors.shippingMethodID}</div>}
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Shipping Cost</label>
                      <input type="number" className="form-control" name="shippingCost" value={formData.shippingCost} onChange={handleInputChange} step="0.01" min="0" required />
                      {errors.shippingCost && <div className="text-danger">{errors.shippingCost}</div>}
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Distance</label>
                      <input type="number" className="form-control" name="distance" value={formData.distance} onChange={handleInputChange} step="0.01" min="0" required />
                      {errors.distance && <div className="text-danger">{errors.distance}</div>}
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Discount Amount</label>
                      <input type="number" className="form-control" name="discountAmount" value={formData.discountAmount} onChange={handleInputChange} step="0.01" min="0" />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Estimated Delivery Date</label>
                      <input type="datetime-local" className="form-control" name="estimatedDeliveryDate" value={formData.estimatedDeliveryDate} onChange={handleInputChange} />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Driver ID</label>
                      <select className="form-control" name="driverID" value={formData.driverID} onChange={handleInputChange}>
                        <option value="">Select Driver (Optional)</option>
                        {drivers.map(driver => (
                          <option key={driver.driverID} value={driver.driverID}>{driver.driverName}</option>
                        ))}
                      </select>
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Return Reason</label>
                      <input type="text" className="form-control" name="returnReason" value={formData.returnReason} onChange={handleInputChange} />
                    </div>
                    <button type="submit" className="btn btn-primary">Create Order</button>
                  </form>
                </div>
              </div>

              {/* Modal thành công */}
              <div className="modal fade" id="successModal" tabIndex="-1" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title">Success</h5>
                      <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                      <p>Order created successfully!</p>
                    </div>
                    <div className="modal-footer">
                      <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                      <Link to="/admin-order-list" className="btn btn-primary">View Orders</Link>
                    </div>
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

export default OrderCreate;
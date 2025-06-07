import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import HomePage from './component/HomePage/HomePage';
import LoginPage from './component/Login/LoginPage';
import Dashboard from './pages/dashboard';
import SignUp from './component/SignUp/SignUp';
import ExportRequestForm from './pages/dashboard/ExportRequestForm';
import InventoryCheck from './pages/dashboard/InventoryCheck';
import ConfirmOrder from './pages/dashboard/ConfirmOrder';
import RejectOrder from './pages/dashboard/RejectOrder';
import PaymentCheck from './pages/dashboard/PaymentCheck';
import RequestPayment from './pages/dashboard/RequestPayment';
import PrepareDelivery from './pages/dashboard/PrepareDelivery';
import UpdateDeliveryStatus from './pages/dashboard/UpdateDeliveryStatus';
import ConfirmDelivery from './pages/dashboard/ConfirmDelivery';
import Notification from './pages/dashboard/Notification';
import ExportRequestList from './pages/dashboard/ExportRequestList';
import { Link } from 'react-router-dom';
function App() {

  return (
    <BrowserRouter>
    <div className="p-4">
        <nav className="bg-gray-800 text-white p-4 mb-4 rounded-md">
          <ul className="flex space-x-4">
            <li><Link to="/create-request">Tạo Yêu Cầu</Link></li>
            <li><Link to="/request-list">Danh Sách Yêu Cầu</Link></li>
            <li><Link to="/inventory-check">Kiểm Tra Kho</Link></li>
            <li><Link to="/confirm-order">Xác Nhận Đơn</Link></li>
            <li><Link to="/reject-order">Từ Chối Đơn</Link></li>
            <li><Link to="/payment-check">Kiểm Tra Thanh Toán</Link></li>
            <li><Link to="/request-payment">Yêu Cầu Thanh Toán</Link></li>
            <li><Link to="/prepare-delivery">Chuẩn Bị Giao Hàng</Link></li>
            <li><Link to="/update-delivery">Cập Nhật Giao Hàng</Link></li>
            <li><Link to="/confirm-delivery">Xác Nhận Giao Hàng</Link></li>
            <li><Link to="/notification">Gửi Thông Báo</Link></li>
          </ul>
        </nav>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path='/signup' element={<SignUp />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/create-request" element={<ExportRequestForm />} />
        <Route path="/request-list" element={<ExportRequestList />} />
        <Route path="/inventory-check" element={<InventoryCheck />} />
        <Route path="/confirm-order" element={<ConfirmOrder />} />
        <Route path="/reject-order" element={<RejectOrder />} />
        <Route path="/payment-check" element={<PaymentCheck />} />
        <Route path="/request-payment" element={<RequestPayment />} />
        <Route path="/prepare-delivery" element={<PrepareDelivery />} />
        <Route path="/update-delivery" element={<UpdateDeliveryStatus />} />
        <Route path="/confirm-delivery" element={<ConfirmDelivery />} />
        <Route path="/notification" element={<Notification />} />
      </Routes>
    </div>
    </BrowserRouter>
  );
}

export default App;

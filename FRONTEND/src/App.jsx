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
import AdminDashboard from './component/AdminDashboard/AdminDashboard';
import ExportShipmentDashboard from './pages/dashboard/ExportShipmentDashboard';
import DashboardLayout from './components/dashboard/Layout';
function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path='/signup' element={<SignUp />} />
         <Route element={<DashboardLayout />}>
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
        <Route path='/admin-dashboard' element={<AdminDashboard/>} />
         <Route path='/exportShipment' element={<ExportShipmentDashboard/>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

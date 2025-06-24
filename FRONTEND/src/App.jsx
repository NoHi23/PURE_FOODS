import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import HomePage from './component/HomePage/HomePage';
import LoginPage from './component/Login/LoginPage';
import SignUp from './component/SignUp/SignUp';
import AdminDashboard from './component/AdminDashboard/AdminDashboard';
import ImporterDashboard from './component/Importer/ImporterDashboard';
import TraderDashboard from './component/WholeSaler/TraderDashboard';
import Product from './component/Admin/Product';
import Forgot from './component/Login/Forgot';
import { Bounce } from 'react-toastify';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import PrivateRoute from './PrivateRoute';
import AddNewProduct from './component/Admin/AddNewProduct';
import ResetPassword from './component/Login/ResetPassword';
import VerifyOtp from './component/Login/VerifyOtp';
import Category from './component/Admin/Category';
import AllUser from './component/Admin/AllUser';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/forgot" element={<Forgot />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />

          {/* Các route cần đăng nhập */}
          <Route path="/admin-dashboard" element={
            <PrivateRoute allowedRoles={1}>
              <AdminDashboard />
            </PrivateRoute>
          } />
          <Route path="/admin-product" element={
            <PrivateRoute allowedRoles={1}>
              <Product />
            </PrivateRoute>
          } />
          <Route path="/admin-add-new-product" element={
            <PrivateRoute allowedRoles={1}>
              <AddNewProduct />
            </PrivateRoute>
          } />
          <Route path="/category" element={
            <PrivateRoute allowedRoles={1}>
              <Category />
            </PrivateRoute>
          } />
          <Route path="/all-user" element={
            <PrivateRoute allowedRoles={1}>
              <AllUser />
            </PrivateRoute>
          } />
          {/* Các route dành cho Người nhập hàng - Importer */}
          <Route path="/importer" element={
            <PrivateRoute allowedRoles={4}>
              <ImporterDashboard />
            </PrivateRoute>
          } />
          {/* Các route dành cho người buôn hàng (Trader; seller; wholesaler) */}
          <Route path="/wholesaler" element={
            <PrivateRoute allowedRoles={3}>
              <TraderDashboard />
            </PrivateRoute>
          } />

        </Routes>
      </BrowserRouter>
      <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover={false}
        theme="light"
        transition={Bounce}
      />
    </>
  );
}

export default App;

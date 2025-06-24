import './App.css';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
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
import Footer from './layouts/Footer';
import Header from './layouts/Header';
import BackToTopButton from './layouts/BackToTopButton';

function AppContent() {
  const location = useLocation();
  // Danh sách các path KHÔNG muốn hiện header và footer
  const hideHeaderPaths = ['/login', '/signup', '/forgot', '/reset-password', '/verify-otp', '/admin-dashboard', '/admin-product', '/admin-add-new-product',
    '/category', '/all-user'
  ];
  const hideFooterPaths = ['/login', '/signup', '/forgot', '/reset-password', '/verify-otp', '/admin-dashboard', '/admin-product', '/admin-add-new-product',
    '/category', '/all-user'
  ];
  const backToTop = ['/login', '/signup', '/forgot', '/reset-password', '/verify-otp', '/'];

  const shouldHideHeader = hideHeaderPaths.includes(location.pathname);
  const shouldHideFooter = hideFooterPaths.includes(location.pathname);
  const shouldHideBackToTop = backToTop.includes(location.pathname);

  return (
    <>
      {!shouldHideHeader && <Header />}
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
      {/* Chỉ hiện Footer nếu không nằm trong blacklist và user tồn tại*/}
      {!shouldHideFooter && <Footer />}
      {!shouldHideBackToTop && <BackToTopButton />}
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
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
    </BrowserRouter>
  );
}

export default App;

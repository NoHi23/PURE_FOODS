import './App.css';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import HomePage from './component/HomePage/HomePage';
import LoginPage from './component/Login/LoginPage';
import SignUp from './component/SignUp/SignUp';
import AdminDashboard from './component/AdminDashboard/AdminDashboard';
import ImporterDashboard from './component/Importer/ImporterDashboard';
import TraderDashboard from './component/Trader/TraderDashboard';
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
import AddNewCategory from './component/Admin/AddNewCategory';
import Supplier from './component/Admin/Supplier';
import AddNewSupplier from './component/Admin/AddNewSupplier';
import AllUser from './component/Admin/AllUser';
import Footer from './layouts/Footer';
import Header from './layouts/Header';
import BackToTopButton from './layouts/BackToTopButton';
import AllRole from './component/Admin/AllRole';
import AddNewUser from './component/Admin/AddNewUser';
import AddNewRole from './component/Admin/AddNewRole';
import OrderList from './component/Admin/OrderList';
import OrderDetail from './component/Admin/OrderDetail';
import OrderTracking from './component/Admin/OrderTracking';
import OrderCreate from './component/Admin/OrderCreate';

function AppContent() {
  const location = useLocation();
  // Danh sách các path KHÔNG muốn hiện header và footer
  const hideHeaderPaths = [
    '/login', '/signup', '/forgot', '/reset-password', '/verify-otp', '/admin-dashboard', '/admin-product',
    '/admin-add-new-product', '/category', '/all-user', '/all-role', '/add-new-user', '/add-new-role',
    '/admin-order-list', '/admin-order-detail/:orderId', '/admin-order-tracking'
  ];
  const hideFooterPaths = [
    '/login', '/signup', '/forgot', '/reset-password', '/verify-otp', '/admin-dashboard', '/admin-product',
    '/admin-add-new-product', '/category', '/all-user', '/all-role', '/add-new-user', '/add-new-role',
    '/admin-order-list', '/admin-order-detail/:orderId', '/admin-order-tracking'
  ];
  const backToTop = ['/login', '/signup', '/forgot', '/reset-password', '/verify-otp', '/', "/wishlist"];

  const shouldHideHeader = hideHeaderPaths.some(path => location.pathname.startsWith(path.split(':')[0]));
  const shouldHideFooter = hideFooterPaths.some(path => location.pathname.startsWith(path.split(':')[0]));
  const shouldHideBackToTop = backToTop.includes(location.pathname);

  const showAIChatPaths = ['/', '/wishlist'];
  const shouldShowAIChat = showAIChatPaths.includes(location.pathname);


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
        <Route path="/admin-category" element={
          <PrivateRoute allowedRoles={1}>
            <Category />
          </PrivateRoute>
        } />
        <Route path="/admin-add-new-category" element={
          <PrivateRoute allowedRoles={1}>
            <AddNewCategory />
          </PrivateRoute>
        } />
        <Route path="/admin-supplier" element={
          <PrivateRoute allowedRoles={1}>
            <Supplier />
          </PrivateRoute>
        } />
        <Route path="/admin-add-new-supplier" element={
          <PrivateRoute allowedRoles={1}>
            <AddNewSupplier />
          </PrivateRoute>
        } />
        <Route path="/all-user" element={
          <PrivateRoute allowedRoles={1}>
            <AllUser />
          </PrivateRoute>
        } />
        <Route path="/all-role" element={
          <PrivateRoute allowedRoles={1}>
            <AllRole />
          </PrivateRoute>
        } />
        <Route path="/add-new-user" element={
          <PrivateRoute allowedRoles={1}>
            <AddNewUser />
          </PrivateRoute>
        } />
        <Route path="/add-new-role" element={
          <PrivateRoute allowedRoles={1}>
            <AddNewRole />
          </PrivateRoute>
        } />

        {/* Các Order dành cho Admin */}
        <Route path="/admin-order-list" element={
          <PrivateRoute allowedRoles={1}>
            <OrderList />
          </PrivateRoute>
        } />
        <Route path="/admin-order-detail/:orderId" element={
          <PrivateRoute allowedRoles={1}>
            <OrderDetail />
          </PrivateRoute>
        } />
        <Route path="/admin-order-tracking" element={
          <PrivateRoute allowedRoles={1}>
            <OrderTracking />
          </PrivateRoute>
        } />
        <Route path="/admin-order-create" element={
          <PrivateRoute allowedRoles={1}>
            <OrderCreate />
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
      {/* Chỉ hiện Footer nếu không nằm trong blacklist và user tồn tại */}
      {!shouldHideFooter && <Footer />}
      {!shouldHideBackToTop && <BackToTopButton />}
      {shouldShowAIChat && <AIChatWidget />}
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
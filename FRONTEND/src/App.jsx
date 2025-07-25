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
import Order from './component/Admin/Order';
import Wishlist from './component/Wishlist/Wishlist';
import AIChatWidget from './component/GeminiAISetup/AIChatWidget';
import CartDetail from './component/Cart/CartDetail';
import CustomerProfileUpdate from './component/Customer/CustomerProfileUpdate';
import { WishlistProvider } from './layouts/WishlistContext';
import ProductDetail from './component/ProductDetail/ProductDetail';
import Checkout from './component/Checkout/Checkout';
import Coupons from './component/Admin/Coupons';
import AddNewCoupons from './component/Admin/AddNewCoupons';
import Taxes from './component/Admin/Taxes';
import AddNewTax from './component/Admin/AddNewTax';
import Blog from './component/Admin/Blog';
import AddNewBlog from './component/Admin/AddNewBlog';
import ProductReview from './component/AdminDashboard/ProductReview';

//import CustomerBlog from './component/CustomerBlog';
//import BlogDetail from './component/BlogDetail';
import DashboardCategory from './component/ShopLeftSidebar/DashboardCategory';
import OrderSuccess from './component/OrderSuccess/OrderSuccess';
import SpinWheelButton from './component/SpinWheelPage/SpinWheelButton';
import AllProducts from './component/All Products/AllProducts';
import MyCouponsPage from './component/MyCouponsPage/MyCouponsPage';
import Notitications from './component/Notifications/Notifications';
{/*import CustomerBlog from './component/CustomerBlog';
import BlogDetail from './component/BlogDetail';*/}

function AppContent() {
  const location = useLocation();
  const isProductDetail = location.pathname.startsWith('/product/');
  const isCheckout = location.pathname.startsWith('/checkout/');

  const hideHeaderPaths = [
    '/login', '/signup', '/forgot', '/reset-password', '/verify-otp',
    '/admin-dashboard', '/admin-product', '/admin-add-new-product',
    '/admin-category', '/admin-add-new-category', '/admin-supplier',
    '/admin-add-new-supplier', '/all-user', '/all-role', '/add-new-user',
    '/add-new-role', '/admin-order',
    '/admin-coupons', '/admin-add-new-coupons', '/admin-taxes',
    '/admin-add-new-tax', '/admin-blog', '/admin-add-new-blog',

  ];

  const hideFooterPaths = [...hideHeaderPaths];

  const backToTopPaths = [
    '/login', '/signup', '/forgot', '/reset-password', '/verify-otp',
    '/', '/wishlist', '/order-success', "/my-coupons"
  ];

  const aiChatPaths = ['/', '/wishlist', '/my-coupons'];

  const shouldHideHeader = hideHeaderPaths.includes(location.pathname);
  const shouldHideFooter = hideFooterPaths.includes(location.pathname);
  const shouldHideBackToTop = backToTopPaths.includes(location.pathname) || isProductDetail || isCheckout;
  const shouldShowAIChat = aiChatPaths.includes(location.pathname) || isProductDetail || isCheckout;

  const spinPaths = ['/', '/wishlist', '/cart-detail', '/my-coupons'];
  const shouldShowSpin = spinPaths.includes(location.pathname);


  return (
    <>
      {!shouldHideHeader && <Header />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/category" element={<DashboardCategory />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgot" element={<Forgot />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />

        <Route path="/admin-dashboard" element={
          <PrivateRoute allowedRoles={1}>
            <AdminDashboard />
          </PrivateRoute>
        } />
        <Route path="/product/:id" element={<ProductDetail />} />
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
        <Route path="/admin-order" element={
          <PrivateRoute allowedRoles={1}>
            <Order />
          </PrivateRoute>
        } />
        <Route path="/admin-coupons" element={
          <PrivateRoute allowedRoles={1}>
            <Coupons />
          </PrivateRoute>
        } />
        <Route path="/admin-add-new-coupons" element={
          <PrivateRoute allowedRoles={1}>
            <AddNewCoupons />
          </PrivateRoute>
        } />
        <Route path="/admin-taxes" element={
          <PrivateRoute allowedRoles={1}>
            <Taxes />
          </PrivateRoute>
        } />
        <Route path="/admin-add-new-tax" element={
          <PrivateRoute allowedRoles={1}>
            <AddNewTax />
          </PrivateRoute>
        } />
        <Route path="/admin-blog" element={
          <PrivateRoute allowedRoles={1}>
            <Blog />
          </PrivateRoute>
        } />
        <Route path="/admin-add-new-blog" element={
          <PrivateRoute allowedRoles={1}>
            <AddNewBlog />
          </PrivateRoute>
        } />
        <Route path="/admin-product-review" element={
  <PrivateRoute allowedRoles={1}>
    <ProductReview />
  </PrivateRoute>
} />


        {/* Customer Routes 
        <Route path="/wishlist" element={
          <PrivateRoute allowedRoles={2}>
            <Wishlist />
          </PrivateRoute>
        } />

        {/* Trader Routes 
        <Route path="/wholesaler" element={
          <PrivateRoute allowedRoles={3}>
            <TraderDashboard />
          </PrivateRoute>
        } /> */}

        <Route path="/all-products" element={
          <PrivateRoute allowedRoles={2}>
            <AllProducts />
          </PrivateRoute>
        } />
        <Route path="/my-coupons" element={
          <PrivateRoute allowedRoles={2}>
            <MyCouponsPage />
          </PrivateRoute>
        } />

        <Route path="/cart-detail" element={
          <PrivateRoute allowedRoles={2}>
            <CartDetail />
          </PrivateRoute>
        } />

        <Route path="/notifications" element={
          <PrivateRoute allowedRoles={2}>
            <Notitications />
          </PrivateRoute>
        } />

        <Route path="/customer-profile-update" element={
          <PrivateRoute allowedRoles={2}>
            <CustomerProfileUpdate />
          </PrivateRoute>
        } />

        <Route path="/wishlist" element={
          <PrivateRoute allowedRoles={2}>
            <Wishlist />
          </PrivateRoute>
        } />

        <Route path="/checkout/:id" element={
          <PrivateRoute allowedRoles={2}>
            <Checkout />
          </PrivateRoute>
        } />

        <Route path="/order-success/:id" element={
          <PrivateRoute allowedRoles={2}>
            <OrderSuccess />
          </PrivateRoute>
        } />

        <Route path="/importer" element={
          <PrivateRoute allowedRoles={4}>
            <ImporterDashboard />
          </PrivateRoute>
        } />
        <Route path="/wholesaler" element={
          <PrivateRoute allowedRoles={3}>
            <TraderDashboard />
          </PrivateRoute>
        } />
      </Routes>
      {!shouldHideFooter && <Footer />}
      {!shouldHideBackToTop && <BackToTopButton />}
      {shouldShowAIChat && <AIChatWidget />}
      {shouldShowSpin && <SpinWheelButton />}

    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <WishlistProvider>
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
          style={{ zIndex: 99999 }}
        />
      </WishlistProvider>
    </BrowserRouter>
  );
}

export default App;
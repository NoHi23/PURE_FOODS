import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import HomePage from './component/HomePage/HomePage';
import LoginPage from './component/Login/LoginPage';
import SignUp from './component/SignUp/SignUp';
import AdminDashboard from './component/AdminDashboard/AdminDashboard';

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path='/signup' element={<SignUp />} />
        <Route path='/admin-dashboard' element={<AdminDashboard/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

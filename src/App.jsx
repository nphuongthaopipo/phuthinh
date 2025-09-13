import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import TranslationPage from './pages/TranslationPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ManagementPage from './pages/ManagementPage';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute'; // Import component ProtectedRoute
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <Router>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <Routes>
        {/* Các route công khai không cần Layout, ví dụ: đăng nhập, đăng ký */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        {/* Các route được bảo vệ, hiển thị Header và Sidebar */}
        <Route element={<Layout />}>
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/translation" element={<TranslationPage />} />
            <Route path="/management/upload" element={<ManagementPage />} /> {/* Route mới */}

            <Route path="/management" element={<div>Trang Quản lý</div>} />
            <Route path="/task-management" element={<div>Trang Quản lý Nhiệm vụ</div>} />
            <Route path="/government-connect" element={<div>Trang Kết nối Chính phủ</div>} />
            <Route path="/employees" element={<div>Trang Quản lý Nhân viên</div>} />
            <Route path="/customers" element={<div>Trang Quản lý Khách hàng</div>} />
            <Route path="/accounting" element={<div>Trang Kế toán</div>} />
            <Route path="/users" element={<div>Trang Người dùng</div>} />
            <Route path="/digital-signature" element={<div>Trang Quản lý Chữ ký số</div>} />
            <Route path="/products-services" element={<div>Trang Quản lý Sản phẩm/Dịch vụ</div>} />
          </Route>
        </Route>
        
        {/* Route cho trang 404 Not Found */}
        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </Router>
  );
}

export default App;
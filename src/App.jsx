import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Import các trang giao diện của bạn
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import CreateEventPage from './pages/CreateEventPage';

// Import Layout chứa thanh Navbar màu đỏ đô cố định
import MainLayout from './components/MainLayout'; 

function App() {
  return (
    <Router>
      <Routes>
        {/* 1. SỬA LỖI: Vào trang chủ "/" sẽ chuyển hướng chính xác đến "/organizer/login" */}
        <Route path="/" element={<Navigate to="/organizer/login" replace />} />
        
        {/* 2. CHUẨN HÓA: Thêm dấu "/" vào trước các URL để đảm bảo định tuyến tuyệt đối */}
        <Route path="/organizer/login" element={<LoginPage />} />
        <Route path="/organizer/register" element={<RegisterPage />} />

        {/* 3. LAYOUT CHUNG: Giữ cố định Navbar phía trên cho Dashboard và Form tạo sự kiện */}
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/create-event" element={<CreateEventPage />} />
        </Route>

        {/* 4. DỰ PHÒNG 404: Tránh việc màn hình bị trắng nếu lỡ gõ sai bất kỳ ký tự nào trên URL */}
        <Route 
          path="*" 
          element={
            <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-500 font-semibold">
              Trang quản trị không tồn tại hoặc bạn nhập sai đường dẫn.
            </div>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;
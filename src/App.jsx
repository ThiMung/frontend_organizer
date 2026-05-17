import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Import các trang giao diện dành riêng cho Organizer
// import OrganizerLoginPage from './pages/OrganizerLoginPage';
// import OrganizerRegisterPage from './pages/OrganizerRegisterPage';
import CreateEventPage from './pages/CreateEventPage';

function App() {
  return (
    <Router>
      <Routes>
        {/* 1. Vào trang chủ "/" là tự động chuyển hướng thẳng sang màn hình Login luôn */}
        {/* <Route path="/" element={<Navigate to="/login" replace />} /> */}

        {/* 2. Các tuyến đường (Routes) rút gọn, sạch sẽ vì hệ thống chỉ phục vụ Organizer */}
        {/* <Route path="/login" element={<OrganizerLoginPage />} /> */}
        {/* <Route path="/register" element={<OrganizerRegisterPage />} /> */}
        <Route path="/create-event" element={<CreateEventPage />} />

        {/* 3. Trang hiển thị lỗi 404 khi gõ sai URL */}
        <Route 
          path="*" 
          element={
            <div className="min-h-screen flex items-center justify-center bg-slate-100">
              <div className="text-center">
                <h1 className="text-4xl font-black text-slate-300 mb-2">404</h1>
                <p className="text-slate-500 font-medium">Trang quản trị không tồn tại.</p>
              </div>
            </div>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;
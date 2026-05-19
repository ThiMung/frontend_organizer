# Community Event Platform - Organizer Portal (Frontend Organizer)

Ứng dụng quản trị và điều hành dành riêng cho **Ban tổ chức (Organizer)**. Ứng dụng chịu trách nhiệm khởi tạo sự kiện (Draft), phê duyệt xuất bản sự kiện (Publish), hủy bỏ sự kiện (Cancel) và giám sát danh sách người tham gia cùng thứ tự xếp vị trí danh sách chờ Waitlist thời gian thực.

## 🛠️ Công Nghệ Sử Dụng
- **Framework**: React.js (Bundled by **Vite**)
- **State Management**: **Zustand** (Tích hợp Middleware `persist` lưu trữ trạng thái Dashboard của Organizer)
- **API Client**: **Axios Instance** (Quản lý kết nối tập trung, chặn mã lỗi và đính kèm token tự động)
- **Styling**: **Tailwind CSS** (Giao diện Mobile-First hỗ trợ Ban tổ chức theo dõi tiến độ sự kiện trực tiếp trên điện thoại thông minh)
- **Routing**: **React Router** (Protected Routes chặn tuyệt đối tài khoản vai trò 'attendee' thâm nhập)

---

## 📁 Cấu Trúc Thư Mục Ứng Dụng
```text
frontend_organizer/
├── src/
│   ├── api/
│   │   └── api.js              # Khởi tạo Axios Instance cấu hình Request/Response Interceptor
│   ├── components/
│   │   ├── Sidebar.jsx         # Thanh điều hướng Dashboard tùy biến responsive
│   │   └── PrivateRoute.jsx    # Lớp bảo vệ định tuyến, giới hạn nghiêm ngặt chỉ cấp quyền 'organizer'
│   ├── store/
│   │   └── useAuthStore.js     # Zustand Store lưu trữ mã xác thực và thông tin phiên làm việc của Organizer
│   ├── styles/
│   │   └── tokens.css          # Token màu sắc cấu hình quy chuẩn hệ thống Design System
│   ├── pages/                  # Các màn hình quản trị (Dashboard, Create Event, Manage Registration & Waitlist)
│   ├── App.jsx
│   └── main.jsx
├── tailwind.config.js          # Đồng bộ bảng màu tokens.css vào Tailwind Utility
└── vite.config.js
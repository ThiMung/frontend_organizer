import axios from 'axios';
import { useAuthStore } from '../store/useAuthStore';

// Tạo một bản instance của axios
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request Interceptor: Tự động gắn Token vào header mỗi khi gọi API
api.interceptors.request.use((config) => {
    const token = useAuthStore.getState().token;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// Response Interceptor: Xử lý lỗi hệ thống toàn cục
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Nếu nhận lỗi 401 từ Laravel (Token hết hạn hoặc không hợp lệ)
        if (error.response && error.response.status === 401) {
            useAuthStore.getState().logout(); // Xóa sạch state
            window.location.href = '/login'; // Chuyển về trang login
        }
        return Promise.reject(error);
    }
);

export default api;
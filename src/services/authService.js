import api from './api';
import { useAuthStore } from '../store/authStore';

export const authService = {
	// Hàm đăng nhập cho organizer
	login: async (credentials) => {
		const response = await api.post('/organizer/login', {
			...credentials,
			// Backend dùng role này để phân biệt cổng đăng nhập
			required_role: 'organizer',
		});

		// Lưu thông tin user và token vào Zustand store sau khi đăng nhập thành công
		useAuthStore.getState().setAuth(response.data.user, response.data.token);
		return response.data;
	},

	// Hàm đăng ký tài khoản organizer
	register: async (data) => {
		const response = await api.post('/organizer/register', data);
		// Sau khi đăng ký thành công, tự động lưu trạng thái đăng nhập
		useAuthStore.getState().setAuth(response.data.user, response.data.token);
		return response.data;
	},

	// Hàm đăng xuất organizer
	logout: async () => {
		// Gọi API logout nếu có (nếu backend hỗ trợ), sau đó xóa trạng thái đăng nhập
		try {
			await api.post('/logout');
		} catch {
			// Có thể lỗi do token hết hạn, vẫn xóa local
		}
		useAuthStore.getState().logout();
	},
};

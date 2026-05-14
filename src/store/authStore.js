import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
    persist(
        (set) => ({
            user: null,
            token: null,
            
            // Hàm lưu thông tin sau khi login thành công
            setAuth: (user, token) => set({ user, token }),

            // Hàm đăng xuất
            logout: () => set({ user: null, token: null }),
        }),
        {
            name: 'organizer-storage', // Tên key lưu trong localStorage
        }
    )
);
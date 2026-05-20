import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { CalendarDays, LogOut, User } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

const MainLayout = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    logout();
    navigate('/organizer/login');
  };

  const navLinkClass = ({ isActive }) =>
    `text-sm transition hover:text-[#A02749] ${
      isActive ? 'border-b-2 border-[#A02749] pb-1 font-semibold text-[#A02749]' : 'text-gray-600'
    }`;

  return (
    <div className="min-h-screen bg-gray-100 font-sans text-slate-950">
      <nav className="sticky top-0 z-50 flex flex-col gap-4 border-b border-gray-200 bg-white px-6 py-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <Link to="/dashboard" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[#A02749]">
            <CalendarDays className="h-5 w-5 text-white" />
          </div>
          <span className="text-base font-bold text-[#A02749]">EventHub</span>
        </Link>

        <div className="flex items-center gap-8">
          <NavLink className={navLinkClass} to="/dashboard">
            My Dashboard
          </NavLink>
          <NavLink className={navLinkClass} to="/create-event">
            Create Event
          </NavLink>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-700">
            <User className="h-4 w-4 text-gray-500" />
            {user?.name || 'organizer'}
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-2 text-xs font-semibold text-red-500 transition hover:text-red-700"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </nav>

      <main className="mx-auto max-w-6xl p-4 py-8 sm:p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
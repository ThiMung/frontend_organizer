import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import CreateEventPage from './pages/CreateEventPage';
import EditEventPage from './pages/EditEventPage';
import EventDetailPage from './pages/EventDetailPage';
import MainLayout from './components/MainLayout';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/organizer/login" replace />} />
        <Route path="/organizer/login" element={<LoginPage />} />
        <Route path="/organizer/register" element={<RegisterPage />} />

        <Route element={<PrivateRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/create-event" element={<CreateEventPage />} />
            <Route path="/events/:id" element={<EventDetailPage />} />
            <Route path="/events/:eventId/edit" element={<EditEventPage />} />
          </Route>
        </Route>

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

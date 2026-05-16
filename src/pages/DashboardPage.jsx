import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  CalendarDays,
  Code2,
  Edit3,
  LogOut,
  Plus,
  Trash2,
  User,
  Users,
} from 'lucide-react';
import { deleteOrganizerEvent, getOrganizerEvents } from '../services/eventService';
import { useAuthStore } from '../store/authStore';

const formatEventDate = (date) => {
  return new Intl.DateTimeFormat('en', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(date));
};

const statusClasses = {
  Published: 'bg-green-100 text-green-700',
  Draft: 'bg-yellow-100 text-yellow-700',
};

const DashboardPage = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const data = await getOrganizerEvents();
        setEvents(data);
      } catch (error) {
        setMessage(error.message || 'Unable to load events.');
      } finally {
        setIsLoading(false);
      }
    };

    loadEvents();
  }, []);

  const stats = useMemo(() => {
    return {
      totalEvents: events.length,
      publishedEvents: events.filter((event) => event.status === 'Published').length,
      totalRegistrations: events.reduce((total, event) => total + event.registrations, 0),
    };
  }, [events]);

  const handleLogout = () => {
    logout();
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleDelete = async (eventId) => {
    await deleteOrganizerEvent(eventId);
    setEvents((currentEvents) => currentEvents.filter((event) => event.id !== eventId));
  };

  return (
    <main className="min-h-screen bg-gray-100 px-4 py-8 font-sans text-slate-950 sm:px-8">
      <p className="mx-auto mb-2 max-w-6xl text-xs font-semibold text-blue-500">Dashboard</p>

      <section className="mx-auto min-h-[640px] max-w-6xl bg-white shadow-sm">
        <nav className="flex flex-col gap-4 border-b border-gray-200 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[#A02749]">
              <CalendarDays className="h-5 w-5 text-white" />
            </div>
            <span className="text-base font-bold text-[#A02749]">EventHub</span>
          </Link>

          <div className="flex items-center gap-8 text-sm">
            <Link className="text-gray-600 hover:text-[#A02749]" to="/events">
              Browse Events
            </Link>
            <Link className="border-b-2 border-[#A02749] pb-1 font-semibold text-[#A02749]" to="/dashboard">
              My Dashboard
            </Link>
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

        <div className="px-6 py-10 sm:px-14">
          <header className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="text-3xl font-normal tracking-normal text-black">Event Dashboard</h1>
              <p className="mt-1 text-sm text-gray-400">Manage your events and track registrations</p>
            </div>
            <button
              type="button"
              className="flex h-14 items-center justify-center gap-2 rounded-xl bg-orange-300 px-10 text-base font-semibold text-black transition hover:bg-orange-400"
            >
              <Plus className="h-5 w-5" />
              Create New Event
            </button>
          </header>

          <section className="mb-9 grid gap-6 md:grid-cols-3">
            <div className="rounded-xl bg-gray-100 px-8 py-5">
              <p className="text-sm text-gray-600">Total event</p>
              <p className="mt-2 text-3xl font-medium text-black">{stats.totalEvents}</p>
            </div>
            <div className="rounded-xl bg-gray-100 px-8 py-5">
              <p className="text-sm text-gray-600">Published</p>
              <p className="mt-2 text-3xl font-medium text-black">{stats.publishedEvents}</p>
            </div>
            <div className="rounded-xl bg-gray-100 px-8 py-5">
              <p className="text-sm text-gray-600">Total Registrations</p>
              <p className="mt-2 text-3xl font-medium text-black">{stats.totalRegistrations}</p>
            </div>
          </section>

          {message && (
            <div className="mb-5 rounded-md border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
              {message}
            </div>
          )}

          <section className="overflow-hidden rounded-md border border-gray-100 shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] border-collapse text-left text-sm">
                <thead>
                  <tr className="bg-gray-50 text-xs font-semibold text-gray-700">
                    <th className="px-5 py-4">Event Name</th>
                    <th className="px-5 py-4">Date</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4">Registrations</th>
                    <th className="px-5 py-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {isLoading && (
                    <tr>
                      <td className="px-5 py-8 text-center text-gray-500" colSpan="5">
                        Loading events...
                      </td>
                    </tr>
                  )}

                  {!isLoading && events.length === 0 && (
                    <tr>
                      <td className="px-5 py-10 text-center text-gray-500" colSpan="5">
                        No events yet. Create your first event when the event module is ready.
                      </td>
                    </tr>
                  )}

                  {!isLoading &&
                    events.map((event) => (
                      <tr className="bg-white text-gray-800" key={event.id}>
                        <td className="px-5 py-4 font-semibold text-gray-900">{event.name}</td>
                        <td className="px-5 py-4">
                          <span className="flex items-center gap-2">
                            <CalendarDays className="h-4 w-4 text-orange-300" />
                            {formatEventDate(event.date)}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <span
                            className={`rounded-full px-3 py-1 text-[11px] font-semibold ${
                              statusClasses[event.status] || 'bg-gray-100 text-gray-600'
                            }`}
                          >
                            {event.status}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <span className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-orange-300" />
                            {event.registrations}/{event.capacity}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              className="flex items-center gap-1 rounded-md border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 transition hover:border-[#A02749] hover:text-[#A02749]"
                            >
                              <Edit3 className="h-3.5 w-3.5" />
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(event.id)}
                              aria-label={`Delete ${event.name}`}
                              className="rounded-md border border-red-100 p-1.5 text-red-400 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        <Code2 className="absolute right-12 top-16 hidden h-4 w-4 text-blue-500 lg:block" />
      </section>
    </main>
  );
};

export default DashboardPage;

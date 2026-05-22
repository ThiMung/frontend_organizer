import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CalendarDays, Pencil, Plus, Trash2, Users } from 'lucide-react';
import {
  deleteOrganizerEvent,
  getOrganizerEvents,
  updateOrganizerEventStatus,
} from '../services/eventService';

const formatEventDate = (date) => {
  if (!date) return 'N/A';
  return new Intl.DateTimeFormat('en', { month: 'long', day: 'numeric', year: 'numeric' }).format(new Date(date));
};

const statusClasses = {
  published: 'bg-green-100 text-green-700',
  draft: 'bg-yellow-100 text-yellow-700',
  cancelled: 'bg-red-100 text-red-700',
  ended: 'bg-gray-100 text-gray-600',
};

const statusActions = {
  draft: [
    { label: 'Publish', status: 'published' },
    { label: 'Cancel', status: 'cancelled' },
  ],
  published: [
    { label: 'End', status: 'ended' },
    { label: 'Cancel', status: 'cancelled' },
  ],
};

const DashboardPage = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const loadEvents = async () => {
      try {
        setIsLoading(true);
        const data = await getOrganizerEvents();

        setEvents(data);
      } catch (error) {
        setMessage(error.response?.data?.message || 'Unable to load your managed events.');
      } finally {
        setIsLoading(false);
      }
    };
    loadEvents();
  }, []);

  const stats = useMemo(() => {
    return {
      totalEvents: events.length,
      publishedEvents: events.filter((e) => e.status === 'published').length,
      totalRegistrations: events.reduce((sum, e) => sum + (e.registered_count || 0), 0),
    };
  }, [events]);

  const handleDelete = async (eventId) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await deleteOrganizerEvent(eventId);
        setEvents((curr) => curr.filter((e) => e.id !== eventId));
      } catch (error) {
        alert(error.response?.data?.message || 'Failed to delete the event. Please try again.');
      }
    }
  };

  const handleStatusChange = async (eventId, status) => {
    try {
      const data = await updateOrganizerEventStatus(eventId, status);

      setEvents((current) => current.map((event) => (event.id === eventId ? data.event : event)));
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to update event status.');
    }
  };

  return (
    <section className="min-h-[640px] bg-white shadow-sm rounded-md border border-gray-100">
      <div className="px-6 py-8 sm:px-10">
        <header className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="mb-1 text-xs font-semibold text-blue-500">Dashboard</p>
            <h1 className="text-3xl font-normal tracking-normal text-black">Event Dashboard</h1>
            <p className="mt-1 text-sm text-gray-400">Manage your events and track registrations</p>
          </div>
          
          <button
            type="button"
            onClick={() => navigate('/create-event')}
            className="flex h-12 items-center justify-center gap-2 rounded-xl bg-orange-300 px-10 text-base font-semibold text-black transition hover:bg-orange-400"
          >
            <Plus className="h-5 w-5" />
            Create New Event
          </button>
        </header>

        <section className="mb-9 grid gap-6 md:grid-cols-3">
          <div className="rounded-xl bg-gray-50 border border-gray-100 px-8 py-5">
            <p className="text-sm text-gray-500">Total event</p>
            <p className="mt-2 text-3xl font-medium text-black">{stats.totalEvents}</p>
          </div>
          <div className="rounded-xl bg-gray-50 border border-gray-100 px-8 py-5">
            <p className="text-sm text-gray-500">Published</p>
            <p className="mt-2 text-3xl font-medium text-black">{stats.publishedEvents}</p>
          </div>
          <div className="rounded-xl bg-gray-50 border border-gray-100 px-8 py-5">
            <p className="text-sm text-gray-500">Total Registrations</p>
            <p className="mt-2 text-3xl font-medium text-black">{stats.totalRegistrations}</p>
          </div>
        </section>

        {message && (
          <div className="mb-5 rounded-md border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
            {message}
          </div>
        )}

        <section className="overflow-hidden rounded-md border border-gray-200">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] border-collapse text-left text-sm">
              <thead>
                <tr className="bg-gray-50 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  <th className="px-5 py-4">Event Name</th>
                  <th className="px-5 py-4">Date</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4">Registrations</th>
                  <th className="px-5 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {isLoading && (
                  <tr><td className="px-5 py-8 text-center text-gray-500" colSpan="5">Loading events...</td></tr>
                )}
                {!isLoading && events.length === 0 && (
                  <tr><td className="px-5 py-10 text-center text-gray-500" colSpan="5">No events yet. Create your first event.</td></tr>
                )}
                {!isLoading && events.map((event) => (
                  <tr className="bg-white hover:bg-gray-50/50 transition-colors" key={event.id}>
                    <td className="px-5 py-4 font-semibold text-gray-900">{event.title}</td>
                    <td className="px-5 py-4">
                      <span className="flex items-center gap-2">
                        <CalendarDays className="h-4 w-4 text-orange-300" />
                        {formatEventDate(event.start_time)}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`rounded-full px-3 py-1 text-[11px] font-semibold ${statusClasses[event.status] || 'bg-gray-100 text-gray-600'}`}>
                        {event.status}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-orange-300" />
                        {event.registered_count || 0} / {event.capacity}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        {(statusActions[event.status] || []).map((action) => (
                          <button
                            key={action.status}
                            type="button"
                            onClick={() => handleStatusChange(event.id, action.status)}
                            className="rounded-md border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-700 hover:border-[#A02749] hover:text-[#A02749]"
                          >
                            {action.label}
                          </button>
                        ))}
                        <button
                          type="button"
                          onClick={() => navigate(`/events/${event.id}/edit`)}
                          className="rounded-md border border-gray-200 p-1.5 text-gray-500 hover:border-[#A02749] hover:bg-rose-50 hover:text-[#A02749]"
                          title="Edit event"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button onClick={() => handleDelete(event.id)} className="rounded-md border border-red-100 p-1.5 text-red-400 hover:border-red-200 hover:bg-red-50 hover:text-red-600">
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
    </section>
  );
};

export default DashboardPage;

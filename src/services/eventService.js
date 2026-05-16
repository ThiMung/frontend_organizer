import api from './api';

const normalizeStatus = (status) => {
  if (!status) {
    return 'Draft';
  }

  return status.charAt(0).toUpperCase() + status.slice(1);
};

const normalizeEvent = (event) => ({
  id: event.id,
  name: event.title || event.name || 'Untitled event',
  date: event.start_time || event.date,
  status: normalizeStatus(event.status),
  registrations: event.registrations_count || event.registrations || 0,
  capacity: event.capacity || 0,
});

export const getOrganizerEvents = async () => {
  const response = await api.get('/organizer/events');
  const events = Array.isArray(response.data) ? response.data : response.data?.data || [];

  return events.map(normalizeEvent);
};

export const deleteOrganizerEvent = async (eventId) => {
  return { deletedId: eventId };
};

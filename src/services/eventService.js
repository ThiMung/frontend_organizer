import api from './api';

export const getOrganizerEvents = async () => {
  const response = await api.get('/organizer/events');

  return response.data?.events || response.data?.data || response.data || [];
};

export const createOrganizerEvent = async (payload) => {
  const response = await api.post('/organizer/events', payload);

  return response.data;
};

export const updateOrganizerEventStatus = async (eventId, status) => {
  const response = await api.patch(`/organizer/events/${eventId}/status`, { status });

  return response.data;
};

export const deleteOrganizerEvent = async (eventId) => {
  const response = await api.delete(`/organizer/events/${eventId}`);

  return response.data;
};

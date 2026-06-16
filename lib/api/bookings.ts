import { api } from './axios';

export const bookingsAPI = {
  getMyBookings: async () => {
    const response = await api.get('/bookings/me');
    return response.data;
  },
  getAll: async (params?: any) => {
    const response = await api.get('/bookings', { params });
    return response.data;
  },
  create: async (data: any) => {
    const response = await api.post('/bookings', data);
    return response.data;
  },
  delete: async (id: number) => {
    const response = await api.delete(`/bookings/${id}`);
    return response.data;
  },
};
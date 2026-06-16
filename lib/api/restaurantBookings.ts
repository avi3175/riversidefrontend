import { api } from './axios';

export const restaurantBookingsAPI = {
  getAll: async (params?: any) => {
    const response = await api.get('/restaurant-bookings', { params });
    return response.data;
  },
  getSingle: async (id: number) => {
    const response = await api.get(`/restaurant-bookings/${id}`);
    return response.data;
  },
  create: async (data: any) => {
    const response = await api.post('/restaurant-bookings', data);
    return response.data;
  },
  delete: async (id: number) => {
    const response = await api.delete(`/restaurant-bookings/${id}`);
    return response.data;
  },
};
import { api } from './axios';

export const ordersAPI = {
  getAll: async (params?: any) => {
    const response = await api.get('/orders', { params });
    return response.data;
  },
  getSingle: async (id: number) => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },
  create: async (data: any) => {
    const response = await api.post('/orders', data);
    return response.data;
  },
  delete: async (id: number) => {
    const response = await api.delete(`/orders/${id}`);
    return response.data;
  },
};
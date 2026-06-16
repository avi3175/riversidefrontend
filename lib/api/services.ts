import { api } from './axios';

export const servicesAPI = {
  getAll: async (params?: any) => {
    const response = await api.get('/services', { params });
    return response.data;
  },
  getSingle: async (id: number) => {
    const response = await api.get(`/services/${id}`);
    return response.data;
  },
  create: async (data: any) => {
    const response = await api.post('/services', data);
    return response.data;
  },
  update: async (id: number, data: any) => {
    const response = await api.patch(`/services/${id}`, data);
    return response.data;
  },
  delete: async (id: number) => {
    const response = await api.delete(`/services/${id}`);
    return response.data;
  },
};
import { api } from './axios';

export const menuItemsAPI = {
  getAll: async (params?: any) => {
    const response = await api.get('/menu-items', { params });
    return response.data;
  },
  getSingle: async (id: number) => {
    const response = await api.get(`/menu-items/${id}`);
    return response.data;
  },
  create: async (data: any) => {
    const response = await api.post('/menu-items', data);
    return response.data;
  },
  update: async (id: number, data: any) => {
    const response = await api.patch(`/menu-items/${id}`, data);
    return response.data;
  },
  delete: async (id: number) => {
    const response = await api.delete(`/menu-items/${id}`);
    return response.data;
  },
};
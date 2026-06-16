import { api } from './axios';

export const usersAPI = {
  getAll: async (params?: any) => {
    const response = await api.get('/users', { params });
    return response.data;
  },
  getById: async (id: number) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },
  update: async (id: number, data: any) => {
    const response = await api.patch(`/users/${id}`, data);
    return response.data;
  },
  delete: async (id: number) => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  },
};

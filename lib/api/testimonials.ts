import { api } from './axios';

export const testimonialsAPI = {
  getAll: async () => {
    const response = await api.get('/testimonials');
    return response.data;
  },
  getSingle: async (id: number) => {
    const response = await api.get(`/testimonials/${id}`);
    return response.data;
  },
  create: async (data: any) => {
    const response = await api.post('/testimonials', data);
    return response.data;
  },
  update: async (id: number, data: any) => {
    const response = await api.patch(`/testimonials/${id}`, data);
    return response.data;
  },
  delete: async (id: number) => {
    const response = await api.delete(`/testimonials/${id}`);
    return response.data;
  },
};
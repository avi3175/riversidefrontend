import { api } from './axios';

export interface Booking {
  id: number;
  packageId: number;
  date: string;
  guests: number;
  userId: number;
  package?: {
    title: string;
    price: number;
    image: string;
  };
  createdAt: string;
}

export interface CreateBookingData {
  packageId: number;
  date: string;
  guests: number;
}

export const bookingsAPI = {
  create: async (data: CreateBookingData): Promise<Booking> => {
    const response = await api.post('/bookings', data);
    return response.data;
  },

  getMyBookings: async (): Promise<Booking[]> => {
    const response = await api.get('/bookings/me');
    return response.data;
  },

  getAll: async (): Promise<Booking[]> => {
    const response = await api.get('/bookings');
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/bookings/${id}`);
  },
};
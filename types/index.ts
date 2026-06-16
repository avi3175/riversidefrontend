import type { Booking } from './booking';

export interface Testimonial {
  id: number;
  name: string;
  image?: string;
  writings: string;
  userId: number;
  user?: { id: number; name: string; email: string };
  createdAt: string;
  updatedAt: string;
}

export interface MenuItem {
  id: number;
  name: string;
  price: number;
  availability: boolean;
  images: string[];
  category?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  id: number;
  quantity: number;
  userId: number;
  menuItemId: number;
  bookingId: number;
  date: string;
  notes?: string;
  createdAt: string;
  menuItem?: MenuItem;
  booking?: Booking;
  user?: { id: number; name: string; email: string };
}

export interface Service {
  id: number;
  name: string;
  image?: string;
  availability: boolean;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface RestaurantBooking {
  id: number;
  userId: number;
  date: string;
  time: string;
  guests: number;
  notes?: string;
  createdAt: string;
  user?: { id: number; name: string; email: string };
}
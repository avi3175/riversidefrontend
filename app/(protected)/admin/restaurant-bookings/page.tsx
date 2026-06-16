'use client';

import { useState, useEffect } from 'react';
import { restaurantBookingsAPI } from '@/lib/api/restaurantBookings';
import { RestaurantBooking } from '@/types/index';
import toast from 'react-hot-toast';

export default function AdminRestaurantBookingsPage() {
  const [bookings, setBookings] = useState<RestaurantBooking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    try {
      const res = await restaurantBookingsAPI.getAll({ limit: 100 });
      setBookings(res.data || []);
    } catch (err) {
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this booking?')) return;
    try {
      await restaurantBookingsAPI.delete(id);
      toast.success('Booking deleted');
      loadBookings();
    } catch (err) {
      toast.error('Failed to delete');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Restaurant Bookings</h1>
        {bookings.length === 0 ? (
          <p className="text-gray-500">No restaurant bookings yet.</p>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium">User</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Date</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Time</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Guests</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Notes</th>
                  <th className="px-4 py-3 text-right text-sm font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {bookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">{booking.user?.name || booking.user?.email || `User #${booking.userId}`}</td>
                    <td className="px-4 py-3">{new Date(booking.date).toLocaleDateString()}</td>
                    <td className="px-4 py-3">{booking.time}</td>
                    <td className="px-4 py-3">{booking.guests}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{booking.notes || '-'}</td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => handleDelete(booking.id)} className="text-red-600 hover:underline text-sm">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/context/AuthContext';
import { useRouter } from 'next/navigation';
import { restaurantBookingsAPI } from '@/lib/api/restaurantBookings';
import { RestaurantBooking } from '@/types/index';
import Button from '@/components/ui/Button';
import toast from 'react-hot-toast';

export default function UserRestaurantBookingsPage() {
  const { user } = useAuth();
  const router = useRouter();

  const [bookings, setBookings] = useState<RestaurantBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    date: '',
    time: '',
    guests: '2',
    notes: '',
  });

  useEffect(() => {
    if (!user || user.role !== 'user') {
      router.push('/login');
      return;
    }
    loadBookings();
  }, [user, router]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await restaurantBookingsAPI.create({
        date: form.date,
        time: form.time,
        guests: parseInt(form.guests),
        notes: form.notes || undefined,
      });
      toast.success('Restaurant table booked!');
      setShowForm(false);
      setForm({ date: '', time: '', guests: '2', notes: '' });
      loadBookings();
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message || 'Failed to book');
    }
  };

  const handleCancel = async (id: number) => {
    if (!confirm('Cancel this restaurant booking?')) return;
    try {
      await restaurantBookingsAPI.delete(id);
      toast.success('Booking cancelled');
      loadBookings();
    } catch (err: any) {
      toast.error(err.message || 'Failed to cancel');
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">My Restaurant Bookings</h1>
          <Button onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel' : 'Book a Table'}
          </Button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Book a Restaurant Table</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Date</label>
                <input
                  type="date"
                  required
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  className="w-full border rounded-md px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Time</label>
                <input
                  type="time"
                  required
                  value={form.time}
                  onChange={(e) => setForm({ ...form, time: e.target.value })}
                  className="w-full border rounded-md px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Number of Guests</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={form.guests}
                  onChange={(e) => setForm({ ...form, guests: e.target.value })}
                  className="w-full border rounded-md px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Notes (optional)</label>
                <input
                  type="text"
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  placeholder="Any special requests?"
                  className="w-full border rounded-md px-3 py-2"
                />
              </div>
            </div>
            <div className="mt-6">
              <Button type="submit">Book Now</Button>
            </div>
          </form>
        )}

        {loading ? (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <p className="text-gray-500">No restaurant bookings yet.</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium">Date</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Time</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Guests</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Notes</th>
                  <th className="px-4 py-3 text-right text-sm font-medium">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {bookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">{new Date(booking.date).toLocaleDateString()}</td>
                    <td className="px-4 py-3">{booking.time}</td>
                    <td className="px-4 py-3">{booking.guests}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{booking.notes || '-'}</td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => handleCancel(booking.id)}
                        className="text-red-600 hover:underline text-sm"
                      >
                        Cancel
                      </button>
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
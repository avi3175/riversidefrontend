'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context/AuthContext';
import { bookingsAPI } from '@/lib/api/bookings';
import { FaSpinner, FaCalendar, FaUsers, FaTrash, FaTicketAlt } from 'react-icons/fa';
import toast from 'react-hot-toast';
import Link from 'next/link';
import Button from '@/components/ui/Button';

// Define Booking type locally
interface Booking {
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

export default function UserDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<number | null>(null);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    fetchMyBookings();
  }, [user, router]);

  const fetchMyBookings = async () => {
    try {
      setLoading(true);
      const data = await bookingsAPI.getMyBookings();
      console.log('Bookings response:', data);

      const bookingsData: Booking[] = Array.isArray(data)
        ? data
        : Array.isArray(data?.data)
        ? data.data
        : Array.isArray(data?.bookings)
        ? data.bookings
        : [];

      setBookings(bookingsData);
    } catch (error: any) {
      console.error('Failed to fetch bookings:', error);
      toast.error(error.message || 'Failed to load bookings');
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId: number) => {
    if (!confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    setCancellingId(bookingId);
    try {
      await bookingsAPI.delete(bookingId);
      toast.success('Booking cancelled successfully');
      fetchMyBookings(); // Refresh the list
    } catch (error: any) {
      toast.error(error.message || 'Failed to cancel booking');
    } finally {
      setCancellingId(null);
    }
  };

  if (!user) {
    return null;
  }

  const totalGuests = bookings.reduce((sum, b) => sum + b.guests, 0);
  const totalSpent = bookings.reduce((sum, b) => sum + ((b.package?.price || 0) * b.guests), 0);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user.name}!</p>
        </div>

        {/* Profile Overview */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Profile Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Name</p>
              <p className="font-medium">{user.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="font-medium">{user.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Role</p>
              <p className="font-medium capitalize">{user.role}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Bookings</p>
              <p className="font-medium">{bookings.length}</p>
            </div>
          </div>
        </div>

        {/* My Bookings */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">My Bookings</h2>
            <Link href="/items">
              <Button variant="outline" size="sm">
                Book New Package →
              </Button>
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center py-8">
              <FaSpinner className="w-8 h-8 text-blue-600 animate-spin" />
            </div>
          ) : bookings.length === 0 ? (
            <div className="text-center py-8">
              <FaTicketAlt className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500">No bookings yet.</p>
              <Link href="/items">
                <Button variant="primary" size="sm" className="mt-3">
                  Book Your First Package
                </Button>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Package</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Guests</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {bookings.map((booking) => (
                    <tr key={booking.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-900">{booking.package?.title || `Package #${booking.packageId}`}</p>
                          <p className="text-sm text-gray-500">ID: {booking.packageId}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {new Date(booking.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {booking.guests} guests
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap font-semibold text-blue-600">
                        ${booking.package?.price ? booking.package.price * booking.guests : 'N/A'}
                       </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                          Confirmed
                        </span>
                       </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <button
                          onClick={() => handleCancelBooking(booking.id)}
                          disabled={cancellingId === booking.id}
                          className="text-red-600 hover:text-red-900 disabled:opacity-50 transition-colors"
                          title="Cancel Booking"
                        >
                          {cancellingId === booking.id ? (
                            <FaSpinner className="w-4 h-4 animate-spin" />
                          ) : (
                            <FaTrash size={16} />
                          )}
                        </button>
                       </td>
                     </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-linear-to-r from-blue-500 to-blue-600 text-white rounded-lg p-4">
            <FaCalendar className="w-8 h-8 mb-2" />
            <p className="text-2xl font-bold">{bookings.length}</p>
            <p className="text-sm opacity-90">Total Bookings</p>
          </div>
          <div className="bg-linear-to-r from-green-500 to-green-600 text-white rounded-lg p-4">
            <FaUsers className="w-8 h-8 mb-2" />
            <p className="text-2xl font-bold">{totalGuests}</p>
            <p className="text-sm opacity-90">Total Guests</p>
          </div>
          <div className="bg-linear-to-r from-purple-500 to-purple-600 text-white rounded-lg p-4">
            <FaTicketAlt className="w-8 h-8 mb-2" />
            <p className="text-2xl font-bold">${totalSpent}</p>
            <p className="text-sm opacity-90">Total Spent</p>
          </div>
        </div>
      </div>
    </div>
  );
}
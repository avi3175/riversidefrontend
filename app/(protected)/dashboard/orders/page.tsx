'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/context/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import { ordersAPI } from '@/lib/api/orders';
import { menuItemsAPI } from '@/lib/api/menuItems';
import { bookingsAPI } from '@/lib/api/bookings';
import { Order, MenuItem } from '@/types/index';
import Button from '@/components/ui/Button';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function UserOrdersPage() {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const preSelectedItemId = searchParams.get('menuItemId');

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [showOrderForm, setShowOrderForm] = useState(!!preSelectedItemId);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [userBookings, setUserBookings] = useState<any[]>([]);
  const [menuSearch, setMenuSearch] = useState('');
  const [menuCategory, setMenuCategory] = useState('');
  const [form, setForm] = useState({
    menuItemId: preSelectedItemId || '',
    bookingId: '',
    date: '',
    quantity: '1',
    notes: '',
  });

  useEffect(() => {
    if (!user || user.role !== 'user') {
      router.push('/login');
      return;
    }
    loadData();
  }, [user, router]);

  const loadData = async () => {
    try {
      const [ordersRes, menuRes] = await Promise.all([
        ordersAPI.getAll({ limit: 100 }),
        menuItemsAPI.getAll({ limit: 100 }),
      ]);
      setOrders(ordersRes.data || []);
      setMenuItems(menuRes.data || []);
    } catch (err) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  // Get user's bookings for the prefill
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const data = await bookingsAPI.getMyBookings();
        setUserBookings(Array.isArray(data) ? data : data?.data || []);
      } catch (err) {
        console.error('Failed to load bookings');
      }
    };
    if (user) fetchBookings();
  }, [user]);

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await ordersAPI.create({
        menuItemId: parseInt(form.menuItemId),
        bookingId: parseInt(form.bookingId),
        date: form.date,
        quantity: parseInt(form.quantity) || 1,
        notes: form.notes || undefined,
      });
      toast.success('Order placed successfully!');
      setShowOrderForm(false);
      setForm({ menuItemId: '', bookingId: '', date: '', quantity: '1', notes: '' });
      loadData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message || 'Failed to place order');
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">My Orders</h1>
          <Button onClick={() => setShowOrderForm(!showOrderForm)}>
            {showOrderForm ? 'Cancel' : 'Place New Order'}
          </Button>
        </div>

        {showOrderForm && (
          <form onSubmit={handleSubmitOrder} className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Place a Food Order</h2>
            <p className="text-sm text-gray-500 mb-4">
              You can only order food for dates that match your existing room bookings.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Menu Item</label>
                <select
                  required
                  value={form.menuItemId}
                  onChange={(e) => setForm({ ...form, menuItemId: e.target.value })}
                  className="w-full border rounded-md px-3 py-2"
                >
                  <option value="">Select item</option>
                  {menuItems.filter(m => m.availability).map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name} - ${item.price.toFixed(2)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Your Booking</label>
                <select
                  required
                  value={form.bookingId}
                  onChange={(e) => {
                    const selected = userBookings.find((b: any) => b.id === parseInt(e.target.value));
                    setForm({
                      ...form,
                      bookingId: e.target.value,
                      date: selected ? new Date(selected.date).toISOString().split('T')[0] : '',
                    });
                  }}
                  className="w-full border rounded-md px-3 py-2"
                >
                  <option value="">Select booking</option>
                  {userBookings.map((b: any) => (
                    <option key={b.id} value={b.id}>
                      #{b.id} - {b.package?.title || `Package #${b.packageId}`} on {new Date(b.date).toLocaleDateString()}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Order Date</label>
                <input
                  type="date"
                  required
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  className="w-full border rounded-md px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Quantity</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={form.quantity}
                  onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                  className="w-full border rounded-md px-3 py-2"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Notes (optional)</label>
                <textarea
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  className="w-full border rounded-md px-3 py-2"
                  rows={2}
                />
              </div>
            </div>
            <div className="mt-6">
              <Button type="submit">Place Order</Button>
            </div>
          </form>
        )}

        {loading ? (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <p className="text-gray-500">No orders yet.</p>
            <Button onClick={() => setShowOrderForm(true)} className="mt-4">Place Your First Order</Button>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium">Item</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Qty</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Date</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Booking</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">{order.menuItem?.name || 'Item'}</td>
                    <td className="px-4 py-3">{order.quantity}</td>
                    <td className="px-4 py-3">{new Date(order.date).toLocaleDateString()}</td>
                    <td className="px-4 py-3">
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                        Booking #{order.bookingId}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">{order.notes || '-'}</td>
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
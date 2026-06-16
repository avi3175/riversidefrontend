'use client';

import { useState, useEffect } from 'react';
import { menuItemsAPI } from '@/lib/api/menuItems';
import { MenuItem } from '@/types/index';
import Button from '@/components/ui/Button';
import ImageUpload from '@/components/ui/ImageUpload';
import toast from 'react-hot-toast';
import Image from 'next/image';

export default function AdminMenuItemsPage() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<MenuItem | null>(null);
  const [form, setForm] = useState({
    name: '',
    price: '',
    category: '',
    availability: true,
    images: [] as string[],
  });

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      const res = await menuItemsAPI.getAll({ limit: 100 });
      setItems(res.data || []);
    } catch (err) {
      toast.error('Failed to load menu items');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm({ name: '', price: '', category: '', availability: true, images: [] });
    setEditing(null);
    setShowForm(false);
  };

  const handleImageUpload = (imageUrl: string) => {
    setForm(prev => ({ ...prev, images: [...prev.images, imageUrl] }));
  };

  const handleRemoveImage = (idx: number) => {
    setForm({ ...form, images: form.images.filter((_, i) => i !== idx) });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        name: form.name,
        price: parseFloat(form.price),
        category: form.category || undefined,
        availability: form.availability,
        images: form.images,
      };

      if (editing) {
        await menuItemsAPI.update(editing.id, payload);
        toast.success('Menu item updated');
      } else {
        await menuItemsAPI.create(payload);
        toast.success('Menu item created');
      }
      resetForm();
      loadItems();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to save menu item');
    }
  };

  const handleEdit = (item: MenuItem) => {
    setForm({
      name: item.name,
      price: item.price.toString(),
      category: item.category || '',
      availability: item.availability,
      images: item.images || [],
    });
    setEditing(item);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure?')) return;
    try {
      await menuItemsAPI.delete(id);
      toast.success('Menu item deleted');
      loadItems();
    } catch (err) {
      toast.error('Failed to delete');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Manage Menu Items</h1>
          <Button onClick={() => { resetForm(); setShowForm(!showForm); }}>
            {showForm ? 'Cancel' : 'Add Menu Item'}
          </Button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">{editing ? 'Edit Menu Item' : 'New Menu Item'}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full border rounded-md px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Price</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  className="w-full border rounded-md px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full border rounded-md px-3 py-2"
                >
                  <option value="">Select category</option>
                  <option value="starter">Starter</option>
                  <option value="main">Main</option>
                  <option value="dessert">Dessert</option>
                  <option value="drink">Drink</option>
                </select>
              </div>
              <div className="flex items-center">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={form.availability}
                    onChange={(e) => setForm({ ...form, availability: e.target.checked })}
                    className="rounded"
                  />
                  <span className="text-sm font-medium">Available</span>
                </label>
              </div>
            </div>

            {/* Images - Upload from Computer via Cloudinary */}
            <div className="mt-4">
              <label className="block text-sm font-medium mb-1">Images</label>
              <ImageUpload onUpload={handleImageUpload} />
              {form.images.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {form.images.map((img, idx) => (
                    <div key={idx} className="relative w-20 h-20">
                      <Image src={img} alt={`Image ${idx}`} fill className="object-cover rounded" />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(idx)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs"
                      >
                        x
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-6">
              <Button type="submit">{editing ? 'Update' : 'Create'}</Button>
            </div>
          </form>
        )}

        {loading ? (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium">Image</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Name</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Price</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Category</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Available</th>
                  <th className="px-4 py-3 text-right text-sm font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {items.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      {item.images?.[0] ? (
                        <div className="relative w-10 h-10 rounded overflow-hidden">
                          <Image src={item.images[0]} alt={item.name} fill className="object-cover" />
                        </div>
                      ) : '-'}
                    </td>
                    <td className="px-4 py-3">{item.name}</td>
                    <td className="px-4 py-3">${item.price.toFixed(2)}</td>
                    <td className="px-4 py-3 capitalize">{item.category || '-'}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs ${item.availability ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {item.availability ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => handleEdit(item)} className="text-blue-600 hover:underline mr-3 text-sm">Edit</button>
                      <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:underline text-sm">Delete</button>
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

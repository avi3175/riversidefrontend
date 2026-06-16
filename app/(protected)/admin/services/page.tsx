'use client';

import { useState, useEffect } from 'react';
import { servicesAPI } from '@/lib/api/services';
import { Service } from '@/types/index';
import Button from '@/components/ui/Button';
import ImageUpload from '@/components/ui/ImageUpload';
import toast from 'react-hot-toast';
import Image from 'next/image';

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Service | null>(null);
  const [form, setForm] = useState({
    name: '',
    image: '',
    description: '',
    availability: true,
  });

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      const res = await servicesAPI.getAll({ limit: 100 });
      setServices(res.data || []);
    } catch (err) {
      toast.error('Failed to load services');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm({ name: '', image: '', description: '', availability: true });
    setEditing(null);
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        name: form.name,
        image: form.image || undefined,
        description: form.description || undefined,
        availability: form.availability,
      };

      if (editing) {
        await servicesAPI.update(editing.id, payload);
        toast.success('Service updated');
      } else {
        await servicesAPI.create(payload);
        toast.success('Service created');
      }
      resetForm();
      loadServices();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to save service');
    }
  };

  const handleEdit = (service: Service) => {
    setForm({
      name: service.name,
      image: service.image || '',
      description: service.description || '',
      availability: service.availability,
    });
    setEditing(service);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure?')) return;
    try {
      await servicesAPI.delete(id);
      toast.success('Service deleted');
      loadServices();
    } catch (err) {
      toast.error('Failed to delete');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Manage Services</h1>
          <Button onClick={() => { resetForm(); setShowForm(!showForm); }}>
            {showForm ? 'Cancel' : 'Add Service'}
          </Button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">{editing ? 'Edit Service' : 'New Service'}</h2>
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
                <label className="block text-sm font-medium mb-1">Image (optional)</label>
                <ImageUpload
                  onUpload={(url) => setForm({ ...form, image: url })}
                  currentImage={form.image}
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Description (optional)</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full border rounded-md px-3 py-2"
                  rows={3}
                />
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
                  <th className="px-4 py-3 text-left text-sm font-medium">Name</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Description</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Available</th>
                  <th className="px-4 py-3 text-right text-sm font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {services.map((service) => (
                  <tr key={service.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">{service.name}</td>
                    <td className="px-4 py-3 text-gray-500 text-sm">{service.description || '-'}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs ${service.availability ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {service.availability ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => handleEdit(service)} className="text-blue-600 hover:underline mr-3 text-sm">Edit</button>
                      <button onClick={() => handleDelete(service.id)} className="text-red-600 hover:underline text-sm">Delete</button>
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
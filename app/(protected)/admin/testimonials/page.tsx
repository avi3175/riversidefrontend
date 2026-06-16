'use client';

import { useState, useEffect } from 'react';
import { testimonialsAPI } from '@/lib/api/testimonials';
import { Testimonial } from '@/types/index';
import Button from '@/components/ui/Button';
import ImageUpload from '@/components/ui/ImageUpload';
import toast from 'react-hot-toast';
import Image from 'next/image';

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [form, setForm] = useState({
    name: '',
    image: '',
    writings: '',
  });

  useEffect(() => {
    loadTestimonials();
  }, []);

  const loadTestimonials = async () => {
    try {
      const res = await testimonialsAPI.getAll();
      setTestimonials(res.data || []);
    } catch (err) {
      toast.error('Failed to load testimonials');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setForm({ name: '', image: '', writings: '' });
    setEditing(null);
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        name: form.name,
        image: form.image || undefined,
        writings: form.writings,
      };

      if (editing) {
        await testimonialsAPI.update(editing.id, payload);
        toast.success('Testimonial updated');
      } else {
        await testimonialsAPI.create(payload);
        toast.success('Testimonial created');
      }
      resetForm();
      loadTestimonials();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to save testimonial');
    }
  };

  const handleEdit = (testimonial: Testimonial) => {
    setForm({
      name: testimonial.name,
      image: testimonial.image || '',
      writings: testimonial.writings,
    });
    setEditing(testimonial);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure?')) return;
    try {
      await testimonialsAPI.delete(id);
      toast.success('Testimonial deleted');
      loadTestimonials();
    } catch (err) {
      toast.error('Failed to delete');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Manage Testimonials</h1>
          <Button onClick={() => { resetForm(); setShowForm(!showForm); }}>
            {showForm ? 'Cancel' : 'Add Testimonial'}
          </Button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">{editing ? 'Edit Testimonial' : 'New Testimonial'}</h2>
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
                <label className="block text-sm font-medium mb-1">Photo (optional)</label>
                <ImageUpload
                  onUpload={(url) => setForm({ ...form, image: url })}
                  currentImage={form.image}
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Testimonial *</label>
                <textarea
                  required
                  value={form.writings}
                  onChange={(e) => setForm({ ...form, writings: e.target.value })}
                  className="w-full border rounded-md px-3 py-2"
                  rows={4}
                  placeholder="What they said..."
                />
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
                  <th className="px-4 py-3 text-left text-sm font-medium">Photo</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Name</th>
                  <th className="px-4 py-3 text-left text-sm font-medium">Writings</th>
                  <th className="px-4 py-3 text-right text-sm font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {testimonials.map((t) => (
                  <tr key={t.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      {t.image ? (
                        <div className="relative w-10 h-10 rounded-full overflow-hidden">
                          <Image src={t.image} alt={t.name} fill className="object-cover" />
                        </div>
                      ) : '-'}
                    </td>
                    <td className="px-4 py-3 font-medium">{t.name}</td>
                    <td className="px-4 py-3 text-gray-500 text-sm max-w-md truncate">{t.writings}</td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => handleEdit(t)} className="text-blue-600 hover:underline mr-3 text-sm">Edit</button>
                      <button onClick={() => handleDelete(t.id)} className="text-red-600 hover:underline text-sm">Delete</button>
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
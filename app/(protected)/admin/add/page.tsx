'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context/AuthContext';
import { packagesAPI } from '@/lib/api/packages';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import ImageUpload from '@/components/ui/ImageUpload';
import toast from 'react-hot-toast';
import { FaSpinner } from 'react-icons/fa';

export default function AddPackagePage() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    shortDesc: '',
    description: '',
    price: '',
    category: 'luxury',
    capacity: '',
    image: '',
    isFeatured: false,
  });

  // Check admin access
  if (user?.role !== 'admin') {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-6">You don't have permission to access this page.</p>
          <Button onClick={() => router.push('/')}>Go Home</Button>
        </div>
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleImageUpload = (imageUrl: string) => {
    setFormData(prev => ({ ...prev, image: imageUrl }));
    toast.success('Image uploaded successfully!');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.title || !formData.shortDesc || !formData.description || !formData.price || !formData.capacity) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      await packagesAPI.create({
        title: formData.title,
        shortDesc: formData.shortDesc,
        description: formData.description,
        price: parseFloat(formData.price),
        category: formData.category,
        capacity: parseInt(formData.capacity),
        image: formData.image || '',
        isFeatured: formData.isFeatured,
      });
      
      toast.success('Package created successfully!');
      router.push('/admin/manage');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create package');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Add New Package</h1>
          <p className="text-gray-600">Create a new riverside package for your customers</p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <Input
              label="Package Title *"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Luxury Riverside Villa"
              required
            />

            {/* Short Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Short Description *
              </label>
              <input
                type="text"
                name="shortDesc"
                value={formData.shortDesc}
                onChange={handleChange}
                placeholder="Brief description (1-2 lines)"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                required
              />
            </div>

            {/* Full Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={6}
                placeholder="Detailed description of the package..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                required
              />
            </div>

            {/* Price and Capacity */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Price per night ($) *"
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="150"
                required
              />
              
              <Input
                label="Capacity (guests) *"
                type="number"
                name="capacity"
                value={formData.capacity}
                onChange={handleChange}
                placeholder="4"
                required
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                required
              >
                <option value="luxury">Luxury</option>
                <option value="budget">Budget</option>
                <option value="family">Family</option>
                <option value="romantic">Romantic</option>
                <option value="adventure">Adventure</option>
              </select>
            </div>

            {/* Image Upload with Cloudinary */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Package Image
              </label>
              <ImageUpload
                onUpload={handleImageUpload}
                currentImage={formData.image}
              />
            </div>

            {/* Featured Checkbox */}
            <div className="flex items-center">
              <input
                type="checkbox"
                name="isFeatured"
                checked={formData.isFeatured}
                onChange={handleChange}
                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label className="ml-2 text-sm font-medium text-gray-700">
                Feature this package (appears on homepage)
              </label>
            </div>

            {/* Form Actions */}
            <div className="flex space-x-4 pt-4 border-t">
              <Button
                type="submit"
                variant="primary"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <FaSpinner className="w-4 h-4 animate-spin inline mr-2" />
                    Creating...
                  </>
                ) : (
                  'Create Package'
                )}
              </Button>
              
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/admin/manage')}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '@/lib/context/AuthContext';
import { packagesAPI, Package } from '@/lib/api/packages';
import Button from '@/components/ui/Button';
import { FaSpinner, FaTrash, FaEye, FaPlus, FaEdit } from 'react-icons/fa';
import toast from 'react-hot-toast';
import Link from 'next/link';

// Helper function to extract Cloudinary public_id from URL
const extractPublicIdFromUrl = (url: string): string | null => {
  if (!url || !url.includes('cloudinary.com')) return null;
  
  try {
    // Example URL: https://res.cloudinary.com/dkcnwjvn0/image/upload/v1234567890/sample.jpg
    const regex = /\/upload\/(?:v\d+\/)?(.+?)(?:\.[^.]*)?$/;
    const match = url.match(regex);
    
    if (match && match[1]) {
      return match[1];
    }
    return null;
  } catch (error) {
    console.error('Failed to extract public_id:', error);
    return null;
  }
};

// Function to delete image from Cloudinary
const deleteImageFromCloudinary = async (publicId: string): Promise<boolean> => {
  try {
    const response = await fetch('/api/cloudinary/delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ publicId }),
    });
    
    const data = await response.json();
    
    if (response.ok) {
      console.log('Cloudinary image deleted:', publicId);
      return true;
    } else {
      console.error('Failed to delete from Cloudinary:', data.error);
      return false;
    }
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error);
    return false;
  }
};

export default function ManagePackagesPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<number | null>(null);

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

  // Fetch all packages
  const fetchPackages = async () => {
    try {
      setLoading(true);
      const response = await packagesAPI.getAll({ limit: 100 });
      setPackages(response.data);
    } catch (error) {
      console.error('Failed to fetch packages:', error);
      toast.error('Failed to load packages');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const handleDelete = async (id: number, imageUrl: string) => {
    if (!confirm('Are you sure you want to delete this package? This action cannot be undone.')) {
      return;
    }

    setDeleteId(id);
    try {
      // First, delete the image from Cloudinary (if it's a Cloudinary URL)
      if (imageUrl && imageUrl.includes('cloudinary.com')) {
        const publicId = extractPublicIdFromUrl(imageUrl);
        if (publicId) {
          await deleteImageFromCloudinary(publicId);
          // Don't show error to user if Cloudinary delete fails, just log it
        }
      }
      
      // Then delete the package from your database
      await packagesAPI.delete(id.toString());
      toast.success('Package deleted successfully');
      fetchPackages(); // Refresh the list
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete package');
    } finally {
      setDeleteId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <FaSpinner className="w-12 h-12 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Manage Packages</h1>
            <p className="text-gray-600">View, edit, and delete your packages</p>
          </div>
          <Link href="/admin/add">
            <Button variant="primary">
              <FaPlus className="inline mr-2" />
              Add New Package
            </Button>
          </Link>
        </div>

        {/* Packages Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Package
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Capacity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Featured
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {packages.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                      No packages found. Click "Add New Package" to create one.
                    </td>
                  </tr>
                ) : (
                  packages.map((pkg) => (
                    <tr key={pkg.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="relative h-12 w-16 shrink-0">
                            <Image
                              src={pkg.image || '/placeholder-image.jpg'}
                              alt={pkg.title}
                              fill
                              className="object-cover rounded"
                              unoptimized={pkg.image?.includes('cloudinary.com')}
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {pkg.title}
                            </div>
                            <div className="text-sm text-gray-500 truncate max-w-xs">
                              {pkg.shortDesc}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-semibold text-gray-900">
                          ${pkg.price}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800 capitalize">
                          {pkg.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {pkg.capacity} guests
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {pkg.isFeatured ? (
                          <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">
                            Featured
                          </span>
                        ) : (
                          <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-600">
                            No
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <Link href={`/admin/edit/${pkg.id}`}>
                            <button
                              className="text-green-600 hover:text-green-900 transition-colors"
                              title="Edit Package"
                            >
                              <FaEdit size={18} />
                            </button>
                          </Link>
                          <Link href={`/items/${pkg.id}`}>
                            <button
                              className="text-blue-600 hover:text-blue-900 transition-colors"
                              title="View Package"
                            >
                              <FaEye size={18} />
                            </button>
                          </Link>
                          <button
                            onClick={() => handleDelete(pkg.id, pkg.image)}
                            disabled={deleteId === pkg.id}
                            className="text-red-600 hover:text-red-900 transition-colors disabled:opacity-50"
                            title="Delete Package"
                          >
                            {deleteId === pkg.id ? (
                              <FaSpinner className="w-4 h-4 animate-spin" />
                            ) : (
                              <FaTrash size={18} />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg p-4 shadow-md">
            <p className="text-sm text-gray-500">Total Packages</p>
            <p className="text-2xl font-bold text-gray-900">{packages.length}</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-md">
            <p className="text-sm text-gray-500">Featured Packages</p>
            <p className="text-2xl font-bold text-gray-900">
              {packages.filter(p => p.isFeatured).length}
            </p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-md">
            <p className="text-sm text-gray-500">Average Price</p>
            <p className="text-2xl font-bold text-gray-900">
              ${packages.length ? (packages.reduce((sum, p) => sum + p.price, 0) / packages.length).toFixed(0) : 0}
            </p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-md">
            <p className="text-sm text-gray-500">Categories</p>
            <p className="text-2xl font-bold text-gray-900">
              {new Set(packages.map(p => p.category)).size}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
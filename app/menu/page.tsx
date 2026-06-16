'use client';

import { useState, useEffect } from 'react';
import { menuItemsAPI } from '@/lib/api/menuItems';
import { MenuItem } from '@/types/index';
import Button from '@/components/ui/Button';
import { useAuth } from '@/lib/context/AuthContext';
import Link from 'next/link';
import Image from 'next/image';

export default function MenuPage() {
  const { user } = useAuth();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMenuItems();
  }, [category]);

  const fetchMenuItems = async () => {
    try {
      setLoading(true);
      const params: any = {};
      if (category) params.category = category;
      const res = await menuItemsAPI.getAll(params);
      setMenuItems(res.data || []);
    } catch (err: any) {
      setError('Failed to load menu');
    } finally {
      setLoading(false);
    }
  };

  const categories = ['', 'starter', 'main', 'dessert', 'drink'];

  return (
    <div className="min-h-screen bg-[#06101a] py-12">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-center text-gray-100 mb-4">Our Menu</h1>
        <p className="text-center text-gray-600 mb-8">
          Explore our delicious range of food and beverages
        </p>

        {/* Category Filter */}
        <div className="flex justify-center gap-2 mb-8 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-2  text-sm font-medium transition-colors ${
                category === cat
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border'
              }`}
            >
              {cat ? cat.charAt(0).toUpperCase() + cat.slice(1) : 'All'}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : menuItems.length === 0 ? (
          <p className="text-center text-gray-500">No menu items available.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {menuItems.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                {item.images && item.images.length > 0 && (
                  <div className="relative h-48 w-full">
                    <Image
                      src={item.images[0]}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold">{item.name}</h3>
                    <span className="text-blue-600 font-bold">${item.price.toFixed(2)}</span>
                  </div>
                  {item.category && (
                    <span className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                      {item.category}
                    </span>
                  )}
                  <div className="mt-3 flex items-center justify-between">
                    <span className={`text-sm ${item.availability ? 'text-green-600' : 'text-red-600'}`}>
                      {item.availability ? 'Available' : 'Unavailable'}
                    </span>
                    {user && user.role === 'user' && item.availability && (
                      <Link href={`/dashboard/orders?menuItemId=${item.id}`}>
                        <Button size="sm">Order Now</Button>
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
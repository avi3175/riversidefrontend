'use client';

import { useEffect, useState } from 'react';
import { packagesAPI, Package } from '@/lib/api/packages';
import ItemCard from '@/components/items/ItemCard';
import Link from 'next/link';
import Button from '@/components/ui/Button';

export default function FeaturedPackages() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const data = await packagesAPI.getFeatured();
        // data is now already the array of packages
        setPackages(data.slice(0, 3)); // Show only first 3 featured
      } catch (error) {
        console.error('Failed to fetch featured packages:', error);
        setPackages([]);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  if (loading) {
    return (
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Featured Packages
            </h2>
            <p className="text-xl text-gray-300">Loading amazing destinations...</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-200 rounded-xl h-96 animate-pulse"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (packages.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-[#06101a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-300 mb-4">
            Featured Packages
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Our most popular riverside escapes handpicked just for you
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {packages.map((pkg) => (
            <ItemCard key={pkg.id} packageItem={pkg} />
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Link href="/items">
            <Button variant="outline" size="lg">
              View All Packages →
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
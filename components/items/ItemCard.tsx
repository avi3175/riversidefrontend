'use client';

import Image from 'next/image';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import { Package } from '@/lib/api/packages';

interface ItemCardProps {
  packageItem: Package;
}

export default function ItemCard({ packageItem }: ItemCardProps) {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      {/* Image */}
      <div className="relative h-48 w-full">
        <Image
          src={packageItem.image || '/placeholder-image.jpg'}
          alt={packageItem.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = '/placeholder-image.jpg';
          }}
        />
        {packageItem.isFeatured && (
          <span className="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded-md text-xs font-semibold">
            Featured
          </span>
        )}
      </div>
      
      {/* Content */}
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-semibold text-gray-900 line-clamp-1">
            {packageItem.title}
          </h3>
          <span className="text-lg font-bold text-blue-600">
            ${packageItem.price}
          </span>
        </div>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {packageItem.shortDesc}
        </p>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <span>👥 {packageItem.capacity} guests</span>
            <span>•</span>
            <span className="capitalize">{packageItem.category}</span>
          </div>
        </div>
        
        <Link href={`/items/${packageItem.id}`}>
          <Button variant="primary" size="sm" className="w-full">
            View Details →
          </Button>
        </Link>
      </div>
    </div>
  );
}
'use client';

import Button from '@/components/ui/Button';
import Link from 'next/link';

export default function Hero() {
  return (
    <section className="relative bg-[#06101a]  text-white pb-16 pt-16">
      {/* Background Image from Unsplash */}
      <div 
        className="absolute inset-0  bg-center opacity-90"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1634956730836-6acb406cd01e?fm=jpg&q=60&w=3000&auto=format&fit=crop')`,
          width: '85%',
          height: '75%',
          margin:'auto',
        }}
      />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Escape to Riverside Paradise
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
            Discover luxurious riverside retreats, breathtaking views, and unforgettable experiences.
            Book your dream getaway today!
          </p>
          <Link href="/items">
            <Button variant="outline" size="lg" className="text-gray-300 hover:bg-gray-900">
              Explore Packages →
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
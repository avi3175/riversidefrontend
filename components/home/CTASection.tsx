'use client';

import Button from '@/components/ui/Button';
import Link from 'next/link';

export default function CTASection() {
  return (
    <section className="py-16 bg-[#06101a]">
      <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Ready for Your Riverside Adventure?
        </h2>
        <p className="text-xl text-blue-100 mb-8">
          Book your stay today and create memories that will last a lifetime
        </p>
        <Link href="/items">
          <Button variant="outline" size="lg" className=" text-gray-300 hover:bg-gray-900">
            Book Now →
          </Button>
        </Link>
      </div>
    </section>
  );
}
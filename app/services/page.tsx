'use client';

import { useState, useEffect } from 'react';
import { servicesAPI } from '@/lib/api/services';
import { Service } from '@/types/index';
import Image from 'next/image';

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const res = await servicesAPI.getAll();
      setServices(res.data || []);
    } catch (err) {
      console.error('Failed to load services');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#06101a] py-12">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-4 text-gray-100">Our Services</h1>
        <p className="text-center text-gray-600 mb-12">
          Everything you need for a perfect riverside retreat
        </p>

        {loading ? (
          <div className="text-center py-12">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
          </div>
        ) : services.length === 0 ? (
          <p className="text-center text-gray-500">No services available yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.filter(s => s.availability).map((service) => (
              <div key={service.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                {service.image && (
                  <div className="relative h-56 w-full">
                    <Image
                      src={service.image}
                      alt={service.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{service.name}</h3>
                  {service.description && (
                    <p className="text-gray-600">{service.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
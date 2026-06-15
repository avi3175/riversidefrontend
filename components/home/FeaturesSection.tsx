'use client';

import { FaTree, FaWater, FaFire, FaSpa } from 'react-icons/fa';

const features = [
  {
    icon: FaWater,
    title: 'Riverside Views',
    description: 'Spectacular waterfront locations with stunning river views from every room.'
  },
  {
    icon: FaTree,
    title: 'Nature Trails',
    description: 'Explore scenic walking trails and immerse yourself in natural beauty.'
  },
  {
    icon: FaFire,
    title: 'Campfire Evenings',
    description: 'Cozy campfire nights under the stars with storytelling and marshmallows.'
  },
  {
    icon: FaSpa,
    title: 'Luxury Spa',
    description: 'Rejuvenate with premium spa treatments and wellness experiences.'
  }
];

export default function FeaturesSection() {
  return (
    <section className="py-16 bg-[#06101a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Why Choose Riverside Retreat?
          </h2>
          <p className="text-xl text-white max-w-3xl mx-auto">
            Experience the perfect blend of luxury and nature
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cors-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="border border-blue-800 rounded-xl p-6 text-center shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
            >
              <div className="inline-flex border border-blue-800 items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                <feature.icon className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-100 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-100">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
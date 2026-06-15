'use client';

import { FaStar, FaQuoteLeft } from 'react-icons/fa';

const testimonials = [
  {
    name: 'Sarah Johnson',
    location: 'New York, NY',
    rating: 5,
    text: 'Absolutely incredible experience! The riverside view was breathtaking, and the staff went above and beyond. Will definitely return!',
    image: 'https://randomuser.me/api/portraits/women/1.jpg'
  },
  {
    name: 'Michael Chen',
    location: 'San Francisco, CA',
    rating: 5,
    text: 'Perfect getaway from the city. The luxury cabin exceeded our expectations. Morning coffee by the river was pure bliss.',
    image: 'https://randomuser.me/api/portraits/men/2.jpg'
  },
  {
    name: 'Emily Rodriguez',
    location: 'Austin, TX',
    rating: 5,
    text: 'Amazing service and beautiful location. The campfire evening was magical. Highly recommend for couples retreat!',
    image: 'https://randomuser.me/api/portraits/women/3.jpg'
  }
];

export default function TestimonialsSection() {
  return (
    <section className="py-16 bg-[#06101a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-300 mb-4">
            What Our Guests Say
          </h2>
          <p className="text-xl text-gray-300">
            Real experiences from real travelers
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <FaQuoteLeft className="w-8 h-8 text-blue-400 mb-4" />
              <p className="text-gray-700 mb-4 italic">{testimonial.text}</p>
              <div className="flex items-center mb-3">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <FaStar key={i} className="w-4 h-4 text-yellow-400" />
                ))}
              </div>
              <div className="flex items-center space-x-3">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold text-gray-900">{testimonial.name}</p>
                  <p className="text-sm text-gray-500">{testimonial.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
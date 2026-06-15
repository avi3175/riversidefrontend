import Image from 'next/image';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#06101a] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-500 mb-4">
            About Riverside Retreat
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover the story behind our passion for creating unforgettable riverside experiences
          </p>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="relative h-64 md:h-full min-h-100">
              <Image
                src="https://images.unsplash.com/photo-1542718610-a1d656d1884c?w=800&h=600&fit=crop"
                alt="Riverside Retreat property"
                fill
                className="object-cover"
              />
            </div>
            <div className="p-8 md:p-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Story</h2>
              <p className="text-gray-700 mb-4 leading-relaxed">
                Founded in 2020, Riverside Retreat was born from a simple idea: create a sanctuary where 
                people could escape the chaos of city life and reconnect with nature, without sacrificing 
                modern comforts and luxury.
              </p>
              <p className="text-gray-700 mb-4 leading-relaxed">
                Nestled along the most pristine riverbanks, our retreats offer the perfect blend of 
                tranquility and adventure. Each property is carefully selected and designed to provide 
                breathtaking views, exceptional comfort, and authentic experiences.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Today, we're proud to be one of the most trusted names in riverside accommodations, 
                with hundreds of satisfied guests who've made unforgettable memories at our properties.
              </p>
            </div>
          </div>
        </div>

        {/* Mission & Values */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-gray-900 rounded-xl p-8 shadow-md">
            <h3 className="text-2xl font-bold text-gray-300 mb-4">Our Mission</h3>
            <p className="text-gray-300 leading-relaxed">
              To provide exceptional riverside experiences that rejuvenate the mind, body, and spirit, 
              while preserving the natural beauty of our locations for generations to come.
            </p>
          </div>
          
          <div className="bg-gray-900 rounded-xl p-8 shadow-md">
            <h3 className="text-2xl font-bold text-gray-300 mb-4">Our Values</h3>
            <ul className="space-y-2 text-gray-300">
              <li>🌿 • Sustainability & Eco-friendly practices</li>
              <li>⭐ • Excellence in guest experience</li>
              <li>🤝 • Community & Local partnerships</li>
              <li>💚 • Genuine hospitality with heart</li>
            </ul>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="bg-gray-900 rounded-xl p-6 text-center text-white">
            <div className="text-4xl font-bold mb-2">500+</div>
            <div className="text-sm">Happy Guests</div>
          </div>
          <div className="bg-gray-900 rounded-xl p-6 text-center text-white">
            <div className="text-4xl font-bold mb-2">15+</div>
            <div className="text-sm">Luxury Properties</div>
          </div>
          <div className="bg-gray-900 rounded-xl p-6 text-center text-white">
            <div className="text-4xl font-bold mb-2">4.9</div>
            <div className="text-sm">Guest Rating</div>
          </div>
          <div className="bg-gray-900 rounded-xl p-6 text-center text-white">
            <div className="text-4xl font-bold mb-2">5</div>
            <div className="text-sm">Years of Excellence</div>
          </div>
        </div>
      </div>
    </div>
  );
}
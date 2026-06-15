'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import { FaStar } from 'react-icons/fa';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const slides = [
  {
    image: 'https://images.unsplash.com/photo-1528402520525-05f8b9608a6c?q=80&w=464&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    title: 'Rainy Riverside Morning',
    description: 'Cozy room with rain tapping on the window and misty river views',
  },
  {
    image: 'https://images.unsplash.com/photo-1624921938155-48a9a341d501?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    title: 'Misty River Escape',
    description: 'Calm river waters surrounded by serene morning fog',
  },
  {
    image: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?fm=jpg&q=80&w=1920&auto=format&fit=crop',
    title: 'Moonlit Riverside',
    description: 'Peaceful night vibes with moonlight reflecting on the water',
  },
  {
    image: 'https://images.unsplash.com/photo-1759143041613-83f27cfbb913?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    title: 'Moonlit Riverside',
    description: 'Peaceful night vibes with moonlight reflecting on the water',
  },
  {
    image: 'https://images.unsplash.com/photo-1625540452243-997a0ca620ec?q=80&w=869&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    title: 'Moonlit Riverside',
    description: 'Peaceful night vibes with moonlight reflecting on the water',
  },
  {
    image: 'https://images.unsplash.com/photo-1601726857660-a3b9fb0dadcb?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    title: 'Moonlit Riverside',
    description: 'Peaceful night vibes with moonlight reflecting on the water',
  },
];

export default function ResortSlider() {
  return (
    <section className="bg-[#06101a] pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Our Resort Gallery
          </h2>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            A glimpse into the paradise that awaits you
          </p>
        </div>

        <Swiper
          modules={[Autoplay, Navigation, Pagination]}
          spaceBetween={24}
          slidesPerView={1}
          breakpoints={{
            640: { slidesPerView: 1.5, centeredSlides: true },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 2.5, centeredSlides: true },
          }}
          navigation={{
            nextEl: '.swiper-button-next-custom',
            prevEl: '.swiper-button-prev-custom',
          }}
          pagination={{
            clickable: true,
            el: '.swiper-pagination-custom',
            bulletClass: 'swiper-pagination-bullet-custom',
            bulletActiveClass: 'swiper-pagination-bullet-active-custom',
          }}
          autoplay={{
            delay: 4000,
            disableOnInteraction: false,
          }}
          loop={true}
          grabCursor={true}
          className="pb-14!"
        >
          {slides.map((slide, index) => (
            <SwiperSlide key={index}>
              <div className="relative h-70 md:h-80 lg:h-96 rounded-2xl overflow-hidden group">
                {/* Background Image */}
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                  style={{ backgroundImage: `url('${slide.image}')` }}
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                  <div className="flex items-center gap-1.5 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} className="w-4 h-4 text-yellow-400" />
                    ))}
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-white mb-1.5">
                    {slide.title}
                  </h3>
                  <p className="text-base md:text-lg text-blue-100">
                    {slide.description}
                  </p>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Custom Navigation & Pagination */}
        <div className="flex items-center justify-center gap-6 mt-6">
          <button className="swiper-button-prev-custom bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition-all duration-300 cursor-pointer">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <div className="swiper-pagination-custom flex items-center gap-2" />

          <button className="swiper-button-next-custom bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition-all duration-300 cursor-pointer">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Custom Styles for Swiper */}
      <style jsx global>{`
        .swiper-pagination-custom {
          display: flex !important;
          align-items: center;
          gap: 8px;
        }
        .swiper-pagination-bullet-custom {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.4);
          cursor: pointer;
          transition: all 0.3s ease;
          border: none;
          padding: 0;
        }
        .swiper-pagination-bullet-active-custom {
          width: 28px;
          border-radius: 5px;
          background: white;
        }
      `}</style>
    </section>
  );
}
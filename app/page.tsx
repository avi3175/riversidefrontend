import Hero from '@/components/home/Hero';
import ResortSlider from '@/components/home/ResortSlider';
import FeaturesSection from '@/components/home/FeaturesSection';
import FeaturedPackages from '@/components/home/FeaturedPackages';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import CTASection from '@/components/home/CTASection';

export default function HomePage() {
  return (
    <>
      <Hero />
      <ResortSlider />
      <FeaturesSection />
      <FeaturedPackages />
      <TestimonialsSection />
      <CTASection />
    </>
  );
}
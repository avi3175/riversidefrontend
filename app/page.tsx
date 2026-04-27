import Hero from '@/components/home/Hero';
import FeaturesSection from '@/components/home/FeaturesSection';
import FeaturedPackages from '@/components/home/FeaturedPackages';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import CTASection from '@/components/home/CTASection';

export default function HomePage() {
  return (
    <>
      <Hero />
      <FeaturesSection />
      <FeaturedPackages />
      <TestimonialsSection />
      <CTASection />
    </>
  );
}
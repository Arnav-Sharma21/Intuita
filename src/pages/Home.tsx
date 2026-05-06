import Hero from '@/components/sections/Hero';
import MarqueeBand from '@/components/sections/MarqueeBand';
import HowItWorks from '@/components/sections/HowItWorks';
import Features from '@/components/sections/Features';
import HorizontalScroll from '@/components/sections/HorizontalScroll';
import Testimonials from '@/components/sections/Testimonials';
import Pricing from '@/components/sections/Pricing';

interface HomeProps {
  loaded: boolean;
}

export default function Home({ loaded }: HomeProps) {
  return (
    <>
      <Hero loaded={loaded} />
      <MarqueeBand />
      <HowItWorks />
      <Features />
      <HorizontalScroll />
      <Testimonials />
      <Pricing />
    </>
  );
}

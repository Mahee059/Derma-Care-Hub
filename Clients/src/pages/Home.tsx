import CTASection from "../components/landing/CTA.section";
import FeaturesSection from "../components/landing/features.section";
import HeroSection from "../components/landing/hero.section";
import { HowItWorks } from "../components/landing/howitworks";
import { Testimonials } from "../components/landing/testimonials";


export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-16 mx-4 md:mx-16">
      <HeroSection />
      <FeaturesSection />
      <HowItWorks />
      <Testimonials />
      <CTASection />
    </div>
  );
}

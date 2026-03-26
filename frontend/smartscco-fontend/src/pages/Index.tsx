import Navbar from "@/components/landing/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import MetricsSection from "@/components/landing/MetricsSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import SecuritySection from "@/components/landing/SecuritySection";
import PlatformSection from "@/components/landing/PlatformSection";
import CTASection from "@/components/landing/CTASection";
import Footer from "@/components/landing/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <MetricsSection />
      <FeaturesSection />
      <SecuritySection />
      <PlatformSection />
      <CTASection />
      <Footer />
    </div>
  );
};

export default Index;

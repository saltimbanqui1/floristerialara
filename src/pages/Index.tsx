import LandingHeader from "@/components/landing/LandingHeader";
import LandingHero from "@/components/landing/LandingHero";
import ServicesSection from "@/components/ServicesSection";
import WhyChooseUs from "@/components/WhyChooseUs";
import ProductShowcase from "@/components/landing/ProductShowcase";

import CheckoutSection from "@/components/checkout/CheckoutSection";
import LandingFooter from "@/components/landing/LandingFooter";
import { useCart } from "@/contexts/CartContext";

const Index = () => {
  const { items } = useCart();
  const hasItemsInCart = items.length > 0;

  return (
    <div className="min-h-screen bg-background">
      <LandingHeader />
      <main className="pt-16 md:pt-20">
        <LandingHero />
        <ServicesSection />
        <WhyChooseUs />
        <ProductShowcase />
        
        {hasItemsInCart && <CheckoutSection />}
      </main>
      <LandingFooter />
    </div>
  );
};

export default Index;

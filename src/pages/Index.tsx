import { useState } from "react";
import LandingHeader from "@/components/landing/LandingHeader";
import LandingHero from "@/components/landing/LandingHero";
import ProductShowcase from "@/components/landing/ProductShowcase";
import CheckoutSection from "@/components/checkout/CheckoutSection";
import LandingFooter from "@/components/landing/LandingFooter";

interface SelectedProduct {
  id: string;
  name: string;
  price: number;
  description: string;
}

const Index = () => {
  const [selectedProduct, setSelectedProduct] = useState<SelectedProduct | null>(null);

  const handleSelectProduct = (product: SelectedProduct) => {
    setSelectedProduct(product);
  };

  const handleClearProduct = () => {
    setSelectedProduct(null);
    // Scroll back to products
    const productsSection = document.getElementById("productos");
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <LandingHeader />
      <main className="pt-16 md:pt-20">
        <LandingHero />
        <ProductShowcase onSelectProduct={handleSelectProduct} />
        {selectedProduct && (
          <CheckoutSection 
            selectedProduct={selectedProduct} 
            onClearProduct={handleClearProduct}
          />
        )}
      </main>
      <LandingFooter />
    </div>
  );
};

export default Index;

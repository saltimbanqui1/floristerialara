import { motion } from "framer-motion";
import { Phone, MapPin } from "lucide-react";

const LandingHeader = () => {
  const scrollToProducts = () => {
    const productsSection = document.getElementById("productos");
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container-narrow px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex items-center gap-2"
          >
            <span className="font-serif text-2xl md:text-3xl font-semibold text-primary">
              Floristería Lara
            </span>
          </button>

          {/* Navigation */}
          <nav className="flex items-center gap-4 md:gap-6">
            <button
              onClick={scrollToProducts}
              className="hidden md:block text-muted-foreground hover:text-primary transition-colors font-medium"
            >
              Productos
            </button>
            
            <div className="hidden md:flex items-center gap-2 text-muted-foreground text-sm">
              <MapPin className="w-4 h-4" />
              <span>La Laguna</span>
            </div>

            <a
              href="tel:922251318"
              className="inline-flex items-center gap-2 text-primary font-medium hover:text-primary/80 transition-colors"
            >
              <Phone className="w-4 h-4" />
              <span className="hidden sm:inline">922 25 13 18</span>
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default LandingHeader;

import { motion } from "framer-motion";
import { ArrowDown, Clock, MapPin, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-flowers.jpg";

const trustPoints = [
  "50+ años de experiencia",
  "Entrega fiable y puntual",
  "Flores de máxima frescura",
  "Asesoramiento personalizado",
];

const LandingHero = () => {
  const scrollToProducts = () => {
    const productsSection = document.getElementById("productos");
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative min-h-[70vh] flex items-center overflow-hidden">
      {/* Hero Image Background */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Arreglo floral elegante de Floristería Lara"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/40" />
      </div>

      <div className="container-narrow w-full py-12 md:py-16 px-4 md:px-8 relative z-10">
        <div className="max-w-xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-5"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-background/80 backdrop-blur-sm border border-border">
              <MapPin className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-foreground">
                La Laguna, Tenerife
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-medium tracking-tight text-foreground text-balance">
              Flores que expresan lo que las palabras no pueden
            </h1>

            <p className="text-base text-muted-foreground max-w-lg">
              Arreglos florales artesanales desde 1975. Entrega en La Laguna y alrededores.
            </p>

            {/* Trust Points */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="grid grid-cols-2 gap-x-4 gap-y-2"
            >
              {trustPoints.map((point) => (
                <div key={point} className="flex items-center gap-2">
                  <div className="flex-shrink-0 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                    <Check className="w-3 h-3 text-primary-foreground" />
                  </div>
                  <span className="text-sm text-foreground font-medium">{point}</span>
                </div>
              ))}
            </motion.div>

            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>L-V: 9:00 - 20:00</span>
              </div>
            </div>

            <div className="pt-2">
              <Button
                onClick={scrollToProducts}
                className="btn-botanical text-lg py-6 px-8 font-medium gap-2"
              >
                Ver productos
                <ArrowDown className="w-5 h-5" />
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default LandingHero;

import { motion } from "framer-motion";
import { Phone, MapPin, Clock, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-flowers.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-[85vh] flex items-center overflow-hidden">
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
        <div className="max-w-2xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-5"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-background/80 backdrop-blur-sm border border-border">
              <MapPin className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-charcoal">
                La Laguna, Tenerife
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-medium tracking-tight text-charcoal text-balance">
              Flores que expresan lo que las palabras no pueden
            </h1>

            <p className="text-base text-charcoal-light max-w-lg">
              Desde 1985, creando arreglos florales artesanales en el corazón de
              San Cristóbal de La Laguna.
            </p>

            <div className="flex flex-wrap gap-5 pt-2">
              <a
                href="tel:922251318"
                className="inline-flex items-center gap-2 text-primary font-medium hover:underline"
              >
                <Phone className="w-5 h-5" />
                922 25 13 18
              </a>
              <div className="flex items-center gap-2 text-charcoal-light">
                <Clock className="w-5 h-5" />
                <span className="text-sm">L-V: 9:00 - 20:00</span>
              </div>
            </div>

            {/* WhatsApp Direct Button - No form, no user input */}
            <div className="pt-4">
              <Button
                asChild
                className="btn-botanical text-lg py-6 px-8"
              >
                <a
                  href="https://wa.me/34922251318"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Contactar por WhatsApp
                </a>
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

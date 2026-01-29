import { motion } from "framer-motion";
import { Phone, MapPin, Clock, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

const CTASection = () => {
  return (
    <section className="py-10 md:py-14 bg-primary relative overflow-hidden">
      <div className="container-narrow px-4 md:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto"
        >
          <h2 className="text-2xl md:text-3xl font-serif font-medium text-primary-foreground mb-4">
            ¿Listo para crear algo especial?
          </h2>
          <p className="text-primary-foreground/80 mb-6 max-w-xl mx-auto">
            Llámanos o envíanos un WhatsApp.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
            <Button
              asChild
              className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 px-6"
            >
              <a href="tel:922251318">
                <Phone className="w-4 h-4 mr-2" />
                922 25 13 18
              </a>
            </Button>
            <Button
              asChild
              variant="outline"
              className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10 px-6"
            >
              <a
                href="https://wa.me/34922251318"
                target="_blank"
                rel="noopener noreferrer"
              >
                WhatsApp
              </a>
            </Button>
          </div>

          {/* Contact Info - Compact */}
          <div className="flex flex-wrap justify-center gap-6 text-sm text-primary-foreground/80">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-petal" />
              <span>C. San Antonio, 30 · La Laguna</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-petal" />
              <span>L-V: 9:00-13:30 | 17:00-20:00</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;

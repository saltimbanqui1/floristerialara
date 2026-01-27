import { motion } from "framer-motion";
import { Phone, MapPin, Clock, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

const CTASection = () => {
  return (
    <section className="section-padding bg-primary relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-secondary rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-petal rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2" />
      </div>

      <div className="container-narrow relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto"
        >
          <h2 className="heading-section text-primary-foreground mb-6">
            ¿Listo para crear algo especial?
          </h2>
          <p className="text-lg text-primary-foreground/80 mb-10 max-w-2xl mx-auto">
            Visítanos en nuestra tienda, llámanos o envíanos un WhatsApp. Estamos
            aquí para hacer realidad tus ideas florales.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button
              asChild
              size="lg"
              className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 text-lg px-8 py-6"
            >
              <a href="tel:922251318">
                <Phone className="w-5 h-5 mr-2" />
                Llamar ahora
              </a>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10 text-lg px-8 py-6"
            >
              <a
                href="https://wa.me/34922251318"
                target="_blank"
                rel="noopener noreferrer"
              >
                Enviar WhatsApp
              </a>
            </Button>
          </div>

          {/* Contact Info Cards */}
          <div className="grid sm:grid-cols-3 gap-6 text-left">
            <div className="bg-primary-foreground/10 rounded-xl p-6 backdrop-blur-sm">
              <MapPin className="w-8 h-8 text-petal mb-4" />
              <h4 className="font-serif font-medium text-primary-foreground mb-2">
                Dirección
              </h4>
              <p className="text-primary-foreground/80 text-sm">
                C. San Antonio, 30, LOCAL 11
                <br />
                38202 La Laguna, Tenerife
              </p>
              <a
                href="https://maps.google.com/?q=Floristería+Lara+La+Laguna"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-petal text-sm mt-2 hover:underline"
              >
                Ver en mapa <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="bg-primary-foreground/10 rounded-xl p-6 backdrop-blur-sm">
              <Clock className="w-8 h-8 text-petal mb-4" />
              <h4 className="font-serif font-medium text-primary-foreground mb-2">
                Horario
              </h4>
              <p className="text-primary-foreground/80 text-sm">
                Lunes a Viernes
                <br />
                09:00 - 13:30 | 17:00 - 20:00
              </p>
              <p className="text-petal text-sm mt-2">Sábados con cita previa</p>
            </div>

            <div className="bg-primary-foreground/10 rounded-xl p-6 backdrop-blur-sm">
              <Phone className="w-8 h-8 text-petal mb-4" />
              <h4 className="font-serif font-medium text-primary-foreground mb-2">
                Contacto
              </h4>
              <p className="text-primary-foreground/80 text-sm">
                Teléfono: 922 25 13 18
                <br />
                WhatsApp disponible
              </p>
              <a
                href="https://floristerialaraonline.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-petal text-sm mt-2 hover:underline"
              >
                floristerialaraonline.com <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;

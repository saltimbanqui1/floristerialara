import { motion } from "framer-motion";
import { Heart, Gift, Calendar, Flower2 } from "lucide-react";

const services = [
  {
    icon: Heart,
    title: "Bodas y Eventos",
    description:
      "Ramos de novia, centros de mesa, decoraciones florales y ambientación completa para tu día especial.",
    color: "bg-petal/20",
    iconColor: "text-petal",
  },
  {
    icon: Gift,
    title: "Ramos y Bouquets",
    description:
      "Arreglos florales personalizados para cumpleaños, aniversarios, San Valentín y cualquier ocasión.",
    color: "bg-primary/10",
    iconColor: "text-primary",
  },
  {
    icon: Calendar,
    title: "Flores para Empresas",
    description:
      "Servicio de suscripción semanal para oficinas, hoteles y restaurantes. Flores frescas siempre.",
    color: "bg-secondary/30",
    iconColor: "text-secondary-foreground",
  },
  {
    icon: Flower2,
    title: "Coronas y Condolencias",
    description:
      "Arreglos funerarios con la máxima delicadeza y respeto. Entrega express disponible.",
    color: "bg-muted",
    iconColor: "text-charcoal-light",
  },
];

const ServicesSection = () => {
  return (
    <section className="section-padding bg-background" id="servicios">
      <div className="container-narrow">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-primary font-medium text-sm uppercase tracking-wider">
            Nuestros Servicios
          </span>
          <h2 className="heading-section text-charcoal mt-4 mb-6">
            Creamos momentos inolvidables
          </h2>
          <p className="text-body text-charcoal-light max-w-2xl mx-auto">
            Desde íntimos detalles hasta grandes celebraciones, nuestro equipo
            de floristas expertos convierte tus ideas en realidad.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="card-organic p-8 border border-border group hover:border-primary/30 transition-colors"
            >
              <div
                className={`w-16 h-16 rounded-2xl ${service.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}
              >
                <service.icon className={`w-8 h-8 ${service.iconColor}`} />
              </div>
              <h3 className="text-2xl font-serif font-medium text-charcoal mb-3">
                {service.title}
              </h3>
              <p className="text-charcoal-light leading-relaxed">
                {service.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;

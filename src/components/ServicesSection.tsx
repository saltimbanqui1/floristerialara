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
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <span className="text-primary font-medium text-sm uppercase tracking-wider">
            Nuestros Servicios
          </span>
          <h2 className="text-2xl md:text-3xl font-serif font-medium text-charcoal mt-3 mb-4">
            Creamos momentos inolvidables
          </h2>
          <p className="text-charcoal-light max-w-2xl mx-auto">
            Desde íntimos detalles hasta grandes celebraciones.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="card-organic p-5 border border-border group hover:border-primary/30 transition-colors text-center"
            >
              <div
                className={`w-12 h-12 rounded-xl ${service.color} flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform`}
              >
                <service.icon className={`w-6 h-6 ${service.iconColor}`} />
              </div>
              <h3 className="text-lg font-serif font-medium text-charcoal mb-2">
                {service.title}
              </h3>
              <p className="text-sm text-charcoal-light leading-relaxed">
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

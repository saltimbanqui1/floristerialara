import { motion } from "framer-motion";
import { Truck, Award, Clock, ShieldCheck } from "lucide-react";

const badges = [
  {
    icon: Truck,
    title: "Entrega a domicilio",
    description: "En toda la isla de Tenerife",
  },
  {
    icon: Award,
    title: "+35 años de experiencia",
    description: "Tradición artesanal desde 1985",
  },
  {
    icon: Clock,
    title: "Atención personalizada",
    description: "Asesoramiento experto incluido",
  },
  {
    icon: ShieldCheck,
    title: "Frescura garantizada",
    description: "Flores de la más alta calidad",
  },
];

const TrustBadges = () => {
  return (
    <section className="py-6 bg-cream-dark border-y border-border">
      <div className="container-narrow px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {badges.map((badge, index) => (
            <motion.div
              key={badge.title}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <badge.icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h4 className="font-serif font-medium text-charcoal text-sm leading-tight">
                  {badge.title}
                </h4>
                <p className="text-xs text-charcoal-light">{badge.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustBadges;

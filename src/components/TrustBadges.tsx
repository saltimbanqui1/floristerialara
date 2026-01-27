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
    <section className="py-12 bg-cream-dark border-y border-border">
      <div className="container-narrow px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {badges.map((badge, index) => (
            <motion.div
              key={badge.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex flex-col items-center text-center"
            >
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <badge.icon className="w-7 h-7 text-primary" />
              </div>
              <h4 className="font-serif font-medium text-charcoal mb-1">
                {badge.title}
              </h4>
              <p className="text-sm text-charcoal-light">{badge.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustBadges;

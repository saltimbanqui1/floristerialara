import { motion } from "framer-motion";
import { Check } from "lucide-react";

const reasons = [
  {
    title: "Tradición artesanal",
    description:
      "Cada ramo está creado a mano por floristas con décadas de experiencia, utilizando técnicas tradicionales.",
  },
  {
    title: "Ubicación privilegiada",
    description:
      "En el corazón histórico de La Laguna, junto a la Iglesia de la Concepción. Fácil acceso y parking cercano.",
  },
  {
    title: "Flores de máxima frescura",
    description:
      "Seleccionamos las mejores flores cada mañana de proveedores locales y nacionales de confianza.",
  },
  {
    title: "Asesoramiento personalizado",
    description:
      "Te ayudamos a elegir las flores perfectas según la ocasión, presupuesto y preferencias personales.",
  },
  {
    title: "Entrega fiable y puntual",
    description:
      "Nuestro servicio de reparto cubre toda Tenerife con entregas en el mismo día para pedidos antes de las 14h.",
  },
  {
    title: "Atención cercana",
    description:
      "Somos un negocio familiar que cuida cada detalle. Tu satisfacción es nuestra mayor prioridad.",
  },
];

const WhyChooseUs = () => {
  return (
    <section className="py-10 md:py-14 bg-cream-dark" id="nosotros">
      <div className="container-narrow px-4 md:px-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-primary font-medium text-sm uppercase tracking-wider">
              ¿Por Qué Elegirnos?
            </span>
            <h2 className="text-2xl md:text-3xl font-serif font-medium text-charcoal mt-3 mb-4">
              Más de 50 años enamorando a La Laguna
            </h2>
            <p className="text-charcoal-light mb-6">
              Floristería Lara es un referente en el centro histórico. Generaciones
              de familias confían en nosotros.
            </p>

            <div className="flex flex-wrap gap-3">
              <div className="text-center px-4 py-3 bg-background rounded-lg border border-border">
                <div className="text-2xl font-serif font-bold text-primary">50+</div>
                <div className="text-xs text-charcoal-light">Años</div>
              </div>
              <div className="text-center px-4 py-3 bg-background rounded-lg border border-border">
                <div className="text-2xl font-serif font-bold text-primary">10K+</div>
                <div className="text-xs text-charcoal-light">Clientes</div>
              </div>
              <div className="text-center px-4 py-3 bg-background rounded-lg border border-border">
                <div className="text-2xl font-serif font-bold text-primary">4.8</div>
                <div className="text-xs text-charcoal-light">Google</div>
              </div>
            </div>
          </motion.div>

          {/* Right Content - Reasons List */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-2 gap-3"
          >
            {reasons.map((reason, index) => (
              <div key={reason.title} className="flex gap-2 items-start">
                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-primary flex items-center justify-center mt-0.5">
                  <Check className="w-3 h-3 text-primary-foreground" />
                </div>
                <div>
                  <h4 className="font-serif font-medium text-charcoal text-sm leading-tight">
                    {reason.title}
                  </h4>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;

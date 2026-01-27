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
    <section className="section-padding bg-cream-dark" id="nosotros">
      <div className="container-narrow">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-primary font-medium text-sm uppercase tracking-wider">
              ¿Por Qué Elegirnos?
            </span>
            <h2 className="heading-section text-charcoal mt-4 mb-6">
              Más de 35 años enamorando a La Laguna
            </h2>
            <p className="text-body text-charcoal-light mb-8">
              Floristería Lara no es solo una tienda de flores, es un referente
              en el centro histórico de San Cristóbal de La Laguna. Generaciones
              de familias confían en nosotros para sus momentos más especiales.
            </p>

            <div className="flex flex-wrap gap-4">
              <div className="text-center px-6 py-4 bg-background rounded-xl border border-border">
                <div className="text-4xl font-serif font-bold text-primary">
                  35+
                </div>
                <div className="text-sm text-charcoal-light">Años</div>
              </div>
              <div className="text-center px-6 py-4 bg-background rounded-xl border border-border">
                <div className="text-4xl font-serif font-bold text-primary">
                  10K+
                </div>
                <div className="text-sm text-charcoal-light">
                  Clientes felices
                </div>
              </div>
              <div className="text-center px-6 py-4 bg-background rounded-xl border border-border">
                <div className="text-4xl font-serif font-bold text-primary">
                  4.8
                </div>
                <div className="text-sm text-charcoal-light">
                  Valoración Google
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Content - Reasons List */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            {reasons.map((reason, index) => (
              <motion.div
                key={reason.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="flex gap-4"
              >
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                  <Check className="w-5 h-5 text-primary-foreground" />
                </div>
                <div>
                  <h4 className="font-serif font-medium text-charcoal mb-1">
                    {reason.title}
                  </h4>
                  <p className="text-sm text-charcoal-light">
                    {reason.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;

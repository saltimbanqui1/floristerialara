import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const reviews = [
  {
    name: "María García",
    role: "Novia",
    rating: 5,
    text: "Hicieron el ramo de mis sueños. El equipo entendió perfectamente mi visión y lo superaron con creces. ¡Gracias por hacer mi boda aún más especial!",
  },
  {
    name: "Carlos Rodríguez",
    role: "Cliente habitual",
    rating: 5,
    text: "Siempre compro aquí las flores para mi madre. La calidad es excepcional y el trato muy cercano. Un clásico de La Laguna que no decepciona.",
  },
  {
    name: "Ana Fernández",
    role: "Organizadora de eventos",
    rating: 5,
    text: "Colaboramos en varios eventos y siempre cumplen con profesionalidad y creatividad. Sus centros de mesa son espectaculares. 100% recomendados.",
  },
  {
    name: "Pedro Martín",
    role: "Cliente",
    rating: 5,
    text: "Encargué un arreglo para un momento difícil y lo trataron con mucha delicadeza. Entrega puntual y presentación impecable. Muy agradecido.",
  },
];

const ReviewsSection = () => {
  return (
    <section className="py-10 md:py-14 bg-cream-dark" id="resenas">
      <div className="container-narrow px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-1 mb-2">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-5 h-5 fill-petal text-petal" />
            ))}
            <span className="ml-2 text-charcoal font-medium text-sm">
              4.8 en Google
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-serif font-medium text-charcoal">
            Lo que dicen nuestros clientes
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {reviews.map((review, index) => (
            <motion.div
              key={review.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="card-organic p-4 border border-border relative"
            >
              <Quote className="absolute top-3 right-3 w-6 h-6 text-primary/10" />
              <p className="text-charcoal-light text-sm leading-relaxed mb-3 line-clamp-4">
                "{review.text}"
              </p>
              <div>
                <div className="font-serif font-medium text-charcoal text-sm">
                  {review.name}
                </div>
                <div className="text-xs text-charcoal-light">{review.role}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;

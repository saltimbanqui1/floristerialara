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
    <section className="section-padding bg-cream-dark" id="resenas">
      <div className="container-narrow">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-primary font-medium text-sm uppercase tracking-wider">
            Testimonios
          </span>
          <h2 className="heading-section text-charcoal mt-4 mb-6">
            Lo que dicen nuestros clientes
          </h2>
          <div className="flex items-center justify-center gap-2 mb-4">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-6 h-6 fill-petal text-petal" />
            ))}
            <span className="ml-2 text-charcoal font-medium">
              4.8 en Google Reviews
            </span>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {reviews.map((review, index) => (
            <motion.div
              key={review.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="card-organic p-8 border border-border relative"
            >
              <Quote className="absolute top-6 right-6 w-10 h-10 text-primary/10" />
              <div className="flex gap-1 mb-4">
                {[...Array(review.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-5 h-5 fill-petal text-petal"
                  />
                ))}
              </div>
              <p className="text-charcoal-light leading-relaxed mb-6">
                "{review.text}"
              </p>
              <div>
                <div className="font-serif font-medium text-charcoal">
                  {review.name}
                </div>
                <div className="text-sm text-charcoal-light">{review.role}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;

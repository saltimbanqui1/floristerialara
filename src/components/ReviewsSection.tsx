import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const reviews = [
  {
    name: "Marcos Melian",
    rating: 5,
    text: "Nos ofrecieron la solución adaptada a nuestras ideas, se ajustaron al presupuesto y el resultado fue impecable. Totalmente recomendables.",
  },
  {
    name: "Omaira Tavío Méndez",
    rating: 5,
    text: "Los resultados han sido maravillosos. Buena mano de obra + buenos materiales = arreglos de ensueño!",
  },
  {
    name: "Rafael Ferrera",
    rating: 5,
    text: "Muy buena experiencia, rapidez, limpieza y unos acabados espectaculares, totalmente recomendables.",
  },
  {
    name: "Juan Félix Rodríguez",
    rating: 5,
    text: "Resultado perfecto y calidad precio garantizado.",
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
              <div className="font-serif font-medium text-charcoal text-sm">
                {review.name}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;

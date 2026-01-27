import { motion } from "framer-motion";
import gallery1 from "@/assets/gallery-1.jpg";
import gallery2 from "@/assets/gallery-2.jpg";
import gallery3 from "@/assets/gallery-3.jpg";
import gallery4 from "@/assets/gallery-4.jpg";
import gallery5 from "@/assets/gallery-5.jpg";
import gallery6 from "@/assets/gallery-6.jpg";

const galleryItems = [
  { image: gallery1, title: "Ramo de Novia", category: "Bodas" },
  { image: gallery2, title: "Arreglo Funerario", category: "Condolencias" },
  { image: gallery3, title: "Bouquet Cumpleaños", category: "Celebraciones" },
  { image: gallery4, title: "Centro de Mesa", category: "Eventos" },
  { image: gallery5, title: "Rosas Rojas", category: "Romántico" },
  { image: gallery6, title: "Arreglo Primaveral", category: "Temporada" },
];

const GallerySection = () => {
  return (
    <section className="section-padding bg-background" id="galeria">
      <div className="container-narrow">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-primary font-medium text-sm uppercase tracking-wider">
            Nuestro Trabajo
          </span>
          <h2 className="heading-section text-charcoal mt-4 mb-6">
            Galería de creaciones
          </h2>
          <p className="text-body text-charcoal-light max-w-2xl mx-auto">
            Cada arreglo floral es una obra de arte única, diseñada con pasión y
            cuidado artesanal.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {galleryItems.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative overflow-hidden rounded-2xl aspect-[3/4] cursor-pointer"
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <span className="text-petal-light text-sm font-medium">
                  {item.category}
                </span>
                <h4 className="text-primary-foreground font-serif text-xl">
                  {item.title}
                </h4>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GallerySection;

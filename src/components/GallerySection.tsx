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
    <section className="py-10 md:py-14 bg-background" id="galeria">
      <div className="container-narrow px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <span className="text-primary font-medium text-sm uppercase tracking-wider">
            Nuestro Trabajo
          </span>
          <h2 className="text-2xl md:text-3xl font-serif font-medium text-charcoal mt-3">
            Galería de creaciones
          </h2>
        </motion.div>

        <div className="grid grid-cols-3 md:grid-cols-6 gap-2 md:gap-3">
          {galleryItems.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="group relative overflow-hidden rounded-xl aspect-square cursor-pointer"
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

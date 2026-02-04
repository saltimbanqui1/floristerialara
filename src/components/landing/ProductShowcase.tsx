import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

// Product images
import presenciaImg from "@/assets/products/presencia.jpg";
import cedroImg from "@/assets/products/cedro.jpg";
import olivoImg from "@/assets/products/olivo.jpg";
import amorImg from "@/assets/products/amor.jpg";
import suaveImg from "@/assets/products/suave.jpg";
import ebanoImg from "@/assets/products/ebano.jpg";
import piceaImg from "@/assets/products/picea.jpg";
import esplendorImg from "@/assets/products/esplendor.jpg";

const productImages: Record<string, string> = {
  presencia: presenciaImg,
  cedro: cedroImg,
  olivo: olivoImg,
  amor: amorImg,
  suave: suaveImg,
  ebano: ebanoImg,
  picea: piceaImg,
  esplendor: esplendorImg,
};

interface Product {
  id: string;
  name: string;
  price: number;
  original_price?: number;
  description: string;
  size: string;
  image_url?: string;
}

interface ProductShowcaseProps {
  onSelectProduct: (product: { id: string; name: string; price: number; description: string }) => void;
}

const ProductShowcase = ({ onSelectProduct }: ProductShowcaseProps) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .order("name");

        if (error) throw error;
        setProducts(data || []);
      } catch (error) {
        // Fallback to static data
        setProducts([
          { id: "presencia", name: "Presencia", price: 48.00, description: "Arreglo floral elegante con rosas y eucalipto", size: "Arreglo floral" },
          { id: "cedro", name: "Cédro", price: 68.00, description: "Caja de plantas naturales decorativas", size: "Caja de plantas" },
          { id: "olivo", name: "Olivo", price: 41.00, description: "Composición natural con hojas de olivo", size: "Composición natural" },
          { id: "amor", name: "Amor", price: 45.00, description: "Ramo romántico con rosas rojas y blancas", size: "Ramo romántico" },
          { id: "suave", name: "Suave", price: 90.00, description: "Arreglo premium con flores selectas", size: "Arreglo premium" },
          { id: "ebano", name: "Ébano", price: 48.00, description: "Composición elegante en tonos oscuros", size: "Composición elegante" },
          { id: "picea", name: "Picea", price: 33.15, original_price: 39.00, description: "Arreglo especial con descuento", size: "Arreglo especial" },
          { id: "esplendor", name: "Esplendor", price: 115.00, description: "Arreglo de lujo para ocasiones especiales", size: "Arreglo de lujo" },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleBuyClick = (product: Product) => {
    onSelectProduct({
      id: product.id,
      name: product.name,
      price: product.price,
      description: product.description || product.size,
    });
    
    // Smooth scroll to checkout
    setTimeout(() => {
      const checkoutSection = document.getElementById("checkout");
      if (checkoutSection) {
        checkoutSection.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 100);
  };

  return (
    <section id="productos" className="section-padding bg-muted/30">
      <div className="container-narrow px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h2 className="text-2xl md:text-3xl font-serif font-medium text-foreground mb-2">
            Nuestros Productos
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-sm">
            Selecciona el arreglo que más te guste
          </p>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-square bg-muted rounded-lg mb-2" />
                <div className="h-4 bg-muted rounded w-3/4 mb-1" />
                <div className="h-4 bg-muted rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <Card className="card-organic hover:shadow-medium transition-all duration-300 group overflow-hidden">
                  <div className="aspect-square bg-muted relative overflow-hidden">
                    <img 
                      src={productImages[product.id] || product.image_url || "/placeholder.svg"} 
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {product.original_price && (
                      <div className="absolute top-2 right-2 bg-secondary text-secondary-foreground text-xs font-medium px-2 py-1 rounded">
                        Oferta
                      </div>
                    )}
                  </div>
                  <CardContent className="p-3">
                    <h3 className="font-serif font-medium text-foreground text-sm mb-1">
                      {product.name}
                    </h3>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-primary font-semibold text-sm">
                        {Number(product.price).toFixed(2)} €
                      </span>
                      {product.original_price && (
                        <span className="text-muted-foreground line-through text-xs">
                          {Number(product.original_price).toFixed(2)} €
                        </span>
                      )}
                    </div>
                    <Button
                      onClick={() => handleBuyClick(product)}
                      className="w-full text-sm py-2 gap-2 bg-foreground hover:bg-foreground/90 text-background font-semibold shadow-md transition-all duration-300"
                      size="sm"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      Lo quiero comprar
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductShowcase;

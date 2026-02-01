import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingBag, ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import LegalConfirmModal from "@/components/legal/LegalConfirmModal";

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
  external_buy_url?: string;
}

const ProductsSection = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showLegalModal, setShowLegalModal] = useState(false);

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
        console.error("Error fetching products:", error);
        // Fallback to static data if database is not available
        setProducts([
          { id: "presencia", name: "Presencia", price: 48.00, description: "Arreglo floral elegante", size: "Arreglo floral - 48,00 €", external_buy_url: "https://www.floristerialaraonline.com/p11677603-presencia.html" },
          { id: "cedro", name: "Cédro", price: 68.00, description: "Caja de plantas naturales", size: "Caja de plantas naturales - 68,00 €", external_buy_url: "https://www.floristerialaraonline.com/p11316788-pl-6-caja-madera-plantas.html" },
          { id: "olivo", name: "Olivo", price: 41.00, description: "Composición natural", size: "Composición natural - 41,00 €", external_buy_url: "https://www.floristerialaraonline.com/p11314438-pl-6-suave.html" },
          { id: "amor", name: "Amor", price: 45.00, description: "Ramo romántico", size: "Ramo romántico - 45,00 €", external_buy_url: "https://www.floristerialaraonline.com/p11189691-amor-en-rojo-y-blaco.html" },
          { id: "suave", name: "Suave", price: 90.00, description: "Arreglo premium", size: "Arreglo premium - 90,00 €", external_buy_url: "https://www.floristerialaraonline.com/p10956756-san-valentin.html" },
          { id: "ebano", name: "Ébano", price: 48.00, description: "Composición elegante", size: "Composición elegante - 48,00 €", external_buy_url: "https://www.floristerialaraonline.com/p10558856-combo.html" },
          { id: "picea", name: "Picea", price: 33.15, original_price: 39.00, description: "Arreglo especial", size: "Arreglo especial - 33,15 €", external_buy_url: "https://www.floristerialaraonline.com/p10553216-picea.html" },
          { id: "esplendor", name: "Esplendor", price: 115.00, description: "Arreglo de lujo", size: "Arreglo de lujo - 115,00 €", external_buy_url: "https://www.floristerialaraonline.com/p9795836-esplendor-para-mama.html" },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleBuyClick = (product: Product) => {
    setSelectedProduct(product);
    setShowLegalModal(true);
  };

  return (
    <>
      <section id="productos" className="section-padding bg-cream">
        <div className="container-narrow px-4 md:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8"
          >
            <h2 className="text-2xl md:text-3xl font-serif font-medium text-charcoal mb-2">
              Nuestros Productos
            </h2>
            <p className="text-charcoal-light max-w-xl mx-auto text-sm">
              Selecciona el arreglo que más te guste y realiza tu pedido
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
                        src={productImages[product.id] || product.image_url} 
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {product.original_price && (
                        <div className="absolute top-2 right-2 bg-petal text-charcoal text-xs font-medium px-2 py-1 rounded">
                          Oferta
                        </div>
                      )}
                    </div>
                    <CardContent className="p-3">
                      <h3 className="font-serif font-medium text-charcoal text-sm mb-1">
                        {product.name}
                      </h3>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-primary font-semibold text-sm">
                          {Number(product.price).toFixed(2)} €
                        </span>
                        {product.original_price && (
                          <span className="text-charcoal-light line-through text-xs">
                            {Number(product.original_price).toFixed(2)} €
                          </span>
                        )}
                      </div>
                      <Button
                        onClick={() => handleBuyClick(product)}
                        className="w-full text-sm py-2 gap-2 bg-[#D4AF37] hover:bg-[#C4A030] text-white font-semibold shadow-md transition-all duration-300"
                        size="sm"
                      >
                        <ShoppingBag className="w-4 h-4" />
                        Comprar
                        <ExternalLink className="w-3 h-3" />
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-center mt-8"
          >
            <p className="text-sm text-charcoal-light flex items-center justify-center gap-2">
              <ExternalLink className="w-4 h-4" />
              Las compras se finalizan en nuestra tienda online segura
            </p>
          </motion.div>
        </div>
      </section>

      {selectedProduct && (
        <LegalConfirmModal
          open={showLegalModal}
          onOpenChange={setShowLegalModal}
          productName={selectedProduct.name}
          externalUrl={selectedProduct.external_buy_url || "https://www.floristerialaraonline.com"}
        />
      )}
    </>
  );
};

export default ProductsSection;
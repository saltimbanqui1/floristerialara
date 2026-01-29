import { motion } from "framer-motion";
import { Phone, MapPin, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import heroImage from "@/assets/hero-flowers.jpg";
import { useState } from "react";

const HeroSection = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const whatsappMessage = encodeURIComponent(
      `¡Hola! Soy ${formData.name}. ${formData.message}. Mi teléfono es ${formData.phone}`
    );
    window.open(`https://wa.me/34922251318?text=${whatsappMessage}`, "_blank");
  };

  return (
    <section className="relative min-h-[85vh] flex items-center overflow-hidden">
      {/* Hero Image Background */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Arreglo floral elegante de Floristería Lara"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/40" />
      </div>

      <div className="container-narrow w-full py-12 md:py-16 px-4 md:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-5"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-background/80 backdrop-blur-sm border border-border">
              <MapPin className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-charcoal">
                La Laguna, Tenerife
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-medium tracking-tight text-charcoal text-balance">
              Flores que expresan lo que las palabras no pueden
            </h1>

            <p className="text-base text-charcoal-light max-w-lg">
              Desde 1985, creando arreglos florales artesanales en el corazón de
              San Cristóbal de La Laguna.
            </p>

            <div className="flex flex-wrap gap-5 pt-2">
              <a
                href="tel:922251318"
                className="inline-flex items-center gap-2 text-primary font-medium hover:underline"
              >
                <Phone className="w-5 h-5" />
                922 25 13 18
              </a>
              <div className="flex items-center gap-2 text-charcoal-light">
                <Clock className="w-5 h-5" />
                <span className="text-sm">L-V: 9:00 - 20:00</span>
              </div>
            </div>
          </motion.div>

          {/* Right Content - Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >

            {/* Contact Form Card */}
            <div className="card-organic p-6 border border-border bg-background/95 backdrop-blur-sm">
              <h3 className="text-xl font-serif font-medium text-charcoal mb-1">
                Solicita tu presupuesto
              </h3>
              <p className="text-charcoal-light text-sm mb-6">
                Te respondemos en menos de 2 horas
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  placeholder="Tu nombre"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="bg-cream border-border focus:ring-primary"
                  required
                />
                <Input
                  placeholder="Tu teléfono"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="bg-cream border-border focus:ring-primary"
                  required
                />
                <Textarea
                  placeholder="¿Qué necesitas? (Ej: ramo para cumpleaños, decoración boda...)"
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  className="bg-cream border-border focus:ring-primary resize-none"
                  rows={3}
                  required
                />
                <Button
                  type="submit"
                  className="w-full btn-botanical text-lg py-6"
                >
                  Enviar por WhatsApp
                </Button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

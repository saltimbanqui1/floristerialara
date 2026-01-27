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
    <section className="relative min-h-screen flex items-center overflow-hidden bg-background">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary rounded-full blur-3xl" />
      </div>

      <div className="container-narrow w-full section-padding relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cream-dark">
              <MapPin className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-charcoal">
                La Laguna, Tenerife
              </span>
            </div>

            <h1 className="heading-display text-charcoal text-balance">
              Flores que expresan lo que las palabras no pueden
            </h1>

            <p className="text-body text-charcoal-light max-w-lg">
              Desde 1985, creando arreglos florales artesanales en el corazón de
              San Cristóbal de La Laguna. Tradición, elegancia y cercanía en
              cada ramo.
            </p>

            <div className="flex flex-wrap gap-6 pt-4">
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

          {/* Right Content - Form & Image */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            {/* Hero Image */}
            <div className="absolute -top-8 -right-8 w-full h-full">
              <img
                src={heroImage}
                alt="Arreglo floral elegante de Floristería Lara"
                className="w-full h-full object-cover rounded-3xl opacity-30 lg:opacity-50"
              />
            </div>

            {/* Contact Form Card */}
            <div className="relative card-organic p-8 border border-border">
              <h3 className="text-2xl font-serif font-medium text-charcoal mb-2">
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

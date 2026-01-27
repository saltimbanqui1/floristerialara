import { Heart } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-charcoal py-8">
      <div className="container-narrow px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-serif text-xl text-primary-foreground">
              Floristería Lara
            </span>
          </div>

          <p className="text-charcoal-light text-sm text-center">
            © {currentYear} Floristería Lara. Todos los derechos reservados.
          </p>

          <p className="text-charcoal-light text-sm flex items-center gap-1">
            Hecho con <Heart className="w-4 h-4 text-petal fill-petal" /> en La
            Laguna
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

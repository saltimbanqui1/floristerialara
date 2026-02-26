import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import LandingHeader from "@/components/landing/LandingHeader";
import LandingFooter from "@/components/landing/LandingFooter";

const TermsAndConditions = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <LandingHeader />
      <main className="pt-24 md:pt-28 pb-16">
        <div className="max-w-3xl mx-auto px-4">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="mb-6 text-muted-foreground hover:text-foreground gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al inicio
          </Button>

          <h1 className="text-3xl md:text-4xl font-serif font-semibold text-foreground mb-2">
            Términos y Condiciones
          </h1>
          <p className="text-muted-foreground mb-10">
            Última actualización: febrero 2026
          </p>

          <div className="space-y-10 text-foreground/90 leading-relaxed">
            {/* Section 1 */}
            <section>
              <h2 className="text-xl font-serif font-semibold text-foreground mb-3">
                1. Identificación y Actividad
              </h2>
              <p>
                La web floristerialara.lovable.app es propiedad de <strong>Flores Lara</strong>, con domicilio profesional en C/ San Antonio, 30 — 38202 La Laguna, Tenerife, y contacto en el <a href="tel:+34629455043" className="text-primary hover:underline">629 45 50 43</a>. Nos dedicamos a la venta y envío de arreglos florales y plantas naturales.
              </p>
            </section>

            {/* Section 2 */}
            <section>
              <h2 className="text-xl font-serif font-semibold text-foreground mb-3">
                2. Envíos y Entregas
              </h2>
              <ul className="space-y-4 list-none pl-0">
                <li>
                  <strong className="text-foreground">Zonas de reparto:</strong> Realizamos entregas exclusivamente en los códigos postales especificados para Santa Cruz de Tenerife y San Cristóbal de La Laguna.
                </li>
                <li>
                  <strong className="text-foreground">Coste:</strong> El coste mínimo de envío es de 7&nbsp;€. Este importe se sumará al precio del producto en el momento del pago.
                </li>
                <li>
                  <strong className="text-foreground">Horarios:</strong> Los pedidos se entregarán en la fecha seleccionada por el cliente. No podemos garantizar una hora exacta de entrega, aunque haremos lo posible por cumplir con las preferencias indicadas.
                </li>
                <li>
                  <strong className="text-foreground">Ausencia del destinatario:</strong> Si el destinatario no se encuentra en el domicilio, intentaremos contactar por teléfono (WhatsApp Business <a href="https://wa.me/34629455043" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">629 45 50 43</a>). En caso de no poder entregar el pedido, este volverá a la tienda y el cliente deberá pasar a recogerlo o pagar un nuevo envío.
                </li>
              </ul>
            </section>

            {/* Section 3 */}
            <section>
              <h2 className="text-xl font-serif font-semibold text-foreground mb-3">
                3. Métodos de Pago
              </h2>
              <p className="mb-2">Aceptamos pagos seguros a través de Stripe mediante:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Tarjeta de crédito/débito.</li>
                <li>Apple Pay.</li>
                <li>Google Pay.</li>
              </ul>
            </section>

            {/* Section 4 */}
            <section>
              <h2 className="text-xl font-serif font-semibold text-foreground mb-3">
                4. Política de Devoluciones y Cancelaciones
              </h2>
              <p className="mb-3">
                Dada la naturaleza perecedera de nuestros productos (flores y plantas), y de acuerdo con el Art.&nbsp;103 de la Ley General para la Defensa de los Consumidores y Usuarios, <strong>no se admite el derecho de desistimiento</strong> ni la devolución del producto una vez el pedido haya sido confeccionado o entregado.
              </p>
              <p>
                Si deseas cancelar un pedido, deberás hacerlo con al menos <strong>24 horas de antelación</strong> a la fecha de entrega.
              </p>
            </section>

            {/* Section 5 */}
            <section>
              <h2 className="text-xl font-serif font-semibold text-foreground mb-3">
                5. Garantía de Calidad
              </h2>
              <p>
                Trabajamos con flores frescas. La imagen de la web es una referencia; debido a la estacionalidad, algunos tipos de flores o colores pueden variar ligeramente, pero siempre garantizamos un valor y estética igual o superior al contratado.
              </p>
            </section>

            {/* Section 6 */}
            <section>
              <h2 className="text-xl font-serif font-semibold text-foreground mb-3">
                6. Protección de Datos
              </h2>
              <p>
                Tus datos serán utilizados exclusivamente para procesar el pedido y asegurar la entrega, cumpliendo con la normativa vigente de protección de datos.
              </p>
            </section>
          </div>
        </div>
      </main>
      <LandingFooter />
    </div>
  );
};

export default TermsAndConditions;

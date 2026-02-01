import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

interface LegalModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const PrivacyPolicyModal = ({ open, onOpenChange }: LegalModalProps) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="max-w-3xl max-h-[80vh]">
      <DialogHeader>
        <DialogTitle className="font-serif text-xl text-charcoal">
          Política de Privacidad
        </DialogTitle>
      </DialogHeader>
      <ScrollArea className="h-[60vh] pr-4">
        <div className="space-y-4 text-sm text-charcoal-light">
          <p className="font-medium text-charcoal">
            FLORISTERÍA LARA, S.L. - CIF: B-38081113
          </p>
          
          <h3 className="font-semibold text-charcoal mt-6">1. Responsable del tratamiento</h3>
          <p>
            Floristería Lara, S.L. (en adelante, "Floristería Lara") con CIF B-38081113, 
            domicilio en C/ San Antonio 30, 38201 La Laguna, Santa Cruz de Tenerife, 
            es el responsable del tratamiento de los datos personales que nos facilite.
          </p>

          <h3 className="font-semibold text-charcoal mt-6">2. Datos que recopilamos</h3>
          <p>
            Recopilamos los datos personales que nos proporciona voluntariamente al:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Realizar un pedido (nombre, dirección, teléfono, email)</li>
            <li>Registrarse como cliente</li>
            <li>Contactar con nosotros</li>
            <li>Suscribirse a nuestro boletín</li>
          </ul>

          <h3 className="font-semibold text-charcoal mt-6">3. Finalidad del tratamiento</h3>
          <p>Sus datos personales serán tratados para:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Gestionar y procesar sus pedidos</li>
            <li>Enviar comunicaciones relacionadas con su compra</li>
            <li>Atender sus consultas y solicitudes</li>
            <li>Enviar información comercial (si ha dado su consentimiento)</li>
            <li>Cumplir con obligaciones legales</li>
          </ul>

          <h3 className="font-semibold text-charcoal mt-6">4. Legitimación</h3>
          <p>
            La base legal para el tratamiento de sus datos es la ejecución del contrato 
            de compraventa, el consentimiento prestado y el cumplimiento de obligaciones legales.
          </p>

          <h3 className="font-semibold text-charcoal mt-6">5. Destinatarios</h3>
          <p>
            Sus datos podrán ser comunicados a:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Empresas de transporte para la entrega de pedidos</li>
            <li>Entidades bancarias para procesar pagos</li>
            <li>Administraciones públicas cuando sea legalmente requerido</li>
          </ul>

          <h3 className="font-semibold text-charcoal mt-6">6. Derechos del usuario</h3>
          <p>
            Puede ejercer sus derechos de acceso, rectificación, supresión, oposición, 
            portabilidad y limitación del tratamiento enviando un email a: 
            info@floristerialaraonline.com
          </p>

          <h3 className="font-semibold text-charcoal mt-6">7. Conservación de datos</h3>
          <p>
            Conservaremos sus datos mientras dure la relación comercial y durante los 
            plazos legalmente establecidos para atender posibles responsabilidades.
          </p>

          <h3 className="font-semibold text-charcoal mt-6">8. Seguridad</h3>
          <p>
            Aplicamos medidas técnicas y organizativas para proteger sus datos personales 
            contra acceso no autorizado, pérdida o destrucción.
          </p>

          <p className="mt-6 text-xs">
            Última actualización: Febrero 2026
          </p>
        </div>
      </ScrollArea>
    </DialogContent>
  </Dialog>
);

export const TermsModal = ({ open, onOpenChange }: LegalModalProps) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="max-w-3xl max-h-[80vh]">
      <DialogHeader>
        <DialogTitle className="font-serif text-xl text-charcoal">
          Condiciones de Compra
        </DialogTitle>
      </DialogHeader>
      <ScrollArea className="h-[60vh] pr-4">
        <div className="space-y-4 text-sm text-charcoal-light">
          <p className="font-medium text-charcoal">
            FLORISTERÍA LARA, S.L. - CIF: B-38081113
          </p>

          <h3 className="font-semibold text-charcoal mt-6">1. Identificación del vendedor</h3>
          <p>
            Floristería Lara, S.L., con CIF B-38081113, domiciliada en C/ San Antonio 30, 
            38201 La Laguna, Santa Cruz de Tenerife. Teléfono: 922 251 318. 
            Email: info@floristerialaraonline.com
          </p>

          <h3 className="font-semibold text-charcoal mt-6">2. Productos</h3>
          <p>
            Los productos ofertados son arreglos florales, plantas y complementos. 
            Las imágenes son orientativas. Debido a la naturaleza de los productos 
            (flores naturales), pueden existir variaciones en color, tamaño o composición 
            manteniendo siempre la esencia y valor del producto.
          </p>

          <h3 className="font-semibold text-charcoal mt-6">3. Precios</h3>
          <p>
            Los precios indicados incluyen IVA. Los gastos de envío se mostrarán 
            antes de confirmar el pedido y dependerán de la zona de entrega.
          </p>

          <h3 className="font-semibold text-charcoal mt-6">4. Proceso de compra</h3>
          <p>
            Para realizar un pedido deberá seguir los pasos indicados en la web. 
            El contrato se perfecciona cuando reciba la confirmación del pedido por email.
          </p>

          <h3 className="font-semibold text-charcoal mt-6">5. Formas de pago</h3>
          <p>
            Aceptamos pago con tarjeta de crédito/débito, transferencia bancaria y 
            pago en tienda. Todos los pagos se realizan de forma segura.
          </p>

          <h3 className="font-semibold text-charcoal mt-6">6. Entrega</h3>
          <p>
            Realizamos entregas en la zona metropolitana de Tenerife. El plazo de 
            entrega habitual es de 24-48 horas. Para fechas señaladas, recomendamos 
            realizar el pedido con antelación.
          </p>

          <h3 className="font-semibold text-charcoal mt-6">7. Derecho de desistimiento</h3>
          <p>
            Debido a la naturaleza perecedera de los productos florales, el derecho 
            de desistimiento queda excluido conforme al artículo 103.d) del Real Decreto 
            Legislativo 1/2007.
          </p>

          <h3 className="font-semibold text-charcoal mt-6">8. Garantía y reclamaciones</h3>
          <p>
            Si el producto presenta algún defecto o no corresponde con lo solicitado, 
            contacte con nosotros en las primeras 24 horas tras la recepción aportando 
            fotografías del producto.
          </p>

          <h3 className="font-semibold text-charcoal mt-6">9. Jurisdicción</h3>
          <p>
            Para cualquier controversia, las partes se someten a los Juzgados y 
            Tribunales de Santa Cruz de Tenerife.
          </p>

          <p className="mt-6 text-xs">
            Última actualización: Febrero 2026
          </p>
        </div>
      </ScrollArea>
    </DialogContent>
  </Dialog>
);

export const DataTreatmentModal = ({ open, onOpenChange }: LegalModalProps) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="max-w-3xl max-h-[80vh]">
      <DialogHeader>
        <DialogTitle className="font-serif text-xl text-charcoal">
          Tratamiento de Datos
        </DialogTitle>
      </DialogHeader>
      <ScrollArea className="h-[60vh] pr-4">
        <div className="space-y-4 text-sm text-charcoal-light">
          <p className="font-medium text-charcoal">
            FLORISTERÍA LARA, S.L. - CIF: B-38081113
          </p>

          <h3 className="font-semibold text-charcoal mt-6">Información sobre el tratamiento de datos personales</h3>
          
          <p>
            En cumplimiento del Reglamento (UE) 2016/679 del Parlamento Europeo y del Consejo, 
            de 27 de abril de 2016 (RGPD) y la Ley Orgánica 3/2018, de 5 de diciembre, de 
            Protección de Datos Personales y garantía de los derechos digitales (LOPDGDD), 
            le informamos:
          </p>

          <h3 className="font-semibold text-charcoal mt-6">Responsable</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Identidad:</strong> Floristería Lara, S.L.</li>
            <li><strong>CIF:</strong> B-38081113</li>
            <li><strong>Dirección:</strong> C/ San Antonio 30, 38201 La Laguna, Tenerife</li>
            <li><strong>Teléfono:</strong> 922 251 318</li>
            <li><strong>Email:</strong> info@floristerialaraonline.com</li>
          </ul>

          <h3 className="font-semibold text-charcoal mt-6">Finalidades del tratamiento</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>Gestión de la relación comercial y ejecución del contrato de compraventa</li>
            <li>Gestión de envíos y entregas</li>
            <li>Facturación y gestión contable</li>
            <li>Atención de consultas y reclamaciones</li>
            <li>Envío de comunicaciones comerciales (previo consentimiento)</li>
          </ul>

          <h3 className="font-semibold text-charcoal mt-6">Base jurídica</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>Ejecución de un contrato (Art. 6.1.b RGPD)</li>
            <li>Cumplimiento de obligaciones legales (Art. 6.1.c RGPD)</li>
            <li>Consentimiento del interesado (Art. 6.1.a RGPD)</li>
          </ul>

          <h3 className="font-semibold text-charcoal mt-6">Categorías de datos</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>Datos identificativos: nombre, apellidos, DNI/NIF</li>
            <li>Datos de contacto: dirección, teléfono, email</li>
            <li>Datos de facturación</li>
            <li>Datos de transacciones comerciales</li>
          </ul>

          <h3 className="font-semibold text-charcoal mt-6">Plazo de conservación</h3>
          <p>
            Los datos se conservarán mientras dure la relación comercial y, posteriormente, 
            durante los plazos de prescripción legal (normalmente 5 años para obligaciones 
            fiscales y 15 años para responsabilidad contractual).
          </p>

          <h3 className="font-semibold text-charcoal mt-6">Derechos</h3>
          <p>Puede ejercer los siguientes derechos:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Acceso:</strong> conocer qué datos tratamos</li>
            <li><strong>Rectificación:</strong> corregir datos inexactos</li>
            <li><strong>Supresión:</strong> solicitar la eliminación de datos</li>
            <li><strong>Oposición:</strong> oponerse a determinados tratamientos</li>
            <li><strong>Portabilidad:</strong> recibir sus datos en formato electrónico</li>
            <li><strong>Limitación:</strong> solicitar la suspensión del tratamiento</li>
          </ul>

          <p className="mt-4">
            Para ejercer estos derechos, envíe un email a info@floristerialaraonline.com 
            o una carta a nuestra dirección postal, adjuntando copia del DNI.
          </p>

          <p className="mt-4">
            También tiene derecho a presentar una reclamación ante la Agencia Española 
            de Protección de Datos (www.aepd.es).
          </p>

          <p className="mt-6 text-xs">
            Última actualización: Febrero 2026
          </p>
        </div>
      </ScrollArea>
    </DialogContent>
  </Dialog>
);

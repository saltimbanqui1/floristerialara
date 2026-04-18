import * as React from 'npm:react@18.3.1'
import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Row,
  Column,
  Section,
  Text,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const SITE_NAME = 'Floristería Lara'

interface OrderItem {
  name: string
  quantity: number
  unitPrice: number
  totalPrice: number
}

interface OrderConfirmationProps {
  customerName?: string
  orderId?: string
  items?: OrderItem[]
  subtotal?: number
  shippingCost?: number
  total?: number
  deliveryType?: 'delivery' | 'pickup' | string
  deliveryDate?: string
  deliveryTimeSlot?: string
  shippingName?: string
  shippingAddress?: string
  shippingCity?: string
  shippingPostalCode?: string
  cardMessage?: string
}

const formatPrice = (n?: number) =>
  typeof n === 'number' ? `${n.toFixed(2)} €` : '—'

const OrderConfirmationEmail = ({
  customerName,
  orderId,
  items = [],
  subtotal,
  shippingCost,
  total,
  deliveryType,
  deliveryDate,
  deliveryTimeSlot,
  shippingName,
  shippingAddress,
  shippingCity,
  shippingPostalCode,
  cardMessage,
}: OrderConfirmationProps) => {
  const isDelivery = deliveryType === 'delivery'
  const greetingName = customerName || 'cliente'
  const shortOrderId = orderId ? orderId.slice(0, 8).toUpperCase() : ''

  return (
    <Html lang="es" dir="ltr">
      <Head />
      <Preview>
        Hemos recibido tu pedido en {SITE_NAME}. ¡Gracias por confiar en nosotros!
      </Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Heading style={brandName}>{SITE_NAME}</Heading>
            <Text style={brandTagline}>Floristería en La Laguna · Más de 50 años creando ramos</Text>
          </Section>

          <Hr style={hr} />

          {/* Greeting */}
          <Section>
            <Heading as="h2" style={h2}>
              ¡Gracias por tu pedido, {greetingName}!
            </Heading>
            <Text style={text}>
              Hemos recibido tu pedido correctamente y ya estamos preparando tus flores con todo el cariño.
              {shortOrderId && (
                <>
                  {' '}Tu número de referencia es <strong>#{shortOrderId}</strong>.
                </>
              )}
            </Text>
          </Section>

          {/* Order items */}
          {items.length > 0 && (
            <Section style={card}>
              <Heading as="h3" style={h3}>Resumen de tu pedido</Heading>
              {items.map((item, idx) => (
                <Row key={idx} style={itemRow}>
                  <Column style={itemNameCol}>
                    <Text style={itemName}>{item.name}</Text>
                    <Text style={itemQty}>Cantidad: {item.quantity}</Text>
                  </Column>
                  <Column style={itemPriceCol}>
                    <Text style={itemPrice}>{formatPrice(item.totalPrice)}</Text>
                  </Column>
                </Row>
              ))}

              <Hr style={hrLight} />

              <Row>
                <Column><Text style={totalsLabel}>Subtotal</Text></Column>
                <Column style={alignRight}><Text style={totalsValue}>{formatPrice(subtotal)}</Text></Column>
              </Row>
              <Row>
                <Column><Text style={totalsLabel}>Envío</Text></Column>
                <Column style={alignRight}>
                  <Text style={totalsValue}>
                    {shippingCost && shippingCost > 0 ? formatPrice(shippingCost) : 'Recogida en tienda'}
                  </Text>
                </Column>
              </Row>
              <Row>
                <Column><Text style={totalLabel}>Total</Text></Column>
                <Column style={alignRight}><Text style={totalValue}>{formatPrice(total)}</Text></Column>
              </Row>
            </Section>
          )}

          {/* Delivery details */}
          <Section style={card}>
            <Heading as="h3" style={h3}>
              {isDelivery ? 'Detalles de la entrega' : 'Recogida en tienda'}
            </Heading>

            {deliveryDate && (
              <Text style={detailLine}>
                <strong>Fecha:</strong> {deliveryDate}
                {deliveryTimeSlot ? ` · ${deliveryTimeSlot}` : ''}
              </Text>
            )}

            {isDelivery && (shippingName || shippingAddress) && (
              <>
                <Text style={detailLine}><strong>Destinatario:</strong> {shippingName || '—'}</Text>
                <Text style={detailLine}>
                  <strong>Dirección:</strong> {shippingAddress || '—'}
                  {shippingCity ? `, ${shippingCity}` : ''}
                  {shippingPostalCode ? ` (${shippingPostalCode})` : ''}
                </Text>
              </>
            )}

            {!isDelivery && (
              <Text style={detailLine}>
                Puedes recoger tu pedido en <strong>Calle San Antonio 30, La Laguna</strong>.
              </Text>
            )}
          </Section>

          {/* Card message */}
          {cardMessage && (
            <Section style={messageCard}>
              <Heading as="h3" style={h3}>Mensaje de tu tarjeta</Heading>
              <Text style={messageText}>"{cardMessage}"</Text>
            </Section>
          )}

          {/* Footer */}
          <Hr style={hr} />
          <Section>
            <Text style={footer}>
              Si tienes cualquier consulta sobre tu pedido, escríbenos por WhatsApp al{' '}
              <strong>629 455 043</strong> o respóndenos a este correo.
            </Text>
            <Text style={footerSmall}>
              {SITE_NAME} · Calle San Antonio 30, 38202 La Laguna, Tenerife
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

export const template = {
  component: OrderConfirmationEmail,
  subject: (data: Record<string, any>) => {
    const id = data?.orderId ? String(data.orderId).slice(0, 8).toUpperCase() : ''
    return id ? `Pedido confirmado #${id} · Floristería Lara` : 'Pedido confirmado · Floristería Lara'
  },
  displayName: 'Confirmación de pedido',
  previewData: {
    customerName: 'María',
    orderId: 'a1b2c3d4-1234-5678-90ab-cdef12345678',
    items: [
      { name: 'Ramo Cédro', quantity: 1, unitPrice: 68, totalPrice: 68 },
      { name: 'Ramo Presencia', quantity: 2, unitPrice: 48, totalPrice: 96 },
    ],
    subtotal: 164,
    shippingCost: 7,
    total: 171,
    deliveryType: 'delivery',
    deliveryDate: '2026-04-22',
    deliveryTimeSlot: '10:00 - 13:00',
    shippingName: 'Ana Pérez',
    shippingAddress: 'Calle Las Flores 12',
    shippingCity: 'La Laguna',
    shippingPostalCode: '38202',
    cardMessage: '¡Felicidades en tu día especial!',
  },
} satisfies TemplateEntry

// ============= Styles =============
const main = {
  backgroundColor: '#ffffff',
  fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  margin: 0,
  padding: 0,
}

const container = {
  maxWidth: '600px',
  margin: '0 auto',
  padding: '32px 24px',
}

const header = {
  textAlign: 'center' as const,
  paddingBottom: '8px',
}

const brandName = {
  fontFamily: '"Cormorant Garamond", Georgia, serif',
  fontSize: '32px',
  fontWeight: 600,
  color: '#2D5A27',
  margin: '0 0 4px',
  letterSpacing: '0.5px',
}

const brandTagline = {
  fontSize: '13px',
  color: '#6b6b6b',
  margin: 0,
  fontStyle: 'italic',
}

const hr = {
  borderColor: '#e8e4dc',
  borderWidth: '1px 0 0 0',
  margin: '24px 0',
}

const hrLight = {
  borderColor: '#f0ece4',
  borderWidth: '1px 0 0 0',
  margin: '16px 0',
}

const h2 = {
  fontFamily: '"Cormorant Garamond", Georgia, serif',
  fontSize: '24px',
  fontWeight: 600,
  color: '#2F2F2F',
  margin: '0 0 12px',
}

const h3 = {
  fontFamily: '"Cormorant Garamond", Georgia, serif',
  fontSize: '18px',
  fontWeight: 600,
  color: '#2D5A27',
  margin: '0 0 16px',
}

const text = {
  fontSize: '15px',
  color: '#2F2F2F',
  lineHeight: '1.6',
  margin: '0 0 16px',
}

const card = {
  backgroundColor: '#FDFBF7',
  border: '1px solid #e8e4dc',
  borderRadius: '8px',
  padding: '20px 24px',
  margin: '20px 0',
}

const messageCard = {
  backgroundColor: '#fbf3f3',
  border: '1px solid #E8A2A5',
  borderRadius: '8px',
  padding: '20px 24px',
  margin: '20px 0',
}

const messageText = {
  fontFamily: '"Cormorant Garamond", Georgia, serif',
  fontSize: '17px',
  fontStyle: 'italic',
  color: '#2F2F2F',
  margin: 0,
  lineHeight: '1.5',
}

const itemRow = {
  marginBottom: '12px',
}

const itemNameCol = {
  width: '70%',
  verticalAlign: 'top' as const,
}

const itemPriceCol = {
  width: '30%',
  verticalAlign: 'top' as const,
  textAlign: 'right' as const,
}

const itemName = {
  fontSize: '14px',
  fontWeight: 500,
  color: '#2F2F2F',
  margin: '0 0 2px',
}

const itemQty = {
  fontSize: '13px',
  color: '#6b6b6b',
  margin: 0,
}

const itemPrice = {
  fontSize: '14px',
  fontWeight: 500,
  color: '#2F2F2F',
  margin: 0,
}

const alignRight = {
  textAlign: 'right' as const,
}

const totalsLabel = {
  fontSize: '14px',
  color: '#6b6b6b',
  margin: '4px 0',
}

const totalsValue = {
  fontSize: '14px',
  color: '#2F2F2F',
  margin: '4px 0',
}

const totalLabel = {
  fontSize: '16px',
  fontWeight: 600,
  color: '#2D5A27',
  margin: '8px 0 0',
}

const totalValue = {
  fontSize: '16px',
  fontWeight: 600,
  color: '#2D5A27',
  margin: '8px 0 0',
}

const detailLine = {
  fontSize: '14px',
  color: '#2F2F2F',
  lineHeight: '1.6',
  margin: '0 0 8px',
}

const footer = {
  fontSize: '14px',
  color: '#2F2F2F',
  lineHeight: '1.6',
  textAlign: 'center' as const,
  margin: '0 0 12px',
}

const footerSmall = {
  fontSize: '12px',
  color: '#999999',
  textAlign: 'center' as const,
  margin: 0,
}

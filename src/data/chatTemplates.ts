export interface QuickActionTemplate {
  id: string;
  label: string;
  icon: string;
  tag: string;
  getFormattedMessage: (tiendaNombre: string, titular?: string) => string;
}

export const CHAT_QUICK_TEMPLATES: QuickActionTemplate[] = [
  {
    id: 'novedad',
    label: 'Gestionar novedad',
    icon: '⚠️',
    tag: 'Urgente',
    getFormattedMessage: (tiendaNombre: string) =>
      `Hola ${tiendaNombre}, tenemos guías con alerta de novedad sin solución activa. Requerimos tu intervención con el cliente final dentro de las próximas 24 horas para evitar la devolución a bodega y el sobrecosto de flete.`
  },
  {
    id: 'estancado',
    label: 'Pedido estancado',
    icon: '📦',
    tag: 'Logística',
    getFormattedMessage: (tiendaNombre: string) =>
      `Hola ${tiendaNombre}, detectamos pedidos en curso con más de 3 días sin avance en la transportadora. Estamos auditando el tracking directo para presionar la movilización antes del límite de cierre logístico.`
  },
  {
    id: 'acuerdo',
    label: 'Acuerdo comercial',
    icon: '🤝',
    tag: 'Escala',
    getFormattedMessage: (tiendaNombre: string) =>
      `Hola ${tiendaNombre}, revisando tu volumen y rotación en nuestro catálogo, queremos ofrecerte un acuerdo comercial directo: tarifa proveedor preferencial por escala, stock reservado y prioridad de despacho en bodega. ¿Podemos coordinar una llamada?`
  }
];
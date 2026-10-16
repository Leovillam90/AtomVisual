// src/formulas/calculoGuias.ts

export interface GuiaFilaCompleta {
  id: string;
  fechaCreacion: string;
  fechaCreacionRaw: string;
  diasGestion: number;
  ultimoMovimiento: number;
  tipoEstado: string;
  estado: string;
  pagadaDropi: string;
  fechaPago: string;
  devBodega: string;
  destinoCiudad: string;
  destinoDepartamento: string;
  transportadora: string;
  numeroGuia: string;
  pedidos: number;
  cantidadProductos: number;
  productoNombre: string;
  recaudoNegocio: number;
  recaudoProveedor: number;
  flete: number;
  gananciaNegocio: number;
}

// Limpiador numérico para moneda colombiana (ej: "54.580" -> 54580, "15357,5" -> 15357.5)
function parseNumeroSeguro(v: any): number {
  if (v === null || v === undefined || v === '' || v === '-') return 0;
  if (typeof v === 'number') return v;
  let s = String(v).trim().replace('$', '').replace(/\s/g, '');
  if (s.includes('.') && s.includes(',')) {
    s = s.replace(/\./g, '').replace(',', '.');
  } else if (s.includes(',')) {
    s = s.replace(',', '.');
  } else if (s.includes('.')) {
    const parts = s.split('.');
    if (parts.length === 2 && parts[1].length === 3) {
      s = parts[0] + parts[1]; // Miles colombianos
    }
  }
  const res = parseFloat(s);
  return isNaN(res) ? 0 : res;
}

// Normalizador a formato ISO (YYYY-MM-DD)
export function parseDateToISO(val: any): string {
  if (!val || val === 'NaN' || val === '-') return '- - -';
  const s = String(val).trim().split(' ')[0];
  if (s.includes('/')) {
    const p = s.split('/');
    if (p.length === 3) {
      const d = p[0].padStart(2, '0');
      const m = p[1].padStart(2, '0');
      const y = p[2];
      return `${y}-${m}-${d}`;
    }
  }
  if (s.includes('-') && s.length >= 10) return s.slice(0, 10);
  return s;
}

// Capitalizador elegante de textos (ej: "ENTREGADO" -> "Entregado")
function formatearTexto(s: any): string {
  if (!s || s === 'NaN' || s === '-') return '- - -';
  const str = String(s).trim();
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export function procesarGuiasCompletas(registros: any[] = []): GuiaFilaCompleta[] {
  if (!Array.isArray(registros)) return [];

  return registros.map((order) => {
    const id = String(order.id || order.ID || '');
    const fechaCreacionRaw = String(order.fechaCreacion || order['Fecha de creación'] || '');
    const fechaCreacion = parseDateToISO(fechaCreacionRaw);

    const diasGestion = Number(order.diasGestion ?? order['Días en gestión'] ?? 0);
    const ultimoMovimiento = Number(order.ultimoMovimiento ?? order['Último movimiento'] ?? 0);

    const tipoEstado = formatearTexto(order.tipoEstado || order['Tipo de estado'] || order.estado || order.Estado);
    const estado = formatearTexto(order.estado || order.Estado || order.tipoEstado);

    // Pagada Dropi y Dev en Bodega
    const rawPagada = String(order['Pagado por Dropi'] || order.pagadoDropi || 'NO').toUpperCase();
    const pagadaDropi = rawPagada.includes('SI') ? 'Si' : 'No';

    const fechaPago = parseDateToISO(order['Fecha de pago'] || order.fechaPago);

    const rawDev = String(order['Devolución a bodega'] || order.devBodega || 'NO').toUpperCase();
    const devBodega = rawDev.includes('SI') ? 'Si' : 'No';

    // Destino
    const destinoCiudad = formatearTexto(order.Destino || order.destino || '- - -');
    const destinoDepartamento = formatearTexto(order.Departamento || order.departamento || '- - -');

    const transportadora = formatearTexto(order.Transportadora || order.transportadora || '- - -');
    const numeroGuia = String(order['Número de guía'] || order.numeroGuia || '- - -');

    const cantRaw = order.cantidad ?? order['Productos (cantidad)'] ?? 1;
    const cantidadProductos = typeof cantRaw === 'number' ? cantRaw : parseInt(String(cantRaw), 10) || 1;

    const prodNombreBase = String(order.productoNombre || order.Productos || 'Producto').trim();
    const productoNombre = `${prodNombreBase} x${cantidadProductos}`;

    // Valores Financieros
    const recaudoNegocio = parseNumeroSeguro(order['Recaudo negocio'] ?? order.recaudoNegocio);
    const recaudoProveedor = parseNumeroSeguro(order['Recaudo proveedor'] ?? order.recaudoProveedor);
    const flete = parseNumeroSeguro(order.Flete ?? order.flete);
    const gananciaNegocio = parseNumeroSeguro(order.Utilidad ?? order.utilidad);

    return {
      id,
      fechaCreacion,
      fechaCreacionRaw,
      diasGestion,
      ultimoMovimiento,
      tipoEstado,
      estado,
      pagadaDropi,
      fechaPago,
      devBodega,
      destinoCiudad,
      destinoDepartamento,
      transportadora,
      numeroGuia,
      pedidos: 1,
      cantidadProductos,
      productoNombre,
      recaudoNegocio,
      recaudoProveedor,
      flete,
      gananciaNegocio,
    };
  });
}
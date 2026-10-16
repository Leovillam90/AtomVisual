// src/formulas/calculoProductos.ts

// ==========================================
// 1. DEFINICIÓN DE TIPOS
// ==========================================

export interface StatItem {
  pedidos: number;
  productos: number;
  bod: number;
  neg: number;
  utilidad: number;
  flete: number;
  pct: number;
}

export interface MetricsByStatusMap {
  Generados: StatItem;
  Entregados: StatItem;
  'Por Confirmar': StatItem;
  Pendientes: StatItem;
  'En curso': StatItem;
  'En novedad': StatItem;
  Devoluciones: StatItem;
}

export interface NegocioItem {
  id: string;
  name: string;
  totalPedidos: number;
  totalProductos: number;
  stats: MetricsByStatusMap;
}

export interface GrupoProductoAtom {
  name: string;
  totalPedidos: number;
  totalProductos: number;
  stats: MetricsByStatusMap;
  negociosList: NegocioItem[];
}

export interface ResultadoSegmentacionProductos {
  processedData: GrupoProductoAtom[];
  totalGlobalUnidades: number;
}

// ==========================================
// 2. UTILIDADES DE ESTADÍSTICAS VACÍAS
// ==========================================

function crearStatsVacias(): MetricsByStatusMap {
  return {
    Generados: { pedidos: 0, productos: 0, bod: 0, neg: 0, utilidad: 0, flete: 0, pct: 100 },
    Entregados: { pedidos: 0, productos: 0, bod: 0, neg: 0, utilidad: 0, flete: 0, pct: 0 },
    'Por Confirmar': { pedidos: 0, productos: 0, bod: 0, neg: 0, utilidad: 0, flete: 0, pct: 0 },
    Pendientes: { pedidos: 0, productos: 0, bod: 0, neg: 0, utilidad: 0, flete: 0, pct: 0 },
    'En curso': { pedidos: 0, productos: 0, bod: 0, neg: 0, utilidad: 0, flete: 0, pct: 0 },
    'En novedad': { pedidos: 0, productos: 0, bod: 0, neg: 0, utilidad: 0, flete: 0, pct: 0 },
    Devoluciones: { pedidos: 0, productos: 0, bod: 0, neg: 0, utilidad: 0, flete: 0, pct: 0 },
  };
}

// ==========================================
// 3. MOTOR DE CÁLCULO Y AGRUPACIÓN
// ==========================================

export function agruparMetricasPorProducto(
  registros: any[] = []
): ResultadoSegmentacionProductos {
  const data = Array.isArray(registros) ? registros : [];
  const agrupado: Record<string, any> = {};

  // 1. Acumulación por producto y estado
  data.forEach((order) => {
    if (!order) return;

    const prodName = String(
      order.productoNombre || order.Productos || order.productName || 'Producto General'
    ).trim();

    const cantRaw = order.cantidad ?? order['Productos (cantidad)'] ?? 1;
    const cantidad = typeof cantRaw === 'number' ? cantRaw : parseInt(String(cantRaw), 10) || 1;

    const recBod = Number(order.recaudoProveedor ?? order['Recaudo proveedor'] ?? 0);
    const recNeg = Number(order.recaudoNegocio ?? order['Recaudo negocio'] ?? 0);
    const utilidad = Number(order.utilidad ?? order.Utilidad ?? 0);
    const flete = Number(order.flete ?? order.Flete ?? 0);

    const rawEstado = String(
      order.tipoEstado || order['Tipo de estado'] || order.Estado || order.estado || ''
    ).toUpperCase().trim();

    let bucket: keyof Omit<MetricsByStatusMap, 'Generados'> = 'En curso';
    if (rawEstado.includes('FINALIZ') || rawEstado.includes('ENTREG')) {
      bucket = 'Entregados';
    } else if (rawEstado.includes('DEVOLU')) {
      bucket = 'Devoluciones';
    } else if (rawEstado.includes('NOVEDAD')) {
      bucket = 'En novedad';
    } else if (rawEstado.includes('CONFIRM')) {
      bucket = 'Por Confirmar';
    } else if (rawEstado.includes('PENDIENTE')) {
      bucket = 'Pendientes';
    } else {
      bucket = 'En curso';
    }

    if (!agrupado[prodName]) {
      agrupado[prodName] = {
        name: prodName,
        totalPedidos: 0,
        totalProductos: 0,
        stats: crearStatsVacias(),
        negociosMap: {} as Record<string, any>,
      };
    }

    const prod = agrupado[prodName];
    prod.totalPedidos += 1;

    // Acumular en el estado correspondiente
    prod.stats[bucket].pedidos += 1;
    prod.stats[bucket].productos += cantidad;
    prod.stats[bucket].bod += recBod;
    prod.stats[bucket].neg += recNeg;
    prod.stats[bucket].utilidad += utilidad;
    prod.stats[bucket].flete += flete;

    // Acumular en Generados
    prod.stats.Generados.pedidos += 1;
    prod.stats.Generados.productos += cantidad;
    prod.stats.Generados.bod += recBod;
    prod.stats.Generados.neg += recNeg;
    prod.stats.Generados.utilidad += utilidad;
    prod.stats.Generados.flete += flete;

    // Desglose de canal / tienda en cascada
    const bizName = String(order.dropshipper || order.Dropshipper || order.Tienda || 'Tienda').trim();
    const bizId = String(order.idDropshipper || order['ID Dropshipper'] || bizName).trim();

    if (!prod.negociosMap[bizId]) {
      prod.negociosMap[bizId] = {
        id: bizId,
        name: bizName,
        totalPedidos: 0,
        totalProductos: 0,
        stats: crearStatsVacias(),
      };
    }

    const biz = prod.negociosMap[bizId];
    biz.totalPedidos += 1;

    biz.stats[bucket].pedidos += 1;
    biz.stats[bucket].productos += cantidad;
    biz.stats[bucket].bod += recBod;
    biz.stats[bucket].neg += recNeg;
    biz.stats[bucket].utilidad += utilidad;
    biz.stats[bucket].flete += flete;

    biz.stats.Generados.pedidos += 1;
    biz.stats.Generados.productos += cantidad;
    biz.stats.Generados.bod += recBod;
    biz.stats.Generados.neg += recNeg;
    biz.stats.Generados.utilidad += utilidad;
    biz.stats.Generados.flete += flete;
  });

  // 2. Suma global de unidades en pantalla para ponderar Generados
  let totalGlobalUnidades = 0;
  Object.values(agrupado).forEach((prod: any) => {
    totalGlobalUnidades += prod.stats.Generados.productos;
  });

  // 3. Recalcular porcentajes
  const estadosHijos: Array<keyof Omit<MetricsByStatusMap, 'Generados'>> = [
    'Entregados', 'Por Confirmar', 'Pendientes', 'En curso', 'En novedad', 'Devoluciones'
  ];

  Object.values(agrupado).forEach((prod: any) => {
    const totalP = prod.totalPedidos || 1;
    prod.totalProductos = prod.stats.Generados.productos;

    prod.stats.Generados.pct = totalGlobalUnidades > 0
      ? Number(((prod.stats.Generados.productos / totalGlobalUnidades) * 100).toFixed(1))
      : 100;

    estadosHijos.forEach((k) => {
      prod.stats[k].pct = Number(((prod.stats[k].pedidos / totalP) * 100).toFixed(1));
    });

    // Recalcular participación por tienda
    const prodUnits = prod.stats.Generados.productos || 1;
    Object.values(prod.negociosMap).forEach((biz: any) => {
      const bizP = biz.totalPedidos || 1;
      biz.totalProductos = biz.stats.Generados.productos;

      biz.stats.Generados.pct = Number(((biz.stats.Generados.productos / prodUnits) * 100).toFixed(1));

      estadosHijos.forEach((k) => {
        biz.stats[k].pct = Number(((biz.stats[k].pedidos / bizP) * 100).toFixed(1));
      });
    });
  });

  // 4. Mapeo estructurado con tipado estricto garantizado (resuelve el error)
  const processedData: GrupoProductoAtom[] = Object.values(agrupado)
    .map((prod: any): GrupoProductoAtom => {
      const negociosList: NegocioItem[] = Object.values(prod.negociosMap || {})
        .map((biz: any): NegocioItem => ({
          id: String(biz?.id || ''),
          name: String(biz?.name || ''),
          totalPedidos: Number(biz?.totalPedidos || 0),
          totalProductos: Number(biz?.totalProductos || 0),
          stats: biz?.stats || crearStatsVacias(),
        }))
        .sort((a: NegocioItem, b: NegocioItem) => b.totalPedidos - a.totalPedidos);

      return {
        name: String(prod?.name || 'Producto General'),
        totalPedidos: Number(prod?.totalPedidos || 0),
        totalProductos: Number(prod?.totalProductos || 0),
        stats: prod?.stats || crearStatsVacias(),
        negociosList,
      };
    })
    .sort((a: GrupoProductoAtom, b: GrupoProductoAtom) => b.totalPedidos - a.totalPedidos);

  return {
    processedData,
    totalGlobalUnidades,
  };
}

// Alias de compatibilidad
export const segmentarProductosPorTipoEstado = agruparMetricasPorProducto;

export default agruparMetricasPorProducto;
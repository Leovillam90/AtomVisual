// src/formulas/calculoMetricas.ts
import { MetricsByStatusMap } from './types';
import { BDatomRecord } from '@/types/bdatom';

export function crearEstructuraStatsVacia(): MetricsByStatusMap {
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

export function mapearEstadoStandard(raw: string): keyof Omit<MetricsByStatusMap, 'Generados'> {
  const t = String(raw || '').toUpperCase().trim();
  if (t.includes('FINALIZ') || t.includes('ENTREG')) return 'Entregados';
  if (t.includes('DEVOLU')) return 'Devoluciones';
  if (t.includes('NOVEDAD')) return 'En novedad';
  if (t.includes('CONFIRM')) return 'Por Confirmar';
  if (t.includes('PENDIENTE')) return 'Pendientes';
  return 'En curso';
}

export function acumularPedidoEnStats(stats: MetricsByStatusMap, order: BDatomRecord) {
  if (!order) return;

  const cantidad = order.cantidad || 1;
  const recaudoBod = order.recaudoProveedor || 0;
  const recaudoNeg = order.recaudoNegocio || 0;
  const utilidad = order.utilidad || 0;
  const flete = order.flete || 0;

  const bucket = mapearEstadoStandard(order.tipoEstado || order.estado);

  if (stats[bucket]) {
    stats[bucket].pedidos += 1;
    stats[bucket].productos += cantidad;
    stats[bucket].bod += recaudoBod;
    stats[bucket].neg += recaudoNeg;
    stats[bucket].utilidad += utilidad;
    stats[bucket].flete += flete;
  }

  stats.Generados.pedidos += 1;
  stats.Generados.productos += cantidad;
  stats.Generados.bod += recaudoBod;
  stats.Generados.neg += recaudoNeg;
  stats.Generados.utilidad += utilidad;
  stats.Generados.flete += flete;
}

export function recalcularPorcentajes(stats: MetricsByStatusMap, totalProductosGlobal?: number) {
  const totalItemPedidos = stats.Generados.pedidos || 1;

  (Object.keys(stats) as Array<keyof MetricsByStatusMap>).forEach((key) => {
    if (key === 'Generados') {
      if (totalProductosGlobal && totalProductosGlobal > 0) {
        stats[key].pct = Number(((stats[key].productos / totalProductosGlobal) * 100).toFixed(1));
      } else {
        stats[key].pct = 100;
      }
    } else {
      stats[key].pct = Number(((stats[key].pedidos / totalItemPedidos) * 100).toFixed(1));
    }
  });
}
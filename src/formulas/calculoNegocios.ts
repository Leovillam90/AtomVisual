// src/formulas/calculoNegocios.ts
import { BDatomRecord } from '@/types/bdatom';
import { GrupoNegocioAtom } from './types';
import { crearEstructuraStatsVacia, acumularPedidoEnStats, recalcularPorcentajes } from './calculoMetricas';

export function agruparMetricasPorNegocio(data: BDatomRecord[] = []): {
  processedData: GrupoNegocioAtom[];
  totalGlobalUnidades: number;
} {
  const grouped: Record<string, any> = {};

  data.forEach((order) => {
    const bizName = String(order.dropshipper || 'Tienda').trim();
    const bizId = String(order.idDropshipper || bizName).trim();
    const key = `${bizName}__${bizId}`;

    if (!grouped[key]) {
      grouped[key] = {
        id: bizId,
        name: bizName,
        totalPedidos: 0,
        stats: crearEstructuraStatsVacia(),
        productosMap: {}
      };
    }

    const biz = grouped[key];
    biz.totalPedidos += 1;
    acumularPedidoEnStats(biz.stats, order);

    const prodName = String(order.productoNombre || 'Producto General').trim();
    if (!biz.productosMap[prodName]) {
      biz.productosMap[prodName] = {
        name: prodName,
        totalPedidos: 0,
        stats: crearEstructuraStatsVacia()
      };
    }

    const pRecord = biz.productosMap[prodName];
    pRecord.totalPedidos += 1;
    acumularPedidoEnStats(pRecord.stats, order);
  });

  let totalGlobalUnidades = 0;
  Object.values(grouped).forEach((biz: any) => {
    totalGlobalUnidades += biz.stats.Generados.productos;
  });

  Object.values(grouped).forEach((biz: any) => {
    recalcularPorcentajes(biz.stats, totalGlobalUnidades);
    Object.values(biz.productosMap).forEach((prod: any) => {
      recalcularPorcentajes(prod.stats, biz.stats.Generados.productos);
    });
  });

  const processedData: GrupoNegocioAtom[] = Object.values(grouped).map((biz: any) => ({
    id: biz.id,
    name: biz.name,
    totalPedidos: biz.totalPedidos,
    totalProductos: biz.stats.Generados.productos,
    stats: biz.stats,
    productosList: Object.values(biz.productosMap)
      .map((p: any) => ({
        name: p.name,
        totalPedidos: p.totalPedidos,
        totalProductos: p.stats.Generados.productos,
        stats: p.stats
      }))
      .sort((a, b) => b.totalPedidos - a.totalPedidos)
  })).sort((a, b) => b.totalPedidos - a.totalPedidos);

  return { processedData, totalGlobalUnidades };
}
// src/formulas/index.ts

// Exportaciones de Productos
export {
  agruparMetricasPorProducto,
  segmentarProductosPorTipoEstado
} from './calculoProductos';

export type {
  GrupoProductoAtom,
  ResultadoSegmentacionProductos,
  StatItem,
  MetricsByStatusMap,
  NegocioItem
} from './calculoProductos';

// Exportaciones de Guías (Corregido)
export { procesarGuiasCompletas } from './calculoGuias';
export type { GuiaFilaCompleta } from './calculoGuias';
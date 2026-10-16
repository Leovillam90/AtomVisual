// src/formulas/types.ts

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

export interface GrupoProductoAtom {
  name: string;
  totalPedidos: number;
  totalProductos: number;
  stats: MetricsByStatusMap;
  negociosList: Array<{
    id: string;
    name: string;
    totalPedidos: number;
    totalProductos: number;
    stats: MetricsByStatusMap;
  }>;
}

export interface GrupoNegocioAtom {
  id: string;
  name: string;
  totalPedidos: number;
  totalProductos: number;
  stats: MetricsByStatusMap;
  productosList: Array<{
    name: string;
    totalPedidos: number;
    totalProductos: number;
    stats: MetricsByStatusMap;
  }>;
}

export interface GuiaProcesadaAtom {
  id: string;
  fechaCreacion: string;
  diasGestionCalculados: number;
  ultMovimientoCalculado: number;
  colorUltMovimiento: 'verde' | 'amarillo' | 'rojo';
  tipoEstado: string;
  estado: string;
  pagadaDropi: string;
  fechaPago: string;
  devEnBodega: string;
  etiquetaAgente: string;
  ciudad: string;
  departamento: string;
  transportadora: string;
  numeroGuia: string;
  cantidad: number;
  productoNombre: string;
  recaudoNegocio: number;
  recaudoProveedor: number;
  flete: number;
  utilidadNegocio: number;
  bodega?: string;
  dropshipper?: string;
}

export interface DistribucionItem {
  nombre: string;
  cantidad: number;
  porcentaje: string;
  color: string;
  widthPct: number;
}

export interface EficienciaLogisticaResult {
  score: number;
  nivelScore: 'Riesgo' | 'Estable' | 'Alto Rendimiento' | 'Elite';
  promedioNacional: number;
  diferenciaPromedio: string;
  percentil: string;
  totalPedidos: number;
  totalProductos: number;
  componentesScore: {
    entregados: { porcentaje: number; aporte: number };
    movilizacion: { porcentaje: number; aporte: number };
    novedades: { porcentaje: number; aporte: number };
    recuperacion: { porcentaje: number; aporte: number };
  };
  resumenOperativo: {
    pedidosGenerados: number;
    tasaEntregaEfectiva: number;
    tasaRecuperacion: number;
    tasaMovilizacion: number;
  };
  distribucionEstados: DistribucionItem[];
  impactoFinanciero: {
    utilidadProtegida: number;
    utilidadEnRiesgo: number;
    recaudoProveedor: number;
    capitalRecuperado: number;
    capitalBloqueado: number;
    capitalPerdido: number;
  };
  ecoScanner: {
    usoGlobal: number;
    salidasEscaneadas: number;
    devolucionesEscaneadas: number;
    salidasRatio: string;
    devolucionesRatio: string;
  };
  scoreTrendData: Array<{ date: string; score: number }>;
}
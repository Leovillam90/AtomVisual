// src/types/bdatom.ts

export type TipoEstadoStandard = 
  | 'ENTREGADO' 
  | 'EN CURSO' 
  | 'EN DEVOLUCION' 
  | 'NOVEDAD' 
  | 'PENDIENTE' 
  | 'PENDIENTE POR CONFIRMACION';

export interface BDatomRecord {
  id: string;
  fechaCreacion: string;         // YYYY-MM-DD
  fechaCreacionRaw: string;      // DD/MM/YYYY
  diasGestion: number;
  ultMovimiento: number;
  estado: string;
  tipoEstado: TipoEstadoStandard;
  pagadoDropi: 'SI' | 'NO';
  fechaPago: string | null;
  devEnBodega: 'SI' | 'NO';
  destino: string;
  departamento: string;
  transportadora: string;
  numeroGuia: string;
  cantidad: number;
  productoNombre: string;
  recaudoNegocio: number;
  recaudoProveedor: number;
  flete: number;
  utilidad: number;
  tiendaId: string;
  dropshipper: string;
  idDropshipper: string;
  bodega: string;
  [key: string]: any;
}
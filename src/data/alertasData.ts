// src/data/alertasData.ts

export interface TareaHistoricoItem {
  id: string;
  fecha: string;
  tarea: string;
  guias: number;
  recaudo: number;
  estado: 'Completada' | 'Con error' | 'Sin verificar';
  hora: string;
}

export interface AlertaGuiaDetalle {
  id: string;
  numeroGuia: string;
  transportadora: string;
  destino: string;
  diasSinMovimiento: number;
  recaudoProveedor: number;
  estado: string;
  ticket?: string;
}

// Histórico de 90 días con todas las tareas en estado Completada
export const HISTORICO_TAREAS_DATA: TareaHistoricoItem[] = [
  { id: '1', fecha: '2026-10-14', tarea: 'Movilización de estancados', guias: 38, recaudo: 2642957, estado: 'Completada', hora: '10:09' },
  { id: '2', fecha: '2026-10-14', tarea: 'Novedades a dropshippers', guias: 24, recaudo: 2023789, estado: 'Completada', hora: '10:07' },
  { id: '3', fecha: '2026-10-14', tarea: 'Auditoría Fuera de bodega (+30 días)', guias: 28, recaudo: 2845000, estado: 'Completada', hora: '09:30' },
  { id: '4', fecha: '2026-10-13', tarea: 'Tracking directo', guias: 54, recaudo: 4120000, estado: 'Completada', hora: '10:00' },
  { id: '5', fecha: '2026-10-13', tarea: 'Auditoría Novedades (+10 días)', guias: 19, recaudo: 1620400, estado: 'Completada', hora: '09:15' },
  { id: '6', fecha: '2026-10-13', tarea: 'Movilización de estancados', guias: 35, recaudo: 2410800, estado: 'Completada', hora: '10:09' },
  { id: '7', fecha: '2026-10-12', tarea: 'Movilización de estancados', guias: 38, recaudo: 2642957, estado: 'Completada', hora: '10:09' },
  { id: '8', fecha: '2026-10-12', tarea: 'Novedades a dropshippers', guias: 24, recaudo: 2023789, estado: 'Completada', hora: '10:07' },
  { id: '9', fecha: '2026-10-12', tarea: 'Tracking directo', guias: 48, recaudo: 3680000, estado: 'Completada', hora: '10:00' },
];

// Listado de guías comprometidas para el modal de auditoría
export const GUIAS_ALERTA_MUESTRA: AlertaGuiaDetalle[] = [
  { id: '64532929', numeroGuia: 'V4002195712', transportadora: 'Veloces', destino: 'Medellín', diasSinMovimiento: 35, recaudoProveedor: 12000, estado: 'En Devolución', ticket: 'DEV453' },
  { id: '64544089', numeroGuia: '240045361089', transportadora: 'Interrapidisimo', destino: 'Dolores', diasSinMovimiento: 32, recaudoProveedor: 72000, estado: 'En Tránsito Crítico', ticket: 'DE0546' },
  { id: '64544161', numeroGuia: '240045418462', transportadora: 'Interrapidisimo', destino: 'Barranquilla', diasSinMovimiento: 12, recaudoProveedor: 33000, estado: 'Novedad Sin Gestión' },
  { id: '64581204', numeroGuia: 'ENV-98421045', transportadora: 'Envia', destino: 'Cali', diasSinMovimiento: 38, recaudoProveedor: 64000, estado: 'En Devolución', ticket: 'DEV890' },
  { id: '64590112', numeroGuia: 'COO-77412099', transportadora: 'Coordinadora', destino: 'Bogotá D.C.', diasSinMovimiento: 11, recaudoProveedor: 89000, estado: 'Novedad Sin Gestión' },
];

// Proformas legales automatizadas para PQR
export const PROFORMAS_LEGALES = {
  devoluciones: `SEÑORES TRANSPORTADORA / ATENCIÓN AL CLIENTE LOGÍSTICO:
Por medio de la presente, en calidad de Proveedor del ecosistema de comercio electrónico, radico solicitud formal de AUDITORÍA Y ENTREGA URGENTE DE MERCANCÍA correspondiente a las guías en estado de "Devolución" que superan el límite razonable de retorno y NO han ingresado físicamente a nuestra bodega.

Exigimos la confirmación de ingreso a bodega con acta de escaneo o, en su defecto, el inicio inmediato del trámite indemnizatorio por pérdida o extravío de mercancía según la normativa postal y comercial vigente.`,

  fueraBodega30d: `SOLICITUD FORMAL DE CIERRE LOGÍSTICO Y DECLARATORIA DE PÉRDIDA:
Las guías relacionadas presentan más de 30 días calendario desde su fecha física de despacho sin registro de entrega efectiva ni solución de novedad en ruta. 

Solicitamos la devolución inmediata del producto a nuestra bodega central o la liquidación del valor declarado correspondiente al costo del producto más flete asumido por inoperatividad logística del transportador.`,

  novedades10d: `REQUERIMIENTO POR NOVEDAD OPERATIVA VENCIDA (+10 DÍAS):
Las órdenes adjuntas registran hito de NOVEDAD logística sin resolución por más de 10 días calendario. Al haberse superado los intentos de entrega y el plazo de permanencia en oficina destino, exigimos el retorno inmediato de las unidades a nuestra bodega para reintegrar el stock al inventario activo.`
};

export default {
  HISTORICO_TAREAS_DATA,
  GUIAS_ALERTA_MUESTRA,
  PROFORMAS_LEGALES
};
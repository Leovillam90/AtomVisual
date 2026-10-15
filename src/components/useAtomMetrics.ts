import { useMemo } from 'react';

// Interfaz para tipar los datos recibidos del CSV
export interface GuiaData {
  id: string;
  tipo_estado: string;
  estado: string;
  dias_gestion: number;
  ult_movimiento: number;
  dev_en_bodega: string;
  recaudo_proveedor: number;
  fecha_creacion: string;
}

export const useAtomMetrics = (data: GuiaData[]) => {
  return useMemo(() => {
    let entregados = 0;
    let enCurso = 0;
    let enNovedad = 0;
    let enDevolucion = 0;
    let porConfirmar = 0;
    let pendientes = 0;

    let devEnBodegaSi = 0;
    let cursoYNovedadSanos = 0; // Para Tasa de Movilización (< 1 día sin movimiento)
    
    let recaudoProveedor = 0;
    let capitalBloqueado = 0;
    let capitalPerdido = 0;

    data.forEach((guia) => {
      const recaudo = Number(guia.recaudo_proveedor) || 0;
      const ultMov = Number(guia.ult_movimiento) || 0;
      const estado = (guia.tipo_estado || '').trim().toLowerCase();

      if (estado.includes('finalizada') || estado.includes('entregado')) {
        entregados++;
        recaudoProveedor += recaudo;
      } else if (estado.includes('curso')) {
        enCurso++;
        if (ultMov >= 3) capitalBloqueado += recaudo;
        if (ultMov < 1) cursoYNovedadSanos++;
      } else if (estado.includes('novedad')) {
        enNovedad++;
        if (ultMov >= 1) capitalBloqueado += recaudo;
        if (ultMov < 1) cursoYNovedadSanos++;
      } else if (estado.includes('devolución') || estado.includes('devolucion')) {
        enDevolucion++;
        if ((guia.dev_en_bodega || '').trim().toUpperCase() === 'SI') {
          devEnBodegaSi++;
        } else {
          capitalPerdido += recaudo;
        }
      } else if (estado.includes('confirm')) {
        porConfirmar++;
      } else if (estado.includes('pendiente')) {
        pendientes++;
      }
    });

    const despachados = entregados + enCurso + enNovedad + enDevolucion;
    const totalPedidos = data.length;

    // Fórmulas base del MVP
    const tasaEntregaEfectiva = despachados > 0 ? (entregados / despachados) * 100 : 0;
    const tasaRecuperacion = enDevolucion > 0 ? (devEnBodegaSi / enDevolucion) * 100 : 0;
    const totalCursoNovedad = enCurso + enNovedad;
    const tasaMovilizacion = totalCursoNovedad > 0 ? (cursoYNovedadSanos / totalCursoNovedad) * 100 : 0;
    const gestionNovedadesScore = enNovedad > 0 ? ((enNovedad - (capitalBloqueado > 0 ? 1 : 0)) / enNovedad) * 100 : 100;

    // Algoritmo Ponderado Score ATOM
    const scoreAtom = (tasaEntregaEfectiva * 0.40) + (tasaMovilizacion * 0.20) + (gestionNovedadesScore * 0.20) + (tasaRecuperacion * 0.20);
    const utilidadEnRiesgo = capitalBloqueado + capitalPerdido;

    return {
      scoreAtom: Math.round(scoreAtom) || 0,
      resumenOperativo: {
        pedidosGenerados: despachados,
        tasaEntrega: tasaEntregaEfectiva.toFixed(1),
        tasaRecuperacion: tasaRecuperacion.toFixed(1),
        tasaMovilizacion: tasaMovilizacion.toFixed(1),
      },
      impactoMonetario: {
        utilidadProtegida: recaudoProveedor,
        utilidadRiesgo: utilidadEnRiesgo,
        capitalBloqueado,
        capitalPerdido,
        capitalRecuperado: 0,
      },
      rendimiento: {
        entregados, enCurso, enNovedad, enDevolucion, porConfirmar, pendientes, totalPedidos,
      },
    };
  }, [data]);
};
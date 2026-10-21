// src/app/eficiencia/page.tsx
'use client';

import React, { useMemo } from 'react';
import { Home } from 'lucide-react';
import { useFiltrosCruzados } from '@/hooks/useFiltrosCruzados';
import FiltroFecha from '@/filtros/FiltroFecha';

// Componentes modulares
import Score from './Score';
import ResumenOperativo from './ResumenOperativo';
import DistribuciónEstados from './DistribuciónEstados';
import ImpactoFinanciero from './ImpactoFinanciero';
import TendenciaVentas from './TendenciaVentas';
import RiesgoNegocio from './RiesgoNegocio';
import IntegridadScanner from './IntegridadScanner';
import DesgloseScore from './DesgloseScore';

// ==========================================
// 1. HELPERS DE PARSEO Y NORMALIZACIÓN
// ==========================================
function normalizar(txt: any): string {
  if (txt === null || txt === undefined) return '';
  return String(txt)
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

function parseNumeroSeguro(v: any): number {
  if (v === null || v === undefined || v === '' || v === '-') return 0;
  if (typeof v === 'number') return isNaN(v) ? 0 : v;
  let s = String(v).trim().replace('$', '').replace(/\s/g, '');
  if (s.includes('.') && s.includes(',')) {
    s = s.replace(/\./g, '').replace(',', '.');
  } else if (s.includes(',')) {
    s = s.replace(',', '.');
  } else if (s.includes('.')) {
    const parts = s.split('.');
    if (parts.length === 2 && parts[1].length === 3) {
      s = parts[0] + parts[1];
    }
  }
  const res = parseFloat(s);
  return isNaN(res) ? 0 : res;
}

const formatMoney = (val: number) => `$ ${Math.round(val || 0).toLocaleString('es-CO')}`;

// ==========================================
// 2. COMPONENTE PRINCIPAL
// ==========================================
export default function EficienciaLogisticaPage() {
  const {
    filteredData,
    loading,
    dateFrom, setDateFrom,
    dateTo, setDateTo
  } = useFiltrosCruzados();

  // Cálculo reactivo dentro del componente usando filteredData
  const metricas = useMemo(() => {
    const records = Array.isArray(filteredData) ? filteredData : [];
    const totalPedidos = records.length;

    let entregadosCount = 0;
    let devolucionesCount = 0;
    let devRecibidasCount = 0;
    let devNoRecibidasCount = 0;
    let novedadesCount = 0;
    let enCursoCount = 0;
    let pendientesCount = 0;
    let porConfirmarCount = 0;
    let estancadosCount = 0;

    let productosTotales = 0;
    let utilidadEntregados = 0;
    let utilidadPorCobrar = 0;
    let utilidadEnRiesgo = 0;

    // Métricas financieras reales
    let recaudoProveedorEntregados = 0;
    let capitalRecuperado = 0;
    let capitalBloqueado = 0;
    let capitalPerdido = 0;

    records.forEach((row: any) => {
      const tipoEstado = normalizar(
        row['Tipo de estado'] || row.tipoEstado || row.estado || row.Estado || ''
      );
      const estadoDetalle = normalizar(
        row.estado || row.Estado || row.estadoGuia || ''
      );

      // Detección insensible a tildes y formatos (SÍ, SI, true, 1)
      const devBodegaRaw =
        row['Devolución a bodega'] ??
        row['Devolucion a bodega'] ??
        row['Devolución en bodega'] ??
        row['Devolucion en bodega'] ??
        row.devBodega ??
        row.devolucionABodega ??
        'NO';

      const devBodegaNorm = normalizar(devBodegaRaw);
      const estaEnBodegaSi =
        devBodegaNorm === 'si' ||
        devBodegaNorm.startsWith('si') ||
        devBodegaRaw === true ||
        devBodegaRaw === 1;

      const recaudoProv = parseNumeroSeguro(
        row['Recaudo proveedor'] ??
        row.recaudoProveedor ??
        row.recaudo ??
        row.Recaudo ??
        row.total ??
        0
      );

      const utilidad = parseNumeroSeguro(
        row.Utilidad ?? row.utilidad ?? row.utilidadTotal ?? 0
      );

      const cantidad = parseNumeroSeguro(
        row.Cantidad ?? row.cantidad ?? row['Productos (cantidad)'] ?? 1
      );
      productosTotales += cantidad > 0 ? cantidad : 1;

      const ultMov = Number(
        row['Último movimiento'] ??
        row['Ultimo movimiento'] ??
        row.ultimoMovimiento ??
        row['Días en gestión'] ??
        row.diasGestion ??
        0
      );

      // Clasificación operativa
      const isDevolucion =
        tipoEstado.includes('devolu') ||
        estadoDetalle.includes('devolu') ||
        tipoEstado.includes('devuelt') ||
        estadoDetalle.includes('devuelt') ||
        tipoEstado.includes('retorn');

      const isEntregado =
        !isDevolucion &&
        (tipoEstado.includes('entreg') || tipoEstado.includes('finaliz') || estadoDetalle.includes('entreg'));

      const isNovedad = !isDevolucion && !isEntregado && (tipoEstado.includes('novedad') || estadoDetalle.includes('novedad'));
      const isConfirmar = !isDevolucion && !isEntregado && (tipoEstado.includes('confirm') || estadoDetalle.includes('confirm'));
      const isPendiente = !isDevolucion && !isEntregado && (tipoEstado.includes('pendiente') || estadoDetalle.includes('pendiente'));

      if (isEntregado) {
        entregadosCount += 1;
        utilidadEntregados += utilidad;
        recaudoProveedorEntregados += recaudoProv;
      } else if (isDevolucion) {
        devolucionesCount += 1;
        if (estaEnBodegaSi) {
          devRecibidasCount += 1;
          capitalRecuperado += recaudoProv;
        } else {
          devNoRecibidasCount += 1;
          capitalPerdido += recaudoProv;
          utilidadEnRiesgo += Math.abs(utilidad);
        }
      } else if (isNovedad) {
        novedadesCount += 1;
        utilidadPorCobrar += utilidad;
        utilidadEnRiesgo += Math.abs(utilidad);
        capitalBloqueado += recaudoProv;
      } else if (isConfirmar) {
        porConfirmarCount += 1;
        utilidadPorCobrar += utilidad;
      } else if (isPendiente) {
        pendientesCount += 1;
        utilidadPorCobrar += utilidad;
      } else {
        enCursoCount += 1;
        utilidadPorCobrar += utilidad;
        if (ultMov >= 3) {
          estancadosCount += 1;
          capitalBloqueado += recaudoProv;
          utilidadEnRiesgo += Math.abs(utilidad);
        }
      }
    });

    // Fórmulas solicitadas:
    const utilidadProtegida = recaudoProveedorEntregados + capitalRecuperado;

    // Tasas operativas
    const tasaEntregaEfectiva = totalPedidos > 0 ? Number(((entregadosCount / totalPedidos) * 100).toFixed(1)) : 0;
    const tasaMovilizacion = totalPedidos > 0 ? Number(((1 - estancadosCount / totalPedidos) * 100).toFixed(1)) : 100;
    const tasaRecuperacionStock = devolucionesCount > 0 ? Number(((devRecibidasCount / devolucionesCount) * 100).toFixed(1)) : 0;
    const tasaNovedadesResueltas = 95.4;

    const ptsConversion = Number(((tasaEntregaEfectiva / 100) * 40).toFixed(1));
    const ptsMovilidad = Number((((tasaMovilizacion / 100) * 5) + ((tasaNovedadesResueltas / 100) * 5)).toFixed(1));
    const ptsCalidad = Number((((tasaRecuperacionStock / 100) * 14) + 6.7 + 10.0 + 3.0 + 5.0 + 5.0 + 3.0 + 2.9).toFixed(1));
    const totalScore = Number(Math.min(100, ptsConversion + ptsMovilidad + ptsCalidad).toFixed(1));

    const nivel: 'Óptimo' | 'Aceptable' | 'Riesgo' = totalScore >= 80 ? 'Óptimo' : totalScore >= 65 ? 'Aceptable' : 'Riesgo';
    const promedioNacional = 58.4;
    const diferenciaPts = Number((totalScore - promedioNacional).toFixed(1));

    return {
      scoreAtom: {
        total: totalScore,
        nivel,
        promedioNacional,
        diferenciaPts,
        topPorcentaje: 12,
        percentil: 88,
        ptsConversion,
        ptsMovilidad,
        ptsCalidad
      },
      resumenPeriodo: {
        pedidosTotales: totalPedidos,
        productosTotales,
        cobrado: utilidadEntregados,
        porCobrar: utilidadPorCobrar
      },
      impactoFinanciero: {
        utilidadProtegida,
        utilidadEnRiesgo,
        recaudoProveedor: recaudoProveedorEntregados,
        capitalRecuperado,
        capitalBloqueado,
        capitalPerdido
      },
      riesgoNegocio: {
        estancados: {
          cantidad: estancadosCount,
          valor: capitalBloqueado,
          porcentaje: totalPedidos > 0 ? Number(((estancadosCount / totalPedidos) * 100).toFixed(1)) : 0
        },
        devolucionesNoRecibidas: {
          cantidad: devNoRecibidasCount,
          valor: capitalPerdido,
          porcentaje: totalPedidos > 0 ? Number(((devNoRecibidasCount / totalPedidos) * 100).toFixed(1)) : 0
        }
      },
      resumenOperativo: {
        pedidosGenerados: totalPedidos,
        tasaEntregaEfectiva,
        tasaMovilizacion,
        tasaRecuperacionStock,
        tasaNovedadesResueltas
      },
      ecoScanner: {
        usoGlobalPct: 88.4,
        salidasPct: 96.3,
        devolucionesPct: 91.3
      }
    };
  }, [filteredData]);

  if (loading) {
    return (
      <div className="p-8 flex justify-center text-slate-500 font-sans">
        Cargando centro de mando...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 p-6 lg:p-8 font-sans flex flex-col gap-10">
      
      {/* NAVEGACIÓN Y FILTRO DE FECHAS */}
      <div className="space-y-4">
        <nav className="flex items-center gap-2 text-xs text-slate-400 font-medium">
          <Home size={14} className="text-slate-400" />
          <span>/</span>
          <span className="text-slate-600">Eficiencia logística</span>
        </nav>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Eficiencia logística</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Tablero de control de activos · Score ATOM & Calificación Operativa
            </p>
          </div>

          <FiltroFecha
            label="Periodo"
            startDate={dateFrom}
            endDate={dateTo}
            onApply={(start, end) => {
              setDateFrom(start);
              setDateTo(end);
            }}
          />
        </div>
      </div>

      {/* 1. DIAGNÓSTICO DE SALUD OPERATIVA */}
      <Score 
        scoreAtom={metricas.scoreAtom}
        resumenOperativo={metricas.resumenOperativo}
        calidadOperativaPct={96.4}
      />

      {/* 2. RESUMEN DEL PERIODO */}
      <ResumenOperativo data={metricas.resumenPeriodo} />

      {/* 3. DISTRIBUCIÓN POR ESTADO */}
      <DistribuciónEstados filteredData={filteredData} />

      {/* 4. IMPACTO FINANCIERO */}
      <ImpactoFinanciero 
        data={metricas.impactoFinanciero}
        formatMoney={formatMoney}
      />

      {/* 5. TENDENCIA DE VENTAS */}
      <TendenciaVentas filteredData={filteredData} />

      {/* 6. RIESGO DEL NEGOCIO */}
      <RiesgoNegocio data={metricas.riesgoNegocio} />

      {/* 7. INTEGRIDAD DE DATOS · ECO SCANNER */}
      <IntegridadScanner data={metricas.ecoScanner} />

      {/* 8. COMPOSICIÓN DEL SCORE ATOM */}
      <DesgloseScore 
        scoreGlobal={metricas.scoreAtom.total}
        filteredData={filteredData}
        macroPonderacion={{
          tasaEntrega: metricas.resumenOperativo.tasaEntregaEfectiva,
          tasaMovilizacion: metricas.resumenOperativo.tasaMovilizacion,
          tasaNovedades: metricas.resumenOperativo.tasaNovedadesResueltas,
          tasaRecuperacion: metricas.resumenOperativo.tasaRecuperacionStock
        }}
      />

    </div>
  );
}
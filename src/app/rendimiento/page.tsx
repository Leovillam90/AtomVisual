// src/app/rendimiento/page.tsx
'use client';

import React, { useMemo } from 'react';
import { 
  Home, 
  ChevronDown, 
  Package, 
  FileText, 
  CheckCircle2, 
  DollarSign, 
  AlertTriangle 
} from 'lucide-react';
import { useFiltrosCruzados } from '@/hooks/useFiltrosCruzados';
import FiltroFecha from '@/filtros/FiltroFecha';

// ==========================================
// 1. UTILIDADES DE PARSEO Y FORMATO
// ==========================================
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
      s = parts[0] + parts[1];
    }
  }
  const res = parseFloat(s);
  return isNaN(res) ? 0 : res;
}

function parseDateToISO(val: any): string {
  if (!val || val === 'NaN' || val === '-') return '';
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

const formatMoney = (val: number) => `$ ${Math.round(val).toLocaleString('es-CO')}`;

// ==========================================
// 2. COMPONENTE PRINCIPAL: RENDIMIENTO
// ==========================================
export default function RendimientoPage() {
  const {
    filteredData,
    loading,
    dateFrom, setDateFrom,
    dateTo, setDateTo,
    selectedBodegas, setSelectedBodegas,
    availableOptions
  } = useFiltrosCruzados();

  // ==========================================
  // MOTOR DE CÁLCULO DE RENDIMIENTO
  // ==========================================
  const resultado = useMemo(() => {
    const records = Array.isArray(filteredData) ? filteredData : [];
    const pedidosTotales = records.length;

    let productosTotales = 0;
    let cobrado = 0;
    let porCobrar = 0;

    // Acumuladores de distribución por estado
    const estadoBuckets: Record<string, { cantidad: number; utilidad: number; nombre: string; color: string }> = {
      'por-confirmar': { cantidad: 0, utilidad: 0, nombre: 'Por confirmar', color: '#6366f1' },
      'pendientes': { cantidad: 0, utilidad: 0, nombre: 'Pendientes', color: '#38bdf8' },
      'en-curso': { cantidad: 0, utilidad: 0, nombre: 'En curso', color: '#facc15' },
      'con-novedad': { cantidad: 0, utilidad: 0, nombre: 'Con novedad', color: '#fb923c' },
      'entregados': { cantidad: 0, utilidad: 0, nombre: 'Entregados', color: '#10b981' },
      'en-devolucion': { cantidad: 0, utilidad: 0, nombre: 'En devolución', color: '#ef4444' }
    };

    // Acumuladores de tendencia diaria
    const dailyMap: Record<string, { orders: number; entregados: number }> = {};

    // Acumuladores de riesgo
    let estancadosCount = 0;
    let estancadosMonto = 0;
    let devNoRecibidasCount = 0;
    let devNoRecibidasMonto = 0;

    records.forEach((row: any) => {
      const cantRaw = row.cantidad ?? row['Productos (cantidad)'] ?? 1;
      const cant = typeof cantRaw === 'number' ? cantRaw : parseInt(String(cantRaw), 10) || 1;
      productosTotales += cant;

      const utilidad = parseNumeroSeguro(row.utilidad ?? row.Utilidad);
      const recaudoProv = parseNumeroSeguro(row.recaudoProveedor ?? row['Recaudo proveedor']);
      const tipoRaw = String(row.tipoEstado || row['Tipo de estado'] || row.estado || '').toUpperCase().trim();
      const diasGestion = Number(row.diasGestion ?? row['Días en gestión'] ?? 0);
      const ultMov = Number(row.ultimoMovimiento ?? row['Último movimiento'] ?? 0);
      const devBodega = String(row.devBodega || row['Devolución a bodega'] || 'NO').toUpperCase().trim();

      // Clasificación operativa
      const isEntregado = tipoRaw.includes('ENTREG') || tipoRaw.includes('FINALIZ');
      const isDevolucion = tipoRaw.includes('DEVOLU');
      const isNovedad = tipoRaw.includes('NOVEDAD');
      const isConfirmar = tipoRaw.includes('CONFIRM');
      const isPendiente = tipoRaw.includes('PENDIENTE');

      if (isEntregado) {
        cobrado += utilidad;
        estadoBuckets['entregados'].cantidad += 1;
        estadoBuckets['entregados'].utilidad += utilidad;
      } else if (isDevolucion) {
        estadoBuckets['en-devolucion'].cantidad += 1;
        estadoBuckets['en-devolucion'].utilidad += utilidad;

        if (devBodega === 'NO') {
          devNoRecibidasCount += 1;
          devNoRecibidasMonto += recaudoProv;
        }
      } else {
        // En tránsito / Activas
        porCobrar += utilidad;

        if (isConfirmar) {
          estadoBuckets['por-confirmar'].cantidad += 1;
          estadoBuckets['por-confirmar'].utilidad += utilidad;
        } else if (isPendiente) {
          estadoBuckets['pendientes'].cantidad += 1;
          estadoBuckets['pendientes'].utilidad += utilidad;
        } else if (isNovedad) {
          estadoBuckets['con-novedad'].cantidad += 1;
          estadoBuckets['con-novedad'].utilidad += utilidad;
        } else {
          estadoBuckets['en-curso'].cantidad += 1;
          estadoBuckets['en-curso'].utilidad += utilidad;
        }

        // Estancados: más de 3 días sin movimiento
        if (ultMov > 3 || diasGestion > 3) {
          estancadosCount += 1;
          estancadosMonto += recaudoProv;
        }
      }

      // Tendencia Diaria
      const fechaISO = parseDateToISO(row.fechaCreacion || row['Fecha de creación']);
      if (fechaISO) {
        const shortDate = fechaISO.slice(5); // 'MM-DD'
        if (!dailyMap[shortDate]) {
          dailyMap[shortDate] = { orders: 0, entregados: 0 };
        }
        dailyMap[shortDate].orders += 1;
        if (isEntregado) {
          dailyMap[shortDate].entregados += 1;
        }
      }
    });

    // Construcción de la distribución porcentual
    const distribucion = Object.entries(estadoBuckets).map(([id, item]) => {
      const pct = pedidosTotales > 0 ? (item.cantidad / pedidosTotales) * 100 : 0;
      return {
        id,
        nombre: item.nombre,
        cantidad: item.cantidad,
        porcentaje: `${pct.toFixed(pct < 10 ? 1 : 0)}%`,
        monto: formatMoney(item.utilidad),
        color: item.color,
        widthPct: pct
      };
    });

    // Construcción de la tendencia de ventas diaria (últimos 14 días con órdenes)
    const sortedDates = Object.keys(dailyMap).sort().slice(-14);
    const tendenciaVentas = sortedDates.map((date) => {
      const d = dailyMap[date];
      const efectividad = d.orders > 0 ? Math.round((d.entregados / d.orders) * 100) : 0;
      return {
        date,
        orders: d.orders,
        efectividad
      };
    });

    return {
      resumenPeriodo: {
        pedidosTotales,
        productosTotales,
        cobrado,
        porCobrar
      },
      distribucionEstados: distribucion,
      tendenciaVentasDiaria: tendenciaVentas,
      riesgoNegocio: {
        pedidosEstancadosCount: estancadosCount,
        pedidosEstancadosMonto: estancadosMonto,
        pedidosEstancadosPct: pedidosTotales > 0 ? Number(((estancadosCount / pedidosTotales) * 100).toFixed(1)) : 0,
        devolucionesNoRecibidasCount: devNoRecibidasCount,
        devolucionesNoRecibidasMonto: devNoRecibidasMonto,
        devolucionesNoRecibidasPct: pedidosTotales > 0 ? Number(((devNoRecibidasCount / pedidosTotales) * 100).toFixed(1)) : 0,
      }
    };
  }, [filteredData]);

  // Fallbacks de gráfica en caso de no tener órdenes cargadas
  const chartData = resultado.tendenciaVentasDiaria.length > 0
    ? resultado.tendenciaVentasDiaria
    : [
        { date: '10-01', orders: 74, efectividad: 65 },
        { date: '10-02', orders: 60, efectividad: 68 },
        { date: '10-03', orders: 65, efectividad: 54 },
        { date: '10-04', orders: 72, efectividad: 70 },
        { date: '10-05', orders: 86, efectividad: 57 },
        { date: '10-06', orders: 98, efectividad: 58 },
        { date: '10-07', orders: 78, efectividad: 34 },
        { date: '10-08', orders: 67, efectividad: 33 },
        { date: '10-09', orders: 70, efectividad: 26 },
        { date: '10-10', orders: 50, efectividad: 0 },
        { date: '10-11', orders: 68, efectividad: 0 },
        { date: '10-12', orders: 68, efectividad: 0 },
        { date: '10-13', orders: 67, efectividad: 0 },
        { date: '10-14', orders: 8, efectividad: 0 }
      ];

  const maxOrders = Math.max(...chartData.map(c => c.orders), 10);

  if (loading) {
    return <div className="p-8 flex justify-center text-slate-500 font-sans">Cargando métricas de rendimiento...</div>;
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 p-6 lg:p-8 font-sans space-y-6">
      
      {/* BREADCRUMB */}
      <nav className="flex items-center gap-2 text-xs text-slate-400 font-medium">
        <Home size={14} className="text-slate-400" />
        <span>/</span>
        <span className="text-slate-600">Rendimiento</span>
      </nav>

      {/* CABECERA PRINCIPAL */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Rendimiento</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Tendencia de ventas, efectividad y riesgo del negocio
          </p>
        </div>

        <FiltroFecha
          startDate={dateFrom}
          endDate={dateTo}
          onApply={(start, end) => {
            setDateFrom(start);
            setDateTo(end);
          }}
        />
      </div>

      {/* FILTRO BODEGA */}
      <div className="w-64">
        <label className="text-xs text-slate-500 font-medium block mb-1">Bodega</label>
        <div className="relative">
          <select
            value={selectedBodegas[0] || '(Todos)'}
            onChange={(e) => setSelectedBodegas(e.target.value === '(Todos)' ? [] : [e.target.value])}
            className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-700 shadow-2xs outline-none hover:border-slate-300 focus:border-slate-400 appearance-none pr-8 cursor-pointer font-medium"
          >
            <option value="(Todos)">(Todos)</option>
            {availableOptions.bodegas.map((b: string) => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
          <ChevronDown size={14} className="text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* 1. RESUMEN DEL PERIODO */}
      <section className="space-y-3">
        <div>
          <h2 className="text-base font-extrabold text-slate-900 tracking-tight">Resumen del periodo</h2>
          <p className="text-xs text-slate-500 mt-0.5">Volumen y flujo de capital de las órdenes generadas</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-[#f97316]">
                <Package size={16} />
              </div>
              <span className="text-[11px] font-bold tracking-wider text-slate-500 uppercase">PEDIDOS TOTALES</span>
            </div>
            <p className="text-3xl font-extrabold text-[#f97316] tracking-tight">
              {resultado.resumenPeriodo.pedidosTotales.toLocaleString('es-CO')}
            </p>
            <p className="text-xs text-slate-400 font-normal">Órdenes generadas en el rango</p>
          </div>

          <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-[#f97316]">
                <FileText size={16} />
              </div>
              <span className="text-[11px] font-bold tracking-wider text-slate-500 uppercase">PRODUCTOS TOTALES</span>
            </div>
            <p className="text-3xl font-extrabold text-[#f97316] tracking-tight">
              {resultado.resumenPeriodo.productosTotales.toLocaleString('es-CO')}
            </p>
            <p className="text-xs text-slate-400 font-normal">Items despachados o pendientes</p>
          </div>

          <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-[#f97316]">
                <CheckCircle2 size={16} />
              </div>
              <span className="text-[11px] font-bold tracking-wider text-slate-500 uppercase">COBRADO</span>
            </div>
            <p className="text-3xl font-extrabold text-[#f97316] tracking-tight">
              {formatMoney(resultado.resumenPeriodo.cobrado)}
            </p>
            <p className="text-xs text-slate-400 font-normal">Utilidad neta de pedidos entregados</p>
          </div>

          <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-[#f97316]">
                <DollarSign size={16} />
              </div>
              <span className="text-[11px] font-bold tracking-wider text-slate-500 uppercase">POR COBRAR</span>
            </div>
            <p className="text-3xl font-extrabold text-[#f97316] tracking-tight">
              {formatMoney(resultado.resumenPeriodo.porCobrar)}
            </p>
            <p className="text-xs text-slate-400 font-normal">Utilidad pendiente en órdenes activas</p>
          </div>

        </div>
      </section>

      {/* 2. DISTRIBUCIÓN POR ESTADO */}
      <section className="space-y-3">
        <div>
          <h2 className="text-base font-extrabold text-slate-900 tracking-tight">Distribución por estado</h2>
          <p className="text-xs text-slate-500 mt-0.5">Dónde están las órdenes ahora mismo</p>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-2xs space-y-5">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">
              {resultado.resumenPeriodo.pedidosTotales.toLocaleString('es-CO')}
            </span>
            <span className="text-xs text-slate-500 font-medium">Pedidos totales</span>
          </div>

          {/* Barra apilada multicolor */}
          <div className="w-full h-3 rounded-full overflow-hidden flex bg-slate-100">
            {resultado.distribucionEstados.map((item) => (
              <div
                key={item.id}
                style={{ width: `${item.widthPct}%`, backgroundColor: item.color }}
                className="h-full transition-all duration-300"
                title={`${item.nombre}: ${item.cantidad} (${item.porcentaje})`}
              />
            ))}
          </div>

          {/* Leyenda y Desglose */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 pt-1">
            {resultado.distribucionEstados.map((item) => (
              <div key={item.id} className="flex items-start gap-2">
                <span className="w-2.5 h-2.5 rounded-xs shrink-0 mt-0.5" style={{ backgroundColor: item.color }} />
                <div className="text-xs space-y-0.5">
                  <span className="text-slate-500 block">{item.nombre}</span>
                  <div className="text-slate-800">
                    <span className="font-extrabold">{item.cantidad}</span>
                    <span className="text-slate-400 text-[11px] ml-1">· {item.porcentaje} · {item.monto}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. TENDENCIA DE VENTAS: HISTOGRAMA + LÍNEA DE EFECTIVIDAD */}
      <section className="space-y-3">
        <div>
          <h2 className="text-base font-extrabold text-slate-900 tracking-tight">Tendencia de ventas</h2>
          <p className="text-xs text-slate-500 mt-0.5">Pedidos diarios y efectividad de entrega</p>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-2xs space-y-5">
          
          <div className="flex items-center gap-6 text-xs text-slate-600 font-medium">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-xs bg-[#f6bd89]" />
              <span>Pedidos por día</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-xs bg-[#c2410c]" />
              <span>Efectividad %</span>
            </div>
          </div>

          <div className="flex gap-3 items-stretch w-full pt-1">
            
            {/* Eje Y de porcentajes */}
            <div className="w-10 flex flex-col justify-between text-[11px] text-slate-400 font-medium pb-8 select-none shrink-0">
              <span>100%</span>
              <span>75%</span>
              <span>50%</span>
              <span>25%</span>
              <span>0%</span>
            </div>

            {/* Canvas de gráfico con SVG */}
            <div className="flex-1 flex flex-col min-w-0">
              <div className="relative w-full h-56">
                
                {/* Cuadrícula horizontal */}
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <div key={i} className="border-b border-slate-100 w-full" />
                  ))}
                </div>

                {/* Barras de pedidos por día */}
                <div className="absolute inset-0 flex items-end justify-between z-0">
                  {chartData.map((d) => (
                    <div key={d.date} className="flex-1 flex justify-center items-end h-full group relative px-1">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-8 bg-slate-900 text-white text-[10px] font-bold py-1 px-2 rounded-lg pointer-events-none whitespace-nowrap z-30 shadow-md">
                        {d.date}: {d.orders} pedidos ({d.efectividad}%)
                      </div>

                      <div
                        className="w-full max-w-[46px] bg-[#f6bd89] hover:bg-[#f3a462] rounded-t-xs transition-colors"
                        style={{ height: `${(d.orders / maxOrders) * 100}%` }}
                      />
                    </div>
                  ))}
                </div>

                {/* Línea SVG de efectividad */}
                <svg
                  className="absolute inset-0 w-full h-full pointer-events-none z-10 overflow-visible"
                  viewBox="0 0 1000 100"
                  preserveAspectRatio="none"
                >
                  <path
                    d={chartData.map((d, idx) => {
                      const x = ((idx + 0.5) / chartData.length) * 1000;
                      const y = 100 - d.efectividad;
                      return `${idx === 0 ? 'M' : 'L'} ${x} ${y}`;
                    }).join(' ')}
                    fill="none"
                    stroke="#c2410c"
                    strokeWidth="2.5"
                    vectorEffect="non-scaling-stroke"
                  />
                </svg>

                {/* Nodos circulares sobre la línea */}
                {chartData.map((d, idx) => {
                  const xPct = ((idx + 0.5) / chartData.length) * 100;
                  const yPct = 100 - d.efectividad;

                  return (
                    <div
                      key={`dot-${d.date}`}
                      className="absolute w-2.5 h-2.5 rounded-full bg-white border-2 border-[#c2410c] -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none shadow-2xs"
                      style={{ left: `${xPct}%`, top: `${yPct}%` }}
                    />
                  );
                })}
              </div>

              {/* Eje X de fechas */}
              <div className="flex justify-between w-full text-[11px] text-slate-400 font-medium pt-3 select-none">
                {chartData.map((d, idx) => {
                  const showLabel = idx % 2 === 0 || idx === chartData.length - 1;
                  return (
                    <div key={d.date} className="flex-1 text-center truncate">
                      {showLabel ? d.date : ''}
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. RIESGO DEL NEGOCIO */}
      <section className="space-y-3">
        <div>
          <h2 className="text-base font-extrabold text-slate-900 tracking-tight">Riesgo del negocio</h2>
          <p className="text-xs text-slate-500 mt-0.5">Pedidos que requieren atención inmediata</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Pedidos estancados (>3 días) */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-2xs flex flex-col justify-between space-y-5">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-[#f97316]">
                  <AlertTriangle size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Pedidos estancados</h3>
                  <p className="text-xs text-slate-400">&gt;3 días sin movimiento</p>
                </div>
              </div>
              <span className="bg-orange-50 text-[#f97316] font-bold text-xs px-2.5 py-0.5 rounded-full border border-orange-200/70">
                {resultado.riesgoNegocio.pedidosEstancadosPct}%
              </span>
            </div>

            <div className="flex items-baseline gap-10 pt-2">
              <div>
                <p className="text-2xl font-black text-[#f97316] tracking-tight">
                  {resultado.riesgoNegocio.pedidosEstancadosCount}
                </p>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block">PEDIDOS</span>
              </div>
              <div>
                <p className="text-2xl font-black text-slate-900 tracking-tight">
                  {formatMoney(resultado.riesgoNegocio.pedidosEstancadosMonto)}
                </p>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block">EN RIESGO</span>
              </div>
            </div>
          </div>

          {/* Devoluciones no recibidas */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-2xs flex flex-col justify-between space-y-5">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-500">
                  <AlertTriangle size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Devoluciones no recibidas</h3>
                  <p className="text-xs text-slate-400">Esperan llegar a bodega</p>
                </div>
              </div>
              <span className="bg-rose-50 text-rose-600 font-bold text-xs px-2.5 py-0.5 rounded-full border border-rose-200/70">
                {resultado.riesgoNegocio.devolucionesNoRecibidasPct}%
              </span>
            </div>

            <div className="flex items-baseline gap-10 pt-2">
              <div>
                <p className="text-2xl font-black text-rose-600 tracking-tight">
                  {resultado.riesgoNegocio.devolucionesNoRecibidasCount}
                </p>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block">PEDIDOS</span>
              </div>
              <div>
                <p className="text-2xl font-black text-slate-900 tracking-tight">
                  {formatMoney(resultado.riesgoNegocio.devolucionesNoRecibidasMonto)}
                </p>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block">EN RIESGO</span>
              </div>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}
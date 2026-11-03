// src/app/rendimiento/Rendimiento.tsx
'use client';

import React, { useState, useMemo } from 'react';
import { 
  Package, 
  FileText, 
  CheckCircle2, 
  DollarSign 
} from 'lucide-react';
import { useFiltrosCruzados } from '@/hooks/useFiltrosCruzados';

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

const formatMoney = (val: number) => `$ ${Math.round(val || 0).toLocaleString('es-CO')}`;

interface RendimientoProps {
  filteredData?: any[];
}

// ==========================================
// 2. COMPONENTE MODULAR RENDIMIENTO
// ==========================================
export default function Rendimiento({ filteredData: propFilteredData }: RendimientoProps) {
  const { filteredData: hookFilteredData } = useFiltrosCruzados();
  const rawData = propFilteredData || hookFilteredData;

  // Estado del hover sobre el día seleccionado
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  // ==========================================
  // MOTOR DE CÁLCULO DE RENDIMIENTO
  // ==========================================
  const resultado = useMemo(() => {
    const records = Array.isArray(rawData) ? rawData : [];
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

    // Acumuladores de tendencia diaria con monto acumulado y fecha completa
    const dailyMap: Record<string, { orders: number; entregados: number; monto: number; fullDate: string }> = {};

    records.forEach((row: any) => {
      const cantRaw = row.cantidad ?? row['Productos (cantidad)'] ?? 1;
      const cant = typeof cantRaw === 'number' ? cantRaw : parseInt(String(cantRaw), 10) || 1;
      productosTotales += cant;

      const utilidad = parseNumeroSeguro(row.utilidad ?? row.Utilidad);
      const tipoRaw = String(row.tipoEstado || row['Tipo de estado'] || row.estado || '').toUpperCase().trim();

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
      } else {
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
      }

      // Tendencia diaria
      const fechaISO = parseDateToISO(row.fechaCreacion || row['Fecha de creación']);
      if (fechaISO) {
        const shortDate = fechaISO.slice(5);
        if (!dailyMap[shortDate]) {
          dailyMap[shortDate] = { orders: 0, entregados: 0, monto: 0, fullDate: fechaISO };
        }
        dailyMap[shortDate].orders += 1;
        if (isEntregado) {
          dailyMap[shortDate].entregados += 1;
          dailyMap[shortDate].monto += utilidad;
        }
      }
    });

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

    const sortedDates = Object.keys(dailyMap).sort().slice(-14);
    const tendenciaVentas = sortedDates.map((date) => {
      const d = dailyMap[date];
      const efectividad = d.orders > 0 ? Number(((d.entregados / d.orders) * 100).toFixed(1)) : 0;
      return {
        date,
        fullDate: d.fullDate,
        orders: d.orders,
        efectividad,
        monto: d.monto
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
      tendenciaVentasDiaria: tendenciaVentas
    };
  }, [rawData]);

  const chartData = resultado.tendenciaVentasDiaria.length > 0
    ? resultado.tendenciaVentasDiaria
    : [
        { fullDate: '2026-10-01', date: '10-01', orders: 74, efectividad: 65, monto: 2480000 },
        { fullDate: '2026-10-02', date: '10-02', orders: 60, efectividad: 68, monto: 2190000 },
        { fullDate: '2026-10-03', date: '10-03', orders: 65, efectividad: 54, monto: 1890000 },
        { fullDate: '2026-10-04', date: '10-04', orders: 72, efectividad: 70, monto: 2710000 },
        { fullDate: '2026-10-05', date: '10-05', orders: 86, efectividad: 57, monto: 2650000 },
        { fullDate: '2026-10-06', date: '10-06', orders: 98, efectividad: 58, monto: 3080000 },
        { fullDate: '2026-10-07', date: '10-07', orders: 61, efectividad: 62.3, monto: 2051500 },
        { fullDate: '2026-10-08', date: '10-08', orders: 67, efectividad: 33, monto: 1180000 },
        { fullDate: '2026-10-09', date: '10-09', orders: 70, efectividad: 26, monto: 980000 },
        { fullDate: '2026-10-10', date: '10-10', orders: 50, efectividad: 0, monto: 0 },
        { fullDate: '2026-10-11', date: '10-11', orders: 68, efectividad: 0, monto: 0 },
        { fullDate: '2026-10-12', date: '10-12', orders: 68, efectividad: 0, monto: 0 },
        { fullDate: '2026-10-13', date: '10-13', orders: 67, efectividad: 0, monto: 0 },
        { fullDate: '2026-10-14', date: '10-14', orders: 8, efectividad: 0, monto: 0 }
      ];

  // Margen superior calibrado (+25%) para que las barras más altas nunca tapen la leyenda
  const maxOrdersRaw = Math.max(...chartData.map(c => c.orders), 10);
  const maxOrders = Math.ceil(maxOrdersRaw * 1.25);

  return (
    <div className="w-full space-y-8 font-sans">
      
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

      {/* 3. TENDENCIA DE VENTAS (TOOLTIP SIEMPRE ENCIMA DE LAS BARRAS) */}
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
            <div className="w-10 flex flex-col justify-between text-[11px] text-slate-400 font-medium pb-8 select-none shrink-0">
              <span>100%</span>
              <span>75%</span>
              <span>50%</span>
              <span>25%</span>
              <span>0%</span>
            </div>

            <div className="flex-1 flex flex-col min-w-0">
              <div className="relative w-full h-60">
                
                {/* Cuadrícula horizontal */}
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <div key={i} className="border-b border-slate-100 w-full" />
                  ))}
                </div>

                {/* Barras y Trigger de Hover */}
                <div className="absolute inset-0 flex items-end justify-between z-10">
                  {chartData.map((d, idx) => {
                    const isHovered = hoveredIdx === idx;
                    const barHeightPct = (d.orders / maxOrders) * 100;

                    return (
                      <div
                        key={d.date}
                        className="flex-1 flex justify-center items-end h-full relative px-1 cursor-pointer"
                        onMouseEnter={() => setHoveredIdx(idx)}
                        onMouseLeave={() => setHoveredIdx(null)}
                      >
                        {/* Tooltip posicionado estrictamente ENCIMA de la barra activa */}
                        {isHovered && (
                          <div 
                            className={`absolute z-40 bg-white border border-slate-200/90 rounded-2xl p-2.5 shadow-xl pointer-events-none text-left min-w-[130px] whitespace-nowrap transition-all duration-150 ${
                              idx === 0 || idx === 1
                                ? 'left-0'
                                : idx >= chartData.length - 2
                                ? 'right-0'
                                : 'left-1/2 -translate-x-1/2'
                            }`}
                            style={{
                              bottom: `calc(${barHeightPct}% + 10px)`
                            }}
                          >
                            {/* Fecha completa YYYY-MM-DD */}
                            <div className="text-[11px] font-medium text-slate-500 mb-1.5 leading-none">
                              {d.fullDate || `2026-${d.date}`}
                            </div>

                            {/* Detalle de pedidos y efectividad */}
                            <div className="space-y-1">
                              <div className="flex items-center gap-1.5 text-xs text-slate-700 font-medium leading-none">
                                <span className="w-2 h-2 rounded-full bg-[#818cf8] shrink-0" />
                                <span>{d.orders} pedidos</span>
                              </div>
                              <div className="flex items-center gap-1.5 text-xs text-slate-700 font-medium leading-none">
                                <span className="w-2 h-2 rounded-full bg-[#2dd4bf] shrink-0" />
                                <span>
                                  {typeof d.efectividad === 'number'
                                    ? (Number.isInteger(d.efectividad) ? `${d.efectividad}%` : `${d.efectividad.toFixed(1)}%`)
                                    : `${d.efectividad}%`} efectividad
                                </span>
                              </div>
                            </div>

                            {/* Separador sutil */}
                            <div className="border-t border-slate-100 my-1.5" />

                            {/* Monto financiero en negrita */}
                            <div className="text-xs font-black text-slate-900 leading-none">
                              {formatMoney(d.monto)}
                            </div>
                          </div>
                        )}

                        {/* Barra del día */}
                        <div
                          className={`w-full max-w-[46px] rounded-t-xs transition-colors duration-200 ${
                            isHovered ? 'bg-[#f3a462]' : 'bg-[#f6bd89]'
                          }`}
                          style={{ height: `${barHeightPct}%` }}
                        />
                      </div>
                    );
                  })}
                </div>

                {/* Línea SVG de efectividad */}
                <svg
                  className="absolute inset-0 w-full h-full pointer-events-none z-20 overflow-visible"
                  viewBox="0 0 1000 100"
                  preserveAspectRatio="none"
                >
                  <path
                    d={chartData.map((d, idx) => {
                      const x = ((idx + 0.5) / chartData.length) * 1000;
                      const y = 100 - (d.efectividad * 0.8);
                      return `${idx === 0 ? 'M' : 'L'} ${x} ${y}`;
                    }).join(' ')}
                    fill="none"
                    stroke="#c2410c"
                    strokeWidth="2.5"
                    vectorEffect="non-scaling-stroke"
                  />
                </svg>

                {/* Puntos circulares sobre la línea */}
                {chartData.map((d, idx) => {
                  const xPct = ((idx + 0.5) / chartData.length) * 100;
                  const yPct = 100 - (d.efectividad * 0.8);
                  const isHovered = hoveredIdx === idx;

                  return (
                    <div
                      key={`dot-${d.date}`}
                      className={`absolute w-2.5 h-2.5 rounded-full bg-white border-2 border-[#c2410c] -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none shadow-2xs transition-transform duration-200 ${
                        isHovered ? 'scale-125 ring-4 ring-orange-500/20' : ''
                      }`}
                      style={{ left: `${xPct}%`, top: `${yPct}%` }}
                    />
                  );
                })}
              </div>

              {/* Eje X: Fechas */}
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

    </div>
  );
}

export { Rendimiento };
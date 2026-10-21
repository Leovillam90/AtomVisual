// src/app/eficiencia/RiesgoNegocio.tsx
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { AlertTriangle, HelpCircle, X } from 'lucide-react';

export interface RiesgoNegocioData {
  estancados?: {
    cantidad: number;
    valor: number;
    porcentaje: number;
  };
  devolucionesNoRecibidas?: {
    cantidad: number;
    valor: number;
    porcentaje: number;
  };
}

interface RiesgoNegocioProps {
  data?: RiesgoNegocioData;
  filteredData?: any[];
}

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

export default function RiesgoNegocio({ data, filteredData }: RiesgoNegocioProps) {
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  // Cerrar tooltips al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.riesgo-tooltip-container')) {
        setActiveTooltip(null);
      }
    };

    if (activeTooltip) {
      document.addEventListener('click', handleClickOutside);
    }
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [activeTooltip]);

  const toggleTooltip = (key: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveTooltip((prev) => (prev === key ? null : key));
  };

  // Cálculo dinámico tolerante a datos crudos o estructura de metricas
  const metrics = useMemo(() => {
    if (Array.isArray(filteredData) && filteredData.length > 0) {
      const total = filteredData.length;
      let estancadosCount = 0;
      let estancadosValor = 0;
      let devNoRecibidasCount = 0;
      let devNoRecibidasValor = 0;

      filteredData.forEach((row: any) => {
        const tipoEstado = normalizar(
          row['Tipo de estado'] || row.tipoEstado || row.estado || row.Estado || ''
        );
        const estadoDetalle = normalizar(
          row.estado || row.Estado || row.estadoGuia || ''
        );

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

        const ultMov = Number(
          row['Último movimiento'] ??
          row['Ultimo movimiento'] ??
          row.ultimoMovimiento ??
          row['Días en gestión'] ??
          row.diasGestion ??
          0
        );

        const isDevolucion =
          tipoEstado.includes('devolu') ||
          estadoDetalle.includes('devolu') ||
          tipoEstado.includes('devuelt') ||
          estadoDetalle.includes('devuelt') ||
          tipoEstado.includes('retorn');

        if (isDevolucion) {
          if (!estaEnBodegaSi) {
            devNoRecibidasCount += 1;
            devNoRecibidasValor += recaudoProv;
          }
        } else {
          const isEntregado = tipoEstado.includes('entreg') || tipoEstado.includes('finaliz');
          const isNovedad = tipoEstado.includes('novedad');
          const isConfirmar = tipoEstado.includes('confirm');
          const isPendiente = tipoEstado.includes('pendiente');

          if (!isEntregado && !isNovedad && !isConfirmar && !isPendiente) {
            if (ultMov >= 3) {
              estancadosCount += 1;
              estancadosValor += recaudoProv;
            }
          }
        }
      });

      return {
        estancadosCount,
        estancadosValor,
        estancadosPct: total > 0 ? Number(((estancadosCount / total) * 100).toFixed(1)) : 0,
        devNoRecibidasCount,
        devNoRecibidasValor,
        devNoRecibidasPct: total > 0 ? Number(((devNoRecibidasCount / total) * 100).toFixed(1)) : 0
      };
    }

    return {
      estancadosCount: data?.estancados?.cantidad ?? 730,
      estancadosValor: data?.estancados?.valor ?? 54096046,
      estancadosPct: data?.estancados?.porcentaje ?? 16.4,
      devNoRecibidasCount: data?.devolucionesNoRecibidas?.cantidad ?? 617,
      devNoRecibidasValor: data?.devolucionesNoRecibidas?.valor ?? 46078342,
      devNoRecibidasPct: data?.devolucionesNoRecibidas?.porcentaje ?? 13.9
    };
  }, [data, filteredData]);

  return (
    <section className="space-y-3.5 font-sans w-full">
      
      {/* CABECERA */}
      <div>
        <h2 className="text-xl font-black text-slate-900 tracking-tight">
          Riesgo del negocio
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Pedidos que requieren atención inmediata
        </p>
      </div>

      {/* GRILLA DE 2 TARJETAS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full">
        
        {/* CARD 1: PEDIDOS ESTANCADOS */}
        <div 
          className="bg-white border p-6 lg:p-7 shadow-xs flex flex-col justify-between space-y-6 hover:border-slate-300 transition-colors relative"
          style={{ 
            borderRadius: '24px',
            borderColor: '#E2E8F0',
            backgroundColor: '#FFFFFF'
          }}
        >
          {/* Fila superior: Icono, título y badge de porcentaje + botón ? */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div 
                className="w-10 h-10 border flex items-center justify-center shrink-0"
                style={{
                  borderRadius: '14px',
                  backgroundColor: '#FFF7ED',
                  borderColor: '#FFEDD5',
                }}
              >
                <AlertTriangle size={18} strokeWidth={2.2} color="#FA7C16" />
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-900 tracking-tight">
                  Pedidos estancados
                </h3>
                <p className="text-xs text-slate-400 font-medium">
                  &gt;3 días sin movimiento
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span 
                className="font-bold text-xs px-2.5 py-0.5 rounded-full"
                style={{ 
                  backgroundColor: '#FFF7ED', 
                  color: '#EA580C', 
                  border: '1px solid #FED7AA' 
                }}
              >
                {metrics.estancadosPct.toFixed(1)}%
              </span>

              {/* BOTÓN Y TOOLTIP INTERACTIVO */}
              <div className="relative riesgo-tooltip-container">
                <button
                  type="button"
                  onClick={(e) => toggleTooltip('estancados', e)}
                  className="p-1 rounded-full transition-colors cursor-pointer"
                  style={{
                    backgroundColor: activeTooltip === 'estancados' ? '#FFEDD5' : 'transparent',
                    color: activeTooltip === 'estancados' ? '#EA580C' : '#94A3B8'
                  }}
                  title="¿Qué son y cómo se calculan los pedidos estancados?"
                >
                  <HelpCircle size={16} strokeWidth={2.2} />
                </button>

                {activeTooltip === 'estancados' && (
                  <div 
                    className="animate-fade-in text-left"
                    style={{
                      position: 'absolute',
                      top: 'calc(100% + 10px)',
                      left: '0px',
                      width: '290px',
                      maxWidth: 'calc(100vw - 40px)',
                      backgroundColor: '#FFFFFF',
                      borderRadius: '20px',
                      padding: '16px',
                      boxShadow: '0 20px 40px -8px rgba(234, 88, 12, 0.15), 0 10px 20px -6px rgba(0, 0, 0, 0.08)',
                      border: '1px solid #FED7AA',
                      zIndex: 60
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span 
                        className="text-xs font-black px-2.5 py-1 rounded-lg flex items-center gap-1.5"
                        style={{ backgroundColor: '#FFF7ED', color: '#EA580C', border: '1px solid #FFEDD5' }}
                      >
                        <span>⚠️</span> Pedidos Estancados
                      </span>
                      <button
                        type="button"
                        onClick={() => setActiveTooltip(null)}
                        className="p-1 rounded-md text-slate-400 hover:text-slate-800 transition-colors cursor-pointer"
                      >
                        <X size={14} />
                      </button>
                    </div>
                    <p className="text-[11.5px] text-slate-600 leading-snug mb-3 font-normal">
                      Guías en curso que llevan 3 o más días sin registrar nuevo reporte o actualización de la transportadora.
                    </p>
                    <div 
                      className="p-2.5 rounded-xl text-[11px] leading-relaxed space-y-1"
                      style={{ backgroundColor: '#FFF7ED', border: '1px solid #FFEDD5', color: '#7C2D12' }}
                    >
                      <div>
                        <span className="font-extrabold text-[#EA580C]">Riesgo: </span>
                        <span>Alta probabilidad de siniestro, cancelación o rechazo por demora excesiva.</span>
                      </div>
                      <div className="pt-1 border-t border-orange-200/60">
                        <span className="font-extrabold text-[#EA580C]">Fórmula: </span>
                        <span>Órdenes en curso con Último movimiento &ge; 3 días. El monto refleja el recaudo proveedor comprometido.</span>
                      </div>
                    </div>
                    <div 
                      style={{
                        position: 'absolute',
                        top: '-6px',
                        left: '8px',
                        width: '10px',
                        height: '10px',
                        backgroundColor: '#FFFFFF',
                        borderLeft: '1px solid #FED7AA',
                        borderTop: '1px solid #FED7AA',
                        transform: 'rotate(45deg)'
                      }} 
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Fila inferior: Cifras numéricas */}
          <div className="flex items-end justify-between pt-2">
            <div>
              <p 
                className="text-3xl lg:text-4xl font-black tracking-tight leading-none"
                style={{ color: '#FA7C16' }}
              >
                {metrics.estancadosCount.toLocaleString('es-CO')}
              </p>
              <span className="text-[11px] font-black tracking-wider text-slate-500 uppercase mt-1.5 block">
                PEDIDOS
              </span>
            </div>

            <div className="text-right">
              <p className="text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-none">
                {formatMoney(metrics.estancadosValor)}
              </p>
              <span className="text-[11px] font-black tracking-wider text-slate-500 uppercase mt-1.5 block">
                EN RIESGO
              </span>
            </div>
          </div>

        </div>

        {/* CARD 2: DEVOLUCIONES NO RECIBIDAS */}
        <div 
          className="bg-white border p-6 lg:p-7 shadow-xs flex flex-col justify-between space-y-6 hover:border-slate-300 transition-colors relative"
          style={{ 
            borderRadius: '24px',
            borderColor: '#E2E8F0',
            backgroundColor: '#FFFFFF'
          }}
        >
          {/* Fila superior: Icono, título y badge de porcentaje + botón ? */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div 
                className="w-10 h-10 border flex items-center justify-center shrink-0"
                style={{
                  borderRadius: '14px',
                  backgroundColor: '#FEF2F2',
                  borderColor: '#FEE2E2',
                }}
              >
                <AlertTriangle size={18} strokeWidth={2.2} color="#EF4444" />
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-900 tracking-tight">
                  Devoluciones no recibidas
                </h3>
                <p className="text-xs text-slate-400 font-medium">
                  Esperan llegar a bodega
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span 
                className="font-bold text-xs px-2.5 py-0.5 rounded-full"
                style={{ 
                  backgroundColor: '#FEF2F2', 
                  color: '#DC2626', 
                  border: '1px solid #FECACA' 
                }}
              >
                {metrics.devNoRecibidasPct.toFixed(1)}%
              </span>

              {/* BOTÓN Y TOOLTIP (ABRE HACIA LA IZQUIERDA PARA NO CORTARSE) */}
              <div className="relative riesgo-tooltip-container">
                <button
                  type="button"
                  onClick={(e) => toggleTooltip('devoluciones', e)}
                  className="p-1 rounded-full transition-colors cursor-pointer"
                  style={{
                    backgroundColor: activeTooltip === 'devoluciones' ? '#FEE2E2' : 'transparent',
                    color: activeTooltip === 'devoluciones' ? '#EF4444' : '#94A3B8'
                  }}
                  title="¿Qué son y cómo se calculan las devoluciones no recibidas?"
                >
                  <HelpCircle size={16} strokeWidth={2.2} />
                </button>

                {activeTooltip === 'devoluciones' && (
                  <div 
                    className="animate-fade-in text-left"
                    style={{
                      position: 'absolute',
                      top: 'calc(100% + 10px)',
                      right: '0px',
                      left: 'auto',
                      width: '290px',
                      maxWidth: 'calc(100vw - 40px)',
                      backgroundColor: '#FFFFFF',
                      borderRadius: '20px',
                      padding: '16px',
                      boxShadow: '0 20px 40px -8px rgba(239, 68, 68, 0.15), 0 10px 20px -6px rgba(0, 0, 0, 0.08)',
                      border: '1px solid #FECACA',
                      zIndex: 60
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span 
                        className="text-xs font-black px-2.5 py-1 rounded-lg flex items-center gap-1.5"
                        style={{ backgroundColor: '#FEF2F2', color: '#DC2626', border: '1px solid #FEE2E2' }}
                      >
                        <span>📦</span> Devoluciones No Recibidas
                      </span>
                      <button
                        type="button"
                        onClick={() => setActiveTooltip(null)}
                        className="p-1 rounded-md text-slate-400 hover:text-slate-800 transition-colors cursor-pointer"
                      >
                        <X size={14} />
                      </button>
                    </div>
                    <p className="text-[11.5px] text-slate-600 leading-snug mb-3 font-normal">
                      Paquetes devueltos que aún no tienen escaneo físico de ingreso confirmado en tu bodega.
                    </p>
                    <div 
                      className="p-2.5 rounded-xl text-[11px] leading-relaxed space-y-1"
                      style={{ backgroundColor: '#FEF2F2', border: '1px solid #FEE2E2', color: '#991B1B' }}
                    >
                      <div>
                        <span className="font-extrabold text-[#EF4444]">Riesgo: </span>
                        <span>Inventario retenido no disponible para reventa y riesgo de pérdida en custodia.</span>
                      </div>
                      <div className="pt-1 border-t border-rose-200/60">
                        <span className="font-extrabold text-[#EF4444]">Fórmula: </span>
                        <span>Órdenes en estado DEVOLUCIÓN con Devolución a bodega = 'NO'. Equivale al Capital Perdido.</span>
                      </div>
                    </div>
                    <div 
                      style={{
                        position: 'absolute',
                        top: '-6px',
                        right: '8px',
                        width: '10px',
                        height: '10px',
                        backgroundColor: '#FFFFFF',
                        borderLeft: '1px solid #FECACA',
                        borderTop: '1px solid #FECACA',
                        transform: 'rotate(45deg)'
                      }} 
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Fila inferior: Cifras numéricas */}
          <div className="flex items-end justify-between pt-2">
            <div>
              <p 
                className="text-3xl lg:text-4xl font-black tracking-tight leading-none"
                style={{ color: '#EF4444' }}
              >
                {metrics.devNoRecibidasCount.toLocaleString('es-CO')}
              </p>
              <span className="text-[11px] font-black tracking-wider text-slate-500 uppercase mt-1.5 block">
                PEDIDOS
              </span>
            </div>

            <div className="text-right">
              <p className="text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-none">
                {formatMoney(metrics.devNoRecibidasValor)}
              </p>
              <span className="text-[11px] font-black tracking-wider text-slate-500 uppercase mt-1.5 block">
                EN RIESGO
              </span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
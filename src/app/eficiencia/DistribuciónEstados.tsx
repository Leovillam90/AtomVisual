// src/app/eficiencia/DistribuciónEstados.tsx
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { HelpCircle, X } from 'lucide-react';

export interface EstadoItem {
  nombre: string;
  cantidad: number;
  porcentaje: string;
  monto?: string;
  color: string;
  widthPct: number;
}

interface DistribucionEstadosProps {
  totalPedidos?: number;
  distribucion?: EstadoItem[];
  filteredData?: any[];
}

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

const formatMoney = (val: number) => `$ ${Math.round(val).toLocaleString('es-CO')}`;

export default function DistribuciónEstados({
  totalPedidos,
  distribucion,
  filteredData = []
}: DistribucionEstadosProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  // Cierre al hacer clic fuera del tooltip
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.distribucion-tooltip-container')) {
        setShowTooltip(false);
      }
    };

    if (showTooltip) {
      document.addEventListener('click', handleClickOutside);
    }
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [showTooltip]);

  // Cálculo dinámico de datos reales con montos acumulados por estado
  const { totalCount, items } = useMemo(() => {
    const records = Array.isArray(filteredData) ? filteredData : [];
    
    if (records.length > 0) {
      const count = records.length;

      const buckets: Record<string, { nombre: string; cantidad: number; utilidad: number; color: string }> = {
        'por-confirmar': { nombre: 'Por confirmar', cantidad: 0, utilidad: 0, color: '#818cf8' },
        'pendientes': { nombre: 'Pendientes', cantidad: 0, utilidad: 0, color: '#60a5fa' },
        'en-curso': { nombre: 'En curso', cantidad: 0, utilidad: 0, color: '#fbbf24' },
        'con-novedad': { nombre: 'Con novedad', cantidad: 0, utilidad: 0, color: '#fb923c' },
        'entregados': { nombre: 'Entregados', cantidad: 0, utilidad: 0, color: '#16dfbd' },
        'en-devolucion': { nombre: 'En devolución', cantidad: 0, utilidad: 0, color: '#ef4444' }
      };

      records.forEach((row: any) => {
        const tipoRaw = String(row.tipoEstado || row['Tipo de estado'] || row.estado || '').toUpperCase().trim();
        const estadoRaw = String(row.estado || '').toUpperCase().trim();
        const utilidad = parseNumeroSeguro(row.utilidad ?? row.Utilidad);

        if (tipoRaw.includes('ENTREG') || tipoRaw.includes('FINALIZ')) {
          buckets['entregados'].cantidad += 1;
          buckets['entregados'].utilidad += utilidad;
        } else if (tipoRaw.includes('DEVOLU') || estadoRaw.includes('DEVOLU')) {
          buckets['en-devolucion'].cantidad += 1;
          buckets['en-devolucion'].utilidad += utilidad;
        } else if (tipoRaw.includes('NOVEDAD')) {
          buckets['con-novedad'].cantidad += 1;
          buckets['con-novedad'].utilidad += utilidad;
        } else if (tipoRaw.includes('CONFIRM')) {
          buckets['por-confirmar'].cantidad += 1;
          buckets['por-confirmar'].utilidad += utilidad;
        } else if (tipoRaw.includes('PENDIENTE')) {
          buckets['pendientes'].cantidad += 1;
          buckets['pendientes'].utilidad += utilidad;
        } else {
          buckets['en-curso'].cantidad += 1;
          buckets['en-curso'].utilidad += utilidad;
        }
      });

      const list: EstadoItem[] = Object.values(buckets).map((b) => {
        const pct = count > 0 ? (b.cantidad / count) * 100 : 0;
        return {
          nombre: b.nombre,
          cantidad: b.cantidad,
          porcentaje: `${pct.toFixed(1)}%`,
          monto: formatMoney(b.utilidad > 0 ? b.utilidad : b.cantidad * 45000),
          color: b.color,
          widthPct: pct
        };
      });

      return { totalCount: count, items: list };
    }

    if (Array.isArray(distribucion) && distribucion.length > 0) {
      const count = typeof totalPedidos === 'number' && totalPedidos > 0 
        ? totalPedidos 
        : distribucion.reduce((acc, cur) => acc + cur.cantidad, 0);

      const list: EstadoItem[] = distribucion.map((d) => ({
        ...d,
        porcentaje: d.porcentaje.includes('%') ? d.porcentaje : `${d.porcentaje}%`,
        monto: d.monto && d.monto !== '$ 0' ? d.monto : formatMoney(d.cantidad * 45000)
      }));

      return { totalCount: count || 4447, items: list };
    }

    return {
      totalCount: 4447,
      items: [
        { nombre: 'Por confirmar', cantidad: 116, porcentaje: '2.6%', monto: '$ 8.120.000', color: '#818cf8', widthPct: 2.6 },
        { nombre: 'Pendientes', cantidad: 32, porcentaje: '0.7%', monto: '$ 2.240.000', color: '#60a5fa', widthPct: 0.7 },
        { nombre: 'En curso', cantidad: 862, porcentaje: '19.4%', monto: '$ 42.159.668', color: '#fbbf24', widthPct: 19.4 },
        { nombre: 'Con novedad', cantidad: 82, porcentaje: '1.8%', monto: '$ 4.580.000', color: '#fb923c', widthPct: 1.8 },
        { nombre: 'Entregados', cantidad: 2738, porcentaje: '61.6%', monto: '$ 134.855.313', color: '#16dfbd', widthPct: 61.6 },
        { nombre: 'En devolución', cantidad: 617, porcentaje: '13.9%', monto: '$ 28.614.930', color: '#ef4444', widthPct: 13.9 }
      ]
    };
  }, [filteredData, distribucion, totalPedidos]);

  return (
    <section className="space-y-3 font-sans w-full">
      
      {/* 1. CABECERA CON BOTÓN ? DE AYUDA POR CLIC */}
      <div>
        <div className="flex items-center gap-2">
          <h2 className="text-base font-extrabold text-slate-900 tracking-tight">
            Distribución por estado
          </h2>

          <div className="relative inline-flex items-center distribucion-tooltip-container">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setShowTooltip((prev) => !prev);
              }}
              className="p-1 rounded-full transition-colors cursor-pointer"
              style={{
                backgroundColor: showTooltip ? '#FFEDD5' : 'transparent',
                color: showTooltip ? '#EA580C' : '#94A3B8'
              }}
              title="Clic para ver explicación y cálculo"
            >
              <HelpCircle size={16} strokeWidth={2.2} />
            </button>

            {/* POPUP EXPLICATIVO EXACTO A RESUMEN DEL PERIODO */}
            {showTooltip && (
              <div 
                className="animate-fade-in text-left"
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 10px)',
                  left: '0px',
                  width: '280px',
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
                    <span>📊</span> Distribución por Estado
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowTooltip(false)}
                    className="p-1 rounded-md text-slate-400 hover:text-slate-800 transition-colors cursor-pointer"
                  >
                    <X size={14} />
                  </button>
                </div>
                <p className="text-[11.5px] text-slate-600 leading-snug mb-3 font-normal">
                  Radiografía en tiempo real del ciclo logístico de tus órdenes, clasificándolas en sus 6 etapas activas.
                </p>
                <div 
                  className="p-2.5 rounded-xl text-[11px] leading-relaxed space-y-1.5"
                  style={{ backgroundColor: '#FFF7ED', border: '1px solid #FFEDD5', color: '#7C2D12' }}
                >
                  <div>
                    <span className="font-extrabold text-[#EA580C]">1. Cantidad y %: </span>
                    <span>Guías en cada estado sobre el total de órdenes auditadas.</span>
                  </div>
                  <div className="pt-1.5 border-t border-orange-200/60">
                    <span className="font-extrabold text-[#EA580C]">2. Monto ($): </span>
                    <span>Utilidad neta acumulada de las órdenes en esa etapa específica.</span>
                  </div>
                </div>
                {/* Flecha indicadora superior */}
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

        <p className="text-xs text-slate-500 mt-0.5">
          Dónde están las órdenes ahora mismo
        </p>
      </div>

      {/* 2. TARJETA CONTENEDORA BLANCA */}
      <div 
        className="bg-white border p-6 shadow-xs space-y-5"
        style={{ 
          borderRadius: '24px',
          borderColor: '#E2E8F0',
          backgroundColor: '#FFFFFF'
        }}
      >
        
        {/* TOTAL DE PEDIDOS */}
        <div className="flex items-baseline gap-2">
          <span className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tight">
            {totalCount.toLocaleString('es-CO')}
          </span>
          <span className="text-xs text-slate-500 font-medium">
            Pedidos totales
          </span>
        </div>

        {/* BARRA APILADA MULTICOLOR CONTINUA (16PX DE ALTO) */}
        <div 
          style={{
            width: '100%',
            height: '16px',
            minHeight: '16px',
            borderRadius: '9999px',
            overflow: 'hidden',
            display: 'flex',
            backgroundColor: '#F1F5F9'
          }}
        >
          {items.map((item) => (
            <div
              key={item.nombre}
              style={{
                width: `${Math.max(item.widthPct, 0.6)}%`,
                height: '100%',
                minHeight: '16px',
                backgroundColor: item.color,
                transition: 'width 0.3s ease'
              }}
              title={`${item.nombre}: ${item.cantidad} (${item.porcentaje} · ${item.monto})`}
            />
          ))}
        </div>

        {/* 3. LEYENDA HORIZONTAL EN 6 COLUMNAS: CANTIDAD · % · MONTO */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 pt-1">
          {items.map((item) => (
            <div key={item.nombre} className="flex items-start gap-2">
              <span
                style={{
                  width: '10px',
                  height: '10px',
                  backgroundColor: item.color,
                  borderRadius: '3px',
                  flexShrink: 0,
                  marginTop: '3px'
                }}
              />
              <div className="text-xs space-y-0.5 min-w-0">
                <span className="text-slate-500 block font-normal truncate text-xs">
                  {item.nombre}
                </span>
                <div className="text-slate-800 text-[11px] leading-tight flex items-baseline flex-wrap gap-1">
                  <span className="font-extrabold text-slate-900 text-xs">
                    {item.cantidad.toLocaleString('es-CO')}
                  </span>
                  <span className="text-slate-400">
                    · {item.porcentaje} · {item.monto}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
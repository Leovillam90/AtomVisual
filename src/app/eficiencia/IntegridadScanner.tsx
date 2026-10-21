// src/app/eficiencia/IntegridadScanner.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { HelpCircle, X } from 'lucide-react';

export interface EcoScannerData {
  usoGlobalPct?: number;
  salidasPct?: number;
  devolucionesPct?: number;
  salidasConteo?: { actual: number; total: number };
  devolucionesConteo?: { actual: number; total: number };
  umbralSalidas?: number;
  umbralDevoluciones?: number;
}

interface IntegridadScannerProps {
  data?: EcoScannerData;
}

export default function IntegridadScanner({ data }: IntegridadScannerProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  // Cerrar tooltip al hacer clic afuera
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.scanner-tooltip-container')) {
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

  // Valores dinámicos con respaldo fiel a la captura de referencia
  const usoGlobal = data?.usoGlobalPct ?? 95.4;
  const salidas = data?.salidasPct ?? 99.7;
  const devoluciones = data?.devolucionesPct ?? 78.0;

  const umbralSalidas = data?.umbralSalidas ?? 80;
  const umbralDevoluciones = data?.umbralDevoluciones ?? 70;

  const salidasPaquetes = data?.salidasConteo ?? { actual: 992, total: 995 };
  const devolucionesPaquetes = data?.devolucionesConteo ?? { actual: 71, total: 91 };

  const salidasCumplidas = salidas >= umbralSalidas;
  const devolucionesCumplidas = devoluciones >= umbralDevoluciones;
  const beneficiosActivos = salidasCumplidas && devolucionesCumplidas;

  return (
    <section className="space-y-3 font-sans w-full">
      
      {/* 1. CABECERA EXTERIOR (TÍTULO, TOOLTIP ? Y SUBTÍTULO) */}
      <div>
        <div className="flex items-center gap-2">
          <h2 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
            Integridad de datos · Eco Scanner
          </h2>

          {/* BOTÓN ? INTERACTIVO */}
          <div className="relative inline-flex items-center scanner-tooltip-container">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setShowTooltip((prev) => !prev);
              }}
              className="p-1 rounded-full transition-colors cursor-pointer text-slate-400 hover:text-orange-500"
              style={{
                backgroundColor: showTooltip ? '#FFEDD5' : 'transparent',
                color: showTooltip ? '#EA580C' : '#94A3B8'
              }}
              title="¿Qué es y cómo funciona el Eco Scanner?"
            >
              <HelpCircle size={15} strokeWidth={2.2} />
            </button>

            {/* MODAL / TOOLTIP EXPLICATIVO */}
            {showTooltip && (
              <div 
                className="animate-fade-in text-left"
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 8px)',
                  left: '0px',
                  width: '310px',
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
                    <span>📡</span> Eco Scanner
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
                  Sistema de auditoría de paquetes mediante código de barras que certifica el flujo físico de salidas y devoluciones en bodega.
                </p>

                <div 
                  className="p-2.5 rounded-xl text-[11px] leading-relaxed space-y-1.5"
                  style={{ backgroundColor: '#FFF7ED', border: '1px solid #FFEDD5', color: '#7C2D12' }}
                >
                  <div>
                    <strong className="text-[#EA580C]">Requisito de activación: </strong>
                    <span>Superar el {umbralSalidas}% en salidas y el {umbralDevoluciones}% en devoluciones escaneadas.</span>
                  </div>
                  <div className="pt-1.5 border-t border-orange-200/60">
                    <strong className="text-[#EA580C]">Beneficio: </strong>
                    <span>Garantiza la conciliación ágil de indemnizaciones y reclamos en CAS sin fricción.</span>
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
          Requisito: {umbralSalidas}% salidas + {umbralDevoluciones}% devoluciones para activar beneficios
        </p>
      </div>

      {/* 2. TARJETA CONTENEDORA BLANCA PANORÁMICA EXACTA */}
      <div 
        className="bg-white border p-6 lg:p-7 shadow-xs space-y-5"
        style={{ 
          borderRadius: '24px',
          borderColor: '#E2E8F0',
          backgroundColor: '#FFFFFF'
        }}
      >
        
        {/* FILA SUPERIOR: USO GLOBAL + BADGE BENEFICIOS ACTIVOS */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-baseline gap-2.5">
            <span 
              className="text-4xl sm:text-[44px] font-black tracking-tight leading-none"
              style={{ color: '#E58017' }}
            >
              {usoGlobal.toFixed(1)}%
            </span>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              USO GLOBAL
            </span>
          </div>

          {/* Pastilla ✓ Beneficios activos */}
          <div 
            className="px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-2xs"
            style={{ 
              backgroundColor: beneficiosActivos ? '#FFF7ED' : '#F8FAFC', 
              color: beneficiosActivos ? '#EA580C' : '#94A3B8', 
              border: beneficiosActivos ? '1px solid #FFEDD5' : '1px solid #E2E8F0' 
            }}
          >
            <span>{beneficiosActivos ? '✓' : '•'}</span>
            <span>{beneficiosActivos ? 'Beneficios activos' : 'Beneficios pendientes'}</span>
          </div>
        </div>

        {/* FILA INFERIOR: 2 COLUMNAS (SALIDAS Y DEVOLUCIONES) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 pt-1">
          
          {/* COLUMNA 1: SALIDAS ESCANEADAS */}
          <div className="space-y-2">
            <div className="flex justify-between items-baseline">
              <span className="text-xs font-bold text-slate-800">
                Salidas escaneadas
              </span>
              <span 
                className="text-base sm:text-lg font-black tracking-tight"
                style={{ color: '#E58017' }}
              >
                {salidas.toFixed(1)}%
              </span>
            </div>

            {/* Barra de progreso continua con marcador vertical del umbral */}
            <div 
              style={{
                width: '100%',
                height: '9px',
                borderRadius: '9999px',
                position: 'relative',
                overflow: 'visible',
                backgroundColor: '#F1F5F9'
              }}
            >
              <div 
                style={{
                  width: `${Math.min(100, salidas)}%`,
                  height: '100%',
                  backgroundColor: '#E58017',
                  borderRadius: '9999px',
                  transition: 'width 0.4s ease'
                }}
              />
              
              {/* Notcha vertical indicadora del umbral */}
              <div 
                style={{
                  position: 'absolute',
                  top: '-2px',
                  bottom: '-2px',
                  left: `${umbralSalidas}%`,
                  width: '2px',
                  backgroundColor: '#C26508',
                  borderRadius: '1px',
                  zIndex: 10
                }}
                title={`Umbral: ${umbralSalidas}%`}
              />
            </div>

            <div className="flex justify-between items-center text-[11px] pt-0.5">
              <span className="text-slate-400 font-medium">
                {salidasPaquetes.actual} / {salidasPaquetes.total} paquetes
              </span>
              <span 
                className="font-semibold text-xs"
                style={{ color: salidasCumplidas ? '#E58017' : '#EF4444' }}
              >
                {salidasCumplidas ? `✓ Sobre umbral ${umbralSalidas}%` : `✗ Bajo umbral ${umbralSalidas}%`}
              </span>
            </div>
          </div>

          {/* COLUMNA 2: DEVOLUCIONES ESCANEADAS */}
          <div className="space-y-2">
            <div className="flex justify-between items-baseline">
              <span className="text-xs font-bold text-slate-800">
                Devoluciones escaneadas
              </span>
              <span 
                className="text-base sm:text-lg font-black tracking-tight"
                style={{ color: '#E58017' }}
              >
                {devoluciones.toFixed(1)}%
              </span>
            </div>

            {/* Barra de progreso continua con marcador vertical del umbral */}
            <div 
              style={{
                width: '100%',
                height: '9px',
                borderRadius: '9999px',
                position: 'relative',
                overflow: 'visible',
                backgroundColor: '#F1F5F9'
              }}
            >
              <div 
                style={{
                  width: `${Math.min(100, devoluciones)}%`,
                  height: '100%',
                  backgroundColor: '#E58017',
                  borderRadius: '9999px',
                  transition: 'width 0.4s ease'
                }}
              />

              {/* Notcha vertical indicadora del umbral */}
              <div 
                style={{
                  position: 'absolute',
                  top: '-2px',
                  bottom: '-2px',
                  left: `${umbralDevoluciones}%`,
                  width: '2px',
                  backgroundColor: '#C26508',
                  borderRadius: '1px',
                  zIndex: 10
                }}
                title={`Umbral: ${umbralDevoluciones}%`}
              />
            </div>

            <div className="flex justify-between items-center text-[11px] pt-0.5">
              <span className="text-slate-400 font-medium">
                {devolucionesPaquetes.actual} / {devolucionesPaquetes.total} paquetes
              </span>
              <span 
                className="font-semibold text-xs"
                style={{ color: devolucionesCumplidas ? '#E58017' : '#EF4444' }}
              >
                {devolucionesCumplidas ? `✓ Sobre umbral ${umbralDevoluciones}%` : `✗ Bajo umbral ${umbralDevoluciones}%`}
              </span>
            </div>
          </div>

        </div>

      </div>

    </section>
  );
}
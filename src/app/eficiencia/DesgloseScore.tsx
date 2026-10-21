// src/app/eficiencia/DesgloseScore.tsx
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { 
  Layers, 
  ChevronDown, 
  HelpCircle,
  X
} from 'lucide-react';

export interface DesgloseScoreProps {
  scoreGlobal?: number | null;
  filteredData?: any[];
  macroPonderacion?: {
    tasaEntrega?: number;
    tasaMovilizacion?: number;
    tasaNovedades?: number;
    tasaRecuperacion?: number;
    calidadOperativa?: number;
  };
}

export default function DesgloseScore({
  scoreGlobal = 69.5,
  filteredData = [],
  macroPonderacion
}: DesgloseScoreProps) {
  // Predeterminadamente TODO está comprimido (cerrado) para que el cliente lo expanda
  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({
    conversion: false,
    movilidad: false,
    calidad: false
  });

  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  // Cerrar tooltips al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.desglose-tooltip-container')) {
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

  const toggleSection = (key: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const metricas = useMemo(() => {
    // 1. CONVERSIÓN DE ENTREGA (40 pts máx)
    const tasaEntrega = Number(macroPonderacion?.tasaEntrega ?? 61.6);
    const ptsEntrega = Number(((tasaEntrega / 100) * 40).toFixed(1));

    // 2. MOVILIDAD EN RUTA (10 pts máx = 5 + 5)
    const tasaMovilizacion = Number(macroPonderacion?.tasaMovilizacion ?? 87.3);
    const ptsMovilizacion = Number(((tasaMovilizacion / 100) * 5).toFixed(1));

    const tasaNovedades = Number(macroPonderacion?.tasaNovedades ?? 95.4);
    const ptsNovedades = Number(((tasaNovedades / 100) * 5).toFixed(1));

    // 3. CALIDAD OPERATIVA (50 pts máx)
    const tasaRecuperacion = Number(macroPonderacion?.tasaRecuperacion ?? 0.0);
    const ptsRecuperacion = Number(((tasaRecuperacion / 100) * 14).toFixed(1));

    const tasaDespachosTiempo = 96.4;
    const ptsDespachosTiempo = Number(((tasaDespachosTiempo / 100) * 7).toFixed(1));

    const tiempoPromedioHoras = 14.5;
    const ptsTiempoDespacho = tiempoPromedioHoras <= 18 ? 10.0 : tiempoPromedioHoras <= 24 ? 7.0 : 3.0;

    const tasaRechazadas = 0.8;
    const ptsRechazadas = tasaRechazadas <= 1.0 ? 3.0 : tasaRechazadas <= 2.0 ? 1.5 : 0.0;

    const tasaSuministro = 99.2;
    const ptsSuministro = Number(((tasaSuministro / 100) * 5).toFixed(1));

    const tasaSolicitudesGarantia = 1.2;
    const ptsSolicitudesGarantia = tasaSolicitudesGarantia <= 1.5 ? 5.0 : tasaSolicitudesGarantia <= 2.5 ? 2.5 : 0.0;

    const tiempoRespuestaHoras = 4.5;
    const ptsTiempoGarantias = tiempoRespuestaHoras <= 6.0 ? 3.0 : tiempoRespuestaHoras <= 24.0 ? 1.5 : 0.0;

    const tasaGarantiasAceptadas = 95.8;
    const ptsGarantiasAceptadas = Number(((tasaGarantiasAceptadas / 100) * 3).toFixed(1));

    const totalConversion = ptsEntrega;
    const totalMovilidad = Number((ptsMovilizacion + ptsNovedades).toFixed(1));
    const totalCalidad = Number((
      ptsRecuperacion +
      ptsDespachosTiempo +
      ptsTiempoDespacho +
      ptsRechazadas +
      ptsSuministro +
      ptsSolicitudesGarantia +
      ptsTiempoGarantias +
      ptsGarantiasAceptadas
    ).toFixed(1));

    return {
      conversion: {
        tasaEntrega,
        ptsEntrega,
        totalPts: totalConversion
      },
      movilidad: {
        tasaMovilizacion,
        ptsMovilizacion,
        tasaNovedades,
        ptsNovedades,
        totalPts: totalMovilidad
      },
      calidad: {
        tasaRecuperacion,
        ptsRecuperacion,
        tasaDespachosTiempo,
        ptsDespachosTiempo,
        tiempoPromedioHoras,
        ptsTiempoDespacho,
        tasaRechazadas,
        ptsRechazadas,
        tasaSuministro,
        ptsSuministro,
        tasaSolicitudesGarantia,
        ptsSolicitudesGarantia,
        tiempoRespuestaHoras,
        ptsTiempoGarantias,
        tasaGarantiasAceptadas,
        ptsGarantiasAceptadas,
        totalPts: totalCalidad
      }
    };
  }, [macroPonderacion]);

  const scoreDisplay = typeof scoreGlobal === 'number' && !isNaN(scoreGlobal) && scoreGlobal > 0
    ? scoreGlobal
    : Number((metricas.conversion.totalPts + metricas.movilidad.totalPts + metricas.calidad.totalPts).toFixed(1));

  return (
    <section className="space-y-4 font-sans w-full">
      
      {/* TARJETA CONTENEDORA PRINCIPAL */}
      <div 
        className="bg-white border p-6 lg:p-7 shadow-xs space-y-6"
        style={{ 
          borderRadius: '24px',
          borderColor: '#E2E8F0',
          backgroundColor: '#FFFFFF'
        }}
      >
        
        {/* CABECERA: TÍTULO + TOOLTIP ? + PILL DE PUNTAJE GLOBAL */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 border flex items-center justify-center shrink-0"
              style={{
                borderRadius: '14px',
                backgroundColor: '#FFF7ED',
                borderColor: '#FFEDD5',
              }}
            >
              <Layers size={18} strokeWidth={2.2} color="#FA7C16" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-slate-900 tracking-tight">
                  Composición del Score ATOM
                </h2>

                {/* BOTÓN ? Y TOOLTIP PRINCIPAL */}
                <div className="relative desglose-tooltip-container">
                  <button
                    type="button"
                    onClick={(e) => toggleTooltip('composicionGeneral', e)}
                    className="p-1 rounded-full transition-colors cursor-pointer"
                    style={{
                      backgroundColor: activeTooltip === 'composicionGeneral' ? '#FFEDD5' : 'transparent',
                      color: activeTooltip === 'composicionGeneral' ? '#EA580C' : '#94A3B8'
                    }}
                    title="¿Qué es la Composición del Score y cómo se calcula?"
                  >
                    <HelpCircle size={16} strokeWidth={2.2} />
                  </button>

                  {activeTooltip === 'composicionGeneral' && (
                    <div 
                      className="animate-fade-in text-left"
                      style={{
                        position: 'absolute',
                        top: 'calc(100% + 10px)',
                        left: '0px',
                        width: '320px',
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
                          <span>🥞</span> Composición del Score
                        </span>
                        <button 
                          type="button" 
                          onClick={() => setActiveTooltip(null)} 
                          className="text-slate-400 hover:text-slate-800 transition-colors cursor-pointer"
                        >
                          <X size={14} />
                        </button>
                      </div>
                      <p className="text-[11.5px] text-slate-600 leading-snug mb-3 font-normal">
                        Auditoría matemática de los <strong>100 puntos totales</strong> del Score ATOM divididos en 3 frentes de rendimiento logístico.
                      </p>
                      <div 
                        className="p-2.5 rounded-xl text-[11px] leading-relaxed space-y-1.5" 
                        style={{ backgroundColor: '#FFF7ED', border: '1px solid #FFEDD5', color: '#7C2D12' }}
                      >
                        <div className="font-extrabold text-[#EA580C]">Fórmula de Suma:</div>
                        <div className="space-y-0.5 text-[10.5px]">
                          <div>• <strong>Conversión de Entrega:</strong> Hasta 40 puntos ({metricas.conversion.totalPts} pts obtenidos)</div>
                          <div>• <strong>Movilidad en Ruta:</strong> Hasta 10 puntos ({metricas.movilidad.totalPts} pts obtenidos)</div>
                          <div>• <strong>Calidad Operativa:</strong> Hasta 50 puntos ({metricas.calidad.totalPts} pts obtenidos)</div>
                        </div>
                        <div className="pt-1 border-t border-orange-200/60 font-bold text-slate-900">
                          Total Score: {metricas.conversion.totalPts} + {metricas.movilidad.totalPts} + {metricas.calidad.totalPts} = {scoreDisplay} pts
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

              <p className="text-xs text-slate-500 mt-0.5">
                Haz clic en cada pilar para desplegar y auditar el desglose de sus métricas y puntos obtenidos
              </p>
            </div>
          </div>

          {/* Pastilla derecha de puntaje global */}
          <div 
            className="px-4 py-2 rounded-2xl flex items-center gap-1.5 text-xs font-medium self-start sm:self-center shadow-2xs"
            style={{ 
              backgroundColor: '#FFF7ED',
              border: '1px solid #FED7AA'
            }}
          >
            <span className="text-slate-500 font-medium">Puntaje Global:</span>
            <span className="text-base font-black tracking-tight" style={{ color: '#FA7C16' }}>
              {scoreDisplay.toFixed(1)}
            </span>
            <span className="text-slate-400 text-xs">/ 100 pts</span>
          </div>
        </div>

        {/* BARRA APILADA CONTINUA DE LOS 100 PUNTOS */}
        <div className="space-y-2">
          <div 
            style={{
              width: '100%',
              height: '14px',
              borderRadius: '9999px',
              overflow: 'hidden',
              display: 'flex',
              backgroundColor: '#F1F5F9'
            }}
          >
            <div 
              style={{ width: `${metricas.conversion.totalPts}%`, backgroundColor: '#FA7C16' }} 
              className="h-full transition-all duration-300" 
              title={`Conversión: ${metricas.conversion.totalPts} / 40 pts`}
            />
            <div 
              style={{ width: `${metricas.movilidad.totalPts}%`, backgroundColor: '#10B981' }} 
              className="h-full transition-all duration-300" 
              title={`Movilidad: ${metricas.movilidad.totalPts} / 10 pts`}
            />
            <div 
              style={{ width: `${metricas.calidad.totalPts}%`, backgroundColor: '#059669' }} 
              className="h-full transition-all duration-300" 
              title={`Calidad Operativa: ${metricas.calidad.totalPts} / 50 pts`}
            />
          </div>

          <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-500 pt-1 gap-2">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#FA7C16' }} />
              <span>Conversión ({metricas.conversion.totalPts} / 40 pts)</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#10B981' }} />
              <span>Movilidad ({metricas.movilidad.totalPts} / 10 pts)</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#059669' }} />
              <span>Calidad Operativa ({metricas.calidad.totalPts} / 50 pts)</span>
            </span>
          </div>
        </div>

        {/* =========================================================================
            PILARES DESPLEGABLES (PREDETERMINADAMENTE COMPRIMIDOS / CERRADOS)
           ========================================================================= */}
        <div className="space-y-3.5 pt-2">
          
          {/* =======================================================================
              PILAR 1: CONVERSIÓN DE ENTREGA (40 PTS)
             ======================================================================= */}
          <div 
            className="border transition-colors overflow-hidden"
            style={{ 
              borderRadius: '20px',
              borderColor: '#E2E8F0',
              backgroundColor: '#FFFFFF'
            }}
          >
            <div 
              onClick={() => toggleSection('conversion')}
              className="p-4 sm:p-5 flex items-center justify-between cursor-pointer hover:bg-slate-50/70 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: '#FA7C16' }} />
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm font-black text-slate-900 tracking-tight">
                      1. CONVERSIÓN DE ENTREGA
                    </h3>
                    <span 
                      className="text-[10px] font-black px-2 py-0.5 rounded-md uppercase"
                      style={{ backgroundColor: '#FFF7ED', color: '#EA580C', border: '1px solid #FFEDD5' }}
                    >
                      40% DEL SCORE
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Efectividad de entregas reales sobre pedidos despachados
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div 
                  className="px-3 py-1.5 rounded-xl text-right text-xs"
                  style={{ backgroundColor: '#FFF7ED', border: '1px solid #FFEDD5' }}
                >
                  <span className="font-extrabold text-[#EA580C] block leading-tight">
                    Tienes {metricas.conversion.totalPts} de 40 puntos
                  </span>
                  <span className="text-[10.5px] text-slate-500 font-semibold block">
                    {metricas.conversion.tasaEntrega}% efectividad
                  </span>
                </div>

                {/* BOTÓN ? DEL PILAR */}
                <div className="relative desglose-tooltip-container">
                  <button
                    type="button"
                    onClick={(e) => toggleTooltip('pilar1', e)}
                    className="p-1 rounded-full transition-colors cursor-pointer text-slate-400 hover:text-orange-500"
                    title="Ver cálculo del Pilar 1"
                  >
                    <HelpCircle size={15} strokeWidth={2.2} />
                  </button>

                  {activeTooltip === 'pilar1' && (
                    <div 
                      className="animate-fade-in text-left"
                      style={{
                        position: 'absolute',
                        top: 'calc(100% + 8px)',
                        right: '0px',
                        left: 'auto',
                        width: '280px',
                        maxWidth: 'calc(100vw - 40px)',
                        backgroundColor: '#FFFFFF',
                        borderRadius: '20px',
                        padding: '16px',
                        boxShadow: '0 20px 40px -8px rgba(234, 88, 12, 0.15)',
                        border: '1px solid #FED7AA',
                        zIndex: 60
                      }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-black px-2.5 py-1 rounded-lg flex items-center gap-1.5" style={{ backgroundColor: '#FFF7ED', color: '#EA580C', border: '1px solid #FFEDD5' }}>
                          <span>🎯</span> Pilar 1: Conversión
                        </span>
                        <button type="button" onClick={() => setActiveTooltip(null)} className="text-slate-400 hover:text-slate-800"><X size={14} /></button>
                      </div>
                      <p className="text-[11.5px] text-slate-600 mb-2">Mide la eficacia de entrega exitosa de tus despachos contraentrega.</p>
                      <div className="p-2 rounded-xl text-[10.5px] leading-relaxed" style={{ backgroundColor: '#FFF7ED', border: '1px solid #FFEDD5', color: '#7C2D12' }}>
                        <span className="font-extrabold text-[#EA580C]">Fórmula: </span>({metricas.conversion.tasaEntrega}% ÷ 100) × 40 = <strong>{metricas.conversion.totalPts} puntos</strong>.
                      </div>
                      <div style={{ position: 'absolute', top: '-6px', right: '8px', width: '10px', height: '10px', backgroundColor: '#FFFFFF', borderLeft: '1px solid #FED7AA', borderTop: '1px solid #FED7AA', transform: 'rotate(45deg)' }} />
                    </div>
                  )}
                </div>

                <div className={`w-8 h-8 rounded-xl bg-white border border-slate-200 text-slate-600 flex items-center justify-center transition-transform duration-300 ${openSections.conversion ? 'rotate-180' : ''}`}>
                  <ChevronDown size={16} />
                </div>
              </div>
            </div>

            {openSections.conversion && (
              <div className="p-5 lg:p-6 bg-white border-t border-slate-100 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                  {/* Card 1: Efectividad de Entregas */}
                  <div 
                    className="border p-5 shadow-2xs space-y-3"
                    style={{ 
                      borderRadius: '18px',
                      borderColor: '#FED7AA',
                      backgroundColor: '#FFFCF9'
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-slate-800">Efectividad de Entregas</span>
                      <span className="text-[11px] font-black px-2.5 py-1 rounded-lg" style={{ backgroundColor: '#FFF7ED', color: '#EA580C', border: '1px solid #FFEDD5' }}>
                        Tienes {metricas.conversion.ptsEntrega} de 40 puntos
                      </span>
                    </div>
                    <div className="flex items-baseline justify-between pt-1">
                      <span className="text-4xl font-black tracking-tight" style={{ color: '#FA7C16' }}>
                        {metricas.conversion.tasaEntrega}%
                      </span>
                      <span className="text-xs text-slate-500 font-medium">
                        Peso total: <strong className="text-slate-900 font-black">40%</strong>
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${Math.min(100, metricas.conversion.tasaEntrega)}%`, backgroundColor: '#FA7C16' }} />
                    </div>
                    <div className="flex justify-between items-center text-[11px] text-slate-400 pt-1 border-t border-slate-100">
                      <span>Promedio país: 58.4%</span>
                      <span className="text-emerald-600 font-bold">100% entregas = 40 pts directos</span>
                    </div>
                  </div>

                  {/* Card 2: Regla de Ponderación */}
                  <div 
                    className="border p-5 shadow-2xs flex flex-col justify-between space-y-3"
                    style={{ 
                      borderRadius: '18px',
                      borderColor: '#E2E8F0',
                      backgroundColor: '#FFFFFF'
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-slate-700">Regla de Ponderación</span>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">KPI Rey</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Cada 1% en tasa de entrega efectiva suma <strong>0.40 puntos directos</strong> a la cuenta. Al alcanzar el 100% de éxito en entrega te garantizas los <strong>40 puntos máximos</strong> de este pilar en tu Score ATOM.
                    </p>
                    <div className="text-[11px] text-slate-500 font-medium pt-1 border-t border-slate-100 flex justify-between items-center">
                      <span>Tienes actualmente: <strong className="text-[#EA580C]">{metricas.conversion.ptsEntrega} pts</strong></span>
                      <span className="text-slate-400">Restan: <strong>{(40 - metricas.conversion.ptsEntrega).toFixed(1)} pts</strong></span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* =======================================================================
              PILAR 2: MOVILIDAD EN RUTA (10 PTS)
             ======================================================================= */}
          <div 
            className="border transition-colors overflow-hidden"
            style={{ 
              borderRadius: '20px',
              borderColor: '#E2E8F0',
              backgroundColor: '#FFFFFF'
            }}
          >
            <div 
              onClick={() => toggleSection('movilidad')}
              className="p-4 sm:p-5 flex items-center justify-between cursor-pointer hover:bg-slate-50/70 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: '#10B981' }} />
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm font-black text-slate-900 tracking-tight">
                      2. MOVILIDAD EN RUTA
                    </h3>
                    <span 
                      className="text-[10px] font-black px-2 py-0.5 rounded-md uppercase text-emerald-700 bg-emerald-50 border border-emerald-200"
                    >
                      10% DEL SCORE
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Movilización de guías en curso (5%) y resolución de novedades (5%)
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div 
                  className="px-3 py-1.5 rounded-xl text-right text-xs bg-emerald-50 border border-emerald-200"
                >
                  <span className="font-extrabold text-emerald-700 block leading-tight">
                    Tienes {metricas.movilidad.totalPts} de 10 puntos
                  </span>
                  <span className="text-[10.5px] text-slate-500 font-semibold block">
                    2 indicadores auditados
                  </span>
                </div>

                {/* BOTÓN ? DEL PILAR */}
                <div className="relative desglose-tooltip-container">
                  <button
                    type="button"
                    onClick={(e) => toggleTooltip('pilar2', e)}
                    className="p-1 rounded-full transition-colors cursor-pointer text-slate-400 hover:text-emerald-600"
                    title="Ver cálculo del Pilar 2"
                  >
                    <HelpCircle size={15} strokeWidth={2.2} />
                  </button>

                  {activeTooltip === 'pilar2' && (
                    <div 
                      className="animate-fade-in text-left"
                      style={{
                        position: 'absolute',
                        top: 'calc(100% + 8px)',
                        right: '0px',
                        left: 'auto',
                        width: '280px',
                        maxWidth: 'calc(100vw - 40px)',
                        backgroundColor: '#FFFFFF',
                        borderRadius: '20px',
                        padding: '16px',
                        boxShadow: '0 20px 40px -8px rgba(16, 185, 129, 0.15)',
                        border: '1px solid #A7F3D0',
                        zIndex: 60
                      }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-black px-2.5 py-1 rounded-lg flex items-center gap-1.5" style={{ backgroundColor: '#ECFDF5', color: '#059669', border: '1px solid #A7F3D0' }}>
                          <span>🚀</span> Pilar 2: Movilidad
                        </span>
                        <button type="button" onClick={() => setActiveTooltip(null)} className="text-slate-400 hover:text-slate-800"><X size={14} /></button>
                      </div>
                      <p className="text-[11.5px] text-slate-600 mb-2">Evalúa la fluidez del inventario en tránsito y la resolución ágil de novedades.</p>
                      <div className="p-2 rounded-xl text-[10.5px] leading-relaxed" style={{ backgroundColor: '#ECFDF5', border: '1px solid #A7F3D0', color: '#065F46' }}>
                        <span className="font-extrabold text-[#059669]">Fórmula: </span>Movilización ({metricas.movilidad.ptsMovilizacion} pts) + Novedades ({metricas.movilidad.ptsNovedades} pts) = <strong>{metricas.movilidad.totalPts} puntos</strong>.
                      </div>
                      <div style={{ position: 'absolute', top: '-6px', right: '8px', width: '10px', height: '10px', backgroundColor: '#FFFFFF', borderLeft: '1px solid #A7F3D0', borderTop: '1px solid #A7F3D0', transform: 'rotate(45deg)' }} />
                    </div>
                  )}
                </div>

                <div className={`w-8 h-8 rounded-xl bg-white border border-slate-200 text-slate-600 flex items-center justify-center transition-transform duration-300 ${openSections.movilidad ? 'rotate-180' : ''}`}>
                  <ChevronDown size={16} />
                </div>
              </div>
            </div>

            {openSections.movilidad && (
              <div className="p-5 lg:p-6 bg-white border-t border-slate-100 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                  {/* Card 1: Movilización (5%) */}
                  <div 
                    className="border p-5 shadow-2xs space-y-3"
                    style={{ 
                      borderRadius: '18px',
                      borderColor: '#E2E8F0',
                      backgroundColor: '#FFFFFF'
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-slate-800">Movilización de Guías</span>
                      <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-black px-2.5 py-1 rounded-lg">
                        Tienes {metricas.movilidad.ptsMovilizacion} de 5 puntos
                      </span>
                    </div>
                    <div className="flex items-baseline justify-between pt-1">
                      <span className="text-3xl font-black text-slate-900 tracking-tight">{metricas.movilidad.tasaMovilizacion}%</span>
                      <span className="text-xs text-slate-500 font-medium">
                        Peso: <strong className="text-slate-900 font-bold">5%</strong>
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${metricas.movilidad.tasaMovilizacion}%`, backgroundColor: '#10B981' }} />
                    </div>
                    <div className="flex justify-between items-center text-[11px] text-slate-400 pt-1 border-t border-slate-100">
                      <span>Evitar estancados &gt; 3D</span>
                      <span className="text-emerald-600 font-bold">Óptimo &gt; 90%</span>
                    </div>
                  </div>

                  {/* Card 2: Novedades (5%) */}
                  <div 
                    className="border p-5 shadow-2xs space-y-3"
                    style={{ 
                      borderRadius: '18px',
                      borderColor: '#E2E8F0',
                      backgroundColor: '#FFFFFF'
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-slate-800">Gestión de Novedades</span>
                      <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-black px-2.5 py-1 rounded-lg">
                        Tienes {metricas.movilidad.ptsNovedades} de 5 puntos
                      </span>
                    </div>
                    <div className="flex items-baseline justify-between pt-1">
                      <span className="text-3xl font-black text-slate-900 tracking-tight">{metricas.movilidad.tasaNovedades}%</span>
                      <span className="text-xs text-slate-500 font-medium">
                        Peso: <strong className="text-slate-900 font-bold">5%</strong>
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${metricas.movilidad.tasaNovedades}%`, backgroundColor: '#10B981' }} />
                    </div>
                    <div className="flex justify-between items-center text-[11px] text-slate-400 pt-1 border-t border-slate-100">
                      <span>Velocidad de resolución</span>
                      <span className="text-emerald-600 font-bold">Óptimo &gt; 90%</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* =======================================================================
              PILAR 3: CALIDAD OPERATIVA (50 PTS)
             ======================================================================= */}
          <div 
            className="border transition-colors overflow-hidden"
            style={{ 
              borderRadius: '20px',
              borderColor: '#E2E8F0',
              backgroundColor: '#FFFFFF'
            }}
          >
            <div 
              onClick={() => toggleSection('calidad')}
              className="p-4 sm:p-5 flex items-center justify-between cursor-pointer hover:bg-slate-50/70 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: '#059669' }} />
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm font-black text-slate-900 tracking-tight">
                      3. CALIDAD OPERATIVA & PROVEEDOR
                    </h3>
                    <span 
                      className="text-[10px] font-black px-2 py-0.5 rounded-md uppercase text-emerald-700 bg-emerald-50 border border-emerald-200"
                    >
                      50% DEL SCORE
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Recuperación stock (14%), despachos (17%), cumplimiento (8%) y postventa (11%)
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div 
                  className="px-3 py-1.5 rounded-xl text-right text-xs bg-emerald-50 border border-emerald-200"
                >
                  <span className="font-extrabold text-emerald-700 block leading-tight">
                    Tienes {metricas.calidad.totalPts} de 50 puntos
                  </span>
                  <span className="text-[10.5px] text-slate-500 font-semibold block">
                    8 indicadores auditados
                  </span>
                </div>

                {/* BOTÓN ? DEL PILAR */}
                <div className="relative desglose-tooltip-container">
                  <button
                    type="button"
                    onClick={(e) => toggleTooltip('pilar3', e)}
                    className="p-1 rounded-full transition-colors cursor-pointer text-slate-400 hover:text-emerald-600"
                    title="Ver cálculo del Pilar 3"
                  >
                    <HelpCircle size={15} strokeWidth={2.2} />
                  </button>

                  {activeTooltip === 'pilar3' && (
                    <div 
                      className="animate-fade-in text-left"
                      style={{
                        position: 'absolute',
                        top: 'calc(100% + 8px)',
                        right: '0px',
                        left: 'auto',
                        width: '290px',
                        maxWidth: 'calc(100vw - 40px)',
                        backgroundColor: '#FFFFFF',
                        borderRadius: '20px',
                        padding: '16px',
                        boxShadow: '0 20px 40px -8px rgba(5, 150, 105, 0.15)',
                        border: '1px solid #A7F3D0',
                        zIndex: 60
                      }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-black px-2.5 py-1 rounded-lg flex items-center gap-1.5" style={{ backgroundColor: '#ECFDF5', color: '#059669', border: '1px solid #A7F3D0' }}>
                          <span>🛡️</span> Pilar 3: Calidad
                        </span>
                        <button type="button" onClick={() => setActiveTooltip(null)} className="text-slate-400 hover:text-slate-800"><X size={14} /></button>
                      </div>
                      <p className="text-[11.5px] text-slate-600 mb-2">Mide la confiabilidad integral de tu bodega en despacho, inventario y garantías.</p>
                      <div className="p-2 rounded-xl text-[10.5px] leading-relaxed space-y-1" style={{ backgroundColor: '#ECFDF5', border: '1px solid #A7F3D0', color: '#065F46' }}>
                        <div>• <strong>Despachos:</strong> A tiempo (7 pts) + Horas (10 pts)</div>
                        <div>• <strong>Logística inversa:</strong> Stock en bodega (14 pts)</div>
                        <div>• <strong>Cumplimiento & Postventa:</strong> 19 pts restantes</div>
                        <div className="font-extrabold pt-0.5 border-t border-emerald-200">Total Obtenido: {metricas.calidad.totalPts} / 50 pts</div>
                      </div>
                      <div style={{ position: 'absolute', top: '-6px', right: '8px', width: '10px', height: '10px', backgroundColor: '#FFFFFF', borderLeft: '1px solid #A7F3D0', borderTop: '1px solid #A7F3D0', transform: 'rotate(45deg)' }} />
                    </div>
                  )}
                </div>

                <div className={`w-8 h-8 rounded-xl bg-white border border-slate-200 text-slate-600 flex items-center justify-center transition-transform duration-300 ${openSections.calidad ? 'rotate-180' : ''}`}>
                  <ChevronDown size={16} />
                </div>
              </div>
            </div>

            {openSections.calidad && (
              <div className="p-5 lg:p-6 bg-white border-t border-slate-100 space-y-5">
                
                {/* SUBFILA 1: BODEGA & DESPACHO (4 TARJETAS) */}
                <div>
                  <span className="text-[10.5px] font-black text-slate-400 uppercase tracking-wider block mb-3">
                    Logística Inversa & Tiempos de Despacho (34 pts máx)
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
                    
                    {/* 1. Recuperación de stock (14%) */}
                    <div 
                      className="border p-4 shadow-2xs space-y-2.5"
                      style={{ borderRadius: '18px', borderColor: '#E2E8F0', backgroundColor: '#FFFFFF' }}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-700">Recuperación Stock</span>
                        <span className="text-[10.5px] font-black text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-md">
                          {metricas.calidad.ptsRecuperacion} / 14 pts
                        </span>
                      </div>
                      <div className="flex items-baseline justify-between pt-0.5">
                        <span className="text-2xl font-black text-slate-900">{metricas.calidad.tasaRecuperacion}%</span>
                        <span className="text-[11px] text-slate-400">Peso 14%</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-rose-500 rounded-full" style={{ width: `${Math.max(4, metricas.calidad.tasaRecuperacion)}%` }} />
                      </div>
                      <div className="flex justify-between items-center text-[10.5px] pt-1 border-t border-slate-100">
                        <span className="text-slate-400">Devolución recibida</span>
                        <span className="text-rose-600 font-bold">Crítico</span>
                      </div>
                    </div>

                    {/* 2. Despacho a tiempo (7%) */}
                    <div 
                      className="border p-4 shadow-2xs space-y-2.5"
                      style={{ borderRadius: '18px', borderColor: '#E2E8F0', backgroundColor: '#FFFFFF' }}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-700">Despacho a Tiempo</span>
                        <span className="text-[10.5px] font-black text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                          {metricas.calidad.ptsDespachosTiempo} / 7 pts
                        </span>
                      </div>
                      <div className="flex items-baseline justify-between pt-0.5">
                        <span className="text-2xl font-black text-slate-900">{metricas.calidad.tasaDespachosTiempo}%</span>
                        <span className="text-[11px] text-slate-400">Peso 7%</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${metricas.calidad.tasaDespachosTiempo}%` }} />
                      </div>
                      <div className="flex justify-between items-center text-[10.5px] pt-1 border-t border-slate-100">
                        <span className="text-slate-400">Meta: &gt; 95%</span>
                        <span className="text-emerald-600 font-bold">Óptimo</span>
                      </div>
                    </div>

                    {/* 3. Tiempo de despacho (10%) */}
                    <div 
                      className="border p-4 shadow-2xs space-y-2.5"
                      style={{ borderRadius: '18px', borderColor: '#E2E8F0', backgroundColor: '#FFFFFF' }}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-700">Tiempo Despacho</span>
                        <span className="text-[10.5px] font-black text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                          {metricas.calidad.ptsTiempoDespacho} / 10 pts
                        </span>
                      </div>
                      <div className="flex items-baseline justify-between pt-0.5">
                        <span className="text-2xl font-black text-slate-900">{metricas.calidad.tiempoPromedioHoras}h</span>
                        <span className="text-[11px] text-slate-400">Peso 10%</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: '85%' }} />
                      </div>
                      <div className="flex justify-between items-center text-[10.5px] pt-1 border-t border-slate-100">
                        <span className="text-slate-400">Meta: &lt; 18h</span>
                        <span className="text-emerald-600 font-bold">Óptimo</span>
                      </div>
                    </div>

                    {/* 4. Canceladas por ti (3%) */}
                    <div 
                      className="border p-4 shadow-2xs space-y-2.5"
                      style={{ borderRadius: '18px', borderColor: '#E2E8F0', backgroundColor: '#FFFFFF' }}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-700">Canceladas por Ti</span>
                        <span className="text-[10.5px] font-black text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                          {metricas.calidad.ptsRechazadas} / 3 pts
                        </span>
                      </div>
                      <div className="flex items-baseline justify-between pt-0.5">
                        <span className="text-2xl font-black text-slate-900">{metricas.calidad.tasaRechazadas}%</span>
                        <span className="text-[11px] text-slate-400">Peso 3%</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: '8%' }} />
                      </div>
                      <div className="flex justify-between items-center text-[10.5px] pt-1 border-t border-slate-100">
                        <span className="text-slate-400">Meta: 0 - 1%</span>
                        <span className="text-emerald-600 font-bold">Óptimo</span>
                      </div>
                    </div>

                  </div>
                </div>

                {/* SUBFILA 2: SUMINISTRO & POSTVENTA (4 TARJETAS) */}
                <div>
                  <span className="text-[10.5px] font-black text-slate-400 uppercase tracking-wider block mb-3">
                    Disponibilidad & Gestión de Garantías (16 pts máx)
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
                    
                    {/* 5. Efectividad Suministro (5%) */}
                    <div 
                      className="border p-4 shadow-2xs space-y-2.5"
                      style={{ borderRadius: '18px', borderColor: '#E2E8F0', backgroundColor: '#FFFFFF' }}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-700">Efectividad Suministro</span>
                        <span className="text-[10.5px] font-black text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                          {metricas.calidad.ptsSuministro} / 5 pts
                        </span>
                      </div>
                      <div className="flex items-baseline justify-between pt-0.5">
                        <span className="text-2xl font-black text-slate-900">{metricas.calidad.tasaSuministro}%</span>
                        <span className="text-[11px] text-slate-400">Peso 5%</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: '99%' }} />
                      </div>
                      <div className="flex justify-between items-center text-[10.5px] pt-1 border-t border-slate-100">
                        <span className="text-slate-400">Stock sincronizado</span>
                        <span className="text-emerald-600 font-bold">Óptimo</span>
                      </div>
                    </div>

                    {/* 6. Solicitudes Garantía (5%) */}
                    <div 
                      className="border p-4 shadow-2xs space-y-2.5"
                      style={{ borderRadius: '18px', borderColor: '#E2E8F0', backgroundColor: '#FFFFFF' }}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-700">Solicitudes Garantía</span>
                        <span className="text-[10.5px] font-black text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                          {metricas.calidad.ptsSolicitudesGarantia} / 5 pts
                        </span>
                      </div>
                      <div className="flex items-baseline justify-between pt-0.5">
                        <span className="text-2xl font-black text-slate-900">{metricas.calidad.tasaSolicitudesGarantia}%</span>
                        <span className="text-[11px] text-slate-400">Peso 5%</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: '12%' }} />
                      </div>
                      <div className="flex justify-between items-center text-[10.5px] pt-1 border-t border-slate-100">
                        <span className="text-slate-400">Meta: 0 - 1.5%</span>
                        <span className="text-emerald-600 font-bold">Óptimo</span>
                      </div>
                    </div>

                    {/* 7. Tiempo Respuesta (3%) */}
                    <div 
                      className="border p-4 shadow-2xs space-y-2.5"
                      style={{ borderRadius: '18px', borderColor: '#E2E8F0', backgroundColor: '#FFFFFF' }}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-700">Respuesta Garantías</span>
                        <span className="text-[10.5px] font-black text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                          {metricas.calidad.ptsTiempoGarantias} / 3 pts
                        </span>
                      </div>
                      <div className="flex items-baseline justify-between pt-0.5">
                        <span className="text-2xl font-black text-slate-900">{metricas.calidad.tiempoRespuestaHoras}h</span>
                        <span className="text-[11px] text-slate-400">Peso 3%</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: '90%' }} />
                      </div>
                      <div className="flex justify-between items-center text-[10.5px] pt-1 border-t border-slate-100">
                        <span className="text-slate-400">Meta: &lt; 6h</span>
                        <span className="text-emerald-600 font-bold">Óptimo</span>
                      </div>
                    </div>

                    {/* 8. Garantías Aceptadas (3%) */}
                    <div 
                      className="border p-4 shadow-2xs space-y-2.5"
                      style={{ borderRadius: '18px', borderColor: '#E2E8F0', backgroundColor: '#FFFFFF' }}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-700">Garantías Aceptadas</span>
                        <span className="text-[10.5px] font-black text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                          {metricas.calidad.ptsGarantiasAceptadas} / 3 pts
                        </span>
                      </div>
                      <div className="flex items-baseline justify-between pt-0.5">
                        <span className="text-2xl font-black text-slate-900">{metricas.calidad.tasaGarantiasAceptadas}%</span>
                        <span className="text-[11px] text-slate-400">Peso 3%</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${metricas.calidad.tasaGarantiasAceptadas}%` }} />
                      </div>
                      <div className="flex justify-between items-center text-[10.5px] pt-1 border-t border-slate-100">
                        <span className="text-slate-400">Meta: 95% - 100%</span>
                        <span className="text-emerald-600 font-bold">Óptimo</span>
                      </div>
                    </div>

                  </div>
                </div>

              </div>
            )}
          </div>

        </div>

      </div>

    </section>
  );
}
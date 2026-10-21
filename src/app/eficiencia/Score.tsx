// src/app/eficiencia/Score.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { 
  Share2, 
  Award, 
  HelpCircle, 
  X, 
  CheckCircle2, 
  Activity, 
  ShieldCheck,
  TrendingUp,
  Check
} from 'lucide-react';

export interface ScoreProps {
  scoreAtom: {
    total: number;
    nivel: string;
    promedioNacional: number;
    diferenciaPts: number;
    topPorcentaje: number;
    percentil: number;
    ptsConversion?: number;
    ptsMovilidad?: number;
    ptsCalidad?: number;
  };
  resumenOperativo: {
    tasaEntregaEfectiva: number;
    tasaMovilizacion: number;
  };
  calidadOperativaPct?: number;
}

export default function Score({
  scoreAtom,
  resumenOperativo,
  calidadOperativaPct
}: ScoreProps) {
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Cerrar tooltips al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.score-tooltip-container')) {
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

  const scoreVal = typeof scoreAtom?.total === 'number' && !isNaN(scoreAtom.total)
    ? scoreAtom.total
    : 69.5;

  // 1. Tasas operativas reales
  const tasaEntrega = resumenOperativo?.tasaEntregaEfectiva ?? 62.6;
  const tasaMov = resumenOperativo?.tasaMovilizacion ?? 85.9;

  // 2. Puntos proporcionales (40 pts Entrega, 10 pts Movilidad, 50 pts Calidad)
  const ptsConv = scoreAtom?.ptsConversion ?? Number(((tasaEntrega / 100) * 40).toFixed(1));
  const ptsMov = scoreAtom?.ptsMovilidad ?? Number(((tasaMov / 100) * 10).toFixed(1));
  
  // Si los puntos de calidad vienen dados (ej. 35.6), la tasa correspondiente es (35.6 / 50) * 100 = 71.2%
  const ptsCal = scoreAtom?.ptsCalidad ?? 35.6;
  const tasaCalidad = typeof calidadOperativaPct === 'number' && calidadOperativaPct <= 100
    ? calidadOperativaPct
    : Number(((ptsCal / 50) * 100).toFixed(1));

  // Gauge gráfico
  const radius = 80;
  const strokeWidth = 18;
  const circumference = Math.PI * radius;
  const strokeDashoffset = circumference * (1 - Math.min(100, scoreVal) / 100);

  const nivelBadgeColor = 
    scoreVal >= 80 
      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
      : scoreVal >= 65 
      ? 'bg-orange-50 text-orange-600 border-orange-200' 
      : 'bg-rose-50 text-rose-600 border-rose-200';

  const diffVal = scoreAtom?.diferenciaPts ?? Number((scoreVal - (scoreAtom?.promedioNacional ?? 58.4)).toFixed(1));
  const formattedDiff = diffVal > 0 ? `+${diffVal}` : `${diffVal}`;

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(
        `Mi Score ATOM es ${scoreVal.toFixed(1)} puntos (${scoreAtom?.nivel ?? 'Aceptable'}), superando el promedio nacional en ${formattedDiff} pts.`
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch w-full font-sans mb-2">
      
      {/* =========================================================================
          PANEL IZQUIERDO: MEDIDOR SEMICIRCULAR SCORE ATOM
         ========================================================================= */}
      <div 
        className="lg:col-span-4 bg-white border p-6 lg:p-7 shadow-xs flex flex-col justify-between items-center text-center relative select-none"
        style={{ 
          borderRadius: '24px',
          borderColor: '#E2E8F0',
          backgroundColor: '#FFFFFF'
        }}
      >
        <div className="w-full flex items-center justify-between pb-1">
          <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
            CALIFICACIÓN GLOBAL
          </span>

          <div className="relative score-tooltip-container">
            <button
              type="button"
              onClick={(e) => toggleTooltip('scoreAtom', e)}
              className="p-1 rounded-full transition-colors cursor-pointer"
              style={{
                backgroundColor: activeTooltip === 'scoreAtom' ? '#FFEDD5' : 'transparent',
                color: activeTooltip === 'scoreAtom' ? '#EA580C' : '#94A3B8'
              }}
              title="¿Qué es el Score ATOM y cómo se calcula?"
            >
              <HelpCircle size={16} strokeWidth={2.2} />
            </button>

            {activeTooltip === 'scoreAtom' && (
              <div 
                className="animate-fade-in text-left"
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 10px)',
                  left: '0px',
                  width: '295px',
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
                    <span>⚡</span> Score ATOM Global
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
                  Indicador de 0 a 100 puntos que evalúa tu salud operativa y cumplimiento frente a los estándares de proveedores del país.
                </p>
                <div 
                  className="p-2.5 rounded-xl text-[11px] leading-relaxed space-y-1"
                  style={{ backgroundColor: '#FFF7ED', border: '1px solid #FFEDD5', color: '#7C2D12' }}
                >
                  <div className="font-extrabold text-[#EA580C]">Composición (100 pts):</div>
                  <div className="space-y-0.5 text-[10.5px]">
                    <div>• <strong>40 pts:</strong> Conversión de Entrega</div>
                    <div>• <strong>10 pts:</strong> Movilidad en Ruta (sin retrasos)</div>
                    <div>• <strong>50 pts:</strong> Calidad Operativa y stock recuperado</div>
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

        {/* Gauge gráfico semicircular */}
        <div className="w-full flex justify-center pt-1">
          <div className="relative w-64 h-36 flex justify-center items-end">
            <svg viewBox="0 0 240 145" className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id="scoreGaugeGradExact" x1="0%" y1="100%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#f97316" />
                  <stop offset="50%" stopColor="#ea580c" />
                  <stop offset="100%" stopColor="#c2410c" />
                </linearGradient>
              </defs>

              <path
                d="M 40 115 A 80 80 0 0 1 200 115"
                fill="none"
                stroke="#E9EFF7"
                strokeWidth={strokeWidth}
                strokeLinecap="round"
              />

              <line x1="161.7" y1="57.6" x2="172.3" y2="43.0" stroke="#FFFFFF" strokeWidth="2.5" />
              <line x1="183.3" y1="82.8" x2="199.3" y2="74.6" stroke="#FFFFFF" strokeWidth="2.5" />
              <line x1="190.1" y1="103.9" x2="207.9" y2="101.1" stroke="#FFFFFF" strokeWidth="2.5" />

              <text x="177" y="38" fontSize="9.5" fill="#94A3B8" fontWeight="600">70</text>
              <text x="206" y="70" fontSize="9.5" fill="#94A3B8" fontWeight="600">85</text>
              <text x="214" y="99" fontSize="9.5" fill="#94A3B8" fontWeight="600">95</text>

              <path
                d="M 40 115 A 80 80 0 0 1 200 115"
                fill="none"
                stroke="url(#scoreGaugeGradExact)"
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-1000 ease-out"
              />
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-end pb-1 pointer-events-none">
              <span className="text-5xl lg:text-[54px] font-black tracking-tight leading-none" style={{ color: '#FA7C16' }}>
                {scoreVal.toFixed(1)}
              </span>
              <div className={`mt-2 border text-[10.5px] font-black tracking-widest px-3.5 py-0.5 rounded-full uppercase shadow-2xs ${nivelBadgeColor}`}>
                {scoreAtom?.nivel?.toUpperCase() ?? 'ACEPTABLE'}
              </div>
            </div>
          </div>
        </div>

        <div className="pt-4 pb-3">
          <p className="text-xs text-[#8A9BA8] font-medium">
            Promedio nacional <strong className="text-slate-900 font-extrabold text-[13px] ml-1">{scoreAtom?.promedioNacional?.toFixed(1) ?? '58.4'}</strong>
          </p>
        </div>

        <div className="flex items-center justify-center gap-2.5 w-full">
          <div className="flex-1 bg-[#E5FAF6] text-[#0D9488] border border-[#A7F3D0]/80 font-bold px-4 py-2.5 rounded-2xl text-xs flex items-center justify-center gap-1.5 shadow-2xs">
            <span className="text-[10px]">▲</span>
            <span>{formattedDiff} pts sobre el promedio</span>
          </div>
          <button
            type="button"
            onClick={handleShare}
            className="p-2.5 rounded-2xl border border-slate-200/90 text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer shrink-0"
            title={copied ? '¡Copiado!' : 'Compartir score'}
          >
            {copied ? <Check size={16} className="text-emerald-600" /> : <Share2 size={16} strokeWidth={2.2} />}
          </button>
        </div>

        <div className="pt-3">
          <p className="text-[11.5px] text-slate-400 font-medium flex items-center justify-center gap-1">
            <span>Estás en</span>
            <strong className="text-[#9333EA] font-extrabold">Top {scoreAtom?.topPorcentaje ?? 12}%</strong>
            <span>· percentil {scoreAtom?.percentil ?? 88}</span>
          </p>
        </div>
      </div>

      {/* =========================================================================
          PANEL DERECHO: DIAGNÓSTICO DE SALUD OPERATIVA (DISEÑO UNIFICADO)
         ========================================================================= */}
      <div 
        className="lg:col-span-8 bg-white border p-6 lg:p-7 shadow-xs flex flex-col justify-between space-y-5"
        style={{ 
          borderRadius: '24px',
          borderColor: '#E2E8F0',
          backgroundColor: '#FFFFFF'
        }}
      >
        {/* Cabecera del diagnóstico con badge "Cuenta Auditada" */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-extrabold text-slate-900 tracking-tight">
                Diagnóstico de Salud Operativa
              </h2>

              <div className="relative score-tooltip-container">
                <button
                  type="button"
                  onClick={(e) => toggleTooltip('diagnostico', e)}
                  className="p-1 rounded-full transition-colors cursor-pointer"
                  style={{
                    backgroundColor: activeTooltip === 'diagnostico' ? '#FFEDD5' : 'transparent',
                    color: activeTooltip === 'diagnostico' ? '#EA580C' : '#94A3B8'
                  }}
                  title="¿Qué es el Diagnóstico de Salud Operativa?"
                >
                  <HelpCircle size={16} strokeWidth={2.2} />
                </button>

                {activeTooltip === 'diagnostico' && (
                  <div 
                    className="animate-fade-in text-left"
                    style={{
                      position: 'absolute',
                      top: 'calc(100% + 10px)',
                      left: '0px',
                      width: '300px',
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
                        <span>🩺</span> Salud Operativa
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
                      Monitoreo continuo de los 3 frentes logísticos fundamentales que consolidan los 100 puntos de tu Score ATOM.
                    </p>
                    <div 
                      className="p-2.5 rounded-xl text-[11px] leading-relaxed"
                      style={{ backgroundColor: '#FFF7ED', border: '1px solid #FFEDD5', color: '#7C2D12' }}
                    >
                      <span className="font-extrabold text-[#EA580C]">Ponderación: </span>
                      Conversión (máx 40 pts) + Movilidad (máx 10 pts) + Calidad Operativa (máx 50 pts).
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
              Estado general de trazabilidad, cumplimiento y mitigación de riesgo
            </p>
          </div>

          <div className="flex items-center gap-1.5 text-emerald-700 bg-emerald-50 border border-emerald-200/90 px-3.5 py-1 rounded-full text-xs font-bold shrink-0">
            <Award size={14} className="text-emerald-600" />
            <span>Cuenta Auditada</span>
          </div>
        </div>

        {/* 3 TARJETAS ALINEADAS CON EL ESTILO DE RESUMEN DEL PERIODO */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          
          {/* CARD 1: CONVERSIÓN DE ENTREGA */}
          <div 
            className="bg-white border p-5 shadow-xs flex flex-col justify-between space-y-3.5 hover:border-slate-300 transition-colors relative"
            style={{ 
              borderRadius: '22px',
              borderColor: '#E2E8F0',
              backgroundColor: '#FFFFFF'
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div 
                  className="w-9 h-9 border flex items-center justify-center shrink-0"
                  style={{
                    borderRadius: '12px',
                    backgroundColor: '#FFF7ED',
                    borderColor: '#FFEDD5',
                  }}
                >
                  <CheckCircle2 size={17} strokeWidth={2.2} color="#F97316" />
                </div>
                <span 
                  className="text-[10.5px] font-bold tracking-wider uppercase truncate"
                  style={{ color: '#64748B' }}
                >
                  CONVERSIÓN DE ENTREGA
                </span>
              </div>

              <div className="relative score-tooltip-container">
                <button
                  type="button"
                  onClick={(e) => toggleTooltip('conversion', e)}
                  className="p-1 rounded-full transition-colors cursor-pointer"
                  style={{
                    backgroundColor: activeTooltip === 'conversion' ? '#FFEDD5' : 'transparent',
                    color: activeTooltip === 'conversion' ? '#EA580C' : '#94A3B8'
                  }}
                  title="Ver explicación y cálculo"
                >
                  <HelpCircle size={15} strokeWidth={2.2} />
                </button>

                {activeTooltip === 'conversion' && (
                  <div 
                    className="animate-fade-in text-left"
                    style={{
                      position: 'absolute',
                      top: 'calc(100% + 10px)',
                      left: '0px',
                      right: 'auto',
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
                        <span>🎯</span> Conversión de Entrega
                      </span>
                      <button type="button" onClick={() => setActiveTooltip(null)} className="text-slate-400 hover:text-slate-800"><X size={14} /></button>
                    </div>
                    <p className="text-[11.5px] text-slate-600 mb-2.5">Porcentaje de pedidos entregados efectivamente sobre el total de órdenes despachadas.</p>
                    <div className="p-2.5 rounded-xl text-[11px]" style={{ backgroundColor: '#FFF7ED', border: '1px solid #FFEDD5', color: '#7C2D12' }}>
                      <span className="font-extrabold text-[#EA580C]">Aporte al Score: </span>({tasaEntrega.toFixed(1)}% ÷ 100) × 40 = <strong>{ptsConv} pts</strong>
                    </div>
                    <div style={{ position: 'absolute', top: '-6px', left: '8px', width: '10px', height: '10px', backgroundColor: '#FFFFFF', borderLeft: '1px solid #FED7AA', borderTop: '1px solid #FED7AA', transform: 'rotate(45deg)' }} />
                  </div>
                )}
              </div>
            </div>

            <div>
              <p 
                className="text-3xl lg:text-[34px] font-black tracking-tight leading-none" 
                style={{ color: '#FA7C16' }}
              >
                {tasaEntrega.toFixed(1)}%
              </p>
            </div>

            {/* Pie de tarjeta estandarizado */}
            <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
              <span className="text-slate-400 font-normal">Efectividad neta</span>
              <span 
                className="font-extrabold px-2 py-0.5 rounded-md text-[11px]"
                style={{ backgroundColor: '#FFF7ED', color: '#EA580C', border: '1px solid #FFEDD5' }}
              >
                {ptsConv} / 40 pts
              </span>
            </div>
          </div>

          {/* CARD 2: MOVILIDAD EN RUTA */}
          <div 
            className="bg-white border p-5 shadow-xs flex flex-col justify-between space-y-3.5 hover:border-slate-300 transition-colors relative"
            style={{ 
              borderRadius: '22px',
              borderColor: '#E2E8F0',
              backgroundColor: '#FFFFFF'
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div 
                  className="w-9 h-9 border flex items-center justify-center shrink-0"
                  style={{
                    borderRadius: '12px',
                    backgroundColor: '#FFF7ED',
                    borderColor: '#FFEDD5',
                  }}
                >
                  <Activity size={17} strokeWidth={2.2} color="#F97316" />
                </div>
                <span 
                  className="text-[10.5px] font-bold tracking-wider uppercase truncate"
                  style={{ color: '#64748B' }}
                >
                  MOVILIDAD EN RUTA
                </span>
              </div>

              <div className="relative score-tooltip-container">
                <button
                  type="button"
                  onClick={(e) => toggleTooltip('movilidad', e)}
                  className="p-1 rounded-full transition-colors cursor-pointer"
                  style={{
                    backgroundColor: activeTooltip === 'movilidad' ? '#FFEDD5' : 'transparent',
                    color: activeTooltip === 'movilidad' ? '#EA580C' : '#94A3B8'
                  }}
                  title="Ver explicación y cálculo"
                >
                  <HelpCircle size={15} strokeWidth={2.2} />
                </button>

                {activeTooltip === 'movilidad' && (
                  <div 
                    className="animate-fade-in text-left"
                    style={{
                      position: 'absolute',
                      top: 'calc(100% + 10px)',
                      left: '50%',
                      transform: 'translateX(-50%)',
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
                        <span>⚡</span> Movilidad en Ruta
                      </span>
                      <button type="button" onClick={() => setActiveTooltip(null)} className="text-slate-400 hover:text-slate-800"><X size={14} /></button>
                    </div>
                    <p className="text-[11.5px] text-slate-600 mb-2.5">Órdenes activas en ruta que avanzan fluidamente sin superar 3 días sin reporte logístico.</p>
                    <div className="p-2.5 rounded-xl text-[11px]" style={{ backgroundColor: '#FFF7ED', border: '1px solid #FFEDD5', color: '#7C2D12' }}>
                      <span className="font-extrabold text-[#EA580C]">Aporte al Score: </span>({tasaMov.toFixed(1)}% ÷ 100) × 10 = <strong>{ptsMov} pts</strong>
                    </div>
                    <div style={{ position: 'absolute', top: '-6px', left: '50%', transform: 'translateX(-50%) rotate(45deg)', width: '10px', height: '10px', backgroundColor: '#FFFFFF', borderLeft: '1px solid #FED7AA', borderTop: '1px solid #FED7AA' }} />
                  </div>
                )}
              </div>
            </div>

            <div>
              <p 
                className="text-3xl lg:text-[34px] font-black tracking-tight leading-none" 
                style={{ color: '#FA7C16' }}
              >
                {tasaMov.toFixed(1)}%
              </p>
            </div>

            {/* Pie de tarjeta estandarizado */}
            <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
              <span className="text-slate-400 font-normal">Guías fluidas</span>
              <span 
                className="font-extrabold px-2 py-0.5 rounded-md text-[11px]"
                style={{ backgroundColor: '#FFF7ED', color: '#EA580C', border: '1px solid #FFEDD5' }}
              >
                {ptsMov} / 10 pts
              </span>
            </div>
          </div>

          {/* CARD 3: CALIDAD OPERATIVA (ALINEADA A LOS 50 PTS) */}
          <div 
            className="bg-white border p-5 shadow-xs flex flex-col justify-between space-y-3.5 hover:border-slate-300 transition-colors relative"
            style={{ 
              borderRadius: '22px',
              borderColor: '#E2E8F0',
              backgroundColor: '#FFFFFF'
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div 
                  className="w-9 h-9 border flex items-center justify-center shrink-0"
                  style={{
                    borderRadius: '12px',
                    backgroundColor: '#FFF7ED',
                    borderColor: '#FFEDD5',
                  }}
                >
                  <ShieldCheck size={17} strokeWidth={2.2} color="#F97316" />
                </div>
                <span 
                  className="text-[10.5px] font-bold tracking-wider uppercase truncate"
                  style={{ color: '#64748B' }}
                >
                  CALIDAD OPERATIVA
                </span>
              </div>

              <div className="relative score-tooltip-container">
                <button
                  type="button"
                  onClick={(e) => toggleTooltip('calidad', e)}
                  className="p-1 rounded-full transition-colors cursor-pointer"
                  style={{
                    backgroundColor: activeTooltip === 'calidad' ? '#FFEDD5' : 'transparent',
                    color: activeTooltip === 'calidad' ? '#EA580C' : '#94A3B8'
                  }}
                  title="Ver explicación y cálculo"
                >
                  <HelpCircle size={15} strokeWidth={2.2} />
                </button>

                {activeTooltip === 'calidad' && (
                  <div 
                    className="animate-fade-in text-left"
                    style={{
                      position: 'absolute',
                      top: 'calc(100% + 10px)',
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
                        <span>🛡️</span> Calidad Operativa
                      </span>
                      <button type="button" onClick={() => setActiveTooltip(null)} className="text-slate-400 hover:text-slate-800"><X size={14} /></button>
                    </div>
                    <p className="text-[11.5px] text-slate-600 mb-2.5">Cumplimiento en despachos a tiempo y mercancía devuelta recuperada físicamente en bodega.</p>
                    <div className="p-2.5 rounded-xl text-[11px]" style={{ backgroundColor: '#FFF7ED', border: '1px solid #FFEDD5', color: '#7C2D12' }}>
                      <span className="font-extrabold text-[#EA580C]">Aporte al Score: </span>({tasaCalidad.toFixed(1)}% ÷ 100) × 50 = <strong>{ptsCal} pts</strong>
                    </div>
                    <div style={{ position: 'absolute', top: '-6px', right: '8px', width: '10px', height: '10px', backgroundColor: '#FFFFFF', borderLeft: '1px solid #FED7AA', borderTop: '1px solid #FED7AA', transform: 'rotate(45deg)' }} />
                  </div>
                )}
              </div>
            </div>

            <div>
              <p 
                className="text-3xl lg:text-[34px] font-black tracking-tight leading-none" 
                style={{ color: '#FA7C16' }}
              >
                {tasaCalidad.toFixed(1)}%
              </p>
            </div>

            {/* Pie de tarjeta estandarizado */}
            <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
              <span className="text-slate-400 font-normal">Despacho y bodega</span>
              <span 
                className="font-extrabold px-2 py-0.5 rounded-md text-[11px]"
                style={{ backgroundColor: '#FFF7ED', color: '#EA580C', border: '1px solid #FFEDD5' }}
              >
                {ptsCal} / 50 pts
              </span>
            </div>
          </div>

        </div>

        {/* BANNER INFERIOR DE BENCHMARK NACIONAL */}
        <div 
          className="p-4 rounded-2xl flex items-center justify-between gap-3 text-xs"
          style={{ 
            backgroundColor: '#FFF7ED',
            border: '1px solid #FFEDD5'
          }}
        >
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
            <span className="text-slate-700 font-medium">
              Tu operación se encuentra <strong className="text-slate-900 font-extrabold">{formattedDiff} puntos</strong> por encima de la media de proveedores nacionales.
            </span>
          </div>

          <div 
            className="hidden sm:flex items-center gap-1.5 text-[11.5px] font-bold px-3 py-1 rounded-xl shrink-0"
            style={{ 
              backgroundColor: '#FFEAD4',
              color: '#EA580C',
              border: '1px solid #FED7AA'
            }}
          >
            <TrendingUp size={13} strokeWidth={2.2} />
            <span>Rendimiento {scoreAtom?.nivel ?? 'Aceptable'}</span>
          </div>
        </div>

      </div>

    </div>
  );
}
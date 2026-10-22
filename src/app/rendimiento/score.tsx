// src/app/rendimiento/score.tsx
'use client';

import React, { useState } from 'react';
import { 
  Share2, 
  Check, 
  Info, 
  CheckCircle2, 
  Truck, 
  Clock, 
  RotateCcw,
  Sparkles
} from 'lucide-react';

export interface ScoreProps {
  scoreAtom?: {
    total?: number;
    nivel?: string;
    promedioNacional?: number;
    diferenciaPts?: number;
    topPorcentaje?: number;
    percentil?: number;
  };
  resumenOperativo?: {
    tasaEntregaEfectiva?: number;
    tasaMovilizacion?: number;
    tasaNovedades?: number;
    tasaRecuperacionStock?: number;
  };
}

export default function Score({
  scoreAtom,
  resumenOperativo
}: ScoreProps) {
  const [copied, setCopied] = useState(false);

  // Valores tomados de props o fallbacks calibrados
  const scoreVal = typeof scoreAtom?.total === 'number' && !isNaN(scoreAtom.total)
    ? scoreAtom.total
    : 89.8;

  const promedioNacional = scoreAtom?.promedioNacional ?? 69.7;
  const diffVal = scoreAtom?.diferenciaPts ?? Number((scoreVal - promedioNacional).toFixed(1));
  const formattedDiff = diffVal > 0 ? `+${diffVal}` : `${diffVal}`;
  const topPct = scoreAtom?.topPorcentaje ?? 20.0;
  const percentilVal = scoreAtom?.percentil ?? 80;

  // Tasas de los 4 pilares
  const tasaEntrega = resumenOperativo?.tasaEntregaEfectiva ?? 76.0;
  const tasaMov = resumenOperativo?.tasaMovilizacion ?? 99.0;
  const tasaNov = resumenOperativo?.tasaNovedades ?? 99.9;
  const tasaRecup = resumenOperativo?.tasaRecuperacionStock ?? 97.9;

  // Puntos calculados según su ponderación (40%, 20%, 20%, 20%)
  const ptsEntrega = Number(((tasaEntrega / 100) * 40).toFixed(1));
  const ptsMov = Number(((tasaMov / 100) * 20).toFixed(1));
  const ptsNov = Number(((tasaNov / 100) * 20).toFixed(1));
  const ptsRecup = Number(((tasaRecup / 100) * 20).toFixed(1));

  // Geometría del arco
  const radius = 82;
  const strokeWidth = 18;
  const circumference = Math.PI * radius;
  const strokeDashoffset = circumference * (1 - Math.min(100, scoreVal) / 100);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(
        `Mi Score ATOM es ${scoreVal.toFixed(1)} puntos (ALTO RENDIMIENTO), superando el promedio nacional en ${formattedDiff} pts.`
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Configuración de las 4 tarjetas de desglose
  const cards = [
    {
      id: 'entregas',
      titulo: 'Pedidos Entregados',
      peso: '40%',
      descripcion: 'KPI Rey · efectividad real',
      tasa: tasaEntrega,
      puntosAporte: ptsEntrega,
      maxPuntos: 40,
      icon: CheckCircle2,
      iconBg: 'bg-orange-50 border-orange-200/60 text-[#F97316]',
      accentColor: 'text-[#EA580C]',
      barGradient: 'from-orange-400 to-[#F97316]'
    },
    {
      id: 'movilizacion',
      titulo: 'Movilización de Guías',
      peso: '20%',
      descripcion: 'Pedidos estancados >3 días',
      tasa: tasaMov,
      puntosAporte: ptsMov,
      maxPuntos: 20,
      icon: Truck,
      iconBg: 'bg-amber-50 border-amber-200/60 text-amber-600',
      accentColor: 'text-[#EA580C]',
      barGradient: 'from-amber-400 to-amber-500'
    },
    {
      id: 'novedades',
      titulo: 'Gestión de Novedades',
      peso: '20%',
      descripcion: 'Velocidad de respuesta',
      tasa: tasaNov,
      puntosAporte: ptsNov,
      maxPuntos: 20,
      icon: Clock,
      iconBg: 'bg-emerald-50 border-emerald-200/60 text-emerald-600',
      accentColor: 'text-[#EA580C]',
      barGradient: 'from-emerald-400 to-emerald-500'
    },
    {
      id: 'recuperacion',
      titulo: 'Recuperación Stock',
      peso: '20%',
      descripcion: 'Devolución a bodega',
      tasa: tasaRecup,
      puntosAporte: ptsRecup,
      maxPuntos: 20,
      icon: RotateCcw,
      iconBg: 'bg-blue-50 border-blue-200/60 text-blue-600',
      accentColor: 'text-[#EA580C]',
      barGradient: 'from-blue-400 to-blue-500'
    }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch w-full font-sans mb-2">
      
      {/* 1. PANEL IZQUIERDO: MEDIDOR AZUL SCORE ATOM */}
      <div 
        className="lg:col-span-4 bg-white border p-6 lg:p-7 shadow-xs flex flex-col justify-between items-center text-center select-none"
        style={{ borderRadius: '24px', borderColor: '#E2E8F0' }}
      >
        <div className="w-full flex items-center justify-between pb-1">
          <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
            CALIFICACIÓN GLOBAL
          </span>
          <span className="flex items-center gap-1 text-[11px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
            <Sparkles size={12} />
            En Vivo
          </span>
        </div>

        {/* ARCO VELOCÍMETRO */}
        <div className="w-full flex justify-center pt-2">
          <div className="relative w-64 h-38 flex justify-center items-end">
            <svg viewBox="0 0 240 145" className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id="scoreBlueGauge" x1="0%" y1="100%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#2563EB" />
                  <stop offset="100%" stopColor="#3B82F6" />
                </linearGradient>
              </defs>

              <path
                d="M 38 116 A 82 82 0 0 1 202 116"
                fill="none"
                stroke="#EEF2F6"
                strokeWidth={strokeWidth}
                strokeLinecap="round"
              />

              <line x1="163" y1="58" x2="173" y2="44" stroke="#CBD5E1" strokeWidth="1.5" />
              <line x1="184" y1="83" x2="198" y2="76" stroke="#CBD5E1" strokeWidth="1.5" />
              <line x1="191" y1="104" x2="207" y2="102" stroke="#CBD5E1" strokeWidth="1.5" />

              <text x="178" y="39" fontSize="9" fill="#94A3B8" fontWeight="600">70</text>
              <text x="206" y="72" fontSize="9" fill="#94A3B8" fontWeight="600">85</text>
              <text x="214" y="100" fontSize="9" fill="#94A3B8" fontWeight="600">95</text>

              <path
                d="M 38 116 A 82 82 0 0 1 202 116"
                fill="none"
                stroke="url(#scoreBlueGauge)"
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-1000 ease-out"
              />
            </svg>

            <div className="absolute inset-0 flex flex-col items-center justify-end pb-1 pointer-events-none">
              <span className="text-5xl lg:text-[56px] font-black tracking-tight leading-none text-[#2563EB]">
                {scoreVal.toFixed(1)}
              </span>
              <div className="mt-2.5 bg-[#EFF6FF] border border-[#BFDBFE] text-[#2563EB] text-[10.5px] font-black tracking-wider px-3.5 py-0.5 rounded-full uppercase">
                ALTO RENDIMIENTO
              </div>
            </div>
          </div>
        </div>

        {/* PROMEDIO NACIONAL */}
        <div className="pt-4 pb-2">
          <p className="text-xs text-slate-400 font-medium">
            Promedio nacional <strong className="text-slate-900 font-extrabold text-[13.5px] ml-1">{promedioNacional.toFixed(1)}</strong>
          </p>
        </div>

        {/* PILL VERDE DELTA + BOTÓN COMPARTIR */}
        <div className="flex items-center justify-center gap-2.5 w-full">
          <div className="flex-1 bg-[#E6F7F2] text-[#0D9488] border border-[#A7F3D0]/70 font-bold px-4 py-2.5 rounded-2xl text-xs flex items-center justify-center gap-1.5 shadow-2xs">
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

        {/* PIE PERCENTIL */}
        <div className="pt-3">
          <p className="text-[11.5px] text-slate-400 font-medium flex items-center justify-center gap-1">
            <span>Estás en</span>
            <strong className="text-[#9333EA] font-extrabold">Top {topPct.toFixed(1)}%</strong>
            <span>· percentil {percentilVal}</span>
            <Info size={12} className="text-slate-400 ml-0.5" />
          </p>
        </div>
      </div>

      {/* 2. PANEL DERECHO: DESGLOSE DEL SCORE EN TARJETAS */}
      <div 
        className="lg:col-span-8 bg-white border p-6 lg:p-7 shadow-xs flex flex-col justify-between space-y-4"
        style={{ borderRadius: '24px', borderColor: '#E2E8F0' }}
      >
        <div className="space-y-0.5">
          <h2 className="text-base font-extrabold text-slate-900 tracking-tight">
            Desglose del Score
          </h2>
          <p className="text-xs text-slate-400">
            Cada componente aporta según su peso ponderado
          </p>
        </div>

        {/* GRID 2x2 DE TARJETAS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          {cards.map((c) => {
            const Icon = c.icon;
            return (
              <div
                key={c.id}
                className="group relative bg-[#FBFDFF] hover:bg-white border border-slate-200/80 hover:border-orange-300/80 rounded-2xl p-4.5 transition-all duration-200 shadow-2xs hover:shadow-md flex flex-col justify-between space-y-3.5"
              >
                {/* Cabecera de la Tarjeta */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-8 h-8 rounded-xl border flex items-center justify-center shrink-0 ${c.iconBg}`}>
                      <Icon size={16} strokeWidth={2.2} />
                    </div>
                    <div>
                      <h3 className="text-xs font-extrabold text-slate-900 leading-tight group-hover:text-orange-600 transition-colors">
                        {c.titulo}
                      </h3>
                      <p className="text-[10.5px] text-slate-400 mt-0.5 font-medium">
                        {c.descripcion}
                      </p>
                    </div>
                  </div>

                  <span className="bg-[#FFF7ED] text-[#EA580C] border border-[#FFEDD5] text-[10.5px] font-black px-2 py-0.5 rounded-lg shrink-0">
                    {c.peso}
                  </span>
                </div>

                {/* Métricas Principales */}
                <div className="space-y-2 pt-0.5">
                  <div className="flex items-baseline justify-between">
                    <div>
                      <span className={`text-2xl font-black tracking-tight ${c.accentColor}`}>
                        {c.tasa.toFixed(1)}%
                      </span>
                    </div>

                    <div className="text-right text-[11px] text-slate-400 font-medium">
                      aporta <strong className="text-slate-900 font-black text-xs">{c.puntosAporte.toFixed(1)}</strong> al Score
                    </div>
                  </div>

                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden p-0.5">
                    <div
                      className={`h-full rounded-full bg-linear-to-r ${c.barGradient} transition-all duration-700 ease-out`}
                      style={{ width: `${Math.min(100, c.tasa)}%` }}
                    />
                  </div>
                </div>

                {/* Footer del Pilar */}
                <div className="flex items-center justify-between text-[10px] text-slate-400 pt-0.5 border-t border-slate-100/90 font-medium">
                  <span>Cumplimiento del pilar</span>
                  <span className="text-slate-600 font-bold">
                    {c.puntosAporte.toFixed(1)} / {c.maxPuntos} pts
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}

export { Score };
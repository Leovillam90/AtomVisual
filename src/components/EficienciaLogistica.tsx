// src/components/EficienciaLogistica.tsx
'use client';

import React from 'react';
import { 
  Home, 
  Calendar, 
  Share2, 
  Info, 
  Check 
} from 'lucide-react';

export default function EficienciaLogistica() {
  // Parámetros geométricos del velocímetro
  const radius = 80;
  const strokeWidth = 18;
  const circumference = Math.PI * radius; // ~251.327
  const score = 62.8;
  const strokeDashoffset = circumference * (1 - score / 100);

  // Datos para la distribución de estados
  const distribucionEstados = [
    { nombre: 'Por confirmar', cantidad: 47, porcentaje: '6.0%', color: '#6366f1', widthPct: 6.0 },
    { nombre: 'Pendientes', cantidad: 16, porcentaje: '2.0%', color: '#38bdf8', widthPct: 2.0 },
    { nombre: 'En curso', cantidad: 372, porcentaje: '47.3%', color: '#facc15', widthPct: 47.3 },
    { nombre: 'Con novedad', cantidad: 36, porcentaje: '4.6%', color: '#fb923c', widthPct: 4.6 },
    { nombre: 'Entregados', cantidad: 293, porcentaje: '37.2%', color: '#10b981', widthPct: 37.2 },
    { nombre: 'En devolución', cantidad: 23, porcentaje: '2.9%', color: '#ef4444', widthPct: 2.9 }
  ];

  // Datos para la tendencia semanal del Score (14 días)
  const scoreTrendData = [
    { date: '10-01', score: 64 },
    { date: '10-02', score: 63 },
    { date: '10-03', score: 50 },
    { date: '10-04', score: 74 },
    { date: '10-05', score: 55 },
    { date: '10-06', score: 49 },
    { date: '10-07', score: 54 },
    { date: '10-08', score: 60 },
    { date: '10-09', score: 66 },
    { date: '10-10', score: 55 },
    { date: '10-11', score: 60 },
    { date: '10-12', score: 60 },
    { date: '10-13', score: 60 },
    { date: '10-14', score: 60 }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 p-6 lg:p-8 font-sans space-y-6">
      
      {/* 1. BREADCRUMB */}
      <nav className="flex items-center gap-2 text-xs text-slate-400 font-medium">
        <Home size={14} className="text-slate-400" />
        <span>/</span>
        <span className="text-slate-600">Eficiencia logística</span>
      </nav>

      {/* 2. CABECERA PRINCIPAL */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Eficiencia logística</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Tablero de control de activos · Score ATOM
          </p>
        </div>

        {/* SELECTOR DE PERIODO */}
        <div className="flex flex-col">
          <span className="text-[10px] text-slate-400 font-medium ml-0.5 mb-0.5">Periodo</span>
          <div className="bg-white border border-slate-200/90 rounded-xl px-3.5 py-2 text-xs font-medium text-slate-700 shadow-xs flex items-center gap-2">
            <Calendar size={13} className="text-slate-400" />
            <span>01/10/2026 - 31/10/2026</span>
          </div>
        </div>
      </div>

      {/* 3. BLOQUE DUAL SUPERIOR (SCORE GAUGE EXACTO + DESGLOSE) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        
        {/* PANEL IZQUIERDO: MEDIDOR SEMICIRCULAR SCORE ATOM */}
        <div className="lg:col-span-4 bg-white border border-slate-200/90 rounded-[32px] p-7 shadow-xs flex flex-col justify-between items-center text-center relative select-none">
          
          <div className="w-full flex justify-center pt-2">
            <div className="relative w-64 h-36 flex justify-center items-end">
              <svg 
                viewBox="0 0 240 145" 
                className="w-full h-full overflow-visible"
              >
                <defs>
                  <linearGradient id="scoreGaugeGradient" x1="0%" y1="100%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#E83838" />
                    <stop offset="50%" stopColor="#EF4444" />
                    <stop offset="100%" stopColor="#FB5A67" />
                  </linearGradient>
                </defs>

                {/* Pista gris de fondo */}
                <path
                  d="M 40 115 A 80 80 0 0 1 200 115"
                  fill="none"
                  stroke="#E9EFF7"
                  strokeWidth={strokeWidth}
                  strokeLinecap="round"
                />

                {/* Divisores de escala (70, 85, 95) */}
                <line
                  x1="161.7" y1="57.6"
                  x2="172.3" y2="43.0"
                  stroke="#FFFFFF"
                  strokeWidth="2.5"
                />
                <line
                  x1="183.3" y1="82.8"
                  x2="199.3" y2="74.6"
                  stroke="#FFFFFF"
                  strokeWidth="2.5"
                />
                <line
                  x1="190.1" y1="103.9"
                  x2="207.9" y2="101.1"
                  stroke="#FFFFFF"
                  strokeWidth="2.5"
                />

                {/* Hitos numéricos */}
                <text x="177" y="38" fontSize="9.5" fill="#94A3B8" fontWeight="600" fontFamily="sans-serif">
                  70
                </text>
                <text x="206" y="70" fontSize="9.5" fill="#94A3B8" fontWeight="600" fontFamily="sans-serif">
                  85
                </text>
                <text x="214" y="99" fontSize="9.5" fill="#94A3B8" fontWeight="600" fontFamily="sans-serif">
                  95
                </text>

                {/* Arco dinámico con el porcentaje del Score */}
                <path
                  d="M 40 115 A 80 80 0 0 1 200 115"
                  fill="none"
                  stroke="url(#scoreGaugeGradient)"
                  strokeWidth={strokeWidth}
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  className="transition-all duration-1000 ease-out"
                />
              </svg>

              {/* Cifra central y etiqueta de estado */}
              <div className="absolute inset-0 flex flex-col items-center justify-end pb-1 pointer-events-none">
                <span className="text-5xl lg:text-[54px] font-black text-[#EE3838] tracking-tight leading-none">
                  {score.toFixed(1)}
                </span>
                <div className="mt-2 bg-[#FFF0F2] text-[#F03D3D] border border-[#FECDD3]/80 text-[10.5px] font-black tracking-widest px-3.5 py-0.5 rounded-full uppercase shadow-2xs">
                  RIESGO
                </div>
              </div>
            </div>
          </div>

          {/* Promedio nacional */}
          <div className="pt-4 pb-3">
            <p className="text-xs text-[#8A9BA8] font-medium">
              Promedio nacional <strong className="text-slate-900 font-extrabold text-[13px] ml-1">61.1</strong>
            </p>
          </div>

          {/* Botón comparativo + compartir */}
          <div className="flex items-center justify-center gap-2.5 w-full">
            <div className="flex-1 bg-[#E5FAF6] text-[#0D9488] border border-[#A7F3D0]/80 font-bold px-4 py-2.5 rounded-2xl text-xs flex items-center justify-center gap-1.5 shadow-2xs">
              <span className="text-[10px]">▲</span>
              <span>1.7 pts sobre el promedio</span>
            </div>

            <button
              type="button"
              className="p-2.5 rounded-2xl border border-slate-200/90 text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer shrink-0"
              title="Compartir tarjeta de Score"
            >
              <Share2 size={16} strokeWidth={2.2} />
            </button>
          </div>

          {/* Footer percentil */}
          <div className="pt-3">
            <p className="text-[11.5px] text-slate-400 font-medium flex items-center justify-center gap-1">
              <span>Estás en</span>
              <strong className="text-[#9333EA] font-extrabold">Top 33.9%</strong>
              <span>· percentil 66</span>
              <Info size={12} className="text-slate-300 ml-0.5" />
            </p>
          </div>
        </div>

        {/* PANEL DERECHO: DESGLOSE DEL SCORE POR COMPONENTE */}
        <div className="lg:col-span-8 bg-white border border-slate-200/90 rounded-[32px] p-6 lg:p-8 shadow-xs flex flex-col justify-between space-y-6">
          <div>
            <h2 className="text-base font-extrabold text-slate-900 tracking-tight">Desglose del Score</h2>
            <p className="text-xs text-slate-500 mt-0.5">Cada componente aporta según su peso ponderado</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">
            
            {/* 1. Pedidos Entregados */}
            <div className="space-y-2">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-800">Pedidos Entregados</span>
                    <span className="bg-orange-50 text-orange-600 border border-orange-200 text-[10px] font-black px-1.5 py-0.2 rounded-md">
                      40%
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400 block mt-0.5">KPI Rey · efectividad real</span>
                </div>
                <div className="text-right">
                  <span className="text-base font-black text-[#f97316] block leading-none">37.2%</span>
                  <span className="text-[10px] text-slate-400 mt-0.5 block">aporta <strong className="text-slate-700">14.9</strong> al Score</span>
                </div>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-[#f97316] rounded-full" style={{ width: '37.2%' }} />
              </div>
            </div>

            {/* 2. Movilización de Guías */}
            <div className="space-y-2">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-800">Movilización de Guías</span>
                    <span className="bg-orange-50 text-orange-600 border border-orange-200 text-[10px] font-black px-1.5 py-0.2 rounded-md">
                      20%
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400 block mt-0.5">Pedidos estancados &gt;3 días</span>
                </div>
                <div className="text-right">
                  <span className="text-base font-black text-[#f97316] block leading-none">52.7%</span>
                  <span className="text-[10px] text-slate-400 mt-0.5 block">aporta <strong className="text-slate-700">10.5</strong> al Score</span>
                </div>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-[#f97316] rounded-full" style={{ width: '52.7%' }} />
              </div>
            </div>

            {/* 3. Gestión de Novedades */}
            <div className="space-y-2">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-800">Gestión de Novedades</span>
                    <span className="bg-orange-50 text-orange-600 border border-orange-200 text-[10px] font-black px-1.5 py-0.2 rounded-md">
                      20%
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400 block mt-0.5">Velocidad de respuesta</span>
                </div>
                <div className="text-right">
                  <span className="text-base font-black text-[#f97316] block leading-none">95.4%</span>
                  <span className="text-[10px] text-slate-400 mt-0.5 block">aporta <strong className="text-slate-700">19.1</strong> al Score</span>
                </div>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-[#ea580c] rounded-full" style={{ width: '95.4%' }} />
              </div>
            </div>

            {/* 4. Recuperación Stock */}
            <div className="space-y-2">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-800">Recuperación Stock</span>
                    <span className="bg-orange-50 text-orange-600 border border-orange-200 text-[10px] font-black px-1.5 py-0.2 rounded-md">
                      20%
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400 block mt-0.5">Devolución a bodega</span>
                </div>
                <div className="text-right">
                  <span className="text-base font-black text-[#f97316] block leading-none">91.3%</span>
                  <span className="text-[10px] text-slate-400 mt-0.5 block">aporta <strong className="text-slate-700">18.3</strong> al Score</span>
                </div>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-[#f97316] rounded-full" style={{ width: '91.3%' }} />
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* 4. RESUMEN OPERATIVO */}
      <section className="space-y-3">
        <div>
          <h2 className="text-base font-extrabold text-slate-900 tracking-tight">Resumen operativo</h2>
          <p className="text-xs text-slate-500 mt-0.5">Volumen y conversión durante el periodo</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs space-y-2">
            <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase block">
              PEDIDOS GENERADOS
            </span>
            <p className="text-3xl font-extrabold text-[#f97316] tracking-tight">787</p>
            <p className="text-xs text-slate-400 font-normal">Despachados o con intención de despacho</p>
          </div>

          <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs space-y-2">
            <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase block">
              TASA DE ENTREGA EFECTIVA
            </span>
            <p className="text-3xl font-extrabold text-[#f97316] tracking-tight">37.2%</p>
            <p className="text-xs text-slate-400 font-normal">Pedidos entregados</p>
          </div>

          <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs space-y-2">
            <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase block">
              TASA DE RECUPERACIÓN
            </span>
            <p className="text-3xl font-extrabold text-[#f97316] tracking-tight">91.3%</p>
            <p className="text-xs text-slate-400 font-normal">Devoluciones recibidas en bodega</p>
          </div>

          <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs space-y-2">
            <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase block">
              TASA DE MOVILIZACIÓN
            </span>
            <p className="text-3xl font-extrabold text-[#f97316] tracking-tight">52.7%</p>
            <p className="text-xs text-slate-400 font-normal">Pedidos en movimiento</p>
          </div>
        </div>
      </section>

      {/* 5. DISTRIBUCIÓN DE ESTADOS */}
      <section className="space-y-3">
        <div>
          <h2 className="text-base font-extrabold text-slate-900 tracking-tight">Distribución de estados</h2>
          <p className="text-xs text-slate-500 mt-0.5">Dónde está el inventario y las órdenes ahora mismo</p>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-5">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">787</span>
            <span className="text-xs text-slate-500 font-medium">Pedidos totales</span>
          </div>

          <div className="w-full h-3 rounded-full overflow-hidden flex bg-slate-100">
            {distribucionEstados.map((item) => (
              <div
                key={item.nombre}
                style={{ width: `${item.widthPct}%`, backgroundColor: item.color }}
                className="h-full transition-all duration-300"
                title={`${item.nombre}: ${item.cantidad} (${item.porcentaje})`}
              />
            ))}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 pt-1">
            {distribucionEstados.map((item) => (
              <div key={item.nombre} className="flex items-start gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-xs shrink-0 mt-0.5"
                  style={{ backgroundColor: item.color }}
                />
                <div className="text-xs space-y-0.5">
                  <span className="text-slate-500 block">{item.nombre}</span>
                  <div className="text-slate-800">
                    <span className="font-extrabold">{item.cantidad}</span>
                    <span className="text-slate-400 text-[11px] ml-1">· {item.porcentaje}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. IMPACTO FINANCIERO */}
      <section className="space-y-3">
        <div>
          <h2 className="text-base font-extrabold text-slate-900 tracking-tight">Impacto financiero</h2>
          <p className="text-xs text-slate-500 mt-0.5">Capital protegido, en riesgo y por recuperar</p>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-2">
              <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase block">
                UTILIDAD PROTEGIDA
              </span>
              <p className="text-3xl lg:text-4xl font-black text-[#f97316] tracking-tight">
                $ 20.385.490
              </p>
              <p className="text-xs text-slate-400 font-normal">Recaudo de pedidos entregados</p>
            </div>

            <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-2">
              <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase block">
                UTILIDAD EN RIESGO
              </span>
              <p className="text-3xl lg:text-4xl font-black text-[#f97316] tracking-tight">
                $ 8.077.732
              </p>
              <p className="text-xs text-slate-400 font-normal">Curso +3 días · novedades sin gestión · devoluciones no recibidas</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs space-y-2">
              <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase block">
                RECAUDO PROVEEDOR
              </span>
              <p className="text-xl font-black text-slate-900 tracking-tight">$ 18.822.990</p>
              <p className="text-xs text-slate-400 font-normal">Pedidos entregados</p>
            </div>

            <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs space-y-2">
              <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase block">
                CAPITAL RECUPERADO
              </span>
              <p className="text-xl font-black text-slate-900 tracking-tight">$ 1.562.500</p>
              <p className="text-xs text-slate-400 font-normal">Pedidos confirmados en bodega</p>
            </div>

            <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs space-y-2">
              <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase block">
                CAPITAL BLOQUEADO
              </span>
              <p className="text-xl font-black text-slate-900 tracking-tight">$ 7.913.732</p>
              <p className="text-xs text-slate-400 font-normal">Curso +3 días · novedades</p>
            </div>

            <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs space-y-2">
              <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase block">
                CAPITAL PERDIDO
              </span>
              <p className="text-xl font-black text-slate-900 tracking-tight">$ 164.000</p>
              <p className="text-xs text-slate-400 font-normal">Devoluciones no recibidas</p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. INTEGRIDAD DE DATOS · ECO SCANNER */}
      <section className="space-y-3">
        <div>
          <h2 className="text-base font-extrabold text-slate-900 tracking-tight">Integridad de datos · Eco Scanner</h2>
          <p className="text-xs text-slate-500 mt-0.5">Requisito: 80% salidas + 70% devoluciones para activar beneficios</p>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 lg:p-7 shadow-xs space-y-6">
          <div className="flex justify-between items-start flex-wrap gap-3">
            <div className="flex items-baseline gap-3">
              <span className="text-4xl lg:text-5xl font-black text-[#f97316] tracking-tight">95.3%</span>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">USO GLOBAL</span>
            </div>

            <div className="bg-orange-50 border border-orange-200/80 text-orange-600 font-bold px-3 py-1 rounded-full text-xs flex items-center gap-1.5 shadow-xs">
              <Check size={14} strokeWidth={2.5} />
              <span>Beneficios activos</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-1">
            <div className="space-y-2">
              <div className="flex justify-between items-baseline">
                <span className="text-xs font-bold text-slate-800">Salidas escaneadas</span>
                <span className="text-base font-black text-[#f97316]">96.3%</span>
              </div>
              
              <div className="relative w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-[#f97316] rounded-full" style={{ width: '96.3%' }} />
                <div className="absolute top-0 bottom-0 w-0.5 bg-white/70" style={{ left: '80%' }} />
              </div>

              <div className="flex justify-between items-center text-[11px]">
                <span className="text-slate-400 font-medium">697 / 724 paquetes</span>
                <span className="text-[#f97316] font-bold">✓ Sobre umbral 80%</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-baseline">
                <span className="text-xs font-bold text-slate-800">Devoluciones escaneadas</span>
                <span className="text-base font-black text-[#f97316]">91.3%</span>
              </div>
              
              <div className="relative w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-[#f97316] rounded-full" style={{ width: '91.3%' }} />
                <div className="absolute top-0 bottom-0 w-0.5 bg-white/70" style={{ left: '70%' }} />
              </div>

              <div className="flex justify-between items-center text-[11px]">
                <span className="text-slate-400 font-medium">21 / 23 paquetes</span>
                <span className="text-[#f97316] font-bold">✓ Sobre umbral 70%</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. TENDENCIA SEMANAL DEL SCORE (ÁREA CON ANCHO TOTAL) */}
      <section className="space-y-3">
        <div>
          <h2 className="text-base font-extrabold text-slate-900 tracking-tight">Tendencia semanal del Score</h2>
          <p className="text-xs text-slate-500 mt-0.5">Pasa el cursor por cada día para ver el detalle</p>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex gap-3 items-stretch w-full pt-2">
            
            {/* Eje Y */}
            <div className="w-8 flex flex-col justify-between text-[11px] text-slate-400 font-medium pb-7 select-none shrink-0 text-right pr-2">
              <span>100</span>
              <span>75</span>
              <span>50</span>
              <span>25</span>
              <span>0</span>
            </div>

            {/* Contenedor del Gráfico */}
            <div className="flex-1 flex flex-col min-w-0">
              <div className="relative w-full h-56">
                
                {/* Líneas horizontales de fondo */}
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                  <div className="border-b border-slate-100 w-full" />
                  <div className="border-b border-slate-100 w-full" />
                  <div className="border-b border-slate-100 w-full" />
                  <div className="border-b border-slate-100 w-full" />
                  <div className="border-b border-slate-100 w-full" />
                </div>

                {/* SVG para el área sombreada y línea continua */}
                <svg
                  className="absolute inset-0 w-full h-full pointer-events-none z-10 overflow-visible"
                  viewBox="0 0 1000 100"
                  preserveAspectRatio="none"
                >
                  <defs>
                    <linearGradient id="scoreAreaGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#f97316" stopOpacity="0.22" />
                      <stop offset="100%" stopColor="#f97316" stopOpacity="0.01" />
                    </linearGradient>
                  </defs>

                  <path
                    d={`
                      ${scoreTrendData.map((d, idx) => {
                        const x = ((idx + 0.5) / scoreTrendData.length) * 1000;
                        const y = 100 - d.score;
                        return `${idx === 0 ? 'M' : 'L'} ${x}${y}`;
                      }).join(' ')}
                      L ${((scoreTrendData.length - 0.5) / scoreTrendData.length) * 1000} 100
                      L ${(0.5 / scoreTrendData.length) * 1000} 100 Z
                    `}
                    fill="url(#scoreAreaGrad)"
                  />

                  <path
                    d={scoreTrendData.map((d, idx) => {
                      const x = ((idx + 0.5) / scoreTrendData.length) * 1000;
                      const y = 100 - d.score;
                      return `${idx === 0 ? 'M' : 'L'} ${x} ${y}`;
                    }).join(' ')}
                    fill="none"
                    stroke="#f97316"
                    strokeWidth="2.5"
                    vectorEffect="non-scaling-stroke"
                  />
                </svg>

                {/* Puntos interactivos con Tooltips */}
                {scoreTrendData.map((d, idx) => {
                  const xPct = ((idx + 0.5) / scoreTrendData.length) * 100;
                  const yPct = 100 - d.score;

                  return (
                    <div
                      key={`pt-${d.date}`}
                      className="absolute -translate-x-1/2 -translate-y-1/2 z-20 group"
                      style={{ left: `${xPct}%`, top: `${yPct}%` }}
                    >
                      <div className="w-2.5 h-2.5 rounded-full bg-white border-2 border-[#f97316] shadow-xs cursor-pointer group-hover:scale-125 transition-transform" />
                      
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-bold py-1 px-2 rounded-lg pointer-events-none whitespace-nowrap shadow-md z-30">
                        {d.date}: Score {d.score}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Etiquetas del eje X centradas */}
              <div className="flex justify-between w-full text-[11px] text-slate-400 font-medium pt-3 select-none">
                {scoreTrendData.map((d, idx) => {
                  const showLabel = idx % 2 === 0 || idx === scoreTrendData.length - 1;
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
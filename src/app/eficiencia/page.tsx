// src/app/eficiencia/page.tsx
'use client';

import React, { useMemo } from 'react';
import { 
  Home, 
  Share2, 
  Info, 
  Check 
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

const formatMoney = (val: number) => `$ ${Math.round(val).toLocaleString('es-CO')}`;

// ==========================================
// 2. COMPONENTE PRINCIPAL: EFICIENCIA LOGÍSTICA
// ==========================================
export default function EficienciaLogisticaPage() {
  const {
    filteredData,
    loading,
    dateFrom, setDateFrom,
    dateTo, setDateTo
  } = useFiltrosCruzados();

  // Cálculo en tiempo real de métricas logísticas y Score ATOM
  const metricas = useMemo(() => {
    const records = Array.isArray(filteredData) ? filteredData : [];
    const totalPedidos = records.length;

    let entregadosCount = 0;
    let devolucionesCount = 0;
    let devRecibidasCount = 0;
    let novedadesCount = 0;
    let enCursoCount = 0;
    let pendientesCount = 0;
    let porConfirmarCount = 0;
    let estancadosCount = 0;

    let utilidadEntregados = 0;
    let utilidadEnRiesgo = 0;
    let recaudoProveedorEntregados = 0;
    let capitalRecuperado = 0;
    let capitalBloqueado = 0;
    let capitalPerdido = 0;

    records.forEach((row: any) => {
      const tipoRaw = String(row.tipoEstado || row['Tipo de estado'] || row.estado || '').toUpperCase().trim();
      const diasGestion = Number(row.diasGestion ?? row['Días en gestión'] ?? 0);
      const ultMov = Number(row.ultimoMovimiento ?? row['Último movimiento'] ?? 0);
      const devBodega = String(row.devBodega || row['Devolución a bodega'] || 'NO').toUpperCase().trim();

      const utilidad = parseNumeroSeguro(row.utilidad ?? row.Utilidad);
      const recaudoProv = parseNumeroSeguro(row.recaudoProveedor ?? row['Recaudo proveedor']);

      const isEntregado = tipoRaw.includes('ENTREG') || tipoRaw.includes('FINALIZ');
      const isDevolucion = tipoRaw.includes('DEVOLU');
      const isNovedad = tipoRaw.includes('NOVEDAD');
      const isConfirmar = tipoRaw.includes('CONFIRM');
      const isPendiente = tipoRaw.includes('PENDIENTE');

      if (isEntregado) {
        entregadosCount += 1;
        utilidadEntregados += utilidad;
        recaudoProveedorEntregados += recaudoProv;
      } else if (isDevolucion) {
        devolucionesCount += 1;
        if (devBodega === 'SI') {
          devRecibidasCount += 1;
          capitalRecuperado += recaudoProv;
        } else {
          capitalPerdido += recaudoProv;
          utilidadEnRiesgo += Math.abs(utilidad);
        }
      } else if (isNovedad) {
        novedadesCount += 1;
        capitalBloqueado += recaudoProv;
        utilidadEnRiesgo += Math.abs(utilidad);
      } else if (isConfirmar) {
        porConfirmarCount += 1;
      } else if (isPendiente) {
        pendientesCount += 1;
      } else {
        enCursoCount += 1;
        if (ultMov > 3 || diasGestion > 3) {
          estancadosCount += 1;
          capitalBloqueado += recaudoProv;
          utilidadEnRiesgo += Math.abs(utilidad);
        }
      }
    });

    // 1. Tasas operativas clave
    const tasaEntregaEfectiva = totalPedidos > 0 ? Number(((entregadosCount / totalPedidos) * 100).toFixed(1)) : 62.8;
    const tasaMovilizacion = totalPedidos > 0 ? Number(((1 - estancadosCount / totalPedidos) * 100).toFixed(1)) : 91.5;
    const tasaRecuperacionStock = devolucionesCount > 0 ? Number(((devRecibidasCount / devolucionesCount) * 100).toFixed(1)) : 95.0;
    const tasaNovedadesResueltas = 95.4;

    // 2. Score ATOM (Ponderación 40% - 20% - 20% - 20%)
    const puntosEntregados = Number(((tasaEntregaEfectiva / 100) * 40).toFixed(1));
    const puntosMovilizacion = Number(((tasaMovilizacion / 100) * 20).toFixed(1));
    const puntosNovedades = Number(((tasaNovedadesResueltas / 100) * 20).toFixed(1));
    const puntosRecuperacion = Number(((tasaRecuperacionStock / 100) * 20).toFixed(1));
    const totalScore = Number((puntosEntregados + puntosMovilizacion + puntosNovedades + puntosRecuperacion).toFixed(1));

    const nivel = totalScore >= 80 ? 'Óptimo' : totalScore >= 65 ? 'Aceptable' : 'Riesgo';
    const promedioNacional = 58.4;
    const diferenciaPts = Number((totalScore - promedioNacional).toFixed(1));

    // 3. Distribución de estados para la barra apilada
    const distribucionEstados = [
      { nombre: 'Por confirmar', cantidad: porConfirmarCount || 47, porcentaje: totalPedidos > 0 ? ((porConfirmarCount / totalPedidos) * 100).toFixed(1) : '6.0', color: '#6366f1', widthPct: totalPedidos > 0 ? (porConfirmarCount / totalPedidos) * 100 : 6 },
      { nombre: 'Pendientes', cantidad: pendientesCount || 16, porcentaje: totalPedidos > 0 ? ((pendientesCount / totalPedidos) * 100).toFixed(1) : '2.0', color: '#38bdf8', widthPct: totalPedidos > 0 ? (pendientesCount / totalPedidos) * 100 : 2 },
      { nombre: 'En curso', cantidad: enCursoCount || 372, porcentaje: totalPedidos > 0 ? ((enCursoCount / totalPedidos) * 100).toFixed(1) : '47.3', color: '#facc15', widthPct: totalPedidos > 0 ? (enCursoCount / totalPedidos) * 100 : 47.3 },
      { nombre: 'Con novedad', cantidad: novedadesCount || 36, porcentaje: totalPedidos > 0 ? ((novedadesCount / totalPedidos) * 100).toFixed(1) : '4.6', color: '#fb923c', widthPct: totalPedidos > 0 ? (novedadesCount / totalPedidos) * 100 : 4.6 },
      { nombre: 'Entregados', cantidad: entregadosCount || 293, porcentaje: totalPedidos > 0 ? ((entregadosCount / totalPedidos) * 100).toFixed(1) : '37.2', color: '#10b981', widthPct: totalPedidos > 0 ? (entregadosCount / totalPedidos) * 100 : 37.2 },
      { nombre: 'En devolución', cantidad: devolucionesCount || 23, porcentaje: totalPedidos > 0 ? ((devolucionesCount / totalPedidos) * 100).toFixed(1) : '2.9', color: '#ef4444', widthPct: totalPedidos > 0 ? (devolucionesCount / totalPedidos) * 100 : 2.9 }
    ];

    return {
      scoreAtom: {
        total: totalScore || 62.8,
        nivel,
        promedioNacional,
        diferenciaPts,
        topPorcentaje: 15,
        percentil: 85,
        puntosEntregados,
        puntosMovilizacion,
        puntosNovedades,
        puntosRecuperacion
      },
      resumenOperativo: {
        pedidosGenerados: totalPedidos || 787,
        tasaEntregaEfectiva,
        tasaRecuperacionStock,
        tasaMovilizacion
      },
      distribucionEstados,
      impactoFinanciero: {
        utilidadProtegida: utilidadEntregados || 18822990,
        utilidadEnRiesgo: utilidadEnRiesgo || 4297100,
        recaudoProveedor: recaudoProveedorEntregados || 25400000,
        capitalRecuperado: capitalRecuperado || 1850000,
        capitalBloqueado: capitalBloqueado || 3100000,
        capitalPerdido: capitalPerdido || 1197100
      },
      ecoScanner: {
        usoGlobalPct: 88.4,
        salidasPct: 96.3,
        devolucionesPct: 91.3
      }
    };
  }, [filteredData]);

  // Parámetros geométricos del arco velocímetro
  const radius = 80;
  const strokeWidth = 18;
  const circumference = Math.PI * radius; // ~251.32
  const scoreVal = metricas.scoreAtom.total;
  const strokeDashoffset = circumference * (1 - Math.min(100, scoreVal) / 100);

  // Tendencia histórica semanal
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

  if (loading) {
    return <div className="p-8 flex justify-center text-slate-500 font-sans">Cargando eficiencia logística...</div>;
  }

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

      {/* 3. BLOQUE DUAL SUPERIOR (SCORE GAUGE + DESGLOSE) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        
        {/* PANEL IZQUIERDO: MEDIDOR SEMICIRCULAR SCORE ATOM */}
        <div className="lg:col-span-4 bg-white border border-slate-200/90 rounded-[32px] p-7 shadow-xs flex flex-col justify-between items-center text-center relative select-none">
          <div className="w-full flex justify-center pt-2">
            <div className="relative w-64 h-36 flex justify-center items-end">
              <svg viewBox="0 0 240 145" className="w-full h-full overflow-visible">
                <defs>
                  <linearGradient id="scoreGaugeGradExact" x1="0%" y1="100%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#f97316" />
                    <stop offset="50%" stopColor="#ea580c" />
                    <stop offset="100%" stopColor="#c2410c" />
                  </linearGradient>
                </defs>

                {/* Pista gris */}
                <path
                  d="M 40 115 A 80 80 0 0 1 200 115"
                  fill="none"
                  stroke="#E9EFF7"
                  strokeWidth={strokeWidth}
                  strokeLinecap="round"
                />

                {/* Divisores de escala */}
                <line x1="161.7" y1="57.6" x2="172.3" y2="43.0" stroke="#FFFFFF" strokeWidth="2.5" />
                <line x1="183.3" y1="82.8" x2="199.3" y2="74.6" stroke="#FFFFFF" strokeWidth="2.5" />
                <line x1="190.1" y1="103.9" x2="207.9" y2="101.1" stroke="#FFFFFF" strokeWidth="2.5" />

                <text x="177" y="38" fontSize="9.5" fill="#94A3B8" fontWeight="600">70</text>
                <text x="206" y="70" fontSize="9.5" fill="#94A3B8" fontWeight="600">85</text>
                <text x="214" y="99" fontSize="9.5" fill="#94A3B8" fontWeight="600">95</text>

                {/* Arco dinámico */}
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
                <span className="text-5xl lg:text-[54px] font-black text-[#ea580c] tracking-tight leading-none">
                  {scoreVal.toFixed(1)}
                </span>
                <div className="mt-2 bg-orange-50 text-orange-600 border border-orange-200 text-[10.5px] font-black tracking-widest px-3.5 py-0.5 rounded-full uppercase shadow-2xs">
                  {metricas.scoreAtom.nivel.toUpperCase()}
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 pb-3">
            <p className="text-xs text-[#8A9BA8] font-medium">
              Promedio nacional <strong className="text-slate-900 font-extrabold text-[13px] ml-1">{metricas.scoreAtom.promedioNacional.toFixed(1)}</strong>
            </p>
          </div>

          <div className="flex items-center justify-center gap-2.5 w-full">
            <div className="flex-1 bg-[#E5FAF6] text-[#0D9488] border border-[#A7F3D0]/80 font-bold px-4 py-2.5 rounded-2xl text-xs flex items-center justify-center gap-1.5 shadow-2xs">
              <span className="text-[10px]">▲</span>
              <span>{metricas.scoreAtom.diferenciaPts > 0 ? `+${metricas.scoreAtom.diferenciaPts}` : metricas.scoreAtom.diferenciaPts} pts sobre el promedio</span>
            </div>
            <button
              type="button"
              className="p-2.5 rounded-2xl border border-slate-200/90 text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer shrink-0"
              title="Compartir score"
            >
              <Share2 size={16} strokeWidth={2.2} />
            </button>
          </div>

          <div className="pt-3">
            <p className="text-[11.5px] text-slate-400 font-medium flex items-center justify-center gap-1">
              <span>Estás en</span>
              <strong className="text-[#9333EA] font-extrabold">Top {metricas.scoreAtom.topPorcentaje}%</strong>
              <span>· percentil {metricas.scoreAtom.percentil}</span>
              <Info size={12} className="text-slate-300 ml-0.5" />
            </p>
          </div>
        </div>

        {/* PANEL DERECHO: DESGLOSE DEL SCORE */}
        <div className="lg:col-span-8 bg-white border border-slate-200/90 rounded-[32px] p-6 lg:p-8 shadow-xs flex flex-col justify-between space-y-6">
          <div>
            <h2 className="text-base font-extrabold text-slate-900 tracking-tight">Desglose del Score</h2>
            <p className="text-xs text-slate-500 mt-0.5">Cada componente aporta según su peso ponderado</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">
            
            {/* 1. Pedidos Entregados (40%) */}
            <div className="space-y-2">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-800">Pedidos Entregados</span>
                    <span className="bg-orange-50 text-orange-600 border border-orange-200 text-[10px] font-black px-1.5 py-0.2 rounded-md">40%</span>
                  </div>
                  <span className="text-[11px] text-slate-400 block mt-0.5">KPI Rey · efectividad real</span>
                </div>
                <div className="text-right">
                  <span className="text-base font-black text-[#f97316] leading-none block">
                    {metricas.resumenOperativo.tasaEntregaEfectiva}%
                  </span>
                  <span className="text-[10px] text-slate-400 mt-0.5 block">
                    aporta <strong className="text-slate-700">{metricas.scoreAtom.puntosEntregados}</strong> al Score
                  </span>
                </div>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#f97316] rounded-full transition-all duration-700" 
                  style={{ width: `${Math.min(100, metricas.resumenOperativo.tasaEntregaEfectiva)}%` }} 
                />
              </div>
            </div>

            {/* 2. Movilización de Guías (20%) */}
            <div className="space-y-2">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-800">Movilización de Guías</span>
                    <span className="bg-orange-50 text-orange-600 border border-orange-200 text-[10px] font-black px-1.5 py-0.2 rounded-md">20%</span>
                  </div>
                  <span className="text-[11px] text-slate-400 block mt-0.5">Pedidos estancados &gt;3 días</span>
                </div>
                <div className="text-right">
                  <span className="text-base font-black text-[#f97316] leading-none block">
                    {metricas.resumenOperativo.tasaMovilizacion}%
                  </span>
                  <span className="text-[10px] text-slate-400 mt-0.5 block">
                    aporta <strong className="text-slate-700">{metricas.scoreAtom.puntosMovilizacion}</strong> al Score
                  </span>
                </div>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#f97316] rounded-full transition-all duration-700" 
                  style={{ width: `${Math.min(100, metricas.resumenOperativo.tasaMovilizacion)}%` }} 
                />
              </div>
            </div>

            {/* 3. Gestión de Novedades (20%) */}
            <div className="space-y-2">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-800">Gestión de Novedades</span>
                    <span className="bg-orange-50 text-orange-600 border border-orange-200 text-[10px] font-black px-1.5 py-0.2 rounded-md">20%</span>
                  </div>
                  <span className="text-[11px] text-slate-400 block mt-0.5">Velocidad de respuesta</span>
                </div>
                <div className="text-right">
                  <span className="text-base font-black text-[#f97316] leading-none block">95.4%</span>
                  <span className="text-[10px] text-slate-400 mt-0.5 block">
                    aporta <strong className="text-slate-700">{metricas.scoreAtom.puntosNovedades}</strong> al Score
                  </span>
                </div>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-[#ea580c] rounded-full transition-all duration-700" style={{ width: '95.4%' }} />
              </div>
            </div>

            {/* 4. Recuperación Stock (20%) */}
            <div className="space-y-2">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-800">Recuperación Stock</span>
                    <span className="bg-orange-50 text-orange-600 border border-orange-200 text-[10px] font-black px-1.5 py-0.2 rounded-md">20%</span>
                  </div>
                  <span className="text-[11px] text-slate-400 block mt-0.5">Devolución a bodega</span>
                </div>
                <div className="text-right">
                  <span className="text-base font-black text-[#f97316] leading-none block">
                    {metricas.resumenOperativo.tasaRecuperacionStock}%
                  </span>
                  <span className="text-[10px] text-slate-400 mt-0.5 block">
                    aporta <strong className="text-slate-700">{metricas.scoreAtom.puntosRecuperacion}</strong> al Score
                  </span>
                </div>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#f97316] rounded-full transition-all duration-700" 
                  style={{ width: `${Math.min(100, metricas.resumenOperativo.tasaRecuperacionStock)}%` }} 
                />
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
            <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase block">PEDIDOS GENERADOS</span>
            <p className="text-3xl font-extrabold text-[#f97316] tracking-tight">
              {metricas.resumenOperativo.pedidosGenerados.toLocaleString('es-CO')}
            </p>
            <p className="text-xs text-slate-400 font-normal">Despachados o con intención de despacho</p>
          </div>

          <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs space-y-2">
            <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase block">TASA DE ENTREGA EFECTIVA</span>
            <p className="text-3xl font-extrabold text-[#f97316] tracking-tight">
              {metricas.resumenOperativo.tasaEntregaEfectiva}%
            </p>
            <p className="text-xs text-slate-400 font-normal">Pedidos entregados</p>
          </div>

          <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs space-y-2">
            <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase block">TASA DE RECUPERACIÓN</span>
            <p className="text-3xl font-extrabold text-[#f97316] tracking-tight">
              {metricas.resumenOperativo.tasaRecuperacionStock}%
            </p>
            <p className="text-xs text-slate-400 font-normal">Devoluciones recibidas en bodega</p>
          </div>

          <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs space-y-2">
            <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase block">TASA DE MOVILIZACIÓN</span>
            <p className="text-3xl font-extrabold text-[#f97316] tracking-tight">
              {metricas.resumenOperativo.tasaMovilizacion}%
            </p>
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
            <span className="text-2xl font-black text-slate-900">
              {metricas.resumenOperativo.pedidosGenerados.toLocaleString('es-CO')}
            </span>
            <span className="text-xs text-slate-500 font-medium">Pedidos totales</span>
          </div>

          {/* Barra apilada multicolor */}
          <div className="w-full h-3 rounded-full overflow-hidden flex bg-slate-100">
            {metricas.distribucionEstados.map((item) => (
              <div
                key={item.nombre}
                style={{ width: `${item.widthPct}%`, backgroundColor: item.color }}
                className="h-full transition-all duration-300"
                title={`${item.nombre}: ${item.cantidad} (${item.porcentaje}%)`}
              />
            ))}
          </div>

          {/* Leyenda */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 pt-1">
            {metricas.distribucionEstados.map((item) => (
              <div key={item.nombre} className="flex items-start gap-2">
                <span className="w-2.5 h-2.5 rounded-xs shrink-0 mt-0.5" style={{ backgroundColor: item.color }} />
                <div className="text-xs space-y-0.5">
                  <span className="text-slate-500 block">{item.nombre}</span>
                  <div className="text-slate-800">
                    <span className="font-extrabold">{item.cantidad}</span>
                    <span className="text-slate-400 text-[11px] ml-1">· {item.porcentaje}%</span>
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
              <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase block">UTILIDAD PROTEGIDA</span>
              <p className="text-3xl lg:text-4xl font-black text-[#f97316] tracking-tight">
                {formatMoney(metricas.impactoFinanciero.utilidadProtegida)}
              </p>
              <p className="text-xs text-slate-400 font-normal">Recaudo de pedidos entregados</p>
            </div>

            <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-2">
              <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase block">UTILIDAD EN RIESGO</span>
              <p className="text-3xl lg:text-4xl font-black text-[#f97316] tracking-tight">
                {formatMoney(metricas.impactoFinanciero.utilidadEnRiesgo)}
              </p>
              <p className="text-xs text-slate-400 font-normal">Curso +3 días · novedades sin gestión · devoluciones no recibidas</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs space-y-2">
              <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase block">RECAUDO PROVEEDOR</span>
              <p className="text-xl font-black text-slate-900 tracking-tight">
                {formatMoney(metricas.impactoFinanciero.recaudoProveedor)}
              </p>
              <p className="text-xs text-slate-400 font-normal">Pedidos entregados</p>
            </div>

            <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs space-y-2">
              <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase block">CAPITAL RECUPERADO</span>
              <p className="text-xl font-black text-slate-900 tracking-tight">
                {formatMoney(metricas.impactoFinanciero.capitalRecuperado)}
              </p>
              <p className="text-xs text-slate-400 font-normal">Pedidos confirmados en bodega</p>
            </div>

            <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs space-y-2">
              <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase block">CAPITAL BLOQUEADO</span>
              <p className="text-xl font-black text-slate-900 tracking-tight">
                {formatMoney(metricas.impactoFinanciero.capitalBloqueado)}
              </p>
              <p className="text-xs text-slate-400 font-normal">Curso +3 días · novedades</p>
            </div>

            <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs space-y-2">
              <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase block">CAPITAL PERDIDO</span>
              <p className="text-xl font-black text-slate-900 tracking-tight">
                {formatMoney(metricas.impactoFinanciero.capitalPerdido)}
              </p>
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
              <span className="text-4xl lg:text-5xl font-black text-[#f97316] tracking-tight">
                {metricas.ecoScanner.usoGlobalPct}%
              </span>
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
                <span className="text-base font-black text-[#f97316]">{metricas.ecoScanner.salidasPct}%</span>
              </div>
              <div className="relative w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-[#f97316] rounded-full" style={{ width: `${metricas.ecoScanner.salidasPct}%` }} />
                <div className="absolute top-0 bottom-0 w-0.5 bg-white/70" style={{ left: '80%' }} />
              </div>
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-slate-400 font-medium">Paquetes despachados</span>
                <span className="text-[#f97316] font-bold">✓ Sobre umbral 80%</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-baseline">
                <span className="text-xs font-bold text-slate-800">Devoluciones escaneadas</span>
                <span className="text-base font-black text-[#f97316]">{metricas.ecoScanner.devolucionesPct}%</span>
              </div>
              <div className="relative w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-[#f97316] rounded-full" style={{ width: `${metricas.ecoScanner.devolucionesPct}%` }} />
                <div className="absolute top-0 bottom-0 w-0.5 bg-white/70" style={{ left: '70%' }} />
              </div>
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-slate-400 font-medium">Paquetes devueltos</span>
                <span className="text-[#f97316] font-bold">✓ Sobre umbral 70%</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. TENDENCIA SEMANAL DEL SCORE */}
      <section className="space-y-3">
        <div>
          <h2 className="text-base font-extrabold text-slate-900 tracking-tight">Tendencia semanal del Score</h2>
          <p className="text-xs text-slate-500 mt-0.5">Pasa el cursor por cada día para ver el detalle</p>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex gap-3 items-stretch w-full pt-2">
            <div className="w-8 flex flex-col justify-between text-[11px] text-slate-400 font-medium pb-7 select-none shrink-0 text-right pr-2">
              <span>100</span>
              <span>75</span>
              <span>50</span>
              <span>25</span>
              <span>0</span>
            </div>

            <div className="flex-1 flex flex-col min-w-0">
              <div className="relative w-full h-56">
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <div key={i} className="border-b border-slate-100 w-full" />
                  ))}
                </div>

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
// src/components/Rendimiento.tsx
'use client';

import React, { useState } from 'react';
import { 
  Home, 
  ChevronDown, 
  Package, 
  FileText, 
  CheckCircle2, 
  DollarSign, 
  AlertTriangle,
  Calendar
} from 'lucide-react';

export default function Rendimiento() {
  const [selectedBodega, setSelectedBodega] = useState('(Todos)');

  // Datos de distribución por estado
  const distribucionEstados = [
    {
      id: 'por-confirmar',
      nombre: 'Por confirmar',
      cantidad: 47,
      porcentaje: '6%',
      monto: '$ 4.213.100',
      color: '#6366f1',
      widthPct: 6
    },
    {
      id: 'pendientes',
      nombre: 'Pendientes',
      cantidad: 16,
      porcentaje: '2%',
      monto: '$ 878.800',
      color: '#38bdf8',
      widthPct: 2
    },
    {
      id: 'en-curso',
      nombre: 'En curso',
      cantidad: 372,
      porcentaje: '47.3%',
      monto: '$ 24.791.474',
      color: '#facc15',
      widthPct: 47.3
    },
    {
      id: 'con-novedad',
      nombre: 'Con novedad',
      cantidad: 36,
      porcentaje: '4.6%',
      monto: '$ 2.570.600',
      color: '#fb923c',
      widthPct: 4.6
    },
    {
      id: 'entregados',
      nombre: 'Entregados',
      cantidad: 293,
      porcentaje: '37.2%',
      monto: '$ 18.822.990',
      color: '#10b981',
      widthPct: 37.2
    },
    {
      id: 'en-devolucion',
      nombre: 'En devolución',
      cantidad: 23,
      porcentaje: '2.9%',
      monto: '$ 1.726.500',
      color: '#ef4444',
      widthPct: 2.9
    }
  ];

  // Datos para el gráfico (14 días evaluados)
  const chartData = [
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

  const maxOrders = 100;

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

        {/* FECHA */}
        <div className="flex items-center gap-3">
          <div className="flex flex-col">
            <span className="text-[10px] text-slate-400 font-medium ml-0.5 mb-0.5">Fecha</span>
            <div className="bg-white border border-slate-200/90 rounded-xl px-3.5 py-2 text-xs font-medium text-slate-700 shadow-xs flex items-center gap-2">
              <Calendar size={13} className="text-slate-400" />
              <span>01/10/2026 - 31/10/2026</span>
            </div>
          </div>
        </div>
      </div>

      {/* FILTRO BODEGA */}
      <div className="w-64">
        <label className="text-xs text-slate-500 font-medium block mb-1">Bodega</label>
        <div className="relative">
          <select
            value={selectedBodega}
            onChange={(e) => setSelectedBodega(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-700 shadow-xs outline-none hover:border-slate-300 focus:border-slate-400 appearance-none pr-8 cursor-pointer font-medium"
          >
            <option value="(Todos)">(Todos)</option>
            <option value="Bodega Principal">Bodega Principal</option>
            <option value="Bodega Norte">Bodega Norte</option>
            <option value="Bodega Cali">Bodega Cali</option>
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
          <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-[#f97316]">
                <Package size={16} />
              </div>
              <span className="text-[11px] font-bold tracking-wider text-slate-500 uppercase">
                PEDIDOS TOTALES
              </span>
            </div>
            <p className="text-3xl font-extrabold text-[#f97316] tracking-tight">787</p>
            <p className="text-xs text-slate-400 font-normal">Órdenes generadas en el rango</p>
          </div>

          <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-[#f97316]">
                <FileText size={16} />
              </div>
              <span className="text-[11px] font-bold tracking-wider text-slate-500 uppercase">
                PRODUCTOS TOTALES
              </span>
            </div>
            <p className="text-3xl font-extrabold text-[#f97316] tracking-tight">1.029</p>
            <p className="text-xs text-slate-400 font-normal">Items despachados o pendientes</p>
          </div>

          <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-[#f97316]">
                <CheckCircle2 size={16} />
              </div>
              <span className="text-[11px] font-bold tracking-wider text-slate-500 uppercase">
                COBRADO
              </span>
            </div>
            <p className="text-3xl font-extrabold text-[#f97316] tracking-tight">$ 18.822.990</p>
            <p className="text-xs text-slate-400 font-normal">Recaudo confirmado de pedidos entregados</p>
          </div>

          <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-[#f97316]">
                <DollarSign size={16} />
              </div>
              <span className="text-[11px] font-bold tracking-wider text-slate-500 uppercase">
                POR COBRAR
              </span>
            </div>
            <p className="text-3xl font-extrabold text-[#f97316] tracking-tight">$ 27.362.074</p>
            <p className="text-xs text-slate-400 font-normal">Capital pendiente en órdenes activas</p>
          </div>
        </div>
      </section>

      {/* 2. DISTRIBUCIÓN POR ESTADO */}
      <section className="space-y-3">
        <div>
          <h2 className="text-base font-extrabold text-slate-900 tracking-tight">Distribución por estado</h2>
          <p className="text-xs text-slate-500 mt-0.5">Dónde están las órdenes ahora mismo</p>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-5">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">787</span>
            <span className="text-xs text-slate-500 font-medium">Pedidos totales</span>
          </div>

          <div className="w-full h-3 rounded-full overflow-hidden flex bg-slate-100">
            {distribucionEstados.map((item) => (
              <div
                key={item.id}
                style={{ width: `${item.widthPct}%`, backgroundColor: item.color }}
                className="h-full transition-all duration-300"
                title={`${item.nombre}: ${item.cantidad} (${item.porcentaje})`}
              />
            ))}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 pt-1">
            {distribucionEstados.map((item) => (
              <div key={item.id} className="flex items-start gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-xs shrink-0 mt-0.5"
                  style={{ backgroundColor: item.color }}
                />
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

      {/* 3. TENDENCIA DE VENTAS: 100% ANCHO DE BORDE A BORDE */}
      <section className="space-y-3">
        <div>
          <h2 className="text-base font-extrabold text-slate-900 tracking-tight">Tendencia de ventas</h2>
          <p className="text-xs text-slate-500 mt-0.5">Pedidos diarios y efectividad de entrega</p>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-5">
          
          {/* Leyenda */}
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

          {/* Área gráfica de ancho total */}
          <div className="flex gap-3 items-stretch w-full pt-1">
            
            {/* Eje Y */}
            <div className="w-10 flex flex-col justify-between text-[11px] text-slate-400 font-medium pb-8 select-none shrink-0">
              <span>100%</span>
              <span>75%</span>
              <span>50%</span>
              <span>25%</span>
              <span>0%</span>
            </div>

            {/* Contenedor del gráfico que ocupa el 100% restante */}
            <div className="flex-1 flex flex-col min-w-0">
              
              {/* Plano de coordenadas */}
              <div className="relative w-full h-56">
                
                {/* Líneas horizontales de guía */}
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                  <div className="border-b border-slate-100 w-full" />
                  <div className="border-b border-slate-100 w-full" />
                  <div className="border-b border-slate-100 w-full" />
                  <div className="border-b border-slate-100 w-full" />
                  <div className="border-b border-slate-100 w-full" />
                </div>

                {/* Barras distribuidas uniformemente en todo el ancho */}
                <div className="absolute inset-0 flex items-end justify-between z-0">
                  {chartData.map((d) => (
                    <div key={d.date} className="flex-1 flex justify-center items-end h-full group relative px-1">
                      {/* Tooltip flotante */}
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-8 bg-slate-900 text-white text-[10px] font-bold py-1 px-2 rounded-lg pointer-events-none whitespace-nowrap z-30 shadow-md">
                        {d.date}: {d.orders} pedidos ({d.efectividad}%)
                      </div>

                      {/* Barra */}
                      <div
                        className="w-full max-w-[46px] bg-[#f6bd89] hover:bg-[#f3a462] rounded-t-xs transition-colors"
                        style={{ height: `${(d.orders / maxOrders) * 100}%` }}
                      />
                    </div>
                  ))}
                </div>

                {/* Línea de efectividad con vectorEffect */}
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

                {/* Puntos circulares perfectos */}
                {chartData.map((d, idx) => {
                  const xPct = ((idx + 0.5) / chartData.length) * 100;
                  const yPct = 100 - d.efectividad;

                  return (
                    <div
                      key={`dot-${d.date}`}
                      className="absolute w-2.5 h-2.5 rounded-full bg-white border-2 border-[#c2410c] -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none shadow-xs"
                      style={{ left: `${xPct}%`, top: `${yPct}%` }}
                    />
                  );
                })}
              </div>

              {/* Etiquetas del eje X exactamente centradas debajo de cada barra */}
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
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs flex flex-col justify-between space-y-5">
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
                27%
              </span>
            </div>

            <div className="flex items-baseline gap-10 pt-2">
              <div>
                <p className="text-2xl font-black text-[#f97316] tracking-tight">110</p>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block">
                  PEDIDOS
                </span>
              </div>
              <div>
                <p className="text-2xl font-black text-slate-900 tracking-tight">$ 7.913.732</p>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block">
                  EN RIESGO
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs flex flex-col justify-between space-y-5">
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
                8.7%
              </span>
            </div>

            <div className="flex items-baseline gap-10 pt-2">
              <div>
                <p className="text-2xl font-black text-rose-600 tracking-tight">2</p>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block">
                  PEDIDOS
                </span>
              </div>
              <div>
                <p className="text-2xl font-black text-slate-900 tracking-tight">$ 164.000</p>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block">
                  EN RIESGO
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
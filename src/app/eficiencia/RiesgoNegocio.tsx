// src/app/rendimiento/RiesgoNegocio.tsx
'use client';

import React from 'react';
import { AlertTriangle } from 'lucide-react';

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
}

const formatMoney = (val: number) => `$ ${Math.round(val || 0).toLocaleString('es-CO')}`;

export default function RiesgoNegocio({ data }: RiesgoNegocioProps) {
  const estancadosCount = data?.estancados?.cantidad ?? 730;
  const estancadosValor = data?.estancados?.valor ?? 54096046;
  const estancadosPct = data?.estancados?.porcentaje ?? 16.4;

  const devNoRecibidasCount = data?.devolucionesNoRecibidas?.cantidad ?? 617;
  const devNoRecibidasValor = data?.devolucionesNoRecibidas?.valor ?? 46078342;
  const devNoRecibidasPct = data?.devolucionesNoRecibidas?.porcentaje ?? 13.9;

  return (
    <section className="space-y-3 font-sans w-full">
      <div>
        <h2 className="text-base font-extrabold text-slate-900 tracking-tight">Riesgo del negocio</h2>
        <p className="text-xs text-slate-500 mt-0.5">Pedidos que requieren atención inmediata</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Pedidos estancados (>3 días) */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-2xs flex flex-col justify-between space-y-5">
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
              {estancadosPct}%
            </span>
          </div>

          <div className="flex items-baseline gap-10 pt-2">
            <div>
              <p className="text-2xl font-black text-[#f97316] tracking-tight">
                {estancadosCount.toLocaleString('es-CO')}
              </p>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block">PEDIDOS</span>
            </div>
            <div>
              <p className="text-2xl font-black text-slate-900 tracking-tight">
                {formatMoney(estancadosValor)}
              </p>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block">EN RIESGO</span>
            </div>
          </div>
        </div>

        {/* Devoluciones no recibidas */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-2xs flex flex-col justify-between space-y-5">
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
              {devNoRecibidasPct}%
            </span>
          </div>

          <div className="flex items-baseline gap-10 pt-2">
            <div>
              <p className="text-2xl font-black text-rose-600 tracking-tight">
                {devNoRecibidasCount.toLocaleString('es-CO')}
              </p>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block">PEDIDOS</span>
            </div>
            <div>
              <p className="text-2xl font-black text-slate-900 tracking-tight">
                {formatMoney(devNoRecibidasValor)}
              </p>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 block">EN RIESGO</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export { RiesgoNegocio };
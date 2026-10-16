// src/app/page.tsx
'use client';

import Link from 'next/link';
import { Package, Store, Activity, FileText, ArrowRight } from 'lucide-react';

export default function Home() {
  const modulos = [
    {
      titulo: 'Productos',
      descripcion: 'Ranking de referencias por volumen, rentabilidad y efectividad de entrega.',
      icono: <Package size={24} className="text-orange-500" />,
      href: '/productos',
      color: 'hover:border-orange-500/50',
    },
    {
      titulo: 'Negocios',
      descripcion: 'Auditoría de tiendas y canales de venta asociados a tu operación.',
      icono: <Store size={24} className="text-amber-500" />,
      href: '/negocios',
      color: 'hover:border-amber-500/50',
    },
    {
      titulo: 'Eficiencia Logística',
      descripcion: 'Centro de comando Score ATOM, velocímetro e impacto financiero.',
      icono: <Activity size={24} className="text-emerald-500" />,
      href: '/eficiencia',
      color: 'hover:border-emerald-500/50',
    },
    {
      titulo: 'Detalle de Guías',
      descripcion: 'Trazabilidad de órdenes, semáforos de movimiento y agentes CAS.',
      icono: <FileText size={24} className="text-blue-500" />,
      href: '/detalle-guias',
      color: 'hover:border-blue-500/50',
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-8 flex flex-col justify-center items-center font-sans">
      <div className="max-w-4xl w-full space-y-8">
        <div>
          <span className="text-xs font-bold text-orange-600 bg-orange-50 border border-orange-200 px-3 py-1 rounded-full uppercase tracking-wider">
            ATOM PRO MPV
          </span>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight mt-3">
            Centro de Comando Logístico
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Métricas procesadas en tiempo real desde <code className="font-mono text-slate-700 bg-slate-100 px-1 py-0.5 rounded">public/data/bdatom.json</code>
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {modulos.map((mod) => (
            <Link
              key={mod.href}
              href={mod.href}
              className={`p-6 bg-white border border-slate-200 rounded-3xl shadow-xs transition-all flex flex-col justify-between group hover:shadow-md ${mod.color}`}
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center">
                  {mod.icono}
                </div>
                <h2 className="text-base font-bold text-slate-900 group-hover:text-orange-600 transition-colors">
                  {mod.titulo}
                </h2>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {mod.descripcion}
                </p>
              </div>

              <div className="pt-4 mt-2 flex items-center gap-1 text-xs font-bold text-slate-700 group-hover:text-orange-600 transition-colors">
                <span>Ingresar al módulo</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
// src/components/DashboardLayout.tsx
'use client';

import React, { useState, ReactNode } from 'react';
import { 
  Atom, 
  ChevronDown, 
  ChevronUp, 
  Bell, 
  Calendar 
} from 'lucide-react';

interface Props {
  children: ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function DashboardLayout({ children, activeTab, setActiveTab }: Props) {
  const [isOpen, setIsOpen] = useState(true);

  // Listado de pantallas del sistema
  const atomSubItems = [
    { id: 'eficiencia', label: 'Eficiencia Logística' },
    { id: 'rendimiento', label: 'Rendimiento' },
    { id: 'alertas', label: 'Panel de alertas' },
    { id: 'guias', label: 'Detalle de Guías' },
    { id: 'negocios', label: 'Negocios' },
    { id: 'productos', label: 'Productos' },
    { id: 'transportadoras', label: 'Transportadoras' }
  ];

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden font-sans text-slate-800 antialiased">
      
      {/* SIDEBAR LATERAL (MINIMALISTA DROPI) */}
      <aside className="w-64 bg-white border-r border-slate-200/80 flex flex-col shrink-0 select-none z-20">
        
        {/* LOGO SUPERIOR */}
        <div className="h-14 flex items-center px-6 border-b border-slate-100">
          <span className="text-xl font-black tracking-tight text-slate-900">
            Dropi<span className="text-[#ea580c]">.</span>
          </span>
        </div>

        {/* NAVEGACIÓN */}
        <nav className="flex-1 overflow-y-auto px-4 py-5">
          
          {/* BOTÓN DE MENÚ PRINCIPAL DESPLEGABLE */}
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all cursor-pointer ${
              isOpen 
                ? 'bg-[#FFF6F2] text-[#ea580c] font-medium' 
                : 'text-slate-600 hover:bg-slate-50 font-medium'
            }`}
          >
            <div className="flex items-center gap-3">
              <Atom size={18} className={isOpen ? 'text-[#ea580c]' : 'text-slate-500'} />
              <span className="text-[14px]">ATOM</span>
            </div>
            {isOpen ? (
              <ChevronUp size={16} className="text-[#ea580c]" />
            ) : (
              <ChevronDown size={16} className="text-slate-400" />
            )}
          </button>

          {/* LISTA VERTICAL DE SUB-ITEMS (TEXTO PLANO, EXACTO A LA REFERENCIA) */}
          {isOpen && (
            <div className="mt-3.5 space-y-3.5 pl-10 text-[13px]">
              {atomSubItems.map((item) => {
                const isActive = activeTab === item.id;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full text-left block transition-colors cursor-pointer ${
                      isActive
                        ? 'text-[#ea580c] font-medium'
                        : 'text-[#64748b] hover:text-slate-900 font-normal'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          )}

        </nav>
      </aside>

      {/* ÁREA CENTRAL DE CONTENIDO */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* HEADER SUPERIOR */}
        <header className="h-14 bg-white border-b border-slate-200/80 flex items-center justify-between px-6 shrink-0 z-10">
          <div className="relative">
            <select className="bg-slate-50 border border-slate-200 text-xs font-bold rounded-xl pl-3 pr-8 py-1.5 text-slate-800 outline-none hover:border-slate-300 focus:border-slate-400 appearance-none cursor-pointer">
              <option>Cuenta: PROV. ATOM 1</option>
              <option>Cuenta: IMPORTEK BOGOTA</option>
              <option>Cuenta: BODEGA CALI</option>
            </select>
            <ChevronDown size={14} className="text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
              <Calendar size={13} className="text-slate-400" />
              <span>Próximo corte:</span>
              <span className="text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
                15 días
              </span>
            </div>

            <div className="h-4 w-[1px] bg-slate-200" />

            <button 
              type="button" 
              className="relative p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              title="Notificaciones"
            >
              <Bell size={16} />
              <span className="w-2 h-2 rounded-full bg-[#ea580c] absolute top-1.5 right-1.5 ring-2 ring-white" />
            </button>
          </div>
        </header>

        {/* CONTENEDOR DE PANTALLAS */}
        <main className="flex-1 overflow-y-auto bg-[#F8FAFC]">
          {children}
        </main>

      </div>
    </div>
  );
}
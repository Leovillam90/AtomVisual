// src/components/Sidebar.tsx (o src/app/Sidebar.tsx)
'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  BarChart2, 
  Search, 
  ShoppingCart, 
  ShieldCheck, 
  Truck, 
  UserCheck, 
  Store, 
  History, 
  Users, 
  UserPlus, 
  Building2, 
  Settings, 
  Calendar, 
  Megaphone, 
  Menu,
  Zap,
  Atom
} from 'lucide-react';

// ==========================================
// 1. ITEMS VISUALES DE DROPI (DESHABILITADOS)
// ==========================================
const DROPI_MENU_ITEMS = [
  { label: 'Inicio', icon: Home },
  { label: 'Dashboard', icon: BarChart2 },
  { label: 'Productos', icon: Search },
  { label: 'Órdenes', icon: ShoppingCart },
  { label: 'Mis Garantias', icon: ShieldCheck },
  { label: 'Logistic', icon: Truck },
  { label: 'Clientes', icon: UserCheck },
  { label: 'Mis Integraciones', icon: Store },
  { label: 'Historial de Cartera', icon: History },
  { label: 'Mis usuarios', icon: Users },
  { label: 'Mis Referidos', icon: UserPlus },
  { label: 'Bodegas', icon: Building2 },
  { label: 'Configuraciones', icon: Settings, hasBadge: true },
  { label: 'Calendario', icon: Calendar },
  { label: 'Marketing', icon: Megaphone },
];

// ==========================================
// 2. ITEMS DE ATOM (HABILITADOS Y FUNCIONALES)
// ==========================================
const ATOM_SUBMENU_ITEMS = [
  { label: 'Eficiencia logística', href: '/eficiencia' },
  { label: 'Rendimiento', href: '/rendimiento' },
  { label: 'Panel de alertas', href: '/alertas' },
  { label: 'Detalle de Guías', href: '/detalle-guias' },
  { label: 'Negocios', href: '/negocios' },
  { label: 'Productos', href: '/productos' },
  { label: 'Transportadoras', href: '/transportadoras' },
  { label: 'Líder de cuenta', href: '#', disabled: true },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-[215px] h-screen bg-white border-r border-slate-200/90 flex flex-col shrink-0 sticky top-0 select-none z-40 font-sans">
      
      {/* 1. CABECERA: LOGO DROPI + BOTÓN MENÚ HAMBURGUESA */}
      <div className="h-16 px-4 flex items-center justify-between border-b border-slate-50 shrink-0">
        {/* Logo Dropi con robot naranja */}
        <div className="flex items-center gap-2">
          <svg className="w-8 h-8 text-[#f3962e]" viewBox="0 0 40 40" fill="currentColor">
            <path d="M20 4C11.163 4 4 11.163 4 20s7.163 16 16 16 16-7.163 16-16S28.837 4 20 4zm0 28c-6.627 0-12-5.373-12-12S13.373 8 20 8s12 5.373 12 12-5.373 12-12 12z" opacity="0.2"/>
            <circle cx="20" cy="20" r="10" />
            <circle cx="16" cy="18" r="2.2" fill="#fff" />
            <circle cx="24" cy="18" r="2.2" fill="#fff" />
            <path d="M10 20c0-1.5.8-2.5 2-2.5v5c-1.2 0-2-1-2-2.5zm20 0c0 1.5-.8 2.5-2 2.5v-5c1.2 0 2 1 2 2.5z" />
          </svg>
          <span className="text-2xl font-black tracking-tight text-[#f3962e] lowercase">
            dropi
          </span>
        </div>

        {/* Icono de menú hamburguesa */}
        <button 
          type="button" 
          className="text-slate-500 hover:text-slate-800 p-1.5 rounded-lg hover:bg-slate-100 transition cursor-pointer"
        >
          <Menu size={18} />
        </button>
      </div>

      {/* 2. CONTENEDOR SCROLLABLE */}
      <div className="flex-1 overflow-y-auto py-2 px-2.5 space-y-0.5 custom-sidebar-scroll text-[13px]">
        
        {/* MENÚ SUPERIOR DE DROPI (SOLO VISUAL / DESHABILITADO) */}
        {DROPI_MENU_ITEMS.map((item, idx) => {
          const IconComponent = item.icon;
          return (
            <div
              key={idx}
              className="flex items-center justify-between px-3 py-2 rounded-xl text-slate-600 hover:bg-slate-50/70 transition-colors pointer-events-none cursor-default"
            >
              <div className="flex items-center gap-3">
                <IconComponent size={16} className="text-slate-500 shrink-0 stroke-[1.8]" />
                <span className="font-normal truncate">{item.label}</span>
              </div>

              {/* Badge verde "Nuevo" para Configuraciones */}
              {item.hasBadge && (
                <span className="bg-[#42c797] text-white text-[10px] font-bold px-2 py-0.2 rounded-full uppercase tracking-wider scale-90">
                  Nuevo
                </span>
              )}
            </div>
          );
        })}

        {/* ======================================================== */}
        {/* SECCIÓN ATOM (HABILITADA, INTERACTIVA Y CONECTADA A RUTAS) */}
        {/* ======================================================== */}
        <div className="pt-2 mt-2 border-t border-slate-100">
          
          {/* Título de la sección ATOM con Badge verde */}
          <div className="flex items-center justify-between px-3 py-2 text-slate-800">
            <div className="flex items-center gap-2.5">
              <span className="font-mono text-base font-black text-slate-900 tracking-tighter">
                &#9883;
              </span>
              <span className="font-extrabold text-[13px] tracking-wide text-slate-900">
                ATOM
              </span>
            </div>
            
            <span className="bg-[#42c797] text-white text-[10px] font-bold px-2 py-0.2 rounded-full uppercase tracking-wider scale-90">
              Nuevo
            </span>
          </div>

          {/* Submenú de pantallas ATOM */}
          <div className="pl-6 pr-1 space-y-0.5 pt-0.5">
            {ATOM_SUBMENU_ITEMS.map((sub, sIdx) => {
              const isActive = pathname === sub.href;

              if (sub.disabled) {
                return (
                  <div
                    key={sIdx}
                    className="block px-3 py-1.5 text-xs text-slate-400 pointer-events-none select-none"
                  >
                    {sub.label}
                  </div>
                );
              }

              return (
                <Link
                  key={sIdx}
                  href={sub.href}
                  className={`block px-3 py-1.5 rounded-lg text-xs transition-all duration-150 ${
                    isActive
                      ? 'text-orange-600 font-extrabold bg-orange-50/70'
                      : 'text-slate-600 font-medium hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {sub.label}
                </Link>
              );
            })}
          </div>

        </div>

      </div>

    </aside>
  );
}
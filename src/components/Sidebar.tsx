// src/components/Sidebar.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Menu, 
  ShieldCheck, 
  CreditCard,
  BellRing, 
  TrendingUp, 
  PackageSearch, 
  Store, 
  Package, 
  Truck,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface MenuItem {
  nombre: string;
  ruta: string;
  icono: React.ElementType;
  badge?: string;
  requierePlan?: boolean; // Condición para ocultar si el plan está inactivo
}

const MENU_ITEMS_BASE: MenuItem[] = [
  { nombre: 'Administrador (Agentes)', ruta: '/control', icono: ShieldCheck },
  { nombre: 'Panel de alertas', ruta: '/alertas', icono: BellRing },
  { nombre: 'Eficiencia logística', ruta: '/eficiencia', icono: TrendingUp },
  { nombre: 'Detalle de Guías', ruta: '/detalle-guias', icono: PackageSearch },
  { nombre: 'Negocios', ruta: '/negocios', icono: Store, requierePlan: true },
  { nombre: 'Productos', ruta: '/productos', icono: Package }, // Disponible libre/gratis sin plan
  { nombre: 'Conexiones', ruta: '/conexiones', icono: Package, requierePlan: true },
  { nombre: 'Transportadoras', ruta: '/transportadoras', icono: Truck },
  { nombre: 'Planes de Suscripción', ruta: '/planes', icono: CreditCard, badge: 'Pack' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [colapsado, setColapsado] = useState<boolean>(false);
  const [tienePlanActivo, setTienePlanActivo] = useState<boolean>(true);

  // Sincronización en tiempo real con localStorage (estado de /planes)
  const verificarEstadoPlan = () => {
    try {
      const planGuardado = localStorage.getItem('atom_plan_activo');
      // Si no existe, es null o string 'null', el plan está inactivo
      const activo = planGuardado !== null && planGuardado !== 'null' && planGuardado !== '';
      setTienePlanActivo(activo);
    } catch {
      setTienePlanActivo(false);
    }
  };

  useEffect(() => {
    verificarEstadoPlan();

    // Escucha cambios inter-pestañas y eventos personalizados de actualización
    const handleActualizacion = () => verificarEstadoPlan();
    window.addEventListener('storage', handleActualizacion);
    window.addEventListener('atom_plan_updated', handleActualizacion);
    window.addEventListener('atom_tools_updated', handleActualizacion);

    return () => {
      window.removeEventListener('storage', handleActualizacion);
      window.removeEventListener('atom_plan_updated', handleActualizacion);
      window.removeEventListener('atom_tools_updated', handleActualizacion);
    };
  }, []);

  // Filtrar los módulos que requieren plan activo
  const menuItemsVisibles = MENU_ITEMS_BASE.filter((item) => {
    if (item.requierePlan && !tienePlanActivo) {
      return false;
    }
    return true;
  });

  const pathnameNorm = (pathname || '').toLowerCase();

  return (
    <aside 
      className={`bg-white border-r border-slate-200 flex flex-col shrink-0 select-none transition-all duration-300 min-h-screen sticky top-0 h-screen z-40 ${
        colapsado ? 'w-[72px]' : 'w-[250px]'
      }`}
    >
      {/* CABECERA: LOGO DROPI Y BOTÓN DE COLAPSO */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-slate-100">
        {!colapsado ? (
          <Link href="/control" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-full bg-[#FFF0E0] border border-[#FDD9B5] flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-105">
              <div className="w-5 h-5 rounded-full bg-[#FA7C16] flex items-center justify-center gap-0.5">
                <span className="w-1 h-1 bg-white rounded-full" />
                <span className="w-1 h-1 bg-white rounded-full" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black text-[#FA7C16] tracking-tight leading-none lowercase">
                AGENTES
              </span>
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-tight">
                ATOM IA
              </span>
            </div>
          </Link>
        ) : (
          <Link href="/control" className="mx-auto">
            <div className="w-8 h-8 rounded-full bg-[#FFF0E0] border border-[#FDD9B5] flex items-center justify-center shrink-0 hover:scale-105 transition-transform">
              <div className="w-5 h-5 rounded-full bg-[#FA7C16] flex items-center justify-center gap-0.5">
                <span className="w-1 h-1 bg-white rounded-full" />
                <span className="w-1 h-1 bg-white rounded-full" />
              </div>
            </div>
          </Link>
        )}

        <button
          type="button"
          onClick={() => setColapsado((prev) => !prev)}
          className={`p-1.5 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer ${
            colapsado ? 'mt-3 mx-auto' : ''
          }`}
          title={colapsado ? 'Expandir menú' : 'Colapsar menú'}
        >
          {colapsado ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* NAVEGACIÓN PRINCIPAL DINÁMICA */}
      <div className="flex-1 py-4 px-3 flex flex-col justify-between overflow-y-auto">
        <nav className="space-y-1">
          {menuItemsVisibles.map((item) => {
            const Icono = item.icono;
            const estaActivo = 
              pathnameNorm === item.ruta || 
              (pathnameNorm === '/' && item.ruta === '/control');

            return (
              <Link
                key={item.ruta}
                href={item.ruta}
                title={colapsado ? item.nombre : undefined}
                className={`group flex items-center transition-all duration-200 rounded-xl text-xs font-bold ${
                  colapsado ? 'justify-center p-3' : 'py-2.5 px-3 gap-3'
                } ${
                  estaActivo
                    ? 'bg-orange-50 text-[#FA7C16] shadow-2xs font-extrabold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <div className="relative shrink-0 flex items-center justify-center">
                  <Icono 
                    size={18} 
                    strokeWidth={estaActivo ? 2.5 : 2} 
                    className={`transition-transform duration-300 group-hover:scale-110 ${
                      estaActivo ? 'text-[#FA7C16]' : 'text-slate-500 group-hover:text-slate-800'
                    }`} 
                  />
                  {estaActivo && colapsado && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#FA7C16]" />
                  )}
                </div>

                {!colapsado && (
                  <div className="flex items-center justify-between flex-1 min-w-0">
                    <span className="truncate">{item.nombre}</span>
                    {item.badge && (
                      <span className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-orange-100 text-orange-800">
                        {item.badge}
                      </span>
                    )}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* PIE DEL MENÚ CON INDICADOR DE ESTADO DE PLAN */}
        {!colapsado ? (
          <div className="pt-4 border-t border-slate-100 px-2 space-y-1">
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-500">
              <span>Suscripción</span>
              <span className={`font-black ${tienePlanActivo ? 'text-emerald-600' : 'text-amber-600'}`}>
                {tienePlanActivo ? 'Activa' : 'Inactiva'}
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-mono">
              ATOM Agentico IA © 2026
            </p>
          </div>
        ) : (
          <div className="pt-3 border-t border-slate-100 flex justify-center">
            <span 
              className={`w-2 h-2 rounded-full ${tienePlanActivo ? 'bg-emerald-500' : 'bg-amber-500'}`} 
              title={tienePlanActivo ? 'Suscripción Activa' : 'Suscripción Inactiva'} 
            />
          </div>
        )}
      </div>
    </aside>
  );
}
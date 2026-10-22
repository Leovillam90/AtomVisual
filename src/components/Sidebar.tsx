// src/components/Sidebar.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, ShieldCheck, UserCog } from 'lucide-react';

interface MenuItem {
  nombre: string;
  ruta: string;
  esEspecial?: boolean;
  esAdmin?: boolean;
}

const MENU_ATOM: MenuItem[] = [
  { nombre: 'Eficiencia logística', ruta: '/rendimiento' },
  { nombre: 'Panel de alertas', ruta: '/alertas' },
  { nombre: 'Detalle de Guías', ruta: '/detalle-guias' },
  { nombre: 'Negocios', ruta: '/negocios' },
  { nombre: 'Productos', ruta: '/productos' },
  { nombre: 'Transportadoras', ruta: '/transportadoras' },
  // Rutas administrativas (Admin Supremo apunta directo a /Administrador)
  { nombre: 'Admin Supremo', ruta: '/Administrador', esAdmin: true }
];

interface SidebarProps {
  position?: 'left' | 'right';
}

export default function Sidebar({ position = 'left' }: SidebarProps) {
  const pathname = usePathname();
  const [colapsado, setColapsado] = useState(false);

  // Normalización de rutas para evitar fallos de mayúsculas/minúsculas
  const pathnameNorm = (pathname || '').toLowerCase();

  // Índice del primer elemento administrativo para dibujar el separador una sola vez
  const primerIndiceAdmin = MENU_ATOM.findIndex((item) => item.esAdmin);

  return (
    <aside 
      className={`bg-white border-r border-slate-100 flex flex-col shrink-0 select-none transition-all duration-300 min-h-screen ${
        colapsado ? 'w-[72px]' : 'w-[230px]'
      }`}
    >
      {/* CABECERA: LOGO DROPI & BOTÓN HAMBURGUESA */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-slate-50">
        {!colapsado && (
          <Link href="/rendimiento" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#FFF0E0] border border-[#FDD9B5] flex items-center justify-center">
              <div className="w-6 h-6 rounded-full bg-[#FA7C16] flex items-center justify-center gap-0.5">
                <span className="w-1 h-1 bg-white rounded-full" />
                <span className="w-1 h-1 bg-white rounded-full" />
              </div>
            </div>
            <span className="text-2xl font-black text-[#F58220] tracking-tight lowercase">
              dropi
            </span>
          </Link>
        )}

        {colapsado && (
          <div className="mx-auto w-8 h-8 rounded-full bg-[#FFF0E0] border border-[#FDD9B5] flex items-center justify-center">
            <div className="w-6 h-6 rounded-full bg-[#FA7C16] flex items-center justify-center gap-0.5">
              <span className="w-1 h-1 bg-white rounded-full" />
              <span className="w-1 h-1 bg-white rounded-full" />
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={() => setColapsado((prev) => !prev)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
          title={colapsado ? 'Expandir menú' : 'Colapsar menú'}
        >
          <Menu size={18} strokeWidth={2.2} />
        </button>
      </div>

      {/* CONTENEDOR DE NAVEGACIÓN */}
      <div className="flex-1 py-5 px-3 flex flex-col justify-between overflow-y-auto">
        <div className="space-y-4">
          
          {/* TÍTULO ATOM + BADGE NUEVO */}
          <div className={`flex items-center gap-2 px-2 ${colapsado ? 'justify-center' : ''}`}>
            <div className="text-slate-900 shrink-0">
              <svg 
                width="18" 
                height="18" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2.2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="3" />
                <ellipse cx="12" cy="12" rx="9" ry="4" transform="rotate(0 12 12)" />
                <ellipse cx="12" cy="12" rx="9" ry="4" transform="rotate(60 12 12)" />
                <ellipse cx="12" cy="12" rx="9" ry="4" transform="rotate(120 12 12)" />
              </svg>
            </div>

            {!colapsado && (
              <>
                <span className="text-sm font-black text-slate-900 tracking-tight">
                  ATOM
                </span>
                <span className="bg-[#42C797] text-white font-extrabold text-[9.5px] px-2 py-0.5 rounded-md tracking-wider">
                  NUEVO
                </span>
              </>
            )}
          </div>

          {/* LISTA DE ÍTEMS DEL MENÚ */}
          <nav className="space-y-1">
            {MENU_ATOM.map((item, idx) => {
              const itemRutaNorm = item.ruta.toLowerCase();
              const estaActivo = pathnameNorm === itemRutaNorm;
              const esPrimerAdmin = idx === primerIndiceAdmin;

              const esAdminSupremo = 
                itemRutaNorm === '/administrador' || 
                itemRutaNorm === '/administrador/supremo';
              const esAdminNormal = 
                itemRutaNorm === '/administrador/normal';

              return (
                <React.Fragment key={item.ruta}>
                  {/* Separador dinámico antes de los módulos administrativos */}
                  {esPrimerAdmin && !colapsado && (
                    <div className="pt-3 pb-1 px-2 border-t border-slate-100 mt-2">
                      <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
                        Administración
                      </span>
                    </div>
                  )}

                  <Link
                    href={item.ruta}
                    title={item.nombre}
                    className={`block text-xs transition-colors rounded-xl font-medium ${
                      colapsado ? 'text-center py-2.5 px-1 truncate' : 'py-2 px-3'
                    } ${
                      estaActivo
                        ? 'bg-[#FFF7ED] text-[#FA7C16] font-black'
                        : item.esAdmin
                        ? 'text-slate-700 hover:text-slate-900 hover:bg-slate-50 font-semibold'
                        : item.esEspecial
                        ? 'text-[#94A3B8] hover:text-slate-600'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    <span className="truncate flex items-center gap-2">
                      {esAdminNormal && !colapsado && (
                        <UserCog size={13} className="text-blue-500 shrink-0" />
                      )}
                      {esAdminSupremo && !colapsado && (
                        <ShieldCheck size={13} className="text-purple-600 shrink-0" />
                      )}
                      <span className="truncate">{item.nombre}</span>
                    </span>
                  </Link>
                </React.Fragment>
              );
            })}
          </nav>
        </div>

        {/* PIE DEL SIDEBAR */}
        {!colapsado && (
          <div className="pt-4 border-t border-slate-100 text-[10.5px] text-slate-400 text-center font-medium">
            <span>ATOM Solutions © 2026</span>
          </div>
        )}
      </div>
    </aside>
  );
}
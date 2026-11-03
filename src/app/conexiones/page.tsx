// src/app/conexiones/page.tsx
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { 
  Users, 
  UserCheck, 
  Target, 
  TrendingUp, 
  Handshake, 
  Search, 
  Star, 
  ArrowRight, 
  Zap, 
  CheckCircle2, 
  Clock, 
  AlertTriangle,
  BadgePercent,
  MessageSquare
} from 'lucide-react';

interface Conexion {
  id: string;
  sellerName: string;
  sellerNivel: 'Élite' | 'Pro' | 'Estándar';
  tipoMatch: 'Headhunter (Rentabilidad)' | 'Liquidador (Stock Muerto)';
  estado: 'Activa' | 'Pendiente (Pitch Enviado)';
  afinidadAlgoritmica: number;
  fechaConexion: string;
  productoAsignado: string;
  volumenVentasProyectado: string;
  conversionHistórica: number;
}

const CONEXIONES_MOCK: Conexion[] = [
  {
    id: 'CON-001',
    sellerName: 'DropiMaster Ventas',
    sellerNivel: 'Élite',
    tipoMatch: 'Headhunter (Rentabilidad)',
    estado: 'Activa',
    afinidadAlgoritmica: 98.5,
    fechaConexion: 'Hoy, 09:15 AM',
    productoAsignado: 'Smartwatch Ultra Pro T900',
    volumenVentasProyectado: '$ 12.500.000 / mes',
    conversionHistórica: 8.4
  },
  {
    id: 'CON-002',
    sellerName: 'Ecom Express Colombia',
    sellerNivel: 'Élite',
    tipoMatch: 'Liquidador (Stock Muerto)',
    estado: 'Pendiente (Pitch Enviado)',
    afinidadAlgoritmica: 94.2,
    fechaConexion: 'Ayer, 16:30 PM',
    productoAsignado: 'Mini Compresor Eléctrico (Lote 500 und)',
    volumenVentasProyectado: '$ 4.800.000 / mes',
    conversionHistórica: 6.7
  },
  {
    id: 'CON-003',
    sellerName: 'Tienda Nova 24/7',
    sellerNivel: 'Pro',
    tipoMatch: 'Headhunter (Rentabilidad)',
    estado: 'Activa',
    afinidadAlgoritmica: 89.1,
    fechaConexion: '10 Nov 2026',
    productoAsignado: 'Depiladora Láser IPL Ice Cooling',
    volumenVentasProyectado: '$ 8.200.000 / mes',
    conversionHistórica: 5.9
  },
  {
    id: 'CON-004',
    sellerName: 'MegaOfertas Bogotá',
    sellerNivel: 'Élite',
    tipoMatch: 'Headhunter (Rentabilidad)',
    estado: 'Activa',
    afinidadAlgoritmica: 96.0,
    fechaConexion: '08 Nov 2026',
    productoAsignado: 'Kit Cámara de Seguridad Solar 4G',
    volumenVentasProyectado: '$ 15.100.000 / mes',
    conversionHistórica: 9.1
  },
  {
    id: 'CON-005',
    sellerName: 'Bazar Digital Col',
    sellerNivel: 'Estándar',
    tipoMatch: 'Liquidador (Stock Muerto)',
    estado: 'Pendiente (Pitch Enviado)',
    afinidadAlgoritmica: 82.5,
    fechaConexion: 'Hace 3 horas',
    productoAsignado: 'Aspiradora Robótica Smart Clean (Lote Antiguo)',
    volumenVentasProyectado: '$ 2.900.000 / mes',
    conversionHistórica: 4.2
  }
];

export default function ConexionesPage() {
  const [tienePlanValido, setTienePlanValido] = useState<boolean>(true);
  const [filtroTipo, setFiltroTipo] = useState<'TODAS' | 'HEADHUNTER' | 'LIQUIDADOR'>('TODAS');
  const [busqueda, setBusqueda] = useState('');

  useEffect(() => {
    const verificarPlan = () => {
      const planGuardado = localStorage.getItem('atom_plan_activo');
      setTienePlanValido(planGuardado !== null && planGuardado !== 'null' && planGuardado !== '');
    };
    
    verificarPlan();
    window.addEventListener('storage', verificarPlan);
    window.addEventListener('atom_plan_updated', verificarPlan);
    
    return () => {
      window.removeEventListener('storage', verificarPlan);
      window.removeEventListener('atom_plan_updated', verificarPlan);
    };
  }, []);

  const conexionesFiltradas = useMemo(() => {
    return CONEXIONES_MOCK.filter(c => {
      const pasaFiltroTipo = 
        filtroTipo === 'TODAS' || 
        (filtroTipo === 'HEADHUNTER' && c.tipoMatch.includes('Headhunter')) ||
        (filtroTipo === 'LIQUIDADOR' && c.tipoMatch.includes('Liquidador'));
      
      const pasaBusqueda = c.sellerName.toLowerCase().includes(busqueda.toLowerCase()) || 
                           c.productoAsignado.toLowerCase().includes(busqueda.toLowerCase());
      
      return pasaFiltroTipo && pasaBusqueda;
    });
  }, [filtroTipo, busqueda]);

  const kpiActivas = CONEXIONES_MOCK.filter(c => c.estado === 'Activa').length;
  const kpiPendientes = CONEXIONES_MOCK.filter(c => c.estado.includes('Pendiente')).length;

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 p-4 sm:p-6 lg:p-8 font-sans space-y-7">
      
      {/* CABECERA PRINCIPAL */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">Red de Conexiones Comerciales</h1>
            <span className={`font-extrabold text-[10.5px] px-2.5 py-0.5 rounded-full uppercase tracking-wider border flex items-center gap-1.5 ${
              tienePlanValido 
                ? 'bg-purple-50 text-purple-700 border-purple-200' 
                : 'bg-amber-50 text-amber-800 border-amber-200'
            }`}>
              {tienePlanValido ? (
                <><Zap size={10} className="fill-purple-500" /> Match Making Activo</>
              ) : (
                'Agentes en Pausa'
              )}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Monitor de alianzas estratégicas generadas por IA entre tu inventario y los mejores Sellers de Dropi.
          </p>
        </div>
      </div>

      {/* BANNER SI NO HAY PLAN */}
      {!tienePlanValido && (
        <div className="bg-gradient-to-r from-amber-50 via-orange-50/50 to-white border border-amber-200 rounded-[24px] p-5 sm:p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-11 h-11 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 border border-amber-200">
              <AlertTriangle size={20} />
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 bg-amber-100 px-2 py-0.5 rounded border border-amber-200">
                Funcionalidad Limitada
              </span>
              <h2 className="text-base sm:text-lg font-black text-slate-800 tracking-tight">
                Tus agentes de conexión comercial están en pausa
              </h2>
              <p className="text-xs text-slate-600 leading-relaxed max-w-3xl">
                Al activar tu suscripción y adquirir eventos, los agentes <strong>Headhunter</strong> y <strong>Liquidador</strong> comenzarán a buscar Sellers élite automáticamente para vender tus productos de alto margen o vaciar tu stock muerto.
              </p>
            </div>
          </div>

          <Link
            href="/planes"
            className="bg-[#FA7C16] hover:bg-[#EA580C] text-white px-5 py-2.5 rounded-xl text-xs font-black shadow-xs transition-colors flex items-center gap-2 shrink-0 cursor-pointer"
          >
            <span>Activar Plan</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      )}

      {/* KPIS DE CONEXIONES */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">ALIANZAS ACTIVAS</span>
            <Handshake size={16} className="text-purple-500" />
          </div>
          <div>
            <p className="text-3xl font-extrabold text-slate-800 tracking-tight">{kpiActivas}</p>
            <p className="text-xs text-slate-400 font-medium mt-1">Sellers vendiendo tu stock</p>
          </div>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">PITCHES ENVIADOS</span>
            <MessageSquare size={16} className="text-orange-500" />
          </div>
          <div>
            <p className="text-3xl font-extrabold text-slate-800 tracking-tight">{kpiPendientes}</p>
            <p className="text-xs text-slate-400 font-medium mt-1">Esperando respuesta del Seller</p>
          </div>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">VOLUMEN PROYECTADO</span>
            <TrendingUp size={16} className="text-emerald-500" />
          </div>
          <div>
            <p className="text-2xl font-extrabold text-slate-800 tracking-tight">$ 43.5M</p>
            <p className="text-xs text-slate-400 font-medium mt-1">Ingresos estimados por mes</p>
          </div>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">AFINIDAD PROMEDIO</span>
            <Target size={16} className="text-blue-500" />
          </div>
          <div>
            <p className="text-3xl font-extrabold text-slate-800 tracking-tight">92.0%</p>
            <p className="text-xs text-slate-400 font-medium mt-1">Precisión del algoritmo ATOM</p>
          </div>
        </div>
      </div>

      {/* CONTENEDOR PRINCIPAL: FILTROS Y LISTA */}
      <div className="bg-white border border-slate-200/90 rounded-[26px] p-6 shadow-xs space-y-5">
        
        {/* BARRA DE BÚSQUEDA Y FILTROS */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="relative w-full max-w-sm">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Buscar por seller o producto..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:outline-none focus:border-[#FA7C16] focus:ring-1 focus:ring-[#FA7C16] transition-all"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0">
            <button
              type="button"
              onClick={() => setFiltroTipo('TODAS')}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors border cursor-pointer ${
                filtroTipo === 'TODAS' ? 'bg-slate-800 text-white border-slate-800 shadow-2xs' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              Todas
            </button>
            <button
              type="button"
              onClick={() => setFiltroTipo('HEADHUNTER')}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors border flex items-center gap-1.5 cursor-pointer ${
                filtroTipo === 'HEADHUNTER' ? 'bg-purple-50 text-purple-700 border-purple-200 shadow-2xs' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <UserCheck size={14} /> Agente Headhunter
            </button>
            <button
              type="button"
              onClick={() => setFiltroTipo('LIQUIDADOR')}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors border flex items-center gap-1.5 cursor-pointer ${
                filtroTipo === 'LIQUIDADOR' ? 'bg-orange-50 text-orange-700 border-orange-200 shadow-2xs' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <BadgePercent size={14} /> Agente Liquidador
            </button>
          </div>
        </div>

        {/* LISTADO DE CONEXIONES */}
        <div className="space-y-3">
          {conexionesFiltradas.length > 0 ? (
            conexionesFiltradas.map((conexion) => (
              <div 
                key={conexion.id} 
                className="group flex flex-col md:flex-row md:items-center justify-between p-4 sm:p-5 rounded-2xl border border-slate-200 hover:border-[#FA7C16]/50 bg-white hover:shadow-md transition-all gap-4"
              >
                {/* Info Seller */}
                <div className="flex items-center gap-4 min-w-[280px]">
                  <div className="w-12 h-12 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
                    <Users size={20} className="text-slate-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm font-black text-slate-800">{conexion.sellerName}</h3>
                      {conexion.sellerNivel === 'Élite' && (
                        <span className="flex items-center gap-0.5 text-[9px] font-black uppercase tracking-wider text-amber-700 bg-amber-100 border border-amber-200 px-1.5 py-0.5 rounded">
                          <Star size={10} className="fill-amber-500" /> Élite
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-[10.5px] font-bold">
                      <span className={`px-2 py-0.5 rounded border ${
                        conexion.estado === 'Activa' 
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                          : 'bg-slate-100 text-slate-500 border-slate-200'
                      }`}>
                        {conexion.estado === 'Activa' ? (
                          <span className="flex items-center gap-1"><CheckCircle2 size={10} /> Conectado</span>
                        ) : (
                          <span className="flex items-center gap-1"><Clock size={10} /> Pitch Enviado</span>
                        )}
                      </span>
                      <span className="text-slate-400">{conexion.fechaConexion}</span>
                    </div>
                  </div>
                </div>

                {/* Detalles del Match */}
                <div className="flex-1 border-l border-slate-100 pl-0 md:pl-5 mt-2 md:mt-0 space-y-2">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Origen del Match</span>
                    <span className={`text-xs font-bold w-max px-2 py-0.5 rounded ${
                      conexion.tipoMatch.includes('Headhunter') ? 'bg-purple-50 text-purple-700' : 'bg-orange-50 text-orange-700'
                    }`}>
                      {conexion.tipoMatch}
                    </span>
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Producto Asignado</span>
                    <span className="text-xs font-bold text-slate-700 truncate max-w-[200px]" title={conexion.productoAsignado}>
                      {conexion.productoAsignado}
                    </span>
                  </div>
                </div>

                {/* Métricas Algorítmicas */}
                <div className="flex flex-row md:flex-col gap-4 md:gap-1 border-t md:border-t-0 md:border-l border-slate-100 pt-3 md:pt-0 pl-0 md:pl-5 min-w-[140px] text-left md:text-right">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Score Afinidad</span>
                    <span className="text-sm font-black text-[#FA7C16] font-mono flex items-center md:justify-end gap-1">
                      <Zap size={12} className="fill-[#FA7C16]" /> {conexion.afinidadAlgoritmica}%
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Proyección</span>
                    <span className="text-xs font-black text-slate-700 font-mono">
                      {conexion.volumenVentasProyectado}
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-10 bg-slate-50 border border-slate-200 border-dashed rounded-2xl">
              <Search size={24} className="mx-auto text-slate-300 mb-2" />
              <p className="text-xs font-bold text-slate-500">No se encontraron conexiones que coincidan con la búsqueda.</p>
            </div>
          )}
        </div>
      </div>
      
    </div>
  );
}
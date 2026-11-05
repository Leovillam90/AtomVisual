// src/app/conexiones/page.tsx
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { 
  Users, 
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
  MessageSquare,
  Eye,
  Send,
  X,
  PackageCheck,
  Check,
  ShoppingBag,
  Sparkles,
  Lock
} from 'lucide-react';

export interface PropuestaComercial {
  precioBodegaCOP: number;
  precioSugeridoVentaCOP: number;
  margenEstimadoSellerPct: number;
  stockReservadoUnd: number;
  garantiaDespacho: string;
  resumenPitch: string;
  recursosIncluidos: string[];
  fechaEnvio?: string;
}

export interface Conexion {
  id: string;
  sellerName: string;
  sellerNivel: 'Élite' | 'Pro' | 'Estándar';
  tipoMatch: 'Headhunter (Rentabilidad)' | 'Liquidador (Stock Muerto)';
  estado: 'Por Enviar' | 'Enviada' | 'Aceptada' | 'Vendiendo';
  afinidadAlgoritmica: number;
  fechaActualizacion: string;
  productoAsignado: string;
  volumenVentasProyectado: string;
  conversionHistorica: number;
  ventasRealesGeneradas?: string;
  unidadesVendidas?: number;
  propuesta: PropuestaComercial;
}

const CONEXIONES_INICIALES: Conexion[] = [
  {
    id: 'CON-001',
    sellerName: 'DropiMaster Ventas',
    sellerNivel: 'Élite',
    tipoMatch: 'Headhunter (Rentabilidad)',
    estado: 'Vendiendo',
    afinidadAlgoritmica: 98.5,
    fechaActualizacion: 'Hoy, 09:15 AM',
    productoAsignado: 'Smartwatch Ultra Pro T900',
    volumenVentasProyectado: '$ 12.500.000 / mes',
    conversionHistorica: 8.4,
    ventasRealesGeneradas: '$ 14.280.000',
    unidadesVendidas: 154,
    propuesta: {
      precioBodegaCOP: 42000,
      precioSugeridoVentaCOP: 99900,
      margenEstimadoSellerPct: 58,
      stockReservadoUnd: 300,
      garantiaDespacho: '< 24 horas con Eco Scanner',
      resumenPitch: 'Hola equipo DropiMaster. Identificamos que son top seller en tecnología wearable. Disponemos de 300 unidades listas para despacho garantizado con margen superior al 55% para sus pautas de Meta.',
      recursosIncluidos: [
        'Videos publicitarios UGC validados',
        'Landing page optimizada en Shopify/Dropi',
        'Reserva de inventario exclusiva por 15 días'
      ],
      fechaEnvio: '28 Oct 2026'
    }
  },
  {
    id: 'CON-002',
    sellerName: 'MegaOfertas Bogotá',
    sellerNivel: 'Élite',
    tipoMatch: 'Headhunter (Rentabilidad)',
    estado: 'Vendiendo',
    afinidadAlgoritmica: 96.0,
    fechaActualizacion: 'Ayer, 18:20 PM',
    productoAsignado: 'Kit Cámara de Seguridad Solar 4G',
    volumenVentasProyectado: '$ 15.100.000 / mes',
    conversionHistorica: 9.1,
    ventasRealesGeneradas: '$ 18.950.000',
    unidadesVendidas: 112,
    propuesta: {
      precioBodegaCOP: 85000,
      precioSugeridoVentaCOP: 179900,
      margenEstimadoSellerPct: 52,
      stockReservadoUnd: 200,
      garantiaDespacho: 'Mismo día si entra antes de 2:00 PM',
      resumenPitch: 'Oportunidad exclusiva: Kit de seguridad solar autónomo. Excelente rentabilidad para venta por WhatsApp y pauta directa con cumplimiento inmediato en bodega.',
      recursosIncluidos: [
        'Manual de objeciones resueltas para cerradores',
        'Fichas técnicas y certificados vigentes',
        'Garantía directa de 6 meses asumida por bodega'
      ],
      fechaEnvio: '01 Nov 2026'
    }
  },
  {
    id: 'CON-003',
    sellerName: 'Tienda Nova 24/7',
    sellerNivel: 'Pro',
    tipoMatch: 'Headhunter (Rentabilidad)',
    estado: 'Aceptada',
    afinidadAlgoritmica: 89.1,
    fechaActualizacion: '10 Nov 2026',
    productoAsignado: 'Depiladora Láser IPL Ice Cooling',
    volumenVentasProyectado: '$ 8.200.000 / mes',
    conversionHistorica: 5.9,
    ventasRealesGeneradas: '$ 0 (Montando Campaña)',
    unidadesVendidas: 0,
    propuesta: {
      precioBodegaCOP: 55000,
      precioSugeridoVentaCOP: 129000,
      margenEstimadoSellerPct: 57,
      stockReservadoUnd: 150,
      garantiaDespacho: '< 24 horas',
      resumenPitch: 'Propuesta de escala para su nicho de belleza y cuidado personal: stock reservado de depiladoras IPL sin riesgo de quiebre.',
      recursosIncluidos: [
        'Creativos TikTok y Reels en formato 9:16',
        'Copys de alta conversión para TikTok Ads'
      ],
      fechaEnvio: '09 Nov 2026'
    }
  },
  {
    id: 'CON-004',
    sellerName: 'Ecom Express Colombia',
    sellerNivel: 'Élite',
    tipoMatch: 'Liquidador (Stock Muerto)',
    estado: 'Enviada',
    afinidadAlgoritmica: 94.2,
    fechaActualizacion: 'Hace 5 horas',
    productoAsignado: 'Mini Compresor Eléctrico (Lote 500 und)',
    volumenVentasProyectado: '$ 4.800.000 / mes',
    conversionHistorica: 6.7,
    propuesta: {
      precioBodegaCOP: 22000,
      precioSugeridoVentaCOP: 59900,
      margenEstimadoSellerPct: 63,
      stockReservadoUnd: 500,
      garantiaDespacho: '< 24 horas',
      resumenPitch: 'Precio especial de liquidación por volumen total de lote. Margen bruto del 63% para ofertas flash o combos automotrices.',
      recursosIncluidos: [
        'Descuento del 18% adicional sobre precio de lista',
        'Fotos de producto fondo blanco e infografías listas'
      ],
      fechaEnvio: 'Hoy, 08:30 AM'
    }
  },
  {
    id: 'CON-005',
    sellerName: 'Bazar Digital Col',
    sellerNivel: 'Estándar',
    tipoMatch: 'Liquidador (Stock Muerto)',
    estado: 'Por Enviar',
    afinidadAlgoritmica: 82.5,
    fechaActualizacion: 'Generado hace 1 hora',
    productoAsignado: 'Aspiradora Robótica Smart Clean (Lote 120 und)',
    volumenVentasProyectado: '$ 2.900.000 / mes',
    conversionHistorica: 4.2,
    propuesta: {
      precioBodegaCOP: 38000,
      precioSugeridoVentaCOP: 89000,
      margenEstimadoSellerPct: 57,
      stockReservadoUnd: 120,
      garantiaDespacho: '< 24 horas',
      resumenPitch: 'La IA de ATOM detectó afinidad con su catálogo de hogar para liquidar lote remanente de 120 unidades con tarifa preferencial.',
      recursosIncluidos: [
        'Banners promocionales para tienda virtual',
        'Stock bloqueado temporalmente por 7 días'
      ]
    }
  }
];

export default function ConexionesPage() {
  const [planActivo, setPlanActivo] = useState<'rescatista' | 'experto' | 'control_total' | null>(null);
  const [conexiones, setConexiones] = useState<Conexion[]>(CONEXIONES_INICIALES);
  const [filtroEstado, setFiltroEstado] = useState<'TODAS' | 'VENDIENDO' | 'ACEPTADA' | 'ENVIADA' | 'POR_ENVIAR'>('TODAS');
  const [busqueda, setBusqueda] = useState('');
  
  const [conexionSeleccionada, setConexionSeleccionada] = useState<Conexion | null>(null);
  const [enviandoPitch, setEnviandoPitch] = useState<boolean>(false);
  const [mensajeExito, setMensajeExito] = useState<string | null>(null);

  useEffect(() => {
    const verificarPlan = () => {
      const planGuardado = localStorage.getItem('atom_plan_activo');
      if (planGuardado && planGuardado !== 'null' && planGuardado !== '') {
        setPlanActivo(planGuardado as 'rescatista' | 'experto' | 'control_total');
      } else {
        setPlanActivo(null);
      }
    };
    
    verificarPlan();
    window.addEventListener('storage', verificarPlan);
    window.addEventListener('atom_plan_updated', verificarPlan);
    
    return () => {
      window.removeEventListener('storage', verificarPlan);
      window.removeEventListener('atom_plan_updated', verificarPlan);
    };
  }, []);

  // Lógica de acceso: Conexiones requiere plan Control Total.
  // Si no se tiene, funciona como vitrina interactiva bloqueada.
  const tienePlanControlTotal = planActivo === 'control_total';

  const handleEnviarPropuesta = (conexionId: string) => {
    if (!tienePlanControlTotal) {
      alert("Para enviar esta propuesta necesitas el Plan Control Total.");
      return;
    }

    setEnviandoPitch(true);

    setTimeout(() => {
      setConexiones((prev) =>
        prev.map((item) => {
          if (item.id === conexionId) {
            return {
              ...item,
              estado: 'Enviada',
              fechaActualizacion: 'Enviada hace un momento',
              propuesta: {
                ...item.propuesta,
                fechaEnvio: 'Hoy (En vivo)'
              }
            };
          }
          return item;
        })
      );

      setConexionSeleccionada((prev) => {
        if (!prev || prev.id !== conexionId) return prev;
        return {
          ...prev,
          estado: 'Enviada',
          propuesta: {
            ...prev.propuesta,
            fechaEnvio: 'Hoy (En vivo)'
          }
        };
      });

      setEnviandoPitch(false);
      setMensajeExito('¡Propuesta formal enviada al panel del Seller en Dropi exitosamente!');
      setTimeout(() => setMensajeExito(null), 3500);
    }, 650);
  };

  const conexionesFiltradas = useMemo(() => {
    return conexiones.filter((c) => {
      const pasaFiltroEstado = 
        filtroEstado === 'TODAS' ||
        (filtroEstado === 'VENDIENDO' && c.estado === 'Vendiendo') ||
        (filtroEstado === 'ACEPTADA' && c.estado === 'Aceptada') ||
        (filtroEstado === 'ENVIADA' && c.estado === 'Enviada') ||
        (filtroEstado === 'POR_ENVIAR' && c.estado === 'Por Enviar');

      const pasaBusqueda = 
        c.sellerName.toLowerCase().includes(busqueda.toLowerCase()) || 
        c.productoAsignado.toLowerCase().includes(busqueda.toLowerCase());

      return pasaFiltroEstado && pasaBusqueda;
    });
  }, [conexiones, filtroEstado, busqueda]);

  const conteoVendiendo = conexiones.filter((c) => c.estado === 'Vendiendo').length;
  const conteoAceptadas = conexiones.filter((c) => c.estado === 'Aceptada').length;
  const conteoEnviadas = conexiones.filter((c) => c.estado === 'Enviada').length;
  const conteoPorEnviar = conexiones.filter((c) => c.estado === 'Por Enviar').length;

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 p-4 sm:p-6 lg:p-8 font-sans space-y-7 relative">
      
      {/* CABECERA PRINCIPAL CON ESTADO DE PLAN */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">
              Gestión de Acuerdos y Conexiones Comerciales
            </h1>
            <span className={`font-extrabold text-[10.5px] px-2.5 py-0.5 rounded-full uppercase tracking-wider border flex items-center gap-1.5 ${
              tienePlanControlTotal 
                ? 'bg-purple-50 text-purple-700 border-purple-200' 
                : 'bg-amber-50 text-amber-800 border-amber-200'
            }`}>
              {tienePlanControlTotal ? (
                <><Zap size={10} className="fill-purple-500" /> Match Making Activo</>
              ) : (
                <><Lock size={10} className="text-amber-600" /> Requiere Plan Control Total</>
              )}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Supervisa las propuestas generadas por IA, envía nuevas ofertas a Sellers élite y rastrea las ventas activas de cada acuerdo.
          </p>
        </div>
      </div>

      {/* MENSAJE DE CONFIRMACIÓN FLOTANTE */}
      {mensajeExito && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-2xl text-xs font-bold flex items-center justify-between shadow-sm animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
            <span>{mensajeExito}</span>
          </div>
          <button type="button" onClick={() => setMensajeExito(null)} className="text-emerald-600 hover:text-emerald-900 cursor-pointer">
            <X size={14} />
          </button>
        </div>
      )}

      {/* BANNER VITRINA SI NO TIENE CONTROL TOTAL */}
      {!tienePlanControlTotal && (
        <div className="bg-gradient-to-r from-amber-50 via-orange-50/50 to-white border border-amber-200 rounded-[24px] p-5 sm:p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-11 h-11 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 border border-amber-200">
              <Sparkles size={20} />
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 bg-amber-100 px-2 py-0.5 rounded border border-amber-200">
                Módulo Exclusivo
              </span>
              <h2 className="text-base sm:text-lg font-black text-slate-800 tracking-tight">
                Escala tus ventas con Sellers Élite (Agentes Comerciales)
              </h2>
              <p className="text-xs text-slate-600 leading-relaxed max-w-3xl">
                Al activar el <strong>Plan Control Total</strong>, la IA analiza tu catálogo y negocia automáticamente con los vendedores más efectivos de la plataforma para distribuir tu mercancía. Explora debajo una demostración real de los matches generados para ti.
              </p>
            </div>
          </div>

          <Link
            href="/planes"
            className="bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 px-5 py-2.5 rounded-xl text-xs font-black shadow-xs transition-colors flex items-center gap-2 shrink-0 cursor-pointer"
          >
            <span>Hacer Upgrade a Control Total</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      )}

      {/* EMBUDO DE KPIS COMERCIALES */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative">
        {/* Overlay bloqueador visual ligero si no hay plan control total */}
        {!tienePlanControlTotal && (
           <div className="absolute inset-0 bg-slate-50/20 backdrop-blur-[1px] z-10 rounded-2xl pointer-events-none border border-slate-200/50" />
        )}

        {/* KPI 1 */}
        <div 
          onClick={() => setFiltroEstado('VENDIENDO')}
          className={`bg-white border rounded-2xl p-5 shadow-2xs space-y-3 cursor-pointer transition-all hover:scale-[1.01] ${
            filtroEstado === 'VENDIENDO' ? 'border-emerald-500 ring-2 ring-emerald-500/10' : 'border-slate-200/90'
          }`}
        >
          <div className="flex justify-between items-center">
            <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">VENDIENDO AHORA</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <ShoppingBag size={15} />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-extrabold text-slate-800 tracking-tight">{conteoVendiendo}</p>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">Acuerdos Activos</span>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-1">Sellers facturando con tu bodega</p>
          </div>
        </div>

        {/* KPI 2 */}
        <div 
          onClick={() => setFiltroEstado('ACEPTADA')}
          className={`bg-white border rounded-2xl p-5 shadow-2xs space-y-3 cursor-pointer transition-all hover:scale-[1.01] ${
            filtroEstado === 'ACEPTADA' ? 'border-blue-500 ring-2 ring-blue-500/10' : 'border-slate-200/90'
          }`}
        >
          <div className="flex justify-between items-center">
            <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">ACEPTADAS / PREPARACIÓN</span>
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Handshake size={15} />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-extrabold text-slate-800 tracking-tight">{conteoAceptadas}</p>
              <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">Por Pautar</span>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-1">Aceptaron oferta, montando anuncios</p>
          </div>
        </div>

        {/* KPI 3 */}
        <div 
          onClick={() => setFiltroEstado('ENVIADA')}
          className={`bg-white border rounded-2xl p-5 shadow-2xs space-y-3 cursor-pointer transition-all hover:scale-[1.01] ${
            filtroEstado === 'ENVIADA' ? 'border-orange-500 ring-2 ring-orange-500/10' : 'border-slate-200/90'
          }`}
        >
          <div className="flex justify-between items-center">
            <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">PROPUESTAS ENVIADAS</span>
            <div className="w-7 h-7 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center">
              <MessageSquare size={15} />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-extrabold text-slate-800 tracking-tight">{conteoEnviadas}</p>
              <span className="text-xs font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-md">En Negociación</span>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-1">Pitches enviados al buzón del seller</p>
          </div>
        </div>

        {/* KPI 4 */}
        <div 
          onClick={() => setFiltroEstado('POR_ENVIAR')}
          className={`bg-white border rounded-2xl p-5 shadow-2xs space-y-3 cursor-pointer transition-all hover:scale-[1.01] ${
            filtroEstado === 'POR_ENVIAR' ? 'border-purple-500 ring-2 ring-purple-500/10' : 'border-slate-200/90'
          }`}
        >
          <div className="flex justify-between items-center">
            <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">MATCHES POR ENVIAR</span>
            <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <Zap size={15} />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-extrabold text-slate-800 tracking-tight">{conteoPorEnviar}</p>
              <span className="text-xs font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-md">Borradores IA</span>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-1">Ofertas generadas listas para aprobar</p>
          </div>
        </div>
      </div>

      {/* CONTENEDOR PRINCIPAL: FILTROS Y LISTADO */}
      <div className="bg-white border border-slate-200/90 rounded-[26px] p-6 shadow-xs space-y-5 relative">
        
        {/* Overlay ligero sobre el listado si no tiene el plan */}
        {!tienePlanControlTotal && (
           <div className="absolute inset-0 bg-gradient-to-t from-slate-50/70 to-transparent pointer-events-none z-10 rounded-[26px]" />
        )}

        {/* BARRA SUPERIOR */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100 relative z-20">
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

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0">
            <button
              type="button"
              onClick={() => setFiltroEstado('TODAS')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors border cursor-pointer ${
                filtroEstado === 'TODAS' ? 'bg-slate-800 text-white border-slate-800 shadow-2xs' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              Todas ({conexiones.length})
            </button>
            <button
              type="button"
              onClick={() => setFiltroEstado('VENDIENDO')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors border flex items-center gap-1.5 cursor-pointer ${
                filtroEstado === 'VENDIENDO' ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs' : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100/50'
              }`}
            >
              <CheckCircle2 size={13} /> Vendiendo ({conteoVendiendo})
            </button>
            <button
              type="button"
              onClick={() => setFiltroEstado('ACEPTADA')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors border flex items-center gap-1.5 cursor-pointer ${
                filtroEstado === 'ACEPTADA' ? 'bg-blue-600 text-white border-blue-600 shadow-2xs' : 'bg-blue-50 text-blue-800 border-blue-200 hover:bg-blue-100/50'
              }`}
            >
              <Handshake size={13} /> Aceptadas ({conteoAceptadas})
            </button>
            <button
              type="button"
              onClick={() => setFiltroEstado('ENVIADA')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors border flex items-center gap-1.5 cursor-pointer ${
                filtroEstado === 'ENVIADA' ? 'bg-orange-500 text-white border-orange-500 shadow-2xs' : 'bg-orange-50 text-orange-800 border-orange-200 hover:bg-orange-100/50'
              }`}
            >
              <Clock size={13} /> Enviadas ({conteoEnviadas})
            </button>
            <button
              type="button"
              onClick={() => setFiltroEstado('POR_ENVIAR')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors border flex items-center gap-1.5 cursor-pointer ${
                filtroEstado === 'POR_ENVIAR' ? 'bg-purple-600 text-white border-purple-600 shadow-2xs' : 'bg-purple-50 text-purple-800 border-purple-200 hover:bg-purple-100/50'
              }`}
            >
              <Zap size={13} /> Por Enviar ({conteoPorEnviar})
            </button>
          </div>
        </div>

        {/* LISTADO DE TARJETAS DE CONEXIÓN */}
        <div className="space-y-3.5 relative z-20">
          {conexionesFiltradas.length > 0 ? (
            conexionesFiltradas.map((conexion) => {
              const estaVendiendo = conexion.estado === 'Vendiendo';
              const estaAceptada = conexion.estado === 'Aceptada';
              const estaEnviada = conexion.estado === 'Enviada';
              const estaPorEnviar = conexion.estado === 'Por Enviar';

              return (
                <div 
                  key={conexion.id} 
                  className={`group flex flex-col lg:flex-row lg:items-center justify-between p-5 rounded-2xl border transition-all duration-200 gap-5 ${
                    estaVendiendo 
                      ? 'border-emerald-200/90 bg-emerald-50/10 hover:border-emerald-300 hover:shadow-md'
                      : estaAceptada
                      ? 'border-blue-200/90 bg-blue-50/10 hover:border-blue-300 hover:shadow-md'
                      : 'border-slate-200 bg-white hover:border-orange-300/80 hover:shadow-md'
                  }`}
                >
                  <div className="flex items-start sm:items-center gap-3.5 min-w-[260px]">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border ${
                      estaVendiendo 
                        ? 'bg-emerald-100 border-emerald-200 text-emerald-700' 
                        : estaAceptada
                        ? 'bg-blue-100 border-blue-200 text-blue-700'
                        : 'bg-slate-100 border-slate-200 text-slate-500'
                    }`}>
                      <Users size={22} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-sm font-black text-slate-900">{conexion.sellerName}</h3>
                        {conexion.sellerNivel === 'Élite' && (
                          <span className="flex items-center gap-0.5 text-[9.5px] font-black uppercase tracking-wider text-amber-700 bg-amber-100 border border-amber-200 px-1.5 py-0.5 rounded">
                            <Star size={10} className="fill-amber-500" /> Élite
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md border flex items-center gap-1 ${
                          estaVendiendo
                            ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                            : estaAceptada
                            ? 'bg-blue-100 text-blue-800 border-blue-200'
                            : estaEnviada
                            ? 'bg-orange-100 text-orange-800 border-orange-200'
                            : 'bg-purple-100 text-purple-800 border-purple-200'
                        }`}>
                          {estaVendiendo && <><CheckCircle2 size={11} /> Vendiendo Activo</>}
                          {estaAceptada && <><Handshake size={11} /> Acuerdo Aceptado</>}
                          {estaEnviada && <><Clock size={11} /> Propuesta Enviada</>}
                          {estaPorEnviar && <><Zap size={11} /> Match por Enviar</>}
                        </span>
                        <span className="text-[11px] text-slate-400 font-medium">{conexion.fechaActualizacion}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 border-t lg:border-t-0 lg:border-l border-slate-100 pt-3 lg:pt-0 lg:pl-5 space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Producto:</span>
                      <span className="text-xs font-black text-slate-800 truncate max-w-[280px]" title={conexion.productoAsignado}>
                        {conexion.productoAsignado}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span className={`px-2 py-0.5 rounded text-[10.5px] font-bold ${
                        conexion.tipoMatch.includes('Headhunter') 
                          ? 'bg-purple-50 text-purple-700 border border-purple-200' 
                          : 'bg-orange-50 text-orange-700 border border-orange-200'
                      }`}>
                        {conexion.tipoMatch}
                      </span>
                      <span className="text-[11px] text-slate-500">
                        Margen: <strong className="text-slate-800">{conexion.propuesta.margenEstimadoSellerPct}%</strong>
                      </span>
                      <span className="text-[11px] text-slate-500">
                        Reserva: <strong className="text-slate-800">{conexion.propuesta.stockReservadoUnd} und</strong>
                      </span>
                    </div>
                  </div>

                  <div className="border-t lg:border-t-0 lg:border-l border-slate-100 pt-3 lg:pt-0 lg:pl-5 min-w-[170px] space-y-1">
                    {estaVendiendo ? (
                      <div>
                        <span className="text-[10px] uppercase font-bold text-emerald-700 tracking-wider block">
                          Ventas Generadas
                        </span>
                        <p className="text-base font-black text-emerald-700 font-mono">
                          {conexion.ventasRealesGeneradas}
                        </p>
                        <span className="text-[10.5px] text-slate-500 font-medium block">
                          {conexion.unidadesVendidas} despachadas
                        </span>
                      </div>
                    ) : (
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                          Volumen Proyectado
                        </span>
                        <p className="text-sm font-black text-slate-800 font-mono">
                          {conexion.volumenVentasProyectado}
                        </p>
                        <span className="text-[10.5px] text-[#FA7C16] font-bold flex items-center gap-1">
                          <Zap size={11} className="fill-[#FA7C16]" /> {conexion.afinidadAlgoritmica}% afinidad
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="border-t lg:border-t-0 lg:border-l border-slate-100 pt-3 lg:pt-0 lg:pl-5 flex items-center gap-2 justify-end">
                    <button
                      type="button"
                      onClick={() => setConexionSeleccionada(conexion)}
                      className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
                    >
                      <Eye size={14} />
                      <span>Ver Propuesta</span>
                    </button>

                    {estaPorEnviar && (
                      <button
                        type="button"
                        onClick={() => handleEnviarPropuesta(conexion.id)}
                        disabled={enviandoPitch || !tienePlanControlTotal}
                        className={`px-4 py-2 rounded-xl text-xs font-black text-white transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs ${
                          tienePlanControlTotal ? 'bg-[#FA7C16] hover:bg-[#EA580C]' : 'bg-slate-400 cursor-not-allowed'
                        }`}
                      >
                        {tienePlanControlTotal ? <Send size={13} /> : <Lock size={13} />}
                        <span>Enviar</span>
                      </button>
                    )}

                    {estaEnviada && (
                      <button
                        type="button"
                        onClick={() => handleEnviarPropuesta(conexion.id)}
                        disabled={enviandoPitch || !tienePlanControlTotal}
                        className={`px-3 py-2 rounded-xl text-xs font-bold border transition-colors flex items-center gap-1.5 cursor-pointer ${
                          tienePlanControlTotal ? 'text-orange-700 bg-orange-50 hover:bg-orange-100 border-orange-200' : 'text-slate-400 bg-slate-50 border-slate-200 cursor-not-allowed'
                        }`}
                      >
                        {tienePlanControlTotal ? <Send size={12} /> : <Lock size={12} />}
                        <span>Reenviar</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-12 bg-slate-50 border border-slate-200 border-dashed rounded-2xl space-y-2">
              <Search size={26} className="mx-auto text-slate-300" />
              <p className="text-xs font-bold text-slate-600">No se encontraron conexiones.</p>
              <button 
                type="button" 
                onClick={() => { setFiltroEstado('TODAS'); setBusqueda(''); }} 
                className="text-xs font-bold text-[#FA7C16] hover:underline cursor-pointer"
              >
                Limpiar filtros
              </button>
            </div>
          )}
        </div>

      </div>

      {/* MODAL DETALLADO: VER Y ENVIAR PROPUESTA */}
      {conexionSeleccionada && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-slate-200 rounded-[28px] max-w-2xl w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]">
            
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#FA7C16]/10 text-[#FA7C16] border border-[#FA7C16]/20 flex items-center justify-center font-bold">
                  <Handshake size={20} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-black text-slate-900">
                      Propuesta Comercial · {conexionSeleccionada.sellerName}
                    </h3>
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                      {conexionSeleccionada.id}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium">
                    {conexionSeleccionada.tipoMatch} · Afinidad Algorítmica {conexionSeleccionada.afinidadAlgoritmica}%
                  </p>
                </div>
              </div>

              <button 
                type="button" 
                onClick={() => setConexionSeleccionada(null)}
                className="text-slate-400 hover:text-slate-700 p-1.5 rounded-xl hover:bg-slate-100 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-5 text-slate-700">
              
              <div className="flex items-center justify-between p-3.5 rounded-2xl border bg-slate-50 border-slate-200">
                <div className="space-y-0.5">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Estado Actual</span>
                  <p className="text-xs font-black text-slate-800">
                    {conexionSeleccionada.estado === 'Vendiendo' && '✅ Acuerdo Aceptado y Facturando Activamente'}
                    {conexionSeleccionada.estado === 'Aceptada' && '🤝 Aceptada por el Seller (En fase de creativos/pauta)'}
                    {conexionSeleccionada.estado === 'Enviada' && `📨 Enviada al Buzón Dropi (${conexionSeleccionada.propuesta.fechaEnvio || 'Enviada'})`}
                    {conexionSeleccionada.estado === 'Por Enviar' && '📝 Borrador generado por IA (Listo para revisión)'}
                  </p>
                </div>

                {conexionSeleccionada.estado === 'Vendiendo' && (
                  <span className="text-xs font-mono font-black text-emerald-700 bg-emerald-100 px-3 py-1 rounded-xl">
                    {conexionSeleccionada.ventasRealesGeneradas} Facturados
                  </span>
                )}
              </div>

              <div className="space-y-2">
                <span className="text-[11px] font-black uppercase tracking-wider text-slate-400">
                  Condiciones Financieras Sugeridas
                </span>
                
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Tu Precio Bodega</span>
                    <p className="text-base font-black text-slate-900 font-mono mt-0.5">
                      $ {conexionSeleccionada.propuesta.precioBodegaCOP.toLocaleString('es-CO')}
                    </p>
                  </div>

                  <div className="p-3 rounded-2xl bg-orange-50/70 border border-orange-200 text-center">
                    <span className="text-[10px] uppercase font-bold text-orange-900 block">Venta Sugerida</span>
                    <p className="text-base font-black text-[#FA7C16] font-mono mt-0.5">
                      $ {conexionSeleccionada.propuesta.precioSugeridoVentaCOP.toLocaleString('es-CO')}
                    </p>
                  </div>

                  <div className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-center">
                    <span className="text-[10px] uppercase font-bold text-emerald-900 block">Margen Seller</span>
                    <p className="text-base font-black text-emerald-700 font-mono mt-0.5">
                      {conexionSeleccionada.propuesta.margenEstimadoSellerPct}%
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-[11px] font-black uppercase tracking-wider text-slate-400">
                  Texto del Pitch Comercial (Enviado al Seller)
                </span>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs leading-relaxed text-slate-700 font-medium">
                  “{conexionSeleccionada.propuesta.resumenPitch}”
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl border border-slate-200 space-y-2 bg-white">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                    Compromisos de Tu Bodega
                  </span>
                  <div className="space-y-1.5 text-xs">
                    <div className="flex items-center gap-2">
                      <PackageCheck size={14} className="text-[#FA7C16]" />
                      <span>Stock reservado: <strong>{conexionSeleccionada.propuesta.stockReservadoUnd} unds</strong></span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock size={14} className="text-[#FA7C16]" />
                      <span>Despacho: <strong>{conexionSeleccionada.propuesta.garantiaDespacho}</strong></span>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl border border-slate-200 space-y-2 bg-white">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
                    Kit de Marketing Incluido
                  </span>
                  <ul className="space-y-1 text-xs">
                    {conexionSeleccionada.propuesta.recursosIncluidos.map((recurso, idx) => (
                      <li key={idx} className="flex items-center gap-1.5 text-slate-700">
                        <Check size={13} className="text-emerald-500 shrink-0" />
                        <span>{recurso}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

            </div>

            <div className="p-5 border-t border-slate-100 bg-slate-50/60 flex items-center justify-between">
              <button 
                type="button" 
                onClick={() => setConexionSeleccionada(null)}
                className="text-xs font-bold text-slate-500 hover:text-slate-800 px-3 py-2 cursor-pointer"
              >
                Cerrar
              </button>

              <div className="flex items-center gap-2">
                {!tienePlanControlTotal ? (
                  <Link 
                    href="/planes"
                    className="bg-amber-100 hover:bg-amber-200 text-amber-900 px-5 py-2.5 rounded-xl text-xs font-black shadow-xs flex items-center gap-2 cursor-pointer border border-amber-300"
                  >
                    <Lock size={14} />
                    <span>Mejorar a Control Total</span>
                  </Link>
                ) : conexionSeleccionada.estado === 'Por Enviar' ? (
                  <button 
                    type="button" 
                    disabled={enviandoPitch}
                    onClick={() => handleEnviarPropuesta(conexionSeleccionada.id)}
                    className="bg-[#FA7C16] hover:bg-[#EA580C] text-white px-5 py-2.5 rounded-xl text-xs font-black shadow-xs flex items-center gap-2 cursor-pointer"
                  >
                    {enviandoPitch ? (
                      <span>Enviando propuesta...</span>
                    ) : (
                      <>
                        <Send size={14} />
                        <span>Aprobar y Enviar Propuesta</span>
                      </>
                    )}
                  </button>
                ) : (
                  <button 
                    type="button" 
                    disabled={enviandoPitch}
                    onClick={() => handleEnviarPropuesta(conexionSeleccionada.id)}
                    className="bg-slate-800 hover:bg-slate-900 text-white px-5 py-2.5 rounded-xl text-xs font-black shadow-xs flex items-center gap-2 cursor-pointer"
                  >
                    {enviandoPitch ? (
                      <span>Reenviando...</span>
                    ) : (
                      <>
                        <Send size={14} />
                        <span>Reenviar al Seller</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
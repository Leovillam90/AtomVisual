// src/app/alertas/page.tsx
'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { 
  RotateCcw, 
  ArrowRight, 
  CheckCircle2, 
  PackageCheck, 
  ShieldAlert, 
  Sparkles,
  Scale, 
  PackageX, 
  RefreshCcw, 
  Rocket, 
  BarChart3, 
  UserCheck, 
  Crown, 
  BadgePercent, 
  ShieldX, 
  Lock, 
  Zap,
  ExternalLink, 
  Activity,
  AlertTriangle,
  SlidersHorizontal,
  Check
} from 'lucide-react';
import { useFiltrosCruzados } from '@/hooks/useFiltrosCruzados';
import ModalDevoluciones, { GuiaDevolucionReal } from './ModalDevoluciones';

export interface TareaHistorico {
  id: string;
  toolId: string;
  tagTool: string;
  fecha: string;
  tarea: string;
  guias: number;
  recaudo: string;
  estado: 'Completada' | 'En Proceso' | 'Fallida';
  hora: string;
}

interface ResumenGestion {
  confirmadas: GuiaDevolucionReal[];
  reclamadas: GuiaDevolucionReal[];
  montoReclamado: number;
  montoConfirmado: number;
  fechaHora: string;
}

interface ToolSyncItem {
  id: string;
  tag: string;
  nombre: string;
  icono: React.ElementType;
  activo: boolean;
  gestionActivo: string;
  subtextoActivo: string;
  gestionPendiente: string;
  subtextoPendiente: string;
  esOfensivo: boolean;
}

const TOOLS_DEFINICION_BASE: ToolSyncItem[] = [
  {
    id: 'tool1',
    tag: 'TOOL 1',
    nombre: 'Cobranza CAS Cierre Logístico (+30D)',
    icono: Scale,
    activo: true,
    gestionActivo: '1.240 Guías auditadas',
    subtextoActivo: '28 radicaciones CAS automáticas radicadas',
    gestionPendiente: '1.240 Guías por radicar CAS',
    subtextoPendiente: 'Capital por recuperar al activar: $ 3.420.000 COP',
    esOfensivo: false,
  },
  {
    id: 'tool2',
    tag: 'TOOL 2',
    nombre: 'Cobranza CAS Cierre Novedad (+10D)',
    icono: PackageX,
    activo: true,
    gestionActivo: '315 Guías en novedad',
    subtextoActivo: '19 órdenes en abandono indemnizatorio',
    gestionPendiente: '315 Guías en novedad crónica',
    subtextoPendiente: 'Expediente indemnizatorio listo al activar',
    esOfensivo: false,
  },
  {
    id: 'tool3',
    tag: 'TOOL 3',
    nombre: 'Auditoría Devoluciones (+7D)',
    icono: RefreshCcw,
    activo: true,
    gestionActivo: '16 Guías en tránsito',
    subtextoActivo: '8 órdenes pendientes de conciliar en bodega',
    gestionPendiente: '16 Guías sin entrar a bodega',
    subtextoPendiente: 'Auditoría y conciliación listas al activar',
    esOfensivo: false,
  },
  {
    id: 'tool4',
    tag: 'TOOL 4',
    nombre: 'Rescatista Movilización (+3D)',
    icono: Rocket,
    activo: true,
    gestionActivo: '142 Guías rescatadas',
    subtextoActivo: 'Presión activa a transportadoras cada 6h',
    gestionPendiente: '142 Guías estancadas en ruta',
    subtextoPendiente: 'Presión automática lista para enviar al activar',
    esOfensivo: false,
  },
  {
    id: 'tool5',
    tag: 'TOOL 5',
    nombre: 'Reporte Diario Matutino (09:30 AM)',
    icono: BarChart3,
    activo: true,
    gestionActivo: '1 Envío emitido hoy',
    subtextoActivo: 'Balance D-1 enviado por WhatsApp y APP',
    gestionPendiente: '1 Reporte diario pendiente',
    subtextoPendiente: 'Auditoría y balance D-1 listos para emitir',
    esOfensivo: false,
  },
  {
    id: 'tool6',
    tag: 'TOOL 6',
    nombre: 'Headhunter Comercial',
    icono: UserCheck,
    activo: false,
    gestionActivo: '3 / 5 Drops Conectados',
    subtextoActivo: 'Match financiero enviado a Sellers Élite',
    gestionPendiente: '8 Matches Élite detectados',
    subtextoPendiente: 'Pitches listos para enviar a Sellers al activar',
    esOfensivo: true,
  },
  {
    id: 'tool7',
    tag: 'TOOL 7',
    nombre: 'Gobierno de Stock y Exclusividad',
    icono: Crown,
    activo: false,
    gestionActivo: '12 Guías en evaluación',
    subtextoActivo: 'Auditoría de meta mensual día 25',
    gestionPendiente: '2 Contratos por evaluar',
    subtextoPendiente: 'Reasignación de exclusividad lista al activar',
    esOfensivo: true,
  },
  {
    id: 'tool8',
    tag: 'TOOL 8',
    nombre: 'Antiviral de Quiebre de Stock',
    icono: ShieldAlert,
    activo: false,
    gestionActivo: '84 Productos Auditados',
    subtextoActivo: 'Sin límite mensual · Alerta preventiva activa',
    gestionPendiente: '84 Productos por auditar',
    subtextoPendiente: 'Protección contra agotamiento lista al activar',
    esOfensivo: true,
  },
  {
    id: 'tool9',
    tag: 'TOOL 9',
    nombre: 'Liquidador de Capital Muerto',
    icono: BadgePercent,
    activo: false,
    gestionActivo: '2 / 5 Drops Conectados',
    subtextoActivo: 'Oferta relámpago enviada a Sellers top',
    gestionPendiente: '430 Unidades de stock muerto',
    subtextoPendiente: 'Oferta dirigida a Sellers lista para enviar',
    esOfensivo: true,
  },
  {
    id: 'tool10',
    tag: 'TOOL 10',
    nombre: 'Escudo Financiero de Órdenes',
    icono: ShieldX,
    activo: false,
    gestionActivo: '2.840 Pedidos Auditados',
    subtextoActivo: '85 órdenes retenidas por margen negativo',
    gestionPendiente: '85 Órdenes a pérdida detectadas',
    subtextoPendiente: 'Congelamiento de despachos listo al activar',
    esOfensivo: true,
  },
];

const HISTORICO_BASE_INICIAL: TareaHistorico[] = [
  { id: 'HIST-001', toolId: 'tool4', tagTool: 'TOOL 4', fecha: '2026-10-14', tarea: 'Movilización de órdenes estancadas en ruta', guias: 38, recaudo: '$ 2.642.957', estado: 'Completada', hora: '10:09' },
  { id: 'HIST-002', toolId: 'tool1', tagTool: 'TOOL 1', fecha: '2026-10-14', tarea: 'Radicación CAS automática fuera de bodega (+30D)', guias: 28, recaudo: '$ 2.845.000', estado: 'Completada', hora: '08:00' },
  { id: 'HIST-003', toolId: 'tool2', tagTool: 'TOOL 2', fecha: '2026-10-14', tarea: 'Expediente indemnizatorio por abandono (+10D)', guias: 19, recaudo: '$ 1.620.400', estado: 'Completada', hora: '08:00' },
  { id: 'HIST-004', toolId: 'tool5', tagTool: 'TOOL 5', fecha: '2026-10-14', tarea: 'Reporte ejecutivo matutino consolidado D-1', guias: 140, recaudo: '$ 8.450.000', estado: 'Completada', hora: '09:30' },
  { id: 'HIST-005', toolId: 'tool10', tagTool: 'TOOL 10', fecha: '2026-10-13', tarea: 'Escudo de margen: Flete negativo prevenido', guias: 12, recaudo: '$ 420.000', estado: 'Completada', hora: '18:45' }
];

function extraerContadorFlexible(order: any, tipo: 'movimiento' | 'gestion'): number {
  if (!order) return 0;
  for (const key of Object.keys(order)) {
    const kNorm = key
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '');

    if (tipo === 'movimiento') {
      if (kNorm.includes('movimiento') || kNorm.includes('sinmovimiento')) {
        const val = Number(order[key]);
        if (!isNaN(val)) return val;
      }
    } else if (tipo === 'gestion') {
      if (kNorm.includes('gestion')) {
        const val = Number(order[key]);
        if (!isNaN(val)) return val;
      }
    }
  }
  return 0;
}

function esDevolucionEnBodegaSi(order: any): boolean {
  if (!order) return false;
  for (const key of Object.keys(order)) {
    const kNorm = key.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]/g, '');
    if (kNorm.includes('bodega') && (kNorm.includes('dev') || kNorm.includes('devolucion'))) {
      const val = String(order[key] || '').toUpperCase().trim();
      if (val === 'SI' || val === 'SÍ') return true;
    }
  }
  return false;
}

function esTipoDevolucion(order: any): boolean {
  if (!order) return false;
  const tipo = String(order.tipoEstado || order['Tipo de estado'] || order.estado || order.Estado || '').toUpperCase();
  return tipo.includes('DEVOLU') || tipo.includes('DEV');
}

function parseNumeroSeguro(v: any): number {
  if (v === null || v === undefined || v === '' || v === '-') return 0;
  if (typeof v === 'number') return v;
  let s = String(v).trim().replace('$', '').replace(/\s/g, '');
  if (s.includes('.') && s.includes(',')) s = s.replace(/\./g, '').replace(',', '.');
  else if (s.includes(',')) s = s.replace(',', '.');
  else if (s.includes('.')) {
    const parts = s.split('.');
    if (parts.length === 2 && parts[1].length === 3) s = parts[0] + parts[1];
  }
  const res = parseFloat(s);
  return isNaN(res) ? 0 : res;
}

const formatCOP = (val: number) => `$ ${Math.round(val).toLocaleString('es-CO')}`;

export default function PanelAlertasPage() {
  const { filteredData, loading } = useFiltrosCruzados();

  // Estados sincronizados con /control
  const [toolsEstado, setToolsEstado] = useState<ToolSyncItem[]>(TOOLS_DEFINICION_BASE);
  const [planSuscrito, setPlanSuscrito] = useState<string | null>('control_total');
  const [filtroToolSeleccionada, setFiltroToolSeleccionada] = useState<string | 'ALL'>('ALL');
  
  // Nuevo estado: Filtro visual de tools (Todas / Activas / Inactivas)
  const [filtroEstadoVisual, setFiltroEstadoVisual] = useState<'TODAS' | 'ACTIVAS' | 'INACTIVAS'>('TODAS');

  // Estados de auditoría y guías
  const [procesadasIds, setProcesadasIds] = useState<Set<string>>(new Set());
  const [resumenGestion, setResumenGestion] = useState<ResumenGestion | null>(null);
  const [historico, setHistorico] = useState<TareaHistorico[]>(HISTORICO_BASE_INICIAL);
  const [isModalDevolucionesOpen, setIsModalDevolucionesOpen] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  const sincronizarConControl = () => {
    try {
      const planGuardado = localStorage.getItem('atom_plan_activo');
      setPlanSuscrito(planGuardado === 'null' ? null : (planGuardado || 'control_total'));

      const toolsGuardadas = localStorage.getItem('atom_tools_state');
      if (toolsGuardadas) {
        const parsed: Array<{ id: string; activo: boolean; guiasImpacto?: string }> = JSON.parse(toolsGuardadas);
        setToolsEstado((prev) =>
          prev.map((t) => {
            const encontrado = parsed.find((p) => p.id === t.id);
            if (!encontrado) return t;
            return {
              ...t,
              activo: encontrado.activo,
              gestionActivo: encontrado.guiasImpacto || t.gestionActivo,
            };
          })
        );
      }

      const storedAuditadas = localStorage.getItem('atom_guias_auditadas');
      if (storedAuditadas) {
        const parsed = JSON.parse(storedAuditadas);
        setProcesadasIds(new Set(Object.keys(parsed)));
      }

      const storedHistorico = localStorage.getItem('atom_historico_tareas');
      if (storedHistorico) {
        setHistorico(JSON.parse(storedHistorico));
      }

      const storedResumen = localStorage.getItem('atom_resumen_gestion');
      if (storedResumen) {
        setResumenGestion(JSON.parse(storedResumen));
      }
    } catch (e) {
      console.error('Error sincronizando alertas con control', e);
    }
  };

  useEffect(() => {
    sincronizarConControl();

    const handleStorageChange = () => sincronizarConControl();
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('atom_plan_updated', handleStorageChange);
    window.addEventListener('atom_tools_updated', handleStorageChange);
    window.addEventListener('atom_guias_updated', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('atom_plan_updated', handleStorageChange);
      window.removeEventListener('atom_tools_updated', handleStorageChange);
      window.removeEventListener('atom_guias_updated', handleStorageChange);
    };
  }, []);

  const handleReiniciarAuditoria = () => {
    try {
      localStorage.removeItem('atom_guias_auditadas');
      localStorage.removeItem('atom_resumen_gestion');
      localStorage.removeItem('atom_historico_tareas');
      window.dispatchEvent(new Event('atom_guias_updated'));
    } catch (e) {
      console.error(e);
    }

    setProcesadasIds(new Set());
    setResumenGestion(null);
    setHistorico(HISTORICO_BASE_INICIAL);
    setNotification('¡Auditoría restablecida! Las guías están listas para auditar de nuevo.');
    setTimeout(() => setNotification(null), 4000);
  };

  const devolucionesPendientes = useMemo(() => {
    if (!Array.isArray(filteredData)) return [];

    return filteredData
      .filter((order: any) => {
        const esDev = esTipoDevolucion(order);
        const enBodega = esDevolucionEnBodegaSi(order);
        const ultMov = extraerContadorFlexible(order, 'movimiento');

        return esDev && !enBodega && ultMov >= 7;
      })
      .map((order: any, idx: number): GuiaDevolucionReal => {
        const id = String(order.id || order.ID || `DEV-${idx}`);
        const numeroGuia = String(order.numeroGuia || order['Número de guía'] || order.guia || '-');
        return {
          id: `${id}-${idx}`,
          pedidoId: id,
          numeroGuia,
          transportadora: String(order.transportadora || order.Transportadora || '-'),
          productoNombre: String(order.productoNombre || order.Productos || 'Producto sin identificar'),
          diasSinMovimiento: extraerContadorFlexible(order, 'movimiento'),
          diasGestion: extraerContadorFlexible(order, 'gestion'),
          valorDeclarado: parseNumeroSeguro(order.recaudoProveedor ?? order['Recaudo proveedor'])
        };
      })
      .filter((g: GuiaDevolucionReal) => !procesadasIds.has(g.numeroGuia));
  }, [filteredData, procesadasIds]);

  const valorPerdidaCalculada = useMemo(
    () => devolucionesPendientes.reduce((acc, curr) => acc + curr.valorDeclarado, 0),
    [devolucionesPendientes]
  );

  const handleAuditoriaSuccess = (reclamadas: GuiaDevolucionReal[], confirmadas: GuiaDevolucionReal[]) => {
    const totalGestionadas = reclamadas.length + confirmadas.length;
    const horaActual = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const fechaHoy = new Date().toISOString().slice(0, 10);

    const montoConfirmado = confirmadas.reduce((a, b) => a + b.valorDeclarado, 0);
    const montoReclamado = reclamadas.reduce((a, b) => a + b.valorDeclarado, 0);

    const nuevoResumen: ResumenGestion = {
      confirmadas: [...(resumenGestion?.confirmadas || []), ...confirmadas],
      reclamadas: [...(resumenGestion?.reclamadas || []), ...reclamadas],
      montoConfirmado: montoConfirmado + (resumenGestion?.montoConfirmado || 0),
      montoReclamado: montoReclamado + (resumenGestion?.montoReclamado || 0),
      fechaHora: `Hoy, ${horaActual}`
    };
    setResumenGestion(nuevoResumen);
    try {
      localStorage.setItem('atom_resumen_gestion', JSON.stringify(nuevoResumen));
    } catch (e) {}

    const nuevasFilasHistorico: TareaHistorico[] = [];
    if (reclamadas.length > 0) {
      nuevasFilasHistorico.push({
        id: `HIST-${Date.now()}-REC`,
        toolId: 'tool3',
        tagTool: 'TOOL 3',
        fecha: fechaHoy,
        tarea: `Reclamación Jurídica CAS radicada (Art. 1013 C.Co. - ${reclamadas.length} guías)`,
        guias: reclamadas.length,
        recaudo: formatCOP(montoReclamado),
        estado: 'Completada',
        hora: horaActual
      });
    }
    if (confirmadas.length > 0) {
      nuevasFilasHistorico.push({
        id: `HIST-${Date.now()}-CONF`,
        toolId: 'tool3',
        tagTool: 'TOOL 3',
        fecha: fechaHoy,
        tarea: `Devoluciones ingresadas a bodega física (${confirmadas.length} guías)`,
        guias: confirmadas.length,
        recaudo: formatCOP(montoConfirmado),
        estado: 'Completada',
        hora: horaActual
      });
    }

    const historicoActualizado = [...nuevasFilasHistorico, ...historico];
    setHistorico(historicoActualizado);
    try {
      localStorage.setItem('atom_historico_tareas', JSON.stringify(historicoActualizado));
    } catch (e) {}

    setProcesadasIds((prev) => {
      const updated = new Set(prev);
      reclamadas.forEach((g) => updated.add(g.numeroGuia));
      confirmadas.forEach((g) => updated.add(g.numeroGuia));
      return updated;
    });

    setNotification(`¡Auditoría procesada! Se radicaron ${totalGestionadas} guías en el sistema.`);
    setTimeout(() => setNotification(null), 5000);
  };

  const historicoFiltrado = useMemo(() => {
    if (filtroToolSeleccionada === 'ALL') return historico;
    return historico.filter((h) => h.toolId === filtroToolSeleccionada);
  }, [historico, filtroToolSeleccionada]);

  const tienePlanValido = planSuscrito !== null;
  const toolsActivasTotal = toolsEstado.filter((t) => t.activo && tienePlanValido).length;
  const toolsInactivasTotal = toolsEstado.length - toolsActivasTotal;

  // Filtrado de la cuadrícula según botón activo (Todas, Activas, Inactivas)
  const toolsGridFiltradas = useMemo(() => {
    return toolsEstado.filter((t) => {
      const estaOperando = t.activo && tienePlanValido;
      if (filtroEstadoVisual === 'ACTIVAS') return estaOperando;
      if (filtroEstadoVisual === 'INACTIVAS') return !estaOperando;
      return true;
    });
  }, [toolsEstado, tienePlanValido, filtroEstadoVisual]);

  if (loading) {
    return (
      <div className="p-10 flex items-center justify-center text-slate-500 font-sans text-xs font-bold gap-2">
        <div className="w-4 h-4 rounded-full border-2 border-orange-500 border-t-transparent animate-spin" />
        <span>Sincronizando alertas y estado de suite agéntica...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 p-4 sm:p-6 lg:p-8 font-sans space-y-7">
      
      {notification && (
        <div className="fixed top-6 right-6 z-50 bg-emerald-600 text-white px-4 py-3 rounded-2xl font-bold shadow-2xl flex items-center gap-2 animate-bounce border border-emerald-500 text-xs">
          <CheckCircle2 size={16} />
          <span>{notification}</span>
        </div>
      )}

      {/* CABECERA PRINCIPAL LIMPIA */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">Panel de alertas</h1>
            <span className={`font-extrabold text-[10.5px] px-2.5 py-0.5 rounded-full uppercase tracking-wider border flex items-center gap-1.5 ${
              tienePlanValido 
                ? 'bg-orange-100 text-[#FA7C16] border-orange-200' 
                : 'bg-amber-50 text-amber-800 border-amber-200'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${tienePlanValido ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
              {tienePlanValido ? `${toolsActivasTotal} de 10 Tools Activas` : 'Plan Inactivo · 10 Tools Pendientes'}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Monitor central de eventos generados y acciones ejecutadas por tus 10 agentes en tiempo real.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/control"
            className="px-3.5 py-2 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 rounded-xl text-xs font-bold shadow-2xs transition flex items-center gap-1.5 cursor-pointer"
          >
            <span>Configurar Tools</span>
            <ExternalLink size={13} className="text-slate-400" />
          </Link>

          {procesadasIds.size > 0 && (
            <button
              type="button"
              onClick={handleReiniciarAuditoria}
              className="px-3.5 py-2 bg-white border border-slate-200 hover:border-slate-300 text-slate-600 hover:text-slate-800 rounded-xl text-xs font-bold shadow-2xs transition flex items-center gap-1.5 cursor-pointer active:scale-95"
              title="Restablece las guías para volver a auditar"
            >
              <RotateCcw size={14} className="text-[#FA7C16]" />
              <span>Reiniciar Auditoría ({procesadasIds.size})</span>
            </button>
          )}
        </div>
      </div>

      {/* BANNER INFORMATIVO: CUANDO EL PLAN ESTÁ INACTIVO O NO TIENE PLAN */}
      {!tienePlanValido && (
        <div className="bg-gradient-to-r from-amber-50 via-orange-50/50 to-white border border-amber-200 rounded-[24px] p-5 sm:p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-11 h-11 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 border border-amber-200">
              <AlertTriangle size={20} />
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-800 bg-amber-100 px-2 py-0.5 rounded border border-amber-200">
                Operación Pausada · Pendiente por Activar
              </span>
              <h2 className="text-base sm:text-lg font-black text-slate-800 tracking-tight">
                Tienes 10 agentes y más de 1.700 guías pendientes por gestionar
              </h2>
              <p className="text-xs text-slate-600 leading-relaxed max-w-3xl">
                Al activar tu suscripción, se desbloqueará de forma inmediata la radicación CAS de <strong>1.240 guías estancadas</strong>, el rescate proactivo de <strong>142 órdenes en ruta</strong> y la protección de margen contra pedidos con flete negativo.
              </p>
            </div>
          </div>

          <Link
            href="/planes"
            className="bg-[#FA7C16] hover:bg-[#EA580C] text-white px-5 py-2.5 rounded-xl text-xs font-black shadow-xs transition-colors flex items-center gap-2 shrink-0 cursor-pointer"
          >
            <span>Activar Plan y Gestionar</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      )}

      {/* 1. MONITOR DE SUITE AGÉNTICA CON FILTROS (TODAS, ACTIVAS, INACTIVAS) Y MEJORA VISUAL */}
      <div className="bg-white border border-slate-200/90 rounded-[28px] p-6 shadow-xs space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-orange-50 text-[#FA7C16] flex items-center justify-center">
                <Activity size={15} strokeWidth={2.4} />
              </div>
              <h2 className="text-sm font-black text-slate-800 tracking-tight uppercase">
                {tienePlanValido ? 'Monitor de Ejecución Agéntica' : 'Catálogo de Operaciones Pendientes por Gestionar'}
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1 font-medium">
              Filtra agentes según su estado operativo y haz clic sobre cualquiera para auditar su bitácora histórica.
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            {/* SELECTOR SEGMENTADO (TODAS / ACTIVAS / INACTIVAS) */}
            <div className="bg-slate-100 p-1 rounded-2xl border border-slate-200 flex items-center gap-1 shadow-2xs">
              <button
                type="button"
                onClick={() => setFiltroEstadoVisual('TODAS')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  filtroEstadoVisual === 'TODAS'
                    ? 'bg-white text-slate-900 shadow-2xs font-extrabold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <span>Todas</span>
                <span className="text-[10px] font-mono font-black px-1.5 py-0.5 rounded-md bg-slate-200/70 text-slate-700">
                  {toolsEstado.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setFiltroEstadoVisual('ACTIVAS')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  filtroEstadoVisual === 'ACTIVAS'
                    ? 'bg-white text-emerald-800 shadow-2xs font-extrabold'
                    : 'text-slate-500 hover:text-emerald-700'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Activas</span>
                <span className="text-[10px] font-mono font-black px-1.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                  {toolsActivasTotal}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setFiltroEstadoVisual('INACTIVAS')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  filtroEstadoVisual === 'INACTIVAS'
                    ? 'bg-white text-amber-900 shadow-2xs font-extrabold'
                    : 'text-slate-500 hover:text-amber-700'
                }`}
              >
                <Lock size={11} className="text-amber-600" />
                <span>Inactivas</span>
                <span className="text-[10px] font-mono font-black px-1.5 py-0.5 rounded-md bg-amber-100 text-amber-800">
                  {toolsInactivasTotal}
                </span>
              </button>
            </div>

            {filtroToolSeleccionada !== 'ALL' && (
              <button
                type="button"
                onClick={() => setFiltroToolSeleccionada('ALL')}
                className="text-xs font-bold text-[#FA7C16] hover:underline cursor-pointer px-2"
              >
                Limpiar filtro
              </button>
            )}
          </div>
        </div>

        {/* REJILLA DE LAS TOOLS CON ELEVACIÓN VISUAL Y ANIMACIÓN */}
        {toolsGridFiltradas.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
            {toolsGridFiltradas.map((t) => {
              const IconComponent = t.icono;
              const estaSeleccionada = filtroToolSeleccionada === t.id;
              const estaOperando = t.activo && tienePlanValido;

              return (
                <div
                  key={t.id}
                  onClick={() => setFiltroToolSeleccionada(estaSeleccionada ? 'ALL' : t.id)}
                  className={`group relative p-4 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between space-y-3.5 select-none ${
                    estaSeleccionada 
                      ? 'border-[#FA7C16] bg-orange-50/40 ring-2 ring-orange-500/20 shadow-xs -translate-y-0.5' 
                      : estaOperando 
                      ? 'border-slate-200 hover:border-slate-300 bg-white hover:shadow-xs hover:-translate-y-0.5' 
                      : 'border-slate-200/60 bg-slate-50/70 hover:bg-white hover:border-slate-300 hover:-translate-y-0.5'
                  }`}
                >
                  <div>
                    {/* ENCABEZADO DE TARJETA: TAG Y BADGE DE ESTADO */}
                    <div className="flex items-center justify-between gap-1 mb-2.5">
                      <span className={`text-[9.5px] font-black px-2 py-0.5 rounded-md border uppercase tracking-wider ${
                        estaOperando 
                          ? t.esOfensivo ? 'bg-purple-50 text-purple-700 border-purple-200' : 'bg-orange-50 text-orange-700 border-orange-200'
                          : 'bg-slate-200/80 text-slate-600 border-slate-300'
                      }`}>
                        {t.tag}
                      </span>

                      {estaOperando ? (
                        <span className="flex items-center gap-1.5 text-[10px] font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          Activa
                        </span>
                      ) : (
                        <span className="text-[10px] text-amber-800 font-extrabold bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Lock size={9} strokeWidth={2.5} /> Inactiva
                        </span>
                      )}
                    </div>

                    {/* ICONO Y NOMBRE DEL AGENTE */}
                    <div className="flex items-start gap-2.5">
                      <div className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 transition-transform duration-700 ease-in-out group-hover:rotate-[360deg] shadow-2xs ${
                        estaOperando ? 'bg-orange-50 border-orange-200 text-[#FA7C16]' : 'bg-slate-100 border-slate-200 text-slate-400'
                      }`}>
                        <IconComponent size={18} strokeWidth={2.2} />
                      </div>
                      <h3 className="text-xs font-black text-slate-800 leading-snug line-clamp-2 pt-0.5">
                        {t.nombre}
                      </h3>
                    </div>
                  </div>

                  {/* PIE DE TARJETA: MÉTRICAS GESTIONADO / PENDIENTE */}
                  <div className={`pt-2.5 border-t text-left space-y-0.5 ${
                    estaOperando ? 'border-slate-100' : 'border-slate-200/60'
                  }`}>
                    <span className={`text-[9px] uppercase font-bold block tracking-wider ${
                      estaOperando ? 'text-slate-400' : 'text-amber-800/90'
                    }`}>
                      {estaOperando ? 'Gestión en vivo:' : 'Por gestionar (Si activa):'}
                    </span>
                    <p className={`text-xs font-black font-mono truncate ${
                      estaOperando ? 'text-slate-800' : 'text-[#FA7C16]'
                    }`}>
                      {estaOperando ? t.gestionActivo : t.gestionPendiente}
                    </p>
                    <span className="text-[10.5px] text-slate-500 font-medium line-clamp-1 block">
                      {estaOperando ? t.subtextoActivo : t.subtextoPendiente}
                    </span>
                  </div>

                  {/* INDICADOR SELECCIONADO PARA HISTÓRICO */}
                  {estaSeleccionada && (
                    <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#FA7C16]" />
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-8 text-center bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
            <p className="text-xs font-bold text-slate-600">
              No hay agentes con el filtro seleccionado ({filtroEstadoVisual.toLowerCase()}).
            </p>
            <button
              type="button"
              onClick={() => setFiltroEstadoVisual('TODAS')}
              className="text-xs font-extrabold text-[#FA7C16] hover:underline cursor-pointer"
            >
              Restablecer a Todas las Tools
            </button>
          </div>
        )}
      </div>

      {/* 2. BANNER DE ACCIÓN CAS (TOOL 3) */}
      {devolucionesPendientes.length > 0 ? (
        <div className="bg-white border border-orange-200 rounded-2xl p-5 sm:p-6 shadow-2xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-all">
          <div className="flex items-start gap-4">
            <div className="w-11 h-11 rounded-2xl border border-orange-200 bg-orange-50 flex items-center justify-center shrink-0 text-[#FA7C16]">
              <RotateCcw size={18} />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-black text-[#EA580C] uppercase tracking-wide">
                  {tienePlanValido ? 'TOOL 3 · CAS ACCIÓN DIRECTA' : 'TOOL 3 · PENDIENTE POR CONCILIAR'}
                </span>
                <span className="text-[#EA580C] text-[8px]">●</span>
                <span className="text-xs text-slate-500 font-medium">Guías con $\ge 7$ días sin movimiento pendientes de ingreso a bodega</span>
              </div>
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-800 tracking-tight">
                Devoluciones retenidas fuera de bodega <span className="text-[#FA7C16] ml-1">{devolucionesPendientes.length} Guías Reales</span>
              </h2>
              <p className="text-xs text-slate-500">
                Pérdida calculada en tránsito: <strong className="text-slate-800 font-bold">{formatCOP(valorPerdidaCalculada)}</strong>. {tienePlanValido 
                  ? 'Valida reingresos o radica el expediente formal de indemnización jurídica.' 
                  : 'Este valor quedará respaldado e indemnizado formalmente mediante radicación CAS una vez actives tu plan.'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 shrink-0 w-full sm:w-auto justify-end">
            {tienePlanValido ? (
              <button
                type="button"
                onClick={() => setIsModalDevolucionesOpen(true)}
                className="bg-[#FA7C16] hover:bg-[#EA580C] text-white font-bold px-5 py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 shadow-xs transition-all active:scale-95 cursor-pointer"
              >
                <span>Gestionar ({devolucionesPendientes.length})</span>
                <ArrowRight size={14} />
              </button>
            ) : (
              <Link
                href="/planes"
                className="bg-[#FA7C16] hover:bg-[#EA580C] text-white font-bold px-5 py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 shadow-xs transition-all active:scale-95 cursor-pointer"
              >
                <span>Activar para Radicar CAS</span>
                <ArrowRight size={14} />
              </Link>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-xs text-emerald-900">
            <CheckCircle2 size={22} className="text-emerald-600 shrink-0" />
            <div>
              <p className="font-extrabold text-sm text-slate-800">Auditoría Tool 3 completada exitosamente</p>
              <p className="text-emerald-700 mt-0.5">Se auditaron y radicaron las devoluciones. Las decisiones están sincronizadas en Detalle de Guías.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleReiniciarAuditoria}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black shadow-xs transition flex items-center gap-1.5 cursor-pointer shrink-0 active:scale-95"
          >
            <RotateCcw size={14} />
            <span>Reiniciar y Volver a Auditar</span>
          </button>
        </div>
      )}

      {/* 3. RESUMEN DE GESTIÓN */}
      {resumenGestion && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-4">
          <div className="flex justify-between items-center flex-wrap gap-2 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center">
                <Sparkles size={16} />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-slate-800 tracking-tight">Devoluciones Gestionadas y Auditadas</h3>
                <p className="text-[11px] text-slate-400">Última ejecución: {resumenGestion.fechaHora} • Registrado en el sistema</p>
              </div>
            </div>
            <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full border border-emerald-200">
              {resumenGestion.confirmadas.length + resumenGestion.reclamadas.length} Guías Procesadas
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-emerald-50/40 border border-emerald-200 rounded-2xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <PackageCheck size={20} />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 block">Confirmadas en Bodega</span>
                  <p className="text-xl font-black text-slate-800">{resumenGestion.confirmadas.length} Guías</p>
                  <span className="text-[11px] text-slate-500 font-medium">Ingresadas físicamente a inventario</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-medium text-slate-400 block">Valor recuperado</span>
                <span className="text-sm font-black text-emerald-700">{formatCOP(resumenGestion.montoConfirmado)}</span>
              </div>
            </div>

            <div className="bg-rose-50/40 border border-rose-200 rounded-2xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
                  <ShieldAlert size={20} />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 block">Reclamadas ante CAS (Legal)</span>
                  <p className="text-xl font-black text-slate-800">{resumenGestion.reclamadas.length} Guías</p>
                  <span className="text-[11px] text-slate-500 font-medium">Expediente legal radicado</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-medium text-slate-400 block">Monto en siniestro</span>
                <span className="text-sm font-black text-rose-600">{formatCOP(resumenGestion.montoReclamado)}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. HISTÓRICO DE INTERVENCIONES */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-4">
        <div className="flex justify-between items-center flex-wrap gap-2">
          <div>
            <h2 className="text-base font-bold text-slate-800 tracking-tight">
              Histórico de intervenciones agénticas (90 días)
            </h2>
            <p className="text-xs text-slate-400 font-normal">
              Registro trazable de acciones automáticas y radicaciones generadas por la suite.
            </p>
          </div>

          {filtroToolSeleccionada !== 'ALL' && (
            <span className="text-xs font-bold px-3 py-1 bg-orange-50 text-orange-800 border border-orange-200 rounded-xl">
              Filtrado por: {toolsEstado.find((t) => t.id === filtroToolSeleccionada)?.tag}
            </span>
          )}
        </div>

        <div className="overflow-x-auto rounded-xl">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-2">FECHA</th>
                <th className="py-3 px-3">AGENTE</th>
                <th className="py-3 px-4">TAREA AUDITADA</th>
                <th className="py-3 px-4 text-center">GUÍAS / ACCIONES</th>
                <th className="py-3 px-4 text-right">VALOR / RECAUDO</th>
                <th className="py-3 px-4 text-center">ESTADO</th>
                <th className="py-3 px-2 text-right">HORA</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {historicoFiltrado.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 px-2 font-medium text-slate-700 whitespace-nowrap">{row.fecha}</td>
                  <td className="py-3.5 px-3 whitespace-nowrap">
                    <span className="text-[10px] font-black px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-700 font-mono">
                      {row.tagTool}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-800">{row.tarea}</td>
                  <td className="py-3.5 px-4 text-center font-extrabold text-slate-800 font-mono">{row.guias}</td>
                  <td className="py-3.5 px-4 text-right font-bold text-slate-800 font-mono">{row.recaudo}</td>
                  <td className="py-3.5 px-4 text-center">
                    <span className="bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-full px-3 py-0.5 text-[11px] font-semibold inline-block">
                      {row.estado}
                    </span>
                  </td>
                  <td className="py-3.5 px-2 text-right font-medium text-slate-500 whitespace-nowrap">{row.hora}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ModalDevoluciones
        isOpen={isModalDevolucionesOpen}
        guias={devolucionesPendientes}
        onClose={() => setIsModalDevolucionesOpen(false)}
        onSuccess={handleAuditoriaSuccess}
      />
    </div>
  );
}
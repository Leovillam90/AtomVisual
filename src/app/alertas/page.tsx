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
  Bot,
  Check,
  ShieldCheck,
  Layers
} from 'lucide-react';
import { useFiltrosCruzados } from '@/hooks/useFiltrosCruzados';
import ModalDevoluciones, { GuiaDevolucionReal } from './ModalDevoluciones';

export interface TareaHistorico {
  id: string;
  agenteId: string;
  tagAgente: string;
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

interface AgenteSyncItem {
  id: string;
  tag: string;
  nombre: string;
  icono: React.ElementType;
  activo: boolean;
  gestionActivo: string;
  subtextoActivo: string;
  planRequerido: 'rescatista' | 'experto' | 'control_total';
}

const AGENTES_DEFINICION_BASE: AgenteSyncItem[] = [
  // --- PLAN RESCATISTA ($69 USD) ---
  {
    id: 'tool4',
    tag: 'AGENTE 1',
    nombre: 'Agente de Movilización de Guías Estancadas (+3D)',
    icono: Rocket,
    activo: true,
    gestionActivo: '142 Guías rescatadas',
    subtextoActivo: 'Presión activa a transportadoras cada 6h',
    planRequerido: 'rescatista',
  },
  {
    id: 'tool_notif_novedad',
    tag: 'AGENTE 2',
    nombre: 'Agente Notificaciones de Novedades sin Solución',
    icono: ShieldAlert,
    activo: true,
    gestionActivo: '320 Novedades alertadas',
    subtextoActivo: 'Alertas prioritarias enviadas a WhatsApp',
    planRequerido: 'rescatista',
  },
  {
    id: 'tool5',
    tag: 'AGENTE 3',
    nombre: 'Agente Reporte Diario del Negocio (09:30 AM)',
    icono: BarChart3,
    activo: true,
    gestionActivo: '1 Envío emitido hoy',
    subtextoActivo: 'Balance D-1 enviado por WhatsApp y APP',
    planRequerido: 'rescatista',
  },

  // --- PLAN EXPERTO ($99 USD) ---
  {
    id: 'tool2',
    tag: 'AGENTE 4',
    nombre: 'Agente Cierre de Novedad (+10D)',
    icono: PackageX,
    activo: true,
    gestionActivo: '315 Guías en novedad',
    subtextoActivo: '19 órdenes en abandono indemnizatorio',
    planRequerido: 'experto',
  },
  {
    id: 'tool1',
    tag: 'AGENTE 5',
    nombre: 'Agente Cierre Logístico (+30D)',
    icono: Scale,
    activo: true,
    gestionActivo: '1.240 Guías auditadas',
    subtextoActivo: '28 radicaciones CAS jurídicas emitidas',
    planRequerido: 'experto',
  },
  {
    id: 'tool3',
    tag: 'AGENTE 6',
    nombre: 'Agente Auditoría Devoluciones (+7D)',
    icono: RefreshCcw,
    activo: true,
    gestionActivo: '16 Guías en tránsito',
    subtextoActivo: '8 órdenes pendientes de conciliar en bodega',
    planRequerido: 'experto',
  },
  {
    id: 'tool10',
    tag: 'AGENTE 7',
    nombre: 'Agente Escudo Financiero de Márgenes',
    icono: ShieldX,
    activo: true,
    gestionActivo: '2.840 Pedidos auditados',
    subtextoActivo: '85 despachos a pérdida congelados',
    planRequerido: 'experto',
  },

  // --- PLAN CONTROL TOTAL ($149 USD) ---
  {
    id: 'tool6',
    tag: 'AGENTE 8',
    nombre: 'Agente Conexiones Inteligente con Sellers',
    icono: UserCheck,
    activo: true,
    gestionActivo: '3 / 5 Drops Conectados',
    subtextoActivo: 'Match comercial enviado a Sellers Élite',
    planRequerido: 'control_total',
  },
  {
    id: 'tool9',
    tag: 'AGENTE 9',
    nombre: 'Agente Liquidador de Capital Muerto con Sellers',
    icono: BadgePercent,
    activo: true,
    gestionActivo: '2 / 5 Drops Conectados',
    subtextoActivo: 'Oferta relámpago enviada a Sellers',
    planRequerido: 'control_total',
  },
  {
    id: 'tool8',
    tag: 'AGENTE 10',
    nombre: 'Agente Rotura de Stock',
    icono: Crown,
    activo: true,
    gestionActivo: '84 Productos Auditados',
    subtextoActivo: 'Monitoreo continuo de agotamiento',
    planRequerido: 'control_total',
  },
  {
    id: 'tool_predictivo',
    tag: 'AGENTE 11',
    nombre: 'Agente Predictivo de Importación',
    icono: Zap,
    activo: true,
    gestionActivo: '3 Proyecciones emitidas',
    subtextoActivo: 'Demanda inducida a 45 días',
    planRequerido: 'control_total',
  },
  {
    id: 'tool_explorador',
    tag: 'AGENTE 12',
    nombre: 'Agente Explorador de Mercados',
    icono: PackageCheck,
    activo: true,
    gestionActivo: '2 Zonas mapeadas',
    subtextoActivo: 'Expansión territorial activa',
    planRequerido: 'control_total',
  },
];

const HISTORICO_BASE_INICIAL: TareaHistorico[] = [
  { id: 'HIST-001', agenteId: 'tool4', tagAgente: 'AGENTE 1', fecha: '2026-11-04', tarea: 'Movilización prioritaria de paquetes en ruta (+3D)', guias: 38, recaudo: '$ 2.642.957', estado: 'Completada', hora: '10:09' },
  { id: 'HIST-002', agenteId: 'tool1', tagAgente: 'AGENTE 5', fecha: '2026-11-04', tarea: 'Radicación jurídica CAS fuera de bodega (+30D)', guias: 28, recaudo: '$ 2.845.000', estado: 'Completada', hora: '08:00' },
  { id: 'HIST-003', agenteId: 'tool2', tagAgente: 'AGENTE 4', fecha: '2026-11-04', tarea: 'Expediente indemnizatorio por abandono (+10D)', guias: 19, recaudo: '$ 1.620.400', estado: 'Completada', hora: '08:00' },
  { id: 'HIST-004', agenteId: 'tool5', tagAgente: 'AGENTE 3', fecha: '2026-11-04', tarea: 'Reporte ejecutivo matutino consolidado D-1', guias: 140, recaudo: '$ 8.450.000', estado: 'Completada', hora: '09:30' },
  { id: 'HIST-005', agenteId: 'tool10', tagAgente: 'AGENTE 7', fecha: '2026-11-03', tarea: 'Escudo financiero: Despacho a pérdida congelado', guias: 12, recaudo: '$ 420.000', estado: 'Completada', hora: '18:45' }
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

  const [agentesEstado, setAgentesEstado] = useState<AgenteSyncItem[]>(AGENTES_DEFINICION_BASE);
  const [planSuscrito, setPlanSuscrito] = useState<'rescatista' | 'experto' | 'control_total' | null>(null);
  const [filtroAgenteSeleccionado, setFiltroAgenteSeleccionado] = useState<string | 'ALL'>('ALL');

  const [procesadasIds, setProcesadasIds] = useState<Set<string>>(new Set());
  const [resumenGestion, setResumenGestion] = useState<ResumenGestion | null>(null);
  const [historico, setHistorico] = useState<TareaHistorico[]>(HISTORICO_BASE_INICIAL);
  const [isModalDevolucionesOpen, setIsModalDevolucionesOpen] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  const jerarquiaPlanes: Record<string, number> = { rescatista: 1, experto: 2, control_total: 3 };

  const sincronizarConControl = () => {
    try {
      const planGuardado = localStorage.getItem('atom_plan_activo');
      if (planGuardado && planGuardado !== 'null' && planGuardado !== '') {
        setPlanSuscrito(planGuardado as 'rescatista' | 'experto' | 'control_total');
      } else {
        setPlanSuscrito(null);
      }

      const toolsGuardadas = localStorage.getItem('atom_tools_state');
      if (toolsGuardadas) {
        const parsed: Array<{ id: string; activo: boolean }> = JSON.parse(toolsGuardadas);
        setAgentesEstado((prev) =>
          prev.map((t) => {
            const encontrado = parsed.find((p) => p.id === t.id);
            if (!encontrado) return t;
            return {
              ...t,
              activo: encontrado.activo,
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

  const tienePlanValido = planSuscrito !== null;
  const nivelUsuario = planSuscrito ? (jerarquiaPlanes[planSuscrito] || 0) : 0;

  // Filtrar exclusivamente los agentes incluidos en el plan contratado
  const agentesHabilitados = useMemo(() => {
    if (!tienePlanValido) return [];
    return agentesEstado.filter((a) => {
      const nivelRequerido = jerarquiaPlanes[a.planRequerido];
      return nivelUsuario >= nivelRequerido;
    });
  }, [agentesEstado, nivelUsuario, tienePlanValido]);

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
        agenteId: 'tool3',
        tagAgente: 'AGENTE 6',
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
        agenteId: 'tool3',
        tagAgente: 'AGENTE 6',
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

    setNotification(`¡Auditoría procesada! Se radicaron ${totalGestionadas} guías.`);
    setTimeout(() => setNotification(null), 5000);
  };

  const historicoFiltrado = useMemo(() => {
    if (!tienePlanValido) return [];
    if (filtroAgenteSeleccionado === 'ALL') return historico;
    return historico.filter((h) => h.agenteId === filtroAgenteSeleccionado);
  }, [historico, filtroAgenteSeleccionado, tienePlanValido]);

  // Si tiene Plan Experto o Control Total, tiene acceso a la auditoría CAS del Agente 6
  const tieneAccesoCASDevoluciones = nivelUsuario >= jerarquiaPlanes.experto;

  if (loading) {
    return (
      <div className="p-10 flex items-center justify-center text-slate-500 font-sans text-xs font-bold gap-2">
        <div className="w-4 h-4 rounded-full border-2 border-orange-500 border-t-transparent animate-spin" />
        <span>Sincronizando estado de alertas agénticas...</span>
      </div>
    );
  }

  // =========================================================================
  // CASO 1: SIN PLAN ACTIVO -> VITRINA COMERCIAL EXCLUSIVA (NADA DE TABLAS)
  // =========================================================================
  if (!tienePlanValido) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] text-slate-800 p-6 lg:p-10 font-sans space-y-8 flex flex-col justify-center">
        
        {/* Cabecera mínima */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-orange-100 text-[#FA7C16] flex items-center justify-center shadow-xs">
              <Bot size={22} strokeWidth={2.4} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">Panel de Alertas Autónomo</h1>
              <p className="text-xs text-slate-400 font-medium">ATOM AGENTICO IA · Suite de Supervisión</p>
            </div>
          </div>
          <span className="text-[11px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider bg-amber-50 text-amber-800 border border-amber-200">
            Sin Suscripción Activa
          </span>
        </div>

        {/* HERO COMERCIAL DE ALTO IMPACTO */}
        <div className="max-w-4xl mx-auto w-full bg-white border border-slate-200 rounded-[32px] p-8 lg:p-12 shadow-sm text-center space-y-8 relative overflow-hidden">
          
          <div className="absolute top-0 right-0 w-80 h-80 bg-orange-500/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

          <div className="space-y-4 max-w-2xl mx-auto relative z-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-orange-50 text-[#FA7C16] border border-orange-200 shadow-2xs">
              <Sparkles size={13} />
              Controla tu negocio en piloto automático
            </span>

            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
              Deja que 12 agentes de IA protejan y escalen tu inventario 24/7
            </h2>

            <p className="text-sm text-slate-500 leading-relaxed font-medium">
              Activa un plan agéntico para habilitar la supervisión autónoma en vivo. Tus agentes radicarán reclamos CAS, recuperarán paquetes frenados en transportadora y blindarán tu margen contra fletes negativos.
            </p>
          </div>

          {/* BENEFICIOS DESTACADOS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left relative z-10">
            
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-2">
              <div className="w-9 h-9 rounded-xl bg-orange-100 text-[#FA7C16] flex items-center justify-center font-bold">
                <Rocket size={18} />
              </div>
              <h3 className="text-sm font-black text-slate-900">Movilización en Ruta</h3>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                Presión automática sobre transportadoras cada 6h ante órdenes quietas por más de 72 horas.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-2">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                <Scale size={18} />
              </div>
              <h3 className="text-sm font-black text-slate-900">Cobranza CAS Jurídica</h3>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                Radicación formal con número CAS oficial para indemnizar dinero retenido (+30D y novedades).
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-2">
              <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                <ShieldX size={18} />
              </div>
              <h3 className="text-sm font-black text-slate-900">Escudo Financiero</h3>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                Filtro inteligente en el milisegundo en que entra la orden para congelar despachos a pérdida.
              </p>
            </div>

          </div>

          {/* CTA FINAL */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3 relative z-10">
            <Link
              href="/planes"
              className="w-full sm:w-auto bg-[#FA7C16] hover:bg-[#EA580C] text-white px-8 py-3.5 rounded-2xl text-xs font-black shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              <span>Ver Planes Disponibles</span>
              <ArrowRight size={15} />
            </Link>
          </div>

        </div>

      </div>
    );
  }

  // =========================================================================
  // CASO 2: CON PLAN ACTIVO -> MONITOR Y AUDITORÍA SUJETO AL PLAN
  // =========================================================================
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 p-4 sm:p-6 lg:p-8 font-sans space-y-7">
      
      {notification && (
        <div className="fixed top-6 right-6 z-50 bg-emerald-600 text-white px-4 py-3 rounded-2xl font-bold shadow-2xl flex items-center gap-2 animate-bounce border border-emerald-500 text-xs">
          <CheckCircle2 size={16} />
          <span>{notification}</span>
        </div>
      )}

      {/* CABECERA */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">Panel de Alertas</h1>
            <span className="font-extrabold text-[10.5px] px-2.5 py-0.5 rounded-full uppercase tracking-wider border flex items-center gap-1.5 bg-orange-50 text-[#FA7C16] border-orange-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              {agentesHabilitados.length} Agentes Operativos · Plan {planSuscrito?.replace('_', ' ').toUpperCase()}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            Monitor central de ejecuciones automáticas correspondientes a tu plan activo.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/control"
            className="px-3.5 py-2 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 rounded-xl text-xs font-bold shadow-2xs transition flex items-center gap-1.5 cursor-pointer"
          >
            <Bot size={14} className="text-[#FA7C16]" />
            <span>Suite de Control</span>
            <ExternalLink size={13} className="text-slate-400" />
          </Link>

          {procesadasIds.size > 0 && (
            <button
              type="button"
              onClick={handleReiniciarAuditoria}
              className="px-3.5 py-2 bg-white border border-slate-200 hover:border-slate-300 text-slate-600 hover:text-slate-800 rounded-xl text-xs font-bold shadow-2xs transition flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              <RotateCcw size={14} className="text-[#FA7C16]" />
              <span>Reiniciar Auditoría ({procesadasIds.size})</span>
            </button>
          )}
        </div>
      </div>

      {/* BANNER UPSELL SUTIL SI TIENE PLAN MENOR */}
      {planSuscrito !== 'control_total' && (
        <div className="bg-gradient-to-r from-orange-50/60 to-white border border-orange-200/80 rounded-[24px] p-4 sm:p-5 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-orange-100 text-[#FA7C16] flex items-center justify-center shrink-0">
              <Sparkles size={18} />
            </div>
            <div>
              <p className="text-xs font-black text-slate-800 uppercase tracking-tight">
                {planSuscrito === 'rescatista' 
                  ? 'Desbloquea Radicaciones CAS y Escudo Financiero' 
                  : 'Desbloquea Conexiones Inteligentes con Sellers Élite'}
              </p>
              <p className="text-xs text-slate-500 font-medium">
                {planSuscrito === 'rescatista'
                  ? 'Actualiza a Plan Experto ($99 USD) para activar Cierre Logístico (+30D) y Cobro de Novedad (+10D).'
                  : 'Actualiza a Control Total ($149 USD) para habilitar Liquidación de Stock y Demanda Inducida.'}
              </p>
            </div>
          </div>
          <Link
            href="/planes"
            className="bg-orange-100 hover:bg-orange-200 text-orange-900 border border-orange-300 px-4 py-2 rounded-xl text-xs font-black shadow-2xs flex items-center gap-1.5 shrink-0"
          >
            <span>Hacer Upgrade</span>
            <ArrowRight size={13} />
          </Link>
        </div>
      )}

      {/* MONITOR DE AGENTES ACTIVOS EN EL PLAN */}
      <div className="bg-white border border-slate-200/90 rounded-[28px] p-6 shadow-xs space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-orange-50 text-[#FA7C16] flex items-center justify-center">
                <Activity size={15} strokeWidth={2.4} />
              </div>
              <h2 className="text-sm font-black text-slate-800 tracking-tight uppercase">
                Agentes en Operación ({agentesHabilitados.length})
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1 font-medium">
              Mostrando únicamente los agentes incluidos en tu suscripción actual.
            </p>
          </div>

          {filtroAgenteSeleccionado !== 'ALL' && (
            <button
              type="button"
              onClick={() => setFiltroAgenteSeleccionado('ALL')}
              className="text-xs font-bold text-[#FA7C16] hover:underline cursor-pointer px-2"
            >
              Ver todos los agentes
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5">
          {agentesHabilitados.map((t) => {
            const IconComponent = t.icono;
            const estaSeleccionado = filtroAgenteSeleccionado === t.id;

            return (
              <div
                key={t.id}
                onClick={() => setFiltroAgenteSeleccionado(estaSeleccionado ? 'ALL' : t.id)}
                className={`group relative p-4 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between space-y-3.5 select-none ${
                  estaSeleccionado 
                    ? 'border-[#FA7C16] bg-orange-50/40 ring-2 ring-orange-500/20 shadow-xs -translate-y-0.5' 
                    : 'border-slate-200 hover:border-slate-300 bg-white hover:shadow-xs hover:-translate-y-0.5'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-1 mb-2.5">
                    <span className="text-[9.5px] font-black px-2 py-0.5 rounded-md border uppercase tracking-wider bg-orange-50 text-orange-700 border-orange-200">
                      {t.tag}
                    </span>
                    <span className="flex items-center gap-1.5 text-[10px] font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Activo
                    </span>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <div className="w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 shadow-2xs bg-orange-50 border-orange-200 text-[#FA7C16]">
                      <IconComponent size={18} strokeWidth={2.2} />
                    </div>
                    <h3 className="text-xs font-black text-slate-800 leading-snug line-clamp-2 pt-0.5">
                      {t.nombre}
                    </h3>
                  </div>
                </div>

                <div className="pt-2.5 border-t border-slate-100 text-left space-y-0.5">
                  <span className="text-[9px] uppercase font-bold text-slate-400 block tracking-wider">
                    Gestión en vivo:
                  </span>
                  <p className="text-xs font-black font-mono text-slate-800 truncate">
                    {t.gestionActivo}
                  </p>
                  <span className="text-[10.5px] text-slate-500 font-medium line-clamp-1 block">
                    {t.subtextoActivo}
                  </span>
                </div>

                {estaSeleccionado && (
                  <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#FA7C16]" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ACCIÓN CAS DEVOLUCIONES (SOLO VISIBLE SI EL PLAN CUBRE AGENTE 6) */}
      {tieneAccesoCASDevoluciones && (
        devolucionesPendientes.length > 0 ? (
          <div className="bg-white border border-orange-200 rounded-2xl p-5 sm:p-6 shadow-2xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-all">
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-2xl border border-orange-200 bg-orange-50 flex items-center justify-center shrink-0 text-[#FA7C16]">
                <RotateCcw size={18} />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-black text-[#EA580C] uppercase tracking-wide">
                    AGENTE 6 · AUDITORÍA DE DEVOLUCIONES (+7D)
                  </span>
                  <span className="text-[#EA580C] text-[8px]">●</span>
                  <span className="text-xs text-slate-500 font-medium">Guías sin movimiento pendientes de reingreso</span>
                </div>
                <h2 className="text-lg sm:text-xl font-extrabold text-slate-800 tracking-tight">
                  Devoluciones retenidas fuera de bodega <span className="text-[#FA7C16] ml-1">{devolucionesPendientes.length} Guías Detectadas</span>
                </h2>
                <p className="text-xs text-slate-500">
                  Pérdida calculada en tránsito: <strong className="text-slate-800 font-bold">{formatCOP(valorPerdidaCalculada)}</strong>. Valida reingresos o radica el reclamo legal CAS.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2.5 shrink-0 w-full sm:w-auto justify-end">
              <button
                type="button"
                onClick={() => setIsModalDevolucionesOpen(true)}
                className="bg-[#FA7C16] hover:bg-[#EA580C] text-white font-bold px-5 py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 shadow-xs transition-all active:scale-95 cursor-pointer"
              >
                <span>Gestionar ({devolucionesPendientes.length})</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-xs text-emerald-900">
              <CheckCircle2 size={22} className="text-emerald-600 shrink-0" />
              <div>
                <p className="font-extrabold text-sm text-slate-800">Auditoría del Agente 6 al día</p>
                <p className="text-emerald-700 mt-0.5">Todas las devoluciones están conciliadas en bodega o radicadas ante CAS.</p>
              </div>
            </div>
          </div>
        )
      )}

      {/* RESUMEN DE GESTIÓN */}
      {resumenGestion && tieneAccesoCASDevoluciones && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-4">
          <div className="flex justify-between items-center flex-wrap gap-2 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center">
                <Sparkles size={16} />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-slate-800 tracking-tight">Devoluciones Gestionadas y Auditadas</h3>
                <p className="text-[11px] text-slate-400">Última ejecución: {resumenGestion.fechaHora}</p>
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
                  <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 block">Reclamadas ante CAS</span>
                  <p className="text-xl font-black text-slate-800">{resumenGestion.reclamadas.length} Guías</p>
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

      {/* TABLA DE HISTÓRICO DE INTERVENCIONES */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-4">
        <div className="flex justify-between items-center flex-wrap gap-2">
          <div>
            <h2 className="text-base font-bold text-slate-800 tracking-tight">
              Histórico de Intervenciones Agénticas
            </h2>
            <p className="text-xs text-slate-400 font-normal">
              Acciones automáticas generadas por los agentes de tu plan.
            </p>
          </div>

          {filtroAgenteSeleccionado !== 'ALL' && (
            <span className="text-xs font-bold px-3 py-1 bg-orange-50 text-orange-800 border border-orange-200 rounded-xl">
              Filtrado por: {agentesEstado.find((t) => t.id === filtroAgenteSeleccionado)?.tag}
            </span>
          )}
        </div>

        <div className="overflow-x-auto rounded-xl">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-2">FECHA</th>
                <th className="py-3 px-3">AGENTE</th>
                <th className="py-3 px-4">ACCIÓN / INTERVENCIÓN</th>
                <th className="py-3 px-4 text-center">GUÍAS / EVENTOS</th>
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
                    <span className="text-[10px] font-black px-2 py-0.5 rounded bg-orange-50 border border-orange-200 text-[#FA7C16] font-mono">
                      {row.tagAgente}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-800">{row.tarea}</td>
                  <td className="py-3.5 px-4 text-center font-extrabold text-slate-800 font-mono">{row.guias}</td>
                  <td className="py-3.5 px-4 text-right font-bold text-slate-800 font-mono">{row.recaudo}</td>
                  <td className="py-3.5 px-4 text-center">
                    <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full px-3 py-0.5 text-[11px] font-bold inline-block">
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
// src/app/control/page.tsx
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { 
  Bot, 
  ChevronDown, 
  ChevronUp, 
  Clock, 
  Lock, 
  Plus, 
  Minus, 
  X, 
  Zap, 
  Wallet, 
  Calendar,
  Scale, 
  PackageX, 
  RefreshCcw, 
  Rocket, 
  BarChart3, 
  UserCheck, 
  Crown, 
  ShieldAlert, 
  BadgePercent, 
  ShieldX,
  AlertTriangle,
  ArrowRight,
  Radio,
  Cpu,
  Sparkles
} from 'lucide-react';

interface ToolItem {
  id: string;
  tag: string;
  nombre: string;
  icono: React.ElementType;
  resumen: string;
  disparoHorario: string;
  salidaNotif: string;
  accionDelegada: string;
  guiasGestionadas: string;       
  tipoMetricaGestionada: string;
  guiasPendientes: string;        
  tipoMetricaPendiente: string;
  activo: boolean;
  planRequerido: 'rescatista' | 'experto' | 'control_total';
}

const TOOLS_INICIALES: ToolItem[] = [
  // --- PLAN RESCATISTA ---
  {
    id: 'tool4',
    tag: 'AGENTE 1',
    nombre: 'Agente de Movilización de Guías Estancadas (+3 Días)',
    icono: Rocket,
    resumen: 'Presión automatizada sobre transportadoras para destrabar paquetes quietos en ruta.',
    disparoHorario: 'Ciclos de verificación autónoma cada 6 horas',
    salidaNotif: 'Push simultáneo a Transportadora y Dropshipper',
    accionDelegada: 'Envía un requerimiento prioritario a la transportadora ante cualquier orden frenada por más de 72 horas y sincroniza al vendedor con plantillas listas para asegurar la entrega con el cliente final.',
    guiasGestionadas: '142 Guías',
    tipoMetricaGestionada: 'Rescatadas exitosamente',
    guiasPendientes: '142 Guías',
    tipoMetricaPendiente: 'Por rescatar en ruta',
    activo: true,
    planRequerido: 'rescatista'
  },
  {
    id: 'tool_notif_novedad',
    tag: 'AGENTE 2',
    nombre: 'Agente de Notificaciones de Novedades sin Solución',
    icono: ShieldAlert,
    resumen: 'Radar preventivo de envíos varados esperando acción del vendedor.',
    disparoHorario: 'Escaneo inteligente diario a las 11:00 AM y 4:00 PM',
    salidaNotif: 'Notificación prioritaria vía WhatsApp',
    accionDelegada: 'Filtra las guías en novedad sin gestión y alerta directamente al equipo comercial o al dropshipper responsable para prevenir la devolución inminente.',
    guiasGestionadas: '320 Alertas',
    tipoMetricaGestionada: 'Novedades notificadas',
    guiasPendientes: '320 Novedades',
    tipoMetricaPendiente: 'Sin gestionar',
    activo: true,
    planRequerido: 'rescatista'
  },
  {
    id: 'tool5',
    tag: 'AGENTE 3',
    nombre: 'Agente de Reporte Diario del Negocio',
    icono: BarChart3,
    resumen: 'Consolidado ejecutivo matutino sobre el día D-1 con conciliación neta.',
    disparoHorario: 'Puntual a las 09:30 AM cada mañana',
    salidaNotif: 'Tarjeta ejecutiva en APP Dropi + Resumen WhatsApp',
    accionDelegada: 'Procesa todas las órdenes de la jornada previa ($D-1$), consolidando el porcentaje real de entregas efectivas, devoluciones contenidas y el balance neto ingresado en tu Wallet Dropi.',
    guiasGestionadas: '1 Envío / Día',
    tipoMetricaGestionada: 'Emitido hoy D-1',
    guiasPendientes: '1 Envío / Día',
    tipoMetricaPendiente: 'Por emitir reporte',
    activo: true,
    planRequerido: 'rescatista'
  },

  // --- PLAN EXPERTO ---
  {
    id: 'tool2',
    tag: 'AGENTE 4',
    nombre: 'Agente de Cierre de Novedad (+10 Días)',
    icono: PackageX,
    resumen: 'Expediente indemnizatorio por presunción de abandono en paquetes varados en novedad.',
    disparoHorario: 'Lunes a Sábado a las 08:00 AM',
    salidaNotif: 'Notificación Push en vivo + Registro en Panel de Alertas',
    accionDelegada: 'Detecta guías atrapadas en novedad por más de 10 días, declara formalmente el siniestro por abandono ante la logística y abre el caso de cobro inmediato a favor de tu bodega.',
    guiasGestionadas: '315 Guías',
    tipoMetricaGestionada: 'Indemnizadas mes',
    guiasPendientes: '315 Guías',
    tipoMetricaPendiente: 'Por reclamar abandono',
    activo: true,
    planRequerido: 'experto'
  },
  {
    id: 'tool1',
    tag: 'AGENTE 5',
    nombre: 'Agente de Cierre Logístico (+30 Días)',
    icono: Scale,
    resumen: 'Recuperación jurídica de capital retenido en guías con más de 30 días sin entrega.',
    disparoHorario: 'Escaneo inteligente diario a las 08:00 AM',
    salidaNotif: 'Alerta prioritaria en APP Dropi + Reporte ejecutivo WhatsApp',
    accionDelegada: 'Rastrea paquetes estancados por más de 30 días y radica de forma automática ante la transportadora el reclamo formal con número CAS oficial, asegurando la indemnización de tu dinero sin trámites manuales.',
    guiasGestionadas: '1.240 Guías',
    tipoMetricaGestionada: 'Radicadas CAS mes',
    guiasPendientes: '1.240 Guías',
    tipoMetricaPendiente: 'Por radicar CAS',
    activo: true,
    planRequerido: 'experto'
  },
  {
    id: 'tool3',
    tag: 'AGENTE 6',
    nombre: 'Agente de Auditoría de Devoluciones No Ingresadas (+7 Días)',
    icono: RefreshCcw,
    resumen: 'Cruce algorítmico entre paquetes devueltos en ruta y reingresos físicos en bodega.',
    disparoHorario: 'Monitoreo en segundo plano cada 2 horas',
    salidaNotif: 'Bitácora de auditoría en tiempo real + Alerta de inventario',
    accionDelegada: 'Verifica los retornos que no han entrado a tu bodega tras 7 días. Si el paquete no se pistolea físicamente, genera la reclamación por pérdida para proteger tu inventario de mermas invisibles.',
    guiasGestionadas: '16 Guías',
    tipoMetricaGestionada: 'Conciliadas en bodega',
    guiasPendientes: '16 Guías',
    tipoMetricaPendiente: 'Por conciliar en bodega',
    activo: true,
    planRequerido: 'experto'
  },
  {
    id: 'tool10',
    tag: 'AGENTE 7',
    nombre: 'Agente de Escudo Financiero de Márgenes',
    icono: ShieldX,
    resumen: 'Guardia de margen 24/7 que frena despachos con margen negativo o riesgo de fraude.',
    disparoHorario: 'Filtro instantáneo en el milisegundo en que entra la orden',
    salidaNotif: 'Bloqueo en vivo en Dropi + Registro de capital protegido',
    accionDelegada: 'Audita cada pedido nuevo antes de empaque. Si detecta margen neto negativo (flete + costo superan el recaudo) o riesgo de devolución por precio inflado, congela el despacho en Dropi y te salva de asumir fletes perdidos.',
    guiasGestionadas: '2.840 Pedidos',
    tipoMetricaGestionada: 'Filtro 24/7 en vivo',
    guiasPendientes: '85 Pedidos a pérdida',
    tipoMetricaPendiente: 'Por congelar despacho',
    activo: true,
    planRequerido: 'experto'
  },

  // --- PLAN CONTROL TOTAL ---
  {
    id: 'tool6',
    tag: 'AGENTE 8',
    nombre: 'Agente de Conexiones Inteligente con Sellers',
    icono: UserCheck,
    resumen: 'Conexión inteligente con Dropshippers top para escalar inventario de alto margen.',
    disparoHorario: 'Radar continuo con activación por Match Comercial',
    salidaNotif: 'Tarjetas proactivas con el Top 3 de Vendedores Élite',
    accionDelegada: 'Analiza tu inventario con mayor rentabilidad y lo cruza con el historial de ventas de Dropi. Al encontrar coincidencia, envía un Pitch Financiero al mejor Seller para que comience a vender tus productos de inmediato.',
    guiasGestionadas: '3 / 5 Drops',
    tipoMetricaGestionada: 'Matches realizados',
    guiasPendientes: '8 Matches Élite',
    tipoMetricaPendiente: 'Por conectar con Drops',
    activo: false,
    planRequerido: 'control_total'
  },
  {
    id: 'tool9',
    tag: 'AGENTE 9',
    nombre: 'Agente Liquidador de Capital Muerto con Sellers',
    icono: BadgePercent,
    resumen: 'Vaciado de bodegas de SKU sin movimiento mediante ofertas relámpago dirigidas.',
    disparoHorario: 'Escaneo mensual profundo el día 1 de cada mes',
    salidaNotif: 'Push de Oferta Exclusiva a Sellers especializados',
    accionDelegada: 'Rastrea productos sin ventas en los últimos 30 días, localiza a los 3 mejores vendedores de esa categoría exacta en Dropi y les despacha una propuesta de liquidación con descuento para recuperar tu capital de inmediato.',
    guiasGestionadas: '2 / 5 Drops',
    tipoMetricaGestionada: 'Ofertas despachadas',
    guiasPendientes: '430 Unidades',
    tipoMetricaPendiente: 'Por liquidar stock',
    activo: false,
    planRequerido: 'control_total'
  },
  {
    id: 'tool8',
    tag: 'AGENTE 10',
    nombre: 'Agente Rotura de Stock',
    icono: Crown,
    resumen: 'Prevención algorítmica de lucro cesante y redireccionamiento inteligente de pauta.',
    disparoHorario: 'Monitoreo predictivo 24/7 en tiempo real',
    salidaNotif: 'Alerta Temprana en APP Dropi antes del agotamiento',
    accionDelegada: 'Calcula tu velocidad de venta diaria contra tus existencias en bodega. Ante riesgo de quiebre, alerta para redirigir automáticamente a los dropshippers a productos similares de tu catálogo para nunca pausar ventas.',
    guiasGestionadas: '84 Productos',
    tipoMetricaGestionada: 'Auditados en vivo',
    guiasPendientes: '84 Productos',
    tipoMetricaPendiente: 'Por auditar stock',
    activo: false,
    planRequerido: 'control_total'
  },
  {
    id: 'tool_predictivo',
    tag: 'AGENTE 11',
    nombre: 'Agente Predictivo de Importación',
    icono: Zap,
    resumen: 'Proyecciones de compra basadas en tendencias consolidadas de ventas nacionales.',
    disparoHorario: 'Análisis de demanda quincenal',
    salidaNotif: 'Reporte de sugerencia de importación de inventario',
    accionDelegada: 'Cruza los volúmenes de ventas de Dropi para proyectar qué productos van a tener un pico de demanda en los próximos 45 días, entregando sugerencias de importación para anticiparse al mercado.',
    guiasGestionadas: '3 Proyecciones',
    tipoMetricaGestionada: 'Sugerencias emitidas',
    guiasPendientes: '3 Proyecciones',
    tipoMetricaPendiente: 'Por analizar mercado',
    activo: false,
    planRequerido: 'control_total'
  },
  {
    id: 'tool_explorador',
    tag: 'AGENTE 12',
    nombre: 'Agente Explorador de Mercados',
    icono: PackageX,
    resumen: 'Mapeo de ciudades con alta demanda y baja oferta de tus productos estrella.',
    disparoHorario: 'Análisis profundo el día 15 de cada mes',
    salidaNotif: 'Mapa de calor de oportunidades no explotadas',
    accionDelegada: 'Detecta en qué ciudades se buscan más tus productos sin competencia local, y contacta a sellers zonales con mejores tarifas de flete para ofrecerles distribución directa.',
    guiasGestionadas: '2 Zonas',
    tipoMetricaGestionada: 'Expansiones lanzadas',
    guiasPendientes: '5 Zonas',
    tipoMetricaPendiente: 'Por mapear',
    activo: false,
    planRequerido: 'control_total'
  },
];

export default function PanelControlAgentesPage() {
  const [tools, setTools] = useState<ToolItem[]>(TOOLS_INICIALES);
  const [expandedTools, setExpandedTools] = useState<Record<string, boolean>>({});

  const [planSuscrito, setPlanSuscrito] = useState<'rescatista' | 'experto' | 'control_total' | null>(null);

  const sincronizarStorageTools = (nuevasTools: ToolItem[]) => {
    try {
      const state = nuevasTools.map((t) => ({
        id: t.id,
        activo: t.activo,
      }));
      localStorage.setItem('atom_tools_state', JSON.stringify(state));
      window.dispatchEvent(new Event('atom_tools_updated'));
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    const leerSuscripcion = () => {
      const planGuardado = localStorage.getItem('atom_plan_activo');

      if (planGuardado !== null) {
        if (planGuardado === 'null' || planGuardado === '') {
          setPlanSuscrito(null);
        } else {
          const plan = planGuardado as 'rescatista' | 'experto' | 'control_total';
          setPlanSuscrito(plan);
        }
      }
    };

    leerSuscripcion();
    window.addEventListener('storage', leerSuscripcion);
    window.addEventListener('atom_plan_updated', leerSuscripcion);

    return () => {
      window.removeEventListener('storage', leerSuscripcion);
      window.removeEventListener('atom_plan_updated', leerSuscripcion);
    };
  }, []);

  const jerarquiaPlanes = { rescatista: 1, experto: 2, control_total: 3 };

  const calcularEstadoPorPlan = (tool: ToolItem) => {
    const tienePlanValido = planSuscrito !== null;
    const nivelUsuario = tienePlanValido ? jerarquiaPlanes[planSuscrito] : 0;
    const nivelRequerido = jerarquiaPlanes[tool.planRequerido];

    const estaBloqueadoPorPlan = nivelUsuario < nivelRequerido;
    const estaActivoReal = tool.activo && !estaBloqueadoPorPlan && tienePlanValido;

    return { estaBloqueadoPorPlan, estaActivoReal };
  };

  const toolsVisibles = useMemo(() => {
    const tienePlanValido = planSuscrito !== null;
    const nivelUsuario = tienePlanValido ? jerarquiaPlanes[planSuscrito] : 0;

    return tools.filter(tool => {
      const nivelRequerido = jerarquiaPlanes[tool.planRequerido];
      if (nivelRequerido <= nivelUsuario) return true; // Incluido en su plan
      if (nivelRequerido === nivelUsuario + 1) return true; // Vitrina Upsell
      if (!tienePlanValido && nivelRequerido <= 2) return true; // Demo sin plan
      return false;
    });
  }, [tools, planSuscrito]);

  const tienePlanValido = planSuscrito !== null;
  const toolsActivasCount = tools.filter((t) => calcularEstadoPorPlan(t).estaActivoReal).length;

  const toggleExpand = (id: string) => {
    setExpandedTools((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleToggleClick = (tool: ToolItem) => {
    const { estaBloqueadoPorPlan } = calcularEstadoPorPlan(tool);

    if (!tienePlanValido) {
      alert('Debes activar un Plan de Suscripción en el módulo de Planes para operar los agentes.');
      return;
    }

    if (estaBloqueadoPorPlan) {
      return;
    }

    const actualizadas = tools.map((t) =>
      t.id === tool.id ? { ...t, activo: !t.activo } : t
    );
    setTools(actualizadas);
    sincronizarStorageTools(actualizadas);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 p-6 lg:p-10 font-sans space-y-7">
      
      {/* CABECERA PRINCIPAL */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FA7C16] text-white flex items-center justify-center shadow-xs cursor-pointer group">
              <Bot size={22} strokeWidth={2.4} className="transition-transform duration-700 ease-in-out group-hover:rotate-[360deg]" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-2xl font-black text-slate-800 tracking-tight">
                  ATOM AGENTICO IA · Suite de Control
                </h1>
                <span className={`font-extrabold text-[10.5px] px-2.5 py-0.5 rounded-full uppercase tracking-wider border ${
                  tienePlanValido ? 'bg-orange-100 text-orange-800 border-orange-200' : 'bg-amber-100 text-amber-800 border-amber-200'
                }`}>
                  {tienePlanValido ? `${toolsActivasCount} de ${tools.length} Agentes Operativos` : 'Plan Inactivo'}
                </span>
              </div>
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-1.5 max-w-2xl font-medium">
            Centro de comando agéntico para automatizar flujos logísticos, comerciales y financieros.
          </p>
        </div>

        <div className="bg-white border border-slate-200 px-4 py-2.5 rounded-2xl shadow-2xs flex items-center gap-3 self-start md:self-auto">
          <div className="w-8 h-8 rounded-xl bg-orange-50 text-[#FA7C16] flex items-center justify-center">
            <Calendar size={16} strokeWidth={2.5} />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Periodo de Auditoría</span>
            <span className="text-xs font-black text-slate-800 font-mono">
              01 Nov 2026 – 25 Nov 2026
            </span>
          </div>
        </div>
      </div>

      {!tienePlanValido && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs shadow-2xs">
          <div className="flex items-center gap-3 text-amber-900">
            <AlertTriangle size={20} className="text-amber-600 shrink-0" />
            <div>
              <p className="font-black text-sm">Suscripción Inactiva o Cancelada</p>
              <p className="text-amber-800/90 font-medium">
                Tus agentes se encuentran pausados y protegidos con candado. Activa un plan mensual para habilitarlos.
              </p>
            </div>
          </div>
          <Link
            href="/planes"
            className="bg-[#FA7C16] hover:bg-[#EA580C] text-white px-4 py-2 rounded-xl font-black text-xs flex items-center gap-1.5 shrink-0 transition-colors shadow-xs"
          >
            <span>Ver Planes en USD</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      )}

      {/* BANNER DE ESTADÍSTICAS DEL PLAN */}
      <div className="bg-white border border-slate-200/90 rounded-[26px] p-6 shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-black tracking-wider text-slate-400 uppercase">
                ESTADO DEL PLAN DE AGENTES
              </span>
              <span className={`w-2.5 h-2.5 rounded-full ${tienePlanValido ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`} />
            </div>

            <p className="text-xl font-black text-slate-800 tracking-tight uppercase">
              {planSuscrito === 'control_total' && 'Plan Control Total (149 USD/mes)'}
              {planSuscrito === 'experto' && 'Plan Experto (99 USD/mes)'}
              {planSuscrito === 'rescatista' && 'Plan Rescatista (69 USD/mes)'}
              {!planSuscrito && 'Modo Observación (Sin Suscripción)'}
            </p>

            <p className="text-xs text-slate-500 font-medium max-w-xl">
              {tienePlanValido ? (
                'Todos los agentes incluidos en tu plan operan de forma ilimitada sin cobros adicionales por evento.'
              ) : (
                'Activa tu plan para desbloquear la gestión automática y habilitar el panel de ejecución.'
              )}
            </p>
          </div>

        </div>
      </div>

      {/* LISTADO DE AGENTES EN ACORDEÓN */}
      <div className="space-y-3">
        {toolsVisibles.map((tool) => {
          const isExpanded = !!expandedTools[tool.id];
          const IconComponent = tool.icono;
          const { estaBloqueadoPorPlan, estaActivoReal } = calcularEstadoPorPlan(tool);

          return (
            <div
              key={tool.id}
              className={`group bg-white border rounded-2xl transition-all duration-200 overflow-hidden shadow-xs relative ${
                estaActivoReal 
                  ? 'border-slate-200 hover:border-slate-300' 
                  : estaBloqueadoPorPlan 
                    ? 'border-dashed border-slate-300 bg-slate-50/30' 
                    : 'border-slate-200/70 bg-slate-50/40'
              }`}
            >
              {/* VITRINA COMERCIAL: Overlay sutil decorativo para los agentes bloqueados */}
              {estaBloqueadoPorPlan && tienePlanValido && (
                <div className="absolute top-0 right-0 bg-gradient-to-l from-orange-50 to-transparent w-48 h-full pointer-events-none opacity-40" />
              )}

              <div
                onClick={() => toggleExpand(tool.id)}
                className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer select-none transition-colors hover:bg-slate-50/80 relative z-10"
              >
                <div className="flex items-center gap-3.5 flex-1 min-w-0">
                  <div className={`w-11 h-11 rounded-2xl border flex items-center justify-center shrink-0 transition-all duration-500 ${
                    estaActivoReal 
                      ? 'bg-orange-50 border-orange-200 text-[#FA7C16] group-hover:bg-[#FA7C16] group-hover:text-white group-hover:scale-105' 
                      : estaBloqueadoPorPlan
                      ? 'bg-slate-100 border-slate-200 text-slate-400'
                      : 'bg-slate-100 border-slate-200 text-slate-400 group-hover:text-slate-700 group-hover:bg-slate-200'
                  }`}>
                    {estaBloqueadoPorPlan ? <Lock size={18} strokeWidth={2.4} /> : (
                      <IconComponent 
                        size={20} 
                        strokeWidth={2.2} 
                        className="transition-transform duration-700 ease-in-out group-hover:rotate-[360deg]" 
                      />
                    )}
                  </div>

                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider border ${
                        estaActivoReal
                          ? 'bg-orange-100 text-orange-800 border-orange-200'
                          : estaBloqueadoPorPlan
                          ? 'bg-slate-200 text-slate-600 border-slate-300'
                          : 'bg-slate-200 text-slate-600 border-slate-300'
                      }`}>
                        {tool.tag}
                      </span>
                      
                      <h3 className={`text-sm font-black tracking-tight truncate ${estaBloqueadoPorPlan ? 'text-slate-600' : 'text-slate-800'}`}>
                        {tool.nombre}
                      </h3>

                      {estaBloqueadoPorPlan ? (
                        <span className="text-[10.5px] font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Sparkles size={10} /> Requiere Plan {tool.planRequerido === 'control_total' ? 'Control Total' : 'Experto'}
                        </span>
                      ) : estaActivoReal ? (
                        <span className="text-[10.5px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Activo (Ilimitado)
                        </span>
                      ) : (
                        <span className="text-[10.5px] font-bold text-slate-500 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Lock size={10} /> Pausado
                        </span>
                      )}
                    </div>

                    <p className={`text-xs font-medium truncate ${estaBloqueadoPorPlan ? 'text-slate-400' : 'text-slate-500'}`}>
                      {tool.resumen}
                    </p>
                  </div>
                </div>

                <div 
                  className="flex items-center justify-between md:justify-end gap-5 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="text-left md:text-right">
                    <span className={`text-[9.5px] uppercase block tracking-wider ${
                      estaActivoReal ? 'font-bold text-slate-400' : 'font-extrabold text-slate-400'
                    }`}>
                      {estaActivoReal ? tool.tipoMetricaGestionada : estaBloqueadoPorPlan ? 'Impacto Mensual Estimado' : tool.tipoMetricaPendiente}
                    </span>
                    <span className={`text-xs font-black font-mono ${
                      estaActivoReal ? 'text-slate-800' : estaBloqueadoPorPlan ? 'text-slate-400' : 'text-[#FA7C16]'
                    }`}>
                      {estaActivoReal ? tool.guiasGestionadas : tool.guiasPendientes}
                    </span>
                  </div>

                  {estaBloqueadoPorPlan ? (
                     <Link
                     href="/planes"
                     className="bg-amber-50 border border-amber-200 hover:bg-amber-100 text-amber-800 text-xs font-black px-4 py-2 rounded-xl transition-transform duration-200 active:scale-95 flex items-center gap-1.5 shadow-xs"
                   >
                     <span>Hacer Upgrade</span>
                   </Link>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleToggleClick(tool)}
                      className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer shrink-0 ${
                        estaActivoReal ? 'bg-emerald-500' : 'bg-slate-300'
                      }`}
                      title={estaActivoReal ? 'Pausar Agente' : 'Activar Agente'}
                    >
                      <div
                        className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform flex items-center justify-center ${
                          estaActivoReal ? 'translate-x-6' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  )}

                  <button 
                    type="button" 
                    onClick={() => toggleExpand(tool.id)} 
                    className="p-1 text-slate-400 hover:text-slate-700 transition-transform duration-200"
                  >
                    {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </button>
                </div>
              </div>

              {isExpanded && (
                <div className="border-t border-slate-100 bg-slate-50/50 p-5 space-y-4 animate-in fade-in duration-200 relative z-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs space-y-2">
                      <div className="flex items-center gap-2 text-slate-800">
                        <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                          <Clock size={15} strokeWidth={2.4} />
                        </div>
                        <span className="text-xs font-black uppercase tracking-wider">Disparo Cron y Notificación</span>
                      </div>
                      <div className="space-y-1.5 pt-1 text-xs">
                        <div className="flex items-start gap-2 text-slate-700">
                          <Radio size={14} className="text-[#FA7C16] shrink-0 mt-0.5" />
                          <p><strong className="text-slate-800">Frecuencia:</strong> {tool.disparoHorario}</p>
                        </div>
                        <div className="flex items-start gap-2 text-slate-700">
                          <Zap size={14} className="text-blue-500 shrink-0 mt-0.5" />
                          <p><strong className="text-slate-800">Canal de Salida:</strong> {tool.salidaNotif}</p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs space-y-2">
                      <div className="flex items-center gap-2 text-slate-800">
                        <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                          <Cpu size={15} strokeWidth={2.4} />
                        </div>
                        <span className="text-xs font-black uppercase tracking-wider">Acción Delegada de la IA</span>
                      </div>
                      <p className="text-xs text-slate-600 font-medium leading-relaxed pt-1">
                        {tool.accionDelegada}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
}
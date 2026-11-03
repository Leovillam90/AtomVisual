// src/app/control/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Bot, 
  ChevronDown, 
  ChevronUp, 
  Clock, 
  CheckCircle2, 
  Lock, 
  Plus, 
  Minus, 
  X, 
  Check, 
  PlusCircle, 
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
  Cpu
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
  // Métricas dinámicas según estado
  guiasGestionadas: string;       // Lo que se gestionó (Plan Activo)
  tipoMetricaGestionada: string;
  guiasPendientes: string;        // Lo que tiene pendiente por gestionar (Plan Inactivo)
  tipoMetricaPendiente: string;
  activo: boolean;
  esOfensivo: boolean;
  capacidadEventos: string;
  eventosRestantes: number;
}

const TOOLS_INICIALES: ToolItem[] = [
  // --- TOOLS 1 AL 5: INCLUIDAS EN EL PLAN BASE (SOLO ON / OFF) ---
  {
    id: 'tool1',
    tag: 'TOOL 1',
    nombre: 'Cobranza CAS Cierre Logístico (+30D)',
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
    esOfensivo: false,
    capacidadEventos: 'Ilimitado en plan',
    eventosRestantes: 0,
  },
  {
    id: 'tool2',
    tag: 'TOOL 2',
    nombre: 'Cobranza CAS Cierre de Novedad (+10D)',
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
    esOfensivo: false,
    capacidadEventos: 'Ilimitado en plan',
    eventosRestantes: 0,
  },
  {
    id: 'tool3',
    tag: 'TOOL 3',
    nombre: 'Auditoría Devoluciones (+7D)',
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
    esOfensivo: false,
    capacidadEventos: 'Ilimitado en plan',
    eventosRestantes: 0,
  },
  {
    id: 'tool4',
    tag: 'TOOL 4',
    nombre: 'Rescatista de Movilización (+3D)',
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
    esOfensivo: false,
    capacidadEventos: 'Ilimitado en plan',
    eventosRestantes: 0,
  },
  {
    id: 'tool5',
    tag: 'TOOL 5',
    nombre: 'Reporte Diario de Rendimiento (09:30 AM)',
    icono: BarChart3,
    resumen: 'Consolidado ejecutivo matutino sobre el día D-1 con conciliación neta de cartera.',
    disparoHorario: 'Puntual a las 09:30 AM cada mañana',
    salidaNotif: 'Tarjeta ejecutiva en APP Dropi + Resumen WhatsApp',
    accionDelegada: 'Procesa todas las órdenes de la jornada previa ($D-1$), consolidando el porcentaje real de entregas efectivas, devoluciones contenidas y el balance neto ingresado en tu Wallet Dropi.',
    guiasGestionadas: '1 Envío / Día',
    tipoMetricaGestionada: 'Emitido hoy D-1',
    guiasPendientes: '1 Envío / Día',
    tipoMetricaPendiente: 'Por emitir reporte',
    activo: true,
    esOfensivo: false,
    capacidadEventos: '1 reporte diario',
    eventosRestantes: 0,
  },

  // --- TOOLS 6 AL 10: BRAZO OFENSIVO (CALIBRACIÓN DE EVENTOS Y LÍMITES) ---
  {
    id: 'tool6',
    tag: 'TOOL 6',
    nombre: 'Agente Headhunter Comercial',
    icono: UserCheck,
    resumen: 'Conexión inteligente con Dropshippers top para escalar inventario de alto margen.',
    disparoHorario: 'Radar continuo con activación por Match Comercial',
    salidaNotif: 'Tarjetas proactivas con el Top 3 de Vendedores Élite',
    accionDelegada: 'Analiza tu inventario con mayor rentabilidad y lo cruza con el historial de ventas de Dropi. Al encontrar coincidencia, envía un Pitch Financiero al mejor Seller para que comience a vender tus productos de inmediato.',
    guiasGestionadas: '3 / 5 Drops Conectados',
    tipoMetricaGestionada: 'Matches realizados',
    guiasPendientes: '8 Matches Élite',
    tipoMetricaPendiente: 'Por conectar con Drops',
    activo: false,
    esOfensivo: true,
    capacidadEventos: '5 eventos al mes',
    eventosRestantes: 0,
  },
  {
    id: 'tool7',
    tag: 'TOOL 7',
    nombre: 'Privatización y Gobierno de Stock',
    icono: Crown,
    resumen: 'Supervisión anti-desperdicio para productos con exclusividad cedida a sellers.',
    disparoHorario: 'Auditoría mensual de cumplimiento el día 25',
    salidaNotif: 'Alerta de Gobierno de Stock + Sugerencia de Reasignación',
    accionDelegada: 'Cruza la meta acordada con las órdenes reales del vendedor exclusivo. Si incumple el volumen pactado, revoca la exclusividad y reasigna el stock a Sellers con alto Score de entrega.',
    guiasGestionadas: '12 Guías',
    tipoMetricaGestionada: 'Evaluadas en meta',
    guiasPendientes: '12 Guías',
    tipoMetricaPendiente: 'Por auditar exclusividad',
    activo: false,
    esOfensivo: true,
    capacidadEventos: '4 eventos al mes',
    eventosRestantes: 0,
  },
  {
    id: 'tool8',
    tag: 'TOOL 8',
    nombre: 'Agente Antiviral de Quiebre de Stock',
    icono: ShieldAlert,
    resumen: 'Prevención algorítmica de lucro cesante y redireccionamiento inteligente de pauta.',
    disparoHorario: 'Monitoreo predictivo 24/7 en tiempo real',
    salidaNotif: 'Alerta Temprana en APP Dropi antes del agotamiento',
    accionDelegada: 'Calcula tu velocidad de venta diaria contra tus existencias en bodega. Ante riesgo de quiebre, proyecta la orden de importación o redirige automáticamente a los dropshippers a productos similares de tu catálogo para nunca pausar ventas.',
    guiasGestionadas: '84 Productos Auditados',
    tipoMetricaGestionada: 'Sin límite en el mes',
    guiasPendientes: '84 Productos',
    tipoMetricaPendiente: 'Por auditar stock',
    activo: false,
    esOfensivo: true,
    capacidadEventos: 'Auditoría sin límite mensual',
    eventosRestantes: 0,
  },
  {
    id: 'tool9',
    tag: 'TOOL 9',
    nombre: 'Liquidador de Capital Muerto',
    icono: BadgePercent,
    resumen: 'Vaciado de bodegas de SKU sin movimiento mediante ofertas relámpago dirigidas.',
    disparoHorario: 'Escaneo mensual profundo el día 1 de cada mes',
    salidaNotif: 'Push de Oferta Exclusiva enviado a Sellers especializados',
    accionDelegada: 'Rastrea productos sin ventas en los últimos 30 días, localiza a los 3 mejores vendedores de esa categoría exacta en Dropi y les despacha una propuesta de liquidación con descuento para recuperar tu capital de inmediato.',
    guiasGestionadas: '2 / 5 Drops Conectados',
    tipoMetricaGestionada: 'Ofertas despachadas',
    guiasPendientes: '430 Unidades',
    tipoMetricaPendiente: 'Por liquidar stock muerto',
    activo: false,
    esOfensivo: true,
    capacidadEventos: '5 eventos al mes',
    eventosRestantes: 0,
  },
  {
    id: 'tool10',
    tag: 'TOOL 10',
    nombre: 'Escudo Financiero de Órdenes',
    icono: ShieldX,
    resumen: 'Guardia de margen 24/7 que frena despachos con margen negativo o riesgo de fraude.',
    disparoHorario: 'Filtro instantáneo en el milisegundo en que entra la orden',
    salidaNotif: 'Bloqueo en vivo en Dropi + Registro de capital protegido',
    accionDelegada: 'Audita cada pedido nuevo antes de empaque. Si detecta margen neto negativo (flete + costo superan el recaudo) o riesgo de devolución por precio inflado, congela el despacho en Dropi y te salva de asumir fletes perdidos.',
    guiasGestionadas: '2.840 Pedidos Auditados',
    tipoMetricaGestionada: 'Filtro 24/7 en vivo',
    guiasPendientes: '85 Pedidos a pérdida',
    tipoMetricaPendiente: 'Por congelar despacho',
    activo: false,
    esOfensivo: true,
    capacidadEventos: 'Auditoría sin límite mensual',
    eventosRestantes: 0,
  },
];

export default function PanelControlAgentesPage() {
  const [tools, setTools] = useState<ToolItem[]>(TOOLS_INICIALES);
  const [expandedTools, setExpandedTools] = useState<Record<string, boolean>>({});

  // Sincronización con el plan contratado en /planes
  const [planSuscrito, setPlanSuscrito] = useState<'basico' | 'control_total' | null>('control_total');
  const [renovacionActiva, setRenovacionActiva] = useState<boolean>(true);

  // Datos de consumo y saldo Wallet
  const [walletBalance, setWalletBalance] = useState<number>(8450000);
  const [cupoUsado, setCupoUsado] = useState<number>(2140);
  const [cupoTotal, setCupoTotal] = useState<number>(5000);
  const [bolsaExtra, setBolsaExtra] = useState<number>(1000);

  // Modales
  const [toolToActivate, setToolToActivate] = useState<ToolItem | null>(null);
  const [autorizaDebitoTool, setAutorizaDebitoTool] = useState<boolean>(false);
  const [procesandoTool, setProcesandoTool] = useState<boolean>(false);

  const [showRecargaModal, setShowRecargaModal] = useState<boolean>(false);
  const [packsSeleccionados, setPacksSeleccionados] = useState<number>(1);
  const [autorizaDebitoBolsa, setAutorizaDebitoBolsa] = useState<boolean>(false);
  const [procesandoBolsa, setProcesandoBolsa] = useState<boolean>(false);

  // Guardar estado consolidado de tools para sincronizar con alertas
  const sincronizarStorageTools = (nuevasTools: ToolItem[]) => {
    try {
      const state = nuevasTools.map((t) => ({
        id: t.id,
        activo: t.activo,
        guiasImpacto: t.activo ? t.guiasGestionadas : t.guiasPendientes,
      }));
      localStorage.setItem('atom_tools_state', JSON.stringify(state));
      window.dispatchEvent(new Event('atom_tools_updated'));
    } catch (e) {
      console.error(e);
    }
  };

  // Leer estado de suscripción desde localStorage y suscribirse a eventos en vivo
  useEffect(() => {
    const leerSuscripcion = () => {
      const planGuardado = localStorage.getItem('atom_plan_activo');
      const renovacionGuardada = localStorage.getItem('atom_renovacion_activa');

      if (planGuardado !== null) {
        if (planGuardado === 'null' || planGuardado === '') {
          setPlanSuscrito(null);
        } else {
          const plan = planGuardado as 'basico' | 'control_total';
          setPlanSuscrito(plan);
          setCupoTotal(plan === 'control_total' ? 5000 : 1500);
        }
      }

      if (renovacionGuardada !== null) {
        setRenovacionActiva(renovacionGuardada === 'true');
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

  const porcentajeConsumo = Math.round((cupoUsado / cupoTotal) * 100);
  const tienePlanValido = planSuscrito !== null;
  const toolsActivasCount = tools.filter((t) => t.activo && tienePlanValido).length;

  const toggleExpand = (id: string) => {
    setExpandedTools((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleToggleClick = (tool: ToolItem) => {
    if (!tienePlanValido) {
      alert('Debes activar un Plan de Suscripción en el módulo de Planes para operar los agentes.');
      return;
    }

    if (planSuscrito === 'basico' && !tool.esOfensivo && tool.id !== 'tool4' && tool.id !== 'tool5') {
      alert('Esta Tool requiere el "Pack Control Total". Actualiza tu plan en la pestaña de Planes.');
      return;
    }

    if (!tool.esOfensivo) {
      const actualizadas = tools.map((t) =>
        t.id === tool.id ? { ...t, activo: !t.activo } : t
      );
      setTools(actualizadas);
      sincronizarStorageTools(actualizadas);
      return;
    }

    if (tool.eventosRestantes === 0) {
      setToolToActivate(tool);
      setAutorizaDebitoTool(false);
      return;
    }

    const actualizadas = tools.map((t) =>
      t.id === tool.id ? { ...t, activo: !t.activo } : t
    );
    setTools(actualizadas);
    sincronizarStorageTools(actualizadas);
  };

  const handlePagarYActivarTool = () => {
    if (!autorizaDebitoTool) {
      alert('Debes autorizar el débito único desde tu Wallet Dropi.');
      return;
    }

    if (walletBalance < 100000) {
      alert('Saldo insuficiente en tu Wallet Dropi.');
      return;
    }

    setProcesandoTool(true);
    setTimeout(() => {
      setWalletBalance((prev) => prev - 100000);
      const actualizadas = tools.map((t) =>
        t.id === toolToActivate?.id
          ? { ...t, activo: true, eventosRestantes: (t.id === 'tool6' || t.id === 'tool9') ? 5 : 4 }
          : t
      );
      setTools(actualizadas);
      sincronizarStorageTools(actualizadas);

      if (toolToActivate) {
        setExpandedTools((prev) => ({ ...prev, [toolToActivate.id]: true }));
      }

      setProcesandoTool(false);
      setToolToActivate(null);
    }, 500);
  };

  const handleComprarBolsa = () => {
    if (!autorizaDebitoBolsa) {
      alert('Debes autorizar el débito único desde tu Wallet Dropi.');
      return;
    }

    const costoTotal = packsSeleccionados * 50000;
    const guiasTotales = packsSeleccionados * 1000;

    if (walletBalance < costoTotal) {
      alert('Saldo insuficiente en Wallet Dropi.');
      return;
    }

    setProcesandoBolsa(true);
    setTimeout(() => {
      setWalletBalance((prev) => prev - costoTotal);
      setBolsaExtra((prev) => prev + guiasTotales);
      setProcesandoBolsa(false);
      setShowRecargaModal(false);
      setPacksSeleccionados(1);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 p-6 lg:p-10 font-sans space-y-7">
      
      {/* CABECERA PRINCIPAL CON FECHA DE AUDITORÍA */}
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
                  {tienePlanValido ? `${toolsActivasCount} de ${tools.length} Tools Operativas` : 'Plan Inactivo · Acciones en Pausa'}
                </span>
              </div>
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-1.5 max-w-2xl font-medium">
            Centro de comando agéntico para cobranza CAS automática, rescate de mercancía y gobierno de inventarios.
          </p>
        </div>

        {/* PILL FECHA DE AUDITORÍA */}
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

      {/* AVISO SI EL PLAN ESTÁ INACTIVO */}
      {!tienePlanValido && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs shadow-2xs">
          <div className="flex items-center gap-3 text-amber-900">
            <AlertTriangle size={20} className="text-amber-600 shrink-0" />
            <div>
              <p className="font-black text-sm">Suscripción Inactiva o Cancelada</p>
              <p className="text-amber-800/90 font-medium">
                Tus agentes se encuentran pausados y protegidos con candado. Cada tool muestra el volumen pendiente por gestionar al activar tu plan.
              </p>
            </div>
          </div>
          <Link
            href="/planes"
            className="bg-[#FA7C16] hover:bg-[#EA580C] text-white px-4 py-2 rounded-xl font-black text-xs flex items-center gap-1.5 shrink-0 transition-colors shadow-xs"
          >
            <span>Ver Planes</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      )}

      {/* BANNER DE ESTADÍSTICAS DEL PLAN Y BOLSA EXTRA */}
      <div className="bg-white border border-slate-200/90 rounded-[26px] p-6 shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-black tracking-wider text-slate-400 uppercase">
                ESTADO DEL PLAN DE AGENTES
              </span>
              <span className={`w-2.5 h-2.5 rounded-full ${tienePlanValido ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`} />
            </div>

            <p className="text-xl font-black text-slate-800 tracking-tight">
              {planSuscrito === 'control_total' && 'Pack Control Total ($350.000 COP/mes)'}
              {planSuscrito === 'basico' && 'Pack Básico Rescatista ($250.000 COP/mes)'}
              {!planSuscrito && 'Modo Observación (Sin Suscripción)'}
            </p>

            <p className="text-xs text-slate-500 font-medium">
              {tienePlanValido ? (
                'Tools 1 al 5 incluidas según plan · Tools 6 al 10 con activación de eventos por demanda'
              ) : (
                'Activa tu plan para desbloquear la gestión automática y habilitar la bolsa de ejecución extra'
              )}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            
            {/* Medidor de consumo de guías del mes */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 min-w-[260px] space-y-2">
              <div className="flex justify-between items-baseline text-xs">
                <span className="text-slate-500 font-bold">Cupo Mensual Auditado:</span>
                <span className="font-mono font-black text-slate-800">
                  {tienePlanValido ? `${cupoUsado.toLocaleString('es-CO')} / ${cupoTotal.toLocaleString('es-CO')} Guías` : '0 / 0 Guías'}
                </span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-[#FA7C16] h-full rounded-full transition-all duration-500" 
                  style={{ width: `${tienePlanValido ? porcentajeConsumo : 0}%` }} 
                />
              </div>
              <div className="flex justify-between text-[11px] font-semibold text-slate-400">
                <span>{tienePlanValido ? `${porcentajeConsumo}% consumido` : 'Inactivo'}</span>
                <span>Restan {tienePlanValido ? (cupoTotal - cupoUsado).toLocaleString('es-CO') : 0} guías</span>
              </div>
            </div>

            {/* Bolsa Extra Prepago: Solo visible si existe un plan activo */}
            {tienePlanValido && (
              <div className="bg-orange-50/70 border border-orange-200/80 rounded-2xl p-4 flex items-center justify-between gap-5 animate-in fade-in duration-200">
                <div>
                  <span className="text-[10px] font-bold text-orange-900 uppercase block">
                    BOLSA DE EJECUCIÓN EXTRA
                  </span>
                  <p className="text-base font-black text-orange-700 mt-0.5 font-mono">
                    {bolsaExtra.toLocaleString('es-CO')} Guías
                  </p>
                  <span className="text-[10.5px] text-orange-800/80">Prepago de continuidad</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setShowRecargaModal(true);
                    setAutorizaDebitoBolsa(false);
                  }}
                  className="bg-[#FA7C16] hover:bg-[#EA580C] text-white text-xs font-black px-4 py-2.5 rounded-xl transition-all shadow-xs cursor-pointer flex items-center gap-1.5 shrink-0"
                >
                  <Plus size={14} strokeWidth={2.6} />
                  <span>Recargar</span>
                </button>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* LISTADO DE TOOLS EN ACORDEÓN */}
      <div className="space-y-3">
        {tools.map((tool) => {
          const isExpanded = !!expandedTools[tool.id];
          const IconComponent = tool.icono;
          const esToolOfensivo = tool.esOfensivo;

          const estaBloqueadoPorPlan = 
            !tienePlanValido || 
            (planSuscrito === 'basico' && !esToolOfensivo && tool.id !== 'tool4' && tool.id !== 'tool5');

          const estaActivoReal = tool.activo && !estaBloqueadoPorPlan;

          return (
            <div
              key={tool.id}
              className={`group bg-white border rounded-2xl transition-all duration-200 overflow-hidden shadow-xs ${
                estaActivoReal 
                  ? 'border-slate-200 hover:border-slate-300' 
                  : 'border-slate-200/70 bg-slate-50/40'
              }`}
            >
              {/* FILA PRINCIPAL */}
              <div
                onClick={() => toggleExpand(tool.id)}
                className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer select-none transition-colors hover:bg-slate-50/80"
              >
                <div className="flex items-center gap-3.5 flex-1 min-w-0">
                  <div className={`w-11 h-11 rounded-2xl border flex items-center justify-center shrink-0 transition-all duration-500 ${
                    estaActivoReal 
                      ? 'bg-orange-50 border-orange-200 text-[#FA7C16] group-hover:bg-[#FA7C16] group-hover:text-white group-hover:scale-105' 
                      : 'bg-slate-100 border-slate-200 text-slate-400 group-hover:text-slate-700 group-hover:bg-slate-200'
                  }`}>
                    <IconComponent 
                      size={20} 
                      strokeWidth={2.2} 
                      className="transition-transform duration-700 ease-in-out group-hover:rotate-[360deg]" 
                    />
                  </div>

                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider border ${
                        estaActivoReal
                          ? esToolOfensivo ? 'bg-purple-100 text-purple-800 border-purple-200' : 'bg-orange-100 text-orange-800 border-orange-200'
                          : 'bg-slate-200 text-slate-600 border-slate-300'
                      }`}>
                        {tool.tag}
                      </span>
                      <h3 className="text-sm font-black text-slate-800 tracking-tight truncate">
                        {tool.nombre}
                      </h3>

                      {estaBloqueadoPorPlan ? (
                        <span className="text-[10.5px] font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Lock size={10} /> Bloqueado por Plan
                        </span>
                      ) : estaActivoReal ? (
                        <span className="text-[10.5px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Activo
                        </span>
                      ) : (
                        <span className="text-[10.5px] font-bold text-slate-500 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Lock size={10} /> {tool.esOfensivo && tool.eventosRestantes > 0 ? 'Pausado (No consume)' : 'Pendiente por activar'}
                        </span>
                      )}

                      {tool.esOfensivo && tool.eventosRestantes > 0 && tienePlanValido && (
                        <span className="text-[10.5px] font-black text-purple-700 bg-purple-50 border border-purple-200 px-2 py-0.5 rounded-full">
                          {tool.eventosRestantes} Eventos disponibles
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-500 font-medium truncate">
                      {tool.resumen}
                    </p>
                  </div>
                </div>

                {/* MÉTRICAS DINÁMICAS (GESTIONADO VS PENDIENTE) Y BOTONES */}
                <div 
                  className="flex items-center justify-between md:justify-end gap-5 shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="text-left md:text-right">
                    <span className={`text-[9.5px] uppercase block tracking-wider ${
                      estaActivoReal ? 'font-bold text-slate-400' : 'font-extrabold text-amber-700/90'
                    }`}>
                      {estaActivoReal ? tool.tipoMetricaGestionada : tool.tipoMetricaPendiente}
                    </span>
                    <span className={`text-xs font-black font-mono ${
                      estaActivoReal ? 'text-slate-800' : 'text-[#FA7C16]'
                    }`}>
                      {estaActivoReal ? tool.guiasGestionadas : tool.guiasPendientes}
                    </span>
                  </div>

                  {tool.esOfensivo && tool.eventosRestantes === 0 ? (
                    <button
                      type="button"
                      onClick={() => handleToggleClick(tool)}
                      className="bg-[#FA7C16] hover:bg-[#EA580C] text-white text-xs font-black px-3.5 py-1.5 rounded-xl shadow-xs transition-transform duration-200 active:scale-95 flex items-center gap-1.5 cursor-pointer"
                    >
                      <PlusCircle size={14} className="transition-transform duration-500 group-hover:rotate-180" />
                      <span>Activar ($100.000)</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleToggleClick(tool)}
                      className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer shrink-0 ${
                        estaActivoReal ? 'bg-emerald-500' : 'bg-slate-300'
                      }`}
                      title={
                        estaBloqueadoPorPlan 
                          ? 'Plan inactivo o restringido' 
                          : estaActivoReal 
                          ? 'Pausar Tool para no consumir eventos' 
                          : 'Reanudar Tool'
                      }
                    >
                      <div
                        className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform flex items-center justify-center ${
                          estaActivoReal ? 'translate-x-6' : 'translate-x-0'
                        }`}
                      >
                        {estaBloqueadoPorPlan && <Lock size={9} strokeWidth={2.6} className="text-slate-400" />}
                      </div>
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

              {/* CONTENIDO DESPLEGABLE: 2 BLOQUES LIMPIOS */}
              {isExpanded && (
                <div className="border-t border-slate-100 bg-slate-50/50 p-5 space-y-4 animate-in fade-in duration-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-2xs space-y-2">
                      <div className="flex items-center gap-2 text-slate-800">
                        <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                          <Clock size={15} strokeWidth={2.4} />
                        </div>
                        <span className="text-xs font-black uppercase tracking-wider">
                          Disparo Cron y Notificación
                        </span>
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
                        <span className="text-xs font-black uppercase tracking-wider">
                          Acción Delegada de la IA
                        </span>
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

      {/* MODAL ACTIVACIÓN: TOOLS 6 AL 10 */}
      {toolToActivate && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-slate-200 rounded-[28px] p-6 lg:p-7 max-w-lg w-full shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex justify-between items-center border-b pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-orange-100 text-[#FA7C16] flex items-center justify-center font-bold">
                  <toolToActivate.icono size={20} strokeWidth={2.4} />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-800">
                    Activar {toolToActivate.nombre}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {toolToActivate.capacidadEventos}
                  </p>
                </div>
              </div>
              <button 
                type="button" 
                onClick={() => setToolToActivate(null)} 
                className="text-slate-400 hover:text-slate-700"
              >
                <X size={18} />
              </button>
            </div>

            <div className="bg-orange-50/80 border border-orange-200 rounded-2xl p-4 space-y-1.5">
              <div className="flex justify-between items-baseline">
                <span className="text-xs font-bold text-orange-950 uppercase">Tarifa de Activación</span>
                <span className="text-xl font-black text-[#FA7C16] font-mono">
                  $ 100.000 COP
                </span>
              </div>
              <p className="text-xs text-orange-900/80">
                Habilita <strong>{toolToActivate.capacidadEventos}</strong>. Puedes pausar o desactivar el agente en cualquier momento desde el interruptor para congelar el consumo de eventos y no gastar dinero.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl border-2 border-[#FA7C16] bg-orange-50/30 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <Wallet size={18} />
                </div>
                <div>
                  <p className="text-xs font-black text-slate-800">Débito Automático de Wallet Dropi</p>
                  <p className="text-[11px] text-slate-500 font-mono">Saldo disponible: $ {walletBalance.toLocaleString('es-CO')} COP</p>
                </div>
              </div>
              <CheckCircle2 size={18} className="text-[#FA7C16]" />
            </div>

            <label className="flex items-start gap-2.5 p-3.5 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer">
              <input 
                type="checkbox" 
                checked={autorizaDebitoTool} 
                onChange={(e) => setAutorizaDebitoTool(e.target.checked)} 
                className="mt-0.5 w-4 h-4 text-orange-600 rounded" 
              />
              <span className="text-xs font-medium text-slate-700 leading-snug">
                Autorizo el débito único de <strong>$100.000 COP</strong> desde mi Wallet Dropi para activar este agente ({toolToActivate.capacidadEventos}).
              </span>
            </label>

            <div className="flex justify-between items-center pt-2">
              <button 
                type="button" 
                onClick={() => setToolToActivate(null)} 
                className="text-xs font-bold text-slate-500 px-3 py-2 cursor-pointer"
              >
                Cancelar
              </button>
              <button 
                type="button" 
                disabled={procesandoTool} 
                onClick={handlePagarYActivarTool} 
                className="bg-[#FA7C16] hover:bg-[#EA580C] text-white px-5 py-2.5 rounded-xl text-xs font-black cursor-pointer shadow-xs flex items-center gap-2"
              >
                {procesandoTool ? (
                  <span>Debitando Wallet...</span>
                ) : (
                  <>
                    <Check size={16} strokeWidth={2.6} />
                    <span>Confirmar y Activar Agente</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL RECARGA BOLSA EXTRA (SOLO CON PLAN ACTIVO) */}
      {showRecargaModal && tienePlanValido && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-slate-200 rounded-[28px] p-6 max-w-md w-full shadow-2xl space-y-5">
            <div className="flex justify-between items-center border-b pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-orange-100 text-[#FA7C16] flex items-center justify-center">
                  <Plus size={18} strokeWidth={2.5} />
                </div>
                <h3 className="text-base font-black text-slate-800">Bolsa de Ejecución Extra</h3>
              </div>
              <button 
                type="button" 
                onClick={() => setShowRecargaModal(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X size={18} />
              </button>
            </div>

            <p className="text-xs text-slate-600">
              Selecciona la cantidad de paquetes prepago de 1.000 guías para que tus agentes nunca se detengan si superas el cupo mensual:
            </p>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-black text-slate-700 uppercase">Cantidad de Packs:</span>
                <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-xl px-2 py-1 shadow-2xs">
                  <button
                    type="button"
                    onClick={() => setPacksSeleccionados((prev) => Math.max(1, prev - 1))}
                    disabled={packsSeleccionados <= 1}
                    className="p-1 text-slate-500 hover:text-slate-900 disabled:opacity-30 cursor-pointer"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="font-mono font-black text-base text-slate-800 min-w-[24px] text-center">
                    {packsSeleccionados}
                  </span>
                  <button
                    type="button"
                    onClick={() => setPacksSeleccionados((prev) => Math.min(30, prev + 1))}
                    disabled={packsSeleccionados >= 30}
                    className="p-1 text-slate-500 hover:text-slate-900 disabled:opacity-30 cursor-pointer"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>

              <input
                type="range"
                min="1"
                max="30"
                value={packsSeleccionados}
                onChange={(e) => setPacksSeleccionados(Number(e.target.value))}
                className="w-full accent-[#FA7C16] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-bold">
                <span>1 Pack (1.000 Guías)</span>
                <span>Máx 30 Packs (30.000 Guías)</span>
              </div>
            </div>

            <div className="bg-orange-50/80 border border-orange-200 rounded-2xl p-4 space-y-1">
              <div className="flex justify-between items-baseline text-xs">
                <span className="font-bold text-orange-950">Guías a Acreditar:</span>
                <span className="font-black text-slate-800 font-mono text-sm">
                  +{(packsSeleccionados * 1000).toLocaleString('es-CO')} Guías
                </span>
              </div>
              <div className="flex justify-between items-baseline text-xs pt-1 border-t border-orange-200/50">
                <span className="font-bold text-orange-950">Total a Debitar de Wallet:</span>
                <span className="font-black text-[#FA7C16] font-mono text-base">
                  $ {(packsSeleccionados * 50000).toLocaleString('es-CO')} COP
                </span>
              </div>
            </div>

            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs text-emerald-900">
              <span className="font-bold">Débito directo Wallet Dropi:</span>
              <span className="font-mono font-black">$ {walletBalance.toLocaleString('es-CO')} Disponible</span>
            </div>

            <label className="flex items-start gap-2.5 p-3 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer">
              <input 
                type="checkbox" 
                checked={autorizaDebitoBolsa} 
                onChange={(e) => setAutorizaDebitoBolsa(e.target.checked)} 
                className="mt-0.5 w-4 h-4 text-orange-600 rounded" 
              />
              <span className="text-xs font-medium text-slate-700 leading-snug">
                Autorizo debitar de mi Wallet Dropi el valor de <strong>$ {(packsSeleccionados * 50000).toLocaleString('es-CO')} COP</strong> en este único evento de recarga.
              </span>
            </label>

            <div className="flex justify-between items-center pt-1">
              <button
                type="button"
                onClick={() => setShowRecargaModal(false)}
                className="text-xs font-bold text-slate-500 px-3 py-2 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                disabled={procesandoBolsa}
                onClick={handleComprarBolsa}
                className="bg-[#FA7C16] hover:bg-[#EA580C] text-white px-5 py-2.5 rounded-xl text-xs font-black cursor-pointer shadow-xs"
              >
                {procesandoBolsa ? 'Debitando...' : `Comprar ${packsSeleccionados * 1000} Guías`}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
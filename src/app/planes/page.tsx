// src/app/planes/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Bot, 
  ShieldCheck, 
  Wallet, 
  CheckCircle2, 
  X, 
  Check, 
  ArrowRight, 
  Sparkles, 
  AlertTriangle, 
  PauseCircle,
  FileCheck,
  Calendar
} from 'lucide-react';

interface Plan {
  id: 'basico' | 'control_total';
  nombre: string;
  tagline: string;
  precioCOP: string;
  precioUSD: string;
  cupoGuias: number;
  destacado?: boolean;
  beneficios: string[];
}

const PLANES_DISPONIBLES: Plan[] = [
  {
    id: 'basico',
    nombre: 'Pack Básico Rescatista',
    tagline: 'Movilización prioritaria y consolidado diario matutino.',
    precioCOP: '$ 250.000 COP',
    precioUSD: '85 USD',
    cupoGuias: 1500,
    beneficios: [
      'Hasta 1.500 guías auditadas por mes',
      'Tool 1: Cobranza CAS Cierre Logístico (+30D)',
      'Tool 2: Cobranza CAS Cierre de Novedad (+10D)',
      'Tool 3: Rescatista de Movilización (+3D)',
      'Tool 4: Reporte Diario de Rendimiento (09:30 AM)',
      'Tool 5: Auditoría Devoluciones (+7D)',
      'Soporte operativo vía ticket Dropi',
      'ATOM academia'
    ]
  },
  {
    id: 'control_total',
    nombre: 'Pack Control Total',
    tagline: 'Operación autónoma completa y radicaciones CAS legales.',
    precioCOP: '$ 350.000 COP',
    precioUSD: '100 USD',
    cupoGuias: 5000,
    destacado: true,
    beneficios: [
      'Hasta 5.000 guías auditadas por mes',
      'Desbloqueo de módulos de Productos y Negocios',
      'Tools 1 al 5 incluidas con encendido/apagado libre',
      'Radicación jurídica formal CAS automática ante transportadoras',
      'Habilitación para activar Tools Ofensivas (6 al 10) por demanda',
      'Soporte operativo vía ticket Dropi',
      'ATOM academia',
      'Asesoría Empresarial'
    ]
  }
];

export default function PlanesPage() {
  // Inicialización inactiva por defecto para la demostración
  const [planActivo, setPlanActivo] = useState<'basico' | 'control_total' | null>(null);
  const [renovacionAutomatica, setRenovacionAutomatica] = useState<boolean>(false);
  
  // Fechas de vigencia del ciclo de suscripción
  const [fechaInicio, setFechaInicio] = useState<string>('03 Nov 2026');
  const [fechaFin, setFechaFin] = useState<string>('03 Dic 2026');
  const [diasRestantes, setDiasRestantes] = useState<number>(30);

  // Modales
  const [modalContratar, setModalContratar] = useState<Plan | null>(null);
  const [autorizaDescuento, setAutorizaDescuento] = useState<boolean>(false);
  const [procesandoPago, setProcesandoPago] = useState<boolean>(false);
  const [modalDesactivar, setModalDesactivar] = useState<boolean>(false);

  useEffect(() => {
    const planGuardado = localStorage.getItem('atom_plan_activo');
    const renovacionGuardada = localStorage.getItem('atom_renovacion_activa');

    if (planGuardado && planGuardado !== 'null') {
      setPlanActivo(planGuardado as 'basico' | 'control_total');
    } else {
      setPlanActivo(null);
    }

    if (renovacionGuardada !== null) {
      setRenovacionAutomatica(renovacionGuardada === 'true');
    }
  }, []);

  const handleConfirmarPlan = () => {
    if (!autorizaDescuento) {
      alert('Debes autorizar el descuento automático recurrente desde tu Wallet Dropi.');
      return;
    }

    if (!modalContratar) return;

    setProcesandoPago(true);

    setTimeout(() => {
      setPlanActivo(modalContratar.id);
      setRenovacionAutomatica(true);
      setFechaInicio('03 Nov 2026');
      setFechaFin('03 Dic 2026');
      setDiasRestantes(30);

      // Persistencia en localStorage
      localStorage.setItem('atom_plan_activo', modalContratar.id);
      localStorage.setItem('atom_renovacion_activa', 'true');

      // Emisión del evento en vivo para actualizar Sidebar y vistas comerciales
      window.dispatchEvent(new Event('atom_plan_updated'));

      setProcesandoPago(false);
      setModalContratar(null);
      setAutorizaDescuento(false);
    }, 600);
  };

  const handleDesactivarPlan = () => {
    setRenovacionAutomatica(false);
    setPlanActivo(null);

    // Persistencia en localStorage
    localStorage.setItem('atom_plan_activo', 'null');
    localStorage.setItem('atom_renovacion_activa', 'false');

    // Emisión del evento en vivo para actualizar Sidebar y vistas comerciales
    window.dispatchEvent(new Event('atom_plan_updated'));

    setModalDesactivar(false);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-700 p-6 lg:p-10 font-sans space-y-7">
      
      {/* CABECERA (CON INDICADOR DE VIGENCIA Y DÍAS RESTANTES) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FA7C16] text-white flex items-center justify-center shadow-xs">
              <ShieldCheck size={22} strokeWidth={2.4} />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">
                  Planes de Suscripción Agéntica · ATOM PRO
                </h1>
                <span className={`font-extrabold text-[10.5px] px-2.5 py-0.5 rounded-full uppercase tracking-wider border ${
                  planActivo 
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                    : 'bg-slate-200 text-slate-600 border-slate-300'
                }`}>
                  {planActivo ? 'Plan Activo' : 'Sin Suscripción'}
                </span>
              </div>
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl font-medium">
            Elige el plan que mejor se adapte a tu volumen logístico. Al activar tu plan mediante débito de Wallet Dropi, habilitas inmediatamente la suite en el Administrador.
          </p>
        </div>

        {/* INDICADOR DE FECHA DE VIGENCIA Y DÍAS FALTANTES */}
        {planActivo && (
          <div className="bg-white border border-slate-200 px-4 py-2.5 rounded-2xl shadow-2xs flex items-center gap-3 self-start md:self-auto">
            <div className="w-8 h-8 rounded-xl bg-orange-50 text-[#FA7C16] flex items-center justify-center">
              <Calendar size={16} strokeWidth={2.5} />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                Vigencia del Plan
              </span>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-800 font-mono">
                  {fechaInicio} a {fechaFin}
                </span>
                <span className="text-[10.5px] font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                  Faltan {diasRestantes} días
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* BANNER DE ESTADO ACTUAL */}
      <div className="bg-white border border-slate-200/90 rounded-[26px] p-6 shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-extrabold tracking-wider text-slate-400 uppercase">
                ESTADO DE FACTURACIÓN
              </span>
              {planActivo && <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />}
            </div>
            
            <p className="text-xl font-extrabold text-slate-800 tracking-tight">
              {planActivo === 'control_total' && 'Pack Control Total ($ 350.000 COP / 100 USD)'}
              {planActivo === 'basico' && 'Pack Básico Rescatista ($ 250.000 COP / 85 USD)'}
              {!planActivo && 'No tienes un plan activo actualmente'}
            </p>

            <p className="text-xs text-slate-500 font-medium">
              {planActivo && renovacionAutomatica ? (
                `Vigencia activa del ${fechaInicio} al ${fechaFin}. Faltan ${diasRestantes} días para el próximo pago con descuento automático en Wallet Dropi.`
              ) : planActivo && !renovacionAutomatica ? (
                'Renovación automática pausada. Los agentes se desactivarán al finalizar el ciclo.'
              ) : (
                'Selecciona un plan para desbloquear y operar las tools agénticas en el Administrador.'
              )}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {planActivo ? (
              <>
                <Link
                  href="/control"
                  className="bg-[#FA7C16] hover:bg-[#EA580C] text-white text-xs font-extrabold px-4 py-2.5 rounded-xl transition-all shadow-xs flex items-center gap-2 cursor-pointer"
                >
                  <Bot size={16} />
                  <span>Ir al Administrador de Tools</span>
                  <ArrowRight size={14} />
                </Link>

                <button
                  type="button"
                  onClick={() => setModalDesactivar(true)}
                  className="bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-600 text-xs font-bold px-3.5 py-2.5 rounded-xl border border-slate-200 transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <PauseCircle size={15} />
                  <span>Desactivar Plan</span>
                </button>
              </>
            ) : (
              <span className="text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 px-3.5 py-2 rounded-xl">
                Se requiere activación para operar
              </span>
            )}
          </div>
        </div>
      </div>

      {/* TARJETAS DE PLANES CON TEXTOS Y BENEFICIOS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {PLANES_DISPONIBLES.map((plan) => {
          const esPlanActual = planActivo === plan.id;

          return (
            <div
              key={plan.id}
              className={`bg-white border-2 rounded-[28px] p-6 lg:p-8 flex flex-col justify-between transition-all duration-300 shadow-xs relative ${
                plan.destacado ? 'border-orange-500/90 ring-4 ring-orange-500/5' : 'border-slate-200'
              }`}
            >
              {plan.destacado && (
                <div className="absolute -top-3.5 right-6 bg-[#FA7C16] text-white text-[10px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full shadow-xs flex items-center gap-1">
                  <Sparkles size={12} />
                  <span>Recomendado</span>
                </div>
              )}

              <div className="space-y-5">
                <div>
                  <h3 className="text-xl font-extrabold text-slate-800 tracking-tight">
                    {plan.nombre}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 font-medium">
                    {plan.tagline}
                  </p>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex items-baseline justify-between">
                  <div>
                    <span className="text-xl font-extrabold text-slate-800 font-mono">
                      {plan.precioCOP}
                    </span>
                    <span className="text-xs font-bold text-slate-500 ml-1.5">
                      / {plan.precioUSD}
                    </span>
                  </div>
                  <span className="text-xs font-extrabold text-slate-700 bg-white border border-slate-200 px-2.5 py-1 rounded-lg">
                    {plan.cupoGuias.toLocaleString('es-CO')} Guías / mes
                  </span>
                </div>

                <div className="space-y-2.5 pt-2">
                  <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
                    Funcionalidades Incluidas:
                  </span>
                  <ul className="space-y-2">
                    {plan.beneficios.map((beneficio, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-xs text-slate-700 leading-snug">
                        <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                        <span>{beneficio}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-100">
                {esPlanActual ? (
                  <div className="w-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-extrabold py-3 rounded-xl flex items-center justify-center gap-2">
                    <Check size={16} strokeWidth={2.6} />
                    <span>Plan Actual en Uso</span>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setModalContratar(plan);
                      setAutorizaDescuento(false);
                    }}
                    className="w-full bg-[#FA7C16] hover:bg-[#EA580C] text-white text-xs font-extrabold py-3 rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>{planActivo ? 'Cambiar a este Plan' : 'Activar y Pagar por Wallet'}</span>
                    <ArrowRight size={14} />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL ACTIVACIÓN CON AUTORIZACIÓN DE DESCUENTO AUTOMÁTICO EN WALLET */}
      {modalContratar && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-slate-200 rounded-[28px] p-6 lg:p-7 max-w-lg w-full shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
            
            <div className="flex justify-between items-center border-b pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-orange-100 text-[#FA7C16] flex items-center justify-center font-bold">
                  <FileCheck size={20} strokeWidth={2.4} />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-800">
                    Activar {modalContratar.nombre}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Autorización de Descuento Automático en Wallet Dropi
                  </p>
                </div>
              </div>
              <button 
                type="button" 
                onClick={() => setModalContratar(null)} 
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="bg-orange-50/80 border border-orange-200 rounded-2xl p-4 space-y-2">
              <div className="flex justify-between items-baseline">
                <span className="text-xs font-bold text-orange-950 uppercase">Tarifa Mensual Recurrente</span>
                <span className="text-xl font-extrabold text-[#FA7C16] font-mono">
                  {modalContratar.precioCOP} <span className="text-xs text-orange-800 font-sans">({modalContratar.precioUSD})</span>
                </span>
              </div>
              <div className="flex justify-between items-center text-xs text-orange-900 pt-1 border-t border-orange-200/50">
                <span>Cupo de auditoría incluido:</span>
                <span className="font-bold">{modalContratar.cupoGuias.toLocaleString('es-CO')} Guías / mes</span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl border-2 border-[#FA7C16] bg-orange-50/30 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <Wallet size={18} />
                </div>
                <div>
                  <p className="text-xs font-extrabold text-slate-800">Débito directo Wallet Dropi</p>
                  <p className="text-[11px] text-slate-500">
                    Cobro automático mensual descontado del recaudo
                  </p>
                </div>
              </div>
              <CheckCircle2 size={18} className="text-[#FA7C16]" />
            </div>

            <label className="flex items-start gap-2.5 p-3.5 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer select-none">
              <input 
                type="checkbox" 
                checked={autorizaDescuento} 
                onChange={(e) => setAutorizaDescuento(e.target.checked)} 
                className="mt-0.5 w-4 h-4 text-orange-600 rounded cursor-pointer" 
              />
              <span className="text-xs font-medium text-slate-700 leading-relaxed">
                <strong>Autorización de descuento automático:</strong> Autorizo formalmente a Dropi y ATOM IA a descontar mensualmente el valor de <strong>{modalContratar.precioCOP}</strong> directamente del saldo de mi Wallet Dropi al inicio de cada ciclo de 30 días. Entiendo que puedo desactivar esta suscripción en cualquier momento.
              </span>
            </label>

            <div className="flex justify-between items-center pt-2">
              <button 
                type="button" 
                onClick={() => setModalContratar(null)} 
                className="text-xs font-bold text-slate-500 px-3 py-2 cursor-pointer"
              >
                Cancelar
              </button>
              <button 
                type="button" 
                disabled={procesandoPago} 
                onClick={handleConfirmarPlan} 
                className="bg-[#FA7C16] hover:bg-[#EA580C] text-white px-5 py-2.5 rounded-xl text-xs font-extrabold cursor-pointer shadow-xs flex items-center gap-2"
              >
                {procesandoPago ? (
                  <span>Procesando débito...</span>
                ) : (
                  <>
                    <Check size={16} strokeWidth={2.6} />
                    <span>Pagar con Wallet y Activar</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DESACTIVAR PLAN */}
      {modalDesactivar && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-slate-200 rounded-[28px] p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b pb-3">
              <div className="flex items-center gap-2 text-rose-600">
                <AlertTriangle size={18} />
                <h3 className="text-base font-extrabold text-slate-800">Desactivar Suscripción</h3>
              </div>
              <button 
                type="button" 
                onClick={() => setModalDesactivar(false)} 
                className="text-slate-400 hover:text-slate-700"
              >
                <X size={18} />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              ¿Estás seguro de que deseas desactivar tu plan? Se cancelará la autorización de descuento automático en tu Wallet Dropi.
            </p>

            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 space-y-1">
              <p className="font-bold">Efectos inmediatos en la operación:</p>
              <ul className="list-disc pl-4 space-y-0.5 text-[11px] text-amber-800">
                <li>Los agentes autónomos en el Administrador pasarán a estado inactivo con candado.</li>
                <li>Las radicaciones automáticas CAS se suspenderán.</li>
                <li>No se realizarán cobros futuros a tu Wallet Dropi.</li>
              </ul>
            </div>

            <div className="flex justify-between items-center pt-2">
              <button
                type="button"
                onClick={() => setModalDesactivar(false)}
                className="text-xs font-bold text-slate-500 px-3 py-2 cursor-pointer"
              >
                Mantener mi Plan
              </button>
              <button
                type="button"
                onClick={handleDesactivarPlan}
                className="bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded-xl text-xs font-extrabold cursor-pointer shadow-xs"
              >
                Confirmar Desactivación
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
// src/app/modales/ModalDevoluciones.tsx
'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { 
  X, 
  Check, 
  ShieldAlert, 
  ShieldCheck, 
  PackageCheck, 
  Info, 
  ArrowLeft, 
  Send, 
  Clock, 
  CheckCheck,
  Search,
  FileCheck,
  FileText
} from 'lucide-react';

export interface GuiaDevolucion {
  id: string;
  pedidoId: string;
  numeroGuia: string;
  transportadora: string;
  trackingUrl: string;
  productoNombre: string;
  diasSinMovimiento: number;
  valorDeclarado: number;
  validacion: 'CONFIRMADA' | 'RECHAZADA' | null;
}

interface ModalDevolucionesProps {
  isOpen: boolean;
  guias: GuiaDevolucion[];
  onClose: () => void;
  onSuccess: (reclamadas: GuiaDevolucion[], confirmadas: GuiaDevolucion[]) => void;
}

const MOCK_DEVOLUCIONES_INICIALES: GuiaDevolucion[] = [
  {
    id: 'DEV-8801',
    pedidoId: 'PED-10492',
    numeroGuia: 'CO-99882104',
    transportadora: 'Coordinadora',
    trackingUrl: 'https://coordinadora.com/tracking',
    productoNombre: '2und Ventilador 3 en 1 de 18 pulgadas',
    diasSinMovimiento: 9,
    valorDeclarado: 145000,
    validacion: 'CONFIRMADA'
  },
  {
    id: 'DEV-8802',
    pedidoId: 'PED-10488',
    numeroGuia: 'ENV-77192031',
    transportadora: 'Envia',
    trackingUrl: 'https://envia.co/tracking',
    productoNombre: 'Audifonos Diadema JBL Tune 770 NC',
    diasSinMovimiento: 11,
    valorDeclarado: 230000,
    validacion: 'CONFIRMADA'
  },
  {
    id: 'DEV-8803',
    pedidoId: 'PED-10475',
    numeroGuia: 'INT-55201944',
    transportadora: 'Interrapidisimo',
    trackingUrl: 'https://interrapidisimo.com/tracking',
    productoNombre: 'Pañalera morral tipo cuna con cambiador',
    diasSinMovimiento: 7,
    valorDeclarado: 95000,
    validacion: 'CONFIRMADA'
  },
  {
    id: 'DEV-8804',
    pedidoId: 'PED-10460',
    numeroGuia: 'TCC-44102955',
    transportadora: 'Tcc',
    trackingUrl: 'https://tcc.com.co/tracking',
    productoNombre: 'Alcancia Figura Pintura Diamante',
    diasSinMovimiento: 8,
    valorDeclarado: 62000,
    validacion: 'CONFIRMADA'
  }
];

export default function ModalDevoluciones({ 
  isOpen, 
  guias, 
  onClose, 
  onSuccess 
}: ModalDevolucionesProps) {
  const [paso, setPaso] = useState<'AUDITORIA' | 'LEGAL'>('AUDITORIA');
  const [items, setItems] = useState<GuiaDevolucion[]>([]);
  const [legalAceptado, setLegalAceptado] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [evidenciaVisualizada, setEvidenciaVisualizada] = useState<GuiaDevolucion | null>(null);

  // Al abrir el modal, todas las guías quedan marcadas como 'CONFIRMADA' por defecto
  useEffect(() => {
    if (isOpen) {
      const datosIniciales = (guias && guias.length > 0 ? guias : MOCK_DEVOLUCIONES_INICIALES).map(g => ({
        ...g,
        validacion: 'CONFIRMADA' as const
      }));
      setItems(datosIniciales);
      setPaso('AUDITORIA');
      setLegalAceptado(false);
      setEvidenciaVisualizada(null);
    }
  }, [isOpen, guias]);

  const rechazosIrregularidades = useMemo(() => {
    return items.filter(i => i.validacion === 'RECHAZADA');
  }, [items]);

  const confirmadasEntrega = useMemo(() => {
    return items.filter(i => i.validacion === 'CONFIRMADA');
  }, [items]);

  const totalValidadas = confirmadasEntrega.length + rechazosIrregularidades.length;

  const montoTotalReclamado = useMemo(() => {
    return rechazosIrregularidades.reduce((acc, curr) => acc + curr.valorDeclarado, 0);
  }, [rechazosIrregularidades]);

  const handleSetValidacion = (id: string, tipo: 'CONFIRMADA' | 'RECHAZADA') => {
    setItems(prev => prev.map(item => item.id === id ? { ...item, validacion: tipo } : item));
  };

  const handleMarcarTodasConfirmadas = () => {
    setItems(prev => prev.map(item => ({ ...item, validacion: 'CONFIRMADA' })));
  };

  // Disparo de acción principal (Confirmar directo vs Reclamar en paso legal)
  const handleBotonPrincipal = () => {
    if (rechazosIrregularidades.length > 0) {
      setPaso('LEGAL');
    } else if (confirmadasEntrega.length > 0) {
      setIsSubmitting(true);
      setTimeout(() => {
        onSuccess([], confirmadasEntrega);
        setIsSubmitting(false);
        onClose();
      }, 600);
    }
  };

  const handleEjecutarRadicacionLegal = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      onSuccess(rechazosIrregularidades, confirmadasEntrega);
      setIsSubmitting(false);
      onClose();
    }, 900);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-6xl max-h-[92vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-slate-200/90 relative">
        
        {/* CABECERA */}
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-white">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
              paso === 'AUDITORIA' ? 'bg-orange-50 text-orange-600 border border-orange-100' : 'bg-rose-50 text-rose-600 border border-rose-100'
            }`}>
              {paso === 'AUDITORIA' ? <PackageCheck size={20} /> : <ShieldAlert size={20} />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900 tracking-tight">
                  {paso === 'AUDITORIA' ? 'Auditoría de Devoluciones Sin Ingreso (+7D)' : 'Confirmación Legal de Reclamación'}
                </h2>
                <span className="text-[11px] font-black bg-rose-50 text-rose-600 border border-rose-200/80 px-2.5 py-0.5 rounded-full">
                  {items.length} Guías Pendientes
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {paso === 'AUDITORIA' 
                  ? 'Verifica los soportes antes de descartar evidencias o disparar reclamación formal ante el CAS.' 
                  : 'Debida diligencia exigida antes de la radicación masiva de siniestros por transporte.'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-2 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
            title="Cerrar modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* PASO 1: AUDITORÍA DE EVIDENCIAS */}
        {paso === 'AUDITORIA' && (
          <>
            {/* Banner Informativo */}
            <div className="px-6 pt-4 space-y-3">
              <div className="bg-slate-50/80 border border-slate-200/90 rounded-2xl p-3.5 flex items-start justify-between gap-4 flex-wrap">
                <div className="flex items-start gap-2.5 text-xs text-slate-600 leading-relaxed max-w-2xl">
                  <Info size={16} className="text-orange-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-slate-800">Regla de Enrutamiento:</span> Haz clic en la <strong>lupa</strong> para inspeccionar la evidencia digital. Las guías en <span className="font-bold text-emerald-700">Confirmar</span> notificarán al <em>Ecom Scanner</em> para simular el ingreso a bodega. Las guías en <span className="font-bold text-rose-700">NO es Evidencia</span> radicarán el siniestro en CAS.
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleMarcarTodasConfirmadas}
                    className="px-3 py-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200/80 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
                  >
                    <CheckCheck size={14} />
                    <span>Todas Confirmar</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Tabla Estructurada */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              <div className="rounded-2xl border border-slate-200/90 overflow-x-auto bg-white shadow-sm">
                <table className="w-full min-w-[900px] table-fixed border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50/70">
                      <th className="py-3 px-4 w-[17%] text-left">GUÍA</th>
                      <th className="py-3 px-3 w-[22%] text-left">PRODUCTO / PEDIDO</th>
                      <th className="py-3 px-3 w-[13%] text-left">TRANSPORTADORA</th>
                      <th className="py-3 px-2 w-[11%] text-center">INACTIVIDAD</th>
                      <th className="py-3 px-3 w-[10%] text-right">VALOR</th>
                      <th className="py-3 px-2 w-[27%] text-center">VALIDACIÓN</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {items.map((row) => {
                      const isConfirmado = row.validacion === 'CONFIRMADA';
                      const isRechazado = row.validacion === 'RECHAZADA';

                      return (
                        <tr 
                          key={row.id} 
                          className={`transition-colors ${
                            isConfirmado ? 'bg-emerald-50/20' : isRechazado ? 'bg-rose-50/20' : 'hover:bg-slate-50/60'
                          }`}
                        >
                          {/* Número de Guía + Lupa de Evidencia */}
                          <td className="py-3.5 px-4 font-bold text-slate-800">
                            <div className="flex items-center gap-2">
                              <span className="truncate">{row.numeroGuia}</span>
                              <button
                                type="button"
                                onClick={() => setEvidenciaVisualizada(row)}
                                className="p-1 rounded-md text-slate-400 hover:text-orange-600 hover:bg-orange-50 transition-colors cursor-pointer shrink-0"
                                title="Ver soporte / evidencia digitalizada de entrega"
                              >
                                <Search size={14} />
                              </button>
                            </div>
                          </td>

                          <td className="py-3.5 px-3">
                            <span className="font-semibold text-slate-800 block truncate" title={row.productoNombre}>
                              {row.productoNombre}
                            </span>
                            <span className="text-[10px] text-slate-400 font-normal block">
                              {row.pedidoId}
                            </span>
                          </td>

                          <td className="py-3.5 px-3 font-semibold text-slate-700 truncate">
                            {row.transportadora}
                          </td>

                          <td className="py-3.5 px-2 text-center">
                            <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-rose-600 bg-rose-50 border border-rose-200/80 px-2 py-0.5 rounded-full whitespace-nowrap">
                              <Clock size={11} />
                              {row.diasSinMovimiento}d sin bodega
                            </span>
                          </td>

                          <td className="py-3.5 px-3 text-right font-extrabold text-slate-800 whitespace-nowrap">
                            ${row.valorDeclarado.toLocaleString('es-CO')}
                          </td>

                          <td className="py-3 px-2 text-center">
                            <div className="inline-flex p-1 bg-slate-100 rounded-xl gap-1 border border-slate-200/70 items-center justify-center">
                              <button
                                type="button"
                                onClick={() => handleSetValidacion(row.id, 'CONFIRMADA')}
                                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1 whitespace-nowrap cursor-pointer shrink-0 ${
                                  isConfirmado
                                    ? 'bg-emerald-600 text-white shadow-sm'
                                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200/50'
                                }`}
                              >
                                <Check size={12} strokeWidth={2.5} />
                                <span>Confirmar</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => handleSetValidacion(row.id, 'RECHAZADA')}
                                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1 whitespace-nowrap cursor-pointer shrink-0 ${
                                  isRechazado
                                    ? 'bg-rose-600 text-white shadow-sm'
                                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200/50'
                                }`}
                              >
                                <X size={12} strokeWidth={2.5} />
                                <span>NO es Evidencia</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Barra Inferior */}
            <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200/90 flex justify-between items-center flex-wrap gap-3">
              <div className="flex items-center gap-2 text-xs">
                <span className="bg-emerald-100/80 text-emerald-800 font-bold px-2.5 py-1 rounded-lg border border-emerald-200/80">
                  Confirmadas: {confirmadasEntrega.length}
                </span>
                <span className="bg-rose-100/80 text-rose-800 font-bold px-2.5 py-1 rounded-lg border border-rose-200/80">
                  Por Reclamar: {rechazosIrregularidades.length}
                </span>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200/70 rounded-xl transition-all cursor-pointer"
                >
                  Cancelar
                </button>

                {/* Botón dinámico: cambia a 'Confirmar' cuando no hay irregularidades */}
                {rechazosIrregularidades.length > 0 ? (
                  <button
                    type="button"
                    onClick={handleBotonPrincipal}
                    className="px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-600/20 cursor-pointer active:scale-95"
                  >
                    <span>Reclamar Guías Seleccionadas ({rechazosIrregularidades.length})</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={totalValidadas === 0 || isSubmitting}
                    onClick={handleBotonPrincipal}
                    className={`px-6 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all ${
                      totalValidadas > 0 && !isSubmitting
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20 cursor-pointer active:scale-95'
                        : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    <Check size={14} />
                    <span>{isSubmitting ? 'Confirmando...' : 'Confirmar'}</span>
                  </button>
                )}
              </div>
            </div>
          </>
        )}

        {/* PASO 2: DECLARACIÓN JURAMENTADA */}
        {paso === 'LEGAL' && (
          <div className="p-6 sm:p-8 space-y-6 flex-1 overflow-y-auto">
            <div className="flex items-center gap-3 text-rose-600 bg-rose-50 border border-rose-200/90 p-4 rounded-2xl">
              <ShieldCheck size={26} className="shrink-0" />
              <div>
                <h3 className="text-xs font-black tracking-tight text-rose-950 uppercase">
                  Declaración Juramentada y Debida Diligencia en Reclamaciones
                </h3>
                <p className="text-xs text-rose-700 mt-0.5">
                  Estás a punto de radicar formalmente {rechazosIrregularidades.length} reclamaciones ante el CAS por un monto de ${montoTotalReclamado.toLocaleString('es-CO')} COP.
                </p>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200/90 p-5 rounded-2xl text-xs text-slate-700 leading-relaxed space-y-3">
              <p>
                <strong>EL CLIENTE / PROVEEDOR</strong> declara bajo la gravedad del juramento que, previo a la radicación de la presente solicitud o reclamación por no entrega, realizó la verificación directa en las plataformas de rastreo de las empresas de transporte asignadas y en sus propios sistemas de control, constatando la ausencia total de soporte o evidencia de entrega efectiva del producto.
              </p>
              <p className="p-3 bg-rose-100/50 border border-rose-200 text-rose-950 rounded-xl font-medium">
                En caso de comprobarse que la entrega sí fue efectuada oportunamente, que existió negligencia en la verificación de los soportes por parte de EL CLIENTE / PROVEEDOR, o que la reclamación resulta infundada o indebida, EL CLIENTE / PROVEEDOR autoriza expresamente el cobro e imputación de una penalidad por gastos administrativos e investigación operativa equivalente a <strong>$50.000 COP o el 10% del valor del pedido</strong>, sin perjuicio de las acciones legales, suspensión de cuenta y cobro de indemnizaciones.
              </p>
            </div>

            <div className="space-y-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Guías seleccionadas para radicación ({rechazosIrregularidades.length}):
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-36 overflow-y-auto">
                {rechazosIrregularidades.map((g) => (
                  <div key={g.id} className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs flex justify-between items-center shadow-sm">
                    <div>
                      <span className="font-bold text-slate-800">{g.numeroGuia}</span>
                      <span className="text-[10px] text-slate-400 block">{g.transportadora} • {g.pedidoId}</span>
                    </div>
                    <span className="font-bold text-rose-600">${g.valorDeclarado.toLocaleString('es-CO')}</span>
                  </div>
                ))}
              </div>
            </div>

            <label className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200 cursor-pointer hover:bg-slate-100/60 transition-colors">
              <input
                type="checkbox"
                checked={legalAceptado}
                onChange={(e) => setLegalAceptado(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-slate-300 text-rose-600 focus:ring-rose-500 cursor-pointer"
              />
              <span className="text-xs text-slate-700 font-medium select-none">
                Confirmo bajo juramento que no existen pruebas de entrega válidas en bodega, acepto la penalidad en caso de reclamación infundada y autorizo la emisión del ticket CAS masivo con firma de IP y usuario.
              </span>
            </label>

            <div className="flex justify-between items-center pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setPaso('AUDITORIA')}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft size={14} />
                <span>Volver a la Auditoría</span>
              </button>

              <button
                type="button"
                disabled={!legalAceptado || isSubmitting}
                onClick={handleEjecutarRadicacionLegal}
                className={`px-6 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all ${
                  legalAceptado && !isSubmitting
                    ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-md shadow-rose-600/25 cursor-pointer active:scale-95'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                <Send size={13} />
                <span>{isSubmitting ? 'Radicando en CAS...' : 'Radicar Reclamación CAS Masiva'}</span>
              </button>
            </div>
          </div>
        )}

      </div>

      {/* VISOR DE EVIDENCIA (LUPA) */}
      {evidenciaVisualizada && (
        <div className="fixed inset-0 z-[60] bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in zoom-in-95 duration-150">
          <div className="bg-white w-full max-w-lg rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-4">
            
            <div className="flex justify-between items-start border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-orange-50 text-orange-600 border border-orange-100 flex items-center justify-center">
                  <FileText size={18} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">
                    Soporte de Entrega de Transportadora
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Guía: {evidenciaVisualizada.numeroGuia} • {evidenciaVisualizada.transportadora}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEvidenciaVisualizada(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
              <div className="flex justify-between items-center text-xs pb-2 border-b border-slate-200/80">
                <span className="text-slate-500 font-medium">Estado en Operador:</span>
                <span className="font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-md">
                  Entregado en Destino / Bodega
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Fecha / Hora</span>
                  <span className="font-semibold text-slate-800">14/10/2026 - 15:42</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Receptor</span>
                  <span className="font-semibold text-slate-800">Portería / Personal Turno</span>
                </div>
              </div>

              <div className="border border-dashed border-slate-300 rounded-xl p-6 bg-white flex flex-col items-center justify-center text-center space-y-1">
                <FileCheck size={28} className="text-emerald-600" />
                <span className="text-xs font-bold text-slate-800">Cumplido Digitalizado Registrado</span>
                <p className="text-[10px] text-slate-400 max-w-xs">
                  Sello de recepción estampado y firma digital asociada a la remisión física de retorno.
                </p>
              </div>
            </div>

            <div className="flex justify-between items-center pt-1">
              <span className="text-[11px] text-slate-400">
                ¿Es válida esta evidencia?
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    handleSetValidacion(evidenciaVisualizada.id, 'CONFIRMADA');
                    setEvidenciaVisualizada(null);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center gap-1 cursor-pointer hover:bg-emerald-700 shadow-sm"
                >
                  <Check size={12} />
                  <span>Confirmar</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleSetValidacion(evidenciaVisualizada.id, 'RECHAZADA');
                    setEvidenciaVisualizada(null);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-rose-600 text-white font-bold text-xs flex items-center gap-1 cursor-pointer hover:bg-rose-700 shadow-sm"
                >
                  <X size={12} />
                  <span>NO es Evidencia</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
'use client';

import React, { useState, useMemo } from 'react';
import { 
  Send, Copy, Check, FileWarning, Undo2, CheckSquare, 
  Square, CheckCircle2, Clock, ShieldAlert, ArrowLeft,
  Download, Search, ChevronRight
} from 'lucide-react';
import { GuiaDetalleItem } from './DetalleGuias';
import FiltroFecha from '@/components/filtros/FiltroFecha';

export interface ReclamacionesProps {
  guiasNoPistoleadas?: GuiaDetalleItem[];
  reclamadasList?: { ticket: string; fecha: string; guias: GuiaDetalleItem[] }[];
  onRadicarLote?: (ids: string[], ticket: string, guias: GuiaDetalleItem[]) => void;
  onNavigateTab?: (tab: string) => void;
}

export function Reclamaciones({
  guiasNoPistoleadas = [],
  reclamadasList = [],
  onRadicarLote,
  onNavigateTab
}: ReclamacionesProps) {
  const [dateFrom, setDateFrom] = useState('2026-10-01');
  const [dateTo, setDateTo] = useState('2026-10-31');
  const [activeSubTab, setActiveSubTab] = useState<'pendientes' | 'radicadas'>('pendientes');
  
  // Selección de guías para armar el lote de radicación
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [ticketLote, setTicketLote] = useState(`RAD-DROPI-${Math.floor(100000 + Math.random() * 900000)}`);
  const [copiedProforma, setCopiedProforma] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Guías filtradas pendientes de radicación
  const guiasDisponibles = useMemo(() => {
    return guiasNoPistoleadas.filter((g) => {
      const term = searchTerm.toLowerCase();
      return (
        g.id.toLowerCase().includes(term) ||
        g.numGuia.toLowerCase().includes(term) ||
        g.ciudad.toLowerCase().includes(term) ||
        g.transportadora.toLowerCase().includes(term)
      );
    });
  }, [guiasNoPistoleadas, searchTerm]);

  // Selección automática de todo el lote disponible
  const guiasSeleccionadas = useMemo(() => {
    if (selectedIds.length === 0) {
      return guiasDisponibles;
    }
    return guiasDisponibles.filter((g) => selectedIds.includes(g.id));
  }, [guiasDisponibles, selectedIds]);

  // Cálculos de impacto financiero
  const totalFletesPerdida = guiasSeleccionadas.reduce((acc, g) => acc + g.precioFletes, 0);
  const totalMercanciaRiesgo = guiasSeleccionadas.reduce((acc, g) => acc + g.recaudoProveedor, 0);

  const toggleSelectGuia = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === guiasDisponibles.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(guiasDisponibles.map((g) => g.id));
    }
  };

  // Texto formal estructurado para Dropi
  const proformaLoteTexto = useMemo(() => {
    if (guiasSeleccionadas.length === 0) return '';
    const transportadorasInvolucradas = Array.from(new Set(guiasSeleccionadas.map((g) => g.transportadora))).join(', ');

    return `ATENCIÓN: DEPARTAMENTO DE DISPUTAS Y RECLAMACIONES - DROPI COLOMBIA
RADICACIÓN DE CASO FORMAL POR DEVOLUCIONES NO REGISTRADAS EN BODEGA
• Número de Caso: ${ticketLote}
• Total de Órdenes Agrupadas: ${guiasSeleccionadas.length} guías
• Transportadoras Involucradas: ${transportadorasInvolucradas}
• Total Pérdida en Fletes Asumidos: -$ ${totalFletesPerdida.toLocaleString('es-CO')}
• Total Costo de Mercancía en Riesgo: $ ${totalMercanciaRiesgo.toLocaleString('es-CO')}

ÓRDENES AGRUPADAS QUE NO INGRESARON A BODEGA (SIN PISTOLEO FÍSICO):
${guiasSeleccionadas.map((g, i) => `${i + 1}. Guía: ${g.numGuia} | ID Orden: ${g.id} | Destino: ${g.ciudad} | Días Gestión: ${g.diasGestion}d | Transportadora: ${g.transportadora}`).join('\n')}

DECLARATORIA LEGAL:
Habiendo realizado la auditoría de evidencias en bodega con el sistema Ecom Scanner, se constata que NINGUNA de las unidades relacionadas cuenta con escaneo físico de ingreso en nuestras instalaciones de bodega central.
Por consiguiente, solicitamos a Dropi radicar formalmente este lote ante las transportadoras correspondientes para exigir la entrega física inmediata o la indemnización total del costo de producto y flete asumido.`;
  }, [guiasSeleccionadas, ticketLote, totalFletesPerdida, totalMercanciaRiesgo]);

  const handleConfirmarRadicacion = () => {
    if (guiasSeleccionadas.length === 0 || !ticketLote.trim()) return;

    const idsLote = guiasSeleccionadas.map((g) => g.id);

    if (onRadicarLote) {
      onRadicarLote(idsLote, ticketLote.trim(), guiasSeleccionadas);
    }

    setNotification(`⚡ Caso radicado exitosamente ante Dropi (#${ticketLote}) para ${idsLote.length} guías. Pasan a estado "En Reclamación" y se archivan del Panel de Alertas.`);
    setSelectedIds([]);
    setTicketLote(`RAD-DROPI-${Math.floor(100000 + Math.random() * 900000)}`);
    setActiveSubTab('radicadas');
    setTimeout(() => setNotification(null), 5000);
  };

  const formatCurrency = (val: number, isNegativo: boolean = false) => {
    const formatted = new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0
    }).format(Math.abs(val));

    return isNegativo ? `-$ ${formatted.replace('$', '').trim()}` : formatted;
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 p-6 font-sans relative space-y-6">
      
      {/* Notificación flotante */}
      {notification && (
        <div className="fixed top-6 right-6 z-50 bg-emerald-500 text-slate-950 px-4 py-3 rounded-xl font-bold shadow-2xl flex items-center gap-2 animate-bounce border border-emerald-300">
          <CheckCircle2 size={18} />
          <span>{notification}</span>
        </div>
      )}

      {/* 1. CABECERA: TÍTULO, SUBTÍTULO, BOTÓN VOLVER Y SELECTOR DE FECHAS */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            {onNavigateTab && (
              <button
                type="button"
                onClick={() => onNavigateTab('guias')}
                className="text-slate-500 hover:text-slate-800 p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 shadow-sm transition-colors flex items-center gap-1 text-xs font-semibold cursor-pointer"
              >
                <ArrowLeft size={14} />
                <span>Volver a Guías</span>
              </button>
            )}
            <span className="text-xs text-slate-400">/</span>
            <span className="text-xs font-semibold text-orange-600">Reclamaciones</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Centro de Reclamaciones Dropi</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Agrupación automática de órdenes no pistoleadas en bodega para radicación de disputas formales ante Dropi.
          </p>
        </div>

        <FiltroFecha
          startDate={dateFrom}
          endDate={dateTo}
          onApply={(start, end) => {
            setDateFrom(start);
            setDateTo(end);
          }}
        />
      </div>

      {/* 2. TARJETAS ANALÍTICAS DEL MÓDULO DE RECLAMACIONES */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Órdenes Sin Pistoleo
          </span>
          <p className="text-3xl font-extrabold text-[#f97316] mt-1">
            {guiasNoPistoleadas.length} Guías
          </p>
          <span className="text-[11px] text-slate-500 mt-1 block">
            Devoluciones sin confirmación física en bodega
          </span>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Fletes en Pérdida (Lote)
          </span>
          <p className="text-3xl font-extrabold text-rose-600 mt-1">
            {formatCurrency(totalFletesPerdida, true)}
          </p>
          <span className="text-[11px] text-slate-500 mt-1 block">
            Costo flete a recuperar en la disputa
          </span>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Mercancía Comprometida
          </span>
          <p className="text-3xl font-extrabold text-slate-900 mt-1">
            {formatCurrency(totalMercanciaRiesgo)}
          </p>
          <span className="text-[11px] text-slate-500 mt-1 block">
            Costo proveedor total del lote activo
          </span>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Casos Radicados Dropi
          </span>
          <p className="text-3xl font-extrabold text-sky-600 mt-1">
            {reclamadasList.length} Radicados
          </p>
          <span className="text-[11px] text-slate-500 mt-1 block">
            Archivados del Panel de Alertas
          </span>
        </div>
      </div>

      {/* 3. CONMUTADOR DE SUB-PESTAÑAS */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          type="button"
          onClick={() => setActiveSubTab('pendientes')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeSubTab === 'pendientes'
              ? 'bg-[#f97316] text-white shadow-md shadow-orange-500/20'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          <FileWarning size={14} />
          <span>Pendientes por Radicar ({guiasNoPistoleadas.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab('radicadas')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
            activeSubTab === 'radicadas'
              ? 'bg-[#f97316] text-white shadow-md shadow-orange-500/20'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          <CheckCircle2 size={14} />
          <span>Historial de Casos Radicados ({reclamadasList.length})</span>
        </button>
      </div>

      {/* 4. CONTENIDO PRINCIPAL: PENDIENTES vs RADICADAS */}
      {activeSubTab === 'pendientes' ? (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
          
          {/* TABLA DE ÓRDENES PENDIENTES (7 COLUMNAS) */}
          <div className="xl:col-span-7 bg-white border border-slate-200/90 rounded-2xl shadow-sm p-5 space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Órdenes en Devolución No Pistoleadas
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Selecciona las guías que integrarán el lote o radica el grupo completo.
                </p>
              </div>

              <div className="relative w-48">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Buscar orden o guía..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-700 outline-none focus:border-orange-500"
                />
              </div>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-slate-50/50">
                    <th className="py-3 px-3 text-center w-10">
                      <button
                        type="button"
                        onClick={toggleSelectAll}
                        className="text-slate-400 hover:text-orange-600 transition-colors cursor-pointer"
                        title="Seleccionar todas"
                      >
                        <CheckSquare size={15} />
                      </button>
                    </th>
                    <th className="py-3 px-3">ID / GUÍA</th>
                    <th className="py-3 px-3">DESTINO</th>
                    <th className="py-3 px-3">TRANSPORTADORA</th>
                    <th className="py-3 px-2 text-center">DÍAS</th>
                    <th className="py-3 px-3 text-right">FLETE PÉRDIDA</th>
                    <th className="py-3 px-3 text-right">COSTO RIESGO</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {guiasDisponibles.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-10 text-center text-slate-400 font-medium">
                        No hay órdenes pendientes por radicar. Todas están pistoleadas o radicadas.
                      </td>
                    </tr>
                  ) : (
                    guiasDisponibles.map((g) => {
                      const isChecked = selectedIds.includes(g.id) || selectedIds.length === 0;

                      return (
                        <tr 
                          key={g.id} 
                          onClick={() => toggleSelectGuia(g.id)}
                          className={`cursor-pointer transition-colors ${isChecked ? 'bg-orange-50/30' : 'hover:bg-slate-50'}`}
                        >
                          <td className="py-3 px-3 text-center">
                            <span className={isChecked ? 'text-orange-600' : 'text-slate-300'}>
                              {isChecked ? <CheckSquare size={15} /> : <Square size={15} />}
                            </span>
                          </td>
                          <td className="py-3 px-3">
                            <p className="font-bold text-slate-800 font-mono">{g.numGuia}</p>
                            <span className="text-[10px] text-slate-400">ID: {g.id}</span>
                          </td>
                          <td className="py-3 px-3">
                            <p className="font-semibold text-slate-700">{g.ciudad}</p>
                            <span className="text-[10px] text-slate-400">{g.departamento}</span>
                          </td>
                          <td className="py-3 px-3 font-medium text-slate-700">
                            {g.transportadora}
                          </td>
                          <td className="py-3 px-2 text-center font-bold text-rose-600">
                            {g.diasGestion}d
                          </td>
                          <td className="py-3 px-3 text-right font-bold text-rose-600">
                            {formatCurrency(g.precioFletes, true)}
                          </td>
                          <td className="py-3 px-3 text-right font-bold text-slate-800">
                            {formatCurrency(g.recaudoProveedor)}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 pt-1 px-1">
              <span>{guiasSeleccionadas.length} órdenes seleccionadas para radicar</span>
              <button
                type="button"
                onClick={toggleSelectAll}
                className="text-orange-600 hover:text-orange-700 font-semibold hover:underline cursor-pointer"
              >
                {selectedIds.length === guiasDisponibles.length ? 'Deseleccionar todas' : 'Seleccionar todas'}
              </button>
            </div>
          </div>

          {/* PANEL DERECHO: PROFORMA Y RADICACIÓN AUTOMÁTICA (5 COLUMNAS) */}
          <div className="xl:col-span-5 bg-white border border-slate-200/90 rounded-2xl shadow-sm p-6 space-y-4">
            <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 tracking-tight">
                  Radicación Automática ante Dropi
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Generación de caso y texto formal de disputa legal.
                </p>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-slate-400 uppercase font-bold block">Radicado Automático</span>
                <span className="text-xs font-mono font-bold text-orange-600 bg-orange-50 border border-orange-200 px-2 py-0.5 rounded-md inline-block mt-0.5">
                  {ticketLote}
                </span>
              </div>
            </div>

            {/* Resumen del Lote a Radicar */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3.5 space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Órdenes a radicar en el lote:</span>
                <strong className="text-slate-900 font-bold">{guiasSeleccionadas.length} guías</strong>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Total Fletes en disputa:</span>
                <strong className="text-rose-600 font-bold">{formatCurrency(totalFletesPerdida, true)}</strong>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Total Costo de Mercancía:</span>
                <strong className="text-slate-900 font-bold">{formatCurrency(totalMercanciaRiesgo)}</strong>
              </div>
            </div>

            {/* Cuadro de Texto de la Proforma Legal */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] text-slate-400 uppercase font-semibold">
                  Texto Formal de la Disputa para Dropi
                </span>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(proformaLoteTexto);
                    setCopiedProforma(true);
                    setTimeout(() => setCopiedProforma(false), 2000);
                  }}
                  className="text-xs text-orange-600 hover:text-orange-700 font-semibold flex items-center gap-1 hover:underline cursor-pointer"
                >
                  {copiedProforma ? <Check size={13} className="text-emerald-600" /> : <Copy size={13} />}
                  <span>{copiedProforma ? '¡Copiado!' : 'Copiar Texto'}</span>
                </button>
              </div>

              <textarea
                readOnly
                rows={7}
                value={proformaLoteTexto}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-700 font-mono leading-relaxed outline-none resize-none shadow-inner"
              />
            </div>

            {/* Botón de Confirmación y Radicación */}
            <button
              type="button"
              disabled={guiasSeleccionadas.length === 0}
              onClick={handleConfirmarRadicacion}
              className={`w-full py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all ${
                guiasSeleccionadas.length === 0
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                  : 'bg-[#f97316] hover:bg-orange-600 text-white shadow-orange-500/25 cursor-pointer active:scale-95'
              }`}
            >
              <Send size={15} />
              <span>Radicar Lote ante Dropi ({guiasSeleccionadas.length} Guías)</span>
            </button>
            <p className="text-[11px] text-slate-400 text-center">
              Al radicar, pasarán a estado <strong>En Reclamación</strong> y se descontarán del Panel de Alertas.
            </p>
          </div>

        </div>
      ) : (
        /* HISTORIAL DE CASOS RADICADOS ANTE DROPI */
        <div className="bg-white border border-slate-200/90 rounded-2xl shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900 tracking-tight">
                Casos y Lotes Radicados ante Dropi
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Historial de radicados formales en gestión legal ante las transportadoras.
              </p>
            </div>
            <span className="text-xs text-slate-500 font-semibold bg-slate-100 px-3 py-1 rounded-full">
              {reclamadasList.length} Casos Abiertos
            </span>
          </div>

          {reclamadasList.length === 0 ? (
            <div className="py-16 text-center text-slate-400 text-xs">
              <ShieldAlert size={36} className="mx-auto text-slate-300 mb-2" />
              <span>Aún no hay casos radicados en esta sesión.</span>
            </div>
          ) : (
            <div className="space-y-3">
              {reclamadasList.map((item, idx) => {
                const totalValor = item.guias.reduce((acc, g) => acc + g.recaudoProveedor, 0);
                const totalFlete = item.guias.reduce((acc, g) => acc + g.precioFletes, 0);

                return (
                  <div key={idx} className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs text-slate-800 bg-white border border-slate-200 px-2.5 py-1 rounded-md">
                          {item.ticket}
                        </span>
                        <span className="text-xs text-slate-400">•</span>
                        <span className="text-xs text-slate-500 font-medium">Fecha: {item.fecha}</span>
                        <span className="text-xs font-bold text-sky-700 bg-sky-50 border border-sky-200 px-2 py-0.5 rounded-full">
                          En Reclamación
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-2 font-medium">
                        {item.guias.length} Guías agrupadas • Costo Reclamado: <strong>{formatCurrency(totalValor)}</strong> • Flete Pérdida: <strong className="text-rose-600">{formatCurrency(totalFlete, true)}</strong>
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs text-emerald-600 font-semibold bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-lg">
                        Archivado de Alertas
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

    </div>
  );
}

export default Reclamaciones;
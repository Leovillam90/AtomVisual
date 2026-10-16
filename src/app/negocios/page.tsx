// src/app/negocios/page.tsx
'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  Search, SlidersHorizontal, User, Phone, Mail, MessageSquare, 
  Copy, Check, MapPin, Store, ExternalLink, Package,
  CornerDownRight, Tag, X, ChevronDown, Eye, EyeOff
} from 'lucide-react';
import { useFiltrosCruzados } from '@/hooks/useFiltrosCruzados';
import { agruparMetricasPorNegocio } from '@/formulas';
import { FiltroFecha } from '@/filtros/FiltroFecha';
import { BarraFiltrosSecundarios } from '@/filtros/BarraFiltrosSecundarios';

interface ModalContactoProps {
  contacto: {
    id: string;
    tienda: string;
    titular: string;
    telefono: string;
    correo: string;
    ciudad: string;
  } | null;
  onClose: () => void;
}

function ModalContactoNegocio({ contacto, onClose }: ModalContactoProps) {
  const [copiado, setCopiado] = useState(false);
  if (!contacto) return null;

  const copiarTel = () => {
    navigator.clipboard.writeText(contacto.telefono);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4 font-sans animate-fadeIn">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-md p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-100 border border-orange-200 flex items-center justify-center text-orange-600 font-bold">
              {contacto.tienda.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-800">{contacto.tienda}</h3>
              <p className="text-[11px] text-slate-400 font-mono">ID: {contacto.id}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100">
            <X size={16} />
          </button>
        </div>

        <div className="space-y-2.5 text-xs">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/60 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <User size={15} className="text-slate-400" />
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Titular</span>
                <span className="font-semibold text-slate-800">{contacto.titular}</span>
              </div>
            </div>
            <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] px-2 py-0.5 rounded-full font-bold">
              Verificado
            </span>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/60 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Phone size={15} className="text-emerald-600" />
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">WhatsApp</span>
                <span className="font-semibold text-slate-800">{contacto.telefono}</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <button onClick={copiarTel} className="p-1 rounded bg-white border border-slate-200 hover:bg-slate-100 text-slate-600">
                {copiado ? <Check size={12} className="text-emerald-600" /> : <Copy size={12} />}
              </button>
              <a 
                href={`https://wa.me/${contacto.telefono.replace(/[^0-9]/g, '')}`} 
                target="_blank" 
                rel="noreferrer"
                className="px-2 py-1 bg-emerald-600 text-white font-bold rounded-lg text-[10px] flex items-center gap-1 hover:bg-emerald-700"
              >
                Chat <ExternalLink size={10} />
              </a>
            </div>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/60 flex items-center gap-2.5">
            <MapPin size={15} className="text-rose-500 shrink-0" />
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Ciudad de Operación</span>
              <span className="font-semibold text-slate-800">{contacto.ciudad || 'Colombia'}</span>
            </div>
          </div>
        </div>

        <button 
          onClick={onClose}
          className="w-full py-2 bg-slate-100 hover:bg-slate-200 font-bold text-slate-700 rounded-xl text-xs transition-colors"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
}

export default function PantallaNegocios() {
  const {
    filteredData,
    loading,
    dateFrom, setDateFrom,
    dateTo, setDateTo,
    selectedBodegas, setSelectedBodegas,
    selectedNegocios, setSelectedNegocios,
    selectedProductos, setSelectedProductos,
    selectedTransportadoras, setSelectedTransportadoras,
    selectedDepartamentos, setSelectedDepartamentos,
    selectedComunidades, setSelectedComunidades,
    searchTerm, setSearchTerm,
    availableOptions,
  } = useFiltrosCruzados();

  const [rowsPerPage, setRowsPerPage] = useState<number>(50);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [cascadeOpen, setCascadeOpen] = useState<Record<string, boolean>>({});
  const [expandedBodNeg, setExpandedBodNeg] = useState<Record<string, boolean>>({});
  const [contactoSeleccionado, setContactoSeleccionado] = useState<any | null>(null);

  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>({
    negocio: true,
    accion: true,
    generados: true,
    entregados: true,
    porConfirmar: true,
    pendientes: true,
    enCurso: true,
    enNovedad: true,
    devoluciones: true,
  });

  const [showColumnSelector, setShowColumnSelector] = useState<boolean>(false);
  const columnSelectorRef = useRef<HTMLDivElement>(null);

  const columnsConfig = [
    { key: 'negocio', label: 'Negocio' },
    { key: 'accion', label: 'Acción' },
    { key: 'generados', label: 'Generados' },
    { key: 'entregados', label: 'Entregados' },
    { key: 'porConfirmar', label: 'Por Confirmar' },
    { key: 'pendientes', label: 'Pendientes' },
    { key: 'enCurso', label: 'En Curso' },
    { key: 'enNovedad', label: 'En Novedad' },
    { key: 'devoluciones', label: 'Devoluciones' },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (columnSelectorRef.current && !columnSelectorRef.current.contains(event.target as Node)) {
        setShowColumnSelector(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const { processedData } = useMemo(() => {
    return agruparMetricasPorNegocio(filteredData);
  }, [filteredData]);

  const totalPages = Math.ceil(processedData.length / rowsPerPage) || 1;
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return processedData.slice(start, start + rowsPerPage);
  }, [processedData, currentPage, rowsPerPage]);

  const toggleCascade = (e: React.MouseEvent, bizKey: string) => {
    e.stopPropagation();
    setCascadeOpen((prev) => ({ ...prev, [bizKey]: !prev[bizKey] }));
  };

  const toggleBodNeg = (key: string) => {
    setExpandedBodNeg((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const formatCurrency = (val: number) => {
    const formatted = new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0
    }).format(Math.abs(val || 0));

    if (val < 0) return `-$ ${formatted.replace('$', '').trim()}`;
    return formatted;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] p-8 flex items-center justify-center text-xs text-slate-500 font-sans">
        Cargando datos de ATOM PRO...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 p-6 font-sans relative space-y-5">
      <ModalContactoNegocio 
        contacto={contactoSeleccionado} 
        onClose={() => setContactoSeleccionado(null)} 
      />

      <div className="flex justify-between items-end mb-4 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Negocios</h1>
          <p className="text-xs text-slate-500 mt-0.5">Ranking de tiendas por efectividad operativa, volumen y rentabilidad</p>
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

      <BarraFiltrosSecundarios
        vistaActiva="negocios"
        availableOptions={availableOptions}
        selectedBodegas={selectedBodegas}
        setSelectedBodegas={setSelectedBodegas}
        selectedNegocios={selectedNegocios}
        setSelectedNegocios={setSelectedNegocios}
        selectedProductos={selectedProductos}
        setSelectedProductos={setSelectedProductos}
        selectedTransportadoras={selectedTransportadoras}
        setSelectedTransportadoras={setSelectedTransportadoras}
        selectedDepartamentos={selectedDepartamentos}
        setSelectedDepartamentos={setSelectedDepartamentos}
        selectedComunidades={selectedComunidades}
        setSelectedComunidades={setSelectedComunidades}
      />

      <div className="flex gap-3 relative">
        <div className="flex-1 relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por tienda o ID..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-700 placeholder-slate-400 shadow-xs outline-none hover:border-slate-300 focus:border-slate-400 transition-colors"
          />
        </div>

        <div className="relative inline-block" ref={columnSelectorRef}>
          <button 
            type="button"
            onClick={() => setShowColumnSelector(prev => !prev)}
            title="Configurar columnas visibles"
            className={`p-2.5 bg-white border rounded-xl text-slate-500 hover:text-slate-800 hover:border-slate-300 shadow-xs transition-colors cursor-pointer flex items-center justify-center ${
              showColumnSelector ? 'border-orange-500 text-orange-600 bg-orange-50' : 'border-slate-200'
            }`}
          >
            <SlidersHorizontal size={16} />
          </button>

          {showColumnSelector && (
            <div 
              style={{ right: 0, left: 'auto' }}
              className="absolute top-full mt-2 z-50 w-64 bg-white border border-slate-200 rounded-2xl shadow-2xl p-4 font-sans animate-fadeIn space-y-3"
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h3 className="text-xs font-bold text-slate-900 tracking-tight">Columnas</h3>
                <button 
                  type="button" 
                  onClick={() => setShowColumnSelector(false)} 
                  className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <X size={14} />
                </button>
              </div>

              <div className="space-y-1 max-h-64 overflow-y-auto pr-0.5">
                {columnsConfig.map((col) => {
                  const isVisible = visibleColumns[col.key];
                  return (
                    <div 
                      key={col.key}
                      onClick={() => setVisibleColumns(prev => ({ ...prev, [col.key]: !prev[col.key] }))}
                      className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs cursor-pointer transition-all select-none ${
                        isVisible 
                          ? 'bg-slate-50 text-slate-800 font-medium hover:bg-orange-50 hover:text-orange-950' 
                          : 'text-slate-400 hover:bg-slate-50 line-through'
                      }`}
                    >
                      <span className="truncate pr-2">{col.label}</span>
                      <div className={`p-1 rounded-lg flex items-center justify-center transition-colors shrink-0 ${
                        isVisible ? 'bg-orange-100 text-orange-600' : 'bg-slate-100 text-slate-400'
                      }`}>
                        {isVisible ? <Eye size={13} /> : <EyeOff size={13} />}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => {
                    const all: Record<string, boolean> = {};
                    columnsConfig.forEach(c => { all[c.key] = true; });
                    setVisibleColumns(all);
                  }}
                  className="text-[11px] text-orange-600 font-bold hover:underline cursor-pointer"
                >
                  Mostrar todas
                </button>
                <button
                  type="button"
                  onClick={() => setShowColumnSelector(false)}
                  className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold rounded-lg transition-colors cursor-pointer"
                >
                  Listo
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white border border-slate-200/90 rounded-2xl shadow-xs overflow-hidden overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[1300px]">
          <thead>
            <tr className="border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider bg-white">
              {visibleColumns.negocio && <th className="py-4 px-6 w-96">NEGOCIO</th>}
              {visibleColumns.accion && <th className="py-4 px-4 text-center w-28">ACCION</th>}
              {visibleColumns.generados && <th className="py-4 px-3 text-center">GENERADOS</th>}
              {visibleColumns.entregados && <th className="py-4 px-3 text-center">ENTREGADOS</th>}
              {visibleColumns.porConfirmar && <th className="py-4 px-3 text-center">POR CONFIRMAR</th>}
              {visibleColumns.pendientes && <th className="py-4 px-3 text-center">PENDIENTES</th>}
              {visibleColumns.enCurso && <th className="py-4 px-3 text-center">EN CURSO</th>}
              {visibleColumns.enNovedad && <th className="py-4 px-3 text-center">EN NOVEDAD</th>}
              {visibleColumns.devoluciones && <th className="py-4 px-3 text-center">DEVOLUCIONES</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-12 text-center text-slate-400 text-sm font-medium">
                  No se encontraron negocios para los filtros seleccionados.
                </td>
              </tr>
            ) : (
              paginatedData.map((biz, idx) => {
                const totalBizPedidos = biz.totalPedidos;
                const devCount = biz.stats.Devoluciones.pedidos;
                const devRate = totalBizPedidos > 0 ? (devCount / totalBizPedidos) * 100 : 0;
                const pillStyle = devRate >= 30 ? 'bg-rose-50 text-rose-600 border border-rose-200' : devRate >= 15 ? 'bg-amber-50 text-amber-600 border border-amber-200' : 'bg-emerald-50 text-emerald-600 border border-emerald-200';
                const pillLabel = devRate >= 30 ? 'Intervención' : devRate >= 15 ? 'Seguimiento' : 'Rentable';
                const bizKey = `${biz.name}__${biz.id}`;

                const isCascadeActive = !!cascadeOpen[bizKey];
                const isBodNegActive = !!expandedBodNeg[bizKey];

                return (
                  <React.Fragment key={idx}>
                    <tr
                      onClick={() => toggleBodNeg(bizKey)}
                      className={`transition-colors group cursor-pointer ${
                        isCascadeActive ? 'bg-slate-50/90' : 'hover:bg-slate-50/70'
                      }`}
                    >
                      {visibleColumns.negocio && (
                        <td className="py-4 px-6 select-none">
                          <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3 min-w-0">
                              <button
                                type="button"
                                onClick={(e) => toggleCascade(e, bizKey)}
                                title={isCascadeActive ? 'Contraer productos' : 'Desglosar productos vendidos por este negocio'}
                                className={`p-1.5 rounded-lg border transition-all shadow-xs shrink-0 cursor-pointer ${
                                  isCascadeActive
                                    ? 'bg-orange-500 border-orange-500 text-white shadow-orange-500/20'
                                    : 'border-slate-200 bg-white text-slate-500 hover:text-orange-600 hover:bg-orange-50 hover:border-orange-200'
                                }`}
                              >
                                <Package size={13} />
                              </button>

                              <div className="min-w-0">
                                <p className="font-semibold text-slate-800 group-hover:text-slate-900 transition-colors truncate text-[13px]" title={biz.name}>
                                  {biz.name}
                                </p>
                                <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                                  ID: {biz.id}
                                </p>
                              </div>
                            </div>

                            <div 
                              className="flex items-center gap-1.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <button
                                type="button"
                                onClick={() => setContactoSeleccionado({
                                  id: biz.id,
                                  tienda: biz.name,
                                  titular: biz.name,
                                  telefono: '+57 300 000 0000',
                                  correo: 'contacto@tienda.com',
                                  ciudad: 'Colombia'
                                })}
                                title="Ver ficha de contacto"
                                className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-all shadow-xs cursor-pointer"
                              >
                                <User size={12} />
                              </button>
                            </div>
                          </div>
                        </td>
                      )}

                      {visibleColumns.accion && (
                        <td className="py-4 px-4 text-center">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${pillStyle}`}>
                            {pillLabel}
                          </span>
                        </td>
                      )}

                      {['Generados', 'Entregados', 'Por Confirmar', 'Pendientes', 'En curso', 'En novedad', 'Devoluciones'].map((statName) => {
                        const colKeyMap: Record<string, string> = {
                          Generados: 'generados',
                          Entregados: 'entregados',
                          'Por Confirmar': 'porConfirmar',
                          Pendientes: 'pendientes',
                          'En curso': 'enCurso',
                          'En novedad': 'enNovedad',
                          Devoluciones: 'devoluciones',
                        };

                        if (!visibleColumns[colKeyMap[statName]]) return null;

                        const st = (biz.stats as any)[statName];
                        const percentageText = `${st.pct}%`;
                        let percColor = 'text-slate-800';

                        if (statName === 'Generados') {
                          percColor = 'text-slate-900 font-bold';
                        } else if (statName === 'Entregados') {
                          percColor = st.pct >= 70 ? 'text-emerald-600 font-bold' : 'text-rose-500 font-bold';
                        } else if (statName === 'Devoluciones') {
                          percColor = st.pct < 15 ? 'text-emerald-600 font-bold' : st.pct < 30 ? 'text-amber-500 font-bold' : 'text-rose-500 font-bold';
                        }

                        return (
                          <td key={statName} className="py-3 px-3 text-center">
                            <div className="flex flex-col items-center justify-center">
                              <span className={`text-sm ${percColor}`}>
                                {percentageText}
                              </span>
                              <span className="text-[11px] text-slate-500 font-medium leading-tight mt-0.5">
                                Pedidos: <span className="text-slate-700">{st.pedidos}</span>
                              </span>
                              <span className="text-[11px] text-slate-400 leading-tight">
                                Productos: <span className="text-slate-600">{st.productos}</span>
                              </span>

                              {isBodNegActive && (
                                <div className="flex flex-col items-center mt-1.5 pt-1.5 border-t border-slate-100 w-full animate-fadeIn text-[10px]">
                                  <span className="text-slate-500 leading-tight">
                                    Bod: <span className="text-slate-800 font-semibold">{formatCurrency(st.bod)}</span>
                                  </span>
                                  <span className="text-slate-500 leading-tight">
                                    Neg: <span className="text-slate-800 font-semibold">{formatCurrency(st.utilidad)}</span>
                                  </span>
                                </div>
                              )}
                            </div>
                          </td>
                        );
                      })}
                    </tr>

                    {/* VISTA EN CASCADA DE PRODUCTOS */}
                    {isCascadeActive && (
                      <>
                        <tr className="bg-slate-50/70 border-l-4 border-orange-500 border-b border-slate-100 text-[11px]">
                          <td colSpan={9} className="py-2 px-6">
                            <div className="flex items-center justify-between w-full">
                              <div className="flex items-center gap-2 text-slate-700 font-semibold">
                                <span className="w-2 h-2 rounded-full bg-orange-500" />
                                <Package size={14} className="text-orange-500" />
                                <span>
                                  Desglose de referencias comercializadas por <strong className="text-slate-900">"{biz.name}"</strong>
                                </span>
                              </div>
                              <span className="text-[11px] text-orange-700 bg-orange-100/70 border border-orange-200 px-3 py-0.5 rounded-full font-semibold">
                                {biz.productosList.length} Referencias
                              </span>
                            </div>
                          </td>
                        </tr>

                        {biz.productosList.map((prodChild, pIdx) => {
                          const pTotal = prodChild.totalPedidos;
                          const pDevCount = prodChild.stats.Devoluciones.pedidos;
                          const pDevRate = pTotal > 0 ? (pDevCount / pTotal) * 100 : 0;
                          const pPillStyle = pDevRate >= 30 ? 'bg-rose-50 text-rose-600 border border-rose-200' : pDevRate >= 15 ? 'bg-amber-50 text-amber-600 border border-amber-200' : 'bg-emerald-50 text-emerald-600 border border-emerald-200';
                          const pPillLabel = pDevRate >= 30 ? 'Intervención' : pDevRate >= 15 ? 'Seguimiento' : 'Rentable';
                          const prodSubKey = `${bizKey}__${prodChild.name}`;
                          const isSubBodNegActive = !!expandedBodNeg[prodSubKey] || isBodNegActive;

                          return (
                            <tr
                              key={pIdx}
                              onClick={() => toggleBodNeg(prodSubKey)}
                              className="bg-slate-50/40 hover:bg-slate-100/70 transition-colors border-l-4 border-orange-500/40 text-xs border-b border-slate-100 cursor-pointer"
                            >
                              {visibleColumns.negocio && (
                                <td className="py-3 px-6 pl-10 select-none">
                                  <div className="flex items-center gap-2.5 min-w-0">
                                    <CornerDownRight size={15} className="text-orange-400 shrink-0" />
                                    <div className="w-6 h-6 rounded-lg bg-orange-100/80 border border-orange-200 flex items-center justify-center shrink-0 text-orange-600">
                                      <Tag size={12} />
                                    </div>
                                    <div className="min-w-0">
                                      <p className="font-semibold text-slate-800 truncate" title={prodChild.name}>
                                        {prodChild.name}
                                      </p>
                                      <span className="text-[11px] text-slate-400">
                                        Participación en tienda: <strong className="text-slate-700">{prodChild.stats.Generados.pct}%</strong>
                                      </span>
                                    </div>
                                  </div>
                                </td>
                              )}

                              {visibleColumns.accion && (
                                <td className="py-3 px-4 text-center">
                                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${pPillStyle}`}>
                                    {pPillLabel}
                                  </span>
                                </td>
                              )}

                              {['Generados', 'Entregados', 'Por Confirmar', 'Pendientes', 'En curso', 'En novedad', 'Devoluciones'].map((statName) => {
                                const colKeyMap: Record<string, string> = {
                                  Generados: 'generados',
                                  Entregados: 'entregados',
                                  'Por Confirmar': 'porConfirmar',
                                  Pendientes: 'pendientes',
                                  'En curso': 'enCurso',
                                  'En novedad': 'enNovedad',
                                  Devoluciones: 'devoluciones',
                                };

                                if (!visibleColumns[colKeyMap[statName]]) return null;

                                const pSt = (prodChild.stats as any)[statName];
                                const percentageText = `${pSt.pct}%`;
                                let percColor = 'text-slate-800';

                                if (statName === 'Generados') {
                                  percColor = 'text-slate-900 font-bold';
                                } else if (statName === 'Entregados') {
                                  percColor = pSt.pct >= 70 ? 'text-emerald-600 font-bold' : 'text-rose-500 font-bold';
                                } else if (statName === 'Devoluciones') {
                                  percColor = pSt.pct < 15 ? 'text-emerald-600 font-bold' : pSt.pct < 30 ? 'text-amber-500 font-bold' : 'text-rose-500 font-bold';
                                }

                                return (
                                  <td key={statName} className="py-2.5 px-3 text-center">
                                    <div className="flex flex-col items-center justify-center">
                                      <span className={`text-xs font-bold ${percColor}`}>
                                        {percentageText}
                                      </span>
                                      <span className="text-[10px] text-slate-500 leading-tight">
                                        Ped: <span className="text-slate-700 font-medium">{pSt.pedidos}</span>
                                      </span>
                                      <span className="text-[10px] text-slate-400 leading-tight">
                                        Prod: <span className="text-slate-600 font-medium">{pSt.productos}</span>
                                      </span>

                                      {isSubBodNegActive && (
                                        <div className="flex flex-col items-center mt-1 pt-1 border-t border-slate-200/60 w-full animate-fadeIn text-[10px]">
                                          <span className="text-slate-500 leading-tight">
                                            Bod: <span className="text-slate-700 font-medium">{formatCurrency(pSt.bod)}</span>
                                          </span>
                                          <span className="text-slate-500 leading-tight">
                                            Neg: <span className="text-slate-700 font-medium">{formatCurrency(pSt.neg)}</span>
                                          </span>
                                        </div>
                                      )}
                                    </div>
                                  </td>
                                );
                              })}
                            </tr>
                          );
                        })}
                      </>
                    )}
                  </React.Fragment>
                );
              })
            )}
          </tbody>
        </table>

        <div className="flex items-center justify-between px-6 py-3.5 bg-white border-t border-slate-200 text-xs text-slate-500 font-sans">
          <div className="flex items-center gap-2">
            <span className="text-slate-600">Filas por página</span>
            <div className="relative">
              <select
                value={rowsPerPage}
                onChange={(e) => {
                  setRowsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs text-slate-700 shadow-2xs outline-none hover:border-slate-300 focus:border-slate-400 appearance-none pr-6 cursor-pointer font-medium"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
              <ChevronDown size={12} className="text-slate-400 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-slate-600 font-medium">Página {currentPage} de {totalPages}</span>
            <div className="flex items-center gap-1.5">
              {currentPage > 1 && (
                <button
                  type="button"
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  className="px-3 py-1 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-medium shadow-2xs transition-colors cursor-pointer"
                >
                  &lt; Anterior
                </button>
              )}
              <button
                type="button"
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                className={`px-3 py-1 bg-white border border-slate-200 rounded-lg text-xs font-medium shadow-2xs transition-colors ${
                  currentPage >= totalPages ? 'text-slate-300 cursor-not-allowed' : 'text-slate-700 hover:bg-slate-50 cursor-pointer'
                }`}
              >
                Siguiente &gt;
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
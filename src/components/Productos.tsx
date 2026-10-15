// src/components/Productos.tsx
'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, SlidersHorizontal, User, Phone, Mail, MessageSquare, 
  Copy, Check, MapPin, Store, ExternalLink, Package,
  CornerDownRight, Tag, X, ChevronDown
} from 'lucide-react';
import { 
  ProductOrderRecord, 
  generateProductsMockData 
} from '@/data/productosData';
import {
  BusinessContactInfo,
  BUSINESSES_DIRECTORY
} from '@/data/negociosData';
import FiltroFecha from '@/components/filtros/FiltroFecha';
import FiltroBodega from '@/components/filtros/FiltroBodega';
import FiltroNegocios from '@/components/filtros/FiltroNegocios';
import FiltroTransportadoras from '@/components/filtros/FiltroTransportadoras';
import FiltroDepartamentos from '@/components/filtros/FiltroDepartamentos';
import FiltroComunidades from '@/components/filtros/FiltroComunidades';
import InternalChatWidget from './InternalChatWidget';

// --- MODAL: FICHA DE CONTACTO DEL NEGOCIO (DESDE PRODUCTOS) ---
interface BusinessInfoModalProps {
  business: BusinessContactInfo | null;
  onClose: () => void;
  onOpenChat: (biz: BusinessContactInfo) => void;
}

function BusinessInfoModal({ business, onClose, onOpenChat }: BusinessInfoModalProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  if (!business) return null;

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-lg p-6 shadow-2xl relative animate-fadeIn font-sans">
        <div className="flex items-start justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-center text-orange-600 font-bold text-lg">
              {business.tiendaNombre.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800">{business.tiendaNombre}</h2>
              <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                <Store size={13} className="text-orange-500" /> ID Tienda: <span className="text-slate-700 font-mono font-semibold">{business.id}</span>
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="py-5 space-y-3.5 text-sm">
          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <User size={18} className="text-slate-400" />
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-semibold">Titular Dropi</p>
                <p className="font-semibold text-slate-800">{business.nombreTitular}</p>
              </div>
            </div>
            <span className="text-[11px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full font-medium">
              Verificado
            </span>
          </div>

          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Phone size={18} className="text-emerald-600" />
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-semibold">Teléfono / WhatsApp</p>
                <p className="font-semibold text-slate-800">{business.telefono}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => copyToClipboard(business.telefono, 'tel')}
                className="p-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors"
                title="Copiar número"
              >
                {copiedField === 'tel' ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
              </button>
              <a
                href={`https://wa.me/${business.telefono.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold flex items-center gap-1 hover:bg-emerald-100 transition-colors"
              >
                WhatsApp <ExternalLink size={12} />
              </a>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <Mail size={18} className="text-blue-500 shrink-0" />
              <div className="truncate">
                <p className="text-[10px] text-slate-400 uppercase font-semibold">Correo Electrónico</p>
                <p className="font-semibold text-slate-800 truncate">{business.correo}</p>
              </div>
            </div>
            <button
              onClick={() => copyToClipboard(business.correo, 'mail')}
              className="p-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-600 shrink-0 transition-colors"
              title="Copiar correo"
            >
              {copiedField === 'mail' ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 flex items-center gap-2">
              <MapPin size={16} className="text-rose-500 shrink-0" />
              <span className="text-slate-600 truncate">{business.ciudad}</span>
            </div>
            <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 flex items-center gap-2">
              <Store size={16} className="text-orange-500 shrink-0" />
              <span className="text-slate-600 truncate">{business.antiguedad}</span>
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors">
            Cerrar
          </button>
          <button
            onClick={() => {
              onClose();
              onOpenChat(business);
            }}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-orange-500/20 transition-all"
          >
            <MessageSquare size={14} /> Abrir Chat con la Tienda
          </button>
        </div>
      </div>
    </div>
  );
}

// --- VISTA PRINCIPAL: PRODUCTOS (MODO CLARO DROPI) ---
export default function Productos() {
  const [data, setData] = useState<ProductOrderRecord[]>([]);
  const [loading, setLoading] = useState(true);

  // Estados de filtros reactivos con SELECCIÓN MÚLTIPLE (Arrays)
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFrom, setDateFrom] = useState('2026-10-01');
  const [dateTo, setDateTo] = useState('2026-10-31');
  const [filterBodegas, setFilterBodegas] = useState<string[]>([]);
  const [filterNegocioIds, setFilterNegocioIds] = useState<string[]>([]);
  const [filterTransportadoras, setFilterTransportadoras] = useState<string[]>([]);
  const [filterDepartamentos, setFilterDepartamentos] = useState<string[]>([]);
  const [filterComunidades, setFilterComunidades] = useState<string[]>([]);

  // Paginación
  const [rowsPerPage, setRowsPerPage] = useState<number>(50);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Modales
  const [selectedContactBiz, setSelectedContactBiz] = useState<BusinessContactInfo | null>(null);
  const [selectedChatBiz, setSelectedChatBiz] = useState<BusinessContactInfo | null>(null);

  // Control de cascada y montos Bod/Neg $
  const [cascadeOpen, setCascadeOpen] = useState<Record<string, boolean>>({});
  const [expandedBodNeg, setExpandedBodNeg] = useState<Record<string, boolean>>({});

  const toggleCascade = (e: React.MouseEvent, productName: string) => {
    e.stopPropagation();
    setCascadeOpen((prev) => ({
      ...prev,
      [productName]: !prev[productName]
    }));
  };

  const toggleBodNeg = (key: string) => {
    setExpandedBodNeg((prev) => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  useEffect(() => {
    setData(generateProductsMockData());
    setLoading(false);
  }, []);

  // Reiniciar a la primera página si cambian los filtros
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, dateFrom, dateTo, filterBodegas, filterNegocioIds, filterTransportadoras, filterDepartamentos, filterComunidades, rowsPerPage]);

  // Agrupación y filtrado reactivo con soporte multi-selección
  const { processedData, globalTotalPedidos } = useMemo(() => {
    const filtered = data.filter((item) => {
      const isDateValid = item.date >= dateFrom && item.date <= dateTo;
      const isSearchValid = item.productName.toLowerCase().includes(searchTerm.toLowerCase());
      
      const isBodegaValid = filterBodegas.length === 0 || filterBodegas.includes(item.bodega);
      const isNegocioValid = filterNegocioIds.length === 0 || filterNegocioIds.includes(item.negocioId);
      const isTranspValid = filterTransportadoras.length === 0 || filterTransportadoras.includes(item.transportadora);
      const isDeptoValid = filterDepartamentos.length === 0 || filterDepartamentos.includes(item.departamento);
      const isComunidadValid = filterComunidades.length === 0 || (item as any).comunidad && filterComunidades.includes((item as any).comunidad);

      return isDateValid && isSearchValid && isBodegaValid && isNegocioValid && isTranspValid && isDeptoValid && isComunidadValid;
    });

    const globalTotal = filtered.length;
    const grouped: Record<string, any> = {};

    filtered.forEach((order) => {
      if (!grouped[order.productName]) {
        grouped[order.productName] = {
          name: order.productName,
          totalPedidos: 0,
          stats: {
            Generados: { pedidos: 0, productos: 0, bod: 0, neg: 0 },
            Entregados: { pedidos: 0, productos: 0, bod: 0, neg: 0 },
            'Por Confirmar': { pedidos: 0, productos: 0, bod: 0, neg: 0 },
            Pendientes: { pedidos: 0, productos: 0, bod: 0, neg: 0 },
            'En curso': { pedidos: 0, productos: 0, bod: 0, neg: 0 },
            'En novedad': { pedidos: 0, productos: 0, bod: 0, neg: 0 },
            Devoluciones: { pedidos: 0, productos: 0, bod: 0, neg: 0 }
          },
          negociosMap: {}
        };
      }

      const prod = grouped[order.productName];
      prod.totalPedidos += 1;

      const st = prod.stats[order.status];
      st.pedidos += 1;
      st.productos += order.quantity;
      st.bod += order.bodegaRevenue;
      st.neg += order.negocioRevenue;

      const gen = prod.stats['Generados'];
      gen.pedidos += 1;
      gen.productos += order.quantity;
      gen.bod += order.bodegaRevenue;
      gen.neg += order.negocioRevenue;

      // Agrupación de tiendas que vendieron este producto
      const bizKey = `${order.negocioNombre}__${order.negocioId}`;
      if (!prod.negociosMap[bizKey]) {
        prod.negociosMap[bizKey] = {
          name: order.negocioNombre,
          id: order.negocioId,
          totalPedidos: 0,
          stats: {
            Generados: { pedidos: 0, productos: 0, bod: 0, neg: 0 },
            Entregados: { pedidos: 0, productos: 0, bod: 0, neg: 0 },
            'Por Confirmar': { pedidos: 0, productos: 0, bod: 0, neg: 0 },
            Pendientes: { pedidos: 0, productos: 0, bod: 0, neg: 0 },
            'En curso': { pedidos: 0, productos: 0, bod: 0, neg: 0 },
            'En novedad': { pedidos: 0, productos: 0, bod: 0, neg: 0 },
            Devoluciones: { pedidos: 0, productos: 0, bod: 0, neg: 0 }
          }
        };
      }

      const bRecord = prod.negociosMap[bizKey];
      bRecord.totalPedidos += 1;

      const bSt = bRecord.stats[order.status];
      bSt.pedidos += 1;
      bSt.productos += order.quantity;
      bSt.bod += order.bodegaRevenue;
      bSt.neg += order.negocioRevenue;

      const bGen = bRecord.stats['Generados'];
      bGen.pedidos += 1;
      bGen.productos += order.quantity;
      bGen.bod += order.bodegaRevenue;
      bGen.neg += order.negocioRevenue;
    });

    return {
      processedData: Object.values(grouped).map((p: any) => ({
        ...p,
        negociosList: Object.values(p.negociosMap).sort((a: any, b: any) => b.totalPedidos - a.totalPedidos)
      })).sort((a, b) => b.totalPedidos - a.totalPedidos),
      globalTotalPedidos: globalTotal
    };
  }, [data, dateFrom, dateTo, searchTerm, filterBodegas, filterNegocioIds, filterTransportadoras, filterDepartamentos, filterComunidades]);

  const totalPages = Math.ceil(processedData.length / rowsPerPage) || 1;
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return processedData.slice(start, start + rowsPerPage);
  }, [processedData, currentPage, rowsPerPage]);

  const getActionPill = (devRate: number) => {
    if (devRate >= 30) return { label: 'Intervención', styles: 'bg-rose-50 text-rose-600 border border-rose-200' };
    if (devRate >= 15) return { label: 'Seguimiento', styles: 'bg-amber-50 text-amber-600 border border-amber-200' };
    return { label: 'Rentable', styles: 'bg-emerald-50 text-emerald-600 border border-emerald-200' };
  };

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(val);

  if (loading) return <div className="p-8 text-slate-500 font-medium">Cargando catálogo maestro de productos...</div>;

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 p-6 font-sans relative space-y-5">
      
      {/* 1. CABECERA: TÍTULO Y SELECTOR DE FECHAS */}
      <div className="flex justify-between items-end mb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Productos</h1>
          <p className="text-xs text-slate-500 mt-0.5">Ranking de productos por efectividad de entrega y rotación</p>
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

      {/* MODAL FICHA DE CONTACTO DEL NEGOCIO */}
      <BusinessInfoModal
        business={selectedContactBiz}
        onClose={() => setSelectedContactBiz(null)}
        onOpenChat={(biz) => setSelectedChatBiz(biz)}
      />

      {/* CHAT FLOTANTE DROPI */}
      <InternalChatWidget
        business={selectedChatBiz}
        onClose={() => setSelectedChatBiz(null)}
      />

      {/* 2. FILTROS SECUNDARIOS DROPI CON SELECCIÓN MÚLTIPLE */}
      <div className="grid grid-cols-5 gap-3.5">
        <FiltroBodega
          selected={filterBodegas}
          onChange={(b) => setFilterBodegas(b)}
        />

        <FiltroNegocios
          selectedIds={filterNegocioIds}
          onChange={(ids) => setFilterNegocioIds(ids)}
        />

        <FiltroTransportadoras
          selected={filterTransportadoras}
          onChange={(t) => setFilterTransportadoras(t)}
        />

        <FiltroDepartamentos
          selected={filterDepartamentos}
          onChange={(d) => setFilterDepartamentos(d)}
        />

        <FiltroComunidades
          selected={filterComunidades}
          onChange={(c) => setFilterComunidades(c)}
        />
      </div>

      {/* 3. BARRA DE BÚSQUEDA */}
      <div className="flex gap-3">
        <div className="flex-1 relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar producto por nombre..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-700 placeholder-slate-400 shadow-sm outline-none hover:border-slate-300 focus:border-slate-400 transition-colors"
          />
        </div>
        <button className="bg-white border border-slate-200 px-3.5 py-2.5 rounded-xl text-slate-500 hover:text-slate-800 hover:border-slate-300 shadow-sm transition-colors">
          <SlidersHorizontal size={16} />
        </button>
      </div>

      {/* 4. TABLA GENERAL DE PRODUCTOS */}
      <div className="bg-white border border-slate-200/90 rounded-2xl shadow-sm overflow-hidden overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[1300px]">
          <thead>
            <tr className="border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider bg-white">
              <th className="py-4 px-6 w-96">PRODUCTO ↕</th>
              <th className="py-4 px-4 text-center w-28">ACCION</th>
              <th className="py-4 px-3 text-center">GENERADOS ↕</th>
              <th className="py-4 px-3 text-center">ENTREGADOS ↕</th>
              <th className="py-4 px-3 text-center">POR CONFIRMAR ↕</th>
              <th className="py-4 px-3 text-center">PENDIENTES ↕</th>
              <th className="py-4 px-3 text-center">EN CURSO ↕</th>
              <th className="py-4 px-3 text-center">EN NOVEDAD ↕</th>
              <th className="py-4 px-3 text-center">DEVOLUCIONES ↕</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-12 text-center text-slate-400 text-sm font-medium">
                  No se encontraron productos para los filtros seleccionados.
                </td>
              </tr>
            ) : (
              paginatedData.map((prod: any, idx: number) => {
                const totalProdPedidos = prod.totalPedidos;
                const devCount = prod.stats['Devoluciones'].pedidos;
                const devRate = totalProdPedidos > 0 ? (devCount / totalProdPedidos) * 100 : 0;
                const pill = getActionPill(devRate);

                const isCascadeActive = !!cascadeOpen[prod.name];
                const isBodNegActive = !!expandedBodNeg[prod.name];

                const prodSharePercentage = globalTotalPedidos > 0
                  ? ((totalProdPedidos / globalTotalPedidos) * 100).toFixed(1)
                  : '0';

                return (
                  <React.Fragment key={idx}>
                    {/* Fila Principal de Producto */}
                    <tr
                      onClick={() => toggleBodNeg(prod.name)}
                      className={`transition-colors group cursor-pointer ${
                        isCascadeActive ? 'bg-slate-50/90' : 'hover:bg-slate-50/70'
                      }`}
                    >
                      {/* Columna Producto alineada a la izquierda con botón de cascada a la derecha */}
                      <td className="py-4 px-6 select-none">
                        <div className="flex items-center justify-between gap-3">
                          <div className="min-w-0">
                            <p className="font-semibold text-slate-800 group-hover:text-slate-900 transition-colors truncate text-[13px]">
                              {prod.name}
                            </p>
                          </div>

                          {/* Botón de Desglose en Cascada con Icono Store */}
                          <div 
                            className={`flex items-center gap-1.5 shrink-0 transition-opacity ${
                              isCascadeActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                            }`}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <button
                              type="button"
                              onClick={(e) => toggleCascade(e, prod.name)}
                              title={isCascadeActive ? 'Contraer canales' : 'Desglosar canales que vendieron este producto'}
                              className={`p-1.5 rounded-lg border transition-all shadow-sm ${
                                isCascadeActive
                                  ? 'bg-orange-500 border-orange-500 text-white shadow-orange-500/20'
                                  : 'border-slate-200 bg-white text-slate-500 hover:text-orange-600 hover:bg-orange-50 hover:border-orange-200'
                              }`}
                            >
                              <Store size={13} />
                            </button>
                          </div>
                        </div>
                      </td>

                      {/* Columna Acción */}
                      <td className="py-4 px-4 text-center">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${pill.styles}`}>
                          {pill.label}
                        </span>
                      </td>

                      {/* Columnas de Estados con Semaforización */}
                      {['Generados', 'Entregados', 'Por Confirmar', 'Pendientes', 'En curso', 'En novedad', 'Devoluciones'].map((statName) => {
                        const st = prod.stats[statName];
                        let percentageText = '0%';
                        let percColor = 'text-slate-800';

                        if (statName === 'Generados') {
                          percentageText = `${prodSharePercentage}%`;
                          percColor = 'text-slate-900 font-bold';
                        } else {
                          const localRate = totalProdPedidos > 0 ? (st.pedidos / totalProdPedidos) * 100 : 0;
                          percentageText = `${Math.round(localRate)}%`;

                          if (statName === 'Entregados') {
                            percColor = localRate >= 70 ? 'text-emerald-600' : 'text-rose-500 font-bold';
                          } else if (statName === 'Devoluciones') {
                            percColor = localRate < 15 ? 'text-emerald-600 font-bold' : localRate < 30 ? 'text-amber-500 font-bold' : 'text-rose-500 font-bold';
                          } else {
                            percColor = 'text-slate-800 font-bold';
                          }
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
                                <div className="flex flex-col items-center mt-1.5 pt-1.5 border-t border-slate-100 w-full animate-fadeIn">
                                  <span className="text-[10px] text-slate-500 leading-tight">
                                    Bod: <span className="text-slate-800 font-medium">{formatCurrency(st.bod)}</span>
                                  </span>
                                  <span className="text-[10px] text-slate-500 leading-tight">
                                    Neg: <span className="text-slate-800 font-medium">{formatCurrency(st.neg)}</span>
                                  </span>
                                </div>
                              )}
                            </div>
                          </td>
                        );
                      })}
                    </tr>

                    {/* VISTA EN CASCADA: CANALES QUE VENDIERON ESTE PRODUCTO */}
                    {isCascadeActive && (
                      <>
                        <tr className="bg-slate-50/70 border-l-4 border-orange-500 border-b border-slate-100 text-[11px]">
                          <td colSpan={9} className="py-2 px-6">
                            <div className="flex items-center justify-between w-full">
                              <div className="flex items-center gap-2 text-slate-700 font-semibold">
                                <span className="w-2 h-2 rounded-full bg-orange-500" />
                                <Store size={14} className="text-orange-500" />
                                <span>
                                  Desglose de canales que comercializaron <strong className="text-slate-900">"{prod.name}"</strong>
                                </span>
                              </div>
                              <span className="text-[11px] text-orange-700 bg-orange-100/70 border border-orange-200 px-3 py-0.5 rounded-full font-semibold">
                                {prod.negociosList.length} Negocios Registrados
                              </span>
                            </div>
                          </td>
                        </tr>

                        {prod.negociosList.map((bizChild: any, bIdx: number) => {
                          const bTotal = bizChild.totalPedidos;
                          const bDevCount = bizChild.stats['Devoluciones'].pedidos;
                          const bDevRate = bTotal > 0 ? (bDevCount / bTotal) * 100 : 0;
                          const bPill = getActionPill(bDevRate);
                          const bizSubKey = `${prod.name}__${bizChild.id}`;
                          const isSubBodNegActive = !!expandedBodNeg[bizSubKey] || isBodNegActive;

                          const shareInProduct = totalProdPedidos > 0 
                            ? Math.round((bTotal / totalProdPedidos) * 100) 
                            : 0;

                          // Buscar información de contacto para posibilitar el chat o ficha
                          const contactInfo = BUSINESSES_DIRECTORY.find((b) => b.id === bizChild.id) || {
                            nombreTitular: bizChild.name,
                            tiendaNombre: bizChild.name,
                            id: bizChild.id,
                            telefono: '+57 300 000 0000',
                            correo: 'contacto@tienda.com',
                            ciudad: 'Colombia',
                            antiguedad: 'Miembro Dropi'
                          };

                          return (
                            <tr
                              key={bIdx}
                              onClick={() => toggleBodNeg(bizSubKey)}
                              className="bg-slate-50/40 hover:bg-slate-100/70 transition-colors border-l-4 border-orange-500/40 text-xs border-b border-slate-100 cursor-pointer group/child"
                            >
                              <td className="py-3 px-6 pl-10 select-none">
                                <div className="flex items-center justify-between gap-2.5">
                                  <div className="flex items-center gap-2.5 min-w-0">
                                    <CornerDownRight size={15} className="text-orange-400 shrink-0" />
                                    <div className="w-6 h-6 rounded-lg bg-orange-100/80 border border-orange-200 flex items-center justify-center shrink-0 text-orange-600">
                                      <Store size={12} />
                                    </div>
                                    <div className="min-w-0">
                                      <p className="font-semibold text-slate-800 truncate" title={bizChild.name}>
                                        {bizChild.name}
                                      </p>
                                      <span className="text-[11px] text-slate-400">
                                        ID: <strong className="text-slate-600 font-mono">{bizChild.id}</strong> • Participación: <strong className="text-slate-700">{shareInProduct}%</strong>
                                      </span>
                                    </div>
                                  </div>

                                  {/* Acciones de Contacto del Negocio en la Cascada */}
                                  <div className="flex items-center gap-1.5 shrink-0 opacity-0 group-hover/child:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
                                    <button
                                      type="button"
                                      onClick={() => setSelectedContactBiz(contactInfo)}
                                      title="Ver ficha de contacto"
                                      className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-all shadow-sm"
                                    >
                                      <User size={12} />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => setSelectedChatBiz(contactInfo)}
                                      title="Abrir chat Dropi con esta tienda"
                                      className="p-1.5 rounded-lg bg-orange-50 border border-orange-200 text-orange-600 hover:bg-orange-100 transition-all shadow-sm"
                                    >
                                      <MessageSquare size={12} />
                                    </button>
                                  </div>
                                </div>
                              </td>

                              <td className="py-3 px-4 text-center">
                                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold ${bPill.styles}`}>
                                  {bPill.label}
                                </span>
                              </td>

                              {['Generados', 'Entregados', 'Por Confirmar', 'Pendientes', 'En curso', 'En novedad', 'Devoluciones'].map((statName) => {
                                const pSt = bizChild.stats[statName];
                                let percentageText = '0%';
                                let percColor = 'text-slate-800';

                                if (statName === 'Generados') {
                                  percentageText = `${shareInProduct}%`;
                                  percColor = 'text-slate-900 font-bold';
                                } else {
                                  const rate = bTotal > 0 ? Math.round((pSt.pedidos / bTotal) * 100) : 0;
                                  percentageText = `${rate}%`;

                                  if (statName === 'Entregados') {
                                    percColor = rate >= 70 ? 'text-emerald-600' : 'text-rose-500 font-bold';
                                  } else if (statName === 'Devoluciones') {
                                    percColor = rate < 15 ? 'text-emerald-600 font-bold' : rate < 30 ? 'text-amber-500 font-bold' : 'text-rose-500 font-bold';
                                  } else {
                                    percColor = 'text-slate-800 font-bold';
                                  }
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
                                        <div className="flex flex-col items-center mt-1 pt-1 border-t border-slate-200/60 w-full animate-fadeIn">
                                          <span className="text-[10px] text-slate-500 leading-tight">
                                            Bod: <span className="text-slate-700 font-medium">{formatCurrency(pSt.bod)}</span>
                                          </span>
                                          <span className="text-[10px] text-slate-500 leading-tight">
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

        {/* 5. PIE DE PÁGINA (PAGINACIÓN CON BOTÓN SIGUIENTE) */}
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
                className="bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs text-slate-700 shadow-sm outline-none hover:border-slate-300 focus:border-slate-400 appearance-none pr-6 cursor-pointer font-medium"
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
            <span className="text-slate-600 font-medium">Página {currentPage}</span>
            <div className="flex items-center gap-1.5">
              {currentPage > 1 && (
                <button
                  type="button"
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  className="px-3 py-1 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-medium shadow-sm transition-colors"
                >
                  &lt; Anterior
                </button>
              )}
              <button
                type="button"
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                className={`px-3 py-1 bg-white border border-slate-200 rounded-lg text-xs font-medium shadow-sm transition-colors ${
                  currentPage >= totalPages
                    ? 'text-slate-300 cursor-not-allowed'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                Siguiente &gt;
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 6. BOTÓN FLOTANTE DROPI CHAT */}
      <div 
        onClick={() => {
          const defaultContact = (BUSINESSES_DIRECTORY && BUSINESSES_DIRECTORY[0]) || null;
          if (defaultContact) {
            setSelectedChatBiz(defaultContact);
          }
        }}
        title="Abrir Chat Dropi"
        className="fixed bottom-6 right-6 w-12 h-12 rounded-full bg-[#f97316] hover:bg-orange-600 text-white flex items-center justify-center shadow-lg hover:shadow-orange-500/30 transition-all cursor-pointer z-40 active:scale-95"
      >
        <svg className="w-6 h-6 fill-white" viewBox="0 0 24 24">
          <path d="M12 2C6.477 2 2 6.477 2 12c0 2.237.737 4.304 1.984 5.975L2.2 21.8a.75.75 0 0 0 .937.937l3.825-1.784A9.957 9.957 0 0 0 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm-4.5 9a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm9 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm-9.354 3.646a.5.5 0 0 1 .708 0c1.077 1.078 2.585 1.708 4.146 1.708s3.07-.63 4.146-1.708a.5.5 0 1 1 .708.708C15.897 16.897 14.024 17.65 12 17.65s-3.897-.753-5.354-2.296a.5.5 0 0 1 0-.708z"/>
        </svg>
      </div>

    </div>
  );
}
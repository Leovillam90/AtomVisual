// src/app/negocios/page.tsx
'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  Search, SlidersHorizontal, User, Phone, Mail, MessageSquare, 
  Copy, Check, MapPin, Store, ExternalLink, Package,
  CornerDownRight, Tag, X, ChevronDown, ChevronLeft, ChevronRight,
  Eye, EyeOff, Users, Truck
} from 'lucide-react';
import { useFiltrosCruzados } from '@/hooks/useFiltrosCruzados';
import FiltroFecha from '@/filtros/FiltroFecha';
import ModalContactoNegocio, { DropshipperContactData } from './ModalContactoNegocio';
import ModalAperturaCAS, { CASContexto } from './ModalAperturaCAS';

// ==========================================
// 1. UTILIDADES Y PARSEO FINANCIERO
// ==========================================
function parseNumeroSeguro(v: any): number {
  if (v === null || v === undefined || v === '' || v === '-') return 0;
  if (typeof v === 'number') return v;
  let s = String(v).trim().replace('$', '').replace(/\s/g, '');
  if (s.includes('.') && s.includes(',')) {
    s = s.replace(/\./g, '').replace(',', '.');
  } else if (s.includes(',')) {
    s = s.replace(',', '.');
  } else if (s.includes('.')) {
    const parts = s.split('.');
    if (parts.length === 2 && parts[1].length === 3) s = parts[0] + parts[1];
  }
  const res = parseFloat(s);
  return isNaN(res) ? 0 : res;
}

const formatCurrency = (val: number) => {
  const formatted = new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0
  }).format(Math.abs(val || 0));

  if (val < 0) return `-$ ${formatted.replace('$', '').trim()}`;
  return formatted;
};

function crearEstructuraStatsVacia() {
  return {
    Generados: { pedidos: 0, productos: 0, bod: 0, neg: 0, utilidad: 0, flete: 0, pct: 100 },
    Entregados: { pedidos: 0, productos: 0, bod: 0, neg: 0, utilidad: 0, flete: 0, pct: 0 },
    'Por Confirmar': { pedidos: 0, productos: 0, bod: 0, neg: 0, utilidad: 0, flete: 0, pct: 0 },
    Pendientes: { pedidos: 0, productos: 0, bod: 0, neg: 0, utilidad: 0, flete: 0, pct: 0 },
    'En curso': { pedidos: 0, productos: 0, bod: 0, neg: 0, utilidad: 0, flete: 0, pct: 0 },
    'En novedad': { pedidos: 0, productos: 0, bod: 0, neg: 0, utilidad: 0, flete: 0, pct: 0 },
    Devoluciones: { pedidos: 0, productos: 0, bod: 0, neg: 0, utilidad: 0, flete: 0, pct: 0 },
  };
}

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

// ==========================================
// 2. DROPDOWN CON DISEÑO EXACTO A REFERENCIA
// ==========================================
interface DropdownProps {
  label: string;
  selected: string[];
  options: string[];
  onChange: (s: string[]) => void;
  icon?: React.ReactNode;
}

function DropdownFiltroUniforme({ label, selected = [], options = [], onChange, icon }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredOpts = useMemo(() => {
    if (!search) return options;
    return options.filter(o => o.toLowerCase().includes(search.toLowerCase()));
  }, [options, search]);

  const toggleOpt = (opt: string) => {
    onChange(selected.includes(opt) ? selected.filter(i => i !== opt) : [...selected, opt]);
  };

  const selectAll = () => onChange([...options]);
  const clearAll = () => onChange([]);

  const getLabelText = () => {
    if (!selected || selected.length === 0) return '(Todos)';
    if (selected.length === 1) return selected[0];
    return selected[0];
  };

  return (
    <div className="flex flex-col gap-1 relative w-full font-sans" ref={dropdownRef}>
      {label && <span className="text-xs text-slate-500 font-medium ml-1 select-none truncate">{label}</span>}
      
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full bg-white border rounded-xl px-3.5 py-2 text-xs text-left flex items-center justify-between shadow-2xs transition-colors cursor-pointer outline-none ${
          isOpen
            ? 'border-[#ff7e24] ring-2 ring-[#ff7e24]/10'
            : selected && selected.length > 0
            ? 'border-[#ff7e24] text-orange-600 font-semibold'
            : 'border-slate-200 text-slate-600 hover:border-slate-300'
        }`}
      >
        <div className="flex items-center gap-2 truncate pr-1">
          {icon && (
            <span className={selected && selected.length > 0 ? 'text-[#ff7e24]' : 'text-slate-400'}>
              {icon}
            </span>
          )}
          <span className="truncate">{getLabelText()}</span>
          {selected && selected.length > 1 && (
            <span className="px-1.5 py-0.5 rounded-full bg-orange-100 text-[#ff7e24] text-[10px] font-bold shrink-0">
              +{selected.length - 1}
            </span>
          )}
        </div>
        <ChevronDown 
          size={14} 
          className={`text-slate-400 transition-transform duration-150 shrink-0 ${isOpen ? 'rotate-180 text-[#ff7e24]' : ''}`} 
        />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1.5 w-72 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 overflow-hidden animate-fadeIn p-3 text-xs font-sans">
          <div className="relative mb-2.5">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder={`Buscar ${label.toLowerCase()}...`}
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-white border border-[#ff7e24] rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-700 placeholder-slate-400 outline-none shadow-2xs focus:ring-1 focus:ring-[#ff7e24]"
              autoFocus
            />
          </div>

          <div className="flex items-center justify-between px-1 mb-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              {label} ({options.length})
            </span>
            <div className="flex items-center gap-2">
              <button 
                type="button" 
                onClick={selectAll} 
                className="text-xs font-semibold text-[#ff7e24] hover:underline cursor-pointer"
              >
                Todos
              </button>
              <button 
                type="button" 
                onClick={clearAll} 
                className="text-xs text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                Limpiar
              </button>
            </div>
          </div>

          <div className="max-h-56 overflow-y-auto space-y-1 pr-1">
            {filteredOpts.length === 0 ? (
              <p className="text-center text-slate-400 py-3 text-xs">No hay resultados</p>
            ) : (
              filteredOpts.map(opt => {
                const isChecked = selected.includes(opt);
                return (
                  <div
                    key={opt}
                    onClick={() => toggleOpt(opt)}
                    className="flex items-center gap-2.5 px-1 py-1.5 rounded-lg hover:bg-slate-50 cursor-pointer transition select-none"
                  >
                    <div
                      className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 transition ${
                        isChecked
                          ? 'border-[#ff7e24] bg-[#ff7e24] text-white'
                          : 'border-slate-300 bg-white hover:border-slate-400'
                      }`}
                    >
                      {isChecked && <Check size={11} strokeWidth={3} />}
                    </div>
                    <span className="text-xs text-slate-700 font-medium tracking-wide truncate">
                      {opt}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// 3. PÁGINA PRINCIPAL DE NEGOCIOS
// ==========================================
export default function NegociosPage() {
  const {
    filteredData,
    loading,
    dateFrom, setDateFrom,
    dateTo, setDateTo,
    selectedBodegas, setSelectedBodegas,
    selectedProductos, setSelectedProductos,
    selectedTransportadoras, setSelectedTransportadoras,
    selectedDepartamentos, setSelectedDepartamentos,
    selectedComunidades, setSelectedComunidades,
    availableOptions
  } = useFiltrosCruzados();

  // Estados visuales de tabla
  const [searchTerm, setSearchTerm] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState<number>(50);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [cascadeOpen, setCascadeOpen] = useState<Record<string, boolean>>({});
  const [expandedBodNeg, setExpandedBodNeg] = useState<Record<string, boolean>>({});

  // ESTADOS PARA LOS DOS MODALES
  const [selectedContactDrop, setSelectedContactDrop] = useState<DropshipperContactData | null>(null);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [casContexto, setCasContexto] = useState<CASContexto | null>(null);
  const [isCasModalOpen, setIsCasModalOpen] = useState(false);

  // Selector de columnas visibles
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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (columnSelectorRef.current && !columnSelectorRef.current.contains(event.target as Node)) {
        setShowColumnSelector(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleColumnVisibility = (key: string) => {
    setVisibleColumns(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const totalVisibleColumnCount = useMemo(() => {
    return Object.values(visibleColumns).filter(Boolean).length;
  }, [visibleColumns]);

  // Pill de acción (Rentable, Seguimiento, Intervención) idéntica a Productos
  const getActionPill = (devolucionRate: number) => {
    if (devolucionRate >= 30) {
      return {
        label: 'Intervención',
        styles: 'bg-rose-50 text-rose-600 border border-rose-200'
      };
    }
    if (devolucionRate >= 15) {
      return {
        label: 'Seguimiento',
        styles: 'bg-amber-50 text-amber-600 border border-amber-200'
      };
    }
    return {
      label: 'Rentable',
      styles: 'bg-emerald-50 text-emerald-600 border border-emerald-200'
    };
  };

  // Motor de Agrupación Reactiva de Negocios
  const { processedData } = useMemo(() => {
    const datasetInput = Array.isArray(filteredData) ? filteredData : [];

    // Pre-filtrado local por término de búsqueda
    const filtered = datasetInput.filter((order) => {
      if (!order) return false;
      const bizName = String(order.dropshipper || order.Dropshipper || order.negocioNombre || '').toLowerCase();
      const bizId = String(order.idDropshipper || order['ID Dropshipper'] || order.negocioId || '').toLowerCase();
      const term = searchTerm.toLowerCase();

      if (term && !bizName.includes(term) && !bizId.includes(term)) {
        return false;
      }
      return true;
    });

    const grouped: Record<string, any> = {};

    filtered.forEach((order) => {
      if (!order) return;

      const bizName = String(order.dropshipper || order.Dropshipper || order.negocioNombre || 'Tienda').trim();
      const bizId = String(order.idDropshipper || order['ID Dropshipper'] || order.negocioId || bizName).trim();
      const prodName = String(order.productoNombre || order.Productos || order.productName || 'Producto General').trim();

      const cantRaw = order.cantidad ?? order['Productos (cantidad)'] ?? 1;
      const cant = typeof cantRaw === 'number' ? cantRaw : parseInt(String(cantRaw), 10) || 1;

      const recBod = parseNumeroSeguro(order.recaudoProveedor ?? order['Recaudo proveedor']);
      const recNeg = parseNumeroSeguro(order.recaudoNegocio ?? order['Recaudo negocio']);
      const utilidad = parseNumeroSeguro(order.utilidad ?? order.Utilidad);
      const flete = parseNumeroSeguro(order.flete ?? order.Flete);

      const rawEstado = String(order.tipoEstado || order['Tipo de estado'] || order.estado || '').toUpperCase();
      let bucket = 'En curso';
      if (rawEstado.includes('ENTREG') || rawEstado.includes('FINALIZ')) bucket = 'Entregados';
      else if (rawEstado.includes('DEVOLU')) bucket = 'Devoluciones';
      else if (rawEstado.includes('NOVEDAD')) bucket = 'En novedad';
      else if (rawEstado.includes('CONFIRM')) bucket = 'Por Confirmar';
      else if (rawEstado.includes('PENDIENTE')) bucket = 'Pendientes';

      const key = `${bizName}__${bizId}`;
      if (!grouped[key]) {
        grouped[key] = {
          name: bizName,
          id: bizId,
          totalPedidos: 0,
          stats: crearEstructuraStatsVacia(),
          productosMap: {}
        };
      }

      const biz = grouped[key];
      biz.totalPedidos += 1;
      biz.stats[bucket].pedidos += 1;
      biz.stats[bucket].productos += cant;
      biz.stats[bucket].bod += recBod;
      biz.stats[bucket].neg += recNeg;
      biz.stats[bucket].utilidad += utilidad;
      biz.stats[bucket].flete += flete;

      biz.stats.Generados.pedidos += 1;
      biz.stats.Generados.productos += cant;
      biz.stats.Generados.bod += recBod;
      biz.stats.Generados.neg += recNeg;
      biz.stats.Generados.utilidad += utilidad;
      biz.stats.Generados.flete += flete;

      // Desglose de Productos
      if (!biz.productosMap[prodName]) {
        biz.productosMap[prodName] = { name: prodName, totalPedidos: 0, stats: crearEstructuraStatsVacia() };
      }

      const pRecord = biz.productosMap[prodName];
      pRecord.totalPedidos += 1;
      pRecord.stats[bucket].pedidos += 1;
      pRecord.stats[bucket].productos += cant;
      pRecord.stats[bucket].bod += recBod;
      pRecord.stats[bucket].neg += recNeg;
      pRecord.stats[bucket].utilidad += utilidad;
      pRecord.stats[bucket].flete += flete;

      pRecord.stats.Generados.pedidos += 1;
      pRecord.stats.Generados.productos += cant;
      pRecord.stats.Generados.bod += recBod;
      pRecord.stats.Generados.neg += recNeg;
      pRecord.stats.Generados.utilidad += utilidad;
      pRecord.stats.Generados.flete += flete;
    });

    let globalUnidades = 0;
    Object.values(grouped).forEach((biz: any) => globalUnidades += biz.stats.Generados.productos);

    Object.values(grouped).forEach((biz: any) => {
      biz.stats.Generados.pct = globalUnidades > 0 ? Number(((biz.stats.Generados.productos / globalUnidades) * 100).toFixed(1)) : 100;
      ['Entregados', 'Por Confirmar', 'Pendientes', 'En curso', 'En novedad', 'Devoluciones'].forEach((k) => {
        biz.stats[k].pct = biz.totalPedidos > 0 ? Number(((biz.stats[k].pedidos / biz.totalPedidos) * 100).toFixed(1)) : 0;
      });

      Object.values(biz.productosMap).forEach((p: any) => {
        p.stats.Generados.pct = biz.stats.Generados.productos > 0 ? Number(((p.stats.Generados.productos / biz.stats.Generados.productos) * 100).toFixed(1)) : 0;
        ['Entregados', 'Por Confirmar', 'Pendientes', 'En curso', 'En novedad', 'Devoluciones'].forEach((k) => {
          p.stats[k].pct = p.totalPedidos > 0 ? Number(((p.stats[k].pedidos / p.totalPedidos) * 100).toFixed(1)) : 0;
        });
      });
    });

    const arr = Object.values(grouped).map((b: any) => ({
      ...b,
      productosList: Object.values(b.productosMap).sort((x: any, y: any) => y.totalPedidos - x.totalPedidos)
    })).sort((a, b) => b.totalPedidos - a.totalPedidos);

    return { processedData: arr };
  }, [filteredData, searchTerm]);

  // Paginación
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

  // Handlers para abrir modales
  const handleAbrirContacto = (biz: any) => {
    const cleanName = biz.name.toLowerCase().replace(/[^a-z0-9]/g, '');
    const cleanId = String(biz.id).replace(/[^0-9]/g, '');
    const telefonoGenerado = `+57 3${cleanId.padEnd(9, '1').slice(0, 9)}`;
    const correoGenerado = `${cleanName || 'contacto'}@dropi.co`;

    setSelectedContactDrop({
      id: biz.id,
      nombre: biz.name,
      telefono: telefonoGenerado,
      correo: correoGenerado,
      totalPedidos: biz.totalPedidos
    });
    setIsContactModalOpen(true);
  };

  const handleIniciarConversacionCAS = (drop: DropshipperContactData) => {
    setIsContactModalOpen(false);
    setCasContexto({
      negocioNombre: drop.nombre,
      negocioId: drop.id
    });
    setIsCasModalOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] p-8 flex items-center justify-center text-xs text-slate-500 font-sans">
        Cargando datos de Negocios...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 p-6 font-sans relative space-y-5">
      
      {/* 1. CABECERA: TÍTULO Y SELECTOR DE FECHA (IDÉNTICO A PRODUCTOS) */}
      <div className="flex justify-between items-end mb-4 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Negocios</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Ranking de negocios por efectividad operativa, volumen y rentabilidad
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

      {/* FILTROS EN UNA SOLA LÍNEA HORIZONTAL (5 COLUMNAS FIJAS) */}
      <div className="grid grid-cols-5 gap-3 w-full font-sans">
        <DropdownFiltroUniforme
          label="Bodega"
          selected={selectedBodegas}
          options={availableOptions?.bodegas || []}
          onChange={setSelectedBodegas}
          icon={<Store size={13} />}
        />

        <DropdownFiltroUniforme
          label="Producto"
          selected={selectedProductos}
          options={availableOptions?.productos || []}
          onChange={setSelectedProductos}
          icon={<Package size={13} />}
        />

        <DropdownFiltroUniforme
          label="Transportadoras"
          selected={selectedTransportadoras}
          options={availableOptions?.transportadoras || []}
          onChange={setSelectedTransportadoras}
          icon={<Truck size={13} />}
        />

        <DropdownFiltroUniforme
          label="Departamentos"
          selected={selectedDepartamentos}
          options={availableOptions?.departamentos || []}
          onChange={setSelectedDepartamentos}
          icon={<MapPin size={13} />}
        />

        <DropdownFiltroUniforme
          label="Comunidad"
          selected={selectedComunidades}
          options={availableOptions?.comunidades || ['Comunidad Élite', 'Comunidad Master', 'Comunidad Rocket']}
          onChange={setSelectedComunidades}
          icon={<Users size={13} />}
        />
      </div>

      {/* 3. BÚSQUEDA Y CONTROLADOR DE VISIBILIDAD DE COLUMNAS */}
      <div className="flex gap-3 relative">
        <div className="flex-1 relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por tienda, dropshipper o ID..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-700 placeholder-slate-400 shadow-xs outline-none hover:border-slate-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10 transition-all"
          />
        </div>

        {/* BOTÓN FLOTANTE CONFIGURAR COLUMNAS */}
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
                <div>
                  <h3 className="text-xs font-bold text-slate-900 tracking-tight">Columnas</h3>
                  <p className="text-[10px] text-slate-400">{totalVisibleColumnCount} de {columnsConfig.length} visibles</p>
                </div>
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
                      onClick={() => toggleColumnVisibility(col.key)}
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

      {/* 4. TABLA GENERAL DE NEGOCIOS */}
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
                <td colSpan={totalVisibleColumnCount} className="py-12 text-center text-slate-400 text-sm font-medium">
                  No se encontraron negocios para los filtros seleccionados.
                </td>
              </tr>
            ) : (
              paginatedData.map((biz: any, idx: number) => {
                const totalBizPedidos = biz.totalPedidos;
                const devCount = biz.stats['Devoluciones']?.pedidos || 0;
                const devRate = totalBizPedidos > 0 ? (devCount / totalBizPedidos) * 100 : 0;
                const pill = getActionPill(devRate);
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
                      {/* Columna Negocio con Ícono de Contacto al lado del Ícono de Cascada */}
                      {visibleColumns.negocio && (
                        <td className="py-4 px-6 select-none">
                          <div className="flex items-center gap-2">
                            {/* Ícono 1: Toggle Cascada */}
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

                            {/* Ícono 2: Contacto del Dropshipper (JUSTO AL LADO) */}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAbrirContacto(biz);
                              }}
                              className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-400 hover:text-[#ff7e24] hover:border-orange-300 hover:bg-orange-50 transition shadow-xs cursor-pointer shrink-0"
                              title="Ver datos de contacto del Dropshipper"
                            >
                              <Phone size={13} />
                            </button>

                            {/* Nombre e ID del Negocio */}
                            <div className="min-w-0 ml-1">
                              <p className="font-semibold text-slate-800 group-hover:text-slate-900 transition-colors truncate text-[13px]" title={biz.name}>
                                {biz.name}
                              </p>
                              <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                                ID: {biz.id}
                              </p>
                            </div>
                          </div>
                        </td>
                      )}

                      {/* Columna Acción */}
                      {visibleColumns.accion && (
                        <td className="py-4 px-4 text-center">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${pill.styles}`}>
                            {pill.label}
                          </span>
                        </td>
                      )}

                      {/* Columnas de Estados */}
                      {['Generados', 'Entregados', 'Por Confirmar', 'Pendientes', 'En curso', 'En novedad', 'Devoluciones'].map((statName) => {
                        const colKeyMap: Record<string, string> = {
                          'Generados': 'generados',
                          'Entregados': 'entregados',
                          'Por Confirmar': 'porConfirmar',
                          'Pendientes': 'pendientes',
                          'En curso': 'enCurso',
                          'En novedad': 'enNovedad',
                          'Devoluciones': 'devoluciones',
                        };

                        if (!visibleColumns[colKeyMap[statName]]) return null;

                        const st = biz.stats[statName] || { pedidos: 0, productos: 0, bod: 0, neg: 0, utilidad: 0, pct: 0 };
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
                                Pedidos: <span className="text-slate-700 font-semibold">{st.pedidos}</span>
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
                          <td colSpan={totalVisibleColumnCount} className="py-2 px-6">
                            <div className="flex items-center justify-between w-full">
                              <div className="flex items-center gap-2 text-slate-700 font-semibold">
                                <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                                <Package size={14} className="text-orange-500" />
                                <span>
                                  Desglose de productos comercializados por <strong className="text-slate-900">"{biz.name}"</strong>
                                </span>
                              </div>
                              <span className="text-[11px] text-orange-700 bg-orange-100/70 border border-orange-200 px-3 py-0.5 rounded-full font-semibold">
                                {biz.productosList.length} Referencias Asociadas
                              </span>
                            </div>
                          </td>
                        </tr>

                        {biz.productosList.map((prodChild: any, pIdx: number) => {
                          const pTotal = prodChild.totalPedidos;
                          const pDevCount = prodChild.stats['Devoluciones']?.pedidos || 0;
                          const pDevRate = pTotal > 0 ? (pDevCount / pTotal) * 100 : 0;
                          const pPill = getActionPill(pDevRate);
                          const prodSubKey = `${bizKey}__${prodChild.name}`;
                          const isSubBodNegActive = !!expandedBodNeg[prodSubKey] || isBodNegActive;

                          return (
                            <tr
                              key={pIdx}
                              onClick={() => toggleBodNeg(prodSubKey)}
                              className="bg-slate-50/40 hover:bg-slate-100/70 transition-colors border-l-4 border-orange-500/40 text-xs border-b border-slate-100 cursor-pointer group/child"
                            >
                              {visibleColumns.negocio && (
                                <td className="py-2.5 px-6 pl-10 select-none">
                                  <div className="flex items-center gap-2.5">
                                    <CornerDownRight size={15} className="text-orange-400 shrink-0" />
                                    <div className="w-6 h-6 rounded-lg bg-orange-100/80 border border-orange-200 flex items-center justify-center shrink-0 text-orange-600">
                                      <Tag size={12} />
                                    </div>
                                    <div className="min-w-0">
                                      <p className="font-semibold text-slate-800 truncate" title={prodChild.name}>
                                        {prodChild.name}
                                      </p>
                                      <span className="text-[11px] text-slate-400">
                                        Ref: {String(prodChild.name || '').slice(0, 10).toUpperCase().replace(/\s+/g, '-')}
                                      </span>
                                    </div>
                                  </div>
                                </td>
                              )}

                              {visibleColumns.accion && (
                                <td className="py-3 px-4 text-center">
                                  <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium ${pPill.styles}`}>
                                    {pPill.label}
                                  </span>
                                </td>
                              )}

                              {['Generados', 'Entregados', 'Por Confirmar', 'Pendientes', 'En curso', 'En novedad', 'Devoluciones'].map((statName) => {
                                const colKeyMap: Record<string, string> = {
                                  'Generados': 'generados',
                                  'Entregados': 'entregados',
                                  'Por Confirmar': 'porConfirmar',
                                  'Pendientes': 'pendientes',
                                  'En curso': 'enCurso',
                                  'En novedad': 'enNovedad',
                                  'Devoluciones': 'devoluciones',
                                };

                                if (!visibleColumns[colKeyMap[statName]]) return null;

                                const pSt = prodChild.stats[statName] || { pedidos: 0, productos: 0, bod: 0, neg: 0, utilidad: 0, pct: 0 };
                                const percentageText = `${pSt.pct}%`;
                                let percColor = 'text-slate-800';

                                if (statName === 'Generados') percColor = 'text-slate-900 font-bold';
                                else if (statName === 'Entregados') percColor = pSt.pct >= 70 ? 'text-emerald-600 font-bold' : 'text-rose-500 font-bold';
                                else if (statName === 'Devoluciones') percColor = pSt.pct < 15 ? 'text-emerald-600 font-bold' : 'text-rose-500 font-bold';

                                return (
                                  <td key={statName} className="py-2.5 px-3 text-center">
                                    <div className="flex flex-col items-center justify-center">
                                      <span className={`text-[13px] ${percColor}`}>
                                        {percentageText}
                                      </span>
                                      <span className="text-[10px] text-slate-500 leading-tight">
                                        Ped: <span className="text-slate-700">{pSt.pedidos}</span>
                                      </span>
                                      <span className="text-[10px] text-slate-400 leading-tight">
                                        Prod: <span className="text-slate-600">{pSt.productos}</span>
                                      </span>

                                      {isSubBodNegActive && (
                                        <div className="flex flex-col items-center mt-1 pt-1 border-t border-slate-200/60 w-full animate-fadeIn text-[9px]">
                                          <span className="text-slate-500 leading-tight">
                                            Bod: <span className="text-slate-700 font-medium">{formatCurrency(pSt.bod)}</span>
                                          </span>
                                          <span className="text-slate-500 leading-tight">
                                            Neg: <span className="text-slate-700 font-medium">{formatCurrency(pSt.utilidad)}</span>
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
      </div>

      {/* 5. BARRA DE PAGINACIÓN INFERIOR (IDÉNTICA A PRODUCTOS) */}
      <div className="flex items-center justify-between px-6 py-3.5 bg-white border-t border-slate-200 text-xs text-slate-500 font-sans">
        <div className="flex items-center gap-2">
          <span className="text-slate-600 font-medium">Filas por página</span>
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

        <div>
          Mostrando {processedData.length === 0 ? 0 : (currentPage - 1) * rowsPerPage + 1} - {Math.min(currentPage * rowsPerPage, processedData.length)} de {processedData.length} negocios
        </div>

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

      {/* MODAL 1: FICHA DE CONTACTO DEL DROPSHIPPER */}
      <ModalContactoNegocio
        isOpen={isContactModalOpen}
        dropshipper={selectedContactDrop}
        onClose={() => setIsContactModalOpen(false)}
        onIniciarConversacion={handleIniciarConversacionCAS}
      />

      {/* MODAL 2: APERTURA DE CONVERSACIÓN CAS */}
      <ModalAperturaCAS
        isOpen={isCasModalOpen}
        contexto={casContexto}
        onClose={() => setIsCasModalOpen(false)}
      />

    </div>
  );
}
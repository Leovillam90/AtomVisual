// src/app/detalle-guias/page.tsx
'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useFiltrosCruzados } from '@/hooks/useFiltrosCruzados';
import { 
  Search, Download, SlidersHorizontal, X, 
  ChevronLeft, ChevronRight, Calendar as CalendarIcon, 
  ChevronDown, Check, CheckCircle2, ShieldAlert,
  Store, User, Truck, MapPin, AlertTriangle, Clock, Layers,
  RotateCcw
} from 'lucide-react';
import FiltroFecha from '@/filtros/FiltroFecha';

// ==========================================
// 1. TIPOS Y ESTRUCTURA DE DATOS (20 COLUMNAS)
// ==========================================
export interface GuiaFilaCompleta {
  id: string;
  fechaCreacion: string;
  diasGestion: number;
  ultimoMovimiento: number;
  tipoEstado: string;
  estado: string;
  pagadaDropi: string;
  fechaPago: string;
  devBodega: string;
  destinoCiudad: string;
  destinoDepartamento: string;
  transportadora: string;
  numeroGuia: string;
  pedidos: number;
  cantidadProductos: number;
  productoNombre: string;
  recaudoNegocio: number;
  recaudoProveedor: number;
  flete: number;
  gananciaNegocio: number;
  etiquetaAlerta?: 'NOVEDAD_10D' | 'FUERA_BODEGA_30D' | null;
}

// Extractor tolerante a tildes (í/Ú), mayúsculas y caracteres especiales
function extraerContadorSeguro(order: any, variantes: string[]): number {
  if (!order) return 0;
  
  for (const v of variantes) {
    if (order[v] !== undefined && order[v] !== null && order[v] !== '') {
      const num = Number(order[v]);
      if (!isNaN(num)) return num;
    }
  }

  const orderKeys = Object.keys(order);
  for (const k of orderKeys) {
    const kNorm = k
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '');

    for (const v of variantes) {
      const vNorm = v
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '');

      if (kNorm === vNorm || (vNorm.length > 3 && kNorm.includes(vNorm))) {
        const num = Number(order[k]);
        if (!isNaN(num)) return num;
      }
    }
  }

  return 0;
}

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
    if (parts.length === 2 && parts[1].length === 3) {
      s = parts[0] + parts[1];
    }
  }
  const res = parseFloat(s);
  return isNaN(res) ? 0 : res;
}

function parseDateToISO(val: any): string {
  if (!val || val === 'NaN' || val === '-') return '- - -';
  const s = String(val).trim().split(' ')[0];
  if (s.includes('/')) {
    const p = s.split('/');
    if (p.length === 3) {
      const d = p[0].padStart(2, '0');
      const m = p[1].padStart(2, '0');
      const y = p[2];
      return `${y}-${m}-${d}`;
    }
  }
  if (s.includes('-') && s.length >= 10) return s.slice(0, 10);
  return s;
}

function formatearTexto(s: any): string {
  if (!s || s === 'NaN' || s === '-') return '- - -';
  const str = String(s).trim();
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

const formatMoney = (val: number) => {
  if (!val && val !== 0) return '- - -';
  const formatted = Math.round(val).toLocaleString('es-CO');
  return `$ ${formatted}`;
};

// ==========================================
// 2. COMPONENTE DROPDOWN CON SELECCIÓN MÚLTIPLE
// ==========================================
interface DropdownMultipleProps {
  label: string;
  selected: string[];
  options: string[];
  onChange: (selected: string[]) => void;
  icon?: React.ReactNode;
}

function DropdownFiltroMultiple({ label, selected = [], options = [], onChange, icon }: DropdownMultipleProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredOptions = useMemo(() => {
    if (!search) return options;
    return options.filter((o) => o.toLowerCase().includes(search.toLowerCase()));
  }, [options, search]);

  const handleToggleOption = (opt: string) => {
    if (selected.includes(opt)) {
      onChange(selected.filter((item) => item !== opt));
    } else {
      onChange([...selected, opt]);
    }
  };

  const getButtonLabel = () => {
    if (!selected || selected.length === 0) return '(Todos)';
    if (selected.length === 1) return selected[0];
    return `${selected[0]} (+${selected.length - 1})`;
  };

  return (
    <div className="flex flex-col gap-1 w-full relative font-sans" ref={ref}>
      <label className="text-xs text-slate-500 font-medium ml-1 select-none truncate">
        {label}
      </label>
      
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full bg-white border rounded-xl px-3 py-2 text-xs text-left flex items-center justify-between shadow-xs transition-colors cursor-pointer outline-none ${
          isOpen
            ? 'border-orange-500 ring-2 ring-orange-500/10'
            : selected.length > 0
            ? 'border-orange-500 text-orange-600 font-semibold'
            : 'border-slate-200 text-slate-700 hover:border-slate-300'
        }`}
      >
        <div className="flex items-center gap-1.5 truncate">
          {icon && <span className={selected.length > 0 ? 'text-orange-500' : 'text-slate-400'}>{icon}</span>}
          <span className="truncate">{getButtonLabel()}</span>
          {selected.length > 1 && (
            <span className="px-1.5 py-0.2 rounded-full bg-orange-100 text-orange-700 font-bold text-[10px] shrink-0">
              {selected.length}
            </span>
          )}
        </div>
        <ChevronDown
          size={14}
          className={`text-slate-400 shrink-0 transition-transform duration-150 ${isOpen ? 'rotate-180 text-orange-500' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-[102%] left-0 w-full min-w-[220px] bg-white border border-slate-200 rounded-2xl shadow-xl z-50 py-2 text-xs animate-fadeIn">
          {options.length > 5 && (
            <div className="px-2 pb-2 border-b border-slate-100">
              <input
                type="text"
                placeholder="Buscar opción..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs outline-none focus:border-orange-500"
                autoFocus
              />
            </div>
          )}

          <div className="flex items-center justify-between px-3 py-1.5 border-b border-slate-100 text-[11px]">
            <button
              type="button"
              onClick={() => onChange([])}
              className="text-orange-600 font-bold hover:underline cursor-pointer"
            >
              (Todos)
            </button>
            {selected.length > 0 && (
              <button
                type="button"
                onClick={() => onChange([])}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                Limpiar ({selected.length})
              </button>
            )}
          </div>

          <div className="max-h-56 overflow-y-auto py-1">
            {filteredOptions.map((opt) => {
              const isChecked = selected.includes(opt);
              return (
                <div
                  key={opt}
                  onClick={() => handleToggleOption(opt)}
                  className="w-full px-3 py-1.5 text-left hover:bg-slate-50 flex items-center justify-between cursor-pointer transition select-none"
                >
                  <div className="flex items-center gap-2 truncate pr-2">
                    <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center shrink-0 transition ${
                      isChecked ? 'bg-orange-500 border-orange-500 text-white' : 'border-slate-300 bg-white'
                    }`}>
                      {isChecked && <Check size={10} strokeWidth={3} />}
                    </div>
                    <span className={`truncate ${isChecked ? 'text-slate-900 font-bold' : 'text-slate-700'}`}>
                      {opt}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// 3. COMPONENTE PRINCIPAL
// ==========================================
export default function PantallaDetalleGuias() {
  const {
    filteredData,
    loading,
    dateFrom, setDateFrom,
    dateTo, setDateTo,
    selectedBodegas, setSelectedBodegas,
    selectedNegocios, setSelectedNegocios,
    selectedTransportadoras, setSelectedTransportadoras,
    selectedDepartamentos, setSelectedDepartamentos,
    searchTerm, setSearchTerm,
    availableOptions
  } = useFiltrosCruzados();

  // Paginación y ordenamiento
  const [rowsPerPage, setRowsPerPage] = useState(50);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<string>('fechaCreacion');
  const [sortAsc, setSortAsc] = useState<boolean>(false);

  // Filtros adicionales con Selección Múltiple
  const [filtroTipoEstado, setFiltroTipoEstado] = useState<string[]>([]);
  const [filtroDevBodega, setFiltroDevBodega] = useState<string[]>([]);
  const [filtroPagadaDropi, setFiltroPagadaDropi] = useState<string[]>([]);

  // Registro de Auditorías sincronizado desde LocalStorage
  const [guiasAuditadas, setGuiasAuditadas] = useState<Record<string, { estado: string; fecha: string }>>({});

  useEffect(() => {
    const syncAuditadas = () => {
      try {
        const stored = localStorage.getItem('atom_guias_auditadas');
        if (stored) {
          setGuiasAuditadas(JSON.parse(stored));
        }
      } catch (e) {
        console.error(e);
      }
    };

    syncAuditadas();
    window.addEventListener('atom_guias_updated', syncAuditadas);
    window.addEventListener('storage', syncAuditadas);

    return () => {
      window.removeEventListener('atom_guias_updated', syncAuditadas);
      window.removeEventListener('storage', syncAuditadas);
    };
  }, []);

  const tiposEstadoOptions = useMemo(() => {
    return Array.from(new Set(filteredData.map((d: any) => d['Tipo de estado'] || d.tipoEstado))).filter(Boolean).sort();
  }, [filteredData]);

  // ==========================================
  // 4. TRANSFORMACIÓN DE FILAS Y FILTRADO MÚLTIPLE
  // ==========================================
  const guiasProcesadas = useMemo(() => {
    if (!Array.isArray(filteredData)) return [];

    let list: GuiaFilaCompleta[] = filteredData.map((order: any) => {
      const id = String(order.id || order.ID || '');
      const fechaCreacionRaw = String(order.fechaCreacion || order['Fecha de creación'] || '');
      const fechaCreacion = parseDateToISO(fechaCreacionRaw);

      const tipoEstado = formatearTexto(order.tipoEstado || order['Tipo de estado'] || order.estado || order.Estado);
      const estado = formatearTexto(order.estado || order.Estado || order.tipoEstado);

      const rawPagada = String(order['Pagado por Dropi'] || order.pagadoDropi || 'NO').toUpperCase();
      const pagadaDropi = rawPagada.includes('SI') ? 'Si' : 'No';

      const fechaPago = parseDateToISO(order['Fecha de pago'] || order.fechaPago);

      const rawDev = String(order['Devolución a bodega'] || order.devBodega || 'NO').toUpperCase().trim();
      const devBodega = (rawDev === 'SI' || rawDev === 'SÍ') ? 'Si' : 'No';

      // Extracción de días
      const rawDiasGestion = extraerContadorSeguro(order, [
        'diasGestion',
        'diasEnGestion',
        'Días en gestión',
        'Dias en gestion',
        'dias_gestion'
      ]);

      const rawUltimoMovimiento = extraerContadorSeguro(order, [
        'ultimoMovimiento',
        'Último movimiento',
        'Ultimo movimiento',
        'ultimo_movimiento',
        'ultMov'
      ]);

      // Regla de negocio de días: Entregado / Devuelta a bodega = 0 días; demás = días reales
      const esEntregadoOFinalizado = 
        tipoEstado.toUpperCase().includes('ENTREG') || 
        tipoEstado.toUpperCase().includes('FINALIZ') || 
        estado.toUpperCase().includes('ENTREG') || 
        estado.toUpperCase().includes('FINALIZ');

      const esDevueltaEnBodega = devBodega === 'Si';

      const diasGestion = (esEntregadoOFinalizado || esDevueltaEnBodega) ? 0 : rawDiasGestion;
      const ultimoMovimiento = (esEntregadoOFinalizado || esDevueltaEnBodega) ? 0 : rawUltimoMovimiento;

      // Reglas para Alertas
      let etiquetaAlerta: 'NOVEDAD_10D' | 'FUERA_BODEGA_30D' | null = null;
      const tipoUp = tipoEstado.toUpperCase();

      if (tipoUp.includes('NOVEDAD') && ultimoMovimiento >= 10) {
        etiquetaAlerta = 'NOVEDAD_10D';
      } else if (tipoUp.includes('CURSO') && diasGestion >= 30) {
        etiquetaAlerta = 'FUERA_BODEGA_30D';
      }

      const destinoCiudad = formatearTexto(order.Destino || order.destino || '- - -');
      const destinoDepartamento = formatearTexto(order.Departamento || order.departamento || '- - -');

      const transportadora = formatearTexto(order.Transportadora || order.transportadora || '- - -');
      const numeroGuia = String(order['Número de guía'] || order.numeroGuia || '- - -');

      const cantRaw = order.cantidad ?? order['Productos (cantidad)'] ?? 1;
      const cantidadProductos = typeof cantRaw === 'number' ? cantRaw : parseInt(String(cantRaw), 10) || 1;

      const prodNombreBase = String(order.productoNombre || order.Productos || 'Producto').trim();
      const productoNombre = `${prodNombreBase} x${cantidadProductos}`;

      const recaudoNegocio = parseNumeroSeguro(order['Recaudo negocio'] ?? order.recaudoNegocio);
      const recaudoProveedor = parseNumeroSeguro(order['Recaudo proveedor'] ?? order.recaudoProveedor);
      const flete = parseNumeroSeguro(order.Flete ?? order.flete);
      const gananciaNegocio = parseNumeroSeguro(order.Utilidad ?? order.utilidad);

      return {
        id,
        fechaCreacion,
        diasGestion,
        ultimoMovimiento,
        tipoEstado,
        estado,
        pagadaDropi,
        fechaPago,
        devBodega,
        destinoCiudad,
        destinoDepartamento,
        transportadora,
        numeroGuia,
        pedidos: 1,
        cantidadProductos,
        productoNombre,
        recaudoNegocio,
        recaudoProveedor,
        flete,
        gananciaNegocio,
        etiquetaAlerta
      };
    });

    // 1. Filtrado de Tipo de Estado (Múltiple)
    if (filtroTipoEstado.length > 0) {
      list = list.filter((g) => 
        filtroTipoEstado.some((f) => f.toLowerCase() === g.tipoEstado.toLowerCase())
      );
    }

    // 2. Filtrado de Devolución en Bodega (Múltiple)
    if (filtroDevBodega.length > 0) {
      list = list.filter((g) => filtroDevBodega.includes(g.devBodega));
    }

    // 3. Filtrado de Pagada Dropi (Múltiple)
    if (filtroPagadaDropi.length > 0) {
      list = list.filter((g) => filtroPagadaDropi.includes(g.pagadaDropi));
    }

    // 4. Búsqueda por texto
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      list = list.filter((g) =>
        g.id.toLowerCase().includes(q) ||
        g.numeroGuia.toLowerCase().includes(q) ||
        g.productoNombre.toLowerCase().includes(q) ||
        g.destinoCiudad.toLowerCase().includes(q) ||
        g.transportadora.toLowerCase().includes(q)
      );
    }

    // 5. Ordenamiento
    list.sort((a: any, b: any) => {
      let va = a[sortField];
      let vb = b[sortField];
      if (typeof va === 'string') {
        return sortAsc ? va.localeCompare(vb) : vb.localeCompare(va);
      }
      return sortAsc ? (va - vb) : (vb - va);
    });

    return list;
  }, [filteredData, filtroTipoEstado, filtroDevBodega, filtroPagadaDropi, searchTerm, sortField, sortAsc]);

  const totalResults = guiasProcesadas.length;
  const totalPages = Math.max(1, Math.ceil(totalResults / rowsPerPage));
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return guiasProcesadas.slice(start, start + rowsPerPage);
  }, [guiasProcesadas, currentPage, rowsPerPage]);

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  const handleExportCSV = () => {
    if (guiasProcesadas.length === 0) return;
    const headers = [
      'ID', 'Fecha Creacion', 'Dias Gestion', 'Ult Movimiento', 'Tipo Estado', 'Alerta CAS', 'Estado',
      'Pagada Dropi', 'Fecha Pago', 'Dev Bodega', 'Auditoria Estado', 'Auditoria Fecha', 
      'Destino', 'Departamento', 'Transportadora', 'Numero Guia', 'Pedidos', 
      'Cantidad Productos', 'Producto', 'Recaudo Negocio', 'Recaudo Proveedor', 'Flete', 'Ganancia Negocio'
    ];

    const rows = guiasProcesadas.map((g) => {
      const aud = guiasAuditadas[g.numeroGuia];
      const audEstado = aud ? (aud.estado === 'CONFIRMAR' ? 'Confirmada en Bodega' : 'Reclamo CAS') : '- - -';
      const audFecha = aud?.fecha || '- - -';
      const alerta = g.etiquetaAlerta === 'NOVEDAD_10D' ? 'NOVEDADES (+10 DIAS)' : g.etiquetaAlerta === 'FUERA_BODEGA_30D' ? 'FUERA DE BODEGA (+30 DIAS)' : '- - -';

      return [
        g.id, g.fechaCreacion, g.diasGestion, g.ultimoMovimiento, g.tipoEstado, alerta, g.estado,
        g.pagadaDropi, g.fechaPago, g.devBodega, audEstado, audFecha,
        g.destinoCiudad, g.destinoDepartamento, g.transportadora, g.numeroGuia,
        g.pedidos, g.cantidadProductos, `"${g.productoNombre.replace(/"/g, '""')}"`,
        g.recaudoNegocio, g.recaudoProveedor, g.flete, g.gananciaNegocio
      ];
    });

    const csvContent = '\uFEFF' + [headers.join(';'), ...rows.map((e) => e.join(';'))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `detalle_guias_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderUltimoMovimiento = (val: number) => {
    let colorClase = 'bg-emerald-50 text-emerald-600 border border-emerald-200';
    if (val >= 1 && val <= 5) {
      colorClase = 'bg-orange-100 text-orange-600 border border-orange-200';
    } else if (val >= 6) {
      colorClase = 'bg-rose-100 text-rose-600 border border-rose-200';
    }

    return (
      <div className="flex justify-center items-center">
        <span className={`flex items-center justify-center w-6 h-6 rounded-full font-bold text-xs ${colorClase}`}>
          {val}
        </span>
      </div>
    );
  };

  // Píldora limpia de Tipo de Estado (solo pastilla de estado)
  const renderTipoEstadoBadge = (val: string) => {
    const v = val.toLowerCase();
    let clases = 'bg-slate-100 text-slate-700 border border-slate-200';

    if (v.includes('entreg')) {
      clases = 'bg-emerald-50 text-emerald-700 border border-emerald-200';
    } else if (v.includes('devolu')) {
      clases = 'bg-rose-50 text-rose-700 border border-rose-200';
    } else if (v.includes('curso')) {
      clases = 'bg-amber-50 text-amber-700 border border-amber-200';
    } else if (v.includes('novedad')) {
      clases = 'bg-orange-50 text-orange-700 border border-orange-200';
    } else if (v.includes('confirm') || v.includes('pendiente por confirmacion')) {
      clases = 'bg-indigo-50 text-indigo-700 border border-indigo-200';
    } else if (v.includes('pendiente')) {
      clases = 'bg-sky-50 text-sky-700 border border-sky-200';
    }

    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap shadow-2xs ${clases}`}>
        {val}
      </span>
    );
  };

  // Columna Auditoría Bodega: concentra todas las etiquetas y fechas
  const renderColumnaAuditoria = (numeroGuia: string, alerta?: 'NOVEDAD_10D' | 'FUERA_BODEGA_30D' | null) => {
    const auditada = guiasAuditadas[numeroGuia];

    // 1. Auditoría registrada desde el modal
    if (auditada) {
      const esConfirmada = auditada.estado === 'CONFIRMAR';
      return (
        <div className="flex flex-col items-center justify-center gap-0.5">
          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border shadow-2xs whitespace-nowrap ${
            esConfirmada 
              ? 'bg-emerald-100 text-emerald-800 border-emerald-300' 
              : 'bg-rose-100 text-rose-800 border-rose-300'
          }`}>
            {esConfirmada ? (
              <CheckCircle2 size={11} className="text-emerald-600 shrink-0" />
            ) : (
              <ShieldAlert size={11} className="text-rose-600 shrink-0" />
            )}
            <span>{esConfirmada ? 'Confirmada en Bodega' : 'Reclamo CAS'}</span>
          </span>

          {auditada.fecha && (
            <span className="text-[10px] text-slate-400 font-mono">
              {auditada.fecha}
            </span>
          )}
        </div>
      );
    }

    // 2. Alerta NOVEDADES (+10 DÍAS)
    if (alerta === 'NOVEDAD_10D') {
      return (
        <div className="flex justify-center">
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-orange-100 text-orange-800 border border-orange-300 whitespace-nowrap shadow-2xs animate-pulse">
            <AlertTriangle size={11} className="text-orange-600 shrink-0" />
            NOVEDADES (+10 DÍAS)
          </span>
        </div>
      );
    }

    // 3. Alerta FUERA DE BODEGA (+30 DÍAS)
    if (alerta === 'FUERA_BODEGA_30D') {
      return (
        <div className="flex justify-center">
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-100 text-rose-800 border border-rose-300 whitespace-nowrap shadow-2xs animate-pulse">
            <Clock size={11} className="text-rose-600 shrink-0" />
            FUERA DE BODEGA (+30 DÍAS)
          </span>
        </div>
      );
    }

    // 4. Sin etiqueta ni auditoría
    return <span className="text-slate-400 font-medium">- - -</span>;
  };

  if (loading) {
    return <div className="p-8 flex justify-center text-slate-500 font-sans">Cargando base de datos de guías...</div>;
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 p-6 font-sans relative space-y-5">
      
      {/* 1. CABECERA: TÍTULO Y SELECTOR DE FECHA (IDÉNTICO A PRODUCTOS / NEGOCIOS) */}
      <div className="flex justify-between items-end flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Detalle de Guías</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Inspección granular, trazabilidad operativa y alertas CAS de todas las órdenes despachadas
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

      {/* 2. FILTROS CON SELECCIÓN MÚLTIPLE (7 COLUMNAS) */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 w-full font-sans">
        
        {/* Bodega */}
        <DropdownFiltroMultiple
          label="Bodega"
          selected={selectedBodegas}
          options={availableOptions.bodegas}
          onChange={setSelectedBodegas}
          icon={<Store size={13} />}
        />

        {/* Negocios */}
        <DropdownFiltroMultiple
          label="Negocios"
          selected={selectedNegocios}
          options={availableOptions.negocios}
          onChange={setSelectedNegocios}
          icon={<User size={13} />}
        />

        {/* Tipo Estado */}
        <DropdownFiltroMultiple
          label="Tipo Estado"
          selected={filtroTipoEstado}
          options={tiposEstadoOptions}
          onChange={setFiltroTipoEstado}
          icon={<Layers size={13} />}
        />

        {/* Departamento */}
        <DropdownFiltroMultiple
          label="Departamento"
          selected={selectedDepartamentos}
          options={availableOptions.departamentos}
          onChange={setSelectedDepartamentos}
          icon={<MapPin size={13} />}
        />

        {/* Transportadora */}
        <DropdownFiltroMultiple
          label="Transportadora"
          selected={selectedTransportadoras}
          options={availableOptions.transportadoras}
          onChange={setSelectedTransportadoras}
          icon={<Truck size={13} />}
        />

        {/* Devolución en Bodega */}
        <DropdownFiltroMultiple
          label="Devolución en Bodega"
          selected={filtroDevBodega}
          options={['Si', 'No']}
          onChange={setFiltroDevBodega}
          icon={<RotateCcw size={13} />}
        />

        {/* Pagada Dropi */}
        <DropdownFiltroMultiple
          label="Pagada Dropi"
          selected={filtroPagadaDropi}
          options={['Si', 'No']}
          onChange={setFiltroPagadaDropi}
          icon={<CheckCircle2 size={13} />}
        />

      </div>

      {/* 3. BÚSQUEDA Y BOTONES DE ACCIÓN */}
      <div className="flex items-center gap-3">
        <div className="flex-1 relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Buscar por guía, ID, producto, negocio, departamento..." 
            className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-700 placeholder-slate-400 shadow-2xs outline-none hover:border-slate-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10 transition-all"
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
          />
        </div>

        <button 
          onClick={handleExportCSV}
          className="flex items-center gap-2 bg-white border border-slate-200 hover:border-slate-300 rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 transition cursor-pointer shrink-0"
        >
          <Download size={14} className="text-slate-500" />
          <span>Exportar</span>
        </button>
      </div>

      {/* 4. TABLA DE 20 COLUMNAS */}
      <div className="bg-white border border-slate-200/90 rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto max-w-full">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 text-[10px] font-bold uppercase tracking-wider select-none">
                <th onClick={() => handleSort('id')} className="py-4 px-4 cursor-pointer hover:bg-slate-100/60 transition">
                  ID <span className="text-[8px] text-slate-400">◆</span>
                </th>
                <th onClick={() => handleSort('fechaCreacion')} className="py-4 px-4 text-center cursor-pointer hover:bg-slate-100/60 transition">
                  FECHA CREACIÓN <span className="text-[8px] text-slate-400">◆</span>
                </th>
                <th onClick={() => handleSort('diasGestion')} className="py-4 px-4 text-center cursor-pointer hover:bg-slate-100/60 transition">
                  DÍAS EN GESTIÓN <span className="text-[8px] text-slate-400">◆</span>
                </th>
                <th onClick={() => handleSort('ultimoMovimiento')} className="py-4 px-4 text-center cursor-pointer hover:bg-slate-100/60 transition">
                  ULT. MOVIMIENTO <span className="text-[8px] text-slate-400">◆</span>
                </th>
                <th className="py-4 px-4 text-center">TIPO DE ESTADO</th>
                <th onClick={() => handleSort('estado')} className="py-4 px-4 cursor-pointer hover:bg-slate-100/60 transition">
                  ESTADO <span className="text-[8px] text-slate-400">◆</span>
                </th>
                <th className="py-4 px-4 text-center">PAGADA POR DROPI</th>
                <th onClick={() => handleSort('fechaPago')} className="py-4 px-4 text-center cursor-pointer hover:bg-slate-100/60 transition">
                  FECHA DE PAGO <span className="text-[8px] text-slate-400">◆</span>
                </th>
                <th className="py-4 px-4 text-center">DEV. EN BODEGA</th>

                {/* COLUMNA DE AUDITORÍA CON TODAS LAS ETIQUETAS */}
                <th className="py-4 px-4 text-center bg-slate-100/70 font-black text-slate-800">
                  AUDITORÍA BODEGA
                </th>

                <th onClick={() => handleSort('destinoCiudad')} className="py-4 px-4 cursor-pointer hover:bg-slate-100/60 transition">
                  DESTINO <span className="text-[8px] text-slate-400">◆</span>
                </th>
                <th onClick={() => handleSort('transportadora')} className="py-4 px-4 cursor-pointer hover:bg-slate-100/60 transition">
                  TRANSPORTADORA <span className="text-[8px] text-slate-400">◆</span>
                </th>
                <th onClick={() => handleSort('numeroGuia')} className="py-4 px-4 text-center cursor-pointer hover:bg-slate-100/60 transition">
                  NUM. GUÍA <span className="text-[8px] text-slate-400">◆</span>
                </th>
                <th onClick={() => handleSort('pedidos')} className="py-4 px-4 text-center cursor-pointer hover:bg-slate-100/60 transition">
                  # PEDIDOS <span className="text-[8px] text-slate-400">◆</span>
                </th>
                <th onClick={() => handleSort('cantidadProductos')} className="py-4 px-4 text-center cursor-pointer hover:bg-slate-100/60 transition">
                  # PRODUCTOS
                </th>
                <th onClick={() => handleSort('productoNombre')} className="py-4 px-4 cursor-pointer hover:bg-slate-100/60 transition">
                  PRODUCTOS
                </th>
                <th onClick={() => handleSort('recaudoNegocio')} className="py-4 px-4 text-right cursor-pointer hover:bg-slate-100/60 transition">
                  RECAUDO NEGOCIO
                </th>
                <th onClick={() => handleSort('recaudoProveedor')} className="py-4 px-4 text-right cursor-pointer hover:bg-slate-100/60 transition">
                  RECAUDO PROVEEDOR
                </th>
                <th onClick={() => handleSort('flete')} className="py-4 px-4 text-right cursor-pointer hover:bg-slate-100/60 transition">
                  PRECIO FLETE
                </th>
                <th onClick={() => handleSort('gananciaNegocio')} className="py-4 px-4 text-right font-black cursor-pointer hover:bg-slate-100/60 transition">
                  GANANCIA NEGOCIO
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
              {paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={20} className="py-12 text-center text-slate-500">
                    No se encontraron resultados para los filtros seleccionados.
                  </td>
                </tr>
              ) : (
                paginatedData.map((g, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 text-slate-900 font-mono font-bold">{g.id}</td>
                    <td className="py-3.5 px-4 text-center text-slate-600">{g.fechaCreacion}</td>
                    <td className="py-3.5 px-4 text-center font-bold text-slate-700">{g.diasGestion}</td>
                    <td className="py-3.5 px-4">{renderUltimoMovimiento(g.ultimoMovimiento)}</td>
                    
                    {/* TIPO DE ESTADO: SOLO PASTILLA LIMPIA */}
                    <td className="py-3.5 px-4 text-center">
                      {renderTipoEstadoBadge(g.tipoEstado)}
                    </td>

                    <td className="py-3.5 px-4 text-slate-800">{g.estado}</td>
                    <td className="py-3.5 px-4 text-center text-slate-700">{g.pagadaDropi}</td>
                    <td className="py-3.5 px-4 text-center text-slate-600">{g.fechaPago}</td>
                    
                    {/* DEV. EN BODEGA ORIGINAL */}
                    <td className="py-3.5 px-4 text-center font-semibold text-slate-700">
                      {g.devBodega}
                    </td>

                    {/* AUDITORÍA BODEGA: ALBERGA TODAS LAS ETIQUETAS Y FECHAS */}
                    <td className="py-3.5 px-4 text-center bg-slate-50/40">
                      {renderColumnaAuditoria(g.numeroGuia, g.etiquetaAlerta)}
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="leading-tight">
                        <div className="text-slate-900 font-semibold">{g.destinoCiudad}</div>
                        <div className="text-[10px] text-slate-400 font-normal">{g.destinoDepartamento}</div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-slate-700 font-medium">{g.transportadora}</td>
                    <td className="py-3.5 px-4 text-center text-slate-600 font-mono">{g.numeroGuia}</td>
                    <td className="py-3.5 px-4 text-center font-bold text-slate-800">{g.pedidos}</td>
                    <td className="py-3.5 px-4 text-center font-bold text-slate-800">{g.cantidadProductos}</td>
                    
                    <td className="py-3.5 px-4 max-w-[260px] truncate" title={g.productoNombre}>
                      {g.productoNombre}
                    </td>

                    <td className="py-3.5 px-4 text-right text-slate-700">{formatMoney(g.recaudoNegocio)}</td>
                    <td className="py-3.5 px-4 text-right text-slate-700">{formatMoney(g.recaudoProveedor)}</td>
                    <td className="py-3.5 px-4 text-right text-slate-700">{formatMoney(g.flete)}</td>
                    <td className={`py-3.5 px-4 text-right font-black ${g.gananciaNegocio < 0 ? 'text-rose-600' : 'text-slate-900'}`}>
                      {formatMoney(g.gananciaNegocio)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* 5. BARRA DE PAGINACIÓN INFERIOR */}
        <div className="p-4 border-t border-slate-200/90 bg-white flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 font-medium gap-3">
          <div className="flex items-center gap-2">
            <span>Filas por página:</span>
            <select 
              value={rowsPerPage} 
              onChange={(e) => { setRowsPerPage(Number(e.target.value)); setCurrentPage(1); }}
              className="border border-slate-200 rounded-lg px-2.5 py-1 bg-white outline-none cursor-pointer hover:border-slate-300"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>

          <div>
            Mostrando {totalResults === 0 ? 0 : Math.min(rowsPerPage, totalResults)} de {totalResults} resultados
          </div>

          <div className="flex items-center gap-3">
            <span>Página {currentPage} de {totalPages}</span>
            <div className="flex gap-1.5">
              <button 
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 disabled:opacity-40 transition cursor-pointer font-semibold"
              >
                Anterior
              </button>
              <button 
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages || totalPages === 0}
                className="px-3 py-1.5 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 disabled:opacity-40 transition cursor-pointer font-semibold"
              >
                Siguiente
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
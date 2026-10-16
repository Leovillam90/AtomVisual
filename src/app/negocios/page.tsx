// src/app/negocios/page.tsx
'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  Search, Download, Store, Package, Truck, MapPin, 
  ChevronDown, Check, CornerDownRight, ChevronLeft, ChevronRight, Users
} from 'lucide-react';
import { useFiltrosCruzados } from '@/hooks/useFiltrosCruzados';
import FiltroFecha from '@/filtros/FiltroFecha';

// ==========================================
// 1. UTILIDADES Y MOTOR DE CÁLCULO
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

const formatMoney = (val: number) => `$ ${Math.round(val).toLocaleString('es-CO')}`;

function crearStatsVacias() {
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

// =========================================================================
// 2. DROPDOWN MULTISELECCIÓN (IDENTIDAD VISUAL EXACTA)
// =========================================================================
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

  const filteredOptions = useMemo(() => {
    if (!search) return options;
    return options.filter((opt) => opt.toLowerCase().includes(search.toLowerCase()));
  }, [options, search]);

  const toggleOption = (opt: string) => {
    if (selected.includes(opt)) {
      onChange(selected.filter((item) => item !== opt));
    } else {
      onChange([...selected, opt]);
    }
  };

  const selectAll = () => onChange([...options]);
  const clearAll = () => onChange([]);

  const getSelectedLabel = () => {
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
        <div className="flex items-center gap-1.5 truncate pr-1">
          {icon && <span className={selected.length > 0 ? 'text-[#ff7e24]' : 'text-slate-400'}>{icon}</span>}
          <span className="truncate">{getSelectedLabel()}</span>
          {selected.length > 1 && (
            <span className="px-1.5 py-0.5 rounded-full bg-orange-100 text-[#ff7e24] text-[10px] font-bold shrink-0">
              +{selected.length - 1}
            </span>
          )}
        </div>
        <ChevronDown 
          size={14} 
          className={`text-slate-400 transition-transform duration-150 ${isOpen ? 'rotate-180 text-[#ff7e24]' : ''}`} 
        />
      </button>

      {isOpen && (
        <div className="absolute top-[102%] left-0 w-full min-w-[220px] bg-white border border-slate-200 rounded-2xl shadow-xl z-50 py-2 text-xs animate-fadeIn">
          {options.length > 5 && (
            <div className="px-2 pb-2 border-b border-slate-100">
              <div className="relative">
                <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  placeholder={`Buscar ${label.toLowerCase()}...`}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-white border border-[#ff7e24] rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-700 placeholder-slate-400 outline-none shadow-2xs focus:ring-1 focus:ring-[#ff7e24]"
                  autoFocus
                />
              </div>
            </div>
          )}

          <div className="flex items-center justify-between px-3 py-1.5 border-b border-slate-100 text-[11px]">
            <button type="button" onClick={selectAll} className="text-orange-600 font-bold hover:underline cursor-pointer">
              Todos
            </button>
            <button type="button" onClick={clearAll} className="text-slate-400 hover:text-slate-600 cursor-pointer">
              Limpiar
            </button>
          </div>

          <div className="max-h-56 overflow-y-auto py-1">
            {filteredOptions.length === 0 ? (
              <p className="text-center text-slate-400 py-3 text-xs">No hay resultados</p>
            ) : (
              filteredOptions.map((opt) => {
                const isChecked = selected.includes(opt);
                return (
                  <div
                    key={opt}
                    onClick={() => toggleOption(opt)}
                    className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg hover:bg-slate-50 cursor-pointer transition select-none"
                  >
                    <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center shrink-0 transition ${
                      isChecked ? 'bg-[#ff7e24] border-[#ff7e24] text-white' : 'border-slate-300 bg-white hover:border-slate-400'
                    }`}>
                      {isChecked && <Check size={10} strokeWidth={3} />}
                    </div>
                    <span className={`truncate ${isChecked ? 'text-slate-900 font-bold' : 'text-slate-700'}`}>
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
    availableOptions
  } = useFiltrosCruzados();

  // Estados locales para la página (Paginación y Cascada)
  const [rowsPerPage, setRowsPerPage] = useState(50);
  const [currentPage, setCurrentPage] = useState(1);
  const [cascadeOpen, setCascadeOpen] = useState<Record<string, boolean>>({});
  const [searchTerm, setSearchTerm] = useState('');

  // Filtros locales independientes
  const [filtroBodegas, setFiltroBodegas] = useState<string[]>([]);
  const [filtroProductos, setFiltroProductos] = useState<string[]>([]);
  const [filtroTransportadoras, setFiltroTransportadoras] = useState<string[]>([]);
  const [filtroDepartamentos, setFiltroDepartamentos] = useState<string[]>([]);
  const [filtroComunidades, setFiltroComunidades] = useState<string[]>([]);

  // 1. Filtrado y Agrupación Principal por Negocio -> Producto
  const { processedData, globalTotalUnidades } = useMemo(() => {
    const datasetInput = Array.isArray(filteredData) ? filteredData : [];

    // Pre-filtrado
    const filtered = datasetInput.filter((order) => {
      if (filtroBodegas.length > 0 && !filtroBodegas.includes(order.bodega || order.tiendaId)) return false;
      const prodName = String(order.productoNombre || order.Productos || order.productName || '');
      if (filtroProductos.length > 0 && !filtroProductos.some(f => f.toLowerCase() === prodName.toLowerCase())) return false;
      if (filtroTransportadoras.length > 0 && !filtroTransportadoras.includes(order.transportadora || order.Transportadora)) return false;
      if (filtroDepartamentos.length > 0 && !filtroDepartamentos.includes(order.departamento || order.Departamento)) return false;
      
      const bizName = String(order.dropshipper || order.Dropshipper || order.negocioNombre || '').toLowerCase();
      if (searchTerm && !bizName.includes(searchTerm.toLowerCase())) return false;

      return true;
    });

    const agrupado: Record<string, any> = {};

    filtered.forEach(order => {
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

      // Inicializa Negocio
      if (!agrupado[bizId]) {
        agrupado[bizId] = {
          id: bizId,
          name: bizName,
          totalPedidos: 0,
          stats: crearStatsVacias(),
          productosMap: {}
        };
      }

      const biz = agrupado[bizId];
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

      // Inicializa Producto dentro de Negocio
      if (!biz.productosMap[prodName]) {
        biz.productosMap[prodName] = { name: prodName, totalPedidos: 0, stats: crearStatsVacias() };
      }

      const prod = biz.productosMap[prodName];
      prod.totalPedidos += 1;
      prod.stats[bucket].pedidos += 1;
      prod.stats[bucket].productos += cant;
      prod.stats[bucket].bod += recBod;
      prod.stats[bucket].neg += recNeg;
      prod.stats[bucket].utilidad += utilidad;
      prod.stats[bucket].flete += flete;

      prod.stats.Generados.pedidos += 1;
      prod.stats.Generados.productos += cant;
      prod.stats.Generados.bod += recBod;
      prod.stats.Generados.neg += recNeg;
      prod.stats.Generados.utilidad += utilidad;
      prod.stats.Generados.flete += flete;
    });

    let globalUnidades = 0;
    Object.values(agrupado).forEach((biz: any) => globalUnidades += biz.stats.Generados.productos);

    // Calcular Porcentajes
    Object.values(agrupado).forEach((biz: any) => {
      biz.stats.Generados.pct = globalUnidades > 0 ? Number(((biz.stats.Generados.productos / globalUnidades) * 100).toFixed(1)) : 100;
      ['Entregados', 'Por Confirmar', 'Pendientes', 'En curso', 'En novedad', 'Devoluciones'].forEach(k => {
        biz.stats[k].pct = biz.totalPedidos > 0 ? Number(((biz.stats[k].pedidos / biz.totalPedidos) * 100).toFixed(1)) : 0;
      });

      Object.values(biz.productosMap).forEach((p: any) => {
        p.stats.Generados.pct = biz.stats.Generados.productos > 0 ? Number(((p.stats.Generados.productos / biz.stats.Generados.productos) * 100).toFixed(1)) : 0;
        ['Entregados', 'Por Confirmar', 'Pendientes', 'En curso', 'En novedad', 'Devoluciones'].forEach(k => {
          p.stats[k].pct = p.totalPedidos > 0 ? Number(((p.stats[k].pedidos / p.totalPedidos) * 100).toFixed(1)) : 0;
        });
      });
    });

    const arr = Object.values(agrupado).map((b: any) => ({
      ...b,
      productosList: Object.values(b.productosMap).sort((x: any, y: any) => y.totalPedidos - x.totalPedidos)
    })).sort((a, b) => b.totalPedidos - a.totalPedidos);

    return { processedData: arr, globalTotalUnidades: globalUnidades };
  }, [filteredData, filtroBodegas, filtroProductos, filtroTransportadoras, filtroDepartamentos, searchTerm]);

  // Paginación
  const totalResults = processedData.length;
  const totalPages = Math.max(1, Math.ceil(totalResults / rowsPerPage));
  const paginatedData = useMemo(() => {
    const s = (currentPage - 1) * rowsPerPage;
    return processedData.slice(s, s + rowsPerPage);
  }, [processedData, currentPage, rowsPerPage]);

  const toggleCascade = (id: string) => {
    setCascadeOpen(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleExportCSV = () => {
    // Export function logic...
    alert('Exportando negocios...');
  };

  // Renderizador estandarizado de celda financiera (Idéntico a Productos)
  const RenderCell = ({ item, col }: { item: any, col: string }) => {
    const st = item.stats[col];
    if (!st || st.pedidos === 0) return <div className="text-slate-300 font-medium">-</div>;

    return (
      <div className="flex flex-col items-center justify-center">
        <div className="flex items-baseline gap-1.5">
          <span className="font-extrabold text-slate-800 text-sm">{st.pedidos}</span>
          <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded-md">{st.pct}%</span>
        </div>
        {(col === 'Generados' || col === 'Entregados') && (
          <div className="mt-1 pt-1 border-t border-slate-100/80 w-full text-center">
            <span className={`text-[10.5px] font-bold ${st.utilidad < 0 ? 'text-rose-600' : 'text-slate-700'}`}>
              Util: {formatMoney(st.utilidad)}
            </span>
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return <div className="p-8 flex justify-center text-slate-500 font-sans">Cargando base de datos de negocios...</div>;
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 p-6 font-sans relative space-y-5">
      
      {/* 1. CABECERA: TÍTULO Y SELECTOR DE FECHA */}
      <div className="flex justify-between items-end flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Negocios</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Desglose de rentabilidad y efectividad consolidada por Dropshipper
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

      {/* 2. FILTROS CON LA VISUAL EXACTA */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 w-full font-sans">
        <DropdownFiltroMultiple label="Bodega" selected={filtroBodegas} options={availableOptions.bodegas} onChange={setFiltroBodegas} icon={<Store size={13} />} />
        <DropdownFiltroMultiple label="Producto" selected={filtroProductos} options={availableOptions.productos} onChange={setFiltroProductos} icon={<Package size={13} />} />
        <DropdownFiltroMultiple label="Transportadora" selected={filtroTransportadoras} options={availableOptions.transportadoras} onChange={setFiltroTransportadoras} icon={<Truck size={13} />} />
        <DropdownFiltroMultiple label="Departamento" selected={filtroDepartamentos} options={availableOptions.departamentos} onChange={setFiltroDepartamentos} icon={<MapPin size={13} />} />
        <DropdownFiltroMultiple label="Comunidad" selected={filtroComunidades} options={availableOptions.comunidades} onChange={setFiltroComunidades} icon={<Users size={13} />} />
      </div>

      {/* 3. BÚSQUEDA Y BOTONES DE ACCIÓN */}
      <div className="flex items-center gap-3">
        <div className="flex-1 relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Buscar por nombre de negocio o ID..." 
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

      {/* 4. TABLA PRINCIPAL DE ALTA DENSIDAD */}
      <div className="bg-white border border-slate-200/90 rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto max-w-full">
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 text-[10px] font-bold uppercase tracking-wider select-none">
                <th className="py-4 px-4 min-w-[280px]">NEGOCIO / TIENDA <span className="text-[8px] text-slate-400">◆</span></th>
                {['GENERADOS', 'ENTREGADOS', 'POR CONFIRMAR', 'PENDIENTES', 'EN CURSO', 'EN NOVEDAD', 'DEVOLUCIONES'].map(h => (
                  <th key={h} className="py-4 px-4 text-center">
                    {h} <span className="text-[8px] text-slate-400">◆</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
              {paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500">
                    No se encontraron resultados para los filtros seleccionados.
                  </td>
                </tr>
              ) : (
                paginatedData.map((b: any) => (
                  <React.Fragment key={b.id}>
                    {/* Fila Principal: NEGOCIO */}
                    <tr className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <button 
                            onClick={() => toggleCascade(b.id)} 
                            className={`p-1.5 rounded-lg transition-colors shadow-2xs border ${
                              cascadeOpen[b.id] ? 'bg-orange-100 text-orange-600 border-orange-200' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                            }`}
                          >
                            <ChevronDown size={14} className={`transition-transform duration-200 ${cascadeOpen[b.id] ? 'rotate-180' : ''}`} />
                          </button>
                          <div className="leading-tight truncate max-w-[220px]">
                            <p className="font-extrabold text-slate-900 text-[13px] truncate" title={b.name}>{b.name}</p>
                            <p className="text-[10px] text-slate-400 font-mono mt-0.5">ID: {b.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center"><RenderCell item={b} col="Generados" /></td>
                      <td className="py-3 px-4 text-center"><RenderCell item={b} col="Entregados" /></td>
                      <td className="py-3 px-4 text-center"><RenderCell item={b} col="Por Confirmar" /></td>
                      <td className="py-3 px-4 text-center"><RenderCell item={b} col="Pendientes" /></td>
                      <td className="py-3 px-4 text-center"><RenderCell item={b} col="En curso" /></td>
                      <td className="py-3 px-4 text-center"><RenderCell item={b} col="En novedad" /></td>
                      <td className="py-3 px-4 text-center"><RenderCell item={b} col="Devoluciones" /></td>
                    </tr>

                    {/* Cascada de Productos asociados a este Negocio */}
                    {cascadeOpen[b.id] && b.productosList.map((p: any) => (
                      <tr key={p.name} className="bg-slate-50/60 border-t border-slate-100/50 hover:bg-slate-100/60 transition-colors">
                        <td className="py-2.5 px-4 pl-14 flex items-center gap-2">
                          <CornerDownRight size={14} className="text-slate-400 shrink-0" />
                          <Package size={13} className="text-slate-500 shrink-0" />
                          <span className="font-semibold text-slate-700 truncate max-w-[220px]" title={p.name}>{p.name}</span>
                        </td>
                        <td className="py-2.5 px-4 text-center"><RenderCell item={p} col="Generados" /></td>
                        <td className="py-2.5 px-4 text-center"><RenderCell item={p} col="Entregados" /></td>
                        <td className="py-2.5 px-4 text-center"><RenderCell item={p} col="Por Confirmar" /></td>
                        <td className="py-2.5 px-4 text-center"><RenderCell item={p} col="Pendientes" /></td>
                        <td className="py-2.5 px-4 text-center"><RenderCell item={p} col="En curso" /></td>
                        <td className="py-2.5 px-4 text-center"><RenderCell item={p} col="En novedad" /></td>
                        <td className="py-2.5 px-4 text-center"><RenderCell item={p} col="Devoluciones" /></td>
                      </tr>
                    ))}
                  </React.Fragment>
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
            Mostrando {totalResults === 0 ? 0 : Math.min(rowsPerPage, totalResults)} de {totalResults} negocios
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
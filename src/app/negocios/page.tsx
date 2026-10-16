// src/app/negocios/page.tsx
'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  Search, User, Phone, Mail, Store, Package, 
  X, ChevronDown, Check, CornerDownRight, Tag 
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

const formatCurrency = (val: number) => `$ ${Math.round(val).toLocaleString('es-CO')}`;

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

// ==========================================
// 2. COMPONENTE DROPDOWN MÚLTIPLE ESTÁNDAR
// ==========================================
interface DropdownProps {
  label: string;
  selected: string[];
  options: string[];
  onChange: (s: string[]) => void;
  icon?: React.ReactNode;
}

function DropdownFiltroMultiple({ label, selected = [], options = [], onChange, icon }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setIsOpen(false);
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

  return (
    <div className="flex flex-col gap-1 relative w-full font-sans" ref={ref}>
      <label className="text-xs text-slate-500 font-medium ml-1 select-none">{label}</label>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full bg-white border rounded-xl px-3 py-2 text-xs flex items-center justify-between transition-colors shadow-2xs outline-none ${
          isOpen ? 'border-[#ff7e24] ring-2 ring-[#ff7e24]/10' : selected.length > 0 ? 'border-[#ff7e24] text-[#ea580c] font-bold' : 'border-slate-200 text-slate-700'
        }`}
      >
        <div className="flex items-center gap-1.5 truncate">
          {icon && <span className={selected.length > 0 ? 'text-[#ff7e24]' : 'text-slate-400'}>{icon}</span>}
          <span className="truncate">{selected.length > 0 ? selected[0] : '(Todos)'}</span>
          {selected.length > 1 && (
            <span className="px-1.5 py-0.5 rounded-full bg-orange-100 text-[#ff7e24] text-[10px] font-bold">
              +{selected.length - 1}
            </span>
          )}
        </div>
        <ChevronDown size={14} className={`text-slate-400 transition-transform ${isOpen ? 'rotate-180 text-[#ff7e24]' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-[102%] left-0 w-full min-w-[210px] bg-white border border-slate-200 rounded-2xl shadow-xl z-50 py-1 text-xs animate-fadeIn">
          {options.length > 5 && (
            <div className="p-2 border-b border-slate-100">
              <input
                type="text"
                placeholder="Buscar..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full px-2 py-1.5 border border-[#ff7e24] rounded-lg text-xs outline-none focus:ring-1 focus:ring-[#ff7e24]"
                autoFocus
              />
            </div>
          )}
          <div className="flex items-center justify-between px-3 py-1.5 border-b border-slate-100">
            <button type="button" onClick={() => onChange([...options])} className="text-[#ff7e24] font-bold hover:underline">Todos</button>
            <button type="button" onClick={() => onChange([])} className="text-slate-400 hover:text-slate-600">Limpiar</button>
          </div>
          <div className="max-h-56 overflow-y-auto py-1">
            {filteredOpts.map(opt => {
              const isChecked = selected.includes(opt);
              return (
                <div key={opt} onClick={() => toggleOpt(opt)} className="flex items-center gap-2 px-3 py-1.5 hover:bg-slate-50 cursor-pointer">
                  <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center shrink-0 ${isChecked ? 'bg-[#ff7e24] border-[#ff7e24] text-white' : 'border-slate-300'}`}>
                    {isChecked && <Check size={10} strokeWidth={3} />}
                  </div>
                  <span className={`truncate ${isChecked ? 'text-slate-900 font-bold' : 'text-slate-700'}`}>{opt}</span>
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
// 3. PÁGINA PRINCIPAL
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
    searchTerm, setSearchTerm,
    availableOptions
  } = useFiltrosCruzados();

  const [rowsPerPage, setRowsPerPage] = useState(50);
  const [currentPage, setCurrentPage] = useState(1);
  const [cascadeOpen, setCascadeOpen] = useState<Record<string, boolean>>({});

  // 1. Agrupación por Negocios
  const { processedData, globalTotalUnidades } = useMemo(() => {
    const agrupado: Record<string, any> = {};

    filteredData.forEach(order => {
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
  }, [filteredData]);

  const paginatedData = useMemo(() => {
    const s = (currentPage - 1) * rowsPerPage;
    return processedData.slice(s, s + rowsPerPage);
  }, [processedData, currentPage, rowsPerPage]);

  const toggleCascade = (id: string) => {
    setCascadeOpen(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const RenderCell = ({ item, col }: { item: any, col: string }) => {
    const st = item.stats[col];
    if (!st || st.pedidos === 0) return <div className="text-slate-300 font-medium">-</div>;

    return (
      <div className="flex flex-col items-center">
        <span className="font-bold text-slate-800 text-[13px]">{st.pedidos}</span>
        <span className="text-[10px] font-semibold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded mt-0.5">{st.pct}%</span>
        {col === 'Generados' || col === 'Entregados' ? (
          <div className="mt-1 pt-1 border-t border-slate-100 w-full text-center">
            <span className="text-[10px] text-slate-500 font-medium">Utilidad: <strong className="text-slate-800">{formatCurrency(st.utilidad)}</strong></span>
          </div>
        ) : null}
      </div>
    );
  };

  if (loading) return <div className="p-8 text-center text-slate-500">Cargando base de negocios...</div>;

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 p-6 font-sans space-y-5">
      
      {/* CABECERA */}
      <div className="flex justify-between items-end flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Negocios</h1>
          <p className="text-xs text-slate-500">Desglose de rentabilidad por Dropshipper</p>
        </div>
        <FiltroFecha startDate={dateFrom} endDate={dateTo} onApply={(s, e) => { setDateFrom(s); setDateTo(e); }} />
      </div>

      {/* FILTROS EN LÍNEA */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <DropdownFiltroMultiple label="Bodega" selected={selectedBodegas} options={availableOptions.bodegas} onChange={setSelectedBodegas} icon={<Store size={13} />} />
        <DropdownFiltroMultiple label="Producto" selected={selectedProductos} options={availableOptions.productos} onChange={setSelectedProductos} icon={<Package size={13} />} />
        <DropdownFiltroMultiple label="Transportadora" selected={selectedTransportadoras} options={availableOptions.transportadoras} onChange={setSelectedTransportadoras} />
        <DropdownFiltroMultiple label="Departamento" selected={selectedDepartamentos} options={availableOptions.departamentos} onChange={setSelectedDepartamentos} />
      </div>

      {/* BÚSQUEDA */}
      <div className="relative">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input 
          type="text" 
          placeholder="Buscar negocio..." 
          className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs outline-none focus:border-[#ff7e24]"
          value={searchTerm}
          onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }}
        />
      </div>

      {/* TABLA PRINCIPAL */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="py-3 px-4 text-slate-500 font-bold uppercase w-80">NEGOCIO</th>
                {['GENERADOS', 'ENTREGADOS', 'POR CONFIRMAR', 'PENDIENTES', 'EN CURSO', 'EN NOVEDAD', 'DEVOLUCIONES'].map(h => (
                  <th key={h} className="py-3 px-4 text-center text-slate-500 font-bold uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedData.length === 0 ? (
                <tr><td colSpan={8} className="py-8 text-center text-slate-400">Sin negocios.</td></tr>
              ) : (
                paginatedData.map((b: any) => (
                  <React.Fragment key={b.id}>
                    {/* Fila del Negocio */}
                    <tr className="hover:bg-slate-50/50 transition">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <button onClick={() => toggleCascade(b.id)} className={`p-1 rounded-md transition ${cascadeOpen[b.id] ? 'bg-orange-100 text-orange-600' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'}`}>
                            <ChevronDown size={14} className={cascadeOpen[b.id] ? 'rotate-180' : ''} />
                          </button>
                          <div>
                            <p className="font-bold text-slate-900 text-[13px]">{b.name}</p>
                            <p className="text-[10px] text-slate-400 font-mono">ID: {b.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4"><RenderCell item={b} col="Generados" /></td>
                      <td className="py-3 px-4"><RenderCell item={b} col="Entregados" /></td>
                      <td className="py-3 px-4"><RenderCell item={b} col="Por Confirmar" /></td>
                      <td className="py-3 px-4"><RenderCell item={b} col="Pendientes" /></td>
                      <td className="py-3 px-4"><RenderCell item={b} col="En curso" /></td>
                      <td className="py-3 px-4"><RenderCell item={b} col="En novedad" /></td>
                      <td className="py-3 px-4"><RenderCell item={b} col="Devoluciones" /></td>
                    </tr>

                    {/* Cascada de Productos */}
                    {cascadeOpen[b.id] && b.productosList.map((p: any) => (
                      <tr key={p.name} className="bg-slate-50/50 border-t border-slate-50">
                        <td className="py-2.5 px-4 pl-12 flex items-center gap-2">
                          <CornerDownRight size={14} className="text-slate-300" />
                          <Tag size={13} className="text-slate-400" />
                          <span className="font-medium text-slate-600 max-w-[200px] truncate">{p.name}</span>
                        </td>
                        <td className="py-2.5 px-4"><RenderCell item={p} col="Generados" /></td>
                        <td className="py-2.5 px-4"><RenderCell item={p} col="Entregados" /></td>
                        <td className="py-2.5 px-4"><RenderCell item={p} col="Por Confirmar" /></td>
                        <td className="py-2.5 px-4"><RenderCell item={p} col="Pendientes" /></td>
                        <td className="py-2.5 px-4"><RenderCell item={p} col="En curso" /></td>
                        <td className="py-2.5 px-4"><RenderCell item={p} col="En novedad" /></td>
                        <td className="py-2.5 px-4"><RenderCell item={p} col="Devoluciones" /></td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
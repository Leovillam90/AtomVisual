// src/components/filtros/FiltroProductos.tsx
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search, Check, X } from 'lucide-react';
import { PRODUCTS_MASTER_CATALOG } from '@/data/productosData';

export interface FiltroProductosProps {
  selected?: string[]; // Opcional para evitar fallos de lectura (undefined)
  onChange?: (selected: string[]) => void;
  label?: string;
}

export function FiltroProductos({
  selected = [], // Array vacío por defecto
  onChange = () => {},
  label = 'Productos'
}: FiltroProductosProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
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

  const toggleItem = (name: string) => {
    if (selected.includes(name)) {
      onChange(selected.filter((n) => n !== name));
    } else {
      onChange([...selected, name]);
    }
  };

  const selectAll = () => onChange(PRODUCTS_MASTER_CATALOG.map((p) => p.name));
  const clearAll = () => onChange([]);

  // Búsqueda simplificada para buscar solo por nombre de producto
  const filteredProducts = PRODUCTS_MASTER_CATALOG.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-1 relative w-full font-sans" ref={dropdownRef}>
      {label && <span className="text-xs text-slate-500 font-medium ml-1">{label}</span>}

      {/* Botón Trigger del Selector */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full bg-white border rounded-xl px-3.5 py-2 text-xs text-left flex items-center justify-between shadow-xs transition-colors cursor-pointer ${
          isOpen
            ? 'border-orange-500 ring-2 ring-orange-500/10'
            : selected && selected.length > 0
            ? 'border-orange-500 text-orange-600 font-semibold'
            : 'border-slate-200 text-slate-600 hover:border-slate-300'
        }`}
      >
        <div className="flex items-center gap-1.5 truncate">
          <span className="truncate">
            {!selected || selected.length === 0
              ? '(Todos)'
              : selected.length === 1
              ? selected[0]
              : `${selected.length} seleccionados`}
          </span>
          {selected && selected.length > 1 && (
            <span className="px-1.5 py-0.2 rounded-full bg-orange-100 text-orange-600 text-[10px] font-bold">
              {selected.length}
            </span>
          )}
        </div>
        <ChevronDown size={14} className={`text-slate-400 transition-transform ${isOpen ? 'rotate-180 text-orange-500' : ''}`} />
      </button>

      {/* Menú Desplegable */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-1.5 w-80 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 overflow-hidden animate-fadeIn p-2 text-xs font-sans">
          
          {/* Input de Búsqueda */}
          <div className="p-1 mb-1.5">
            <div className="relative">
              <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                autoFocus
                placeholder="Buscar producto..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-7 pr-6 py-1.5 text-xs text-slate-800 placeholder-slate-400 outline-none focus:border-orange-500"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X size={12} />
                </button>
              )}
            </div>
          </div>

          {/* Cabecera del Listado */}
          <div className="flex items-center justify-between pb-1.5 mb-1 border-b border-slate-100 px-1">
            <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
              Catálogo
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={selectAll}
                className="text-[10px] text-orange-600 hover:underline font-semibold cursor-pointer"
              >
                Todos
              </button>
              <button
                type="button"
                onClick={clearAll}
                className="text-[10px] text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                Limpiar
              </button>
            </div>
          </div>

          {/* Lista de Productos Limpia */}
          <div className="space-y-0.5 max-h-60 overflow-y-auto">
            {filteredProducts.length === 0 ? (
              <div className="py-6 text-center text-slate-400 text-xs font-medium">
                No se encontraron productos.
              </div>
            ) : (
              filteredProducts.map((p) => {
                const isChecked = selected ? selected.includes(p.name) : false;
                return (
                  <div
                    key={p.id}
                    onClick={() => toggleItem(p.name)}
                    className={`w-full px-2.5 py-2 rounded-lg flex items-center justify-between cursor-pointer transition-colors ${
                      isChecked ? 'bg-orange-50/80 text-orange-600 font-semibold' : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate mr-2">
                      <div
                        className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors ${
                          isChecked ? 'bg-orange-500 border-orange-500 text-white' : 'border-slate-300 bg-white'
                        }`}
                      >
                        {isChecked && <Check size={12} strokeWidth={3} />}
                      </div>
                      
                      <span className="truncate text-slate-800 text-xs">
                        {p.name}
                      </span>
                    </div>
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

export default FiltroProductos;
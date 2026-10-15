// src/components/filtros/FiltroNegocios.tsx
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search, Check, X, User } from 'lucide-react';
import { BUSINESSES_DIRECTORY } from '@/data/negociosData';

// Excluye ID 187665 (Tienda Aliada)
const DIRECTORY_DISPONIBLE = BUSINESSES_DIRECTORY.filter(
  (b) => b.id !== '187665' && b.tiendaNombre !== 'Tienda Aliada'
);

export interface FiltroNegociosProps {
  selectedIds?: string[];
  onChange?: (ids: string[]) => void;
  label?: string;
}

export function FiltroNegocios({
  selectedIds = [],
  onChange = () => {},
  label = 'Negocio'
}: FiltroNegociosProps) {
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

  const toggleItem = (id: string) => {
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter((i) => i !== id));
    } else {
      onChange([...selectedIds, id]);
    }
  };

  const selectAll = () => onChange(DIRECTORY_DISPONIBLE.map((b) => b.id));
  const clearAll = () => onChange([]);

  // Búsqueda únicamente por el nombre del dueño
  const filteredBusinesses = DIRECTORY_DISPONIBLE.filter((b) =>
    b.nombreTitular.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getSelectedLabel = () => {
    if (!selectedIds || selectedIds.length === 0) return '(Todos)';
    if (selectedIds.length === 1) {
      const match = DIRECTORY_DISPONIBLE.find((b) => b.id === selectedIds[0]);
      return match ? match.nombreTitular : selectedIds[0];
    }
    return `${selectedIds.length} seleccionados`;
  };

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
            : selectedIds && selectedIds.length > 0
            ? 'border-orange-500 text-orange-600 font-semibold'
            : 'border-slate-200 text-slate-600 hover:border-slate-300'
        }`}
      >
        <div className="flex items-center gap-2 truncate">
          <User size={13} className={selectedIds && selectedIds.length > 0 ? 'text-orange-500' : 'text-slate-400'} />
          <span className="truncate">{getSelectedLabel()}</span>
          {selectedIds && selectedIds.length > 1 && (
            <span className="px-1.5 py-0.2 rounded-full bg-orange-100 text-orange-600 text-[10px] font-bold">
              {selectedIds.length}
            </span>
          )}
        </div>
        <ChevronDown 
          size={14} 
          className={`text-slate-400 transition-transform ${isOpen ? 'rotate-180 text-orange-500' : ''}`} 
        />
      </button>

      {/* Menú Desplegable */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-1.5 w-72 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 overflow-hidden animate-fadeIn p-2 text-xs font-sans">
          
          {/* Input de Búsqueda */}
          <div className="p-1 mb-1.5">
            <div className="relative">
              <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                autoFocus
                placeholder="Buscar negocio..."
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
              Negocios
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

          {/* Lista limpia: exclusivamente el nombre del dueño */}
          <div className="space-y-0.5 max-h-60 overflow-y-auto">
            {filteredBusinesses.length === 0 ? (
              <div className="py-6 text-center text-slate-400 text-xs font-medium">
                No se encontraron negocios.
              </div>
            ) : (
              filteredBusinesses.map((b) => {
                const isChecked = selectedIds ? selectedIds.includes(b.id) : false;
                return (
                  <div
                    key={b.id}
                    onClick={() => toggleItem(b.id)}
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
                        {b.nombreTitular}
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

export default FiltroNegocios;
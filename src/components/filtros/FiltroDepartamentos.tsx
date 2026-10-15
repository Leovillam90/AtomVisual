'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, Search, X } from 'lucide-react';
import { DEPARTAMENTOS_LIST } from '@/data/negociosData';

export interface FiltroDepartamentosProps {
  selected: string[];
  onChange: (selected: string[]) => void;
  label?: string;
}

export function FiltroDepartamentos({
  selected,
  onChange,
  label = 'Departamentos'
}: FiltroDepartamentosProps) {
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

  const toggleItem = (item: string) => {
    if (selected.includes(item)) {
      onChange(selected.filter((i) => i !== item));
    } else {
      onChange([...selected, item]);
    }
  };

  const selectAll = () => onChange([...DEPARTAMENTOS_LIST]);
  const clearAll = () => onChange([]);

  const filteredDepts = DEPARTAMENTOS_LIST.filter((d) =>
    d.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-1 relative w-full font-sans" ref={dropdownRef}>
      {label && <span className="text-xs text-slate-500 font-medium ml-1">{label}</span>}

      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full bg-white border rounded-xl px-3.5 py-2 text-xs text-left flex items-center justify-between shadow-sm transition-colors ${
          isOpen
            ? 'border-orange-500 ring-2 ring-orange-500/10'
            : selected.length > 0
            ? 'border-orange-500 text-orange-600 font-semibold'
            : 'border-slate-200 text-slate-600 hover:border-slate-300'
        }`}
      >
        <div className="flex items-center gap-1.5 truncate">
          <span className="truncate">
            {selected.length === 0
              ? '(Todos)'
              : selected.length === 1
              ? selected[0]
              : `${selected.length} seleccionados`}
          </span>
          {selected.length > 1 && (
            <span className="px-1.5 py-0.2 rounded-full bg-orange-100 text-orange-600 text-[10px] font-bold">
              {selected.length}
            </span>
          )}
        </div>
        <ChevronDown size={14} className={`text-slate-400 transition-transform ${isOpen ? 'rotate-180 text-orange-500' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1.5 w-72 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 overflow-hidden animate-fadeIn p-2 text-xs font-sans">
          {/* Buscador de Departamentos */}
          <div className="p-1 mb-1.5">
            <div className="relative">
              <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                autoFocus
                placeholder="Buscar departamento..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-7 pr-6 py-1.5 text-xs text-slate-800 placeholder-slate-400 outline-none focus:border-orange-500"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X size={12} />
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between pb-1.5 mb-1 border-b border-slate-100 px-1">
            <span className="text-[11px] text-slate-400 font-medium">Departamentos</span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={selectAll}
                className="text-[10px] text-orange-600 hover:underline font-semibold"
              >
                Todos
              </button>
              <button
                type="button"
                onClick={clearAll}
                className="text-[10px] text-slate-400 hover:text-slate-600"
              >
                Limpiar
              </button>
            </div>
          </div>

          <div className="space-y-1 max-h-56 overflow-y-auto">
            {filteredDepts.map((item) => {
              const isChecked = selected.includes(item);
              return (
                <div
                  key={item}
                  onClick={() => toggleItem(item)}
                  className={`w-full px-2.5 py-1.5 rounded-lg flex items-center justify-between cursor-pointer transition-colors ${
                    isChecked ? 'bg-orange-50/80 text-orange-600 font-semibold' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                        isChecked ? 'bg-orange-500 border-orange-500 text-white' : 'border-slate-300 bg-white'
                      }`}
                    >
                      {isChecked && <Check size={12} strokeWidth={3} />}
                    </div>
                    <span>{item}</span>
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

export default FiltroDepartamentos;
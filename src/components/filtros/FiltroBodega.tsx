'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, X } from 'lucide-react';
import { BODEGAS_LIST } from '@/data/negociosData';

export interface FiltroBodegaProps {
  selected: string[];
  onChange: (selected: string[]) => void;
  label?: string;
}

export function FiltroBodega({
  selected,
  onChange,
  label = 'Bodega'
}: FiltroBodegaProps) {
  const [isOpen, setIsOpen] = useState(false);
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

  const selectAll = () => onChange([...BODEGAS_LIST]);
  const clearAll = () => onChange([]);

  return (
    <div className="flex flex-col gap-1 relative w-full font-sans" ref={dropdownRef}>
      {label && <span className="text-xs text-slate-500 font-medium ml-1">{label}</span>}

      {/* Botón Trigger en Blanco Dropi */}
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
              : `${selected.length} seleccionadas`}
          </span>
          {selected.length > 1 && (
            <span className="px-1.5 py-0.2 rounded-full bg-orange-100 text-orange-600 text-[10px] font-bold">
              {selected.length}
            </span>
          )}
        </div>
        <ChevronDown size={14} className={`text-slate-400 transition-transform ${isOpen ? 'rotate-180 text-orange-500' : ''}`} />
      </button>

      {/* Menú Flotante con Checkboxes */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-1.5 w-64 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 overflow-hidden animate-fadeIn p-2 text-xs font-sans">
          <div className="flex items-center justify-between pb-2 mb-1 border-b border-slate-100 px-1">
            <span className="text-[11px] text-slate-400 font-medium">Opciones</span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={selectAll}
                className="text-[10px] text-orange-600 hover:underline font-semibold"
              >
                Todas
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
            {BODEGAS_LIST.map((item) => {
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

export default FiltroBodega;
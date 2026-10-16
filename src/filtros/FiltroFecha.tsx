// src/filtros/FiltroFecha.tsx
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { X, ChevronLeft, ChevronRight, ArrowRight, Calendar } from 'lucide-react';

export interface FiltroFechaProps {
  startDate: string; // Formato YYYY-MM-DD
  endDate: string;   // Formato YYYY-MM-DD
  onApply: (start: string, end: string) => void;
  label?: string;
}

const MONTH_NAMES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

export function FiltroFecha({
  startDate,
  endDate,
  onApply,
  label = 'Fecha'
}: FiltroFechaProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [viewYear, setViewYear] = useState(2026);
  const [viewMonth, setViewMonth] = useState(9); // Octubre (0-indexed)

  const [tempStart, setTempStart] = useState<string>(startDate);
  const [tempEnd, setTempEnd] = useState<string>(endDate);
  const [selectingStep, setSelectingStep] = useState<'start' | 'end'>('start');

  const [inputDesde, setInputDesde] = useState('');
  const [inputHasta, setInputHasta] = useState('');
  const [inputText, setInputText] = useState<string>('');
  const wrapperRef = useRef<HTMLDivElement>(null);

  const getDisplayValue = (isoStr: string) => {
    if (!isoStr) return '';
    const [y, m, d] = isoStr.split('-');
    if (!y || !m || !d) return '';
    return `${d}/${m}/${y}`;
  };

  const formatDisplayDate = (isoStr: string) => {
    return getDisplayValue(isoStr) || '--/--/----';
  };

  const parseManualDate = (text: string) => {
    const parts = text.split('/');
    if (parts.length === 3 && parts[0].length === 2 && parts[1].length === 2 && parts[2].length === 4) {
      return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
    return null;
  };

  useEffect(() => {
    if (isOpen) {
      setTempStart(startDate);
      setTempEnd(endDate);
      setInputDesde(getDisplayValue(startDate));
      setInputHasta(getDisplayValue(endDate));
      
      const parsed = new Date(startDate);
      if (!isNaN(parsed.getTime())) {
        setViewYear(parsed.getFullYear());
        setViewMonth(parsed.getMonth());
      }
    }
    if (startDate && endDate) {
      setInputText(`${formatDisplayDate(startDate)} - ${formatDisplayDate(endDate)}`);
    }
  }, [isOpen, startDate, endDate]);

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(viewYear, viewMonth, 1).getDay();
  const offsetDays = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;

  const handlePrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((prev) => prev - 1);
    } else {
      setViewMonth((prev) => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((prev) => prev + 1);
    } else {
      setViewMonth((prev) => prev + 1);
    }
  };

  const handleDayClick = (day: number) => {
    const formattedDay = String(day).padStart(2, '0');
    const formattedMonth = String(viewMonth + 1).padStart(2, '0');
    const clickedDate = `${viewYear}-${formattedMonth}-${formattedDay}`;

    if (selectingStep === 'start') {
      setTempStart(clickedDate);
      setInputDesde(getDisplayValue(clickedDate));
      setTempEnd('');
      setInputHasta('');
      setSelectingStep('end');
    } else {
      if (new Date(clickedDate) < new Date(tempStart)) {
        setTempStart(clickedDate);
        setInputDesde(getDisplayValue(clickedDate));
        setTempEnd('');
        setInputHasta('');
        setSelectingStep('end');
      } else {
        setTempEnd(clickedDate);
        setInputHasta(getDisplayValue(clickedDate));
        setSelectingStep('start');
      }
    }
  };

  const handleBlurDesde = () => {
    const parsed = parseManualDate(inputDesde);
    if (parsed && !isNaN(new Date(parsed).getTime())) {
      setTempStart(parsed);
      const d = new Date(parsed);
      setViewYear(d.getFullYear());
      setViewMonth(d.getMonth());
      
      if (tempEnd && new Date(parsed) > new Date(tempEnd)) {
        setTempEnd('');
        setInputHasta('');
        setSelectingStep('end');
      }
    } else {
      setInputDesde(getDisplayValue(tempStart));
    }
  };

  const handleBlurHasta = () => {
    const parsed = parseManualDate(inputHasta);
    if (parsed && !isNaN(new Date(parsed).getTime())) {
      if (tempStart && new Date(parsed) < new Date(tempStart)) {
        setInputHasta(getDisplayValue(tempEnd));
      } else {
        setTempEnd(parsed);
        const d = new Date(parsed);
        setViewYear(d.getFullYear());
        setViewMonth(d.getMonth());
      }
    } else {
      setInputHasta(getDisplayValue(tempEnd));
    }
  };

  const handleConfirm = () => {
    if (tempStart && tempEnd) {
      onApply(tempStart, tempEnd);
    } else if (tempStart && !tempEnd) {
      onApply(tempStart, tempStart);
    }
    setIsOpen(false);
  };

  const handleInputBlurOrEnter = () => {
    const textDates = inputText.split('-').map(s => s.trim());
    if (textDates.length === 2) {
      const start = parseManualDate(textDates[0]);
      const end = parseManualDate(textDates[1]);
      if (start && end) {
        onApply(start, end);
        return;
      }
    }
    if (startDate && endDate) {
      setInputText(`${formatDisplayDate(startDate)} - ${formatDisplayDate(endDate)}`);
    }
  };

  return (
    <div className="relative inline-block text-left font-sans shrink-0" ref={wrapperRef}>
      <div className="flex flex-col items-end gap-1">
        {label && <span className="text-[11px] text-slate-400 font-medium mr-1">{label}</span>}
        <div 
          className="bg-white border border-slate-200 hover:border-slate-300 focus-within:border-orange-500 focus-within:ring-2 focus-within:ring-orange-500/10 rounded-xl px-3.5 py-1.5 shadow-2xs flex items-center gap-2.5 transition-all w-60"
        >
          <Calendar size={14} className="text-slate-400 shrink-0 cursor-pointer" onClick={() => setIsOpen(!isOpen)} />
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onFocus={() => setIsOpen(true)}
            onBlur={handleInputBlurOrEnter}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleInputBlurOrEnter();
                setIsOpen(false);
              }
            }}
            className="w-full text-xs text-slate-700 font-medium outline-none bg-transparent"
            placeholder="DD/MM/YYYY - DD/MM/YYYY"
          />
        </div>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white text-slate-800 border border-slate-100 rounded-3xl p-7 w-full max-w-[420px] shadow-2xl relative animate-fadeIn">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-base font-bold text-slate-900 tracking-tight">
                Seleccionar rango de fechas
              </h2>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex items-center gap-3 mb-6">
              <div
                onClick={() => setSelectingStep('start')}
                className={`flex-1 rounded-2xl px-4 py-2.5 transition-all cursor-text flex flex-col ${
                  selectingStep === 'start'
                    ? 'border-2 border-orange-500 bg-white shadow-sm ring-2 ring-orange-500/20'
                    : 'border border-slate-200 bg-slate-50'
                }`}
              >
                <span className="block text-[10px] tracking-wider uppercase font-semibold text-slate-400 mb-0.5">
                  Desde
                </span>
                <input
                  type="text"
                  value={inputDesde}
                  onChange={(e) => setInputDesde(e.target.value)}
                  onBlur={handleBlurDesde}
                  onKeyDown={(e) => e.key === 'Enter' && handleBlurDesde()}
                  placeholder="DD/MM/YYYY"
                  maxLength={10}
                  className="w-full text-sm font-bold text-slate-800 bg-transparent outline-none placeholder-slate-300"
                />
              </div>

              <ArrowRight size={18} className="text-slate-300 shrink-0" />

              <div
                onClick={() => setSelectingStep('end')}
                className={`flex-1 rounded-2xl px-4 py-2.5 transition-all cursor-text flex flex-col ${
                  selectingStep === 'end'
                    ? 'border-2 border-orange-500 bg-white shadow-sm ring-2 ring-orange-500/20'
                    : 'border border-slate-200 bg-slate-50'
                }`}
              >
                <span className="block text-[10px] tracking-wider uppercase font-semibold text-slate-400 mb-0.5">
                  Hasta
                </span>
                <input
                  type="text"
                  value={inputHasta}
                  onChange={(e) => setInputHasta(e.target.value)}
                  onBlur={handleBlurHasta}
                  onKeyDown={(e) => e.key === 'Enter' && handleBlurHasta()}
                  placeholder="DD/MM/YYYY"
                  maxLength={10}
                  className="w-full text-sm font-bold text-slate-800 bg-transparent outline-none placeholder-slate-300"
                />
              </div>
            </div>

            <div className="flex items-center justify-between mb-4 px-2">
              <button
                type="button"
                onClick={handlePrevMonth}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <ChevronLeft size={18} />
              </button>

              <span className="text-sm font-bold text-slate-800">
                {MONTH_NAMES[viewMonth]} {viewYear}
              </span>

              <button
                type="button"
                onClick={handleNextMonth}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <ChevronRight size={18} />
              </button>
            </div>

            <div className="grid grid-cols-7 gap-1 text-center text-xs text-slate-400 mb-2 font-medium">
              {['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa', 'Do'].map((d) => (
                <div key={d} className="py-1">{d}</div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1.5 mb-7">
              {Array.from({ length: offsetDays }).map((_, i) => (
                <div key={`empty-${i}`} className="h-9" />
              ))}

              {Array.from({ length: daysInMonth }).map((_, i) => {
                const dayNum = i + 1;
                const currentIso = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
                
                const isStart = currentIso === tempStart;
                const isEnd = currentIso === tempEnd;
                const isInRange = tempStart && tempEnd && currentIso > tempStart && currentIso < tempEnd;

                let cellClass = 'bg-[#f1f5f9]/70 text-slate-700 hover:bg-slate-200/80 cursor-pointer';

                if (isStart || isEnd) {
                  cellClass = 'bg-orange-500 text-white font-bold shadow-md shadow-orange-500/30 rounded-lg cursor-pointer';
                } else if (isInRange) {
                  cellClass = 'bg-orange-100 text-orange-900 font-semibold rounded-none cursor-pointer';
                }

                return (
                  <button
                    key={dayNum}
                    type="button"
                    onClick={() => handleDayClick(dayNum)}
                    className={`h-9 w-full rounded-lg text-xs flex items-center justify-center transition-all ${cellClass}`}
                  >
                    {dayNum}
                  </button>
                );
              })}
            </div>

            <div className="flex justify-end items-center gap-3">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-semibold transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                className="px-6 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold transition-all shadow-lg shadow-orange-500/25 cursor-pointer"
              >
                Aplicar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default FiltroFecha;
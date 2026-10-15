'use client';

import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';

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
  const [viewMonth, setViewMonth] = useState(9); // Octubre 2026

  const [tempStart, setTempStart] = useState<string>(startDate);
  const [tempEnd, setTempEnd] = useState<string>(endDate);
  const [selectingStep, setSelectingStep] = useState<'start' | 'end'>('start');

  useEffect(() => {
    if (isOpen) {
      setTempStart(startDate);
      setTempEnd(endDate);
      const parsed = new Date(startDate);
      if (!isNaN(parsed.getTime())) {
        setViewYear(parsed.getFullYear());
        setViewMonth(parsed.getMonth());
      }
    }
  }, [isOpen, startDate, endDate]);

  const formatDisplayDate = (isoStr: string) => {
    if (!isoStr) return '--/--/----';
    const [y, m, d] = isoStr.split('-');
    return `${d}/${m}/${y}`;
  };

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(viewYear, viewMonth + 1, 1).getDay();
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
      setTempEnd('');
      setSelectingStep('end');
    } else {
      if (new Date(clickedDate) < new Date(tempStart)) {
        setTempStart(clickedDate);
        setTempEnd('');
        setSelectingStep('end');
      } else {
        setTempEnd(clickedDate);
        setSelectingStep('start');
      }
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

  return (
    <div className="relative inline-block text-left font-sans">
      {/* Caja de fecha exacta de la captura */}
      <div className="flex flex-col items-start gap-1">
        {label && <span className="text-xs text-slate-500 font-normal ml-0.5">{label}</span>}
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="bg-white border border-slate-300 hover:border-slate-400 rounded-xl px-4 py-2 text-[13px] text-slate-800 shadow-sm transition-colors focus:outline-none min-w-[210px] text-center"
        >
          {formatDisplayDate(startDate)} - {formatDisplayDate(endDate)}
        </button>
      </div>

      {/* Modal flotante */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="bg-white text-slate-800 border border-slate-100 rounded-3xl p-7 w-full max-w-[410px] shadow-2xl relative animate-fadeIn">
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

            <div className="flex items-center gap-2.5 mb-6">
              <div
                className={`flex-1 rounded-2xl px-4 py-2.5 transition-all ${
                  selectingStep === 'start'
                    ? 'border-2 border-orange-500 bg-white shadow-sm ring-2 ring-orange-500/20'
                    : 'border border-slate-200 bg-slate-50'
                }`}
              >
                <span className="block text-[10px] tracking-wider uppercase font-semibold text-slate-400 mb-0.5">
                  Desde
                </span>
                <span className="text-sm font-bold text-slate-800">
                  {formatDisplayDate(tempStart)}
                </span>
              </div>

              <ArrowRight size={18} className="text-slate-300 shrink-0" />

              <div
                className={`flex-1 rounded-2xl px-4 py-2.5 transition-all ${
                  selectingStep === 'end'
                    ? 'border-2 border-orange-500 bg-white shadow-sm ring-2 ring-orange-500/20'
                    : 'border border-slate-200 bg-slate-50'
                }`}
              >
                <span className="block text-[10px] tracking-wider uppercase font-semibold text-slate-400 mb-0.5">
                  Hasta
                </span>
                <span className="text-sm font-bold text-slate-800">
                  {formatDisplayDate(tempEnd || tempStart)}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between mb-4 px-2">
              <button
                type="button"
                onClick={handlePrevMonth}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
              >
                <ChevronLeft size={18} />
              </button>

              <span className="text-sm font-bold text-slate-800">
                {MONTH_NAMES[viewMonth]} {viewYear}
              </span>

              <button
                type="button"
                onClick={handleNextMonth}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
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

                let cellClass = 'bg-[#f1f5f9]/70 text-slate-700 hover:bg-slate-200/80';

                if (isStart || isEnd) {
                  cellClass = 'bg-orange-500 text-white font-bold shadow-md shadow-orange-500/30 rounded-lg';
                } else if (isInRange) {
                  cellClass = 'bg-orange-100 text-orange-900 font-semibold rounded-none';
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
                className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-semibold transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                className="px-6 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold transition-all shadow-lg shadow-orange-500/25"
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
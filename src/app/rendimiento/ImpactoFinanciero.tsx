// src/app/eficiencia/ImpactoFinanciero.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  AlertTriangle, 
  DollarSign, 
  RotateCcw, 
  Lock, 
  XCircle, 
  HelpCircle, 
  X 
} from 'lucide-react';

export interface ImpactoFinancieroData {
  utilidadProtegida: number;
  utilidadEnRiesgo: number;
  recaudoProveedor: number;
  capitalRecuperado: number;
  capitalBloqueado: number;
  capitalPerdido: number;
}

interface ImpactoFinancieroProps {
  data: ImpactoFinancieroData;
  formatMoney: (v: number) => string;
}

export default function ImpactoFinanciero({ data, formatMoney }: ImpactoFinancieroProps) {
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  // Cerrar tooltip automáticamente al hacer clic en cualquier parte fuera
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.impacto-tooltip-container')) {
        setActiveTooltip(null);
      }
    };

    if (activeTooltip) {
      document.addEventListener('click', handleClickOutside);
    }
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [activeTooltip]);

  const toggleTooltip = (key: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveTooltip((prev) => (prev === key ? null : key));
  };

  return (
    <section className="space-y-3.5 font-sans w-full">
      
      {/* CABECERA */}
      <div>
        <h2 className="text-xl font-black text-slate-900 tracking-tight">
          Impacto financiero
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Capital protegido, en riesgo y por recuperar
        </p>
      </div>

      <div className="space-y-4">
        
        {/* FILA SUPERIOR: 2 TARJETAS DESTACADAS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
          
          {/* CARD 1: UTILIDAD PROTEGIDA (RECAUDO ENTREGADOS + CAPITAL RECUPERADO BODEGA SÍ) */}
          <div 
            className="bg-white border p-5 shadow-xs flex flex-col justify-between space-y-3.5 hover:border-slate-300 transition-colors relative"
            style={{ 
              borderRadius: '22px',
              borderColor: '#E2E8F0',
              backgroundColor: '#FFFFFF'
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div 
                  className="w-9 h-9 border flex items-center justify-center shrink-0"
                  style={{
                    borderRadius: '12px',
                    backgroundColor: '#FFF7ED',
                    borderColor: '#FFEDD5',
                  }}
                >
                  <ShieldCheck size={17} strokeWidth={2.2} color="#F97316" />
                </div>
                <span 
                  className="text-[10.5px] font-bold tracking-wider uppercase"
                  style={{ color: '#64748B' }}
                >
                  UTILIDAD PROTEGIDA
                </span>
              </div>

              {/* TOOLTIP INTERACTIVO */}
              <div className="relative impacto-tooltip-container">
                <button
                  type="button"
                  onClick={(e) => toggleTooltip('protegida', e)}
                  className="p-1 rounded-full transition-colors cursor-pointer"
                  style={{
                    backgroundColor: activeTooltip === 'protegida' ? '#FFEDD5' : 'transparent',
                    color: activeTooltip === 'protegida' ? '#EA580C' : '#94A3B8'
                  }}
                  title="Clic para ver explicación y cálculo"
                >
                  <HelpCircle size={16} strokeWidth={2.2} />
                </button>

                {activeTooltip === 'protegida' && (
                  <div 
                    className="animate-fade-in text-left"
                    style={{
                      position: 'absolute',
                      top: 'calc(100% + 10px)',
                      left: '0px',
                      right: 'auto',
                      width: '295px',
                      maxWidth: 'calc(100vw - 40px)',
                      backgroundColor: '#FFFFFF',
                      borderRadius: '20px',
                      padding: '16px',
                      boxShadow: '0 20px 40px -8px rgba(234, 88, 12, 0.15), 0 10px 20px -6px rgba(0, 0, 0, 0.08)',
                      border: '1px solid #FED7AA',
                      zIndex: 60
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span 
                        className="text-xs font-black px-2.5 py-1 rounded-lg flex items-center gap-1.5"
                        style={{ backgroundColor: '#FFF7ED', color: '#EA580C', border: '1px solid #FFEDD5' }}
                      >
                        <span>🛡️</span> Utilidad Protegida
                      </span>
                      <button
                        type="button"
                        onClick={() => setActiveTooltip(null)}
                        className="p-1 rounded-md text-slate-400 hover:text-slate-800 transition-colors cursor-pointer"
                      >
                        <X size={14} />
                      </button>
                    </div>
                    <p className="text-[11.5px] text-slate-600 leading-snug mb-3 font-normal">
                      Monto total de capital blindado y asegurado de la operación.
                    </p>
                    <div 
                      className="p-2.5 rounded-xl text-[11px] leading-relaxed"
                      style={{ backgroundColor: '#FFF7ED', border: '1px solid #FFEDD5', color: '#7C2D12' }}
                    >
                      <span className="font-extrabold text-[#EA580C]">Fórmula: </span>
                      Recaudo Proveedor (Entregados) + Capital Recuperado (Bodega SÍ).
                    </div>
                    <div 
                      style={{
                        position: 'absolute',
                        top: '-6px',
                        left: '9px',
                        width: '10px',
                        height: '10px',
                        backgroundColor: '#FFFFFF',
                        borderLeft: '1px solid #FED7AA',
                        borderTop: '1px solid #FED7AA',
                        transform: 'rotate(45deg)'
                      }} 
                    />
                  </div>
                )}
              </div>
            </div>

            <div>
              <p 
                className="text-3xl lg:text-[36px] font-black tracking-tight leading-none"
                style={{ color: '#FA7C16' }}
              >
                {formatMoney(data.utilidadProtegida)}
              </p>
            </div>

            <p 
              className="text-xs font-normal"
              style={{ color: '#94A3B8' }}
            >
              Recaudo entregados + devoluciones en bodega
            </p>
          </div>

          {/* CARD 2: UTILIDAD EN RIESGO (ROJO SIMBÓLICO - ABRE A LA IZQUIERDA) */}
          <div 
            className="bg-white border p-5 shadow-xs flex flex-col justify-between space-y-3.5 hover:border-slate-300 transition-colors relative"
            style={{ 
              borderRadius: '22px',
              borderColor: '#E2E8F0',
              backgroundColor: '#FFFFFF'
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div 
                  className="w-9 h-9 border flex items-center justify-center shrink-0"
                  style={{
                    borderRadius: '12px',
                    backgroundColor: '#FEF2F2',
                    borderColor: '#FEE2E2',
                  }}
                >
                  <AlertTriangle size={17} strokeWidth={2.2} color="#EF4444" />
                </div>
                <span 
                  className="text-[10.5px] font-bold tracking-wider uppercase"
                  style={{ color: '#64748B' }}
                >
                  UTILIDAD EN RIESGO
                </span>
              </div>

              <div className="relative impacto-tooltip-container">
                <button
                  type="button"
                  onClick={(e) => toggleTooltip('enRiesgo', e)}
                  className="p-1 rounded-full transition-colors cursor-pointer"
                  style={{
                    backgroundColor: activeTooltip === 'enRiesgo' ? '#FEE2E2' : 'transparent',
                    color: activeTooltip === 'enRiesgo' ? '#EF4444' : '#94A3B8'
                  }}
                  title="Clic para ver explicación y cálculo"
                >
                  <HelpCircle size={16} strokeWidth={2.2} />
                </button>

                {activeTooltip === 'enRiesgo' && (
                  <div 
                    className="animate-fade-in text-left"
                    style={{
                      position: 'absolute',
                      top: 'calc(100% + 10px)',
                      right: '0px',
                      left: 'auto',
                      width: '280px',
                      maxWidth: 'calc(100vw - 40px)',
                      backgroundColor: '#FFFFFF',
                      borderRadius: '20px',
                      padding: '16px',
                      boxShadow: '0 20px 40px -8px rgba(239, 68, 68, 0.15), 0 10px 20px -6px rgba(0, 0, 0, 0.08)',
                      border: '1px solid #FECACA',
                      zIndex: 60
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span 
                        className="text-xs font-black px-2.5 py-1 rounded-lg flex items-center gap-1.5"
                        style={{ backgroundColor: '#FEF2F2', color: '#DC2626', border: '1px solid #FEE2E2' }}
                      >
                        <span>⚠️</span> Utilidad en Riesgo
                      </span>
                      <button
                        type="button"
                        onClick={() => setActiveTooltip(null)}
                        className="p-1 rounded-md text-slate-400 hover:text-slate-800 transition-colors cursor-pointer"
                      >
                        <X size={14} />
                      </button>
                    </div>
                    <p className="text-[11.5px] text-slate-600 leading-snug mb-3 font-normal">
                      Ganancia comprometida que podría perderse si las novedades o devoluciones no se gestionan a tiempo.
                    </p>
                    <div 
                      className="p-2.5 rounded-xl text-[11px] leading-relaxed"
                      style={{ backgroundColor: '#FEF2F2', border: '1px solid #FEE2E2', color: '#991B1B' }}
                    >
                      <span className="font-extrabold text-[#EF4444]">Cálculo: </span>
                      Utilidad de órdenes estancadas &ge; 3D + novedades no resueltas + devoluciones pendientes de bodega.
                    </div>
                    <div 
                      style={{
                        position: 'absolute',
                        top: '-6px',
                        right: '9px',
                        width: '10px',
                        height: '10px',
                        backgroundColor: '#FFFFFF',
                        borderLeft: '1px solid #FECACA',
                        borderTop: '1px solid #FECACA',
                        transform: 'rotate(45deg)'
                      }} 
                    />
                  </div>
                )}
              </div>
            </div>

            <div>
              <p 
                className="text-3xl lg:text-[36px] font-black tracking-tight leading-none"
                style={{ color: '#EF4444' }}
              >
                {formatMoney(data.utilidadEnRiesgo)}
              </p>
            </div>

            <p 
              className="text-xs font-normal"
              style={{ color: '#94A3B8' }}
            >
              Curso &ge; 3 días · novedades sin gestión · devoluciones no recibidas
            </p>
          </div>

        </div>

        {/* FILA INFERIOR: 4 TARJETAS DE CAPITAL */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 w-full">
          
          {/* CARD 3: RECAUDO PROVEEDOR (ENTREGADOS - NARANJA) */}
          <div 
            className="bg-white border p-5 shadow-xs flex flex-col justify-between space-y-3 hover:border-slate-300 transition-colors relative"
            style={{ 
              borderRadius: '22px',
              borderColor: '#E2E8F0',
              backgroundColor: '#FFFFFF'
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div 
                  className="w-9 h-9 border flex items-center justify-center shrink-0"
                  style={{
                    borderRadius: '12px',
                    backgroundColor: '#FFF7ED',
                    borderColor: '#FFEDD5',
                  }}
                >
                  <DollarSign size={17} strokeWidth={2.2} color="#F97316" />
                </div>
                <span 
                  className="text-[10.5px] font-bold tracking-wider uppercase truncate"
                  style={{ color: '#64748B' }}
                >
                  RECAUDO PROVEEDOR
                </span>
              </div>

              <div className="relative impacto-tooltip-container">
                <button
                  type="button"
                  onClick={(e) => toggleTooltip('recaudo', e)}
                  className="p-1 rounded-full transition-colors cursor-pointer"
                  style={{
                    backgroundColor: activeTooltip === 'recaudo' ? '#FFEDD5' : 'transparent',
                    color: activeTooltip === 'recaudo' ? '#EA580C' : '#94A3B8'
                  }}
                  title="Clic para ver explicación y cálculo"
                >
                  <HelpCircle size={16} strokeWidth={2.2} />
                </button>

                {activeTooltip === 'recaudo' && (
                  <div 
                    className="animate-fade-in text-left"
                    style={{
                      position: 'absolute',
                      top: 'calc(100% + 10px)',
                      left: '0px',
                      right: 'auto',
                      width: '280px',
                      maxWidth: 'calc(100vw - 40px)',
                      backgroundColor: '#FFFFFF',
                      borderRadius: '20px',
                      padding: '16px',
                      boxShadow: '0 20px 40px -8px rgba(234, 88, 12, 0.15)',
                      border: '1px solid #FED7AA',
                      zIndex: 60
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span 
                        className="text-xs font-black px-2.5 py-1 rounded-lg flex items-center gap-1.5" 
                        style={{ backgroundColor: '#FFF7ED', color: '#EA580C', border: '1px solid #FFEDD5' }}
                      >
                        <span>💵</span> Recaudo Proveedor
                      </span>
                      <button type="button" onClick={() => setActiveTooltip(null)} className="text-slate-400 hover:text-slate-800"><X size={14} /></button>
                    </div>
                    <p className="text-[11.5px] text-slate-600 mb-2.5">Monto total pagado y cobrado de pedidos entregados.</p>
                    <div className="p-2.5 rounded-xl text-[11px]" style={{ backgroundColor: '#FFF7ED', border: '1px solid #FFEDD5', color: '#7C2D12' }}>
                      <span className="font-extrabold text-[#EA580C]">Fórmula: </span>Suma de Recaudo Proveedor de órdenes con estado <strong className="text-[#EA580C]">ENTREGADO</strong> o <strong className="text-[#EA580C]">FINALIZADO</strong>.
                    </div>
                    <div style={{ position: 'absolute', top: '-6px', left: '9px', width: '10px', height: '10px', backgroundColor: '#FFFFFF', borderLeft: '1px solid #FED7AA', borderTop: '1px solid #FED7AA', transform: 'rotate(45deg)' }} />
                  </div>
                )}
              </div>
            </div>

            <div>
              <p 
                className="text-2xl lg:text-[27px] font-black tracking-tight leading-none truncate" 
                style={{ color: '#FA7C16' }}
              >
                {formatMoney(data.recaudoProveedor)}
              </p>
            </div>

            <p className="text-xs font-normal" style={{ color: '#94A3B8' }}>Pedidos entregados</p>
          </div>

          {/* CARD 4: CAPITAL RECUPERADO (DEVOLUCIÓN EN BODEGA SÍ - NARANJA) */}
          <div 
            className="bg-white border p-5 shadow-xs flex flex-col justify-between space-y-3 hover:border-slate-300 transition-colors relative"
            style={{ 
              borderRadius: '22px',
              borderColor: '#E2E8F0',
              backgroundColor: '#FFFFFF'
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div 
                  className="w-9 h-9 border flex items-center justify-center shrink-0"
                  style={{
                    borderRadius: '12px',
                    backgroundColor: '#FFF7ED',
                    borderColor: '#FFEDD5',
                  }}
                >
                  <RotateCcw size={17} strokeWidth={2.2} color="#F97316" />
                </div>
                <span 
                  className="text-[10.5px] font-bold tracking-wider uppercase truncate"
                  style={{ color: '#64748B' }}
                >
                  CAPITAL RECUPERADO
                </span>
              </div>

              <div className="relative impacto-tooltip-container">
                <button
                  type="button"
                  onClick={(e) => toggleTooltip('recuperado', e)}
                  className="p-1 rounded-full transition-colors cursor-pointer"
                  style={{
                    backgroundColor: activeTooltip === 'recuperado' ? '#FFEDD5' : 'transparent',
                    color: activeTooltip === 'recuperado' ? '#EA580C' : '#94A3B8'
                  }}
                  title="Clic para ver explicación y cálculo"
                >
                  <HelpCircle size={16} strokeWidth={2.2} />
                </button>

                {activeTooltip === 'recuperado' && (
                  <div 
                    className="animate-fade-in text-left"
                    style={{
                      position: 'absolute',
                      top: 'calc(100% + 10px)',
                      left: '0px',
                      right: 'auto',
                      width: '285px',
                      maxWidth: 'calc(100vw - 40px)',
                      backgroundColor: '#FFFFFF',
                      borderRadius: '20px',
                      padding: '16px',
                      boxShadow: '0 20px 40px -8px rgba(234, 88, 12, 0.15)',
                      border: '1px solid #FED7AA',
                      zIndex: 60
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span 
                        className="text-xs font-black px-2.5 py-1 rounded-lg flex items-center gap-1.5" 
                        style={{ backgroundColor: '#FFF7ED', color: '#EA580C', border: '1px solid #FFEDD5' }}
                      >
                        <span>🔄</span> Capital Recuperado
                      </span>
                      <button type="button" onClick={() => setActiveTooltip(null)} className="text-slate-400 hover:text-slate-800"><X size={14} /></button>
                    </div>
                    <p className="text-[11.5px] text-slate-600 mb-2.5">Valor de recaudo de mercancía devuelta que reingresó físicamente a bodega.</p>
                    <div className="p-2.5 rounded-xl text-[11px]" style={{ backgroundColor: '#FFF7ED', border: '1px solid #FFEDD5', color: '#7C2D12' }}>
                      <span className="font-extrabold text-[#EA580C]">Fórmula: </span>Suma de Recaudo Proveedor de órdenes en <strong className="text-[#EA580C]">DEVOLUCIÓN</strong> con Devolución a bodega = <strong className="text-[#EA580C]">'SÍ'</strong>.
                    </div>
                    <div style={{ position: 'absolute', top: '-6px', left: '9px', width: '10px', height: '10px', backgroundColor: '#FFFFFF', borderLeft: '1px solid #FED7AA', borderTop: '1px solid #FED7AA', transform: 'rotate(45deg)' }} />
                  </div>
                )}
              </div>
            </div>

            <div>
              <p 
                className="text-2xl lg:text-[27px] font-black tracking-tight leading-none truncate" 
                style={{ color: '#FA7C16' }}
              >
                {formatMoney(data.capitalRecuperado)}
              </p>
            </div>

            <p className="text-xs font-normal" style={{ color: '#94A3B8' }}>Devolución en bodega (SÍ)</p>
          </div>

          {/* CARD 5: CAPITAL BLOQUEADO (EN CURSO >=3 DÍAS + NOVEDAD - ROJO) */}
          <div 
            className="bg-white border p-5 shadow-xs flex flex-col justify-between space-y-3 hover:border-slate-300 transition-colors relative"
            style={{ 
              borderRadius: '22px',
              borderColor: '#E2E8F0',
              backgroundColor: '#FFFFFF'
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div 
                  className="w-9 h-9 border flex items-center justify-center shrink-0"
                  style={{
                    borderRadius: '12px',
                    backgroundColor: '#FEF2F2',
                    borderColor: '#FEE2E2',
                  }}
                >
                  <Lock size={17} strokeWidth={2.2} color="#EF4444" />
                </div>
                <span 
                  className="text-[10.5px] font-bold tracking-wider uppercase truncate"
                  style={{ color: '#64748B' }}
                >
                  CAPITAL BLOQUEADO
                </span>
              </div>

              <div className="relative impacto-tooltip-container">
                <button
                  type="button"
                  onClick={(e) => toggleTooltip('bloqueado', e)}
                  className="p-1 rounded-full transition-colors cursor-pointer"
                  style={{
                    backgroundColor: activeTooltip === 'bloqueado' ? '#FEE2E2' : 'transparent',
                    color: activeTooltip === 'bloqueado' ? '#EF4444' : '#94A3B8'
                  }}
                  title="Clic para ver explicación y cálculo"
                >
                  <HelpCircle size={16} strokeWidth={2.2} />
                </button>

                {activeTooltip === 'bloqueado' && (
                  <div 
                    className="animate-fade-in text-left"
                    style={{
                      position: 'absolute',
                      top: 'calc(100% + 10px)',
                      right: '0px',
                      left: 'auto',
                      width: '285px',
                      maxWidth: 'calc(100vw - 40px)',
                      backgroundColor: '#FFFFFF',
                      borderRadius: '20px',
                      padding: '16px',
                      boxShadow: '0 20px 40px -8px rgba(239, 68, 68, 0.15)',
                      border: '1px solid #FECACA',
                      zIndex: 60
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span 
                        className="text-xs font-black px-2.5 py-1 rounded-lg flex items-center gap-1.5" 
                        style={{ backgroundColor: '#FEF2F2', color: '#DC2626', border: '1px solid #FEE2E2' }}
                      >
                        <span>🔒</span> Capital Bloqueado
                      </span>
                      <button type="button" onClick={() => setActiveTooltip(null)} className="text-slate-400 hover:text-slate-800"><X size={14} /></button>
                    </div>
                    <p className="text-[11.5px] text-slate-600 mb-2.5">Mercancía y dinero retenidos temporalmente en ruta sin avance o en novedad.</p>
                    <div className="p-2.5 rounded-xl text-[11px]" style={{ backgroundColor: '#FEF2F2', border: '1px solid #FEE2E2', color: '#991B1B' }}>
                      <span className="font-extrabold text-[#EF4444]">Fórmula: </span>Suma de Recaudo Proveedor de guías <strong className="text-[#EF4444]">En curso</strong> con último movimiento &ge; 3 días + guías en <strong className="text-[#EF4444]">Novedad</strong>.
                    </div>
                    <div style={{ position: 'absolute', top: '-6px', right: '9px', width: '10px', height: '10px', backgroundColor: '#FFFFFF', borderLeft: '1px solid #FECACA', borderTop: '1px solid #FECACA', transform: 'rotate(45deg)' }} />
                  </div>
                )}
              </div>
            </div>

            <div>
              <p 
                className="text-2xl lg:text-[27px] font-black tracking-tight leading-none truncate" 
                style={{ color: '#EF4444' }}
              >
                {formatMoney(data.capitalBloqueado)}
              </p>
            </div>

            <p className="text-xs font-normal" style={{ color: '#94A3B8' }}>Curso &ge; 3 días · novedades</p>
          </div>

          {/* CARD 6: CAPITAL PERDIDO (DEVOLUCIONES BODEGA NO - ROJO) */}
          <div 
            className="bg-white border p-5 shadow-xs flex flex-col justify-between space-y-3 hover:border-slate-300 transition-colors relative"
            style={{ 
              borderRadius: '22px',
              borderColor: '#E2E8F0',
              backgroundColor: '#FFFFFF'
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div 
                  className="w-9 h-9 border flex items-center justify-center shrink-0"
                  style={{
                    borderRadius: '12px',
                    backgroundColor: '#FEF2F2',
                    borderColor: '#FEE2E2',
                  }}
                >
                  <XCircle size={17} strokeWidth={2.2} color="#EF4444" />
                </div>
                <span 
                  className="text-[10.5px] font-bold tracking-wider uppercase truncate"
                  style={{ color: '#64748B' }}
                >
                  CAPITAL PERDIDO
                </span>
              </div>

              <div className="relative impacto-tooltip-container">
                <button
                  type="button"
                  onClick={(e) => toggleTooltip('perdido', e)}
                  className="p-1 rounded-full transition-colors cursor-pointer"
                  style={{
                    backgroundColor: activeTooltip === 'perdido' ? '#FEE2E2' : 'transparent',
                    color: activeTooltip === 'perdido' ? '#EF4444' : '#94A3B8'
                  }}
                  title="Clic para ver explicación y cálculo"
                >
                  <HelpCircle size={16} strokeWidth={2.2} />
                </button>

                {activeTooltip === 'perdido' && (
                  <div 
                    className="animate-fade-in text-left"
                    style={{
                      position: 'absolute',
                      top: 'calc(100% + 10px)',
                      right: '0px',
                      left: 'auto',
                      width: '285px',
                      maxWidth: 'calc(100vw - 40px)',
                      backgroundColor: '#FFFFFF',
                      borderRadius: '20px',
                      padding: '16px',
                      boxShadow: '0 20px 40px -8px rgba(234, 88, 12, 0.15)',
                      border: '1px solid #FECACA',
                      zIndex: 60
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span 
                        className="text-xs font-black px-2.5 py-1 rounded-lg flex items-center gap-1.5" 
                        style={{ backgroundColor: '#FEF2F2', color: '#DC2626', border: '1px solid #FEE2E2' }}
                      >
                        <span>❌</span> Capital Perdido
                      </span>
                      <button type="button" onClick={() => setActiveTooltip(null)} className="text-slate-400 hover:text-slate-800"><X size={14} /></button>
                    </div>
                    <p className="text-[11.5px] text-slate-600 mb-2.5">Costo irrecuperable por mercancía devuelta que no reingresó a bodega.</p>
                    <div className="p-2.5 rounded-xl text-[11px]" style={{ backgroundColor: '#FEF2F2', border: '1px solid #FEE2E2', color: '#991B1B' }}>
                      <span className="font-extrabold text-[#EF4444]">Fórmula: </span>Suma de Recaudo Proveedor de órdenes en <strong className="text-[#EF4444]">DEVOLUCIÓN</strong> con Devolución a bodega = <strong className="text-[#EF4444]">'NO'</strong>.
                    </div>
                    <div style={{ position: 'absolute', top: '-6px', right: '9px', width: '10px', height: '10px', backgroundColor: '#FFFFFF', borderLeft: '1px solid #FECACA', borderTop: '1px solid #FECACA', transform: 'rotate(45deg)' }} />
                  </div>
                )}
              </div>
            </div>

            <div>
              <p 
                className="text-2xl lg:text-[27px] font-black tracking-tight leading-none truncate" 
                style={{ color: '#EF4444' }}
              >
                {formatMoney(data.capitalPerdido)}
              </p>
            </div>

            <p className="text-xs font-normal" style={{ color: '#94A3B8' }}>Devoluciones no recibidas (NO)</p>
          </div>

        </div>

      </div>
    </section>
  );
}
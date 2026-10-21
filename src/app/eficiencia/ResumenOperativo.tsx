// src/app/eficiencia/ResumenOperativo.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Package, FileText, CheckCircle2, HelpCircle, X } from 'lucide-react';

export interface ResumenPeriodoData {
  pedidosTotales: number;
  productosTotales: number;
  cobrado: number;
  porCobrar: number;
}

interface ResumenOperativoProps {
  data?: ResumenPeriodoData;
}

const formatMoney = (val: number) => `$ ${Math.round(val).toLocaleString('es-CO')}`;

export default function ResumenOperativo({ data }: ResumenOperativoProps) {
  const pedidosTotales = data?.pedidosTotales ?? 4447;
  const productosTotales = data?.productosTotales ?? 5887;
  const cobrado = data?.cobrado ?? 134855313;
  const porCobrar = data?.porCobrar ?? 52159668;

  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  // Cierra el tooltip al hacer clic en cualquier parte fuera de él
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.tooltip-container')) {
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
    <section className="space-y-3 font-sans w-full">
      
      {/* CABECERA */}
      <div>
        <h2 className="text-xl font-black text-slate-900 tracking-tight">
          Resumen del periodo
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Volumen y flujo de capital de las órdenes generadas
        </p>
      </div>

      {/* CONTENEDOR DE TARJETAS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 w-full max-w-[1000px]">
        
        {/* CARD 1: PEDIDOS TOTALES */}
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
                <Package size={17} strokeWidth={2.2} color="#F97316" />
              </div>
              <span 
                className="text-[10.5px] font-bold tracking-wider uppercase"
                style={{ color: '#64748B' }}
              >
                PEDIDOS TOTALES
              </span>
            </div>

            {/* BOTÓN ? AL LADO DERECHO */}
            <div className="relative tooltip-container">
              <button
                type="button"
                onClick={(e) => toggleTooltip('pedidos', e)}
                className="p-1 rounded-full transition-colors cursor-pointer"
                style={{
                  backgroundColor: activeTooltip === 'pedidos' ? '#FFEDD5' : 'transparent',
                  color: activeTooltip === 'pedidos' ? '#EA580C' : '#94A3B8'
                }}
                title="Clic para ver explicación y cálculo"
              >
                <HelpCircle size={16} strokeWidth={2.2} />
              </button>

              {activeTooltip === 'pedidos' && (
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
                      <span>📦</span> Pedidos Totales
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
                    Total de órdenes únicas generadas y registradas en la plataforma dentro del rango de fechas activo.
                  </p>
                  <div 
                    className="p-2.5 rounded-xl text-[11px] leading-relaxed"
                    style={{ backgroundColor: '#FFF7ED', border: '1px solid #FFEDD5', color: '#7C2D12' }}
                  >
                    <span className="font-extrabold text-[#EA580C]">Cálculo: </span>
                    Conteo global de guías generadas sin importar su estado logístico.
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
              className="text-3xl lg:text-[32px] font-black tracking-tight leading-none"
              style={{ color: '#FA7C16' }}
            >
              {pedidosTotales.toLocaleString('es-CO')}
            </p>
          </div>

          <p 
            className="text-xs font-normal"
            style={{ color: '#94A3B8' }}
          >
            Órdenes generadas en el rango
          </p>
        </div>

        {/* CARD 2: PRODUCTOS TOTALES */}
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
                <FileText size={17} strokeWidth={2.2} color="#F97316" />
              </div>
              <span 
                className="text-[10.5px] font-bold tracking-wider uppercase"
                style={{ color: '#64748B' }}
              >
                PRODUCTOS TOTALES
              </span>
            </div>

            <div className="relative tooltip-container">
              <button
                type="button"
                onClick={(e) => toggleTooltip('productos', e)}
                className="p-1 rounded-full transition-colors cursor-pointer"
                style={{
                  backgroundColor: activeTooltip === 'productos' ? '#FFEDD5' : 'transparent',
                  color: activeTooltip === 'productos' ? '#EA580C' : '#94A3B8'
                }}
                title="Clic para ver explicación y cálculo"
              >
                <HelpCircle size={16} strokeWidth={2.2} />
              </button>

              {activeTooltip === 'productos' && (
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
                      <span>📄</span> Productos Totales
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
                    Suma total de unidades físicas de mercancía despachadas o pendientes contenidas en las órdenes.
                  </p>
                  <div 
                    className="p-2.5 rounded-xl text-[11px] leading-relaxed"
                    style={{ backgroundColor: '#FFF7ED', border: '1px solid #FFEDD5', color: '#7C2D12' }}
                  >
                    <span className="font-extrabold text-[#EA580C]">Cálculo: </span>
                    Suma acumulada de las cantidades por pedido (si una orden lleva 2 o más unidades, se suman todas).
                  </div>
                  <div 
                    style={{
                      position: 'absolute',
                      top: '-6px',
                      right: '9px',
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
              className="text-3xl lg:text-[32px] font-black tracking-tight leading-none"
              style={{ color: '#FA7C16' }}
            >
              {productosTotales.toLocaleString('es-CO')}
            </p>
          </div>

          <p 
            className="text-xs font-normal"
            style={{ color: '#94A3B8' }}
          >
            Items despachados o pendientes
          </p>
        </div>

        {/* CARD 3: COBRADO */}
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
                <CheckCircle2 size={17} strokeWidth={2.2} color="#F97316" />
              </div>
              <span 
                className="text-[10.5px] font-bold tracking-wider uppercase"
                style={{ color: '#64748B' }}
              >
                COBRADO
              </span>
            </div>

            <div className="relative tooltip-container">
              <button
                type="button"
                onClick={(e) => toggleTooltip('cobrado', e)}
                className="p-1 rounded-full transition-colors cursor-pointer"
                style={{
                  backgroundColor: activeTooltip === 'cobrado' ? '#FFEDD5' : 'transparent',
                  color: activeTooltip === 'cobrado' ? '#EA580C' : '#94A3B8'
                }}
                title="Clic para ver explicación y cálculo"
              >
                <HelpCircle size={16} strokeWidth={2.2} />
              </button>

              {activeTooltip === 'cobrado' && (
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
                      <span>💰</span> Dinero Cobrado
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
                    Utilidad neta real y confirmada de paquetes entregados con éxito, ya acreditada en tu saldo disponible.
                  </p>
                  <div 
                    className="p-2.5 rounded-xl text-[11px] leading-relaxed"
                    style={{ backgroundColor: '#FFF7ED', border: '1px solid #FFEDD5', color: '#7C2D12' }}
                  >
                    <span className="font-extrabold text-[#EA580C]">Cálculo: </span>
                    Suma de utilidad neta de órdenes en estado <strong className="text-[#EA580C]">ENTREGADO</strong> o <strong className="text-[#EA580C]">FINALIZADO</strong>.
                  </div>
                  <div 
                    style={{
                      position: 'absolute',
                      top: '-6px',
                      right: '9px',
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
              className="text-2xl lg:text-[27px] font-black tracking-tight leading-none truncate"
              style={{ color: '#FA7C16' }}
            >
              {formatMoney(cobrado)}
            </p>
          </div>

          <p 
            className="text-xs font-normal"
            style={{ color: '#94A3B8' }}
          >
            Utilidad neta de pedidos entregados
          </p>
        </div>

        {/* CARD 4: POR COBRAR - POSICIONADO ESTRICTAMENTE A LA IZQUIERDA */}
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
                <span 
                  className="text-base font-black leading-none select-none"
                  style={{ color: '#F97316' }}
                >
                  $
                </span>
              </div>
              <span 
                className="text-[10.5px] font-bold tracking-wider uppercase"
                style={{ color: '#64748B' }}
              >
                POR COBRAR
              </span>
            </div>

            {/* BOTÓN ? AL LADO DERECHO */}
            <div className="relative tooltip-container">
              <button
                type="button"
                onClick={(e) => toggleTooltip('porCobrar', e)}
                className="p-1 rounded-full transition-colors cursor-pointer"
                style={{
                  backgroundColor: activeTooltip === 'porCobrar' ? '#FFEDD5' : 'transparent',
                  color: activeTooltip === 'porCobrar' ? '#EA580C' : '#94A3B8'
                }}
                title="Clic para ver explicación y cálculo"
              >
                <HelpCircle size={16} strokeWidth={2.2} />
              </button>

              {/* POPUP CARD 4: ALINEADO HACIA LA IZQUIERDA (right: 0, left: auto) */}
              {activeTooltip === 'porCobrar' && (
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
                      <span>⏳</span> Dinero Por Cobrar
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
                    Utilidad proyectada de pedidos que siguen en curso o en gestión logística y aún no han finalizado.
                  </p>
                  <div 
                    className="p-2.5 rounded-xl text-[11px] leading-relaxed"
                    style={{ backgroundColor: '#FFF7ED', border: '1px solid #FFEDD5', color: '#7C2D12' }}
                  >
                    <span className="font-extrabold text-[#EA580C]">Cálculo: </span>
                    Suma de utilidad de órdenes activas: <strong className="text-[#EA580C]">En curso, Pendientes, Por confirmar</strong> y <strong className="text-[#EA580C]">Con novedad</strong>.
                  </div>
                  {/* Flechita que apunta con precisión al botón (?) */}
                  <div 
                    style={{
                      position: 'absolute',
                      top: '-6px',
                      right: '9px',
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
              className="text-2xl lg:text-[27px] font-black tracking-tight leading-none truncate"
              style={{ color: '#FA7C16' }}
            >
              {formatMoney(porCobrar)}
            </p>
          </div>

          <p 
            className="text-xs font-normal"
            style={{ color: '#94A3B8' }}
          >
            Utilidad pendiente en órdenes activas
          </p>
        </div>

      </div>
    </section>
  );
}
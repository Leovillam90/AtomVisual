// src/app/alertas/page.tsx
'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { 
  Package, AlertCircle, TrendingUp, Users, RotateCcw, 
  ArrowRight, CheckCircle2, PackageCheck, ShieldAlert, Sparkles 
} from 'lucide-react';
import { useFiltrosCruzados } from '@/hooks/useFiltrosCruzados';
import ModalDevoluciones, { GuiaDevolucionReal } from './ModalDevoluciones';

export interface TareaHistorico {
  id: string;
  fecha: string;
  tarea: string;
  guias: number;
  recaudo: string;
  estado: 'Completada' | 'En Proceso' | 'Fallida';
  hora: string;
}

interface ResumenGestion {
  confirmadas: GuiaDevolucionReal[];
  reclamadas: GuiaDevolucionReal[];
  montoReclamado: number;
  montoConfirmado: number;
  fechaHora: string;
}

const HISTORICO_BASE_INICIAL: TareaHistorico[] = [
  { id: 'HIST-001', fecha: '2026-10-14', tarea: 'Movilización de estancados', guias: 38, recaudo: '$ 2.642.957', estado: 'Completada', hora: '10:09' },
  { id: 'HIST-002', fecha: '2026-10-14', tarea: 'Fuera de bodega (+30 días)', guias: 28, recaudo: '$ 2.845.000', estado: 'Completada', hora: '08:00' },
  { id: 'HIST-003', fecha: '2026-10-14', tarea: 'Novedades (+10 días)', guias: 19, recaudo: '$ 1.620.400', estado: 'Completada', hora: '08:00' },
  { id: 'HIST-004', fecha: '2026-10-13', tarea: 'Novedades a Dropshippers', guias: 24, recaudo: '$ 2.023.789', estado: 'Completada', hora: '09:00' },
  { id: 'HIST-005', fecha: '2026-10-13', tarea: 'Movilización de estancados', guias: 41, recaudo: '$ 3.105.200', estado: 'Completada', hora: '10:14' }
];

// Extractor universal insensible a tildes (í/Ú), mayúsculas o caracteres especiales
function extraerContadorFlexible(order: any, tipo: 'movimiento' | 'gestion'): number {
  if (!order) return 0;
  for (const key of Object.keys(order)) {
    const kNorm = key
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '');

    if (tipo === 'movimiento') {
      if (kNorm.includes('movimiento') || kNorm.includes('sinmovimiento')) {
        const val = Number(order[key]);
        if (!isNaN(val)) return val;
      }
    } else if (tipo === 'gestion') {
      if (kNorm.includes('gestion')) {
        const val = Number(order[key]);
        if (!isNaN(val)) return val;
      }
    }
  }
  return 0;
}

function esDevolucionEnBodegaSi(order: any): boolean {
  if (!order) return false;
  for (const key of Object.keys(order)) {
    const kNorm = key.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]/g, '');
    if (kNorm.includes('bodega') && (kNorm.includes('dev') || kNorm.includes('devolucion'))) {
      const val = String(order[key] || '').toUpperCase().trim();
      if (val === 'SI' || val === 'SÍ') return true;
    }
  }
  return false;
}

function esTipoDevolucion(order: any): boolean {
  if (!order) return false;
  const tipo = String(order.tipoEstado || order['Tipo de estado'] || order.estado || order.Estado || '').toUpperCase();
  return tipo.includes('DEVOLU') || tipo.includes('DEV');
}

function parseNumeroSeguro(v: any): number {
  if (v === null || v === undefined || v === '' || v === '-') return 0;
  if (typeof v === 'number') return v;
  let s = String(v).trim().replace('$', '').replace(/\s/g, '');
  if (s.includes('.') && s.includes(',')) s = s.replace(/\./g, '').replace(',', '.');
  else if (s.includes(',')) s = s.replace(',', '.');
  else if (s.includes('.')) {
    const parts = s.split('.');
    if (parts.length === 2 && parts[1].length === 3) s = parts[0] + parts[1];
  }
  const res = parseFloat(s);
  return isNaN(res) ? 0 : res;
}

const formatCOP = (val: number) => `$ ${Math.round(val).toLocaleString('es-CO')}`;

export default function PanelAlertasPage() {
  const { filteredData, loading } = useFiltrosCruzados();

  const [procesadasIds, setProcesadasIds] = useState<Set<string>>(new Set());
  const [resumenGestion, setResumenGestion] = useState<ResumenGestion | null>(null);
  const [historico, setHistorico] = useState<TareaHistorico[]>(HISTORICO_BASE_INICIAL);
  const [isModalDevolucionesOpen, setIsModalDevolucionesOpen] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    try {
      const storedAuditadas = localStorage.getItem('atom_guias_auditadas');
      if (storedAuditadas) {
        const parsed = JSON.parse(storedAuditadas);
        setProcesadasIds(new Set(Object.keys(parsed)));
      } else {
        setProcesadasIds(new Set());
      }

      const storedHistorico = localStorage.getItem('atom_historico_tareas');
      if (storedHistorico) setHistorico(JSON.parse(storedHistorico));
      else setHistorico(HISTORICO_BASE_INICIAL);

      const storedResumen = localStorage.getItem('atom_resumen_gestion');
      if (storedResumen) setResumenGestion(JSON.parse(storedResumen));
    } catch (e) {
      console.error(e);
    }
  }, []);

  const handleReiniciarAuditoria = () => {
    try {
      localStorage.removeItem('atom_guias_auditadas');
      localStorage.removeItem('atom_resumen_gestion');
      localStorage.removeItem('atom_historico_tareas');
      window.dispatchEvent(new Event('atom_guias_updated'));
    } catch (e) {
      console.error(e);
    }

    setProcesadasIds(new Set());
    setResumenGestion(null);
    setHistorico(HISTORICO_BASE_INICIAL);
    setNotification('¡Auditoría restablecida! Las 8 guías están listas para auditar de nuevo.');
    setTimeout(() => setNotification(null), 4000);
  };

  // KPIs superiores corregidos
  const kpisDinamicos = useMemo(() => {
    const records = Array.isArray(filteredData) ? filteredData : [];
    let fueraBodegaCount = 0, fueraBodegaMonto = 0, novedadesCount = 0, novedadesMonto = 0;
    let estancadosCount = 0, estancadosMonto = 0, notificadosCount = 0, notificadosMonto = 0;

    records.forEach((row: any) => {
      const tipo = String(row.tipoEstado || row['Tipo de estado'] || row.estado || row.Estado || '').toUpperCase();
      const diasGestion = extraerContadorFlexible(row, 'gestion');
      const ultMov = extraerContadorFlexible(row, 'movimiento');
      const recaudo = parseNumeroSeguro(row.recaudoProveedor ?? row['Recaudo proveedor']);

      if (diasGestion >= 30 && !tipo.includes('ENTREG') && !tipo.includes('FINALIZ')) {
        fueraBodegaCount += 1;
        fueraBodegaMonto += recaudo;
      }
      if (tipo.includes('NOVEDAD') && diasGestion >= 10) {
        novedadesCount += 1;
        novedadesMonto += recaudo;
      }
      if (ultMov >= 6 && !tipo.includes('ENTREG') && !tipo.includes('FINALIZ')) {
        estancadosCount += 1;
        estancadosMonto += recaudo;
      }
      if (tipo.includes('NOVEDAD')) {
        notificadosCount += 1;
        notificadosMonto += recaudo;
      }
    });

    return { fueraBodegaCount, fueraBodegaMonto, novedadesCount, novedadesMonto, estancadosCount, estancadosMonto, notificadosCount, notificadosMonto };
  }, [filteredData]);

  // Extracción de guías en devolución >= 7 días sin movimiento
  const devolucionesPendientes = useMemo(() => {
    if (!Array.isArray(filteredData)) return [];

    return filteredData
      .filter((order: any) => {
        const esDev = esTipoDevolucion(order);
        const enBodega = esDevolucionEnBodegaSi(order);
        const ultMov = extraerContadorFlexible(order, 'movimiento');

        return esDev && !enBodega && ultMov >= 7;
      })
      .map((order: any, idx: number): GuiaDevolucionReal => {
        const id = String(order.id || order.ID || `DEV-${idx}`);
        const numeroGuia = String(order.numeroGuia || order['Número de guía'] || order.guia || '-');
        return {
          id: `${id}-${idx}`,
          pedidoId: id,
          numeroGuia,
          transportadora: String(order.transportadora || order.Transportadora || '-'),
          productoNombre: String(order.productoNombre || order.Productos || 'Producto sin identificar'),
          diasSinMovimiento: extraerContadorFlexible(order, 'movimiento'),
          diasGestion: extraerContadorFlexible(order, 'gestion'),
          valorDeclarado: parseNumeroSeguro(order.recaudoProveedor ?? order['Recaudo proveedor'])
        };
      })
      .filter((g: GuiaDevolucionReal) => !procesadasIds.has(g.numeroGuia));
  }, [filteredData, procesadasIds]);

  const valorPerdidaCalculada = useMemo(
    () => devolucionesPendientes.reduce((acc, curr) => acc + curr.valorDeclarado, 0),
    [devolucionesPendientes]
  );

  const handleAuditoriaSuccess = (reclamadas: GuiaDevolucionReal[], confirmadas: GuiaDevolucionReal[]) => {
    const totalGestionadas = reclamadas.length + confirmadas.length;
    const horaActual = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const fechaHoy = new Date().toISOString().slice(0, 10);

    const montoConfirmado = confirmadas.reduce((a, b) => a + b.valorDeclarado, 0);
    const montoReclamado = reclamadas.reduce((a, b) => a + b.valorDeclarado, 0);

    const nuevoResumen: ResumenGestion = {
      confirmadas: [...(resumenGestion?.confirmadas || []), ...confirmadas],
      reclamadas: [...(resumenGestion?.reclamadas || []), ...reclamadas],
      montoConfirmado: montoConfirmado + (resumenGestion?.montoConfirmado || 0),
      montoReclamado: montoReclamado + (resumenGestion?.montoReclamado || 0),
      fechaHora: `Hoy, ${horaActual}`
    };
    setResumenGestion(nuevoResumen);
    try {
      localStorage.setItem('atom_resumen_gestion', JSON.stringify(nuevoResumen));
    } catch (e) {}

    const nuevasFilasHistorico: TareaHistorico[] = [];
    if (reclamadas.length > 0) {
      nuevasFilasHistorico.push({
        id: `HIST-${Date.now()}-REC`,
        fecha: fechaHoy,
        tarea: `Reclamación Jurídica CAS radicada (Art. 1013 C.Co. - ${reclamadas.length} guías)`,
        guias: reclamadas.length,
        recaudo: formatCOP(montoReclamado),
        estado: 'Completada',
        hora: horaActual
      });
    }
    if (confirmadas.length > 0) {
      nuevasFilasHistorico.push({
        id: `HIST-${Date.now()}-CONF`,
        fecha: fechaHoy,
        tarea: `Devoluciones ingresadas a bodega física (${confirmadas.length} guías)`,
        guias: confirmadas.length,
        recaudo: formatCOP(montoConfirmado),
        estado: 'Completada',
        hora: horaActual
      });
    }

    const historicoActualizado = [...nuevasFilasHistorico, ...historico];
    setHistorico(historicoActualizado);
    try {
      localStorage.setItem('atom_historico_tareas', JSON.stringify(historicoActualizado));
    } catch (e) {}

    setProcesadasIds((prev) => {
      const updated = new Set(prev);
      reclamadas.forEach((g) => updated.add(g.numeroGuia));
      confirmadas.forEach((g) => updated.add(g.numeroGuia));
      return updated;
    });

    setNotification(`¡Auditoría procesada! Se radicaron ${totalGestionadas} guías en el sistema.`);
    setTimeout(() => setNotification(null), 5000);
  };

  if (loading) {
    return <div className="p-8 flex justify-center text-slate-500 font-sans">Cargando alertas logísticas...</div>;
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 p-4 sm:p-6 lg:p-8 font-sans space-y-6">
      {notification && (
        <div className="fixed top-6 right-6 z-50 bg-emerald-500 text-white px-4 py-3 rounded-2xl font-bold shadow-2xl flex items-center gap-2 animate-bounce border border-emerald-400 text-xs">
          <CheckCircle2 size={16} />
          <span>{notification}</span>
        </div>
      )}

      {/* CABECERA */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Panel de alertas</h1>
          <p className="text-xs text-slate-500 mt-0.5">Tareas y auditorías de retorno calculadas sobre tu base de guías.</p>
        </div>

        {procesadasIds.size > 0 && (
          <button
            type="button"
            onClick={handleReiniciarAuditoria}
            className="px-3.5 py-2 bg-white border border-slate-200 hover:border-slate-300 text-slate-600 hover:text-slate-900 rounded-xl text-xs font-bold shadow-2xs transition flex items-center gap-1.5 cursor-pointer active:scale-95"
            title="Restablece las guías para volver a auditar"
          >
            <RotateCcw size={14} className="text-orange-500" />
            <span>Reiniciar Auditoría ({procesadasIds.size})</span>
          </button>
        )}
      </div>

      {/* KPIS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex justify-between items-center">
              <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">FUERA DE BODEGA (+30 DÍAS)</span>
              <Package size={16} className="text-slate-400" />
            </div>
            <p className="text-3xl font-extrabold text-[#f97316] tracking-tight mt-2">{kpisDinamicos.fueraBodegaCount} Guías</p>
          </div>
          <div className="flex justify-between items-center text-xs pt-2 border-t border-slate-100">
            <span className="text-slate-400 font-normal">Monto en riesgo:</span>
            <span className="font-extrabold text-slate-800">{formatCOP(kpisDinamicos.fueraBodegaMonto)}</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex justify-between items-center">
              <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">NOVEDADES (+10 DÍAS)</span>
              <AlertCircle size={16} className="text-slate-400" />
            </div>
            <p className="text-3xl font-extrabold text-[#f97316] tracking-tight mt-2">{kpisDinamicos.novedadesCount} Guías</p>
          </div>
          <div className="flex justify-between items-center text-xs pt-2 border-t border-slate-100">
            <span className="text-slate-400 font-normal">Retorno solicitado:</span>
            <span className="font-extrabold text-slate-800">{formatCOP(kpisDinamicos.novedadesMonto)}</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex justify-between items-center">
              <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">MOVILIZACIÓN DE ESTANCADOS</span>
              <TrendingUp size={16} className="text-slate-400" />
            </div>
            <p className="text-3xl font-extrabold text-[#f97316] tracking-tight mt-2">{kpisDinamicos.estancadosCount} Guías</p>
          </div>
          <div className="flex justify-between items-center text-xs pt-2 border-t border-slate-100">
            <span className="text-slate-400 font-normal">Recaudo movilizado:</span>
            <span className="font-extrabold text-slate-800">{formatCOP(kpisDinamicos.estancadosMonto)}</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex justify-between items-center">
              <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">NOVEDADES A DROPSHIPPERS</span>
              <Users size={16} className="text-slate-400" />
            </div>
            <p className="text-3xl font-extrabold text-[#f97316] tracking-tight mt-2">{kpisDinamicos.notificadosCount} Guías</p>
          </div>
          <div className="flex justify-between items-center text-xs pt-2 border-t border-slate-100">
            <span className="text-slate-400 font-normal">Recaudo notificado:</span>
            <span className="font-extrabold text-slate-800">{formatCOP(kpisDinamicos.notificadosMonto)}</span>
          </div>
        </div>
      </div>

      {/* BANNER DINÁMICO */}
      {devolucionesPendientes.length > 0 ? (
        <div className="bg-white border border-orange-200 rounded-2xl p-5 sm:p-6 shadow-2xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-all">
          <div className="flex items-start gap-4">
            <div className="w-11 h-11 rounded-2xl border border-orange-200 bg-orange-50 flex items-center justify-center shrink-0 text-[#f97316]">
              <RotateCcw size={18} />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-black text-[#ea580c] uppercase tracking-wide">ACCIÓN REQUERIDA · CAS</span>
                <span className="text-[#ea580c] text-[8px]">●</span>
                <span className="text-xs text-slate-500 font-medium">Guías con $\ge 7$ días sin movimiento pendientes de ingreso a bodega</span>
              </div>
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
                Devoluciones que no han llegado a bodega <span className="text-[#f97316] ml-1">{devolucionesPendientes.length} Guías Reales</span>
              </h2>
              <p className="text-xs text-slate-500">
                Pérdida en retorno calculada: <strong className="text-slate-800 font-bold">{formatCOP(valorPerdidaCalculada)}</strong>. Haz clic en Gestionar para conciliar las órdenes o radicar formalmente la indemnización jurídica.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 shrink-0 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={() => setIsModalDevolucionesOpen(true)}
              className="bg-[#f97316] hover:bg-[#ea580c] text-white font-bold px-5 py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 shadow-xs transition-all active:scale-95 cursor-pointer"
            >
              <span>Gestionar ({devolucionesPendientes.length})</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-xs text-emerald-900">
            <CheckCircle2 size={22} className="text-emerald-600 shrink-0" />
            <div>
              <p className="font-extrabold text-sm">Auditoría completada exitosamente</p>
              <p className="text-emerald-700 mt-0.5">Se auditaron y radicaron las devoluciones. Las decisiones están sincronizadas en Detalle de Guías.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleReiniciarAuditoria}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black shadow-xs transition flex items-center gap-1.5 cursor-pointer shrink-0 active:scale-95"
          >
            <RotateCcw size={14} />
            <span>Reiniciar y Volver a Auditar</span>
          </button>
        </div>
      )}

      {/* RESUMEN DE GESTIÓN */}
      {resumenGestion && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-4">
          <div className="flex justify-between items-center flex-wrap gap-2 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center">
                <Sparkles size={16} />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">Devoluciones Gestionadas y Auditadas</h3>
                <p className="text-[11px] text-slate-400">Última ejecución: {resumenGestion.fechaHora} • Registrado en el sistema</p>
              </div>
            </div>
            <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full border border-emerald-200">
              {resumenGestion.confirmadas.length + resumenGestion.reclamadas.length} Guías Procesadas
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-emerald-50/40 border border-emerald-200 rounded-2xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <PackageCheck size={20} />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 block">Confirmadas en Bodega</span>
                  <p className="text-xl font-black text-slate-900">{resumenGestion.confirmadas.length} Guías</p>
                  <span className="text-[11px] text-slate-500 font-medium">Ingresadas físicamente a inventario</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-medium text-slate-400 block">Valor recuperado</span>
                <span className="text-sm font-black text-emerald-700">{formatCOP(resumenGestion.montoConfirmado)}</span>
              </div>
            </div>

            <div className="bg-rose-50/40 border border-rose-200 rounded-2xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
                  <ShieldAlert size={20} />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 block">Reclamadas ante CAS (Legal)</span>
                  <p className="text-xl font-black text-slate-900">{resumenGestion.reclamadas.length} Guías</p>
                  <span className="text-[11px] text-slate-500 font-medium">Expediente legal radicado</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-medium text-slate-400 block">Monto en siniestro</span>
                <span className="text-sm font-black text-rose-600">{formatCOP(resumenGestion.montoReclamado)}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* HISTÓRICO */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-2xs space-y-4">
        <div className="flex justify-between items-center flex-wrap gap-2">
          <h2 className="text-base font-bold text-slate-900 tracking-tight">Histórico de auditorías y tareas automáticas (90 días)</h2>
          <span className="text-xs text-slate-400 font-normal">Registro de acciones y radicaciones CAS ejecutadas.</span>
        </div>

        <div className="overflow-x-auto rounded-xl">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-2">FECHA</th>
                <th className="py-3 px-4">TAREA AUDITADA</th>
                <th className="py-3 px-4 text-center">GUÍAS</th>
                <th className="py-3 px-4 text-right">RECAUDO PROVEEDOR</th>
                <th className="py-3 px-4 text-center">ESTADO</th>
                <th className="py-3 px-2 text-right">HORA</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {historico.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 px-2 font-medium text-slate-700 whitespace-nowrap">{row.fecha}</td>
                  <td className="py-3.5 px-4 font-bold text-slate-900">{row.tarea}</td>
                  <td className="py-3.5 px-4 text-center font-extrabold text-slate-800">{row.guias}</td>
                  <td className="py-3.5 px-4 text-right font-bold text-slate-800">{row.recaudo}</td>
                  <td className="py-3.5 px-4 text-center">
                    <span className="bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-full px-3 py-0.5 text-[11px] font-semibold inline-block">
                      {row.estado}
                    </span>
                  </td>
                  <td className="py-3.5 px-2 text-right font-medium text-slate-500 whitespace-nowrap">{row.hora}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ModalDevoluciones
        isOpen={isModalDevolucionesOpen}
        guias={devolucionesPendientes}
        onClose={() => setIsModalDevolucionesOpen(false)}
        onSuccess={handleAuditoriaSuccess}
      />
    </div>
  );
}
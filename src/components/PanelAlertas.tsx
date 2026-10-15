// src/components/PanelAlertas.tsx
'use client';

import React, { useState, useMemo } from 'react';
import { 
  Package, 
  AlertCircle, 
  TrendingUp, 
  Users, 
  RotateCcw, 
  ArrowRight, 
  Eye, 
  CheckCircle2, 
  PackageCheck, 
  ShieldAlert, 
  Sparkles 
} from 'lucide-react';
import ModalDevoluciones, { GuiaDevolucion } from '@/app/modales/ModalDevoluciones';

interface TareaHistorico {
  id: string;
  fecha: string;
  tarea: string;
  guias: number;
  recaudo: string;
  estado: 'Completada' | 'En Proceso' | 'Fallida';
  hora: string;
}

const HISTORICO_DATA_INICIAL: TareaHistorico[] = [
  {
    id: 'HIST-001',
    fecha: '2026-10-14',
    tarea: 'Movilización de estancados',
    guias: 38,
    recaudo: '$ 2.642.957',
    estado: 'Completada',
    hora: '10:09'
  },
  {
    id: 'HIST-002',
    fecha: '2026-10-14',
    tarea: 'Fuera de bodega (+30 días)',
    guias: 28,
    recaudo: '$ 2.845.000',
    estado: 'Completada',
    hora: '08:00'
  },
  {
    id: 'HIST-003',
    fecha: '2026-10-14',
    tarea: 'Novedades (+10 días)',
    guias: 19,
    recaudo: '$ 1.620.400',
    estado: 'Completada',
    hora: '08:00'
  },
  {
    id: 'HIST-004',
    fecha: '2026-10-13',
    tarea: 'Novedades a Dropshippers',
    guias: 24,
    recaudo: '$ 2.023.789',
    estado: 'Completada',
    hora: '09:00'
  },
  {
    id: 'HIST-005',
    fecha: '2026-10-13',
    tarea: 'Movilización de estancados',
    guias: 41,
    recaudo: '$ 3.105.200',
    estado: 'Completada',
    hora: '10:14'
  }
];

// Generador de las 43 guías iniciales que suman exactamente $ 3.480.000
const PRODUCTOS_CATALOGO = [
  '2und Ventilador 3 en 1 de 18 pulgadas',
  'Audifonos Diadema JBL Tune 770 NC',
  'Pañalera morral tipo cuna con cambiador',
  'Alcancia Figura Pintura Diamante',
  'Dildo consolador realista termico',
  'Depiladora Facial Recargable LED',
  'Mini Proyector Portátil HD'
];
const CARRIERS_LIST = ['Coordinadora', 'Envia', 'Interrapidisimo', 'Tcc'];

const GENERAR_43_GUIAS_INICIALES = (): GuiaDevolucion[] => {
  const precios = [
    65000, 85000, 110000, 78000, 92000, 64000, 120000, 82000, 70000, 95000,
    88000, 74000, 66000, 91000, 83000, 77000, 89000, 68000, 79000, 84000,
    72000, 86000, 69000, 94000, 81000, 76000, 87000, 73000, 90000, 80000,
    75000, 82000, 67000, 93000, 85000, 71000, 88000, 78000, 65000, 84000,
    79000, 82000, 73000
  ];
  const sumaActual = precios.reduce((a, b) => a + b, 0);
  const diff = 3480000 - sumaActual;
  precios[0] += diff;

  return precios.map((valor, idx) => ({
    id: `DEV-43-${idx + 1}`,
    pedidoId: `PED-${10500 + idx}`,
    numeroGuia: `${CARRIERS_LIST[idx % 4].slice(0, 2).toUpperCase()}-${9900000 + idx}`,
    transportadora: CARRIERS_LIST[idx % 4],
    trackingUrl: 'https://coordinadora.com/tracking',
    productoNombre: PRODUCTOS_CATALOGO[idx % PRODUCTOS_CATALOGO.length],
    diasSinMovimiento: 7 + (idx % 7),
    valorDeclarado: valor,
    validacion: 'CONFIRMADA'
  }));
};

interface ResumenGestion {
  confirmadas: GuiaDevolucion[];
  reclamadas: GuiaDevolucion[];
  montoReclamado: number;
  montoConfirmado: number;
  fechaHora: string;
}

export default function PanelAlertas() {
  const [devolucionesPendientes, setDevolucionesPendientes] = useState<GuiaDevolucion[]>(GENERAR_43_GUIAS_INICIALES());
  const [historico, setHistorico] = useState<TareaHistorico[]>(HISTORICO_DATA_INICIAL);
  const [resumenGestion, setResumenGestion] = useState<ResumenGestion | null>(null);
  const [isModalDevolucionesOpen, setIsModalDevolucionesOpen] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  const valorPerdidaCalculada = useMemo(() => {
    return devolucionesPendientes.reduce((acc, curr) => acc + curr.valorDeclarado, 0);
  }, [devolucionesPendientes]);

  const handleAuditoriaSuccess = (reclamadas: GuiaDevolucion[], confirmadas: GuiaDevolucion[]) => {
    const totalGestionadas = reclamadas.length + confirmadas.length;
    const horaActual = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const fechaHoy = '2026-10-14';

    const montoConfirmado = confirmadas.reduce((a, b) => a + b.valorDeclarado, 0);
    const montoReclamado = reclamadas.reduce((a, b) => a + b.valorDeclarado, 0);

    // 1. Guardar o actualizar la tarjeta de resumen
    const nuevoResumen: ResumenGestion = {
      confirmadas: [...(resumenGestion?.confirmadas || []), ...confirmadas],
      reclamadas: [...(resumenGestion?.reclamadas || []), ...reclamadas],
      montoConfirmado: montoConfirmado + (resumenGestion?.montoConfirmado || 0),
      montoReclamado: montoReclamado + (resumenGestion?.montoReclamado || 0),
      fechaHora: `Hoy, ${horaActual}`
    };
    setResumenGestion(nuevoResumen);

    // 2. Insertar las tareas gestionadas directamente en el Histórico de 90 días
    const nuevasFilasHistorico: TareaHistorico[] = [];

    if (reclamadas.length > 0) {
      nuevasFilasHistorico.push({
        id: `HIST-${Date.now()}-REC`,
        fecha: fechaHoy,
        tarea: 'Reclamación CAS por devolución no ingresada (+7D)',
        guias: reclamadas.length,
        recaudo: `$ ${montoReclamado.toLocaleString('es-CO')}`,
        estado: 'Completada',
        hora: horaActual
      });
    }

    if (confirmadas.length > 0) {
      nuevasFilasHistorico.push({
        id: `HIST-${Date.now()}-CONF`,
        fecha: fechaHoy,
        tarea: 'Devoluciones ingresadas a bodega (Ecom Scanner)',
        guias: confirmadas.length,
        recaudo: `$ ${montoConfirmado.toLocaleString('es-CO')}`,
        estado: 'Completada',
        hora: horaActual
      });
    }

    setHistorico(prev => [...nuevasFilasHistorico, ...prev]);

    // 3. Limpiar las guías de la bandeja de pendientes
    const idsProcesadas = new Set([...reclamadas, ...confirmadas].map(g => g.id));
    setDevolucionesPendientes(prev => prev.filter(g => !idsProcesadas.has(g.id)));

    setNotification(`¡Auditoría procesada! Se registraron ${totalGestionadas} guías en el Histórico.`);
    setTimeout(() => setNotification(null), 5000);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 p-6 lg:p-8 font-sans space-y-6">
      
      {/* Toast Flotante */}
      {notification && (
        <div className="fixed top-6 right-6 z-50 bg-emerald-500 text-slate-950 px-4 py-3 rounded-2xl font-bold shadow-2xl flex items-center gap-2 animate-bounce border border-emerald-300 text-xs">
          <CheckCircle2 size={16} />
          <span>{notification}</span>
        </div>
      )}

      {/* 1. CABECERA */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Panel de alertas</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Estas son las tareas que ATOM ejecuta por ti de forma autónoma sobre tus guías.
        </p>
      </div>

      {/* 2. LAS 4 TARJETAS SUPERIORES */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <div className="flex justify-between items-center">
              <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                FUERA DE BODEGA (+30 DÍAS)
              </span>
              <Package size={16} className="text-slate-400" />
            </div>
            <p className="text-3xl font-extrabold text-[#f97316] tracking-tight mt-2">
              28 Guías
            </p>
          </div>
          <div className="flex justify-between items-center text-xs pt-1 border-t border-slate-50">
            <span className="text-slate-400 font-normal">Monto en riesgo:</span>
            <span className="font-extrabold text-slate-800">$ 2.845.000</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <div className="flex justify-between items-center">
              <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                NOVEDADES (+10 DÍAS)
              </span>
              <AlertCircle size={16} className="text-slate-400" />
            </div>
            <p className="text-3xl font-extrabold text-[#f97316] tracking-tight mt-2">
              19 Guías
            </p>
          </div>
          <div className="flex justify-between items-center text-xs pt-1 border-t border-slate-50">
            <span className="text-slate-400 font-normal">Retorno solicitado:</span>
            <span className="font-extrabold text-slate-800">$ 1.620.400</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <div className="flex justify-between items-center">
              <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                MOVILIZACIÓN DE ESTANCADOS
              </span>
              <TrendingUp size={16} className="text-slate-400" />
            </div>
            <p className="text-3xl font-extrabold text-[#f97316] tracking-tight mt-2">
              38 Guías
            </p>
          </div>
          <div className="flex justify-between items-center text-xs pt-1 border-t border-slate-50">
            <span className="text-slate-400 font-normal">Recaudo movilizado:</span>
            <span className="font-extrabold text-slate-800">$ 2.642.957</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <div className="flex justify-between items-center">
              <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                NOVEDADES A DROPSHIPPERS
              </span>
              <Users size={16} className="text-slate-400" />
            </div>
            <p className="text-3xl font-extrabold text-[#f97316] tracking-tight mt-2">
              24 Guías
            </p>
          </div>
          <div className="flex justify-between items-center text-xs pt-1 border-t border-slate-50">
            <span className="text-slate-400 font-normal">Recaudo notificado:</span>
            <span className="font-extrabold text-slate-800">$ 2.023.789</span>
          </div>
        </div>

      </div>

      {/* 3. BANNER DE ACCIÓN REQUERIDA (SE OCULTA SI SE GESTIONAN TODAS) */}
      {devolucionesPendientes.length > 0 && (
        <div className="bg-white border border-orange-200/80 rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-all">
          <div className="flex items-start gap-4">
            <div className="w-11 h-11 rounded-2xl border border-orange-200 bg-orange-50/50 flex items-center justify-center shrink-0 text-[#f97316]">
              <RotateCcw size={18} />
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-black text-[#ea580c] uppercase tracking-wide">
                  ACCIÓN REQUERIDA
                </span>
                <span className="text-[#ea580c] text-[8px]">●</span>
                <span className="text-xs text-slate-400 font-medium">
                  Sin confirmación en bodega por el Ecom Scanner
                </span>
              </div>

              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
                Devoluciones que no han llegado a bodega{' '}
                <span className="text-[#f97316] ml-1">{devolucionesPendientes.length} Guías</span>
              </h2>

              <p className="text-xs text-slate-500">
                Pérdida en retorno calculada:{' '}
                <strong className="text-slate-800 font-bold">${valorPerdidaCalculada.toLocaleString('es-CO')}</strong>. Haz clic en Gestionar o Seguimiento para auditar cada guía en el Detalle de Guías.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={() => setIsModalDevolucionesOpen(true)}
              className="bg-[#f97316] hover:bg-[#ea580c] text-white font-bold px-5 py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm transition-all active:scale-95 cursor-pointer"
            >
              <span>Gestionar</span>
              <ArrowRight size={14} />
            </button>

          </div>
        </div>
      )}

      {/* 4. TARJETA RESUMEN DE GESTIÓN */}
      {resumenGestion && (
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex justify-between items-center flex-wrap gap-2 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center">
                <Sparkles size={16} />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">
                  Devoluciones Gestionadas y Auditadas
                </h3>
                <p className="text-[11px] text-slate-400">
                  Última ejecución: {resumenGestion.fechaHora} • Registrado en el Histórico de 90 días
                </p>
              </div>
            </div>

            <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full border border-emerald-200/80">
              {resumenGestion.confirmadas.length + resumenGestion.reclamadas.length} Guías Procesadas
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-emerald-50/40 border border-emerald-200/80 rounded-2xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100/80 text-emerald-700 flex items-center justify-center shrink-0">
                  <PackageCheck size={20} />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 block">
                    Confirmadas en Bodega
                  </span>
                  <p className="text-xl font-black text-slate-900">
                    {resumenGestion.confirmadas.length} Guías
                  </p>
                  <span className="text-[11px] text-slate-500 font-medium">
                    Sincronizadas con Ecom Scanner
                  </span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-medium text-slate-400 block">Valor recuperado</span>
                <span className="text-sm font-black text-emerald-700">
                  ${resumenGestion.montoConfirmado.toLocaleString('es-CO')}
                </span>
              </div>
            </div>

            <div className="bg-rose-50/40 border border-rose-200/80 rounded-2xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-100/80 text-rose-700 flex items-center justify-center shrink-0">
                  <ShieldAlert size={20} />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 block">
                    Reclamadas ante CAS
                  </span>
                  <p className="text-xl font-black text-slate-900">
                    {resumenGestion.reclamadas.length} Guías
                  </p>
                  <span className="text-[11px] text-slate-500 font-medium">
                    Declaración jurada radicada
                  </span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-medium text-slate-400 block">Monto en siniestro</span>
                <span className="text-sm font-black text-rose-600">
                  ${resumenGestion.montoReclamado.toLocaleString('es-CO')}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. HISTÓRICO DE 90 DÍAS (ACTUALIZADO DINÁMICAMENTE) */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex justify-between items-center flex-wrap gap-2">
          <h2 className="text-base font-bold text-slate-900 tracking-tight">
            Histórico de 90 días
          </h2>
          <span className="text-xs text-slate-400 font-normal">
            En los últimos 90 días ATOM protegió {historico.reduce((acc, h) => acc + h.guias, 0)} guías de forma autónoma.
          </span>
        </div>

        <div className="overflow-x-auto rounded-xl">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-2">FECHA</th>
                <th className="py-3 px-4">TAREA</th>
                <th className="py-3 px-4 text-center">GUÍAS</th>
                <th className="py-3 px-4 text-right">RECAUDO PROVEEDOR</th>
                <th className="py-3 px-4 text-center">ESTADO</th>
                <th className="py-3 px-2 text-right">HORA</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100/80">
              {historico.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 px-2 font-medium text-slate-700 whitespace-nowrap">
                    {row.fecha}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-900">
                    {row.tarea}
                  </td>
                  <td className="py-3.5 px-4 text-center font-extrabold text-slate-800">
                    {row.guias}
                  </td>
                  <td className="py-3.5 px-4 text-right font-bold text-slate-800">
                    {row.recaudo}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span className="bg-emerald-50 text-emerald-600 border border-emerald-300/80 rounded-full px-3 py-0.5 text-[11px] font-semibold inline-block">
                      {row.estado}
                    </span>
                  </td>
                  <td className="py-3.5 px-2 text-right font-medium text-slate-500 whitespace-nowrap">
                    {row.hora}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 6. MODAL DE AUDITORÍA */}
      <ModalDevoluciones
        isOpen={isModalDevolucionesOpen}
        guias={devolucionesPendientes}
        onClose={() => setIsModalDevolucionesOpen(false)}
        onSuccess={handleAuditoriaSuccess}
      />

    </div>
  );
}
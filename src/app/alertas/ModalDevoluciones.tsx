// src/app/alertas/ModalDevoluciones.tsx
'use client';

import React, { useState, useMemo } from 'react';
import { 
  X, Check, Clock, Calendar, Scale, 
  Package, PackageCheck, ShieldAlert, FileText, Copy
} from 'lucide-react';

export interface GuiaDevolucionReal {
  id: string;
  pedidoId: string;
  numeroGuia: string;
  transportadora: string;
  productoNombre: string;
  diasSinMovimiento: number;
  diasGestion: number;
  valorDeclarado: number;
  decision?: 'CONFIRMAR' | 'RECLAMAR' | null;
}

interface ModalDevolucionesProps {
  isOpen: boolean;
  guias: GuiaDevolucionReal[];
  onClose: () => void;
  onSuccess: (reclamadas: GuiaDevolucionReal[], confirmadas: GuiaDevolucionReal[]) => void;
}

const formatCOP = (val: number) => `$ ${Math.round(val).toLocaleString('es-CO')}`;

export default function ModalDevoluciones({ isOpen, guias, onClose, onSuccess }: ModalDevolucionesProps) {
  // 1. Hooks al inicio
  const [decisiones, setDecisiones] = useState<Record<string, 'CONFIRMAR' | 'RECLAMAR'>>({});
  const [copiadoExito, setCopiadoExito] = useState(false);

  const radicadoGenerado = useMemo(() => {
    const now = new Date();
    const fStr = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}`;
    return `RAD-CAS-${fStr}-ATOM`;
  }, []);

  const confirmadas = useMemo(() => {
    return guias.filter((g) => decisiones[g.numeroGuia] === 'CONFIRMAR');
  }, [guias, decisiones]);

  const reclamadas = useMemo(() => {
    return guias.filter((g) => decisiones[g.numeroGuia] === 'RECLAMAR');
  }, [guias, decisiones]);

  const totalAuditadas = confirmadas.length + reclamadas.length;
  const montoReclamadoTotal = useMemo(() => {
    return reclamadas.reduce((acc, curr) => acc + curr.valorDeclarado, 0);
  }, [reclamadas]);

  const montoConfirmadoTotal = useMemo(() => {
    return confirmadas.reduce((acc, curr) => acc + curr.valorDeclarado, 0);
  }, [confirmadas]);

  // Generador del Acta Formal de Reclamación CAS
  const textoActaLegal = useMemo(() => {
    const fechaHoy = new Date().toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' });
    const transportadorasInvolucradas = Array.from(new Set(reclamadas.map((g) => g.transportadora))).join(', ') || 'TRANSPORTADORAS RESPONSABLES';

    const detalleGuiasTexto = reclamadas.map((g, idx) => 
      `  ${idx + 1}. Guía: ${g.numeroGuia} | Pedido #${g.pedidoId} | Transp.: ${g.transportadora} | Sin Movimiento: ${g.diasSinMovimiento}d | Días en Gestión: ${g.diasGestion}d | Valor Declarado: ${formatCOP(g.valorDeclarado)} | Producto: ${g.productoNombre}`
    ).join('\n');

    return `ACTA FORMAL DE RECLAMACIÓN Y RADICACIÓN DE SINIESTRO LOGÍSTICO (CAS)
RADICADO: ${radicadoGenerado}
FECHA DE EXPEDICIÓN: ${fechaHoy}

A LA ATENCIÓN DE:
DEPARTAMENTO DE ATENCIÓN A SOLICITUDES Y SINIESTROS (CAS) / PLATAFORMA DROPI
EMPRESAS DE TRANSPORTE: ${transportadorasInvolucradas}

REFERENCIA: RECLAMACIÓN FORMAL E INDEMNIZACIÓN POR PÉRDIDA BAJO CUSTODIA (EXPEDICIÓN ART. 1013 C.CO.)

1. HECHOS Y ANTECEDENTES:
1.1. En virtud del contrato de transporte terrestre y mensajería expresa celebrado, las empresas transportadoras asumieron la custodia de las mercancías detalladas a continuación con obligación de entrega al destinatario o retorno efectivo a la bodega remitente.
1.2. A la fecha, las órdenes relacionadas han superado el umbral legal y comercial de siete (7) días hábiles en estado de cesación absoluta de trazabilidad y movimiento, sin haber sido entregadas al cliente ni devueltas físicamente al almacén de origen.
1.3. La bodega remitente certifica expresamente que los paquetes NO han ingresado a su inventario físico mediante escaneo de código de barras ni recepción formal.

2. DETALLE DE GUÍAS OBJETO DE INDEMNIZACIÓN (${reclamadas.length} Envíos):
${detalleGuiasTexto || '  (No se han seleccionado guías para radicación)'}

TOTAL RECLAMADO POR CONCEPTO DE MERCANCÍA: ${formatCOP(montoReclamadoTotal)} COP

3. FUNDAMENTOS DE DERECHO:
- CÓDIGO DE COMERCIO DE COLOMBIA:
  * Art. 981 y ss.: Obligaciones esenciales del contrato de transporte de carga.
  * Art. 1013: Obligación de custodia y conservación de la cosa desde su recibo hasta la entrega física.
  * Art. 1030 y 1031: Responsabilidad objetiva del transportador por pérdida total o parcial del envío y exigibilidad de indemnización del 100% del valor declarado al momento de la entrega.
- LEY 1369 DE 2009 (Régimen Postal de Mensajería Expresa):
  * Garantía de indemnización por expoliación o retraso no justificado y plazo perentorio de 15 días hábiles para respuesta.
- RESOLUCIÓN CRC 5050 DE 2016 (Régimen de Protección al Usuario Postal):
  * Obligación de trámite de PQR de siniestro y reintegro o no cobro de flete por servicio defectuoso o no concluido.

4. PRETENSIONES:
PRIMERA: Declarar el siniestro por pérdida bajo custodia de las ${reclamadas.length} guías detalladas en la presente acta.
SEGUNDA: Liquidar e indemnizar a favor del remitente el cien por ciento (100%) del valor de costo declarado, por la suma total de ${formatCOP(montoReclamadoTotal)} COP.
TERCERA: Reintegrar o exonerar los cobros por concepto de fletes sobre las guías siniestradas.

Se expide y suscribe electrónicamente a través de la plataforma ATOM Logistics Suite.`;
  }, [reclamadas, montoReclamadoTotal, radicadoGenerado]);

  // 2. Retorno temprano después de los hooks
  if (!isOpen) return null;

  const handleToggle = (numeroGuia: string, tipo: 'CONFIRMAR' | 'RECLAMAR') => {
    setDecisiones((prev) => ({
      ...prev,
      [numeroGuia]: prev[numeroGuia] === tipo ? (undefined as any) : tipo
    }));
  };

  const handleCopiarActa = () => {
    navigator.clipboard.writeText(textoActaLegal);
    setCopiadoExito(true);
    setTimeout(() => setCopiadoExito(false), 3000);
  };

  const handleFinalizar = () => {
    try {
      const stored = localStorage.getItem('atom_guias_auditadas');
      const dataStore = stored ? JSON.parse(stored) : {};
      const fechaAuditoria = new Date().toLocaleDateString('es-CO');

      confirmadas.forEach((g) => {
        dataStore[g.numeroGuia] = {
          estado: 'CONFIRMAR',
          fecha: fechaAuditoria,
          pedidoId: g.pedidoId
        };
      });

      reclamadas.forEach((g) => {
        dataStore[g.numeroGuia] = {
          estado: 'RECLAMAR',
          fecha: fechaAuditoria,
          pedidoId: g.pedidoId,
          radicado: radicadoGenerado
        };
      });

      localStorage.setItem('atom_guias_auditadas', JSON.stringify(dataStore));
      window.dispatchEvent(new Event('atom_guias_updated'));
    } catch (e) {
      console.error('Error guardando en localStorage', e);
    }

    onSuccess(reclamadas, confirmadas);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 font-sans">
      <div 
        className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 w-full flex flex-col overflow-hidden animate-fadeIn"
        style={{ maxWidth: '920px', maxHeight: '86vh', height: '86vh' }}
      >
        {/* CABECERA LIMPIA */}
        <div className="shrink-0 p-4 sm:p-5 border-b border-slate-100 bg-slate-50/80">
          <div className="flex items-center justify-between gap-4 mb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black text-orange-600 uppercase tracking-wider">
                  ATOM AUDITOR & CONCILIACIÓN
                </span>
                <span className="text-slate-300">|</span>
                <span className="text-xs text-slate-500 font-medium">Devoluciones Estancadas fuera de bodega</span>
              </div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                Auditoría y Radicación CAS ({guias.length} guías)
              </h2>
            </div>

            <button 
              type="button"
              onClick={onClose} 
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-xl transition cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          {/* KPI Mini-Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <div className="bg-white border border-slate-200 rounded-xl p-2 flex items-center justify-between shadow-2xs">
              <div>
                <span className="text-[9px] text-slate-400 font-bold uppercase block">TOTAL DETECTADO</span>
                <span className="text-xs font-black text-slate-800">{guias.length} Envíos</span>
              </div>
              <Package size={14} className="text-slate-400" />
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-2 flex items-center justify-between shadow-2xs">
              <div>
                <span className="text-[9px] text-slate-400 font-bold uppercase block">EN BODEGA</span>
                <span className="text-xs font-black text-emerald-600">{confirmadas.length} ({formatCOP(montoConfirmadoTotal)})</span>
              </div>
              <PackageCheck size={14} className="text-emerald-500" />
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-2 flex items-center justify-between shadow-2xs">
              <div>
                <span className="text-[9px] text-slate-400 font-bold uppercase block">A RECLAMAR CAS</span>
                <span className="text-xs font-black text-rose-600">{reclamadas.length} ({formatCOP(montoReclamadoTotal)})</span>
              </div>
              <ShieldAlert size={14} className="text-rose-500" />
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-2 flex items-center justify-between shadow-2xs">
              <div>
                <span className="text-[9px] text-slate-400 font-bold uppercase block">SIN AUDITAR</span>
                <span className="text-xs font-black text-amber-600">{guias.length - totalAuditadas} Envíos</span>
              </div>
              <Clock size={14} className="text-amber-500" />
            </div>
          </div>
        </div>

        {/* LISTADO DE GUÍAS (DIRECTO, SIN BARRAS INTERMEDIAS) */}
        <div className="flex-1 min-h-0 overflow-y-auto p-3 sm:p-4 space-y-2 bg-slate-50/50">
          {guias.map((g) => {
            const dec = decisiones[g.numeroGuia];
            return (
              <div 
                key={g.id} 
                className={`p-3 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  dec === 'CONFIRMAR' 
                    ? 'bg-emerald-50/50 border-emerald-300 shadow-2xs' 
                    : dec === 'RECLAMAR'
                    ? 'bg-rose-50/50 border-rose-300 shadow-2xs'
                    : 'bg-white border-slate-200 hover:border-slate-300 shadow-2xs'
                }`}
              >
                {/* Datos de la guía */}
                <div className="space-y-1 flex-1 min-w-0 pr-2">
                  <div className="flex items-center flex-wrap gap-2">
                    <span className="font-mono font-black text-xs text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                      {g.numeroGuia}
                    </span>
                    <span className="text-[11px] font-bold text-slate-500">
                      Pedido #{g.pedidoId}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                      {g.transportadora}
                    </span>

                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-orange-100 text-orange-700 border border-orange-200 flex items-center gap-1">
                      <Clock size={10} /> {g.diasSinMovimiento}d sin movimiento
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-700 border border-rose-200 flex items-center gap-1">
                      <Calendar size={10} /> {g.diasGestion}d en gestión
                    </span>
                  </div>

                  <p className="text-xs font-semibold text-slate-800 truncate" title={g.productoNombre}>
                    {g.productoNombre}
                  </p>

                  <div className="flex items-center gap-3 text-[11px]">
                    <span className="text-slate-500">
                      Costo bodega: <strong className="text-slate-900 font-bold">{formatCOP(g.valorDeclarado)}</strong>
                    </span>

                    {dec === 'RECLAMAR' && (
                      <span className="text-[10px] font-extrabold text-rose-700 flex items-center gap-1 bg-rose-100/60 px-2 py-0.5 rounded border border-rose-200">
                        <Scale size={11} /> Amparada bajo Art. 1013 C.Co. (Extravío bajo custodia)
                      </span>
                    )}
                  </div>
                </div>

                {/* Botones de acción directos */}
                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  <button
                    type="button"
                    onClick={() => handleToggle(g.numeroGuia, 'CONFIRMAR')}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold border transition flex items-center gap-1.5 cursor-pointer shadow-2xs ${
                      dec === 'CONFIRMAR'
                        ? 'bg-emerald-600 text-white border-emerald-600 ring-2 ring-emerald-500/20'
                        : 'bg-white text-emerald-700 border-emerald-200 hover:bg-emerald-50'
                    }`}
                  >
                    <PackageCheck size={14} />
                    <span>En Bodega</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleToggle(g.numeroGuia, 'RECLAMAR')}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-bold border transition flex items-center gap-1.5 cursor-pointer shadow-2xs ${
                      dec === 'RECLAMAR'
                        ? 'bg-rose-600 text-white border-rose-600 ring-2 ring-rose-500/20'
                        : 'bg-white text-rose-700 border-rose-200 hover:bg-rose-50'
                    }`}
                  >
                    <Scale size={14} />
                    <span>Reclamar CAS</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* PIE CON SUSTENTACIÓN LEGAL INTEGRADA AL RADICAR */}
        <div className="shrink-0 p-3.5 sm:p-4 border-t border-slate-100 bg-white flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-600 space-y-0.5">
            <div>
              Auditadas: <strong className="text-slate-900">{totalAuditadas}</strong> de {guias.length} | 
              Confirmadas: <span className="text-emerald-700 font-bold">{confirmadas.length}</span> | 
              Reclamadas CAS: <strong className="text-rose-700 font-black">{reclamadas.length} ({formatCOP(montoReclamadoTotal)})</strong>
            </div>
            {reclamadas.length > 0 && (
              <div className="text-[10px] text-slate-400 flex items-center gap-1.5 font-medium">
                <Scale size={11} className="text-rose-500" />
                <span>Sustentación jurídica: Arts. 1013 y 1030 C.Co. · Ley 1369/2009 (100% indemnización)</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            {reclamadas.length > 0 && (
              <button
                type="button"
                onClick={handleCopiarActa}
                className="px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                title="Copia el texto del acta formal para radicar el ticket"
              >
                {copiadoExito ? <Check size={13} className="text-emerald-600" /> : <Copy size={13} />}
                <span>{copiadoExito ? '¡Acta Copiada!' : 'Copiar Acta CAS'}</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition cursor-pointer"
            >
              Cerrar
            </button>
            
            <button
              type="button"
              disabled={totalAuditadas === 0}
              onClick={handleFinalizar}
              className="px-5 py-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white rounded-xl text-xs font-black shadow-xs transition flex items-center gap-1.5 cursor-pointer"
            >
              <Check size={14} />
              <span>Guardar y Radicar Auditoría ({totalAuditadas})</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
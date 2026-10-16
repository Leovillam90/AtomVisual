// src/app/negocios/ModalContactoNegocio.tsx
'use client';

import React, { useState } from 'react';
import { 
  X, User, Phone, Mail, 
  Copy, Check, MessageSquare, 
  ShieldCheck
} from 'lucide-react';

export interface DropshipperContactData {
  id: string;
  nombre: string;
  correo: string;
  telefono: string;
  totalPedidos?: number;
}

interface ModalContactoNegocioProps {
  isOpen: boolean;
  dropshipper: DropshipperContactData | null;
  onClose: () => void;
  onIniciarConversacion: (drop: DropshipperContactData) => void;
}

export default function ModalContactoNegocio({
  isOpen,
  dropshipper,
  onClose,
  onIniciarConversacion
}: ModalContactoNegocioProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  if (!isOpen || !dropshipper) return null;

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 font-sans animate-fadeIn">
      <div 
        className="bg-white border border-slate-200 rounded-3xl w-full overflow-hidden shadow-2xl relative flex flex-col"
        style={{ maxWidth: '440px' }}
      >
        {/* Cabecera */}
        <div className="p-5 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-orange-100 border border-orange-200 text-[#ea580c] flex items-center justify-center font-black text-base shadow-2xs">
              {dropshipper.nombre ? dropshipper.nombre.slice(0, 2).toUpperCase() : 'DS'}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-sm font-extrabold text-slate-900 truncate max-w-[220px]">
                  {dropshipper.nombre}
                </h3>
                <ShieldCheck size={13} className="text-emerald-600 shrink-0" />
              </div>
              <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                ID Dropshipper: <span className="font-bold text-slate-700">{dropshipper.id}</span>
              </p>
            </div>
          </div>

          <button 
            type="button" 
            onClick={onClose} 
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 rounded-xl transition cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Datos Principales (Nombre, Teléfono, Correo) */}
        <div className="p-5 space-y-3 text-xs">
          {/* 1. Nombre */}
          <div className="bg-slate-50 border border-slate-200/70 rounded-xl p-3 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <User size={15} className="text-slate-400 shrink-0" />
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Nombre / Titular</p>
                <p className="font-bold text-slate-800 text-xs mt-0.5">{dropshipper.nombre}</p>
              </div>
            </div>
          </div>

          {/* 2. Teléfono (sin botón de WhatsApp, únicamente botón de copiar) */}
          <div className="bg-slate-50 border border-slate-200/70 rounded-xl p-3 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Phone size={15} className="text-emerald-600 shrink-0" />
              <div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Teléfono de Contacto</p>
                <p className="font-bold text-slate-800 text-xs mt-0.5 font-mono">{dropshipper.telefono}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => copyToClipboard(dropshipper.telefono, 'tel')}
              className="p-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-600 transition cursor-pointer shadow-2xs"
              title="Copiar teléfono"
            >
              {copiedField === 'tel' ? <Check size={12} className="text-emerald-600" /> : <Copy size={12} />}
            </button>
          </div>

          {/* 3. Correo Electrónico */}
          <div className="bg-slate-50 border border-slate-200/70 rounded-xl p-3 flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0 pr-2">
              <Mail size={15} className="text-blue-500 shrink-0" />
              <div className="truncate">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Correo Electrónico</p>
                <p className="font-bold text-slate-800 truncate text-xs mt-0.5">{dropshipper.correo}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => copyToClipboard(dropshipper.correo, 'mail')}
              className="p-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-600 shrink-0 transition cursor-pointer shadow-2xs"
              title="Copiar correo"
            >
              {copiedField === 'mail' ? <Check size={12} className="text-emerald-600" /> : <Copy size={12} />}
            </button>
          </div>
        </div>

        {/* Pie con botón para Iniciar conversación en CAS */}
        <div className="p-4 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-white transition cursor-pointer"
          >
            Cerrar
          </button>

          <button
            type="button"
            onClick={() => onIniciarConversacion(dropshipper)}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-black shadow-xs transition flex items-center gap-1.5 cursor-pointer"
          >
            <MessageSquare size={13} className="text-[#ff7e24]" />
            <span>Iniciar conversación (CAS)</span>
          </button>
        </div>

      </div>
    </div>
  );
} 
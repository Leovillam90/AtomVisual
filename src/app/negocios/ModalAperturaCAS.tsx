// src/app/negocios/ModalAperturaCAS.tsx
'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  X, Send, ChevronRight, MessageSquare, 
  ArrowLeft, CheckCheck, ShieldCheck,
  Store, Phone, Mail, Copy, Check,
  User
} from 'lucide-react';

export interface CASContexto {
  negocioNombre?: string;
  negocioId?: string;
  telefono?: string;
  correo?: string;
}

interface ModalAperturaCASProps {
  isOpen: boolean;
  contexto?: CASContexto | null;
  onClose: () => void;
}

interface MensajeChat {
  id: string;
  remitente: 'proveedor' | 'dropshipper' | 'sistema';
  texto: string;
  hora: string;
  leido?: boolean;
}

export default function ModalAperturaCAS({ isOpen, contexto, onClose }: ModalAperturaCASProps) {
  // Abre directamente en la pestaña de chat en vivo
  const [activeTab, setActiveTab] = useState<'inicio' | 'chat'>('chat');
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);

  // Normalización de datos del dropshipper
  const nombreDropshipper = contexto?.negocioNombre || 'Dropshipper Aliado';
  const idDropshipper = contexto?.negocioId || 'General';
  const cleanId = String(idDropshipper).replace(/[^0-9]/g, '');
  const cleanName = nombreDropshipper.toLowerCase().replace(/[^a-z0-9]/g, '');

  const telefonoDropshipper = contexto?.telefono || `+57 3${cleanId.padEnd(9, '1').slice(0, 9)}`;
  const correoDropshipper = contexto?.correo || `${cleanName || 'contacto'}@dropi.co`;

  // Conversación en tiempo real simulada
  const [mensajes, setMensajes] = useState<MensajeChat[]>([
    {
      id: 'sys-1',
      remitente: 'sistema',
      texto: `Canal de comunicación directa habilitado con ${nombreDropshipper} (ID: ${idDropshipper}).`,
      hora: '10:00 AM'
    },
    {
      id: 'm1',
      remitente: 'dropshipper',
      texto: '¡Hola! ¿Cómo estás? Me comunico respecto a los pedidos despachados esta semana. ¿Tienen confirmación de ingreso a bodega de las devoluciones?',
      hora: '10:14 AM'
    },
    {
      id: 'm2',
      remitente: 'proveedor',
      texto: `Hola ${nombreDropshipper}, gusto en saludarte. Estamos auditando con el Ecom Scanner en tiempo real. Cualquier paquete con más de 7 días sin movimiento lo tenemos priorizado.`,
      hora: '10:16 AM',
      leido: true
    }
  ]);

  const [inputMensaje, setInputMensaje] = useState('');
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll al final del chat
  useEffect(() => {
    if (activeTab === 'chat') {
      chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [mensajes, isTyping, activeTab]);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const simularEnvioYRespuesta = (textoProveedor: string, respuestaDropshipper: string) => {
    const horaActual = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setMensajes((prev) => [
      ...prev,
      {
        id: `msg-${Date.now()}`,
        remitente: 'proveedor',
        texto: textoProveedor,
        hora: horaActual,
        leido: false
      }
    ]);

    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setMensajes((prev) => [
        ...prev,
        {
          id: `msg-resp-${Date.now()}`,
          remitente: 'dropshipper',
          texto: respuestaDropshipper,
          hora: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          leido: true
        }
      ]);
    }, 1500);
  };

  // 1. Opción: Acompañamiento
  const handleOpcionAcompanamiento = () => {
    const textoProv = `Hola ${nombreDropshipper}, estuvimos revisando tus métricas y notamos un incremento en la tasa de devolución en ciertas rutas. Queremos brindarte acompañamiento directo para auditar con Ecom Scanner y gestionar reintentos prioritarios con la transportadora para rescatar ese margen.`;
    const respDrop = `¡Hola! Nos vendría excelente ese acompañamiento. Justamente teníamos inquietud con las órdenes en novedad de esta semana. ¿Cómo podemos coordinar los reintentos prioritarios?`;
    simularEnvioYRespuesta(textoProv, respDrop);
  };

  // 2. Opción: Ventas
  const handleOpcionVentas = () => {
    const textoProv = `Hola ${nombreDropshipper}, felicitaciones por el ritmo de ventas que traes. Queremos proponerte un plan de bonos por volumen: si superamos la meta acordada este mes, te habilitamos una bonificación económica especial por orden despachada.`;
    const respDrop = `¡Qué buena propuesta! Estamos listos para escalar el presupuesto de pauta este fin de semana. ¿A partir de cuántos pedidos diarios aplicaría el bono por ventas?`;
    simularEnvioYRespuesta(textoProv, respDrop);
  };

  // 3. Opción: Acuerdos
  const handleOpcionAcuerdos = () => {
    const textoProv = `Hola ${nombreDropshipper}, tenemos stock garantizado y referencias ganadoras listas en bodega para privatizar en exclusiva para tu tienda, de modo que puedas escalar sin competencia directa de precio.`;
    const respDrop = `¡Me interesa muchísimo! La guerra de precios nos estaba castigando el ROI. ¿Qué productos tienen listos para privatizar y con qué stock inicial contamos?`;
    simularEnvioYRespuesta(textoProv, respDrop);
  };

  const handleEnviarMensaje = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputMensaje.trim()) return;

    const texto = inputMensaje.trim();
    setInputMensaje('');

    let respuesta = '¡Entendido! Muchas gracias por el mensaje, estamos coordinando con el equipo para darle seguimiento oportuno.';
    const tLower = texto.toLowerCase();

    if (tLower.includes('devolu') || tLower.includes('guia') || tLower.includes('bodega')) {
      respuesta = 'Perfecto, quedamos atentos a la confirmación de ingreso físico por el escáner de bodega.';
    } else if (tLower.includes('bono') || tLower.includes('precio') || tLower.includes('venta')) {
      respuesta = '¡Súper motivante esa propuesta comercial! Vamos a acelerar las campañas para llegar a la meta.';
    } else if (tLower.includes('privatiz') || tLower.includes('stock')) {
      respuesta = 'De acuerdo, por favor compártenos el catálogo privado para montarlo en nuestra tienda.';
    }

    simularEnvioYRespuesta(texto, respuesta);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 font-sans animate-fadeIn"
      style={{ backgroundColor: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(5px)' }}
    >
      {/* CONTENEDOR MÁS ANCHO (460px) Y DIMENSIONES FIJAS */}
      <div 
        className="flex flex-col overflow-hidden relative shadow-2xl"
        style={{
          width: '460px',
          maxWidth: '95vw',
          height: '630px',
          maxHeight: '92vh',
          backgroundColor: '#ffffff',
          borderRadius: '28px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)'
        }}
      >
        
        {/* ======================================================== */}
        {/* VISTA 1: CHAT EN VIVO DIRECTO (ABRE AQUÍ DIRECTAMENTE)   */}
        {/* ======================================================== */}
        {activeTab === 'chat' && (
          <div className="flex-1 flex flex-col bg-[#F8FAFC] overflow-hidden">
            
            {/* Header del Chat */}
            <div className="px-5 py-3.5 bg-white border-b border-slate-200 flex items-center justify-between shadow-2xs shrink-0 z-10">
              <div className="flex items-center gap-3 min-w-0">
                <button
                  type="button"
                  onClick={() => setActiveTab('inicio')}
                  className="p-1.5 hover:bg-slate-100 rounded-full text-slate-600 transition cursor-pointer"
                  title="Ver datos del dropshipper"
                >
                  <ArrowLeft size={17} />
                </button>

                <div className="relative shrink-0">
                  <div 
                    className="w-10 h-10 rounded-full text-white flex items-center justify-center font-bold text-xs shadow-xs"
                    style={{ background: 'linear-gradient(135deg, #ed7c28 0%, #f3962e 100%)' }}
                  >
                    {nombreDropshipper.slice(0, 2).toUpperCase()}
                  </div>
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white"></span>
                </div>

                <div className="min-w-0">
                  <h4 className="text-sm font-extrabold text-slate-900 truncate leading-tight">
                    {nombreDropshipper}
                  </h4>
                  <p className="text-[11px] text-emerald-600 font-bold flex items-center gap-1 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    <span>En línea</span>
                    <span className="text-slate-300 font-normal">· ID {idDropshipper}</span>
                  </p>
                </div>
              </div>

              <button 
                type="button" 
                onClick={onClose} 
                className="text-slate-400 hover:text-slate-700 p-1.5 rounded-full hover:bg-slate-100 transition cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Conversación */}
            <div className="flex-1 p-4 space-y-3.5 overflow-y-auto text-xs bg-slate-50">
              <div className="flex justify-center my-1">
                <span className="bg-white text-slate-500 text-[10px] font-bold px-3 py-1 rounded-full border border-slate-200 shadow-2xs">
                  Hoy
                </span>
              </div>

              {mensajes.map((m) => {
                if (m.remitente === 'sistema') {
                  return (
                    <div key={m.id} className="flex justify-center my-1.5">
                      <div className="bg-amber-50 border border-amber-200 text-amber-900 text-[10.5px] px-3.5 py-1.5 rounded-2xl max-w-[90%] text-center leading-relaxed">
                        {m.texto}
                      </div>
                    </div>
                  );
                }

                const esProveedor = m.remitente === 'proveedor';
                return (
                  <div 
                    key={m.id} 
                    className={`flex flex-col ${esProveedor ? 'items-end' : 'items-start'}`}
                  >
                    <div 
                      className={`max-w-[82%] px-4 py-2.5 rounded-2xl shadow-2xs text-xs leading-relaxed ${
                        esProveedor 
                          ? 'text-white font-medium rounded-br-xs' 
                          : 'bg-white text-slate-800 border border-slate-200 rounded-bl-xs'
                      }`}
                      style={{
                        backgroundColor: esProveedor ? '#ed7c28' : '#ffffff'
                      }}
                    >
                      <p className="whitespace-pre-wrap">{m.texto}</p>
                    </div>

                    <div className="flex items-center gap-1 text-[9.5px] text-slate-400 px-1 mt-0.5">
                      <span>{m.hora}</span>
                      {esProveedor && (
                        <CheckCheck size={11} className={m.leido ? 'text-blue-500' : 'text-slate-400'} />
                      )}
                    </div>
                  </div>
                );
              })}

              {isTyping && (
                <div className="flex items-center gap-1.5 bg-white border border-slate-200 px-3 py-1.5 rounded-2xl w-fit shadow-2xs">
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                  <span className="text-[10px] text-slate-400 ml-1">Escribiendo...</span>
                </div>
              )}
              
              <div ref={chatBottomRef} />
            </div>

            {/* Las 3 Opciones Estratégicas en la barra inferior del chat */}
            <div className="px-4 py-2 bg-white border-t border-slate-100 flex items-center gap-2 overflow-x-auto text-[11px] shrink-0 no-scrollbar select-none">
              {/* Opción 1: Acompañamiento */}
              <button
                type="button"
                onClick={handleOpcionAcompanamiento}
                className="px-3 py-1.5 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition whitespace-nowrap cursor-pointer shrink-0 font-bold flex items-center gap-1.5"
                title="Acompañamiento para mitigar alto porcentaje de devoluciones"
              >
                <span>🤝 Acompañamiento</span>
              </button>

              {/* Opción 2: Ventas */}
              <button
                type="button"
                onClick={handleOpcionVentas}
                className="px-3 py-1.5 rounded-full bg-orange-50 hover:bg-orange-100 text-[#ea580c] border border-orange-200 transition whitespace-nowrap cursor-pointer shrink-0 font-bold flex items-center gap-1.5"
                title="Propuesta de bonos económicos e incentivos por escala de ventas"
              >
                <span>🚀 Bonos Ventas</span>
              </button>

              {/* Opción 3: Acuerdos */}
              <button
                type="button"
                onClick={handleOpcionAcuerdos}
                className="px-3 py-1.5 rounded-full bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 transition whitespace-nowrap cursor-pointer shrink-0 font-bold flex items-center gap-1.5"
                title="Acuerdos para privatizar referencias exclusivas sin competencia"
              >
                <span>🔒 Privatizar Stock</span>
              </button>
            </div>

            {/* Barra de entrada de texto */}
            <form onSubmit={handleEnviarMensaje} className="p-3.5 bg-white border-t border-slate-200 flex items-center gap-2 shrink-0">
              <input
                type="text"
                placeholder="Escribe tu mensaje al dropshipper..."
                value={inputMensaje}
                onChange={(e) => setInputMensaje(e.target.value)}
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 outline-none focus:bg-white focus:border-[#ed7c28] transition font-medium"
              />

              <button
                type="submit"
                disabled={!inputMensaje.trim()}
                className="w-10 h-10 rounded-xl text-white flex items-center justify-center transition cursor-pointer shrink-0 shadow-xs disabled:opacity-40"
                style={{ backgroundColor: '#ed7c28' }}
              >
                <Send size={16} />
              </button>
            </form>

          </div>
        )}

        {/* ======================================================== */}
        {/* VISTA 2: INICIO / DATOS DEL DROPSHIPPER (SIN WHATSAPP)   */}
        {/* ======================================================== */}
        {activeTab === 'inicio' && (
          <div 
            className="flex-1 flex flex-col overflow-y-auto"
            style={{
              background: 'linear-gradient(180deg, #ed7c28 0%, #f3962e 45%, #fff7ed 82%, #ffffff 100%)'
            }}
          >
            {/* Topbar */}
            <div className="p-5 pb-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <svg className="w-6 h-6 text-white" viewBox="0 0 40 40" fill="currentColor">
                  <circle cx="20" cy="20" r="10" />
                  <circle cx="16" cy="18" r="2.2" fill="#ed7c28" />
                  <circle cx="24" cy="18" r="2.2" fill="#ed7c28" />
                  <path d="M10 20c0-1.5.8-2.5 2-2.5v5c-1.2 0-2-1-2-2.5zm20 0c0 1.5-.8 2.5-2 2.5v-5c1.2 0 2 1 2 2.5z" />
                </svg>
                <span className="text-xl font-black text-white tracking-tight lowercase">dropi</span>
              </div>

              <button 
                type="button" 
                onClick={onClose} 
                className="w-8 h-8 rounded-full bg-black/15 hover:bg-black/25 text-white flex items-center justify-center transition cursor-pointer"
                title="Cerrar"
              >
                <X size={16} />
              </button>
            </div>

            {/* Saludo */}
            <div className="px-6 pt-3 pb-5 text-white select-none">
              <span className="text-[10px] font-bold text-white/80 uppercase tracking-widest block mb-1">
                Portal de Comunicación Proveedor
              </span>
              <h2 className="text-2xl font-black tracking-tight leading-tight uppercase text-white drop-shadow-xs">
                Hola {nombreDropshipper} <span className="inline-block text-2xl animate-bounce">👋</span>
              </h2>
              <p className="text-lg font-extrabold text-white mt-0.5 tracking-tight drop-shadow-xs">
                Datos y acuerdos del canal
              </p>
            </div>

            {/* Contenido: Botón al chat y Ficha de datos */}
            <div className="px-6 space-y-3.5 pb-6 flex-1">
              
              {/* Botón Volver al Chat */}
              <div
                onClick={() => setActiveTab('chat')}
                className="bg-white rounded-2xl p-4 shadow-md border border-slate-100 flex items-center justify-between gap-3 cursor-pointer hover:border-orange-300 hover:shadow-lg transition-all group"
                style={{ boxShadow: '0 8px 25px -4px rgba(0, 0, 0, 0.08)' }}
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-extrabold text-slate-900 group-hover:text-[#ed7c28] transition-colors">
                      Volver a la Conversación
                    </h3>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Chatea en vivo y acuerda negociaciones
                  </p>
                </div>

                <div 
                  className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-colors"
                  style={{ backgroundColor: '#fff7ed', color: '#ed7c28' }}
                >
                  <ChevronRight size={18} strokeWidth={2.5} />
                </div>
              </div>

              {/* Ficha de Información (Sin WhatsApp, solo teléfono y correo) */}
              <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-200/80 space-y-3 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Store size={13} className="text-[#ed7c28]" />
                    Datos del Dropshipper
                  </span>
                  <span className="font-mono text-[11px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                    ID: {idDropshipper}
                  </span>
                </div>

                {/* Nombre */}
                <div className="flex items-center justify-between py-1">
                  <div className="flex items-center gap-2.5 text-slate-600">
                    <User size={15} className="text-slate-400 shrink-0" />
                    <span className="truncate font-semibold text-slate-800 text-xs">{nombreDropshipper}</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                    Verificado
                  </span>
                </div>

                {/* Teléfono (Sin WhatsApp, solo botón de copiar) */}
                <div className="flex items-center justify-between py-1 border-t border-slate-50">
                  <div className="flex items-center gap-2.5 text-slate-600">
                    <Phone size={15} className="text-emerald-600 shrink-0" />
                    <span className="font-semibold text-slate-800 font-mono text-xs">{telefonoDropshipper}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => copyToClipboard(telefonoDropshipper, 'tel')}
                    className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition cursor-pointer"
                    title="Copiar teléfono"
                  >
                    {copiedField === 'tel' ? <Check size={13} className="text-emerald-600" /> : <Copy size={13} />}
                  </button>
                </div>

                {/* Correo Electrónico */}
                <div className="flex items-center justify-between py-1 border-t border-slate-50">
                  <div className="flex items-center gap-2.5 text-slate-600 min-w-0 pr-2">
                    <Mail size={15} className="text-blue-500 shrink-0" />
                    <span className="truncate font-semibold text-slate-800 text-xs">{correoDropshipper}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => copyToClipboard(correoDropshipper, 'mail')}
                    className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition cursor-pointer shrink-0"
                    title="Copiar correo"
                  >
                    {copiedField === 'mail' ? <Check size={13} className="text-emerald-600" /> : <Copy size={13} />}
                  </button>
                </div>
              </div>

              {/* Respaldo */}
              <div className="bg-white/90 rounded-2xl p-3.5 border border-orange-100 text-[11px] text-slate-600 flex items-start gap-2.5 shadow-2xs">
                <ShieldCheck size={17} className="text-emerald-600 shrink-0 mt-0.5" />
                <p className="leading-snug">
                  Canal directo de contacto para acuerdos comerciales, revisión de fletes y stock privado.
                </p>
              </div>

            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* BARRA INFERIOR DE 2 PESTAÑAS (INICIO Y CHAT)             */}
        {/* ======================================================== */}
        <div 
          className="bg-white border-t border-slate-200 grid grid-cols-2 shrink-0 select-none shadow-lg"
          style={{ height: '60px' }}
        >
          {/* Tab 1: Inicio (Ficha de Datos) */}
          <button
            type="button"
            onClick={() => setActiveTab('inicio')}
            className={`flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
              activeTab === 'inicio' ? 'text-[#ed7c28]' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <div className={`w-5 h-5 flex items-center justify-center transition-transform ${
              activeTab === 'inicio' ? 'scale-110' : ''
            }`}>
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill={activeTab === 'inicio' ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                <polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
            </div>
            <span className={`text-[11px] ${activeTab === 'inicio' ? 'font-black text-[#ed7c28]' : 'font-medium'}`}>
              Inicio (Datos)
            </span>
          </button>

          {/* Tab 2: Chat Directo */}
          <button
            type="button"
            onClick={() => setActiveTab('chat')}
            className={`flex flex-col items-center justify-center gap-1 transition-all cursor-pointer relative ${
              activeTab === 'chat' ? 'text-[#ed7c28]' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <div className={`w-5 h-5 flex items-center justify-center transition-transform ${
              activeTab === 'chat' ? 'scale-110' : ''
            }`}>
              <MessageSquare size={18} className={activeTab === 'chat' ? 'stroke-[2.5]' : 'stroke-2'} />
            </div>
            <span className={`text-[11px] ${activeTab === 'chat' ? 'font-black text-[#ed7c28]' : 'font-medium'}`}>
              Chat Directo
            </span>
            <span className="absolute top-2 right-14 w-2 h-2 rounded-full bg-[#ed7c28]"></span>
          </button>
        </div>

      </div>
    </div>
  );
}
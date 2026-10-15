'use client';

import React, { useState } from 'react';
import { X, Send, ArrowRight, MessageCircle, Home, MessageSquare } from 'lucide-react';
import { BusinessContactInfo } from '@/data/negociosData';
import ChatQuickActions from './ChatQuickActions';

interface InternalChatWidgetProps {
  business: BusinessContactInfo | null;
  onClose: () => void;
}

interface MessageItem {
  id: string;
  sender: 'proveedor' | 'negocio';
  text: string;
  timestamp: string;
}

export default function InternalChatWidget({ business, onClose }: InternalChatWidgetProps) {
  const [activeTab, setActiveTab] = useState<'inicio' | 'mensajes'>('mensajes');
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<MessageItem[]>([
    {
      id: '1',
      sender: 'negocio',
      text: '¡Hola! Recibí la notificación sobre pedidos pendientes de entrega. ¿En qué podemos apoyarte?',
      timestamp: '10:14 a. m.'
    }
  ]);

  if (!business) return null;

  const handleSendMessage = () => {
    if (!inputText.trim()) return;
    const newMsg: MessageItem = {
      id: Date.now().toString(),
      sender: 'proveedor',
      text: inputText.trim(),
      timestamp: 'Ahora'
    };
    setMessages(prev => [...prev, newMsg]);
    setInputText('');
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 w-96 max-w-[calc(100vw-40px)] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col border border-orange-200/50 animate-slideUp font-sans">
      {/* Cabecera Dropi */}
      <div className="bg-gradient-to-b from-[#f97316] to-[#ea580c] text-white p-5 relative">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xl font-black tracking-tight flex items-center gap-1">
            <span className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs">🤖</span>
            dropi
          </span>
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              <div className="w-7 h-7 rounded-full border-2 border-white bg-amber-200 flex items-center justify-center text-[10px] text-amber-800 font-bold">P</div>
              <div className="w-7 h-7 rounded-full border-2 border-white bg-blue-600 flex items-center justify-center text-[10px] text-white font-bold">E</div>
            </div>
            <button onClick={onClose} className="text-white/80 hover:text-white p-1 rounded-full hover:bg-black/10 transition-colors ml-1">
              <X size={18} />
            </button>
          </div>
        </div>

        <h3 className="text-lg font-bold leading-tight">Hola {business.tiendaNombre} 👋</h3>
        <p className="text-xs text-white/90 mt-0.5">Canal de gestión directa Proveedor ↔ Dropshipper</p>

        {activeTab === 'inicio' && (
          <button
            onClick={() => setActiveTab('mensajes')}
            className="mt-4 w-full bg-white text-gray-800 px-4 py-3 rounded-2xl flex items-center justify-between text-xs font-semibold shadow-md hover:bg-gray-50 transition-all"
          >
            <span>Envíanos un mensaje</span>
            <ArrowRight size={16} className="text-orange-500" />
          </button>
        )}
      </div>

      {activeTab === 'mensajes' ? (
        <div className="flex-1 bg-[#F8FAFC] flex flex-col h-80">
          {/* Listado de mensajes */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs">
            {messages.map((m) => (
              <div key={m.id} className={`flex flex-col ${m.sender === 'proveedor' ? 'items-end' : 'items-start'}`}>
                <div className={`p-3 rounded-2xl max-w-[85%] leading-relaxed ${
                  m.sender === 'proveedor'
                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-br-none shadow-sm'
                    : 'bg-white text-gray-800 border border-gray-200/80 rounded-bl-none shadow-sm'
                }`}>
                  {m.text}
                </div>
                <span className="text-[10px] text-gray-400 mt-1 px-1">{m.timestamp}</span>
              </div>
            ))}
          </div>

          {/* Componente de Plantillas Rápidas Modularizado */}
          <ChatQuickActions
            tiendaNombre={business.tiendaNombre}
            onSelectAction={(tplText) => setInputText(tplText)}
          />

          {/* Input de Envío */}
          <div className="p-3 bg-white border-t border-gray-200 flex items-center gap-2">
            <input
              type="text"
              placeholder="Escribe un mensaje para el negocio..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              className="flex-1 bg-gray-100 rounded-xl px-3.5 py-2 text-xs text-gray-800 outline-none focus:ring-1 focus:ring-orange-500"
            />
            <button
              onClick={handleSendMessage}
              className="w-8 h-8 rounded-xl bg-orange-500 text-white flex items-center justify-center hover:bg-orange-600 transition-colors shrink-0 shadow-sm shadow-orange-500/30"
            >
              <Send size={14} />
            </button>
          </div>
        </div>
      ) : (
        <div className="p-6 bg-[#F8FAFC] flex-1 flex flex-col justify-center items-center text-center">
          <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center mb-3">
            <MessageCircle size={24} />
          </div>
          <h4 className="text-sm font-bold text-gray-800">Bandeja de Conversación</h4>
          <p className="text-xs text-gray-500 mt-1 max-w-xs">
            Comunícate en tiempo real con {business.nombreTitular} para resolver novedades operativas.
          </p>
          <button
            onClick={() => setActiveTab('mensajes')}
            className="mt-4 px-4 py-2 bg-orange-500 text-white text-xs font-semibold rounded-xl hover:bg-orange-600 transition-colors shadow-md shadow-orange-500/20"
          >
            Ver Conversación
          </button>
        </div>
      )}

      {/* Tabs Inferiores */}
      <div className="bg-white border-t border-gray-200 grid grid-cols-2 py-2 text-center text-xs text-gray-500">
        <button
          onClick={() => setActiveTab('inicio')}
          className={`flex flex-col items-center py-1 transition-colors ${activeTab === 'inicio' ? 'text-orange-500 font-bold' : 'hover:text-gray-800'}`}
        >
          <Home size={16} />
          <span className="text-[10px] mt-0.5">Inicio</span>
        </button>
        <button
          onClick={() => setActiveTab('mensajes')}
          className={`flex flex-col items-center py-1 transition-colors ${activeTab === 'mensajes' ? 'text-orange-500 font-bold' : 'hover:text-gray-800'}`}
        >
          <MessageSquare size={16} />
          <span className="text-[10px] mt-0.5">Mensajes</span>
        </button>
      </div>
    </div>
  );
}
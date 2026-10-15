'use client';

import React from 'react';
import { CHAT_QUICK_TEMPLATES, QuickActionTemplate } from '@/data/chatTemplates';

interface ChatQuickActionsProps {
  tiendaNombre: string;
  onSelectAction: (messageText: string) => void;
}

export default function ChatQuickActions({ tiendaNombre, onSelectAction }: ChatQuickActionsProps) {
  return (
    <div className="px-3 py-2 bg-gray-100/90 border-t border-gray-200 flex gap-2 overflow-x-auto no-scrollbar">
      {CHAT_QUICK_TEMPLATES.map((tpl: QuickActionTemplate) => (
        <button
          key={tpl.id}
          type="button"
          onClick={() => onSelectAction(tpl.getFormattedMessage(tiendaNombre))}
          className="bg-white border border-gray-300 text-gray-700 hover:text-orange-600 hover:border-orange-400 hover:bg-orange-50/50 px-3 py-1.5 rounded-full text-[11px] font-medium whitespace-nowrap transition-all shadow-sm flex items-center gap-1.5 shrink-0"
        >
          <span>{tpl.icon}</span>
          <span>{tpl.label}</span>
        </button>
      ))}
    </div>
  );
}
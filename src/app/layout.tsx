// src/app/layout.tsx
import type { Metadata } from 'next';
import './globals.css';
import Sidebar from '@/components/Sidebar';

export const metadata: Metadata = {
  title: 'Dropi · ATOM PRO',
  description: 'Centro de comando logístico y análisis operativo',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="bg-[#F8FAFC] antialiased">
        <div className="min-h-screen flex">
          {/* Menú Lateral Estático (Izquierda como en la imagen) */}
          <Sidebar position="left" />

          {/* Contenido Dinámico con margen izquierdo de 64 (256px) */}
          <main className="flex-1 pl-64 min-w-0 overflow-x-hidden">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}

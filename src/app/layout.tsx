// src/app/layout.tsx
import './globals.css';
import Sidebar from '@/components/Sidebar'; // Ajusta la ruta si lo tienes en '@/app/Sidebar'

export const metadata = {
  title: 'Dropi · ATOM PRO',
  description: 'Control de logística y rentabilidad',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="bg-[#F8FAFC] antialiased">
        <div className="flex min-h-screen w-full">
          {/* Sidebar compatible tanto con position="left" como sin props */}
          <Sidebar position="left" />

          {/* Contenedor principal fluido */}
          <main className="flex-1 min-w-0 overflow-x-hidden">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}

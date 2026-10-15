// src/app/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import DashboardLayout from '@/components/DashboardLayout';
import EficienciaLogistica from '@/components/EficienciaLogistica';
import Rendimiento from '@/components/Rendimiento';
import Productos from '@/components/Productos';
import Negocios from '@/components/Negocios';
import Transportadoras from '@/components/Transportadoras';
import PanelAlertas from '@/components/PanelAlertas';
import DetalleGuias from '@/components/DetalleGuias';

// Definición de la interfaz local para no depender de archivos externos
export interface GuiaData {
  id: string;
  tipo_estado: string;
  estado: string;
  dias_gestion: number;
  ult_movimiento: number;
  dev_en_bodega: string;
  recaudo_proveedor: number;
  fecha_creacion: string;
}

// Adaptadores para permitir la prop data opcional sin error de tipado en TypeScript
const EficienciaComponent = EficienciaLogistica as React.ComponentType<{ data?: GuiaData[] }>;
const RendimientoComponent = Rendimiento as React.ComponentType<{ data?: GuiaData[] }>;

// Generador de datos de respaldo en memoria si no existe el archivo CSV en /public
const generateFallbackGuiasData = (): GuiaData[] => {
  const sampleData: GuiaData[] = [];
  const estados = [
    { tipo: 'Finalizada', estado: 'ENTREGADO', peso: 75 },
    { tipo: 'En Curso', estado: 'EN REPARTO', peso: 10 },
    { tipo: 'En novedad', estado: 'NOVEDAD', peso: 6 },
    { tipo: 'En devolución', estado: 'DEVOLUCION', peso: 5 },
    { tipo: 'Pendiente', estado: 'PENDIENTE', peso: 2 },
    { tipo: 'Pendiente por confirmacion', estado: 'PENDIENTE CONFIRMACION', peso: 2 }
  ];

  for (let i = 1; i <= 1660; i++) {
    const rand = Math.random() * 100;
    let acc = 0;
    let selectedState = estados[0];

    for (const st of estados) {
      acc += st.peso;
      if (rand <= acc) {
        selectedState = st;
        break;
      }
    }

    const ultMov = selectedState.tipo === 'Finalizada' ? 0 : Math.floor(Math.random() * 8);
    const diasGest = selectedState.tipo === 'Finalizada' ? 0 : ultMov + Math.floor(Math.random() * 12);
    const devEnBodega = selectedState.tipo === 'En devolución' ? (Math.random() > 0.3 ? 'SI' : 'NO') : '';
    const recaudo = Math.floor(Math.random() * 80000) + 25000;

    sampleData.push({
      id: `${93000000 + i}`,
      tipo_estado: selectedState.tipo,
      estado: selectedState.estado,
      dias_gestion: diasGest,
      ult_movimiento: ultMov,
      dev_en_bodega: devEnBodega,
      recaudo_proveedor: recaudo,
      fecha_creacion: `2026-10-${String((i % 30) + 1).padStart(2, '0')}`
    });
  }

  return sampleData;
};

export default function Page() {
  const [activeTab, setActiveTab] = useState('eficiencia');
  const [data, setData] = useState<GuiaData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      try {
        const res = await fetch('/datos_guias.csv');

        if (res.ok) {
          const text = await res.text();

          Papa.parse(text, {
            header: true,
            skipEmptyLines: true,
            complete: (results: any) => {
              if (!isMounted) return;

              if (results?.data && Array.isArray(results.data) && results.data.length > 0) {
                const clean: GuiaData[] = results.data.map((row: any) => ({
                  id: String(row['ID'] || row['id'] || row['Guía'] || ''),
                  tipo_estado: String(row['Tipo de estado'] || row['tipo_estado'] || ''),
                  estado: String(row['Estado'] || row['estado'] || ''),
                  dias_gestion: Number(row['Días en gestión'] || row['dias_gestion']) || 0,
                  ult_movimiento: Number(row['Ult. movimiento'] || row['Último movimiento'] || row['ult_movimiento']) || 0,
                  dev_en_bodega: String(row['Dev. en bodega'] || row['Devolución a bodega'] || row['dev_en_bodega'] || ''),
                  recaudo_proveedor: Number(String(row['Recaudo proveedor'] || '0').replace(/[^0-9.-]+/g, '')) || 0,
                  fecha_creacion: String(row['Fecha creación'] || row['Fecha de creación'] || row['fecha_creacion'] || ''),
                }));
                setData(clean);
              } else {
                setData(generateFallbackGuiasData());
              }
              setLoading(false);
            },
            error: () => {
              if (isMounted) {
                setData(generateFallbackGuiasData());
                setLoading(false);
              }
            }
          });
        } else {
          if (isMounted) {
            setData(generateFallbackGuiasData());
            setLoading(false);
          }
        }
      } catch {
        if (isMounted) {
          setData(generateFallbackGuiasData());
          setLoading(false);
        }
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <DashboardLayout activeTab={activeTab} setActiveTab={setActiveTab}>
      {loading ? (
        <div className="flex h-full items-center justify-center min-h-[400px]">
          <div className="p-8 text-center text-sm font-semibold text-slate-500 animate-pulse border border-slate-200 rounded-2xl bg-white shadow-sm">
            Cargando Base de Datos Khronos...
          </div>
        </div>
      ) : (
        <>
          {activeTab === 'eficiencia' && <EficienciaComponent data={data} />}
          {activeTab === 'rendimiento' && <RendimientoComponent data={data} />}
          {activeTab === 'productos' && <Productos />}
          {activeTab === 'negocios' && <Negocios />}
          {activeTab === 'transportadoras' && <Transportadoras />}
          {activeTab === 'alertas' && <PanelAlertas />}
          {activeTab === 'guias' && <DetalleGuias />}

          {activeTab !== 'eficiencia' &&
            activeTab !== 'rendimiento' &&
            activeTab !== 'alertas' &&
            activeTab !== 'productos' &&
            activeTab !== 'negocios' &&
            activeTab !== 'transportadoras' &&
            activeTab !== 'guias' && (
              <div className="p-8 text-center text-xs text-slate-400 border border-dashed border-slate-200 rounded-2xl mt-8 bg-white">
                Módulo "{activeTab}" en construcción.
              </div>
            )}
        </>
      )}
    </DashboardLayout>
  );
}
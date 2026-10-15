// src/components/Transportadoras.tsx
'use client';

import React, { useState, useMemo } from 'react';
import { 
  Share2, ChevronDown, CheckCircle2 
} from 'lucide-react';
import { 
  CARRIERS_BENCHMARK_DATA, 
  descargarExcelTop3Destinos 
} from '@/data/transportadorasData';
import FiltroFecha from '@/components/filtros/FiltroFecha';

// --- BASE DE DATOS MAESTRA DE TRANSPORTADORAS POR DESTINO ---
interface BaseCarrierStats {
  transportadora: string;
  velocidadDias: number;
  devolucionPct: number;
}

const DESTINOS_BASE: Record<string, Record<string, BaseCarrierStats[]>> = {
  'Cundinamarca': {
    'Bogotá D.C.': [
      { transportadora: 'Coordinadora', velocidadDias: 1.4, devolucionPct: 5.2 },
      { transportadora: 'Envia', velocidadDias: 1.7, devolucionPct: 6.8 },
      { transportadora: 'Veloces', velocidadDias: 1.8, devolucionPct: 7.4 },
      { transportadora: 'Interrapidisimo', velocidadDias: 1.9, devolucionPct: 8.1 },
      { transportadora: 'Domina', velocidadDias: 2.5, devolucionPct: 12.0 },
    ],
    'Soacha': [
      { transportadora: 'Coordinadora', velocidadDias: 1.8, devolucionPct: 7.2 },
      { transportadora: 'Envia', velocidadDias: 1.9, devolucionPct: 8.5 },
      { transportadora: 'Interrapidisimo', velocidadDias: 2.0, devolucionPct: 9.1 },
    ]
  },
  'Antioquia': {
    'Medellín': [
      { transportadora: 'Envia', velocidadDias: 1.6, devolucionPct: 5.8 },
      { transportadora: 'Coordinadora', velocidadDias: 1.8, devolucionPct: 6.4 },
      { transportadora: 'Tcc', velocidadDias: 1.9, devolucionPct: 7.2 },
      { transportadora: 'Veloces', velocidadDias: 1.9, devolucionPct: 8.5 },
      { transportadora: 'Interrapidisimo', velocidadDias: 2.2, devolucionPct: 10.4 },
    ],
    'Bello': [
      { transportadora: 'Coordinadora', velocidadDias: 1.7, devolucionPct: 5.0 },
      { transportadora: 'Veloces', velocidadDias: 1.8, devolucionPct: 8.2 },
      { transportadora: 'Interrapidisimo', velocidadDias: 2.1, devolucionPct: 11.6 },
      { transportadora: 'Envia', velocidadDias: 2.0, devolucionPct: 13.1 },
    ]
  },
  'Valle del Cauca': {
    'Cali': [
      { transportadora: 'Tcc', velocidadDias: 2.0, devolucionPct: 6.9 },
      { transportadora: 'Coordinadora', velocidadDias: 2.1, devolucionPct: 8.2 },
      { transportadora: 'Envia', velocidadDias: 2.3, devolucionPct: 9.5 },
      { transportadora: 'Interrapidisimo', velocidadDias: 2.5, devolucionPct: 11.2 },
    ],
    'Palmira': [
      { transportadora: 'Coordinadora', velocidadDias: 2.0, devolucionPct: 7.5 },
      { transportadora: 'Envia', velocidadDias: 2.2, devolucionPct: 8.8 },
      { transportadora: 'Interrapidisimo', velocidadDias: 2.4, devolucionPct: 10.1 },
    ]
  },
  'Atlántico': {
    'Barranquilla': [
      { transportadora: 'Interrapidisimo', velocidadDias: 2.4, devolucionPct: 9.4 },
      { transportadora: 'Coordinadora', velocidadDias: 2.7, devolucionPct: 11.0 },
      { transportadora: 'Envia', velocidadDias: 2.8, devolucionPct: 12.3 },
    ]
  },
  'Santander': {
    'Bucaramanga': [
      { transportadora: 'Coordinadora', velocidadDias: 2.1, devolucionPct: 7.1 },
      { transportadora: 'Tcc', velocidadDias: 2.3, devolucionPct: 8.9 },
      { transportadora: 'Envia', velocidadDias: 2.5, devolucionPct: 10.4 },
    ]
  },
  'Bolívar': {
    'Cartagena': [
      { transportadora: 'Interrapidisimo', velocidadDias: 2.8, devolucionPct: 11.5 },
      { transportadora: 'Coordinadora', velocidadDias: 3.0, devolucionPct: 13.8 },
      { transportadora: 'Envia', velocidadDias: 3.2, devolucionPct: 15.2 },
    ]
  },
  'Amazonas': {
    'Leticia': [
      { transportadora: 'Interrapidisimo', velocidadDias: 0.0, devolucionPct: 100.0 }
    ]
  }
};

const DEPARTAMENTOS_LIST = [
  '(Todos)',
  'Cundinamarca',
  'Antioquia',
  'Valle del Cauca',
  'Atlántico',
  'Santander',
  'Bolívar',
  'Amazonas'
];

const PRODUCTOS_LIST = [
  '(Todos)',
  '2und Ventilador 3 en 1 de 18 pulgadas',
  'Audifonos Diadema JBL Tune 770 NC',
  'Alcancia Figura Pintura Diamante',
  'Dildo consolador realista termico',
  'Pañalera morral tipo cuna con cambiador'
];

const COMUNIDADES_LIST = [
  '(Todas)',
  'Comunidad Élite',
  'Comunidad Master',
  'Comunidad Rocket'
];

export default function Transportadoras() {
  const [dateFrom, setDateFrom] = useState('2026-10-01');
  const [dateTo, setDateTo] = useState('2026-10-31');

  // Estados de los 4 filtros del Ranking de Rentabilidad
  const [selectedDepto, setSelectedDepto] = useState<string>('Cundinamarca');
  const [selectedCiudad, setSelectedCiudad] = useState<string>('Bogotá D.C.');
  const [selectedProducto, setSelectedProducto] = useState<string>('(Todos)');
  const [selectedComunidad, setSelectedComunidad] = useState<string>('(Todas)');

  const [notification, setNotification] = useState<string | null>(null);

  // Selector dinámico de ciudades dependiente del departamento
  const ciudadesDisponibles = useMemo(() => {
    if (selectedDepto === '(Todos)') {
      const allCiudades = Object.values(DESTINOS_BASE).flatMap((ciudades) => Object.keys(ciudades));
      return ['(Todas)', ...Array.from(new Set(allCiudades))];
    }
    const ciudadesDepto = Object.keys(DESTINOS_BASE[selectedDepto] || {});
    return ['(Todas)', ...ciudadesDepto];
  }, [selectedDepto]);

  // Manejo reactivo de cambio de departamento
  const handleDeptoChange = (depto: string) => {
    setSelectedDepto(depto);
    if (depto === 'Cundinamarca') setSelectedCiudad('Bogotá D.C.');
    else if (depto === 'Antioquia') setSelectedCiudad('Medellín');
    else if (depto === 'Valle del Cauca') setSelectedCiudad('Cali');
    else if (depto === 'Amazonas') setSelectedCiudad('Leticia');
    else setSelectedCiudad('(Todas)');
  };

  // Motor reactivo de cálculo: ajusta la tabla cuando cambia CUALQUIERA de los 4 filtros
  const tableRows = useMemo(() => {
    let pool: { depto: string; ciudad: string; carrier: BaseCarrierStats }[] = [];

    // 1. Filtrado por Departamento y Ciudad
    if (selectedDepto === '(Todos)') {
      Object.entries(DESTINOS_BASE).forEach(([dep, ciudades]) => {
        Object.entries(ciudades).forEach(([ciu, carriers]) => {
          if (selectedCiudad === '(Todas)' || selectedCiudad === ciu) {
            carriers.forEach((c) => pool.push({ depto: dep, ciudad: ciu, carrier: c }));
          }
        });
      });
    } else {
      const deptoData = DESTINOS_BASE[selectedDepto] || {};
      if (selectedCiudad === '(Todas)') {
        Object.entries(deptoData).forEach(([ciu, carriers]) => {
          carriers.forEach((c) => pool.push({ depto: selectedDepto, ciudad: ciu, carrier: c }));
        });
      } else {
        const carriers = deptoData[selectedCiudad] || [];
        carriers.forEach((c) => pool.push({ depto: selectedDepto, ciudad: selectedCiudad, carrier: c }));
      }
    }

    // 2. Modificador dinámico según Producto
    let prodVelMod = 0;
    let prodDevMod = 0;
    if (selectedProducto === '2und Ventilador 3 en 1 de 18 pulgadas') {
      prodVelMod = 0.2; // Paquete grande/pesado
      prodDevMod = 1.1;
    } else if (selectedProducto === 'Audifonos Diadema JBL Tune 770 NC') {
      prodVelMod = -0.1; // Paquete liviano ágil
      prodDevMod = -0.6;
    } else if (selectedProducto === 'Dildo consolador realista termico') {
      prodVelMod = 0.0;
      prodDevMod = -0.3;
    } else if (selectedProducto === 'Alcancia Figura Pintura Diamante') {
      prodVelMod = 0.1;
      prodDevMod = 0.4;
    }

    // 3. Modificador dinámico según Comunidad
    let comDevMod = 0;
    if (selectedComunidad === 'Comunidad Élite') {
      comDevMod = -1.0; // Mayor efectividad y confirmación previa
    } else if (selectedComunidad === 'Comunidad Master') {
      comDevMod = -0.5;
    }

    // 4. Proyección final de filas calculadas
    return pool.map((item) => {
      const c = item.carrier;
      const velCalculada = c.velocidadDias === 0.0 ? 0.0 : Math.max(1.1, Number((c.velocidadDias + prodVelMod).toFixed(1)));
      const devCalculada = c.devolucionPct === 100.0 ? 100.0 : Math.min(99.0, Math.max(3.0, Number((c.devolucionPct + prodDevMod + comDevMod).toFixed(1))));

      let accion: 'Rentable' | 'Seguimiento' | 'Intervención' = 'Rentable';
      if (devCalculada >= 25.0) accion = 'Intervención';
      else if (devCalculada >= 8.0) accion = 'Seguimiento';

      return {
        transportadora: c.transportadora,
        ciudad: item.ciudad,
        velocidad: `${velCalculada.toFixed(1)} dias`,
        devolucion: `${devCalculada.toFixed(1)}%`,
        accion
      };
    }).sort((a, b) => parseFloat(a.devolucion) - parseFloat(b.devolucion));
  }, [selectedDepto, selectedCiudad, selectedProducto, selectedComunidad]);

  const handleShareReport = () => {
    descargarExcelTop3Destinos();
    setNotification('¡Reporte generado! Excel con el Top 3 y Efectividad (%) descargado con éxito.');
    setTimeout(() => setNotification(null), 4000);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 p-6 font-sans relative space-y-6">
      
      {/* Notificación flotante de descarga de Excel */}
      {notification && (
        <div className="fixed top-6 right-6 z-50 bg-emerald-500 text-slate-950 px-4 py-3 rounded-xl font-bold shadow-2xl flex items-center gap-2 animate-bounce border border-emerald-300">
          <CheckCircle2 size={18} />
          <span>{notification}</span>
        </div>
      )}

      {/* 1. CABECERA: TÍTULO, SUBTÍTULO, BOTÓN EXCEL Y FILTRO FECHA */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Transportadoras</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Contrasta la operación propia del proveedor contra el mercado para identificar ineficiencias internas o fallas generales de la transportadora.
          </p>
        </div>

        <div className="flex items-end gap-3">
          <button
            type="button"
            onClick={handleShareReport}
            className="bg-white border border-slate-300 hover:border-orange-400 hover:text-orange-600 text-slate-700 font-semibold px-4 py-2 rounded-xl flex items-center gap-2 shadow-sm text-xs transition-all active:scale-95 cursor-pointer"
            title="Descargar Excel con Efectividad de Entrega % y Top 3 por Destino"
          >
            <Share2 size={14} className="text-orange-500" />
            <span>Compartir Ranking con Tiendas</span>
          </button>

          <FiltroFecha
            startDate={dateFrom}
            endDate={dateTo}
            onApply={(start, end) => {
              setDateFrom(start);
              setDateTo(end);
            }}
          />
        </div>
      </div>

      {/* 2. LAS 3 TARJETAS COMPARATIVAS (VISUAL EXACTA DE LA IMAGEN DE REFERENCIA) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Tarjeta 1: Tiempo Promedio de Entrega */}
        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <span className="text-[11px] font-bold tracking-wider text-slate-500 uppercase block mb-1">
              TIEMPO PROMEDIO DE ENTREGA
            </span>
            <p className="text-3xl lg:text-4xl font-extrabold text-[#f97316] tracking-tight">
              2.1 Días
            </p>
          </div>
          <p className="text-xs text-slate-500 mt-3 font-medium">
            Mi Cuenta: 2.1 días • Promedio Nacional: 2.8 días (-0.7d más ágil)
          </p>
        </div>

        {/* Tarjeta 2: Mejor Transportadora */}
        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <span className="text-[11px] font-bold tracking-wider text-slate-500 uppercase block mb-1">
              MAYOR EFECTIVIDAD TRANSPORTADORA (COORDINADORA)
            </span>
            <p className="text-3xl lg:text-4xl font-extrabold text-[#f97316] tracking-tight">
              67.0%
            </p>
          </div>
          <p className="text-xs text-slate-500 mt-3 font-medium">
            Mi Cuenta: 67% • Promedio Nacional: 44% (+23% sobre la media)
          </p>
        </div>

        {/* Tarjeta 3: Peor Transportadora */}
        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <span className="text-[11px] font-bold tracking-wider text-slate-500 uppercase block mb-1">
              MAYOR EFECTIVIDAD TRANSPORTADORA (JAMV DRIVE)
            </span>
            <p className="text-3xl lg:text-4xl font-extrabold text-[#f97316] tracking-tight">
              20.0%
            </p>
          </div>
          <p className="text-xs text-slate-500 mt-3 font-medium">
            Mi Cuenta: 20% • Promedio Nacional: 43% (-23% bajo la media)
          </p>
        </div>

      </div>

      {/* 3. BLOQUE DUAL PRINCIPAL (RANKING DESTINO + BENCHMARKING NACIONAL) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        
        {/* PANEL IZQUIERDO: RANKING DE RENTABILIDAD POR DESTINO (IDÉNTICO A LA CAPTURA) */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm space-y-5">
          <div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              Ranking de Rentabilidad por Destino
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Cruza Ciudad, Departamento y Producto para ver la mejor transportadora.
            </p>
          </div>

          {/* Grilla de los 4 Selectores Dropdown */}
          <div className="grid grid-cols-2 gap-3.5">
            {/* 1. Departamento */}
            <div className="flex flex-col gap-1">
              <label className="text-[11px] text-slate-500 font-medium ml-0.5">Departamento</label>
              <div className="relative">
                <select
                  value={selectedDepto}
                  onChange={(e) => handleDeptoChange(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-700 shadow-sm outline-none hover:border-slate-400 focus:border-slate-500 appearance-none pr-8 cursor-pointer transition-colors"
                >
                  {DEPARTAMENTOS_LIST.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
                <ChevronDown size={14} className="text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* 2. Ciudad */}
            <div className="flex flex-col gap-1">
              <label className="text-[11px] text-slate-500 font-medium ml-0.5">Ciudad</label>
              <div className="relative">
                <select
                  value={selectedCiudad}
                  onChange={(e) => setSelectedCiudad(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-700 shadow-sm outline-none hover:border-slate-400 focus:border-slate-500 appearance-none pr-8 cursor-pointer transition-colors"
                >
                  {ciudadesDisponibles.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <ChevronDown size={14} className="text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* 3. Producto */}
            <div className="flex flex-col gap-1">
              <label className="text-[11px] text-slate-500 font-medium ml-0.5">Producto</label>
              <div className="relative">
                <select
                  value={selectedProducto}
                  onChange={(e) => setSelectedProducto(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-700 shadow-sm outline-none hover:border-slate-400 focus:border-slate-500 appearance-none pr-8 cursor-pointer transition-colors truncate"
                >
                  {PRODUCTOS_LIST.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
                <ChevronDown size={14} className="text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* 4. Comunidad */}
            <div className="flex flex-col gap-1">
              <label className="text-[11px] text-slate-500 font-medium ml-0.5">Comunidad</label>
              <div className="relative">
                <select
                  value={selectedComunidad}
                  onChange={(e) => setSelectedComunidad(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-700 shadow-sm outline-none hover:border-slate-400 focus:border-slate-500 appearance-none pr-8 cursor-pointer transition-colors"
                >
                  {COMUNIDADES_LIST.map((com) => (
                    <option key={com} value={com}>{com}</option>
                  ))}
                </select>
                <ChevronDown size={14} className="text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Tabla de Transportadoras para el Destino */}
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider bg-slate-50/50">
                  <th className="py-3.5 px-4 font-bold">TRANSPORTADORA</th>
                  <th className="py-3.5 px-3 text-center font-bold">VELOCIDAD DE ENTREGA</th>
                  <th className="py-3.5 px-3 text-center font-bold">TASA DE DEVOLUCIÓN</th>
                  <th className="py-3.5 px-4 text-center font-bold">ACCIÓN</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {tableRows.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-slate-400 font-medium">
                      No hay registros para este destino.
                    </td>
                  </tr>
                ) : (
                  tableRows.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-slate-800">
                        {row.transportadora} {selectedCiudad === '(Todas)' ? <span className="text-[10px] text-slate-400 font-normal">({row.ciudad})</span> : null}
                      </td>
                      <td className="py-3.5 px-3 text-center text-slate-600 font-medium">
                        {row.velocidad}
                      </td>
                      <td className="py-3.5 px-3 text-center text-slate-700 font-bold">
                        {row.devolucion}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span className={`px-4 py-1 rounded-full text-xs font-semibold border ${
                          row.accion === 'Rentable'
                            ? 'bg-emerald-50/40 text-emerald-600 border-emerald-300'
                            : row.accion === 'Seguimiento'
                            ? 'bg-amber-50/40 text-amber-600 border-amber-300'
                            : 'bg-rose-50/40 text-rose-500 border-rose-300'
                        }`}>
                          {row.accion}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* PANEL DERECHO: BENCHMARKING NACIONAL DE TRANSPORTADORAS */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm space-y-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              Benchmarking Nacional de Transportadoras
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Mi Tasa vs Promedio Nacional — % de entrega efectiva.
            </p>
          </div>

          {/* Listado de las 9 Transportadoras */}
          <div className="space-y-3.5 pt-1">
            {CARRIERS_BENCHMARK_DATA.map((c) => {
              const isUnderperforming = c.miTasa < c.promedioNacional;

              return (
                <div key={c.nombre} className="space-y-1">
                  <span className="text-[13px] font-bold text-slate-800 block">
                    {c.nombre}
                  </span>

                  {/* Barra 1: Mi Tasa */}
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] text-slate-400 w-28 shrink-0">
                      Mi Tasa
                    </span>
                    <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isUnderperforming ? 'bg-[#ef4444]' : 'bg-[#00c9a7]'
                        }`}
                        style={{ width: `${c.miTasa}%` }}
                      />
                    </div>
                    <span className={`text-[12px] w-9 text-right font-bold ${
                      isUnderperforming ? 'text-[#ef4444]' : 'text-slate-800'
                    }`}>
                      {c.miTasa}%
                    </span>
                  </div>

                  {/* Barra 2: Promedio Nacional */}
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] text-slate-400 w-28 shrink-0">
                      Promedio Nacional
                    </span>
                    <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#f97316] rounded-full transition-all duration-500"
                        style={{ width: `${c.promedioNacional}%` }}
                      />
                    </div>
                    <span className="text-[12px] w-9 text-right font-bold text-slate-800">
                      {c.promedioNacional}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Leyenda Inferior */}
          <div className="flex items-center gap-5 pt-3 border-t border-slate-100 text-[11px] text-slate-600 font-medium">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#ef4444]" />
              <span>Bajo Rendimiento</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#f97316]" />
              <span>Promedio Nacional</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
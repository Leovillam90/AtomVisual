// src/app/transportadoras/page.tsx
'use client';

import React, { useState, useMemo } from 'react';
import { 
  Home, 
  Share2, 
  ChevronDown, 
  CheckCircle2 
} from 'lucide-react';
import { useFiltrosCruzados } from '@/hooks/useFiltrosCruzados';
import FiltroFecha from '@/filtros/FiltroFecha';

// ==========================================
// 1. TIPOS Y MATRIZ LOGÍSTICA BASE
// ==========================================
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
      { transportadora: 'Interrapidisimo', velocidadDias: 4.8, devolucionPct: 32.5 }
    ]
  }
};

const DEPARTAMENTOS_LIST = [
  '(Todos)', 'Cundinamarca', 'Antioquia', 'Valle del Cauca', 'Atlántico', 'Santander', 'Bolívar', 'Amazonas'
];

const PRODUCTOS_LIST = [
  '(Todos)', 'Ventilador 3 en 1 de 18 pulgadas', 'Audifonos Diadema JBL Tune 770 NC', 
  'Alcancia Figura Pintura Diamante', 'Minimotosierra Inalámbrica', 'Pañalera morral tipo cuna con cambiador'
];

const COMUNIDADES_LIST = [
  '(Todas)', 'Comunidad Élite', 'Comunidad Master', 'Comunidad Rocket'
];

// Estándar del mercado logístico en Colombia
const CARRIER_BENCHMARKS_BASE: Record<string, { nombre: string; promedioNacional: number }> = {
  'COORDINADORA': { nombre: 'Coordinadora', promedioNacional: 71.2 },
  'TCC': { nombre: 'Tcc', promedioNacional: 73.5 },
  'ENVIA': { nombre: 'Envia', promedioNacional: 68.4 },
  'INTERRAPIDISIMO': { nombre: 'Interrapidisimo', promedioNacional: 64.0 },
  'VELOCES': { nombre: 'Veloces', promedioNacional: 66.0 },
  'DOMINA': { nombre: 'Domina', promedioNacional: 61.0 }
};

// ==========================================
// 2. COMPONENTE PRINCIPAL
// ==========================================
export default function TransportadorasPage() {
  const {
    filteredData,
    loading,
    dateFrom, setDateFrom,
    dateTo, setDateTo
  } = useFiltrosCruzados();

  const [selectedDepto, setSelectedDepto] = useState<string>('Cundinamarca');
  const [selectedCiudad, setSelectedCiudad] = useState<string>('Bogotá D.C.');
  const [selectedProducto, setSelectedProducto] = useState<string>('(Todos)');
  const [selectedComunidad, setSelectedComunidad] = useState<string>('(Todas)');
  const [notification, setNotification] = useState<string | null>(null);

  // ==========================================
  // CÁLCULO DINÁMICO DE BENCHMARKING DE TRANSPORTADORAS
  // ==========================================
  const resTransportadoras = useMemo(() => {
    const records = Array.isArray(filteredData) ? filteredData : [];

    const stats: Record<string, { total: number; entregados: number }> = {
      'COORDINADORA': { total: 0, entregados: 0 },
      'TCC': { total: 0, entregados: 0 },
      'ENVIA': { total: 0, entregados: 0 },
      'INTERRAPIDISIMO': { total: 0, entregados: 0 },
      'VELOCES': { total: 0, entregados: 0 },
      'DOMINA': { total: 0, entregados: 0 }
    };

    records.forEach((row: any) => {
      const transRaw = String(row.transportadora || row.Transportadora || '').toUpperCase().trim();
      const tipoRaw = String(row.tipoEstado || row['Tipo de estado'] || row.estado || '').toUpperCase();
      const isEntregado = tipoRaw.includes('ENTREG') || tipoRaw.includes('FINALIZ');

      Object.keys(stats).forEach((k) => {
        if (transRaw.includes(k)) {
          stats[k].total += 1;
          if (isEntregado) {
            stats[k].entregados += 1;
          }
        }
      });
    });

    const benchmarkingNacional = Object.entries(CARRIER_BENCHMARKS_BASE).map(([key, def]) => {
      const st = stats[key];
      const miTasa = st && st.total > 0
        ? Number(((st.entregados / st.total) * 100).toFixed(1))
        : def.promedioNacional;

      return {
        nombre: def.nombre,
        miTasa,
        promedioNacional: def.promedioNacional,
        totalGuias: st?.total || 0
      };
    }).sort((a, b) => b.miTasa - a.miTasa);

    const transportadorasConData = benchmarkingNacional.filter(b => b.totalGuias > 0);
    const mejor = transportadorasConData.length > 0 
      ? transportadorasConData[0] 
      : { nombre: 'Coordinadora', miTasa: 72.4 };
    const peor = transportadorasConData.length > 0 
      ? transportadorasConData[transportadorasConData.length - 1] 
      : { nombre: 'Interrapidisimo', miTasa: 58.8 };

    return {
      tarjetasKpi: {
        tiempoPromedioEntrega: 2.1,
        promedioNacionalEntrega: 2.4,
        mejorTransportadora: { nombre: mejor.nombre, efectividad: mejor.miTasa },
        peorTransportadora: { nombre: peor.nombre, efectividad: peor.miTasa }
      },
      benchmarkingNacional
    };
  }, [filteredData]);

  // Manejo de cascada Departamento -> Ciudad
  const ciudadesDisponibles = useMemo(() => {
    if (selectedDepto === '(Todos)') {
      const allCiudades = Object.values(DESTINOS_BASE).flatMap((ciudades) => Object.keys(ciudades));
      return ['(Todas)', ...Array.from(new Set(allCiudades))];
    }
    const ciudadesDepto = Object.keys(DESTINOS_BASE[selectedDepto] || {});
    return ['(Todas)', ...ciudadesDepto];
  }, [selectedDepto]);

  const handleDeptoChange = (depto: string) => {
    setSelectedDepto(depto);
    if (depto === 'Cundinamarca') setSelectedCiudad('Bogotá D.C.');
    else if (depto === 'Antioquia') setSelectedCiudad('Medellín');
    else if (depto === 'Valle del Cauca') setSelectedCiudad('Cali');
    else if (depto === 'Amazonas') setSelectedCiudad('Leticia');
    else setSelectedCiudad('(Todas)');
  };

  // Ranking consolidado por transportadora según filtros secundarios
  const tableRows = useMemo(() => {
    const agrupado = new Map<string, { sumVel: number; sumDev: number; count: number }>();

    let prodVelMod = 0;
    let prodDevMod = 0;
    if (selectedProducto.includes('Ventilador')) { prodVelMod = 0.2; prodDevMod = 1.1; }
    else if (selectedProducto.includes('Audifonos')) { prodVelMod = -0.1; prodDevMod = -0.6; }
    else if (selectedProducto.includes('Alcancia')) { prodVelMod = 0.1; prodDevMod = 0.4; }
    else if (selectedProducto.includes('Minimotosierra')) { prodVelMod = 0.0; prodDevMod = -0.2; }

    let comDevMod = 0;
    if (selectedComunidad === 'Comunidad Élite') comDevMod = -1.0;
    else if (selectedComunidad === 'Comunidad Master') comDevMod = -0.5;

    const procesarCarrier = (c: BaseCarrierStats) => {
      const vel = c.velocidadDias === 0 ? 0 : Math.max(1.1, c.velocidadDias + prodVelMod);
      const dev = Math.min(99, Math.max(3, c.devolucionPct + prodDevMod + comDevMod));
      
      const prev = agrupado.get(c.transportadora);
      if (prev) {
        prev.sumVel += vel;
        prev.sumDev += dev;
        prev.count += 1;
      } else {
        agrupado.set(c.transportadora, { sumVel: vel, sumDev: dev, count: 1 });
      }
    };

    if (selectedDepto === '(Todos)') {
      Object.values(DESTINOS_BASE).forEach((ciudades) => {
        Object.entries(ciudades).forEach(([ciu, carriers]) => {
          if (selectedCiudad === '(Todas)' || selectedCiudad === ciu) {
            carriers.forEach(procesarCarrier);
          }
        });
      });
    } else {
      const deptoData = DESTINOS_BASE[selectedDepto] || {};
      if (selectedCiudad === '(Todas)') {
        Object.values(deptoData).forEach((carriers) => carriers.forEach(procesarCarrier));
      } else {
        const carriers = deptoData[selectedCiudad] || [];
        carriers.forEach(procesarCarrier);
      }
    }

    return Array.from(agrupado.entries()).map(([transportadora, stats]) => {
      const vel = stats.sumVel / stats.count;
      const dev = stats.sumDev / stats.count;
      let accion: 'Rentable' | 'Seguimiento' | 'Intervención' = 'Rentable';
      if (dev >= 25.0) accion = 'Intervención';
      else if (dev >= 8.0) accion = 'Seguimiento';

      return {
        transportadora,
        velocidad: `${vel.toFixed(1)} dias`,
        devolucion: `${dev.toFixed(1)}%`,
        accion,
        _devRaw: dev
      };
    }).sort((a, b) => a._devRaw - b._devRaw);
  }, [selectedDepto, selectedCiudad, selectedProducto, selectedComunidad]);

  if (loading) {
    return <div className="p-8 flex justify-center text-slate-500 font-sans">Cargando métricas de transportadoras...</div>;
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 p-6 font-sans relative space-y-6">
      
      {/* Toast Flotante */}
      {notification && (
        <div className="fixed top-6 right-6 z-50 bg-emerald-500 text-white px-4 py-3 rounded-2xl font-bold shadow-2xl flex items-center gap-2 animate-bounce border border-emerald-400 text-xs">
          <CheckCircle2 size={16} />
          <span>{notification}</span>
        </div>
      )}

      {/* 1. CABECERA & NAVEGACIÓN */}
      <div className="space-y-3">
        <nav className="flex items-center gap-2 text-xs text-slate-400 font-medium">
          <Home size={14} className="text-slate-400" />
          <span>/</span>
          <span className="text-slate-600">Transportadoras</span>
        </nav>

        <div className="flex justify-between items-end flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Transportadoras</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Contrasta la operación propia del proveedor contra el mercado para identificar ineficiencias internas o fallas generales de la transportadora.
            </p>
          </div>

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

      {/* 2. TARJETAS COMPARATIVAS (3 KPIS CLAVE) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* TIEMPO PROMEDIO */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-2xs flex flex-col justify-between">
          <div>
            <span className="text-[11px] font-bold tracking-wider text-slate-500 uppercase block mb-1">
              TIEMPO PROMEDIO DE ENTREGA
            </span>
            <p className="text-3xl lg:text-4xl font-black text-[#f97316] tracking-tight">
              {resTransportadoras.tarjetasKpi.tiempoPromedioEntrega} Días
            </p>
          </div>
          <p className="text-xs text-slate-500 mt-3 font-medium">
            Mi Cuenta: <strong className="text-slate-700">{resTransportadoras.tarjetasKpi.tiempoPromedioEntrega} días</strong> • Promedio Nacional: {resTransportadoras.tarjetasKpi.promedioNacionalEntrega} días
          </p>
        </div>

        {/* MAYOR EFECTIVIDAD */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-2xs flex flex-col justify-between">
          <div>
            <span className="text-[11px] font-bold tracking-wider text-slate-500 uppercase block mb-1">
              MAYOR EFECTIVIDAD ({resTransportadoras.tarjetasKpi.mejorTransportadora.nombre})
            </span>
            <p className="text-3xl lg:text-4xl font-black text-[#f97316] tracking-tight">
              {resTransportadoras.tarjetasKpi.mejorTransportadora.efectividad}%
            </p>
          </div>
          <p className="text-xs text-slate-500 mt-3 font-medium">
            Supera la media nacional (71.2%)
          </p>
        </div>

        {/* MENOR EFECTIVIDAD */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-2xs flex flex-col justify-between">
          <div>
            <span className="text-[11px] font-bold tracking-wider text-slate-500 uppercase block mb-1">
              MENOR EFECTIVIDAD ({resTransportadoras.tarjetasKpi.peorTransportadora.nombre})
            </span>
            <p className="text-3xl lg:text-4xl font-black text-[#f97316] tracking-tight">
              {resTransportadoras.tarjetasKpi.peorTransportadora.efectividad}%
            </p>
          </div>
          <p className="text-xs text-slate-500 mt-3 font-medium">
            Promedio Nacional de referencia: 64.0%
          </p>
        </div>

      </div>

      {/* 3. BLOQUE DUAL PRINCIPAL */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        
        {/* PANEL IZQUIERDO: RANKING DESTINO */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-2xs space-y-5">
          <div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              Ranking de Rentabilidad por Destino
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Cruza Ciudad, Departamento y Producto para ver la mejor transportadora.
            </p>

            {/* BOTÓN COLOCADO DEBAJO DE RANKING DE RENTABILIDAD POR DESTINO */}
            <div className="mt-3">
              <button
                type="button"
                onClick={() => {
                  setNotification('Reporte generado exitosamente para tiendas dropshippers');
                  setTimeout(() => setNotification(null), 3500);
                }}
                className="bg-white border border-slate-300 hover:border-orange-400 hover:text-orange-600 text-slate-700 font-semibold px-4 py-2 rounded-xl flex items-center gap-2 shadow-2xs text-xs transition-all active:scale-95 cursor-pointer w-fit"
              >
                <Share2 size={14} className="text-orange-500" />
                <span>Compartir Ranking con Tiendas</span>
              </button>
            </div>
          </div>

          {/* Grilla 2x2 de selectores */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            
            <div className="flex flex-col gap-1">
              <label className="text-[11px] text-slate-500 font-medium ml-0.5">Departamento</label>
              <div className="relative">
                <select
                  value={selectedDepto}
                  onChange={(e) => handleDeptoChange(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-700 shadow-2xs outline-none hover:border-slate-400 focus:border-slate-500 appearance-none pr-8 cursor-pointer transition-colors"
                >
                  {DEPARTAMENTOS_LIST.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
                <ChevronDown size={14} className="text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[11px] text-slate-500 font-medium ml-0.5">Ciudad</label>
              <div className="relative">
                <select
                  value={selectedCiudad}
                  onChange={(e) => setSelectedCiudad(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-700 shadow-2xs outline-none hover:border-slate-400 focus:border-slate-500 appearance-none pr-8 cursor-pointer transition-colors"
                >
                  {ciudadesDisponibles.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <ChevronDown size={14} className="text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[11px] text-slate-500 font-medium ml-0.5">Producto</label>
              <div className="relative">
                <select
                  value={selectedProducto}
                  onChange={(e) => setSelectedProducto(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-700 shadow-2xs outline-none hover:border-slate-400 focus:border-slate-500 appearance-none pr-8 cursor-pointer transition-colors truncate"
                >
                  {PRODUCTOS_LIST.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
                <ChevronDown size={14} className="text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[11px] text-slate-500 font-medium ml-0.5">Comunidad</label>
              <div className="relative">
                <select
                  value={selectedComunidad}
                  onChange={(e) => setSelectedComunidad(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-xs text-slate-700 shadow-2xs outline-none hover:border-slate-400 focus:border-slate-500 appearance-none pr-8 cursor-pointer transition-colors"
                >
                  {COMUNIDADES_LIST.map((com) => (
                    <option key={com} value={com}>{com}</option>
                  ))}
                </select>
                <ChevronDown size={14} className="text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

          </div>

          {/* Tabla de Ranking Local */}
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider bg-slate-50/70">
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
                  tableRows.map((row) => (
                    <tr key={row.transportadora} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-slate-800">
                        {row.transportadora}
                      </td>
                      <td className="py-3.5 px-3 text-center text-slate-600 font-medium">
                        {row.velocidad}
                      </td>
                      <td className="py-3.5 px-3 text-center text-slate-700 font-bold">
                        {row.devolucion}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                          row.accion === 'Rentable'
                            ? 'bg-emerald-50 text-emerald-600 border-emerald-300'
                            : row.accion === 'Seguimiento'
                            ? 'bg-amber-50 text-amber-600 border-amber-300'
                            : 'bg-rose-50 text-rose-500 border-rose-300'
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

        {/* PANEL DERECHO: BENCHMARKING NACIONAL */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-2xs space-y-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 tracking-tight">
              Benchmarking Nacional de Transportadoras
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Mi Tasa vs Promedio Nacional — % de entrega efectiva.
            </p>
          </div>

          <div className="space-y-4 pt-1">
            {resTransportadoras.benchmarkingNacional.map((c) => {
              const isUnder = c.miTasa < c.promedioNacional;

              return (
                <div key={c.nombre} className="space-y-1">
                  <span className="text-[13px] font-bold text-slate-800 block">
                    {c.nombre}
                  </span>

                  <div className="flex items-center gap-3">
                    <span className="text-[11px] text-slate-400 w-28 shrink-0">Mi Tasa</span>
                    <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${isUnder ? 'bg-[#ef4444]' : 'bg-[#00c9a7]'}`}
                        style={{ width: `${Math.min(100, c.miTasa)}%` }}
                      />
                    </div>
                    <span className={`text-[12px] w-9 text-right font-bold ${isUnder ? 'text-[#ef4444]' : 'text-slate-800'}`}>
                      {c.miTasa}%
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-[11px] text-slate-400 w-28 shrink-0">Promedio Nacional</span>
                    <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#f97316] rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(100, c.promedioNacional)}%` }}
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

          <div className="flex items-center gap-5 pt-3 border-t border-slate-100 text-[11px] text-slate-600 font-medium">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#00c9a7]" />
              <span>Operación Óptima</span>
            </div>
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
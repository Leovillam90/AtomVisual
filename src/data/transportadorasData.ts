// src/data/transportadorasData.ts

export interface CarrierBenchmark {
  nombre: string;
  miTasa: number;
  promedioNacional: number;
  tiempoPromedioDias: number;
  tasaDevolucion: number;
  despachos: number;
  estado: 'Rentable' | 'Seguimiento' | 'Intervención';
}

export interface DestinoCarrierRow {
  transportadora: string;
  efectividad: string; // Tasa de entrega efectiva %
  velocidad: string;
  devolucion: string;
  accion: 'Rentable' | 'Seguimiento' | 'Intervención';
}

// 9 Transportadoras oficiales del Benchmarking Nacional
export const CARRIERS_BENCHMARK_DATA: CarrierBenchmark[] = [
  { nombre: 'Coordinadora', miTasa: 67, promedioNacional: 44, tiempoPromedioDias: 2.1, tasaDevolucion: 6.2, despachos: 1240, estado: 'Rentable' },
  { nombre: 'Derocha Express', miTasa: 50, promedioNacional: 62, tiempoPromedioDias: 3.9, tasaDevolucion: 18.5, despachos: 320, estado: 'Intervención' },
  { nombre: 'Domina', miTasa: 50, promedioNacional: 46, tiempoPromedioDias: 3.2, tasaDevolucion: 12.0, despachos: 410, estado: 'Seguimiento' },
  { nombre: 'Envia', miTasa: 66, promedioNacional: 52, tiempoPromedioDias: 2.4, tasaDevolucion: 7.5, despachos: 980, estado: 'Rentable' },
  { nombre: 'Interrapidisimo', miTasa: 61, promedioNacional: 50, tiempoPromedioDias: 2.8, tasaDevolucion: 9.1, despachos: 1850, estado: 'Seguimiento' },
  { nombre: 'Jamv Drive', miTasa: 20, promedioNacional: 43, tiempoPromedioDias: 5.2, tasaDevolucion: 31.0, despachos: 190, estado: 'Intervención' },
  { nombre: 'Tcc', miTasa: 60, promedioNacional: 45, tiempoPromedioDias: 2.5, tasaDevolucion: 8.4, despachos: 730, estado: 'Rentable' },
  { nombre: 'Veloces', miTasa: 62, promedioNacional: 44, tiempoPromedioDias: 2.3, tasaDevolucion: 7.9, despachos: 269, estado: 'Rentable' },
  { nombre: 'Wiilog', miTasa: 33, promedioNacional: 59, tiempoPromedioDias: 4.6, tasaDevolucion: 22.0, despachos: 95, estado: 'Intervención' },
];

// Matriz de Destinos con efectividad, velocidad y devoluciones por plaza
export const DESTINOS_RENTABILIDAD_DATA: Record<string, Record<string, DestinoCarrierRow[]>> = {
  'Amazonas': {
    'Leticia': [
      { transportadora: 'Interrapidisimo', efectividad: '0.0%', velocidad: '0.0 dias', devolucion: '100%', accion: 'Intervención' }
    ]
  },
  'Cundinamarca': {
    'Bogotá D.C.': [
      { transportadora: 'Coordinadora', efectividad: '88.5%', velocidad: '1.4 dias', devolucion: '5.2%', accion: 'Rentable' },
      { transportadora: 'Envia', efectividad: '84.0%', velocidad: '1.7 dias', devolucion: '6.8%', accion: 'Rentable' },
      { transportadora: 'Veloces', efectividad: '81.2%', velocidad: '1.8 dias', devolucion: '7.4%', accion: 'Rentable' },
      { transportadora: 'Interrapidisimo', efectividad: '79.2%', velocidad: '1.9 dias', devolucion: '8.1%', accion: 'Seguimiento' },
      { transportadora: 'Domina', efectividad: '68.0%', velocidad: '2.5 dias', devolucion: '12.0%', accion: 'Seguimiento' }
    ],
    'Soacha': [
      { transportadora: 'Coordinadora', efectividad: '83.0%', velocidad: '1.8 dias', devolucion: '7.2%', accion: 'Rentable' },
      { transportadora: 'Envia', efectividad: '80.5%', velocidad: '1.9 dias', devolucion: '8.5%', accion: 'Rentable' },
      { transportadora: 'Interrapidisimo', efectividad: '76.8%', velocidad: '2.0 dias', devolucion: '9.1%', accion: 'Seguimiento' }
    ]
  },
  'Antioquia': {
    'Medellín': [
      { transportadora: 'Envia', efectividad: '86.4%', velocidad: '1.6 dias', devolucion: '5.8%', accion: 'Rentable' },
      { transportadora: 'Coordinadora', efectividad: '84.2%', velocidad: '1.8 dias', devolucion: '6.4%', accion: 'Rentable' },
      { transportadora: 'Tcc', efectividad: '81.0%', velocidad: '1.9 dias', devolucion: '7.2%', accion: 'Rentable' },
      { transportadora: 'Veloces', efectividad: '79.5%', velocidad: '1.9 dias', devolucion: '8.5%', accion: 'Rentable' },
      { transportadora: 'Interrapidisimo', efectividad: '75.8%', velocidad: '2.2 dias', devolucion: '10.4%', accion: 'Seguimiento' }
    ],
    'Bello': [
      { transportadora: 'Coordinadora', efectividad: '85.0%', velocidad: '1.7 dias', devolucion: '5.0%', accion: 'Rentable' },
      { transportadora: 'Veloces', efectividad: '80.2%', velocidad: '1.8 dias', devolucion: '8.2%', accion: 'Rentable' },
      { transportadora: 'Interrapidisimo', efectividad: '74.5%', velocidad: '2.1 dias', devolucion: '11.6%', accion: 'Seguimiento' },
      { transportadora: 'Envia', efectividad: '71.0%', velocidad: '2.0 dias', devolucion: '13.1%', accion: 'Seguimiento' }
    ]
  },
  'Valle del Cauca': {
    'Cali': [
      { transportadora: 'Tcc', efectividad: '82.5%', velocidad: '2.0 dias', devolucion: '6.9%', accion: 'Rentable' },
      { transportadora: 'Coordinadora', efectividad: '79.0%', velocidad: '2.1 dias', devolucion: '8.2%', accion: 'Rentable' },
      { transportadora: 'Envia', efectividad: '76.4%', velocidad: '2.3 dias', devolucion: '9.5%', accion: 'Seguimiento' },
      { transportadora: 'Interrapidisimo', efectividad: '73.1%', velocidad: '2.5 dias', devolucion: '11.2%', accion: 'Seguimiento' }
    ],
    'Palmira': [
      { transportadora: 'Coordinadora', efectividad: '80.5%', velocidad: '2.0 dias', devolucion: '7.5%', accion: 'Rentable' },
      { transportadora: 'Envia', efectividad: '78.0%', velocidad: '2.2 dias', devolucion: '8.8%', accion: 'Rentable' },
      { transportadora: 'Interrapidisimo', efectividad: '74.2%', velocidad: '2.4 dias', devolucion: '10.1%', accion: 'Seguimiento' }
    ]
  },
  'Atlántico': {
    'Barranquilla': [
      { transportadora: 'Interrapidisimo', efectividad: '78.2%', velocidad: '2.4 dias', devolucion: '9.4%', accion: 'Seguimiento' },
      { transportadora: 'Coordinadora', efectividad: '74.0%', velocidad: '2.7 dias', devolucion: '11.0%', accion: 'Seguimiento' },
      { transportadora: 'Envia', efectividad: '71.5%', velocidad: '2.8 dias', devolucion: '12.3%', accion: 'Seguimiento' }
    ]
  },
  'Santander': {
    'Bucaramanga': [
      { transportadora: 'Coordinadora', efectividad: '81.5%', velocidad: '2.1 dias', devolucion: '7.1%', accion: 'Rentable' },
      { transportadora: 'Tcc', efectividad: '78.2%', velocidad: '2.3 dias', devolucion: '8.9%', accion: 'Rentable' },
      { transportadora: 'Envia', efectividad: '74.0%', velocidad: '2.5 dias', devolucion: '10.4%', accion: 'Seguimiento' }
    ]
  },
  'Bolívar': {
    'Cartagena': [
      { transportadora: 'Interrapidisimo', efectividad: '74.5%', velocidad: '2.8 dias', devolucion: '11.5%', accion: 'Seguimiento' },
      { transportadora: 'Coordinadora', efectividad: '70.1%', velocidad: '3.0 dias', devolucion: '13.8%', accion: 'Seguimiento' },
      { transportadora: 'Envia', efectividad: '66.8%', velocidad: '3.2 dias', devolucion: '15.2%', accion: 'Intervención' }
    ]
  }
};

// Descarga automática en formato Excel (CSV delimitado por punto y coma con UTF-8 BOM)
export const descargarExcelTop3Destinos = () => {
  const BOM = '\uFEFF';
  const headers = [
    'Departamento',
    'Ciudad / Destino',
    'Posición Ranking',
    'Transportadora Recomendada',
    'Efectividad de Entrega (%)', // Columna solicitada
    'Velocidad de Entrega (Días)',
    'Tasa de Devolución (%)',
    'Calificación ATOM'
  ];

  const rows: string[] = [];

  Object.entries(DESTINOS_RENTABILIDAD_DATA).forEach(([depto, ciudades]) => {
    Object.entries(ciudades).forEach(([ciudad, carriers]) => {
      // Ordenar por efectividad descendente para asegurar el Top 1, 2 y 3 real
      const top3 = [...carriers]
        .sort((a, b) => parseFloat(b.efectividad) - parseFloat(a.efectividad))
        .slice(0, 3);

      top3.forEach((c, idx) => {
        rows.push([
          `"${depto}"`,
          `"${ciudad}"`,
          `"Top ${idx + 1}"`,
          `"${c.transportadora}"`,
          `"${c.efectividad}"`, // Efectividad incluida
          `"${c.velocidad}"`,
          `"${c.devolucion}"`,
          `"${c.accion}"`
        ].join(';'));
      });
    });
  });

  const csvContent = BOM + [headers.join(';'), ...rows].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `ATOM_PRO_Ranking_Top3_Transportadoras_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export default {
  CARRIERS_BENCHMARK_DATA,
  DESTINOS_RENTABILIDAD_DATA,
  descargarExcelTop3Destinos
};
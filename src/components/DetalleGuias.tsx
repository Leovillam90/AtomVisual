// src/components/DetalleGuias.tsx
'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, ChevronDown, 
  ArrowUpDown, CheckCircle2, Clock, ShieldCheck
} from 'lucide-react';
import FiltroFecha from '@/components/filtros/FiltroFecha';

export interface GuiaDetalleItem {
  id: string;
  fechaCreacion: string;
  diasGestion: number;
  ultMovimiento: number;
  tipoEstado: string;
  estado: string;
  pagadaDropi: string;
  fechaPago: string;
  devEnBodega: string;
  etiqueta: string;
  ticketReclamacion?: string;
  fechaGestion?: string;
  ciudad: string;
  departamento: string;
  transportadora: string;
  numGuia: string;
  numPedidos: number;
  numProductos: number;
  productos: string;
  recaudoNegocios: number;
  recaudoProveedor: number;
  precioFletes: number;
  gananciaNegocios: number;
  estadoGestion?: string;
}

export interface DetalleGuiasProps {
  initialFilters?: {
    filterTipoEstado?: string;
    filterDevBodega?: string;
    diasGestionMin?: number;
    diasGestionMax?: number;
    origenAlerta?: string;
  } | null;
  onClearPreset?: () => void;
  reclamadasIds?: string[];
  onNavigateTab?: (tab: string, filters?: any) => void;
}

const GUIAS_AGENTES_DATA: GuiaDetalleItem[] = [
  // 1-4: Agente Reclamación (+30 días fuera de bodega - En Curso)
  {
    id: '88741001',
    fechaCreacion: '2026-09-10',
    diasGestion: 34,
    ultMovimiento: 34,
    tipoEstado: 'En Curso',
    estado: 'EN CURSO',
    pagadaDropi: 'NO',
    fechaPago: '- - -',
    devEnBodega: 'NO',
    etiqueta: 'Reclamación CAS Generada (+30D)',
    ticketReclamacion: 'CAS-30D-9912',
    fechaGestion: '14/10/2026 - 08:00 AM',
    estadoGestion: 'En Reclamación',
    ciudad: 'TUMACO',
    departamento: 'NARIÑO',
    transportadora: 'INTERRAPIDISIMO',
    numGuia: 'INT-99014120',
    numPedidos: 1,
    numProductos: 2,
    productos: '2und Ventilador 3 en 1 de 18 pulgadas',
    recaudoNegocios: 260000,
    recaudoProveedor: 164000,
    precioFletes: 34500,
    gananciaNegocios: 61500
  },
  {
    id: '88741002',
    fechaCreacion: '2026-09-12',
    diasGestion: 32,
    ultMovimiento: 32,
    tipoEstado: 'En Curso',
    estado: 'EN CURSO',
    pagadaDropi: 'NO',
    fechaPago: '- - -',
    devEnBodega: 'NO',
    etiqueta: 'Reclamación CAS Generada (+30D)',
    ticketReclamacion: 'CAS-30D-8821',
    fechaGestion: '14/10/2026 - 08:00 AM',
    estadoGestion: 'En Reclamación',
    ciudad: 'QUIBDO',
    departamento: 'CHOCO',
    transportadora: 'ENVIA',
    numGuia: 'ENV-44921004',
    numPedidos: 1,
    numProductos: 1,
    productos: 'Audifonos Diadema JBL Tune 770 NC',
    recaudoNegocios: 129900,
    recaudoProveedor: 68000,
    precioFletes: 24000,
    gananciaNegocios: 37900
  },
  {
    id: '88741003',
    fechaCreacion: '2026-09-13',
    diasGestion: 31,
    ultMovimiento: 31,
    tipoEstado: 'En Curso',
    estado: 'EN CURSO',
    pagadaDropi: 'NO',
    fechaPago: '- - -',
    devEnBodega: 'NO',
    etiqueta: 'Reclamación CAS Generada (+30D)',
    ticketReclamacion: 'CAS-30D-7704',
    fechaGestion: '14/10/2026 - 08:00 AM',
    estadoGestion: 'En Reclamación',
    ciudad: 'BUENAVENTURA',
    departamento: 'VALLE',
    transportadora: 'COORDINADORA',
    numGuia: 'COO-77119280',
    numPedidos: 1,
    numProductos: 1,
    productos: 'Pañalera morral tipo cuna con cambiador',
    recaudoNegocios: 119900,
    recaudoProveedor: 48000,
    precioFletes: 21500,
    gananciaNegocios: 50400
  },
  {
    id: '88741004',
    fechaCreacion: '2026-09-14',
    diasGestion: 30,
    ultMovimiento: 30,
    tipoEstado: 'En Curso',
    estado: 'EN CURSO',
    pagadaDropi: 'NO',
    fechaPago: '- - -',
    devEnBodega: 'NO',
    etiqueta: 'Reclamación CAS Generada (+30D)',
    ticketReclamacion: 'CAS-30D-6619',
    fechaGestion: '14/10/2026 - 08:00 AM',
    estadoGestion: 'En Reclamación',
    ciudad: 'MONTERIA',
    departamento: 'CORDOBA',
    transportadora: 'TCC',
    numGuia: 'TCC-88201944',
    numPedidos: 1,
    numProductos: 1,
    productos: 'Alcancia Figura Pintura Diamante',
    recaudoNegocios: 69900,
    recaudoProveedor: 24000,
    precioFletes: 19800,
    gananciaNegocios: 26100
  },

  // 5-8: Agente Reclamación (+10 días en Novedad sin solución)
  {
    id: '88741005',
    fechaCreacion: '2026-10-01',
    diasGestion: 13,
    ultMovimiento: 12,
    tipoEstado: 'En Novedad',
    estado: 'EN NOVEDAD',
    pagadaDropi: 'NO',
    fechaPago: '- - -',
    devEnBodega: 'NO',
    etiqueta: 'Reclamación CAS Generada (+10D)',
    ticketReclamacion: 'CAS-10D-5519',
    fechaGestion: '14/10/2026 - 08:00 AM',
    estadoGestion: 'En Reclamación',
    ciudad: 'CALI',
    departamento: 'VALLE',
    transportadora: 'COORDINADORA',
    numGuia: 'COO-66291044',
    numPedidos: 1,
    numProductos: 2,
    productos: '2und Ventilador 3 en 1 de 18 pulgadas',
    recaudoNegocios: 250000,
    recaudoProveedor: 164000,
    precioFletes: 29500,
    gananciaNegocios: 56500
  },
  {
    id: '88741006',
    fechaCreacion: '2026-10-02',
    diasGestion: 12,
    ultMovimiento: 11,
    tipoEstado: 'En Novedad',
    estado: 'EN NOVEDAD',
    pagadaDropi: 'NO',
    fechaPago: '- - -',
    devEnBodega: 'NO',
    etiqueta: 'Reclamación CAS Generada (+10D)',
    ticketReclamacion: 'CAS-10D-5104',
    fechaGestion: '14/10/2026 - 08:00 AM',
    estadoGestion: 'En Reclamación',
    ciudad: 'MEDELLIN',
    departamento: 'ANTIOQUIA',
    transportadora: 'ENVIA',
    numGuia: 'ENV-99182033',
    numPedidos: 1,
    numProductos: 1,
    productos: 'Dildo consolador realista termico',
    recaudoNegocios: 109900,
    recaudoProveedor: 44000,
    precioFletes: 18200,
    gananciaNegocios: 47700
  },
  {
    id: '88741007',
    fechaCreacion: '2026-10-03',
    diasGestion: 11,
    ultMovimiento: 10,
    tipoEstado: 'En Novedad',
    estado: 'EN NOVEDAD',
    pagadaDropi: 'NO',
    fechaPago: '- - -',
    devEnBodega: 'NO',
    etiqueta: 'Reclamación CAS Generada (+10D)',
    ticketReclamacion: 'CAS-10D-4921',
    fechaGestion: '14/10/2026 - 08:00 AM',
    estadoGestion: 'En Reclamación',
    ciudad: 'CARTAGENA',
    departamento: 'BOLIVAR',
    transportadora: 'INTERRAPIDISIMO',
    numGuia: 'INT-55102944',
    numPedidos: 1,
    numProductos: 1,
    productos: 'Audifonos Diadema JBL Tune 770 NC',
    recaudoNegocios: 115000,
    recaudoProveedor: 68000,
    precioFletes: 23400,
    gananciaNegocios: 23600
  },
  {
    id: '88741008',
    fechaCreacion: '2026-10-04',
    diasGestion: 10,
    ultMovimiento: 10,
    tipoEstado: 'En Novedad',
    estado: 'EN NOVEDAD',
    pagadaDropi: 'NO',
    fechaPago: '- - -',
    devEnBodega: 'NO',
    etiqueta: 'Reclamación CAS Generada (+10D)',
    ticketReclamacion: 'CAS-10D-4811',
    fechaGestion: '14/10/2026 - 08:00 AM',
    estadoGestion: 'En Reclamación',
    ciudad: 'PASTO',
    departamento: 'NARIÑO',
    transportadora: 'TCC',
    numGuia: 'TCC-44109288',
    numPedidos: 1,
    numProductos: 1,
    productos: 'Pañalera morral tipo cuna con cambiador',
    recaudoNegocios: 119900,
    recaudoProveedor: 48000,
    precioFletes: 26000,
    gananciaNegocios: 45900
  },

  // 9-12: Agente Auditoría (+7 días Devolución no ingresada a bodega)
  {
    id: '88741009',
    fechaCreacion: '2026-10-05',
    diasGestion: 9,
    ultMovimiento: 9,
    tipoEstado: 'En Devolución',
    estado: 'DEVOLUCION',
    pagadaDropi: 'NO',
    fechaPago: '- - -',
    devEnBodega: 'NO',
    etiqueta: 'Reclamación por Devolución No Ingresada (+7D)',
    ticketReclamacion: 'CAS-DEV-4102',
    fechaGestion: '14/10/2026 - 08:45 AM',
    estadoGestion: 'En Reclamación',
    ciudad: 'BOGOTA',
    departamento: 'CUNDINAMARCA',
    transportadora: 'COORDINADORA',
    numGuia: 'COO-77884120',
    numPedidos: 1,
    numProductos: 1,
    productos: 'Dildo consolador realista termico',
    recaudoNegocios: 109900,
    recaudoProveedor: 44000,
    precioFletes: 15800,
    gananciaNegocios: -15800
  },
  {
    id: '88741010',
    fechaCreacion: '2026-10-06',
    diasGestion: 8,
    ultMovimiento: 8,
    tipoEstado: 'En Devolución',
    estado: 'DEVOLUCION',
    pagadaDropi: 'NO',
    fechaPago: '- - -',
    devEnBodega: 'NO',
    etiqueta: 'Reclamación por Devolución No Ingresada (+7D)',
    ticketReclamacion: 'CAS-DEV-3981',
    fechaGestion: '14/10/2026 - 08:45 AM',
    estadoGestion: 'En Reclamación',
    ciudad: 'CUCUTA',
    departamento: 'NORTE DE SANTANDER',
    transportadora: 'INTERRAPIDISIMO',
    numGuia: 'INT-33019284',
    numPedidos: 1,
    numProductos: 2,
    productos: '2und Ventilador 3 en 1 de 18 pulgadas',
    recaudoNegocios: 260000,
    recaudoProveedor: 164000,
    precioFletes: 31200,
    gananciaNegocios: -31200
  },
  {
    id: '88741011',
    fechaCreacion: '2026-10-06',
    diasGestion: 8,
    ultMovimiento: 7,
    tipoEstado: 'En Devolución',
    estado: 'DEVOLUCION',
    pagadaDropi: 'NO',
    fechaPago: '- - -',
    devEnBodega: 'NO',
    etiqueta: 'Reclamación por Devolución No Ingresada (+7D)',
    ticketReclamacion: 'CAS-DEV-3419',
    fechaGestion: '14/10/2026 - 08:45 AM',
    estadoGestion: 'En Reclamación',
    ciudad: 'AGUADAS',
    departamento: 'CALDAS',
    transportadora: 'ENVIA',
    numGuia: 'ENV-14168899',
    numPedidos: 1,
    numProductos: 1,
    productos: 'Pañalera morral tipo cuna con cambiador',
    recaudoNegocios: 119900,
    recaudoProveedor: 48000,
    precioFletes: 18500,
    gananciaNegocios: -18500
  },
  {
    id: '88741012',
    fechaCreacion: '2026-10-07',
    diasGestion: 7,
    ultMovimiento: 7,
    tipoEstado: 'En Devolución',
    estado: 'DEVOLUCION',
    pagadaDropi: 'NO',
    fechaPago: '- - -',
    devEnBodega: 'NO',
    etiqueta: 'Reclamación por Devolución No Ingresada (+7D)',
    ticketReclamacion: 'CAS-DEV-3104',
    fechaGestion: '14/10/2026 - 08:45 AM',
    estadoGestion: 'En Reclamación',
    ciudad: 'NEIVA',
    departamento: 'HUILA',
    transportadora: 'TCC',
    numGuia: 'TCC-55291044',
    numPedidos: 1,
    numProductos: 1,
    productos: 'Alcancia Figura Pintura Diamante',
    recaudoNegocios: 69900,
    recaudoProveedor: 24000,
    precioFletes: 17800,
    gananciaNegocios: -17800
  },

  // 13-15: Agente Movilización (+3 días sin movimiento - En Curso)
  {
    id: '88741013',
    fechaCreacion: '2026-10-09',
    diasGestion: 5,
    ultMovimiento: 5,
    tipoEstado: 'En Curso',
    estado: 'EN CURSO',
    pagadaDropi: 'NO',
    fechaPago: '- - -',
    devEnBodega: 'NO',
    etiqueta: 'Movilización CAS Generada (+3D)',
    ticketReclamacion: 'CAS-MOV-1022',
    fechaGestion: '14/10/2026 - 09:00 AM',
    estadoGestion: 'En Reclamación',
    ciudad: 'CALI',
    departamento: 'VALLE',
    transportadora: 'TCC',
    numGuia: 'TCC-99410211',
    numPedidos: 1,
    numProductos: 1,
    productos: 'Pañalera morral tipo cuna con cambiador',
    recaudoNegocios: 119900,
    recaudoProveedor: 48000,
    precioFletes: 18500,
    gananciaNegocios: 53400
  },
  {
    id: '88741014',
    fechaCreacion: '2026-10-10',
    diasGestion: 4,
    ultMovimiento: 4,
    tipoEstado: 'En Curso',
    estado: 'EN CURSO',
    pagadaDropi: 'NO',
    fechaPago: '- - -',
    devEnBodega: 'NO',
    etiqueta: 'Movilización CAS Generada (+3D)',
    ticketReclamacion: 'CAS-MOV-0984',
    fechaGestion: '14/10/2026 - 09:00 AM',
    estadoGestion: 'En Reclamación',
    ciudad: 'SOLEDAD',
    departamento: 'ATLANTICO',
    transportadora: 'COORDINADORA',
    numGuia: 'COO-11029344',
    numPedidos: 1,
    numProductos: 2,
    productos: '2und Ventilador 3 en 1 de 18 pulgadas',
    recaudoNegocios: 250000,
    recaudoProveedor: 164000,
    precioFletes: 28400,
    gananciaNegocios: 57600
  },
  {
    id: '88741015',
    fechaCreacion: '2026-10-11',
    diasGestion: 3,
    ultMovimiento: 3,
    tipoEstado: 'En Curso',
    estado: 'EN CURSO',
    pagadaDropi: 'NO',
    fechaPago: '- - -',
    devEnBodega: 'NO',
    etiqueta: 'Movilización CAS Generada (+3D)',
    ticketReclamacion: 'CAS-MOV-0891',
    fechaGestion: '14/10/2026 - 09:00 AM',
    estadoGestion: 'En Reclamación',
    ciudad: 'PEREIRA',
    departamento: 'RISARALDA',
    transportadora: 'INTERRAPIDISIMO',
    numGuia: 'INT-88291044',
    numPedidos: 1,
    numProductos: 1,
    productos: 'Audifonos Diadema JBL Tune 770 NC',
    recaudoNegocios: 99900,
    recaudoProveedor: 48000,
    precioFletes: 16800,
    gananciaNegocios: 35100
  },

  // 16-18: Agente Notificación al Dropshipper (En Novedad)
  {
    id: '88741016',
    fechaCreacion: '2026-10-12',
    diasGestion: 2,
    ultMovimiento: 2,
    tipoEstado: 'En Novedad',
    estado: 'EN NOVEDAD',
    pagadaDropi: 'NO',
    fechaPago: '- - -',
    devEnBodega: 'NO',
    etiqueta: 'Notificación al DROP',
    ticketReclamacion: undefined,
    fechaGestion: '14/10/2026 - 09:00 AM',
    estadoGestion: 'Sin Gestión',
    ciudad: 'MEDELLIN',
    departamento: 'ANTIOQUIA',
    transportadora: 'INTERRAPIDISIMO',
    numGuia: 'INT-24006144',
    numPedidos: 1,
    numProductos: 1,
    productos: 'Alcancia Figura Pintura Diamante',
    recaudoNegocios: 69900,
    recaudoProveedor: 24000,
    precioFletes: 16500,
    gananciaNegocios: 29400
  },
  {
    id: '88741017',
    fechaCreacion: '2026-10-12',
    diasGestion: 2,
    ultMovimiento: 1,
    tipoEstado: 'En Novedad',
    estado: 'EN NOVEDAD',
    pagadaDropi: 'NO',
    fechaPago: '- - -',
    devEnBodega: 'NO',
    etiqueta: 'Notificación al DROP',
    ticketReclamacion: undefined,
    fechaGestion: '14/10/2026 - 09:00 AM',
    estadoGestion: 'Sin Gestión',
    ciudad: 'BUCARAMANGA',
    departamento: 'SANTANDER',
    transportadora: 'ENVIA',
    numGuia: 'ENV-77192088',
    numPedidos: 1,
    numProductos: 1,
    productos: 'Dildo consolador realista termico',
    recaudoNegocios: 109900,
    recaudoProveedor: 44000,
    precioFletes: 17500,
    gananciaNegocios: 48400
  },
  {
    id: '88741018',
    fechaCreacion: '2026-10-13',
    diasGestion: 1,
    ultMovimiento: 1,
    tipoEstado: 'En Novedad',
    estado: 'EN NOVEDAD',
    pagadaDropi: 'NO',
    fechaPago: '- - -',
    devEnBodega: 'NO',
    etiqueta: 'Notificación al DROP',
    ticketReclamacion: undefined,
    fechaGestion: '14/10/2026 - 09:00 AM',
    estadoGestion: 'Sin Gestión',
    ciudad: 'POPAYAN',
    departamento: 'CAUCA',
    transportadora: 'TCC',
    numGuia: 'TCC-66291084',
    numPedidos: 1,
    numProductos: 1,
    productos: 'Pañalera morral tipo cuna con cambiador',
    recaudoNegocios: 119900,
    recaudoProveedor: 48000,
    precioFletes: 18200,
    gananciaNegocios: 53700
  },

  // 19-20: Ecom Scanner (Devoluciones ingresadas físicamente a bodega)
  {
    id: '88741019',
    fechaCreacion: '2026-10-13',
    diasGestion: 1,
    ultMovimiento: 0,
    tipoEstado: 'En Devolución',
    estado: 'DEVOLUCION',
    pagadaDropi: 'SI',
    fechaPago: '13/10/2026',
    devEnBodega: 'SI',
    etiqueta: 'Ingresada a Bodega (Ecom Scanner)',
    ticketReclamacion: undefined,
    fechaGestion: '13/10/2026 - 16:30 PM',
    estadoGestion: 'Sin Gestión',
    ciudad: 'CALI',
    departamento: 'VALLE',
    transportadora: 'INTERRAPIDISIMO',
    numGuia: 'INT-24006189',
    numPedidos: 1,
    numProductos: 2,
    productos: 'Ventilador 3 en 1 de 18 pulgadas x2',
    recaudoNegocios: 250000,
    recaudoProveedor: 164000,
    precioFletes: 31420,
    gananciaNegocios: -31420
  },
  {
    id: '88741020',
    fechaCreacion: '2026-10-14',
    diasGestion: 0,
    ultMovimiento: 0,
    tipoEstado: 'En Devolución',
    estado: 'DEVOLUCION',
    pagadaDropi: 'SI',
    fechaPago: '14/10/2026',
    devEnBodega: 'SI',
    etiqueta: 'Ingresada a Bodega (Ecom Scanner)',
    ticketReclamacion: undefined,
    fechaGestion: '14/10/2026 - 10:15 AM',
    estadoGestion: 'Sin Gestión',
    ciudad: 'BOGOTA',
    departamento: 'CUNDINAMARCA',
    transportadora: 'COORDINADORA',
    numGuia: 'COO-99882104',
    numPedidos: 1,
    numProductos: 1,
    productos: 'Audifonos Diadema JBL Tune 770 NC',
    recaudoNegocios: 129900,
    recaudoProveedor: 68000,
    precioFletes: 16500,
    gananciaNegocios: -16500
  }
];

export function DetalleGuias({ initialFilters, reclamadasIds = [] }: DetalleGuiasProps) {
  const [data, setData] = useState<GuiaDetalleItem[]>(GUIAS_AGENTES_DATA);

  // Filtros reactivos
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFrom, setDateFrom] = useState('2026-09-01');
  const [dateTo, setDateTo] = useState('2026-10-31');
  const [filterBodega, setFilterBodega] = useState('Todos');
  const [filterNegocio, setFilterNegocio] = useState('Todos');
  const [filterTipoEstado, setFilterTipoEstado] = useState('Todos');
  const [filterDepartamento, setFilterDepartamento] = useState('Todos');
  const [filterTransportadora, setFilterTransportadora] = useState('Todos');
  const [filterDevBodega, setFilterDevBodega] = useState<string>('Todos');
  const [filterPagadaDropi, setFilterPagadaDropi] = useState('Todos');
  const [filterEstadoGestion, setFilterEstadoGestion] = useState('Todos');

  // Paginación y Ordenamiento
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [sortKey, setSortKey] = useState<keyof GuiaDetalleItem>('fechaCreacion');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    if (reclamadasIds.length > 0) {
      setData((prev) =>
        prev.map((g) =>
          reclamadasIds.includes(g.id)
            ? { 
                ...g, 
                estadoGestion: 'En Reclamación', 
                ticketReclamacion: g.ticketReclamacion || 'CAS-DEV-8840',
                fechaGestion: '14/10/2026 - 08:45 AM',
                etiqueta: 'Reclamación por Devolución No Ingresada (+7D)'
              }
            : g
        )
      );
    }
  }, [reclamadasIds]);

  useEffect(() => {
    if (initialFilters) {
      if (initialFilters.filterTipoEstado) setFilterTipoEstado(initialFilters.filterTipoEstado);
      if (initialFilters.filterDevBodega) setFilterDevBodega(initialFilters.filterDevBodega.toUpperCase());
      setCurrentPage(1);
    }
  }, [initialFilters]);

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const term = searchTerm.toLowerCase();
      const matchesSearch = 
        item.id.toLowerCase().includes(term) ||
        item.numGuia.toLowerCase().includes(term) ||
        item.ciudad.toLowerCase().includes(term) ||
        item.departamento.toLowerCase().includes(term) ||
        item.transportadora.toLowerCase().includes(term) ||
        item.productos.toLowerCase().includes(term) ||
        item.etiqueta.toLowerCase().includes(term) ||
        (item.ticketReclamacion && item.ticketReclamacion.toLowerCase().includes(term));

      if (!matchesSearch) return false;

      if (filterTipoEstado !== 'Todos') {
        if (filterTipoEstado === 'En Devolución') {
          if (!item.tipoEstado.toLowerCase().includes('devolu')) return false;
        } else if (item.tipoEstado !== filterTipoEstado) {
          return false;
        }
      }

      if (filterDepartamento !== 'Todos' && item.departamento !== filterDepartamento) return false;
      if (filterTransportadora !== 'Todos' && item.transportadora !== filterTransportadora) return false;
      
      if (filterDevBodega !== 'Todos') {
        const itemDev = item.devEnBodega.toUpperCase();
        if (filterDevBodega === 'SI' && itemDev !== 'SI') return false;
        if (filterDevBodega === 'NO' && itemDev === 'SI') return false;
      }

      if (filterPagadaDropi !== 'Todos') {
        const isSi = filterPagadaDropi === 'SI';
        const itemSi = item.pagadaDropi.toUpperCase() === 'SI';
        if (isSi !== itemSi) return false;
      }

      if (filterEstadoGestion !== 'Todos') {
        if (filterEstadoGestion === 'En Reclamación') {
          if (item.estadoGestion !== 'En Reclamación') return false;
        } else if (filterEstadoGestion === 'Sin Gestión') {
          if (item.estadoGestion === 'En Reclamación') return false;
        }
      }

      return true;
    });
  }, [data, searchTerm, filterTipoEstado, filterDepartamento, filterTransportadora, filterDevBodega, filterPagadaDropi, filterEstadoGestion]);

  const sortedData = useMemo(() => {
    const list = [...filteredData];
    list.sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];

      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
      }
      return sortDirection === 'asc'
        ? String(aVal || '').localeCompare(String(bVal || ''))
        : String(bVal || '').localeCompare(String(aVal || ''));
    });
    return list;
  }, [filteredData, sortKey, sortDirection]);

  const totalPages = Math.ceil(sortedData.length / rowsPerPage) || 1;
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return sortedData.slice(start, start + rowsPerPage);
  }, [sortedData, currentPage, rowsPerPage]);

  const handleSort = (key: keyof GuiaDetalleItem) => {
    if (sortKey === key) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDirection('desc');
    }
  };

  const formatCurrency = (val: number, isDevolucion: boolean = false) => {
    const formatted = new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0
    }).format(Math.abs(val));

    if (isDevolucion || val < 0) {
      return `-$ ${formatted.replace('$', '').trim()}`;
    }
    return formatted;
  };

  const getTipoEstadoPill = (tipo: string) => {
    const t = tipo.toLowerCase();
    if (t.includes('finaliz') || t.includes('entreg')) return 'bg-emerald-50 text-emerald-700 border border-emerald-200';
    if (t.includes('confirm')) return 'bg-sky-50 text-sky-700 border border-sky-200';
    if (t.includes('pendiente')) return 'bg-blue-50 text-blue-700 border border-blue-200';
    if (t.includes('curso') || t.includes('reparto')) return 'bg-amber-50 text-amber-700 border border-amber-200';
    if (t.includes('novedad')) return 'bg-orange-50 text-orange-700 border border-orange-200';
    if (t.includes('devolu')) return 'bg-rose-50 text-rose-700 border border-rose-200';
    return 'bg-slate-100 text-slate-700 border border-slate-200';
  };

  const renderEtiquetaConRadicado = (g: GuiaDetalleItem) => {
    if (!g.etiqueta || g.etiqueta === '- - -') {
      return <span className="text-slate-400 font-medium text-[11px]">- - -</span>;
    }

    const e = g.etiqueta.toLowerCase();
    let badgeColor = 'bg-slate-100 text-slate-700 border-slate-200';

    if (e.includes('+30d')) {
      badgeColor = 'bg-rose-50 text-rose-700 border-rose-200/90';
    } else if (e.includes('+10d')) {
      badgeColor = 'bg-amber-50 text-amber-700 border-amber-200/90';
    } else if (e.includes('+7d')) {
      badgeColor = 'bg-rose-50 text-rose-700 border-rose-300';
    } else if (e.includes('+3d')) {
      badgeColor = 'bg-sky-50 text-sky-700 border-sky-200/90';
    } else if (e.includes('drop')) {
      badgeColor = 'bg-indigo-50 text-indigo-700 border-indigo-200/90';
    } else if (e.includes('ecom scanner') || e.includes('bodega')) {
      badgeColor = 'bg-emerald-50 text-emerald-700 border-emerald-200/90';
    }

    return (
      <div className="flex flex-col items-center gap-1">
        <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border whitespace-nowrap shadow-xs ${badgeColor}`}>
          {g.etiqueta}
        </span>

        {(g.ticketReclamacion || g.fechaGestion) && (
          <div className="flex items-center gap-1.5 text-[10px]">
            {g.ticketReclamacion && (
              <span className="font-mono font-bold text-slate-700 bg-slate-100 border border-slate-200 px-1.5 py-0.2 rounded flex items-center gap-1">
                <ShieldCheck size={10} className="text-orange-600" />
                <span>Rad: {g.ticketReclamacion}</span>
              </span>
            )}
            {g.fechaGestion && (
              <span className="text-slate-400 flex items-center gap-0.5 whitespace-nowrap">
                <Clock size={10} />
                <span>{g.fechaGestion}</span>
              </span>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 p-6 font-sans relative space-y-5">
      
      {notification && (
        <div className="fixed top-6 right-6 z-50 bg-emerald-500 text-slate-950 px-4 py-3 rounded-xl font-bold shadow-2xl flex items-center gap-2 animate-bounce border border-emerald-300">
          <CheckCircle2 size={18} />
          <span>{notification}</span>
        </div>
      )}

      {/* 1. CABECERA LIMPIA */}
      <div className="flex justify-between items-end mb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Detalle de Guías</h1>
          <p className="text-xs text-slate-500 mt-0.5">Listado de guías con etiquetas de agentes, trazabilidad y estados automáticos</p>
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

      {/* 2. FILTROS SECUNDARIOS */}
      <div className="grid grid-cols-7 gap-3">
        <div className="flex flex-col gap-1">
          <label className="text-xs text-slate-500 font-medium ml-1">Bodega</label>
          <div className="relative">
            <select
              value={filterBodega}
              onChange={(e) => setFilterBodega(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-600 shadow-sm outline-none hover:border-slate-300 focus:border-slate-400 appearance-none transition-colors cursor-pointer"
            >
              <option value="Todos">(Todos)</option>
              <option value="Bodega Principal">Bodega Principal</option>
              <option value="Bodega Norte">Bodega Norte</option>
              <option value="Bodega Sur">Bodega Sur</option>
            </select>
            <ChevronDown size={14} className="text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs text-slate-500 font-medium ml-1">Negocios</label>
          <div className="relative">
            <select
              value={filterNegocio}
              onChange={(e) => setFilterNegocio(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-600 shadow-sm outline-none hover:border-slate-300 focus:border-slate-400 appearance-none transition-colors cursor-pointer"
            >
              <option value="Todos">(Todos)</option>
              <option value="9428708">9428708 - Juan Camargo</option>
              <option value="Impoventas24">Impoventas24</option>
              <option value="Trompila">Trompila</option>
            </select>
            <ChevronDown size={14} className="text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs text-slate-500 font-medium ml-1">Tipo Estado</label>
          <div className="relative">
            <select
              value={filterTipoEstado}
              onChange={(e) => setFilterTipoEstado(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-600 shadow-sm outline-none hover:border-slate-300 focus:border-slate-400 appearance-none transition-colors cursor-pointer truncate pr-6 font-semibold"
            >
              <option value="Todos">(Todos)</option>
              <option value="En Curso">En Curso</option>
              <option value="En Novedad">En Novedad</option>
              <option value="En Devolución">En Devolución</option>
            </select>
            <ChevronDown size={14} className="text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs text-slate-500 font-medium ml-1">Departamento</label>
          <div className="relative">
            <select
              value={filterDepartamento}
              onChange={(e) => setFilterDepartamento(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-600 shadow-sm outline-none hover:border-slate-300 focus:border-slate-400 appearance-none transition-colors cursor-pointer truncate pr-6"
            >
              <option value="Todos">(Todos)</option>
              <option value="NARIÑO">Nariño</option>
              <option value="CHOCO">Chocó</option>
              <option value="VALLE">Valle</option>
              <option value="CORDOBA">Córdoba</option>
              <option value="ANTIOQUIA">Antioquia</option>
              <option value="BOLIVAR">Bolívar</option>
              <option value="CUNDINAMARCA">Cundinamarca</option>
            </select>
            <ChevronDown size={14} className="text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs text-slate-500 font-medium ml-1">Dev. en Bodega</label>
          <div className="relative">
            <select
              value={filterDevBodega}
              onChange={(e) => setFilterDevBodega(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-600 shadow-sm outline-none hover:border-slate-300 focus:border-slate-400 appearance-none transition-colors cursor-pointer font-semibold"
            >
              <option value="Todos">(Todos)</option>
              <option value="NO">NO (Sin ingresar)</option>
              <option value="SI">SI (En Bodega)</option>
            </select>
            <ChevronDown size={14} className="text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs text-slate-500 font-medium ml-1">Transportadora</label>
          <div className="relative">
            <select
              value={filterTransportadora}
              onChange={(e) => setFilterTransportadora(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-600 shadow-sm outline-none hover:border-slate-300 focus:border-slate-400 appearance-none transition-colors cursor-pointer"
            >
              <option value="Todos">(Todos)</option>
              <option value="INTERRAPIDISIMO">Interrapidisimo</option>
              <option value="ENVIA">Envía</option>
              <option value="COORDINADORA">Coordinadora</option>
              <option value="TCC">TCC</option>
            </select>
            <ChevronDown size={14} className="text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs text-slate-500 font-medium ml-1">Estado Gestión</label>
          <div className="relative">
            <select
              value={filterEstadoGestion}
              onChange={(e) => setFilterEstadoGestion(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-600 shadow-sm outline-none hover:border-slate-300 focus:border-slate-400 appearance-none transition-colors cursor-pointer"
            >
              <option value="Todos">(Todos)</option>
              <option value="Sin Gestión">Sin Gestión</option>
              <option value="En Reclamación">En Reclamación</option>
            </select>
            <ChevronDown size={14} className="text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* 3. BARRA DE BÚSQUEDA */}
      <div className="w-full relative">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Buscar por ID, guía, etiqueta, radicado CAS, destino o producto..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-700 placeholder-slate-400 shadow-sm outline-none hover:border-slate-300 focus:border-slate-400 transition-colors"
        />
      </div>

      {/* 4. TABLA GENERAL DE GUÍAS */}
      <div className="bg-white border border-slate-200/90 rounded-2xl shadow-sm overflow-hidden overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs min-w-[2100px]">
          <thead>
            <tr className="border-b border-slate-200 text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-white">
              <th onClick={() => handleSort('id')} className="py-4 px-3 cursor-pointer hover:text-slate-700 whitespace-nowrap">
                <div className="flex items-center gap-1"><span>ID</span><ArrowUpDown size={11} /></div>
              </th>
              <th onClick={() => handleSort('fechaCreacion')} className="py-4 px-3 cursor-pointer hover:text-slate-700 whitespace-nowrap">
                <div className="flex items-center gap-1"><span>FECHA CREACIÓN</span><ArrowUpDown size={11} /></div>
              </th>
              <th onClick={() => handleSort('diasGestion')} className="py-4 px-3 cursor-pointer hover:text-slate-700 text-center whitespace-nowrap">
                <div className="flex items-center justify-center gap-1"><span>DÍAS EN GESTIÓN</span><ArrowUpDown size={11} /></div>
              </th>
              <th onClick={() => handleSort('ultMovimiento')} className="py-4 px-3 cursor-pointer hover:text-slate-700 text-center whitespace-nowrap">
                <div className="flex items-center justify-center gap-1"><span>ULT. MOVIMIENTO</span><ArrowUpDown size={11} /></div>
              </th>
              <th className="py-4 px-3 text-center whitespace-nowrap">TIPO DE ESTADO</th>
              <th onClick={() => handleSort('estado')} className="py-4 px-3 cursor-pointer hover:text-slate-700 whitespace-nowrap">
                <div className="flex items-center gap-1"><span>ESTADO</span><ArrowUpDown size={11} /></div>
              </th>
              <th className="py-4 px-3 text-center whitespace-nowrap">PAGADA POR DROPI</th>
              <th className="py-4 px-3 text-center whitespace-nowrap">FECHA DE PAGO</th>
              <th className="py-4 px-3 text-center whitespace-nowrap">DEV. EN BODEGA</th>
              
              <th onClick={() => handleSort('etiqueta')} className="py-4 px-4 cursor-pointer hover:text-slate-700 text-center whitespace-nowrap min-w-[280px]">
                <div className="flex items-center justify-center gap-1"><span>ETIQUETA (RADICADO / FECHA)</span><ArrowUpDown size={11} /></div>
              </th>

              <th onClick={() => handleSort('ciudad')} className="py-4 px-3 cursor-pointer hover:text-slate-700 whitespace-nowrap">
                <div className="flex items-center gap-1"><span>DESTINO</span><ArrowUpDown size={11} /></div>
              </th>
              <th onClick={() => handleSort('transportadora')} className="py-4 px-3 cursor-pointer hover:text-slate-700 whitespace-nowrap">
                <div className="flex items-center gap-1"><span>TRANSPORTADORA</span><ArrowUpDown size={11} /></div>
              </th>
              <th onClick={() => handleSort('numGuia')} className="py-4 px-3 cursor-pointer hover:text-slate-700 whitespace-nowrap">
                <div className="flex items-center gap-1"><span>NUM. GUÍA</span><ArrowUpDown size={11} /></div>
              </th>
              <th className="py-4 px-2 text-center whitespace-nowrap"># PEDIDOS</th>
              <th className="py-4 px-2 text-center whitespace-nowrap"># PRODUCTOS</th>
              <th className="py-4 px-4 whitespace-nowrap min-w-[260px]">PRODUCTOS</th>
              <th onClick={() => handleSort('recaudoNegocios')} className="py-4 px-3 text-right whitespace-nowrap">RECAUDO NEGOCIOS</th>
              <th onClick={() => handleSort('recaudoProveedor')} className="py-4 px-3 text-right whitespace-nowrap">RECAUDO PROVEEDOR</th>
              <th onClick={() => handleSort('precioFletes')} className="py-4 px-3 text-right whitespace-nowrap">PRECIO FLETES</th>
              <th onClick={() => handleSort('gananciaNegocios')} className="py-4 px-3 text-right whitespace-nowrap">GANANCIA NEGOCIOS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={20} className="py-12 text-center text-slate-400 text-sm font-medium">
                  No se encontraron guías para los filtros seleccionados.
                </td>
              </tr>
            ) : (
              paginatedData.map((g) => {
                const isDevolucion = g.tipoEstado.toLowerCase().includes('devolu') || g.estado.toLowerCase().includes('devolu');
                const isPistoleada = g.devEnBodega.toUpperCase() === 'SI';

                return (
                  <tr key={g.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-3 font-semibold text-slate-900 whitespace-nowrap font-mono">
                      {g.id}
                    </td>

                    <td className="py-3.5 px-3 text-slate-600 whitespace-nowrap">
                      {g.fechaCreacion}
                    </td>

                    <td className="py-3.5 px-3 text-center text-slate-700 whitespace-nowrap font-bold">
                      {g.diasGestion}d
                    </td>

                    <td className="py-3.5 px-3 text-center whitespace-nowrap">
                      <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-[11px] font-bold ${
                        g.ultMovimiento === 0
                          ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                          : g.ultMovimiento >= 5
                          ? 'bg-rose-50 text-rose-600 border border-rose-200'
                          : 'bg-amber-50 text-amber-600 border border-amber-200'
                      }`}>
                        {g.ultMovimiento}
                      </span>
                    </td>

                    <td className="py-3.5 px-3 text-center whitespace-nowrap">
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold ${getTipoEstadoPill(g.tipoEstado)}`}>
                        {g.tipoEstado}
                      </span>
                    </td>

                    <td className="py-3.5 px-3 text-slate-700 font-medium whitespace-nowrap">
                      {g.estado}
                    </td>

                    <td className="py-3.5 px-3 text-center text-slate-600 whitespace-nowrap">
                      {g.pagadaDropi}
                    </td>

                    <td className="py-3.5 px-3 text-center text-slate-500 whitespace-nowrap font-mono text-[11px]">
                      {g.fechaPago}
                    </td>

                    <td className="py-3.5 px-3 text-center whitespace-nowrap">
                      <span className={`px-2.5 py-0.5 rounded-full font-bold text-xs ${
                        isPistoleada
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}>
                        {g.devEnBodega}
                      </span>
                    </td>

                    {/* CELDA: ETIQUETA CON RADICADO CAS Y FECHA */}
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      {renderEtiquetaConRadicado(g)}
                    </td>

                    <td className="py-3.5 px-3 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="font-extrabold text-slate-800 text-[13px] tracking-tight">{g.ciudad}</span>
                        <span className="text-[11px] text-slate-400 font-semibold">{g.departamento}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-3 text-slate-700 font-medium whitespace-nowrap">
                      {g.transportadora}
                    </td>

                    <td className="py-3.5 px-3 text-slate-600 font-mono text-[11px] whitespace-nowrap">
                      {g.numGuia}
                    </td>

                    <td className="py-3.5 px-2 text-center text-slate-700 whitespace-nowrap font-medium">
                      {g.numPedidos}
                    </td>

                    <td className="py-3.5 px-2 text-center text-slate-700 whitespace-nowrap font-medium">
                      {g.numProductos}
                    </td>

                    <td className="py-3.5 px-4 text-slate-800 font-medium min-w-[260px] truncate" title={g.productos}>
                      {g.productos}
                    </td>

                    <td className="py-3.5 px-3 text-right text-slate-800 font-semibold whitespace-nowrap">
                      {formatCurrency(g.recaudoNegocios)}
                    </td>

                    <td className="py-3.5 px-3 text-right text-slate-800 font-semibold whitespace-nowrap">
                      {formatCurrency(g.recaudoProveedor)}
                    </td>

                    <td className={`py-3.5 px-3 text-right font-bold whitespace-nowrap ${isDevolucion ? 'text-rose-600' : 'text-slate-800'}`}>
                      {formatCurrency(g.precioFletes, isDevolucion)}
                    </td>

                    <td className={`py-3.5 px-3 text-right font-bold whitespace-nowrap ${isDevolucion || g.gananciaNegocios < 0 ? 'text-rose-600' : 'text-slate-800'}`}>
                      {formatCurrency(g.gananciaNegocios, isDevolucion)}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>

        {/* PIE DE PÁGINA */}
        <div className="flex items-center justify-between px-6 py-3.5 bg-white border-t border-slate-200 text-xs text-slate-500 font-sans">
          <div className="flex items-center gap-2">
            <span className="text-slate-600 font-medium">Mostrar</span>
            <div className="relative">
              <select
                value={rowsPerPage}
                onChange={(e) => {
                  setRowsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs text-slate-700 shadow-sm outline-none hover:border-slate-300 focus:border-slate-400 appearance-none pr-6 cursor-pointer font-medium"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
              <ChevronDown size={12} className="text-slate-400 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-slate-600 font-medium">
              Página {currentPage} de {totalPages} ({sortedData.length.toLocaleString('es-CO')} guías)
            </span>
            <div className="flex items-center gap-1.5">
              {currentPage > 1 && (
                <button
                  type="button"
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  className="px-3 py-1 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-medium shadow-sm transition-colors cursor-pointer"
                >
                  &lt; Anterior
                </button>
              )}
              <button
                type="button"
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                className={`px-3 py-1 bg-white border border-slate-200 rounded-lg text-xs font-medium shadow-sm transition-colors ${
                  currentPage >= totalPages
                    ? 'text-slate-300 cursor-not-allowed'
                    : 'text-slate-700 hover:bg-slate-50 cursor-pointer'
                }`}
              >
                Siguiente &gt;
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

export default DetalleGuias;
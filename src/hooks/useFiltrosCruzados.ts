// src/hooks/useFiltrosCruzados.ts
'use client';

import { useState, useMemo } from 'react';
import { useBDatom } from './useBDatom';
import { BDatomRecord } from '@/types/bdatom';

// Normalizador universal de fechas a formato YYYY-MM-DD
function parseDateToISO(val: any): string {
  if (!val) return '';
  const s = String(val).trim();
  
  // Si ya es ISO (YYYY-MM-DD...)
  if (/^\d{4}-\d{2}-\d{2}/.test(s)) {
    return s.slice(0, 10);
  }

  // Si viene con hora "7/09/2026 14:30:00", tomamos solo la primera parte
  const datePart = s.split(' ')[0];
  if (datePart.includes('/')) {
    const parts = datePart.split('/');
    if (parts.length === 3) {
      const d = parts[0].padStart(2, '0');
      const m = parts[1].padStart(2, '0');
      const y = parts[2];
      return `${y}-${m}-${d}`;
    }
  }

  return s;
}

export function useFiltrosCruzados() {
  const { records, loading, error } = useBDatom();

  // Rango inicial: Septiembre y Octubre 2026
  const [dateFrom, setDateFrom] = useState<string>('2026-09-01');
  const [dateTo, setDateTo] = useState<string>('2026-10-31');

  // Filtros secundarios
  const [selectedBodegas, setSelectedBodegas] = useState<string[]>([]);
  const [selectedProductos, setSelectedProductos] = useState<string[]>([]);
  const [selectedNegocios, setSelectedNegocios] = useState<string[]>([]);
  const [selectedTransportadoras, setSelectedTransportadoras] = useState<string[]>([]);
  const [selectedDepartamentos, setSelectedDepartamentos] = useState<string[]>([]);
  const [selectedComunidades, setSelectedComunidades] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');

  // 1. Catálogos únicos calculados dinámicamente
  const availableOptions = useMemo(() => {
    const bodegas = Array.from(
      new Set(records.map((r) => r.bodega || r.tiendaId).filter(Boolean))
    ).sort();

    const productos = Array.from(
      new Set(records.map((r) => r.productoNombre || r.Productos).filter(Boolean))
    ).sort();

    const negocios = Array.from(
      new Set(records.map((r) => r.dropshipper || r.Dropshipper).filter(Boolean))
    ).sort();

    const transportadoras = Array.from(
      new Set(records.map((r) => r.transportadora || r.Transportadora).filter(Boolean))
    ).sort();

    const departamentos = Array.from(
      new Set(records.map((r) => r.departamento || r.Departamento).filter(Boolean))
    ).sort();

    const comunidades = ['Comunidad Élite', 'Comunidad Master', 'Comunidad Rocket'];

    return {
      bodegas,
      productos,
      negocios,
      transportadoras,
      departamentos,
      comunidades,
    };
  }, [records]);

  // 2. Filtrado seguro
  const filteredData = useMemo(() => {
    if (!records || records.length === 0) return [];

    return records.filter((item: BDatomRecord) => {
      // Normalización garantizada de fecha
      const rawFecha = item.fechaCreacion || item.fechaCreacionRaw || item['Fecha de creación'] || '';
      const fechaISO = parseDateToISO(rawFecha);

      if (fechaISO && fechaISO.length === 10) {
        if (dateFrom && fechaISO < dateFrom) return false;
        if (dateTo && fechaISO > dateTo) return false;
      }

      // Filtros secundarios (solo filtran si el usuario seleccionó opciones)
      const bodega = item.bodega || item.tiendaId;
      if (selectedBodegas.length > 0 && !selectedBodegas.includes(bodega)) return false;

      const prodName = item.productoNombre || item.Productos || '';
      if (selectedProductos.length > 0 && !selectedProductos.includes(prodName)) return false;

      const dropName = item.dropshipper || item.Dropshipper || '';
      if (selectedNegocios.length > 0 && !selectedNegocios.includes(dropName)) return false;

      const transName = item.transportadora || item.Transportadora || '';
      if (selectedTransportadoras.length > 0 && !selectedTransportadoras.includes(transName)) return false;

      const deptoName = item.departamento || item.Departamento || '';
      if (selectedDepartamentos.length > 0 && !selectedDepartamentos.includes(deptoName)) return false;

      // Buscador por texto
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        const mProd = (prodName || '').toLowerCase().includes(term);
        const mDrop = (dropName || '').toLowerCase().includes(term);
        const mId = String(item.id || '').toLowerCase().includes(term);
        const mGuia = String(item.numeroGuia || '').toLowerCase().includes(term);
        if (!mProd && !mDrop && !mId && !mGuia) return false;
      }

      return true;
    });
  }, [
    records,
    dateFrom,
    dateTo,
    selectedBodegas,
    selectedProductos,
    selectedNegocios,
    selectedTransportadoras,
    selectedDepartamentos,
    searchTerm,
  ]);

  return {
    rawRecords: records,
    filteredData,
    loading,
    error,
    dateFrom, setDateFrom,
    dateTo, setDateTo,
    selectedBodegas, setSelectedBodegas,
    selectedProductos, setSelectedProductos,
    selectedNegocios, setSelectedNegocios,
    selectedTransportadoras, setSelectedTransportadoras,
    selectedDepartamentos, setSelectedDepartamentos,
    selectedComunidades, setSelectedComunidades,
    searchTerm, setSearchTerm,
    availableOptions,
  };
}

export default useFiltrosCruzados;
// src/filtros/BarraFiltrosSecundarios.tsx
'use client';

import React from 'react';
import { FiltroBodega } from './FiltroBodega';
import { FiltroNegocios } from './FiltroNegocios';
import { FiltroProductos } from './FiltroProductos';
import { FiltroTransportadoras } from './FiltroTransportadoras';
import { FiltroDepartamentos } from './FiltroDepartamentos';
import { FiltroComunidades } from './FiltroComunidades';

interface BarraFiltrosProps {
  vistaActiva: 'productos' | 'negocios' | 'general';
  availableOptions: {
    bodegas: string[];
    productos: string[];
    negocios: string[];
    transportadoras: string[];
    departamentos: string[];
    comunidades: string[];
  };
  selectedBodegas: string[];
  setSelectedBodegas: (val: string[]) => void;
  selectedNegocios: string[];
  setSelectedNegocios: (val: string[]) => void;
  selectedProductos: string[];
  setSelectedProductos: (val: string[]) => void;
  selectedTransportadoras: string[];
  setSelectedTransportadoras: (val: string[]) => void;
  selectedDepartamentos: string[];
  setSelectedDepartamentos: (val: string[]) => void;
  selectedComunidades: string[];
  setSelectedComunidades: (val: string[]) => void;
}

export function BarraFiltrosSecundarios({
  vistaActiva,
  availableOptions,
  selectedBodegas,
  setSelectedBodegas,
  selectedNegocios,
  setSelectedNegocios,
  selectedProductos,
  setSelectedProductos,
  selectedTransportadoras,
  setSelectedTransportadoras,
  selectedDepartamentos,
  setSelectedDepartamentos,
  selectedComunidades,
  setSelectedComunidades,
}: BarraFiltrosProps) {
  return (
    <div className="grid grid-cols-5 gap-3 w-full font-sans">
      <FiltroBodega
        options={availableOptions.bodegas}
        selected={selectedBodegas}
        onChange={setSelectedBodegas}
      />

      {vistaActiva === 'productos' ? (
        <FiltroNegocios
          options={availableOptions.negocios}
          selectedIds={selectedNegocios}
          onChange={setSelectedNegocios}
        />
      ) : (
        <FiltroProductos
          options={availableOptions.productos}
          selected={selectedProductos}
          onChange={setSelectedProductos}
        />
      )}

      <FiltroTransportadoras
        options={availableOptions.transportadoras}
        selected={selectedTransportadoras}
        onChange={setSelectedTransportadoras}
      />

      <FiltroDepartamentos
        options={availableOptions.departamentos}
        selected={selectedDepartamentos}
        onChange={setSelectedDepartamentos}
      />

      <FiltroComunidades
        options={availableOptions.comunidades}
        selected={selectedComunidades}
        onChange={setSelectedComunidades}
      />
    </div>
  );
}

export default BarraFiltrosSecundarios;
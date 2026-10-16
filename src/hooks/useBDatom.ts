// src/hooks/useBDatom.ts
'use client';

import { useState, useEffect } from 'react';
import { BDatomRecord } from '@/types/bdatom';

let cachedRecords: BDatomRecord[] | null = null;
let activeFetchPromise: Promise<BDatomRecord[]> | null = null;

async function loadBDatomJson(): Promise<BDatomRecord[]> {
  if (cachedRecords && cachedRecords.length > 0) return cachedRecords;
  if (activeFetchPromise) return activeFetchPromise;

  activeFetchPromise = fetch('/data/bdatom.json')
    .then((res) => {
      if (!res.ok) throw new Error(`HTTP ${res.status} al cargar /data/bdatom.json`);
      return res.json();
    })
    .then((data: BDatomRecord[]) => {
      console.log(`📦 BDatom cargado exitosamente: ${data.length} registros`);
      cachedRecords = data;
      activeFetchPromise = null;
      return data;
    })
    .catch((err) => {
      activeFetchPromise = null;
      console.error('❌ Error al cargar /data/bdatom.json:', err);
      return [];
    });

  return activeFetchPromise;
}

export function useBDatom() {
  const [records, setRecords] = useState<BDatomRecord[]>(() => cachedRecords || []);
  const [loading, setLoading] = useState<boolean>(() => !cachedRecords || cachedRecords.length === 0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (records.length > 0) return;

    let isMounted = true;
    setLoading(true);

    loadBDatomJson()
      .then((data) => {
        if (isMounted) {
          setRecords(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.message || 'Error cargando dataset');
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [records.length]);

  return { records, loading, error };
}

export default useBDatom;
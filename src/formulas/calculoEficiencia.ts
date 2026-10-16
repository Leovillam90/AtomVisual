// src/formulas/calculoEficiencia.ts
import { BDatomRecord } from '@/types/bdatom';
import { EficienciaLogisticaResult, DistribucionItem } from './types';
import { mapearEstadoStandard } from './calculoMetricas';

export function calcularEficienciaLogistica(data: BDatomRecord[] = []): EficienciaLogisticaResult {
  const totalPedidos = data.length;

  let totalProductos = 0;
  let recaudoNegocioTotal = 0;
  let recaudoProveedorTotal = 0;
  let utilidadTotal = 0;
  let fleteTotal = 0;

  let countPorConfirmar = 0;
  let countPendientes = 0;
  let countEnCurso = 0;
  let countNovedad = 0;
  let countEntregados = 0;
  let countDevolucion = 0;

  let devolucionesEnBodega = 0;
  let capitalRecuperado = 0;
  let capitalBloqueado = 0;
  let capitalPerdido = 0;
  let guiasMovilizadas = 0;

  const dailyBuckets: Record<string, { total: number; entregados: number; movilizados: number; novedades: number; stock: number }> = {};

  data.forEach((order) => {
    const cant = order.cantidad || 1;
    const recBod = order.recaudoProveedor || 0;
    const recNeg = order.recaudoNegocio || 0;
    const util = order.utilidad || 0;
    const fle = order.flete || 0;
    const diasUltMov = order.ultMovimiento || 0;
    const enBodega = order.devEnBodega === 'SI';

    totalProductos += cant;
    recaudoNegocioTotal += recNeg;
    recaudoProveedorTotal += recBod;
    utilidadTotal += util;
    fleteTotal += fle;

    const bucket = mapearEstadoStandard(order.tipoEstado);

    if (bucket === 'Por Confirmar') countPorConfirmar += 1;
    else if (bucket === 'Pendientes') countPendientes += 1;
    else if (bucket === 'En curso') countEnCurso += 1;
    else if (bucket === 'En novedad') countNovedad += 1;
    else if (bucket === 'Entregados') countEntregados += 1;
    else if (bucket === 'Devoluciones') countDevolucion += 1;

    if (bucket === 'Devoluciones') {
      if (enBodega) {
        devolucionesEnBodega += 1;
        capitalRecuperado += recBod;
      } else {
        capitalPerdido += recBod;
      }
    } else if (bucket === 'En novedad') {
      capitalBloqueado += recBod;
      if (diasUltMov <= 1) guiasMovilizadas += 1;
    } else if (bucket === 'En curso') {
      if (diasUltMov >= 3) {
        capitalBloqueado += recBod;
      } else {
        guiasMovilizadas += 1;
      }
    }

    if (order.fechaCreacion) {
      const dayKey = order.fechaCreacion.slice(5);
      if (!dailyBuckets[dayKey]) {
        dailyBuckets[dayKey] = { total: 0, entregados: 0, movilizados: 0, novedades: 0, stock: 0 };
      }
      const b = dailyBuckets[dayKey];
      b.total += 1;
      if (bucket === 'Entregados') b.entregados += 1;
      if (diasUltMov <= 1) b.movilizados += 1;
      if (bucket === 'En novedad') b.novedades += 1;
      if (bucket === 'Devoluciones' && enBodega) b.stock += 1;
    }
  });

  const tasaEntregaEfectiva = totalPedidos > 0 ? (countEntregados / totalPedidos) * 100 : 0;
  const tasaDevolucion = totalPedidos > 0 ? (countDevolucion / totalPedidos) * 100 : 0;
  const tasaRecuperacionStock = countDevolucion > 0 ? (devolucionesEnBodega / countDevolucion) * 100 : 100;

  const totalTransitoYNovedad = countEnCurso + countNovedad;
  const tasaMovilizacion = totalTransitoYNovedad > 0 ? (guiasMovilizadas / totalTransitoYNovedad) * 100 : 100;
  const tasaGestionNovedades = countNovedad > 0 ? Math.max(0, 100 - (countNovedad / totalPedidos) * 100) : 100;

  const aporteEntregados = Number((tasaEntregaEfectiva * 0.40).toFixed(1));
  const aporteMovilizacion = Number((tasaMovilizacion * 0.20).toFixed(1));
  const aporteNovedades = Number((tasaGestionNovedades * 0.20).toFixed(1));
  const aporteRecuperacion = Number((tasaRecuperacionStock * 0.20).toFixed(1));

  const scoreCalculado = Math.min(100, Math.max(0, Number((aporteEntregados + aporteMovilizacion + aporteNovedades + aporteRecuperacion).toFixed(1))));

  let nivelScore: EficienciaLogisticaResult['nivelScore'] = 'Riesgo';
  if (scoreCalculado >= 95) nivelScore = 'Elite';
  else if (scoreCalculado >= 85) nivelScore = 'Alto Rendimiento';
  else if (scoreCalculado >= 70) nivelScore = 'Estable';

  const pct = (c: number) => (totalPedidos > 0 ? Number(((c / totalPedidos) * 100).toFixed(1)) : 0);

  const distribucionEstados: DistribucionItem[] = [
    { nombre: 'Por confirmar', cantidad: countPorConfirmar, porcentaje: `${pct(countPorConfirmar)}%`, color: '#6366f1', widthPct: pct(countPorConfirmar) },
    { nombre: 'Pendientes', cantidad: countPendientes, porcentaje: `${pct(countPendientes)}%`, color: '#38bdf8', widthPct: pct(countPendientes) },
    { nombre: 'En curso', cantidad: countEnCurso, porcentaje: `${pct(countEnCurso)}%`, color: '#facc15', widthPct: pct(countEnCurso) },
    { nombre: 'Con novedad', cantidad: countNovedad, porcentaje: `${pct(countNovedad)}%`, color: '#fb923c', widthPct: pct(countNovedad) },
    { nombre: 'Entregados', cantidad: countEntregados, porcentaje: `${pct(countEntregados)}%`, color: '#10b981', widthPct: pct(countEntregados) },
    { nombre: 'En devolución', cantidad: countDevolucion, porcentaje: `${pct(countDevolucion)}%`, color: '#ef4444', widthPct: pct(countDevolucion) },
  ];

  const utilidadProtegida = recaudoProveedorTotal * (tasaEntregaEfectiva / 100);
  const utilidadEnRiesgo = capitalBloqueado + capitalPerdido;

  return {
    score: scoreCalculado,
    nivelScore,
    promedioNacional: 61.1,
    diferenciaPromedio: (scoreCalculado - 61.1) >= 0 ? `+${(scoreCalculado - 61.1).toFixed(1)} pts sobre el promedio` : `${(scoreCalculado - 61.1).toFixed(1)} pts bajo el promedio`,
    percentil: scoreCalculado >= 70 ? 'Top 18.4% · percentil 82' : 'Top 33.9% · percentil 66',
    totalPedidos,
    totalProductos,
    componentesScore: {
      entregados: { porcentaje: Number(tasaEntregaEfectiva.toFixed(1)), aporte: aporteEntregados },
      movilizacion: { porcentaje: Number(tasaMovilizacion.toFixed(1)), aporte: aporteMovilizacion },
      novedades: { porcentaje: Number(tasaGestionNovedades.toFixed(1)), aporte: aporteNovedades },
      recuperacion: { porcentaje: Number(tasaRecuperacionStock.toFixed(1)), aporte: aporteRecuperacion },
    },
    resumenOperativo: {
      pedidosGenerados: totalPedidos,
      tasaEntregaEfectiva: Number(tasaEntregaEfectiva.toFixed(1)),
      tasaRecuperacion: Number(tasaRecuperacionStock.toFixed(1)),
      tasaMovilizacion: Number(tasaMovilizacion.toFixed(1)),
    },
    distribucionEstados,
    impactoFinanciero: {
      utilidadProtegida: Math.round(utilidadProtegida),
      utilidadEnRiesgo: Math.round(utilidadEnRiesgo),
      recaudoProveedor: Math.round(recaudoProveedorTotal),
      capitalRecuperado: Math.round(capitalRecuperado),
      capitalBloqueado: Math.round(capitalBloqueado),
      capitalPerdido: Math.round(capitalPerdido),
    },
    ecoScanner: {
      usoGlobal: Number(tasaRecuperacionStock.toFixed(1)),
      salidasEscaneadas: 96.3,
      devolucionesEscaneadas: Number(tasaRecuperacionStock.toFixed(1)),
      salidasRatio: `${totalPedidos} / ${totalPedidos} paquetes`,
      devolucionesRatio: `${devolucionesEnBodega} / ${countDevolucion} paquetes`,
    },
    scoreTrendData: Object.keys(dailyBuckets).sort().slice(-14).map((date) => {
      const b = dailyBuckets[date];
      const entRate = b.total > 0 ? (b.entregados / b.total) * 100 : 0;
      const movRate = b.total > 0 ? (b.movilizados / b.total) * 100 : 100;
      const novRate = b.total > 0 ? Math.max(0, 100 - (b.novedades / b.total) * 100) : 100;
      return {
        date,
        score: Math.min(100, Math.max(30, Math.round(entRate * 0.40 + movRate * 0.20 + novRate * 0.20 + tasaRecuperacionStock * 0.20))),
      };
    }),
  };
}
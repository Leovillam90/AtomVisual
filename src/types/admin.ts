// src/types/admin.ts

export type RolAdmin = 'ADMIN_NORMAL' | 'SUPER_ADMIN';

export type EstadoCuenta = 'ACTIVA' | 'BANEADA' | 'SUSPENDIDA' | 'CANCELADA';

export type PaisOperacion = 'Colombia' | 'México' | 'Ecuador' | 'Panamá' | 'Chile';

export interface ProveedorCuenta {
  id: string;
  nombre: string;
  correo: string;
  pais: PaisOperacion;
  estado: EstadoCuenta;
  fechaRegistro: string;
  tokenIntegracion: string;
  autorizadoAdminNormal: boolean;
  ordenesMes: number;
  efectividadPct: number;
  facturacionMensual: number;
  ultimoAcceso: string;
}

export interface MacroAnalyticsData {
  resumenGlobal: {
    totalProveedores: number;
    ordenesTotales: number;
    volumenGMV: number;
    tasaEfectividadGlobal: number;
    capitalRecuperadoAgentes: number;
  };
  productos: {
    totalCatalogo: number;
    categoriasTop: { categoria: string; volumen: number; devPct: number }[];
  };
  negocios: {
    tiendasConectadas: number;
    promedioTiendasPorProveedor: number;
    retencionTiendasPct: number;
  };
  transportadoras: {
    transportadora: string;
    pais: string;
    efectividadPct: number;
    tiempoPromedioDias: number;
    volumenGuias: number;
  }[];
  suiteAgentes: {
    agente30D: { reclamacionesCas: number; montoRecuperado: number };
    agente10D: { reclamacionesCas: number; montoRecuperado: number };
    agente7DDevoluciones: { reclamacionesCas: number; montoEnBodega: number };
    agente3DMovilidad: { tasaMovilizacion: number; guiasEstancadas: number };
    pushAppDropi: { totalReportado: number; horaEjecucion: string; proveedoresAlcanzados: number };
  };
}
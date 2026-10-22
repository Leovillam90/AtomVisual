// src/app/Administrador/page.tsx (o src/app/Administrador/supremo/page.tsx)
'use client';

import React, { useState, useMemo } from 'react';
import { 
  ShieldCheck, 
  Search, 
  Key, 
  Ban, 
  UserCheck, 
  RotateCcw, 
  AlertTriangle, 
  Eye, 
  X, 
  Lock, 
  Copy, 
  Check, 
  Calendar, 
  Clock, 
  Trash2, 
  ClipboardPaste, 
  CalendarDays, 
  UserCog, 
  RefreshCw, 
  UserPlus
} from 'lucide-react';

interface ProveedorCuenta {
  id: string;
  nombre: string;
  correo: string;
  pais: 'Colombia' | 'México' | 'Ecuador' | 'Panamá' | 'Perú';
  bandera: string;
  estado: 'ACTIVA' | 'BANEADA' | 'CANCELADA';
  autorizadoAdminNormal: boolean;
  permisosAdminNormal: {
    verProductos: boolean;
    verNegocios: boolean;
    verTransportadoras: boolean;
    verGuias: boolean;
    impersonarLectura: boolean;
  };
  analistaAsignado: string;
  tokenIntegracion: string;
  fechaInicio: string;
  fechaFin: string;
  totalOrdenesMes: number;
  facturacionMes: number;
  cronJobsActivos: boolean;
}

const CUENTAS_BASE: ProveedorCuenta[] = [
  {
    id: 'PRV-1092',
    nombre: 'Laboratorios Cosmética Natural SAS',
    correo: 'gerencia@cosmeticanatural.co',
    pais: 'Colombia',
    bandera: '🇨🇴',
    estado: 'ACTIVA',
    autorizadoAdminNormal: true,
    permisosAdminNormal: {
      verProductos: true,
      verNegocios: true,
      verTransportadoras: true,
      verGuias: true,
      impersonarLectura: true
    },
    analistaAsignado: 'soporte.colombia@atom.com',
    tokenIntegracion: 'atm_live_sec_8921f09e2a8bc9440',
    fechaInicio: '2026-01-01',
    fechaFin: '2027-01-01',
    totalOrdenesMes: 4890,
    facturacionMes: 195600000,
    cronJobsActivos: true
  },
  {
    id: 'PRV-1093',
    nombre: 'Importadora & Distribuidora Andina',
    correo: 'contacto@distribuidoraandina.com',
    pais: 'Colombia',
    bandera: '🇨🇴',
    estado: 'ACTIVA',
    autorizadoAdminNormal: true,
    permisosAdminNormal: {
      verProductos: true,
      verNegocios: true,
      verTransportadoras: true,
      verGuias: true,
      impersonarLectura: false
    },
    analistaAsignado: 'soporte.colombia@atom.com',
    tokenIntegracion: 'atm_live_sec_7712a45d9e10ff612',
    fechaInicio: '2026-03-01',
    fechaFin: '2026-12-31',
    totalOrdenesMes: 3420,
    facturacionMes: 136800000,
    cronJobsActivos: true
  },
  {
    id: 'PRV-1094',
    nombre: 'BioVital Tech México SA de CV',
    correo: 'operaciones@biovital.mx',
    pais: 'México',
    bandera: '🇲🇽',
    estado: 'ACTIVA',
    autorizadoAdminNormal: false,
    permisosAdminNormal: {
      verProductos: false,
      verNegocios: false,
      verTransportadoras: false,
      verGuias: false,
      impersonarLectura: false
    },
    analistaAsignado: 'Sin asignar',
    tokenIntegracion: 'atm_live_sec_4419bb72a088cd114',
    fechaInicio: '2026-04-15',
    fechaFin: '2027-04-15',
    totalOrdenesMes: 2850,
    facturacionMes: 98400000,
    cronJobsActivos: true
  },
  {
    id: 'PRV-1095',
    nombre: 'MegaSuplementos del Pacífico',
    correo: 'fraude_alerta@megasuplementos.com',
    pais: 'Ecuador',
    bandera: '🇪🇨',
    estado: 'BANEADA',
    autorizadoAdminNormal: false,
    permisosAdminNormal: {
      verProductos: false,
      verNegocios: false,
      verTransportadoras: false,
      verGuias: false,
      impersonarLectura: false
    },
    analistaAsignado: 'Sin asignar',
    tokenIntegracion: 'atm_revoked_0009182aaec7781',
    fechaInicio: '2026-05-01',
    fechaFin: '2026-11-01',
    totalOrdenesMes: 640,
    facturacionMes: 18500000,
    cronJobsActivos: false
  },
  {
    id: 'PRV-1096',
    nombre: 'Panama Logistics & Retail Corp',
    correo: 'admin@panamaretail.pa',
    pais: 'Panamá',
    bandera: '🇵🇦',
    estado: 'CANCELADA',
    autorizadoAdminNormal: false,
    permisosAdminNormal: {
      verProductos: false,
      verNegocios: false,
      verTransportadoras: false,
      verGuias: false,
      impersonarLectura: false
    },
    analistaAsignado: 'Sin asignar',
    tokenIntegracion: 'atm_revoked_ccl99823100feee',
    fechaInicio: '2026-01-10',
    fechaFin: '2026-07-10',
    totalOrdenesMes: 0,
    facturacionMes: 0,
    cronJobsActivos: false
  },
  {
    id: 'PRV-1097',
    nombre: 'NutraHealth Perú SAC',
    correo: 'logistica@nutrahealth.pe',
    pais: 'Perú',
    bandera: '🇵🇪',
    estado: 'ACTIVA',
    autorizadoAdminNormal: true,
    permisosAdminNormal: {
      verProductos: true,
      verNegocios: true,
      verTransportadoras: true,
      verGuias: false,
      impersonarLectura: true
    },
    analistaAsignado: 'soporte.peru@atom.com',
    tokenIntegracion: 'atm_live_sec_99120ffc812bb563',
    fechaInicio: '2026-06-01',
    fechaFin: '2027-06-01',
    totalOrdenesMes: 1980,
    facturacionMes: 74200000,
    cronJobsActivos: true
  }
];

function checkVigencia(fechaFinStr: string) {
  if (!fechaFinStr) return { dias: 0, badge: 'Sin vigencia', estilo: 'bg-slate-100 text-slate-500 border-slate-200' };
  const hoy = new Date();
  const fin = new Date(fechaFinStr);
  const diffTime = fin.getTime() - hoy.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return { dias: diffDays, badge: `Expirada hace ${Math.abs(diffDays)}d`, estilo: 'bg-rose-50 text-rose-700 border-rose-200' };
  } else if (diffDays <= 15) {
    return { dias: diffDays, badge: `Vence en ${diffDays}d`, estilo: 'bg-amber-50 text-amber-700 border-amber-200' };
  } else {
    return { dias: diffDays, badge: `${diffDays}d vigentes`, estilo: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
  }
}

export default function AdministradorSupremoPage() {
  const [cuentas, setCuentas] = useState<ProveedorCuenta[]>(CUENTAS_BASE);

  // Filtros
  const [filtroPais, setFiltroPais] = useState<string>('(Todos)');
  const [busqueda, setBusqueda] = useState<string>('');
  const [filtroEstado, setFiltroEstado] = useState<string>('(Todos)');
  const [filtroAutorizado, setFiltroAutorizado] = useState<string>('(Todos)');

  // 1. Modal para Asignar Nuevo Administrador Global
  const [modalNuevoAdminGlobal, setModalNuevoAdminGlobal] = useState<boolean>(false);
  const [nuevoAdminForm, setNuevoAdminForm] = useState({
    nombre: '',
    correo: '',
    rol: 'Admin Normal',
    pais: 'Colombia',
    permisos: {
      verProductos: true,
      verNegocios: true,
      verTransportadoras: true,
      verGuias: true,
      impersonarLectura: true
    }
  });

  // 2. Modal para Asignar / Gestionar Administrador de esta Cuenta
  const [modalPermisosAdmin, setModalPermisosAdmin] = useState<{
    cuenta: ProveedorCuenta;
    autorizado: boolean;
    analista: string;
    permisos: {
      verProductos: boolean;
      verNegocios: boolean;
      verTransportadoras: boolean;
      verGuias: boolean;
      impersonarLectura: boolean;
    };
  } | null>(null);

  // 3. Modal de Token
  const [modalToken, setModalToken] = useState<{
    cuenta: ProveedorCuenta;
    nuevoTokenInput: string;
  } | null>(null);

  // 4. Modal de Vigencia
  const [modalVigencia, setModalVigencia] = useState<{
    cuenta: ProveedorCuenta;
    fechaInicio: string;
    fechaFin: string;
    activarInmediato: boolean;
  } | null>(null);

  // 5. Modal de Acciones Críticas
  const [modalAccionCritica, setModalAccionCritica] = useState<{
    tipo: 'BANEAR' | 'CANCELAR' | 'REACTIVAR';
    cuenta: ProveedorCuenta;
  } | null>(null);

  // 6. Modal de Impersonación
  const [cuentaImpersonada, setCuentaImpersonada] = useState<ProveedorCuenta | null>(null);
  const [tokenCopiado, setTokenCopiado] = useState<string | null>(null);

  const copiarTexto = (txt: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(txt);
      setTokenCopiado(txt);
      setTimeout(() => setTokenCopiado(null), 2000);
    }
  };

  // Filtrado reactivo
  const cuentasFiltradas = useMemo(() => {
    return cuentas.filter((c) => {
      if (filtroPais !== '(Todos)' && c.pais !== filtroPais) return false;
      if (filtroEstado !== '(Todos)' && c.estado !== filtroEstado) return false;
      if (filtroAutorizado === 'SI' && !c.autorizadoAdminNormal) return false;
      if (filtroAutorizado === 'NO' && c.autorizadoAdminNormal) return false;
      if (busqueda.trim()) {
        const query = busqueda.toLowerCase().trim();
        const matchNom = c.nombre.toLowerCase().includes(query);
        const matchMail = c.correo.toLowerCase().includes(query);
        const matchId = c.id.toLowerCase().includes(query);
        const matchTok = c.tokenIntegracion.toLowerCase().includes(query);
        if (!matchNom && !matchMail && !matchId && !matchTok) return false;
      }
      return true;
    });
  }, [cuentas, filtroPais, filtroEstado, filtroAutorizado, busqueda]);

  const activasCount = cuentas.filter(c => c.estado === 'ACTIVA').length;
  const baneadasCount = cuentas.filter(c => c.estado === 'BANEADA').length;

  // Handlers
  const crearNuevoAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nuevoAdminForm.correo.trim()) {
      alert('Ingresa el correo corporativo del administrador.');
      return;
    }
    alert(`Administrador ${nuevoAdminForm.correo} asignado exitosamente con rol [${nuevoAdminForm.rol}] para ${nuevoAdminForm.pais}.`);
    setModalNuevoAdminGlobal(false);
  };

  const guardarPermisosAdminNormal = () => {
    if (!modalPermisosAdmin) return;
    const { cuenta, autorizado, analista, permisos } = modalPermisosAdmin;

    setCuentas((prev) =>
      prev.map((c) => {
        if (c.id !== cuenta.id) return c;
        return {
          ...c,
          autorizadoAdminNormal: autorizado,
          analistaAsignado: autorizado ? (analista.trim() || 'Soporte General') : 'Sin asignar',
          permisosAdminNormal: permisos
        };
      })
    );
    setModalPermisosAdmin(null);
  };

  const guardarNuevoToken = () => {
    if (!modalToken) return;
    const { cuenta, nuevoTokenInput } = modalToken;
    const tokenLimpio = nuevoTokenInput.trim();

    if (!tokenLimpio) {
      alert('Debes ingresar o pegar un token válido.');
      return;
    }

    setCuentas((prev) =>
      prev.map((c) => (c.id === cuenta.id ? { ...c, tokenIntegracion: tokenLimpio } : c))
    );
    setModalToken(null);
  };

  const eliminarTokenActual = () => {
    if (!modalToken) return;
    setCuentas((prev) => prev.map((c) => (c.id === modalToken.cuenta.id ? { ...c, tokenIntegracion: '' } : c)));
    setModalToken((prev) => (prev ? { ...prev, cuenta: { ...prev.cuenta, tokenIntegracion: '' } } : null));
  };

  const guardarVigencia = () => {
    if (!modalVigencia) return;
    const { cuenta, fechaInicio, fechaFin, activarInmediato } = modalVigencia;

    if (!fechaInicio || !fechaFin) {
      alert('Debes definir tanto la fecha de inicio como la fecha de fin.');
      return;
    }

    if (new Date(fechaInicio) > new Date(fechaFin)) {
      alert('La fecha de inicio no puede ser posterior a la fecha de fin.');
      return;
    }

    setCuentas((prev) =>
      prev.map((c) => {
        if (c.id !== cuenta.id) return c;
        return {
          ...c,
          fechaInicio,
          fechaFin,
          estado: activarInmediato ? 'ACTIVA' : c.estado,
          cronJobsActivos: activarInmediato ? true : c.cronJobsActivos
        };
      })
    );
    setModalVigencia(null);
  };

  const ejecutarAccionCritica = () => {
    if (!modalAccionCritica) return;
    const { tipo, cuenta } = modalAccionCritica;

    setCuentas((prev) =>
      prev.map((c) => {
        if (c.id !== cuenta.id) return c;
        if (tipo === 'BANEAR') {
          return { ...c, estado: 'BANEADA', cronJobsActivos: false, autorizadoAdminNormal: false };
        } else if (tipo === 'CANCELAR') {
          return { ...c, estado: 'CANCELADA', cronJobsActivos: false, autorizadoAdminNormal: false, tokenIntegracion: `atm_revoked_${Math.random().toString(36).substring(2, 8)}` };
        } else if (tipo === 'REACTIVAR') {
          return { ...c, estado: 'ACTIVA', cronJobsActivos: true };
        }
        return c;
      })
    );
    setModalAccionCritica(null);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 p-6 lg:p-8 font-sans space-y-5">
      
      {/* 1. CABECERA SUPREMA */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-3 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-xs">
              <ShieldCheck size={18} strokeWidth={2.4} />
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Centro de Gobierno ATOM
            </h1>
            <span className="bg-purple-100/80 text-purple-800 border border-purple-200 font-extrabold text-[10.5px] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              SuperAdmin
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Control de cuentas, vigencia con límites, reseteo de tokens y asignación de administradores.
          </p>
        </div>

        {/* BOTÓN ASIGNAR ADMINISTRADOR */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setModalNuevoAdminGlobal(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors shadow-xs cursor-pointer"
          >
            <UserPlus size={15} strokeWidth={2.3} />
            <span>Asignar Administrador</span>
          </button>
        </div>
      </div>

      {/* 2. BARRA DE FILTROS */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          
          <div className="md:col-span-5 relative">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por Nombre, Correo, ID Cuenta o Token..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 outline-none focus:border-purple-500 transition-colors font-medium"
            />
          </div>

          <div className="md:col-span-3">
            <select
              value={filtroPais}
              onChange={(e) => setFiltroPais(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 outline-none cursor-pointer"
            >
              <option value="(Todos)">🌍 País: (Todos)</option>
              <option value="Colombia">🇨🇴 Colombia</option>
              <option value="México">🇲🇽 México</option>
              <option value="Ecuador">🇪🇨 Ecuador</option>
              <option value="Panamá">🇵🇦 Panamá</option>
              <option value="Perú">🇵🇪 Perú</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <select
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 outline-none cursor-pointer"
            >
              <option value="(Todos)">Estado: (Todos)</option>
              <option value="ACTIVA">🟢 Activa</option>
              <option value="BANEADA">🔴 Baneada</option>
              <option value="CANCELADA">⚫ Cancelada</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <select
              value={filtroAutorizado}
              onChange={(e) => setFiltroAutorizado(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 outline-none cursor-pointer"
            >
              <option value="(Todos)">Admin Normal: (Todos)</option>
              <option value="SI">✓ Asignado</option>
              <option value="NO">✕ Sin Asignar</option>
            </select>
          </div>

        </div>

        <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
          <span>
            Mostrando <strong>{cuentasFiltradas.length}</strong> de <strong>{cuentas.length}</strong> cuentas registradas
          </span>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <strong className="text-slate-700">{activasCount}</strong> Activas
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              <strong className="text-slate-700">{baneadasCount}</strong> Baneadas
            </span>
          </div>
        </div>
      </div>

      {/* 3. TABLA PRINCIPAL DE GOBIERNO CON MÁRGENES EQUILIBRADOS */}
      <div className="bg-white border border-slate-200/90 rounded-2xl shadow-xs overflow-hidden overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[1200px] text-xs">
          <thead>
            <tr className="border-b border-slate-200 text-[10.5px] uppercase font-bold text-slate-500 bg-slate-50/90">
              <th className="py-3 px-4 w-[24%]">PROVEEDOR / ID</th>
              <th className="py-3 px-2 text-center w-[8%]">PAÍS</th>
              <th className="py-3 px-3 w-[17%]">VIGENCIA (INICIO - FIN)</th>
              <th className="py-3 px-3 w-[16%]">TOKEN INTEGRACIÓN</th>
              <th className="py-3 px-2 text-center w-[8%]">ESTADO</th>
              <th className="py-3 px-2 text-center w-[12%]">ADMIN ASIGNADO</th>
              <th className="py-3 px-2 text-center w-[5%]">CRON</th>
              <th className="py-3 px-4 text-right w-[10%]">ACCIONES</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {cuentasFiltradas.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-slate-400 font-medium">
                  No se encontraron cuentas con los criterios de búsqueda aplicados.
                </td>
              </tr>
            ) : (
              cuentasFiltradas.map((c) => {
                const vig = checkVigencia(c.fechaFin);

                return (
                  <tr key={c.id} className="hover:bg-slate-50/70 transition-colors">
                    
                    {/* Proveedor / ID */}
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-slate-900 text-xs truncate max-w-[260px]">{c.nombre}</p>
                      <p className="text-[11px] text-slate-400 font-mono mt-0.5 truncate max-w-[260px]">{c.correo}</p>
                      <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-mono font-bold mt-1 inline-block">
                        {c.id}
                      </span>
                    </td>

                    {/* País */}
                    <td className="py-3.5 px-2 text-center whitespace-nowrap">
                      <span className="text-base" title={c.pais}>{c.bandera}</span>
                      <p className="text-[10px] text-slate-500 font-bold">{c.pais}</p>
                    </td>

                    {/* Vigencia con whitespace-nowrap */}
                    <td className="py-3.5 px-3 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 font-mono text-[11px] font-semibold text-slate-700">
                        <Calendar size={13} className="text-slate-400 shrink-0" />
                        <span>{c.fechaInicio} ➔ {c.fechaFin}</span>
                      </div>
                      <span className={`inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-md border ${vig.estilo}`}>
                        {vig.badge}
                      </span>
                    </td>

                    {/* Token de Integración */}
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-1.5 font-mono text-[11px] bg-slate-50 border border-slate-200 px-2 py-1.5 rounded-xl w-fit max-w-[170px]">
                        <Key size={12} className="text-purple-600 shrink-0" />
                        <span className="text-slate-700 font-semibold truncate">
                          {c.tokenIntegracion || '(Sin Token)'}
                        </span>
                        {c.tokenIntegracion && (
                          <button
                            type="button"
                            onClick={() => copiarTexto(c.tokenIntegracion)}
                            className="text-slate-400 hover:text-slate-700 cursor-pointer ml-0.5 shrink-0"
                            title="Copiar token"
                          >
                            {tokenCopiado === c.tokenIntegracion ? (
                              <Check size={11} className="text-emerald-600" />
                            ) : (
                              <Copy size={11} />
                            )}
                          </button>
                        )}
                      </div>
                    </td>

                    {/* Estado Cuenta */}
                    <td className="py-3.5 px-2 text-center whitespace-nowrap">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-wider uppercase border inline-block ${
                        c.estado === 'ACTIVA'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : c.estado === 'BANEADA'
                          ? 'bg-rose-50 text-rose-700 border-rose-200'
                          : 'bg-slate-100 text-slate-600 border-slate-300'
                      }`}>
                        {c.estado}
                      </span>
                    </td>

                    {/* Admin Normal Asignado */}
                    <td className="py-3.5 px-2 text-center whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() =>
                          setModalPermisosAdmin({
                            cuenta: c,
                            autorizado: c.autorizadoAdminNormal,
                            analista: c.analistaAsignado,
                            permisos: { ...c.permisosAdminNormal }
                          })
                        }
                        className={`px-2.5 py-1 rounded-xl text-[10.5px] font-bold border inline-flex items-center gap-1.5 cursor-pointer transition-all ${
                          c.autorizadoAdminNormal
                            ? 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100'
                            : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'
                        }`}
                        title="Click para asignar o editar permisos de Admin Normal"
                      >
                        {c.autorizadoAdminNormal ? <UserCheck size={13} className="shrink-0" /> : <UserPlus size={13} className="shrink-0 text-slate-400" />}
                        <span className="truncate max-w-[110px]">
                          {c.autorizadoAdminNormal ? c.analistaAsignado : '+ Asignar Admin'}
                        </span>
                      </button>
                    </td>

                    {/* Cron Jobs */}
                    <td className="py-3.5 px-2 text-center whitespace-nowrap">
                      <span className={`w-2.5 h-2.5 rounded-full inline-block ${
                        c.cronJobsActivos ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'
                      }`} title={c.cronJobsActivos ? 'Cron jobs activos' : 'Cron jobs detenidos'} />
                    </td>

                    {/* Acciones de Gobierno (Alineadas en una sola fila sin saltos) */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5 whitespace-nowrap">
                        
                        {/* Impersonar Modo Lectura */}
                        <button
                          type="button"
                          onClick={() => setCuentaImpersonada(c)}
                          className="px-2 py-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-[11px] font-bold inline-flex items-center gap-1 shadow-2xs cursor-pointer"
                          title="Inspeccionar en Modo Lectura"
                        >
                          <Eye size={12} className="text-blue-600" />
                          <span>Ver</span>
                        </button>

                        {/* Gestionar Token */}
                        <button
                          type="button"
                          onClick={() => setModalToken({ cuenta: c, nuevoTokenInput: '' })}
                          className="px-2 py-1 rounded-lg border border-purple-200 bg-purple-50 hover:bg-purple-100 text-purple-700 text-[11px] font-bold inline-flex items-center gap-1 cursor-pointer"
                          title="Gestionar Token (Eliminar o Pegar)"
                        >
                          <Key size={12} />
                          <span>Token</span>
                        </button>

                        {/* Configurar Vigencia */}
                        <button
                          type="button"
                          onClick={() =>
                            setModalVigencia({
                              cuenta: c,
                              fechaInicio: c.fechaInicio || '2026-10-21',
                              fechaFin: c.fechaFin || '2027-10-21',
                              activarInmediato: c.estado !== 'ACTIVA'
                            })
                          }
                          className="px-2 py-1 rounded-lg border border-amber-200 bg-amber-50 hover:bg-amber-100 text-amber-700 text-[11px] font-bold inline-flex items-center gap-1 cursor-pointer"
                          title="Configurar fecha límite de activación"
                        >
                          <Calendar size={12} />
                          <span>Vigencia</span>
                        </button>

                        {/* Banear / Reactivar */}
                        {c.estado === 'ACTIVA' ? (
                          <button
                            type="button"
                            onClick={() => setModalAccionCritica({ tipo: 'BANEAR', cuenta: c })}
                            className="p-1.5 rounded-lg border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 cursor-pointer"
                            title="Banear cuenta"
                          >
                            <Ban size={13} />
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setModalAccionCritica({ tipo: 'REACTIVAR', cuenta: c })}
                            className="p-1.5 rounded-lg border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 cursor-pointer"
                            title="Reactivar cuenta"
                          >
                            <RotateCcw size={13} />
                          </button>
                        )}

                        {/* Cancelar Cuenta */}
                        {c.estado !== 'CANCELADA' && (
                          <button
                            type="button"
                            onClick={() => setModalAccionCritica({ tipo: 'CANCELAR', cuenta: c })}
                            className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-500 cursor-pointer"
                            title="Cancelar cuenta definitivamente"
                          >
                            <X size={13} />
                          </button>
                        )}

                      </div>
                    </td>

                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* =========================================================
          MODAL A: ASIGNAR NUEVO ADMINISTRADOR (GLOBAL)
      ========================================================== */}
      {modalNuevoAdminGlobal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-slate-200 rounded-[28px] p-6 max-w-lg w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                  <UserPlus size={18} strokeWidth={2.4} />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">
                    Asignar como Administrador
                  </h3>
                  <p className="text-xs text-slate-400">
                    Registrar nuevo analista operativo o SuperAdmin en ATOM
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setModalNuevoAdminGlobal(false)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer p-1"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={crearNuevoAdmin} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Nombre Completo:</label>
                  <input
                    type="text"
                    required
                    placeholder="ej: Carlos Mendoza"
                    value={nuevoAdminForm.nombre}
                    onChange={(e) => setNuevoAdminForm(prev => ({ ...prev, nombre: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 outline-none focus:border-purple-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Rol a Asignar:</label>
                  <select
                    value={nuevoAdminForm.rol}
                    onChange={(e) => setNuevoAdminForm(prev => ({ ...prev, rol: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 outline-none focus:border-purple-500 cursor-pointer"
                  >
                    <option value="Admin Normal">Admin Normal (Soporte Operativo)</option>
                    <option value="SuperAdmin">SuperAdmin (Gobierno Total)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Correo Electrónico:</label>
                  <input
                    type="email"
                    required
                    placeholder="soporte.colombia@atom.com"
                    value={nuevoAdminForm.correo}
                    onChange={(e) => setNuevoAdminForm(prev => ({ ...prev, correo: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 outline-none focus:border-purple-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">País de Cobertura:</label>
                  <select
                    value={nuevoAdminForm.pais}
                    onChange={(e) => setNuevoAdminForm(prev => ({ ...prev, pais: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 outline-none focus:border-purple-500 cursor-pointer"
                  >
                    <option value="Colombia">🇨🇴 Colombia</option>
                    <option value="México">🇲🇽 México</option>
                    <option value="Ecuador">🇪🇨 Ecuador</option>
                    <option value="Panamá">🇵🇦 Panamá</option>
                    <option value="Perú">🇵🇪 Perú</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5 pt-1">
                <span className="font-bold text-slate-700 block">Permisos operativos habilitados:</span>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                  {[
                    { key: 'verProductos', label: 'Acceso a Módulo de Productos' },
                    { key: 'verNegocios', label: 'Acceso a Módulo de Negocios (Dropshippers)' },
                    { key: 'verTransportadoras', label: 'Acceso a Módulo de Transportadoras' },
                    { key: 'verGuias', label: 'Acceso a Detalle de Guías & Reclamaciones' },
                    { key: 'impersonarLectura', label: 'Permiso para Impersonar Proveedores en Modo Lectura' }
                  ].map((p) => (
                    <label key={p.key} className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={(nuevoAdminForm.permisos as any)[p.key]}
                        onChange={(e) => {
                          const checked = e.target.checked;
                          setNuevoAdminForm(prev => ({
                            ...prev,
                            permisos: { ...prev.permisos, [p.key]: checked }
                          }));
                        }}
                        className="w-4 h-4 text-purple-600 rounded"
                      />
                      <span className="text-slate-700 font-medium">{p.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setModalNuevoAdminGlobal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-black shadow-xs cursor-pointer flex items-center gap-1.5"
                >
                  <Check size={14} />
                  <span>Guardar Administrador</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================
          MODAL B: GESTIÓN DE PERMISOS ADMIN NORMAL POR CUENTA
      ========================================================== */}
      {modalPermisosAdmin && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-slate-200 rounded-[28px] p-6 max-w-lg w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                  <UserCog size={18} strokeWidth={2.4} />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">
                    Asignar Administrador a Cuenta
                  </h3>
                  <p className="text-xs text-slate-400">
                    {modalPermisosAdmin.cuenta.nombre} ({modalPermisosAdmin.cuenta.id})
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setModalPermisosAdmin(null)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer p-1"
              >
                <X size={16} />
              </button>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-900">Habilitar Soporte para Admin Normal</p>
                <p className="text-[11px] text-slate-500">Permite a los analistas operativos buscar y dar soporte a esta cuenta</p>
              </div>
              <button
                type="button"
                onClick={() => setModalPermisosAdmin(prev => prev ? { ...prev, autorizado: !prev.autorizado } : null)}
                className={`px-3 py-1.5 rounded-xl text-xs font-black cursor-pointer transition-colors ${
                  modalPermisosAdmin.autorizado
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'bg-slate-200 text-slate-600'
                }`}
              >
                {modalPermisosAdmin.autorizado ? '✓ AUTORIZADO' : '✕ BLOQUEADO'}
              </button>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Analista o Correo Asignado:</label>
              <input
                type="text"
                value={modalPermisosAdmin.analista}
                disabled={!modalPermisosAdmin.autorizado}
                onChange={(e) => setModalPermisosAdmin(prev => prev ? { ...prev, analista: e.target.value } : null)}
                placeholder="ej: soporte.colombia@atom.com o Todos los Analistas"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 outline-none focus:border-purple-500 disabled:opacity-50"
              />
            </div>

            <div className="space-y-1.5">
              <span className="text-xs font-bold text-slate-700">Alcance de visualización permitido:</span>
              <div className="space-y-2 p-3 bg-slate-50/70 border border-slate-200 rounded-xl text-xs">
                {[
                  { key: 'verProductos', label: 'Módulo de Productos (Ranking y rotación)' },
                  { key: 'verNegocios', label: 'Módulo de Negocios (Canales Dropshipper)' },
                  { key: 'verTransportadoras', label: 'Módulo de Transportadoras (Efectividad)' },
                  { key: 'verGuias', label: 'Detalle de Guías & Reclamaciones CAS' },
                  { key: 'impersonarLectura', label: 'Permitir Impersonación Completa en Modo Lectura' }
                ].map((item) => (
                  <label key={item.key} className="flex items-center gap-2.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={(modalPermisosAdmin.permisos as any)[item.key]}
                      disabled={!modalPermisosAdmin.autorizado}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        setModalPermisosAdmin(prev => prev ? {
                          ...prev,
                          permisos: { ...prev.permisos, [item.key]: checked }
                        } : null);
                      }}
                      className="w-4 h-4 text-purple-600 rounded disabled:opacity-40"
                    />
                    <span className={modalPermisosAdmin.autorizado ? 'text-slate-700 font-medium' : 'text-slate-400'}>
                      {item.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setModalPermisosAdmin(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-50 cursor-pointer text-xs"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={guardarPermisosAdminNormal}
                className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-black shadow-xs cursor-pointer text-xs flex items-center gap-1.5"
              >
                <Check size={14} />
                <span>Guardar Asignación</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          MODAL C: ELIMINAR / PEGAR NUEVO TOKEN
      ========================================================== */}
      {modalToken && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-slate-200 rounded-[28px] p-6 max-w-lg w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                  <Key size={18} strokeWidth={2.4} />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">
                    Gestionar Token Criptográfico
                  </h3>
                  <p className="text-xs text-slate-400">
                    {modalToken.cuenta.nombre} ({modalToken.cuenta.id})
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setModalToken(null)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer p-1"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600">Token Actual:</label>
              <div className="flex items-center justify-between gap-2 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono">
                <span className="text-slate-800 truncate select-all">
                  {modalToken.cuenta.tokenIntegracion || '(Sin token registrado)'}
                </span>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => copiarTexto(modalToken.cuenta.tokenIntegracion)}
                    className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer"
                    title="Copiar token"
                  >
                    <Copy size={13} />
                  </button>
                  <button
                    type="button"
                    onClick={eliminarTokenActual}
                    className="p-1 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded cursor-pointer"
                    title="Eliminar token actual"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700">Pegar o escribir nuevo token:</label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={async () => {
                      try {
                        const clipText = await navigator.clipboard.readText();
                        setModalToken(prev => prev ? { ...prev, nuevoTokenInput: clipText } : null);
                      } catch {
                        alert('Pega el token manualmente en el recuadro.');
                      }
                    }}
                    className="text-[11px] font-bold text-purple-600 hover:text-purple-800 flex items-center gap-1 cursor-pointer"
                  >
                    <ClipboardPaste size={12} /> Pegar
                  </button>
                  <span className="text-slate-300">|</span>
                  <button
                    type="button"
                    onClick={() => {
                      const hash = 'atm_live_sec_' + Math.random().toString(36).substring(2, 12) + Math.random().toString(36).substring(2, 8);
                      setModalToken(prev => prev ? { ...prev, nuevoTokenInput: hash } : null);
                    }}
                    className="text-[11px] font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer"
                  >
                    <RefreshCw size={11} /> Autogenerar
                  </button>
                </div>
              </div>

              <textarea
                rows={3}
                value={modalToken.nuevoTokenInput}
                onChange={(e) => setModalToken(prev => prev ? { ...prev, nuevoTokenInput: e.target.value } : null)}
                placeholder="Pega aquí el nuevo token firmado (ej: atm_live_sec_...)"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-mono text-slate-800 outline-none focus:border-purple-500 transition-colors resize-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setModalToken(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={guardarNuevoToken}
                className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-black shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <Check size={14} />
                <span>Guardar Nuevo Token</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          MODAL D: CONFIGURAR VIGENCIA (FECHAS INICIO Y FIN)
      ========================================================== */}
      {modalVigencia && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-slate-200 rounded-[28px] p-6 max-w-lg w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                  <Calendar size={18} strokeWidth={2.4} />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">
                    Configurar Rango de Vigencia
                  </h3>
                  <p className="text-xs text-slate-400">
                    {modalVigencia.cuenta.nombre} ({modalVigencia.cuenta.id})
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setModalVigencia(null)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer p-1"
              >
                <X size={16} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3.5">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Clock size={13} className="text-slate-400" />
                  <span>Fecha de Inicio:</span>
                </label>
                <input
                  type="date"
                  value={modalVigencia.fechaInicio}
                  onChange={(e) => setModalVigencia(prev => prev ? { ...prev, fechaInicio: e.target.value } : null)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 outline-none focus:border-amber-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <CalendarDays size={13} className="text-amber-600" />
                  <span>Fecha Límite (Fin):</span>
                </label>
                <input
                  type="date"
                  value={modalVigencia.fechaFin}
                  onChange={(e) => setModalVigencia(prev => prev ? { ...prev, fechaFin: e.target.value } : null)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-slate-500">Extender vigencia con un clic:</span>
              <div className="grid grid-cols-4 gap-2 text-xs">
                {[
                  { label: '+30 Días', dias: 30 },
                  { label: '+90 Días', dias: 90 },
                  { label: '+180 Días', dias: 180 },
                  { label: '+1 Año', dias: 365 },
                ].map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => {
                      const base = modalVigencia.fechaInicio ? new Date(modalVigencia.fechaInicio) : new Date();
                      const nueva = new Date(base);
                      nueva.setDate(nueva.getDate() + preset.dias);
                      setModalVigencia(prev => prev ? { ...prev, fechaFin: nueva.toISOString().split('T')[0] } : null);
                    }}
                    className="p-1.5 rounded-xl bg-slate-50 hover:bg-amber-50 border border-slate-200 hover:border-amber-200 text-slate-700 hover:text-amber-800 font-bold text-[11px] transition-colors cursor-pointer"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-xl flex items-center gap-2">
              <input
                type="checkbox"
                id="checkActivar"
                checked={modalVigencia.activarInmediato}
                onChange={(e) => setModalVigencia(prev => prev ? { ...prev, activarInmediato: e.target.checked } : null)}
                className="w-4 h-4 text-amber-600 rounded cursor-pointer"
              />
              <label htmlFor="checkActivar" className="text-xs font-bold text-amber-900 cursor-pointer">
                Marcar como ACTIVA y reanudar Cron Jobs automáticamente
              </label>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setModalVigencia(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={guardarVigencia}
                className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-black shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <Check size={14} />
                <span>Guardar Vigencia</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          MODAL E: CONFIRMAR BANEO / CANCELACIÓN
      ========================================================== */}
      {modalAccionCritica && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-slate-200 rounded-[28px] p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
                modalAccionCritica.tipo === 'BANEAR' || modalAccionCritica.tipo === 'CANCELAR'
                  ? 'bg-rose-100 text-rose-700'
                  : 'bg-emerald-100 text-emerald-700'
              }`}>
                <AlertTriangle size={20} strokeWidth={2.4} />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900">
                  Confirmar Acción de Gobierno
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  {modalAccionCritica.cuenta.nombre} ({modalAccionCritica.cuenta.id})
                </p>
              </div>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 text-xs text-slate-600 space-y-1.5">
              <p>Acción a ejecutar: <strong className="text-slate-900 font-bold">{modalAccionCritica.tipo}</strong></p>
              <p className="text-[11px] leading-relaxed text-slate-500">
                {modalAccionCritica.tipo === 'BANEAR' && 'Cierra sesiones activas y detiene la ejecución automática de los agentes para esta cuenta.'}
                {modalAccionCritica.tipo === 'CANCELAR' && 'Inactiva el contrato del proveedor y revoca sus credenciales de integración.'}
                {modalAccionCritica.tipo === 'REACTIVAR' && 'Restaura el acceso completo y reanuda el procesamiento de los Cron Jobs diarios.'}
              </p>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setModalAccionCritica(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={ejecutarAccionCritica}
                className={`px-5 py-2 rounded-xl text-xs font-black text-white shadow-xs cursor-pointer transition-all ${
                  modalAccionCritica.tipo === 'BANEAR' || modalAccionCritica.tipo === 'CANCELAR'
                    ? 'bg-rose-600 hover:bg-rose-700'
                    : 'bg-emerald-600 hover:bg-emerald-700'
                }`}
              >
                Confirmar y Ejecutar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          MODAL F: IMPERSONACIÓN (MODO LECTURA AUDITADA)
      ========================================================== */}
      {cuentaImpersonada && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white border border-slate-200 rounded-[28px] p-6 max-w-xl w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Eye size={16} strokeWidth={2.4} />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900">
                    Inspección en Modo Lectura (Impersonación)
                  </h3>
                  <p className="text-xs text-slate-400">
                    SuperAdmin ATOM · Trazabilidad sin alteración de datos
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setCuentaImpersonada(null)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer p-1"
              >
                <X size={16} />
              </button>
            </div>

            <div className="bg-blue-50/70 border border-blue-200/80 p-3.5 rounded-2xl text-xs space-y-1">
              <div className="flex items-center justify-between font-black text-blue-900">
                <span>{cuentaImpersonada.nombre}</span>
                <span className="text-xs">{cuentaImpersonada.bandera} {cuentaImpersonada.pais}</span>
              </div>
              <p className="text-[11px] text-blue-700">
                ID Cuenta: <strong className="font-mono">{cuentaImpersonada.id}</strong> · Correo: <strong className="font-mono">{cuentaImpersonada.correo}</strong>
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">PRODUCTOS DEL CLIENTE</span>
                <p className="text-base font-extrabold text-slate-900 mt-0.5">34 SKUs Activos</p>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">TIENDAS / CANALES</span>
                <p className="text-base font-extrabold text-slate-900 mt-0.5">28 Dropshippers</p>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">TRANSPORTADORAS</span>
                <p className="text-base font-extrabold text-slate-900 mt-0.5">Coordinadora, Envía</p>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">ALERTAS & CAS</span>
                <p className="text-base font-extrabold text-rose-600 mt-0.5">14 Tickets Abiertos</p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
              <span className="text-[11px] text-slate-400 font-medium">
                Sesión de impersonación auditada
              </span>
              <button
                type="button"
                onClick={() => setCuentaImpersonada(null)}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-black text-white font-bold cursor-pointer transition-colors"
              >
                Cerrar Inspección
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
// src/data/negociosData.ts

export interface BusinessContactInfo {
  nombreTitular: string;
  tiendaNombre: string;
  id: string;
  telefono: string;
  correo: string;
  ciudad: string;
  antiguedad: string;
}

export interface BusinessOrderRecord {
  id: string;
  negocioNombre: string;
  negocioId: string;
  contacto: BusinessContactInfo;
  productoNombre: string;
  date: string;
  status: 'Entregados' | 'Por Confirmar' | 'Pendientes' | 'En curso' | 'En novedad' | 'Devoluciones';
  quantity: number;
  bodegaRevenue: number;
  negocioRevenue: number;
  bodega: string;
  transportadora: string;
  departamento: string;
  comunidad: string;
}

// Directorio con los negocios exactos de la captura oficial
export const BUSINESSES_DIRECTORY: BusinessContactInfo[] = [
  {
    nombreTitular: "Juan Camargo",
    tiendaNombre: "9428708",
    id: "528523",
    telefono: "+57 312 458 9012",
    correo: "juan.camargo@dropistore.co",
    ciudad: "Bogotá D.C.",
    antiguedad: "Miembro desde Enero 2025"
  },
  {
    nombreTitular: "Francisco Choperena",
    tiendaNombre: "Impoventas24",
    id: "123021",
    telefono: "+57 301 845 2290",
    correo: "francisco@impoventas24.com",
    ciudad: "Medellín, Antioquia",
    antiguedad: "Miembro desde Marzo 2025"
  },
  {
    nombreTitular: "Eduardo Pardo",
    tiendaNombre: "Trompila",
    id: "472559",
    telefono: "+57 310 994 3311",
    correo: "eduardo.pardo@trompila.store",
    ciudad: "Cali, Valle del Cauca",
    antiguedad: "Miembro desde Mayo 2025"
  },
  {
    nombreTitular: "Liliana Diaz",
    tiendaNombre: "Tienda Aliada",
    id: "448752",
    telefono: "+57 320 541 7780",
    correo: "liliana.diaz@tiendaaliada.co",
    ciudad: "Barranquilla, Atlántico",
    antiguedad: "Miembro desde Junio 2024"
  },
  {
    nombreTitular: "Alexandre Bezerra",
    tiendaNombre: "Descuento Express",
    id: "503754",
    telefono: "+57 318 632 9901",
    correo: "alexandre@descuentoexpress.com",
    ciudad: "Bucaramanga, Santander",
    antiguedad: "Miembro desde Julio 2025"
  },
  {
    nombreTitular: "Mildreth Lanzziano",
    tiendaNombre: "Tienda Aliada",
    id: "187665",
    telefono: "+57 315 220 7419",
    correo: "mildreth.lanzziano@aliadomail.com",
    ciudad: "Pereira, Risaralda",
    antiguedad: "Miembro desde Agosto 2025"
  },
  {
    nombreTitular: "Andrea Vertel",
    tiendaNombre: "Tienda Aliada",
    id: "653676",
    telefono: "+57 300 412 8876",
    correo: "andrea.vertel@aliadoshop.com",
    ciudad: "Cartagena, Bolívar",
    antiguedad: "Miembro desde Septiembre 2025"
  },
  {
    nombreTitular: "Alexandre Bezerra",
    tiendaNombre: "Tienda Vivenzza",
    id: "503755",
    telefono: "+57 316 908 3314",
    correo: "alexandre@vivenzza.co",
    ciudad: "Cúcuta, Norte de Santander",
    antiguedad: "Miembro desde Octubre 2025"
  }
];

export const PRODUCTS_CATALOG = [
  "Audifonos Diadema JBL Tune 770 NC",
  "Ventilador 3 en 1 de 18 pulgadas",
  "Alcancia Figura Pintura Diamante",
  "Dildo consolador realista termico",
  "Pañalera morral tipo cuna con cambiador"
];

export const BODEGAS_LIST = ['Bodega Principal', 'Bodega Norte', 'Bodega Sur'];
export const TRANSPORTADORAS_LIST = ['Interrapidisimo', 'Servientrega', 'Envía', 'Coordinadora', 'TCC'];
export const DEPARTAMENTOS_LIST = ['Bogotá D.C.', 'Antioquia', 'Valle del Cauca', 'Atlántico', 'Santander', 'Bolívar', 'Risaralda'];
export const COMUNIDADES_LIST = ['Comunidad Élite', 'Comunidad Master', 'Comunidad Rocket'];

// Generador de registros históricos coherentes con los porcentajes de la captura
export const generateBusinessMockData = (): BusinessOrderRecord[] => {
  const data: BusinessOrderRecord[] = [];
  const startDate = new Date('2026-10-01').getTime();
  const endDate = new Date('2026-10-31').getTime();

  BUSINESSES_DIRECTORY.forEach((biz) => {
    // Definimos el volumen representativo de cada tienda según la imagen
    let targetOrders = 36;
    if (biz.id === '528523') targetOrders = 236; // Juan Camargo
    else if (biz.id === '123021') targetOrders = 75; // Francisco Choperena
    else if (biz.id === '472559') targetOrders = 73; // Eduardo Pardo
    else if (biz.id === '448752') targetOrders = 44; // Liliana Diaz
    else if (biz.id === '503754') targetOrders = 37; // Alexandre Bezerra
    else if (biz.id === '187665') targetOrders = 36; // Mildreth Lanzziano
    else if (biz.id === '653676') targetOrders = 31; // Andrea Vertel
    else if (biz.id === '503755') targetOrders = 28; // Tienda Vivenzza

    for (let i = 0; i < targetOrders; i++) {
      const randomDate = new Date(startDate + Math.random() * (endDate - startDate));
      const rand = Math.random() * 100;
      let status: BusinessOrderRecord['status'] = 'En curso';

      // Distribución porcentual calibrada para replicar el reporte de la captura
      if (biz.id === '528523') {
        if (rand < 45) status = 'Entregados';
        else if (rand < 87) status = 'En curso';
        else if (rand < 91) status = 'En novedad';
        else if (rand < 95) status = 'Pendientes';
        else status = 'Devoluciones';
      } else if (biz.id === '123021') {
        if (rand < 36) status = 'Entregados';
        else if (rand < 88) status = 'En curso';
        else if (rand < 96) status = 'En novedad';
        else status = 'Por Confirmar';
      } else if (biz.id === '472559') {
        if (rand < 27) status = 'Entregados';
        else if (rand < 46) status = 'Por Confirmar';
        else if (rand < 93) status = 'En curso';
        else if (rand < 99) status = 'En novedad';
        else status = 'Devoluciones';
      } else {
        if (rand < 40) status = 'Entregados';
        else if (rand < 75) status = 'En curso';
        else if (rand < 85) status = 'Por Confirmar';
        else if (rand < 92) status = 'Pendientes';
        else if (rand < 97) status = 'En novedad';
        else status = 'Devoluciones';
      }

      const qty = Math.floor(Math.random() * 2) + 1;
      const basePrice = Math.floor(Math.random() * 45000) + 25000;

      data.push({
        id: `ORD-BIZ-${biz.id}-${i}`,
        negocioNombre: `${biz.tiendaNombre} - ${biz.nombreTitular}`,
        negocioId: biz.id,
        contacto: biz,
        productoNombre: PRODUCTS_CATALOG[Math.floor(Math.random() * PRODUCTS_CATALOG.length)],
        date: randomDate.toISOString().split('T')[0],
        status,
        quantity: qty,
        bodegaRevenue: basePrice * qty,
        negocioRevenue: Math.round(basePrice * 1.35 * qty),
        bodega: BODEGAS_LIST[Math.floor(Math.random() * BODEGAS_LIST.length)],
        transportadora: TRANSPORTADORAS_LIST[Math.floor(Math.random() * TRANSPORTADORAS_LIST.length)],
        departamento: DEPARTAMENTOS_LIST[Math.floor(Math.random() * DEPARTAMENTOS_LIST.length)],
        comunidad: COMUNIDADES_LIST[Math.floor(Math.random() * COMUNIDADES_LIST.length)]
      });
    }
  });

  return data;
};

export default {
  BUSINESSES_DIRECTORY,
  PRODUCTS_CATALOG,
  BODEGAS_LIST,
  TRANSPORTADORAS_LIST,
  DEPARTAMENTOS_LIST,
  COMUNIDADES_LIST,
  generateBusinessMockData
};
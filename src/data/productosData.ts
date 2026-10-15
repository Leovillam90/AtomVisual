import { BUSINESSES_DIRECTORY } from './negociosData';

export interface ProductCatalogItem {
  id: string;
  sku: string;
  name: string;
  categoria: string;
  precioBodegaBase: number;
  precioVentaSugerido: number;
  stockActual: number;
}

export interface ProductOrderRecord {
  id: string;
  productId: string;
  productName: string;
  negocioNombre: string;
  negocioId: string;
  date: string; // YYYY-MM-DD
  status: 'Entregados' | 'Por Confirmar' | 'Pendientes' | 'En curso' | 'En novedad' | 'Devoluciones';
  quantity: number;
  bodegaRevenue: number;
  negocioRevenue: number;
  bodega: string;
  transportadora: string;
  departamento: string;
}

// Catálogo maestro de productos mostrados en la pantalla
export const PRODUCTS_MASTER_CATALOG: ProductCatalogItem[] = [
  {
    id: "PROD-001",
    sku: "JBL-770NC-BLK",
    name: "Audifonos Diadema JBL Tune 770 NC",
    categoria: "Tecnología y Audio",
    precioBodegaBase: 39500,
    precioVentaSugerido: 99900,
    stockActual: 840
  },
  {
    id: "PROD-002",
    sku: "VENT-3IN1-18IN",
    name: "Ventilador 3 en 1 de 18 pulgadas",
    categoria: "Hogar y Electrodomésticos",
    precioBodegaBase: 65000,
    precioVentaSugerido: 149900,
    stockActual: 420
  },
  {
    id: "PROD-003",
    sku: "ALC-PINT-DIAM",
    name: "Alcancia Figura Pintura Diamante",
    categoria: "Juguetes y Novedades",
    precioBodegaBase: 24000,
    precioVentaSugerido: 59900,
    stockActual: 1250
  },
  {
    id: "PROD-004",
    sku: "SEX-REAL-THERM",
    name: "Dildo consolador realista termico",
    categoria: "Bienestar y Cuidado Personal",
    precioBodegaBase: 44000,
    precioVentaSugerido: 109900,
    stockActual: 310
  },
  {
    id: "PROD-005",
    sku: "PAN-CUNA-MULT",
    name: "Pañalera morral tipo cuna con cambiador",
    categoria: "Bebés y Maternidad",
    precioBodegaBase: 48000,
    precioVentaSugerido: 119900,
    stockActual: 560
  }
];

export const PRODUCT_BODEGAS = ['Bodega Principal', 'Bodega Norte', 'Bodega Sur'];
export const PRODUCT_TRANSPORTADORAS = ['Interrapidisimo', 'Servientrega', 'Envía', 'Coordinadora'];
export const PRODUCT_DEPARTAMENTOS = ['Antioquia', 'Bogotá D.C.', 'Valle del Cauca', 'Atlántico', 'Santander'];

// Generador de registros históricos (Enero 2026 - Octubre 2026)
export const generateProductsMockData = (): ProductOrderRecord[] => {
  const data: ProductOrderRecord[] = [];
  const startDate = new Date('2026-01-01').getTime();
  const endDate = new Date('2026-10-31').getTime();

  for (let i = 0; i < 5500; i++) {
    const randomDate = new Date(startDate + Math.random() * (endDate - startDate));
    const product = PRODUCTS_MASTER_CATALOG[Math.floor(Math.random() * PRODUCTS_MASTER_CATALOG.length)];
    const business = BUSINESSES_DIRECTORY[Math.floor(Math.random() * BUSINESSES_DIRECTORY.length)];
    
    const statusRand = Math.random() * 100;
    let status: ProductOrderRecord['status'] = 'En curso';

    // Modelado de tasas de efectividad por producto
    if (product.id === 'PROD-001' || product.id === 'PROD-003') {
      // Alta rentabilidad
      if (statusRand < 46) status = 'Entregados';
      else if (statusRand < 56) status = 'Devoluciones';
      else if (statusRand < 66) status = 'En novedad';
      else if (statusRand < 80) status = 'En curso';
      else if (statusRand < 90) status = 'Pendientes';
      else status = 'Por Confirmar';
    } else if (product.id === 'PROD-004') {
      // Producto con mayor novedad/devolución
      if (statusRand < 35) status = 'Entregados';
      else if (statusRand < 65) status = 'Devoluciones';
      else if (statusRand < 75) status = 'En novedad';
      else if (statusRand < 88) status = 'En curso';
      else if (statusRand < 95) status = 'Pendientes';
      else status = 'Por Confirmar';
    } else {
      // Distribución estándar
      if (statusRand < 40) status = 'Entregados';
      else if (statusRand < 52) status = 'Devoluciones';
      else if (statusRand < 62) status = 'En novedad';
      else if (statusRand < 78) status = 'En curso';
      else if (statusRand < 90) status = 'Pendientes';
      else status = 'Por Confirmar';
    }

    const qty = Math.floor(Math.random() * 3) + 1;
    const basePrice = product.precioBodegaBase;

    data.push({
      id: `ORD-PRD-${i}`,
      productId: product.id,
      productName: product.name,
      negocioNombre: `${business.tiendaNombre} - ${business.nombreTitular.split(' ')[0]}`,
      negocioId: business.id,
      date: randomDate.toISOString().split('T')[0],
      status,
      quantity: qty,
      bodegaRevenue: basePrice * qty,
      negocioRevenue: Math.round(product.precioVentaSugerido * qty),
      bodega: PRODUCT_BODEGAS[Math.floor(Math.random() * PRODUCT_BODEGAS.length)],
      transportadora: PRODUCT_TRANSPORTADORAS[Math.floor(Math.random() * PRODUCT_TRANSPORTADORAS.length)],
      departamento: PRODUCT_DEPARTAMENTOS[Math.floor(Math.random() * PRODUCT_DEPARTAMENTOS.length)]
    });
  }

  return data;
};
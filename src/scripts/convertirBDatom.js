// src/scripts/convertirBDatom.js
const fs = require('fs');
const path = require('path');

// Rutas dinámicas
const PUBLIC_DIR = path.join(__dirname, '../../public');
const OUTPUT_DIR = path.join(PUBLIC_DIR, 'data');
const OUTPUT_JSON_PATH = path.join(OUTPUT_DIR, 'bdatom.json');

function encontrarCsv() {
  if (fs.existsSync(PUBLIC_DIR)) {
    const archivos = fs.readdirSync(PUBLIC_DIR);
    const csv = archivos.find(f => f.toLowerCase().endsWith('.csv'));
    if (csv) return path.join(PUBLIC_DIR, csv);
  }
  const raiz = path.join(__dirname, '../../');
  const archivosRaiz = fs.readdirSync(raiz);
  const csvRaiz = archivosRaiz.find(f => f.toLowerCase().endsWith('.csv'));
  if (csvRaiz) return path.join(raiz, csvRaiz);

  return null;
}

function parseNumero(val) {
  if (val === null || val === undefined || val === '') return 0;
  if (typeof val === 'number') return val;
  const sanitized = String(val).trim().replace(/\./g, '').replace(',', '.');
  const num = parseFloat(sanitized);
  return isNaN(num) ? 0 : num;
}

function normalizarFecha(raw) {
  if (!raw) return '';
  const str = String(raw).trim();
  if (str.includes('/')) {
    const parts = str.split('/');
    if (parts.length === 3) {
      const dia = parts[0].padStart(2, '0');
      const mes = parts[1].padStart(2, '0');
      const anio = parts[2];
      return `${anio}-${mes}-${dia}`;
    }
  }
  return str;
}

function normalizarTipoEstado(raw) {
  const t = String(raw || '').toUpperCase().trim();
  if (t.includes('FINALIZ') || t.includes('ENTREG')) return 'ENTREGADO';
  if (t.includes('DEVOLU')) return 'EN DEVOLUCION';
  if (t.includes('NOVEDAD')) return 'NOVEDAD';
  if (t.includes('CONFIRM')) return 'PENDIENTE POR CONFIRMACION';
  if (t.includes('PENDIENTE')) return 'PENDIENTE';
  return 'EN CURSO';
}

function ejecutar() {
  const csvPath = encontrarCsv();

  if (!csvPath) {
    console.error('❌ No se encontró ningún archivo CSV en public/ ni en la raíz.');
    return;
  }

  console.log(`⏳ Procesando archivo: ${path.basename(csvPath)}`);
  const contenido = fs.readFileSync(csvPath, 'utf-8');
  const lineas = contenido.split(/\r?\n/).filter(line => line.trim().length > 0);

  if (lineas.length < 2) {
    console.error('❌ El archivo CSV no contiene registros.');
    return;
  }

  // Quitar caracteres BOM (\uFEFF) y limpiar encabezados
  const primeraLinea = lineas[0].replace(/^\uFEFF/, '');
  const headers = primeraLinea.split(';').map(h => h.trim().replace(/^"|"$/g, ''));
  const registros = [];
  const setProductos = new Set();

  for (let i = 1; i < lineas.length; i++) {
    const fila = lineas[i].split(';').map(v => v.trim().replace(/^"|"$/g, ''));
    if (fila.length < headers.length) continue;

    const row = {};
    headers.forEach((h, idx) => {
      row[h] = fila[idx] || '';
    });

    const prod = (row['Productos'] || 'Producto General').trim();
    setProductos.add(prod);

    registros.push({
      id: String(row['ID'] || ''),
      fechaCreacion: normalizarFecha(row['Fecha de creación']),
      fechaCreacionRaw: row['Fecha de creación'] || '',
      diasGestion: parseInt(row['Días en gestión'], 10) || 0,
      ultMovimiento: parseInt(row['Último movimiento'], 10) || 0,
      estado: row['Estado'] || '',
      tipoEstado: normalizarTipoEstado(row['Tipo de estado']),
      pagadoDropi: (row['Pagado por Dropi'] || 'NO').toUpperCase() === 'SI' ? 'SI' : 'NO',
      fechaPago: row['Fecha de pago'] || null,
      devEnBodega: (row['Devolución a bodega'] || 'NO').toUpperCase() === 'SI' ? 'SI' : 'NO',
      destino: row['Destino'] || '',
      departamento: row['Departamento'] || '',
      transportadora: row['Transportadora'] || '',
      numeroGuia: row['Número de guía'] || '',
      cantidad: parseInt(row['Productos (cantidad)'], 10) || 1,
      productoNombre: prod,
      recaudoNegocio: parseNumero(row['Recaudo negocio']),
      recaudoProveedor: parseNumero(row['Recaudo proveedor']),
      flete: parseNumero(row['Flete']),
      utilidad: parseNumero(row['Utilidad']),
      tiendaId: row['Tienda'] || '',
      dropshipper: (row['Dropshipper'] || 'Tienda General').trim(),
      idDropshipper: String(row['ID Dropshipper'] || '').trim(),
      bodega: 'Bodega Principal'
    });
  }

  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  fs.writeFileSync(OUTPUT_JSON_PATH, JSON.stringify(registros), 'utf-8');

  console.log(`✅ ¡Conversión completada con éxito!`);
  console.log(`📦 Total guías extraídas: ${registros.length}`);
  console.log(`🛍️ Total productos únicos encontrados: ${setProductos.size}`);
  console.log(`📁 Guardado en: public/data/bdatom.json`);
}

ejecutar();
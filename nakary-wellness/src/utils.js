// ---------- Fechas (todas se guardan como texto AAAA-MM-DD) ----------
const pad = (n) => String(n).padStart(2, '0');
export const toISO = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
export const todayISO = () => toISO(new Date());
export const parseISO = (s) => {
  if (!s) return null;
  const [y, m, d] = s.split('-').map(Number);
  return new Date(y, m - 1, d);
};
export const daysBetween = (a, b) => Math.round((parseISO(b) - parseISO(a)) / 86400000);

export const addDaysISO = (s, n) => {
  const d = parseISO(s) || new Date();
  d.setDate(d.getDate() + n);
  return toISO(d);
};

export const addMonthsISO = (s, n) => {
  const d = parseISO(s) || new Date();
  const day = d.getDate();
  d.setDate(1);
  d.setMonth(d.getMonth() + n);
  const last = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
  d.setDate(Math.min(day, last));
  return toISO(d);
};

export const fmtDate = (s, opts = {}) => {
  const d = parseISO(s);
  return d ? d.toLocaleDateString('es', { day: 'numeric', month: 'long', year: 'numeric', ...opts }) : '—';
};
export const fmtShort = (s) => fmtDate(s, { month: 'short', year: undefined });

// ---------- Estado del plan y del pago ----------
export function planInfo(c) {
  const hoy = todayISO();
  const out = { tiene: false, pago: null };

  if (c?.fechaInicio && c?.fechaFin) {
    const total = Math.max(1, daysBetween(c.fechaInicio, c.fechaFin));
    const transcurridos = Math.min(total, Math.max(0, daysBetween(c.fechaInicio, hoy)));
    const restantes = daysBetween(hoy, c.fechaFin);
    Object.assign(out, {
      tiene: true,
      total,
      transcurridos,
      restantes,
      pct: Math.round((transcurridos / total) * 100),
      vencido: restantes < 0,
      noIniciado: daysBetween(hoy, c.fechaInicio) > 0,
    });
  }

  if (c?.fechaPago) {
    const dias = daysBetween(hoy, c.fechaPago);
    let estado = 'ok';
    if (dias < 0) estado = 'vencido';
    else if (c.estadoPago === 'pendiente') estado = 'pendiente';
    else if (dias <= 5) estado = 'proximo';
    out.pago = { dias, estado };
  }
  return out;
}

export const PAGO_LABEL = {
  ok: { texto: 'Al día', cls: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  proximo: { texto: 'Pago próximo', cls: 'bg-amber-50 text-amber-700 border-amber-200' },
  pendiente: { texto: 'Pago pendiente', cls: 'bg-amber-50 text-amber-700 border-amber-200' },
  vencido: { texto: 'Pago vencido', cls: 'bg-red-50 text-red-600 border-red-200' },
};

// ---------- Medidas ----------
export const METRICAS = [
  { k: 'peso', label: 'Peso', unit: 'kg' },
  { k: 'grasa', label: '% Grasa', unit: '%' },
  { k: 'cintura', label: 'Cintura', unit: 'cm' },
  { k: 'cadera', label: 'Cadera', unit: 'cm' },
  { k: 'gluteo', label: 'Glúteo', unit: 'cm' },
  { k: 'muslo', label: 'Muslo', unit: 'cm' },
  { k: 'brazo', label: 'Brazo', unit: 'cm' },
  { k: 'pecho', label: 'Pecho', unit: 'cm' },
];

export const num = (v) => {
  if (v === '' || v === null || v === undefined) return null;
  const n = parseFloat(String(v).replace(',', '.'));
  return Number.isFinite(n) ? n : null;
};

// ---------- Imágenes: se reducen y se guardan dentro de la base de datos ----------
export function compressImage(file, { max = 1000, keepAlpha = false, limit = 700 * 1024 } = {}) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      let dim = max;
      let q = keepAlpha ? 0.85 : 0.8;
      let out = '';
      for (let i = 0; i < 8; i++) {
        const scale = Math.min(1, dim / Math.max(img.width, img.height));
        const c = document.createElement('canvas');
        c.width = Math.max(1, Math.round(img.width * scale));
        c.height = Math.max(1, Math.round(img.height * scale));
        const ctx = c.getContext('2d');
        if (!keepAlpha) {
          ctx.fillStyle = '#fff';
          ctx.fillRect(0, 0, c.width, c.height);
        }
        ctx.drawImage(img, 0, 0, c.width, c.height);
        out = keepAlpha ? c.toDataURL('image/webp', q) : c.toDataURL('image/jpeg', q);
        if (out.length * 0.75 <= limit) return resolve(out);
        dim = Math.round(dim * 0.8);
        q = Math.max(0.5, q - 0.05);
      }
      reject(new Error('La imagen es demasiado pesada, prueba con otra.'));
    };
    img.onerror = () => reject(new Error('No se pudo leer la imagen.'));
    img.src = url;
  });
}

export const onlyDigits = (s) => String(s || '').replace(/\D/g, '');
export const genPassword = () => {
  const abc = 'abcdefghjkmnpqrstuvwxyz23456789';
  let s = '';
  for (let i = 0; i < 8; i++) s += abc[Math.floor(Math.random() * abc.length)];
  return s;
};

// MODO DEMO: funciona sin Firebase. Los datos viven solo en este navegador.
import { addDaysISO, todayISO } from './utils';

const KEY = 'nakary-demo-v1';
const err = (code) => Object.assign(new Error(code), { code });
const clone = (x) => JSON.parse(JSON.stringify(x));

function seed() {
  const hoy = todayISO();
  const docs = {
    'clientas/demo-clienta': {
      nombre: 'Clienta Demo',
      email: 'clienta@demo.com',
      whatsapp: '',
      plan: 'Asesoría Online',
      modalidad: 'Online',
      fechaInicio: addDaysISO(hoy, -20),
      fechaFin: addDaysISO(hoy, 10),
      fechaPago: addDaysISO(hoy, 10),
      monto: '60',
      moneda: '€',
      estadoPago: 'al_dia',
      activo: true,
      mensaje: '¡Vas muy bien! Esta semana subimos un poco la carga en glúteo. Recuerda hidratarte y dormir bien. 💪',
      alimentacion: [
        { titulo: 'Desayuno', detalle: '2 huevos + 1 arepa pequeña\n1 fruta\nCafé sin azúcar' },
        { titulo: 'Almuerzo', detalle: '150 g de pollo o pescado\n1 taza de arroz o tubérculo\nEnsalada libre' },
        { titulo: 'Cena', detalle: 'Proteína + vegetales\nPorción pequeña de carbohidrato' },
      ],
      alimentacionNotas: 'Toma 2 litros de agua al día.',
      rutina: [
        { titulo: 'Día 1 · Glúteo', detalle: 'Hip thrust 4x10\nSentadilla búlgara 3x12\nPeso muerto rumano 3x10\nAbducciones en máquina 3x15' },
        { titulo: 'Día 2 · Tren superior', detalle: 'Press de pecho 3x12\nRemo con mancuerna 3x12\nElevaciones laterales 3x15' },
        { titulo: 'Día 3 · Pierna + cardio', detalle: 'Prensa 4x12\nCurl femoral 3x12\n20 min de cardio zona 2' },
      ],
      rutinaNotas: 'Descansa 60–90 s entre series.',
    },
    'clientas/demo-clienta/medidas/m1': { fecha: addDaysISO(hoy, -20), peso: 68.4, grasa: 29, cintura: 78, cadera: 102, gluteo: 104, muslo: 60, brazo: 29, pecho: 90 },
    'clientas/demo-clienta/medidas/m2': { fecha: addDaysISO(hoy, -13), peso: 67.6, grasa: 28.4, cintura: 77, cadera: 101.5, gluteo: 104.5, muslo: 59.5, brazo: 29, pecho: 90 },
    'clientas/demo-clienta/medidas/m3': { fecha: addDaysISO(hoy, -6), peso: 66.9, grasa: 27.8, cintura: 75.5, cadera: 101, gluteo: 105, muslo: 59, brazo: 29.2, pecho: 89.5 },
  };
  return { docs, users: {} };
}

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return null;
}

const state = load() || seed();
const subs = new Set();
let user = null;
const authCbs = new Set();

const persist = () => {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {}
};
const emit = () => {
  subs.forEach((s) => s());
  persist();
};

const snapDoc = (path) => (path in state.docs ? { id: path.split('/').pop(), ...clone(state.docs[path]) } : null);
const snapCol = (path) => {
  const prefix = path + '/';
  return Object.keys(state.docs)
    .filter((k) => k.startsWith(prefix) && !k.slice(prefix.length).includes('/'))
    .map((k) => ({ id: k.slice(prefix.length), ...clone(state.docs[k]) }));
};

const BUILTIN = {
  'admin@demo.com': { uid: 'demo-admin', pass: 'demo1234' },
  'clienta@demo.com': { uid: 'demo-clienta', pass: 'demo1234' },
};
const findUser = (email) => BUILTIN[email] || state.users[email];
const setUser = (u) => {
  user = u;
  authCbs.forEach((cb) => cb(user));
};

export const demoBackend = {
  mode: 'demo',

  onAuth(cb) {
    authCbs.add(cb);
    setTimeout(() => cb(user), 0);
    return () => authCbs.delete(cb);
  },
  async signIn(email, pass) {
    const e = String(email).trim().toLowerCase();
    const u = findUser(e);
    if (!u || u.pass !== pass) throw err('auth/invalid-credential');
    setUser({ uid: u.uid, email: e });
  },
  async signOut() {
    setUser(null);
  },
  async resetPassword() {},
  async createUser(email, pass) {
    const e = String(email).trim().toLowerCase();
    if (findUser(e)) throw err('auth/email-already-in-use');
    const uid = 'u' + Math.random().toString(36).slice(2, 10);
    state.users[e] = { uid, pass };
    persist();
    return uid;
  },

  watchDoc(path, cb) {
    const run = () => cb(snapDoc(path));
    subs.add(run);
    setTimeout(run, 0);
    return () => subs.delete(run);
  },
  watchCol(path, cb) {
    const run = () => cb(snapCol(path));
    subs.add(run);
    setTimeout(run, 0);
    return () => subs.delete(run);
  },
  async setDoc(path, data, merge = true) {
    state.docs[path] = merge ? { ...(state.docs[path] || {}), ...clone(data) } : clone(data);
    emit();
  },
  async addDoc(path, data) {
    const id = 'd' + Math.random().toString(36).slice(2, 10);
    state.docs[`${path}/${id}`] = clone(data);
    emit();
    return id;
  },
  async deleteDoc(path) {
    delete state.docs[path];
    emit();
  },
};

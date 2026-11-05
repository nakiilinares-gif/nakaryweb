import { useState } from 'react';
import { ArrowDown, ArrowUp, Download, Eye, EyeOff, Plus, Save, Trash2 } from 'lucide-react';
import { backend } from '../../data';
import { authErrorMsg } from '../../auth';
import { byOrden, useCol, useSite } from '../../hooks';
import { DEFAULT_CASOS } from '../../defaults';
import { Btn, Card, Field, ImageUpload, Input, PageLoader, Textarea, useToast } from '../../components/ui';

// ---------------------------------------------------------------- Casos de éxito
function CasoCard({ c, first, last, onMove }) {
  const toast = useToast();
  const [t, setT] = useState({ nombre: c.nombre || '', testimonio: c.testimonio || '' });
  const dirty = t.nombre !== (c.nombre || '') || t.testimonio !== (c.testimonio || '');

  const run = async (fn, ok) => {
    try { await fn(); if (ok) toast(ok); } catch (e) { toast(authErrorMsg(e), 'error'); }
  };

  return (
    <div className={`overflow-hidden rounded-2xl border border-borde bg-white ${c.visible === false ? 'opacity-60' : ''}`}>
      <div className="flex items-center justify-center bg-crema p-2">
        <img src={c.imagen} alt="" className="max-h-64 w-full rounded-xl object-contain" />
      </div>
      <div className="space-y-3 p-4">
        <Field label="Nombre o etiqueta"><Input value={t.nombre} onChange={(e) => setT({ ...t, nombre: e.target.value })} placeholder="Ej: Carolina · 3 meses" /></Field>
        <Field label="Testimonio"><Textarea rows={2} value={t.testimonio} onChange={(e) => setT({ ...t, testimonio: e.target.value })} /></Field>
        <div className="flex flex-wrap items-center gap-2">
          <Btn size="sm" disabled={!dirty} onClick={() => run(() => backend.setDoc(`casos/${c.id}`, t), 'Guardado ✔')}><Save size={13} /> Guardar</Btn>
          <Btn size="sm" variant="soft" onClick={() => run(() => backend.setDoc(`casos/${c.id}`, { visible: c.visible === false }))}>
            {c.visible === false ? <><EyeOff size={13} /> Oculto</> : <><Eye size={13} /> Visible</>}
          </Btn>
          <Btn size="sm" variant="soft" disabled={first} onClick={() => onMove(-1)} aria-label="Subir"><ArrowUp size={13} /></Btn>
          <Btn size="sm" variant="soft" disabled={last} onClick={() => onMove(1)} aria-label="Bajar"><ArrowDown size={13} /></Btn>
          <Btn size="sm" variant="danger" className="ml-auto" onClick={() => window.confirm('¿Eliminar este caso?') && run(() => backend.deleteDoc(`casos/${c.id}`), 'Eliminado')}><Trash2 size={13} /></Btn>
        </div>
      </div>
    </div>
  );
}

function Casos() {
  const toast = useToast();
  const { items, loading } = useCol('casos');
  const { site } = useSite();
  const [nuevo, setNuevo] = useState({ imagen: '', nombre: '', testimonio: '' });
  const [busy, setBusy] = useState(false);

  if (loading) return <PageLoader />;
  const lista = [...items].sort(byOrden);
  const mostrandoIniciales = !items.length && !site.casosInicializados;

  const mover = async (i, d) => {
    const a = lista[i], b = lista[i + d];
    if (!a || !b) return;
    const oa = a.orden ?? i, ob = b.orden ?? i + d;
    try {
      // si tienen el mismo orden, se reasignan
      await backend.setDoc(`casos/${a.id}`, { orden: oa === ob ? ob + d : ob });
      await backend.setDoc(`casos/${b.id}`, { orden: oa === ob ? oa : oa });
    } catch (e) { toast(authErrorMsg(e), 'error'); }
  };

  const agregar = async () => {
    if (!nuevo.imagen) return toast('Primero sube la foto del caso.', 'error');
    setBusy(true);
    try {
      const max = lista.reduce((m, c) => Math.max(m, c.orden ?? 0), 0);
      await backend.addDoc('casos', { ...nuevo, orden: max + 1, visible: true, createdAt: new Date().toISOString() });
      await backend.setDoc('site/main', { casosInicializados: true });
      setNuevo({ imagen: '', nombre: '', testimonio: '' });
      toast('Caso agregado ✔');
    } catch (e) { toast(authErrorMsg(e), 'error'); }
    setBusy(false);
  };

  const importar = async () => {
    setBusy(true);
    try {
      for (const c of DEFAULT_CASOS) {
        const { id, ...rest } = c;
        await backend.addDoc('casos', rest);
      }
      await backend.setDoc('site/main', { casosInicializados: true });
      toast('Casos actuales importados ✔');
    } catch (e) { toast(authErrorMsg(e), 'error'); }
    setBusy(false);
  };

  return (
    <div className="space-y-6">
      {mostrandoIniciales && (
        <Card className="border-amber-200! bg-amber-50!">
          <p className="mb-3 text-sm text-amber-900">
            Ahora la web muestra los 2 casos de la versión anterior (fotos de Google Drive). Impórtalos para poder editarlos, ordenarlos y reemplazar las fotos.
          </p>
          <Btn size="sm" onClick={importar} disabled={busy}><Download size={13} /> Importar los 2 casos actuales</Btn>
        </Card>
      )}

      {!!lista.length && (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {lista.map((c, i) => <CasoCard key={c.id} c={c} first={i === 0} last={i === lista.length - 1} onMove={(d) => mover(i, d)} />)}
        </div>
      )}

      <Card>
        <h3 className="font-editorial mb-1 text-lg text-bosque">Agregar caso de éxito</h3>
        <p className="mb-4 text-xs text-musgo">Sube el antes/después (puede ser un collage). Se reduce automáticamente para que la web cargue rápido.</p>
        <div className="grid gap-4 sm:grid-cols-2">
          <ImageUpload value={nuevo.imagen} onChange={(v) => setNuevo({ ...nuevo, imagen: v })} label="Subir foto" max={1000} className="sm:col-span-2" />
          <Field label="Nombre o etiqueta"><Input value={nuevo.nombre} onChange={(e) => setNuevo({ ...nuevo, nombre: e.target.value })} placeholder="Ej: Carolina · 3 meses" /></Field>
          <Field label="Testimonio"><Textarea rows={2} value={nuevo.testimonio} onChange={(e) => setNuevo({ ...nuevo, testimonio: e.target.value })} /></Field>
        </div>
        <div className="mt-4"><Btn onClick={agregar} disabled={busy}><Plus size={14} /> Agregar caso</Btn></div>
      </Card>
    </div>
  );
}

// ---------------------------------------------------------------- Testimonios
function TestimonioRow({ t, first, last, onMove }) {
  const toast = useToast();
  const [d, setD] = useState({ nombre: t.nombre || '', detalle: t.detalle || '', texto: t.texto || '' });
  const dirty = ['nombre', 'detalle', 'texto'].some((k) => d[k] !== (t[k] || ''));
  const run = async (fn, ok) => {
    try { await fn(); if (ok) toast(ok); } catch (e) { toast(authErrorMsg(e), 'error'); }
  };
  return (
    <div className={`rounded-2xl border border-borde bg-white p-4 ${t.visible === false ? 'opacity-60' : ''}`}>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Nombre"><Input value={d.nombre} onChange={(e) => setD({ ...d, nombre: e.target.value })} /></Field>
        <Field label="Detalle (opcional)"><Input value={d.detalle} onChange={(e) => setD({ ...d, detalle: e.target.value })} placeholder="Ej: Plan online · 4 meses" /></Field>
        <Field label="Testimonio" className="sm:col-span-2"><Textarea rows={3} value={d.texto} onChange={(e) => setD({ ...d, texto: e.target.value })} /></Field>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <Btn size="sm" disabled={!dirty} onClick={() => run(() => backend.setDoc(`testimonios/${t.id}`, d), 'Guardado ✔')}><Save size={13} /> Guardar</Btn>
        <Btn size="sm" variant="soft" onClick={() => run(() => backend.setDoc(`testimonios/${t.id}`, { visible: t.visible === false }))}>
          {t.visible === false ? <><EyeOff size={13} /> Oculto</> : <><Eye size={13} /> Visible</>}
        </Btn>
        <Btn size="sm" variant="soft" disabled={first} onClick={() => onMove(-1)} aria-label="Subir"><ArrowUp size={13} /></Btn>
        <Btn size="sm" variant="soft" disabled={last} onClick={() => onMove(1)} aria-label="Bajar"><ArrowDown size={13} /></Btn>
        <Btn size="sm" variant="danger" className="ml-auto" onClick={() => window.confirm('¿Eliminar este testimonio?') && run(() => backend.deleteDoc(`testimonios/${t.id}`), 'Eliminado')}><Trash2 size={13} /></Btn>
      </div>
    </div>
  );
}

function Testimonios() {
  const toast = useToast();
  const { items, loading } = useCol('testimonios');
  const [n, setN] = useState({ nombre: '', detalle: '', texto: '' });
  if (loading) return <PageLoader />;
  const lista = [...items].sort(byOrden);

  const mover = async (i, d) => {
    const a = lista[i], b = lista[i + d];
    if (!a || !b) return;
    const oa = a.orden ?? i, ob = b.orden ?? i + d;
    try {
      await backend.setDoc(`testimonios/${a.id}`, { orden: oa === ob ? ob + d : ob });
      await backend.setDoc(`testimonios/${b.id}`, { orden: oa });
    } catch (e) { toast(authErrorMsg(e), 'error'); }
  };

  const agregar = async () => {
    if (!n.nombre.trim() || !n.texto.trim()) return toast('Escribe el nombre y el testimonio.', 'error');
    try {
      const max = lista.reduce((m, c) => Math.max(m, c.orden ?? 0), 0);
      await backend.addDoc('testimonios', { ...n, orden: max + 1, visible: true, createdAt: new Date().toISOString() });
      setN({ nombre: '', detalle: '', texto: '' });
      toast('Testimonio agregado ✔');
    } catch (e) { toast(authErrorMsg(e), 'error'); }
  };

  return (
    <div className="space-y-4">
      {!lista.length && <p className="text-sm text-musgo">Todavía no hay testimonios. Mientras no agregues ninguno, esta sección no aparece en la web.</p>}
      {lista.map((t, i) => <TestimonioRow key={t.id} t={t} first={i === 0} last={i === lista.length - 1} onMove={(d) => mover(i, d)} />)}

      <Card>
        <h3 className="font-editorial mb-4 text-lg text-bosque">Agregar testimonio</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Nombre"><Input value={n.nombre} onChange={(e) => setN({ ...n, nombre: e.target.value })} /></Field>
          <Field label="Detalle (opcional)"><Input value={n.detalle} onChange={(e) => setN({ ...n, detalle: e.target.value })} /></Field>
          <Field label="Testimonio" className="sm:col-span-2" hint="Usa solo testimonios reales y con permiso de la alumna."><Textarea rows={3} value={n.texto} onChange={(e) => setN({ ...n, texto: e.target.value })} /></Field>
        </div>
        <div className="mt-4"><Btn onClick={agregar}><Plus size={14} /> Agregar testimonio</Btn></div>
      </Card>
    </div>
  );
}

// ---------------------------------------------------------------- Pestaña
export default function Resultados() {
  return (
    <div className="space-y-10">
      <section>
        <h2 className="font-editorial mb-1 text-2xl text-bosque">Casos de éxito</h2>
        <p className="mb-5 text-xs text-musgo">Las fotos de antes y después que se ven en la web.</p>
        <Casos />
      </section>
      <section>
        <h2 className="font-editorial mb-1 text-2xl text-bosque">Testimonios</h2>
        <p className="mb-5 text-xs text-musgo">Mensajes de tus alumnas.</p>
        <Testimonios />
      </section>
    </div>
  );
}

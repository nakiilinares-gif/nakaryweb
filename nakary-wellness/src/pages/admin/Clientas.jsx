import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, Copy, Plus, RefreshCw, Save, Search, Trash2 } from 'lucide-react';
import { backend } from '../../data';
import { authErrorMsg } from '../../auth';
import { useCol, useDoc } from '../../hooks';
import { Btn, Card, Field, Input, ListEditor, PageLoader, Select, Textarea, useToast } from '../../components/ui';
import { METRICAS, PAGO_LABEL, addMonthsISO, fmtDate, genPassword, num, onlyDigits, planInfo, todayISO } from '../../utils';

const EMPTY = {
  nombre: '', email: '', whatsapp: '', plan: '', modalidad: 'Online',
  fechaInicio: todayISO(), fechaFin: addMonthsISO(todayISO(), 1), fechaPago: addMonthsISO(todayISO(), 1),
  monto: '', moneda: '€', estadoPago: 'al_dia', activo: true,
  mensaje: '', alimentacion: [], alimentacionNotas: '', rutina: [], rutinaNotas: '',
};

// ============================================================ LISTA
export default function Clientas() {
  const { items, loading, error } = useCol('clientas');
  const [sel, setSel] = useState(null); // null = lista, 'nueva' = alta, id = edición
  const [q, setQ] = useState('');

  const lista = useMemo(() => {
    const t = q.trim().toLowerCase();
    return items
      .filter((c) => !t || `${c.nombre} ${c.email}`.toLowerCase().includes(t))
      .sort((a, b) => (a.nombre || '').localeCompare(b.nombre || ''));
  }, [items, q]);

  if (sel) return <ClientaEditor key={sel} id={sel === 'nueva' ? null : sel} onBack={() => setSel(null)} onCreated={(uid) => setSel(uid)} />;
  if (loading) return <PageLoader />;

  return (
    <div className="space-y-5">
      {error && <Card className="border-red-200! bg-red-50! text-sm text-red-700">{authErrorMsg(error)}</Card>}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative sm:w-80">
          <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-salvia" />
          <Input className="pl-10!" placeholder="Buscar por nombre o correo" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <Btn onClick={() => setSel('nueva')}><Plus size={14} /> Nueva clienta</Btn>
      </div>

      {!lista.length ? (
        <Card className="py-12 text-center text-sm text-musgo">
          {items.length ? 'Sin resultados.' : 'Aún no tienes clientas. Crea la primera con "Nueva clienta".'}
        </Card>
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {lista.map((c) => {
            const info = planInfo(c);
            const pago = info.pago && PAGO_LABEL[info.pago.estado];
            return (
              <button key={c.id} onClick={() => setSel(c.id)} className="rounded-2xl border border-borde bg-white p-5 text-left transition-all hover:border-salvia hover:shadow-md">
                <div className="mb-2 flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-editorial truncate text-lg text-bosque">{c.nombre || 'Sin nombre'}</p>
                    <p className="truncate text-xs text-musgo">{c.email}</p>
                  </div>
                  {c.activo === false && <span className="rounded-full bg-crema px-2 py-1 text-[9px] font-bold uppercase text-musgo">Inactiva</span>}
                </div>
                <p className="mb-3 text-xs text-musgo">{c.plan || 'Sin plan'}{c.modalidad ? ` · ${c.modalidad}` : ''}</p>
                <div className="flex flex-wrap items-center gap-2 text-[10px]">
                  {info.tiene && (
                    <span className="rounded-full border border-borde bg-crema px-3 py-1 font-bold uppercase tracking-widest text-bosque">
                      {info.vencido ? 'Plan terminado' : `${info.restantes} días`}
                    </span>
                  )}
                  {pago && <span className={`rounded-full border px-3 py-1 font-bold uppercase tracking-widest ${pago.cls}`}>{pago.texto}</span>}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ============================================================ EDITOR
function ClientaEditor({ id, onBack, onCreated }) {
  const isNew = !id;
  const toast = useToast();
  const { data, loading } = useDoc(id ? `clientas/${id}` : null);
  const [f, setF] = useState(isNew ? EMPTY : null);
  const [pass, setPass] = useState(() => genPassword());
  const [saving, setSaving] = useState(false);
  const [creada, setCreada] = useState(null); // credenciales para compartir

  useEffect(() => {
    if (!isNew && data && !f) setF({ ...EMPTY, ...data });
  }, [data, isNew, f]);

  if (!isNew && (loading || !f)) return <PageLoader />;
  const set = (patch) => setF((p) => ({ ...p, ...patch }));

  const guardar = async () => {
    if (!f.nombre.trim()) return toast('Escribe el nombre de la clienta.', 'error');
    if (isNew && (!f.email.trim() || pass.length < 6)) return toast('Falta el correo o la contraseña (mínimo 6 caracteres).', 'error');
    setSaving(true);
    try {
      let uid = id;
      if (isNew) uid = await backend.createUser(f.email.trim().toLowerCase(), pass);
      const { id: _omit, ...clean } = f;
      await backend.setDoc(`clientas/${uid}`, {
        ...clean,
        email: f.email.trim().toLowerCase(),
        nombre: f.nombre.trim(),
        updatedAt: new Date().toISOString(),
        ...(isNew ? { createdAt: new Date().toISOString() } : {}),
      });
      toast(isNew ? 'Clienta creada ✔' : 'Cambios guardados ✔');
      if (isNew) setCreada({ uid, email: f.email.trim().toLowerCase(), pass, nombre: f.nombre.trim(), whatsapp: f.whatsapp });
    } catch (e) {
      toast(authErrorMsg(e), 'error');
    }
    setSaving(false);
  };

  const registrarPago = () => {
    if (!window.confirm('¿Registrar pago y renovar el plan 1 mes más?')) return;
    set({
      fechaPago: addMonthsISO(f.fechaPago || todayISO(), 1),
      fechaFin: addMonthsISO(f.fechaFin || todayISO(), 1),
      estadoPago: 'al_dia',
    });
    toast('Fechas renovadas. Toca "Guardar cambios" para confirmar.');
  };

  const eliminar = async () => {
    if (!window.confirm(`¿Eliminar la ficha de ${f.nombre}? Se borran su plan y medidas. (Su usuario de acceso se elimina aparte desde Firebase.)`)) return;
    try {
      const meds = await new Promise((res) => {
        const un = backend.watchCol(`clientas/${id}/medidas`, (items) => { un(); res(items); });
      });
      await Promise.all(meds.map((m) => backend.deleteDoc(`clientas/${id}/medidas/${m.id}`)));
      await backend.deleteDoc(`clientas/${id}`);
      toast('Ficha eliminada.');
      onBack();
    } catch (e) {
      toast(authErrorMsg(e), 'error');
    }
  };

  const textoAcceso = creada &&
    `¡Hola ${creada.nombre.split(' ')[0]}! 💚 Ya tienes tu acceso a tu espacio de entrenamiento:\n\n🔗 ${window.location.origin}/ingresar\n📧 Usuario: ${creada.email}\n🔑 Contraseña temporal: ${creada.pass}\n\nAllí verás tu plan, comidas, entrenamiento y tu progreso. Puedes cambiar tu contraseña desde "Cambiar contraseña".`;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Btn variant="soft" size="sm" onClick={onBack}><ArrowLeft size={13} /> Volver</Btn>
        <div className="flex gap-2">
          {!isNew && <Btn variant="danger" size="sm" onClick={eliminar}><Trash2 size={13} /> Eliminar</Btn>}
          <Btn onClick={guardar} disabled={saving || !!creada}><Save size={14} /> {saving ? 'Guardando…' : isNew ? 'Crear clienta' : 'Guardar cambios'}</Btn>
        </div>
      </div>

      {creada && (
        <Card className="border-emerald-200! bg-emerald-50!">
          <p className="mb-2 text-sm font-bold text-emerald-800">✔ Clienta creada. Envíale sus datos de acceso:</p>
          <pre className="mb-4 whitespace-pre-wrap rounded-xl bg-white p-4 text-xs leading-relaxed text-tinta">{textoAcceso}</pre>
          <div className="flex flex-wrap gap-2">
            <Btn size="sm" onClick={() => navigator.clipboard?.writeText(textoAcceso).then(() => toast('Mensaje copiado'))}><Copy size={13} /> Copiar mensaje</Btn>
            {onlyDigits(creada.whatsapp) && (
              <Btn as="a" size="sm" variant="sage" target="_blank" rel="noopener noreferrer" href={`https://wa.me/${onlyDigits(creada.whatsapp)}?text=${encodeURIComponent(textoAcceso)}`}>Abrir en WhatsApp</Btn>
            )}
            <Btn size="sm" variant="soft" onClick={() => onCreated(creada.uid)}>Seguir con su plan →</Btn>
          </div>
          <p className="mt-3 text-[11px] text-emerald-800/80">Guarda este mensaje ahora: la contraseña no se vuelve a mostrar (ella puede cambiarla cuando quiera).</p>
        </Card>
      )}

      <Card>
        <h2 className="font-editorial mb-4 text-xl text-bosque">Datos de la clienta</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Nombre completo"><Input value={f.nombre} onChange={(e) => set({ nombre: e.target.value })} /></Field>
          <Field label="WhatsApp" hint="Con código de país, ej. 584141234567"><Input value={f.whatsapp} onChange={(e) => set({ whatsapp: e.target.value })} /></Field>
          <Field label="Correo de acceso" hint={isNew ? 'Con este correo entrará ella.' : 'El correo de acceso no se puede cambiar.'}>
            <Input type="email" value={f.email} disabled={!isNew} onChange={(e) => set({ email: e.target.value })} />
          </Field>
          {isNew && (
            <Field label="Contraseña temporal" hint="Mínimo 6 caracteres. Se la envías y luego ella la cambia.">
              <div className="flex gap-2">
                <Input value={pass} onChange={(e) => setPass(e.target.value)} />
                <Btn variant="soft" size="sm" onClick={() => setPass(genPassword())} aria-label="Generar otra"><RefreshCw size={14} /></Btn>
              </div>
            </Field>
          )}
        </div>
      </Card>

      <Card>
        <h2 className="font-editorial mb-4 text-xl text-bosque">Plan y pagos</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Field label="Plan"><Input value={f.plan} onChange={(e) => set({ plan: e.target.value })} placeholder="Ej: Asesoría Online" /></Field>
          <Field label="Modalidad">
            <Select value={f.modalidad} onChange={(e) => set({ modalidad: e.target.value })}>
              <option>Online</option><option>Presencial</option><option>Combo (Entrenamiento + Nutrición)</option><option>Solo nutrición</option>
            </Select>
          </Field>
          <Field label="Estado de la cuenta">
            <Select value={f.activo === false ? 'no' : 'si'} onChange={(e) => set({ activo: e.target.value === 'si' })}>
              <option value="si">Activa</option><option value="no">Inactiva (no ve su plan)</option>
            </Select>
          </Field>
          <Field label="Inicio del plan"><Input type="date" value={f.fechaInicio} onChange={(e) => set({ fechaInicio: e.target.value })} /></Field>
          <Field label="Fin del plan"><Input type="date" value={f.fechaFin} onChange={(e) => set({ fechaFin: e.target.value })} /></Field>
          <Field label="Próxima fecha de pago"><Input type="date" value={f.fechaPago} onChange={(e) => set({ fechaPago: e.target.value })} /></Field>
          <Field label="Monto"><Input inputMode="decimal" value={f.monto} onChange={(e) => set({ monto: e.target.value })} placeholder="60" /></Field>
          <Field label="Moneda"><Input value={f.moneda} onChange={(e) => set({ moneda: e.target.value })} placeholder="€  $  Bs" /></Field>
          <Field label="Estado del pago">
            <Select value={f.estadoPago} onChange={(e) => set({ estadoPago: e.target.value })}>
              <option value="al_dia">Al día</option><option value="pendiente">Pendiente de pago</option>
            </Select>
          </Field>
        </div>
        <div className="mt-4">
          <Btn variant="sage" size="sm" onClick={registrarPago}><RefreshCw size={13} /> Registrar pago y renovar +1 mes</Btn>
        </div>
      </Card>

      <Card>
        <h2 className="font-editorial mb-1 text-xl text-bosque">Mensaje para ella</h2>
        <p className="mb-3 text-xs text-musgo">Aparece destacado al entrar a su espacio (motivación, ajustes de la semana, recordatorios).</p>
        <Textarea rows={3} value={f.mensaje} onChange={(e) => set({ mensaje: e.target.value })} />
      </Card>

      <Card>
        <h2 className="font-editorial mb-1 text-xl text-bosque">Plan de alimentación</h2>
        <p className="mb-4 text-xs text-musgo">Una tarjeta por comida (o por día). Escribe cada alimento en una línea.</p>
        <ListEditor
          items={f.alimentacion}
          onChange={(alimentacion) => set({ alimentacion })}
          blank={{ titulo: '', detalle: '' }}
          addLabel="Agregar comida"
          itemLabel={(it, i) => it.titulo || `Comida ${i + 1}`}
          render={(it, up) => (
            <div className="space-y-3">
              <Input placeholder="Ej: Desayuno" value={it.titulo} onChange={(e) => up({ titulo: e.target.value })} />
              <Textarea rows={4} placeholder={'2 huevos\n1 arepa pequeña\n1 fruta'} value={it.detalle} onChange={(e) => up({ detalle: e.target.value })} />
            </div>
          )}
        />
        <Field label="Notas generales" className="mt-4"><Textarea value={f.alimentacionNotas} onChange={(e) => set({ alimentacionNotas: e.target.value })} placeholder="Hidratación, suplementos, ayuno intermitente…" /></Field>
      </Card>

      <Card>
        <h2 className="font-editorial mb-1 text-xl text-bosque">Rutina de entrenamiento</h2>
        <p className="mb-4 text-xs text-musgo">Una tarjeta por día de entrenamiento. Un ejercicio por línea (series x repeticiones).</p>
        <ListEditor
          items={f.rutina}
          onChange={(rutina) => set({ rutina })}
          blank={{ titulo: '', detalle: '' }}
          addLabel="Agregar día"
          itemLabel={(it, i) => it.titulo || `Día ${i + 1}`}
          render={(it, up) => (
            <div className="space-y-3">
              <Input placeholder="Ej: Día 1 · Glúteo" value={it.titulo} onChange={(e) => up({ titulo: e.target.value })} />
              <Textarea rows={5} placeholder={'Hip thrust 4x10\nSentadilla búlgara 3x12'} value={it.detalle} onChange={(e) => up({ detalle: e.target.value })} />
            </div>
          )}
        />
        <Field label="Notas generales" className="mt-4"><Textarea value={f.rutinaNotas} onChange={(e) => set({ rutinaNotas: e.target.value })} placeholder="Descansos, cardio, sobrecarga progresiva…" /></Field>
      </Card>

      {isNew ? (
        <Card className="text-center text-sm text-musgo">Cuando crees la clienta podrás cargar sus medidas y ver su progreso.</Card>
      ) : (
        <Medidas uid={id} />
      )}

      <div className="sticky bottom-4 z-20 flex justify-end">
        <Btn size="lg" className="shadow-xl" onClick={guardar} disabled={saving || !!creada}><Save size={15} /> {saving ? 'Guardando…' : isNew ? 'Crear clienta' : 'Guardar cambios'}</Btn>
      </div>
    </div>
  );
}

// ============================================================ MEDIDAS
function Medidas({ uid }) {
  const toast = useToast();
  const { items } = useCol(`clientas/${uid}/medidas`);
  const orden = useMemo(() => [...items].sort((a, b) => (b.fecha || '').localeCompare(a.fecha || '')), [items]);
  const [m, setM] = useState({ fecha: todayISO() });
  const [busy, setBusy] = useState(false);

  const guardar = async () => {
    const data = { fecha: m.fecha || todayISO() };
    METRICAS.forEach(({ k }) => {
      const v = num(m[k]);
      if (v !== null) data[k] = v;
    });
    if (Object.keys(data).length < 2) return toast('Escribe al menos una medida.', 'error');
    setBusy(true);
    try {
      await backend.addDoc(`clientas/${uid}/medidas`, data);
      setM({ fecha: todayISO() });
      toast('Medidas guardadas ✔');
    } catch (e) {
      toast(authErrorMsg(e), 'error');
    }
    setBusy(false);
  };

  const borrar = async (id) => {
    if (!window.confirm('¿Eliminar este registro de medidas?')) return;
    try { await backend.deleteDoc(`clientas/${uid}/medidas/${id}`); } catch (e) { toast(authErrorMsg(e), 'error'); }
  };

  return (
    <Card>
      <h2 className="font-editorial mb-1 text-xl text-bosque">Medidas y progreso</h2>
      <p className="mb-4 text-xs text-musgo">Cada registro se guarda al instante y ella lo ve en su gráfica. Deja en blanco lo que no midas.</p>

      <div className="mb-6 rounded-2xl border border-borde bg-crema/60 p-4">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          <Field label="Fecha"><Input type="date" value={m.fecha} onChange={(e) => setM({ ...m, fecha: e.target.value })} /></Field>
          {METRICAS.map(({ k, label, unit }) => (
            <Field key={k} label={`${label} (${unit})`}>
              <Input inputMode="decimal" value={m[k] ?? ''} onChange={(e) => setM({ ...m, [k]: e.target.value })} placeholder={orden[0]?.[k] ?? ''} />
            </Field>
          ))}
        </div>
        <div className="mt-4"><Btn onClick={guardar} disabled={busy}><Plus size={14} /> Agregar medidas</Btn></div>
      </div>

      {orden.length ? (
        <div className="overflow-x-auto rounded-2xl border border-borde">
          <table className="w-full min-w-[640px] text-left text-xs">
            <thead>
              <tr className="border-b border-borde bg-crema/60 text-[9px] font-bold uppercase tracking-widest text-salvia">
                <th className="p-3">Fecha</th>
                {METRICAS.map((x) => <th key={x.k} className="p-3">{x.label}</th>)}
                <th />
              </tr>
            </thead>
            <tbody>
              {orden.map((o) => (
                <tr key={o.id} className="border-b border-borde/60 last:border-0">
                  <td className="whitespace-nowrap p-3 font-medium text-bosque">{fmtDate(o.fecha, { month: 'short' })}</td>
                  {METRICAS.map((x) => <td key={x.k} className="p-3 text-musgo">{o[x.k] ?? '—'}</td>)}
                  <td className="p-3 text-right">
                    <button onClick={() => borrar(o.id)} className="rounded-lg p-1.5 text-musgo hover:bg-red-50 hover:text-red-600" aria-label="Eliminar"><Trash2 size={14} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-center text-sm text-musgo">Todavía no hay medidas registradas.</p>
      )}
    </Card>
  );
}

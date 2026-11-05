import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Activity, CalendarDays, CreditCard, Dumbbell, KeyRound, MessageCircle, Utensils } from 'lucide-react';
import { backend } from '../data';
import { useAuth } from '../auth';
import { useCol, useDoc, useSite } from '../hooks';
import Shell from '../components/Shell';
import LineChart from '../components/LineChart';
import { Btn, Card, Eyebrow, PageLoader, useToast } from '../components/ui';
import { METRICAS, PAGO_LABEL, fmtDate, fmtShort, planInfo } from '../utils';

const TABS = [
  ['alimentacion', 'Alimentación', Utensils],
  ['rutina', 'Entrenamiento', Dumbbell],
  ['progreso', 'Mi progreso', Activity],
];

function Bloques({ items = [], notas, vacio }) {
  if (!items.length) return <Card className="text-center text-sm text-musgo">{vacio}</Card>;
  return (
    <div className="space-y-4">
      {items.map((b, i) => (
        <Card key={i}>
          <h3 className="font-editorial mb-3 text-lg text-bosque">{b.titulo}</h3>
          <p className="whitespace-pre-line text-sm leading-relaxed text-musgo">{b.detalle}</p>
        </Card>
      ))}
      {notas && (
        <div className="rounded-2xl bg-bosque p-5 text-sm leading-relaxed text-white/90">
          <p className="mb-1 text-[10px] font-bold uppercase ls-xl text-white/50">Nota</p>
          <p className="whitespace-pre-line">{notas}</p>
        </div>
      )}
    </div>
  );
}

function Progreso({ medidas }) {
  const [key, setKey] = useState('peso');
  const orden = useMemo(() => [...medidas].sort((a, b) => (a.fecha || '').localeCompare(b.fecha || '')), [medidas]);

  if (!orden.length)
    return <Card className="text-center text-sm text-musgo">Aún no hay medidas registradas. En tu próxima evaluación Nakary las cargará aquí y verás tu evolución. 💚</Card>;

  const m = METRICAS.find((x) => x.k === key);
  const serie = (k) => orden.filter((o) => typeof o[k] === 'number').map((o) => ({ x: fmtShort(o.fecha), y: o[k], fecha: o.fecha }));
  const pts = serie(key);

  return (
    <div className="space-y-5">
      {/* Resumen de cambios */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {METRICAS.map((mt) => {
          const s = serie(mt.k);
          if (!s.length) return null;
          const delta = s[s.length - 1].y - s[0].y;
          const act = key === mt.k;
          return (
            <button
              key={mt.k}
              onClick={() => setKey(mt.k)}
              className={`rounded-2xl border p-4 text-left transition-all ${act ? 'border-bosque bg-bosque text-white' : 'border-borde bg-white hover:border-salvia'}`}
            >
              <p className={`text-[9px] font-bold uppercase tracking-widest ${act ? 'text-white/60' : 'text-salvia'}`}>{mt.label}</p>
              <p className="font-editorial mt-1 text-xl">
                {s[s.length - 1].y}
                <span className="ml-1 text-xs font-light opacity-60">{mt.unit}</span>
              </p>
              {s.length > 1 && (
                <p className={`mt-0.5 text-[11px] ${act ? 'text-white/70' : 'text-musgo'}`}>
                  {delta > 0 ? '+' : ''}
                  {Math.round(delta * 10) / 10} {mt.unit}
                </p>
              )}
            </button>
          );
        })}
      </div>

      <Card>
        <p className="mb-2 text-[10px] font-bold uppercase ls-xl text-salvia">
          {m.label} ({m.unit}) · evolución
        </p>
        {pts.length ? <LineChart points={pts} unit={m.unit} /> : <p className="py-6 text-center text-sm text-musgo">Sin datos de {m.label.toLowerCase()} todavía.</p>}
      </Card>

      <Card className="overflow-x-auto p-0!">
        <table className="w-full min-w-[520px] text-left text-xs">
          <thead>
            <tr className="border-b border-borde text-[9px] font-bold uppercase tracking-widest text-salvia">
              <th className="p-3">Fecha</th>
              {METRICAS.map((mt) => <th key={mt.k} className="p-3">{mt.label}</th>)}
            </tr>
          </thead>
          <tbody>
            {[...orden].reverse().map((o) => (
              <tr key={o.id} className="border-b border-borde/60 last:border-0">
                <td className="whitespace-nowrap p-3 font-medium text-bosque">{fmtDate(o.fecha, { year: undefined, month: 'short' })}</td>
                {METRICAS.map((mt) => <td key={mt.k} className="p-3 text-musgo">{o[mt.k] ?? '—'}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

export default function Portal() {
  const { user, isAdmin } = useAuth();
  const toast = useToast();
  const { site } = useSite();
  const { data: c, loading, error } = useDoc(`clientas/${user.uid}`);
  const med = useCol(`clientas/${user.uid}/medidas`);
  const [tab, setTab] = useState('alimentacion');

  if (loading) return <Shell><PageLoader /></Shell>;

  const cambiarClave = async () => {
    try {
      await backend.resetPassword(user.email);
      toast('Te enviamos un correo para cambiar tu contraseña.');
    } catch {
      toast('No se pudo enviar el correo. Inténtalo más tarde.', 'error');
    }
  };

  if (!c || c.activo === false || error)
    return (
      <Shell>
        <Card className="mx-auto max-w-md text-center">
          <h1 className="font-editorial mb-2 text-2xl text-bosque">Hola 👋</h1>
          <p className="mb-5 text-sm leading-relaxed text-musgo">
            {isAdmin
              ? 'Estás conectada como administradora. Tu zona de trabajo es el panel.'
              : error
              ? 'No pudimos cargar tu información. Intenta de nuevo en unos minutos.'
              : c?.activo === false
              ? 'Tu plan está inactivo por ahora. Escríbele a Nakary para reactivarlo.'
              : 'Todavía no tienes un plan asignado en tu cuenta. Escríbele a Nakary para activarlo.'}
          </p>
          {isAdmin ? (
            <Btn as={Link} to="/admin">Ir al panel</Btn>
          ) : (
            <Btn as="a" href={site.whatsapp} target="_blank" rel="noopener noreferrer"><MessageCircle size={14} /> Escribir por WhatsApp</Btn>
          )}
        </Card>
      </Shell>
    );

  const info = planInfo(c);
  const pagoLbl = info.pago && PAGO_LABEL[info.pago.estado];
  const primerNombre = (c.nombre || '').split(' ')[0];

  return (
    <Shell>
      <div className="fade-in space-y-6">
        <div>
          <Eyebrow className="mb-2">Mi espacio</Eyebrow>
          <h1 className="font-editorial text-3xl text-tinta md:text-5xl">
            Hola, <span className="font-light italic text-salvia">{primerNombre || 'bienvenida'}</span> 👋
          </h1>
        </div>

        {c.mensaje && (
          <div className="rounded-[1.5rem] bg-bosque p-5 text-white md:p-6">
            <p className="mb-2 text-[10px] font-bold uppercase ls-xl text-white/50">Mensaje de Nakary</p>
            <p className="whitespace-pre-line text-sm leading-relaxed text-white/90">{c.mensaje}</p>
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-2">
          {/* PLAN */}
          <Card>
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <p className="mb-1 flex items-center gap-2 text-[10px] font-bold uppercase ls-xl text-salvia"><CalendarDays size={13} /> Mi plan</p>
                <h2 className="font-editorial text-xl text-bosque">{c.plan || 'Plan personalizado'}</h2>
                {c.modalidad && <p className="text-xs text-musgo">{c.modalidad}</p>}
              </div>
            </div>
            {info.tiene ? (
              <>
                <div className="mb-2 flex items-baseline justify-between">
                  <p className="font-editorial text-3xl text-bosque">
                    {info.vencido ? 0 : info.restantes}
                    <span className="ml-1 text-sm font-light text-musgo">días restantes</span>
                  </p>
                  <p className="text-xs text-musgo">{info.pct}%</p>
                </div>
                <div className="mb-3 h-2 overflow-hidden rounded-full bg-crema">
                  <div className="h-full rounded-full bg-salvia transition-all" style={{ width: `${info.pct}%` }} />
                </div>
                <p className="text-xs text-musgo">
                  {fmtDate(c.fechaInicio, { month: 'short' })} → {fmtDate(c.fechaFin, { month: 'short' })}
                </p>
                {info.vencido && <p className="mt-2 text-xs font-medium text-red-600">Tu plan terminó. ¡Escríbele a Nakary para renovarlo!</p>}
                {info.noIniciado && <p className="mt-2 text-xs text-musgo">Tu plan comienza el {fmtDate(c.fechaInicio)}.</p>}
              </>
            ) : (
              <p className="text-sm text-musgo">Las fechas de tu plan aún no están cargadas.</p>
            )}
          </Card>

          {/* PAGO */}
          <Card>
            <p className="mb-3 flex items-center gap-2 text-[10px] font-bold uppercase ls-xl text-salvia"><CreditCard size={13} /> Mi pago</p>
            {info.pago ? (
              <>
                <p className="font-editorial text-xl text-bosque">{fmtDate(c.fechaPago)}</p>
                <p className="mb-3 text-xs text-musgo">
                  {info.pago.dias > 0 ? `Faltan ${info.pago.dias} días` : info.pago.dias === 0 ? 'Es hoy' : `Venció hace ${Math.abs(info.pago.dias)} días`}
                  {c.monto ? ` · ${c.monto}${c.moneda || ''}` : ''}
                </p>
                <span className={`inline-block rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-widest ${pagoLbl.cls}`}>{pagoLbl.texto}</span>
              </>
            ) : (
              <p className="text-sm text-musgo">Sin fecha de pago registrada.</p>
            )}
          </Card>
        </div>

        {/* PESTAÑAS */}
        <div className="flex gap-1 overflow-x-auto rounded-2xl border border-borde bg-white p-1">
          {TABS.map(([k, label, Icon]) => (
            <button
              key={k}
              onClick={() => setTab(k)}
              className={`flex flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-xl px-3 py-3 text-[10px] font-bold uppercase tracking-widest transition-all ${tab === k ? 'bg-bosque text-white' : 'text-musgo hover:bg-crema'}`}
            >
              <Icon size={14} /> {label}
            </button>
          ))}
        </div>

        {tab === 'alimentacion' && <Bloques items={c.alimentacion} notas={c.alimentacionNotas} vacio="Tu plan de alimentación se está preparando. ¡Pronto lo verás aquí!" />}
        {tab === 'rutina' && <Bloques items={c.rutina} notas={c.rutinaNotas} vacio="Tu rutina de entrenamiento se está preparando. ¡Pronto la verás aquí!" />}
        {tab === 'progreso' && <Progreso medidas={med.items} />}

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-borde pt-6">
          <p className="text-xs text-musgo/70">{user.email}</p>
          <Btn variant="soft" size="sm" onClick={cambiarClave}><KeyRound size={13} /> Cambiar contraseña</Btn>
        </div>
      </div>
    </Shell>
  );
}

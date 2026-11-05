import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Apple, Camera, CheckCircle2, ChevronDown, ClipboardList, Dumbbell, Globe, Instagram,
  Mail, Menu, MessageCircle, Quote, TrendingUp, User, Users, X,
} from 'lucide-react';
import { backend } from '../data';
import { useAuth } from '../auth';
import { byOrden, useCol, useSite } from '../hooks';
import { DEFAULT_CASOS } from '../defaults';

const ICONOS = { apple: Apple, dumbbell: Dumbbell, camera: Camera, users: Users, globe: Globe };
const ICON_LISTA = [ClipboardList, TrendingUp];

const eyebrow = 'text-[9px] md:text-[10px] font-bold uppercase ls-xl text-salvia';

// ---------------------------------------------------------------- Navbar
function Navbar({ logo, site }) {
  const [open, setOpen] = useState(false);
  const { user, isAdmin } = useAuth();
  const links = [
    ['Inicio', '/'],
    ['Servicios', '/#servicios'],
    ['Planes', '/#planes'],
    ['Resultados', '/#resultados'],
  ];
  const acceso = user ? (isAdmin ? '/admin' : '/mi-plan') : '/ingresar';
  const accesoTxt = user ? (isAdmin ? 'Panel' : 'Mi plan') : 'Acceso clientas';

  return (
    <nav className="sticky top-0 z-[100] border-b border-borde bg-crema/90 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex-shrink-0" aria-label="Inicio">
          <img src={logo} alt="Logo Nakary Linares" className="h-8 w-auto object-contain md:h-10" />
        </Link>

        <div className="hidden items-center gap-6 text-[10px] font-bold uppercase ls-xl md:flex">
          {links.map(([t, to]) => (
            <Link key={t} to={to} className="transition-colors hover:text-salvia">{t}</Link>
          ))}
          <a href={site.instagram} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-salvia">Instagram</a>
          <Link to={acceso} className="flex items-center gap-2 transition-colors hover:text-salvia">
            <User size={14} /> {accesoTxt}
          </Link>
          <Link to="/#contacto" className="rounded-full bg-bosque px-6 py-2.5 text-white transition-all hover:bg-salvia">
            Más Información
          </Link>
        </div>

        <button className="p-2 md:hidden" onClick={() => setOpen(!open)} aria-label="Menú">
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {open && (
        <div className="flex flex-col gap-5 border-b border-borde bg-white p-6 md:hidden">
          {links.map(([t, to]) => (
            <Link key={t} to={to} onClick={() => setOpen(false)} className="text-[11px] font-bold uppercase">{t}</Link>
          ))}
          <a href={site.instagram} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm font-medium">
            <Instagram size={18} /> Instagram
          </a>
          <a href={site.whatsapp} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm font-medium">
            <MessageCircle size={18} /> WhatsApp
          </a>
          <Link to={acceso} onClick={() => setOpen(false)} className="flex items-center gap-3 text-sm font-medium">
            <User size={18} /> {accesoTxt}
          </Link>
          <Link to="/#contacto" onClick={() => setOpen(false)} className="rounded-xl bg-bosque py-4 text-center text-[10px] font-bold uppercase ls-xl text-white">
            Más Información
          </Link>
        </div>
      )}
    </nav>
  );
}

// ---------------------------------------------------------------- Secciones
function Hero({ site }) {
  return (
    <section className="relative px-4 pb-16 pt-12 text-center sm:px-6 md:pb-24 md:pt-24 lg:pt-32">
      <div className="fade-in mx-auto max-w-4xl">
        <p className={`${eyebrow} mb-4 md:mb-6`}>{site.brandSubtitle}</p>
        <h1 className="font-editorial mb-6 text-4xl leading-[1.1] text-tinta sm:text-6xl md:mb-8 md:text-8xl">
          {site.heroLinea1} <br />
          <span className="font-light italic text-salvia">{site.heroLinea2}</span>.
        </h1>
        <p className="mx-auto mb-8 max-w-xl text-xs font-light text-musgo opacity-70 sm:text-sm md:mb-12 md:text-lg">{site.heroTexto}</p>

        <div className="mx-auto grid max-w-4xl grid-cols-1 gap-4 sm:grid-cols-3">
          {site.servicios.map((s, i) => {
            const Icon = ICONOS[s.icono] || Apple;
            return (
              <Link
                key={i}
                to={`/${s.enlace || '#servicios'}`}
                className="group flex flex-col items-center justify-center rounded-[1.5rem] border border-borde bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-bosque hover:bg-bosque hover:shadow-xl md:rounded-[2rem] md:p-8"
              >
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-crema text-salvia transition-all group-hover:bg-salvia group-hover:text-white md:mb-4 md:h-12 md:w-12">
                  <Icon size={18} />
                </div>
                <span className="text-[9px] font-bold uppercase ls-xl text-bosque transition-colors group-hover:text-white md:text-[10px]">{s.titulo}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Filosofia({ site, foto }) {
  return (
    <section className="border-y border-borde bg-white py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="order-2 flex w-full justify-center lg:order-1 lg:justify-end">
            <div className="flex aspect-[4/5] w-full max-w-sm items-end justify-center md:max-w-md">
              <img src={foto} alt="Nakary Linares" className="h-auto max-h-full w-full object-contain drop-shadow-sm" />
            </div>
          </div>

          <div className="order-1 space-y-6 text-center md:space-y-8 lg:order-2 lg:text-left">
            <div>
              <p className={`${eyebrow} mb-4 md:mb-6`}>Mi Filosofía</p>
              <h2 className="font-editorial mb-6 text-3xl leading-tight text-tinta sm:text-4xl md:mb-8 md:text-6xl">
                "{site.filosofiaA} <span className="font-light italic text-salvia">{site.filosofiaB}</span> {site.filosofiaC}"
              </h2>
              <div className="mx-auto mb-6 h-px w-20 bg-salvia/30 md:mb-8 lg:mx-0" />
              <p className="mx-auto max-w-xl text-sm font-light leading-relaxed text-musgo md:text-lg lg:mx-0">{site.filosofiaTexto}</p>
            </div>
            <div className="mx-auto flex max-w-xl flex-col gap-4 sm:flex-row lg:mx-0">
              {site.stats.map((s, i) => (
                <div key={i} className="flex-1 rounded-2xl border border-borde bg-crema p-4 md:p-6">
                  <p className="font-editorial mb-1 text-xl text-bosque md:text-2xl">{s.valor}</p>
                  <p className="text-[9px] font-bold uppercase ls-xl text-salvia md:text-[10px]">{s.etiqueta}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Servicios({ site }) {
  return (
    <section id="servicios" className="bg-crema px-4 py-16 sm:px-6 md:py-24">
      <div className="mx-auto max-w-5xl">
        <div className="mb-10 text-center md:mb-14">
          <p className={`${eyebrow} mb-3`}>Qué hago por ti</p>
          <h2 className="font-editorial text-4xl text-tinta md:text-6xl">Servicios</h2>
        </div>
        <div className="grid gap-6 md:gap-8">
          {site.servicios.map((s, i) => {
            const Icon = ICONOS[s.icono] || Apple;
            return (
              <div key={i} className="flex flex-col items-start gap-6 rounded-[1.5rem] border border-borde bg-white p-6 sm:flex-row md:gap-8 md:rounded-[2.5rem] md:p-8">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-crema text-salvia md:h-16 md:w-16">
                  <Icon size={24} />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="font-editorial mb-3 text-xl md:mb-4 md:text-2xl">{s.titulo}</h3>
                  <p className="mb-3 text-sm leading-relaxed text-musgo">{s.desc}</p>
                  {s.detalle && (
                    <p className="flex items-start gap-2 text-xs text-bosque">
                      <CheckCircle2 size={14} className="mt-0.5 flex-shrink-0 text-salvia" /> {s.detalle}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Planes({ site, onPick }) {
  return (
    <section id="planes" className="border-y border-borde bg-white px-4 py-16 sm:px-6 md:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center md:mb-16">
          <p className={`${eyebrow} mb-3`}>Elige tu modalidad</p>
          <h2 className="font-editorial text-4xl md:text-7xl">
            Nuestros <span className="font-light italic text-salvia">Planes</span>
          </h2>
        </div>

        <div className={`grid gap-8 lg:gap-12 ${site.planes.length > 1 ? 'md:grid-cols-2' : 'mx-auto max-w-xl'}`}>
          {site.planes.map((p, i) => {
            const Icon = ICONOS[p.icono] || Users;
            const ListIcon = ICON_LISTA[i % 2];
            return (
              <div
                key={i}
                className={`group relative flex flex-col overflow-hidden rounded-[2rem] border border-borde p-6 md:rounded-[3.5rem] md:p-12 ${p.destacado ? 'bg-crema' : 'bg-white'}`}
              >
                <div className="absolute right-0 top-0 hidden p-4 text-salvia/10 transition-colors group-hover:text-salvia/20 sm:block md:p-8">
                  <Icon size={100} strokeWidth={1} />
                </div>
                <div className="relative z-10 flex flex-1 flex-col">
                  {p.badge && (
                    <div className="mb-4 md:mb-6">
                      <span className={`rounded-full px-3 py-1 text-[8px] font-bold uppercase tracking-widest md:text-[9px] ${p.destacado ? 'bg-bosque text-white' : 'border border-borde bg-crema text-salvia'}`}>
                        {p.badge}
                      </span>
                    </div>
                  )}
                  <h3 className="font-editorial mb-2 text-2xl md:text-3xl">{p.nombre}</h3>
                  <p className="mb-6 text-xs text-musgo opacity-70 md:mb-8 md:text-sm">{p.descripcion}</p>

                  <div className="mb-8 flex items-baseline gap-2 md:mb-10">
                    <span className="font-editorial text-4xl text-bosque md:text-5xl">{p.precio}{p.moneda}</span>
                    <span className="text-xs font-bold uppercase tracking-widest text-salvia md:text-sm">{p.periodo}</span>
                  </div>

                  <div className="mb-8 space-y-6 md:mb-12 md:space-y-8">
                    <div>
                      <p className="mb-3 flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.2em] text-salvia md:mb-4 md:text-[10px]">
                        <ListIcon size={12} /> {p.tituloLista}
                      </p>
                      <ul className="space-y-3 text-xs md:text-sm">
                        {p.items.filter(Boolean).map((it, k) => (
                          <li key={k} className="flex items-start gap-3 text-bosque">
                            <CheckCircle2 size={14} className="mt-0.5 flex-shrink-0 text-salvia" />
                            <span>{it}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    {p.idealPara && (
                      <div className="rounded-xl border border-borde bg-white/60 p-4">
                        <p className="mb-2 text-[9px] font-bold uppercase text-bosque opacity-40">Ideal para:</p>
                        <p className="text-xs font-light italic leading-relaxed text-musgo">{p.idealPara}</p>
                      </div>
                    )}
                  </div>

                  <Link
                    to="/#contacto"
                    onClick={() => onPick(p.nombre)}
                    className={`mt-auto block w-full rounded-xl py-4 text-center text-[10px] font-bold uppercase ls-xl transition-all ${
                      p.destacado ? 'bg-bosque text-white hover:bg-salvia' : 'border-2 border-bosque text-bosque hover:bg-bosque hover:text-white'
                    }`}
                  >
                    {p.boton || 'Quiero empezar'}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Casos({ casos }) {
  if (!casos.length) return null;
  return (
    <section id="resultados" className="bg-crema px-4 py-16 sm:px-6 md:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center md:mb-16">
          <p className={`${eyebrow} mb-4`}>Evolución Real</p>
          <h2 className="font-editorial text-4xl text-tinta md:text-6xl">Casos de Éxito</h2>
        </div>
        <div className={`mx-auto grid max-w-4xl grid-cols-1 gap-6 md:gap-8 ${casos.length > 1 ? 'sm:grid-cols-2' : 'max-w-md'}`}>
          {casos.map((c) => (
            <figure key={c.id} className="flex flex-col justify-between overflow-hidden rounded-[2rem] border border-borde bg-white shadow-sm">
              <div className="flex w-full items-center justify-center bg-crema p-2">
                <img
                  src={c.imagen}
                  alt={c.nombre || 'Transformación'}
                  loading="lazy"
                  className="h-auto max-h-[520px] w-full rounded-[1.5rem] object-contain transition-all duration-500 md:grayscale md:hover:grayscale-0"
                />
              </div>
              {(c.testimonio || c.nombre) && (
                <figcaption className="border-t border-borde/50 bg-white p-6">
                  {c.nombre && <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-salvia">{c.nombre}</p>}
                  {c.testimonio && <p className="text-xs italic leading-relaxed text-musgo sm:text-sm">"{c.testimonio}"</p>}
                </figcaption>
              )}
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

function Testimonios({ items }) {
  if (!items.length) return null;
  return (
    <section className="border-t border-borde bg-white px-4 py-16 sm:px-6 md:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center md:mb-16">
          <p className={`${eyebrow} mb-4`}>Lo que dicen ellas</p>
          <h2 className="font-editorial text-4xl text-tinta md:text-6xl">Testimonios</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {items.map((t) => (
            <figure key={t.id} className="flex flex-col rounded-[2rem] border border-borde bg-crema p-6 md:p-8">
              <Quote className="mb-4 text-salvia/50" size={28} />
              <blockquote className="mb-6 flex-1 text-sm font-light leading-relaxed text-musgo">{t.texto}</blockquote>
              <figcaption>
                <p className="text-[11px] font-bold uppercase tracking-widest text-bosque">{t.nombre}</p>
                {t.detalle && <p className="mt-1 text-xs text-salvia">{t.detalle}</p>}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------- Contacto
const inputLine =
  'w-full border-b border-white/20 bg-transparent py-2 text-sm outline-none transition-colors placeholder:text-white/25 focus:border-salvia md:py-3 md:text-base';
const labelLine = 'text-[9px] font-bold uppercase tracking-widest opacity-40';

function Contacto({ site, interest, setInterest }) {
  const [form, setForm] = useState({ name: '', email: '', whatsapp: '' });
  const [status, setStatus] = useState('');

  const opciones = useMemo(
    () => [...site.planes.map((p) => p.nombre), 'Nutrición Consciente', 'Combo (Entrenamiento + Nutrición)'],
    [site.planes]
  );

  const submit = async (e) => {
    e.preventDefault();
    // Se abre la ventana ya (dentro del toque del usuario) para que el móvil no la bloquee
    const win = window.open('', '_blank');
    setStatus('enviando');

    const texto = `¡Hola Nakary! 👋 Mi nombre es ${form.name}. Estoy interesada en tu servicio de: *${interest}*.\n\n📧 Mi correo: ${form.email}\n📱 Mi WhatsApp: ${form.whatsapp}`;
    const link = `${site.whatsapp}${site.whatsapp.includes('?') ? '&' : '?'}text=${encodeURIComponent(texto)}`;

    // Guardar la solicitud (si falla, igual la persona llega a WhatsApp)
    try {
      await Promise.race([
        backend.addDoc('leads', {
          name: form.name.trim(),
          email: form.email.trim(),
          whatsapp: form.whatsapp.trim(),
          interest,
          createdAt: new Date().toISOString(),
        }),
        new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), 4000)),
      ]);
    } catch (err) {
      console.warn('No se pudo guardar la solicitud:', err);
    }

    if (win) win.location.href = link;
    else window.location.href = link;

    setForm({ name: '', email: '', whatsapp: '' });
    setStatus('exito');
    setTimeout(() => setStatus(''), 6000);
  };

  return (
    <section id="contacto" className="bg-crema px-4 py-12 sm:px-6 md:py-24">
      <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[2rem] bg-bosque p-6 text-white shadow-2xl sm:p-10 md:rounded-[3rem] lg:p-20">
        <div className="relative z-10 flex flex-col gap-12 text-left lg:flex-row lg:gap-16">
          <div className="lg:w-1/2">
            <h2 className="font-editorial mb-6 text-3xl leading-tight md:mb-8 md:text-6xl">
              Más <br className="hidden md:block" />información <br />
              <span className="italic opacity-40">personalizada</span>.
            </h2>
            <p className="mb-8 text-sm font-light opacity-60 md:mb-12 md:text-lg">
              Completa los datos y cuéntanos en qué plan estás interesada para comenzar tu proceso.
            </p>
            <div className="space-y-4 md:space-y-6">
              <a href={`mailto:${site.email}`} className="group flex items-center gap-4 transition-colors hover:text-salvia">
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 transition-all group-hover:bg-white group-hover:text-bosque md:h-12 md:w-12"><Mail size={16} /></div>
                <div>
                  <p className="text-[9px] font-bold uppercase ls-xl opacity-50">Email</p>
                  <p className="break-all text-xs font-medium md:text-base">{site.email}</p>
                </div>
              </a>
              <a href={site.whatsapp} target="_blank" rel="noopener noreferrer" className="group flex items-center gap-4 transition-colors hover:text-[#25D366]">
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 transition-all group-hover:bg-[#25D366] group-hover:text-white md:h-12 md:w-12"><MessageCircle size={16} /></div>
                <div>
                  <p className="text-[9px] font-bold uppercase ls-xl opacity-50">WhatsApp</p>
                  <p className="text-xs font-medium md:text-base">Asesoría Directa</p>
                </div>
              </a>
            </div>
          </div>

          <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-6 backdrop-blur-sm md:rounded-[2.5rem] md:p-8 lg:w-1/2">
            <form onSubmit={submit} className="space-y-4 md:space-y-6">
              <div className="space-y-1 md:space-y-2">
                <label htmlFor="c-name" className={labelLine}>Nombre Completo</label>
                <input id="c-name" type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="¿Cómo te llamas?" className={inputLine} required maxLength={120} />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
                <div className="space-y-1 md:space-y-2">
                  <label htmlFor="c-email" className={labelLine}>Email</label>
                  <input id="c-email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="tu@correo.com" className={inputLine} required maxLength={160} />
                </div>
                <div className="space-y-1 md:space-y-2">
                  <label htmlFor="c-wa" className={labelLine}>WhatsApp (Código + Número)</label>
                  <input id="c-wa" type="tel" value={form.whatsapp} onChange={(e) => setForm({ ...form, whatsapp: e.target.value })} placeholder="Ej: +34600000000" className={inputLine} required maxLength={40} />
                  <p className="text-[9px] italic text-white/40">*Incluye el código de tu país (ej. +34, +58, +54).</p>
                </div>
              </div>

              <div className="space-y-1 md:space-y-2">
                <label htmlFor="c-int" className={labelLine}>¿Qué plan te interesa?</label>
                <div className="relative">
                  <select id="c-int" value={interest} onChange={(e) => setInterest(e.target.value)} className={`${inputLine} cursor-pointer appearance-none`}>
                    {opciones.map((o) => (
                      <option key={o} className="text-black" value={o}>{o}</option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 opacity-30" size={16} />
                </div>
              </div>

              <button
                type="submit"
                disabled={status === 'enviando'}
                className="w-full rounded-xl bg-salvia py-4 text-[9px] font-bold uppercase ls-xl text-white transition-all duration-500 hover:bg-white hover:text-bosque disabled:opacity-50 md:text-[10px]"
              >
                {status === 'enviando' ? 'Enviando...' : 'Solicitar y Enviar a WhatsApp'}
              </button>
              {status === 'exito' && <p className="animate-pulse text-center text-[10px] font-bold text-salvia md:text-xs">¡Listo! Te llevamos a WhatsApp.</p>}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer({ logo, site }) {
  const link = 'flex items-center gap-2 text-[9px] font-bold uppercase ls-xl text-bosque transition-colors md:text-[10px]';
  return (
    <footer className="border-t border-borde bg-white py-12">
      <div className="mx-auto flex max-w-7xl flex-col items-center px-4 sm:px-6">
        <img src={logo} alt="Logo" className="mb-6 h-6 opacity-20 grayscale md:mb-8" />
        <div className="mb-6 flex flex-col items-center gap-4 sm:flex-row sm:gap-8 md:mb-8 md:gap-12">
          <a href={site.instagram} target="_blank" rel="noopener noreferrer" className={`${link} hover:text-salvia`}><Instagram size={12} /> Instagram</a>
          <a href={site.whatsapp} target="_blank" rel="noopener noreferrer" className={`${link} hover:text-[#25D366]`}><MessageCircle size={12} /> WhatsApp</a>
          <Link to="/ingresar" className={`${link} hover:text-salvia`}><User size={12} /> Acceso clientas</Link>
        </div>
        <p className="mb-3 text-center text-[9px] font-bold uppercase tracking-[0.3em] text-bosque md:text-[10px]">{site.brandSubtitle}</p>
        <p className="text-[8px] font-medium uppercase ls-xl text-[#A1A1A1] opacity-60 md:text-[9px]">© {new Date().getFullYear()} Todos los derechos reservados</p>
      </div>
    </footer>
  );
}

// ---------------------------------------------------------------- Página
export default function Home() {
  const { site, logo, foto } = useSite();
  const casosCol = useCol('casos');
  const testCol = useCol('testimonios');
  const [interest, setInterest] = useState(site.planes[0]?.nombre || '');

  // Si todavía no importó/subió casos, se muestran los iniciales de la versión Gemini
  const casos = useMemo(() => {
    const guardados = casosCol.items.filter((c) => c.visible !== false).sort(byOrden);
    if (guardados.length || casosCol.items.length) return guardados;
    return site.casosInicializados ? [] : DEFAULT_CASOS;
  }, [casosCol.items, site.casosInicializados]);

  const testimonios = useMemo(() => testCol.items.filter((t) => t.visible !== false).sort(byOrden), [testCol.items]);

  return (
    <div className="min-h-screen overflow-x-hidden bg-crema">
      <Navbar logo={logo} site={site} />
      <Hero site={site} />
      <Filosofia site={site} foto={foto} />
      <Servicios site={site} />
      <Planes site={site} onPick={setInterest} />
      <Casos casos={casos} />
      <Testimonios items={testimonios} />
      <Contacto site={site} interest={interest || site.planes[0]?.nombre || ''} setInterest={setInterest} />
      <Footer logo={logo} site={site} />
    </div>
  );
}

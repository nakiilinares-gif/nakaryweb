import { createContext, useContext, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowLeft, Apple, Camera, ChevronDown, Dumbbell, Instagram, Mail, Menu, MessageCircle, User, X } from 'lucide-react';
import { backend } from '../data';
import { useAuth } from '../auth';
import { useSite } from '../hooks';

export const ICONOS = { apple: Apple, dumbbell: Dumbbell, camera: Camera };
export const eyebrow = 'text-[9px] md:text-[10px] font-bold uppercase ls-xl text-salvia';

// Convierte el destino guardado de un servicio en una ruta de la web
export const rutaServicio = (e = '') => {
  if (e === '#planes') return '/entrenamiento';
  if (e === '#resultados') return '/evolucion';
  if (e === '#contacto') return '#contacto';
  return e || '/';
};

// ---------------------------------------------------------------- "Plan que le interesa" compartido
const InterestCtx = createContext({ interest: '', setInterest: () => {} });
export const useInterest = () => useContext(InterestCtx);

// ---------------------------------------------------------------- Navbar
function Navbar({ logo, site }) {
  const [open, setOpen] = useState(false);
  const { user, isAdmin } = useAuth();
  const { pathname } = useLocation();

  const links = [
    ['Inicio', '/'],
    ['Nutrición', '/nutricion'],
    ['Entrenamiento', '/entrenamiento'],
    ['Evolución', '/evolucion'],
  ];
  const acceso = user ? (isAdmin ? '/admin' : '/mi-plan') : '/ingresar';
  const accesoTxt = user ? (isAdmin ? 'Panel' : 'Mi plan') : 'Acceso clientas';
  const act = (to) => (pathname === to ? 'text-salvia' : '');

  return (
    <nav className="sticky top-0 z-[100] border-b border-borde bg-crema/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 md:h-20">
        <Link to="/" className="flex-shrink-0" aria-label="Inicio">
          <img src={logo} alt="Logo Nakary Linares" className="h-8 w-auto object-contain md:h-10" />
        </Link>

        <div className="hidden items-center gap-6 text-[10px] font-bold uppercase ls-xl lg:flex xl:gap-8">
          {links.map(([t, to]) => (
            <Link key={t} to={to} className={`transition-colors hover:text-salvia ${act(to)}`}>{t}</Link>
          ))}
          <a href={site.instagram} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-salvia">Instagram</a>
          <Link to={acceso} className="flex items-center gap-2 transition-colors hover:text-salvia">
            <User size={14} /> {accesoTxt}
          </Link>
          <Link to="#contacto" className="rounded-full bg-bosque px-6 py-2.5 text-white transition-all hover:bg-salvia">
            Más Información
          </Link>
        </div>

        <button className="rounded-lg p-2 lg:hidden" onClick={() => setOpen(!open)} aria-label="Menú" aria-expanded={open}>
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {open && (
        <div className="flex max-h-[calc(100dvh-4rem)] flex-col gap-5 overflow-y-auto border-b border-borde bg-white p-6 lg:hidden">
          {links.map(([t, to]) => (
            <Link key={t} to={to} onClick={() => setOpen(false)} className={`text-[11px] font-bold uppercase ${act(to)}`}>{t}</Link>
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
          <Link to="#contacto" onClick={() => setOpen(false)} className="rounded-xl bg-bosque py-4 text-center text-[10px] font-bold uppercase ls-xl text-white">
            Más Información
          </Link>
        </div>
      )}
    </nav>
  );
}

// ---------------------------------------------------------------- Contacto
const inputLine =
  'w-full border-b border-white/20 bg-transparent py-2 text-sm outline-none transition-colors placeholder:text-white/25 focus:border-salvia md:py-3 md:text-base';
const labelLine = 'text-[9px] font-bold uppercase tracking-widest opacity-40';

function Contacto({ site }) {
  const { interest, setInterest } = useInterest();
  const [form, setForm] = useState({ name: '', email: '', whatsapp: '' });
  const [status, setStatus] = useState('');

  const opciones = useMemo(
    () => [...site.planes.map((p) => p.nombre), 'Nutrición Consciente', 'Combo (Entrenamiento + Nutrición)'],
    [site.planes]
  );

  const submit = async (e) => {
    e.preventDefault();
    // Se abre la ventana ya (dentro del toque) para que el celular no la bloquee
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
      <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[2rem] bg-bosque p-6 text-white shadow-2xl sm:p-10 md:rounded-[3rem] lg:p-16 xl:p-20">
        <div className="relative z-10 flex flex-col gap-12 text-left lg:flex-row lg:gap-16">
          <div className="lg:w-1/2">
            <h2 className="font-editorial mb-6 text-3xl leading-tight md:mb-8 md:text-5xl xl:text-6xl">
              Más <br className="hidden md:block" />información <br />
              <span className="italic opacity-40">personalizada</span>.
            </h2>
            <p className="mb-8 text-sm font-light opacity-60 md:mb-12 md:text-lg">
              Completa los datos y cuéntanos en qué plan estás interesada para comenzar tu proceso.
            </p>
            <div className="space-y-4 md:space-y-6">
              <a href={`mailto:${site.email}`} className="group flex items-center gap-4 transition-colors hover:text-salvia">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-white/10 transition-all group-hover:bg-white group-hover:text-bosque md:h-12 md:w-12"><Mail size={16} /></div>
                <div className="min-w-0">
                  <p className="text-[9px] font-bold uppercase ls-xl opacity-50">Email</p>
                  <p className="break-all text-xs font-medium md:text-base">{site.email}</p>
                </div>
              </a>
              <a href={site.whatsapp} target="_blank" rel="noopener noreferrer" className="group flex items-center gap-4 transition-colors hover:text-[#25D366]">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border border-white/10 transition-all group-hover:bg-[#25D366] group-hover:text-white md:h-12 md:w-12"><MessageCircle size={16} /></div>
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

// ---------------------------------------------------------------- Footer
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

// ---------------------------------------------------------------- Piezas reutilizables de las páginas
export function PageHeader({ etiqueta, children, texto }) {
  return (
    <header className="fade-in mx-auto max-w-5xl px-4 pb-10 pt-8 text-center sm:px-6 md:pb-14 md:pt-14">
      <Link to="/" className="mb-8 inline-flex items-center gap-2 text-[9px] font-bold uppercase ls-xl text-salvia transition-transform hover:-translate-x-1 md:mb-10 md:text-[10px]">
        <ArrowLeft size={14} /> Volver al inicio
      </Link>
      <p className={`${eyebrow} mb-3 md:mb-4`}>{etiqueta}</p>
      <h1 className="font-editorial text-4xl leading-[1.1] text-tinta sm:text-5xl md:text-7xl">{children}</h1>
      {texto && <p className="mx-auto mt-5 max-w-2xl text-sm font-light leading-relaxed text-musgo md:mt-8 md:text-lg">{texto}</p>}
    </header>
  );
}

export function OtrasCategorias({ site }) {
  const { pathname } = useLocation();
  const otras = site.servicios.filter((s) => rutaServicio(s.enlace) !== pathname);
  if (!otras.length) return null;
  return (
    <section className="border-t border-borde bg-white px-4 py-12 sm:px-6 md:py-20">
      <div className="mx-auto max-w-4xl text-center">
        <p className={`${eyebrow} mb-6`}>Sigue explorando</p>
        <div className="grid gap-4 sm:grid-cols-2">
          {otras.map((s, i) => {
            const Icon = ICONOS[s.icono] || Apple;
            return (
              <Link
                key={i}
                to={rutaServicio(s.enlace)}
                className="group flex items-center gap-4 rounded-[1.5rem] border border-borde bg-crema p-5 text-left transition-all hover:-translate-y-1 hover:border-bosque hover:bg-bosque md:p-6"
              >
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-white text-salvia transition-all group-hover:bg-salvia group-hover:text-white">
                  <Icon size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase ls-xl text-bosque transition-colors group-hover:text-white">{s.titulo}</p>
                  <p className="mt-1 line-clamp-2 text-xs text-musgo transition-colors group-hover:text-white/70">{s.desc}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------- Layout
export default function SiteLayout({ children }) {
  const { site, logo } = useSite();
  const [interest, setInterest] = useState('');
  const value = interest || site.planes[0]?.nombre || '';

  return (
    <InterestCtx.Provider value={{ interest: value, setInterest }}>
      <div className="min-h-screen overflow-x-hidden bg-crema">
        <Navbar logo={logo} site={site} />
        {children}
        <Contacto site={site} />
        <Footer logo={logo} site={site} />
      </div>
    </InterestCtx.Provider>
  );
}

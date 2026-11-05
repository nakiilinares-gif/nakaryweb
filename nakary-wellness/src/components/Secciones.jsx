import { Link } from 'react-router-dom';
import { CheckCircle2, ClipboardList, Globe, Quote, TrendingUp, Users } from 'lucide-react';
import { eyebrow, useInterest } from './SiteLayout';
import { useZona } from '../hooks';

const ICONOS_PLAN = { users: Users, globe: Globe };
const ICON_LISTA = [ClipboardList, TrendingUp];

// ---------------------------------------------------------------- Planes
export function Planes({ site }) {
  const { setInterest } = useInterest();
  const [zona, setZona] = useZona();
  const hayPorPais = site.planes.some((p) => p.porPais);
  return (
    <section className="bg-white px-4 pb-16 sm:px-6 md:pb-24">
      <div className="mx-auto max-w-6xl">
        {hayPorPais && (
          <div className="mb-8 flex flex-col items-center gap-2 md:mb-10">
            <p className="text-[10px] font-bold uppercase tracking-widest text-salvia">Mostrar precios para</p>
            <div className="inline-flex rounded-full border border-borde bg-crema p-1">
              {[['ve', 'Venezuela'], ['resto', 'Otros países']].map(([k, label]) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => setZona(k)}
                  aria-pressed={zona === k}
                  className={`rounded-full px-5 py-2 text-[10px] font-bold uppercase tracking-widest transition-all ${zona === k ? 'bg-bosque text-white' : 'text-musgo hover:text-bosque'}`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className={`grid gap-8 lg:gap-10 ${site.planes.length > 2 ? 'md:grid-cols-2 lg:grid-cols-3' : site.planes.length > 1 ? 'md:grid-cols-2' : 'mx-auto max-w-xl'}`}>
          {site.planes.map((p, i) => {
            const Icon = ICONOS_PLAN[p.icono] || Users;
            const ListIcon = ICON_LISTA[i % 2];
            return (
              <div
                key={i}
                className={`group relative flex flex-col overflow-hidden rounded-[2rem] border border-borde p-6 sm:p-8 md:rounded-[3rem] md:p-8 xl:p-10 ${p.destacado ? 'bg-crema' : 'bg-white'}`}
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
                    <span className="font-editorial text-4xl text-bosque md:text-5xl">
                      {p.porPais ? (zona === 've' ? p.precioVE : p.precioResto) : p.precio}{p.moneda}
                    </span>
                    <span className="text-xs font-bold uppercase tracking-widest text-salvia md:text-sm">{p.periodo}</span>
                  </div>

                  {p.porPais && (
                    <p className="-mt-6 mb-8 text-[11px] text-musgo/70 md:-mt-8 md:mb-10">
                      Precio {zona === 've' ? 'para Venezuela' : 'fuera de Venezuela'}
                    </p>
                  )}

                  <div className="mb-8 space-y-6 md:mb-12 md:space-y-8">
                    <div>
                      <p className="mb-3 flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.2em] text-salvia md:mb-4 md:text-[10px]">
                        <ListIcon size={12} /> {p.tituloLista}
                      </p>
                      <ul className="space-y-3 text-xs md:text-sm">
                        {(p.items || []).filter(Boolean).map((it, k) => (
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
                    to="#contacto"
                    onClick={() => setInterest(p.nombre)}
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

// ---------------------------------------------------------------- Casos de éxito
export function Casos({ casos, titulo = 'Casos de Éxito', conEtiqueta = true, fondo = 'bg-crema' }) {
  if (!casos.length) return null;
  return (
    <section className={`${fondo} px-4 py-16 sm:px-6 md:py-24`}>
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center md:mb-16">
          {conEtiqueta && <p className={`${eyebrow} mb-4`}>Evolución Real</p>}
          <h2 className="font-editorial text-4xl text-tinta md:text-6xl">{titulo}</h2>
        </div>
        <div className={`mx-auto grid grid-cols-1 gap-6 md:gap-8 ${casos.length > 2 ? 'max-w-6xl sm:grid-cols-2 lg:grid-cols-3' : casos.length > 1 ? 'max-w-4xl sm:grid-cols-2' : 'max-w-md'}`}>
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

// ---------------------------------------------------------------- Testimonios
export function Testimonios({ items }) {
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

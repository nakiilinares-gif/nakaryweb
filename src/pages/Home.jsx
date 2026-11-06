import { Link } from 'react-router-dom';
import { Apple } from 'lucide-react';
import { useCasos, useSite } from '../hooks';
import SiteLayout, { ICONOS, eyebrow, rutaServicio } from '../components/SiteLayout';
import { Casos } from '../components/Secciones';

function Hero({ site }) {
  return (
    <section className="relative px-4 pb-16 pt-10 text-center sm:px-6 md:pb-24 md:pt-20 lg:pt-28">
      <div className="fade-in mx-auto max-w-5xl">
        <p className={`${eyebrow} mb-4 md:mb-6`}>{site.brandSubtitle}</p>
        <h1 className="font-editorial mb-6 text-balance text-4xl leading-[1.1] text-tinta sm:text-6xl md:mb-8 md:text-7xl lg:text-8xl">
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
                to={rutaServicio(s.enlace)}
                className="group flex flex-col items-center justify-center rounded-[1.5rem] border border-borde bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-bosque hover:bg-bosque hover:shadow-xl md:rounded-[2rem] md:p-8"
              >
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-crema text-salvia transition-all group-hover:bg-salvia group-hover:text-white md:mb-4 md:h-12 md:w-12">
                  <Icon size={18} />
                </div>
                <span className="text-center text-[9px] font-bold uppercase ls-xl text-bosque transition-colors group-hover:text-white md:text-[10px]">{s.titulo}</span>
                <span className="mt-2 hidden text-center text-[11px] font-light leading-snug text-musgo transition-colors group-hover:text-white/70 md:block">{s.detalle}</span>
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
              <h2 className="font-editorial mb-6 text-3xl leading-tight text-tinta sm:text-4xl md:mb-8 md:text-5xl xl:text-6xl">
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

export default function Home() {
  const { site, foto } = useSite();
  const casos = useCasos();
  return (
    <SiteLayout>
      <Hero site={site} />
      <Filosofia site={site} foto={foto} />
      <Casos casos={casos} fondo="bg-crema" />
    </SiteLayout>
  );
}

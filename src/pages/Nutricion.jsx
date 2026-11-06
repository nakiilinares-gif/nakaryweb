import { Link } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import { useSite } from '../hooks';
import SiteLayout, { OtrasCategorias, PageHeader, useInterest } from '../components/SiteLayout';

function Contenido({ site }) {
  const { setInterest } = useInterest();
  const items = (site.nutricionItems || []).filter(Boolean);
  const nutri = site.servicios.find((s) => (s.icono || '') === 'apple');

  return (
    <>
      <PageHeader etiqueta="Categoría" texto={site.nutricionIntro}>
        {site.nutricionTitulo1} <span className="font-light italic text-salvia">{site.nutricionTitulo2}</span>
      </PageHeader>

      <section className="bg-white px-4 pb-16 sm:px-6 md:pb-24">
        <div className="mx-auto max-w-4xl space-y-6">
          {nutri?.desc && <p className="text-center text-base font-light leading-relaxed text-musgo md:text-xl">{nutri.desc}</p>}
          <div className="rounded-[1.5rem] border border-borde bg-crema p-6 md:rounded-[2.5rem] md:p-10">
            <h2 className="font-editorial mb-4 text-xl md:mb-6 md:text-2xl">{site.nutricionTituloLista}</h2>
            <ul className="space-y-3 text-sm md:space-y-4 md:text-base">
              {items.map((li, i) => (
                <li key={i} className="flex items-start gap-3 text-bosque">
                  <CheckCircle2 size={18} className="mt-0.5 flex-shrink-0 text-salvia" /> {li}
                </li>
              ))}
            </ul>
            <Link
              to="#contacto"
              onClick={() => setInterest('Nutrición Consciente')}
              className="mt-8 block rounded-xl bg-bosque py-4 text-center text-[10px] font-bold uppercase ls-xl text-white transition-all hover:bg-salvia md:inline-block md:px-10"
            >
              {site.nutricionBoton}
            </Link>
          </div>
        </div>
      </section>

      <OtrasCategorias site={site} />
    </>
  );
}

export default function Nutricion() {
  const { site } = useSite();
  return (
    <SiteLayout>
      <Contenido site={site} />
    </SiteLayout>
  );
}

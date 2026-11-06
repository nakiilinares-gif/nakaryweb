import { useSite } from '../hooks';
import SiteLayout, { OtrasCategorias, PageHeader } from '../components/SiteLayout';
import { Planes } from '../components/Secciones';

export default function Entrenamiento() {
  const { site } = useSite();
  return (
    <SiteLayout>
      <PageHeader etiqueta="Elige tu modalidad">
        Nuestros <span className="font-light italic text-salvia">Planes</span>
      </PageHeader>
      <Planes site={site} />
      <OtrasCategorias site={site} />
    </SiteLayout>
  );
}

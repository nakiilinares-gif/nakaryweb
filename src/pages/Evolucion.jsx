import { useMemo } from 'react';
import { byOrden, useCasos, useCol, useSite } from '../hooks';
import SiteLayout, { OtrasCategorias, PageHeader } from '../components/SiteLayout';
import { Casos, Testimonios } from '../components/Secciones';

export default function Evolucion() {
  const { site } = useSite();
  const casos = useCasos();
  const testCol = useCol('testimonios');
  const testimonios = useMemo(() => testCol.items.filter((t) => t.visible !== false).sort(byOrden), [testCol.items]);

  return (
    <SiteLayout>
      <PageHeader etiqueta="Evolución Real" texto="El impacto de la constancia: procesos reales y testimonios de transformación integral.">
        Evolución <span className="font-light italic text-salvia">&amp; Resultados</span>
      </PageHeader>
      <Casos casos={casos} titulo="Casos de Éxito" conEtiqueta={false} fondo="bg-crema" />
      <Testimonios items={testimonios} />
      {!casos.length && !testimonios.length && (
        <p className="bg-crema px-4 py-16 text-center text-sm text-musgo">Pronto compartiremos aquí los resultados de nuestras alumnas. 💚</p>
      )}
      <OtrasCategorias site={site} />
    </SiteLayout>
  );
}

import { useState } from 'react';
import { Camera, Inbox, PenLine, Users } from 'lucide-react';
import { backend } from '../../data';
import Shell from '../../components/Shell';
import { Eyebrow } from '../../components/ui';
import Clientas from './Clientas';
import Contenido from './Contenido';
import Resultados from './Resultados';
import Solicitudes from './Solicitudes';

const TABS = [
  ['clientas', 'Clientas', Users, Clientas],
  ['contenido', 'Contenido web', PenLine, Contenido],
  ['resultados', 'Casos y testimonios', Camera, Resultados],
  ['solicitudes', 'Solicitudes', Inbox, Solicitudes],
];

export default function Admin() {
  const [tab, setTab] = useState(() => {
    try { return sessionStorage.getItem('admin-tab') || 'clientas'; } catch { return 'clientas'; }
  });
  const go = (k) => {
    setTab(k);
    try { sessionStorage.setItem('admin-tab', k); } catch {}
  };
  const Current = (TABS.find((t) => t[0] === tab) || TABS[0])[3];

  return (
    <Shell wide>
      <div className="mb-6">
        <Eyebrow className="mb-2">Panel de administración</Eyebrow>
        <h1 className="font-editorial text-3xl text-tinta md:text-5xl">
          Hola, <span className="font-light italic text-salvia">Nakary</span>
        </h1>
        {backend.mode === 'demo' && (
          <p className="mt-3 inline-block rounded-full border border-amber-200 bg-amber-50 px-4 py-1.5 text-[11px] text-amber-800">
            Modo demostración: lo que cargues aquí solo se guarda en este navegador.
          </p>
        )}
      </div>

      <div className="mb-8 flex gap-1 overflow-x-auto rounded-2xl border border-borde bg-white p-1">
        {TABS.map(([k, label, Icon]) => (
          <button
            key={k}
            onClick={() => go(k)}
            className={`flex flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-xl px-4 py-3 text-[10px] font-bold uppercase tracking-widest transition-all ${tab === k ? 'bg-bosque text-white' : 'text-musgo hover:bg-crema'}`}
          >
            <Icon size={14} /> {label}
          </button>
        ))}
      </div>

      <Current />
    </Shell>
  );
}

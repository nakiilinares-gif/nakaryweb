import { useMemo } from 'react';
import { MessageCircle, Trash2 } from 'lucide-react';
import { backend } from '../../data';
import { authErrorMsg } from '../../auth';
import { useCol } from '../../hooks';
import { Btn, Card, PageLoader, useToast } from '../../components/ui';
import { onlyDigits } from '../../utils';

export default function Solicitudes() {
  const toast = useToast();
  const { items, loading, error } = useCol('leads');
  const lista = useMemo(() => [...items].sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || '')), [items]);

  if (loading) return <PageLoader />;
  if (error) return <Card className="border-red-200! bg-red-50! text-sm text-red-700">{authErrorMsg(error)}</Card>;
  if (!lista.length)
    return <Card className="py-12 text-center text-sm text-musgo">Aún no hay solicitudes. Aquí aparecerán las personas que llenen el formulario de contacto de tu web.</Card>;

  const borrar = async (id) => {
    if (!window.confirm('¿Eliminar esta solicitud?')) return;
    try { await backend.deleteDoc(`leads/${id}`); } catch (e) { toast(authErrorMsg(e), 'error'); }
  };

  return (
    <div className="grid gap-3 md:grid-cols-2">
      {lista.map((l) => (
        <div key={l.id} className="rounded-2xl border border-borde bg-white p-5">
          <div className="mb-2 flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="font-editorial truncate text-lg text-bosque">{l.name}</p>
              <p className="truncate text-xs text-musgo">{l.email}</p>
            </div>
            <p className="flex-shrink-0 text-[10px] text-musgo/70">{l.createdAt ? new Date(l.createdAt).toLocaleDateString('es', { day: 'numeric', month: 'short' }) : ''}</p>
          </div>
          <p className="mb-1 text-xs text-musgo">Interesada en: <b className="font-medium text-bosque">{l.interest}</b></p>
          <p className="mb-4 text-xs text-musgo">{l.whatsapp}</p>
          <div className="flex gap-2">
            {onlyDigits(l.whatsapp) && (
              <Btn as="a" size="sm" variant="sage" target="_blank" rel="noopener noreferrer" href={`https://wa.me/${onlyDigits(l.whatsapp)}`}><MessageCircle size={13} /> WhatsApp</Btn>
            )}
            <Btn size="sm" variant="danger" className="ml-auto" onClick={() => borrar(l.id)}><Trash2 size={13} /></Btn>
          </div>
        </div>
      ))}
    </div>
  );
}

import { useEffect, useState } from 'react';
import { RotateCcw, Save } from 'lucide-react';
import { backend } from '../../data';
import { authErrorMsg } from '../../auth';
import { useSite } from '../../hooks';
import { DEFAULT_SITE } from '../../defaults';
import { Btn, Card, Field, ImageUpload, Input, ListEditor, PageLoader, Select, Textarea, useToast } from '../../components/ui';

const Section = ({ title, hint, children }) => (
  <Card>
    <h2 className="font-editorial text-xl text-bosque">{title}</h2>
    {hint && <p className="mb-4 mt-1 text-xs text-musgo">{hint}</p>}
    {!hint && <div className="mb-4" />}
    {children}
  </Card>
);

export default function Contenido() {
  const { site, stored, logo, foto, hasCustomLogo, hasCustomFoto, loading } = useSite();
  const toast = useToast();
  const [d, setD] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!loading && d === null) setD({ ...DEFAULT_SITE, ...(stored || {}) });
  }, [loading, stored, d]);

  if (!d) return <PageLoader />;
  const set = (patch) => setD((p) => ({ ...p, ...patch }));

  const guardar = async () => {
    setSaving(true);
    try {
      const limpio = {
        ...d,
        planes: d.planes.map((p) => ({ ...p, items: (p.items || []).map((x) => x.trim()).filter(Boolean) })),
        updatedAt: new Date().toISOString(),
      };
      delete limpio.id;
      await backend.setDoc('site/main', limpio);
      toast('Contenido publicado ✔');
    } catch (e) {
      toast(authErrorMsg(e), 'error');
    }
    setSaving(false);
  };

  const subirMedia = async (key, data) => {
    try {
      await backend.setDoc(`media/${key}`, { data, updatedAt: new Date().toISOString() }, false);
      toast('Imagen actualizada ✔');
    } catch (e) {
      toast(authErrorMsg(e), 'error');
    }
  };
  const quitarMedia = async (key) => {
    try {
      await backend.deleteDoc(`media/${key}`);
      toast('Se restauró la imagen original.');
    } catch (e) {
      toast(authErrorMsg(e), 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="sticky top-[4.5rem] z-30 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-borde bg-crema/95 p-3 backdrop-blur">
        <p className="text-xs text-musgo">Los cambios se publican en la web al tocar “Publicar cambios”.</p>
        <Btn onClick={guardar} disabled={saving}><Save size={14} /> {saving ? 'Publicando…' : 'Publicar cambios'}</Btn>
      </div>

      <Section title="Logo y foto" hint="Se guardan al instante. La foto funciona mejor en PNG con fondo transparente.">
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-salvia">Logo</p>
            <ImageUpload value={logo} keepAlpha max={600} onChange={(v) => subirMedia('logo', v)} />
            {hasCustomLogo && <button className="mt-2 flex items-center gap-1 text-[11px] text-musgo underline" onClick={() => quitarMedia('logo')}><RotateCcw size={11} /> Restaurar original</button>}
          </div>
          <div>
            <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-salvia">Tu foto (sección Filosofía)</p>
            <ImageUpload value={foto} keepAlpha max={1100} onChange={(v) => subirMedia('foto', v)} />
            {hasCustomFoto && <button className="mt-2 flex items-center gap-1 text-[11px] text-musgo underline" onClick={() => quitarMedia('foto')}><RotateCcw size={11} /> Restaurar original</button>}
          </div>
        </div>
      </Section>

      <Section title="Portada">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Subtítulo de la marca" className="sm:col-span-2"><Input value={d.brandSubtitle} onChange={(e) => set({ brandSubtitle: e.target.value })} /></Field>
          <Field label="Título (línea 1)"><Input value={d.heroLinea1} onChange={(e) => set({ heroLinea1: e.target.value })} /></Field>
          <Field label="Título (línea destacada)"><Input value={d.heroLinea2} onChange={(e) => set({ heroLinea2: e.target.value })} /></Field>
          <Field label="Texto debajo del título" className="sm:col-span-2"><Textarea rows={2} value={d.heroTexto} onChange={(e) => set({ heroTexto: e.target.value })} /></Field>
        </div>
      </Section>

      <Section title="Mi filosofía">
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="Frase (inicio)"><Input value={d.filosofiaA} onChange={(e) => set({ filosofiaA: e.target.value })} /></Field>
          <Field label="Palabra destacada"><Input value={d.filosofiaB} onChange={(e) => set({ filosofiaB: e.target.value })} /></Field>
          <Field label="Frase (final)"><Input value={d.filosofiaC} onChange={(e) => set({ filosofiaC: e.target.value })} /></Field>
          <Field label="Texto" className="sm:col-span-3"><Textarea rows={3} value={d.filosofiaTexto} onChange={(e) => set({ filosofiaTexto: e.target.value })} /></Field>
        </div>
        <p className="mb-2 mt-5 text-[10px] font-bold uppercase tracking-widest text-salvia">Cuadros de datos</p>
        <ListEditor
          items={d.stats}
          onChange={(stats) => set({ stats })}
          blank={{ valor: '', etiqueta: '' }}
          addLabel="Agregar cuadro"
          itemLabel={(it) => it.etiqueta || it.valor || 'Cuadro'}
          render={(it, up) => (
            <div className="grid gap-3 sm:grid-cols-2">
              <Input placeholder="Ej: +50" value={it.valor} onChange={(e) => up({ valor: e.target.value })} />
              <Input placeholder="Ej: Alumnas" value={it.etiqueta} onChange={(e) => up({ etiqueta: e.target.value })} />
            </div>
          )}
        />
      </Section>

      <Section title="Servicios" hint="Las 3 tarjetas de la portada y de la sección Servicios.">
        <ListEditor
          items={d.servicios}
          onChange={(servicios) => set({ servicios })}
          blank={{ icono: 'dumbbell', titulo: '', desc: '', detalle: '', enlace: '#planes' }}
          addLabel="Agregar servicio"
          itemLabel={(it) => it.titulo || 'Servicio'}
          render={(it, up) => (
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Título"><Input value={it.titulo} onChange={(e) => up({ titulo: e.target.value })} /></Field>
              <Field label="Ícono">
                <Select value={it.icono} onChange={(e) => up({ icono: e.target.value })}>
                  <option value="apple">Manzana (nutrición)</option><option value="dumbbell">Pesa (entrenamiento)</option><option value="camera">Cámara (resultados)</option>
                </Select>
              </Field>
              <Field label="Descripción" className="sm:col-span-2"><Textarea rows={2} value={it.desc} onChange={(e) => up({ desc: e.target.value })} /></Field>
              <Field label="Detalle corto" className="sm:col-span-2"><Input value={it.detalle} onChange={(e) => up({ detalle: e.target.value })} /></Field>
              <Field label="Al tocar, ir a">
                <Select value={it.enlace} onChange={(e) => up({ enlace: e.target.value })}>
                  <option value="#planes">Planes</option><option value="#resultados">Casos de éxito</option><option value="#contacto">Contacto</option>
                </Select>
              </Field>
            </div>
          )}
        />
      </Section>

      <Section title="Planes y precios">
        <ListEditor
          items={d.planes}
          onChange={(planes) => set({ planes })}
          blank={{ nombre: '', badge: '', icono: 'users', descripcion: '', precio: '', moneda: '€', periodo: '/ Mes', tituloLista: 'Incluye', items: [''], idealPara: '', boton: 'Quiero empezar', destacado: false }}
          addLabel="Agregar plan"
          itemLabel={(it) => it.nombre || 'Plan'}
          render={(it, up) => (
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Nombre del plan"><Input value={it.nombre} onChange={(e) => up({ nombre: e.target.value })} /></Field>
              <Field label="Etiqueta (opcional)"><Input value={it.badge} onChange={(e) => up({ badge: e.target.value })} placeholder="Sede Valencia" /></Field>
              <Field label="Precio"><Input value={it.precio} onChange={(e) => up({ precio: e.target.value })} /></Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Moneda"><Input value={it.moneda} onChange={(e) => up({ moneda: e.target.value })} /></Field>
                <Field label="Periodo"><Input value={it.periodo} onChange={(e) => up({ periodo: e.target.value })} /></Field>
              </div>
              <Field label="Descripción corta" className="sm:col-span-2"><Input value={it.descripcion} onChange={(e) => up({ descripcion: e.target.value })} /></Field>
              <Field label="Título de la lista"><Input value={it.tituloLista} onChange={(e) => up({ tituloLista: e.target.value })} /></Field>
              <Field label="Ícono">
                <Select value={it.icono} onChange={(e) => up({ icono: e.target.value })}>
                  <option value="users">Personas</option><option value="globe">Mundo</option>
                </Select>
              </Field>
              <Field label="Qué incluye (uno por línea)" className="sm:col-span-2">
                <Textarea rows={5} value={(it.items || []).join('\n')} onChange={(e) => up({ items: e.target.value.split('\n') })} />
              </Field>
              <Field label="Ideal para" className="sm:col-span-2"><Textarea rows={2} value={it.idealPara} onChange={(e) => up({ idealPara: e.target.value })} /></Field>
              <Field label="Texto del botón"><Input value={it.boton} onChange={(e) => up({ boton: e.target.value })} /></Field>
              <Field label="Estilo">
                <Select value={it.destacado ? 'si' : 'no'} onChange={(e) => up({ destacado: e.target.value === 'si' })}>
                  <option value="si">Destacado (fondo crema, botón oscuro)</option><option value="no">Normal (fondo blanco)</option>
                </Select>
              </Field>
            </div>
          )}
        />
      </Section>

      <Section title="Contacto y redes">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Enlace de WhatsApp" hint="Ej: https://wa.me/584141234567"><Input value={d.whatsapp} onChange={(e) => set({ whatsapp: e.target.value })} /></Field>
          <Field label="Instagram (enlace)"><Input value={d.instagram} onChange={(e) => set({ instagram: e.target.value })} /></Field>
          <Field label="Correo de contacto"><Input type="email" value={d.email} onChange={(e) => set({ email: e.target.value })} /></Field>
        </div>
      </Section>
    </div>
  );
}

import { createContext, useCallback, useContext, useRef, useState } from 'react';
import { ArrowDown, ArrowUp, ImagePlus, Loader2, Plus, Trash2 } from 'lucide-react';
import { compressImage } from '../utils';

// ---------- Formularios ----------
export const inputCls =
  'w-full rounded-xl border border-borde bg-white px-4 py-3 text-sm text-tinta outline-none transition-colors focus:border-salvia placeholder:text-tinta/30 disabled:bg-crema disabled:text-tinta/50';

export function Field({ label, hint, children, className = '' }) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-widest text-salvia">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-[11px] leading-snug text-musgo/70">{hint}</span>}
    </label>
  );
}
export const Input = (p) => <input {...p} className={`${inputCls} ${p.className || ''}`} />;
export const Textarea = (p) => <textarea rows={3} {...p} className={`${inputCls} resize-y ${p.className || ''}`} />;
export const Select = (p) => <select {...p} className={`${inputCls} ${p.className || ''}`} />;

// ---------- Botones ----------
const variants = {
  primary: 'bg-bosque text-white hover:bg-salvia',
  sage: 'bg-salvia text-white hover:bg-bosque',
  outline: 'border-2 border-bosque text-bosque hover:bg-bosque hover:text-white',
  soft: 'bg-white border border-borde text-bosque hover:border-salvia',
  danger: 'bg-white border border-red-200 text-red-600 hover:bg-red-50',
};
const sizes = { sm: 'px-3 py-2 text-[10px]', md: 'px-6 py-3 text-[10px]', lg: 'px-8 py-4 text-[11px]' };

export function Btn({ variant = 'primary', size = 'md', as: Tag = 'button', className = '', ...p }) {
  return (
    <Tag
      {...(Tag === 'button' ? { type: 'button' } : {})}
      {...p}
      className={`inline-flex items-center justify-center gap-2 rounded-xl font-bold uppercase tracking-[0.15em] transition-all disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${sizes[size]} ${className}`}
    />
  );
}

export const Card = ({ className = '', ...p }) => (
  <div {...p} className={`rounded-[1.5rem] border border-borde bg-white p-5 md:p-6 ${className}`} />
);

export const Spinner = ({ className = '' }) => <Loader2 className={`animate-spin text-salvia ${className}`} size={20} />;

export const PageLoader = () => (
  <div className="flex min-h-[40vh] items-center justify-center">
    <Spinner />
  </div>
);

export const Eyebrow = ({ children, className = '' }) => (
  <p className={`text-[10px] font-bold uppercase ls-xl text-salvia ${className}`}>{children}</p>
);

// ---------- Avisos ----------
const ToastCtx = createContext(() => {});
export const useToast = () => useContext(ToastCtx);

export function ToastProvider({ children }) {
  const [t, setT] = useState(null);
  const timer = useRef();
  const toast = useCallback((msg, type = 'ok') => {
    setT({ msg, type });
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setT(null), 3500);
  }, []);
  return (
    <ToastCtx.Provider value={toast}>
      {children}
      {t && (
        <div
          role="status"
          className={`fixed bottom-6 left-1/2 z-[300] max-w-[90vw] -translate-x-1/2 rounded-full px-6 py-3 text-xs font-medium text-white shadow-xl ${
            t.type === 'error' ? 'bg-red-600' : 'bg-bosque'
          }`}
        >
          {t.msg}
        </div>
      )}
    </ToastCtx.Provider>
  );
}

// ---------- Subir imagen (se comprime y se guarda en la base de datos) ----------
export function ImageUpload({ value, onChange, keepAlpha = false, max = 1000, label = 'Subir imagen', className = '' }) {
  const ref = useRef();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  const pick = async (e) => {
    const f = e.target.files?.[0];
    e.target.value = '';
    if (!f) return;
    setBusy(true);
    setErr('');
    try {
      onChange(await compressImage(f, { max, keepAlpha }));
    } catch (x) {
      setErr(x.message);
    }
    setBusy(false);
  };

  return (
    <div className={className}>
      <div className="flex items-center gap-4">
        <div className="flex h-24 w-24 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl border border-borde bg-[repeating-conic-gradient(#f1efea_0%_25%,#fff_0%_50%)] bg-[length:16px_16px]">
          {value ? <img src={value} alt="" className="h-full w-full object-contain" /> : <ImagePlus className="text-salvia/50" />}
        </div>
        <div>
          <Btn variant="soft" size="sm" onClick={() => ref.current?.click()} disabled={busy}>
            {busy ? <Loader2 size={14} className="animate-spin" /> : <ImagePlus size={14} />} {value ? 'Cambiar' : label}
          </Btn>
          {err && <p className="mt-2 text-xs text-red-600">{err}</p>}
        </div>
      </div>
      <input ref={ref} type="file" accept="image/*" hidden onChange={pick} />
    </div>
  );
}

// ---------- Lista editable (agregar, subir, bajar, borrar) ----------
export function ListEditor({ items, onChange, render, blank, addLabel = 'Agregar', itemLabel }) {
  const move = (i, d) => {
    const a = [...items];
    const j = i + d;
    if (j < 0 || j >= a.length) return;
    [a[i], a[j]] = [a[j], a[i]];
    onChange(a);
  };
  const upd = (i, patch) => onChange(items.map((it, k) => (k === i ? { ...it, ...patch } : it)));
  const del = (i) => onChange(items.filter((_, k) => k !== i));
  const icon = 'rounded-lg p-1.5 text-musgo hover:bg-crema disabled:opacity-30';

  return (
    <div className="space-y-3">
      {items.map((it, i) => (
        <div key={i} className="rounded-2xl border border-borde bg-crema/60 p-4">
          <div className="mb-3 flex items-center justify-between gap-2">
            <span className="truncate text-[10px] font-bold uppercase tracking-widest text-bosque">
              {itemLabel ? itemLabel(it, i) : `#${i + 1}`}
            </span>
            <div className="flex flex-shrink-0">
              <button type="button" className={icon} onClick={() => move(i, -1)} disabled={i === 0} aria-label="Subir">
                <ArrowUp size={15} />
              </button>
              <button type="button" className={icon} onClick={() => move(i, 1)} disabled={i === items.length - 1} aria-label="Bajar">
                <ArrowDown size={15} />
              </button>
              <button
                type="button"
                className={`${icon} hover:text-red-600!`}
                onClick={() => window.confirm('¿Eliminar este elemento?') && del(i)}
                aria-label="Eliminar"
              >
                <Trash2 size={15} />
              </button>
            </div>
          </div>
          {render(it, (patch) => upd(i, patch), i)}
        </div>
      ))}
      <Btn variant="soft" size="sm" onClick={() => onChange([...items, typeof blank === 'function' ? blank() : { ...blank }])}>
        <Plus size={14} /> {addLabel}
      </Btn>
    </div>
  );
}

import { useEffect, useMemo, useState } from 'react';
import { backend } from './data';
import { DEFAULT_SITE, DEFAULT_LOGO, DEFAULT_FOTO, DEFAULT_CASOS } from './defaults';

export function useDoc(path) {
  const [s, setS] = useState({ data: null, loading: !!path, error: null });
  useEffect(() => {
    if (!path) {
      setS({ data: null, loading: false, error: null });
      return;
    }
    setS((p) => ({ ...p, loading: true }));
    return backend.watchDoc(path, (data, error) => setS({ data, loading: false, error: error || null }));
  }, [path]);
  return s;
}

export function useCol(path) {
  const [s, setS] = useState({ items: [], loading: !!path, error: null });
  useEffect(() => {
    if (!path) {
      setS({ items: [], loading: false, error: null });
      return;
    }
    setS((p) => ({ ...p, loading: true }));
    return backend.watchCol(path, (items, error) => setS({ items, loading: false, error: error || null }));
  }, [path]);
  return s;
}

// Contenido público del sitio (textos + logo + foto), con valores por defecto
export function useSite() {
  const main = useDoc('site/main');
  const logo = useDoc('media/logo');
  const foto = useDoc('media/foto');
  return {
    site: { ...DEFAULT_SITE, ...(main.data || {}) },
    stored: main.data,
    logo: logo.data?.data || DEFAULT_LOGO,
    foto: foto.data?.data || DEFAULT_FOTO,
    hasCustomLogo: !!logo.data?.data,
    hasCustomFoto: !!foto.data?.data,
    loading: main.loading,
  };
}

export const byOrden = (a, b) => (a.orden ?? 0) - (b.orden ?? 0);

// Casos de éxito visibles. Si aún no ha subido/importado ninguno, se muestran los iniciales de la versión Gemini.
export function useCasos() {
  const col = useCol('casos');
  const { site } = useSite();
  return useMemo(() => {
    const visibles = col.items.filter((c) => c.visible !== false).sort(byOrden);
    if (visibles.length || col.items.length) return visibles;
    return site.casosInicializados ? [] : DEFAULT_CASOS;
  }, [col.items, site.casosInicializados]);
}

// Zona de precios: 've' (Venezuela) u 'resto'. Se detecta por IP (Netlify) con respaldo por zona horaria,
// y la persona puede cambiarla a mano.
export function useZona() {
  const guardada = () => { try { return sessionStorage.getItem('zona'); } catch { return null; } };
  const porHora = () => {
    try { return Intl.DateTimeFormat().resolvedOptions().timeZone === 'America/Caracas' ? 've' : 'resto'; } catch { return 'resto'; }
  };
  const [zona, setZonaState] = useState(() => guardada() || porHora());

  const setZona = (z) => {
    setZonaState(z);
    try { sessionStorage.setItem('zona', z); } catch {}
  };

  useEffect(() => {
    if (guardada()) return;
    const ctl = new AbortController();
    const t = setTimeout(() => ctl.abort(), 4000);
    fetch('/api/geo', { signal: ctl.signal, cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : null))
      .then((j) => {
        if (j?.country) setZona(j.country === 'VE' ? 've' : 'resto');
      })
      .catch(() => {})
      .finally(() => clearTimeout(t));
    return () => { clearTimeout(t); ctl.abort(); };
  }, []);

  return [zona, setZona];
}

import { useEffect, useState } from 'react';
import { backend } from './data';
import { DEFAULT_SITE, DEFAULT_LOGO, DEFAULT_FOTO } from './defaults';

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

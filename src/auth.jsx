import { createContext, useContext, useEffect, useState } from 'react';
import { backend } from './data';
import { ADMIN_EMAIL } from './config';

const AuthCtx = createContext({ user: null, loading: true, isAdmin: false });

export function AuthProvider({ children }) {
  const [state, setState] = useState({ user: null, loading: true });

  useEffect(() => backend.onAuth((user) => setState({ user, loading: false })), []);

  const isAdmin = !!state.user && (state.user.email || '').toLowerCase() === ADMIN_EMAIL.toLowerCase();
  return <AuthCtx.Provider value={{ ...state, isAdmin }}>{children}</AuthCtx.Provider>;
}

export const useAuth = () => useContext(AuthCtx);

export const authErrorMsg = (e) => {
  const code = e?.code || '';
  if (code.includes('invalid-credential') || code.includes('wrong-password') || code.includes('user-not-found'))
    return 'Correo o contraseña incorrectos.';
  if (code.includes('invalid-email')) return 'El correo no es válido.';
  if (code.includes('too-many-requests')) return 'Demasiados intentos. Espera unos minutos e inténtalo de nuevo.';
  if (code.includes('network')) return 'Sin conexión. Revisa tu internet.';
  if (code.includes('email-already-in-use')) return 'Ya existe una cuenta con ese correo.';
  if (code.includes('weak-password')) return 'La contraseña debe tener al menos 6 caracteres.';
  if (code.includes('permission-denied')) return 'Sin permisos. Revisa que las reglas de Firestore estén publicadas (ver guía).';
  return e?.message || 'Ocurrió un error. Inténtalo de nuevo.';
};

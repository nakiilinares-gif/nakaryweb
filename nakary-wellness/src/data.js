import { hasFirebase } from './config';
import { demoBackend } from './demoBackend';
import { createFirebaseBackend } from './firebaseBackend';

// Un solo punto de acceso a los datos: Firebase si está configurado, demo si no.
export const backend = hasFirebase ? createFirebaseBackend() : demoBackend;

import { initializeApp, deleteApp } from 'firebase/app';
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  createUserWithEmailAndPassword,
} from 'firebase/auth';
import { getFirestore, doc, collection, onSnapshot, setDoc, addDoc, deleteDoc } from 'firebase/firestore';
import { FIREBASE_CONFIG } from './config';

export function createFirebaseBackend() {
  const app = initializeApp(FIREBASE_CONFIG);
  const auth = getAuth(app);
  const db = getFirestore(app);

  return {
    mode: 'firebase',

    onAuth: (cb) => onAuthStateChanged(auth, (u) => cb(u ? { uid: u.uid, email: u.email } : null)),
    signIn: (email, pass) => signInWithEmailAndPassword(auth, email, pass),
    signOut: () => signOut(auth),
    resetPassword: (email) => sendPasswordResetEmail(auth, email),

    // Crea la cuenta de una clienta sin cerrar tu sesión (usa una app secundaria temporal)
    async createUser(email, pass) {
      const second = initializeApp(FIREBASE_CONFIG, 'secundaria-' + Date.now());
      try {
        const a = getAuth(second);
        const cred = await createUserWithEmailAndPassword(a, email, pass);
        await signOut(a);
        return cred.user.uid;
      } finally {
        await deleteApp(second).catch(() => {});
      }
    },

    watchDoc(path, cb) {
      return onSnapshot(
        doc(db, path),
        (s) => cb(s.exists() ? { id: s.id, ...s.data() } : null),
        (err) => {
          console.error('Firestore', path, err);
          cb(null, err);
        }
      );
    },
    watchCol(path, cb) {
      return onSnapshot(
        collection(db, path),
        (s) => cb(s.docs.map((d) => ({ id: d.id, ...d.data() }))),
        (err) => {
          console.error('Firestore', path, err);
          cb([], err);
        }
      );
    },
    setDoc: (path, data, merge = true) => setDoc(doc(db, path), data, { merge }),
    addDoc: async (path, data) => (await addDoc(collection(db, path), data)).id,
    deleteDoc: (path) => deleteDoc(doc(db, path)),
  };
}

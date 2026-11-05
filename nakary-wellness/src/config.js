const c = (typeof window !== 'undefined' && window.NAKARY_CONFIG) || {};

export const FIREBASE_CONFIG = c.firebase || {};
export const hasFirebase = !!(FIREBASE_CONFIG.apiKey && FIREBASE_CONFIG.projectId);

// En modo demo el "admin" es admin@demo.com; en producción, el correo de config.js
export const ADMIN_EMAIL = hasFirebase ? (c.adminEmail || 'nakiilinares@gmail.com') : 'admin@demo.com';

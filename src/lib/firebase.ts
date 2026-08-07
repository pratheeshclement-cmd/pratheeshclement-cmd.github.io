// ─── Pratheesh OS: Centralized Firebase Client ────────────────────────────
// Initialized using live credentials from environment variables (VITE_FIREBASE_*)

import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getFirestore, doc, getDoc, setDoc, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import { getAnalytics, isSupported, Analytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY            || "",
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN        || "pratheesh-os.firebaseapp.com",
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID         || "pratheesh-os",
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET     || "pratheesh-os.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "880640506228",
  appId:             import.meta.env.VITE_FIREBASE_APP_ID             || "1:880640506228:web:66ffacc18deebf3c729421",
  measurementId:     import.meta.env.VITE_FIREBASE_MEASUREMENT_ID     || "G-NF0P9LECTF",
};

let app: FirebaseApp;
let db: Firestore;
let auth: Auth;
let storage: FirebaseStorage;
let analytics: Analytics | null = null;
let initError: string | null = null;

try {
  app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  db = getFirestore(app);
  auth = getAuth(app);
  storage = getStorage(app);

  if (typeof window !== 'undefined') {
    isSupported().then(supported => {
      if (supported) {
        analytics = getAnalytics(app);
      }
    }).catch(() => {
      // Analytics non-critical error swallowed gracefully
    });
  }
  console.log('[Pratheesh OS] Firebase Web SDK initialized successfully for project:', firebaseConfig.projectId);
} catch (e: any) {
  initError = e?.message || 'Firebase Connection Failed';
  console.error('[Pratheesh OS Error] Firebase initialization failed:', initError);
  // Fallbacks to prevent React runtime crash
  app = (getApps().length ? getApp() : null) as any;
  db = null as any;
  auth = null as any;
  storage = null as any;
}

export { app, db, auth, storage, analytics, initError };

export interface ConnectionStatus {
  connected: boolean;
  firestore: boolean;
  auth: boolean;
  storage: boolean;
  error?: string;
}

export async function checkFirebaseConnection(): Promise<ConnectionStatus> {
  if (initError || !db) {
    return {
      connected: false,
      firestore: false,
      auth: false,
      storage: false,
      error: initError || 'Firebase Web SDK not initialized',
    };
  }

  try {
    const sysDocRef = doc(db, 'system', 'status');
    const snap = await getDoc(sysDocRef);

    if (!snap.exists()) {
      await setDoc(sysDocRef, {
        initializedAt: new Date().toISOString(),
        site: 'pratheeshclement-cmd.github.io',
        status: 'healthy',
        version: '2.4.0-PratheeshOS',
      });
    }

    return {
      connected: true,
      firestore: true,
      auth: true,
      storage: true,
    };
  } catch (e: any) {
    console.warn('[Pratheesh OS] Firebase check error:', e.message);
    return {
      connected: true, // App initialized, Firestore read/write network fallback
      firestore: false,
      auth: !!auth,
      storage: !!storage,
      error: e.message,
    };
  }
}

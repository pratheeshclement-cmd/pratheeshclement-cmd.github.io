// ─── DMOS Backend: Firebase Admin SDK Config ──────────────────────────────

import * as admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();

let db: admin.firestore.Firestore | null = null;
let storage: admin.storage.Storage | null = null;
let adminAuth: admin.auth.Auth | null = null;

try {
  if (!admin.apps.length) {
    const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;

    if (serviceAccountJson) {
      const serviceAccount = JSON.parse(serviceAccountJson);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET || 'pratheesh-os.firebasestorage.app',
      });
    } else {
      admin.initializeApp({
        projectId: process.env.FIREBASE_PROJECT_ID || 'pratheesh-os',
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET || 'pratheesh-os.firebasestorage.app',
      });
    }
  }

  db = admin.firestore();
  db.settings({ ignoreUndefinedProperties: true });
  storage = admin.storage();
  adminAuth = admin.auth();
  console.log('[DMOS Backend] Firebase Admin SDK initialized with ignoreUndefinedProperties.');
} catch (e) {
  console.warn('[DMOS Backend] Firebase Admin SDK running in offline mode:', e);
}

export { admin, db, storage, adminAuth, db as adminDb };

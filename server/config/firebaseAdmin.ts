// ─── DMOS Backend: Firebase Admin SDK Config ──────────────────────────────

import * as admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();

let db: admin.firestore.Firestore | null = null;
let storage: admin.storage.Storage | null = null;
let adminAuth: admin.auth.Auth | null = null;

try {
  const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;

  if (serviceAccountJson && serviceAccountJson.trim().length > 0) {
    if (!admin.apps.length) {
      const serviceAccount = JSON.parse(serviceAccountJson);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET || 'pratheesh-os.firebasestorage.app',
      });
    }
    db = admin.firestore();
    db.settings({ ignoreUndefinedProperties: true });
    storage = admin.storage();
    adminAuth = admin.auth();
    console.log('[DMOS Backend] Firebase Admin SDK initialized with Service Account Credentials.');
  } else {
    console.log('[DMOS Backend] FIREBASE_SERVICE_ACCOUNT_JSON unconfigured. Running in Admin Auth mock mode.');
  }
} catch (e: any) {
  console.warn('[DMOS Backend] Firebase Admin SDK initialization notice:', e.message);
}

export { admin, db, storage, adminAuth, db as adminDb };

// ─── Integration Service: Firebase Firestore & Auth ─────────────────────────
// Real health verification & telemetry for Firebase Admin SDK, Auth, and Firestore.

import { db, adminAuth, storage } from '../../config/firebaseAdmin';
import { ProviderHealthResult } from './integrationTypes';

export interface FirebaseHealthDetails {
  configured: boolean;
  authConnected: boolean;
  firestoreConnected: boolean;
  storageConnected: boolean;
  projectId: string;
  storageBucket: string;
  collectionsCount: number;
  usersCount?: number;
  latencyMs: number;
  status: string;
  message: string;
}

export class FirebaseIntegrationService {
  public static async verify(): Promise<ProviderHealthResult> {
    const start = Date.now();
    const projectId = process.env.FIREBASE_PROJECT_ID || 'pratheesh-os';

    try {
      let firestoreOk = false;
      let collectionsCount = 0;

      if (db) {
        const collections = await db.listCollections();
        collectionsCount = collections.length;
        firestoreOk = true;
      }

      let authOk = false;
      if (adminAuth) {
        await adminAuth.listUsers(1);
        authOk = true;
      }

      const latencyMs = Math.max(1, Date.now() - start);

      return {
        id: 'firebase',
        name: 'Firebase Firestore & Auth',
        category: 'Database',
        status: firestoreOk ? 'connected' : 'error',
        latencyMs,
        lastCheckedAt: new Date().toISOString(),
        apiVersion: 'v10.12',
        docsUrl: 'https://firebase.google.com/docs',
        message: `Firebase Admin SDK active for project: ${projectId} (${collectionsCount} collections accessible).`,
        configured: true,
        metadata: {
          projectId,
          firestoreOk,
          authOk,
          collectionsCount,
        },
      };
    } catch (err: any) {
      const latencyMs = Math.max(1, Date.now() - start);
      return {
        id: 'firebase',
        name: 'Firebase Firestore & Auth',
        category: 'Database',
        status: 'error',
        latencyMs,
        lastCheckedAt: new Date().toISOString(),
        apiVersion: 'v10.12',
        docsUrl: 'https://firebase.google.com/docs',
        message: `Firebase Admin SDK Error: ${err.message}`,
        configured: false,
      };
    }
  }

  public static async getHealthDetails(): Promise<FirebaseHealthDetails> {
    const start = Date.now();
    const projectId = process.env.FIREBASE_PROJECT_ID || 'pratheesh-os';
    const storageBucket = process.env.FIREBASE_STORAGE_BUCKET || 'pratheesh-os.firebasestorage.app';

    let firestoreConnected = false;
    let authConnected = false;
    let storageConnected = Boolean(storage);
    let collectionsCount = 0;
    let usersCount = 0;

    try {
      if (db) {
        const collections = await db.listCollections();
        collectionsCount = collections.length;
        firestoreConnected = true;
      }

      if (adminAuth) {
        const listRes = await adminAuth.listUsers(10);
        usersCount = listRes.users.length;
        authConnected = true;
      }
    } catch (e: any) {
      console.warn('[FirebaseIntegrationService] Health check notice:', e.message);
    }

    const latencyMs = Math.max(1, Date.now() - start);

    return {
      configured: true,
      authConnected,
      firestoreConnected,
      storageConnected,
      projectId,
      storageBucket,
      collectionsCount,
      usersCount,
      latencyMs,
      status: firestoreConnected ? 'connected' : 'error',
      message: firestoreConnected ? 'Firebase services operational' : 'Firestore unavailable',
    };
  }
}

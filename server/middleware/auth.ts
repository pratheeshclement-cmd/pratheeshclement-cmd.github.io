// ─── DMOS Backend: Authentication & RBAC Authorization Middleware ─────────────
// Real Firebase Admin SDK token verification, UID resolution, & permission enforcement.

import { Request, Response, NextFunction } from 'express';
import { adminAuth, db } from '../config/firebaseAdmin';
import { normalizeRole, isAdminLevel, hasPermission, UserRole, Permission } from './rbac';

export interface AuthenticatedRequest extends Request {
  user?: {
    uid: string;
    email?: string;
    role: UserRole;
  };
}

// Authenticates Firebase Bearer ID Token and resolves canonical user role
export async function authenticateToken(req: AuthenticatedRequest, res: Response): Promise<boolean> {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Authentication required. No Bearer token provided.' });
    return false;
  }

  const token = authHeader.split('Bearer ')[1];

  if (!adminAuth) {
    res.status(503).json({ error: 'Server-side Firebase Admin authentication is not configured.' });
    return false;
  }

  try {
    const decodedToken = await adminAuth.verifyIdToken(token);
    const uid = decodedToken.uid;
    let rawRole: string | undefined = (decodedToken.role as string | undefined);

    // Always resolve canonical role from Firestore user document users/{uid}
    if (db) {
      try {
        const userDoc = await db.collection('users').doc(uid).get();
        if (userDoc.exists) {
          const firestoreRole = userDoc.data()?.role as string | undefined;
          if (firestoreRole) {
            rawRole = firestoreRole;
          }
        }
      } catch (fetchErr: any) {
        console.warn('[auth] Failed to load user profile from Firestore:', fetchErr.message);
      }
    }

    const canonicalRole = normalizeRole(rawRole);

    // Sync custom claims asynchronously if missing or different from canonical role
    if (adminAuth && decodedToken.role !== canonicalRole) {
      adminAuth.setCustomUserClaims(uid, { role: canonicalRole }).catch(() => {});
    }

    req.user = {
      uid,
      email: decodedToken.email,
      role: canonicalRole,
    };

    return true;
  } catch (err: any) {
    console.error('[auth] Token verification failed:', err.message);
    res.status(401).json({ error: 'Invalid or expired authentication token.' });
    return false;
  }
}

// Require Admin Level (Owner or Administrator)
export async function requireAdminAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authenticated = await authenticateToken(req, res);
  if (!authenticated) return;

  if (!req.user || !isAdminLevel(req.user.role)) {
    console.warn(`[requireAdminAuth] Forbidden access attempt by UID: ${req.user?.uid}, Role: ${req.user?.role}`);
    return res.status(403).json({ error: 'Forbidden. Admin role required.' });
  }

  next();
}

// Require Specific Permission (e.g. 'users.create', 'roles.assign', 'settings.manage')
export function requirePermission(permission: Permission) {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const authenticated = await authenticateToken(req, res);
    if (!authenticated) return;

    if (!req.user || !hasPermission(req.user.role, permission)) {
      console.warn(`[requirePermission] Permission denied (${permission}) for UID: ${req.user?.uid}, Role: ${req.user?.role}`);
      return res.status(403).json({ error: `Forbidden. Required permission '${permission}' is missing.` });
    }

    next();
  };
}

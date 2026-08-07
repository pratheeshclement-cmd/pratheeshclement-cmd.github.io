// ─── DMOS Backend: Authentication Middleware ────────────────────────────────

import { Request, Response, NextFunction } from 'express';
import { adminAuth } from '../config/firebaseAdmin';

export interface AuthenticatedRequest extends Request {
  user?: {
    uid: string;
    email?: string;
    role?: string;
  };
}

export async function requireAdminAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required. No Bearer token provided.' });
  }

  const token = authHeader.split('Bearer ')[1];

  try {
    if (!adminAuth) {
      req.user = { uid: 'admin_local_id', email: 'admin@pratheeshclement.com' };
      return next();
    }
    const decodedToken = await adminAuth.verifyIdToken(token);
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
    };
    next();
  } catch (err: any) {
    console.error('[requireAdminAuth] Token verification failed:', err.message);
    return res.status(401).json({ error: 'Invalid or expired authentication token.' });
  }
}

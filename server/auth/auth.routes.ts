// ─── DMOS Backend: Auth Routes (Google OAuth 2.0 & Firebase Sync) ──────────

import { Router, Request, Response } from 'express';
import { getGoogleAuthUrl, googleConfig } from '../config/google';
import { GoogleOAuthStrategy } from './google.strategy';
import { requireAdminAuth, AuthenticatedRequest } from '../middleware/auth';

export const authRouter = Router();

// 1. GET /auth/google — Initiate OAuth Flow
authRouter.get('/google', (req: Request, res: Response) => {
  console.log('[AuthRouter] Redirecting to Google OAuth Authorization URL...');
  const authUrl = getGoogleAuthUrl();
  res.redirect(authUrl);
});

// 2. GET /auth/google/callback — Handle OAuth Callback
authRouter.get('/google/callback', async (req: Request, res: Response) => {
  const code = req.query.code as string;
  const error = req.query.error as string;

  if (error || !code) {
    console.error('[AuthRouter] Google OAuth Callback error:', error);
    return res.redirect(`${googleConfig.frontendUrl}/admin/login?error=${encodeURIComponent(error || 'OAuth verification failed')}`);
  }

  try {
    const profile = await GoogleOAuthStrategy.verifyAuthorizationCode(code);
    const syncResult = await GoogleOAuthStrategy.syncFirebaseAdminUser(profile);

    console.log('[AuthRouter] Google OAuth callback SUCCESS. Custom token generated for UID:', syncResult.uid);

    // Redirect to frontend admin panel with custom token payload
    const redirectUrl = `${googleConfig.frontendUrl}/admin/login?customToken=${encodeURIComponent(syncResult.customToken)}&email=${encodeURIComponent(syncResult.email || '')}`;
    res.redirect(redirectUrl);
  } catch (err: any) {
    console.error('[AuthRouter] Callback processing exception:', err.message);
    res.redirect(`${googleConfig.frontendUrl}/admin/login?error=${encodeURIComponent(err.message)}`);
  }
});

// 3. POST /auth/google/verify-token — Direct Google Token Verification API
authRouter.post('/google/verify-token', async (req: Request, res: Response) => {
  const { code, idToken } = req.body;
  try {
    let profile;
    if (code) {
      profile = await GoogleOAuthStrategy.verifyAuthorizationCode(code);
    } else {
      return res.status(400).json({ error: 'Missing code in request body' });
    }

    const syncResult = await GoogleOAuthStrategy.syncFirebaseAdminUser(profile);
    res.json(syncResult);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 4. GET /auth/me — Current User Profile
authRouter.get('/me', requireAdminAuth, (req: AuthenticatedRequest, res: Response) => {
  res.json({
    user: req.user,
    status: 'authenticated',
  });
});

// 5. POST /auth/logout — Sign Out Session
authRouter.post('/logout', (req: Request, res: Response) => {
  res.json({ success: true, message: 'Logged out successfully' });
});

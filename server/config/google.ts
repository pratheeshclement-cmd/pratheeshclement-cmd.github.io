// ─── DMOS Backend: Google OAuth 2.0 Configuration ───────────────────────────

import { OAuth2Client } from 'google-auth-library';
import dotenv from 'dotenv';

dotenv.config();

export const googleConfig = {
  clientId: process.env.GOOGLE_CLIENT_ID || '1023264006959-7nhf77b0djtn79g8htu322pu9e2qecc7.apps.googleusercontent.com',
  clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
  callbackUrl: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:5000/auth/google/callback',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5174',
};

export const oauth2Client = new OAuth2Client(
  googleConfig.clientId,
  googleConfig.clientSecret,
  googleConfig.callbackUrl
);

export function getGoogleAuthUrl(): string {
  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email',
    ],
    prompt: 'consent',
  });
}

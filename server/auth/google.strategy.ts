// ─── DMOS Backend: Google OAuth 2.0 Strategy ────────────────────────────────

import { oauth2Client, googleConfig } from '../config/google';
import { adminAuth, adminDb } from '../config/firebaseAdmin';

export interface GoogleProfile {
  sub: string;
  email: string;
  name: string;
  picture?: string;
}

export class GoogleOAuthStrategy {
  public static async verifyAuthorizationCode(code: string): Promise<GoogleProfile> {
    console.log('[GoogleOAuthStrategy] Exchanging authorization code for tokens...');
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    if (!tokens.id_token) {
      throw new Error('No id_token received from Google OAuth exchange.');
    }

    const ticket = await oauth2Client.verifyIdToken({
      idToken: tokens.id_token,
      audience: googleConfig.clientId,
    });

    const payload = ticket.getPayload();
    if (!payload || !payload.email) {
      throw new Error('Invalid Google OAuth token payload.');
    }

    return {
      sub: payload.sub,
      email: payload.email,
      name: payload.name || payload.email.split('@')[0],
      picture: payload.picture,
    };
  }

  public static async syncFirebaseAdminUser(profile: GoogleProfile) {
    console.log('[GoogleOAuthStrategy] Syncing user profile in Firebase Auth & Firestore:', profile.email);
    let uid = `google_${profile.sub.substring(0, 10)}`;
    let customToken = `mock_custom_token_${uid}`;

    if (adminAuth) {
      try {
        const firebaseUser = await adminAuth.getUserByEmail(profile.email);
        uid = firebaseUser.uid;
        console.log('[GoogleOAuthStrategy] Existing Firebase Auth user found UID:', uid);
      } catch (e: any) {
        console.log('[GoogleOAuthStrategy] Creating new Firebase Auth user for:', profile.email);
        const firebaseUser = await adminAuth.createUser({
          email: profile.email,
          emailVerified: true,
          displayName: profile.name,
          photoURL: profile.picture,
        });
        uid = firebaseUser.uid;
      }

      customToken = await adminAuth.createCustomToken(uid);
    }

    const now = new Date().toISOString();
    let role = 'Owner';
    let status = 'active';

    if (adminDb) {
      const userDocRef = adminDb.collection('users').doc(uid);
      const docSnap = await userDocRef.get();

      if (docSnap.exists) {
        role = docSnap.data()?.role || 'Owner';
        status = docSnap.data()?.status || 'active';
        await userDocRef.update({
          lastLogin: now,
          provider: 'google',
          photoURL: profile.picture || null,
          displayName: profile.name,
        });
      } else {
        await userDocRef.set({
          uid,
          email: profile.email,
          displayName: profile.name,
          photoURL: profile.picture || null,
          provider: 'google',
          role: 'Owner',
          status: 'active',
          createdAt: now,
          lastLogin: now,
        });
      }
    }

    return {
      uid,
      email: profile.email,
      displayName: profile.name,
      photoURL: profile.picture || null,
      role,
      status,
      customToken,
    };
  }
}

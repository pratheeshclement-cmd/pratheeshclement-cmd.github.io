// ─── DMOS Enterprise Auth Provider: Email/Password + Google OAuth 2.0 ───────

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  signInWithCustomToken,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../../lib/firebase';

export type UserRole =
  | 'Owner'
  | 'Administrator'
  | 'Editor'
  | 'SEO Manager'
  | 'Marketing'
  | 'CRM Executive'
  | 'Content Writer'
  | 'Viewer';

export interface DMOSUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  role: UserRole;
  provider: 'password' | 'google';
  permissions?: string[];
  status?: 'active' | 'suspended';
  lastLogin?: string;
}

interface AuthContextType {
  user: DMOSUser | null;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<boolean>;
  loginWithGoogle: () => Promise<boolean>;
  logout: () => Promise<void>;
  authError: string | null;
  error: string | null;
  hasPermission: (permission: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<DMOSUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  const syncUserProfile = async (fbUser: FirebaseUser, providerType: 'password' | 'google'): Promise<DMOSUser | null> => {
    let role: UserRole = 'Owner';
    let status: 'active' | 'suspended' = 'active';

    if (db) {
      try {
        const userRef = doc(db, 'users', fbUser.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const data = userSnap.data();
          role = (data.role as UserRole) || 'Owner';
          status = data.status || 'active';

          await setDoc(userRef, {
            lastLogin: new Date().toISOString(),
            provider: providerType,
            photoURL: fbUser.photoURL || null,
          }, { merge: true });
        } else {
          // Initialize new admin profile in Firestore
          await setDoc(userRef, {
            uid: fbUser.uid,
            email: fbUser.email,
            displayName: fbUser.displayName || (fbUser.email ? fbUser.email.split('@')[0] : 'Admin User'),
            photoURL: fbUser.photoURL || null,
            provider: providerType,
            role: 'Owner',
            status: 'active',
            createdAt: new Date().toISOString(),
            lastLogin: new Date().toISOString(),
          });
        }
      } catch (e: any) {
        console.warn('[AuthProvider] Firestore user profile sync warning:', e.message);
      }
    }

    if (status === 'suspended') {
      console.warn('[AuthProvider] Account is suspended.');
      setAuthError('Account suspended. Please contact the Owner.');
      await firebaseSignOut(auth);
      return null;
    }

    return {
      uid: fbUser.uid,
      email: fbUser.email,
      displayName: fbUser.displayName || (fbUser.email ? fbUser.email.split('@')[0] : 'Admin User'),
      photoURL: fbUser.photoURL,
      role,
      provider: providerType,
      status,
      lastLogin: new Date().toISOString(),
    };
  };

  useEffect(() => {
    console.log('[AuthProvider] Initializing Dual Auth Listener...');
    if (!auth) {
      setIsLoading(false);
      return;
    }

    // Check for customToken in URL (from Express Google OAuth callback redirect)
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const customToken = urlParams.get('customToken');
      const err = urlParams.get('error');

      if (err) {
        setAuthError(decodeURIComponent(err));
      }

      if (customToken) {
        console.log('[AuthProvider] Express Google OAuth customToken detected. Signing in...');
        signInWithCustomToken(auth, customToken)
          .then(() => {
            window.history.replaceState({}, document.title, window.location.pathname);
          })
          .catch((e: any) => {
            console.error('[AuthProvider] Custom token sign-in error:', e.message);
          });
      }
    }

    const unsubscribe = onAuthStateChanged(auth, async (fbUser: FirebaseUser | null) => {
      console.log('[AuthProvider] onAuthStateChanged fired. User:', fbUser ? fbUser.email : 'NULL');

      if (fbUser) {
        const providerId = fbUser.providerData?.[0]?.providerId === 'google.com' ? 'google' : 'password';
        const dmosUser = await syncUserProfile(fbUser, providerId);
        setUser(dmosUser);
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, pass: string): Promise<boolean> => {
    setAuthError(null);
    if (!auth) {
      setAuthError('Firebase Auth service unavailable');
      return false;
    }

    try {
      const cred = await signInWithEmailAndPassword(auth, email, pass);
      const dmosUser = await syncUserProfile(cred.user, 'password');
      setUser(dmosUser);
      return true;
    } catch (err: any) {
      setAuthError(err.message || 'Invalid email or password credentials');
      return false;
    }
  };

  const loginWithGoogle = async (): Promise<boolean> => {
    setAuthError(null);
    if (!auth) {
      setAuthError('Firebase Auth service unavailable');
      return false;
    }

    try {
      const googleProvider = new GoogleAuthProvider();
      googleProvider.setCustomParameters({ prompt: 'select_account' });
      const cred = await signInWithPopup(auth, googleProvider);
      const dmosUser = await syncUserProfile(cred.user, 'google');
      setUser(dmosUser);
      return true;
    } catch (err: any) {
      console.warn('[AuthProvider] Popup sign-in warning, redirecting to Express Google OAuth endpoint...', err.message);
      // Redirect to Express Google OAuth backend route if popup is blocked
      const apiBase = (import.meta.env.VITE_API_BASE_URL as string) || (import.meta.env.VITE_BACKEND_URL as string) || 'http://localhost:5000/api';
      const googleAuthUrl = apiBase.replace(/\/api\/?$/, '') + '/auth/google';
      window.location.href = googleAuthUrl;
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      if (auth) {
        await firebaseSignOut(auth);
      }
    } catch (e) {
    } finally {
      setUser(null);
    }
  };

  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    if (user.role === 'Owner' || user.role === 'Administrator') return true;
    if (user.role === 'Viewer') return permission.startsWith('read');
    return true;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        loginWithGoogle,
        logout,
        authError,
        error: authError,
        hasPermission,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

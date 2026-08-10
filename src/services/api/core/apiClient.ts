// ─── DMOS Centralized API Client ──────────────────────────────────────────────
// Unified HTTP request handler with Bearer Token, timeout, retry logic, & error handling

import { auth } from '../../../lib/firebase';

const BASE_URL = (import.meta.env.VITE_API_BASE_URL as string) || (import.meta.env.VITE_BACKEND_URL as string) || 'http://localhost:5000/api';
const DEFAULT_TIMEOUT_MS = 15000;

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp?: string;
}

export class ApiError extends Error {
  public status: number;
  constructor(message: string, status: number = 500) {
    super(message);
    this.status = status;
    this.name = 'ApiError';
  }
}

export async function apiClient<T>(
  endpoint: string,
  options: RequestInit & { timeoutMs?: number; retries?: number } = {}
): Promise<T> {
  const { timeoutMs = DEFAULT_TIMEOUT_MS, retries = 1, ...fetchOptions } = options;

  const url = endpoint.startsWith('http') ? endpoint : `${BASE_URL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;

  // Get Auth Token if logged in
  let token: string | null = null;
  if (auth?.currentUser) {
    try {
      token = await auth.currentUser.getIdToken();
    } catch (e) {
      console.warn('[ApiClient] Failed to get Auth token:', e);
    }
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(fetchOptions.headers as Record<string, string> || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  let attempt = 0;
  while (attempt <= retries) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(url, {
        ...fetchOptions,
        headers,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        let errMessage = `HTTP Error ${response.status}: ${response.statusText}`;
        try {
          const errData = await response.json();
          if (errData.error || errData.message) errMessage = errData.error || errData.message;
        } catch (_) {}

        // Controlled single retry on 403 Forbidden to refresh stale client ID token
        if (response.status === 403 && auth?.currentUser && attempt === 0) {
          try {
            console.log('[ApiClient] 403 received. Refreshing Firebase ID token once...');
            const refreshedToken = await auth.currentUser.getIdToken(true);
            headers['Authorization'] = `Bearer ${refreshedToken}`;
            attempt++;
            continue;
          } catch (refreshErr) {
            console.warn('[ApiClient] Forced token refresh failed:', refreshErr);
          }
        }

        throw new ApiError(errMessage, response.status);
      }


      const data = await response.json();
      return data as T;
    } catch (error: any) {
      clearTimeout(timeoutId);
      if (attempt === retries) {
        if (error.name === 'AbortError') {
          throw new ApiError(`Request timed out after ${timeoutMs}ms`, 504);
        }
        throw error instanceof ApiError ? error : new ApiError(error.message || 'Network request failed', 500);
      }
      attempt++;
      await new Promise(res => setTimeout(res, 500 * attempt));
    }
  }

  throw new ApiError('Unexpected client execution end', 500);
}

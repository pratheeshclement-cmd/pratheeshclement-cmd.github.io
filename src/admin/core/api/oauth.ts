// ─── DMOS API Gateway: OAuth & Token Engine ───────────────────────────────

export interface OAuthTokenState {
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: number;
  scopes?: string[];
}

const TOKEN_STORAGE_PREFIX = 'dmos_oauth_token_';

export function getStoredOAuthToken(providerId: string): OAuthTokenState | null {
  try {
    const raw = localStorage.getItem(TOKEN_STORAGE_PREFIX + providerId);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error(`Failed to parse OAuth token for ${providerId}`, e);
  }
  return null;
}

export function saveOAuthToken(providerId: string, token: OAuthTokenState): void {
  localStorage.setItem(TOKEN_STORAGE_PREFIX + providerId, JSON.stringify(token));
}

export function removeOAuthToken(providerId: string): void {
  localStorage.removeItem(TOKEN_STORAGE_PREFIX + providerId);
}

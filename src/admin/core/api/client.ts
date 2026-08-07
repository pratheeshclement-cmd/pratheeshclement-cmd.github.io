// ─── DMOS API Gateway: Base Gateway Client ────────────────────────────────

import { applyRequestInterceptors } from './interceptors';
import { withRetry } from './retry';
import { apiCache } from './cache';
import { ApiError, parseApiError } from './errors';

const BACKEND_BASE_URL = (import.meta.env.VITE_BACKEND_URL as string) || 'http://localhost:5000/api';

export interface ApiRequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: any;
  cacheTtlSeconds?: number;
  provider: string;
  skipCache?: boolean;
}

export class ApiGatewayClient {
  public async request<T>(endpoint: string, options: ApiRequestOptions): Promise<T> {
    const { method = 'GET', headers = {}, body, cacheTtlSeconds = 0, provider, skipCache = false } = options;

    const fullUrl = endpoint.startsWith('http') ? endpoint : `${BACKEND_BASE_URL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;
    const cacheKey = `${provider}:${method}:${fullUrl}:${JSON.stringify(body || {})}`;

    if (method === 'GET' && !skipCache && cacheTtlSeconds > 0) {
      const cached = apiCache.get<T>(cacheKey);
      if (cached !== null) return cached;
    }

    const intercepted = applyRequestInterceptors({ url: fullUrl, headers, provider });

    const fetchTask = async (): Promise<T> => {
      try {
        const response = await fetch(intercepted.url, {
          method,
          headers: intercepted.headers,
          body: body ? JSON.stringify(body) : undefined,
        });

        if (!response.ok) {
          const errorText = await response.text().catch(() => '');
          throw new ApiError(
            `API call to ${provider} failed (${response.status}): ${errorText || response.statusText}`,
            provider,
            response.status
          );
        }

        const data = await response.json().catch(() => ({} as T));

        if (method === 'GET' && cacheTtlSeconds > 0) {
          apiCache.set(cacheKey, data, cacheTtlSeconds);
        }

        return data;
      } catch (err: any) {
        throw parseApiError(err, provider);
      }
    };

    return withRetry(fetchTask, {}, provider);
  }
}

export const apiGateway = new ApiGatewayClient();

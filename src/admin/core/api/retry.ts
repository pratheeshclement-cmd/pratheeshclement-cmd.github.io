// ─── DMOS API Gateway: Exponential Backoff Retry ─────────────────────────

import { ApiError } from './errors';

export interface RetryOptions {
  maxRetries?: number;
  initialDelayMs?: number;
  backoffFactor?: number;
  retryOnStatus?: number[];
}

const DEFAULT_OPTIONS: Required<RetryOptions> = {
  maxRetries: 3,
  initialDelayMs: 500,
  backoffFactor: 2,
  retryOnStatus: [429, 500, 502, 503, 504],
};

export async function withRetry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {},
  provider: string = 'gateway'
): Promise<T> {
  const config = { ...DEFAULT_OPTIONS, ...options };
  let attempt = 0;
  let delay = config.initialDelayMs;

  while (true) {
    try {
      return await fn();
    } catch (error: any) {
      attempt++;

      const statusCode = error?.statusCode || error?.status || 500;
      const isRetryable = config.retryOnStatus.includes(statusCode) || error?.isNetworkError;

      if (attempt > config.maxRetries || !isRetryable) {
        throw error instanceof ApiError ? error : new ApiError(error.message || 'API call failed', provider, statusCode);
      }

      // Respect Rate Limit Reset header if present
      if (error?.rateLimitReset) {
        delay = Math.max(delay, error.rateLimitReset * 1000);
      } else {
        delay *= config.backoffFactor;
      }

      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}

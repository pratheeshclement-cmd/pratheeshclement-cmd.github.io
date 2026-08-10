import { Request, Response, NextFunction } from 'express';

type RateLimitEntry = {
  count: number;
  firstRequestAt: number;
};

type RateLimiterOptions = {
  windowMs: number;
  max: number;
  message?: string;
  statusCode?: number;
};

const rateLimitStore = new Map<string, RateLimitEntry>();

const cleanUpStore = () => {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (entry.firstRequestAt + 24 * 60 * 60 * 1000 < now) {
      rateLimitStore.delete(key);
    }
  }
};

setInterval(cleanUpStore, 60 * 1000);

const getClientKey = (req: Request): string => {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string' && forwarded.length > 0) {
    return forwarded.split(',')[0].trim();
  }

  if (Array.isArray(forwarded) && forwarded.length > 0) {
    return forwarded[0].split(',')[0].trim();
  }

  return req.ip || req.socket.remoteAddress || 'unknown';
};

export function createRateLimiter(options: RateLimiterOptions) {
  const { windowMs, max, message, statusCode = 429 } = options;

  return (req: Request, res: Response, next: NextFunction) => {
    const pathKey = req.originalUrl || (req.baseUrl ? req.baseUrl + req.path : req.path);
    const key = `${req.method}:${pathKey}:${getClientKey(req)}`;
    const now = Date.now();
    const existing = rateLimitStore.get(key);
    let reset = now + windowMs;
    let count = 1;

    if (!existing || existing.firstRequestAt + windowMs <= now) {
      rateLimitStore.set(key, { count: 1, firstRequestAt: now });
      count = 1;
    } else {
      existing.count += 1;
      count = existing.count;
      reset = existing.firstRequestAt + windowMs;
      rateLimitStore.set(key, existing);
    }

    const rawRemaining = max - count;
    const remaining = Math.max(0, rawRemaining);

    res.setHeader('X-RateLimit-Limit', max.toString());
    res.setHeader('X-RateLimit-Remaining', remaining.toString());
    res.setHeader('X-RateLimit-Reset', Math.ceil(reset / 1000).toString());
    res.setHeader('Retry-After', Math.ceil((reset - now) / 1000).toString());

    if (count > max) {
      return res.status(statusCode).json({
        success: false,
        error: message || 'Too many requests, please try again later.',
        retryAfterSeconds: Math.ceil((reset - now) / 1000),
      });
    }

    next();
  };
}


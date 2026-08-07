// ─── DMOS API Gateway: Cache Engine ──────────────────────────────────────

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttlMs: number;
}

class ApiCacheEngine {
  private memoryCache = new Map<string, CacheEntry<any>>();

  public set<T>(key: string, data: T, ttlSeconds: number = 300): void {
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      ttlMs: ttlSeconds * 1000,
    };
    this.memoryCache.set(key, entry);
  }

  public get<T>(key: string): T | null {
    const entry = this.memoryCache.get(key);
    if (!entry) return null;

    const isExpired = Date.now() - entry.timestamp > entry.ttlMs;
    if (isExpired) {
      this.memoryCache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  public clear(key?: string): void {
    if (key) {
      this.memoryCache.delete(key);
    } else {
      this.memoryCache.clear();
    }
  }
}

export const apiCache = new ApiCacheEngine();

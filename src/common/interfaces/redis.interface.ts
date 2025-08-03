export interface CacheOptions {
  ttl?: number;
  retryAttempts?: number;
  retryDelay?: number;
}

export interface CacheMetrics {
  hits: number;
  misses: number;
  errors: number;
}

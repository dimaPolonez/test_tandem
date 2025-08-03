export interface ICacheService {
  getPost(id: string): Promise<any | null>;
  setPost(id: string, data: any): Promise<boolean>;
  getPostsList(page: number, step: number): Promise<any | null>;
  setPostsList(page: number, step: number, data: any): Promise<boolean>;
  invalidatePost(id: string): Promise<void>;
  invalidatePostsList(): Promise<void>;
  invalidateAllPosts(): Promise<void>;
  getOrSetPost<T>(id: string, factory: () => Promise<T>): Promise<T>;
  getOrSetPostsList<T>(
    page: number,
    step: number,
    factory: () => Promise<T>,
  ): Promise<T>;
}

export interface ICacheMetrics {
  hits: number;
  misses: number;
  errors: number;
}

export interface ICacheOptions {
  ttl?: number;
  retryAttempts?: number;
  retryDelay?: number;
}

export interface ICacheConfig {
  defaultTtl: number;
  postTtl: number;
  listTtl: number;
  maxRetryAttempts: number;
  retryDelay: number;
}

import { Injectable, Inject, Logger } from '@nestjs/common';
import Redis from 'ioredis';
import {
  CacheOptions,
  CacheMetrics,
} from '../../../common/interfaces/redis.interface';

@Injectable()
export class RedisService {
  private readonly logger = new Logger(RedisService.name);
  private metrics: CacheMetrics = {
    hits: 0,
    misses: 0,
    errors: 0,
  };

  constructor(@Inject('REDIS_CLIENT') private readonly redis: Redis) {
    this.setupErrorHandling();
  }

  private setupErrorHandling(): void {
    this.redis.on('error', error => {
      this.logger.error('Redis connection error:', error);
      this.metrics.errors++;
    });

    this.redis.on('connect', () => {
      this.logger.log('Redis connected successfully');
    });
  }

  async get<T>(key: string, options: CacheOptions = {}): Promise<T | null> {
    const { retryAttempts = 3, retryDelay = 100 } = options;

    for (let attempt = 1; attempt <= retryAttempts; attempt++) {
      try {
        const value = await this.redis.get(key);

        if (value) {
          this.metrics.hits++;
          this.logger.debug(`Cache hit for key: ${key}`);
          return JSON.parse(value);
        } else {
          this.metrics.misses++;
          this.logger.debug(`Cache miss for key: ${key}`);
          return null;
        }
      } catch (error) {
        this.metrics.errors++;
        this.logger.error(`Redis get error (attempt ${attempt}):`, error);

        if (attempt === retryAttempts) {
          this.logger.error(
            `Failed to get from cache after ${retryAttempts} attempts`,
          );
          return null;
        }

        await this.delay(retryDelay * attempt);
      }
    }

    return null;
  }

  async set(
    key: string,
    value: any,
    options: CacheOptions = {},
  ): Promise<boolean> {
    const { ttl, retryAttempts = 3, retryDelay = 100 } = options;

    for (let attempt = 1; attempt <= retryAttempts; attempt++) {
      try {
        const serializedValue = JSON.stringify(value);

        if (ttl) {
          await this.redis.setex(key, ttl, serializedValue);
        } else {
          await this.redis.set(key, serializedValue);
        }

        this.logger.debug(`Cache set for key: ${key}`);
        return true;
      } catch (error) {
        this.metrics.errors++;
        this.logger.error(`Redis set error (attempt ${attempt}):`, error);

        if (attempt === retryAttempts) {
          this.logger.error(
            `Failed to set cache after ${retryAttempts} attempts`,
          );
          return false;
        }

        await this.delay(retryDelay * attempt);
      }
    }

    return false;
  }

  async getOrSet<T>(
    key: string,
    factory: () => Promise<T>,
    options: CacheOptions = {},
  ): Promise<T> {
    const cached = await this.get<T>(key, options);
    if (cached !== null) {
      return cached;
    }

    try {
      const value = await factory();
      await this.set(key, value, options);
      return value;
    } catch (error) {
      this.logger.debug(`Factory function failed for key ${key}:`, error);
      throw error;
    }
  }

  async del(key: string): Promise<boolean> {
    try {
      const result = await this.redis.del(key);
      this.logger.debug(`Cache deleted for key: ${key}`);
      return result > 0;
    } catch (error) {
      this.metrics.errors++;
      this.logger.error(`Redis del error:`, error);
      return false;
    }
  }

  async delPattern(pattern: string): Promise<number> {
    try {
      const keys = await this.redis.keys(pattern);
      if (keys.length > 0) {
        const result = await this.redis.del(...keys);
        this.logger.debug(
          `Cache deleted ${result} keys for pattern: ${pattern}`,
        );
        return result;
      }
      return 0;
    } catch (error) {
      this.metrics.errors++;
      this.logger.error(`Redis delPattern error:`, error);
      return 0;
    }
  }

  async exists(key: string): Promise<boolean> {
    try {
      const result = await this.redis.exists(key);
      return result === 1;
    } catch (error) {
      this.metrics.errors++;
      this.logger.error(`Redis exists error:`, error);
      return false;
    }
  }

  async flushDb(): Promise<boolean> {
    try {
      await this.redis.flushdb();
      this.logger.log('Redis database flushed');
      return true;
    } catch (error) {
      this.metrics.errors++;
      this.logger.error(`Redis flushDb error:`, error);
      return false;
    }
  }

  async ping(): Promise<boolean> {
    try {
      const result = await this.redis.ping();
      return result === 'PONG';
    } catch (error) {
      this.logger.error('Redis ping failed:', error);
      return false;
    }
  }

  getMetrics(): CacheMetrics {
    return { ...this.metrics };
  }

  resetMetrics(): void {
    this.metrics = { hits: 0, misses: 0, errors: 0 };
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

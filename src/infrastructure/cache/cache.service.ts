import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RedisService } from './redis/redis.service';
import {
  ICacheService,
  ICacheConfig,
} from '../../common/interfaces/cache.interface';
import { CACHE_CONSTANTS } from '../../common/constants/cache.constants';
import { cacheConfig } from '../../common/config/cache.config';

@Injectable()
export class CacheService implements ICacheService {
  private readonly logger = new Logger(CacheService.name);
  private readonly config: ICacheConfig;

  constructor(
    private readonly redisService: RedisService,
    private readonly configService: ConfigService,
  ) {
    this.config = {
      defaultTtl: cacheConfig.ttl.default,
      postTtl: cacheConfig.ttl.post,
      listTtl: cacheConfig.ttl.list,
      maxRetryAttempts: cacheConfig.retry.attempts,
      retryDelay: cacheConfig.retry.delay,
    };
  }

  async getPost(id: string): Promise<any | null> {
    const key = `${CACHE_CONSTANTS.KEYS.POST_PREFIX}${id}`;
    return this.redisService.get(key, {
      ttl: this.config.postTtl,
      retryAttempts: this.config.maxRetryAttempts,
      retryDelay: this.config.retryDelay,
    });
  }

  async setPost(id: string, data: any): Promise<boolean> {
    const key = `${CACHE_CONSTANTS.KEYS.POST_PREFIX}${id}`;
    return this.redisService.set(key, data, {
      ttl: this.config.postTtl,
      retryAttempts: this.config.maxRetryAttempts,
      retryDelay: this.config.retryDelay,
    });
  }

  async getPostsList(page: number, step: number): Promise<any | null> {
    const key = `${CACHE_CONSTANTS.KEYS.POSTS_LIST_PREFIX}${page}:${step}`;
    return this.redisService.get(key, {
      ttl: this.config.listTtl,
      retryAttempts: this.config.maxRetryAttempts,
      retryDelay: this.config.retryDelay,
    });
  }

  async setPostsList(page: number, step: number, data: any): Promise<boolean> {
    const key = `${CACHE_CONSTANTS.KEYS.POSTS_LIST_PREFIX}${page}:${step}`;
    return this.redisService.set(key, data, {
      ttl: this.config.listTtl,
      retryAttempts: this.config.maxRetryAttempts,
      retryDelay: this.config.retryDelay,
    });
  }

  async invalidatePost(id: string): Promise<void> {
    const key = `${CACHE_CONSTANTS.KEYS.POST_PREFIX}${id}`;
    const deleted = await this.redisService.del(key);

    if (deleted) {
      this.logger.debug(`Invalidated post cache for ID: ${id}`);
    }
  }

  async invalidatePostsList(): Promise<void> {
    const pattern = CACHE_CONSTANTS.PATTERNS.ALL_POSTS_LISTS;
    const deletedCount = await this.redisService.delPattern(pattern);

    if (deletedCount > 0) {
      this.logger.debug(`Invalidated ${deletedCount} posts list cache entries`);
    }
  }

  async invalidateAllPosts(): Promise<void> {
    const patterns = [
      CACHE_CONSTANTS.PATTERNS.ALL_POSTS,
      CACHE_CONSTANTS.PATTERNS.ALL_POSTS_LISTS,
    ];
    let totalDeleted = 0;

    for (const pattern of patterns) {
      const deletedCount = await this.redisService.delPattern(pattern);
      totalDeleted += deletedCount;
    }

    if (totalDeleted > 0) {
      this.logger.debug(`Invalidated ${totalDeleted} total cache entries`);
    }
  }

  async getOrSetPost<T>(id: string, factory: () => Promise<T>): Promise<T> {
    const key = `${CACHE_CONSTANTS.KEYS.POST_PREFIX}${id}`;

    return this.redisService.getOrSet(key, factory, {
      ttl: this.config.postTtl,
      retryAttempts: this.config.maxRetryAttempts,
      retryDelay: this.config.retryDelay,
    });
  }

  async getOrSetPostsList<T>(
    page: number,
    step: number,
    factory: () => Promise<T>,
  ): Promise<T> {
    const key = `${CACHE_CONSTANTS.KEYS.POSTS_LIST_PREFIX}${page}:${step}`;

    return this.redisService.getOrSet(key, factory, {
      ttl: this.config.listTtl,
      retryAttempts: this.config.maxRetryAttempts,
      retryDelay: this.config.retryDelay,
    });
  }
}

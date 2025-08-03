export const CACHE_CONSTANTS = {
  TTL: {
    DEFAULT: 3600,
    POST: 1800,
    LIST: 900,
  },

  RETRY: {
    DEFAULT_ATTEMPTS: 3,
    DEFAULT_DELAY: 100,
  },

  KEYS: {
    POST_PREFIX: 'post:',
    POSTS_LIST_PREFIX: 'posts:list:',
  },

  PATTERNS: {
    ALL_POSTS: 'post:*',
    ALL_POSTS_LISTS: 'posts:list:*',
  },

  LIMITS: {
    MAX_CACHE_SIZE: 10000,
    MAX_RETRY_ATTEMPTS: 5,
    MAX_RETRY_DELAY: 1000,
  },
} as const;

export const CACHE_ERROR_MESSAGES = {
  REDIS_CONNECTION_ERROR: 'Redis connection error',
  GET_ERROR: 'Redis get error',
  SET_ERROR: 'Redis set error',
  DEL_ERROR: 'Redis del error',
  DEL_PATTERN_ERROR: 'Redis delPattern error',
  EXISTS_ERROR: 'Redis exists error',
  FLUSH_ERROR: 'Redis flushDb error',
  PING_ERROR: 'Redis ping failed',
  FACTORY_ERROR: 'Factory function error',
  GET_KEYS_ERROR: 'Failed to get cache keys',
  GET_SIZE_ERROR: 'Failed to get cache size',
} as const;

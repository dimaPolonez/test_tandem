import { CACHE_CONSTANTS } from '../constants/cache.constants';

export const cacheConfig = {
  ttl: {
    default: parseInt(process.env.CACHE_TTL) || CACHE_CONSTANTS.TTL.DEFAULT,
    post: parseInt(process.env.CACHE_POST_TTL) || CACHE_CONSTANTS.TTL.POST,
    list: parseInt(process.env.CACHE_LIST_TTL) || CACHE_CONSTANTS.TTL.LIST,
  },

  retry: {
    attempts:
      parseInt(process.env.CACHE_RETRY_ATTEMPTS) ||
      CACHE_CONSTANTS.RETRY.DEFAULT_ATTEMPTS,
    delay:
      parseInt(process.env.CACHE_RETRY_DELAY) ||
      CACHE_CONSTANTS.RETRY.DEFAULT_DELAY,
  },

  monitoring: {
    enabled: process.env.CACHE_MONITORING_ENABLED === 'true',
    logLevel: process.env.CACHE_LOG_LEVEL || 'debug',
  },
};

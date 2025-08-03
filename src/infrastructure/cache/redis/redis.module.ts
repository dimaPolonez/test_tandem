import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { RedisService } from './redis.service';
import { CacheService } from '../cache.service';
import { redisConfig } from '../../../common/config/redis.config';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: 'REDIS_CLIENT',
      useFactory: (configService: ConfigService) => {
        return new Redis({
          host: configService.get('REDIS_HOST', redisConfig.host),
          port: configService.get('REDIS_PORT', redisConfig.port),
          password: configService.get('REDIS_PASSWORD', redisConfig.password),
          db: configService.get('REDIS_DB', redisConfig.db),
          lazyConnect: true,
        });
      },
      inject: [ConfigService],
    },
    RedisService,
    CacheService,
  ],
  exports: ['REDIS_CLIENT', RedisService, CacheService],
})
export class RedisModule {}

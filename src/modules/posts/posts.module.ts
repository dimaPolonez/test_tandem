import { Module } from '@nestjs/common';
import { PostsController } from './controllers/posts.controller';
import { PostsService } from './services/posts.service';
import { RedisModule } from '../../infrastructure/cache/redis/redis.module';
import { PaginationModule } from '../../common/pagination/pagination.module';
import { DatabaseModule } from '../../infrastructure/database/database.module';

@Module({
  imports: [DatabaseModule, RedisModule, PaginationModule],
  controllers: [PostsController],
  providers: [PostsService],
})
export class PostsModule {}

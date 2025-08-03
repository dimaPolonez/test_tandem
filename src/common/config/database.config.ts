import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Post } from '../../infrastructure/database/entities/post.entity';

export const databaseConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 5432,
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_DATABASE || 'blog_db',
  entities: [Post],
  synchronize: false,
  logging: false,
  migrations: [__dirname + '/../infrastructure/database/migrations/*.ts'],
  migrationsRun: false,
  migrationsTableName: 'migrations',
};

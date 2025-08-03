import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as request from 'supertest';
import { PostsModule } from './posts.module';
import { Post } from '../../infrastructure/database/entities/post.entity';

describe('PostsController (Integration)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
        }),
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [Post],
          synchronize: true,
        }),
        PostsModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication<NestFastifyApplication>(
      new FastifyAdapter(),
    );

    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
      }),
    );

    await app.init();
    await app.getHttpAdapter().getInstance().ready();
  });

  afterAll(async () => {
    if (app) {
      await app.close();
    }
  });

  describe('/posts (POST)', () => {
    it('should create a post', async () => {
      const createPostDto = {
        title: 'Test Post',
        description: 'Test Description',
      };

      const response = await request(app.getHttpServer())
        .post('/posts')
        .send(createPostDto)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.title).toBe(createPostDto.title);
      expect(response.body.description).toBe(createPostDto.description);
    });

    it('should validate required fields', async () => {
      const invalidPostDto = {
        title: '',
        description: '',
      };

      await request(app.getHttpServer())
        .post('/posts')
        .send(invalidPostDto)
        .expect(400);
    });

    it('should validate title length', async () => {
      const invalidPostDto = {
        title: 'a'.repeat(256),
        description: 'Test Description',
      };

      await request(app.getHttpServer())
        .post('/posts')
        .send(invalidPostDto)
        .expect(400);
    });
  });

  describe('/posts (GET)', () => {
    it('should return paginated posts', async () => {
      const response = await request(app.getHttpServer())
        .get('/posts?page=1&step=10')
        .expect(200);

      expect(response.body).toHaveProperty('items');
      expect(response.body).toHaveProperty('total');
      expect(response.body).toHaveProperty('page');
      expect(response.body).toHaveProperty('step');
      expect(Array.isArray(response.body.items)).toBe(true);
    });

    it('should use default pagination', async () => {
      const response = await request(app.getHttpServer())
        .get('/posts')
        .expect(200);

      expect(response.body.page).toBe(1);
      expect(response.body.step).toBe(10);
    });
  });

  describe('/posts/:id (GET)', () => {
    let createdPostId: string;

    beforeAll(async () => {
      const createPostDto = {
        title: 'Test Post for Get',
        description: 'Test Description for Get',
      };

      const response = await request(app.getHttpServer())
        .post('/posts')
        .send(createPostDto)
        .expect(201);

      createdPostId = response.body.id;
    });

    it('should return a post by id', async () => {
      const response = await request(app.getHttpServer())
        .get(`/posts/${createdPostId}`)
        .expect(200);

      expect(response.body.id).toBe(createdPostId);
      expect(response.body.title).toBe('Test Post for Get');
      expect(response.body.description).toBe('Test Description for Get');
    });

    it('should return 404 for non-existent post', async () => {
      const nonExistentId = '00000000-0000-0000-0000-000000000000';

      await request(app.getHttpServer())
        .get(`/posts/${nonExistentId}`)
        .expect(404);
    });
  });

  describe('/posts/:id (PATCH)', () => {
    let createdPostId: string;

    beforeAll(async () => {
      const createPostDto = {
        title: 'Test Post for Update',
        description: 'Test Description for Update',
      };

      const response = await request(app.getHttpServer())
        .post('/posts')
        .send(createPostDto)
        .expect(201);

      createdPostId = response.body.id;
    });

    it('should update a post', async () => {
      const updatePostDto = {
        title: 'Updated Post',
        description: 'Updated Description',
      };

      const response = await request(app.getHttpServer())
        .patch(`/posts/${createdPostId}`)
        .send(updatePostDto)
        .expect(200);

      expect(response.body.id).toBe(createdPostId);
      expect(response.body.title).toBe(updatePostDto.title);
      expect(response.body.description).toBe(updatePostDto.description);
    });

    it('should return 404 for non-existent post', async () => {
      const nonExistentId = '00000000-0000-0000-0000-000000000000';
      const updatePostDto = {
        title: 'Updated Post',
        description: 'Updated Description',
      };

      await request(app.getHttpServer())
        .patch(`/posts/${nonExistentId}`)
        .send(updatePostDto)
        .expect(404);
    });
  });

  describe('/posts/:id (DELETE)', () => {
    let createdPostId: string;

    beforeAll(async () => {
      const createPostDto = {
        title: 'Test Post for Delete',
        description: 'Test Description for Delete',
      };

      const response = await request(app.getHttpServer())
        .post('/posts')
        .send(createPostDto)
        .expect(201);

      createdPostId = response.body.id;
    });

    it('should delete a post', async () => {
      await request(app.getHttpServer())
        .delete(`/posts/${createdPostId}`)
        .expect(200);

      await request(app.getHttpServer())
        .get(`/posts/${createdPostId}`)
        .expect(404);
    });

    it('should return 404 for non-existent post', async () => {
      const nonExistentId = '00000000-0000-0000-0000-000000000000';

      await request(app.getHttpServer())
        .delete(`/posts/${nonExistentId}`)
        .expect(404);
    });
  });
});

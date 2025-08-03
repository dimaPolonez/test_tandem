import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { PostsService } from './posts.service';
import { Post } from '../../../infrastructure/database/entities/post.entity';
import { PostRepository } from '../../../infrastructure/database/repositories/post.repository';
import { CacheService } from '../../../infrastructure/cache/cache.service';
import { PaginationService } from '../../../common/pagination/pagination.service';
import { CreatePostDto } from '../dto/create-post.dto';
import { UpdatePostDto } from '../dto/update-post.dto';
import { PaginationDto } from '../../../common/pagination/pagination.dto';

describe('PostsService', () => {
  let service: PostsService;
  let postRepository: PostRepository;
  let cacheService: CacheService;
  let configService: ConfigService;
  let paginationService: PaginationService;

  const mockPost: Post = {
    id: 'test-id',
    title: 'Test Post',
    description: 'Test Description',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockCreatePostDto: CreatePostDto = {
    title: 'Test Post',
    description: 'Test Description',
  };

  const mockUpdatePostDto: UpdatePostDto = {
    title: 'Updated Post',
    description: 'Updated Description',
  };

  const mockPaginationDto: PaginationDto = {
    page: 1,
    step: 10,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostsService,
        {
          provide: PostRepository,
          useValue: {
            create: jest.fn(),
            findById: jest.fn(),
            findWithPagination: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
        {
          provide: CacheService,
          useValue: {
            getOrSetPost: jest.fn(),
            getOrSetPostsList: jest.fn(),
            invalidatePost: jest.fn(),
            invalidatePostsList: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue(3600),
          },
        },
        {
          provide: PaginationService,
          useValue: {
            paginate: jest.fn(),
            paginateRepository: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<PostsService>(PostsService);
    postRepository = module.get<PostRepository>(PostRepository);
    cacheService = module.get<CacheService>(CacheService);
    configService = module.get<ConfigService>(ConfigService);
    paginationService = module.get<PaginationService>(PaginationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a post successfully', async () => {
      jest.spyOn(postRepository, 'create').mockResolvedValue(mockPost);
      jest.spyOn(cacheService, 'invalidatePostsList').mockResolvedValue();

      const result = await service.create(mockCreatePostDto);

      expect(postRepository.create).toHaveBeenCalledWith(mockCreatePostDto);
      expect(cacheService.invalidatePostsList).toHaveBeenCalled();
      expect(result).toEqual({
        id: mockPost.id,
        title: mockPost.title,
        description: mockPost.description,
        createdAt: mockPost.createdAt,
        updatedAt: mockPost.updatedAt,
      });
    });
  });

  describe('findAll', () => {
    it('should return cached posts if available', async () => {
      const cachedResult = {
        items: [mockPost],
        total: 1,
        page: 1,
        step: 10,
      };

      jest
        .spyOn(cacheService, 'getOrSetPostsList')
        .mockResolvedValue(cachedResult);

      const result = await service.findAll(mockPaginationDto);

      expect(cacheService.getOrSetPostsList).toHaveBeenCalledWith(
        1,
        10,
        expect.any(Function),
      );
      expect(result).toEqual(cachedResult);
    });

    it('should fetch from database and cache if not cached', async () => {
      const dbResult = {
        items: [mockPost],
        total: 1,
        page: 1,
        step: 10,
      };

      jest.spyOn(cacheService, 'getOrSetPostsList').mockResolvedValue(dbResult);
      jest
        .spyOn(postRepository, 'findWithPagination')
        .mockResolvedValue([[mockPost], 1]);

      const result = await service.findAll(mockPaginationDto);

      expect(cacheService.getOrSetPostsList).toHaveBeenCalledWith(
        1,
        10,
        expect.any(Function),
      );
      expect(result).toEqual(dbResult);
    });
  });

  describe('findOne', () => {
    it('should return cached post if available', async () => {
      const cachedPost = {
        id: mockPost.id,
        title: mockPost.title,
        description: mockPost.description,
        createdAt: mockPost.createdAt,
        updatedAt: mockPost.updatedAt,
      };

      jest.spyOn(cacheService, 'getOrSetPost').mockResolvedValue(cachedPost);

      const result = await service.findOne('test-id');

      expect(cacheService.getOrSetPost).toHaveBeenCalledWith(
        'test-id',
        expect.any(Function),
      );
      expect(result).toEqual(cachedPost);
    });

    it('should fetch from database and cache if not cached', async () => {
      const dbPost = {
        id: mockPost.id,
        title: mockPost.title,
        description: mockPost.description,
        createdAt: mockPost.createdAt,
        updatedAt: mockPost.updatedAt,
      };

      jest.spyOn(cacheService, 'getOrSetPost').mockResolvedValue(dbPost);
      jest.spyOn(postRepository, 'findById').mockResolvedValue(mockPost);

      const result = await service.findOne('test-id');

      expect(cacheService.getOrSetPost).toHaveBeenCalledWith(
        'test-id',
        expect.any(Function),
      );
      expect(result).toEqual(dbPost);
    });

    it('should throw NotFoundException if post not found', async () => {
      jest
        .spyOn(cacheService, 'getOrSetPost')
        .mockImplementation(async (id, factory) => {
          const post = await factory();
          if (!post) {
            throw new Error('Post not found');
          }
          return post;
        });
      jest.spyOn(postRepository, 'findById').mockResolvedValue(null);

      await expect(service.findOne('non-existent-id')).rejects.toThrow();
    });
  });

  describe('update', () => {
    it('should update post successfully', async () => {
      const updatedPost = { ...mockPost, title: 'Updated Post' };
      jest.spyOn(postRepository, 'update').mockResolvedValue(updatedPost);
      jest.spyOn(cacheService, 'invalidatePost').mockResolvedValue();
      jest.spyOn(cacheService, 'invalidatePostsList').mockResolvedValue();

      const result = await service.update('test-id', mockUpdatePostDto);

      expect(postRepository.update).toHaveBeenCalledWith(
        'test-id',
        mockUpdatePostDto,
      );
      expect(cacheService.invalidatePost).toHaveBeenCalledWith('test-id');
      expect(cacheService.invalidatePostsList).toHaveBeenCalled();
      expect(result).toEqual({
        id: updatedPost.id,
        title: updatedPost.title,
        description: updatedPost.description,
        createdAt: updatedPost.createdAt,
        updatedAt: updatedPost.updatedAt,
      });
    });
  });

  describe('remove', () => {
    it('should remove post successfully', async () => {
      jest.spyOn(postRepository, 'delete').mockResolvedValue(true);
      jest.spyOn(cacheService, 'invalidatePost').mockResolvedValue();
      jest.spyOn(cacheService, 'invalidatePostsList').mockResolvedValue();

      await service.remove('test-id');

      expect(postRepository.delete).toHaveBeenCalledWith('test-id');
      expect(cacheService.invalidatePost).toHaveBeenCalledWith('test-id');
      expect(cacheService.invalidatePostsList).toHaveBeenCalled();
    });
  });
});

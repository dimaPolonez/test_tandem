import { Test, TestingModule } from '@nestjs/testing';
import { PaginationDto } from 'src/common/pagination/pagination.dto';
import { CreatePostDto } from '../dto/create-post.dto';
import { UpdatePostDto } from '../dto/update-post.dto';
import { PostsService } from '../services/posts.service';
import { PostsController } from './posts.controller';

describe('PostsController', () => {
  let controller: PostsController;
  let service: PostsService;

  const mockPost = {
    id: '550e8400-e29b-41d4-a716-446655440000',
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
  };

  const mockPaginationDto: PaginationDto = {
    page: 1,
    step: 10,
  };

  const mockPostsResponse = {
    items: [mockPost],
    total: 1,
    page: 1,
    step: 10,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostsController],
      providers: [
        {
          provide: PostsService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<PostsController>(PostsController);
    service = module.get<PostsService>(PostsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a post', async () => {
      jest.spyOn(service, 'create').mockResolvedValue(mockPost);

      const result = await controller.create(mockCreatePostDto);

      expect(service.create).toHaveBeenCalledWith(mockCreatePostDto);
      expect(result).toEqual(mockPost);
    });
  });

  describe('findAll', () => {
    it('should return paginated posts', async () => {
      jest.spyOn(service, 'findAll').mockResolvedValue(mockPostsResponse);

      const result = await controller.findAll(mockPaginationDto);

      expect(service.findAll).toHaveBeenCalledWith(mockPaginationDto);
      expect(result).toEqual(mockPostsResponse);
    });

    it('should use default pagination if not provided', async () => {
      jest.spyOn(service, 'findAll').mockResolvedValue(mockPostsResponse);

      const result = await controller.findAll({});

      expect(service.findAll).toHaveBeenCalledWith({});
      expect(result).toEqual(mockPostsResponse);
    });
  });

  describe('findOne', () => {
    it('should return a post by id', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(mockPost);

      const result = await controller.findOne(
        '550e8400-e29b-41d4-a716-446655440000',
      );

      expect(service.findOne).toHaveBeenCalledWith(
        '550e8400-e29b-41d4-a716-446655440000',
      );
      expect(result).toEqual(mockPost);
    });
  });

  describe('update', () => {
    it('should update a post', async () => {
      const updatedPost = { ...mockPost, title: 'Updated Post' };
      jest.spyOn(service, 'update').mockResolvedValue(updatedPost);

      const result = await controller.update(
        '550e8400-e29b-41d4-a716-446655440000',
        mockUpdatePostDto,
      );

      expect(service.update).toHaveBeenCalledWith(
        '550e8400-e29b-41d4-a716-446655440000',
        mockUpdatePostDto,
      );
      expect(result).toEqual(updatedPost);
    });
  });

  describe('remove', () => {
    it('should remove a post', async () => {
      jest.spyOn(service, 'remove').mockResolvedValue();

      await controller.remove('550e8400-e29b-41d4-a716-446655440000');

      expect(service.remove).toHaveBeenCalledWith(
        '550e8400-e29b-41d4-a716-446655440000',
      );
    });
  });
});

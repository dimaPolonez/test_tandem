import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PaginationDto } from 'src/common/pagination/pagination.dto';
import { PaginationService } from 'src/common/pagination/pagination.service';
import { CacheService } from '../../../infrastructure/cache/cache.service';
import { CreatePostDto } from '../dto/create-post.dto';
import { PostResponseDto } from '../dto/post-response.dto';
import { PostsResponseDto } from '../dto/posts-response.dto';
import { UpdatePostDto } from '../dto/update-post.dto';
import { Post } from '../../../infrastructure/database/entities/post.entity';
import { PostRepository } from '../../../infrastructure/database/repositories/post.repository';
import { IPostsService } from '../../../common/interfaces/service.interface';
import { VALIDATION_CONSTANTS } from '../../../common/constants/validation.constants';

@Injectable()
export class PostsService implements IPostsService {
  private readonly logger = new Logger(PostsService.name);

  constructor(
    private readonly postRepository: PostRepository,
    private readonly cacheService: CacheService,
    private readonly configService: ConfigService,
    private readonly paginationService: PaginationService,
  ) {}

  async create(createPostDto: CreatePostDto): Promise<PostResponseDto> {
    this.logger.log(`Creating new post with title: ${createPostDto.title}`);

    const savedPost = await this.postRepository.create(createPostDto);
    const responseDto = this.mapToResponseDto(savedPost);

    await this.cacheService.invalidatePostsList();

    this.logger.log(`Post created successfully with ID: ${savedPost.id}`);
    return responseDto;
  }

  async findAll(paginationDto: PaginationDto): Promise<PostsResponseDto> {
    const { page = 1, step = 10 } = paginationDto;

    this.logger.debug(`Fetching posts page ${page} with step ${step}`);

    return this.cacheService.getOrSetPostsList(page, step, async () => {
      const [posts, total] = await this.postRepository.findWithPagination(
        page,
        step,
        { createdAt: 'DESC' },
      );

      const postsResponse = {
        items: posts.map(post => this.mapToResponseDto(post)),
        total,
        page,
        step,
      };

      this.logger.debug(`Fetched ${posts.length} posts from database`);
      return postsResponse;
    });
  }

  async findOne(id: string): Promise<PostResponseDto> {
    this.logger.debug(`Fetching post with ID: ${id}`);

    return this.cacheService.getOrSetPost(id, async () => {
      const post = await this.postRepository.findById(id);
      if (!post) {
        throw new NotFoundException(
          VALIDATION_CONSTANTS.ERROR_MESSAGES.POST_NOT_FOUND,
        );
      }

      const responseDto = this.mapToResponseDto(post);
      this.logger.debug(`Fetched post from database: ${id}`);
      return responseDto;
    });
  }

  async update(
    id: string,
    updatePostDto: UpdatePostDto,
  ): Promise<PostResponseDto> {
    this.logger.log(`Updating post with ID: ${id}`);

    const updatedPost = await this.postRepository.update(id, updatePostDto);
    if (!updatedPost) {
      throw new NotFoundException(
        VALIDATION_CONSTANTS.ERROR_MESSAGES.POST_NOT_FOUND,
      );
    }

    const responseDto = this.mapToResponseDto(updatedPost);

    await this.cacheService.invalidatePost(id);

    await this.cacheService.invalidatePostsList();

    this.logger.log(`Post updated successfully: ${id}`);
    return responseDto;
  }

  async remove(id: string): Promise<void> {
    this.logger.log(`Deleting post with ID: ${id}`);

    const deleted = await this.postRepository.delete(id);
    if (!deleted) {
      throw new NotFoundException(
        VALIDATION_CONSTANTS.ERROR_MESSAGES.POST_NOT_FOUND,
      );
    }

    await this.cacheService.invalidatePost(id);

    await this.cacheService.invalidatePostsList();

    this.logger.log(`Post deleted successfully: ${id}`);
  }

  private mapToResponseDto(post: Post): PostResponseDto {
    return {
      id: post.id,
      title: post.title,
      description: post.description,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
    };
  }
}

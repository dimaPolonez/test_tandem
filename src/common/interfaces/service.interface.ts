import { CreatePostDto } from '../../modules/posts/dto/create-post.dto';
import { UpdatePostDto } from '../../modules/posts/dto/update-post.dto';
import { PostResponseDto } from '../../modules/posts/dto/post-response.dto';
import { PostsResponseDto } from '../../modules/posts/dto/posts-response.dto';
import { PaginationDto } from '../pagination/pagination.dto';

export interface IPostsService {
  create(createPostDto: CreatePostDto): Promise<PostResponseDto>;
  findAll(paginationDto: PaginationDto): Promise<PostsResponseDto>;
  findOne(id: string): Promise<PostResponseDto>;
  update(id: string, updatePostDto: UpdatePostDto): Promise<PostResponseDto>;
  remove(id: string): Promise<void>;
}

export interface IPaginationService {
  paginate<T>(queryBuilder: any, paginationDto: PaginationDto): Promise<any>;
  paginateRepository<T>(
    repository: any,
    paginationDto: PaginationDto,
    options?: {
      order?: any;
      where?: any;
    },
  ): Promise<any>;
}

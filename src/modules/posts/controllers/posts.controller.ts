import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { PaginationDto } from 'src/common/pagination/pagination.dto';
import { CreatePostDto } from '../dto/create-post.dto';
import { PostResponseDto } from '../dto/post-response.dto';
import { PostsResponseDto } from '../dto/posts-response.dto';
import { UpdatePostDto } from '../dto/update-post.dto';
import { Post as PostEntity } from '../../../infrastructure/database/entities/post.entity';
import { PostsService } from '../services/posts.service';
import { UuidValidationPipe } from 'src/common/pipes/uuid-validation.pipe';

@ApiTags('Посты')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @ApiOperation({ summary: 'Создать пост' })
  @ApiResponse({
    status: 201,
    description: 'Пост создан',
    type: PostResponseDto,
  })
  create(@Body() createPostDto: CreatePostDto): Promise<PostResponseDto> {
    return this.postsService.create(createPostDto);
  }

  @Get()
  @ApiOperation({ summary: 'Получить страницу постов' })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Номер страницы',
  })
  @ApiQuery({
    name: 'step',
    required: false,
    type: Number,
    description: 'Количество элементов на странице',
  })
  @ApiResponse({
    status: 200,
    description: 'Список постов',
    type: PostsResponseDto,
  })
  findAll(@Query() paginationDto: PaginationDto): Promise<PostsResponseDto> {
    return this.postsService.findAll(paginationDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить пост по ID' })
  @ApiParam({ name: 'id', description: 'ID поста' })
  @ApiResponse({
    status: 200,
    description: 'Пост найден',
    type: PostResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Пост не найден' })
  findOne(
    @Param('id', UuidValidationPipe) id: string,
  ): Promise<PostResponseDto> {
    return this.postsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Редактировать пост' })
  @ApiParam({ name: 'id', description: 'ID поста' })
  @ApiResponse({
    status: 200,
    description: 'Пост обновлен',
    type: PostResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Пост не найден' })
  update(
    @Param('id', UuidValidationPipe) id: string,
    @Body() updatePostDto: UpdatePostDto,
  ): Promise<PostResponseDto> {
    return this.postsService.update(id, updatePostDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Удалить пост' })
  @ApiParam({ name: 'id', description: 'ID поста' })
  @ApiResponse({ status: 200, description: 'Пост удален' })
  @ApiResponse({ status: 404, description: 'Пост не найден' })
  remove(@Param('id', UuidValidationPipe) id: string): Promise<void> {
    return this.postsService.remove(id);
  }
}

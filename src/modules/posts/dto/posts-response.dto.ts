import { ApiProperty } from '@nestjs/swagger';
import { PaginationResponseDto } from 'src/common/pagination/pagination-response.dto';
import { PostResponseDto } from './post-response.dto';

export class PostsResponseDto extends PaginationResponseDto<PostResponseDto> {
  @ApiProperty({ description: 'Список постов', type: [PostResponseDto] })
  override items: PostResponseDto[];
}

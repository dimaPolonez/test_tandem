import { ApiProperty } from '@nestjs/swagger';

export class PostResponseDto {
  @ApiProperty({ description: 'ID поста' })
  id: string;

  @ApiProperty({ description: 'Заголовок поста' })
  title: string;

  @ApiProperty({ description: 'Описание поста' })
  description: string;

  @ApiProperty({ description: 'Дата создания' })
  createdAt: Date;

  @ApiProperty({ description: 'Дата обновления' })
  updatedAt: Date;
}

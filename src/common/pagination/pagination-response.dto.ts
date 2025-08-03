import { ApiProperty } from '@nestjs/swagger';

export class PaginationResponseDto<T> {
  @ApiProperty({ description: 'Список элементов' })
  items: T[];

  @ApiProperty({ description: 'Общее количество элементов' })
  total: number;

  @ApiProperty({ description: 'Текущая страница' })
  page: number;

  @ApiProperty({ description: 'Количество элементов на странице' })
  step: number;
}

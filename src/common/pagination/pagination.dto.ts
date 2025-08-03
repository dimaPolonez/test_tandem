import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { PAGINATION_CONSTANTS } from '../constants/pagination.constants';

export class PaginationDto {
  @ApiProperty({
    description: 'Номер страницы',
    default: PAGINATION_CONSTANTS.DEFAULTS.PAGE,
    required: false,
    minimum: PAGINATION_CONSTANTS.LIMITS.MIN_PAGE,
  })
  @IsNumber()
  @IsOptional()
  @Min(PAGINATION_CONSTANTS.LIMITS.MIN_PAGE, {
    message: PAGINATION_CONSTANTS.ERROR_MESSAGES.INVALID_PAGE,
  })
  @Type(() => Number)
  page?: number = PAGINATION_CONSTANTS.DEFAULTS.PAGE;

  @ApiProperty({
    description: 'Количество элементов на странице',
    default: PAGINATION_CONSTANTS.DEFAULTS.STEP,
    required: false,
    minimum: PAGINATION_CONSTANTS.LIMITS.MIN_STEP,
    maximum: PAGINATION_CONSTANTS.LIMITS.MAX_STEP,
  })
  @IsNumber()
  @IsOptional()
  @Min(PAGINATION_CONSTANTS.LIMITS.MIN_STEP, {
    message: PAGINATION_CONSTANTS.ERROR_MESSAGES.INVALID_STEP,
  })
  @Max(PAGINATION_CONSTANTS.LIMITS.MAX_STEP, {
    message: PAGINATION_CONSTANTS.ERROR_MESSAGES.INVALID_STEP,
  })
  @Type(() => Number)
  step?: number = PAGINATION_CONSTANTS.DEFAULTS.STEP;
}

import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, MaxLength } from 'class-validator';
import { VALIDATION_CONSTANTS } from '../../../common/constants/validation.constants';

export class UpdatePostDto {
  @ApiProperty({ description: 'Заголовок поста', required: false })
  @IsOptional()
  @IsString({ message: VALIDATION_CONSTANTS.ERROR_MESSAGES.TITLE_REQUIRED })
  @MaxLength(VALIDATION_CONSTANTS.LIMITS.TITLE_MAX_LENGTH, {
    message: VALIDATION_CONSTANTS.ERROR_MESSAGES.TITLE_MAX_LENGTH,
  })
  title?: string;

  @ApiProperty({ description: 'Описание поста', required: false })
  @IsOptional()
  @IsString({
    message: VALIDATION_CONSTANTS.ERROR_MESSAGES.DESCRIPTION_REQUIRED,
  })
  @MaxLength(VALIDATION_CONSTANTS.LIMITS.DESCRIPTION_MAX_LENGTH, {
    message: VALIDATION_CONSTANTS.ERROR_MESSAGES.DESCRIPTION_MAX_LENGTH,
  })
  description?: string;
}

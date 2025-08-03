import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MaxLength } from 'class-validator';
import { VALIDATION_CONSTANTS } from '../../../common/constants/validation.constants';

export class CreatePostDto {
  @ApiProperty({ description: 'Заголовок поста' })
  @IsString({ message: VALIDATION_CONSTANTS.ERROR_MESSAGES.TITLE_REQUIRED })
  @IsNotEmpty({ message: VALIDATION_CONSTANTS.ERROR_MESSAGES.TITLE_REQUIRED })
  @MaxLength(VALIDATION_CONSTANTS.LIMITS.TITLE_MAX_LENGTH, {
    message: VALIDATION_CONSTANTS.ERROR_MESSAGES.TITLE_MAX_LENGTH,
  })
  title: string;

  @ApiProperty({ description: 'Описание поста' })
  @IsString({
    message: VALIDATION_CONSTANTS.ERROR_MESSAGES.DESCRIPTION_REQUIRED,
  })
  @IsNotEmpty({
    message: VALIDATION_CONSTANTS.ERROR_MESSAGES.DESCRIPTION_REQUIRED,
  })
  @MaxLength(VALIDATION_CONSTANTS.LIMITS.DESCRIPTION_MAX_LENGTH, {
    message: VALIDATION_CONSTANTS.ERROR_MESSAGES.DESCRIPTION_MAX_LENGTH,
  })
  description: string;
}

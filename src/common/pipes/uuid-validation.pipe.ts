import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { isUUID } from 'class-validator';
import { VALIDATION_CONSTANTS } from '../constants/validation.constants';

@Injectable()
export class UuidValidationPipe implements PipeTransform {
  transform(value: string): string {
    if (!isUUID(value)) {
      throw new BadRequestException(
        VALIDATION_CONSTANTS.ERROR_MESSAGES.INVALID_UUID,
      );
    }
    return value;
  }
}

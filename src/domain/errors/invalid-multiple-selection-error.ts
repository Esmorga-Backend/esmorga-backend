import { HttpStatus } from '@nestjs/common';
import { ApiError } from './api-error';

export class InvalidMultipleSelectionApiError extends ApiError {
  constructor() {
    super(
      HttpStatus.UNPROCESSABLE_ENTITY,
      'unprocesableContentError',
      'multiple selection is not allowed',
      'too many options provided',
    );
  }
}

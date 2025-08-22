import { HttpStatus } from '@nestjs/common';
import { ApiError } from './api-error';

export class InvalidSamePasswordApiError extends ApiError {
  constructor() {
    super(
      HttpStatus.BAD_REQUEST,
      'badRequestError',
      'invalid password',
      'currentPassword and newPassword cannot be the same',
    );
  }
}

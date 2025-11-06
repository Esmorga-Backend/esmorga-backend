import { HttpStatus } from '@nestjs/common';
import { ApiError } from './api-error';

export class NotFoundApiError extends ApiError {
  constructor(field: string) {
    super(
      HttpStatus.NOT_FOUND,
      'notFoundError',
      'not found',
      `${field} not found`,
    );
  }
}

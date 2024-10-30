import { HttpStatus } from '@nestjs/common';
import { ApiError } from './api-error';

export class NotFoundEventIdApiError extends ApiError {
  constructor() {
    super(
      HttpStatus.NOT_FOUND,
      'notFoundError',
      'not found',
      'eventId not found',
    );
  }
}

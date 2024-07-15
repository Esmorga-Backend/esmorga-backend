import { HttpStatus } from '@nestjs/common';
import { ApiError } from './api-error';

export class InvalidEventIdApiError extends ApiError {
  constructor() {
    super(
      HttpStatus.BAD_REQUEST,
      'badRequestError',
      'eventId',
      'eventId invalid',
    );
  }
}

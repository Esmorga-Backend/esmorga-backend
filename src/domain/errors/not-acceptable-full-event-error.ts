import { HttpStatus } from '@nestjs/common';
import { ApiError } from './api-error';

export class NotAcceptableFullEventApiError extends ApiError {
  constructor() {
    super(
      HttpStatus.UNPROCESSABLE_ENTITY,
      'unprocesableContentError',
      'maximum capacity reached',
      'event cannot accept more attendees',
    );
  }
}

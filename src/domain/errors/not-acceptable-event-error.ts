import { HttpStatus } from '@nestjs/common';
import { ApiError } from './api-error';

export class NotAcceptableEventApiError extends ApiError {
  constructor() {
    super(
      HttpStatus.NOT_ACCEPTABLE,
      'notAcceptable',
      'not Acceptable',
      'cannot join past events',
    );
  }
}

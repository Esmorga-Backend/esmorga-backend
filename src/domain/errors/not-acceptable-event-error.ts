import { HttpStatus } from '@nestjs/common';
import { ApiError } from './api-error';

export class NotAccepteableEventApiError extends ApiError {
  constructor() {
    super(
      HttpStatus.NOT_ACCEPTABLE,
      'notAcceptable',
      'not Acceptable',
      'cannot join past events',
    );
  }
}

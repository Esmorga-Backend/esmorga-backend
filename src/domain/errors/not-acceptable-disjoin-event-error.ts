import { HttpStatus } from '@nestjs/common';
import { ApiError } from './api-error';

export class NotAcceptableDisjoinEventApiError extends ApiError {
  constructor() {
    super(
      HttpStatus.NOT_ACCEPTABLE,
      'notAcceptable',
      'not Acceptable',
      'cannot disjoin past events',
    );
  }
}

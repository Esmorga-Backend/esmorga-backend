import { HttpStatus } from '@nestjs/common';
import { ApiError } from './api-error';

export class InvalidTokenApiError extends ApiError {
  constructor() {
    super(
      HttpStatus.BAD_REQUEST,
      'unauthorizedRequestError',
      'not authorized',
      'token invalid',
    );
  }
}

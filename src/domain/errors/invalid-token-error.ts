import { HttpStatus } from '@nestjs/common';
import { ApiError } from './api-error';

export class InvalidTokenApiError extends ApiError {
  constructor() {
    super(
      HttpStatus.UNAUTHORIZED,
      'unauthorizedRequestError',
      'not authorized',
      'token invalid',
    );
  }
}

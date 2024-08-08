import { HttpStatus } from '@nestjs/common';
import { ApiError } from './api-error';

export class InvalidCredentialsRefreshApiError extends ApiError {
  constructor() {
    super(
      HttpStatus.UNAUTHORIZED,
      'unauthorizedRequestError',
      'unauthorized',
      'unauthorized',
    );
  }
}

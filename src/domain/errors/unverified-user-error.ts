import { HttpStatus } from '@nestjs/common';
import { ApiError } from './api-error';

export class UnverifiedUserApiError extends ApiError {
  constructor() {
    super(
      HttpStatus.FORBIDDEN,
      'unverifiedUserError',
      'user is unverified',
      'user is unverified',
    );
  }
}

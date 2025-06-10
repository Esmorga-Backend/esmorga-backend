import { HttpStatus } from '@nestjs/common';
import { ApiError } from './api-error';

export class InvalidEmptyTokenApiError extends ApiError {
  constructor() {
    super(
      HttpStatus.BAD_REQUEST,
      'badRequestError',
      'Authorization',
      'Authorization should not be empty',
    );
  }
}

import { HttpStatus } from '@nestjs/common';
import { ApiError } from './api-error';

export class InvalidNullFieldApiError extends ApiError {
  constructor(field: string) {
    super(
      HttpStatus.BAD_REQUEST,
      'badRequestError',
      'some inputs are missing',
      `${field} should not be empty`,
    );
  }
}

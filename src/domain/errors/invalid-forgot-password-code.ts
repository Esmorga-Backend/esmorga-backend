import { HttpStatus } from '@nestjs/common';
import { ApiError } from './api-error';

export class InvalidForgotPasswordCodeApiError extends ApiError {
  constructor() {
    super(
      HttpStatus.BAD_REQUEST,
      'badRequestError',
      'forgotPasswordCode',
      'forgotPasswordCode is invalid',
    );
  }
}

import { HttpStatus } from '@nestjs/common';
import { ApiError } from './api-error';

export class InvalidVerificationCodeApiError extends ApiError {
  constructor() {
    super(
      HttpStatus.BAD_REQUEST,
      'badRequestError',
      'verificationCode',
      'verificationCode invalid',
    );
  }
}

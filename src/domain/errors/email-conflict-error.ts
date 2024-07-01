import { HttpStatus } from '@nestjs/common';
import { ApiError } from './api-error';

export class EmailConflictApiError extends ApiError {
  constructor() {
    super(
      HttpStatus.CONFLICT,
      'userAlreadyRegistered',
      'inputs are invalid',
      'user already registered',
    );
  }
}

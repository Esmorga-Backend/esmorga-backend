import { HttpStatus } from '@nestjs/common';
import { ApiError } from './api-error';

export class InvalidPasswordError extends ApiError {
  constructor() {
    super(
      HttpStatus.UNPROCESSABLE_ENTITY,
      'unprocesableContentError',
      'invalid credentials',
      'password is invalid',
    );
  }
}

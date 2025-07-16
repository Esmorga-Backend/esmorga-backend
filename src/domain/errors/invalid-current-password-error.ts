import { HttpStatus } from '@nestjs/common';
import { ApiError } from './api-error';

export class InvalidCurrentPasswordError extends ApiError {
  constructor() {
    super(
      HttpStatus.UNPROCESSABLE_ENTITY,
      'unprocesableContentError',
      'invalid credentials',
      'unable to change password',
    );
  }
}

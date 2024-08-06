import { HttpStatus } from '@nestjs/common';
import { ApiError } from './api-error';

export class InvalidCredentialsLoginApiError extends ApiError {
  constructor() {
    super(
      HttpStatus.UNAUTHORIZED,
      'unauthorizedRequestError',
      'inputs are invalid',
      'email password combination is not correct',
    );
  }
}

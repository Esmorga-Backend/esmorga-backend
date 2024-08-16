import { HttpStatus } from '@nestjs/common';
import { ApiError } from './api-error';

export class NotAdminAccountApiError extends ApiError {
  constructor() {
    super(
      HttpStatus.FORBIDDEN,
      'unauthorizedRequestError',
      'not authorized',
      'not enough privileges',
    );
  }
}

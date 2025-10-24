import { HttpStatus } from '@nestjs/common';
import { ApiError } from './api-error';

export class InvalidJoinDeadlineApiError extends ApiError {
  constructor() {
    super(
      HttpStatus.BAD_REQUEST,
      'badRequestError',
      'joinDeadline',
      'joinDeadline cannot be after eventDate',
    );
  }
}

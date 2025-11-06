import { HttpStatus } from '@nestjs/common';
import { ApiError } from './api-error';

export class VoteClosedApiError extends ApiError {
  constructor() {
    super(
      HttpStatus.CONFLICT,
      'conflictError',
      'voting period has ended',
      'poll voting deadline passed',
    );
  }
}

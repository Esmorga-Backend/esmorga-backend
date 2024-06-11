import { HttpException, HttpStatus } from '@nestjs/common';

export class DataBaseInternalError extends HttpException {
  constructor() {
    super(
      {
        title: 'internalServerError',
        detail: 'unexpected error',
        message: 'Internal server error occurred in database operation',
      },
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}

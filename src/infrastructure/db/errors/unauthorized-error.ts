import { HttpException, HttpStatus } from '@nestjs/common';

export class DataBaseUnauthorizedError extends HttpException {
  constructor() {
    super({}, HttpStatus.UNAUTHORIZED);
  }
}

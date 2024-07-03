import { HttpException, HttpStatus } from '@nestjs/common';

export class DataBaseConflictError extends HttpException {
  constructor() {
    super({}, HttpStatus.CONFLICT);
  }
}

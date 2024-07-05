import { HttpException, HttpStatus } from '@nestjs/common';

export class DataBaseNotFoundError extends HttpException {
  constructor() {
    super({}, HttpStatus.NOT_FOUND);
  }
}

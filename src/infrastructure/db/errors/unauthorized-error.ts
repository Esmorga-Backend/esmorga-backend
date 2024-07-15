import { HttpException, HttpStatus } from '@nestjs/common';

export class DataBaseUnathorizedError extends HttpException {
  constructor() {
    super({}, HttpStatus.UNAUTHORIZED);
  }
}

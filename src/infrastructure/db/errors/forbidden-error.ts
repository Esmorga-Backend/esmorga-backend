import { HttpException, HttpStatus } from '@nestjs/common';

export class DataBaseForbiddenError extends HttpException {
  constructor() {
    super({}, HttpStatus.FORBIDDEN);
  }
}

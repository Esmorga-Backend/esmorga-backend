import { HttpException, HttpStatus } from '@nestjs/common';

export class DataBaseBadRequestError extends HttpException {
  constructor() {
    super({}, HttpStatus.BAD_REQUEST);
  }
}

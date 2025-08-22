import { HttpException, HttpStatus } from '@nestjs/common';

export class DataBaseUnprocesableContentError extends HttpException {
  constructor() {
    super({}, HttpStatus.UNPROCESSABLE_ENTITY);
  }
}

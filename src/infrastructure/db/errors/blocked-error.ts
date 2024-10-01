import { HttpException } from '@nestjs/common';

export class DataBaseBlockedError extends HttpException {
  constructor() {
    super({}, 423);
  }
}
